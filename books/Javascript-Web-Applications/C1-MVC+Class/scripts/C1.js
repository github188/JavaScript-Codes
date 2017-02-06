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