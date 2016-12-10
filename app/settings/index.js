const settings    = require('./settings');
const production  = require('./production');
const development = require('./development');
const test        = require('./test');

let local;
try {
  local = require('./local');
} catch (e) {
  local = {};
}

if (settings.env === 'development') {
  Object.assign(settings, development);
}
else if (settings.env === 'production') {
  Object.assign(settings, production);
}
else if (settings.env === 'test') {
  Object.assign(settings, test);
}

Object.assign(settings, local);

module.exports = settings;
