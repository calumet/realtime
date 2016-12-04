const Connections = require('./Connections');

const storage = {
  data: null,
  connections: new Connections(),
};

module.exports = storage;
