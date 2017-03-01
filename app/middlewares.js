const morgan      = require('morgan');
const compression = require('compression');
const bodyParser  = require('body-parser');
const session     = require('cookie-session');
const consts      = require('consts');
const settings    = require('settings');
const log         = require('log');
const resources   = require('resources');
const security    = require('tools/security');

module.exports = function () {

  const { server } = resources;

  log.middlewares.info('Initializing...');

  server.use(morgan('short'));
  server.use(compression());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(session(settings.session));

  // Verificación de seguridad.
  server.use('/api/', function (req, res, next) {

    const token = req.headers['x-api-token'];
    const userId = req.headers['x-api-userid'];
    const isValid = security.isValid({ token, userId });

    if (isValid) {
      next();
    }
    else {
      res.status(401).json({ code: consts.http.ERR_AUTH });
    }
  });

  // Habilitar CORS.
  server.use('/api/', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', [
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Accept',
      'x-api-token',
      'x-api-userid'
    ].join(', '));
    next();
  });

  // Deshabilitar cache.
  server.use('/api/', function (req, res, next) {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
    res.header('Pragma', 'no-cache'); // HTTP 1.0.
    res.header('Expires', '0'); // Proxies.
    next();
  });

  // Habilitar verbo HTTP OPTIONS.
  server.options('*', function (req, res) {
      res.status(200).end();
  });

  log.middlewares.info('Done.');
};
