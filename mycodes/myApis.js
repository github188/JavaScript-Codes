/**
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2016-12-08 14:57:48
 * @version $Id$
 *
 *
 * 2016/12/8 14:58:20
 * [ADD] ccCreateElement
 *
 * 2016/12/9 10:26:40
 * [ADD] ccGetEleFirstTextNode
 *
 * 修改前缀：-> cc
 *
 * 2016/12/23 9:55:39
 * [ADD] ccWordFlow: 标签内文字超出标签实际宽度时的动画消息
 *
 *
 * 2016/12/26 19:24:25
 * [DEL] 删除表生成器：TableGenerator, 挪到单独文件：table.js 中
 * [MOD] generateObj -> ccGenerateObj
 *
 * Tue Jun 20 19:10:41 2017
 *
 * [ADD] ccCompoKeyFunction: 组合键处理
 */


/**
 * 文字超出标签宽度时，左右流动处理
 * @param  {String/DomObject} eleOrId      需要处理的包含文字的标签 ID 或者标签元素
 * @param  {Boolean} need   决定是否需要判断超出  
 * @param  {Boolean} on     是否需要滚动，不传或true滚动，false取消滚动
 * @return {[type]}    [description]
 *
 * PS: 兼容传入 元素ID 或者 直接元素对象
 */
function ccWordFlow( eleOrId, need, on ) {
    
    var frag    = null,
        marquee = null,
        width   = 0,
        wordW   = 0
        textNode = null,
        srcEle = null,
        target = $ID( 'word' );

    if ( typeof need !== 'boolean' || typeof on !== 'boolean' ) {

        debug( 'ccWordFlow --- flow --- argument error.' );
        return false;
    }

    srcEle = typeof eleOrId === 'string' ? $ID( eleOrId ) : eleOrId;

    // 取消滚动
    if ( on === false ) {

        marquee = srcEle.getElementsByTagName( 'marquee' )[0];

        if ( marquee ) {
            
            srcEle.innerHTML = marquee.innerText;
        }

        return true;
    }

    // 下面滚动逻辑

    width = pcPX2Num( srcEle.style.width );

    target.innerText = srcEle.innerText;

    wordW = target.offsetWidth;

    debug( 'wordFlow --- word width = ' + wordW + ', width = ' + width );

    // 文字未超出不处理, 可根据参数来决定是否需要判断超出
    if ( wordW < width && need ) {

        return false;
    }

    frag = document.createDocumentFragment();

    marquee = document.createElement( 'marquee' );
    textNode = document.createTextNode( srcEle.innerText );
    marquee.appendChild( textNode );

    frag.appendChild( marquee );

    srcEle.innerHTML = '';

    srcEle.appendChild( frag );

    return true;
}


/**
 * 创建DOM元素，另附加设置样式（行内）
 * @param  {Object} styles 将要创建的元素的样式对象
 * @return {[type]}        [description]
 *
 * Warning: 
 *     该对象中成员名必须要和样式中关键字一致，否则会出错
 */
function ccCreateElement(nodeName, style) {
    if (typeof nodeName !== 'string') {
        return null;
    }
    var prop = '',
        ele = null,
        doc = document;

    ele = doc.createElement(nodeName);
    // 表示没有样式，直接返回元素
    if (!isObject(style)) {
        return ele;
    }

    for (prop in style) {
        if (style.hasOwnProperty(prop)) {
            if (typeof ele.style[prop] !== 'undefined' && style[prop] !== '') {
                ele.style[prop] = style[prop];
            }
            // 实例中存在属性，且该属性对应在元素 style 中存在，切将要设置的属性值不为空
        }
    }
    return ele;
}

/**
 * 获取元素子元素的第一个文本节点
 * @param  {[type]} parent [description]
 * @return {[type]}        [description]
 */
function ccGetEleFirstTextNode(parent) {

    if (!parent) {
        return null;
    }

    var childs = parent.childNodes,
        i = 0,
        len = childs.length;

    for (; i < len; i++) {
        // 只要第一个
        if (isTextNode(childs[i])) {
            return childs[i];
        }
    }

    // not found
    return null;
}

/**
 * 根据模版批量生成数据，测试用
 * @param  {Number} n        需要生存的模版对象个数
 * @param  {[type]} template 对象模版
 * @param  {[type]} flag     对象中是否需要序号，0/不传 - 不需要，1 - 需要
 * @return {[type]}          [description]
 */
function ccGenerateObj(n, template, flag) {

    var obj = [],
        i = 0,
        t = '',
        prop = null;

    console.log( 'flag = ' + flag );

    for (var i = 0; i < n; i++) {

        obj[i] = {};

        for (prop in template) {

            var t = '';
            if (i >= 0 && i < 10) {

                t = '00' + i;
            } else if (i >= 10 && i < 100) {

                t = '0' + i;
            } else {

                t = '' + i;
            }

            if (flag === 1) {

                obj[i].no = t;
            }

            obj[i][prop] = template[prop];
        }
    }

    return JSON.stringify(obj);
}

function ccloadXMLDoc() {
    
}

/**
 * 用来处理组合键功能，默认组合键：9988
 * @param  {Function} 组合键成功后的回调
 * @param  {Array}  组合键数组
 * @param  {Boolean} 组合键功能开关
 * @return {Function} 返回启动组合键函数，该函数在按键监听函数中处理
 */
function ccCompoKeyFunction(callback, compoKeys, enable) {
    // 只接受 enable === false 关闭组合键功能
    if (typeof(enable) === 'boolean' && !enable) {
        return function () {};
    } 

    var targetKeyArr = [57, 57, 56, 56];    // 组合键数组，默认：9988
    var currKeyArr = [];        // 当前按下的键值组
    var currKeyArrLen = 0;      // 键值组长度
    var compoKeySwitch = true;  // 组合键开关
    var lastKeyTime = "";       // 记录上一次按键时间点
    var currKeyTime = "";       // 记录当前按下的按键时时间点
    var seconds = 2;            // 组合键时间
    var isTimeout = false;      // 两次按键是否超时过
    var isSupportTimeout = false;   // 是否支持超时

    if (arguments.length > 1 
        && Object.prototype.toString.call(arguments[1]) === '[object Array]') {
        var tmpArr = compoKeys;
        var tmpValue = -1;
        for (var i = 0; i < tmpArr.length; i++) {
            tmpValue = tmpArr[i];
            // 如果是普通 0-9 数字，转换成键值
            if (tmpValue >= 0 && tmpValue <= 9) {
                tmpArr[i] = tmpValue + 48;
            }
        }

        targetKeyArr = [].slice.call(tmpArr, 0);
    }

    var debug = function (str) {
        // return;
        console.log(str);   
    };  

    // 重置数据
    var reset = function () {
        currKeyArr = [];
        currKeyTime = "";
        lastKeyTime = "";
    };

    // 缓存在允许时间内（seconds）按下的按键
    var buffer = function (__code) {

        if (compoKeySwitch) {

            if (currKeyArr.length < targetKeyArr.length) {

                debug('key index: ' + targetKeyArr.indexOf(__code));

                // 缓存当前按键
                currKeyArr.push(__code);
                debug('current keys: ' + currKeyArr.toString());

                // 判断按下的按键键值是否和组件键值匹配
                for (var j = 0; j < currKeyArr.length; j++) {
                    if (currKeyArr[j] !== targetKeyArr[j]) {
                        reset();
                        return;
                    }
                }

                // 按键数达到组合键数了
                if (currKeyArr.length === targetKeyArr.length) {

                    // 这个 if 可省略
                    if (currKeyArr.toString() === targetKeyArr.toString()) {
                        // TODO 组合键成功，执行业务行为 
                        debug('Got It ! > ' + currKeyArr.toString());

                        if (callback) { callback(); }
                    }

                    // 组合成功或者按键数达到组合键键数量，都需要重置
                    reset();
                }
            }
        }
    }

    var checkWithTimeout = function () {
        
        // 下面是支持超时机制情况
        var delta = currKeyTime - lastKeyTime;
        debug('check ------ delta = ' + delta);

        if (delta < seconds * 1000) {
            isTimeout = false;
            buffer(__keycode);
        } else { // 两次按键超过允许值，重新开始
            isTimeout = true;
            reset();
        }
    };

    // 校验按键是否超时，超时标识组合键失败
    var check = function (__keycode) {

        // 不支持两个键的间隔超时机制情况
        if (!isSupportTimeout) {
            isTimeout = false;
            buffer(__keycode);
        } else { // 支持超时机制
            checkWithTimeout();
        }

    };

    return function (__keycode) {

        //记下此次按键的时间
        lastKeyTime = currKeyTime;

        currKeyTime = new Date().getTime();

        if (!lastKeyTime || lastKeyTime == "") {
            lastKeyTime = currKeyTime;
        }

        check(__keycode);
    }
}



////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/// 以下为对象，构造器，及其他
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


////////////////////////////////// Object end ///////////////////////////////////////////

function $( id ) {
    return document.getElementById( id );
}

function $ID( id ) {
    return document.getElementById( id );
}

function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function isTextNode(node) {
    return Object.prototype.toString.call(node) === '[object Text]';
}

// 判断指定对象中是否存在 value 值
function isValueInObject( obj, value ) {
    
    if ( !obj ) return false;

    for ( var prop in obj ) {

        if ( obj.hasOwnProperty( prop ) && obj[ prop ] === value ) {

            debug( 'isValueInObject --- got it.' );
            return true;
        }
    }

    return false;
}

function debug( str ) {
    
    console.log( str );
}

// 将像素类的字符串 转成数字
function pcPX2Num( pxString ) {
    
    // 空串返回0
    if ( !pxString ) {

        return 0;
    }

    // debug( 'pcPX2Num --- pxString = ' + pxString );

    pxString = pxString + '';

    return parseInt( pxString.replace( /px/ ), 10 );
}


////////////////////////////////// myApis.js end ///////////////////////////////////////////