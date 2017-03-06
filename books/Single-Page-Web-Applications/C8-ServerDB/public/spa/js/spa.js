/**
 * Root Namespace Module
 *  
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-08 17:44:05
 * @version $Id$
 */

var spa = (function () {

	var 
		initModule;

	initModule = function ( $container ) {

		// 数据模块
		spa.data.initModule();
		
		// 加载数据模型模块
		spa.model.initModule();

		// 加载 shell 模块
		spa.shell.initModule( $container );	
	};

	return {
		initModule: initModule
	};
	
}());
