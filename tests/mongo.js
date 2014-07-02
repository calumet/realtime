// Realtime
// Mongo tests

var rubi = require('../server/node_modules/mongoose');

// -------------------------------------------------------------------------- //
// CONNECTIONS AND PROCEDURES //

var User = (function () {

    // Conectarse a la db
    rubi.connect('mongodb://127.0.0.1:2000/rubi');

    // Error conectándose
    rubi.connection.on('error', function (err) {
        console.log('>>> Error conectándose a MongoDB: ', err.message);
    });

    // Usuarios
    return rubi.model('users', new rubi.Schema({
            _id: String,
            ip: String,
            time: Date,
            devices: [{
                socket: String,
                agent: String
            }]
        }, {
            collection: 'users'
        }
    ));

})();


// Create a Save Document
var insert = function (obj) {

    var example = new User(obj);
    example.save(function (err, example) {
        if (err) console.log(err.message);
        else console.log('Model saved!');
    });

};


// Find a Document
var find = function (criteria) {

    User.findOne(criteria, 'id devices', function (err, dato) {
        if (err) console.log(err.message);
        else {
            console.log(dato.devices[0].dato);
            dato.update({$set: {name: 'Something weird!'}}).exec();
        }
    });

};


// Update a Document
var update = function () {

    Acol.update({id: 'UID002'}, {name: 'Romel Pérez'}, function (raw, n) {
        console.log('Raw: ', raw);
        console.log('Number: ', n);
    });

};


// -------------------------------------------------------------------------- //
// TESTS //

User.findOne({_id: 'U7898427'}, function (err, user) {
    if (err) {
        console.log(err.message);
    }
    if (user) {
        console.log(user._id, user.ip, user.time);
    } else {
        console.log('Not found');
    }
});
