/*!
 * Grupo de Desarrollo de Software Calumet
 * Application | Server Sockets Application
 * Romel Pérez, @prhonedev
 * Abril del 2014
 **/

var _ = require('underscore');
var mysql = require('../databases/mysql');
var appdb = require('../databases/app');


// ------------------------------------------------------------------------- //
// APPLICATION //

var app = {

    // user: {ip, agent, time, id}
    authorize: function (user, handshake, connection) {

        var authorized = false;

        // Autorizar

        if (authorized) {
            connection(null, true);
        } else {
            connection('Autorización denegada!');
        }

    }

};



// ------------------------------------------------------------------------- //
// EVENTS //

module.exports = function (io) {

    // Autorization
    io.of('/app').authorization(function (handshake, connection) {

        // Recoger datos
        var user = {
            ip: handshake.address.address,
            agent: handshake.headers['user-agent'],
            time: handshake.time,
            id: handshake.query.userid
        };

        // No se envió un usuario
        if (!user.id) {
            connection('No se ha especificado un usuario de conexión.');
        }

        // Autorizar conexión
        app.authorize(user, handshake, connection);

    })

    // Connection
    .on('connection', function (socket) {

        //var context = {io: io, socket: socket};

        //socket.on('active', function (data) {
        //    app.events.active.apply(context, data);
        //});

        //socket.on('disconnect', function () {
        //    var data = {};
        //    app.events.unactive.apply(context, data);
        //});

    });

};
