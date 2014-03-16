/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | URLs
 * Romel Pérez, @prhonedev
 * Febrero del 2014
 **/

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
            id: req.query.id,
            clase: req.query.clase,
            name: req.query.name
        });
    });

    app.get('/chat', function (req, res) {
        res.render('chat');
    });


    // --------------------------------------------------------------------- //
    // AJAX Requests //

    // Return the user data by code
    app.post('/getUserByCode', function (req, res) {
        var code = req.body.code;
        res.json({
            user: db.userByCode(code)
        });
    });

    // Return the user data by id
    app.post('/getUserById', function (req, res) {
        var id = req.body.id;
        res.json({
            user: db.userById(id)
        });
    });

    // Return the users data by class
    app.post('/getUsersByClass', function (req, res) {
        var clase = req.body.clase;
        res.json({
            users: db.usersByClass(clase)
        });
    });

};
