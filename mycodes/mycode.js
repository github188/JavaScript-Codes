/**
 * My Codes include my personal functions or apis
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-07-15 15:44:45
 * @version 1.0.1 create
 */


/**************************************************************************** 
** 数组处理函数(函数名以"Array"结束)
** 1. hasArray					：判断数组中的元素是否存在类型为数组的元素
** 2. getMaxAndMinFromArray 	: 获取数组中的最大值和最小值
** 		例如：[1, -10, 'aa', 5] 	==> [5, -10], 会自动过滤调非数字型元素
** 3. splitArrayToEle			：将数组中的数组元素原地拆分，和原数组合并
**		例如：[1, 2, [11, 22]] 		==> [1, 2, 11, 22]
** 4. sumAllBetweenMinToMaxOfArray	：将数组中的最大值和最小值之间的所有数值相加，
**		例如：[1,'aa', 5] 			==> 1 + 2 + 3 + 4 + 5 => RES: 15
** 5. delEleFromArray			: 从数组中删除指定元素(或替换)  
*****************************************************************************/

/**
 * 1. 判断数组中是否存在数组类型的元素
 * @param  {[type]}  __arr [description]
 * @return {Boolean}       [true: 存在数组类型元素，false：不存在数组型元素]
 */
function hasArray( __arr ) {

	if ( argumentErrorHandler(__arr) ) return;

	for (var i = 0; i < __arr.length; i++ ) {
		if ( isArrayObj(__arr[i]) ) return true;
	}

	return false;
}

/**
 * 2. 获取数组中的最大值和最小值, 跳过非数字型元素
 * @param  {[type]} __arr [description]
 * @return {[type]}       [返回包含两个元素的数组，第一个为最大值，第二个为最小值]
 */
function getMaxAndMinFromArray( __arr ) {

	// 参数错误
	if ( argumentErrorHandler(__arr) ) return;

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
}

/**
 * 3. 将数组中元素为数组的元素拆分出来与原数组合并
 * @param  {[type]} __arr [description]
 * @return {[type]}       [返回拆分合并后的数组，最后的数组中不包含数组类型元素]
 */
function splitArrayToEleInArray( __arr ) {
	// 参数错误
	if ( argumentErrorHandler(__arr) ) return;

	var oneDimenArr 	= [];

	// 遍历数组，递归合并数组
	__arr.forEach( function(element, index) {
		if ( isArrayObj(element) ) { // 元素为数组
			oneDimenArr = oneDimenArr.concat( element ); // 如果是数组，直接合并
		} else if ( isObject(element) ) {
			// 如果是对象就跳过
		} else {
			oneDimenArr.push( element );
		}
	});

	// 数组中有元素为数组，递归继续执行合并操作，否则直接返回当前处理后的数组oneDimenArr
	return hasArray( oneDimenArr ) ? splitArrayToEle( oneDimenArr ) : oneDimenArr;
}

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
function sumAllBetweenMinToMaxOfArray( __arr ) {

	var arr 			= __arr,
		maxAndMinArr 	= [],
		targetArr		= [],
		tmpArr 			= null;

	// 参数错误
	if ( argumentErrorHandler(__arr) ) return;

	// 1. 只有一个元素，且元素是数值，直接返回该值
	if ( arr.length == 1 && !isNaN(arr[0]) ) return arr[0]; 

	// 2. 如果只有两个元素，且两个元素的值相同，直接返回该值
	if ( arr.length == 2 && arr[0] == arr[2] ) return arr[0] + arr[1];

	// 3. 取出数组中最大值和最小值
	tmpArr 		 = splitArrayToEleInArray( arr ); // 取出的数组中只包含普通元素，不包含数组
	maxAndMinArr = getMaxAndMinFromArray( tmpArr );

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
}

/**
 * 删除数组中存在的指定元素，不存在不处理，如果第三个参数存在则用第三个参数去填充
 * @param  {Array} targetArr      目标数组
 * @param  {Array/Element} element        被删除的元素
 * @param  {Array/Element} replaceElement 将要替换的元素
 * @return {[type]}                [description]
 * 
 * 	1. 只有第一个参数，直接清空数组
 * 	2. 找到指定元素，删除，若有第三个参数，则进行替换
 * 	3. 如果element为数组，需要遍历查找后逐个删除【TODO】
 * 	4. 如果replaceElement为数组，同上【TODO】
 * 
 * PS: 可以扩展成数组对象的方法，直接通过点语法调用，并return this;达到链式操作目的
 */
function delEleFromArray( targetArr, element, replaceElement ) {
	
	// illegal arguments
	if ( !targetArr || !element || element == "undefined" ) return;

	var argLen = arguments.length;

	// only one argument, empty array
	if ( argLen == 1 ) targetArr.splice(0, targetArr.length);

	var delLen 	=  element instanceof Array ? element.length : 1,
		index 	= targetArr.indexOf(element);

	// not contain element
	if ( index == -1 ) return;

	// delete element from array
	// or replace
	replaceElement 	? targetArr.splice(index, delLen, replaceElement)
					: targetArr.splice(index, delLen);
}



/**************************************************************************** 
** 错误处理函数(函数名以"ErrorHandler"结束)
** 1. argumentErrorHandler 	: 参数不合法，参数错误处理，给出相应的提示
*****************************************************************************/

// 1. 参数判断，错误返回
// __type: [TODO]
// 		== 0 : 数值
// 		== 1 : 字符串
// 		== 2 : 数组
// 		== 3 : 对象
function argumentErrorHandler( __args, __type ) {
	if ( !isArrayObj(__args) || !__args || __args.length <= 0 ) {
		console.log("ERROR: not array or empty array, please check your arguments... !");
		return true;
	}

	return false;
}


/**************************************************************************** 
** 工具函数(原子函数，尽量不依赖其他函数)
** 1. isArrayObj 	: 是否为数组类型
** 2. isObject 		: 是否为对象
*****************************************************************************/

// 1. 判断参数是否为数组
function isArrayObj( __value ) {
	return (__value instanceof Array);
}

// 2. 判断是否为对象型数据
function isObject( __value ) {
	return (__value instanceof Object);
}

/**************************************************************************** 
** 测试函数(函数名以:'test'开头)
** 1. testExecuteTime 	: 测试一段代码执行的时间
*****************************************************************************/
// 1. 测试代码执行时间
function testExecuteTime( __arr ) {
	var time = (new Date()).getTime(),
		arr = splitArrayToEle( __arr ),
		now = (new Date()).getTime();
	console.log( arr );	
	console.log( now - time );
}
