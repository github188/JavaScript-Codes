/**
 * 模块通用方法
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-13 09:29:29
 * @version $Id$
 */

spa.util = (function () {

	var 
		makeError, setConfigMap;

	/**
	 * 创建错误对象
	 * @param  {String} name_text 错误名称
	 * @param  {String} msg_text  错误消息内容
	 * @param  {Object} data      错误对象数据
	 * @return {Error}            错误对象
	 */
	makeError = function ( name_text, msg_text, data ) {
		
		var error = new Error();

		error.name 		= name_text;
		error.message 	= msg_text;

		if ( data ) { error.data = data }

		return error;
	};
	

	setConfigMap = function ( arg_map ) {
		
		var 
			input_map 		= arg_map.input_map,
			settable_map 	= arg_map.settable_map,
			config_map 		= arg_map.config_map,
			key_name, error;

		for ( key_name in input_map ) {
			if ( input_map.hasOwnProperty( key_name ) ) {
				if ( settable_map.hasOwnProperty( key_name ) ) {
					config_map[key_name] = input_map[key_name];
				} else {

					error = makeError( 'Bad Input', 
						'Setting config key |' + key_name + '| is not supported'
					);

					throw error;
				}
			}
		}
	};

	return {
		makeError 		: makeError,
		setConfigMap 	: setConfigMap
	};
}());