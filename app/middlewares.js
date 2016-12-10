const morgan      = require('morgan');
const compression = require('compression');
const bodyParser  = require('body-parser');
const session     = require('cookie-session');
const log         = require('log');
const settings    = require('settings');
const resources   = require('resources');

module.exports = function () {

  const { server } = resources;

  log.middlewares.info('Initializing...');

  server.use(morgan('short'));
  server.use(compression());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(session(settings.session));

  server.use('/api/', function (req, res, next) {
    // TODO: Security middleware.
    next();
  });

  server.use('/api/', function (req, res, next) {

    // Enable CORS.
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    // Disable CACHE.
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
    res.header('Pragma', 'no-cache'); // HTTP 1.0.
    res.header('Expires', '0'); // Proxies.

    next();
  });

  log.middlewares.info('Done.');
};
