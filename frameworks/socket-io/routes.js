/**
 * socket 路由
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-06 11:00:28
 * @version $Id$
 */


var configRoutes;


configRoutes = function ( app, server ) {

	// 通用设置路由
	app.all( '/', function ( req, res, next ) {

		res.contentType( 'json' );

		next();
	} );

	// 跟路由，重定向
	app.get( '/', function ( req, res ) {
		res.redirect( '/client.html' );
	} );	
};



module.exports = {
	configRoutes 	: configRoutes
};
