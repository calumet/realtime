/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | URLs
 * Romel Pérez, @prhonedev
 * Duvan Vargas, @DuvanJamid
 * Febrero del 2014
 **/

// Modules
var db = require('./database.js');

// ------------------------------------------------------------------------- //
// URLs //

exports.listen = function (app) {

    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/aula', function (req, res) {
        // Really, this way to know what user is, it will not be used
        // Instead, it will use JSP variables to write the user data
        // And use them for the chat
        res.render('aula', {
            code: req.query.code,
            room: req.query.room,
            user: req.query.user  // Only Test
        });
    });

    app.get('/chat', function (req, res) {
        res.render('chat');
    });

    // Return the user data from Database
    app.post('/getUserData', function (req, res) {
        var code = req.body.code;
        var room = req.body.room;

        // Get data
        var data = db.data(code);

        // Send data
        res.json({
            room: room,
            user: {
                code: data.code,
                firstName: data.firstName,
                secondName: data.secondName,
                firstSurname: data.firstSurname,
                secondSurname: data.secondSurname,
                level: data.level,
                photo: data.photo
            }
        });
    });

};
