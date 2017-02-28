/*
	app.js - - Hello World

	simple connect server

	with logging
 */

// 创建 服务器，监听 3000 端口
var 
    http    = require( 'http' ),
    express = require( 'express' ),
    logger  = require( 'morgan' ),
    errorHandler = require( 'errorhandler' ),
    app     = express(),

    server, port, env;

// 环境配置
app.set( 'port', process.env.PORT || 3000 );

// 中间件使用
app.use( logger('dev') );

// 获取并设置路由
app.get( '/', function ( request, response ) {
    response.send( 'Hello express !' );
} );

// app.get( '/user', callback );

env = app.get('env');

// 根据环境来决定使用何种中间件
if ( env === 'development' ) {
    app.use( errorHandler() );
}

port = app.get('port');

server = http.createServer( app );
server.listen( port, function () {
    console.log( 'Express server listening on port ' + port );
});