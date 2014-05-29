// Realtime
// Request test

var http = require('http');


// Enviar solicitud
var req = http.request(
    {
        hostname: 'localhost',
        port: 9000,
        path: '/',
        method: 'GET'
    },
    function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS:');
        console.dir(res.headers);
    }
);


// En caso de error
req.on('error', function (err) {
    console.log('>>> Ha ocurrido un error...');
});
