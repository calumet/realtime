// Realtime
// Mongo test

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/learn');
mongoose.connection.on('error', function (err) {
    console.log('>>> Ha ocurrido un error al conectarse a MongoDB!');
    console.dir(err);
});
var Acol = mongoose.model('acol', new mongoose.Schema({
    id: String,
    name: String,
    devices: [{dato: String}]
}), 'acol');


// Create a Save Document
/*var example = new Acol({
    id: 'UID002',
    devices: [
        {dato: "Wohoo!"},
        {dato: "Extraño!"},
        {dato: "Incontrolable!"}
    ]
});
example.save(function (err, example) {
    console.log('Model saved!');
});*/


// Find a Document
/*var e = Acol.findOne({id: 'UID002'}, 'id devices', function (err, dato) {
    console.log(dato.devices[0].dato);
    dato.update({$set: {name: 'Something weird!'}}).exec();
});*/


// Update a Document
Acol.update({id: 'UID002'}, {name: 'Romel Pérez'}, function (raw, n) {
    console.log('Raw: ', raw);
    console.log('Number: ', n);
});
