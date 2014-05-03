/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Esmeralda Database
 * Romel Pérez, @prhonedev
 * Abril del 2014
 **/

var config = require('../config');
var _ = require('underscore');
var Esmeralda = require('mongoose');


// ------------------------------------------------------------------------- //
// CONNECTING TO DATABASES //

// Conectarse a la base de datos de Mongo 'Esmeralda'
Esmeralda.connect('mongodb://localhost/esmeralda');
Esmeralda.connection.on('error', function (err) {
    console.log('>>> Ha ocurrido un error al conectarse a MongoDB!');
    console.dir(err);
});



// ------------------------------------------------------------------------- //
// COLLECTIONS //

// Colecciones de la base de datos
var Collections = {

	// Conexiones de los usuarios
    users: Esmeralda.model('users', new Esmeralda.Schema(
        {
            id: String,
            state: String,
            ip: String,
            devices: [
                {
                    socket: String,
                    time: Date,
                    agent: String
                }
            ]
        },
        {
            collection: 'users'
        }
    ))

};



// ------------------------------------------------------------------------- //
// PROCEDURES //

exports.app = {

    // Un usuario instancia la aplicación
    // data: {id, ip, time, agent}
    instantiate: function (data) {
        Collections.users.findOne({id: data.id}, function (err, doc) {
            if (err) {
                console.log(err);
            }
            if (doc) {
                // found
            } else {
                // not found
            }
        });
    },

    // Un usuario cierra una instancia de la aplicación
    uninstantiate: function () {},

    // Todas las instancias de la aplicación de un usuario
    instances: function () {}

};
