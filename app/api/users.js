const log = require('log');
const storage = require('storage');

const getAll = function (req, res, next) {
  storage.data.User.
    findAll().
    then((result) => {
      const users = result.map(item => item.dataValues);
      res.json(users);
    }).
    catch((err) => {
      log.router.error(err);
      res.status(500).json({});
    });
};

const get = function (req, res, next) {

  const { id } = req.params;
  const query = { where: { id } };

  storage.data.User.
    findOne(query).
    then(({ dataValues : user }) => res.json(user)).
    catch((err) => {
      log.router.error(err);
      res.status(404).json({});
    });
};

module.exports = {
  getAll,
  get
};
