const log = require('log');
const resources = require('resources');

module.exports = {

  connect (socket, details) {

    const { io, data, connections } = resources;
    const { userId, spaceCode, roomTag } = socket.handshake.query;

    log.sockets.debug(`${socket.id} ${socket.userId} is now connected.`);

    data.models.realtime_space.
      findOne({ code: spaceCode }).
      then(space => {

        let roomsQuery;
        if (roomTag) {
          roomsQuery = {};
          roomsQuery.or = [
            { space: space.id, tag: roomTag },
            { space: space.id, tag: null }
          ];
        }
        else {
          roomsQuery = { space: space.id };
        }

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

            // Add user-room to connections list.
            const con = connections.add({
              user: socket.userId,
              room: room.id,
              socket: socket.id,
            });

            // Inform room users about user connection.
            socket.to(room.id).emit('room:user:connect', con);

            log.sockets.debug(`${socket.id} ${socket.userId} joined ${room.id}.`);
          });
      }).
      catch(err => {
        log.sockets.error(`${socket.id} ${socket.userId} could not be connected:`, err);
        socket.error(err);
      });
  },

  disconnecting (socket, details) {

    const { io, connections } = resources;
    const { userId } = socket.handshake.query;

    // When user is disconnected, inform all her rooms users about the disconnection.
    Object.keys(socket.rooms).forEach(room => {
      const con = connections.getAll().find(con => {
        return con.socket === socket.id && String(con.room) === String(room) && con.user === userId;
      });
      socket.to(room).emit('room:user:disconnect', con);
      log.sockets.debug(`${socket.id} ${socket.userId} left ${room}.`);
    });

    // Remove socket from connections list.
    connections.removeBySocket(socket.id);
  },

  disconnect (socket, details) {
    log.sockets.debug(`${socket.id} ${socket.userId} was disconnected.`);
  },
};
