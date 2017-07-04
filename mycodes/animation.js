/**
 * 动画文件 
 */

/**
 * 淡入淡出动画
 * @param  {DOMElement} 需要执行动画的元素
 * @param  {[type]} inout 	取值为 'in'：淡入，'out'：淡出
 * @param  {[type]} refV 	参考值，用来递增递减，最后值会赋值给元素的 opacity
 * @param  {[type]} opacity 元素的初始透明度
 * @return {[type]}
 * 使用方式
 *
 * 	1. 淡入
 * 	function show(cb) {
		fadeFn(el, 'in', 0, 0, function (el, v) {
			el.style.opacity = v;
		}, false)();
	}
	
	2. 淡出
	function hide(cb) {
		fadeFn(el, 'out', 100, 1, function (el, v) {
			el.style.opacity = v;
		}, false)();
	}

	3. 淡入淡出
	function inout() {
		fadeFn(el, 'in', 0, 0, function (el, v) {
			el.style.border = '10px solid rgba(6, 127, 210, ' + v + ')';
		}, true)();
	}

	4. 目标函数
	function fadeBorder(el, v) {
		// console.log('b - ' + v);
		el.style.border = '10px solid rgba(6, 127, 210, ' + v + ')'
	}
 */
function fadeFn(el, inout, refV, opacity, handler, circle) {

 	var value = refV;
 	var timer = null;

 	if (inout === 'in') {
 		// el.style.display = 'block';
 	}

 	handler(el, opacity);
 	// fadeBorder(el, opacity);
 	// el.style.opacity = opacity;

 	return function fade(start, end, stepV) {
 		var startV = start || 0;
 		var endV = end || 100;
 		var step = stepV || 1;
 		var condition = inout === 'in' ? value >= endV : value <= startV;
 		var args = arguments;
 		// console.log(condition)
 		if (condition) {
 			// el.style.opacity = value / 100;
 			if (inout === 'out') {
 				// el.style.display = 'none';
 			}

 			if (circle) {
 				value = refV = Math.abs(refV - 100);
 				opacity = Math.abs(opacity - 1);
 				inout = inout === 'in' ? 'out' : 'in';
 				fade(start, end, stepV);
 			} else {
 				clearTimeout(timer);
 				return;
 			}
 		}

 		value = inout === 'in' ? value + step : value - step;

 		// el.style.opacity = value / 100;
 		// fadeBorder(el, value / 100);
 		handler(el, value / 100);

 		// console.log(el.style.opacity);

 		clearTimeout(timer);
 		timer = setTimeout(function () {
 			fade(start, end, stepV);
 		}, 15);
 	};

};

