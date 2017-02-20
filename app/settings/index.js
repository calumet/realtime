const settings    = require('./settings');
const production  = require('./production');

let local;
try {
  local = require('./local');
} catch (e) {
  local = {};
}

if (settings.env === 'production') {
  Object.assign(settings, production);
}

Object.assign(settings, local);

module.exports = settings;
