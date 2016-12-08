const log = require('log');
const storage = require('storage');

const getAll = function (req, res, next) {
  storage.data.models.user.
    find().
    then(users => res.json(users)).
    catch((err) => {
      log.router.error(err);
      res.status(500).end();
    });
};

const get = function (req, res, next) {

  const { id } = req.params;

  storage.data.models.user.
    findOne({ id }).
    then(user => {
      if (!user) return res.status(404).end();
      res.json(user);
    }).
    catch((err) => {
      log.router.error(err);
      res.status(500).end();
    });
};

module.exports = {
  getAll,
  get
};
