/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Databases | Portal
 * Romel Pérez, @prhonedev
 * 2014
 **/

var _ = require('underscore');
var rubi = require('mongoose');
var debug = require('debug')('portal:db');
var config = require('../config');

/*
# rubi.users:
_id
ip
time
devices: [{
    _id: socket,
    agent: user.agent
}]
*/

// -------------------------------------------------------------------------- //
// COLLECTIONS //

var User = (function () {

    // Conectarse a la db
    rubi.connect('mongodb://' + config.mongodb.host + ':' +
    config.mongodb.port + '/' + config.mongodb.db);

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
            }]
        }, {
            collection: 'users'
        }
    ));

})();



// -------------------------------------------------------------------------- //
// PROCEDURES //

// Un usuario instancia la aplicación y es verificado
// @user  {id, ip, time, agent}
// @authorize  si el usuario está autorizado
exports.authorize = function (user, authorize) {
    
    User.findOne({_id: user.id}, function (err, myUser) {
        if (err) debug(err);
        // FIXME: Cuándo ocurre un error de búsqueda y qué hacer en tal caso

        // Usuario encontrado
        if (!!myUser) {
            // Tiene session/es
            if (myUser.devices.length) {
                user.ip === myUser.ip ?
                    authorize('AUTH') :
                    authorize('AUTH_NOT');
            }
            // No tiene sessiones
            else {
                authorize('AUTH');
            }
        }
        // No encontrado
        else {
            authorize('FOUND_NOT');
        }
    });

};



// Un usuario ha instanciado por primera vez
// @user  {id, ip, time, agent}
// @socket
// @callback
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
// @user  {id, ip, time, agent}
// @socket
// @callback
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
