/**
 * 
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-08-26 08:58:02
 * @version $Id$
 */

(function () {



	// 防止框架关键字冲突
	var _jQuery = window.jQuery,
		_$  	= window.$;

	var version 	= "0.0.1",
		// jQuery Object
		jQuery 		= function (selector) {
			// 这里不能直接使用new jQeury()，会造成死循环
			// 所以采用jQuery原型中的方法去创建自身 
			return new jQuery.fn.init(selector);	  
		};


	// 定义fn指向原型，方便后面使用，而不是直接使用prototype
	jQuery.fn = jQuery.prototype = {
		jquery: version,
		// 采用字面量方式重新定义原型对象，会造成constructor丢失情况
		// 所以需要指定构造器对象
		constructor: jQuery,    // redefine constructor

		setBackgroundColor: function ( color ) {
			this[0].style.backgroundColor = color;

			return this;
		},

		setColor: function ( color ) {
			this[0].style.color = color;

			return this;
		}

	};


	// jQuery对象真正创建的地方
	var init = jQuery.fn.init = function (selector) {
		if (!selector) {
			return;
		} else {
			var elem = document.querySelector(selector);
			if (elem) {
				this[0] = elem;
				this.length = 1;
			}

			// 返回自身，支持链式写法
			return this;
		}
	};

	// 将jQuery原型里的init对象的原型指向jQuery原型，防止在通过jQuery.*
	// 去访问jQuery原型中的对象时找不到的问题，因为jQuery是通过new jQuery.fn.init()
	// 去间接创建的；要找到jQuery.*，首先会去找init()这个里面，找不到就会去找init.prototype
	// 如果不将init.prototype指向jQuery原型就会出现找不到的情况。
	init.prototype = jQuery.fn;

	/*
		查找过程
	 	
		$(selector).jquery -> 
		window.$ -> 
		window.jQuery -> 
		找构造器jQuery，而这里面是由new jQuery.fn.init()而来 -> 
		找jQuery.fn -> 
		jQuery.fn是指向jQuery原型的即：
		jQuery.prototype ->
		jQuery.fn.init找到 -> 
		在init里找jquery，没有 -> 
		init.prototype -> 
		jQuery.fn -> 
		jQuery.prototype ->
		找到jquery
	 */

	// 扩展，原型扩展
	jQuery.extend = jQuery.fn.extend = function () {
		 console.log(this); 
	}



	// 冲突处理，即把在_$和_jQuery里保存的原始的jQuery和$还原回去
	jQuery.noConflict = function ( deep ) {

		// 加上判断是确保，window.$不会被重复改写
		if ( deep && window.$ === jQuery ) {
			window.$ = _$;
		}

		// 加上判断是确保，window.jQuery不会被重复改写
		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};


	// 给全局的window对象的jQuery创建闭包内的jQuery对象
	window.$ = window.jQuery = jQuery;

})();