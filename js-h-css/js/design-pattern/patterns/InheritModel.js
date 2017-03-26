/**
 *  Javascript 继承模式
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-11-09 08:56:45
 * @version $Id$
 */




function Parent() {
	this.name = "lizc";
}

Parent.prototype.say = function () {
	console.log( this.name );
};

function Child() {
	
}

/**
 * 一、普通类式继承
 *
 * 子对象原型指向父对象实例
 *
 * 缺点：
 * 1. 每次创建继承关系，都需要创建父对象实例
 * 2. 父子对象原型都指向同一个原型：父对象原型，导致子对象的修改直接影响父对象原型
 */
function inherit( C, P ) {
	Child.prototype = new Parent();
}

/**
 * 二、构造函数继承
 *
 * 这种继承方式，最后用 new Child() 创建出来的对象事实上还是调用Parent()的结果
 *
 * 优点：
 * 1. 这种方式的创建，会直接拷贝父对象构造函数真实副本，因此对父对象本身没有影响
 *
 * 缺点：
 * 1. 由于是拷贝副本，因此并不存在原型链，即无法通过原型从父对象继承任何东西
 */
function Child() {
	Parent.apply( this, arguments );	
}

var child = new Child();

/**
 * 三、构造函数继承优化：借用和设置原型
 *
 * 构造函数继承导致子对象无法继承自父对象原型中的内容，通过重新设置子对象原型
 * 到父对象实例，解决了该问题
 *
 * 缺点：
 * 1. 父对象构造函数被使用了两次，效率低下，且子对象自身的属性会被继承两次，一个
 * 是自身属性，一个来自父对象原型中的属性
 */
function Child () {
	Parent.apply( this, arguments );	 
}

Child.prototype = new Parent();

/**
 * 四、原型继承
 *
 * 该继承方式直接让子对象原型指向父对象原型，减少了查询过程，
 *
 *
 * 缺点：
 * 1. 子对象上的修改会直接导致父对象原型发生变化
 */
function inherit( C, P ) {
	C.prototype = P.prototype;	
}

/**
 * 五、构造函数代理模式
 *
 * 通过在子对象和父对象之间通过代理构造函数来建立联系
 *
 * 优点：
 * 1. 断开子对象和父对象之间的直接联系
 *
 * 缺点：
 * 1. 通过该方式每次创建继承关系都会重复创建F实例
 */
function inherit( C, P ) {
	var F = function () {};

	F.prototype = P.prototype; // 让 F 通过原型继承自 父对象 P
	// 让子对象 C 继承自 F 的实例，通过实例找到F原型然后找到P原型
	// 建立原型链 C.prototype -> new F -> F.prototype -> P.prototype
	C.prototype = new F(); 
	// C的原型发生变化指向了F实例，此处将原型中的构造函数还原为C
	C.prototype.constructor = C;
	// 子对象中保存父对象的引用，类似Java中的super对象
	C.uber = P.prototype;
}

/**
 * 六、构造函数代理模式优化，使用闭包限制代理实例的重复创建
 */
var inherit = (function ( ) {
	var F = function () {};

	return function ( C, P ) {
		F.prototype = P.prototype;
		C.prototype = new F();
		C.prototype.constructor = C;
		C.uber = P.prototype;
	};
}() );

/*********************************** InheritModel.js END ***********************************/