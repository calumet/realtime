const mocking = require('../../mocking');

describe('Users Categories', function () {

  describe('GET /api/users-categories', function () {

    it('Get normal categories list', function () {
      return chai.
        request(mocking.server).
        get(`/api/users-categories`).
        set('x-api-token', mocking.token).
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
