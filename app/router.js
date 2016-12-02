const users = require('api/users');
const log   = require('log');

module.exports = function (server) {

  log.router.info('Initializing...');

  server.get('/api/users',      users.getAll);
  server.get('/api/users/:id',  users.get);

  // HTTP 404
  server.use((req, res) => res.status(404).send('HTTP 404 - Page not found.'));

  // HTTP 5XX
  server.use((err, req, res) => {
    const status = err.status || 500;
    log.router.error(err.stack);
    res.status(status).send(`HTTP ${status} - Server error.`);
  });

  log.router.info('Done.');
};
