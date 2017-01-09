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
    },
    
    rowFocusFlagArray: [],

    rowDftStyle: {
      bgImgUrl: '../resources/images/dlist_bg.png',
      color: '#727374'
    },

    rowFocusStyle: {
      bgImgUrl: '../resources/images/dlist_bg_focus.png',
      color: '#FFFFFF'
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
    var that = this;
    
    var dates = util.getSevenDates();

    that.setData({ dates: dates });

    var rowFocusFlagArray = [];

    // 默认第一行为焦点行
    rowFocusFlagArray[0] = 1;

    that.setData({rowFocusFlagArray: rowFocusFlagArray});
  },

  refreshDateTbl: function ( event ) {
    var that = this,
        index = that.data.index + 1,
        len = that.data.dates.length;

    if ( index >= len ) {
      index = 0;
    }

    that.setData({index: index});
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
    
  },

  // 点击日期行
  tapDateRow: function ( event ) {
    console.log( event );
    // console.log( event.currentTarget );
    // console.log( event.currentTarget == event.target );

    var that = this;

    // 更新前先清空焦点标识数组
    var rowFocusFlagArray = [];

    // 根据 dataset 获取当前的索引
    var index = event.target.dataset.index;

    console.log( 'index = ' + index );

    // 然后重新设置标识值
    rowFocusFlagArray[index] = 1;

    // 重新改变样式标识，刷新页面
    that.setData({rowFocusFlagArray: rowFocusFlagArray});
  }
})


function debug( str ) {
  console.log( str );
}

function showUserInfo( info ) {

  console.log( info );
}


var info = app.getUserInfo( showUserInfo )