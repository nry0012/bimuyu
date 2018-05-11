// pages/memberCenter2/memberCenter2.js
var util = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    withdrawAmount: 129,
    lastMonthAmount: 123.1,
    lastMonthState: "已结算",
    monthAmount: 100.2,
    monthState: "未结算"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.moduleLog(app.globalData.userid, 51)
    var je = options.je

    var command = "message/income"
    var parm = { "userId": app.globalData.userid }
    util.myRequest(app.globalData.userid, command, parm, (res) => {
      console.log('下级用户')
      console.log(res)
      this.setData({
        withdrawAmount: je,
        lastMonthAmount: res.income_last,
        lastMonthState: res.state_last,
        monthAmount: res.income_today,
        monthState: res.state_today,
      })
    })
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
  withdraw: function () {
    wx.navigateTo({
      url: '../withdrawAct/withdrawAct?je=' + this.data.withdrawAmount
    })
  },


})