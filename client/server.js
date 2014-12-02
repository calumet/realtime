/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | JSP-Fake-Server
 * Romel Pérez, prhone.blogspot.com
 * 2014
 **/

// TODO: Responder a los mensajes recibidos al conectarse por sockets.
// TODO: Cambiar configuración en **server** para autorizar todas las conexiones.


// Módulos
var express = require('express');
var swig = require('swig');
var cookieParser = require('cookie-parser');
var config = require('./config');
var security = require('../server/security');


// Instanciar y configurar
var app = express();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));


// URLs
app.get('/', function (req, res) {
    res.render('index');
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/logout', function (req, res) {

    // Limpiar cookie de seguridad.
    res.cookie(config.security.cookie, 'NONE', {
        domain: config.host,
        port: '*',
        path: '/'
    });

    res.redirect('/');
});
app.get('/portal', function (req, res) {

    // Aplicar cookie de seguridad para certificar la conexión de socket.
    var certificate = security.encrypt(req.query.id);
    res.cookie(config.security.cookie, certificate, {
        domain: config.host,
        port: '*',
        path: '/'
    });

    // Envíamos sólo los datos de conexión de socket y el id del usuario.
    res.render('portal/portal', {
        id: req.query.id,
        sockets: config.sockets
    });
});
app.get('/aula', function (req, res) {
    res.render('aula/aula');
});
app.get('/chat', function (req, res) {
    res.render('aula/chat');
});


// Iniciar servidor
app.listen(config.port, function () {
    console.log('Servidor en modo ' + app.get('env'));
    console.log('Servidor escuchando en el puerto ' + config.port);
});
