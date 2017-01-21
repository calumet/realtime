const settings    = require('./settings');
const production  = require('./production');
const test        = require('./test');

let local;
try {
  local = require('./local');
} catch (e) {
  local = {};
}

if (settings.env === 'test') {
  Object.assign(settings, test);
}
else if (settings.env === 'production') {
  Object.assign(settings, production);
}

Object.assign(settings, local);

module.exports = settings;
