/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Sockets | Portal
 * Romel Pérez, @prhonedev
 * 2014
 **/

var db = require('../databases/portal.db');
var _ = require('underscore');
var debug = require('debug')('portal:sockets');


// -------------------------------------------------------------------------- //
// PROCESSES //

var app = {

    io: null,
    express: null,

    handshake: function (socket, accept) {

        var handshake = socket.handshake;

        // Recoger datos
        var user = socket.user = {
            ip: handshake.address.address,
            agent: handshake.headers['user-agent'],
            time: handshake.time,
            id: handshake.query.userid
        };

        // Verificar datos válidos
        if (!user.id) {
            debug(user.ip + ' datos no válidos.');
            accept({data: 'ERROR_DATA'});
            return;
        }

        // Autorizar conexión
        // Para un usuario, sólo puede tener varias instancias
        // si está en la misma IP
        db.authorize(user, function (answer) {

            switch (answer) {
                case 'FOUND_NOT': {
                    debug(user.ip + ' usuario no encontrado.');
                    accept({data: 'ERROR'});
                    break;
                }
                case 'AUTH_NOT':{
                    debug(user.ip + ' usuario no autorizado.');
                    accept({data: 'AUTH_NOT'});
                    break;
                }
                case 'AUTH': {
                    debug(user.ip + ' usuario autorizado.');
                    accept();
                    break;
                }
            }

        });

    },

    connect: function (socket) {

        db.addInstance(socket.user, socket.id, function (err, doc) {
            if (err) debug(err);
        });

        // TODO: Crear una forma de comunicación con todos los usuarios
        // de la conexión del namespace /portal

        // Desinstanciar esta conexión
        socket.on('disconnect', function () {
            db.rmInstance(socket.user, socket.id, function (err) {
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
