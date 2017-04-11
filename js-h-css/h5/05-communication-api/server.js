
var http    = require('http'),
    express = require('express'),
    serverStatic = require('serve-static'),
    app = express(),
    server;


app.use(serverStatic(__dirname + '/'));

app.get('/', function (req, res) {
    res.redirect('/iframe-index.html');
    // res.send('hello world!');

});

server = http.createServer( app );
server.listen(3000, function () {
    console.log('express server listening on port 3000.');
});