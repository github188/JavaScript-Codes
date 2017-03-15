/**
 * chat 消息模块
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-15 10:03:50
 * @version $Id$
 */

'use strict';

var 
    chatObj, emitUserList, signIn,
    socket      = require( 'socket.io' ),
    crud        = require( './crud' ),

    makeMongoId     = crud.makeMongoId,
    chatterMap      = {},

    // 消息处理函数
    addUser, updateChat, leaveChat, disconnect, updateAvatar
    ;


emitUserList = function ( io ) {
    crud.read(
        'user',
        { is_online: true },
        {},
        function ( result_list ) {
            io.of( '/chat' )
              .emit( 'listchange', result_list );
        }
    ); 
};

signIn = function ( io, user_map, socket ) {
    crud.update(
        'user',
        { '_id'     : user_map._id },
        { is_online : true },
        function ( result_map ) {
            emitUserList( io );
            user_map.is_online = true;
            socket.emit( 'userupdate', user_map );
        }
    );   

    chatterMap[ user_map._id ] = socket;

    socket.user_id = user_map._id;
};


// addUser, updateChat, leaveChat, disconnect, updateAvatar

addUser = function ( user_map, socket ) {
    crud.read(
        'user',
        { name: user_map.name },
        // {},
        function ( result_list ) {
            var result_map,
                cid = user_map.cid;

            delete user_map.cid;

            if ( result_list.length > 0 ) {
                result_map      = result_list[ 0 ] || {};
                result_map.cid  = cid;
                signIn( io, result_map, socket );
            } else {
                user_map.is_online = true;
                crud.construct(
                    'user',
                    user_map,
                    function ( result_list ) {

                        console.log( socket );

                        result_map      = result_list[ 0 ] || {};
                        result_map.cid  = cid;
                        chatterMap[ result_map._id ] = socket;
                        socket.user_id  = result_map._id;
                        socket.emit( 'userupdate', result_map );
                        emitUserList( io );
                    }
                );
            }
        }
    );  
};

updateChat = function () {
    
};

leaveChat = function () {
    
};

disconnect = function () {
    
};

updateAvatar = function () {
    
};

chatObj = {
    connect: function ( server ) {
        var io = socket.listen( server );

        console.log( 'socket listen server' );

        io.set( 'blacklist', [] )
          .of( '/chat' )
          .on( 'connection', function ( socket ) {
            socket.on( 'adduser', function ( user_map ) {
                crud.read(
                       'user',
                       { name: user_map.name },
                       // {},
                       function ( result_list ) {
                           var result_map,
                               cid = user_map.cid;

                           delete user_map.cid;

                           if ( result_list.length > 0 ) {
                               result_map      = result_list[ 0 ] || {};
                               result_map.cid  = cid;
                               signIn( io, result_map, socket );
                           } else {
                               user_map.is_online = true;
                               crud.construct(
                                   'user',
                                   user_map,
                                   function ( result_list ) {

                                       result_map      = result_list[ 0 ] || {};
                                       result_map.cid  = cid;
                                       chatterMap[ result_map._id ] = socket;
                                       socket.user_id  = result_map._id;
                                       socket.emit( 'userupdate', result_map );
                                       emitUserList( io );
                                   }
                               );
                           }
                       }
                );
            } );
            socket.on( 'updatechat'     , updateChat );
            socket.on( 'leavechat'      , leaveChat );
            socket.on( 'disconnect'     , disconnect );
            socket.on( 'updateavatar'   , updateAvatar );
          } );

        return io;
    }
};


module.exports = chatObj;