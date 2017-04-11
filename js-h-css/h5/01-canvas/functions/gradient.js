/**
 * 渐变 API
 *
 * ctx.createLinearGradient(x0, y0, x1, y1);
 *
 * 渐变方向由 (x0, y0), 和 (x1, y1) 两个点决定
 *
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-04-06 15:46:24
 * @version $Id$
 *
 *
 * 2017/4/6 15:48:39
 *
 *  1. 水平渐变
 *
 *  2. 垂直渐变
 *
 *  3. 角度渐变
 */


/**
 * 创建渐变样式对象
 * @param  {Object} ctx    画布上下文
 * @param  {Object} points 渐变起点和终点对象，
 *                         格式：{ start: {x:x, y:y}, end: {x:x, y:y }},
 *                         考虑使用数组更加方便，一个二维数组搞定
 *                         格式：[[x1,y1], [x2, y2]]
 * @param  {[type]} styles [description]
 * @return {[type]}        [description]
 */
function _gradient(ctx, points, styles) {

    var start, end, style, 
        linearGradient, i, len,
        percent, color;

    if ( !points || !styles ) { return null; }

    // 数组
    if ( Array.isArray(points) ) {
        start   = {};
        end     = {};
        len = points.length;
        if ( len === 2 ) {
            start.x = points[0][0];
            start.y = points[0][1];
            end.x   = points[1][0];
            end.y   = points[1][1];
        } else if ( len === 4 ) {
            start.x = points[0];
            start.y = points[1];
            end.x   = points[2];
            end.y   = points[3];
        }
    } else if ( isObject(points) && points.start && points.end ) {
        start   = points.start;
        end     = points.end;
    } else {
        return null;
    }

    linearGradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);

    for ( var i = 0, len = styles.length; i < len; i++ ) {
        style = styles[ i ];

        if ( Array.isArray(style) ) {
            percent = style[0];
            color   = style[1];
        } else if ( isObject(style) ) {
            percent = style.percent;
            color   = style.color;
        } else {
            return null;
        }

        linearGradient.addColorStop( percent, color );
    }

    return linearGradient; 
}

function isObject( obj ) {
    
    return Object.prototype.toString.call( obj ) === '[object Object]';
}