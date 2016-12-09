const log = require('log');
const resources = require('resources');

module.exports = {

  connect (socket, details) {

    const { io, data } = resources;
    const { userId, spaceCode, roomTag } = socket.handshake.query;

    log.sockets.debug(`${socket.id} ${socket.userId} is now connected.`);

    data.models.realtime_space.
      findOne({ code: spaceCode }).
      then(space => {
        const roomsQuery = { space: space.id };
        if (roomTag) roomsQuery.or = [{ tag: roomTag }, { tag: null }];
        return data.models.realtime_space_room.find(roomsQuery).populate('users');
      }).
      then(rooms => {
        rooms.
          filter(room => {
            return room.users.find(user => user.user === userId && !user.inactive);
          }).
          forEach(room => {

            // Join user socket in room.
            socket.join(room.id);

            // Inform room users about user connection.
            socket.to(room.id).emit('room:user:connect', {
              room: room.id,
              user: userId,
            });

            log.sockets.debug(`${socket.id} ${socket.userId} joined ${room.id}.`);
          });
      }).
      catch(err => {
        log.sockets.error(`${socket.id} ${socket.userId} could not be connected:`, err);
        socket.error(err);
      });
  },

  disconnecting (socket, details) {

    const { io } = resources;
    const { userId } = socket.handshake.query;

    // When user is disconnected, inform all her rooms users about the disconnection.
    Object.keys(socket.rooms).forEach(room => {
      socket.to(room).emit('room:user:disconnect', {
        room,
        user: userId,
      });
      log.sockets.debug(`${socket.id} ${socket.userId} left ${room}.`);
    });
  },

  disconnect (socket, details) {
    log.sockets.debug(`${socket.id} ${socket.userId} was disconnected.`);
  },
};
