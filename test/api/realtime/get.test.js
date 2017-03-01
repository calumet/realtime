const mocking = require('../../mocking');

describe('Realtime', function () {

  describe('GET /api/realtime', function () {

    it('Get a realtime instance for an user', function () {
      return chai.
        request(mocking.server).
        get(`/api/realtime`).
        set('x-api-token', mocking.token).
        query({
          spaceCode: mocking.mock.case1.space,
          userId: mocking.mock.case1.user
        }).
        then(function (res) {

          // TODO: Test rooms by user inside it. Should not get rooms where the
          // user is not in activedly.

          expect(res).to.have.status(200);
          expect(res).to.have.property('body').to.be.an('object');

          expect(res.body).to.have.property('space').to.be.an('object');

          expect(res.body).to.have.property('rooms').to.be.an('array');
          res.body.rooms.forEach(room => {
            expect(room).to.be.an('object');
            expect(room).to.not.have.property('users');
            expect(room).to.not.have.property('messages');
          });

          expect(res.body).to.have.property('roomsUsers').to.be.an('array');
          res.body.roomsUsers.forEach(user => {
            expect(user).to.be.an('object');
          });

          expect(res.body).to.have.property('roomsMessages').to.be.an('array');
          res.body.roomsMessages.forEach(message => {
            expect(message).to.be.an('object');
          });

          expect(res.body).to.have.property('users').to.be.an('array');
          res.body.users.forEach(user => {
            expect(user).to.be.an('object');
          });

          expect(res.body).to.have.property('connections').to.be.an('array');
          res.body.connections.forEach(con => {
            expect(con).to.be.an('object');
          });
        });
    });

    it('Get a realtime with a non existent space', function (done) {
      chai.
        request(mocking.server).
        get(`/api/realtime`).
        set('x-api-token', mocking.token).
        query({
          spaceCode: 'non-existent-space',
          userId: mocking.mock.case1.user,
        }).
        end(function (err, res) {
          expect(res).to.have.status(400);
          done();
        });
    });

    // TODO: What about the case when an user does not have any rooms.
    // TODO: What if the user does not exist?

  });

});
