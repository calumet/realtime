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
var debug = require('debug')('dbs');


// -------------------------------------------------------------------------- //
// GLOBAL DATABASES PROCEDURES //

/**
 * Se ejecutan los procedimientos a realizarse en las bases de datos una vez
 * se inicie el servidor.
 *
 * > Recordar que una vez se inicie la conexión con el servidor, las demás
 * instancias de libs/rubi y libs/diamante podrán hacer todos los procedimientos
 * que necesiten.
 *
 * > Se saldrá el servidor sino se pudo conectar con alguna de las bases de datos.
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

		  // Resetear todas las instancias de los usuarios. Si habían conectados,
		  // se reconectarán y se recrean otra vez tales instancias.
	    portal.reset(function (err) {
	      if (err) debug(err);
	    });

		  // Iniciar todas las labores que necesiten de las bases de datos.
			callback();
		});
	});

};
