/**
 * 基本认证模块
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-28 18:09:36
 * @version $Id$
 */


var basicAuth = require( 'basic-auth' );

var auth = function ( req, res, next ) {

	function unauthorized( res ) {
		res.set( 'WWW-Authenticate', 'Basic realm=Authorization Required' );
		return res.send( 401 );
	}

	var user = basicAuth( req );

	if ( !user || !user.name || !user.pass ) {
		return unauthorized( res );
	}

	if ( user.name === 'lizc' && user.pass === 'fll' ) {
		return next();
	} else {
		return unauthorized( res );
	}
};

module.exports = auth;