/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Server
 * Romel Pérez, @prhonedev
 * 2014
 **/

/*
> Especificar GMT-5 y UTF-8 en rubi
> Set sounds in cellphone when typing and calling
*/

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
require('./sockets/sockets').apply(context);
require('./routes/routes').apply(context);
require('./databases/databases').apply(context);


// Iniciar
server.listen(config.port, function () {
    debug('servidor en modo ' + app.get('env'));
    debug('servidor escuchando en el puerto ' + config.port);
});
