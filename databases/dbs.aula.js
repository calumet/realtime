/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Databases | Aula
 * Romel Pérez, prhone.blogspot.com
 * Enero, 2015
 **/

var _ = require('underscore');
var async = require('async');
var moment = require('moment');
var rubi = require('../libs/rubi');
var diamante = require('../libs/diamante');
var config = require('../config');
var log = require('../libs/log')('dbs:aula');


// -------------------------------------------------------------------------- //
// PRIVATE //

var dbAula = {

  /**
   * Si un usuario se conecta en el aula, colocar el socket y estado a las salas
   * de chat en las que se encuentra conectado. Sin embargo, que tengan relación
   * con la materia, ya que podría tener otras aulas.
   * @param {String} state El nuevo estado del usuario del socket (online | offline).
   * @param {Object} socket El socket de conexión.
   * @param {Function} callback function(err,rooms){}.
   * Devuelve en el callback las salas donde se encontraba el usuario.
   */
  setUserStateInRooms: function (state, socket, callback) {
    var newSocket, newState, timeLastIn, timeLastOut;
    var user = socket.user;

    // Elegir los nuevos estados mediante el estado de entrada.
    if (state === 'online') {
      newSocket = socket.id;
      newState = 'away';  // Conectado pero no viendo directamente la sala.
      timeLastIn = new Date();
    } else {
      newState = 'offline';
      timeLastOut = new Date();
    }

    // Buscar las salas de chat donde se encuentra el usuario.
    rubi.ac_rooms.find({
      'users._id': user.id,
      _id: new RegExp('^'+ user.subject)
    }, function (err, rooms) {

      // Hubo un error, o no se encontró ni siquiera la clase.
      if (err || !(rooms && rooms.length >= 1)) {
        callback(err || 'usuario '+ user.id +' no tiene salas');
      } else {

        // Procesar cada sala de chat.
        async.each(rooms, function (room, next) {
          var usr = _.findWhere(room.users, {_id: user.id});

          // Determinar el nuevo estado del usuario y sus variables.
          usr.state = newState;
          if (state === 'offline') {
            usr.timeLastOut = timeLastOut;
          } else {
            usr.socket = newSocket;
            usr.timeLastIn = timeLastIn;
          }

          // Actualizar sala de clase y completar proceso.
          room.save(next);
        }, function (err) {
          if (err) return callback(err);
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
      ids = ids.concat(_.pluck(room.users, '_id'));
      next();
    }, function (err) {
      if (err) return callback(err); 

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
        callback(err, users);
      });
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

      // Colocar cada alumno como desconectado.
      _.each(room.users, function (user) {
        user.state = 'offline';
        user.socket = undefined;
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

  // Cambiar el estado del usuario en las salas donde está y conseguir tales salas.
  dbAula.setUserStateInRooms('online', socket, function (err, rooms) {
    if (err) return callback(err);

    // Conseguir los datos de los usuarios en tales salas.
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

  // Cambiar el estado del usuario en las salas donde está y conseguir tales salas.
  dbAula.setUserStateInRooms('offline', socket, callback);
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
    if (err) return callback(err);

    // No se encontró ningún exámen.
    if (!exams.length) return callback(null, false);

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
  callback('Funcionalidad no disponible.');
};
