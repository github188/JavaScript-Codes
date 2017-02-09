/**
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-09 15:42:17
 * @version $Id$
 */

spa.shell = (function () {

	var 
		configMap = {
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
	        chatExtendTime 	: 1000,
	        chatRetractTime  	: 300,
	        chatExtendHeight 	: 450,
	        chatRetractHeight : 15
	        // END SLIDER
		},

		stateMap 	= { $container: null },

		jqueryMap 	= {},

		/* --------- START FUCNTIONS --------- */
		setJqueryMap, initModule,

		// 滑块行为
		toggleChat;

		/* --------- END FUCNTIONS --------- */


	// --------- BEGIN UTILITY METHODS ---------------
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
			pxChatHt 	= jqueryMap.$chat.height(),
			isOpen 		= pxChatHt === configMap.chatExtendHeight,
			isClosed 	= pxChatHt === configMap.chatRetractHeight,
			isSliding 	= !isOpen && !isClosed;

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
				callback && callback( jqueryMap.$chat );
			}
		);

		return true;
	};

	/* --------- END DOM METHODS --------------- */

	// --------- BEGIN PUBLIC METHODS ---------------
	initModule = function ( $container ) {
		
		// 缓存容器
		stateMap.$container = $container;

		$container.html( configMap.mainHtml );

		// 缓存数据至 jQuery
		setJqueryMap();

		// 测试代码
		TEST.showChatSlider( toggleChat );
		TEST.hideChatSlider( toggleChat );
	};
	// ----------- END PUBLIC METHODS ---------------
	
	return {
		initModule: initModule
	};
}());