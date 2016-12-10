const settings = require('../../settings');

describe('Realtime Spaces', function () {

  describe('GET /api/realtime-spaces/:id', function () {

    it('Get a normal space', function () {
      const id = settings.mock.spaceId;
      return chai.
        request(settings.server).
        get(`/api/realtime-spaces/${id}`).
        then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.have.property('body').to.be.an('object');
          expect(res.body).to.have.property('id').to.be.a('number', id);
          expect(res.body).to.have.property('name').to.be.a('string');
          expect(res.body).to.have.property('code').to.be.a('string');
        });
    });

    it('Get a non existent space', function () {
      return chai.
        request(settings.server).
        get('/api/realtime-spaces/nonexistentuser').
        then(function (res) {
          throw new Error('Expected an error response');
        }).
        catch(function (err) {
          expect(err).to.have.status(404);
        });
    });

  });

});
