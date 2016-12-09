const settings = require('../../settings');

describe('Rooms', function () {
  describe('Connecting to rooms and sending messages', function () {

    before(function (done) {

      this.socket = io(settings.server, {
        query: {
          spaceCode: settings.mock.case1.space,
          userId: settings.mock.case1.user,
        }
      });

      this.spies = {
        connect: sinon.spy(),
        disconnect: sinon.spy(),
        error: sinon.spy(),
        message: sinon.spy(),
      };

      this.socket.on('connect', this.spies.connect);
      this.socket.on('disconnect', this.spies.disconnect);
      this.socket.on('error', this.spies.error);
      this.socket.on('room:message', this.spies.message);

      setTimeout(done, settings.pause);
    });

    it('User was connected', function () {
      expect(this.spies.connect).to.have.been.calledOnce;
    });

    it('User triggered and received message', function (done) {
      const self = this;
      const room = settings.mock.case1.rooms[0];
      const user = settings.mock.case1.user;
      const content = 'a short message';

      this.socket.emit('room:message', {
        room: room,
        content: content
      });

      setTimeout(function () {
        expect(self.spies.message).to.have.been.calledOnce;
        expect(self.spies.message).to.have.been.calledWithMatch({
          room: room,
          user: user,
          content: content
        });
        done();
      }, settings.pause);
    });

    it('User was not disconnected', function () {
      expect(this.spies.disconnect).to.have.not.been.called;
    });

    it('No error in connection', function () {
      expect(this.spies.error).to.have.not.been.called;
    });

    after(function (done) {
      this.socket.disconnect();
      setTimeout(done, settings.pause);
    });

  });
});
