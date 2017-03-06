/**
 * socket.io 测试服务器端代码 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-02 09:30:22
 * @version $Id$
 */

'use strict';

var 
	countUp,

	http 		= require( 'http' ),
	express 	= require( 'express' ),
	socketIO 	= require( 'socket.io' ),
	serveStatic = require( 'serve-static' ),
	fsHandler 	= require( 'fs' ),

	app 		= express(),

	server, io,
	countIdx 	= 0,

	watchMap 	= {},
	setWatch
	;

setWatch = function ( url_path, file_type ) {
	console.log( 'setWatch called on ' + url_path );	

	if ( !watchMap[ url_path ] ) {
		console.log( 'setting watch on ' + url_path );

		fsHandler.watchFile(

			url_path.slice( 1 ),
			function ( current, previous ) {
				
				console.log( 'file accessed' );

				if ( current.mtime !== previous.mtime ) {
					console.log( 'file changed' );

					io.sockets.emit( file_type, url_path );
				}
			}
		);

		watchMap[ url_path ] = true;
	}
};

app.use( function ( req, res, next ) {

	console.log( 'middleware of message.' );

	io.sockets.emit( 'message', 'I am datas' );

	next();
} );

// 自定义中间件监听所有静态文件
app.use( function ( req, res, next ) {
	if ( req.url.indexOf( '/js/' ) >= 0 ) {
		setWatch( req.url, 'script' );
	} else if ( req.url.indexOf( '/css/' ) >= 0 ) {
		setWatch( req.url, 'stylesheet' );
	}

	next();
} );

app.use( serveStatic( __dirname + '/' ) );

app.get( '/', function ( req, res ) {
	res.redirect( '/socket.html' );
} );

server = http.createServer( app );

// 1. listen 方式
// io = socketIO.listen( server );

// 2. new 方式
// io = new socketIO( server );

// 3. 构造函数直接调用
io = socketIO( server );

server.listen( 3000, function () {
	console.log( 'http server listening on port 3000.' );
} );

