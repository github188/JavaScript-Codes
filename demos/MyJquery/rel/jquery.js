(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.jQuery = factory());
}(this, (function () { 'use strict';

var class2type = {}; // 保存各类型的属性字符串

var toString = class2type.toString; // 等价于Object.prototype.toString()

var getProto = Object.getPrototypeOf;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString; // ==> Object.toString 或 Function.toString

var ObjectFunctionString = fnToString.call(Object); // PlainObject, 简单对象，通过{}或者new创建的对象

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var version = "0.0.1";
var jQuery$1 = function jQuery$1(selector, context) {

	return new jQuery$1.fn.init(selector, context);
};

jQuery$1.fn = jQuery$1.prototype = {
	jquery: version,
	constructor: jQuery$1,
	setBackground: function setBackground() {
		this[0].style.background = 'yellow';
		return this;
	},
	setColor: function setColor() {
		this[0].style.color = 'blue';
		return this;
	}
};

jQuery$1.extend = jQuery$1.fn.extend = function () {
	/*
 	根据参数去判断，是否需要深拷贝，一般第一个参数如果是Boolean型，
 	则指定拷贝类型，然后第二个参数才是要拷贝的对象
  */
	var options,
	    name,
	    clone,
	    copy,
	    src,
	    copyIsArray,
	    target = arguments[0] || {},
	    // 被拷贝的对象
	i = 1,
	    length = arguments.length,
	    deep = false;

	// 第一参数为布尔型，则为是否深拷贝
	if (typeof target === 'Boolean') {
		deep = target;

		// 被拷贝的对象往后挪
		target = arguments[i] || {};
		i++;
	}

	// target为非对象处理 [MOD-1]
	if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' && !jQuery$1.isFunction(target)) {
		target = {};
	}

	// target 后没有参数了，则扩展jQuery自身
	if (i === length) {
		target = this;
		i--; // 回去取最初的target，因为此时target成了被拷贝的对象了
	}

	// 拷贝过程
	for (; i < length; i++) {
		// 开始拷贝

		// 只处理源对象不为 null/undefined 情况
		if ((options = arguments[i]) != null) {
			// 真正开始扩展，进行拷贝的地方

			for (name in options) {
				src = target[name]; // 源对象属性
				copy = options[name]; // 被拷贝的对象属性

				// 避免自己合自己导致死循环
				if (src === copy) {
					continue;
				}

				// [MOD-2]
				if (deep && copy && (jQuery$1.isPlainObject(copy) || (copyIsArray = jQuery$1.isArray(copy)))) {

					// 数组
					if (copyIsArray) {
						copyIsArray = false;

						// 被合并的对象不是数组，则设置为数组
						clone = src && jQuery$1.isArray(src) ? src : [];
					} else {
						// 对象

						// 被合并对象不是对象，则设置为对象
						clone = src && jQuery$1.isPlainObject(src) ? src : {};
					}

					// 递归直到最内层的属性值为非对象，再保存属性值
					target[name] = jQeury.extend(deep, clone, copy);
				} else if (copy !== undefined) {
					// 前拷贝或者非对象或非数组
					target[name] = copy;
				}
			}
		}
	}

	// 返回修改后的目标对象
	return target;
};

//新增修改点1，class2type注入各JS类型键值对，配合 jQuery.type 使用，后面会用上
"Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function (name) {
	class2type["[object " + name + "]"] = name.toLowerCase();
});

// [new mod 2]
// 扩展工具函数对象
jQuery$1.extend({
	isArray: Array.isArray,
	isPlainObject: function isPlainObject(obj) {
		var proto, Ctor;

		// 非对象判断
		if (!obj || toString.call(obj) !== '[object Object]') {
			return false;
		}

		// 获取prototype
		proto = getProto(obj);

		// 因为通过 {} 字面量创建的对象是没有prototype的
		if (!proto) {
			return true;
		}

		// 简单对象的构造函数等于最顶层Object的构造函数
		Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;

		// 由于PlainObject为 {} 或者通过new创建的对象
		// 上面已经通过prototype属性判断了是否为 {} 形式创建的对象，因为{}创建的对象是没有原型的
		// 这里的判断是通过new 创建的对象
		// 	1. 首先函数，有原型prototype，原型里有构造函数constructor，通过上面一句获取出的是函数
		// 	   的构造函数，如果没有则为'false'(按逻辑值是不会为false的)，下面也就返回false，
		// 	2. 上面成立，则会Ctor就会保存原型中的构造函数对象，那么Ctor的typeof也就是'function'，
		// 	   下面的&&前面是成立的，&&后面是从类型对象中去寻找是否有'function'的类型，找到了与
		// 	   'Object'对象调用'toString'后的结果相比较
		return typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString;
	},

	isFunction: function isFunction(obj) {
		return jQuery$1.type(obj) === 'function';
	},

	// 获取类型
	type: function type(obj) {
		if (obj == null) {
			return obj + ""; // undefined or null
		}

		return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function' ? // 非基础类型
		// 在类型对象中找不到标识方式，则直接用'object'
		class2type[toString.call(obj)] || 'object'
		// 基础类型，直接用typeof即可
		: typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
	}
});

var global$1 = function global$1(jQuery) {
    //走模块化形式的直接绕过
    if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && typeof module.exports !== 'undefined') return;

    var _jQuery = window.jQuery,
        _$ = window.$;

    jQuery.noConflict = function (deep) {
        //确保window.$没有再次被改写
        if (window.$ === jQuery) {
            window.$ = _$;
        }

        //确保window.jQuery没有再次被改写
        if (deep && window.jQuery === jQuery) {
            window.jQuery = _jQuery;
        }

        return jQuery; //返回 jQuery 接口引用
    };

    window.jQuery = window.$ = jQuery;
};

var init = function init(jQuery) {
    jQuery.fn.init = function (selector, context, root) {
        if (!selector) {
            return this;
        } else {
            var elem = document.querySelector(selector);
            if (elem) {
                this[0] = elem;
                this.length = 1;
            }
            return this;
        }
    };

    jQuery.fn.init.prototype = jQuery.fn;
};

global$1(jQuery$1);
init(jQuery$1);

return jQuery$1;

})));
