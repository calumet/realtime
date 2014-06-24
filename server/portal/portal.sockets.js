/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Portal | Sockets
 * Romel Pérez, @prhonedev
 * 2014
 **/

var _ = require('underscore');
var db = require('./portal.db');


// -------------------------------------------------------------------------- //
// EVENTS //

module.exports = function () {

    var io = this.io;
    var app = this.app;

    // Handshaking
    // @handshake.query.userid
    // FIXTHIS: Certificar que realmente es el usuario, no otra persona
    io.of('/portal').authorization(function (handshake, connection) {

        // Recoger datos
        var user = {
            ip: handshake.address.address,
            agent: handshake.headers['user-agent'],
            time: handshake.time,
            id: handshake.query.userid
        };
        handshake.user = user;

        // Verificar datos válidos
        if (!user.id) {
            connection('>>> ' + user.ip + ' - no se ha especificado un usuario de conexión.');
        }

        // Autorizar conexión
        // Para un usuario, sólo puede tener varias instancias si es de la misma IP
        db.authorize(user, function (authorized) {
            
            // No autorizado
            if(!answer) {
                console.log('>>> ' + user.ip + ' - usuario no autorizado.');
                connection('No autorizado.');
            }
            // No encontrado
            else if (answer === 'NOT_FOUND') {
                handshake.firstInstance = true;
                connection(null, true);  // Autorizar
            }
            // Autorizado
            else if (answer) {
                connection(null, true);
            }

        });

    })

    // Connection
    .on('connection', function (socket) {

        var user = socket.handshake.user;

        // Primera instancia
        if (socket.handshake.firstInstance) {
            db.firstInstance(user, socket, function (err, doc) {
                if (err) {
                    console.log('>>> ' + user.ip + ' - el usuario no se puede instanciar.');
                }
            });
        }
        // No es la primera instancia
        else {
            db.addInstance(user, socket, function (err, doc) {
                if (err) {
                    console.log('>>> ' + user.ip + ' - el usuario no se puede re-instanciar.');
                }
            });
        }

    });

};
