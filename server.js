/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Server
 * Romel Pérez, prhone.blogspot.com
 * 2015
 **/

// Módulos.
var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var debug = require('debug')('server');
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
  if (err) debug(err);
  
  debug('modo '+ app.get('env'));
  debug('escuchando en el puerto '+ config.port);
});
