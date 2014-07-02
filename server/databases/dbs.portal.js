/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Databases | Portal
 * Romel Pérez, @prhonedev
 * 2014
 **/

var _ = require('underscore');
var rubi = require('mongoose');
var debug = require('debug')('dbs:portal');
var config = require('../config');


// -------------------------------------------------------------------------- //
// COLLECTIONS //

var User = (function () {

    // Conectarse a la db
    rubi.connect('mongodb://' + config.mongodb.host + ':'
        + config.mongodb.port + '/' + config.mongodb.db, {
        user: config.mongodb.user,
        pass: config.mongodb.pass
    });

    // Error al conectarse
    rubi.connection.on('error', function (err) {
        debug(err);
    });

    // Usuarios
    return rubi.model('users', new rubi.Schema({
            _id: String,
            ip: String,
            time: Date,
            devices: [{
                _id: String,
                agent: String
            }],
            admin: Boolean
        }, {
            collection: 'users'
        }
    ));

})();



// -------------------------------------------------------------------------- //
// PROCEDURES //

// Resetear todas las instancias de conexión de usuarios
// @param  {Function}  callback(err, result)
exports.reset = function (callback) {

    User.update({}, {
        $set: {
            devices: []
        }
    }, {
        multi: true
    }, callback);

};



/**
 * Autorizar usuario si cumple las condiciones de conexión
 * @param  user  {id, ip, time, agent}
 * @param  authorize Callback con el posible mensaje de respuesta
 * AUTH | AUTH_NOT | NOT_FOUND
 */
exports.authorize = function (user, authorize) {
    
    User.findOne({_id: user.id}, function (err, myUser) {
        if (err) {
            debug(user.id + ' error autorizando: ' + err.message);
            authorize('AUTH_NOT');
            return;
        }

        // TODO: Verificar que no haya otro usuario conectado con la misma ip

        // Usuario encontrado
        if (!!myUser) {
            // Tiene session/es
            if (myUser.devices.length) {
                user.ip === myUser.ip ?
                    authorize('AUTH') :
                    authorize('NOT_AUTH');
            }
            // No tiene sessiones
            else {
                authorize('AUTH');
            }
        }
        // No encontrado
        else {
            authorize('NOT_FOUND');
        }
    });

};



// Un usuario se conecta y crea una instancia
// @param  {Function}  callback(err, result)
exports.addInstance = function (user, socket, callback) {

    User.findOneAndUpdate({
        _id: user.id
    }, {
        $set: {
            time: user.time,
            ip: user.ip
        },
        $push: {
            devices: {
                _id: socket,
                agent: user.agent
            }
        }
    }, callback);

};



// Un usuario cierra una instancia de la aplicación
// @param  {Function}  callback(err, result)
exports.rmInstance = function (user, socket, callback) {

    User.findOne({
        _id: user.id
    }, function (err, doc) {
        if (err) {
            callback.apply(this, arguments);
            return;
        }

        doc.devices = _.reject(doc.devices, function (el) {
            return socket ===  el._id;
        });

        doc.save(callback);
    });

};



// Verificar si un usuario es administrador
// Llama al callback con: true | false
exports.isAdmin = function (id, callback) {

    User.findOne({
        _id: id
    }, function (err, user) {
        if (err) {
            callback(false);
            return;
        }
        user.admin ? callback(true) : callback(false);
    });

};



// Conseguir datos estadísticos del portal
// @param  {Function}  callback(err, result)
exports.stats = function (callback) {

    User.count({
        $where: 'this.devices.length > 0'
    }, callback);

};
