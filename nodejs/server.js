var http = require("http");

http.createServer(function(request, response){
	response.writeHead(200, {"Content-Type":"text/plain"});

	response.end("Hello Node JS!");

}).listen(8888);


console.log("Server running at http://127.0.0.1:8888/, remote at http://192.168.179.103:8888/");
