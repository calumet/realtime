const settings = require('../../settings');

describe('Connect', function () {
  describe('User not found', function () {

    before(function (done) {

      this.socket = io(settings.server, {
        query: {
          spaceCode: settings.mock.case1.space,
          userId: 'non-existent-user',
        }
      });

      this.spies = {
        connect: sinon.spy(),
        disconnect: sinon.spy(),
        error: sinon.spy(),
      };

      this.socket.on('connect', this.spies.connect);
      this.socket.on('disconnect', this.spies.disconnect);
      this.socket.on('error', this.spies.error);

      setTimeout(done, settings.pause);
    });

    it('User was not connected', function () {
      expect(this.spies.connect).to.have.not.been.called;
    });

    it('User was not disconnected', function () {
      expect(this.spies.disconnect).to.have.not.been.called;
    });

    it('Error was received', function () {
      expect(this.spies.error).to.have.been.called;
    });

    after(function (done) {
      this.socket.disconnect();
      setTimeout(done, settings.pause);
    });

  });
});
