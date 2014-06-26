/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Sockets
 * Romel Pérez, @prhonedev
 * 2014
 **/

var portal = require('./portal.sockets');
//var aula = require('./aula.sockets');

module.exports = exports = function () {

    var express = this.express;
    var io = this.io;

    // Habilitar funcionalidades de aplicaciones
    portal.apply(this);
    //aula.apply(this);

};
