const mocking = require('../../mocking');

describe('Users Categories', function () {

  describe('GET /api/users-categories/:id', function () {

    it('Get a normal user category', function () {
      const id = mocking.mock.userCategory;
      return chai.
        request(mocking.server).
        get(`/api/users-categories/${id}`).
        set('x-api-token', mocking.token).
        then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.have.property('body').to.be.an('object');
          expect(res.body).to.have.property('id').to.be.a('string', id);
          expect(res.body).to.have.property('name').to.be.a('string');
        });
    });

    it('Get a non existent category', function (done) {
      chai.
        request(mocking.server).
        get('/api/users-categories/nonexistentusercategory').
        set('x-api-token', mocking.token).
        end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });

  });

});
