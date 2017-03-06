/**
 * spa app web server
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-28 14:13:49
 * @version $Id$
 */

var 
	http 	= require( 'http' ),
	express = require( 'express' ),
	logger 	= require( 'morgan' ),
	bodyParser 		= require( 'body-parser' ),
	methodOverride 	= require( 'method-override' ),
	errorHandler 	= require( 'errorhandler' ),
	serveStatic 	= require( 'serve-static' ),
	path 			= require( 'path' ),
	routes 			= require( './routes' ),
	app 			= express(),

	server, port, env;

/* START -------------- 环境配置 -------------- */
app.set( 'port', process.env.PORT || 3000 );
app.set( 'env', 'development' );

/* END -------------- 环境配置 -------------- */

/* START -------------- 中间件 -------------- */
env = app.get( 'env' );

// 全局环境中间件
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( methodOverride() );

// 定义静态文件根路径
app.use( serveStatic( __dirname + '/public/spa' ) );

// 开发环境中间件
if ( env === 'development' ) {
	app.use( logger( 'dev' ) );
	app.use( errorHandler({
		dumpExceptions 	: true,
		showStack 		: true
	}) );
} else if ( env === 'production' ) {
	app.use( errorHandler() );
}

/* END -------------- 中间件 -------------- */

// 路由配置
routes.configRoutes( app, server );

port = app.get( 'port' );

server = http.createServer( app );
server.listen( port, function () {
	console.log( 'Express server listening on port ' + port );
});


