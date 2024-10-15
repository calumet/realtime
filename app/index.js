'use strict';

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const chalk = require('chalk');
const pkg = require('../package');
const settings = require('settings');
const log = require('log');
const resources = require('resources');
const middlewares = require('middlewares');
const sockets = require('sockets');
const pool = require('./settings/pool-connections');

log.app.info(chalk.bold.green(`
>>>
>>> Starting: ${pkg.name} v${pkg.version}!
>>> Running on "${settings.env}" environment.
>>>`));

const server = express();
const httpServer = http.createServer(server);
const io = socketio(httpServer);

resources.server = server;
resources.io = io;

middlewares();
sockets();

// Cuando la aplicación se encuentre disponible.
httpServer.listen(settings.port, settings.host, (err) => {
  if (err) {
    log.app.error(err);
    process.exit(1);
  }
  log.app.info(`Running at http://${settings.host}:${settings.port}.`);
});

// Cuando la aplicación va a terminar.
process.on('SIGINT', () => {
  log.app.info('Closed.');
  const dbConnections = pool.poolConnections;
  for (const key in dbConnections) {
    if (dbConnections[key] && dbConnections[key].db.teardown) {
      dbConnections[key].db.teardown();
    }
  }
  process.exit(0);
});
