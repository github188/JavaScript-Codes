/**
 * spa 项目路由文件
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-28 17:30:41
 * @version $Id$
 */


'use strict';

var 
	basicAuth 	= require( './auth' ),
	mongodb 	= require( 'mongodb' ),
	mongoServer	= new mongodb.Server(
		'localhost',
		mongodb.Connection.DEFAULT_PORT
	),
	dbHandle 	= new mongodb.Db(
		'spa', mongoServer, { safe: true }
	)
	;

dbHandle.open( function () {
	console.log( '** Connected to MongoDB **' );
} );

/* ------------------- 模块成员声明 ------------------- */ 

var configRoutes;


/* ------------------- 模块函数 ------------------- */

configRoutes = function ( app, server ) {
	
	// 1. 项目入口文件路由
	// app.get( '/', basicAuth, function ( request, response ) {
	// 	response.redirect( '/spa.html' );
	// } );

	// 通用路由（*: 所有路径，?: 表示可选）
	app.all( '/:obj_type/*?', function ( request, response, next ) {

		response.contentType( 'json' );

		// 传递路由控制流到下一个路由
		next();
	} );

	// 2. 获取用户列表路由
	app.get( '/:obj_type/list', function ( request, response ) {

		// 指定返回的数据类型

		response.send({ title: request.params.obj_type + ' list' });
	} );

	// 3. 创建用户请求的路由，客户端会向服务器发送数据，因此需要用到 POST
	app.post( '/:obj_type/create', function ( request, response ) {

		// 处理用户发送的数据，创建用户

		response.send({ title: request.params.obj_type + ' created' });
	} );

	// 4. 读取用户对象的路由，带参数路由路径，使用':'携带参数
	app.get( '/:obj_type/read/:id([0-9]+)', function ( request, response ) {

		response.send({
			title: request.params.obj_type + ' with id ' + request.params.id + ' found'
		});
	});

	// 5. 更新用户信息路由
	app.post( '/:obj_type/update/:id([0-9]+)', 
		function ( request, response ) {

			// TODO: 更新用户信息

			response.send({
				title: request.params.obj_type + ' with id ' + request.params.id + ' updated'
			});
		}
	);

	// 6. 删除用户路由
	app.get( '/:obj_type/delete/:id([0-9]+)', 
		function ( request, response ) {

			// TODO: 删除用户

			response.send({
				title: request.params.obj_type + ' with id ' + request.params.id + ' deleted'
			});
		}
	);	
};

// 导出模块
module.exports = {
	configRoutes 	: configRoutes
};