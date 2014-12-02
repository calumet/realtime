/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Libraries | Rubi
 * Romel Pérez, prhone.blogspot.com
 * 2014
 **/

var rubi = require('mongoose');
var debug = require('debug')('libs:rubi');
var config = require('../config');


// -------------------------------------------------------------------------- //
// COLLECTIONS //

// Usuarios
var UsersSchema = rubi.Schema({
    _id: String,
    codEst: Number,
    codPos: Number,
    codProf: Number,
    active: Boolean,  // es un usuario activo
    admin: Boolean,  // es un administrador
    name: String,
    photo: String,
    ip: String,  // última ip conectada
    time: Date,  // último login
    devices: [{
        _id: String,  // socket
        agent: String  // el user-agent del navegador
    }]
}, {
    collection: 'users'
});
var UsersModel = rubi.model('users', UsersSchema);


// -------------------------------------------------------------------------- //
// PUBLIC //

var controller = {

    // Mongoose
    db: rubi,

    // Modelo de usuarios
    users: UsersModel,

    // Conectarse
    connect: function (success, error) {

        // Error al conectarse
        rubi.connection.on('error', function (err) {
            if (error) error.apply(arguments);
            debug(err);
        });

        // Cuando esté conectado
        rubi.connection.once('open', success);

        // Conectarse a la db
        rubi.connect('mongodb://' + config.mongodb.host + ':' + config.mongodb.port
        + '/' + config.mongodb.db, {
            user: config.mongodb.user,
            pass: config.mongodb.pass,
            server: {socketOptions: {keepAlive: 1}},
            replset: {socketOptions: {keepAlive: 1}}
        });

        return this;
    },

    // Disconectarse
    disconnect: function (error) {
        rubi.disconnect(function (err) {
            if (err) {
                if (error) error.apply(arguments);
                debug(err);
            }
        });
        return this;
    }

};

// Hacer público el controlador
module.exports = exports = controller;
