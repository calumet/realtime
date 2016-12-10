const log = require('log');
const resources = require('resources');

const getAll = function (req, res, next) {
  resources.data.models.user_category.
    find().
    then(categories => res.json(categories)).
    catch(err => {
      log.router.error(err);
      res.status(500).end();
    });
};

const get = function (req, res, next) {

  const { id } = req.params;

  resources.data.models.user_category.
    findOne({ id }).
    then(category => {
      if (!category) return res.status(404).end();
      res.json(category);
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
