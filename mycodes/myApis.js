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
 */


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

function $(id) {
    return document.getElementById(id);
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


/////////////////////////////////////////////////////////////////////
///
/// 
///
/// 以下为对象，构造器，及其他

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

    // others
}

/**
 * 初始化表格，完成后得到完整表格
 * @param  {String} string 要创建的元素格式，要严格按照规范定义
 * @param  {Number} lines  要创建表格的行数
 * @param  {Boolean} flag   保留字段，可用做其他标识
 * @return {[type]}        [description]
 */
TableGenerator.prototype.init = function ( string, lines, flag ) {

    this.string = string;
    this.lines = lines || 1;
    this.flag = flag || false;

    return this.createTable();
};

/**
 * [createTable description]
 * @return {[type]} [description]
 */
TableGenerator.prototype.createTable = function () {

    var that    = this,
        string  = that.string,
        lines   = that.lines,
        flag    = that.flag,
        str     = string.split( '>' ),
        frag    = null,
        tbl     = null,
        trs     = null;

    // 片段
    frag = document.createDocumentFragment();

    // 创建 <table> 标签元素
    tbl = that.createElementByString( str[0] );

    // 创建所有行
    trs = that.createTableTrs( str[1], lines, flag );

    // 创建后的所有行添加到表中
    that.tableAddTrs( tbl, trs );

    frag.appendChild( tbl );

    return frag;
};

TableGenerator.prototype.tableAddTrs = function ( tbl, trs ) {

    var i = 0, len = 0;

    if ( !tbl || !trs ) {

        return false;
    }

    for ( len = trs.length; i < len; i ++ ) {

        tbl.appendChild( trs[ i ] );
    }
};

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
            line = that.pcCreateLine( tr, i + 1 );

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
        eleArr  = str.split( '+' ),

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
        eleArr  = str.split( '.' )
        eleObj  = {}, i = 0,
        len     = eleArr.length,
        tmp     = null,
        parent  = null,
        node    = null,
        frag    = null;

    for ( ; i < len; i++ ) {

        eleObj = eleObj || {};

        if ( eleArr[ i ].indexOf( '&' ) >= 0 ) {

            tmp = eleArr[ i ].split( '&' );

            eleObj.tagName = tmp[ 0 ];

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
