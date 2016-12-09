const settings = require('../../settings');

describe('Rooms', function () {
  describe('Messages with sockets in different rooms', function () {

    before(function () {
      this.spies = {};
    });

    it('Connect socket 1', function (done) {

      this.s1 = io(settings.server, {
        query: {
          spaceCode: settings.mock.case1.space,
          userId: settings.mock.case1.user,
        }
      });

      this.spies.s1 = {
        connect: sinon.spy(),
        disconnect: sinon.spy(),
        error: sinon.spy(),
        message: sinon.spy(),
        userConnect: sinon.spy(),
        userDisconnect: sinon.spy(),
      };

      this.s1.on('connect', this.spies.s1.connect);
      this.s1.on('disconnect', this.spies.s1.disconnect);
      this.s1.on('error', this.spies.s1.error);
      this.s1.on('room:message', this.spies.s1.message);
      this.s1.on('room:user:connect', this.spies.s1.userConnect);
      this.s1.on('room:user:disconnect', this.spies.s1.userDisconnect);

      setTimeout(done, settings.pause);
    });

    it('Connect socket 2', function (done) {
      this.s2 = io(settings.server, {
        query: {
          spaceCode: settings.mock.case2.space,
          userId: settings.mock.case2.user,
        }
      });

      this.spies.s2 = {
        connect: sinon.spy(),
        disconnect: sinon.spy(),
        error: sinon.spy(),
        message: sinon.spy(),
        userConnect: sinon.spy(),
        userDisconnect: sinon.spy(),
      };

      this.s2.on('connect', this.spies.s2.connect);
      this.s2.on('disconnect', this.spies.s2.disconnect);
      this.s2.on('error', this.spies.s2.error);
      this.s2.on('room:message', this.spies.s2.message);
      this.s2.on('room:user:connect', this.spies.s2.userConnect);
      this.s2.on('room:user:disconnect', this.spies.s2.userDisconnect);

      setTimeout(done, settings.pause);
    });

    it('Users were connected', function () {
      expect(this.spies.s1.connect).to.have.been.calledOnce;
      expect(this.spies.s2.connect).to.have.been.calledOnce;
    });

    it('Socket 1 received user connection from socket 2', function () {
      expect(this.spies.s1.userConnect).to.have.been.calledTwice;
    });

    it('User1 sent and received a message in isolated room', function (done) {
      const self = this;
      const room = settings.mock.case1.isolatedRoom;
      const user = settings.mock.case1.user;
      const content = 'a short message';

      this.s1.emit('room:message', {
        room: room,
        content: content
      });

      setTimeout(function () {

        expect(self.spies.s1.message).to.have.been.calledOnce;
        expect(self.spies.s1.message).to.have.been.calledWithMatch({
          room: room,
          user: user,
          content: content
        });

        expect(self.spies.s2.message).to.have.not.been.called;

        done();
      }, settings.pause);
    });

    it('Disconnect socket 2', function (done) {
      this.s2.disconnect();
      setTimeout(done, settings.pause);
    });

    it('Socket 1 got socket 2 disconnected', function () {
      expect(this.spies.s1.userDisconnect).to.have.been.calledTwice;
    });

    it('Users did not have problems', function () {
      expect(this.spies.s1.error).to.have.not.been.called;
      expect(this.spies.s2.error).to.have.not.been.called;
    });

    after(function (done) {
      this.s1.disconnect();
      setTimeout(done, settings.pause);
    });

  });
});
