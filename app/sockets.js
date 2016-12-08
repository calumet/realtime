const users = require('events/users');
const rooms = require('events/rooms');

const sockets = function (server, io) {

  io.use((socket, next) => {
    // TODO: Apply a security middleware using
    // `socket.handshake.query` properties for validation.
    next();
  });

  io.on('connection', socket => {

    users.connect.call(socket, io, socket);

    socket.on('disconnect', users.disconnect.bind(socket, io, socket));

    socket.on('room:message', rooms.message.bind(socket, io, socket));
  });
};

module.exports = sockets;
