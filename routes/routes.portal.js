/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Routes | Portal
 * Romel Pérez, prhone.blogspot.com
 * 2015
 **/

var _ = require('underscore');
var db = require('../databases/dbs.portal');
var config = require('../config');
var log = require('../libs/log')('routes:portal');


// -------------------------------------------------------------------------- //
// PORTAL | ROUTES //

module.exports = exports = function () {

  var express = this.express;
  var io = this.io;

  // Conseguir las estadísticas del portal.
  // NOTE: Sólo para administradores.
  express.get('/app/portal/stats', function (req, res) {
    var userId = req.cookies[config.security.user];

    log.debug('HTTP /app/portal/stats GET '+ req.ipFiltered);

    // Buscar el usuario.
    db.rubi.users.findById(userId, function (err, user) {
      if (err) {
        log.error('consiguiendo usuario en /app/portal/stats:', err);
        res.json({error: 'NOT_FOUND'});
        return;
      }

      // Para verificar que sea admin.
      if (user.admin) {
        db.stats(function (err, stats) {
          if (err) {
            log.error('consiguiendo los datos estadísticos:', err);
            res.json({error: 'ERROR'});
          } else {
            res.json(stats);
          }
        });
      } else {
        res.json({error: 'NOT_ADMIN'});
      }
    });
  });

  // Agregar un mensaje de la administración para el público.
  // NOTE: Sólo para administradores.
  express.post('/app/portal/message', function (req, res, next) {
    var userId = req.cookies[config.security.user];
    var message = {
      publishedBy: userId,
      type: req.body.type,
      startDate: Number(req.body.startDate),  // date milliseconds
      endDate: Number(req.body.endDate),  // date milliseconds
      message: req.body.message
    };

    log.info('HTTP POST /app/portal/message '+ req.ipFiltered);

    // Buscar el usuario.
    db.rubi.users.findById(userId, function (err, user) {
      if (err) {
        log.error('consiguiendo usuario en /app/portal/message:', err);
        res.json({error: true});
        return;
      }

      // Para verificar que sea admin.
      if (user.admin) {
        db.addMessage(message, function (err, msg) {
          if (err) {
            log.error('db.addMessage() en /app/portal/message:', err);
            res.json({error: true});
          } else {
            res.json({ok: true});

            // Mostrar el mensaje a todos los usuarios ya activos.
            // Si está en un rango actual.
            var now = new Date().getTime();
            if (now > message.startDate && now < message.endDate) {
              io.of('/portal').emit('portal:msg', {
                messages: [{
                  id: msg._id,
                  type: msg.type,
                  message: msg.message
                }]
              });
            }
          }
        });
      } else {
        res.json({error: true});
      }
    });
  });

};
