/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Database | Aulachat
 * Romel Pérez, @prhonedev
 * 2014
 **/

var _ = require('underscore');
var Esmeralda = require('mongoose');
var config = require('../config');


// ------------------------------------------------------------------------- //
// CONNECTING //

// Conectarse a la base de datos de Mongo 'Esmeralda'
Esmeralda.connect('mongodb://localhost/esmeralda');
Esmeralda.connection.on('error', function (err) {
    console.log('>>> Ha ocurrido un error al conectarse a MongoDB!');
    console.dir(err);
});



// ------------------------------------------------------------------------- //
// ROOMS //

// Colecciones de la base de datos
var Collections = {

    // Usuarios conectados al aulachat
    users: Esmeralda.model('users', new Esmeralda.Schema(
        {
            id: String,
            ip: String,
            time: Date,
            agent: String
        },
        {
            collection: 'users'
        }
    )),

    // Clases y Salas de chat
    rooms: Esmeralda.model('rooms', new Esmeralda.Schema(
        {
            id: String,
            type: String,
            name: String,
            users: [String],
            messages: [
                {
                    user: String,
                    content: String,
                    time: Date,
                    params: {}
                }
            ]
        },
        {
            collection: 'rooms'
        }
    ))

};



// ------------------------------------------------------------------------- //
// PROCEDURES //

exports.Esmeralda = {

    //

};
