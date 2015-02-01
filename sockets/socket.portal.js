/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Sockets | Portal
 * Romel Pérez, prhone.blogspot.com
 * 2015
 **/

var _ = require('underscore');
var db = require('../databases/dbs.portal');
var log = require('../libs/log')('socket:portal');


// -------------------------------------------------------------------------- //
// PORTAL APPLICATION //

var portal = {

  io: null,
  express: null,
  messagesIntervalUpdate: null,


  /**
   * Conexión por socket con el usuario ".on('connect', connect)".
   * @param {Object} socket El socket de conexión con el usuario
   */
  connect: function (socket) {

    // Usuario conectado en el portal.
    log.info(socket.user.ip +' '+ socket.user.id +' '+ socket.id +' CONNECTED.');

    // Registrar instancia de conexión por ya estar conectado.
    db.addInstance(socket.user, socket.id, function (err, doc) {
      if (err) log.error('connect agregando instancia:', err);
    });

    // Enviar mensajes de administración activos al público.
    portal.sendActiveMsgs(socket);

    // Remover instancia de conexión al desconectarse.
    socket.on('disconnect', function () {
      log.info(socket.user.ip +' '+ socket.user.id +' '+ socket.id +' DISCONNECTED.');
      db.rmInstance(socket.user, socket.id, function (err, doc) {
        if (err) log.error('connect removiendo instancia:', err);
      });
    });
  },


  /**
   * Revisar por mensajes de administración al público activos.
   * @param  sockets  El socket/sockets de conexión
   * Responde con array de mensajes, sólo id, tipo y contenido.
   */
  sendActiveMsgs: function (sockets) {
    var now = new Date();

    // Preguntar por mensajes de ahora mismo.
    db.rubi.messages.find({
      startDate: {$lte: now},
      endDate: {$gte: now}
    }, function (err, msgs) {
      if (err) log.error('sendActiveMsgs buscando mensajes:', err);

      // Filtrar los mensajes recibidos.
      var messages = {
        messages:
          msgs.length
          ? _.map(msgs, function (msg) {
          return {
            id: msg._id,
            type: msg.type,
            message: msg.message
          }
          })
          : []
      };

      // Si hay o no mensajes para enviar.
      if (!messages.messages.length) {
        return;
      } else {
        log.debug('enviando mensajes de /portal a sockets', {
          socket: sockets.sockets ? '/portal' : sockets.id,
          messages: _.map(messages.messages, function (msg) {
            return msg.id
          })
        });
        sockets.emit('msg', messages);
      }
    });
  }

};


// -------------------------------------------------------------------------- //
// EVENTS //

module.exports = function (authorization) {

  portal.io = this.io;
  portal.express = this.express;

  // Implementar aplicación/namespace de sockets conectándose en el portal.
  this.io.of('/portal', portal.connect).use(authorization.handshake);

  // Verificar cada 1 minuto que hayan mensajes pospuestos de administración.
  portal.messagesIntervalUpdate = setInterval(function () {
    portal.sendActiveMsgs(portal.io.of('/portal'));
  }, 1000 * 60 * 1);
};
