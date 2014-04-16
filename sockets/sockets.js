/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | Sockets
 * Romel Pérez, @prhonedev
 * Abril del 2014
 **/

// ------------------------------------------------------------------------- //
// SOCKETS MODULES //

module.exports = function (io) {

    require('./app/app.main')(io);
    require('./aulachat/aulachat.main')(io);

};
