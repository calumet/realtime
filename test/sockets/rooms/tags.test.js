const settings = require('../../settings');

describe('Rooms', function () {
  describe('Connect to rooms with a tag', function () {

    before(function (done) {

      this.socket = io(settings.server, {
        query: {
          spaceCode: settings.mock.case3.space,
          roomTag: settings.mock.case3.roomTag,
          userId: settings.mock.case3.user,
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

    it('User sent a message to an outside room', function (done) {
      const self = this;
      const noTagRoom = settings.mock.case3.noTagRoom;

      this.socket.emit('room:message', { room: noTagRoom, content: 'content' });

      setTimeout(function () {
        expect(self.spies.message).to.have.not.been.calledOnce;
        done();
      }, settings.pause);
    });

    it('User sent a message to an shared room', function (done) {
      const self = this;
      const sharedRoom = settings.mock.case3.sharedRoom;

      this.socket.emit('room:message', { room: sharedRoom, content: 'content' });

      setTimeout(function () {
        expect(self.spies.message).to.have.been.calledOnce;
        expect(self.spies.message).to.have.been.calledWithMatch({ room: sharedRoom });
        done();
      }, settings.pause);
    });

    it('User sent a message to an tagged room', function (done) {
      const self = this;
      const isolatedRoom = settings.mock.case3.isolatedRoom;

      this.socket.emit('room:message', { room: isolatedRoom, content: 'content' });

      setTimeout(function () {
        expect(self.spies.message).to.have.been.calledTwice;
        expect(self.spies.message).to.have.been.calledWithMatch({ room: isolatedRoom });
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
