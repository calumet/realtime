/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | JSP-Server
 * Romel Pérez, @prhonedev
 * 2014
 **/

// Módulos
var express = require('express');
var swig = require('swig');
var config = require('./config');



// Instanciar y configurar
var app = express();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// URLs
app.get('/', function (req, res) {
    res.redirect('/login');
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/portal', function (req, res) {
    res.render('portal', {
        id: req.query.id,
        clase: req.query.clase,
        name: req.query.name,
        photo: req.query.photo,

        socketsServer: config.sockets
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
app.listen(config.port, function () {
    console.log('>>> Servidor JSP:');
    console.log('>>> Servidor en modo ' + app.get('env'));
    console.log('>>> Servidor escuchando en el puerto ' + config.port);
});
