/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Databases | Portal
 * Romel Pérez, prhone.blogspot.com
 * 2014
 **/

var config = require('../config');
var _ = require('underscore');
var rubi = require('../libs/rubi');
var diamante = require('../libs/diamante');
var debug = require('debug')('dbs:portal');


// -------------------------------------------------------------------------- //
// PROCEDURES //

// Referencias a los controladores de las bases de datos.
module.exports.rubi = exports.rubi = rubi;
module.exports.diamante = exports.diamante = diamante;


/**
 * Inicialización de procesos con las bases de datos.
 * @param  {function} success Al haberse conectado
 * @param  {function} error   Cuando ocurra un error
 */
module.exports.init = exports.init = rubi.connect;


/**
 * Resetear todas las instancias de conexión de usuarios.
 * @param  {Function} callback function(err,result){}
 */
module.exports.reset = exports.reset = function (callback) {
    rubi.users.update({}, {
        $set: {
            devices: []
        }
    }, {
        multi: true
    }, callback);
};


/**
 * Un usuario se conecta y crea una instancia.
 * @param {Object}   user     {id, ip, time, agent}
 * @param {Object}   socket
 * @param {Function} callback function(err,result){}
 */
module.exports.addInstance = exports.addInstance = function (user, socket, callback) {
    rubi.users.findOneAndUpdate({
        _id: user.id
    }, {
        $set: {
            time: new Date(user.time),
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


/**
 * Un usuario cierra una instancia de la aplicación.
 * @param  {Object}   user     {id, ip, time, agent}
 * @param  {Object}   socket
 * @param  {Function} callback function(err,result){}
 */
module.exports.rmInstance = exports.rmInstance = function (user, socket, callback) {

    rubi.users.findOne({
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


/**
 * Verificar si un usuario es administrador.
 * @param  {String}   id       Identificador del usuario
 * @param  {Function} callback function(esAdmin){}
 */
module.exports.isAdmin = exports.isAdmin = function (id, callback) {
    rubi.users.findOne({
        _id: id
    }, function (err, user) {
        if (err) {
            callback(false);
            return;
        }
        user.admin ? callback(true) : callback(false);
    });
};


/**
 * Conseguir cantidad de conectados.
 * @param  {Function} callback function(err,results){}
 */
module.exports.count = exports.stats = function (callback) {
    rubi.users.count({
        $where: 'this.devices.length > 0'
    }, callback);
};
