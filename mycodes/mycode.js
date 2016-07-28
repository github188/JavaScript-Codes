/**
 * My Codes include my personal functions or apis
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-07-15 15:44:45
 * @version 1.0.1 create
 */


/****************************全局变量***************************************/

// 所有对象集合
var mycode = (function () {

	return {
		"numberHandler"	: new NumberHandler(),
		"arrayHandler"	: new ArrayHandler(),
		"errorHandler"	: new ErrorHandler(),
		"tools"			: new Tools(),
		"test"			: new Test()
	};
})();

// 对象别名，也可以根据个人情况，在引入该文件之后，自己定义对象变量名
var numberHandler 	= mycode.numberHandler,
	arrayHandler 	= mycode.arrayHandler,
	errorHandler 	= mycode.errorHandler,
	tools 			= mycode.tools,
	test 			= mycode.test;

/**************************************************************************** 
** 数字处理对象：numberHandler (方法名以"Number"结束)
** 1. convertToRomanNumber 		: 将阿拉伯数字转成罗马数字字符串表示形式
** 		例如：3425 ==> "MMMCDXXV"
*****************************************************************************/
function NumberHandler() {
	// 
}

/**
* 将1 - 3999数字转成罗马数字表示形式，如：
* @param  {[type]} num [description]
* @return {[type]}     [description]
*/
NumberHandler.prototype.convertToRomanNumber = function ( number ) {
	if ( number >= 4000 || number <= 0 ) {
		console.log( number + " is not between 1 and 3999, please check your number !" );
		return;
	}

	var romaStr = "";

	var thousand 	= parseInt(number / 1000), 				// 千位数
		hundred 	= parseInt(number % 1000 / 100),		// 百位数
		ten 		= parseInt(number % 1000 % 100 / 10), 	// 十位数
		single 		= parseInt(number % 1000 % 100 % 10); 	// 个位数

	console.log("thousand = " + thousand + ", hundred = " + hundred + ", ten = " + ten, ", single = " + single);

	if ( thousand > 0 ) romaStr += ["M", "MM", "MMM"][thousand - 1];
	if ( hundred > 0 ) 	romaStr += ["C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"][hundred - 1];
	if ( ten > 0 ) 		romaStr += ["X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"][ten - 1];
	if ( single > 0 )   romaStr += ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][single - 1];

	return romaStr;
};

/**************************************************************************** 
** 数组处理对象(函数名以"Array"结束)
** 1. hasArray					：判断数组中的元素是否存在类型为数组的元素
** 2. getMaxAndMinFromArray 	: 获取数组中的最大值和最小值
** 		例如：[1, -10, 'aa', 5] 	==> [5, -10], 会自动过滤调非数字型元素
** 3. splitArrayToEle			：将数组中的数组元素原地拆分，和原数组合并
**		例如：[1, 2, [11, 22]] 		==> [1, 2, 11, 22]
** 4. sumAllBetweenMinToMaxOfArray	：将数组中的最大值和最小值之间的所有数值相加，
**		例如：[1,'aa', 5] 			==> 1 + 2 + 3 + 4 + 5 => RES: 15
** 5. delEleFromArray			: 从数组中删除指定元素(或替换)  
** 6. delFalseEleFromArray		: 从数组中删除非真的元素，如："", "undefined", null
** 7. diffArray					: 取出两个数组中非共有部分组合成新数组返回
**		例如：arr1[1,2,3,5] - arr2[1,2,3,4]		==> [5,4]
** 8. findAllRightEleFromObjArray 	: 从对象数组中找出包含目标对象的所有元素
** 		例如：([{a:1, b:2},{a:1,c:3},{a:1,b:2,c:3}], {a:1,b:2}) ==> [{a:1,b:2}, {a:1,b:2,c:3}]
*****************************************************************************/
function ArrayHandler( ) {	
	// TODO
}

/**
 * 1. 判断数组中是否存在数组类型的元素
 * @param  {[type]}  __arr [description]
 * @return {Boolean}       [true: 存在数组类型元素，false：不存在数组型元素]
 */
ArrayHandler.prototype.hasArray = function ( __arr ) {

	if ( errorHandler.argumentErrorHandler(__arr) ) return;

	for (var i = 0; i < __arr.length; i++ ) {
		if ( tools.isArrayObj(__arr[i]) ) return true;
	}

	return false;
};

/**
 * 2. 获取数组中的最大值和最小值, 跳过非数字型元素
 * @param  {[type]} __arr [description]
 * @return {[type]}       [返回包含两个元素的数组，第一个为最大值，第二个为最小值]
 */
ArrayHandler.prototype.getMaxAndMinFromArray = function ( __arr ) {
	// 参数错误
	if ( errorHandler.argumentErrorHandler(__arr) ) return;

	var max = __arr[0],
		min = __arr[0];

	__arr.forEach( function(element, index) {

		// 是数字的情况下才去找，同时可以过滤非数字型的元素
		if ( !isNaN(element) ) {
			element = parseInt(element);
			max = element > max ? element : max;
			min = element < min ? element : min;
		}
	});

	return [max, min];
};
/**
 * 3. 将数组中元素为数组的元素拆分出来与原数组合并
 * @param  {[type]} __arr [description]
 * @return {[type]}       [返回拆分合并后的数组，最后的数组中不包含数组类型元素]
 */
ArrayHandler.prototype.splitArrayToEleInArray = function ( __arr ) {
	// 参数错误
	if ( errorHandler.argumentErrorHandler(__arr) ) return;

	var oneDimenArr 	= [];

	// 遍历数组，递归合并数组
	__arr.forEach( function(element, index) {
		if ( tools.isArrayObj(element) ) { // 元素为数组
			oneDimenArr = oneDimenArr.concat( element ); // 如果是数组，直接合并
		} else if ( tools.isObject(element) ) {
			// 如果是对象就跳过
		} else {
			oneDimenArr.push( element );
		}
	});
	// 数组中有元素为数组，递归继续执行合并操作，否则直接返回当前处理后的数组oneDimenArr
	return this.hasArray( oneDimenArr ) ? this.splitArrayToEleInArray( oneDimenArr ) : oneDimenArr;
};

/**
 * 4. 数组中最大值和最小值之间的所有数的和
 * 传入的合法参数的几种情况
 * 1) 数组只有一个数字型元素，直接返回该元素
 * 2) 数组有两个数字型元素，比较取最大值和最小值，创建数组将其之间的值相加
 * 3) 数组超过两个数字型元素，找出最大和最小值，进行第二步
 * 4) 其他情况，即数组中可能有非数字型的元素(如：对象，字符串等待)，需要过滤
 * @param  {[type]} __arr [description]
 * @return {[type]}       [返回数组中最小值与最大值之间所有数值的和]
 */
ArrayHandler.prototype.sumAllBetweenMinToMaxOfArray = function ( __arr ) {

	var arr 			= __arr,
		maxAndMinArr 	= [],
		targetArr		= [],
		tmpArr 			= null;

	// 参数错误
	if ( errorHandler.argumentErrorHandler(__arr) ) return;

	// 1. 只有一个元素，且元素是数值，直接返回该值
	if ( arr.length == 1 && !isNaN(arr[0]) ) return arr[0]; 

	// 2. 如果只有两个元素，且两个元素的值相同，直接返回该值
	if ( arr.length == 2 && arr[0] == arr[2] ) return arr[0] + arr[1];

	// 3. 取出数组中最大值和最小值
	tmpArr 		 = this.splitArrayToEleInArray( arr ); // 取出的数组中只包含普通元素，不包含数组
	maxAndMinArr = this.getMaxAndMinFromArray( tmpArr );

	var max = maxAndMinArr[0],
		min = maxAndMinArr[1];
	// 把min -> max之间的数及其自身保存到数组中
	for ( var i = min; i < max + 1; i++ ) {
		targetArr.push(i);
	}
	// 遍历数组
	// reduce的使用：
	// arr.reduce(callback[, initValue]);
	// callback: function(preV, curV, curIdx, array){}
	// preV: 如果与数组中的第一个值相同，则作为第一个值，会影响curV的值和索引
	// 		 如果与数组中第一个值不相同，则作为基准值，不会影响curV的值和索引，且curV的值和索引都是数组中第一个元素对应的值和索引
	// curV：如上，受preV影响
	// curIdx: 如上，为curV的值在数组中的索引值
	// array：当前数组
	var total = targetArr.reduce(function (preV, curV, curIdx, array) {
		return preV + curV;
	}, 0);

	return total;
};

/**
 * 5. 删除数组中存在的指定元素，不存在不处理，如果第三个参数存在则用第三个参数去填充
 * @param  {Array} targetArr      目标数组
 * @param  {Array/Element} element        被删除的元素
 * @param  {Array/Element} replaceElement 将要替换的元素
 * @return {[Boolean]}                true: 删除成功，false: 删除失败
 * 
 * 	1. 只有第一个参数，直接清空数组
 * 	2. 找到指定元素，删除，若有第三个参数，则进行替换
 * 	3. 如果element为数组，需要遍历查找后逐个删除【TODO】
 * 	4. 如果replaceElement为数组，同上【TODO】
 * 
 * PS: 可以扩展成数组对象的方法，直接通过点语法调用，并return this;达到链式操作目的
 */
ArrayHandler.prototype.delEleFromArray = function ( targetArr, element, replaceElement ) {
		
	// illegal arguments
	if ( !targetArr || !element || element == "undefined" ) return false;

	var argLen = arguments.length;

	// only one argument, empty array
	if ( argLen == 1 ) targetArr.splice(0, targetArr.length);

	var delLen 	=  element instanceof Array ? element.length : 1,
		index 	= targetArr.indexOf(element);

	// not contain element
	if ( index == -1 ) return false;

	// delete element from array
	// or replace
	replaceElement 	? targetArr.splice(index, delLen, replaceElement)
					: targetArr.splice(index, delLen);

	return true;
};

/**
 * 6. 删除数组中的非真元素：'undefined', '', null等。
 * @param  {[type]} targetArr [description]
 * @return {[type]}           [description]
 */
ArrayHandler.prototype.delFalseEleFromArray = function ( targetArr ) {
	// 参数检查，错误处理
	if ( errorHandler.argumentErrorHandler( targetArr ) ) return;

	targetArr.map(function(value, index) {
		if ( !value || value == "undefined" || value == "" || value === undefined || value === false ) {
			targetArr.splice(index, 1);
		}
	});
};

/**
 * 7. 获取两个数组中非共有部分
 * @param  {[type]} arr1 [description]
 * @param  {[type]} arr2 [description]
 * @return {[Array]}      返回两个数组中非共有部分组成的新数组
 */
ArrayHandler.prototype.diffArray = function (arr1, arr2) {

	if ( !arr1 || !arr2 ) return;

	// 过滤arr1中共有部分
	var arr1Diff = arr1.filter(function(value){
		return  arr2.indexOf(value) == -1;
	});

	// 过滤arr2中共有部分
	var arr2Diff = arr2.filter(function(value){
		return  arr1.indexOf(value) == -1;
	});

	// 连接两个非共有数组
	return arr1Diff.concat(arr2Diff);
};

/**
 * 8. 从对象数组中找出包含source中所有键值对的对象，组成新数组返回	
 * @param  {[type]} collection [源对象数组]
 * @param  {[type]} source     [目标对象]
 * @return {[type]}            [源对象数组中完整包含目标对象的对象元素组成的新对象数组]
 */
ArrayHandler.prototype.findAllRightEleFromObjArray = function (collection, source) {

	var rightObjArr = [],
		has = true;

	// get all keys of source
	var srcKeys 	= Object.keys(source);

	collection.map(function (obj, index) {
		srcKeys.map(function(keyV){
			if ( obj.hasOwnProperty(keyV) ) { // has
				// 判断值是否相同，如果不同记录为false
				if ( obj[keyV] != source[keyV] ) has = false;
			} else {
				// 到这里，表示该属性不存在
				has = false;
			}
		});	

		// 只要has为false，表示至少有一个source中的键值对不被包含在collection的对象中
		// 则不符合条件，不添加到最后的符合要求的结果中
		if ( has ) rightObjArr.push(obj);

		// 重置判断标识
		has = true;
	});
 
 	// 返回符合条件的对象数组
  	return rightObjArr;
};


/**************************************************************************** 
** 错误处理对象(函数名以"ErrorHandler"结束)
** 1. argumentErrorHandler 	: 参数不合法，参数错误处理，给出相应的提示
*****************************************************************************/
function ErrorHandler( ) {

	// TODO
}
 
 		
/**
 * 1. 参数判断，错误返回
 * 	__type: [TODO]
 * 	 == 0 : 数值   	ERROR_TYPE_ILLEGAL_NUMBER
 * 	 == 1 : 字符串	ERROR_TYPE_ILLEGAL_STRING
 * 	 == 2 : 数组 	ERROR_TYPE_ILLEGAL_ARRAY
 * 	 == 3 : 对象 	ERROR_TYPE_ILLEGAL_OBJECT
 */
ErrorHandler.prototype.argumentErrorHandler = function ( __args, __type ) {

	switch ( __type ) {
		case 0: 	// number
		case "ERROR_TYPE_ILLEGAL_NUMBER":
			break;
		case 1: 	// string
		case "ERROR_TYPE_ILLEGAL_STRING":
			break;
		case 2: 	// array
		case "ERROR_TYPE_ILLEGAL_ARRAY":
			if ( !isArrayObj(__args) || !__args || __args.length <= 0 ) {
				console.log("ERROR: not array or empty array, please check your arguments... !");
				return true;
			}
			break;
		case 3: 	// object
		case "ERROR_TYPE_ILLEGAL_OBJECT":
			break;
		case 4: 	// others
			break;
		default:
			
			break;
	}

	return false;
};



/**************************************************************************** 
** 工具对象(原子函数，尽量不依赖其他函数)
** 1. isArrayObj 	: 是否为数组类型
** 2. isObject 		: 是否为对象
*****************************************************************************/
function Tools( ) {
	
}

// 1. 判断参数是否为数组
Tools.prototype.isArrayObj = function ( __value ) {
	return (__value instanceof Array);
};

// 2. 判断是否为对象型数据
Tools.prototype.isObject = function( __value ) {
	return (__value instanceof Object);
};



/**************************************************************************** 
** 测试对象(函数名以:'test'开头)
** 1. testExecuteTime 	: 测试一段代码执行的时间
*****************************************************************************/
function Test() {
	// TODO
}

// 1. 测试代码执行时间
Test.prototype.testExecuteTime = function ( __arr ) {
	var time = (new Date()).getTime(),
		arr = arrayHandler.splitArrayToEleInArray( __arr ),
		now = (new Date()).getTime();
	console.log( arr );	
	console.log( now - time );
};

















/***************************************************************************
****																	****
****						MY CODE END 								****	
****																	****
****************************************************************************/