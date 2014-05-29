/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Server
 * Romel Pérez, @prhonedev
 * 2014
 **/

var http = require('http');
var socketio = require('socket.io');
var express = require('express');
//var swig = require('swig'); // not yet


// Servidor
var app = express();
var config = require('./config')[app.get('env')];
var server = http.createServer(app);
var io = socketio.listen(server);


// Configuración
app.use(app.router);


// Sockets
require('./sockets/app')(io);
require('./sockets/aulachat')(io);


// Routes
require('./routes/app')(app);
require('./routes/aulachat')(app);


// Iniciar
server.listen(config.port, function () {
    console.log('Servidor de sockets:');
    console.log('>>> Servidor en modo ' + app.get('env') + '!');
    console.log('>>> Servidor escuchando en el puerto ' + config.port + '!');
});
