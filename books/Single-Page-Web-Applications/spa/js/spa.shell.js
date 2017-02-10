/**
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-09 15:42:17
 * @version $Id$
 */

spa.shell = (function () {

    var 
        configMap = {

            anchor_schema_map: {
                chat: { open: true, closed: true }
            },

            mainHtml: ''
                + '<div id="spa">'
                    + '<div class="spa-shell-head">'
                        + '<div class="spa-shell-head-logo"></div>'
                        + '<div class="spa-shell-head-acct"></div>'
                        + '<div class="spa-shell-head-search"></div>'
                    + '</div>'
                    + '<div class="spa-shell-main">'
                        + '<div class="spa-shell-main-nav"></div>'
                        + '<div class="spa-shell-main-content"></div>'
                    + '</div>'
                    + '<div class="spa-shell-foot"></div>'
                    + '<div class="spa-shell-chat"></div>'
                    + '<div class="spa-shell-modal"></div>'
                + '</div>',

            // BEGIN SLIDER 属性
            chatExtendTime      : 1000,
            chatRetractTime     : 300,
            chatExtendHeight    : 450,
            chatRetractHeight   : 15,
            chatExtendedTitle   : 'Click to retract',
            chatRetractedTitle  : 'Click to extend'
            // END SLIDER
        },

        stateMap    = { 
            $container          : null,
            anchor_map          : {},
            isChatRetracted     : true
        },

        jqueryMap   = {},

        /* --------- START FUCNTIONS --------- */
        setJqueryMap, initModule,

        // 滑块行为
        toggleChat, onClickChat,

        // 锚处理
        copyAnchorMap, changeAnchorPart, onHashChange;

        /* --------- END FUCNTIONS --------- */


    // --------- BEGIN UTILITY METHODS ---------------
    copyAnchorMap = function () {
        
        // true: 深拷贝，{}：拷贝到该新对象，返回  
        return $.extend( true, {}, stateMap.anchor_map );   
    };
    // ----------- END UTILITY METHODS ---------------

    /* --------- BEGIN DOM METHODS --------------- */

    // 用 jQuery 缓存页面数据，方便 jQuery 快速读取和操作
    setJqueryMap = function () {
        
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,

            // 缓存滑块对象
            $chat: $container.find( '.spa-shell-chat' )
        };  
    };

    toggleChat = function ( doExtend, callback ) {
        
        var
            pxChatHt    = jqueryMap.$chat.height(),
            isOpen      = pxChatHt === configMap.chatExtendHeight,
            isClosed    = pxChatHt === configMap.chatRetractHeight,
            isSliding   = !isOpen && !isClosed;

        // 收缩和扩张过程中禁止操作
        if ( isSliding ) {
            return false;
        }

        // 展开
        if ( doExtend ) {

            jqueryMap.$chat.animate( 
                { height: configMap.chatExtendHeight },
                configMap.chatExtendTime,
                function () {

                    jqueryMap.$chat.attr( 'title', configMap.chatExtendedTitle );

                    stateMap.isChatRetracted = false;

                    callback && callback( jqueryMap.$chat );
                } 
            );

            return true;
        }

        // 收缩
        jqueryMap.$chat.animate(
            { height: configMap.chatRetractHeight },
            configMap.chatRetractTime,
            function () {

                jqueryMap.$chat.attr( 'title', configMap.chatRetractedTitle );

                stateMap.isChatRetracted = true;

                callback && callback( jqueryMap.$chat );
            }
        );

        return true;
    };

    changeAnchorPart = function ( arg_map ) {
        
        var 
            anchor_map_revise = copyAnchorMap(),
            bool_return = true,
            key_name, key_name_dep;

        for ( key_name in arg_map ) {

            if ( arg_map.hasOwnProperty( key_name ) ) {

                if ( key_name.indexOf( '_' ) === 0 ) {
                    continue;
                }

                anchor_map_revise[key_name] = arg_map[key_name];

                key_name_dep = '_' + key_name;
                if ( arg_map[key_name_dep] ) {
                    anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                } else {
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s' + key_name_dep];
                }
            }
        }

        spa_debug( anchor_map_revise, 'anchor_map_revise' );

        try {
            $.uriAnchor.setAnchor( anchor_map_revise );
        } catch ( error ) {

            spa_debug(error, "error");

            // $.uriAnchor.setAnchor( stateMap.anchor_map, null, true );

            bool_return = false;
        }

        return bool_return;
    };

    /* --------- END DOM METHODS --------------- */


    /* --------- BEGIN EVENTS METHODS --------------- */

    onHashChange = function ( event ) {

        var
            anchor_map_previous = copyAnchorMap(),
            anchor_map_proposed,
            _s_chat_previous, _s_chat_proposed,
            s_chat_proposed;

        try {
            anchor_map_proposed = $.uriAnchor.makeAnchorMap();
        } catch( error ) {
            $.uriAnchor.setAnchor( anchor_map_previous, null, true );

            return false;
        }

        stateMap.anchor_map = anchor_map_proposed;

        _s_chat_previous = anchor_map_previous._s_chat;
        _s_chat_proposed = anchor_map_proposed._s_chat;

        spa_debug( '_s_chat_previous = ' + _s_chat_previous + ', _s_chat_proposed = ' + _s_chat_proposed );

        if ( !anchor_map_previous || _s_chat_previous !== _s_chat_proposed ) {

            s_chat_proposed = anchor_map_proposed.chat;

            spa_debug('s_chat_proposed = ' + s_chat_proposed);

            switch ( s_chat_proposed ) {
                case 'open':
                    toggleChat( true );
                break;
                case 'closed':
                    toggleChat( false );
                break;
                default:
                    toggleChat( false );
                    delete anchor_map_proposed.chat;
                    $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
                break;
            }
        }

        return false;
    };

    onClickChat = function ( event ) {
    
        /*  
        if ( toggleChat( stateMap.isChatRetracted ) ) {

            $.uriAnchor.setAnchor({
                chat: ( stateMap.isChatRetracted ? 'open' : 'closed' )
            });
        } */

        spa_debug('onClickChat --- isChatRetracted = ' + stateMap.isChatRetracted);

        changeAnchorPart({
            chat: ( stateMap.isChatRetracted ? 'open' : 'closed' )
        });

        return false;
    };
    /* --------- END EVENTS METHODS --------------- */

    // --------- BEGIN PUBLIC METHODS ---------------
    initModule = function ( $container ) {
        
        // 缓存容器
        stateMap.$container = $container;

        $container.html( configMap.mainHtml );

        // 缓存数据至 jQuery
        setJqueryMap();

        stateMap.isChatRetracted = true;
        jqueryMap.$chat
            .attr( 'title', configMap.chatRetractedTitle )
            .click( onClickChat );

        $.uriAnchor.configModule({
            schema_map: configMap.anchor_schema_map
        });

        $(window)
            .bind( 'hashchange', onHashChange )
            .trigger( 'hashchange' );
    };
    // ----------- END PUBLIC METHODS ---------------
    
    return {
        initModule: initModule
    };
}());