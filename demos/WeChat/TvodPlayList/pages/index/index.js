//index.js

//获取应用实例
var app = getApp()
var util = require('../../utils/util.js');
var list = require('./list.js');

Page({
  data: {
    motto: 'Hello World',
    dates: [],
    userInfo: {},
    flag: 0,
    index: 0,
    item1: {
      index: 0,
      msg: 'hello template',
      date: '2017-1-4'
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
    var that = this
    
    var dates = util.getSevenDates();

    that.setData({ dates: dates });

    // list.createDateTbl( that.data.dates );
  },

  refreshDateTbl: function ( event ) {
    var that = this,
        index = that.data.index + 1,
        len = that.data.dates.length;

    if ( index >= len ) {
      index = 0;
    }

    that.setData({index: index});

    console.log( event );
  },

  refreshDateUp: function () {

    var that = this,
        index = that.data.index - 1;

    if ( index <= 0 ) {
      index = 0;
    }
    
    that.setData({index: index});
  },

  refreshDateDown: function () {

    var that = this,
        len = that.data.dates.length,
        index = that.data.index + 1;

    if ( index >= len ) {
      index = len - 1;
    }
    
    that.setData({index: index});
  },
  
  changeFlag: function ( flag ) {
    var that = this;

    that.flag = flag;
    
  }
})


function debug( str ) {
  console.log( str );
}

function showUserInfo( info ) {

  console.log( info );
}


var info = app.getUserInfo( showUserInfo )