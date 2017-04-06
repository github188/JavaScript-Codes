/**
 * 树木绘制
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-04-06 16:55:21
 * @version $Id$
 */

//  import { _gradient } from './gradient';

function Tree( ctx ) { 

    this.ctx = ctx;

    this.trunk = {
        rect: null,
        gradient: null
    };

    this.scale = 1.0;

    this.branch = {
        fillStyle: '#339900',
        strokeStyle: 'red',
    };
}

Tree.prototype.trunkRect = function (x, y, w, h) {
    this.trunk.rect = [x, y, w, h]; 

    return this;
};

Tree.prototype.gradient = function ( gradientObj ) {
    
    this.trunk.gradient = gradientObj;

    return this;
};

Tree.prototype.createTreeTrunk = function () {
   
    var ctx = this.ctx,
        rect        = this.trunk.rect,
        gradient    = this.trunk.gradient,
        gradientObj, i, len;

    if ( !Array.isArray(gradient) ) { return null; }

    for ( i = 0, len = gradient.length; i < len; i++ ) {
        gradientObj = _gradient(ctx, 
            gradient[ i ].points || gradient[ i ],
            gradient[ i ].styles || gradient[ i ]
        );

        ctx.fillStyle = gradientObj;
        ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
    }
};

Tree.prototype.createTreeBranch = function () {
    
    var me = this,
        ctx = this.ctx,
        scale = me.scale;

    ctx.strokeStyle = me.branch.strokeStyle;
    ctx.lineJoin    = 'round';
    ctx.lineWidth   = 4;
    ctx.fillStyle = me.branch.fillStyle;
    ctx.beginPath();

    // 右侧
    ctx.moveTo(-25 * scale, 80 * scale);
    ctx.lineTo(25 * scale, 80 * scale);
    ctx.lineTo(10 * scale, 40 * scale);
    ctx.lineTo(20 * scale, 40 * scale);
    ctx.lineTo(5 * scale, 0 * scale);
    ctx.lineTo(10 * scale, 0 * scale);

    // 顶点
    ctx.lineTo(0 * scale, -50 * scale);

    // 左侧
    ctx.lineTo(-10 * scale, 0 * scale);
    ctx.lineTo(-5 * scale, 0 * scale);
    ctx.lineTo(-20 * scale, 40 * scale);
    ctx.lineTo(-10 * scale, 40 * scale);

    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}


function isObject( obj ) {
    
    return Object.prototype.toString.call( obj ) === '[object Object]';
}