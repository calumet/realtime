/*!
 * PRHONE Applications
 * Chat | URLs
 * Romel Pérez, 2013
 **/

// ------------------------------------------------------------------------- //
// USERS //

// id == user code
var getUserData = function (code) {
    var data = require('./db.json');
    return data[code];
};


// ------------------------------------------------------------------------- //
// URLs //

exports.listen = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });
    app.get('/aula', function (req, res) {
        res.render('aula', {
            code: req.query.code,
            room: req.query.room
        });
    });
    app.get('/chat', function (req, res) {
        // Really, this way to know what user is, it will not be used
        // Instead, it will use JSP variables to write the user data
        // And use them for the chat
        res.render('chat', {
            code: req.query.code,
            room: req.query.room
        });
    });

    // Return the user data from Database
    app.post('/getUserData', function (req, res) {
        var code = req.body.code;
        var room = req.body.room;
        var data = getUserData(code);
        res.send({
            room: room,
            user: {
                code: data.code,
                name: data.name,
                level: data.level,
                photo: data.photo
            }
        });
    });
};