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

	var 
		peopleList, 

		getPeopleList, 

		// 模拟 Socket.io
		fakeIdSerial, makeFakeId, mockSio, emit_mock_msg;

	fakeIdSerial = 5;

	peopleList = [
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

	makeFakeId = function () {
		return 'id_' + String( fakeIdSerial++ );
	};

	getPeopleList = function () {
		
		return peopleList;
	};

	mockSio = (function () {
		
		var 	
			on_sio, emit_sio, 

			send_listchange, listchange_idto,

			callback_map = {}
			;


		// 类似事件注册，给消息注册一个消息处理句柄
		on_sio = function ( msg_type, callback ) {
			callback_map[ msg_type ] = callback;	
		};

		// 模拟向服务器发送消息，并且在响应成功后调用回调
		emit_sio = function ( msg_type, data ) {
		
			var person_map, i, len;

			// 用 userupdate 去响应 adduser 事件

			if ( msg_type === 'adduser' && callback_map.userupdate ) {
				setTimeout(function () {

					person_map = {
						_id 	: makeFakeId(),
						name 	: data.name,
						css_map : data.css_map
					};

					peopleList.push( person_map );

					callback_map.userupdate([ person_map ]);
				}, 3000 );
			}

			if ( msg_type === 'updatechat' && callback_map.updatechat ) {
				setTimeout( function () {
					var user = spa.model.people.get_user();
					callback_map.updatechat([{
						dest_id 	: user.id,
						dest_name 	: user.name,
						sender_id 	: data.dest_id,
						mst_text 	: 'Thanks for the note, ' + user.name
					}]);
				}, 2000 );
			}

			if ( msg_type === 'leavechat' ) {
				delete callback_map.listchange;
				delete callback_map.updatechat;

				if ( listchange_idto ) {
					clearTimeout( listchange_idto );
					listchange_idto = undefined;
				}

				send_listchange();
			}

			if ( msg_type === 'updateavatar' && callback_map.listchange ) {
				for ( i = 0, len = peopleList.length; i < len; i++ ) {
					if ( peopleList[ i ]._id === data.person_id ) {
						peopleList[ i ].css_map = data.css_map;
						break;
					}
				}

				callback_map.listchange([ peopleList ]);
			}
		};

		emit_mock_msg = function () {
			setTimeout(function () {
				var user = spa.model.people.get_user();
				if ( callback_map.updatechat ) {
					callback_map.updatechat([{
						dest_id 	: user.id,
						dest_name 	: user.name,
						sender_id 	: 'id_04',
						msg_text 	: 'Hi there ' + user.name + '! Wilma here.'
					}]);
				} else {
					emit_mock_msg();
				}
			}, 8000);	
		};

		send_listchange = function () {
			listchange_idto = setTimeout( function () {
				if ( callback_map.listchange ) {
					callback_map.listchange([ peopleList ]);
					emit_mock_msg();
					listchange_idto = undefined;
				} else {
					send_listchange();
				}
			}, 1000 )	
		};

		send_listchange();

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