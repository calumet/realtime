const Waterline = require('waterline');

module.exports = function (dbName) {
  return Waterline.Collection.extend({
    identity: 'user_category',
    tableName: 'TB_Categorias',
    connection: [dbName],
    migrate: 'safe',
    autoPK: false,
    autoCreatedAt: false,
    autoUpdatedAt: false,

    attributes: {
      id: {
        columnName: 'IdCat',
        type: 'string',
        primaryKey: true,
      },
      name: {
        columnName: 'NomCat',
        type: 'string',
      },
    },
  })
};
