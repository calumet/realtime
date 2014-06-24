/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Portal | Databases
 * Romel Pérez, @prhonedev
 * 2014
 **/

var _ = require('underscore');
var rubi = require('mongoose');
var config = require('../config');


// ------------------------------------------------------------------------- //
// COLLECTIONS //

var User = (function () {

    // Conectarse a la db
    rubi.connect('mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.db);

    // Error conectándose
    rubi.connection.on('error', function (err) {
        console.log('>>> Error conectándose a MongoDB: ', err.message);
    });

    // Usuarios
    return rubi.model('users', new rubi.Schema({
            _id: String,
            ip: String,
            time: Date,
            devices: [{
                socket: String,
                agent: String
            }]
        }, {
            collection: 'users'
        }
    ));

})();



// ------------------------------------------------------------------------- //
// PROCEDURES //

// Un usuario instancia la aplicación y es verificado
// @user  {id, ip, time, agent}
// @authorize  si el usuario está autorizado
exports.authorize = function (user, authorize) {
    
    User.findOne({_id: user.id}, function (err, myUser) {
        if (err) {
            console.log('>>> ' + user.ip + ' - ' + err.message);
            authorize(false);
        }

        // Usuario encontrado
        if (myUser) {
            user.ip === myUser.ip ? authorize(true) : authorize(false);
        }
        // No encontrado
        else {
            authorize('NOT_FOUND');
        }
    });

};



// Crear primer documento de usuario
// @user  {id, ip, time, agent}
// @socket
// @callback
exports.firstInstance = function (user, socket, callback) {

    User.insert({
        _id: user.id,
        ip: user.ip,
        time: user.time,
        devices: [{
            socket: socket,
            agent: user.agent
        }]
    }, callback);

};



// Un usuario ha instanciado por primera vez
// @user  {id, ip, time, agent}
// @socket
// @callback
exports.addInstance = function (user, socket, callback) {

    // Actualizar/reescribir o crear document
    User.findOneAndUpdate({
        _id: user.id
    }, {
        $set: {
            ip: user.ip,
            time: user.time
        },
        $push: {
            devices: {
                socket: socket,
                agent: user.agent
            }
        }
    }, {
        aupsert: true
    }, callback);

};



// Un usuario cierra una instancia de la aplicación
exports.rmInstance = function (user, callback) {
    //
};



// Todas las instancias del 'portal' de un usuario
exports.instances = function (user, callback) {
    //
};
