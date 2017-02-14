/**
 * SPA 项目模块模版文件
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-13 08:56:54
 * @version $Id$
 */


spa.module = (function () {
	
	var 
		configMap = {

			main_html: '' 
				+ '<div>'
				+ 'Module Html'
				+ '</div>',

			settable_map: { color_name: true },

			color_name: 'blue'
		},

		stateMap = {
			$container: null
		},

		jqueryMap = {},

		setJqueryMap, configModule, initModule;


	/* ----------------------- BEGIN UTILITY METHODS ----------------------- */


	setJqueryMap = function () {
		
		var $container = stateMap.$container;

		jqueryMap = {
			$container: $container
		};	
	};

	/* ----------------------- END UTILITY METHODS ----------------------- */


	/* ----------------------- BEGIN DOM METHODS ----------------------- */
	/* ----------------------- END DOM METHODS ----------------------- */


	/* ----------------------- BEGIN EVENT METHODS ----------------------- */
	/* ----------------------- END EVENT METHODS ----------------------- */


	/* ----------------------- BEGIN PUBLIC METHODS ----------------------- */


	/**
	 * 配置允许访问的键值
	 * 
	 * @param  {Object} input_map 允许设置的属性的键值对
	 *
	 * configMap.settable_map 中保存了允许设置的属性
	 * 
	 * @return {[type]}           [description]
	 */
	configModule = function ( input_map ) {
		
		spa.util.setConfigMap({
			input_map 		: input_map,
			settable_map 	: configMap.settable_map,
			config_map 		: configMap
		});

		return true;
	};


	initModule = function ( $container ) {
		
		stateMap.$container = $container;

		setJqueryMap();

		return true;	
	};

	/* ----------------------- END PUBLIC METHODS ----------------------- */

	return {
		configModule 	: configModule,
		initModule 		: initModule
	};

});