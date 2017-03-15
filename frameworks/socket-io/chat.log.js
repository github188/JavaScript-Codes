/**
 * 聊天记录
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-06 11:52:25
 * @version $Id$
 */

var 
	timeConnectChar = '@',
	msgConnectChar 	= '&:'; 

var logger = {
	lizc: [

		'fll@2017/3/6 12:04:33&:"hello fll 33"',
		'fll@2017/3/7 12:04:33&:"hello fll 44"',
		'fll@2017/3/8 12:04:33&:"hello fll 55"',
	],
	fll: [
		'lizc@2017/3/6 12:04:33&:"hello lizc 33"',
		'lizc@2017/3/7 12:04:33&:"hello lizc 44"',
		'lizc@2017/3/8 12:04:33&:"hello lizc 55"',
	]
};

// exports
function log( name, to, time, msg ) {
	
	var is_exist 	= false,
		chatee 		= null,
		msg_obj 	= {},
		msg_log 	= '';

	if ( !name || !time || !msg || !to ) { return false; }

	debug( name );
	is_exist = !!logger.hasOwnProperty( name );

	if ( is_exist ) {
		chatee = logger[ name ];
	} else {
		logger[ name ] = [];
		chatee = logger[ name ];
	}

	msg_obj = {
		name: name,
		to 	: to,
		time: time,
		msg : msg
	};

	msg_log = concat( msg_obj );

	chatee.push( msg_log );
}

// 组织消息
function concat( msg_obj ) {
	
	if ( !msg_obj ) { return ''; }

	return ( ''
		+ msg_obj.to + timeConnectChar
		+ msg_obj.time + msgConnectChar
		+ '"' + msg_obj.msg + '"'
	);

}

function del( name ) {

	if ( !name ) { return false; }

	if ( ! logger.hasOwnProperty( name ) ) { return false; }

	delete( logger[ name ] );
}

function add( name, to, time, msg ) {
	
	if ( !name || !time || !msg || !to ) { return false; }

	log( name, to, time, msg );
}

function find( name, to ) {
	
}

function parse() {
	
}

function getNames() {
	
}

function getListener( name ) {
	
}

function getLog( name ) {
	
	if ( !name ) { return logger; }

	if ( !logger.hasOwnProperty( name ) ) { return null; }

	return logger[ name ];
}

function timeFormat( d ) {

	if ( ! ( d instanceof Date ) ) { return false; }

	return ( ''
		+ d.getFullYear() 		+ '/'
		+ ( d.getMonth() + 1 ) 	+ '/'
		+ d.getDate() 			+ ' '
		+ ( d.getHours() - 8 ) 	+ ':'
		+ d.getMinutes() 		+ ':'
		+ d.getSeconds()
	);
}


// test
(function () {

	add( 'lwy', 'fll', timeFormat( new Date() ), 'hi mami!' );

	debug( logger );
	debug( '\n' );

}());


function debug( str ) {
	console.log( str );
}

module.exports = {
	getLog 	: getLog
};