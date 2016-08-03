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

/************************* 1. fibonacci ************************
 * 效率：for > closure > basic	
 */



var count = 0;

// 基础递归方法
var fibonacciBasic = function (number) {
	if (number == 0 || number ==1) {
		return 1;
	} else {
		count++;
		return fibonacci1(number - 1) + fibonacci1(number - 2);
	}
};

// 闭包实现
var fibonacciClosure = (function () {

	var res = [1, 1];

	return function (number) {

		count++;

		if (res[number]) {
			console.log("exist, res[" + number + "] = " + res[number]);
			// console.log("exist in data!");
			return res[number];
		} else {
			res[number] = fibonacci2(number - 1) + fibonacci2(number - 2);
			return res[number];
		}
	};
})();

// 循环
var fibonacciCircle = function (number) {
	if (number == 0 || number == 1) {
		return 1;
	} else {
		var x = 1, y = 1, z = 0;
		for (var i = 2; i <= number; i++) {
			count++;
			z = y + x;
			y = x;
			x = z;
		}
		return z;
	}
}


