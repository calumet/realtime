const settings = require('../../settings');

describe('Users Categories', function () {

  describe('GET /api/users-categories', function () {

    it('Get normal categories list', function () {
      return chai.
        request(settings.server).
        get(`/api/users-categories`).
        then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.have.property('body').to.be.an('array');
          res.body.forEach(function (user) {
            expect(user).to.be.an('object');
            expect(user).to.have.property('id').to.be.a('string');
            expect(user).to.have.property('name').to.be.a('string');
          });
        });
    });

  });

});
