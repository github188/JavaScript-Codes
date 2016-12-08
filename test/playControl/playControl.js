

var lines = 8;
var pass = 0;


function getData() {
	
	return pageData;
}

function showData( start ) {
	
	var datas = getData(),

		ids = 'line',

		id = '',

		tds = null,

		spans = null,

		currPage = 0,

		data = null,

		dataLen = datas.length,

		len = lines,

		i = 0;

	console.log( "dataLen = " + dataLen );

	// 数据不足一页时
	if ( dataLen < len ) {

		len = dataLen;

		lines = dataLen;
	}

	for ( ; i < len; i++ ) {

		id = ids + i;

		tds = $( id ).getElementsByTagName( 'td' );
		spans = $( id ).getElementsByTagName( 'span' );

		data = datas[ start + i ];

		tds[ 0 ].innerHTML = data.no;
		spans[ 0 ].innerHTML = data.name;
		spans[ 1 ].innerHTML = data.prog;	
	}

}

window.onkeydown = eventHandler;

function eventHandler( event ) {
	
	var keycode = event.which;

	switch ( keycode ) {

		case 38:

			changeFocus( -1 );
			break;
		case 40:

			changeFocus( 1 );
			break;

		// no default
	}
}

var currFocus = 0,
	currIdx = 0,
	total = getData().length;

function getFocus( id ) {

	$( id ).style.border = '3px solid green';
}

function loseFocus( id ) {
	
	$( id ).style.border = 'none';
}

function changeFocus( direction ) {
	
	var id 			= 'line' + currFocus,
		oldFocus 	= currFocus;

	if ( direction > 0 && currFocus === lines - 1 ) {

		if ( currIdx < total - lines ) {

			currIdx++;
		} else { // 到尾了

			return;
		}

	} else if ( direction < 0 && currFocus === 0 ) {

		if ( currIdx > 0 ) {

			currIdx--;
		} else { // 到头了

			return;
		}
	}

	loseFocus( id );

	currFocus = direction > 0 ? currFocus + 1 : currFocus - 1;

	if ( currFocus < 0 ) {

		currFocus = 0;
	} else if ( currFocus > 7 ) {

		currFocus = 7;
	}

	id = 'line' + currFocus;

	getFocus( id );

	if ( currFocus === 0 || oldFocus === 7 ) {

		refreshData( currIdx );
	}

	return true;
}

function refreshData( start ) {
	
	showData( start );
}

function $(id) {
	return document.getElementById(id);
}

window.onload = function () {

	showData( 0 );
};