const _ = require('lodash');
const consts = require('consts');
const log = require('log');
const resources = require('resources');

const get = function (req, res, next) {

  const { data, connections } = resources;
  const { spaceCode, userId, roomTag } = req.query;

  if (!spaceCode) {
    return res.status(400).json({
      code: consts.ERR_NOSPACE
    });
  }

  if (!userId) {
    return res.status(400).json({
      code: consts.ERR_NOUSR
    });
  }

  // Buscar el espacio y el usuario. Si alguno de los dos no existe, procesar error,
  // sino, procesar el espacio.
  Promise.all([
    data.models.realtime_space.findOne({ code: spaceCode }),
    data.models.user.findOne({ id: userId })
  ]).
    then(results => {
      const [space, user] = results;

      if (!space) return res.status(400).json({ code: consts.ERR_NOSPACE });
      if (!user) return res.status(400).json({ code: consts.ERR_NOUSR })

      return processSpace(space);
    }).
    catch(err => {
      log.router.error(err);
      res.status(400).json({ code: consts.ERR });
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

        // Crear una lista de todos los identificadores de los usuarios en
        // las salas del usuario proveido y buscarlos.
        const usersIds = _(response.roomsUsers).
          map(roomUser => roomUser.user).
          uniq().
          value();
        return data.models.user.find({ id: usersIds });
      }).
      then(users => {
        response.users = users;

        // Si el usuario existe pero no se encuentra en ninguna sala, agregelo
        // a la lista de usuarios de todos modos.
        if (!users.length) {
          return data.models.user.findOne({ id: userId }).then(user => {
            response.users = [user];
          });
        }
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
        res.status(500).json({ code: consts.ERR });
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
