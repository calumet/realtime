/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Sockets | Portal
 * Romel Pérez, @prhonedev
 * 2014
 **/

var _ = require('underscore');
var db = require('../databases/portal.db');


var app = {

    io: null,
    express: null,

    handshake: function (socket, accept) {

        var hs = socket.handshake;

        // Recoger datos
        var user = {
            ip: hs.address.address,
            agent: hs.headers['user-agent'],
            time: hs.time,
            id: hs.query.userid
        };
        socket.user = user;

        // Verificar datos válidos
        if (!user.id) {
            accept('>>> ' + user.ip + ' - no se ha especificado un usuario de conexión.');
        }
        else {
            accept();
        }

        // Autorizar conexión
        // Para un usuario, sólo puede tener varias instancias si es de la misma IP
        /*db.authorize(user, function (authorized) {
            
            // No autorizado
            if(!answer) {
                console.log('>>> ' + user.ip + ' - usuario no autorizado.');
                accept('No autorizado.');
            }
            // No encontrado
            else if (answer === 'NOT_FOUND') {
                hs.firstInstance = true;
                accept();  // Autorizar
            }
            // Autorizado
            else if (answer) {
                accept();
            }

        });*/

    },

    connect: function (socket) {

        var user = socket.user;
        console.log('/portal');
        console.dir(user);

        socket.emit('youareconnected', {
            message: 'YEAP!'
        });

        /*// Primera instancia
        if (socket.handshake.firstInstance) {
            db.firstInstance(user, socket.socket, function (err, doc) {
                if (err) {
                    console.log('>>> ' + user.ip + ' - el usuario no se puede instanciar.');
                }
            });
        }
        // No es la primera instancia
        else {
            db.addInstance(user, socket.socket, function (err, doc) {
                if (err) {
                    console.log('>>> ' + user.ip + ' - el usuario no se puede re-instanciar.');
                }
            });
        }

        // Desinstanciar esta conexión
        socket.on('disconnect', function () {
            db.rmInstance(user, socket.socket, function (err) {
                if (err) {
                    console.log('>>> ' + user.ip + ' - el usuario no se puede des-instanciar.');
                }
            });
        });*/

    }

};




// -------------------------------------------------------------------------- //
// EVENTS //

module.exports = function () {

    app.io = this.io;
    app.app = this.app;

    this.io.of('/portal', app.connect).use(app.handshake);

};
