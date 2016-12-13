/**
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2016-12-10 16:38:53
 * @version $Id$
 *
 *
 * 表生成器
 */



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
    
    this.trIdPrefix = 'list_tr';

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
        background: "images/line_tr.png"
    };

    this.separator = {

        super: '>',
        parent: '+',
        style: '&',
        son: '$'
    };

    this.brs = 0;

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
        superSeparator   = that.separator.super;

        // console.log( string )
    // 表示没有<table>，只需要创建行即可
    if ( string.indexOf( superSeparator ) < 0 ) {

        needTable = false;

        trString = str;
    } else {

        str = string.split( superSeparator );

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
        trs     = [],
        style = null,
        styleJSON = '',
        prefix  = '';

    if ( typeof string !== 'string' || string === '' ) {

        console.log( 'createTableTrs ---- string is null' );

        return null;
    }

    styleJSON = ( string.split( that.separator.parent )[ 0 ] ).split( that.separator.style )[ 1 ];

    style = eval( "(" + styleJSON + ")" );

    debug(style)

    if ( style ) {

        prefix = style.prefix;
    }

    for( ; i < lines; i++ ) {

        tr = that.createElements( string );

        if ( prefix ) {

            tr.id = prefix + i;
        }

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
        parentSeperator   = that.separator.parent;

        eleArr  = null,

        superE = null, ele = null, frag = null,

        i = 0, len = 0;

    if ( !str ) {

        console.log( 'createElements --- element string is null.' );

        return null;
    }

    eleArr = str.split( parentSeperator );

    len = eleArr.length;

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
        sonSeperator   = that.separator.son,
        styleSeperator = that.separator.style,

        eleArr  = null,
        eleObj  = {}, i = 0,
        len     = 0,
        tmp     = null,
        parent  = null,
        node    = null,
        frag    = null;

    if ( !isString( str ) ) {

        console.log( 'createElementByString string is null.' );
        return null;
    }

    eleArr  = str.split( sonSeperator );
    len     = eleArr.length;

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

            frag = node;
            parent = frag;

        } else {

            debug(parent);
            parent.appendChild( node );

            parent = node;
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
        prop        = '',
        br          = null;

    if ( typeof tag !== 'string' || tag === '' ) {

        return null;
    }

    node        = document.createElement( tag );
    textNode    = document.createTextNode( '' );

    node.appendChild( textNode );

    if ( styles === null ) {

        return node;
    }

    // 元素后面是否需要换行
    if ( parseInt( styles.needBr, 10 ) === 1 ) {

        br = document.createElement( 'br' );

        node.appendChild( br );
    }

    if ( styles.id ) {

        node.id = styles.id;
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
    style.background = 'url(' + style.icon + ')';

    line = that.createEle( 'div', style );

    return line;
}


function isString( str ) {
    
    return typeof str === 'string' && str !== '';
}


function debug( str ) {
    
    // console.log( str );
}

// var table = new TableGenerator();