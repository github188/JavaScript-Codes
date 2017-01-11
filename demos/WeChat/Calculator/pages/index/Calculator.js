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
function Calculator( page ) {

	// 私有属性
	this.operator 	= ['+', '-', '×', '÷', '='];
	this.digits 	= ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']; // 组成有效数字的数字数组
	this.dot 		= '.';
	this.equal 		= '=';
	this.zero 		= '0';
	this.digit 		= "";					// 当前输入的数字
	this.expression = ""; 					// 表达式
	this.last 		= ""; 				 	// 上一次按下的按钮内容
	this.allDigits 	= [];					// 从表达式中获取的所有数字组成的数组，将用来和ops中的操作符对应计算出结果				
	this.ops 		= [];					// 所有操作符组成的数组
	this.hasEqual 	= false;				// 判断是否按下了'='键
	this.lastRes 	= 0;					// 上一次计算的结果，即上一次按等号后计算出的值

	this.timer 		= null;					// 时间日期计时器

    this.page       = page;
	// 私有方法

}

Calculator.prototype.test = "hello world!";

/************************** 计算器对象方法 **************************/

// 计算器初始化
Calculator.prototype.init = function () {

	// 时间显示
	this.showDate();
};

// 计算器销毁工作，在页面关闭时候触发onunload时候调用
Calculator.prototype.destory = function () {
	if (this.timer) {
		clearTimeout(this.timer);
	} 
};

// 计算器按钮事件
Calculator.prototype.calculatorClickEvent = function ( event ) {
	
    var that = this,
        text = event.target.dataset.text;

	// 上一个按键是'='
	if (that.hasEqual) {
		that.hasEqual = false;
		that.clearData();
	}

	// 结果显示在board-result里
	if (text != "AC" && text != "CE") {
		that.btnClickHanlder(text);
	} else { // AC或CE清零
		that.clearData();
	}
};

// 计算器的按键事件处理
Calculator.prototype.btnClickHanlder = function (btnText) {

	var that = this;

	if ((btnText >= '0' && btnText <= '9') || btnText == this.dot) { // 数字键处理

		// 如果上一个是操作符，则清空当前数字区
		if (this.isOperator(this.last)) {
			that.page.setData({resultUp: ''});
			this.digit = '';
		} else if ((btnText == this.dot) && (this.last == this.dot)) {
			// 如果上一个也是点，则对本次的点按钮不做响应
			return;
		}

		this.digit += btnText;
		this.expression += btnText;
	} else if (this.isOperator(btnText)) { // 操作符处理

		// 如果当前表达式为'0'，按'='，不给响应
		if ((btnText == this.equal) && (that.page.data.resultUp == this.zero || that.page.data.resultDown == "")) return;
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

	// BUG01 - 解决第一次按键是操作符的情况
	if (this.isOperator(expression[0])) {
		expression = this.zero + expression;
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
	
	var that = this,
		page = that.page;

	// 先删除开头的'0'
	var expStr = that.delHeadZero(expression);
	var digStr = that.delHeadZero(digitStr);

	// 然后再根据情况决定是否添加'0'
	var tmp =  expression == that.zero ? expression : that.addZero(expStr);;
	var dig =  digitStr == that.zero ? digitStr : that.addZero(digStr);

	page.setData({resultUp: dig});

	// 如果表达式第一个是操作符，则表示之前按的是'0'，则给补上'0'，因为前面将开头的'0'都删掉了
	if (that.isOperator(tmp[0])) {
		tmp = that.zero + tmp;
	}

	page.setData({resultDown: tmp});
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

	var that = this;

	that.allDigits 	= [];
	that.ops 	= [];
	that.expression = that.zero;
	that.digit 	= '';

	that.page.setData({resultUp: that.zero, resultDown:that.zero});
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

// 在屏显区左上角显示时间日期
Calculator.prototype.showDate = function () {

	var that 	= this,
		date 	= dateFormat("hh:mm:ss EEE yyyy-MM-dd");

	// debug( 'showDate --- date = ' + date );

	that.page.setData({dateContent: date});

	if (that.timer) clearTimeout(that.timer);
	that.timer = setTimeout(function(){
		that.showDate();
	}, 1000); 
};

// var calculator = new Calculator();
// calculator.init();

var instance = null;

function getInstance( page ) {
    
    if ( instance ) return instance;

    instance = new Calculator(page);

	instance.init();

    return instance;
}

function dateFormat(dateStr, date) {

	var date = date || new Date();

    var o = {
        "M+": (date.getMonth() + 1),        // Month
        "d+": date.getDate(),               // Date
        // "E+": date.getDay(),                // day
        "h+": date.getHours(),              // hour
        "H+": date.getHours(),              // hour
        "m+": date.getMinutes(),            // minute
        "s+": date.getSeconds(),            // second
        "S":  date.getMilliseconds()        // milli second
    };

    var week = ["一", "二", "三", "四", "五", "六", "日"];

    // 因为年份一般都是四位数，所以单独处理
    if (/(y+)/.test(dateStr)) {

        var year    = date.getFullYear() + "";

        // RegExp，if中正则表达式找到的第一个匹配项
        // 通过year.length - RegExp.$1.length可以达到，根据传入的格式化字符串中需要的长度去设置年份值
        dateStr = dateStr.replace(RegExp.$1, year.substr(year.length - RegExp.$1.length));
    }

    // 星期
    if (/(E+)/.test(dateStr)) {
        var w       = week[date.getDay() - 1];
        var len     = RegExp.$1.length; 

        dateStr = dateStr.replace(RegExp.$1, (len > 1 ? (len > 2 ? "星期" : "周") : "") + w);
    }

    // 由于月日，时分秒最长都为两位数，所以放在一起处理
    for (var k in o) {

        // 组织需要查找新的正则字符串
        var regx    = new RegExp("(" + k + ")");

        if (regx.test(dateStr)) {
            dateStr = dateStr.replace(RegExp.$1, (RegExp.$1.length === 1) ? o[k] : ('00' + o[k]).substr(("" + o[k]).length));
        }
    }

    return dateStr;
}

module.exports = {
    getInstance: getInstance,
	dateFormat: dateFormat
};