function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function $ID( id ) {
  return document.getElementById( id );
}

function debug( str ) {
  console.log( 'WX --- ' + str );
}

function add0ToNum( num ) {

  var numstr = '';

  if ( num >= 0 && num < 10 ) {
    numstr = '0' + num;
  } else {
    numstr = '' + num;
  }

  return numstr;
}

function getSevenDates() {
			
  var datems 	= 0, 
    dateObj = null,
    sevens 	= [],
    i = 0, len = 7, year, month, date, day, days,
    str = '', dayms = 0, last, obj = null;

  days = [ '星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ];

  // 当前时间的毫秒数
  datems = new Date().getTime();

  // 一天的毫秒数
  dayms = 24 * 3600 * 1000;

  for ( ; i < len; i++ ) {

    sevens[i] = sevens[i] || {};

    last = datems - dayms * i;

    dateObj = new Date( last );

    year 	= dateObj.getFullYear();
    month 	= dateObj.getMonth() + 1;
    date 	= dateObj.getDate();
    day 	= days[ dateObj.getDay() ];

    sevens[i].desc = month + '/' + date;
    sevens[i].args = year + '-' + add0ToNum( month ) + '-' + add0ToNum( date );
  }

  return sevens;
}

module.exports = {
  formatTime: formatTime,
  add0ToNum: add0ToNum,
  getSevenDates: getSevenDates,
  $ID: $ID,
  debug:debug
}
