/**
 * My Codes include my personal functions or apis
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-07-15 15:44:45
 * @version 1.0.1 create
 *
 *	############# 该文件下所有对象和方法 #############	 
 *  1. NumberHandler
 *  	1) 
 *  2. StringHandler
 *  3. ArrayHandler
 *  4. ErrorHandler
 *  5. Tools
 *  6. GCLTest
 *
 *
 *
 *
 *
 * 
 */


/****************************全局变量***************************************/

// 所有对象集合
var mycode = (function () {

	return {
		"numberHandler"	: new NumberHandler(),
		"stringHandler"	: new StringHandler(),
		"arrayHandler"	: new ArrayHandler(),
		"errorHandler"	: new ErrorHandler(),
		"tools"			: new Tools(),
		"gclTest"		: new GCLTest()
	};
})();

// 对象别名，也可以根据个人情况，在引入该文件之后，自己定义对象变量名
var numberHandler 	= mycode.numberHandler,
	stringHandler 	= mycode.stringHandler,
	arrayHandler 	= mycode.arrayHandler,
	errorHandler 	= mycode.errorHandler,
	tools 			= mycode.tools,
	gclTest 		= mycode.gclTest;

/**************************************************************************** 
** 数字处理对象：numberHandler (方法名以"Number"结束)
** 1. convertToRomanNumber 		：将阿拉伯数字转成罗马数字字符串表示形式
** 		例如：3425 ==> "MMMCDXXV"
** 2. sumOddFibonacciNumber		：将所有的小于指定参数值的fibonacci数值相加
** 3. sumPrimeNumber 			：将参数num范围内的所有质数相加
** 4. smallestCommonMultiNumber ：获取数组中两个数的最小公倍数
** 5. smallestCommonsMultiOfAllNumber ：数组中两个数之间的所有数值的最小公倍数
*****************************************************************************/
function NumberHandler() {
	// 
}

/**
* 1. 将1 - 3999数字转成罗马数字表示形式，如：
* @param  {[type]} num [description]
* @return {[type]}     [description]
*/
NumberHandler.prototype.convertToRomanNumber = function (number) {
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

/**
 * 2. 得到小于number的所有斐波那契数的和	
 * @param  {[Number]} number [指定需要相加的fibonacci的最大值]
 * @return {[Number]}        [返回小于number的所有fibonacci值的和]
 *
 * 实现递归有三种方式，经过测试用循环去处理的效率最高
 * 		a) 直接递归法	最差，且容易引起内存泄漏，慎用
 * 		b) 闭包			其次，能很好的体现js闭包用法，推荐
 * 		c) for循环  	效率最高，简单粗暴直观
 *
 *  PS：1. 这里实现所有fibonacci奇数值的和用的是for循环，闭包方式还没思考
 *  	出更优化的方案[TODO]
 *  	2. 如果想要把所有的偶数fibonacci数相加，只要把push操作的条件修改成
 *  	z % 2 == 0即可，或者去掉计算所有值的和
 */
NumberHandler.prototype.sumOddFibonacciNumber = function (number) {

	// 要求传入的参数为合法的数值类型
	if (isNaN(number) || number < 0) return;

	var total = [0, 1];  // 保存计算出的fibonacci数

	if (number == 0 || number == 1) {
		return 1;
	} else {
		var x = 0; 	// 保存第一个值
		var y = 1; 	// 保存第二个值
		var z = 1; 	// 保存第一个和第二个值的和
		for (var i = 1; i <= number; i++) {

			if (z > number) break;
			console.log("total = " + total + ", z = " + z);

			// 过滤调第一个z的值，防止把它的初始值保存进去了
			if (i > 1 && (z % 2 != 0)) {
				total.push(z);
			}

			// 值替换和累加操作
			z = y + x;
			y = x;
			x = z;
		}

		// 上述操作结束后，total就保存了小于number的所有fibonacci数值
		// 然后将他们全部相加，得到我们想要的值
		return total.reduce(function(preV, currV, currIndex, array){
			return preV + currV;
		});
	}
};

/**
 * 3. 将参数num范围内的所有质数相加
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
NumberHandler.prototype.sumPrimeNumber = function (num) {

	if (isNaN(num) || num <= 1) return;

	var total = 0;

	for (var i = 2; i <= num; i++) {
		if (tools.isPrime(i)) {
			total += i;
		}
	}

	return total;
}

/**
 * 4. 获取数组中两个数的最小公倍数
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
NumberHandler.prototype.smallestCommonMultiNumber = function (arr) {

	// 将数组中的值按从小到大顺序排
	tools.switchValue(arr);

	var min = arr[0];
	var max = arr[1];

	for (var i = 1; i <= max; i++) {
		if (max % i === 0) { // 能整除，找到最大值约数
			tmp = i * min;
			if (tmp % max === 0) {
				// 找到最小公倍数
				return tmp;
			}
		}
	}

	// 到这里表示没找大公约数，直接返回两个值的积
	return max * min;
}

/**
 * 5. 数组中两个数之间的所有数值的最小公倍数
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 *
 * 缺点：1.进行了多次遍历，效率非常低，需要改进
 * 			a) 把自身和中间的值加入数组，进行了一次遍历
 * 			b) 对数组用了reduce遍历了一次
 * 			c) 然后在reduce里面又对每个值又遍历了一次
 */
NumberHandler.prototype.smallestCommonsMultiOfAllNumber = function (arr) {
  
  	// 限定参数必须是包含两个元素的数组
	if (!arr || !(arr instanceof(Array)) || arr.length != 2) return;

	// 将数组中的值按从小到大顺序排
	tools.switchValue(arr);

	var min = arr[0];
	var max = arr[1];
	var between = [];
	for (var i = min; i <= max; i++) {
		between.push(i);
	}

	return between.reduce(function(preV, currV, currIndex, array){
		return this.smallestCommonMultiNumber([preV, currV]);
	}, 1);
}

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
** 9. uniteUniqueFromArray 		: 从传入的数组中去掉重复的，然后组合成新数组返回
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

	// return true;
	return targetArr;
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


/**
 * 9. 传入 n 个数组，将数组中重复的元素去掉，然后组合成新的数组返回
 * @param  {Array} arr 	可以是多个参数[或者将参数放到数组里面传入，考虑到严格模式下不能使用arguments]
 * @return {[Array]}   	返回去重之后的新数组
 *
 * 缺陷：
 * 		1. 只能处理原子数组[TODO]
 * 		2. 严格模式下，arguments不能使用，需要求传入的实参和形参相对应
 */
ArrayHandler.prototype.uniteUniqueFromArray = function (arr) {

	var args 	= arguments,
		argsNum = arguments.length,
		argsArr = [],
		argsTmp = null;

	// 将所有参数保存到数组中，便于处理
	for (var i = 0; i < argsNum; i++) {
		argsTmp = args[i];
		if ( !(argsTmp instanceof(Array)) ) {
			return "Please confirm your every arguments is array";  // 即：参数中有一个非数组，则直接退出
		}
		argsArr.push(argsTmp);
	}

	// 处理合并数组
	argsArr.reduce(function(preV, currV, currIndex, array){
		if (preV instanceof(Array)) {
			// 保存参考值
			argsTmp = preV;
			
			// 前值和当前值对比
			preV.map(function(value, index){
				if (currV instanceof(Array)) {
					// 查找并删除当前数组中的前一数组中存在的元素
					var idx = currV.indexOf(value);
					if (idx != -1) { 
						currV.splice(idx, 1);
					}
				}
			});

			// 经过上面之后，当前数组元素中包含前一个数组元素中存在的元素就被删除了
			// 然后再将两者合并
			argsTmp = argsTmp.concat(currV);
		}

		// 然后将合并之后的数组作为reduce的返回值，进入下个循环对比
		return argsTmp;
	});

	return argsTmp;
}


/**************************************************************************** 
** 字符串处理对象(函数名以"ErrorHandler"结束)
** 属性：
** 		this.dna 	: DNA配对，每个字符配一个相对应的编码数组
** --------------------------------------------------------------------------
** 1. replaceRetainFirstCaseOfString 	: 替换字符串，保留被替换字符串的首字母大小写特性
** 2. translatePigLatinString			: 将字符串第一个字符移到最后，然后加上"ay"
** 3. pairDNAString 					: DNA配对，根据dna配对编码数据进行配对
** 4. findVacantCharsFromString			: 找出字符串中不连续的空缺字符
*****************************************************************************/
function StringHandler( ) {

}

// DNA配对
StringHandler.prototype.dna = {
	"A": ["A", "T"],
	"T": ["T", "A"],
	"C": ["C", "G"],
	"G": ["G", "C"]	
};

/**
 * 1. 用于替换字符串，从longStr字符串中查找出word，找到了就用replaceWord替换掉word，
 * 并且要求replaceWord的首字母大小写要和word的首字母大小写一致
 * @param  {String} longStr     一段长字符串
 * @param  {String} word        单词，它应该存在与longStr中
 * @param  {String} replaceWord 将要替换word的单词
 * @return {String}             返回经过替换之后的长字符串
 */
StringHandler.prototype.replaceString = function ( longStr, word, replaceWord ) {
  
    var targetArr = longStr.split(" ");
  
	// illegal arguments
	if ( !targetArr || !word || word == "undefined" ) return;

	var argLen = arguments.length;

	// only one argument, empty array
	if ( argLen == 1 ) return targetArr.splice(0, targetArr.length);

	var delLen 	= word instanceof Array ? word.length : 1,
		index 	= targetArr.indexOf(word);

	// not contain word, return original string
	if ( index == -1 ) return longStr;

	var tmpStr 	= targetArr[index],
		tmp 	= "";

	if ( tmpStr[0] >= 'A' && tmpStr[0] <= 'Z' ) { // 大写
		tmp = replaceWord.replace(/^\S/, function(s){ return s.toUpperCase(); } );
	} else if ( tmpStr[0] >= 'a' && tmpStr[0] <= 'z' ) {  // 小写
		tmp = replaceWord.replace(/^\S/, function(s){ return s.toLowerCase(); } );
	}

	// delete word from array
	// or replace
	tmp ? targetArr.splice(index, delLen, tmp)
		: targetArr.splice(index, delLen);

	// return true;
	return targetArr.join(" ");
}

/**
 * 2. 拉丁猪字符串，即：将字符串第一个元音字符前面的所有字符移到最后，然后加上"ay"
 * 如果字符串是以元音字符开头，只需要在后面加上"way"【元音字符：a，e，i，0，u】
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
StringHandler.prototype.translatePigLatinString = function ( str ) {

	if ( !str ) return;

	// 如果字符串第一个字符就是元音字符，直接在后面追加"way"
	if ( tools.isVowel(str[0]) ) return str + "way";

	var strArr 	= str.split(""),
		preStr 	= "",
		index 	= -1;

	/**
	 * findIndex: 用来查找数组中符合callback条件的元素的索引
	 * find: 返回的是元素本身
	 */
	index = strArr.findIndex(function ( ele, index ) {
		if ( tools.isVowel(ele) ) return index;
	});

	// 取出最前面非元音字符的字符
	preStr = strArr.splice( 0, index ).join( "" );

	strArr.push( preStr );

	return strArr.join( "" ) + "ay";
}

/**
 * 3. DNA配对，根据dna配对编码数据进行配对
 * @param  {String} str 需要配对的DNA字符串
 * @return {Array}     返回已配对编码数组
 */
StringHandler.prototype.pairDNAString = function ( str ) {

	if ( !str ) return;

	return str.split("").map(function ( value, index ) {
		if ( this.dna.hasOwnProperty( value ) ) {
			return this.dna[value];
		}
	});
}


/**
 * 4. 找出字符串中不连续的空缺字符
 * 比如："abce"中间漏掉了个"d"字符串
 * @param  {String} str 目标字符串
 * @return {数组}     空缺字符组成的新数组，如果传入的字符串都是连续的则返回"undefined"
 *
 * PS：目前只支持中间空缺一个字符的情况(如："abcf"中间空缺"de"两个的还不支持)
 */
StringHandler.prototype.findVacantCharsFromString = function ( str ) {

	if ( !str ) return;

	// 1. 将字符串变成数组，用split
	// 2. 用reduce去遍历该数组
	// 3. reduce中，用上一个元素转码 + 1 和下一个比较，相等表示挨着不保存
	// 	  不相等表示中间空了字符，保存该字符（即上一个字符转码后+1）
	// 4. 把步骤3中找到的空缺字符保存到数组中，最后处理完，
	// 	  得到的数组就是字符串中空缺的字符组成的数组

	var strArr 		= str.split(""),
		resArr 		= [];

	// 使用到的原生API
	// string.charCodeAt(index) : 将字符串中索引指定位置的字符转成ASC编码
	// String.fromCharCode(num1[, num2 ...]) : 将ASC编码转成字符，
	// 	> 	支持多个同时转，返回转成功之后字符组成的字符串;
	// 	
	// 	PS: 注意编码转字符的方法，是String的类方法
	strArr.reduce(function ( preV, currV, currIndex, array ) {
		var preVCode 	= preV.charCodeAt(0),
			currVCode 	= currV.charCodeAt(0);

		if ( preVCode + 1 != currVCode ) {

			// 先从编码转成字符，保存到空缺字符数组中
			resArr.push( String.fromCharCode( preVCode + 1 ) );
		} 

		// 因为reduce的返回值即下一个preV的值
		// 所以这里将当前的值currV保存到preV
		return currV;
	});

	return resArr.length > 0 ? resArr : "undefined";
}

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
** 3. isVowel		: 判断字符是否是元音字符[a, e, i, o, u]
** 4. isPrime		: 判断数字是否为质数
** 5. switchValue	: 交换数组中两个值的位置，从小到大排列
*****************************************************************************/
function Tools( ) {
	
}

// 1. 判断参数是否为数组
Tools.prototype.isArrayObj = function (value) {
	return (value instanceof Array);
};

// 2. 判断是否为对象型数据
Tools.prototype.isObject = function(value) {
	return (value instanceof Object);
};

// 3. 判断字符是否是元音字符
Tools.prototype.isVowel = function (char) {
	return ['a', 'e', 'i', 'o', 'u'].indexOf(char) != -1;
}

// 4. 判断数字是否为质数(只能被1和自身整除的数)
Tools.prototype.isPrime = function (num) {

	// 质数都是从2开始，所以也需要排除值为1的情况
	if (isNaN(num) || num <= 1) return;

	var yes = true;

	for (var i = 2; i < num; i++) {
		if (num % i === 0) return yes = false;
	}

	return yes;
};

// 5. 交换数组中两个值的位置，从小到大排列
Tools.prototype.switchValue = function (arr) {

	if (!arr || !(arr instanceof(Array)) || arr.length != 2) return;

	var tmp = 0;
	if (arr[0] > arr[1]) {
		tmp = arr[0];
		arr[0] = arr[1];
		arr[1] = tmp;
	}
}

/**************************************************************************** 
** 测试对象(函数名以:'test'开头)
** 1. testExecuteTime 	: 测试一段代码执行的时间
*****************************************************************************/
function GCLTest() {
	// 测试数据
	this.data = [
		// NumberHandler
		{ "funcName": "numberHandler.convertToRomanNumber", 		"testData": "" },	// 0
		{ "funcName": "numberHandler.sumOddFibonacciNumber",		"testData": "" },   // 
		{ "funcName": "numberHandler.sumPrimeNumber",				"testData": "" },   // +2
		// ArrayHandler
		{ "funcName": "arrayHandler.hasArray", 						"testData": "" },	// 1
		{ "funcName": "arrayHandler.getMaxAndMinFromArray", 		"testData": "" },	
		{ "funcName": "arrayHandler.splitArrayToEleInArray", 		"testData": "" },	
		{ "funcName": "arrayHandler.sumAllBetweenMinToMaxOfArray", 	"testData": "" },	
		{ "funcName": "arrayHandler.delEleFromArray", 				"testData": "" },	
		{ "funcName": "arrayHandler.delFalseEleFromArray", 			"testData": "" },	
		{ "funcName": "arrayHandler.diffArray", 					"testData": "" },	
		{ "funcName": "arrayHandler.findAllRightEleFromObjArray", 	"testData": "" },	
		// StringHandler
		{ "funcName": "stringHandler.replaceString", 				"testData": "" },	// 2
		{ "funcName": "stringHandlertranslatePigLatinString", 		"testData": "" },	
		{ "funcName": "stringHandlerpairDNAString", 				"testData": "" },	
		{ "funcName": "stringHandlerfindVacantCharsFromString", 	"testData": "" },	
		// ErrorHandler
		{ "funcName": "errorHandler.argumentErrorHandler", 			"testData": "" },	// 3
		// Tools
		{ "funcName": "tools.isArrayObj", 							"testData": "" },	// 4
		{ "funcName": "tools.isObject", 							"testData": "" },	
		{ "funcName": "tools.isVowel", 								"testData": "" },	
	];
}

// 1. 测试代码执行时间
GCLTest.prototype.testExecuteTime = function ( __arr ) {
	var time = (new Date()).getTime(),
		arr = arrayHandler.splitArrayToEleInArray( __arr ),
		now = (new Date()).getTime();
	console.log( arr );	
	console.log( now - time );
};

// 2. 测试该文件中所有对象的方法
// 		funcName: 要测试的方法名，字符串格式；
// 		testData: 要测试的方法，需要传入的参数，字符串形式；
// 		比如：要测试 hasArray，则：gclTest.testFuncResult(this.data[1]['funcName'], "[1, 2, 3, 'a', ['b', 'c']]");
GCLTest.prototype.testFuncResult = function (funcName, testData) {
	if (!funcName || !testData) return;

	return eval(funcName + '(' + testData + ');');
}


/**************************************************************************** 
** 对JavaScript原生API的扩展
** 1. String对象
** 		s1. firstUpperCase 	:  字符串首字母大写 
*****************************************************************************/

// s1. 字符串首字母大写 
String.prototype.firstUpperCase = function( ) {
    return this.replace(/^\S/, function(s){ return s.toUpperCase(); } );
} 












/***************************************************************************
****																	****
****						MY CODE END 								****	
****																	****
****************************************************************************/