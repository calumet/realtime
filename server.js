/*!
 * PRHONE Applications
 * Chat | Server
 * Romel Pérez, 2013
 **/

var port = 3000;

// ------------------------------------------------------------------------- //
// SERVER APPLICATION //

// Main objects
var express = require('express');
var http = require('http');
var hbs = require('hbs');
var socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);


// Configuration
app.set('view engine', 'html');
app.set('views', './views');
app.engine('html', hbs.__express);
app.use(express.static('public'));
app.use(express.bodyParser());


// Start server
server.listen(port);
console.log('Server Listening at port ' + port + '!');


// URLs
require('./urls').listen(app);


// SOCKETS
require('./sockets').listen(io);
