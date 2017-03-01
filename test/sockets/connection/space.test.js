const mocking = require('../../mocking');

describe('Connect', function () {
  describe('Space not found', function () {

    before(function (done) {

      this.socket = io(mocking.server, {
        query: {
          token: mocking.token,
          spaceCode: 'space-not-found',
          userId: mocking.mock.case1.user,
        }
      });

      this.spies = {
        connect: sinon.spy(),
        error: sinon.spy(),
      };

      this.socket.on('connect', this.spies.connect);
      this.socket.on('error', this.spies.error);

      setTimeout(done, mocking.pause);
    });

    it('User was not connected', function () {
      expect(this.spies.connect).to.have.not.been.called;
    });

    it('Error was received', function () {
      expect(this.spies.error).to.have.been.calledOnce;
      expect(this.spies.error).to.have.been.calledWith({ code: 'SOCKET_ERR_NOSPACE' });
    });

    after(function (done) {
      this.socket.disconnect();
      setTimeout(done, mocking.pause);
    });

  });
});
