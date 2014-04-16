/*!
 * Grupo de Desarrollo de Software Calumet
 * Application | Server Sockets Application
 * Romel Pérez, @prhonedev
 * Abril del 2014
 **/

var _ = require('underscore');
var db = require('../../databases');


// ------------------------------------------------------------------------- //
// APPLICATION //

var app = {

    //

    events: {

        //

    }

};



// ------------------------------------------------------------------------- //
// EVENTS //

module.exports = function (io) {

    // Autorization
    io.of('/app').authorization(function (handshake, connection) {

        var user = {
            ip: handshake.address.address,
            agent: handshake.headers['user-agent'],
            time: handshake.time,
            id: handshake.query.userid
        };

        app.authorize(
            user,
            // Usuario permitido
            function () {
                connection(null, true);  // Permitir conexión
                // Guardar datos de conexión
            },
            // Usuario no permitido
            function () {
                connection('Usuario no autorizado.');
                // Denegar otras conexiones del mismo usuario
            }
        );

    })

    // Connection
    .on('connection', function (socket) {

        var context = {io: io, socket: socket};

        //socket.on('active', function (data) {
        //    app.events.active.apply(context, data);
        //});

        socket.on('disconnect', function () {
            //var data = {};
            //app.events.unactive.apply(context, data);
        });

    });

};
