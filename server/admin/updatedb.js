// Realtime
// Update rubi with diamante

var UPDATE = true;
var rubi = require('mongoose');
var diamante = require('mysql');

if (UPDATE) {

    console.log('Processing databases...');

    var connection = diamante.createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'admin',
        database: 'diamante'
    });

    connection.connect();

    connection.query('SELECT IdUsr FROM TP_Usuarios;', function(err, rows, fields) {
        if (err) throw err;

        rubi.connect('mongodb://127.0.0.1:27017/rubi');
        rubi.connection.on('error', function (err) {
            if (err) throw err;
        });
        var User = rubi.model('users', new rubi.Schema({
                _id: String,
                ip: String,
                time: Date,
                devices: []
            }, {
                collection: 'users'
            }
        ));
        var newUser;

        for (var user = 0; user < rows.length; user += 1) {
            newUser = new User({
                _id: rows[user].IdUsr,
                devices: []
            });
            newUser.save(function (err) {
                if (err) throw err;
            });
        }

        setTimeout(function () {
            console.log('Complete');
            rubi.close();
            connection.end();
        }, 0);

    });

}
