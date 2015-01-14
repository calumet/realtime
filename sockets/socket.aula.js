/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Sockets | Aula
 * Romel Pérez, prhone.blogspot.com
 * 2015
 **/

var _ = require('underscore');
var async = require('async');
var db = require('../databases/dbs.aula');
var config = require('../config');
var security = require('../security');
var debug = require('debug')('socket:aula');


// -------------------------------------------------------------------------- //
// AULA APPLICATION //

var aula = {

  io: null,
  express: null,
  roomsIntervalUpdate: null,


  /**
   * Proceso de validación de conexión del socket con el namespace aula.
   * Si abre más de una conexión con el aula, no se permitirá la segunda.
   * @param {Object} socket Es la conexión del socket estableciéndose
   * @param {Object} authorize Callback a ejecutar con la respuesta de conexión
   * Las posibles respuestas al usuario por la conexión son:
   * > ERROR       Error en el proceso de conexión
   * > ERROR_DATA  Datos erroneos
   * > DUPLICATE   Segunda conexión del aula en la misma computadora
   * > undefined   Usuario aceptado
   */
  handshake: function (socket, authorize) {

    var accept = function (res) {
      debug(socket.user.ip +' '+ socket.user.id +' '+ socket.id +' '
       + (res ? res : 'AUTHORIZED'));
      authorize(res ? {data: res} : res);
    };

    // Consiguiendo los datos de la clase.
    var userid = socket.user.id;
    var subject = socket.user.subject = socket.handshake.query.subject;
    var group = socket.user.group = socket.handshake.query.group;
    var subgroup = socket.user.subgroup = socket.handshake.query.subgroup;

    // Conseguir datos de sala de chat de la clase.
    db.rubi.ac_rooms.findById(subject +'_'+ group, function (err, classRoom) {
      if (err) {
        accept('ERROR');
        debug(err);
        return;
      }

      // No encontrado.
      if (!classRoom) {
        accept('ERROR_DATA');
        return;
      }

      // Saber si el usuario está conectado ya, verificando en la sala de clase:
      // rubi.ac_rooms.MATERIA_GRUPO.
      var st = _.findWhere(classRoom.students, {_id: userid});
      var f = (st && st.state === 'available') ||
      (userid === classRoom.teacher._id && classRoom.teacher.state === 'available');

      // Fue duplicado o está diśponible para conectarse.
      f ? accept('DUPLICATE') : accept();
    });
  },


  /**
   * Conexión por socket con el usuario ".on('connect', connect)".
   * @param {Object} socket El socket de conexión con el usuario
   */
  connect: function (socket) {

    // Usuario conectado en el aula.
    debug(socket.user.ip +' '+ socket.user.id +' '+ socket.id +' CONNECTED.');

    // Usuario conectado.
    aula.events.online.apply(socket);

    // Usuario desconectado (manualmente o automáticamente).
    socket.on('offline', function () {
      socket.disconnect(true);
    });
    socket.on('disconnect', function () {
      aula.events.offline.apply(socket, arguments);
      debug(socket.user.ip +' '+ socket.user.id +' '+ socket.id +' DISCONNECTED.');
    });

    // Mensaje de usuario.
    socket.on('msg', function () {
      aula.events.msg.apply(socket, arguments);
    });

  },


  /**
   * Eventos recibidos de un socket.
   * Emits posibles desde este evento de socket:
   * > serverError - El servidor tuvo un error procesando un evento de un usuario.
   */
  events: {

    /**
     * El usuario envió los datos para conectarse en el chat de clase, ya estándo
     * conectado con el socket.
     * Emits posibles desde este evento de socket:
     * > online - Se le envía al mismo usuario respondiendo que está online exitosamente.
     * > userOnline - Se le envía a todos los demás usuarios conectados en la sala.
     */
    online: function () {
      var socket = this;

      // Agregar a rubi como conectado.
      db.userConnected(socket, function (err, rooms, users) {
        if (err) {
          debug(err);
          return socket.emit('serverError', {ev: 'online'});
        }

        // Filtrar datos de salas de chat en las que se encuentra.
        var roomsFiltered = _.map(rooms, function (room) {
          return {
            id: room._id,
            available: room.available,
            teacher: {
              id: room.teacher._id,
              state: room.teacher.state
            },
            students: _.map(room.students, function (student) {
              return {
                id: student._id,
                state: student.state
              };
            }),
            messages: _.map(room.messages, function (msg) {
              return {
                id: msg._id,
                user: msg.user,
                content: msg.content
              };
            })
          };
        });

        // Filtrar datos de usuarios de cada sala de chat en la que se encuentra.
        var usersFiltered = _.map(users, function (user) {
          return {
            id: user._id,
            photo: user.photo,
            name: user.name
          };
        });

        // Enviarle la confirmación de que ya está conectado, con los datos de
        // las salas en las que se encuentra y los datos de todos sus usuarios.
        socket.emit('online', {
          rooms: roomsFiltered,
          users: usersFiltered
        });

        // Por cada sala de chat.
        _.each(rooms, function (room) {
          
          // Unirse a la sala.
          socket.join(room._id, function (err) {
            if (err) {
              debug(err);
              return socket.emit('serverError', {ev: 'online'});
            }

            // Cuando se una, informarle a los demás que está conectado.
            socket.to(room._id).emit('userOnline', {
              id: socket.user.id,
              room: room._id
            });
          });
        });
      });
    },


    /**
     * El usuario en cuestión se ha desconectado (manual/automáticamente).
     * Emits posibles desde este evento de socket:
     * > userOffline - Otro usuario se ha desconectado
     */
    offline: function () {
      var socket = this;

      // Colocar en rubi como desconectado.
      db.userDisconnected(socket, function (err, rooms) {
        if (err) {
          debug(err);
          return socket.emit('serverError', {ev: 'offline'});
        }

        // NOTE: No es necesario enviarle nada al usuario desconectado.
        
        // NOTE: El usuario deja la salas de chat cuando se desconecta
        // automáticamente.

        // Enviar a los de las salas, que se ha desconectado.
        _.each(rooms, function (room) {
          socket.to(room._id).emit('userOffline', {
            id: socket.user.id,
            room: room._id
          });
        });
      });

    },


    /**
     * Mensaje enviado por el usuario a una sala de chat.
     * @param {Object} msg {room:String, content:String}
     * Emits posibles desde este evento de socket:
     * > userMsg - Un usuario ha enviado un mensaje a una sala (clase/subgrupo),
     *   el cual puede ser el mismo usuario u otro en la sala.
     * > roomState - Una sala cambia de estado de actividad. Ex: Pasa de disponible
     *   a no disponible por un exámen.
     */
    msg: function (msg) {
      var socket = this;

      // El momento de ocurrido el mensaje se consigue en el servidor.
      var now = new Date().getTime();

      // Utilizar el contenido de llegada y enviarlo como llegó.
      // FIXIT: comprobar que funciona correctamente desde Western (ISO 8859-1)
      // al encoding del servidor que es UTF-8.
      var content = msg.content;

      // TODO: mantener los mensajes de la sala a menos de Number(X), eliminando
      // los mensajes más antiguos.

      // Buscar disponibilidad de sala.
      db.rubi.ac_rooms.findOne({_id: msg.room}, function (err, room) {
        if (err) {
          debug(err);
          return socket.emit('serverError', {ev: 'msg'});
        }

        // Sala no disponible. Enviar al usuario un mensaje indicandolo.
        if (!room.available) {
          return socket.emit('roomState', {
            room: msg.room,
            available: false
          });
        }

        // Guadar copia del mensaje en la sala de rubi.ac_rooms.
        db.addMessage(msg.room, {
          _id: now,
          user: socket.user.id,
          content: content
        }, function (err) {
          if (err) {
            debug(err);
            return socket.emit('serverError', {ev: 'msg'});
          }

          // Enviar a todos los usuarios del namespace/sala el mensaje.
          aula.io.of('/aula').to(msg.room).emit('userMsg', {
            id: now,
            room: msg.room,
            user: socket.user.id,
            content: content
          });
        });        
      });

    }

  },


  /**
   * Actualizar disponibilidad de las salas de clase y subgroupos de clase.
   */
  updateRoomsAvailability: function () {

    // Conseguir todas las salas tipo clase.
    db.rubi.ac_rooms.find({
      type: 'class'
    }, function (err, classes) {
      if (err) debug(err);

      // Recorrer cada clase (en serie para dividir trabajo).
      async.eachSeries(classes, function (clss, next) {

        // Materia y grupo.
        if (clss._id.indexOf('_') === -1) return next();
        var s = clss._id.substring(0, clss._id.indexOf('_'));
        var g = clss._id.substring(clss._id.indexOf('_') + 1);
        
        // Comprobar la disponibilidad de la clase.
        db.classInExam(s, g, function (err, inExam) {
          if (err) debug(err);

          // Actualizar de acuerdo al estado de la clase.
          db.rubi.ac_rooms.update({
            _id: new RegExp('^'+ s +'_'+ g)
          }, {
            available: !inExam
          }, next);
        });
      }, function (err) {
        if (err) debug(err);
      });
    });
  }

};


// -------------------------------------------------------------------------- //
// EVENTS //

module.exports = function (authorization) {

  aula.io = this.io;
  aula.express = this.express;

  // Implementar aplicación/namespace de sockets conectándose al aula.
  aula.io.of('/aula', aula.connect)
  .use(authorization.handshake)
  .use(aula.handshake);

  // Actualizar estado de las salas cada 1 minuto. Ex: Salas en exámen.
  aula.roomsIntervalUpdate = setInterval(aula.updateRoomsAvailability, 60000);
};
