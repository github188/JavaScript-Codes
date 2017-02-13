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
		
		// 加载 shell 模块
		spa.shell.initModule( $container );	
	};

	return {
		initModule: initModule
	};
	
}());
