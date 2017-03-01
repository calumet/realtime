const md5 = require('md5');
const consts = require('consts');
const settings = require('settings');
const security = require('./index');

describe('Tools', function () {
  describe('security', function () {

    describe('isValid()', function () {

      it('Requires object parameter', function () {
        expect(function () { security.isValid(); }).to.throw();
      });

      it('Returns a boolean', function () {
        const actual = security.isValid({});
        expect(actual).to.be.a('boolean');
      });

      it('Same props should indicate it is authenticated', function () {
        const userId = 'U123456';
        const token = md5(`realtime-${settings.signature}-${userId}`);
        const actual = security.isValid({ token, userId });
        expect(actual).to.be.true;
      });

      it('One different userId should indicate is invalid', function () {
        const token = md5(`realtime-${settings.signature}-U0000`);
        const actual = security.isValid({ token, userId: 'U1122' });
        expect(actual).to.be.false;
      });

      it('One different signature should indicate is invalid', function () {
        const userId = 'U123456';
        const token = md5(`realtime-ANINVALIDSIGNATURE-${userId}`);
        const actual = security.isValid({ token, userId });
        expect(actual).to.be.false;
      });

      it('In testing environment, compare with testing token', function () {
        const env = settings.env;

        // En modo production
        settings.env = 'production';
        expect(security.isValid({ token: settings.testToken })).to.be.false;

        // En modo test
        settings.env = 'test';
        expect(security.isValid({ token: settings.testToken })).to.be.true;

        settings.env = env;
      });

    });

    describe('createToken()', function () {

      it('Requires an object parameter', function () {
        expect(function () { security.createToken(); }).to.throw();
      });

      it('Should return an string', function () {
        const actual = security.createToken({ userId: 'U0000' });
        expect(actual).to.be.a('string');
      });

      it('Should return a token for an user based on props', function () {
        const { prefix, separator } = consts.security;
        const { signature } = settings;
        const userId = 'U123456';
        const actual = security.createToken({ userId });
        const expected = md5(`${prefix}${separator}${signature}${separator}${userId}`);
        expect(actual).to.equal(expected);
      });

    });

  });
});
