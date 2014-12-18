/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Sockets | Portal
 * Romel Pérez, prhone.blogspot.com
 * 2014
 **/

var _ = require('underscore');
var cookie = require('cookie');
var debug = require('debug')('socket:portal');
var config = require('../config');
var security = require('../security');
var db = require('../databases/dbs.portal');


// -------------------------------------------------------------------------- //
// PORTAL | SOCKET //

var app = {

    io: null,
    express: null,

    /**
     * Proceso de validación de conexión de socket portal con usuario
     * @param  socket  Es la conexión del socket estableciéndose
     * @param  accept  Callback a ejecutar con el mensaje de conexión
     * Las posibles respuestas al usuario por la conexión son:
     * > ERROR       Error en el proceso de conexión
     * > ERROR_DATA  Datos erroneos
     * > NOT_AUTH    Usuario no autenticado
     * > NOT_FOUND   Usuario no encontrado
     * > DUPLICATE   Segunda conexión por computadora
     * > undefined   Usuario aceptado
     */
    handshake: function (socket, authorize) {

        // Función de registrar respuesta de conexión.
        var accept = function (state) {
            if (state) debug(socket.handshake.address + ' ' + state);
            authorize(state ? {data: state} : undefined);
        };

        // Recoger datos y guardarlos con referencias.
        var user = socket.user = {
            ip: socket.handshake.address,
            agent: socket.handshake.headers['user-agent'],
            time: socket.handshake.time,
            id: socket.handshake.query.userid  // Identificador del usuario
        };

        // Verificar datos válidos.
        if (!user.id) {
            accept('ERROR_DATA');
            return;
        }

        // Verificar que tenga la cookie de seguridad y que sea compartida.
        // Se encripta el id del usuario con la clave privada compartida.
        var cookies = cookie.parse(socket.handshake.headers.cookie);
        var localKey = security.encrypt(user.id).toUpperCase();
        var sentKey = cookies[config.security.cookie];
        if (!sentKey || (sentKey && localKey !== String(sentKey).toUpperCase())) {
            accept('NOT_AUTH');
            return;
        }

        // Analizar datos de usuario en base de datos.
        // Sólo multiples instancias del portal desde la misma IP.
        db.users.findOne({_id: user.id}, function (err, myUser) {

            // Error buscando en base de datos.
            if (err) {
                debug(err.name + ': ' + err.message);
                accept('ERROR');
                return;
            }

            // TODO: Verificar que desde la misma IP, la misma computadora,
            // sólo haya un único usuario conectado.
            // HINT: Probar en conexiones con proxies.

            // Usuario encontrado
            if (!!myUser) {

                // Tiene session/es
                if (myUser.devices.length) {
                    (user.ip === myUser.ip) ? accept() : accept('DUPLICATE');
                }

                // No tiene sessiones
                else {
                    accept();
                }
            }

            // No encontrado
            else {
                accept('NOT_FOUND');
            }
        });
    },


    /**
     * Conexión por socket con el usuario (.on('connect', connect)).
     * @param  socket  El socket de conexión
     */
    connect: function (socket) {

        // Usuario conectado.
        debug(socket.user.ip + ' conectado.');

        // Registrar instancia de conexión por ya estar conectado.
        db.addInstance(socket.user, socket.id, function (err, doc) {
            if (err) debug(err);
        });

        // Remover instancia de conexión al desconectarse.
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

    var self = this;
    app.io = this.io;
    app.express = this.express;

    // Cuando la conexión con la base de datos esté disponible
    db.init(function () {
        self.io.of('/portal', app.connect).use(app.handshake);
    });
};
