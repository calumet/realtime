/*!
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Routes
 * Romel Pérez, @prhonedev
 * 2014
 **/

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var debug = require('debug')('routes');
var portal = require('./routes.portal');
//var aula = require('./routes.aula');


// -------------------------------------------------------------------------- //
// GLOBAL PROCEDURES AND ROUTES //

module.exports = exports = function () {

    // Permitir leer datos de peticiones POST
    this.express.use(bodyParser.urlencoded({
        extended: true
    }));
    this.express.use(bodyParser.json());


    // Registrar cookies
    this.express.use(cookieParser());


    // Permitir XMLHttpRequest's al servidor JSP
    this.express.use('/app/*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers',
                   'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });


    // Routes de aplicaciones
    portal.apply(this);
    //aula.apply(this);

};
