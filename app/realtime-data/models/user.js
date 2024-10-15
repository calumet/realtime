const Waterline = require('waterline');

module.exports = function (dbName) {
  return Waterline.Collection.extend({
    identity: 'user',
    tableName: 'TP_Usuarios',
    connection: [dbName],
    migrate: 'safe',
    autoPK: false,
    autoCreatedAt: false,
    autoUpdatedAt: false,

    attributes: {
      id: {
        columnName: 'IdUsr',
        type: 'string',
        primaryKey: true,
      },
      category: {
        columnName: 'IdCat',
        model: 'user_category',
        type: 'string',
      },
      firstName: {
        columnName: 'PrimNomUsr',
        type: 'string',
      },
      lastName: {
        columnName: 'PrimApeUsr',
        type: 'string',
      },
      photo: {
        columnName: 'Foto',
        type: 'string',
      },
    },
  })
};
