/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Sockets
 * Romel Pérez, @prhonedev
 * 2014
 **/

var debug = require('debug')('sockets');
var portal = require('./socket.portal');
//var aula = require('./socket.aula');


// -------------------------------------------------------------------------- //
// GLOBAL PROCEDURES AND SOCKETS MANAGERS //

module.exports = exports = function () {

    // Sockets de aplicaciones
    portal.apply(this);
    //aula.apply(this);

};
