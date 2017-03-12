/**
 * 第一个 Express 服务程序
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-01 13:47:05
 * @version $Id$
 */

'use strict';

var 
	express 	= require( 'express' ),

	app 		= express(),
	routes 		= require( './routes' ),

	port;


// 设置端口号
app.set( 'port', 3000 );

routes.configRoutes( app );


port = app.get( 'port' );

app.listen( port, function () {

	console.log( 'Express server listening on port ' + port );
} );

