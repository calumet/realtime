/*!
 * Grupo de Desarrollo de Software Calumet
 * Aula Chat | URLs
 * Romel Pérez, @prhonedev
 * Abril del 2014
 **/

var db = require('./databases');

// ------------------------------------------------------------------------- //
// RESTful API //

var api = function (app) {

    // Retornar datos de usuario por su código
    app.post('/api/getUserByCode', function (req, res) {
        var code = req.body.code;
        res.json({
            user: db.userByCode(code)
        });
    });

    // Retornar datos de usuario por su id
    app.post('/api/getUserById', function (req, res) {
        var id = req.body.id;
        res.json({
            user: db.userById(id)
        });
    });

    // Retornar datos de usuarios de una clase
    app.post('/api/getUsersByClass', function (req, res) {
        var clase = req.body.clase;
        res.json({
            users: db.usersByClass(clase)
        });
    });

});



// ------------------------------------------------------------------------- //
// URLs //

var urls = function (app) {

    app.get('/', function (req, res) {
        res.redirect('/login');
    });

    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.get('/app', function (req, res) {
        res.render('app', {
            id: req.query.id,
            clase: req.query.clase,
            name: req.query.name,
            photo: req.query.photo
        });
    });

    app.get('/aula', function (req, res) {
        res.render('aula', {
            id: req.query.id,
            clase: req.query.clase,
            name: req.query.name,
            photo: req.query.photo
        });
    });

    app.get('/chat', function (req, res) {
        res.render('chat');
    });

};



// ------------------------------------------------------------------------- //
// ADMIN //

module.exports = function (app) {

    // RESTful API
    api(app);

    // URLs
    urls(app);

};
