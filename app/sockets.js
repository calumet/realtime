const consts = require('consts');
const log = require('log');
const resources = require('resources');
const security = require('tools/security');
const users = require('events/users');
const rooms = require('events/rooms');

module.exports = function () {

  const { io, data } = resources;

  // Verificación de seguridad.
  io.use((socket, next) => {

    const { token, userId, spaceCode } = socket.handshake.query;
    const isValid = security.isValid({ token, userId });

    if (isValid) {
      next();
    }
    else {
      next({
        data: {
          code: consts.ERR_AUTH
        }
      });
      log.sockets.debug(`${socket.id} was rejected because:`, consts.ERR_AUTH);
    }
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
        return Promise.reject({ code: consts.ERR_NOSPACE });
      }).
      then(user => {
        if (user) return;
        return Promise.reject({ code: consts.ERR_NOUSR });
      }).
      then(() => {
        socket.userId = query.userId;
        socket.spaceCode = query.spaceCode;
        next();
      }).
      catch(err => {
        next({
          data: {
            code: err && err.code,
            message: err && err.message
          }
        });
        log.sockets.debug(`${socket.id} was rejected because:`, err);
      });
  });

  // Cuando un socket se ha conectado satisfactoriamente.
  io.on('connection', socket => {

    users.connect.call(socket, socket);

    socket.on('disconnect', users.disconnect.bind(socket, socket));
    socket.on('disconnecting', users.disconnecting.bind(socket, socket));
    socket.on('room:message', rooms.message.bind(socket, socket));
  });
};
