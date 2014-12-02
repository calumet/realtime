/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Databases
 * Romel Pérez, prhone.blogspot.com
 * 2014
 **/

var portal = require('./dbs.portal');
//var aula = require('./dbs.aula');
var debug = require('debug')('dbs');


// -------------------------------------------------------------------------- //
// GLOBAL DATABASE PROCEDURES //

module.exports = exports = function () {

    // Resetear todas las instancias de los usuarios.
    // Si habían conectados, se reconectarán y se recrean otra vez tales instancias.
    portal.reset(function (err) {
        if (err) debug(err);
    });
};
