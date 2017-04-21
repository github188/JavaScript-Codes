

var http = require('http'),
    fs  = require('fs');

http.createServer(function (req, res) {


    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': 'http://192.168.179.103'
    });

    if ( req.url === '/' ) {
        res.end('hello http server !');
    } else if (req.url === '/personal') {

        // console.log(req)

        res.end(req.toString());

        console.log(http.IncomingMessage)


        /* 文件读取，响应请求
        fs.readFile('./personal.json', 'utf8', function (err, data) {
            
            // '{ "name": "lizc-node", "age": 30, "height": "168cm"}'

            if ( err ) throw err;

            console.log(typeof data);

            res.end(data);
        }); */
    }


    console.log('request from ' + req.url)

    
}).listen(8888, function () {
    console.log('http server listening on port 8888.')
});