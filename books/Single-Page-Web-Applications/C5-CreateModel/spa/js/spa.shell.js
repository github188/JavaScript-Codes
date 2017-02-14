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
                // 需要与 spa.chat.js 中保持一致
                chat: { opened: true, closed: true }
            },

            main_html: ''
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
                + '<div class="spa-shell-modal"></div>',
            resize_interval: 200
        },

        stateMap    = { 
            $container          : null,
            anchor_map          : {},
            resize_idto         : undefined // 保存调整尺寸超时函数的 id
        },

        jqueryMap   = {},

        /* --------- START FUCNTIONS --------- */
        setJqueryMap, initModule,

        // 滑块行为
        setCharAnchor,

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
            $container: $container
        };  
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

        try {
            $.uriAnchor.setAnchor( anchor_map_revise );
        } catch ( error ) {

            $.uriAnchor.setAnchor( stateMap.anchor_map, null, true );

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
            s_chat_proposed, is_ok = true;

        try {
            anchor_map_proposed = $.uriAnchor.makeAnchorMap();
        } catch( error ) {
            $.uriAnchor.setAnchor( anchor_map_previous, null, true );

            return false;
        }

        stateMap.anchor_map = anchor_map_proposed;

        _s_chat_previous = anchor_map_previous._s_chat;
        _s_chat_proposed = anchor_map_proposed._s_chat;

        if ( !anchor_map_previous || _s_chat_previous !== _s_chat_proposed ) {

            s_chat_proposed = anchor_map_proposed.chat;

            switch ( s_chat_proposed ) {
                case 'opened':
                    is_ok = spa.chat.setSliderPosition( 'opened' );
                break;
                case 'closed':
                    is_ok = spa.chat.setSliderPosition( 'closed' );
                break;
                default:
                    spa.chat.setSliderPosition( 'closed' );
                    delete anchor_map_proposed.chat;
                    $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
                break;
            }
        }

        // 如果位置设置失败，则回退到原来位置，如果无原来位置则使用默认
        if ( !is_ok ) {
            if ( anchor_map_previous ) {
                $.uriAnchor.setAnchor( anchor_map_previous, null, true );
                stateMap.anchor_map = anchor_map_previous;
            } else {
                delete anchor_map_proposed.chat;
                $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
            }
        }

        return false;
    };

    onResize = function ( event ) {
        
        if ( stateMap.resize_idto ) { return true; }

        spa.chat.handleResize();
        stateMap.resize_idto = setTimeout(function () {
            stateMap.resize_idto = undefined;
        }, configMap.resize_interval);

        return true; 
    };

    setChatAnchor = function ( position_type ) {

        return changeAnchorPart({ chat: position_type });   
    };
    /* --------- END EVENTS METHODS --------------- */

    // --------- BEGIN PUBLIC METHODS ---------------
    initModule = function ( $container ) {
        
        // 缓存容器
        stateMap.$container = $container;

        $container.html( configMap.main_html );

        // 缓存数据至 jQuery
        setJqueryMap();

        $.uriAnchor.configModule({
            schema_map: configMap.anchor_schema_map
        });

        /* START --- 配置并初始化各模块 */

        // Chat 聊天模块
        spa.chat.configModule({
            set_chat_anchor : setChatAnchor,
            chat_model      : spa.model.chat,
            people_model    : spa.model.people
        });
        spa.chat.initModule( jqueryMap.$container );

        /* END --- 配置并初始化各模块 */

        $(window)
            .bind( 'resize', onResize )
            .bind( 'hashchange', onHashChange )
            .trigger( 'hashchange' );
    };
    // ----------- END PUBLIC METHODS ---------------
    
    return {
        initModule: initModule
    };
}());