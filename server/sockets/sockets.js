/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Sockets
 * Romel Pérez, @prhonedev
 * 2014
 **/

var portal = require('./portal.sockets');

module.exports = exports = function () {

    var app = this.app;
    var io = this.io;

    // Habilitar funcionalidades de aplicaciones
    portal.apply(this);
    
};
