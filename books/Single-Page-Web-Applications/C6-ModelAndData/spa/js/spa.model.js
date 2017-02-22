/**
 * 模型模块
 * 
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-02-13 09:28:15
 * @version $Id$
 */

spa.model = (function () {

	'use strict';

	var 
		configMap = {
			anon_id 	: 'a0'
		},

		stateMap = {
			anon_user 		: null,
			cid_serial 	 	: 0,
			people_cid_map	: {}, 		// 根据 cid 缓存的人物对象
			people_db 		: TAFFY(), // 创建空数据集合
			user 			: null
		},

		isFakeData = true,

		personProto, makePerson, people, initModule,

		makeCid, clearPeopleDb, completeLogin, removePerson
		;

	// 人物原型	
	personProto = {
		get_is_user: function () {
			return this.cid === stateMap.user.cid;	
		},

		get_is_anon: function () {
			return this.cid === stateMap.anon_user.cid;	
		}
	};
	
	makeCid = function () {
		return 'c' + String( stateMap.cid_serial++ );	
	};

	clearPeopleDb = function () {
		var user = stateMap.user;

		stateMap.people_db 		= TAFFY();
		stateMap.people_cid_map = {};
		if ( user ) {
			stateMap.people_db.insert( user );
			stateMap.people_cid_map[ user.cid ] = user;
		}	
	};

	// 服务器返回用户登录成功信息时调用
	completeLogin = function ( user_list ) {
		
		var user_map = user_list[ 0 ];
		delete stateMap.people_cid_map[ user_map.cid ];
		stateMap.user.cid 		= user_map._id;
		stateMap.user.id 		= user_map._id;
		stateMap.user.css_map 	= user_map.css_map;
		stateMap.people_cid_map[ user_map._id ] = stateMap.user;

		$.gevent.publish( 'spa-login', [ stateMap.user ] );	
	};


	makePerson = function ( person_map ) {
		
		var 
			person,
			cid 	= person_map.cid,
			css_map = person_map.css_map,
			id 		= person_map.id,
			name 	= person_map.name;

		if ( cid === undefined || !name ) {
			throw 'client id and name required';	
		}

		person = Object.create( personProto );
		person.cid 		= cid;
		person.name 	= name;
		person.css_map 	= css_map;

		if ( id ) { person.id = id; }

		// 缓存新建对象
		stateMap.people_cid_map[ cid ] = person;

		// 插入到 taffy 数据库中
		stateMap.people_db.insert( person );

		return person;
	};

	// 删除用户，主要做两件事：
	// 1. 从数据库 people_db 中删除用户
	// 2. 从用户缓存 people_cid_map 中删除用户，根据 cid
	removePerson = function ( person ) {
		
		if ( !person ) { return false; }

		if ( person.id === configMap.anon_id ) {
			return false;
		}	

		stateMap.people_db({ cid: person.cid }).remove();
		if ( person.cid ) {
			delete stateMap.people_cid_map[ person.cid ];
		}

		return true;
	};

	people = (function () {

		var 
			get_by_cid, get_db, get_user, login, logout;

		get_by_cid = function ( cid ) {
			
			return stateMap.people_cid_map[ cid ];	
		};

		get_db = function () {
			return stateMap.people_db;
		};

		get_user = function () {
			return stateMap.user;	
		};

		login = function ( name ) {
			
			// Socket.io	
			var sio = isFakeData ? spa.fake.mockSio : spa.data.getSio();	

			stateMap.user = makePerson({
				cid 		: makeCid(),
				css_map 	: { top: 25, left: 25, 'background-color': '#8f8' },
				name 		: name
			});

			// 监听后端登录过程中的 userupdate 消息
			sio.on( 'userupdate', completeLogin );

			sio.emit( 'adduser', {
				cid 	: stateMap.user.cid,
				css_map : stateMap.user.css_map,
				name 	: stateMap.user.name
			} );
		};

		logout = function () {
			
			var
				is_removed, user = stateMap.user;

			// 注销后成为匿名用户
			is_removed 		= removePerson( user );
			stateMap.user 	= stateMap.anon_user;	

			return is_removed;
		};

		return {
			get_by_cid 	: get_by_cid,
			get_db 		: get_db,
			get_user 	: get_user,
			login 		: login,
			logout 		: logout
		};
	}());

	initModule = function () {
		
		var 
			i, len, people_list, person_map;

		stateMap.anon_user = makePerson({
			cid 	: configMap.anon_id,
			id 		: configMap.anon_id,
			name 	: 'anonymous'
		});

		stateMap.user = stateMap.anon_user;

		// 模拟数据
		if ( isFakeData ) {
			people_list = spa.fake.getPeopleList();
			for ( i = 0, len = people_list.length; i < len; i++ ) {
				person_map = people_list[i];
				makePerson({
					cid 	: person_map._id,
					id 		: person_map._id,
					css_map : person_map.css_map,
					name 	: person_map.name
				});
			}
		}
	};

	return {
		initModule 	: initModule,
		people 		: people
	};
}());