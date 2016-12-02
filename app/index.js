'use strict';

const http        = require('http');
const express     = require('express');
const socketio    = require('socket.io');
const chalk       = require('chalk');
const Data        = require('realtime-data');
const pkg         = require('../package');
const settings    = require('settings');
const log         = require('log');
const storage     = require('storage');
const middlewares = require('middlewares');
const router      = require('router');
const sockets     = require('sockets');

log.app.info(chalk.bold.green(`
>>>
>>> Starting: ${pkg.name} v${pkg.version}!
>>> Running on "${settings.env}" environment.
>>>`));

log.db.info('Establishing connection...');
storage.data = new Data(settings);
storage.data.db.
  authenticate().
  then(() => {
    log.db.info('Connection has been established successfully.');
  }).
  catch((err) => {
    log.db.error('Unable to connect to the database:', err);
  });

const server = express();
const httpServer = http.createServer(server);
const io = socketio(httpServer);

middlewares(server);
router(server);
sockets(io);

// Cuando la aplicación se encuentre disponible.
httpServer.listen(settings.port, settings.host, (err) => {
  if (err) throw err;
  log.app.info(`Running at http://${settings.host}:${settings.port}.`);
});

// Cuando la aplicación va a terminar.
process.on('SIGINT', () => {
  log.app.info('Closed.');
  process.exit(0);
});
