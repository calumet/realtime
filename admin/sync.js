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

  order: [{
    name: 'Usuarios',
    main: 'users'
  }, {
    name: 'Aula',
    main: 'aula',
    subprocesses: ['clases', 'subgroups', 'guiones']
  }],

  // Iniciar el primer proceso.
  start: function () {
    this.completados = 0;
    this.completar = this.order.length;        
    this.next();
  },

  // Continuar el siguiente proceso.
  next: function () {
    var component = this.order[this.completados].name;
    console.log('> Proceso "'+ component +'" iniciado...');
    if (this.order[this.completados].subprocesses) {
      this.order[this.completados].completados = 0;
      this.order[this.completados].completar = this.order[this.completados].subprocesses.length;
    }
    this[this.order[this.completados].main]();
  },

  // Continuar con el siguiente subproceso.
  // Éste se debe colocar dentro del "main" del proceso.
  subNext: function () {
    var idp = this.order[this.completados].completados;
    var sp = this.order[this.completados].subprocesses[idp];
    this[this.order[this.completados].main][sp]();
  },

  // Terminar el subproceso.
  // Éste se debe colocar al terminar los cada subproceso.
  subDone: function () {
    this.order[this.completados].completados++;

    // Si todos los subprocesos del actual proceso están completados, sino siguiente.
    if (this.order[this.completados].completados / this.order[this.completados].completar === 1) {
      this.done();
    } else {
      this.subNext();
    }
  },

  // Complicar el proceso actual y vericicar si es el final.
  done: function () {
    var component = this.order[this.completados].name;
    this.completados++;

    console.log('\nProceso "'+ component +'" completado ('+ this.completados
    +'/'+ this.completar +').');

    // Todo completado, sino siguiente.
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

Processes.aula = function () {
  var data = Processes.aula._data = [];

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
          }, function (err) {
            if (err) throw err;

            // Agregar el registro de clase a la lista de clases,
            // sólo si consiguió los subgrupos (eso indica actividad).
            if (reg.subgroups.length) data.push(reg);

            // Cuando se hayan conseguido todos los datos de clases.
            if (ci === classes.length - 1) {

              // Pasar a la siguiente fase del proceso.
              Processes.subNext();
            }
          });  // end: subgruops
        });
      });
    });  // end: each(classes)
  });
};


// Actualizar datos de clases y subgrupos de clase en base de datos.
Processes.aula.clases = function () {
  var data = Processes.aula._data;

  // Por cada clase.
  async.each(data, function (d, next) {
    var users;

    // Buscar sala de clase y actualizar.
    rubi.ac_classes.update({
      subject: d.subject,
      group: d.group,
    }, d, {
      upsert: true
    }, function (err, tClass) {
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

      // Buscar sala de chat de clase.
      rubi.ac_rooms.findById(d.subject +'_'+ d.group, function (err, room) {
        if (err) throw err;

        // Tomar datos ya definidos.
        var ue;
        if (room.users && room.users.length) {
          users = _.map(users, function (u) {
            ue = _.findWhere(room.users, {_id: u._id});
            if (ue.timeLastIn) u.timeLastIn = ue.timeLastIn;
            if (ue.timeLastOut) u.timeLastOut = ue.timeLastOut;
            if (ue.state !== 'offline') {
              u.state = ue.state;
              u.socket = ue.socket;
            }
            return u;
          });
        }

        // Crear sala sino estaba creada.
        if (!room) {
          rubi.ac_rooms.create({
            _id: d.subject +'_'+ d.group,
            type: 'class',
            available: true,
            teacher: d.teacher,
            users: users,
            messages: []
          }, function (err) {
            next(err);
            process.stdout.write('.');
          });
        }

        // Actualizar sala si ya estaba creada.
        else {
          rubi.ac_rooms.update({
            _id: d.subject +'_'+ d.group
          }, {
            teacher: d.teacher,
            users: users
          }, function (err) {
            next(err);
            process.stdout.write('.');
          });
        }
      });
    });
  }, function (err) {
    if (err) throw err;

    // Pasar a la siguiente fase del proceso.
    Processes.subDone();
  });
};


// Actualizar subgrupos de clases en la base de datos.
Processes.aula.subgroups = function (data) {
  var data = Processes.aula._data;

  // Por cada clase.
  async.each(data, function (d, next) {

    // Por cada subgrupo de la clase.
    async.each(d.subgroups, function (sg, callback) {
      var users, ue;

      // Filtrar datos de usuarios.
      users = _.map(sg.students, function (st) {
        return {
          _id: st,
          state: 'offline'
        };
      });

      // Buscar sala de subgrupo.
      rubi.ac_rooms.findById(d.subject +'_'+ d.group +'_'+ sg._id, function (err, room) {
        if (err) throw err;err

        // Crearla sino está creada, sino actualizarla.
        if (!room) {

          // Crear sala.
          rubi.ac_rooms.create({
            _id: d.subject +'_'+ d.group +'_'+ sg._id
          }, {
            _id: d.subject +'_'+ d.group +'_'+ sg._id,
            type: 'subgroup',
            available: true,
            users: users,
            messages: []
          }, function (err, room) {
            callback(err);
            process.stdout.write('.');
          });
        } else {

          // Tomar datos ya definidos.
          if (room.users && room.users.length) {
            users = _.map(users, function (u) {
              ue = _.findWhere(room.users, {_id: u._id});
              if (ue.timeLastIn) u.timeLastIn = ue.timeLastIn;
              if (ue.timeLastOut) u.timeLastOut = ue.timeLastOut;
              if (ue.state !== 'offline') {
                u.state = ue.state;
                u.socket = ue.socket;
              }
              return u;
            });
          }

          // Actualizar la sala.
          rubi.ac_rooms.update({
            _id: d.subject +'_'+ d.group +'_'+ sg._id
          }, {
            users: users
          }, function (err, room) {
            callback(err);
            process.stdout.write('.');
          });
        }
      });
    }, next);
  }, function (err) {
    if (err) throw err;

    // Pasar a la siguiente fase del proceso, guiones.
    Processes.subDone();
  });
};


// Actualizar salas de guiones en la base de datos.
Processes.aula.guiones = function () {
  var guiones = [];
  var data = Processes.aula._data;

  // Filtrar los guiones que sólo tienen una clase.
  _.each(data, function (dt) {
    var guion, users;

    if (_.where(data, {guion: dt.guion}).length > 1) {

      // Usuarios de la clase en cuestión.
      users = _.map(dt.students, function (st) {
        return {
          _id: st,
          state: 'offline'
        };
      });

      // Crear guión sino lo está, sino actualizarlo.
      guion = _.findWhere(guiones, {_id: dt.subject +'_'+ dt.guion});
      if (!guion) {

        // Agregar profesor al inicio.
        users.unshift({
          _id: dt.teacher,
          state: 'offline'
        });

        // Creando guion.        
        guiones.push({
          _id: dt.subject +'_'+ dt.guion,
          type: 'guion',
          available: true,
          teacher: dt.teacher,
          users: users,
          messages: []
        });
      } else {

        // Haciendo "unión" de usuarios de todas las clases del guion.
        guion.users = guion.users.concat(users);
        guion.users = _.uniq(guion.users, function (u) {
          return u._id;
        });
      }
    }
  });

  // Por cada guion.
  async.each(guiones, function (guion, next) {
    var ue;

    // Crear sala de guion.
    rubi.ac_rooms.findById(guion._id, function (err, room) {
      if (err) throw err;
      var callback = function () {
        process.stdout.write('.');
        next();
      };

      // Crear sala no creada.
      if (!room) {
        rubi.ac_rooms.create(guion, callback);
      }

      // Actualizar sala creada.
      else {

        // Tomar datos ya definidos.
        if (room.users && room.users.length) {
          guion.users = _.map(guion.users, function (u) {
            ue = _.findWhere(room.users, {_id: u._id});
            if (ue.timeLastIn) u.timeLastIn = ue.timeLastIn;
            if (ue.timeLastOut) u.timeLastOut = ue.timeLastOut;
            if (ue.state !== 'offline') {
              u.state = ue.state;
              u.socket = ue.socket;
            }
            return u;
          });
        }

        // Actualizar sala.
        rubi.ac_rooms.update({_id: guion._id}, {
          teacher: guion.teacher,
          users: guion.users
        }, callback);
      }
    });
  }, function (err) {
    if (err) throw err;

    // Completar el proceso del aula.
    Processes.subDone();
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
