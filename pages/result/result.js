var mbti = require('../../data/mbti_res.js')
function mbti_id(str) {//获取MBTI类型的index
  var table = mbti.mbti_id
  for (var i = 0; i < 16; i++) {
    if (str == table[i]) {
      return i
    }
  }
}
var app = getApp()

Page({

  data: {
    mbtiDesArr: mbti.mbti_des,
    mbtiCN: mbti.mbti_cn,
    mbtiEN: mbti.mbti_en,
    isDone: false,
    //possible_mbti: [],
  },

  onLoad: function (options) {
    //下面这段代码，需要在开头加上var app = getApp()才能运行
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新用户数据
      that.setData({
        userInfo: userInfo
      })
    })

    //设置data
    var mbtiRes = wx.getStorageSync('MBTI')
    if (this.data.isDone == false) {//有两种可能：
      if (mbtiRes == undefined || mbtiRes == '') {
        return;//如果还没测试过，跳出
      }
      else {
        this.setData({
          isDone: true//用户已经测试过，做标记
        })
      }
    }
    var id = mbti_id(mbtiRes)
    var mbtiEasyDes = mbti.mbtiEasyDes[id]
    this.setData({ mbtiRes: mbtiRes })
    this.setData({ id: id })
    this.setData({ mbtiEasyDes: mbtiEasyDes, })
  },

  //计算倾向度的百分比
  postp: function (n) {
    return 2 * (n - 0.5)
  },
  negtp: function (n) {
    return 2 * (0.5 - n)
  },

  //绘图错误捕捉：
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },

  //没有测试过时，开始测试
  goToTest: function () {
    wx.redirectTo({
      url: '../test/test',
    })
  },

  //查看好友们的类型（此按钮现在被屏蔽）
  goToIntr: function () {
    wx.showActionSheet({
      itemList: [
        "查看谁测试过",
        "分享到微信…",
      ],
      success: function (res) {
        var id = res.tapIndex
        switch (id) {
          case 0:
            //弹出确认信息窗口，提示将被好友可见
            wx.showModal({
              title: "提示",
              content: "查看其他人MBTI类型测试结果的同时，别人也会查看到你。是否继续？",
              cancelText: "还是算了",
              cancelColor: "#aaa",
              confirmText: "没事继续",
              confirmColor: "#000000",
              success: function (res) {
                if (res.confirm) {
                  //显示好友MBTI表，并向里填入用户的信息
                  wx.showToast({
                    title: "功能尚未开发",
                    icon: "loading"
                  })
                }
              }
            })
            break
          case 1:
            //调用分享到微信API
            // wx.showToast({
            //   title: "功能尚未开发",
            //   icon: "loading"
            // })
            console.log("that=" + that)//此处代码不灵
            that.onShareAppMessage()
            break
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  //更多MBTI相关知识（弹出一串按钮，对应方法为wx.navigateTo不同页面:
  goToMore: function () {
    var that = this
    wx.showActionSheet({
      itemList: [
        "查看其他类型",
        "书籍网站推荐",
      ],
      success: function (res) {
        var id = res.tapIndex
        switch (id) {
          case 1:
            wx.navigateTo({
              url: '../more/rec',
            })
            break
          case 0:
            wx.navigateTo({
              url: '../more/more',
            })
        }
      },
    })
  },

  //请联系制作者
  connectAuthor: function () {
    wx.showModal({
      title: '索要书籍',
      content: '请联系作者邮箱：445395697@qq.com',
      showCancel: false
    })
  },

  onShow: function () {
    if (this.data.isDone == false) {
      return
    }

    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('Canvas1')

    //创建文字(会被挡住,IDE模拟器的bug)
    context.setFontSize(12)
    context.fillText('外向', 10, 42)
    context.fillText('实感', 10, 84)
    context.fillText('思考', 10, 126)
    context.fillText('判断', 10, 168)
    context.fillText('内向', 265, 42)
    context.fillText('直觉', 265, 84)
    context.fillText('情感', 265, 126)
    context.fillText('认知', 265, 168)

    //设置线性渐变
    const gradient1 = context.createLinearGradient(0, 0, 200, 0)//需指定起点终点坐标
    gradient1.addColorStop(0, '#8FBC8F')
    gradient1.addColorStop(1, '#f8f8f8')//背景灰色
    const gradient2 = context.createLinearGradient(100, 0, 300, 0)
    gradient2.addColorStop(0, '#f8f8f8')
    gradient2.addColorStop(1, '#8FBC8F')
    //用渐变填充矩形，控制矩形的长度
    for (var i = 0; i < 4; i++) {
      var c; var len = 0
      switch (i) {
        case 0:
          c = 'E'; break;
        case 1:
          c = 'S'; break;
        case 2:
          c = 'T'; break;
        case 3:
          c = 'J';
      }
      var b = wx.getStorageSync(c)
      var x = 0.0
      if (b > 0.5) {//矩形在左边
        x = this.postp(b)
        context.setFillStyle(gradient1)
        len = 113 * x
        context.fillRect(150 - len, 42 * i + 21, len, 32)
      }
      else {//矩形在右边
        x = this.negtp(b)
        context.setFillStyle(gradient2)
        len = 113 * x
        context.fillRect(150, 42 * i + 21, len, 32)
      }
    }

    //画矩形来表示画布边界、槽的边界
    context.setStrokeStyle("#000000")
    context.setLineWidth(6)
    context.rect(0, 0, 300, 200)
    context.stroke()//fill()和stroke()方法将矩形真正画到canvas中
    context.setStrokeStyle("#8FBC8F")
    context.setLineWidth(1)
    context.rect(37, 21, 113, 32); context.stroke()
    context.rect(37, 63, 113, 32); context.stroke()
    context.rect(37, 105, 113, 32); context.stroke()
    context.rect(37, 147, 113, 32); context.stroke()
    context.rect(150, 21, 113, 32); context.stroke()
    context.rect(150, 63, 113, 32); context.stroke()
    context.rect(150, 105, 113, 32); context.stroke()
    context.rect(150, 147, 113, 32); context.stroke()

    context.draw()
  },

  onReady: function () {

  },

  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'MBTI性格测试',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})