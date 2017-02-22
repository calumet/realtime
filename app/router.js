const log             = require('log');
const resources       = require('resources');
const users           = require('api/users');
const usersCategories = require('api/users-categories');
const realtime        = require('api/realtime');
const realtimeSpaces  = require('api/realtime-spaces');

module.exports = function () {

  const { server } = resources;

  log.router.info('Initializing...');

  // Users
  server.get('/api/users',      users.getAll);
  server.get('/api/users/:id',  users.get);

  // Categories
  server.get('/api/users-categories',     usersCategories.getAll);
  server.get('/api/users-categories/:id', usersCategories.get);

  // Realtime Spaces
  server.get('/api/realtime', realtime.get);

  // Spaces
  server.get('/api/realtime-spaces',     realtimeSpaces.getAll);
  server.get('/api/realtime-spaces/:id', realtimeSpaces.get);

  // HTTP 404
  server.use((req, res) => res.status(404).send(''));

  // HTTP 5XX
  server.use((err, req, res) => {
    const status = err.status || 500;
    log.router.error(err.stack);
    res.status(status).send(``);
  });

  log.router.info('Done.');
};
