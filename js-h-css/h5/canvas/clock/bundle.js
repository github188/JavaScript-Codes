/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * 时钟脚本
 */

function Clock(canvas) {
	this.canvas 	= canvas;
	this.width 		= this.canvas.offsetWidth;
	this.height 	= this.canvas.offsetHeight;
	this.rem 		= this.width / 200;
	this.ctx 		= this.canvas.getContext('2d');
	this.r 			= this.width / 2;
	this.digits 	= [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
	this.dotCount 	= 60;
	this.cellRad 	= 2 * Math.PI / this.digits.length;

}

Clock.prototype._context = function ( d ) {
	return this.ctx;	
}

/**
 * 绘制时钟背景
 * @return {[type]} [description]
 */
Clock.prototype.drawBg = function () {

	var ctx = this._context(),
		lineWidth = 8,
		r = this.r - lineWidth * this.rem / 2;

	ctx.save();
	ctx.translate(this.r, this.r);
	ctx.beginPath();
	ctx.lineWidth = lineWidth;
	ctx.arc(0, 0, r, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.stroke();

	return this;
}

/**
 * 绘制时钟的小时数字
 * @return {[type]} [description]
 */
Clock.prototype.drawDigits = function () {
	
	var me 		= this,
		ctx 	= this._context(),
		delta 	= 30,
		r 		= this.r - delta * this.rem,
		rad 	= 0,
		x, y;

	this.digits.forEach(function (digit, index) {

		rad = me.cellRad * index;

		x = r * Math.cos(rad);
		y = r * Math.sin(rad);

		ctx.font = '18px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(digit + '', x, y);
	});

	return this;
}

/**
 * 绘制时间点，每圈有 60 个点, 12 * 5
 * @return {[type]} [description]
 */
Clock.prototype.drawDot = function () {

	var	ctx 	= this._context(),
		delta 	= 18,
		r 		= this.r - delta * this.rem,
		rad 	= 0,
		dotRad 	= 2 * Math.PI / this.dotCount,
		x, y, i;

	for ( i = 0; i < this.dotCount; i++ ) {

		rad = dotRad * i;
		x 	= r * Math.cos(rad);
		y 	= r * Math.sin(rad);

		ctx.beginPath();
		ctx.arc(x, y, 1 * this.rem, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fillStyle = 'gray';
		if ( i % 5 === 0 ) {
			ctx.fillStyle = 'black';
		}
		ctx.fill();
	}
}

/**
 * 绘制小时指针
 * @param  {Number} hour   小时时间（1-12）
 * @param  {Number} minute 分钟时间（1-60）
 * @return {[type]}        [description]
 */
Clock.prototype.drawHourHand = function ( hour, minute ) {
	
	var rad, cellRad;

	cellRad = 2 * Math.PI / this.digits.length;

	rad =  cellRad * hour + minute / 60 * cellRad;

	this._drawHand(rad, this.r * 0.5, 'black', 5);

	return this;
};

/**
 * 绘制分钟时针
 * @param  {Number} minute 分钟时间（1-60）
 * @return {[type]}        [description]
 */
Clock.prototype.drawMinuteHand = function ( minute ) {

	var rad = minute * (2 * Math.PI / this.dotCount);

	this._drawHand(rad, this.r * 0.6, 'black', 5);

	return this;
};

/**
 * 绘制秒钟时针
 * @param  {Number} second 秒数值（1-60）
 * @return {[type]}        [description]
 */
Clock.prototype.drawSecondHand = function ( second ) {

	var rad = second * (2 * Math.PI / this.dotCount);

	this._drawHand(rad, this.r * 0.78, 'gray', 2);

	return this;
};

/**
 * 绘制线条（时针，分针，秒针线）
 * @param  {Number} rad    弧度，当前时间对应的弧度
 * @param  {Number} length 时间针的长度
 * @param  {String} style  时间针的填充样式
 * @param  {Number} width  时间针的宽度
 * @return {[type]}        [description]
 */
Clock.prototype._drawHand = function (rad, length, style, width) {
	var ctx = this._context();

	ctx.save();
	ctx.beginPath();
	ctx.rotate(rad);
	ctx.lineCap = 'round';
	ctx.lineWidth = width;
	ctx.strokeStyle = style;
	ctx.moveTo(0, 10 * this.rem);
	ctx.lineTo(0, -length);
	ctx.closePath();
	ctx.stroke();
	ctx.restore();

	return this;
}

/**
 * 绘制时间针的中心空心点
 * @return {[type]} [description]
 */
Clock.prototype.drawCenterDot = function () {
	
	var ctx = this._context(),
		x, y;

	ctx.beginPath();
	ctx.arc(0, 0, 2 * this.rem, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fillStyle = 'white';
	ctx.fill();

	return this;
}

/**
 * 绘制整个时钟
 * @return {[type]} [description]
 */
Clock.prototype.draw = function () {

	this.start();
}

/**
 * 每秒重绘一次时钟
 * @param  {Number} h 小时数
 * @param  {Number} m 分钟数
 * @param  {Number} s 秒数
 * @return {[type]}   [description]
 */
Clock.prototype._update = function (h, m, s) {
	
	this.ctx.clearRect(0, 0, this.width, this.height);
	this.drawBg();
	this.drawDigits();
	this.drawDot();
	this.drawHourHand(h, m);
	this.drawMinuteHand(m);
	this.drawSecondHand(s);
	this.drawCenterDot();
	this.ctx.restore();

	return this;
}

/**
 * 开始更新时钟
 * @return {[type]} [description]
 */
Clock.prototype.start = function () {
	
	var date = new Date(),
		hour, minute, second,
		me = this;

	hour 	= date.getHours();
	minute 	= date.getMinutes();
	second 	= date.getSeconds();

	this._update(hour, minute, second);

	requestAnimationFrame(function () {
		me.start();
	}, 1000);
};


module.exports = function (canvas) {
	return new Clock(canvas);
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {



__webpack_require__(0)(document.getElementById('clock')).draw();

/***/ })
/******/ ]);