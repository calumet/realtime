/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Databases
 * Romel Pérez, prhone.blogspot.com
 * 2015
 **/

var rubi = require('../libs/rubi');
var diamante = require('../libs/diamante');
var portal = require('./dbs.portal');
var aula = require('./dbs.aula');
var async = require('async');
var debug = require('debug')('dbs');


// -------------------------------------------------------------------------- //
// GLOBAL DATABASES PROCEDURES //

/**
 * Se ejecutan los procedimientos a realizarse en las bases de datos una vez
 * se inicie el servidor.
 * @param {Function} callback Los procesos iniciales se han cargado.
 *
 * > Recordar que una vez se inicie la conexión con el servidor, las demás
 * instancias de libs/rubi y libs/diamante podrán hacer todos los procedimientos
 * que necesiten.
 *
 * > Se saldrá el servidor sino se pudo conectar con alguna de las bases de datos.
 *
 * > Las instancias de conexiones con los sockets se reestablecen una vez
 * ĺa conexión del server se reanuda.
 */
module.exports = exports = function (callback) {

  // Conectarse con rubi.
  rubi.connect(function (err) {
    if (err) throw err;
    else debug('rubi está conectada.');

    // Conectarse con diamante.
    diamante.connect(function (err) {
      if (err) throw err;
      else debug('diamante está conectada.');

      // Procesos iniciales.
      async.parallel([

        // Resetear todas las instancias de los usuarios.
        portal.reset,

        // Resetear todas las instancias de usuarios conectados en rubi.ac_rooms.
        aula.reset

      ], function (err) {
        if (err) debug(err);

        // Iniciar todas las labores que necesiten de las bases de datos.
        callback();
      });
    });
  });

};
