/**
 * Chat 模块控制器
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-13 08:51:42
 * @version $Id$
 */


spa.chat = (function () {
    
    'user strict';

    var 
        configMap = {

            main_html: '' 
                + '<div class="spa-chat">'
                    + '<div class="spa-chat-head">'
                        + '<div class="spa-chat-head-toggle">+</div>'
                        + '<div class="spa-chat-head-title">Chat</div>'
                    + '</div>'
                    + '<div class="spa-chat-closer">x</div>'
                    + '<div class="spa-chat-sizer">'
                        + '<div class="spa-chat-list">'
                            + '<div class="spa-chat-list-box"></div>'
                        + '</div>'
                        + '<div class="spa-chat-msg">'
                            + '<div class="spa-chat-msg-log"></div>'
                            + '<div class="spa-chat-msg-in">'
                                + '<form class="spa-chat-msg-form">'
                                    + '<input type="text" />'
                                    + '<input type="submit" style="display:none" />'
                                    + '<div class="spa-chat-msg-send">'
                                        + 'send'
                                    + '</div>'
                                + '</form>'
                            + '</div>'
                        + '</div>'
                    + '</div>'
                + '</div>',

            settable_map: { 

                slider_open_time    : true,
                slider_close_time   : true,
                slider_opened_em    : true,
                slider_closed_em    : true,
                slider_opened_title : true,
                slider_closed_title : true,

                chat_model      : true,
                people_model    : true,
                set_chat_anchor : true
            },

            slider_open_time        : 250,
            slider_close_time       : 250,
            slider_opened_em        : 18,
            slider_closed_em        : 2,
            slider_opened_min_em    : 10,
            window_height_min_em    : 20,
            slider_opened_title     : 'Tap to close',
            slider_closed_title     : 'Tap to open',

            chat_model      : null,
            people_model    : null,
            set_chat_anchor : null
        },

        stateMap = {
            $append_target: null,

            position_type       : 'closed',
            px_per_em           : 0,
            slider_hidden_px    : 0,
            slider_closed_px    : 0,
            slider_opened_px    : 0
        },

        jqueryMap = {},

        setJqueryMap, configModule, initModule,

        getEmSize, setPxSizes, setSliderPosition, onClickToggle,

        removeSlider, handleResize,

        scrollChat, writeChat, writeAlert, clearChat,
        onTapToggle, onSubmitMsg, onTapList,
        onSetchatee, onUpdatechat, onListchange,
        onLogin, onLogout
        ;


        /* ----------------------- BEGIN UTILITY METHODS ----------------------- */

        // 获取元素 em 值
        getEmSize = function ( elem ) {
            
            return Number(
                getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
            );  
        };

        /* ----------------------- END UTILITY METHODS ----------------------- */


        /* ----------------------- BEGIN DOM METHODS ----------------------- */

        setJqueryMap = function () {
            
            var 
                $append_target = stateMap.$append_target,
                $slider = $append_target.find( '.spa-chat' );

            jqueryMap = {
                $slider     : $slider,
                $head       : $slider.find( '.spa-chat-head' ),
                $toggle     : $slider.find( '.spa-chat-head-toggle' ),
                $title      : $slider.find( '.spa-chat-head-title' ),
                $sizer      : $slider.find( '.spa-chat-sizer' ),
                $msgs       : $slider.find( '.spa-chat-msgs' ),
                $box        : $slider.find( '.spa-chat-box' ),
                $input      : $slider.find( '.spa-chat-box input[type=text]' ),
                $list_box   : $slider.find( 'spa-chat-list-box' ),
                $msg_log    : $slider.find( 'spa-chat-msg-log' ),
                $msg_in     : $slider.find( 'spa-chat-msg-in' ),
                $input      : $slider.find( 'spa-chat-msg-in input[type=text]' ),
                $send       : $slider.find( 'spa-chat-msg-send' ),
                $form       : $slider.find( 'spa-chat-msg-form' ),
                $window     : $(window)
            };  
        };

        // 计算该模块元素尺寸
        setPxSizes = function () {
            
            var
                px_per_em, opened_height_em, window_height_em;

            px_per_em = spa.util_b.getEmSize( jqueryMap.$slider.get(0) );

            // 计算窗口高度：em
            window_height_em = Math.floor(
                ( jqueryMap.$window.height() / px_per_em ) + 0.5
            );

            // 根据范围值来决定窗口打开的高度
            opened_height_em 
                = window_height_em > configMap.window_height_min_em
                ? configMap.slider_opened_em
                : configMap.slider_opened_min_em;

            stateMap.px_per_em = px_per_em;
            stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
            stateMap.slider_opened_px = opened_height_em * px_per_em;   

            jqueryMap.$sizer.css({
                height: ( opened_height_em - 2 ) * px_per_em
            });
        };

        setSliderPosition = function ( position_type, callback ) {
            
            var 
                height_px, animate_time, slider_title, toggle_text,

                setAttr;

            if ( position_type === 'opened' 
                && configMap.people_model.get_user().get_is_anon() 
            ) { return false; }

            if ( stateMap.position_type === position_type ) {

                if ( position_type === 'opened' ) {
                    jqueryMap.$input.focus();
                }
                return true;
            }

            setAttr = function ( height, an_time, title, text ) {
                
                height_px       = height;
                animate_time    = an_time;
                slider_title    = title;
                toggle_text     = text;
            };

            switch ( position_type ) {
                case 'opened':
                    setAttr( 
                        stateMap.slider_opened_px,
                        configMap.slider_open_time,
                        configMap.slider_opened_title,
                        '='
                    );
                    jqueryMap.$input.focus();
                break;

                case 'hidden':
                    setAttr( 0, configMap.slider_open_time, '', '+' );
                break;

                case 'closed':
                    setAttr( 
                        stateMap.slider_closed_px,
                        configMap.slider_close_time,
                        configMap.slider_closed_title,
                        '+'
                    );
                break;
                default:
                    return false;
                break;
            }

            // 重置位置类型
            stateMap.position_type = '';
            jqueryMap.$slider.animate( 
                { height: height_px },
                animate_time,
                function () {
                    jqueryMap.$toggle.prop( 'title', slider_title );
                    jqueryMap.$toggle.text( toggle_text );
                    stateMap.position_type = position_type;
                    callback && callback( jqueryMap.$slider );
                }
            );

            return true;
        };

        scrollChat = function () {
            var $msg_log = jqueryMap.$msg_log;

            $msg_log.animate(
                {
                    scrollTop: $msg_log.prop( 'scrollHeight' )
                        - $msg_log.height()
                },
                150
            );   
        };

        writeChat = function ( person_name, text, is_user ) {
            var msg_class = is_user
                ? 'spa-chat-msg-log-me' : 'spa-chat-msg-log-msg';

            jqueryMap.$msg_log.append(
                '<div class="' + msg_class + '">'
                + spa.util_b.encodeHtml(person_name) + ': '
                + spa.util_b.encodeHtml(text)
                + '</div>'
            );

            scrollChat();
        };

        writeAlert = function ( alert_text ) {
            jqueryMap.$msg_log.append(
                '<div class="spa-chat-msg-log-alert">'
                + spa.util_b.encodeHtml( alert_text )
                + '</div>'
            );

            scrollChat();
        };

        clearChat = function () {
            jqueryMap.$msg_log.empty();   
        };

        /* ----------------------- END DOM METHODS ----------------------- */


        /* ----------------------- BEGIN EVENT METHODS ----------------------- */
        onTapToggle = function ( event ) {
            
            var 
                set_chat_anchor = configMap.set_chat_anchor;

            spa_debug('------------------------position_type = ' + stateMap.position_type);

            if ( stateMap.position_type === 'closed' ) {
                set_chat_anchor( 'opened' );
            } else if ( stateMap.position_type === 'opened' ) {
                set_chat_anchor( 'closed' );
            }

            return false;
        };

        onSubmitMsg = function ( event ) {
            var msg_text = jqueryMap.$input.val();

            if ( msg_text.trim() === '' ) { return false; };
            configMap.chat_model.send_msg( msg_text );
            jqueryMap.$input.focus();
            jqueryMap.$send.addClass( 'spa-x-select' );
            setTimeout( function () {
                jqueryMap.$send.removeClass( 'spa-x-select' );
            }, 250 );

            return false; 
        };

        onTapList = function ( event ) {
            var $tapped = $( event.elem_target ), chatee_id;
            if ( !$tapped.hasClass('spa-chat-list-name') ) { return false; } 

            chatee_id = $tapped.attr( 'data-id' );
            if ( !chatee_id ) { return false; }

            configMap.chat_model.set_chatee( chatee_id );
            return false;  
        };

        onSetchatee = function ( event, arg_map ) {
            
            var 
                new_chatee  = arg_map.new_chatee,
                old_chatee  = arg_map.old_chatee;

            jqueryMap.$input.focus();
            if ( !new_chatee ) {
                if ( old_chatee ) {
                    writeAlert( old_chatee.name + ' has left the chat' );
                } else {
                    writeAlert( 'Your friend has left the chat' );
                }

                jqueryMap.$title.text( 'Chat' );
                return false;
            }

            jqueryMap.$list_box
                .find( '.spa-chat-list-name' )
                .removeClass( 'spa-x-select' )
                .end()
                .find( '[data-id=' + arg_map.new_chatee.id + ']' )
                .addClass( 'spa-x-select' );

            writeAlert( 'Now chatting with ' + arg_map.new_chatee.name );
            jqueryMap.$title.text( 'Chat with ' + arg_map.new_chatee.name );
            return true;
        };

        onListchange = function ( event ) {
            var 
                vlist_html  = '',
                people_db   = configMap.people_model.get_db(),
                chatee      = configMap.chat_model.get_chatee();

            people_db().each(
                function ( person, idx ) {
                    var select_class = '';

                    if ( person.get_is_anon() || person.get_is_user() ) {
                        return true;
                    }

                    if ( chatee && chatee.id === person.id ) {
                        select_class = ' spa-x-select';
                    }

                    list_html
                        += '<div class="spa-chat-list-name'
                        + select_class + '" data-id="' + person.id + '">'
                        + spa.util_b.encodeHtml( person.name )
                        + '</div>';
                }
            );

            if ( !list_html ) {
                list_html = ''
                    + '<div class="spa-chat-list-note">'
                    + 'To chat alone is the fate of all great souls...<br><br>'
                    + 'No one is alone'
                    + '</div>';

                clearCaht();
            }

            jqueryMap.$list_box.html( list_html );
        };

        onUpdatechat = function ( event, msg_map ) {
            var    
                is_user,
                sender_id   = msg_map.sender_id,
                msg_text    = msg_map.msg_text,
                chatee      = configMap.chat_model.get_chatee() || {},
                sender      = configMap.people_model.get_by_cid( sender_id );

            if ( !sender ) {
                writeAlert( msg_text );
                return false;
            }

            is_user = sender.get_is_user();

            if ( !( is_user || sender_id === chatee.id ) ) {
                configMap.chat_model.set_chatee( sender_id );
            }

            writeChat( sender.name, msg_text, is_user );

            if ( is_user ) {
                jqueryMap.$input.val( '' );
                jqueryMap.$input.focus();
            }
        };

        onLogin = function ( event, login_user ) {
            configMap.set_chat_anchor( 'opened' );   
        };

        onLogout = function ( event, logout_user ) {
            configMap.set_chat_anchor( 'closed' );
            jqueryMap.$title.text( 'Chat' );
            clearChat(); 
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
        initModule = function ( $append_target ) {
            
            var $list_box;

            stateMap.$append_target = $append_target;
            $append_target.append( configMap.main_html );
            
            setJqueryMap();
            setPxSizes();

            // $list_box 发布全局事件
            $list_box = jqueryMap.$list_box;
            $.gevent.subscribe( $list_box, 'spa-listchange', onListchange );
            $.gevent.subscribe( $list_box, 'spa-setchatee', onSetchatee );
            $.gevent.subscribe( $list_box, 'spa-updatechat', onUpdatechat );
            $.gevent.subscribe( $list_box, 'spa-login', onLogin );
            $.gevent.subscribe( $list_box, 'spa-logout', onLogout );

            // bind 用户输入事件
            jqueryMap.$head.bind( 'utap', onTapToggle );
            jqueryMap.$list_box.bind( 'utap', onTapList );
            jqueryMap.$send.bind( 'utap', onSubmitMsg );
            jqueryMap.$form.bind( 'submit', onSubmitMsg );

            // 初始化和事件处理
            jqueryMap.$toggle.prop( 'title', configMap.slider_closed_title );
            jqueryMap.$head.click( onClickToggle );
            stateMap.position_type = 'closed';

            return true;    
        };

        removeSlider = function () {
            
            if ( jqueryMap.$slider ) {
                jqueryMap.$slider.remove();
                jqueryMap = {};
            }

            stateMap.$append_target = null;
            stateMap.position_type  = 'closed';

            stateMap.chat_model         = null;
            stateMap.people_model       = null;
            stateMap.set_chat_anchor    = null;

            return true;
        };

        handleResize = function () {
            
            if ( !jqueryMap.$slider ) { return false; }

            setPxSizes();
            if ( stateMap.position_type === 'opened' ) {
                jqueryMap.$slider.css({ height: stateMap.slider_opened_px });
            }

            return true;
        };

        /* ----------------------- END PUBLIC METHODS ----------------------- */

        return {
            setSliderPosition   : setSliderPosition,
            configModule        : configModule,
            initModule          : initModule,
            removeSlider        : removeSlider,
            handleResize        : handleResize
        };

}());