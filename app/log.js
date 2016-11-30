const winston = require('winston');
const chalk = require('chalk');

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

const log = {};

winston.loggers.add('app', {
  console: {
    level: 'silly',
    colorize: true,
    label: 'App'
  }
});
log.app = winston.loggers.get('app');

winston.loggers.add('db', {
  console: {
    level: 'silly',
    colorize: true,
    label: 'DB'
  }
});
log.db = winston.loggers.get('db');

winston.loggers.add('router', {
  console: {
    level: 'silly',
    colorize: true,
    label: 'Router'
  }
});
log.router = winston.loggers.get('router');

winston.loggers.add('middlewares', {
  console: {
    level: 'silly',
    colorize: true,
    label: 'Middlewares'
  }
});
log.middlewares = winston.loggers.get('middlewares');

log.app.env = function () {
  log.app.info(chalk.bold.green(`Running on "${NODE_ENV}" environment.`));
};

module.exports = log;
