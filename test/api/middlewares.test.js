const mocking = require('../mocking');

describe('Middlewares', function () {

  describe('Security', function () {

    it('GET /api/users 401', function (done) {
      const case1 = mocking.mock.case1;
      chai.
        request(mocking.server).
        get(`/api/users`).
        end(function (err, res) {
          expect(res).to.have.status(401);
          expect(res).to.be.an('object').to.have.property('body').to.be.an('object');
          expect(res.body).to.have.property('code', 'ERR_AUTH');
          done();
        });
    });

    it('GET /api/realtime 401', function (done) {
      const case1 = mocking.mock.case1;
      chai.
        request(mocking.server).
        get(`/api/realtime`).
        query({
          spaceCode: case1.space,
          userId: case1.user
        }).
        end(function (err, res) {
          expect(res).to.have.status(401);
          expect(res).to.be.an('object').to.have.property('body').to.be.an('object');
          expect(res.body).to.have.property('code', 'ERR_AUTH');
          done();
        });
    });

    it('GET /api/endpoint-not-found 401', function (done) {
      const case1 = mocking.mock.case1;
      chai.
        request(mocking.server).
        get(`/api/endpoint-not-found`).
        end(function (err, res) {
          expect(res).to.have.status(401);
          expect(res).to.be.an('object').to.have.property('body').to.be.an('object');
          expect(res.body).to.have.property('code', 'ERR_AUTH');
          done();
        });
    });

  });

});
