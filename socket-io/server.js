/**
 * socket 服务器程序
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-06 10:53:20
 * @version $Id$
 */

var 
	http 			= require( 'http' ),
	express 		= require( 'express' ),
	socketServer 	= require( 'socket.io' ),
	routes 			= require( './routes'),
	fs 				= require( 'fs' ),
	app 		= express(),
	server 		= http.createServer( app ),
	io;


app.use( express.static( __dirname + '/' ) );

// 路由配置
routes.configRoutes( app, server );

io = socketServer.listen( server );

server.listen( 3000, function () {
	console.log( 'http server listening on port 3000' );
} );