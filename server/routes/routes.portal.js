/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Routes | Portal
 * Romel Pérez, prhone.blogspot.com
 * 2014
 **/

// IMPORTANT: INESTABLE!

var _ = require('underscore');
var debug = require('debug')('routes:portal');
var db = require('../databases/dbs.portal');


// -------------------------------------------------------------------------- //
// PORTAL | ROUTES //

module.exports = function () {

    var express = this.express;
    var io = this.io;

    // Conseguir las estadísticas del portal
    // NOTE: Sólo permitido para administradores
    express.get('/app/portal/stats', function (req, res) {

        if (!req.query.id) {
            res.json({error: true});
            debug(req.ip + ' no ha enviado un usuario.');
            return;
        }

        db.isAdmin(req.query.id, function (admin) {

            if (admin) {
                db.stats(function (err, count) {
                    if (err) {
                        debug('error consiguiendo estadísticas ' + err.message);
                        count = -1;
                    }
                    // @count cantidad de usuarios conectados
                    res.json({
                        count: count
                    });
                });
            } else {
                debug(req.ip + ' no es administrador.');
                res.json({error: true});
            }
        });
    });

};
