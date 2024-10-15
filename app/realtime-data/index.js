const Waterline = require('waterline');
const mysqlAdapter = require('sails-mysql');
const userCategory = require('./models/user-category.js');
const user = require('./models/user.js');
const space = require('./models/space.js');
const spaceRoom = require('./models/space-room.js');
const roomMessage = require('./models/room-message.js');
const roomUser = require('./models/room-user.js');

class Data {

  // mysql
  // db
  // config
  // collections
  // connections

  constructor(settings) {
    this.mysql = settings.mysql;
    this.db = new Waterline();

    this.db.loadCollection(user(this.mysql.schoolName));
    this.db.loadCollection(userCategory(this.mysql.schoolName));
    this.db.loadCollection(space(this.mysql.schoolName));
    this.db.loadCollection(spaceRoom(this.mysql.schoolName));
    this.db.loadCollection(roomMessage(this.mysql.schoolName));
    this.db.loadCollection(roomUser(this.mysql.schoolName));

  }

  init(callback) {
    const m = this.mysql;

    this.config = {
      adapters: {
        mysql: mysqlAdapter,
      },
      connections: {
        [m.schoolName]: {
          adapter: 'mysql',
          url: `mysql2://${m.user}:${m.pass}@${m.host}:${m.port}/${m.db}`,
        },
      },
    };

    return this.db.initialize(this.config, (err, models) => {
      if (err) {
        if (callback) {
          callback(err, models);
        }
        else {
          throw err;
        }
      }
      else {
        this.models = models.collections;
        this.connections = models.connections;
        callback(err, models);
      }
    });
  }
}

module.exports = Data;
