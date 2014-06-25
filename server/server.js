/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Server
 * Romel Pérez, @prhonedev
 * 2014
 **/

// Módulos
var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var config = require('./config');


// Instanciar
var app = express();
var server = http.Server(app);
var io = socketio(server);


// Componentes funcionales
var context = {app: app, io: io};
require('./sockets/sockets').apply(context);
//require('./routes/routes').apply(context);


// Iniciar
server.listen(config.port, function () {
    console.log('>>> Servidor de sockets:');
    console.log('>>> Servidor en modo ' + app.get('env'));
    console.log('>>> Servidor escuchando en el puerto ' + config.port);
});
