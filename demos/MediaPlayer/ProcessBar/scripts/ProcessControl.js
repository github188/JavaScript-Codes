/**
 * 
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-11-02 11:19:51
 * @version $Id$
 */


var processBar = (function () {
	var o = {};

	// 进度条步长(单位：px)
	o.step = 10; 

	// 左右键处理, direction: left == -1, right == 1
	o.keyLeftRightHandler = function ( direction ) {
		if ( Math.abs( direction ) !== 1 ) return;

		var that = this;


	};

	o.
}());



document.onkeydown = keyhandler;


function keyhandler( event ) {
	var code = event.which;

	switch ( code ) {
		case 37: // left
			processBar.keyLeftRightHandler( -1 );
			break;
		case 39: // right
			processBar.keyLeftRightHandler( 1 );
			break;
		default:
			break;
	}	
}
