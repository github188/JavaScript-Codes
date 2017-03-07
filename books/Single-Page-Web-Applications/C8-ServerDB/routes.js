/**
 * spa 项目路由文件
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-28 17:30:41
 * @version $Id$
 */


'use strict';

var 
	mongoClient 	= require( 'mongodb' ).MongoClient,
	collection, configRoutes, dbHandler
	;

// dbHandle.open( function () {
// 	console.log( '** Connected to MongoDB **' );
// } );


mongoClient.connect(
	'mongodb://localhost:27017/spa',
	function ( err, db ) {
		if ( err ) {
			console.error( err );
			return false;
		} else {
			console.log( 'Connect to db spa' );

			dbHandler = db;

			// db.close();
		}
	}
);


/* ------------------- 模块函数 ------------------- */

configRoutes = function ( app, server ) {
	
	// 1. 项目入口文件路由
	// app.get( '/', basicAuth, function ( request, response ) {
	// 	response.redirect( '/spa.html' );
	// } );

	app.get( '/', function ( req, res ) {
		res.send( 'hello mongodb' );
	});

	// 通用路由（*: 所有路径，?: 表示可选）
	app.all( '/:obj_type/*?', function ( request, response, next ) {

		response.contentType( 'json' );

		// 传递路由控制流到下一个路由
		next();
	} );

	// 2. 获取用户列表路由
	app.get( '/:obj_type/list', function ( request, response ) {

		collection = dbHandler.collection( request.params.obj_type );

		collection.find().toArray( function ( error, map_list ) {
			// console.log( map_list );
			response.send( map_list );

			dbHandler.close();
		} );
	} );

	// 3. 创建用户请求的路由，客户端会向服务器发送数据，因此需要用到 POST
	app.post( '/:obj_type/create', function ( request, response ) {

		console.log( ' create -------------> start ' );

		collection = dbHandler.collection( request.params.obj_type );

		debug( request.body );

		collection.insert( request.body, function ( err, result ) {
			if ( err ) {
				console.log( err );
				return false;
			} else {
				response.send( result );
			}

			dbHandler.close();
		} );
	} );

	// 4. 读取用户对象的路由，带参数路由路径，使用':'携带参数
	app.get( '/:obj_type/read/:id([a-zA-Z]+)', function ( request, response ) {

		collection = dbHandler.collection( request.params.obj_type );

		debug( 'read ------------ start ' + request.params.id );

		collection.find(
			{ 'name': request.params.id }
		).toArray( function ( err, result ) {
			if ( !err ) {

				debug( result );
				response.send( result );
			} else {
				debug( err );
				return false;
			}

			dbHandler.close();
		} );
	});

	// 5. 更新用户信息路由
	app.post( '/:obj_type/update/:id([a-zA-Z]+)', 
		function ( request, response ) {

			collection = dbHandler.collection( request.params.obj_type );

			debug( request.body );

			collection.updateOne(
				{ 'name': request.params.id }, 
				{ $set: request.body },
				function ( err, result ) {
					response.send( result );

					dbHandler.close();
				}
			);
		}
	);

	// 6. 删除用户路由
	app.get( '/:obj_type/delete/:id([a-zA-Z]+)', 
		function ( request, response ) {

			collection = dbHandler.collection( request.params.obj_type );

			collection.deleteOne(
				{ 'name' : request.params.id }, 
				function ( err, result ) {
					response.send( result );

					dbHandler.close();
				}
			);

		}
	);	
};

function debug( str ) {
	console.log( str );
}

// 导出模块
module.exports = {
	configRoutes 	: configRoutes
};