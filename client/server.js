/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | JSP-Server
 * Romel Pérez, @prhonedev
 * 2014
 **/

var http = require('http');
var express = require('express');
var swig = require('swig');


// Módulos
var app = express();
var config = require('./config')[app.get('env')];
var server = http.createServer(app);



// Configuración
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.engine('html', swig.renderFile);
app.use(app.router);
app.use(express.static(__dirname + '/public'));



// URLs
app.get('/', function (req, res) {
    res.redirect('/login');
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/app', function (req, res) {
    res.render('app', {
        id: req.query.id,
        clase: req.query.clase,
        name: req.query.name,
        photo: req.query.photo
    });
});
app.get('/aula', function (req, res) {
    res.render('aula', {
        id: req.query.id,
        clase: req.query.clase,
        name: req.query.name,
        photo: req.query.photo
    });
});
app.get('/chat', function (req, res) {
    res.render('chat');
});



// Iniciar servidor
server.listen(config.port, function () {
    console.log('Servidor cliente simulando el de JSP:');
    console.log('>>> Servidor en modo ' + app.get('env') + '!');
    console.log('>>> Servidor escuchando en el puerto ' + config.port + '!');
});
