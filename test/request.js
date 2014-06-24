// Realtime
// Request tests

var http = require('http');

// Enviar solicitud
var req = http.request(
    {
        hostname: '127.0.0.1',
        port: 9000,
        path: '/some/test',
        method: 'GET'
    },
    function (res) {
        console.log('>>> STATUS: ' + res.statusCode);
        console.log('>>> HEADERS:');
        console.dir(res.headers);
    }
);

// En caso de error
req.on('error', function (err) {
    console.log('>>> Ha ocurrido un error: ' + err.message);
});
