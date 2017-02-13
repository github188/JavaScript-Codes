/**
 * 测试代码文件
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-09 16:53:58
 * @version $Id$
 */

function isObject( arg ) {
	return Object.prototype.toString.call( arg ) === '[object Object]';
}

function spa_debug( arg, name ) {

	// 对象输出方式
	if ( isObject( arg ) && name  ) {

		console.log( name + '------------>' );
		console.log( arg );
		console.log( '<------------' + name );

		return;
	}

	console.log( arg );
}


var TEST = (function () {

	var
		// 测试开关
		switcher = false,

		elements = {
			chat: $('spa-shell-chat')
		},

		// 滑块
		showChatSlider, hideChatSlider,

		// 取消测试代码
		closeTest, openTest, voidFn;

	showChatSlider = function ( fn ) {
		setTimeout(function () { fn && fn( true ); }, 3000);			
	};

	hideChatSlider = function ( fn ) {
		setTimeout( function () { fn && fn( false ); }, 8000 );
	};

	voidFn = function () {
		
		spa_debug( 'I am void function, nothing to do......' );	
	};

	// 增加 need 参数，可以在总开关 switcher 关闭的情况下，启用单个测试用例函数
	function getFn( fn, need ) {

		return need ? fn : (switcher ? fn : voidFn);
	}

	return {
		showChatSlider: getFn( showChatSlider ),
		hideChatSlider: getFn( hideChatSlider )
	};

}());
