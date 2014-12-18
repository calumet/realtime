/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Server
 * Romel Pérez, prhone.blogspot.com
 * 2014
 **/

// Módulos
var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var debug = require('debug')('server');
var config = require('./config');


// Instanciar
var app = express();
var server = http.Server(app);
var io = socketio(server);


// Componentes funcionales
var context = {express: app, io: io};
require('./sockets').apply(context);
require('./routes').apply(context);
require('./databases').apply(context);


// Iniciar
server.listen(config.port, function (err) {
    if (err) debug(err);
    debug('modo ' + app.get('env'));
    debug('escuchando en el puerto ' + config.port);
});
