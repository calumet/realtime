/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | Database
 * Romel Pérez, @prhonedev
 * Duvan Vargas, @DuvanJamid
 * Febrero del 2014
 **/

// ------------------------------------------------------------------------- //
// DATA //

var data = {
    "2130000": {
        "code": "2130000",
        "firstName": "Romel",
        "secondName": "Francisco",
        "firstSurname": "Pérez",
        "secondSurname": "Estrada",
        "level": "L1",
        "photo": "/img/photos/romel.jpg"
    },
    "2130001": {
        "code": "2130001",
        "firstName": "Karen",
        "secondName": "Natalia",
        "firstSurname": "Contreras",
        "secondSurname": "Castro",
        "level": "L2",
        "photo": "/img/photos/natalia.jpg"
    },
    "2130002": {
        "code": "2130002",
        "firstName": "Duvan",
        "secondName": "Jamid",
        "firstSurname": "Vargas",
        "secondSurname": "Castillo",
        "level": "L2",
        "photo": "/img/photos/duvan.jpg"
    },
    "2130003": {
        "code": "2130003",
        "firstName": "Karen",
        "secondName": "Alicia",
        "firstSurname": "Vega",
        "secondSurname": "López",
        "level": "L2",
        "photo": "/img/photos/karen.jpg"
    }
};


// ------------------------------------------------------------------------- //
// EXPORTS //

exports.data = function (code) {

    // Return all user data
    return data[code];

};
