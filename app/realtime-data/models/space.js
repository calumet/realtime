const Waterline = require('waterline');
const uuid = require('uuid');

module.exports = function (dbName) {
  return Waterline.Collection.extend({
    identity: 'realtime_space',
    tableName: 'TB_RealtimeSpaces',
    connection: [dbName],
    migrate: 'safe',
    autoPK: false,
    autoCreatedAt: false,
    autoUpdatedAt: false,

    attributes: {
      id: {
        columnName: 'Id',
        type: 'string',
        primaryKey: true,
        unique: true,
        defaultsTo: () => uuid.v4(),
      },
      code: {
        columnName: 'Code',
        type: 'string',
      },
      name: {
        columnName: 'Name',
        type: 'string',
      },
      rooms: {
        collection: 'realtime_space_room',
        via: 'space',
      },
    },
  })
};
