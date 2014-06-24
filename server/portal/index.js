/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Portal | Main
 * Romel Pérez, @prhonedev
 * 2014
 **/

var routes = require('./portal.routes');
var sockets = require('./portal.sockets');


// -------------------------------------------------------------------------- //
// PORTAL | MAIN //

module.exports = function () {

    routes.call(this);

    sockets.call(this);
    
};
