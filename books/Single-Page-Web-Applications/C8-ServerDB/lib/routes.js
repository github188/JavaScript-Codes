/**
 * spa 项目路由文件
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-28 17:30:41
 * @version $Id$
 */

'use strict';

var 
    fsHandler       = require( 'fs' ),
    JSV             = require( 'JSV' ).JSV,
    crud            = require( './crud' ),
    configRoutes
    ;

/* ------------------- 模块函数 ------------------- */

configRoutes = function ( app, server ) {
    
    // 1. 项目入口文件路由
    // app.get( '/', basicAuth, function ( request, response ) {
    //  response.redirect( '/spa.html' );
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

        crud.read(
            request.params.obj_type,
            {},
            function ( result ) {
                response.send( result );
            }
        );
    } );

    // 3. 创建用户请求的路由，客户端会向服务器发送数据，因此需要用到 POST
    app.post( '/:obj_type/create', function ( request, response ) {

        crud.construct( 
            request.params.obj_type, 
            request.body,
            function ( result ) {
                response.send( result );
            }
        );
    } );

    // 4. 读取用户对象的路由，带参数路由路径，使用':'携带参数
    app.get( '/:obj_type/read/:id', function ( request, response ) {

        crud.read(
            request.params.obj_type,
            { 'name': request.params.id },
            function ( result ) {
                response.send( result );
            }
        );
    });

    // 5. 更新用户信息路由
    app.post( '/:obj_type/update/:id', function ( request, response ) {
        crud.update(
            request.params.obj_type,
            { 'name': request.params.id },
            request.body,
            function ( result ) {
                response.send( result );
            }
        );
    });

    // 6. 删除用户路由
    app.get( '/:obj_type/delete/:id', function ( request, response ) {

        crud.destroy(
            request.params.obj_type,
            { 'name': request.params.id },  // 用数据包含起来就是删除所有
            false,
            function ( result ) {
                response.send( result ); 
            }
        );
    });  
};

function debug( str ) {
    console.log( str );
}

// 导出模块
module.exports = {
    configRoutes    : configRoutes
};