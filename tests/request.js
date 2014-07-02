// Realtime
// Request tests

// Requerir
var req = http.request(
    {
        hostname: '127.0.0.1',
        port: 7000,
        path: '/some/test',
        method: 'GET'
    },
    function (res) {
        console.log('>>> STATUS: ' + res.statusCode);
        console.log('>>> HEADERS:');
        console.dir(res.headers);
    }
);

// Error
req.on('error', function (err) {
    console.log('>>> Ha ocurrido un error: ' + err.message);
});
