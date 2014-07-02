/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | JSP-Server
 * Romel Pérez, @prhonedev
 * 2014
 **/

// Módulos
var express = require('express');
var swig = require('swig');
var crypto = require('crypto');
var config = require('./config');


// Instanciar y configurar
var app = express();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// URLs
app.get('/', function (req, res) {
    res.render('index');
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/logout', function (req, res) {
    res.cookie(config.security.cookie, 'NONE', {
        domain: '127.0.0.1',
        path: '/'
    });
    res.redirect('/');
});

app.get('/portal', function (req, res) {
    // Codificar mensaje para comunicación entre servidores
    var encrypt = function(data) {
        var iv = new Buffer('0000000000000000');
        var key = config.security.key;
        var decodeKey = crypto.createHash('sha256').update(key, 'utf-8').digest();
        var cipher = crypto.createCipheriv('aes-256-cbc', decodeKey, iv);
        return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    };
    var certificate = encrypt(req.query.id);
    res.cookie(config.security.cookie, certificate, {
        domain: '127.0.0.1',
        path: '/'
    });

    // Renderizar portal con datos de usuario y para conexión
    res.render('portal/portal', {
        id: req.query.id,
        clase: req.query.clase,
        name: req.query.name,
        photo: req.query.photo,
        sockets: config.sockets
    });
});
app.get('/admin', function (req, res) {
    res.render('portal/admin', {
        id: req.query.id,
        clase: req.query.clase,
        name: req.query.name,
        photo: req.query.photo,
        sockets: config.sockets
    });
});

app.get('/aula', function (req, res) {
    res.render('aula/aula', {
        id: req.query.id,
        clase: req.query.clase,
        name: req.query.name,
        photo: req.query.photo
    });
});
app.get('/chat', function (req, res) {
    res.render('aula/chat');
});


// Iniciar servidor
app.listen(config.port, function () {
    console.log('Servidor en modo ' + app.get('env'));
    console.log('Servidor escuchando en el puerto ' + config.port);
});
