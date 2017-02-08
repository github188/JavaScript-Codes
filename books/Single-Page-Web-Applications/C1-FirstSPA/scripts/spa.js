/**
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-08 14:57:13
 * @version $Id$
 */

var spa = (function ( $ ) {

	var
		// 模块配置仓库
		configMap = {
			extended_height: 434,
			extended_title: 'Click to retract',
			retracted_height: 16,
			retracted_title: 'Click to extend',
			template_html: '<div class="spa-slider"><\/div>'
		},

		$chatSlider,

		toggleSilder, onClickSlider, initModule;


	// 控制滑块的显示和收缩
	toggleSilder = function () {
		
		var 
			slider_height = $chatSlider.height();

		if ( slider_height === configMap.retracted_height ) { // 收缩状

			$chatSlider.animate({ height: configMap.extended_height })
					   .attr( 'title', configMap.extended_title );

			return true;
		} else if ( slider_height === configMap.extended_height ) { // 显示状

			$chatSlider.animate({ height: configMap.retracted_height })
					   .attr( 'title', configMap.retracted_title );

			return true;
		}

		return false;
	};

	// 滑块点击事件处理，点击根据当前状态显示或收缩
	onClickSlider = function () {

		toggleSilder();

		return false;
	};

	// 模块初始化
	initModule = function ( $container ) {
		
		$container.html( configMap.template_html );

		$chatSlider = $container.find( '.spa-slider' );

		// 改变标题，添加点击事件
		$chatSlider.attr( 'title', configMap.retracted_title ).hover( onClickSlider );

		return true;
	};

	return {
		initModule: initModule
	};

}( jQuery ));

$(function () {

	spa.initModule( $('#spa') );
});