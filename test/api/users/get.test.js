const settings = require('../../settings');

describe('Users', function () {

  describe('GET /api/users/:id', function () {

    it('Get a normal user', function () {
      return chai.
        request(settings.server).
        get(`/api/users/${settings.mock.user}`).
        then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.have.property('body').to.be.an('object');
          const body = res.body;
          expect(body).to.have.property('id').to.be.a('string');
          expect(body).to.have.property('firstName').to.be.a('string');
          expect(body).to.have.property('lastName').to.be.a('string');
        });
    });

    it('Get a non existent user', function () {
      return chai.
        request(settings.server).
        get('/api/users/nonexistentuser').
        then(function (res) {
          throw new Error('Should get a non-success response');
        }).
        catch(function (err) {
          expect(err).to.have.status(404);
        });
    });

  });

});
