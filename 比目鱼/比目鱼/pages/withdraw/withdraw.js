// pages/withdraw/withdraw.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    withdraws: [
/*      { "billNo": "W2018042011111", "applyAmount": 128.2, "tax": 0, "state": "待审核", "applyTime": "2018-04-21 18:22:21" },
      { "billNo": "W2018042011112", "applyAmount": 128.2, "tax": 0, "state": "支付完成", "applyTime": "2018-04-21 10:22:21" },
      { "billNo": "W2018042011113", "applyAmount": 128.2, "tax": 0, "state": "待审核", "applyTime": "2018-04-21 12:22:21" },
      { "billNo": "W2018042011114", "applyAmount": 128.2, "tax": 0, "state": "待审核", "applyTime": "2018-04-21 11:22:21" },
      { "billNo": "W2018042011115", "applyAmount": 128.2, "tax": 0, "state": "支付完成", "applyTime": "2018-04-21 15:22:21" },
  */    
    ],
    nodata: 0,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.moduleLog(app.globalData.userid, 53)
    var command = "message/withdrawlist"
    var parm = { "userId": app.globalData.userid }
    util.myRequest(app.globalData.userid, command, parm, (res) => {
      console.log('提现成功')
      console.log(res)
      var wdState = ['', '待审核', '待付款', '支付完成'], nodata
      // wdID, withdrawNo, wdApplyDate, wdAmount, wdTax, wdState
      if (res.length == 0) {
        nodata = 1
      }
      else {
        for (var i = 0; i < res.length; i++) {
          res[i]["zt"] = wdState[res[i].wdState]
          res[i]["sqsj"] = util.timestampToTime(res[i].wdApplyDate)
        }
        console.log(res)
        nodata = 0

      }
      this.setData({
        withdraws : res ,
        nodata: nodata
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
  onReachBottom: function () {
  
  },
  goIndex: function () {
    wx.switchTab({
      url: '../index/index'
    })
  }, 
})
