/**
 * 生成正多边形
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-30 17:41:14
 * @version $Id$
 */

var CELL_RAD = Math.PI / 180;

function RegularPolygon( canvas ) {
    
    this.ctx = canvas.getContext('2d');

    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    // 多边形边数，默认 3，即三边形
    this._sides = 4;

    // 默认多边形半径为画布宽高一半
    this._r = canvas.width / 2;

    // 图像样式
    this._styles = {};

    // 图像旋转的角度
    this.rad = 0;

    // 绘制时是否旋转角度
    this.isRotate = false;

    // 顺时针
    this.isClockwise = true;

    // 旋转模式
    this.isRoundBack = false;

    // 旋转状态
    this.isPaused = true;

    // 旋转动画计时器
    this.rotateTimer = 0;
}

/* --------------------- START Public --------------------- */

/**
 * 把绘制起点移到画布中心
 * @return {[type]} [description]
 */
RegularPolygon.prototype.origin = function (x, y) {

    this.ctx.save();

    this.ctx.translate(x || this._r, y || this._r);

    return this;
}

/**
 * 设置多边形外圆半径
 * @param  {Number} _r 外圆半径
 * @return {[type]}    [description]
 */
RegularPolygon.prototype.r = function (_r) {
    this._r = !!!_r || typeof _r !== 'number' 
            || _r < 0 || _r > this._r 
            ? this._r 
            : _r;

    return this;
}

/**
 * 多边形边数
 * @param  {Number} _sides 边数
 * @return {[type]}        [description]
 */
RegularPolygon.prototype.sides = function ( _sides ) {
    
    this._sides = _sides || this._sides;

    return this;
}

/**
 * 指定或 随机旋转图形角度
 * @param  {Number} rad 图像相对初始位置的旋转角度
 * @return {[type]}     [description]
 */
RegularPolygon.prototype.rotate = function ( rad ) {
    
    this.rad = rad || Math.random() * 2 * Math.PI;

    if ( this._rads.length > 66 ) {
        this._rads.length = [];
    }

    this.isRotate = true;

    return this;
}

/**
 * 设置填充或描边样式
 *
 * 参数 style 对象中应该要有 `isStroke` 属性，用来指定
 * 是填充还是描边，默认为描边
 *
 * `isStroke == true` 描边
 * `isStroke == false` 填充
 * 
 * @param  {Object} style 样式对象
 * @return {[type]}       [description]
 */
RegularPolygon.prototype.styles = function ( style ) {
    
    if ( !style ) { return this._styles; }

    this._styles = style;

    return this;
}

RegularPolygon.prototype.config = function ( cfgObj ) {
    
    var me      = this,
        type    = '';

    type = Object.prototype.toString.call( cfgObj );

    if ( type !== '[object Object]' ) { return this; }


}

/**
 * 绘制多边形
 * @return {[type]} [description]
 */
RegularPolygon.prototype.draw = function () {
     
    var 
        ctx     = this._context(),
        xys     = this._getXYs(),
        style   = this._styles,
        i, len, random, xy = null;

    ctx.save();
    this._setStyles( ctx );
    ctx.beginPath();

    /* 
        是否进行旋转，启用方式
        1. this.rotate(rad) 触发
        2. this.animate() 旋转动画中触发
    */
    if ( this.isRotate ) {
        ctx.rotate( this.rad );
        this.isRotate = false;
    }
    ctx.moveTo(xys[0].x, xys[0].y);
    ctx.rotate( 2 * Math.PI / this._sides );
    for ( i = 0, len = xys.length; i < len ; i++ ) {

        xy = xys[ i ];

        ctx.lineTo(xy.x, xy.y);
    }
    ctx.closePath();

    // 根据 this.styles() 中的参数来决定是填充还是描边
    ( style.hasOwnProperty('isStroke') 
        && style.isStroke
        ? ctx.stroke()
        : ctx.fill()
    );
    ctx.restore();

    return this;
}

/**
 * 执行动画
 * @return {[type]} [description]
 */
RegularPolygon.prototype.animate = function () {

    var me = this;

    this.ctx.clearRect(
        -this.canvasWidth / 2, -this.canvasHeight / 2, 
        this.canvasWidth, this.canvasHeight
    );

    this._animateMode();

    this.draw();

    cancelAnimationFrame( me.rotateTimer );
    this.rotateTimer = requestAnimationFrame( function () { me.animate(); } );
}

/**
 * 启动动画
 * @param  {Boolean} isClockwise [description]
 * @param  {[type]}  mode        [description]
 * @return {[type]}              [description]
 */
RegularPolygon.prototype.start = function ( ) {

    var argsLen = arguments.length,
        arg = null;

    if ( argsLen === 0 ) {  // 没有参数时，默认当作回滚
        this.isClockwise = true;
        this.isRoundBack = true;
    } else if ( argsLen === 1 ) { // 有参数时，转成 boolean 判断是逆顺时针
        this.isClockwise = !!arguments[0];
        this.isRoundBack = false;
    }

    this.isPaused = false;

    this.animate();

    return this;
}

/**
 * 暂停或恢复播放
 * @return {[type]} [description]
 */
RegularPolygon.prototype.pause = function () {

    var me = this;

    if ( me.isPaused ) {
        me.rotateTimer = requestAnimationFrame( function () { me.animate(); } );
        me.isPaused = false;
    } else {
        me.isPaused = true;
        cancelAnimationFrame( me.rotateTimer );
    }

    return me;
}

RegularPolygon.prototype.end = function () {
    
    this.ctx.restore();

    return this;
}

/* --------------------- END Public --------------------- */

/* --------------------- START Private --------------------- */

/**
 * 动画旋转方式
 * @param  {String} mode 
 *         'clockwise' : 一直顺时针
 *         'anticlockwise': 一直逆时针
 *         'roundback': 来回
 * @return {[type]}      [description]
 */
RegularPolygon.prototype._animateMode = function () {

    var me = this;

    me.rad = me.isClockwise 
        ? me.rad + CELL_RAD
        : me.rad - CELL_RAD;

    if ( me.rad <= 0 ) {
        // 
        // 如果是来回转模式，就弧度归零，置顺时逆时针到头，两种情况针位
        // 如果是顺时针或逆时针模式，就最大角，继续逆时针转
        if ( me.isRoundBack ) {
            me.rad = 0;
            me.isClockwise = true;
        } else {
            me.rad = 2 * Math.PI;
        }
    } else if ( me.rad >= Math.PI * 2 ) {
        
        // 顺时针到归零
        // 如果是来回转，就置最大角，置逆时针位
        // 如果是顺时针或逆时针模式，就归零位，继续顺时针转
        if ( me.isRoundBack ) { 
            me.isClockwise = false; 
            me.rad = Math.PI * 2;
        } else {
            me.rad = 0;
        }
    }

    me.isRotate = true;
}


/**
 * 保存每个实例的偏移弧度
 * @type {Array}
 */
RegularPolygon.prototype._rads = [];

/**
 * 获取画布上下文
 * @return {[type]} [description]
 */
RegularPolygon.prototype._context = function () {
    return this.ctx;
}

/**
 * 获取多边形的顶点坐标集合
 * @return {Array}       返回顶点坐标集合
 */
RegularPolygon.prototype._getXYs = function () {
    
    var n       = this._sides, r = this._r,
        xys     = []        , xy = {},
        cell    = 2 * Math.PI / n,
        i       = 0;

    while ( i++ < n ) {
        xy = {};

        xy.x = r * Math.cos( cell * i );
        xy.y = r * Math.sin( cell * i );

        xys.push(xy);
    }


    return xys;
}

/**
 * 用于 draw() 中设置上下文样式
 * @param {[type]} ctx [description]
 */
RegularPolygon.prototype._setStyles = function ( ctx ) {

    if ( !!!ctx ) { return false; }

    for ( var attr in this._styles ) {
        ctx[ attr ] = this._styles[ attr ];
    }

    return true;
}

/* --------------------- END Private --------------------- */


function debug( str ) {
    console.log( str );
}

module.exports = function (canvas) {
    return new RegularPolygon(canvas);
}