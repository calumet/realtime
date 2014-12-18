/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Routes | Aula
 * Romel Pérez, prhone.blogspot.com
 * 2014
 **/

// IMPORTANT: INESTABLE!

var _ = require('underscore');
var mysql = require('../databases/dbs.aula');

// -------------------------------------------------------------------------- //
// API //

module.exports = function (app) {

    // Retornar datos de usuario por su código
    app.post('/api/getUserByCode', function (req, res) {
        var code = req.body.code;
        res.json({
            user: db.userByCode(code)
        });
    });

    // Retornar datos de usuario por su id
    app.post('/api/getUserById', function (req, res) {
        var id = req.body.id;
        res.json({
            user: db.userById(id)
        });
    });

    // Retornar datos de usuarios de una clase
    app.post('/api/getUsersByClass', function (req, res) {
        var clase = req.body.clase;
        res.json({
            users: db.usersByClass(clase)
        });
    });

};
