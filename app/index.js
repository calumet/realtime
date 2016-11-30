const http        = require('http');
const express     = require('express');
const socketio    = require('socket.io');
const chalk       = require('chalk');
const settings    = require('settings');
const middlewares = require('middlewares');
const router      = require('router');
const sockets     = require('sockets');
const log         = require('log');
const pkg         = require('../package');

log.app.info(chalk.bold.green(`
>>>
>>> Starting: ${pkg.name} v${pkg.version}!
>>> Running on "${settings.env}" environment.
>>>`));

const server = express();
const httpServer = http.createServer(server);
const io = socketio(httpServer);

middlewares(server);
router(server);
sockets(io);

// Cuando la aplicación se encuentre disponible.
httpServer.listen(settings.port, settings.host, err => {
  if (err) throw err;
  log.app.info(`Running at http://${settings.host}:${settings.port}.`);
});

// Cuando la aplicación va a terminar.
process.on('SIGINT', function () {
  log.app.info('Closed.');
  process.exit(0);
});
