//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    titleArrowColor: 'white'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },

  // 标题箭头点击事件
  titleArrowAction: function (event) {

    var that = this;

    debug( 'titleArrowAction --- click' );
  },

  // 箭头颜色改变
  changeTitileArrowColor: function (event) {

    var that = this,
        type = event.type,
        color = '';

    debug( 'event.type = ' + event.type );

    if ( type === 'touchstart' ) {
      color = 'blue';
    } else if ( type === 'touchend' ) {
      color = 'white';
    }

    that.setData({titleArrowColor: color});
  }
})


function debug( str ) {

  console.log('debug --- ' + str);
}