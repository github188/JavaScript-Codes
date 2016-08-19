/**
 * 
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-08-16 18:44:49
 * @version $Id$
 */






var bdResult 	= $("board-result");
var operator 	= ['+', '-', '×', '÷', '=', '.'];
var dot 		= '.';
var equal 		= '=';
var digit 		= "";
var zero 		= "0";
var expression  = ""; 				// 表达式
var resSpan 	= getResSpan(); 	 // 数字显示区
var resDown 	= $("result-down");  // 表达式显示区
var last 		= "";

// 为td添加点击事件
(function addTdClick() {
	
	var tds 		= $tag("td");

	// 为每个td添加点击事件
	for (var i = 0; i < tds.length; i++) {
		tds[i].onclick = function (){
			// alert(this.innerText);
			var text = this.innerText;

			// 结果显示在board-result里
			if (text != "AC" && text != "CE") {
				btnClickHanlder(text);
			} else { // AC或CE清零
				resSpan.innerText = zero;
				resDown.innerText = zero;
			}
		};
	}

})();

// 按键处理
function btnClickHanlder(btnText) {
	
	// 发生按键就把数字区零去掉
	resSpan.innerText = "";

	if (btnText >= 0 && btnText <= 9) { // 数字键处理

		// 如果上一个是操作符，则清空当前数字区
		if (isOperator(last)) {
			resSpan.innerText = "";
			digit = zero;
		}

		digit += btnText;
		console.log(digit);
	} else if (isOperator(btnText)) { // 操作符处理
		if (btnText == '=') { // 如果是等号就要计算结果了

			// 得出结果后，把数组都初始化，另显示结果
			digit = zero; // 得出结果，数字区清零
			expression = zero;
			showCurrRes(zero, calculate() + ""); // 计算结果显示在表达式区域
			return; 
		} else { // 不是则继续保存表达式
			expression += delHeadZero(digit + btnText);
		}
	} else { 
		// 其他情况
	}

	showCurrRes(digit, expression);

	last = btnText;
}

// 传入表达式得到当前结果
function showCurrRes(digit, expression) {
	resSpan.innerText = delHeadZero(digit);
	resDown.innerText = expression;
}

// 根据表达式计算结果
function calculate(expression) {
	return "I'm the result !";
}

// 判断是否是操作符
function isOperator(str) {
	return operator.indexOf(str) >= 0;
}

// 去开头的零
function delHeadZero(str) {
	return str.replace(/^[0]+/gi, "");
}

function $tag(tagName) {
	return document.getElementsByTagName(tagName);
}

function $(id) {
	return document.getElementById(id);
}

function getResSpan() {
	return $("result-up").getElementsByTagName("span")[0];
}
