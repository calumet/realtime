/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | Database
 * Romel Pérez, @prhonedev
 * Marzo del 2014
 **/

var _ = require('underscore');

// ------------------------------------------------------------------------- //
// DATA //

// Esquema de datos de usuarios
var data = {
    "U40200": {
        "id": "U40200",
        "code": "2120099",
        "firstName": "Luis",
        "secondName": "Ignacio",
        "firstSurname": "Gonzales",
        "secondSurname": "",
        "category": "CT1",
        "clase": ["262456_W9", "262456_G3", "287892_A1"],
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
        "clase": ["262456_W9", "262456_G3", "287892_A1"],
        "photo": "/img/photos/romel.jpg"
    },
    "U40203": {
        "id": "U40203",
        "code": "2130002",
        "firstName": "Duvan",
        "secondName": "Jamid",
        "firstSurname": "Vargas",
        "secondSurname": "Castillo",
        "category": "CT2",
        "clase": ["262456_W9", "262456_G3", "287892_A1"],
        "photo": "/img/photos/duvan.jpg"
    },
    "U40205": {
        "id": "U40205",
        "code": "2130004",
        "firstName": "Yadiana",
        "secondName": "",
        "firstSurname": "Laitón",
        "secondSurname": "Zaraté",
        "category": "CT2",
        "clase": ["262456_W9"],
        "photo": "/img/photos/yadiana.jpg"
    },
    "U40214": {
        "id": "U40214",
        "code": "2130013",
        "firstName": "Juan",
        "secondName": "Sebastian",
        "firstSurname": "Agudelo",
        "secondSurname": "Hernandez",
        "category": "CT2",
        "clase": ["262456_W9"],
        "photo": "/img/photos/sebastian.jpg"
    },
    "U40207": {
        "id": "U40207",
        "code": "2130006",
        "firstName": "John",
        "secondName": "",
        "firstSurname": "Portilla",
        "secondSurname": "",
        "category": "CT2",
        "clase": ["262456_W9"],
        "photo": "/img/photos/john.jpg"
    },
    "U40209": {
        "id": "U40209",
        "code": "2130008",
        "firstName": "Carlos",
        "secondName": "Andrés",
        "firstSurname": "Rojas",
        "secondSurname": "",
        "category": "CT2",
        "clase": ["262456_W9"],
        "photo": "/img/photos/carlos.jpg"
    },
    "U40210": {
        "id": "U40210",
        "code": "2130009",
        "firstName": "Angie",
        "secondName": "",
        "firstSurname": "Villa",
        "secondSurname": "",
        "category": "CT2",
        "clase": ["262456_W9"],
        "photo": "/img/photos/angie.jpg"
    },
    "U40211": {
        "id": "U40211",
        "code": "2130010",
        "firstName": "Yohana",
        "secondName": "Katherin",
        "firstSurname": "Neira",
        "secondSurname": "Bermudez",
        "category": "CT2",
        "clase": ["262456_W9"],
        "photo": "/img/photos/katherin.jpg"
    },
    "U40212": {
        "id": "U40212",
        "code": "2130011",
        "firstName": "Laura",
        "secondName": "",
        "firstSurname": "Rueda",
        "secondSurname": "",
        "category": "CT2",
        "clase": ["262456_W9"],
        "photo": "/img/photos/laura.jpg"
    },
    "U40213": {
        "id": "U40213",
        "code": "2130012",
        "firstName": "Paola",
        "secondName": "Alexandra",
        "firstSurname": "Rodriguez",
        "secondSurname": "",
        "category": "CT2",
        "clase": ["262456_W9"],
        "photo": "/img/photos/paola.jpg"
    },
    "U40202": {
        "id": "U40202",
        "code": "2130001",
        "firstName": "Karen",
        "secondName": "Natalia",
        "firstSurname": "Contreras",
        "secondSurname": "Castro",
        "category": "CT2",
        "clase": ["262456_W9"],
        "photo": "/img/photos/natalia.jpg"
    },
    "U40206": {
        "id": "U40206",
        "code": "2130005",
        "firstName": "Carlos",
        "secondName": "Fernando",
        "firstSurname": "Ruíz",
        "secondSurname": "Nieto",
        "category": "CT2",
        "clase": ["262456_W9"],
        "photo": "/img/photos/fernando.jpg"
    },
    "U40204": {
        "id": "U40204",
        "code": "2130003",
        "firstName": "Karen",
        "secondName": "Alicia",
        "firstSurname": "Vega",
        "secondSurname": "López",
        "category": "CT2",
        "clase": ["262456_W9"],
        "photo": "/img/photos/karen.jpg"
    },
    "U40208": {
        "id": "U40208",
        "code": "2130007",
        "firstName": "Habib",
        "secondName": "",
        "firstSurname": "Saker",
        "secondSurname": "",
        "category": "CT2",
        "clase": ["262456_W9"],
        "photo": "/img/photos/habib.jpg"
    }
};

// Filtrar los datos de un usuario
var filter = function (obj) {
    var filteredUser = _.pick(obj, 'id', 'code', 'firstName', 'secondName', 'firstSurname', 'secondSurname', 'photo', 'category');
    return filteredUser;
};


// ------------------------------------------------------------------------- //
// EXPORTS //

// Returnar un usuario por código
exports.userByCode = function (code) {
    var user;
    for (user in data) {
        if (data[user].code === code) {
            return filter(data[user]);
        }
    }
};

// Retornar un usuario por id
exports.userById = function (id) {
    return filter(data[id]);
};

// Retornar todos los usuarios de una clase (profesor/a y estudiantes)
exports.usersByClass = function (clase) {
    var user, users = {};
    for (user in data) {
        if (_.indexOf(data[user].clase, clase) !== -1) {
            users[user] = filter(data[user]);
        }
    }
    return users;
};
