/**
 * 
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-08-23 09:31:05
 * @version $Id$
 *
 *
 * 	1. 使用方法：
 * 		> 引入Calculator.js
 * 		> 创建计算器对象：
 * 			var calculator = new Calculator();
 * 		> 初始化计算器对象；
 * 			calculator.init();
 *
 *
 *
 *
 * 
 */

// 计算器对象
function Calculator() {

	// 私有属性
	this.bdResult 	= $("board-result"); 	// 计算机面板结果显示区对象
	this.operator 	= ['+', '-', '×', '÷', '='];
	this.digits 	= ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']; // 组成有效数字的数字数组
	this.dot 		= '.';
	this.equal 		= '=';
	this.zero 		= '0';
	this.digit 		= "";					// 当前输入的数字
	this.expression = ""; 					// 表达式
	this.resSpan 	= getResSpan(); 	// 数字显示区
	this.resDown 	= $("result-down");  	// 表达式显示区
	this.last 		= ""; 				 	// 上一次按下的按钮内容
	this.allDigits 	= [];					// 从表达式中获取的所有数字组成的数组，将用来和ops中的操作符对应计算出结果				
	this.ops 		= [];					// 所有操作符组成的数组
	this.hasEqual 	= false;				// 判断是否按下了'='键
	this.lastRes 	= 0;					// 上一次计算的结果，即上一次按等号后计算出的值


	// 私有方法

}

Calculator.prototype.test = "hello world!";

/************************** 计算器对象方法 **************************/

Calculator.prototype.init = function () {
	this.addTdClick();
};

// 为td添加点击事件
Calculator.prototype.addTdClick = function () {
	
	var tds 		= $tag("td");
	var that 		= this;
	// 为每个td添加点击事件
	for (var i = 0; i < tds.length; i++) {
		tds[i].onclick = function (){
			// alert(this.innerText);
			var text = this.innerText;

			that.calculatorClickEvent(text);
		};
	}
};

// 计算器按钮事件
Calculator.prototype.calculatorClickEvent = function (btnText) {
	
	// 上一个按键是'='
	if (this.hasEqual) {
		this.hasEqual = false;
		this.clearData();
	}

	// 结果显示在board-result里
	if (btnText != "AC" && btnText != "CE") {
		this.btnClickHanlder(btnText);
	} else { // AC或CE清零
		this.clearData();
	}
};

// 计算器的按键事件处理
Calculator.prototype.btnClickHanlder = function (btnText) {

	if ((btnText >= '0' && btnText <= '9') || btnText == this.dot) { // 数字键处理

		// 如果上一个是操作符，则清空当前数字区
		if (this.isOperator(this.last)) {
			this.resSpan.innerText = '';
			this.digit = '';
		} else if ((btnText == this.dot) && (this.last == this.dot)) {
			// 如果上一个也是点，则对本次的点按钮不做响应
			return;
		}

		this.digit += btnText;
		this.expression += btnText;
	} else if (this.isOperator(btnText)) { // 操作符处理

		// 如果当前表达式为'0'，按'='，不给响应
		if ((btnText == this.equal) && (this.resDown.innerText == this.zero || this.resDown.innerText == "")) return;
		// 如果上一个是非'='的操作符则不进行处理
		if (!this.isOperator(this.last) && btnText == this.equal) {   // '='处理

			this.showCurrRes(this.zero, this.expression + btnText); // 计算结果显示在表达式区域
			return; 
		}  else if (this.isOperator(this.last)) {
			// 上一个是操作符，此次的操作符不做记录
			return;
		} else {
			this.expression += btnText;
		}

	}

	this.showCurrRes(this.digit, this.expression);

	this.last = btnText;
};

// 显示当前结果的触发方法
Calculator.prototype.showCurrRes = function (digit, expression) {

	if (!expression) return;

	this.showText(digit, expression);

	// 1. 没有'='，表示还没有到计算结果的时候，直接退出
	if (expression.indexOf(this.equal) == -1) return;

	// 计算出了结果
	this.hasEqual = true;

	// 2. 处理只按了数字然后直接按了等号的情况，即：'234='则直接返回234
	var tmpStr = this.delHeadZero(expression.substr(0, expression.length - 1)); // 去掉最后一个'='
	if (!this.hasOperator(tmpStr)) {
		this.showText(tmpStr, expression + tmpStr);
		return;
	} 

	// 3. 处理表达式字符串，且计算出结果
	var start 	= 0;
	for (var i = 0; i < expression.length; i++) {

		var c = expression[i];
		if (this.isOperator(c)) { // 操作符
			this.ops.push(c);  	// 保存操作符
			var numStr = expression.substr(start, i + 1);  // 数字字符串
			var number = 0;

			// 浮点数和整型处理
			if (numStr.indexOf(this.dot)) {
				number = parseFloat(numStr);
			} else {
				number = parseInt(numStr);
			}
			this.allDigits.push(number); // 保存数字
			start = i + 1; // 重设数字起始位置，即操作符的下一个字符开始
		}
	}

	// 用allDigits和ops去计算结果
	var res = this.calResult();

	// 保存此次计算结果，作为下一次计算用 [TODO]
	this.lastRes = res;

	// 将结果显示出来
	this.showText(res + '', expression + res);
};

// 将表达式和计算结果显示到屏显区
Calculator.prototype.showText = function (digitStr, expression) {
	
	// 先删除开头的'0'
	var expStr = this.delHeadZero(expression);
	var digStr = this.delHeadZero(digitStr);

	// 然后再根据情况决定是否添加'0'
	var tmp =  expression == this.zero ? expression : this.addZero(expStr);;
	var dig =  digitStr == this.zero ? digitStr : this.addZero(digStr);

	this.resSpan.innerText = dig;

	// 如果表达式第一个是操作符，则表示之前按的是'0'，则给补上'0'，因为前面将开头的'0'都删掉了
	if (this.isOperator(tmp[0])) {
		tmp = this.zero + tmp;
	}

	this.resDown.innerText = tmp;
}

// 开头添加'0'，防止重复出现或者没有'0'情况
Calculator.prototype.addZero = function (expression) {

	if (!expression) return this.zero;

	if (expression[0] == this.dot) { // 浮点数
		return this.zero + expression;
	} else {
		return expression;
	}
};

// 计算结果
Calculator.prototype.calResult = function () {
	var first 	= 0;
	var second 	= 0;
	var res 	= 0;
	for (var i = 0; i < this.ops.length; i++) {
		first 	= this.allDigits[i];
		second 	= this.allDigits[i + 1];
		switch (this.ops[i]) {
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
				break;
		}

		this.allDigits[i + 1] = res;
	}

	return res;
};

// 计算完一次，清空所有数据，以备下次计算使用
Calculator.prototype.clearData = function () {
	this.allDigits 	= [];
	this.ops 	= [];
	this.expression = this.zero;
	this.digit 	= '';

	this.resSpan.innerText = this.zero;
	this.resDown.innerText = this.zero;
};

// 判断表达式中是否含有操作符
Calculator.prototype.hasOperator = function (str) {

	if (!str) return;

	for (var i = 0; i < this.operator.length; i++) {
		if (str.indexOf(this.operator[i]) >= 0) {
			return true;
		}
	}

	return false;
};

// 判断是否是操作符
Calculator.prototype.isOperator = function (str) {
	return this.operator.indexOf(str) >= 0;
};

// 去开头的零
Calculator.prototype.delHeadZero = function (str) {

	// 先把开头的‘0’都删掉
	var tmp = "";
	tmp = str.replace(/^[0]+/gi, "");
	if (tmp[0] == this.dot) {  // 浮点数重新补上'0'
		tmp = this.zero + tmp;
	}

	return tmp;
};

// 获取输入的数字显示区对象
function getResSpan() {
	return $("result-up").getElementsByTagName("span")[0];
}

// 根据标签名获取DOM对象
function $tag(tagName) {
	return document.getElementsByTagName(tagName);
}

// 根据ID获取DOM对象
function $(id) {
	return document.getElementById(id);
}

// var calculator = new Calculator();
// calculator.init();
new Calculator().init();
