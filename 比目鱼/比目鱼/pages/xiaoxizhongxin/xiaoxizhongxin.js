var util = require('../../utils/util.js');
var app = getApp()
var userid, pid
Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '比目有价，实惠有余',
      desc: '比目有价，实惠有余',
      path: '/pages/index/index?parentid=' + app.globalData.parentID,
      imageUrl: 'https://xcx.byscape.com/xbm_rootdir/mamamiya/resource/share-index.png',
      success: function (res) {
        var command = "share/log"
        userid = app.globalData.userid
        var parm = { "userId": userid, "goodsId": "", "shSource": 1, "shType": 2, "shTarget": "" }
        util.myRequest(userid, command, parm, (res) => {
          console.log(res)
        })

      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    flag: 0,
    // 未阅读消息状态为0，已阅读消息状态为1
    type: "0",
    // imageurl: "image/xiaoxihui.png",
    // imageurl1: "image/xiaoxi.png",
    goodsdata: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pid = options.id 
    
    util.moduleLog(app.globalData.userid, 52)
    var command = "message/messagelist"
    userid = app.globalData.userid
    var parm = { "userID": userid }
    util.myRequest(userid, command, parm, (res) => {
      console.log(res)
      var flag
      if (res.length == 0)
        flag = 1
      else
        flag = 0

      this.setData({
        goodsdata: res,
        flag: flag
      })
    })
  },
  yonghuxieyi: function () {
    wx.navigateTo({
      url: '../user/user',
    })
  },
  //当点击消息话时 显示已阅状态，图标由灰色变黄色
  xiaoxi: function (event) {
    //取data-id的值
    var testId = event.currentTarget.dataset.id;
    var isRest = 0
    var that = this
    var iiii = -1
    for (var i = 0; i < that.data.goodsdata.length; i++) {
      if (testId == that.data.goodsdata[i].msgID) {
        if (that.data.goodsdata[i].msgState == "0") {
          that.data.goodsdata[i].msgState = "1";
          console.log(1)
          var command = "message/messageclick"
          var parm = { "msgID": testId }
          iiii = i
          util.myRequest(userid, command, parm, (res) => {
            console.log(res)
          })
        }
      }
      else {
        if (that.data.goodsdata[i].msgState == "0")
          isRest = 1
      }

    }
    that.setData({
      goodsdata: that.data.goodsdata
    })
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    var dd = prevPage.data.worthys
    var ids = pid.split(',')
    dd[ids[0]].worthy[ids[1]].msgState = isRest
    prevPage.setData({//直接给上移页面赋值
      worthys: dd
    }, function(){
      console.log(iiii)
      if (iiii != -1) {
        if (that.data.goodsdata[iiii].msgDealStyle == "2") {
          wx.navigateTo({
            url: that.data.goodsdata[iiii].msgLinker,
          })
        }
        else if (that.data.goodsdata[iiii].msgDealStyle == "3") {
          wx.switchTab({
            url: that.data.goodsdata[iiii].msgLinker,
          })
        }
      }
    })


  },

  quanbushanchu: function () {
    var msgs = []
    this.setData({
      goodsdata: msgs
    })
    var command = "message/delete"
    var parm = { "userID": userid }
    util.myRequest(userid, command, parm, (res) => {
      console.log(res)
      this.setData({
        flag: 1
      })
      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length - 2];//上一页面
      var dd = prevPage.data.worthy
      var ids = pid.split(',')
      dd[ids[0]].worthy[ids[1]].msgState = 0
      prevPage.setData({//直接给上移页面赋值
        worthy: dd
      });
    })
  }
})