/*
	测试文件
 */


var 
	http 			= require( 'http' ),
	express 		= require( 'express' ),
	socketServer 	= require( 'socket.io' ),

	app = express(),
	io, server, nsp;


app.use( '/', function ( req, res ) {
	debug( io.eio.clients );

	res.contentType( 'json' );
	res.send( 'hello world ' );
});

server = http.createServer( app );

io = socketServer( server );

nsp = io.nsps['/'];

io.of( '/socket.io' ).clients( function ( error, clients ) {
	if ( error ) throw error;

	debug( clients );
} );

debug( io.eio.clients );


server.listen( 3000, function () {
	console.log( 'http server listening on port 3000 ' );
} );


function debug( str ) {
	console.log( str );
}

