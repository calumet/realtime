/*!
 * PRHONE Applications
 * Chat | Server
 * Romel Pérez, 2013
 **/

// ------------------------------------------------------------------------- //
// SERVER APPLICATION //

var port = 9000;

// Main objects
var http = require('http');
var express = require('express');
var swig = require('swig');
var socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);


// Configuration
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.engine('html', swig.renderFile);
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/public'));


// Start server
server.listen(port, function () {
    console.log('>>> Server listening at port ' + port + '!');
    console.log('>>> Server running in mode "' + app.settings.env + '"!');
});


// URLs
require('./urls').listen(app);


// SOCKETS
require('./sockets').listen(io);
