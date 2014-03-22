/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | URLs
 * Romel Pérez, @prhonedev
 * Marzo del 2014
 **/

var db = require('./database.js');

// ------------------------------------------------------------------------- //
// URLs //

exports.listen = function (app) {

    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/aula', function (req, res) {
        // Los datos que se envían deben ser enviados de acuerdo
        // al lenguaje del servidor usado, puede ser JSP u otro
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

    // Retornar datos de usuario por su código
    app.post('/getUserByCode', function (req, res) {
        var code = req.body.code;
        res.json({
            user: db.userByCode(code)
        });
    });

    // Retornar datos de usuario por su id
    app.post('/getUserById', function (req, res) {
        var id = req.body.id;
        res.json({
            user: db.userById(id)
        });
    });

    // Retornar datos de usuarios de una clase
    app.post('/getUsersByClass', function (req, res) {
        var clase = req.body.clase;
        res.json({
            users: db.usersByClass(clase)
        });
    });

};
