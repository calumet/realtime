/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Realtime | Security (AES Encrypt and Decrypt for node.js)
 * Romel Pérez, prhone.blogspot.com
 * 2015
 **/

var crypto = require('crypto');
var config = require('./config');


// -------------------------------------------------------------------------- //
// ENCRYPTION AND DECRYPTION //

/**
 * Para la comunicación entre Java y Node.js, se utiliza este sistema de
 * cifrado y descrifrado. La llave privada de cifrado se comparte entre los dos
 * para realizar los procedimientos de autentificación.
 */

var iv = new Buffer('0000000000000000');
var key = config.security.key;

exports.encrypt = function (data) {
  var decodeKey = crypto.createHash('sha256').update(key, 'utf-8').digest();
  var cipher = crypto.createCipheriv('aes-256-cbc', decodeKey, iv);
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
};

exports.decrypt = function (data) {
  var encodeKey = crypto.createHash('sha256').update(key, 'utf-8').digest();
  var cipher = crypto.createDecipheriv('aes-256-cbc', encodeKey, iv);
  return cipher.update(data, 'hex', 'utf8') + cipher.final('utf8');
};
