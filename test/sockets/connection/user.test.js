const mocking = require('../../mocking');

describe('Connect', function () {
  describe('User not found', function () {

    before(function (done) {

      this.socket = io(mocking.server, {
        query: {
          token: mocking.token,
          spaceCode: mocking.mock.case1.space,
          userId: 'non-existent-user',
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
      expect(this.spies.error).to.have.been.calledWith({ code: 'ERR_NOUSR' });
    });

    after(function (done) {
      this.socket.disconnect();
      setTimeout(done, mocking.pause);
    });

  });
});
