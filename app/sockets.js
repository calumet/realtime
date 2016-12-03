const users = require('events/users');
const rooms = require('events/rooms');

const sockets = function (io) {
  io.on('connection', socket => {

    users.connect.call(socket, io, socket);

    socket.on('disconnect', users.disconnect.bind(socket, io, socket));

    socket.on('room:message', rooms.message.bind(socket, io, socket));
  });
};

module.exports = sockets;
