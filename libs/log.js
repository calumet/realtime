/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Libraries | Logger
 * Romel Pérez, prhone.blogspot.com
 * 2015
 **/

var _ = require('underscore');
var bunyan = require('bunyan');


// -------------------------------------------------------------------------- //
// LOGGER APP //

// Log object.
var log = bunyan.createLogger({
  name: 'realtime',  // Nombre por defecto.
  serializers: {
    err: bunyan.stdSerializers.err  // Serializar errores.
  },
  streams: [  // Salidas de logs.

    // Guardar logs en archivo ...realtime/log.log level >= bunyan.INFO.
    {
      level: 'info',
      path: 'log.log'
    },

    // Mostrar resultados de log en la terminal level >= bunyan.DEBUG.
    {
      level: 'debug',
      stream: process.stdout
    }
  ]
});


/**
 * Crear una instancia de logger con un nombre específico de aplicación a debug.
 * @param  {String} app Nombre de la aplicación a debugear.
 * @return {Function}   Funciones para loguear con el logger instanciado.
 */
module.exports = exports = function (app) {

  // Logger para ésta instancia de aplicación.
  var logger = function (fn) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      var fo = _.find(args, function (a) {
        return typeof a === 'object';
      });

      // Colocar en el primer objeto encontrado entre los parámetros el nombre
      // de la aplicación de la instancia.
      if (fo) {
        fo.name = app;
      }

      // Sino, colocar el objeto al principio.
      else {
        args.unshift({name: app});
      }

      log[fn].apply(log, args)
    };
  };

  // Funciones de log.
  return {
    debug: logger('debug'),
    info: logger('info'),
    warn: logger('warn'),
    error: logger('error'),
    fatal: logger('fatal'),
    log: log
  };

};
