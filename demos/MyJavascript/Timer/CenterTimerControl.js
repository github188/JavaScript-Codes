/**
 * 定时器优化：中央定时器控制
 * @authors zc li (ccc_simon@163.com)
 * @date    2016-11-21 08:28:31
 * @version $Id$
 */


/**
 * 控制器对象
 */

var timers = {
	timerID: 0, // 当前运行的定时器ID
	timers: [], // 定时器回调函数

	add: function ( fn ) {
		this.timers.push( fn ); // 添加回调函数
	},

	// 启动定时器
	start: function () {
		if ( this.timerID ) return;
		(function runNext() {
			var i = 0, 
				len = this.timers.length;
			// 运行当前定时器回调
			if ( len > 0 ) {
				for ( ; i < len; i++ ) {
					if ( timers.timers[i]() === false ) {
						timers.timers.splice( i, 1 );
						i--;
					}
				}

				timers.timerID = setTimeout( runNext, 100 );
			}
		}());
	},

	// 停止当前运行的定时器
	stop: function () {
		clearTimeout( this.timerID );
		this.timerID = 0;
	}
};

/**
 * 异步测试
 */
(function () {
	var queue = [],
		paused = false;

	this.test = function ( fn ) {
		queque.push( fn );
		runTest();
	};

	this.pause = function () {
		paused = true;
	};

	this.resume = function () {
		paused = false;
		setTimeout( runTest, 1 );
	};

	function runTest() {
		if ( !paused && queque.length ) {
			queue.shift()();
			if ( !paused ) resume();
		}
	}
}());
