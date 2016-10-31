import { class2type, toString, getProto, hasOwn, fnToString, ObjectFunctionString, slice } from './var.js';

var version = "0.0.1",
      jQuery = function (selector, context) {

          return new jQuery.fn.init(selector, context);
      };



jQuery.fn = jQuery.prototype = {
    jquery: version,
    length: 0, // 增加长度属性，方便数组到类数组对象的转换
    constructor: jQuery,
    
   	/**
   	 * 入栈操作
   	 *
   	 * @param  {[Array]} elems [DOM元素数组]
   	 * @return {[type]}       [description]
   	 */
    pushStack: function ( elems ) {

    	// elems数组转成类数组对象
    	var ret = jQuery.merge( this.constructor(), elems );

    	// 关系链处理，新jQuery对象的属性指向旧的对象
    	// 达到保存前一个对象的功能
    	ret.preObject = this;

    	return ret;
    },


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

	// 将数组转成类数组对象
	merge: function ( first, second ) {

		var len = +second.length,
			j = 0,
			i = first.length; // 被扩展的对象的长度属性

		for ( ; j < len; j++ ) {
			// 用被扩展对象的长度属性值自加作为键，
			// 值为对应的被合并的数组中的元素
			first[ i++ ] = second[ j ];
		}

		// 更新被扩展的对象长度属性值
		first.length = i;

		// 返回扩展后的对象
		return first;
	},

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



jQuery.fn.extend( {
	end: function ( ) {
		return this.preObject || this.constructor();
	},

	// 返回的是jQuery对象
	eq: function ( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );

		// 容错处理，如果 i 超出范围直接返回'[]'
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	// 返回DOM对象
	get: function ( num ) {
		return num != null 
			// 支持倒序
			? ( num < 0 ? this[ num + this.length ] : this[ num ] )
			// 找不到时返回个空数组
			: slice.call( this );
	},

	first: function () {
		return this.eq( 0 );
	},

	last: function () {
		return this.eq( -1 );
	},

	find: function ( selector ) { // 链式支持find
		var i, ret,
			len = this.length,
			self = this;

		// 先进行入栈，保存下原先的对象
		// 执行下入栈作用主要有二：
		// 1. 元素数组转换成类数组对象；
		// 2. 保存查找之前的对象；
		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[i], ret );
		}

		// 也可以在返回之前执行入栈处理
		// 比如：return this.pushStack( ret );
		// 但是在这里执行的时候 ret 里面可能包含了多个DOM元素对象了
		// 操作起来肯定比在前面使用 '[]' 时执行耗时，性能相对较差
		return ret;
	}
} );


export default jQuery;