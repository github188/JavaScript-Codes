/**
 * 虚拟数据模块
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-14 14:37:23
 * @version $Id$
 *
 * 2017/2/14 16:46:39
 *
 * 添加：模拟 Socket.io 登入登出
 */


spa.fake = (function () {

	'use strict';

	var getPeopleList, 

		// 模拟 Socket.io
		fakeIdSerial, makeFakeId, mockSio;

	fakeIdSerial = 5;

	makeFakeId = function () {
		return 'id_' + String( fakeIdSerial++ );
	};

	getPeopleList = function () {
		
		return [
			{
				name 	: 'Betty',
				_id 	: 'id_01',
				css_map : {
					top 	: 20,
					left 	: 20,
					'background-color' 	: 'rgb( 128, 128, 128 )'
				}
			},

			{
				name 	: 'Mike',
				_id 	: 'id_02',
				css_map : {
					top 	: 60,
					left 	: 20,
					'background-color' 	: 'rgb( 128, 255, 128 )'
				}
			},

			{
				name 	: 'Pebbles',
				_id 	: 'id_03',
				css_map : {
					top 	: 100,
					left 	: 20,
					'background-color' 	: 'rgb( 128, 192, 192 )'
				}
			},

			{
				name 	: 'Wilma',
				_id 	: 'id_04',
				css_map : {
					top 	: 140,
					left 	: 20,
					'background-color' 	: 'rgb( 192, 128, 128 )'
				}
			}
		];	
	};

	mockSio = (function () {
		
		var 	
			on_sio, emit_sio, callback_map = {};


		// 类似事件注册，给消息注册一个消息处理句柄
		on_sio = function ( msg_type, callback ) {
			callback_map[ msg_type ] = callback;	
		};

		// 模拟向服务器发送消息，并且在响应成功后调用回调
		emit_sio = function ( msg_type, data ) {
		
			// 用 userupdate 去响应 adduser 事件

			if ( msg_type === 'adduser' && callback_map.userupdate ) {
				setTimeout(function () {
					callback_map.userupdate([{
						_id 	: makeFakeId(),
						name 	: data.name,
						css_map : data.css_map
					}]);
				}, 3000 );
			}	
		};

		return {
			emit 	: emit_sio,
			on 		: on_sio
		};
	}());

	return {
		getPeopleList 	: getPeopleList,
		mockSio 		: mockSio
	};	
}());