/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | Server
 * Romel Pérez, @prhonedev
 * Marzo del 2014
 **/

// ------------------------------------------------------------------------- //
// SERVER APPLICATION //

var port = 9000;

// Módulos
var http = require('http');
var express = require('express');
var swig = require('swig');
var socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);


// Configuración
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.engine('html', swig.renderFile);
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/public'));


// Iniciar server
server.listen(port, function () {
    console.log('>>> Escuchando servidor en el puerto ' + port + '!');
    console.log('>>> Servidor en modo "' + app.settings.env + '"!');
});


// URLs
require('./urls').listen(app);


// Sockets
require('./sockets').listen(io);
