const Waterline = require('waterline');
const uuid = require('uuid');

module.exports = function (dbName) {
  return Waterline.Collection.extend({
    identity: 'realtime_space_room',
    tableName: 'TP_RealtimeSpaceRooms',
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
      space: {
        columnName: 'SpaceId',
        model: 'realtime_space',
        type: 'string',
      },
      name: {
        columnName: 'Name',
        type: 'string',
      },
      tag: {
        columnName: 'Tag',
        type: 'string',
      },
      createdAt: {
        columnName: 'CreatedAt',
        type: 'datetime',
        defaultsTo: () => new Date(),
      },
      disabled: {
        columnName: 'Disabled',
        type: 'boolean',
      },
      users: {
        collection: 'realtime_room_user',
        via: 'room',
      },
      messages: {
        collection: 'realtime_room_message',
        via: 'room',
      },
    },
  })
};
