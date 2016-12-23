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
 */

/**
 * 
 * 
 * @return {[type]}    [description]
 *
 * PS: 'marquee'标签已经被标准不推荐使用了，不过可以通过纯js 实现动画效果【TODO】
 *
 * 这个接口假设已经存在参考标签: <p id="word" style="display:inline-block;visibility:hidden;"></p>
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
function generateObj(n, template, flag) {

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


////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/// 以下为对象，构造器，及其他
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


/**
 * 创建表格构造器
 *
 * 使用：
 * 1. 直接通过构造器
 *     new TableGenerator( 'table&{}>tr&{}+td.span+td.i' );
 *     格式解析：(字符串中的关键子必须为HTML元素标签名)
 *     
 *         table: 即表标签，也是创建后最顶级标签；
 *         &    : 连接符，连接标签和样式JSON，跟在哪个后面就是哪个的样式；
 *         {}   : 元素样式，作用于'&'前的标签；
 *         +    : 同级元素，第一个'+'前的标签作为父级标签，后面都是同级子标签；
 *                 如：tr+td+td => <tr><td>1</td><td>2</td></tr>
 *         .    : 表示子标签。
 *
 * PS: 该生成器不局限于表的创建，也可以创建其他类型标签，类似于表的格式 
 */
function TableGenerator( ) {
    
    this.trIdPrefix = 'list';

    this.string = ''; 

    // 表格行数
    this.lines = 8;

    // 是否需要分割线
    this.flag = false;

    // 分割线
    this.lineObj = {

        icon: "", // 线条背景图
        position: "absolute", 
        top: "-1px",
        width: "100px", 
        height: "1px", 
        background: ""
    };

    // others
}

/**
 * 初始化表格，完成后得到完整表格
 * @param  {String} string 要创建的元素格式，要严格按照规范定义
 * @param  {Number} lines  要创建表格的行数
 * @param  {Boolean} flag   保留字段，可用做其他标识
 * @return {[type]}        [description]
 */
TableGenerator.prototype.init = function ( string, lines, flag, lineObj ) {

    this.string     = string;
    this.lines      = lines || 1;
    this.flag       = flag || false;
    this.lineObj    = lineObj || this.lineObj;
    this.superSeperator     = '>';
    this.parentSeperator    = '+';
    this.styleSeperator     = '&';
    this.sonSeperator       = '$';

    return this.createTable();
};

/**
 * 创建表格
 * @return {[type]} [description]
 */
TableGenerator.prototype.createTable = function () {

    var that    = this,
        string  = that.string,
        lines   = that.lines,
        flag    = that.flag,
        str     = string,
        frag    = null,
        tbl     = null,
        trs     = null,
        trString  = '',
        needTable = true,

        // 分隔符
        superSeperator   = that.superSeperator;

    // 表示没有<table>，只需要创建行即可
    if ( string.indexOf( superSeperator ) < 0 ) {

        needTable = false;

        trString = str;
    } else {

        str = string.split( superSeperator );

        // 创建 <table> 标签元素
        tbl = that.createElementByString( str[0] );

        trString = str[1];
    }

    // 片段
    frag = document.createDocumentFragment();

    // 创建所有行
    trs = that.createTableTrs( trString, lines, flag );

    if ( needTable ) { // 有table时才添加，否则会与下面一步重复

        // 创建后的所有行添加到表中
        that.tableAddTrs( tbl, trs );

        frag.appendChild( tbl );
    } else {

        that.tableAddTrs( frag, trs );
    }

    return frag;
};

/**
 * 将创建好的行添加到表中
 * @param  {DOMElement} tbl 指定表格
 * @param  {DOMElement} trs 创建行的行
 * @return {[type]}     [description]
 */
TableGenerator.prototype.tableAddTrs = function ( tbl, trs ) {

    var i = 0, len = 0;

    if ( !tbl || !trs ) {

        return false;
    }

    for ( len = trs.length; i < len; i ++ ) {

        tbl.appendChild( trs[ i ] );
    }
};

/**
 * 创建表行
 * @param  {String} string 元素字符串
 * @param  {Number} lines  要创建多少行
 * @param  {Boolean} flag   是否需要分割线
 * @return {[type]}        [description]
 */
TableGenerator.prototype.createTableTrs = function ( string, lines, flag ) {

    var that    = this, 
        i       = 0,
        tr      = null,
        line    = null,
        trs     = [];

    for( ; i < lines; i++ ) {

        tr = that.createElements( string );

        tr.id = that.trIdPrefix + i;

        // 根据需要创建分割线
        if ( flag && i < lines - 1 ) { // 最后一行下面不需要分割线

            // 将 tr 作为参数是希望分割线紧跟在其下面
            line = that.createLine( tr, i + 1 );

            tr.appendChild( line );
        }

        trs.push( tr );
    }

    return trs;
};

/**
 * 创建带多个子元素的元素，比如：<tr><td></td><td></td></tr>
 * @param  {String} str 要创建的元素字符串
 * @return {DOMFragment}     返回创建好的元素片段
 */
TableGenerator.prototype.createElements = function ( str ) {

    var that    = this,

        // 分隔符
        parentSeperator   = that.parentSeperator;

        eleArr  = str.split( parentSeperator ),

        superE = null, ele = null, frag = null,

        i = 0, len = eleArr.length;

    superE = that.createElementByString( eleArr[ 0 ] );

    for ( i = 1; i < len; i++ ) {

        ele = that.createElementByString( eleArr[ i ] );

        superE.appendChild( ele );
    }

    return superE;
};

/**
 * 创建元素，每级元素均只有一个元素情况，无法创建一个元素下有多个子元素
 *
 * 例如：<tr><td><span></span></td></tr>
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
TableGenerator.prototype.createElementByString = function ( str ) {

    var that    = this,

        // 分隔符
        sonSeperator   = that.sonSeperator,
        styleSeperator = that.styleSeperator,

        eleArr  = str.split( sonSeperator ),
        eleObj  = {}, i = 0,
        len     = eleArr.length,
        tmp     = null,
        parent  = null,
        node    = null,
        frag    = null;

    for ( ; i < len; i++ ) {

        eleObj = eleObj || {};

        if ( eleArr[ i ].indexOf( styleSeperator ) >= 0 ) {

            tmp = eleArr[ i ].split( styleSeperator );

            eleObj.tagName = tmp[ 0 ];

            // eval -> JSON.parse
            eleObj.styles = eval( "(" + tmp[ 1 ] + ")" );
        } else {

            eleObj.tagName = eleArr[ i ];
            eleObj.styles = null;
        }

        // 开始创建
        node = that.createEle( eleObj.tagName, eleObj.styles );

        if ( parent === null ) {

            parent = node;
        } else {

            parent.appendChild( node );

            parent = node;
        }

        // 保存顶级元素，最终返回的结果
        if ( frag === null && parent !== null ) {

            frag = parent;
        }
    }

    return frag;
};

/**
 * 创建单个元素
 * @return {[type]} [description]
 */
TableGenerator.prototype.createEle = function ( tag, styles ) {

    var node        = null,
        textNode    = null,
        prop        = '';

    if ( typeof tag !== 'string' || tag === '' ) {

        return null;
    }

    node        = document.createElement( tag );
    textNode    = document.createTextNode( '' );

    node.appendChild( textNode );

    if ( styles === null ) {

        return node;
    }

    for ( prop in styles ) {

        if ( styles.hasOwnProperty( prop ) ) {

            if ( typeof node.style[ prop ] !== 'undefined' ) {

                node.style[ prop ] = styles[ prop ];
            }

            if ( styles.text ) { // 文本内容

                textNode.nodeValue = styles.text;
            }
        }
    }

    return node;
}

/**
 * 分割线，根据传入的元素设置
 * @param  {[type]} element [description]
 * @param  {[type]} n           元素在表中的索引
 * @return {[type]}             [description]
 */
TableGenerator.prototype.createLine = function ( element, n ) {
        
    var that    = this,
        line    = null,
        pTop    = 0, 
        style   = that.lineObj,
        icons   = '';

    if ( !parent ) {
        return false;
    }

    pTop = parseInt( element.style.height, 10 ) * n;

    style.top = pTop + 'px';
    style.background = 'url(' + style.icons + ')';

    line = that.createEle( 'div', style );

    return line;
}


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