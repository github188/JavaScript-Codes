/**
 * URL 锚管理插件
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-14 09:42:28
 * @version $Id$
 */


(function ($) {
	
	$.uriAnchor = (function  () {
		
		var 
			// 配置容器
			configMap = {
				clean0_regex: /^[#!]*/,
				clean1_regex: /\?[^?]*/,

				schema_map: null
			},

			getErrorReject, getVarType, getCleanAnchorString,
			parseStringToMap, makeAnchorString;

		// 获取错误对象
		getErrorReject = function ( msgs ) {
		
			var error = new Error();

			error.name = 'Anchor Schema Reject';
			error.message = msgs;

			return error;
		};

		// 变量类型字符串
		getVarType = function ( data ) {
		
			if ( data === undefined ) {
				return 'Undefined';
			}

			if ( data === null ) {
				return 'Null';
			}

			// slice 之前得出结果：[object Object] 格式字符串，
			// 获取[] 中第二个单词，作为类型，slice(8 , -1)即：从 '[object '
			// 之后的'O'开始，到倒数第一个字符']'结束，但不包含最后一个字符，即
			// 得到的最后结果为：'Object'
			return Object.prototype.toString.call( data ).slice(8, -1);
		};

		// 该方法是将当前的URL后面的hash和参数清空
		getCleanAnchorString = function () {
		
			// 第一行作用，是将当前URL以'#'分割，其实就是取'#'之后的字符串	
			return String(document.location.href.split('#')[1] || '')
				// 将'!'替换掉，删除
				.replace(configMap.clean0_regex, '')
				// 去掉参数部分，即：'?'开头部分
				.replace(configMap.clean1_regex, '');

			// 最后得到结果其实就是不带'#!'的hash部分
			// 比如：'http://1.1.1.1/hello#!char=open?a=b' 最后得到的值为：'char=open'
		};

		// 这个方法其实就是将字符串转换成对象
		parseStringToMap = function ( arg_map ) {
			
			var 
				input_string 		= arg_map.input_string || '',
				delimit_char 		= arg_map.delimit_char || '&',
				delimit_kv_char 	= arg_map.delimit_kv_char || '=',

				splitter_array, key_val_array, i, len, kv_len,

				output_map = {};

			splitter_array = input_string.split( delimit_char );

			for ( i = 0, len = splitter_array.length; i < len; i++ ) {

				key_val_array = splitter_array[i].split(delimit_kv_char);

				kv_len = key_val_array.length;

				if ( kv_len === 1 ) { // 有键无值情况：a=&b=2 中的'a='
					output_map[decodeURIComponent(key_val_array[0])] = true;
				} else if ( kv_len === 2 ) { // 有键有值情况：a=&b=2 中的 'b=2'
					output_map[decodeURIComponent(key_val_array[0])] 
						= decodeURIComponent(key_val_array[1]);
				}

				// 最终得到结果：output_map 对象：{ a: true, b: 2 }
			}

		};

		makeAnchorString = function ( anchor_map_in, option_map_in ) {
		
			var 
				anchor_map 			= anchor_map_in || {},
				option_map 			= option_map_in || {},

				// 下面是自定义的分隔符
				delimit_char 		= option_map.delimit_char || '&',
				delimit_kv_char 	= option_map.delimit_kv_char || '=',
				sub_delimit_char 	= option_map.sub_delimit_char || ':',
				dep_delimit_char 	= option_map.dep_delimit_char || '|',
				dep_delimit_kv_char = option_map.dep_delimit_kv_char || ',',

				schema_map = configMap.schema_map,
				key_val_array = [],

				schema_map_val, schema_map_dep, schema_map_del_val,
				key_name, key_value, class_name, output_kv_string,
				sub_key_name, dep_map, dep_key_name, dep_key_value,

				dep_kv_array
				;

			if ( getVarType(anchor_map) !== 'Object' ) {
				return false;
			}

			// 先遍历第一层，即 anchor_map/anchor_map_in 对象
			for ( key_name in anchor_map ) {
				if ( anchor_map.hasOwnProperty( key_name ) ) {

					if ( !key_name ) { continue; }

					// 以下划线开头的键为依赖属性，直接过滤掉，比如：
					// { st: 'open', _st: 'open' }, 表示：st 需要依赖 _st 属性值
					if ( key_name.indexOf('_') === 0 ) { continue; }

					// 检测依赖的属性，在计划表里是否存在，且为真值
					// 这里应该在configMap配置对象里面就要先定义好,
					// 比如：chat 模块所依赖的属性值
					// { char: { opened: true, closed: true } }
					if ( schema_map ) {
						if ( !schema_map[key_name] ) {
							// 抛出错误异常
							throw getErrorReject('....TODO....');
						}
					}
				}
			}
		};


		return {};	  
	}());


}(jQuery));