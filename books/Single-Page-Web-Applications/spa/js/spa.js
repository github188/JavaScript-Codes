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
		
		$container.html(
			'<h1 style="display:inline-block; margin:25px;">' 
			+ 'Hello World!'
			+ '</h1>'
		);		
	};

	return {
		initModule: initModule
	};
	
}());
