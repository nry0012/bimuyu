// pages/webview/webview.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  data: {
    userid: 0,
    url: ""
  },
  onLoad: function () {
    this.setData({
      userid: app.globalData.userid,
      url: "https://wx.uflounder.com/?userId=" + app.globalData.userid
    },function() {
      console.log('webview')
      console.log(this.data.url)
    })
    util.moduleLog(app.globalData.userid, 54)
  },
  onShow: function () {
    this.setData({
      userid: app.globalData.userid
    })
  }
  /**
   * 组件的方法列表
   */

})
