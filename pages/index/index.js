//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto1: '--MBTI--',
    motto2: '迈尔斯-布里格斯类型指标',
    motto3: '无双BaOY_WHA制作',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //从首页index进入intr页面（由于是TabBar页面，不能用redirect方法）
  goToIntr:function(){
    wx.switchTab({
      url: '/pages/introduction/intr1'
    })
  },
  onShareAppMessage:function(){

  },
  onLoad: function () {
    console.log('onLoad')
    var that = this//使用that的原因：此处this引用的是Page(Object)中的Object，但是A处若写this则不再是引用Page(Object)中的Object
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({//A处
        userInfo:userInfo
      })
    })
  }
})
