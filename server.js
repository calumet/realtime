/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Server
 * Romel Pérez, prhone.blogspot.com
 * Febrero, 2015
 **/

// Módulos.
var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var log = require('./libs/log')('server');
var config = require('./config');

// Instanciar el servidor web y el servidor de sockets.
var app = express();
var server = http.Server(app);
var io = socketio(server);

// Inicializando los componentes funcionales.
var context = {
  express: app,
  io: io
};
require('./databases').call(context, function () {

  // Cuando las bases de datos estén listas.
  require('./routes').apply(context);
  require('./sockets').apply(context);
});

// Iniciar.
server.listen(config.port, function (err) {
  if (err) throw err;
  
  log.info('modo '+ app.get('env'));
  log.info('escuchando en el puerto '+ config.port);
});
