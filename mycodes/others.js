/**
 * 1. convertHTML  	将字符串中的特殊字符，转义成html中相应的字符
 * 2. fibonacci 	经典算法实现[效率：基础递归 < 闭包递归 < for循环]
 */


/************************* 1. convertHTML ************************/

// 将字符串中的特殊字符，转义成html中相应的字符
function convertHTML(str) {

	if ( !str ) return;

	var htmlChar = {
		"&": "&​amp;",
		"<": "&​lt;",
		">": "&gt;",
		"\"": "&​quot;",
		"\'": "&​apos;"
		// " ": "&nbsp;",
	};


	var strArr 	= str.split("");

	strArr.map(function(element, index){
		if (htmlChar.hasOwnProperty(element)) {
			strArr.splice(index, 1, htmlChar[element]);
		}
	});

	return strArr.join("");
}

/************************* 2. fibonacci ************************
 * 效率：for > closure > basic	
 */

var count = 0;

// 基础递归方法
var fibonacciBasic = function (number) {
	if (number == 0 || number ==1) {
		return 1;
	} else {
		count++;
		return fibonacciBasic(number - 1) + fibonacciBasic(number - 2);
	}
};

// 闭包实现
var fibonacciClosure = (function () {

	// 这个用来缓存计算出的值，方便下次直接提取使用
	var res = [1, 1];

	return function (number) {

		// 测试用，计算回调次数
		count++;

		// 判断该值是否曾经计算且保存过，有则直接取出来使用，没有则进行下一步，
		// 并且将新值缓存起来
		if (res[number]) {
			console.log("exist, res[" + number + "] = " + res[number]);
			// console.log("exist in data!");
			return res[number];
		} else {
			res[number] = fibonacciClosure(number - 1) + fibonacciClosure(number - 2);
			return res[number];
		}
	};
})();

// 循环
var fibonacciCircle = function (number) {
	if (number == 0 || number == 1) {
		return 1;
	} else {
		var x = 1; 	// 保存第一个值
		var y = 1; 	// 保存第二个值
		var z = 2; 	// 保存第一个和第二个值的和
		for (var i = 2; i <= number; i++) {
			count++;
			z = y + x;
			y = x;
			x = z;
		}
		return z;
	}
}


