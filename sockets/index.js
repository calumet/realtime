/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Sockets
 * Romel Pérez, prhone.blogspot.com
 * 2015
 **/

var _ = require('underscore');
var cookie = require('cookie');
var rubi = require('../libs/rubi');
var portal = require('./socket.portal');
var aula = require('./socket.aula');
var config = require('../config');
var security = require('../security');
var log = require('../libs/log')('sockets');


// -------------------------------------------------------------------------- //
// SOCKET's CONNECTION AUTHORIZATION //

/**
 * Cada socket al tratar de conectarse, pasa por un proceso de autorización,
 * donde se verifican las cookies de seguridad y la conexión con el usuario.
 */
var authorization = {

  io: null,
  express: null,


  /**
   * Proceso de validación de conexión de socket portal con usuario.
   * 
   * @param {Object} socket Es la conexión del socket estableciéndose
   * @param {Object} authorize Callback a ejecutar con la respuesta de conexión
   * 
   * Las posibles respuestas al usuario por la conexión son:
   * > ERROR       Error en el proceso de conexión
   * > ERROR_DATA  Datos erroneos
   * > NOT_AUTH    Usuario no autenticado
   * > NOT_FOUND   Usuario no encontrado
   * > NOT_ACCESS  Usuario sin acceso
   * > DUPLICATE   Segunda conexión por computadora
   * > undefined   Usuario aceptado
   * 
   * Posibles eventos en otros sockets:
   * > userError   Informar a un usuario de un error
   */
  handshake: function (socket, authorize) {

    // Recoger datos y guardarlos con una referencia en el socket.
    var cookies = cookie.parse(socket.handshake.headers.cookie || '');
    var user = socket.user = {
      ip: socket.handshake.address,
      time: socket.handshake.time,
      agent: socket.handshake.headers['user-agent'],
      id: cookies[config.security.user]  // Identificador del usuario
    };

    // Función de registrar respuesta de conexión.
    var accept = function (state) {
      log.info(user.ip +' '+ user.id +' '+ socket.id +' '
       + (state === undefined ? 'AUTHORIZED' : state));
      authorize(state ? {data: state} : undefined);
    };

    // Si es un usuario invitado.
    if (user.id === 'U1') {
      return accept('NOT_ACCESS');
    }

    // Verificar datos válidos.
    if (!user.id) {
      return accept('ERROR_DATA');
    }

    // Verificar código de seguridad.
    var localKey = cookies[config.security.user];
    var sentKey = cookies[config.security.door];
    localKey = security.encrypt(String(localKey)).toUpperCase();
    sentKey = String(sentKey).toUpperCase();
    if (!sentKey || (sentKey && localKey !== sentKey)) {
      return accept('NOT_AUTH');
    }

    // Analizar datos de usuario en base de datos.
    // Sólo multiples instancias de sockets desde la misma IP.
    rubi.users.findOne({_id: user.id}, function (err, myUser) {

      // Error buscando en base de datos.
      if (err) {
        log.error('handshake buscando usuario:', err);
        return accept('ERROR');
      }

      // Usuario encontrado.
      if (!!myUser) {

        // Sólo hay un usuario desde la misma computadora (IP).
        rubi.users.find({ip: user.ip}, function (err, allMatchedUsers) {
          if (err) {
            log.error('handshake buscando multiplicidad de usuario en '
             +'computadoras', err);
            return accept('ERROR');
          }
          for (var i = 0; i < allMatchedUsers.length; i += 1) {
            if (allMatchedUsers[i].devices.length
              && allMatchedUsers[i]._id !== user.id) {
              
              // Enviar usuario duplicado al que se conecta.
              accept('DUPLICATE');

              // Enviar usuario duplicado al que ya estaba conectado.
              _.each(allMatchedUsers[i].devices, function (device) {
                _.findWhere(authorization.io.of('/portal').sockets, {
                  id: device._id
                }).emit('userError', 'DUPLICATE');
              });
              return;
            }
          }

          // Tiene session/es.
          if (myUser.devices.length) {

            // Usuario con misma IP.
            if (user.ip === myUser.ip) {

              // Usuario autorizado.
              accept();
            }

            // Usuario con diferente IP.
            else {

              // Usuario duplicado.
              accept('DUPLICATE');

              // Enviar a las otras instancias con el mismo usuario el error.
              var socket;
              _.each(myUser.devices, function (device) {
                _.findWhere(authorization.io.of('/portal').sockets, {
                  id: device._id
                }).emit('userError', 'DUPLICATE');
              });
            }
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
