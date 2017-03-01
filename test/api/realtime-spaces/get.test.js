const mocking = require('../../mocking');

describe('Realtime Spaces', function () {

  describe('GET /api/realtime-spaces/:id', function () {

    it('Get a normal space', function () {
      const id = mocking.mock.spaceId;
      return chai.
        request(mocking.server).
        get(`/api/realtime-spaces/${id}`).
        set('x-api-token', mocking.token).
        then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.have.property('body').to.be.an('object');
          expect(res.body).to.have.property('id').to.be.a('string', id);
          expect(res.body).to.have.property('name').to.be.a('string');
          expect(res.body).to.have.property('code').to.be.a('string');
        });
    });

    it('Get a non existent space', function (done) {
      chai.
        request(mocking.server).
        get('/api/realtime-spaces/non-existent-user').
        set('x-api-token', mocking.token).
        end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });

  });

});
