/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Admin | Reset
 * Romel Pérez, prhone.blogspot.com
 * Enero, 2015
 **/

/**
 * Resetear datos de la base de datos "diamante" a "rubi".
 * Se debe enviar el argumento: --auth=true en el comando.
 */

var _ = require('../node_modules/underscore');
var async = require('../node_modules/async');
var rubi = require('../libs/rubi');
var diamante = require('../libs/diamante');
var isNumber = function (e){return!isNaN(parseFloat(e))&&isFinite(e);};


// -------------------------------------------------------------------------- //
// ADMINISTRADOR //

var Processes = {

  order: ['users', 'aula'],  // Processes[Processes.order[i]]()
  completados: 0,
  completar: 0,

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

  // Remover datos actuales.
  users.remove({}, function (err, res) {
    if (err) throw err;
    process.stdout.write('.');
  });

  // Conseguir datos de usuarios.
  diamanteConn.query('SELECT IdUsr,IdPerfil,LoginUsr,CodProf,CodPos,CodEst,Estado'
  + ',PrimNomUsr,PrimApeUsr,Foto FROM TP_Usuarios;', function (err, usersList, fields) {
    if (err) throw err;

    // IMPORTANT: No se tiene en cuenta la verificación de si el IdPerfil
    // está activo o no en la tabla diamante.TB_Perfiles.

    // Migrar datos.
    for (var user, ct = 0, i = 0; i < usersList.length; i += 1) {
      user = usersList[i];
      users.create({
        _id: user.IdUsr,
        codEst: (isNumber(user.CodEst) ? user.CodEst : 0),
        codPos: (isNumber(user.CodPos) ? user.CodPos : 0),
        codProf: (isNumber(user.CodProf) ? user.CodProf : 0),
        active: (user.Estado === 'Activo' || user.Estado === 'Manual' ? true : false),
        admin: (user.IdPerfil === 'PE1' || user.IdPerfil === 'PE17' ? true : false),
        name: user.PrimNomUsr +' '+ user.PrimApeUsr,
        photo: user.Foto,
        devices: []
      }, function (err, doc) {
        if (err) throw err;
        process.stdout.write('.');
        ct++;
        if (ct === usersList.length) {
          Processes.done();
        }
      });
    }
  });
};


// -------------------------------------------------------------------------- //
// DATOS DE AULA //

// Conseguir datos de la base de datos.
Processes.aula = function () {
  var data = [];

  // Remover las clases existentes.
  rubi.ac_classes.remove({}, function (err) {
    if (err) throw err;
    process.stdout.write('.');
  });

  // Remover las salas de chat existentes.
  rubi.ac_rooms.remove({}, function (err) {
    if (err) throw err;
    process.stdout.write('.');
  });

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

        // Filtrarles a los estudiantes el id.
        reg.students = _.pluck(students, 'IdUsr');

        // Conseguir los subgrupos de cada clase.
        diamante.con.query('SELECT IdMat,Grupo,IdGrupClase,Estado '
        +'FROM TR_GruposClase WHERE IdMat="'+ c.IdMat +'" AND Grupo="'+ c.Grupo +'";',
        function (err, subgroups) {
          if (err) throw err;

          // Por cada subgrupo.
          async.each(subgroups, function (sg, callback) {

            // Conseguir estudiantes de los subgrupos de cada clase.
            diamante.con.query('SELECT IdUsr,IdGrupClase FROM TR_GrupClaseEst '
            +'WHERE IdGrupClase="'+ sg.IdGrupClase +'";', function (err, subgroupsStudents) {
              if (err) return callback(err);

              reg.subgroups.push({
                _id: sg.IdGrupClase,
                students: _.pluck(subgroupsStudents, 'IdUsr')
              });
              callback();
            });
          }, function (err) {
            if (err) throw err;

            // Agregar el registro de clase a la lista de clases,
            // sólo si consiguió los subgrupos (eso indica actividad).
            if (reg.subgroups.length) data.push(reg);

            // Cuando se hayan conseguido todos los datos de clases.
            if (ci === classes.length - 1) {

              // Pasar a la siguiente fase del proceso, salas de clases y subgrupos.
              Processes.aula.clssAndSubs(data);
            }
          });  // end: subgruops
        });
      });
    });  // end: each(classes)
  });
};


// Guardar datos de clases y subgrupos de clase en base de datos.
Processes.aula.clssAndSubs = function (data) {
  var classesCount = 0;

  // Por cada clase.
  _.each(data, function (d, i) {
    var users;

    // Crear la clase.
    rubi.ac_classes.create(d, function (err, tClass) {
      if (err) throw err;
      process.stdout.write('.');

      // Usuarios de clase.
      users = _.map(d.students, function (st) {
        return {
          _id: st,
          state: 'offline'
        };
      });
      users.unshift({
        _id: d.teacher,
        state: 'offline'
      });

      // Crear la sala de chat de la clase.
      rubi.ac_rooms.create({
        _id: d.subject +'_'+ d.group,
        type: 'class',
        available: true,
        teacher: d.teacher,
        users: users,
        messages: []
      }, function (err, room) {
        if (err) throw err;
        process.stdout.write('.');

        // Por cada subgrupo de la clase.
        async.each(d.subgroups, function (sg, callback) {

          // Crear la sala de chat de cada subgrupo de cada clase.
          rubi.ac_rooms.create({
            _id: d.subject +'_'+ d.group +'_'+ sg._id,
            type: 'subgroup',
            available: true,
            users: _.map(sg.students, function (st) {
              return {
                _id: st,
                state: 'offline'
              };
            }),
            messages: []
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

          // Cuando se hayan creado las salas de clase y subgrupo.
          if (classesCount === data.length) {

            // Parar a la siguiente fase, guiones.
            Processes.aula.guiones(data);
          }
        });
      });
    });  // end: class create
  });
};


// Guardar salas de guiones en la base de datos.
Processes.aula.guiones = function (data) {
  var users;
  var guiones = {};

  // Filtrar los guiones que sólo tienen una clase.
  _.each(data, function (dt) {
    if (_.where(data, {guion: dt.guion}).length > 1) {

      // Usuarios de la clase en cuestión.
      users = _.map(dt.students, function (st) {
        return {
          _id: st,
          state: 'offline'
        };
      });

      // Filtrar los usuarios compartidos entre salas.
      if (!guiones[dt.guion]) {

        // Agregar profesor al inicio.
        users.unshift({
          _id: dt.teacher,
          state: 'offline'
        });

        // Creando guion.        
        guiones[dt.guion] = {
          _id: dt.subject +'_'+ dt.guion,
          type: 'guion',
          available: true,
          teacher: dt.teacher,
          users: users,
          messages: []
        };
      } else {

        // Haciendo "unión" de usuarios de todas las clases del guion.
        guiones[dt.guion].users = guiones[dt.guion].users.concat(users);
        guiones[dt.guion].users = _.uniq(guiones[dt.guion].users, function (u) {
          return u._id;
        });
      }
    }
  });

  // Por cada guion.
  async.each(_.toArray(guiones), function (guion, next) {

    // Crear sala de guion.
    rubi.ac_rooms.create(guion, next);
  }, function (err) {
    if (err) throw err;

    // Completar el proceso del aula.
    Processes.done();
  });
};


// -------------------------------------------------------------------------- //
// INICIAR //

var auth = false;

_.each(process.argv, function (arg) {
  if (arg === '--auth=true') {
    console.log('Migrando datos de usuarios de "diamante" a "rubi".');
    console.log('Iniciando procesos...');

    // Iniciar una vez se haya conectado con las bases de datos.
    rubi.connect(function () {
      diamante.connect(function () {
        Processes.start();
      });
    });
    auth = true;
  }
});

if (!auth) {
  console.log('Operación no autorizada. Leer la documentación.');
}
