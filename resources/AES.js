// Realtime
// AES Encrypt and Decrypt

var crypto = require('crypto');

var iv = new Buffer('0000000000000000');
var encrypt = function(data, key) {
    var decodeKey = crypto.createHash('sha256').update(key, 'utf-8').digest();
    var cipher = crypto.createCipheriv('aes-256-cbc', decodeKey, iv);
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
};

var decrypt = function(data, key) {
    var encodeKey = crypto.createHash('sha256').update(key, 'utf-8').digest();
    var cipher = crypto.createDecipheriv('aes-256-cbc', encodeKey, iv);
    return cipher.update(data, 'hex', 'utf8') + cipher.final('utf8');
};

var data = 'hello'
var key = 'hi';
var cipher = encrypt(data, key);
var decipher = decrypt(cipher, key);
console.log(cipher);
console.log(decipher);
