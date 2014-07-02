/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Sockets | Portal
 * Romel Pérez, @prhonedev
 * 2014
 **/

var _ = require('underscore');
var cookie = require('cookie');
var debug = require('debug')('socket:portal');
var config = require('../config');
var security = require('../security');
var db = require('../databases/dbs.portal');


// -------------------------------------------------------------------------- //
// PORTAL | SOCKETS //

var app = {

    io: null,
    express: null,

    /**
     * Proceso de validación de conexión de socket portal con usuario
     * @param  socket  Es la conexión del socket estableciéndose
     * @param  accept  Callback a ejecutar con el mensaje de conexión
     * Las posibles respuestas al usuario por la conexión son:
     * ERROR_DATA | ERROR_AUTH | ERROR | undefined (aceptar conexión)
     */
    handshake: function (socket, accept) {

        // Recoger datos
        var user = socket.user = {
            ip: socket.handshake.address.address,
            agent: socket.handshake.headers['user-agent'],
            time: socket.handshake.time,
            id: socket.handshake.query.userid
        };


        // Verificar datos válidos
        if (!user.id) {
            debug(user.ip + ' datos no válidos.');
            accept({data: 'ERROR_DATA'});
            return;
        }


        // Verificar que sea un usuario ya validado en JSP
        var cookies = cookie.parse(socket.handshake.headers.cookie);
        var localKey = security.encrypt(user.id).toUpperCase();
        var sentKey = cookies[config.security.cookie].toUpperCase();
        if (localKey !== sentKey) {
            debug(user.ip + ' no autentificado.');
            accept({data: 'ERROR_AUTH'});
            return;
        }


        // Autorizar conexión
        // Para un usuario, sólo puede tener varias instancias
        // si está en la misma IP
        db.authorize(user, function (answer) {

            if (answer === 'AUTH') {
                debug(user.ip + ' conectado.');
                accept();  // Conexión aceptada
            } else {
                debug(user.ip + ' usuario no autorizado.');
                accept({data: 'ERROR'});
            }

        });

    },


    /**
     * Conexión por socket con el usuario
     * @param  socket  El socket de conexión
     */
    connect: function (socket) {

        // Registrar instancia de conexión por ya estar conectado
        db.addInstance(socket.user, socket.id, function (err, doc) {
            if (err) debug(err);
        });


        // Remover instancia de conexión al desconectarse
        socket.on('disconnect', function () {
            debug(socket.user.ip + ' desconectado.');
            db.rmInstance(socket.user, socket.id, function (err, doc) {
                if (err) debug(err);
            });
        });

    }

};



// -------------------------------------------------------------------------- //
// EVENTS //

module.exports = function () {

    app.io = this.io;
    app.express = this.express;

    this.io.of('/portal', app.connect).use(app.handshake);

};
