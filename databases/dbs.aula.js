/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Databases | Aula
 * Romel Pérez, prhone.blogspot.com
 * 2014
 **/

// IMPORTANT: INESTABLE!

var _ = require('underscore');
var rubi = require('mongoose');
var diamante = require('mysql');
var config = require('../config');

/*
> TP_Usuarios:
IdUsr
IdCat
PrimNomUsr
SegNomUsr
PrimApeUsr
SegApeUsr
Foto

> TB_Categorias:
IdCat
NomCat
 */


// -------------------------------------------------------------------------- //
// ROOMS //

// Colecciones de la base de datos
var Collections = {

    // Usuarios conectados al aulachat
    users: rubi.model('users', new rubi.Schema(
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
    rooms: rubi.model('rooms', new rubi.Schema(
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



// -------------------------------------------------------------------------- //
// PROCEDURES //

exports.Esmeralda = {

    //

};



// -------------------------------------------------------------------------- //
// MYSQL DATABASE TEST //

// Esquema de datos de usuarios
var _data = {
    "U40200": {
        "id": "U40200",
        "code": "2120099",
        "category": "CT1",
        "firstName": "Luis",
        "secondName": "Ignacio",
        "firstSurname": "Gonzales",
        "secondSurname": "",
        "clases": ["262456_W9", "262456_G3", "287892_A1"],
        "photo": "/img/photos/luis.jpg"
    },
    "U40201": {
        "id": "U40201",
        "code": "2130000",
        "firstName": "Romel",
        "secondName": "Francisco",
        "firstSurname": "Pérez",
        "secondSurname": "Estrada",
        "category": "CT2",
        "clases": ["262456_W9", "262456_G3", "287892_A1"],
        "photo": "/img/photos/romel.jpg"
    }
};



// -------------------------------------------------------------------------- //
// GENERAL PROCEDURES //

// Filtrar los datos de un usuario
var _filterUserData = function (user) {
    return _.pick(user,
                  'id',
                  'code',
                  'firstName',
                  'secondName',
                  'firstSurname',
                  'secondSurname',
                  'photo',
                  'category');
};


// Returnar un usuario por código
exports.userByCode = function (code) {
    var user;
    for (user in _data) {
        if (_data[user].code === code) {
            return _filterUserData(_data[user]);
        }
    }
};


// Retornar un usuario por id
exports.userById = function (id) {
    return _filterUserData(_data[id]);
};


// Retornar todos los usuarios de una clase (profesor/a/s y estudiantes)
exports.usersByClass = function (clase) {
    var user, users = {};
    for (user in _data) {
        if (_.indexOf(_data[user].clases, clase) !== -1) {
            users[user] = _filterUserData(_data[user]);
        }
    }
    return users;
};
