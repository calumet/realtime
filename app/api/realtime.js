const _ = require('lodash');
const log = require('log');
const resources = require('resources');

const get = function (req, res, next) {

  const { data, connections } = resources;
  const { spaceCode, userId, roomTag } = req.query;

  if (!spaceCode || !userId) {
    return res.status(400).end();
  }

  data.models.realtime_space.
    findOne({ code: spaceCode }).
    then(space => {
      if (space) return processSpace(space);
      throw new Error('Space not found.');
    }).
    catch(err => {
      log.router.error(err);
      res.status(400).end();
    });

  function processSpace (space) {

    const response = { space };
    const roomsQuery = getRoomsQuery(space);

    data.models.realtime_space_room.
      find(roomsQuery).
      populate('users').
      populate('messages').
      then(rooms => {
        response.rooms = rooms.filter(room => {
          return room.users.find(user => user.user === userId && !user.inactive);
        });

        response.roomsMessages = [];
        response.rooms.forEach(room => {
          response.roomsMessages = response.roomsMessages.concat(room.messages);
        });

        response.roomsUsers = [];
        response.rooms.forEach(room => {
          response.roomsUsers = response.roomsUsers.concat(room.users);
        });

        response.rooms = response.rooms.map(room => {
          return _.omit(room, ['users', 'messages']);
        });
      }).
      then(() => {
        const usersIds = _(response.roomsUsers).
          map(roomUser => roomUser.user).
          uniq().
          value();
        return data.models.user.find({ id: usersIds });
      }).
      then(users => {
        response.users = users;
      }).
      then(() => {
        response.connections = connections.
          getAll().
          filter(con => response.rooms.find(room => room.id === con.room));
      }).
      then(() => {
        res.json(response);
      }).
      catch(err => {
        log.router.error(err);
        res.status(500).end();
      });
  }

  function getRoomsQuery (space) {
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
    return roomsQuery;
  }
};

module.exports = {
  get
};
