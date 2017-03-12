/**
 *	第一章实例代码
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-06 17:42:51
 * @version $Id$
 */

/**
 * 1. 创建类模拟库
 *
 * 原理：Class 模拟类中，创建一个 klass 对象（函数），返回
 * 当前对象的 init 方法，通过该 init 方法对模拟类进行一些列初始化工作
 */
var Class = function () {

	var klass = function () {
		this.init.apply(this, arguments);
	};

	klass.prototype.init = function () {

		console.log('klass test');
	};

	return klass;
};

// 创建 Person 类
var Person = new Class;

/*
	通过原型对 Person 类初始化（增加成员或方法）

	事实上，在通过 Person = new Class; 创建出 Person 类之后，

	Person.prototype.init 其实就是模拟类里面的 klass.prototype.init

	这里只不过是重写了 init，使其具备自己的初始化特性
 */ 
Person.prototype.init = function  () {
	  
	console.log('Person test');
};

/*
	然后就可以给 Person 类添加方法和成员，添加方式没什么不同

	直接给类添加，其实就是给该对象构造器添加了属性和方法
 */

Person.find = function (id) {
	return this.cname;
};

Person.cname = 'lizc';

/*
	也可以通过原型添加，这个时候在创建 Person 实例的时候调用的就是该 find
 */
Person.prototype.find = function (id) {
	return 'fll';
}

var p = new Person;

Person.find(1); // -> lizc
p.find(1); // -> fll

/*
	给类添加类和实例扩展：extend & include

	给类添加继承，即：将父类对象作为参数传给类模拟器
 */
var Class = function (parent) {

	var klass = function () {
		this.init.apply(this, arguments);	
	};

	// 继承
	if (parent) {

		var sub = function () {
			// 子类	
		};

		sub.prototype = parent.prototype;

		/*
			klass -> klass.prototype -> sub instance -> sub.prototype -> parent.prototype

			从而使 klass 通过原型继承自 parent
		*/
		klass.prototype = new sub; // sub -> sub.prototype
	}
	
	klass.prototype.init = function () {
		
		console.log('klass -- init');	
	};

	klass.fn = klass.prototype;

	// 添加代理
	klass.proxy = function (func) {
		
		var self = this;

		return (function () {
			return func.apply(self, arguments);
		});
	};

	klass.fn.parent = klass;

	klass._super = klass.__proto__;

	var transmit = function (srcObj, targetObj) {
	
		var transmited = srcObj.extended || srcObj.included;

		for (var prop in srcObj) {

			targetObj[prop] = srcObj[prop];
		}

		if (transmited) transmited(klass);
	};

	// 类扩展
	klass.extend = function (obj) {
		
		transmit(obj, klass);	
	};

	// 实例扩展
	klass.include = function (obj) {
		
		transmit(obj, klass.fn);
	};

	return klass;
};

// 使用
var Animal = new Class;

Animal.include({
	run: function () {
		console.log('animal running...');
	}
});

// 创建 Dog 子类，继承自 Animal
var Dog = new Class(Animal);

Dog.extend({
	run: function () {
		console.log('dog running...');
	}
});

// 新建 dog 实例
var dog1 = new Dog;

Dog.run(); // dog running...
dog1.run(); // animal running...


// 代理
var proxy = function (func, thisObj) {
	return (function () {
		return func.apply(thisObj, arguments);
	});
}