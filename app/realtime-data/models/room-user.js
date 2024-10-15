const Waterline = require('waterline');
const uuid = require('uuid');

module.exports = function (dbName) {
  return Waterline.Collection.extend({
    identity: 'realtime_room_user',
    tableName: 'TR_RealtimeRoomUsers',
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
      moderator: {
        columnName: 'Moderator',
        type: 'boolean',
      },
      inactive: {
        columnName: 'Inactive',
        type: 'boolean',
      },
    },
  })
};
