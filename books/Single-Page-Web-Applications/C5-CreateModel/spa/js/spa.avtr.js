/**
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-14 14:37:23
 * @version $Id$
 */


/**
 * Chat 模块控制器
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-13 08:51:42
 * @version $Id$
 */


spa.avtr = (function () {
    
    'user strict';

    var 
        configMap = {

            chat_model      : null,
            people_model    : null,

            settable_map    : {
                chat_model  : true,
                people_model: true
            }
        },

        stateMap = {
            drag_map        : null,
            $drag_target    : null,
            drag_bg_color   : undefined
        },

        jqueryMap = {},

        getRandRgb, setJqueryMap, updateAvatar,

        onTapNav,       onHeldstartNav,
        onHeldmoveNav,  onHeldendNav,
        onSetchatee,    onListchange,
        onLogout,
        configModule,   initModule
        ;

        /* ----------------------- BEGIN UTILITY METHODS ----------------------- */

        getRandRgb = function () {
            var i, rgb_list = [];

            for ( i = 0; i < 3; i++ ) {
                rgb_list.push( Math.floor( Math.random() * 128 ) + 128 );
            }

            return 'rbg(' + rgb_list.join(',') + ')';
        };

        // 获取元素 em 值
        getEmSize = function ( elem ) {
            
            return Number(
                getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
            );  
        };

        /* ----------------------- END UTILITY METHODS ----------------------- */


        /* ----------------------- BEGIN DOM METHODS ----------------------- */

        updateAvatar = function ( $target ) {
            var css_map, person_id;

            css_map = {
                top     : parseInt( $target.css( 'top' ), 10 ),
                left    : parseInt( $target.css( 'left' ), 10 ),
                'background-color'  : $target.css( 'background-color' )
            };

            person_id = $target.attr( 'data-id' );

            configMap.chat_model.update_avatar({
                person_id   : person_id,
                css_map     : css_map
            });
        };

        setJqueryMap = function ( $container ) {
            jqueryMap = { $container: $container }; 
        };

        /* ----------------------- END DOM METHODS ----------------------- */


        /* ----------------------- BEGIN EVENT METHODS ----------------------- */

        onTapNav = function ( event ) {
            var css_map,
                $target = $( event.elem_target ).closest( '.spa-avtr-box' );

            if ( $target.length === 0 ) { return false; }

            $target.css( { 'background-color' : getRandRgb() } );

            updateAvatar( $target );
        };

        onHeldstartNav = function ( event ) {
            var offset_target_map, offset_nav_map,
                $target = $( event.elem_target ).closest( '.spa-avtr-box' );

            if ( $target.length === 0 ) { return false; }

            stateMap.$drag_target = $target;

            offset_target_map   = $target.offset();
            offset_nav_map      = jqueryMap.$container.offset();

            offset_target_map.top   -= offset_nav_map.top;
            offset_target_map.left  -= offset_nav_map.left;

            stateMap.drag_map       = offset_target_map;
            stateMap.drag_bg_color  = $target.css( 'background-color' );

            $target.addClass( 'spa-x-is-drag' ).css('background-color', '');
        };

        onHeldmoveNav = function ( event ) {
            var drag_map = stateMap.drag_map;

            if ( !drag_map ) { return false; }

            drag_map.top    += event.px_delta_y;
            drag_map.left   += event.px_delta_x;

            stateMap.$drag_target.css({
                top     : drag_map.top,
                left    : drag_map.left
            });   
        };

        onHeldendNav = function ( event ) {
            var $drag_target = stateMap.$drag_target;

            if ( !$drag_target ) { return false; }

            $drag_target
                .removeClass( '.spa-x-is-drag' )
                .css( 'background-color', stateMap.drag_bg_color );

            stateMap.drag_bg_color  = undefined;
            stateMap.$drag_target   = null;
            stateMap.drag_map       = null;

            updateAvatar( $drag_target );  
        };

        onSetchatee = function ( event, arg_map ) {
            var 
                $nav        = $(this),
                new_chatee  = arg_map.new_chatee,
                old_chatee  = arg_map.old_chatee;

            if ( old_chatee ) {
                $nav
                    .find( '.spa-avtr-box[data-id=' + old_chatee.id + ']' )
                    .removeClass( '.spa-x-is-chatee' );
            }

            if ( new_chatee ) {
                $nav 
                    .find( '.spa-avtr-box[data-id=' + new_chatee.id + ']' )
                    .addClass( '.spa-x-is-chatee' );
            }
        };


        onListchange = function ( event ) {
            var 
                $nav        = $(this),
                people_db   = configMap.people_model.get_db(),
                user        = configMap.people_model.get_user(),
                chatee      = configMap.chat_model.get_chatee() || {},
                $box;   


            $nav.empty();

            if ( user.get_is_anon() ) { return false; }

            people_db().each( function ( person, idx ) {
                var class_list;

                if ( person.get_is_anon() ) { return false; }

                class_list = [ 'spa-avtr-box' ];

                if ( person.id === chatee.id ) {
                    class_list.push( 'spa-x-is-chatee' );
                }

                if ( person.get_is_user() ) {
                    class_list.push( 'spa-x-is-user' );
                }

                $box = $( '<div/>' )
                    .addClass( class_list.join(' ') )
                    .css( person.css_map )
                    .attr( 'data-id', String( person.id ) )
                    .prop( 'title', spa.util_b.encodeHtml( person.name ) )
                    .text( person.name )
                    .appendTo( $nav );
            } );
        };

        onLogout = function () {
            jqueryMap.$container.empty();   
        };

        /* ----------------------- END EVENT METHODS ----------------------- */


        /* ----------------------- BEGIN PUBLIC METHODS ----------------------- */


        /**
         * 配置允许访问的键值
         * 
         * @param  {Object} input_map 允许设置的属性的键值对
         *
         * configMap.settable_map 中保存了允许设置的属性
         * 
         * @return {[type]}           [description]
         */
        configModule = function ( input_map ) {
            
            spa.util.setConfigMap({
                input_map       : input_map,
                settable_map    : configMap.settable_map,
                config_map      : configMap
            });

            return true;
        };


        /**
         * 初始化模块
         * 
         * @param  {DOMElement} $append_target 当前模块的容器对象
         * @return {[type]}            [description]
         *
         * 该方法做三件事：
         * 1. 将当前模块填充到容器中，即：$append_target.append
         * 2. 缓存 jqueryMap
         * 3. 初始化事件处理程序
         */
        initModule = function ( $container ) {
            
            setJqueryMap( $container );

            $.gevent.subscribe( $container, 'spa-listchange', onListchange );
            $.gevent.subscribe( $container, 'spa-setchatee', onSetchatee );
            $.gevent.subscribe( $container, 'spa-logout', onLogout );

            $container
                .bind( 'utap',          onTapNav )
                .bind( 'uheldstart',    onHeldstartNav )
                .bind( 'uheldmove',     onHeldmoveNav )
                .bind( 'uheldend',      onHeldendNav );

            return true;    
        };

        /* ----------------------- END PUBLIC METHODS ----------------------- */

        return {
            configModule    : configModule,
            initModule      : initModule 
        };

}());