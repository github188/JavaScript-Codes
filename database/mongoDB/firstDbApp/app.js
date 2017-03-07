/**
 * MongoDB 测试项目
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-07 15:22:58
 * @version $Id$
 */


var 
	http 			= require( 'http' ),
	express 		= require( 'express' ),
	socket 			= require( 'socket.io' ),
	routes 			= require( './routes' ),
	static 			= require( 'serve-static' ),

	app 			= express(),
	httpServer 		= http.createServer( app ),
	io;

app.use( static( __dirname + '/' ) );

routes.configRoutes( app, httpServer );

io = socket.listen( httpServer );

httpServer.listen( 3000, function () {
	debug( 'Http server listening on port 3000' );
} );


function debug( str, split ) {

	if ( split ) {
		console.log( split );
	}
	console.log( str );
}