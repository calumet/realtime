const Waterline = require('waterline');
const uuid = require('uuid');

module.exports = function (dbName) {
  return Waterline.Collection.extend({
    identity: 'realtime_room_message',
    tableName: 'TR_RealtimeRoomMessages',
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
      room: {
        columnName: 'RoomId',
        model: 'realtime_space_room',
        type: 'string',
      },
      user: {
        columnName: 'UserId',
        model: 'user',
        type: 'string',
      },
      content: {
        columnName: 'Content',
        type: 'string',
      },
      createdAt: {
        columnName: 'CreatedAt',
        type: 'datetime',
        defaultsTo: () => new Date(),
      },
    },
  })
};
