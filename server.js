/*!
 * PRHONE Applications
 * Central | Server
 * Romel Pérez, 2013
 **/

// ------------------------------------------------------------------------- //
// SERVER APPLICATION //

// Main objects
var port = 3000;
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var hbs = require('hbs');

// Start server
server.listen(port);
console.log('Listening at '+ port);

// URLs
require('./urls').listen(app);

// SOCKETS
require('./sockets').listen(io);

app.set('view engine', 'html');
app.set('views', './views');
app.engine('html', hbs.__express);
app.use(express.static('public'));
