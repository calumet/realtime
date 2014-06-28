// Realtime
// Update rubi with diamante

var UPDATE = false;  // OBVIOUS SECURITY TRICK
var config = require('../config');
var rubi = require('mongoose');
var diamante = require('mysql');
var _ = require('underscore');

// Sólo actualizar si se está consciente de ello
if (UPDATE) {

    console.log('Migrando datos de usuarios de "diamante" a "rubi"');
    console.log('Procesando queries...');

    // Conectarse a MySQL
    var diamanteConn = diamante.createConnection({
        host: config.mysql.host,
        port: config.mysql.port,
        user: config.mysql.user,
        password: config.mysql.pass,
        database: config.mysql.db
    });
    diamanteConn.connect();
    diamanteConn.query('SELECT IdUsr FROM TP_Usuarios;', function (err, rows, fields) {
        if (err) throw err;

        // Conectarse a MongoDB
        rubi.connect('mongodb://' + config.mongodb.host + ':'
            + config.mongodb.port + '/' + config.mongodb.db, {
            user: config.mongodb.user,
            pass: config.mongodb.pass,
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            },
            replset: {
                socketOptions: {
                    keepAlive: 1
                }
            }
        });
        rubi.connection.on('error', function (err) {
            if (err) throw err;
        });
        var User = rubi.model('users', new rubi.Schema({
                _id: String,
                ip: String,
                time: Date,
                devices: [],
                admin: Boolean
            }, {
                collection: 'users'
            }
        ));

        // Migrar datos
        for (var user = 0; user < rows.length; user += 1) {
            User.update({
                _id: rows[user].IdUsr
            }, {
                devices: []
            }, {
                upsert: true
            }, function (err) {
                if (err) throw err;
            });
            process.stdout.write('.');
        }

        // Declarando usuarios especiales
        console.log('\nDeclarando usuarios especiales...');
        _.each(config.admins, function (id) {
            User.findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    admin: true
                }
            }, function (err, result) {
                if (err) throw err;
            });
        });

        // Estado del proceso completo
        setTimeout(function () {
            console.log('Complete!\nCtrl+C para cerrar.');
            diamanteConn.end();
        }, 0);

    });

} else {

    console.log('La actualización no se ha definido por realizar.');

};
