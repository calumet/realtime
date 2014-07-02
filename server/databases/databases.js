/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Databases
 * Romel Pérez, @prhonedev
 * 2014
 **/

var debug = require('debug')('dbs');
var portal = require('./dbs.portal');
//var aula = require('./socket.aula');


// -------------------------------------------------------------------------- //
// INITIAL GLOBAL PROCEDURES AND DATABASES MANAGERS //

module.exports = exports = function () {

    // Resetear todas las instancias de los usuarios
    // Si habían conectados, se reconectarán y se recrean otra vez
    // las instancias
    portal.reset(function (err) {
        if (err) debug(err);
    });

};
