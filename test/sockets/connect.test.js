const settings = require('../settings');

describe('Connect', function () {

  before(function (done) {

    var query = {
      spaceCode: settings.mock.space,
      userId: settings.mock.user,
    };
    this.socket = io(settings.server, { query: query });

    this.spies = {
      connect: sinon.spy(),
      disconnect: sinon.spy(),
      error: sinon.spy(),
    };

    this.socket.on('connect', this.spies.connect);
    this.socket.on('disconnect', this.spies.disconnect);
    this.socket.on('error', this.spies.error);

    setTimeout(done, 100);
  });

  it('User was connected', function () {
    expect(this.spies.connect).to.have.been.calledOnce;
  });

  // TODO: Test user event-driven data communication.

  it('User was not disconnected', function () {
    expect(this.spies.disconnect).to.have.not.been.called;
  });

  it('No error in connection', function () {
    expect(this.spies.error).to.have.not.been.called;
  });

});
