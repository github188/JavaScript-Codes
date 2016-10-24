import { class2type, toString, getProto, hasOwn, fnToString, ObjectFunctionString } from './var.js';

var version = "0.0.1",
      jQuery = function (selector, context) {

          return new jQuery.fn.init(selector, context);
      };



jQuery.fn = jQuery.prototype = {
    jquery: version,
    constructor: jQuery,
    setBackground: function(){
        this[0].style.background = 'yellow';
        return this
    },
    setColor: function(){
        this[0].style.color = 'blue';
        return this
    }
};

jQuery.extend = jQuery.fn.extend = function () {
	/*
		根据参数去判断，是否需要深拷贝，一般第一个参数如果是Boolean型，
		则指定拷贝类型，然后第二个参数才是要拷贝的对象
	 */
	var options, name, clone, copy, src, copyIsArray, 
		target = arguments[0] || {}, // 被拷贝的对象
		i = 1,
		length = arguments.length,
		deep = false;


	// 第一参数为布尔型，则为是否深拷贝
	if ( typeof target === 'Boolean' ) {
		deep = target;

		// 被拷贝的对象往后挪
		target = arguments[i] || {};
		i++;
	}

	// target为非对象处理 [MOD-1]
	if ( typeof target !== 'object' && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// target 后没有参数了，则扩展jQuery自身
	if ( i === length ) {
		target = this;
		i--; // 回去取最初的target，因为此时target成了被拷贝的对象了
	}


	// 拷贝过程
	for ( ; i < length; i++ ) {
		// 开始拷贝

		// 只处理源对象不为 null/undefined 情况
		if ( ( options = arguments[ i ] ) != null ) {
			// 真正开始扩展，进行拷贝的地方
			
			for ( name in options ) {
				src = target[ name ]; // 源对象属性
				copy = options[ name ]; // 被拷贝的对象属性

				// 避免自己合自己导致死循环
				if ( src === copy ) {
					continue;
				}

				// [MOD-2]
				if ( deep && copy && ( jQuery.isPlainObject( copy ) || 
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					// 数组
					if ( copyIsArray ) {
						copyIsArray = false;

						// 被合并的对象不是数组，则设置为数组
						clone = src && jQuery.isArray( src ) ? src : [];
					} else { // 对象

						// 被合并对象不是对象，则设置为对象
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// 递归直到最内层的属性值为非对象，再保存属性值
					target [ name ] = jQeury.extend( deep, clone, copy );
				} else if ( copy !== undefined ) { // 前拷贝或者非对象或非数组
					target[ name ] = copy;
				}
			}
		}
	}

	// 返回修改后的目标对象
	return target;
};

//新增修改点1，class2type注入各JS类型键值对，配合 jQuery.type 使用，后面会用上
"Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(name){
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// [new mod 2]
// 扩展工具函数对象
jQuery.extend( {
	isArray: Array.isArray,
	isPlainObject: function ( obj ) {
		var proto, Ctor;

		// 非对象判断
		if ( !obj || ( toString.call( obj ) !== '[object Object]' ) ) {
			return false;
		}

		// 获取prototype
		proto = getProto( obj );

		// 因为通过 {} 字面量创建的对象是没有prototype的
		if ( !proto ) {
			return true;
		}

		// 简单对象的构造函数等于最顶层Object的构造函数
		Ctor = hasOwn.call( proto, 'constructor' ) && proto.constructor;

		// 由于PlainObject为 {} 或者通过new创建的对象
		// 上面已经通过prototype属性判断了是否为 {} 形式创建的对象，因为{}创建的对象是没有原型的
		// 这里的判断是通过new 创建的对象
		// 	1. 首先函数，有原型prototype，原型里有构造函数constructor，通过上面一句获取出的是函数
		// 	   的构造函数，如果没有则为'false'(按逻辑值是不会为false的)，下面也就返回false，
		// 	2. 上面成立，则会Ctor就会保存原型中的构造函数对象，那么Ctor的typeof也就是'function'，
		// 	   下面的&&前面是成立的，&&后面是从类型对象中去寻找是否有'function'的类型，找到了与
		// 	   'Object'对象调用'toString'后的结果相比较
		return typeof Ctor === 'function' && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isFunction: function ( obj ) {
		return jQuery.type( obj ) === 'function';
	},

	// 获取类型
	type: function ( obj ) {
		if ( obj == null ) {
			return obj + ""; // undefined or null
		}

		return ( typeof obj === 'object' || typeof obj === 'function' )  // 非基础类型
				// 在类型对象中找不到标识方式，则直接用'object'
				? class2type[ toString.call( obj ) ] || 'object' 
				// 基础类型，直接用typeof即可
				: typeof obj;
	}
} );


export default jQuery;