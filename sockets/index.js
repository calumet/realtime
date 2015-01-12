/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Sockets
 * Romel Pérez, prhone.blogspot.com
 * 2015
 **/

var cookie = require('cookie');
var rubi = require('../libs/rubi');
var portal = require('./socket.portal');
var aula = require('./socket.aula');
var config = require('../config');
var security = require('../security');
var debug = require('debug')('sockets');


// -------------------------------------------------------------------------- //
// SOCKET's CONNECTION AUTHORIZATION //

/**
 * Cada socket al tratar de conectarse, pasa por un proceso de autorización,
 * donde se verifican las cookies de seguridad y la conexión con el usuario.
 */

/**
 * FIXIT: Testear en conexiones con proxies. Esto puede llevar el problema de
 * detectar todos los usuarios de un proxy como uno solo.
 */

var authorization = {

  io: null,
  express: null,


  /**
   * Proceso de validación de conexión de socket portal con usuario.
   * @param {Object} socket Es la conexión del socket estableciéndose
   * @param {Object} authorize Callback a ejecutar con la respuesta de conexión
   * Las posibles respuestas al usuario por la conexión son:
   * > ERROR       Error en el proceso de conexión
   * > ERROR_DATA  Datos erroneos
   * > NOT_AUTH    Usuario no autenticado
   * > NOT_FOUND   Usuario no encontrado
   * > DUPLICATE   Segunda conexión por computadora
   * > undefined   Usuario aceptado
   */
  handshake: function (socket, authorize) {

    // Recoger datos y guardarlos con una referencia en el socket.
    var cookies = cookie.parse(socket.handshake.headers.cookie);
    var user = socket.user = {
      ip: socket.handshake.address,
      time: socket.handshake.time,
      agent: socket.handshake.headers['user-agent'],
      id: cookies[config.security.user]  // Identificador del usuario
    };

    // Función de registrar respuesta de conexión.
    var accept = function (state) {
      debug(user.ip +' '+ user.id +' '+ socket.id +' '
       + (state === undefined ? 'AUTHORIZED' : state));
      authorize(state ? {data: state} : undefined);
    };

    // Verificar datos válidos.
    if (!user.id) {
      accept('ERROR_DATA');
      return;
    }

    // Verificar que tenga las cookies de seguridad compartidas.
    // Comparar las claves.
    var localKey = cookies[config.security.user];
    var sentKey = cookies[config.security.door];
    localKey = security.encrypt(String(localKey)).toUpperCase();
    sentKey = String(sentKey).toUpperCase();
    if (!sentKey || (sentKey && localKey !== sentKey)) {
      accept('NOT_AUTH');
      return;
    }

    // Analizar datos de usuario en base de datos.
    // Sólo multiples instancias de sockets desde la misma IP.
    rubi.users.findOne({_id: user.id}, function (err, myUser) {

      // Error buscando en base de datos.
      if (err) {
        debug('error buscando usuario', err);
        accept('ERROR');
        return;
      }

      // Usuario encontrado.
      if (!!myUser) {

        // Sólo hay un usuario desde la misma computadora (IP).
        rubi.users.find({ip: user.ip}, function (err, allMatchedUsers) {
          if (err) {
            debug('error buscando multiplicidad de usuario en computadoras', err);
            accept('ERROR');
            return;
          }
          for (var i = 0; i < allMatchedUsers.length; i += 1) {
            if (allMatchedUsers[i].devices.length
              && allMatchedUsers[i]._id !== user.id) {
              accept('DUPLICATE');
              return;
            }
          }

          // Tiene session/es.
          if (myUser.devices.length) {
            (user.ip === myUser.ip) ? accept() : accept('DUPLICATE');
          }

          // No tiene sessiones.
          else {
            accept();
          }
        });
      }

      // No encontrado.
      else {
        accept('NOT_FOUND');
      }
    });
  }

};


// -------------------------------------------------------------------------- //
// GLOBAL PROCEDURES AND SOCKETS MANAGERS //

/**
 * Aquí se habilitan y deshabilitan todos los namespaces (aplicaciones) de
 * sockets. Se envía el objeto de autorización para que cada socket que intente
 * conectarse a cada namespace sea validado y autorizado de forma segura.
 */

module.exports = exports = function () {

  authorization.io = this.io;
  authorization.express = this.express;

  // Namespaces a activar.
  // Se envía el objeto de autorización para que se evalue en cada namespace.
  portal.call(this, authorization);
  aula.call(this, authorization);
};
