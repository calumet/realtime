const log = require('log');
const resources = require('resources');

const getAll = function (req, res, next) {
  resources.data.models.realtime_space.
    find().
    then(spaces => res.json(spaces)).
    catch(err => {
      log.router.error(err);
      res.status(500).end();
    });
};

const get = function (req, res, next) {

  const { id } = req.params;

  resources.data.models.realtime_space.
    findOne({ id }).
    then(space => {
      if (!space) return res.status(404).end();
      res.json(space);
    }).
    catch(err => {
      log.router.error(err);
      res.status(500).end();
    });
};

module.exports = {
  getAll,
  get
};
