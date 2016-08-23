/**
 * My Codes include my personal functions or apis
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-07-15 15:44:45
 * @version 1.0.1 create
 *
 *  ############# 该文件下所有对象和方法 #############  
 *  1. NumberHandler
 *  2. StringHandler
 *  3. ArrayHandler
 *  4. ErrorHandler
 *  5. Tools
 *  6. GCLTest
 *
 *  >> 2016/8/15 17:41:05
 *  ADD: checkCashRegister      : 模拟收银抽屉
 *  ADD: updateInventory        : 更新库存，即用新数组数据更新老数组数据
 *   
 *  >> 2016/8/16 17:39:26 
 *  ADD: getPermutation         : 获取字符串的所有排列家结果
 *
 * >> 2016/8/23 16:34:36
 *
 * ADD: Date对象扩展
 *
 * 
 */


/****************************全局变量***************************************/

// 所有对象集合
var mycode = (function () {

    return {
        "numberHandler" : new NumberHandler(),
        "stringHandler" : new StringHandler(),
        "arrayHandler"  : new ArrayHandler(),
        "errorHandler"  : new ErrorHandler(),
        "tools"         : new Tools(),
        "gclTest"       : new GCLTest(),
        "gclRegex"      : new GCLRegex()
    };
})();

// 对象别名，也可以根据个人情况，在引入该文件之后，自己定义对象变量名
var numberHandler   = mycode.numberHandler,
    stringHandler   = mycode.stringHandler,
    arrayHandler    = mycode.arrayHandler,
    errorHandler    = mycode.errorHandler,
    tools           = mycode.tools,
    gclTest         = mycode.gclTest;
    gclRegex        = mycode.gclRegex;

/**************************************************************************** 
** 数字处理对象：numberHandler (方法名一般都以"Number"结束)
** 1. convertToRomanNumber      ：将阿拉伯数字转成罗马数字字符串表示形式
**      例如：3425 ==> "MMMCDXXV"
** 2. sumOddFibonacciNumber     ：将所有的小于指定参数值的fibonacci数值相加
** 3. sumPrimeNumber            ：将参数num范围内的所有质数相加
** 4. smallestCommonMultiNumber ：获取数组中两个数的最小公倍数
** 5. smallestCommonsMultiOfAllNumber ：数组中两个数之间的所有数值的最小公倍数
** 6. decimalToOther            ：十进制转换成指定进制的类型，返回的是其他格式的字符串形式
** 7. otherToDecimal            ：其他进制转成10进制
** 8. prefixHandler             ：各种进制的前缀处理, 前提是将进制字符串转成数组即第一个参数
** 9. checkCashRegister         ：模拟收银抽屉，给出购买的物品价格及所付金额，算出找零
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

    var thousand    = parseInt(number / 1000),              // 千位数
        hundred     = parseInt(number % 1000 / 100),        // 百位数
        ten         = parseInt(number % 1000 % 100 / 10),   // 十位数
        single      = parseInt(number % 1000 % 100 % 10);   // 个位数

    console.log("thousand = " + thousand + ", hundred = " + hundred + ", ten = " + ten, ", single = " + single);

    if ( thousand > 0 ) romaStr += ["M", "MM", "MMM"][thousand - 1];
    if ( hundred > 0 )  romaStr += ["C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"][hundred - 1];
    if ( ten > 0 )      romaStr += ["X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"][ten - 1];
    if ( single > 0 )   romaStr += ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][single - 1];

    return romaStr;
};

/**
 * 2. 得到小于number的所有斐波那契数的和  
 * @param  {[Number]} number [指定需要相加的fibonacci的最大值]
 * @return {[Number]}        [返回小于number的所有fibonacci值的和]
 *
 * 实现递归有三种方式，经过测试用循环去处理的效率最高
 *      a) 直接递归法    最差，且容易引起内存泄漏，慎用
 *      b) 闭包           其次，能很好的体现js闭包用法，推荐
 *      c) for循环    效率最高，简单粗暴直观
 *
 *  PS：1. 这里实现所有fibonacci奇数值的和用的是for循环，闭包方式还没思考
 *      出更优化的方案[TODO]
 *      2. 如果想要把所有的偶数fibonacci数相加，只要把push操作的条件修改成
 *      z % 2 == 0即可，或者去掉计算所有值的和
 */
NumberHandler.prototype.sumOddFibonacciNumber = function (number) {

    // 要求传入的参数为合法的数值类型
    if (isNaN(number) || number < 0) return;

    var total = [0, 1];  // 保存计算出的fibonacci数

    if (number == 0 || number == 1) {
        return 1;
    } else {
        var x = 0;  // 保存第一个值
        var y = 1;  // 保存第二个值
        var z = 1;  // 保存第一个和第二个值的和
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
 *          a) 把自身和中间的值加入数组，进行了一次遍历
 *          b) 对数组用了reduce遍历了一次
 *          c) 然后在reduce里面又对每个值又遍历了一次
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

/**
 * 6. 十进制转换成指定进制的类型，返回的是其他格式的字符串形式
 * @param  {[type]} number [description]
 * @param  {[Number]} type   数字类型，表示number被转换成什么进制(比如：2,8,16进制)
 * @return {[String]}        除10进制是返回数字之外，其他均返回转换之后的字符表示形式
 */
NumberHandler.prototype.decimalToOther = function (number, type) {
    
    // 保证参数都是数字
    // type一般取值：2, 8, 10, 16
    if (isNaN(number) || isNaN(type) || number < 0) return;

    if (type === 10) return number;

    var hexAlpha = ['A', 'B', 'C', 'D', 'E', 'F'];

    
    var bitArr = [];    // 存储计算得到的每一位上的数
    var rema = 0;       // 保存余数
    var prefix = "";    // 每种进制的前缀，如：16进制的"0x", 8进制的'0'等

    while (number !== 0) {
        // 取余数保存，用来组合成最后进制字符串
        rema = number % type;
        // 当type == 16时，需要处理10-15到ABCDEF的转换
        if (type === 16 && rema > 9 && rema < 16) {
            rema = hexAlpha[rema - 10];
        }  
        bitArr.unshift(rema);

        // 取除数，进行下一个循环
        number = Math.floor(number / type);
    }

    // 添加前缀
    this.prefixHandler(bitArr, type, 1);

    return bitArr.join("");
}

/**
 * 7. 其他进制转成10进制
 * @param  {[Number/String]} numberStr 如果是数值直接返回该值，字符串则往下处理转成10进制数
 * @param  {[Number]} type      十进制数值，表示第一个参数的类型
 * @return {[Number]}           返回十进制数值
 */
NumberHandler.prototype.otherToDecimal = function (numberStr, type) {
    
    // 如果是十进制就直接返回
    if (type === 10 && !isNaN(numberStr)) return numberStr;

    // 保证除十进制外传进来的都是其他进制的字符串形式
    if (typeof numberStr != "string") return;

    // 将numberStr变成数组
    var bitArr = numberStr.split("");
    var hexAlpha = ['A', 'B', 'C', 'D', 'E', 'F'];
    var alphaIdx = 0;

    // 去掉前缀
    this.prefixHandler(bitArr, type, 2);

    // 16进制转换成数字
    if (type === 16) {
        bitArr.map(function (value, index) {
            alphaIdx = hexAlpha.indexOf(value);
            if (alphaIdx != -1) {
                // 用数字去替换字母
                bitArr.splice(index, 1, 10 + alphaIdx);
            }
        });
    }

    var len = bitArr.length;
    return bitArr.reduce(function (preV, currV, currIndex, array) {
        return preV + parseInt(currV) * Math.pow(type, len - currIndex - 1);
    }, 0);
}

/**
 * 8. 各种进制的前缀处理, 前提是将进制字符串转成数组即第一个参数
 * @param  {Array} bitArr 保存着各种进制的数值字符串用split("")分割成的数组
 * @param  {Number} type   表示进制数
 * @param  {Number} method 表示操作类型，0 - 什么都不做，1 - 添加前缀，2 - 删除前缀
 * @return {[type]}        [description]
 */
NumberHandler.prototype.prefixHandler = function (bitArr, type, method) {
    // method: 0 - 什么都不做，1 - 添加，2 - 删除

    if (!bitArr || isNaN(type)) return;

    // 如果method == 0, 什么都不做
    if (method === 0) return;

    var prefix = "";
    var count = 0;

    switch (type) {
        case 2:
            if (method === 1) { 
                prefix = '0'; // 2进制前位补0
                while (bitArr.length < 8) {
                    bitArr.unshift(prefix);
                }
            }
            break;
        case 10:
            break;
        case 8: // 八进制则删除最左边的'0'
            prefix = '0';
            count = 1; // 删除一位
            break;
        case 16: // 十六进制删除'0x'
            prefix = '0x';
            count = 2; // 删除两位
            break;
        default:
            break;
    }

    // 2进制单独在switch里处理
    if (type === 2) return;

    // 1 - 添加，2 - 删除，0 - 什么都不做
    method === 1 ? bitArr.unshift(prefix)
                 : bitArr.splice(0, count);

    return bitArr;
}


/**
 * 9. 模拟收银抽屉，给出购买的物品价格及所付金额，算出找零
 * @param  {Number} price 商品价格
 * @param  {Number} cash  所付金额
 * @param  {Array} cid   剩余金额的二维数组
 * @return {Array}       返回需要找零的金额的二维数组，里面包含了找零对应的面值
 *
 * 最后一个参数cid，即面值剩余金额数组，必须要和国家钱币对应的面值金额相一致，且顺序从小到大排
 * 例如：[ 
 *         // 对应1美分（Cent）、5美分（Nickel）、10美分（Dime，一角）、25美分（Quarter）、
 *         // 1美元（ONE）、5美元（FIVE）、10美元（TEN）、20美元（TWENTY）、100美元（ONE HUNDRED）
 *         ["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], 
 *         ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]
 *       ]
 *
 * TODO：最后可以将dollar数组，当成参数传进去，与cid数组的内容顺序要一致，分别表示钱币金额面值数，
 *     根据基数base和国家钱币面值不同，数组会不相同
 */
NumberHandler.prototype.checkCashRegister = function (price, cash, cid) {

    // 刚刚好
    if (price == cash) return "No Need Back";

    // 付款不足
    if (price > cash) return "Need More Money";

    var base        = 100;      // 金额基数
    var change      = (cash - price) * base; // 找零

    var getTotalMoney = function (arr) {
        var totalMoney = 0;
        arr.reduce(function (preV, currV, currIndex, array){
            totalMoney += base * (preV[1] + currV[1]);
            return currV;
        });

        return totalMoney;
    }

    // 余额不足，没法找了
    var remain = getTotalMoney(cid);
    
    if (remain == change) { // 零钱刚好找完了
        return "Closed";    
    } else if (remain < change) { // 没钱找了
        return "Insufficient Funds - 1";
    }

    // 分别对应，1美分-5美分-1角-25美分-1美元-5美元-10美元-20美元-100美元
    // 这里还可以进行优化，让dollar成为参数，而动态获取相应国家的金额面值
    // 比如代表中国的：[10, 50, 100, 500, 1000, 2000, 5000, 10000] -> 
    // 对应：1角-5角-1元-5元-10元-20元-50元-100元(以元为单位的基础上乘以面值基数：base这里为100)
    var dollar      = [1, 5, 10, 25, 100, 500, 1000, 2000, 10000]; // TODO
    var pay         = {};   // 保存的key：dollar中面值索引，value：要找的此面值的个数
    var currLast    = 0;    // 当前面值所剩余额
    var currMoney   = 0;    // 当前金钱面额(dollar中对应的值)
    for (var i = dollar.length - 1; i >= 0; i--) {

        // 当前面值剩余金额
        currLast = cid[i][1] * base;

        // 当前面值的金额剩余0，跳过
        if (currLast <= 0) { 
            continue;
        }

        // 当前金额面值
        currMoney = dollar[i];

        // 达到找零的面值必须满足两个条件：
        // 1. 找零必须大于当前面值
        // 2. 剩余的当前面值的钱足够的情况下
        if (change > currMoney) {
            if (change < currLast) { 
                // 找零小于当前面值剩余金额
                pay[i + ""] = parseInt(change / currMoney);
                change -= currMoney * pay[i + ""];
            } else {
                // 找零大于当前面值剩余金额，则将所有剩余金额找出
                pay[i + ""] = parseInt(currLast / currMoney);
                change -= currLast; // 就直接减去当前面值剩余所有金额
            }
        }
    }

    var res = [];
    // 组织最后需要找零的钱
    var keys = Object.keys(pay);
    var idx = 0;
    for (var j = 0; j < keys.length; j++) {

        // 需要找零的面值索引
        idx = parseInt([keys[j]]);

        // 该面值最后找出的零钱(公式：面值 * 需要找出数量 / 金钱面值基数)
        cid[idx][1] = dollar[idx] * pay[keys[j]] / base;

        console.log("-------- " + cid[idx][1]);
        res.unshift(cid[idx]);

        // total += dollar[idx] * pay[keys[j]]; // 这里计算的结果应该和最开始需要找零的金额一致
    } 

    // 找到最后，所有能找的面值加起来还不够
    // 这里与最开始不同，这里是过滤掉了所有找不开的面值
    // 比如：要找0.05元，但是目前剩余一张0.01和1元的面值，依旧判定为找不开
    // 而最开始的是所有余额加起来都不够找
    if (getTotalMoney(res) < change) {
        return "Insufficient Funds - 2";
    }

    return res;
}


/**************************************************************************** 
** 数组处理对象(函数名以"Array"结束)
** 1. hasArray                  ：判断数组中的元素是否存在类型为数组的元素
** 2. getMaxAndMinFromArray     : 获取数组中的最大值和最小值
**      例如：[1, -10, 'aa', 5]    ==> [5, -10], 会自动过滤调非数字型元素
** 3. splitArrayToEle           ：将数组中的数组元素原地拆分，和原数组合并
**      例如：[1, 2, [11, 22]]         ==> [1, 2, 11, 22]
** 4. sumAllBetweenMinToMaxOfArray  ：将数组中的最大值和最小值之间的所有数值相加，
**      例如：[1,'aa', 5]          ==> 1 + 2 + 3 + 4 + 5 => RES: 15
** 5. delEleFromArray           : 从数组中删除指定元素(或替换)  
** 6. delFalseEleFromArray      : 从数组中删除非真的元素，如："", "undefined", null
** 7. diffArray                 : 取出两个数组中非共有部分组合成新数组返回
**      例如：arr1[1,2,3,5] - arr2[1,2,3,4]        ==> [5,4]
** 8. findAllRightEleFromObjArray   : 从对象数组中找出包含目标对象的所有元素
**      例如：([{a:1, b:2},{a:1,c:3},{a:1,b:2,c:3}], {a:1,b:2}) ==> [{a:1,b:2}, {a:1,b:2,c:3}]
** 9. uniteUniqueFromArrays     : 从传入的多个数组中去掉重复的，然后组合成新数组返回
** 10. delRepeatElement         : 删除一个数组中重复的元素
** 11. updateInventory          : 更新库存，用第二个数组数据去更新第一个数组数据
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

    var oneDimenArr     = [];

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

    var arr             = __arr,
        maxAndMinArr    = [],
        targetArr       = [],
        tmpArr          = null;

    // 参数错误
    if ( errorHandler.argumentErrorHandler(__arr) ) return;

    // 1. 只有一个元素，且元素是数值，直接返回该值
    if ( arr.length == 1 && !isNaN(arr[0]) ) return arr[0]; 

    // 2. 如果只有两个元素，且两个元素的值相同，直接返回该值
    if ( arr.length == 2 && arr[0] == arr[2] ) return arr[0] + arr[1];

    // 3. 取出数组中最大值和最小值
    tmpArr       = this.splitArrayToEleInArray( arr ); // 取出的数组中只包含普通元素，不包含数组
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
    //       如果与数组中第一个值不相同，则作为基准值，不会影响curV的值和索引，且curV的值和索引都是数组中第一个元素对应的值和索引
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
 *  1. 只有第一个参数，直接清空数组
 *  2. 找到指定元素，删除，若有第三个参数，则进行替换
 *  3. 如果element为数组，需要遍历查找后逐个删除【TODO】
 *  4. 如果replaceElement为数组，同上【TODO】
 * 
 * PS: 可以扩展成数组对象的方法，直接通过点语法调用，并return this;达到链式操作目的
 */
ArrayHandler.prototype.delEleFromArray = function ( targetArr, element, replaceElement ) {
        
    // illegal arguments
    if ( !targetArr || !element || element == "undefined" ) return;

    var argLen = arguments.length;

    // only one argument, empty array
    if ( argLen == 1 ) targetArr.splice(0, targetArr.length);

    var delLen  =  element instanceof Array ? element.length : 1,
        index   = targetArr.indexOf(element);

    // not contain element
    if ( index == -1 ) return;

    // delete element from array
    // or replace
    replaceElement  ? targetArr.splice(index, delLen, replaceElement)
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

    // 连接，去重
    var arrDiff = arr1Diff.concat(arr2Diff);
    return arrDiff.reduce(function(preV, currV, currIndex, array){
        if (preV == currV) {
            arrDiff.splice(currIndex, 1);
        }

        return currV;
    });

    // 连接两个非共有数组
    // return arr1Diff.concat(arr2Diff);
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
    var srcKeys     = Object.keys(source);

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
 * @param  {Array} arr  可以是多个参数[或者将参数放到数组里面传入，考虑到严格模式下不能使用arguments]
 * @return {[Array]}    返回去重之后的新数组
 *
 * 缺陷：
 *      1. 只能处理原子数组[TODO]
 *      2. 严格模式下，arguments不能使用，需要求传入的实参和形参相对应
 */
ArrayHandler.prototype.uniteUniqueFromArray = function (arr) {

    var args    = arguments,
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

    // 删除重复之后返回
    return this.delRepeatElement(arr);
}

/**
 * 10. 去掉数组中重复元素
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
ArrayHandler.prototype.delRepeatElement = function (arr) {

    if (!arr || arr.length === 0 || arr.length === 1)  return;

    var tmpArr = [];

    arr.map(function (value) {
        if (tmpArr.indexOf(value) == -1) {
            tmpArr.push(value);
        }
    });

    return tmpArr;
};

/**
 * 11. 用第二个数组的数据去更新第一个数组数据(更新库存)
 * @param  {Array} oldArr 原始数据
 * @param  {Array} newArr 新数据
 * @return {Array}        返回更新后的老数据数组并且根据名称排序后的二维数组
 *
 * PS: 1. 两个数组都是二维数组
 *     2. 两个数组的内容要一致即元素的第一个元素为数量，第二个元素为名称，
 *         比如：oldArr = [[22, "hello"]], newArr = [[33, "hello"]];  更新后就是：[[55, "hello"]]
 */
ArrayHandler.prototype.updateInventory = function (oldArr, newArr) {

    if (!oldArr || !newArr) return;

    var compare = function (a, b) {
        var ua = a[1].toUpperCase();
        var ub = b[1].toUpperCase();

        if (ua < ub) {
            return -1;
        }

        if (ua > ub) {
            return 1;
        }

        if (ua == ub) {
            return 0;
        }
    };

    if (oldArr.length === 0) return newArr.sort(compare);

    if (newArr.length === 0) return oldArr.sort(compare);

    var findFlag = 0; // 找到存在的库存标识

    newArr.map(function (newValue) {

        oldArr.map(function (oldValue) {
            if (oldValue[1] == newValue[1]) {
                oldValue[0] += newValue[0]; // 同类产品库存数累加
                findFlag = 1;
                return;
            }
        });

        // 到这里表示没有库存，直接添加
        if (!findFlag) {
            oldArr.push(newValue);  // 新产品直接添加
        }

        // 复位库存标识
        findFlag = 0;
    });

    // 排序
    oldArr.sort(compare);

    return oldArr;
}



/**************************************************************************** 
** 字符串处理对象(函数名以"ErrorHandler"结束)
** 属性：
**      this.dna    : DNA配对，每个字符配一个相对应的编码数组
** --------------------------------------------------------------------------
** 1. replaceRetainFirstCaseOfString    : 替换字符串，保留被替换字符串的首字母大小写特性
** 2. translatePigLatinString           : 将字符串第一个字符移到最后，然后加上"ay"
** 3. pairDNAString                     : DNA配对，根据dna配对编码数据进行配对
** 4. findVacantCharsFromString         : 找出字符串中不连续的空缺字符
** 5. getPermutation                    : 获得字符串的排列结果
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

    var delLen  = word instanceof Array ? word.length : 1,
        index   = targetArr.indexOf(word);

    // not contain word, return original string
    if ( index == -1 ) return longStr;

    var tmpStr  = targetArr[index],
        tmp     = "";

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

    var strArr  = str.split(""),
        preStr  = "",
        index   = -1;

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
    //    不相等表示中间空了字符，保存该字符（即上一个字符转码后+1）
    // 4. 把步骤3中找到的空缺字符保存到数组中，最后处理完，
    //    得到的数组就是字符串中空缺的字符组成的数组

    var strArr      = str.split(""),
        resArr      = [];

    // 使用到的原生API
    // string.charCodeAt(index) : 将字符串中索引指定位置的字符转成ASC编码
    // String.fromCharCode(num1[, num2 ...]) : 将ASC编码转成字符，
    //  >   支持多个同时转，返回转成功之后字符组成的字符串;
    //  
    //  PS: 注意编码转字符的方法，是String的类方法
    strArr.reduce(function ( preV, currV, currIndex, array ) {
        var preVCode    = preV.charCodeAt(0),
            currVCode   = currV.charCodeAt(0);

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

/**
 * 5. 获得指定字符串的所有排列结果的数组
 * @return {[type]} [description]
 */
StringHandler.prototype.getPermutation = function () {

    var resArr      = [];

    return function perm(str, start) {


        var permArr     = str.split("");
        var end         = permArr.length;

        for (var j = start; j < end; j++) {

            // 交换数组中两个索引位置的值
            swap(permArr, j, start);

            // 保存交换后的字符串，如果曾经保存过则过滤掉，避免重复
            var tmpStr = permArr.join("");
            if (resArr.indexOf(tmpStr) == -1) {
                resArr.push(tmpStr);
            }

            // 重置交换起始位置，递归直到最后一位字符结束，即：start > end
            perm(tmpStr, start + 1, end);
        }

        return resArr;
    };
}();

/**************************************************************************** 
** 错误处理对象(函数名以"ErrorHandler"结束)
** 1. argumentErrorHandler  : 参数不合法，参数错误处理，给出相应的提示
*****************************************************************************/
function ErrorHandler( ) {

    // TODO
}
 
        
/**
 * 1. 参数判断，错误返回
 *  __type: [TODO]
 *   == 0 : 数值      ERROR_TYPE_ILLEGAL_NUMBER
 *   == 1 : 字符串 ERROR_TYPE_ILLEGAL_STRING
 *   == 2 : 数组  ERROR_TYPE_ILLEGAL_ARRAY
 *   == 3 : 对象  ERROR_TYPE_ILLEGAL_OBJECT
 */
ErrorHandler.prototype.argumentErrorHandler = function ( __args, __type ) {

    switch ( __type ) {
        case 0:     // number
        case "ERROR_TYPE_ILLEGAL_NUMBER":
            break;
        case 1:     // string
        case "ERROR_TYPE_ILLEGAL_STRING":
            break;
        case 2:     // array
        case "ERROR_TYPE_ILLEGAL_ARRAY":
            if ( !isArrayObj(__args) || !__args || __args.length <= 0 ) {
                console.log("ERROR: not array or empty array, please check your arguments... !");
                return true;
            }
            break;
        case 3:     // object
        case "ERROR_TYPE_ILLEGAL_OBJECT":
            break;
        case 4:     // others
            break;
        default:
            
            break;
    }

    return false;
};



/**************************************************************************** 
** 工具对象(原子函数，尽量不依赖其他函数)
** 1. isArrayObj    : 是否为数组类型
** 2. isObject      : 是否为对象
** 3. isVowel       : 判断字符是否是元音字符[a, e, i, o, u]
** 4. isPrime       : 判断数字是否为质数
** 5. switchValue   : 交换数组中两个值的位置，从小到大排列
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
** 1. testExecuteTime   : 测试一段代码执行的时间
*****************************************************************************/
function GCLTest() {
    // 测试数据
    this.data = [
        // NumberHandler 0
        { "funcName": "numberHandler.convertToRomanNumber",         "testData": "" },   // 0-0
        { "funcName": "numberHandler.sumOddFibonacciNumber",        "testData": "" },   // 
        { "funcName": "numberHandler.sumPrimeNumber",               "testData": "" },   // 0-2
        // ArrayHandler 1
        { "funcName": "arrayHandler.hasArray",                      "testData": "" },   // 1-0
        { "funcName": "arrayHandler.getMaxAndMinFromArray",         "testData": "" },   
        { "funcName": "arrayHandler.splitArrayToEleInArray",        "testData": "" },   
        { "funcName": "arrayHandler.sumAllBetweenMinToMaxOfArray",  "testData": "" },   
        { "funcName": "arrayHandler.delEleFromArray",               "testData": "" },   
        { "funcName": "arrayHandler.delFalseEleFromArray",          "testData": "" },   
        { "funcName": "arrayHandler.diffArray",                     "testData": "" },   
        { "funcName": "arrayHandler.findAllRightEleFromObjArray",   "testData": "" },   
        // StringHandler 2
        { "funcName": "stringHandler.replaceString",                "testData": "" },   // 2-0
        { "funcName": "stringHandlertranslatePigLatinString",       "testData": "" },   
        { "funcName": "stringHandlerpairDNAString",                 "testData": "" },   
        { "funcName": "stringHandlerfindVacantCharsFromString",     "testData": "" },   
        // ErrorHandler 3
        { "funcName": "errorHandler.argumentErrorHandler",          "testData": "" },   // 3-0
        // Tools        4
        { "funcName": "tools.isArrayObj",                           "testData": "" },   // 4-0
        { "funcName": "tools.isObject",                             "testData": "" },   
        { "funcName": "tools.isVowel",                              "testData": "" },   
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
//      funcName: 要测试的方法名，字符串格式；
//      testData: 要测试的方法，需要传入的参数，字符串形式；
//      比如：要测试 hasArray，则：gclTest.testFuncResult(this.data[1]['funcName'], "[1, 2, 3, 'a', ['b', 'c']]");
GCLTest.prototype.testFuncResult = function (funcName, testData) {
    if (!funcName || !testData) return;

    return eval(funcName + '(' + testData + ');');
}


/**************************************************************************** 
** 对JavaScript原生API的扩展
** 1. String对象
**      s1. firstUpperCase  :  字符串首字母大写 
*****************************************************************************/

// s1. 字符串首字母大写 
String.prototype.firstUpperCase = function () {
    return this.replace(/^\S/, function(s){ return s.toUpperCase(); } );
} 





/***************************************************************************
**  头疼的正则表达式
** 
** 1. isUSPhoneNum      : 利用正则表达式判断美国电话号码
****************************************************************************/

// 正则表达式对象
function GCLRegex() {
    // TODO
}


/**
 * 1. 检测美国电话号码合法性
 * @return {[type]} [description]
 */
GCLRegex.prototype.isUSPhoneNum = function (str) {
    if (!str || str.length < 10) return;

    /**
     * 正确格式：1：国家编码 第一个555
     *     555-555-5555
     *     (555)555-5555
     *     (555) 555-5555
     *     555 555 5555
     *     5555555555
     *     1 555 555 5555
     *     1(555)555-5555
     */
    var reg = /^\d{0,1}()/gi;
    return !!str.match(/\d{0,1}(?:\s\d{3}\s|\(\d{3}\)|\d{3}|\d{3}\-)\s{0,1}\d{3}(?:\s{0,1}|\-)\d{4}/);
};


/***************************************************************************
**  对原生的Date对象的扩展
** 
** 1. format      : 时间格式化
****************************************************************************/

/**
 * 1. 根据传入的字符串，格式化时间日期
 * @param  {[type]} dateStr [description]
 * @return {[type]}         [description]
 *
 * 格式化字符串可能格式：
 *     hh:mm:ss yyyy-MM-dd
 *     hh:mm:ss.S yy-MM-dd
 *     yyyy-MM-dd
 *     等等。
 *
 * 此方法通过灵活运用了正则表达式来达到根据传入字符串对应字段的长度来格式化时间日期
 *
 * 比如：如果传入的字符串中只有一个M，则会根据月份值做相应的变化，直接显示获取到的值；
 *       如果传入的字符串中有两个MM，则当获取到的月份小于10时，则会在开头补0，如：01-09
 *
 * 知识点：
 *     1. test()，正则表达式的查找判断方法，返回正则字符串是否在目标字符串中找到匹配项，
 *                找到则返回true，没有则返回false
 *     2. ()：正则表达式里的小括号会将匹配到的项缓存起来，可以通过RexExp.$n逐个去取查找到的匹配项
 */
Date.prototype.format = function (dateStr) {

    var o = {
        "M+": (this.getMonth() + 1),        // Month
        "d+": this.getDate(),               // Date
        // "E+": this.getDay(),                // day
        "h+": this.getHours(),              // hour
        "H+": this.getHours(),              // hour
        "m+": this.getMinutes(),            // minute
        "s+": this.getSeconds(),            // second
        "S":  this.getMilliseconds()        // milli second
    };

    var week = ["一", "二", "三", "四", "五", "六", "日"];

    // 因为年份一般都是四位数，所以单独处理
    if (/(y+)/.test(dateStr)) {

        var year    = this.getFullYear() + "";

        // RegExp，if中正则表达式找到的第一个匹配项
        // 通过year.length - RegExp.$1.length可以达到，根据传入的格式化字符串中需要的长度去设置年份值
        dateStr = dateStr.replace(RegExp.$1, year.substr(year.length - RegExp.$1.length));
    }

    // 星期
    if (/(E+)/.test(dateStr)) {
        var w       = week[this.getDay() - 1];
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
};



/***************************************************************************
****                                                                    ****
****                        MY CODE END                                 ****    
****                                                                    ****
****************************************************************************/