/**
 * 
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-08-16 18:44:49
 * @version $Id$
 */






var bdResult 	= $("board-result");
var operator 	= ['+', '-', '×', '÷', '='];
var dot 		= '.';
var equal 		= '=';
var digit 		= "";
var zero 		= "0";
var expression  = ""; 				// 表达式
var resSpan 	= getResSpan(); 	 // 数字显示区
var resDown 	= $("result-down");  // 表达式显示区
var last 		= "";
var digits 		= [];
var ops 		= [];
var hasEqual 	= false;			// 判断是否按下了'='键
var lastRes 	= 0;				// 上一次计算的结果，即上一次按等号后计算出的值

// 为td添加点击事件
(function addTdClick() {
	
	var tds 		= $tag("td");

	// 为每个td添加点击事件
	for (var i = 0; i < tds.length; i++) {
		tds[i].onclick = function (){
			// alert(this.innerText);
			var text = this.innerText;

			// 上一个按键是'='
			if (hasEqual) {
				hasEqual = false;
				clearData();
			}

			// 结果显示在board-result里
			if (text != "AC" && text != "CE") {
				btnClickHanlder(text);
			} else { // AC或CE清零
				clearData();
			}
		};
	}

})();

// 按键处理
function btnClickHanlder(btnText) {

	if (btnText >= '0' && btnText <= '9' || btnText == dot) { // 数字键处理

		// 如果上一个是操作符，则清空当前数字区
		if (isOperator(last)) {
			resSpan.innerText = "";
			digit = '';
		} else if (btnText == dot && last == dot) {
			// 如果上一个也是点，则对本次的点按钮不做响应
			return;
		}

		digit += btnText;
		expression += btnText;
	} else if (isOperator(btnText)) { // 操作符处理

		// 如果当前为'0'，按'='，不给响应
		if (btnText == equal && (resSpan.innerText == zero || resSpan.innerText == "")) return;

		// 如果上一个是非'='的操作符则不进行处理
		if (!isOperator(last) && btnText == equal) {   // '='处理

			showCurrRes(zero, expression + btnText); // 计算结果显示在表达式区域
			return; 
		}  else if (isOperator(last)) {
			// 上一个是操作符，此次的操作符不做记录
			return;
		} else {
			expression += btnText;
		}

	} else { 
		// 其他情况
	}

	showCurrRes(digit, expression);

	last = btnText;
}

// 传入表达式得到当前结果
function showCurrRes(digit, expression) {

	if (!expression) return;

	showText(digit, expression);

	// 没有'='，表示还没有到计算结果的时候，直接退出
	if (expression.indexOf(equal) == -1) return;

	// 计算出了结果
	hasEqual = true;

	// 处理只按了数字然后直接按了等号的情况，即：'234='则直接返回234
	var tmpStr = delHeadZero(expression.substr(0, expression.length - 1)); // 去掉最后一个'='
	if (!hasOperator(tmpStr)) {
		showText(tmpStr, expression + tmpStr);
		return;
	} 

	// 处理表达式字符串，且计算出结果
	var start 	= 0;
	for (var i = 0; i < expression.length; i++) {

		var c = expression[i];
		if (isOperator(c)) {
			// 非数字，则为操作符
			ops.push(c);  	// 保存操作符
			var numStr = expression.substr(start, i + 1);
			var number = 0;

			// 浮点数和整型处理
			if (numStr.indexOf(dot)) {
				number = parseFloat(numStr);
			} else {
				number = parseInt(numStr);
			}
			digits.push(number); // 保存数字
			start = i + 1;
		}
	}

	var res = calResult();

	lastRes = res;

	console.log("res = " + res);
	showText(res + '', expression + res);
}

function showText(digitStr, expression) {
	

	// 先删除开头的'0'
	var expStr = delHeadZero(expression);
	var digStr = delHeadZero(digitStr);

	console.log(expStr + ' ---- ' + digStr);
	// 然后再根据情况决定是否添加'0'
	var tmp =  expression == zero ? expression : addZero(expStr);;
	var dig =  digitStr == zero ? digitStr : addZero(digStr);

	resSpan.innerText = dig;
	resDown.innerText = tmp;
}

function addZero(str) {

	if (!str) return zero;

	if (str[0] == dot) {
		return zero + str;
	} else {
		return str;
	}
}

function calResult() {
	var first 	= 0;
	var second 	= 0;
	var res 	= 0;
	for (var i = 0; i < ops.length; i++) {
		first 	= digits[i];
		second 	= digits[i + 1];
		switch (ops[i]) {
			case '+':
				res = first + second;
				break;
			case '-':
				res = first - second;
				break;
			case '×':
				res = first * second;
				break;
			case '÷':
				res = first / second;
				break;
			default:
				// statements_def
				break;
		}

		digits[i + 1] = res;
	}

	return res;
}

function clearData() {
	digits 	= [];
	ops 	= [];
	expression = zero;
	digit 	= '';

	resSpan.innerText = zero;
	resDown.innerText = zero;
}

// 根据表达式计算结果
function calculate(expression) {
	return "I'm the result !";
}

function hasOperator(str) {

	if (!str) return;

	for (var i = 0; i < operator.length; i++) {
		if (str.indexOf(operator[i]) >= 0) {
			return true;
		}
	}

	return false;
}


// 判断是否是操作符
function isOperator(str) {
	return operator.indexOf(str) >= 0;
}

// 去开头的零
function delHeadZero(str) {

	// 先把开头的‘0’都删掉
	var tmp = "";
	tmp = str.replace(/^[0]+/gi, "");
	if (tmp[0] == dot) {
		tmp = zero + tmp;
	}

	return tmp;
}

// 根据标签名获取DOM对象
function $tag(tagName) {
	return document.getElementsByTagName(tagName);
}

// 根据ID获取DOM对象
function $(id) {
	return document.getElementById(id);
}

function getResSpan() {
	return $("result-up").getElementsByTagName("span")[0];
}
