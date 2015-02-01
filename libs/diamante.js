/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Libraries | Diamante
 * Romel Pérez, prhone.blogspot.com
 * 2015
 **/

var diamante = require('mysql');
var config = require('../config');
var log = require('../libs/log')('libs:diamante');


// -------------------------------------------------------------------------- //
// PROCEDURES //

// Conector.
var connection = diamante.createConnection({
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.pass,
  database: config.mysql.db
});


// -------------------------------------------------------------------------- //
// PUBLIC //

var controller = {

  // MySQL.
  db: diamante,

  // Conexión.
  connection: connection,
  con: connection,

  // Conectarse.
  connect: function (callback) {

    // Conectar por medio del conector.
    connection.connect(function (err) {
      if (err) {
        callback(err);
        log.error('conectándose con diamante:', err);
      } else {
        callback(undefined, connection);
      }
    });
    return this;
  },

  // Desconectarse.
  disconnect: function (callback) {
    connection.end(function (err) {
      if (err) {
        if (callback) callback(err);
        log.error('desconectándose de diamante:', err);
      } else {
        if (callback) callback();
      }
    });
    return this;
  },

  // Multiples queries anidados.
  // @queries   [String]   Cada query a procesar.
  // @callback  Function   Callback con cada respuesta de cada query.
  queryMulti: function (queries, callback) {
    var results = [undefined];

    if ((typeof queries !== 'object' && queries.length)
      || typeof callback !== 'function') {
      throw new Error('Debe haber un array de queries y un callback que '
        +'reciba los resultados.');
    }
    
    for (var c = 0; c < queries.length; c += 1) {
      (function (c) {
        connection.query(queries[c], function (err, result) {
          if (err) {
            callback(err);
            c = queries.length;
            return;
          }
          results.push(result);
          if (c === queries.length - 1) {
            callback.apply(this, results);
          }
        });
      })(c);
    }
  }

};

// Hacer controlador público.
module.exports = exports = controller;
