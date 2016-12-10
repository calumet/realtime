const settings = require('../../settings');

describe('Users', function () {

  describe('GET /api/users', function () {

    it('Get normal users', function () {
      return chai.
        request(settings.server).
        get(`/api/users`).
        then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.have.property('body').to.be.an('array');
          res.body.forEach(function (user) {
            expect(user).to.be.an('object');
            expect(user).to.have.property('id').to.be.a('string');
            expect(user).to.have.property('firstName').to.be.a('string');
            expect(user).to.have.property('lastName').to.be.a('string');
            expect(user).to.have.property('category').to.be.a('string');

            if (user.photo) {
              expect(user).to.have.property('photo').to.be.a('string');
            }
          });
        });
    });

  });

});
