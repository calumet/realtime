const settings = require('../../settings');

describe('Users Categories', function () {

  describe('GET /api/users-categories/:id', function () {

    it('Get a normal user category', function () {
      const id = settings.mock.userCategory;
      return chai.
        request(settings.server).
        get(`/api/users-categories/${id}`).
        then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.have.property('body').to.be.an('object');
          expect(res.body).to.have.property('id').to.be.a('string', id);
          expect(res.body).to.have.property('name').to.be.a('string');
        });
    });

    it('Get a non existent category', function () {
      return chai.
        request(settings.server).
        get('/api/users-categories/nonexistentusercategory').
        then(function (res) {
          throw new Error('Expected an error response');
        }).
        catch(function (err) {
          expect(err).to.have.status(404);
        });
    });

  });

});
