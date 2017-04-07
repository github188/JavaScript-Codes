

/**
 * 绘制树路径
 * @return {[type]} [description]
 */
function createTreePath( styles ) {
    
    ctx.strokeStyle = styles && styles.stroke || 'red';
    ctx.lineJoin    = 'round';
    ctx.lineWidth   = 4;
    ctx.fillStyle = styles && styles.fill || '#339900';
    ctx.beginPath();

    ctx.moveTo(-25, 80);
    ctx.lineTo(25, 80);
    ctx.lineTo(10, 40);
    ctx.lineTo(20, 40);
    ctx.lineTo(5, 0);
    ctx.lineTo(10, 0);

    // 顶点
    ctx.lineTo(0, -50);

    ctx.lineTo(-10, 0);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-20, 40);
    ctx.lineTo(-10, 40);

    ctx.closePath();

    ctx.stroke();
    ctx.fill();

}

/**
 * 绘制道路路径
 * @param  {[type]} roadBgImg [description]
 * @return {[type]}           [description]
 */
function drawRoad( roadBgImg ) {
    
    ctx.beginPath();

    ctx.moveTo(0, 0);

    ctx.quadraticCurveTo(170, -50, 260, -190);

    ctx.quadraticCurveTo(310, -250, 410, -250);

    ctx.strokeStyle = ctx.createPattern(roadBgImg, 'repeat');
    ctx.lineWidth = 20;
    ctx.stroke();
}

/**
 * 绘制树干
 * @return {[type]}   [description]
 */
function drawTreeMain( styles ) {

    var trunkGradient = ctx.createLinearGradient(-5, -50, 5, -50);

    // 水平渐变
    trunkGradient.addColorStop(0, '#663300');
    trunkGradient.addColorStop(0.4, '#996600');
    trunkGradient.addColorStop(1, '#552200');

    ctx.fillStyle = styles && styles.fill || trunkGradient;
    ctx.fillRect(-5, 82, 10, 50);

    // 垂直渐变
    var canopyShadow = ctx.createLinearGradient(0, -50, 0, 0);
    canopyShadow.addColorStop(0, 'rgba(0,0,0,0.5)');
    canopyShadow.addColorStop(0.2, 'rgba(0,0,0,0.0)');

    ctx.fillStyle = styles && styles.fill || canopyShadow;
    ctx.fillRect(-5, 82, 10, 50);
}

/**
 * 绘制完整树，树干树枝
 * @return {[type]} [description]
 */
function drawTree( styles ) {
    createTreePath( styles );
    drawTreeMain( styles );
}

function drawShadow( targetFn ) {

    var _styles = {
        stroke: 'rgba(0,0,0,0.4)',
        fill: 'rgba(0,0,0,0.4)'
    };

    ctx.save();

    ctx.transform(1, 0, -0.5, 1, 0, 0);

    ctx.scale(1, 0.6);

    targetFn && targetFn( _styles );

    ctx.fill();
    ctx.restore();
}

/**
 * 绘制人物
 * @return {[type]} [description]
 */
function drawPerson() {

    ctx.strokeStyle = 'black';
    ctx.beginPath();

    // 头
    ctx.arc(0, 0, 10, 0, 2 * Math.PI);

    // 身躯
    ctx.moveTo(0, 10);
    ctx.lineTo(0, 40);

    // 左脚
    ctx.moveTo(0, 40);
    ctx.lineTo(-8, 60);

    // 右脚
    ctx.moveTo(0, 40);
    ctx.lineTo(8, 60);

    // 左手
    ctx.moveTo(0, 20);
    ctx.lineTo(-10, 25);

    // 右手
    ctx.moveTo(0, 20);
    ctx.lineTo(10, 25);

    ctx.closePath();
    ctx.stroke();
}

/**
 * 绘制统一函数，
 * @param {Number/Boolean/Object} scale 可以是数字，布尔值，对象
 *                                      数字：表示宽高都用这个值缩放
 *                                      布尔值：false 不缩放，true 默认缩放 1.2 倍
 *                                      对象：{ x: 2, h: 2 } 详细指定宽高缩放比例
 * @param  {Object}   point 绘制起点坐标，translate用
 *                          格式：{ x:0, y:0 }
 * @param  {Function} fn    具体绘制函数
 * @param  {Array/Object/Other}   args  绘制函数 fn 使用到的参数
 * @return {[type]}         [description]
 */
function draw(scale, point, fn, args) {

    ctx.save();
    ctx.translate(point.x, point.y);

    console.log( typeof scale );

    if ( typeof scale === 'boolean' && scale ) {
        ctx.scale(1.2, 1.2); // 默认放大 1.2 倍
    } else if ( isObject(scale) && scale.w && scale.h ) {
        ctx.scale(scale.w, scale.h);
    } else if ( typeof scale === 'number' && scale > 1 ) {
        ctx.scale(scale, scale);
    }

    fn && fn(args);
    ctx.restore();
}


function drawHouse() {
    
    // ctx.beginPath();

    ctx.fillStyle = '#BEB1B1';
    ctx.fillRect(0, 0, 80, 60);

    ctx.fillStyle = 'white';
    ctx.fillRect(10, 10, 10, 10);
    ctx.fillRect(22, 10, 10, 10);
    ctx.fillRect(10, 22, 10, 10);
    ctx.fillRect(22, 22, 10, 10);

    ctx.fillRect(60, 40, 10, 20);

    ctx.fillStyle = '#007685';
    ctx.beginPath();
    ctx.arc(67, 50, 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

function isObject( obj ) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}