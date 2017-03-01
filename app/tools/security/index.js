const md5 = require('md5');
const settings = require('settings');
const consts = require('consts');

module.exports = {

  /**
   * Comparar el token proveido para una comunicación con el obtenido en el
   * servidor. Retorna si es válido. En caso de estar en modo testing, compara
   * el token con uno de pruebas.
   * @param {Object} props
   * @param {String} props.token
   * @param {String} props.userId
   * @return {Boolean}
   */
  isValid ({ token, userId }) {
    const { prefix, separator } = consts.security;
    const { env, testToken, signature } = settings;
    const serverToken = md5(`${prefix}${separator}${signature}${separator}${userId}`);
    return token === serverToken || (env === 'test' && token === testToken);
  },

  /**
   * Crear un token a partir de datos de una comunicación.
   * @param {Object} props
   * @param {String} props.userId
   * @return {String}
   */
  createToken ({ userId }) {
    const { prefix, separator : sep } = consts.security;
    const { signature } = settings;
    return md5(`${prefix}${sep}${signature}${sep}${userId}`);
  }
};
