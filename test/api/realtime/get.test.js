const settings = require('../../settings');

describe('Realtime', function () {

  describe('GET /api/realtime', function () {

    it('Get a realtime instance for an user', function () {
      const case1 = settings.mock.case1;
      return chai.
        request(settings.server).
        get(`/api/realtime`).
        query({ spaceCode: case1.space, userId: case1.user }).
        then(function (res) {

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

  });

});
