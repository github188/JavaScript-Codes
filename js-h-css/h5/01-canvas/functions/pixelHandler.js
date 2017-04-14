/**
 * 画布像素处理
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-04-14 15:15:10
 * @version $Id$
 */

var imgData;

function PixelProcessor(canvas) {
    
    this.canvas = canvas;

    this.ctx = this.canvas.getContext('2d');

    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    this.pixelDatas = null;
}

/**
 * 获取红色（起点色）在像素值数组中的索引
 * @param  {Number} x 当前点在画布中的 x 坐标
 * @param  {Number} y 当前点在画布中的 y 坐标
 * @return {Number}   返回 Red 色在像素数组中的下标
 */
PixelProcessor.prototype._getRedPixelIdx = function (x, y) {
    return (y - 1) * this.canvasWidth * 4 + (x - 1) * 4;
};

/**
 * 获取(x, y) 点上的 rgba 颜色
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {String}   'rgba(100, 120, 140, 0.3)' 形式字符串
 */
PixelProcessor.prototype.getPixelColor = function (x, y) {

    var redPxIdx    = this._getRedPixelIdx(x, y),
        pixelDatas  = this.pixelDatas;


            console.log(redPxIdx);

    return 'rgba(' 
        + pixelDatas[ redPxIdx ] + ', '         // red
        + pixelDatas[ redPxIdx + 1 ] + ', '     // green
        + pixelDatas[ redPxIdx + 2 ] + ', '     // blue
        + pixelDatas[ redPxIdx + 3 ]            // alpha
        + ')';
}

/**
 * 获取指定位置宽高区域的画布内的像素数据
 * @param  {Number} x 选区左上角坐标
 * @param  {Number} y 选区左上角坐标 
 * @param  {Number} w 选区宽
 * @param  {Number} h 选区高
 * @return {Array}   像素值数组
 */
PixelProcessor.prototype.getPixelDatas = function (x, y, w, h) {
    this.pixelDatas = this.ctx.getImageData(x, y, w, h).data; 

    return this;
};


/**
 * 反转画布中指定区域的颜色
 * @param  {CanvasRenderingContext2D} ctx 画布上下文
 * @param  {[type]} x   [description]
 * @param  {[type]} y   [description]
 * @param  {[type]} w   [description]
 * @param  {[type]} h   [description]
 * @return {[type]}     [description]
 */
PixelProcessor.prototype.reverseColor = function (x, y, w, h) {
    
    const ctx       = this.ctx;
    const imgData   = ctx.getImageData(x, y, w, h);
    const pixels    = imgData.data;

    ctx.clearRect(x, y, w, h);

    for (let i = 0, len = pixels.length; i < len; i += 4) {

        pixels[i]      = 255 - pixels[i];         // red
        pixels[i + 1]  = 255 - pixels[i + 1];     // green
        pixels[i + 2]  = 255 - pixels[i + 2];     // blue
        // pixels[i + 3]  = 1 - pixels[i + 3];       // alpha

    }

    ctx.putImageData(imgData, x, y);
}

/**
 * 创建马赛克
 * @param  {Number} x          马赛克区左上角 x 坐标
 * @param  {Number} y          马赛克区左上角 y 坐标
 * @param  {Number} w          马赛克区宽度
 * @param  {Nubmer} h          马赛克区高度
 * @param  {Number/Array} colorValue 马赛克颜色
 * @return {[type]}            [description]
 */
PixelProcessor.prototype.createMosaic = function (x, y, w, h, colorValue) {

    const ctx       = this.ctx;
    const imgData   = ctx.createImageData(w, h);
    const pixels    = imgData.data;

    ctx.clearRect(x, y, w, h);

    let alpha = parseFloat(((Math.random() * 100) / 100 + '' ).substr(0, 3), 10);

    for (let i = 0, len = pixels.length; i < len; i += 4) {

        // 参数指定色
        if ( typeof(colorValue) === 'number' 
            && colorValue >= 0 
            && colorValue <= 255 
            || Array.isArray(colorValue) ) {

            [
                pixels[i]       ,  pixels[i + 1], 
                pixels[i + 2]   , pixels[i + 3]

            ] = Array.isArray(colorValue) 
              ? colorValue      // 值数组
              : [ colorValue, colorValue, colorValue, colorValue ]; // 单值

        } else { // 随机色
            [
                pixels[i]       , pixels[i + 1], 
                pixels[i + 2]   , pixels[i + 3]
            ] = [
                Math.random() * 255, Math.random() * 255, 
                Math.random() * 255, Math.random() * 255
            ];
        }
    }
    ctx.putImageData(imgData, x, y);

    return this;
}


// 加载图片完成后执行回调
function loadImg(imgPath, callback) {
    
    var img = new Image();

    img.src = imgPath;

    img.onload = function () {
        callback && callback(img);
    }
}


/**
 * 反转画布中指定区域的颜色
 * @param  {CanvasRenderingContext2D} ctx 画布上下文
 * @param  {[type]} x   [description]
 * @param  {[type]} y   [description]
 * @param  {[type]} w   [description]
 * @param  {[type]} h   [description]
 * @return {[type]}     [description]
 */
function reserveColor(ctx, x, y, w, h) {
    
    const imgData   = ctx.getImageData(x, y, w, h);
    const pixels   = imgData.data;

    ctx.clearRect(x, y, w, h);

    for (let i = 0, len = pixels.length; i < len; i += 4) {

        pixels[i]      = 255 - pixels[i];         // red
        pixels[i + 1]  = 255 - pixels[i + 1];     // green
        pixels[i + 2]  = 255 - pixels[i + 2];     // blue
        // pixels[i + 3]  = 1 - pixels[i + 3];       // alpha

    }

    ctx.putImageData(imgData, x, y);
}

function createMosaic(ctx, x, y, w, h, colorValue) {

    const imgData   = ctx.createImageData(w, h);
    const pixels    = imgData.data;

    ctx.clearRect(x, y, w, h);

    let alpha = parseFloat(((Math.random() * 100) / 100 + '' ).substr(0, 3), 10);

    for (let i = 0, len = pixels.length; i < len; i += 4) {

        if ( typeof(colorValue) === 'number' 
            && colorValue >= 0 
            && colorValue <= 255 
            || Array.isArray(colorValue) ) {

            [
                pixels[i], 
                pixels[i + 1], 
                pixels[i + 2], 
                pixels[i + 3]

            ] = Array.isArray(colorValue) ? colorValue : [ colorValue, colorValue, colorValue, colorValue ];
        } else {

            // new syntax
            [
                pixels[i], 
                pixels[i + 1], 
                pixels[i + 2], 
                pixels[i + 3]
            ] = [
                Math.random() * 255, Math.random() * 255, 
                Math.random() * 255, Math.random() * 255
            ];
        }
    }
    ctx.putImageData(imgData, x, y);
}