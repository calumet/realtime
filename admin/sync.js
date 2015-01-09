/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Admin | Sync
 * Romel Pérez, prhone.blogspot.com
 * 2015
 **/

// Proceso de sincronización de datos de "diamante" a "rubi".

var _ = require('../node_modules/underscore');
var async = require('../node_modules/async');
var rubi = require('../libs/rubi');
var diamante = require('../libs/diamante');


// -------------------------------------------------------------------------- //
// ADMINISTRADOR //

var Processes = {

  order: ['users', 'aula'],  // Processes[Processes.order[i]]().
  completados: 0,
  completar: 2,

  // Iniciar el primer proceso.
  start: function () {
    this.completados = 0;
    this.completar = this.order.length;        
    this.next();
  },

  // Continuar el siguiente proceso.
  next: function () {
    var component = this.order[this.completados];
    console.log('> Proceso "'+ component +'" iniciado...');
    this[this.order[this.completados]]();
  },

  // Complicar el proceso actual y vericicar si es el final.
  done: function () {
    var component = this.order[this.completados];
    this.completados++;
    console.log('\nProceso "'+ component +'" completado ('+ this.completados
    +'/'+ this.completar +').');
    if (this.completados / this.completar === 1) {
      console.log('Re-seteo finalizado correctamente.');
      diamante.disconnect();
      rubi.disconnect();
    } else {
      this.next();
    }
  }

};


// -------------------------------------------------------------------------- //
// DATOS DE USUARIOS //

Processes.users = function () {

  var diamanteConn = diamante.connection;
  var users = rubi.users;

  diamanteConn.query('SELECT IdUsr,IdPerfil,LoginUsr,CodProf,CodPos,CodEst,Estado'
  + ',PrimNomUsr,PrimApeUsr,Foto FROM TP_Usuarios;', function (err, usersList, fields) {
    if (err) throw err;

    // IMPORTANT: No se tiene en cuenta la verificación de si el IdPerfil
    // está activo o no en la tabla diamante.TB_Perfiles.

    // Migrar datos.
    for (var user, ct = 0, i = 0; i < usersList.length; i += 1) {

      user = usersList[i];
      users.update({
        _id: user.IdUsr
      }, {
        active: (user.Estado === 'Activo' || user.Estado === 'Manual' ? true : false),
        admin: (user.IdPerfil === 'PE1' || user.IdPerfil === 'PE17' ? true : false),
        name: user.PrimNomUsr + ' ' + user.PrimApeUsr,
        photo: user.Foto
      }, function (err, affected) {
        if (err) throw err;
        if (affected === 1) {
          process.stdout.write('.');
          ct++;
          if (ct === usersList.length) {
            Processes.done();
          }
        } else {
          throw new Error('Error procesando: '+ user.IdUsr);
        }
      });
    }
  });
};


// -------------------------------------------------------------------------- //
// DATOS DE AULA //

Processes.aula = function () {

  var data = [];

  // Conseguir los guiones totales (no)disponibles y sus profesores.
  // Conseguir las clases (materias/grupos).
  diamante.queryMulti([
    'SELECT IdGuionClase,IdUsr,TituloGuion,Quiz,Estado FROM TP_GuionClase;',
    'SELECT IdGuionClase,IdMat,Grupo FROM TR_GuionGrupoClase;'
  ], function (err, guiones, classes) {
    if (err) throw err;

    // Por cada clase.
    _.each(classes, function (c, ci) {

      // Una variable por cada referencia al objeto de cada clase.
      var reg = {
        subject: c.IdMat,
        group: c.Grupo,
        guion: c.IdGuionClase,
        teacher: _.find(guiones, function (g) {
          return g.IdGuionClase === c.IdGuionClase;
        }).IdUsr,
        students: [],
        subgroups: []
      };

      // Conseguir los estudiantes de cada clase.
      diamante.con.query('SELECT IdMat,Grupo,IdUsr FROM TR_Alumnos'
      +' WHERE IdMat="'+ c.IdMat +'" AND Grupo="'+ c.Grupo +'";', function (err, students) {
        if (err) throw err;

        reg.students = _.pluck(students, 'IdUsr');

        // Conseguir los subgrupos de cada clase.
        diamante.con.query('SELECT IdMat,Grupo,IdGrupClase,Estado '
        +'FROM TR_GruposClase WHERE IdMat="'+ c.IdMat +'" AND Grupo="'+ c.Grupo +'";',
        function (err, subgroups) {
          if (err) throw err;

          // Sino hay subgroupos, no entrará aca.
          async.each(subgroups, function (sg, callback) {

            // Conseguir estudiantes de los subgrupos de cada clase.
            diamante.con.query('SELECT IdUsr,IdGrupClase FROM TR_GrupClaseEst '
            +'WHERE IdGrupClase="'+ sg.IdGrupClase +'";', function (err, subgroupsStudents) {
              if (err) {
                callback(err);
              } else {
                reg.subgroups.push({
                  _id: sg.IdGrupClase,
                  students: _.pluck(subgroupsStudents, 'IdUsr')
                });
                callback();
              }
            });
            process.stdout.write('.');
          }, function (err) {
            if (err) throw err;

            // Agregar el registro de clase a la lista de clases,
            // sólo si consiguió los subgrupos (eso indica actividad).
            if (reg.subgroups.length) data.push(reg);

            // Cuando se hayan conseguido todos los datos de clases.
            if (ci === classes.length - 1) {
              Processes.aula.data(data);
            }
          });  // end: subgruops
          process.stdout.write('.');
        });
        process.stdout.write('.');
      });
      process.stdout.write('.');
    });  // end: each(classes)
    process.stdout.write('.');
  });
};


// Procesar los datos obtenidos para actualizar rubi.
Processes.aula.data = function (data) {

  var classesCount = 0;

  // Por cada clase.
  _.each(data, function (d, i) {

    // Actualizar/crear la clase.
    rubi.ac_classes.update({
      subject: d.subject,
      group: d.group,
    }, d, {
      upsert: true
    }, function (err, tClass) {
      if (err) throw err;

      // Crear la sala de chat de la clase.
      rubi.ac_rooms.update({
        _id: d.subject +'_'+ d.group,
      }, {
        available: true,
        teacher: {
          _id: d.teacher,
          socket: '',
          state: 'offline'
        },
        students: _.map(d.students, function (st) {
          return {_id: st, socket: '', state: 'offline'};
        })
      }, {
        upsert: true
      }, function (err, room) {
        if (err) throw err;

        // Por cada subgrupo de la clase.
        async.each(d.subgroups, function (sg, callback) {

          // Crear la sala de chat de cada subgrupo de cada clase.
          rubi.ac_rooms.update({
            _id: d.subject +'_'+ d.group +'_'+ sg._id
          }, {
            available: true,
            teacher: {
              _id: '',
              socket: '',
              state: 'offline'
            },
            students: _.map(sg.students, function (st) {
              return {
                _id: st,
                socket: '',
                state: 'offline'
              };
            })
          }, {
            upsert: true
          }, function (err, room) {
            if (err) {
              callback(err);
            } else {
              process.stdout.write('.');
              callback();
            }
          });
        }, function (err) {
          if (err) throw err;
          
          classesCount++;

          // Cuando se haya completado todo.
          if (classesCount === data.length) {
            Processes.done();
          }
        });
        process.stdout.write('.');
      });
      process.stdout.write('.');
    });
    process.stdout.write('.');
  });
};


// -------------------------------------------------------------------------- //
// INICIAR //

console.log('Sincronización de datos de "diamante" a "rubi".');
console.log('Iniciando procesos...');

// Iniciar una vez se haya conectado con las bases de datos.
rubi.connect(function () {
  diamante.connect(function () {
    Processes.start();
  });
});
