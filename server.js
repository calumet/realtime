/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | Server
 * Romel Pérez, @prhonedev
 * Abril del 2014
 **/

// ------------------------------------------------------------------------- //
// SERVER APPLICATION //

// Módulos
/*var http = require('http');
var express = require('express');
var swig = require('swig');
var socketio = require('socket.io');

var app = express();
var config = require('./config')[app.get('env')];

var server = http.createServer(app);
// Servidor de socket.io en el mismo puerto del de expressjs
var io = socketio.listen(server);


// Configuración
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.engine('html', swig.renderFile);
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/public'));


// Sockets
require('./sockets/sockets')(io);


// URLs
require('./urls')(app);


// Iniciar server
server.listen(config.port, function () {
    console.log('>>> Servidor en modo ' + app.get('env') + '!');
    console.log('>>> Servidor escuchando en el puerto ' + config.port + '!');
});*/



// ------------------------------------------------------- //
// MONGODB TESTS //

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/learn');
mongoose.connection.on('error', function (err) {
    console.log('>>> Ha ocurrido un error al conectarse a MongoDB!');
    console.dir(err);
});
var Acol = mongoose.model('acol', new mongoose.Schema({
    id: String,
    name: String,
    devices: [{dato: String}]
}), 'acol');

// Create a Save Document
/*var example = new Acol({
    id: 'UID002',
    devices: [
        {dato: "Wohoo!"},
        {dato: "Extraño!"},
        {dato: "Incontrolable!"}
    ]
});
example.save(function (err, example) {
    console.log('Model saved!');
});*/

// Find a Document
/*var e = Acol.findOne({id: 'UID002'}, 'id devices', function (err, dato) {
    console.log(dato.devices[0].dato);
    dato.update({$set: {name: 'Something weird!'}}).exec();
});*/

// Update a Document
Acol.update({id: 'UID002'}, {name: 'Romel Pérez'}, function (raw, n) {
    console.log('Raw: ', raw);
    console.log('Number: ', n);
});