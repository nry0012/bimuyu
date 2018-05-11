// pages/agent/agent.js
var app = getApp()
var util = require('../../utils/util.js')
var lv, amount
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.moduleLog(app.globalData.userid, 47)
    lv = options.userLevel
    amount = options.amount
    console.log('一键登陆amount' + amount)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
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

  },

  getPhoneNumber: function (e) {
    util.getCode((code) => {

    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:fail:cancel to confirm login') {
      wx.redirectTo({
        url: '../registerPhone/registerPhone?userLevel=' + lv + '&amount=' + amount
      })
 /*     wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      }) */
    } else {
      /*
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) { }
      }) */
//      https://api.uflounder.com/index.php/v1/phone/service
//      { "parm":{ "code":"132132131", "iv":"432432432", "encryptedData":"2432432432", "userId":"1407" } }
      var command = "phone/service"
      console.log('同意授权')
      var parm = { "code": code, "iv": e.detail.iv, "encryptedData": e.detail.encryptedData, "userID": app.globalData.userid}
      util.myRequest(app.globalData.userid, command, parm, (res) => {
        console.log('下级用户')
        console.log(lv)
        wx.redirectTo({
          url: '../agent/agent?source=1&userLevel=' + lv + '&amount=' + amount
        })
      })
    }
    })
  }

})