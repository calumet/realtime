module.exports = {
  security: {
    prefix: 'realtime',
    separator: '-',
  },
  http: {
    ERR_AUTH: 'HTTP_ERR_AUTH',
  },
  sockets: {
    ERR_AUTH: 'SOCKET_ERR_AUTH',
    ERR_NOUSR: 'SOCKET_ERR_NOUSR',
    ERR_NOSPACE: 'SOCKET_ERR_NOSPACE',
  },
};
