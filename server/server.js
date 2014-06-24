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


// Configuración
var config = require('./config');
var env = process.env.NODE_ENV || 'development';


// Instanciar
var app = express();
var io = socketio();
var server = http.createServer(app);


// Componentes funcionales
require('./portal')({app: app, io: io});
require('./aulachat')({app: app, io: io});


// Iniciar
io.listen(server);
app.listen(config.port, function () {
    console.log('>>> Servidor de sockets:');
    console.log('>>> Servidor en modo ' + env);
    console.log('>>> Servidor escuchando en el puerto ' + config.port);
});
