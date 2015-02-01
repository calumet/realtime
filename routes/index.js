/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Routes
 * Romel Pérez, prhone.blogspot.com
 * 2015
 **/

var cookie = require('cookie');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('../config');
var security = require('../security');
var portal = require('./routes.portal');
var aula = require('./routes.aula');
var log = require('../libs/log')('routes');


// -------------------------------------------------------------------------- //
// GLOBAL PROCEDURES AND ROUTES //

/**
 * Aquí se registran los middlewares que debe recorrer toda petición al servidor. 
 * 
 * > Todas las rutas que comienzan con /app/*, se inspeccionan antes pasar a sus
 * respetivos middlewares, para verificar que tengan las cookies de seguridad.
 * 
 * > Se agrega un header de respuesta a todas las rutas que comienzan por /app/*
 * para que puedan ser leidas desde el mismo servidor en el puerto 80.
 */

module.exports = exports = function () {

  // Registrar cookies.
  this.express.use(cookieParser());

  // Registrar datos de HTTP POST.
  this.express.use(bodyParser.urlencoded({
    extended: true
  }));
  this.express.use(bodyParser.json());

  // Respuesta de HTTP GET /.
  this.express.get('/', function (req, res, next) {
    log.debug('HTTP GET / '+ req.ip);
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send('<!DOCTYPE HTML><html lang="es"><head>'
      +'<meta charset="UTF-8">'
      +'<meta name="viewport" content="width=device-width, initial-scale=1.0">'
      +'<title>UIS, Calumet, Realtime - Bucaramanga, Colombia</title>'
      +'<style>body{margin:20px;font:normal normal 1em/1.5 sans-serif;'
      +'color:#444;background-color:#FFF;}</style>'
    +'</head><body>'
      +'<p>Universidad Industrial de Santander.<br>'
      +'Grupo de Desarrollo de Software Calumet.<br>'
      +'Sistema de aplicaciones de comunicación en tiempo real.<br>'
      +'Bucaramanga, Colombia.<br>'
      +'<a href="http://github.com/calumet/realtime">Acerca del proyecto...</a></p>'
    +'</body></html>');
  });

  // Permitir XMLHttpRequest sólo del servidor JSP (puerto 80), permitiendo
  // compartir cookies.
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
  this.express.use('/app/*', function(req, res, next) {
    req.ipFiltered = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.header('Access-Control-Allow-Origin', 'http://'+ config.host);
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  // Autorizar acceso a servicios para aplicaciones sólo a usuarios logueados.
  // Para las XMLHttpRequest, se necesita enviar un flag para que se puedan
  // enviar también las cookies, sino, entonces no podrá ser autentificado:
  // http://stackoverflow.com/questions/2870371/
  // $.ajax({..., xhrFields: {withCredentials: true}});
  this.express.use('/app/*', function (req, res, next) {
    var cookies = req.cookies;
    var userId = String(cookies[config.security.user]);
    var localKey = security.encrypt(userId).toUpperCase();
    var sentKey = String(cookies[config.security.door]).toUpperCase();

    if (!userId || (!sentKey || (sentKey && localKey !== sentKey))) {
      res.json({error: true});
    } else {
      next();
    }
  });

  // Routes de aplicaciones.
  portal.apply(this);
  aula.apply(this);
};
