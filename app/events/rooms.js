const log = require('log');
const resources = require('resources');

module.exports = {

  message (socket, details) {

    const { io, data } = resources;
    const { room, content } = details || {};
    const newMessage = { user: socket.userId, room, content };

    data.models.realtime_room_message.
      create(newMessage).
      exec(function (err, res) {
        if (err) {
          log.sockets.error(`${socket.id} ${socket.userId} message could not be send:`, err, res);
          socket.error(err, res);
          return;
        }

        // Inform all room users (including sender) the new message.
        io.sockets.to(room).emit('room:message', res);
        log.sockets.debug(`${socket.id} ${socket.userId} sent a message:`, res);
      });
  },
};
