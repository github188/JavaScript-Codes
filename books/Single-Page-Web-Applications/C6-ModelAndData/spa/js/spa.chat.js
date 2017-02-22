/**
 * Chat 模块控制器
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-13 08:51:42
 * @version $Id$
 */


spa.chat = (function () {
	
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
			            + '<div class="spa-chat-msgs"></div>'
			            + '<div class="spa-chat-box">'
		                    + '<input type="text" />'
		                    + '<div>send</div>'
			            + '</div>'
				    + '</div>'
				+ '</div>',

			settable_map: { 

				slider_open_time 	: true,
				slider_close_time 	: true,
				slider_opened_em 	: true,
				slider_closed_em 	: true,
				slider_opened_title : true,
				slider_closed_title : true,

				chat_model 		: true,
				people_model 	: true,
				set_chat_anchor : true
			},

			slider_open_time 		: 250,
			slider_close_time 		: 250,
			slider_opened_em 		: 18,
			slider_closed_em 		: 2,
			slider_opened_min_em 	: 10,
			window_height_min_em 	: 20,
			slider_opened_title 	: 'Click to close',
			slider_closed_title 	: 'Click to open',

			chat_model 		: null,
			people_model 	: null,
			set_chat_anchor : null
		},

		stateMap = {
			$append_target: null,

			position_type 		: 'closed',
			px_per_em 			: 0,
			slider_hidden_px 	: 0,
			slider_closed_px 	: 0,
			slider_opened_px 	: 0
		},

		jqueryMap = {},

		setJqueryMap, configModule, initModule,

		getEmSize, setPxSizes, setSliderPosition, onClickToggle,

		removeSlider, handleResize
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
				$slider : $slider,
				$head 	: $slider.find( '.spa-chat-head' ),
				$toggle	: $slider.find( '.spa-chat-head-toggle' ),
				$title 	: $slider.find( '.spa-chat-head-title' ),
				$sizer 	: $slider.find( '.spa-chat-sizer' ),
				$msgs 	: $slider.find( '.spa-chat-msgs' ),
				$box 	: $slider.find( '.spa-chat-box' ),
				$input 	: $slider.find( '.spa-chat-box input[type=text]' ),
			};	
		};

		// 计算该模块元素尺寸
		setPxSizes = function () {
			
			var
				px_per_em, opened_height_em, window_height_em;

			px_per_em = getEmSize( jqueryMap.$slider.get(0) );

			// 计算窗口高度：em
			window_height_em = Math.floor(
				( $(window).height() / px_per_em ) + 0.5
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

			if ( stateMap.position_type === position_type ) {
				return true;
			}

			setAttr = function ( height, an_time, title, text ) {
				
				height_px		= height;
				animate_time 	= an_time;
				slider_title 	= title;
				toggle_text 	= text;
			};

			switch ( position_type ) {
				case 'opened':
					setAttr( 
						stateMap.slider_opened_px,
						configMap.slider_open_time,
						configMap.slider_opened_title,
						'='
					);
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
		/* ----------------------- END DOM METHODS ----------------------- */


		/* ----------------------- BEGIN EVENT METHODS ----------------------- */
		onClickToggle = function ( event ) {
			
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
				input_map 		: input_map,
				settable_map 	: configMap.settable_map,
				config_map 		: configMap
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
			
			$append_target.append( configMap.main_html );

			stateMap.$append_target = $append_target;

			setJqueryMap();
			setPxSizes();

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
			stateMap.position_type 	= 'closed';

			stateMap.chat_model 		= null;
			stateMap.people_model 		= null;
			stateMap.set_chat_anchor 	= null;

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
			setSliderPosition 	: setSliderPosition,
			configModule 		: configModule,
			initModule 			: initModule,
			removeSlider 		: removeSlider,
			handleResize 		: handleResize
		};

}());