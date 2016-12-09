const consts = require('consts');
const log = require('log');
const resources = require('resources');
const users = require('events/users');
const rooms = require('events/rooms');

module.exports = function () {

  const { io, data } = resources;

  // TODO:
  // Verificación de seguridad.
  io.use((socket, next) => {
    const { token } = socket.handshake.query;
    // ...
    next();
  });

  // Verificación de datos.
  io.use((socket, next) => {

    const { query } = socket.handshake;

    log.sockets.debug(`${socket.id} trying to connect with:`, query);

    data.models.realtime_space.
      findOne({ code: query.spaceCode }).
      then(space => {
        if (space) {
          return data.models.user.findOne({ id: query.userId });
        }
        return Promise.reject(consts.sockets.ERR_NOSPACE);
      }).
      then(user => {
        if (user) return;
        return Promise.reject(consts.sockets.ERR_NOUSR);
      }).
      then(() => {
        socket.userId = query.userId;
        socket.spaceCode = query.spaceCode;
        next();
      }).
      catch(err => {
        next({ message: err });
        log.sockets.debug(`${socket.id} was rejected because:`, err);
      });
  });

  io.on('connection', socket => {

    users.connect.call(socket, socket);

    socket.on('disconnect', users.disconnect.bind(socket, socket));
    socket.on('disconnecting', users.disconnecting.bind(socket, socket));
    socket.on('room:message', rooms.message.bind(socket, socket));
  });
};
