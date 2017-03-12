
/**
 * 
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-10-17 09:29:16
 * @version $Id$
 */


var girl = function ( name ) {
	this.name = name;
};

var boy = function ( girl ) {
	this.girl = girl;
	this.sendGift = function ( gift ) {
		console.log("I send " + this.girl + " a gift is " + gift);
	};
};

var proxy = function ( girl ) {
	this.girl = girl;
	this.sendGift = function ( gift ) {
		(new boy( this.girl )).sendGift( gift );  // 代理方法里，调用被代理对象的方法
	};
};


// 使用

// 1. 创建代理，传入要操作的对象，隐藏了实际操作对象boy
var proxy = new proxy( new girl('爱丽丝') );
proxy.sendGift( 'flowers' );



/***************** test 代理模式 test ***************/
function $( id ) {
	return document.getElementById( id );
}

$( 'vids' ).onclick = function ( e ) {
	var src, id;

	e = e || window.event;
	src = e.target || e.srcElement;

	if ( src.nodeName !== "A" ) {
		return;
	}

	if ( typeof e.preventDefault === "function" ) {
		e.preventDefault();
	}
	e.returnValue = false;

	id = src.href.split( '--' )[1];

	if ( src.className === "play" ) {
		src.parentNode.innerHTML = videos.getPlayer( id );
		return ;
	} 

	src.parentNode.id = "v" + id;
	videos.getInfo( id );
};

$( 'toggle-all' ).onclick = function ( e ) {
	var hrefs, i, max, id;

	hrefs = $( 'vids' ).getElementsByTagName( 'a' );
	for ( i = 0, max = hrefs.length; i < max; i++ ) {
		if ( hrefs[i].className === "play" ) {
			continue;
		} 

		if ( !hrefs[i].parentNode.firstChild.checked ) {
			continue;
		} 

		id = hrefs[i].href.split( '--' )[1];
		hrefs[i].parentNode.id = "v" + id;
		videos.getInfo( id );
	}
};

var videos = {
	getPlayer: function ( id ) {},
	updateList: function ( data ) {},

	getInfo: function ( id ) {
		var info = $( 'info' + id );

		if ( !info ) {
			http.makeRequest( [ id ], "videos.updateList" );
			return;
		} 

		if ( info.style.display === "none" ) {
			info.style.display = '';
		} else {
			info.style.display = 'none';
		}
	}
};

var http = {
	makeRequest: function ( ids, callback ) {
		var url = 'http://query.yahoopis.com/v1/public/yql?q=',
			sql = 'select * from music.video.id where ids IN ("%ID%")',
			format = "format=json",
			handler = "callback=" + callback,
			script = document.createElement( 'script' );

		sql = sql.replace( '%ID%', ids.join('","') );
		sql = encodeURIComponent( sql );

		url += sql + '&' + format + '&' + handler;
		script.src = url;

		document.body.appendChild( script );
	}
};

var proxy = {
	ids: [],
	delay: 50,
	timeout: null,
	callback: null,
	context: null,
	cache: [], // 缓存数据
	makeRequest: function ( id, callback, context ) {

		this.ids.push( id );

		this.callback 	= callback;
		this.context 	= context;

		if ( !this.timeout ) {
			this.timeout = setTimeout( function () {
				proxy.flush();
			}. this.delay );
		}
	},

	flush: function () {

		http.makeRequest( this.ids, "proxy.handler" );

		this.timeout = null;
		this.ids = [];
	},

	handler: function ( data ) {
		var i, max;

		// single video
		if ( parseInt( data.query.count, 10 ) === 1 ) {
			proxy.callback.call( proxy.context, data.query.results.Video );
			return;
		}

		// multi videos
		for ( i = 0, max = data.query.results.Video.length; i < max; i++ ) {
			proxy.callback.call( proxy.context, data.query.results.Video[ i ] );
		}
	}
};