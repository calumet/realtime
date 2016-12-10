const settings = require('../../settings');

describe('Realtime Spaces', function () {

  describe('GET /api/realtime-spaces', function () {

    it('Get normal spaces', function () {
      return chai.
        request(settings.server).
        get(`/api/realtime-spaces`).
        then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.have.property('body').to.be.an('array');
          res.body.forEach(function (user) {
            expect(user).to.be.an('object');
            expect(user).to.have.property('id').to.be.a('number');
            expect(user).to.have.property('code').to.be.a('string');
            expect(user).to.have.property('name').to.be.a('string');
          });
        });
    });

  });

});
