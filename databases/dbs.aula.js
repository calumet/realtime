/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Databases | Aula
 * Romel Pérez, prhone.blogspot.com
 * 2015
 **/

var _ = require('underscore');
var async = require('async');
var moment = require('moment');
var rubi = require('../libs/rubi');
var diamante = require('../libs/diamante');
var config = require('../config');
var debug = require('debug')('dbs:aula');


// -------------------------------------------------------------------------- //
// PRIVATE //

var dbAula = {

  /**
   * Si un usuario se conecta en el aula, colocar el socket y estado a las salas
   * de chat en las que se encuentra conectado.
   * @param {String} state El nuevo estado del usuario del socket.
   * @param {Object} socket El socket de conexión.
   * @param {Function} callback function(err,rooms){}.
   * Devuelve en el callback las salas donde se encontraba el usuario.
   */
  setUserStateInRooms: function (state, socket, callback) {

    var newSocket, newState;
    var user = socket.user;

    // Elegir los nuevos estados mediante el estado de entrada.
    if (state === 'online') {
      newSocket = socket.id;
      newState = 'available';
    } else {
      newSocket = '';
      newState = 'offline';
    }

    // Buscar las salas de chat a las que pertenece. La clase y el subgrupo.
    // Si es un profesor, sólo tendrá la clase, no el subgrupo.
    // TODO: sólo conseguir hasta los últimos 50 registros de messages por sala.
    rubi.ac_rooms.find({
      $or: [
        {_id: user.subject +'_'+ user.group},
        {_id: user.subject +'_'+ user.group +'_'+ user.subgroup}
      ]
    }, function (err, rooms) {

      // Hubo un error, o no se encontró ni siquiera la clase.
      if (err || !(rooms && rooms.length >= 1)) {
        callback(err ||
        'Salas faltantes: '+ user.subject +' '+ user.group +' '+ user.subgroup);
      } else {

        // Procesar cada sala de chat.
        async.each(rooms, function (room, next) {
          var student;

          // Si es un profesor, o sino.
          if (room.teacher._id === user.id) {

            // Determinar el nuevo estado del profesor.
            room.teacher.socket = newSocket;
            room.teacher.state = newState;
          }

          // Si es estudiante, buscarlo.
          else {
            student = _.findWhere(room.students, {_id: user.id});
            if (!student) {
              next('No se encontró usuario '+ user.id +' en sala '+ room._id);
              return;
            }

            // Determinar el nuevo estado del estudiante.
            student.socket = newSocket;
            student.state = newState;
          }

          // Actualizar sala de clase y completar proceso.
          room.save(function (err, newRoom) {
            if (err) {
              next(err);
            } else {
              next();
            }
          });
        }, function (err) {
          if (err) {
            callback(err);
            return;
          }
          
          callback(null, rooms);
        });
      }
    });
  },


  /**
   * Conseguir los datos de los usuarios en la "unión" de todas las salas de chat.
   * @param {[Object]} rooms La salas de chat a analizar.
   * @param {Function} callback function(err,users){}.
   */
  getUsersDataByRooms: function (rooms, callback) {
    var ids = [];

    // Buscar los datos de cada usuario en cada sala.
    async.eachSeries(rooms, function (room, next) {
      
      // Conseguir los identificadores de los usuarios.
      ids.push(room.teacher._id);
      _.each(room.students, function (student) {
        ids.push(student._id);
      });

      next();
    }, function (err) {
      if (err) {
        callback(err);
      } else {

        // Quitar los repetidos.
        ids = _.uniq(ids);

        // Mapearlos para poder hacer el query.
        ids = _.map(ids, function (id) {
          return {_id: id};
        });

        // Buscar datos de todos los usuarios.
        rubi.users.find({
          $or: ids
        }, function (err, users) {
          callback(null, users);
        });
      }
    });
  }

};


// -------------------------------------------------------------------------- //
// PROCEDURES //

/**
 * Referencias a los controladores de las bases de datos.
 */
exports.rubi = rubi;
exports.diamante = diamante;


/**
 * Resetear todas las instancias de usuarios conectados en rubi.ac_rooms.
 * @param  {Function} callback function(err){}
 */
exports.reset = function (callback) {
  rubi.ac_rooms.find({}, function (err, rooms) {
    async.each(rooms, function (room, next) {
      
      // Colocar los profesores como desconectados.
      room.teacher.state = 'offline';
      room.teacher.socket = '';

      // Colocar cada alumno como desconectado.
      _.each(room.students, function (student) {
        student.state = 'offline';
        student.socket = '';
      });

      // Guardar cambios.
      room.save(next);
    }, function (err) {
      callback(err);
    });
  });
};


/**
 * Colocar un usuario como conectado en las salas de chat a las que pertenece.
 * @param {Object} socket El socket de conexión con el usuario.
 * @param {Function} callback function(err,rooms,users){}.
 */
exports.userConnected = function (socket, callback) {

  // Cambiar en estado del usuario en las salas donde está y conseguir tales salas.
  dbAula.setUserStateInRooms('online', socket, function (err, rooms) {
    if (err) {
      callback(err);
      return;
    }

    // Conseguir los datos de los usuarios en las salas.
    dbAula.getUsersDataByRooms(rooms, function (err, users) {
      callback(err, rooms, users);
    });
  });
};


/**
 * Colocar un usuario como desconectado en las salas de chat a las que pertenece.
 * @param {Object} socket El socket de conexión con el usuario.
 * @param {Function} callback function(err,rooms){}.
 */
exports.userDisconnected = function (socket, callback) {
  dbAula.setUserStateInRooms('offline', socket, callback);
};


/**
 * Todos los usuarios de un grupo de clase (estudiantes).
 * @param {String} subject Materia.
 * @param {String} group Grupo.
 * @param {String} subgroup Subgrupo.
 * @param {Function} callback function(err,class){}.
 */
exports.studentsBySubgroup = function (subject, group, subgroup, callback) {

  // Encontrar la clase (materia_grupo).
  rubi.ac_classes.findOne({
    subject: subject,
    group: group
  }, function (err, clss) {
    if (err) {
      callback(err);
    } else {

      // Filtrar el subgrupo en cuestión.
      var sg = _.findWhere(clss.subgroups, {_id: subgroup});
      
      // Si se encontró o no.
      if (!sg) {
        callback('Subgrupo no encontrado: '+ subgroup);
      } else {
        callback(null, sg.students);
      }
    }
  });
};


/**
 * Comprobar si una clase se encuentra en exámen, haciendo uso de la hora del
 * del sistema.
 * @param {String} subject Materia.
 * @param {String} group Grupo.
 * @param {Function} callback function(err,inExam:Boolean){}.
 */
exports.classInExam = function (subject, group, callback) {

  var now = new Date();
  var thisDate = moment(now).format('YYYY-MM-DD')
  var thisTime = moment(now).format('HH:mm:ss');

  // Averiguar si se encuentra en exámen en diamante.
  diamante.con.query('SELECT * FROM TR_GuionExamenGrupo WHERE IdMat="'+ subject +'" '
  +'AND Grupo="'+ group +'" AND Fecha="'+ thisDate +'" AND HoraInicial<="'+ thisTime +'";',
  function (err, exams) {
    if (err) {
      callback(err);
      return;
    }

    // No se encontró ningún exámen.
    if (!exams.length) {
      callback(null, false);
      return;
    }

    // Se encontró un exámen.
    else {
      var exam = exams[0];
      var ee = moment(moment(exam.Fecha).format('YYYY-MM-DD') +'T'+ exam.HoraInicial);
      ee.add(exam.Minutos, 'minutes');

      // Comparar la hora actual y la hora estimada final del exámen.
      if (Number(ee) > now.getTime()) callback(null, true);
      else callback(null, false);
    }
  });
};


/**
 * Agregar un mensaje a una sala de chat. El mensaje debe ser más reciente que
 * cualquiera que ya tenga la sala.
 * @param {String} room El identificador de la sala de chat.
 * @param {Object} message El objeto mensaje {_id:Date, user:String, content:String}.
 * @param {Function} callback function(err){}.
 */
exports.addMessage = function (room, message, callback) {
  rubi.ac_rooms.update({
    _id: room
  }, {
    $push: {
      messages: message
    }
  }, callback);
};


/**
 * Conseguir los mensajes de una sala en un rango de tiempo. 'from' o 'to', al
 * menos uno debe estar definido.
 * @param {String} room Identificador de la sala de chat.
 * @param {Date} from Momento desde donde buscar. Si es nulo, entonces buscará
 * desde el comienzo.
 * @param {Date} from Momento hasta donde buscar. Si es nulo, entonces buscará
 * hasta el final.
 * @param {Number} limit Indica cuántos mensajes se limitará a conseguir en el
 * rango dado. Si está 'from' y 'to', limitará en los más recientes.
 * @param {Function} callback function(err,messages){}.
 */
exports.getMessages = function (room, from, to, limit, callback) {
  // TODO: this.
};
