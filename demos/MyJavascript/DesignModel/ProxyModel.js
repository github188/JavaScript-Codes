
/**
 * 
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-10-17 09:29:16
 * @version $Id$
 */


var girl = function ( name ) {
	this.name = name;
};

var boy = function ( girl ) {
	this.girl = girl;
	this.sendGift = function ( gift ) {
		console.log("I send " + this.girl + " a gift is " + gift);
	};
};

var proxy = function ( girl ) {
	this.girl = girl;
	this.sendGift = function ( gift ) {
		(new boy( this.girl )).sendGift( gift );  // 代理方法里，调用被代理对象的方法
	};
};


// 使用

// 1. 创建代理，传入要操作的对象，隐藏了实际操作对象boy
var proxy = new proxy( new girl('爱丽丝') );
proxy.sendGift( 'flowers' );