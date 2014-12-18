/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Libraries | Diamante
 * Romel Pérez, prhone.blogspot.com
 * 2014
 **/

var diamante = require('mysql');
var debug = require('debug')('libs:diamante');
var config = require('../config');


// -------------------------------------------------------------------------- //
// PROCEDURES //

// Conector
var connection = diamante.createConnection({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.pass,
    database: config.mysql.db
});


// -------------------------------------------------------------------------- //
// PUBLIC //

var controller = {

    // MySQL
    db: diamante,

    // Conexión
    connection: connection,

    // Conectarse
    connect: function (success, error) {

        // Conectar por medio del conector
        connection.connect(function (err) {
            if (err) {
                if (error) error(err);
                debug(err);
            } else {
                success(connection);
            }
        });
        return this;
    },

    // Disconectarse
    disconnect: function (error) {
        connection.end(function (err) {
            if (err) {
                if (error) error();
                debug(err);
            }
        });
        return this;
    }

};

// Hacer controlador públic
module.exports = exports = controller;
