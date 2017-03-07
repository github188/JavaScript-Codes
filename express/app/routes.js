/**
 * app 路由模块 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-01 13:55:40
 * @version $Id$
 */

'use strict';

var configRoutes = function ( app, server ) {

	app.all( '/*?', function ( req, res, next ) {
		res.contentType( 'json' );

		next();
	} );

	app.get( '/', function ( req, res ) {
		res.send( 'Hello Express !\n' );
	} );
};


module.exports = {
	configRoutes: configRoutes
};