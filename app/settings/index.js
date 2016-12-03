const base = require('./base');
const production = require('./production');

const settings = base;

if (base.env === 'production') {
  Object.assign(settings, production);
}

module.exports = settings;
