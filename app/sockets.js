const consts = require('consts');
const log = require('log');
const resources = require('resources');
const security = require('tools/security');
const users = require('events/users');
const rooms = require('events/rooms');
const Data = require('./realtime-data/index.js');
const dbConfigs = require('settings/db-configs');
const router = require('./router.js')
const pool = require('./settings/pool-connections');

module.exports = function () {

  const { io } = resources;

  // Verificación de seguridad.
  io.use((socket, next) => {

    const { token, userId } = socket.handshake.query;
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


  const dbConnections = pool.poolConnections;

  io.use((socket, next) => {
    const { schoolName } = socket.handshake.query;

    if (dbConnections[schoolName]) {
      resources.data = dbConnections[schoolName];
      log.db.info(`Reusing existing connection to ${schoolName}.`);
      return next();
    }

    const config = dbConfigs[schoolName];
    const newConnection = new Data({
      mysql: {
        schoolName: config.schoolName,
        host: config.host,
        port: config.port,
        db: config.db,
        user: config.user,
        pass: config.pass
      }
    });

    newConnection.init(err => {
      if (err) {
        log.db.error(`Error connecting to ${config.db}:`, err);
        process.exit(1);
      } else {
        log.db.info(`Connection to ${config.db} established for ${schoolName}.`);
        dbConnections[schoolName] = newConnection;
        resources.data = newConnection;
        next();
      }
    });
  });

  // Verificación de datos.
  io.use((socket, next) => {

    const { data } = resources;
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

    router();
    users.connect.call(socket, socket);

    socket.on('disconnect', users.disconnect.bind(socket, socket));
    socket.on('disconnecting', users.disconnecting.bind(socket, socket));
    socket.on('room:message', rooms.message.bind(socket, socket));
  });
};
