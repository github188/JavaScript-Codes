//index.js

var calculator = require('./Calculator.js');

//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    digits: [ ['AC', 'CE', '÷'], ['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3'] ],
    calculator: null,
    resultUp: '',
    resultDown: '',
    dateContent: ''
  },

  calculator: null,

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;

    that.calculator = calculator.getInstance(that);

    console.log( that.calculator );
  },

  bindKeyTap: function(event) {

    var that = this;
    
    that.calculator.calculatorClickEvent(event)
  }
})
