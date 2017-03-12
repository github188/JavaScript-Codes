/**
 * 路由文件
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-07 15:27:31
 * @version $Id$
 */


var 
	
	crud 		= require( './crud' ),

	configRoutes, 
	dbName 			= 'person',
	collectionName 	= 'user';


configRoutes = function ( app, server ) {
	
	crud.init( 'localhost', dbName );

	app.get( '/', function ( req, res ) {

		res.send( 'Hello MongoDB !!!' );
	} );

	app.all( '/*?', function ( req, res, next ) {
		
		res.contentType( 'json' );

		next();	
	});

	/* ------------------ START CRUD 操作 ------------------ */

	app.get( 

		'/:obj_type/list', 
		function ( req, res ) {
			console.log( req );

			crud.read( 
				req.params.obj_type, 
				null, 
				function ( result ) { res.send( result ); } 
			);
		} 
	);

	app.post( 
		'/:obj_type/create', 
		function ( req, res ) {
			console.log( req.body );

			crud.createItem( 
				req.params.obj_type, 
				req.body, 
				function ( result ) { res.send( result ); }
			);
		} 
	);

	app.get( 
		'/:obj_type/read/:name([a-zA-Z]+)', 
		function ( req, res ) {
			crud.read( 
				req.params.obj_type, 
				{ 'name': req.params.name }, 
				function ( result ) { res.send( result ); }
			);
		}
	);

	app.post( 
		'/:obj_type/update', 
		function ( req, res ) {
			crud.update( 
				req.params.obj_type, 
				req.body, 
				function ( result ) { res.send( result ); }
			);
		}
	);

	app.post( 
		'/:obj_type/delete', 
		function ( req, res ) {
			crud.deleteItem( 
				req.params.obj_type, 
				req.body, 
				function ( result ) { res.send( result ); }
			);
		} 
	);

	/* ------------------ END CRUD 操作 ------------------ */
};


module.exports = {
	configRoutes 	: configRoutes
};

