


var http = require('http');


http.createServer(function (req, res) {

    res.end('hello http server !');

}).listen(8888, function () {
    console.log('http server listen on port 8888.')
});