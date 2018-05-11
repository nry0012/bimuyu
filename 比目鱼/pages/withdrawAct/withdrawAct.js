// pages/withdrawAct/withdrawAct.js
var util = require('../../utils/util.js');
var app = getApp()
var clicked = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
  amount: '',
  lvSel: 1,
  jeSel: 50,
  buttonText: '提现'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.moduleLog(app.globalData.userid, 66)
    var je, ts
    if (options.je < 50) {
      je = 0
      ts = '提现' + options.je + '元'
    }
    else {
      je = 50
      ts = '提现' + je + '元'
    }
    new app.ToastPannel();
    this.setData({
      amount: options.je,
      jeSel: je,
      buttonText: ts, 
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
    clicked = false
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


  amountSel: function (e) {
    var navid = parseInt(e.currentTarget.id);
    var that = this
    if (navid > that.data.amount) {
      this.show("提现金额不能超过余额！")
      return
    }
    var je 
    if (navid == 0)
      je = that.data.amount
    else
      je = navid

    var ts = '提现' + je + '元'
    that.setData({
      jeSel: navid,
      lvSel: 1,
      buttonText: ts,
    })
  },

  levelSel: function (e) {
    var navid = parseInt(e.currentTarget.id);
    var that = this
    if (navid > that.data.amount) {
      this.show("升级年费金额不能超过余额！")
      return
    }
    var ts = '年费充值' + navid + '元'
    that.setData({
      jeSel: 1,
      lvSel: navid,
      buttonText : ts,
    })
  },
  withdraw : function () {
    if (clicked)
      return
    clicked = true
    var wdType, amount
    if (this.data.jeSel == 1) {
      wdType = 2
      amount = this.data.lvSel
    }
    else {
      wdType = 1
      if (this.data.jeSel == 0)
        amount = this.data.amount
      else
        amount = this.data.jeSel
    }
    var command = "message/withdraw"
    var parm = { "userId": app.globalData.userid, "wdType": wdType, "wdAmount": amount }
    util.myRequest(app.globalData.userid, command, parm, (res) => {
      console.log('提现成功')
      console.log(res)
      this.show('提现成功')
      wx.switchTab({
        url: '../mine/mine'
      })
    })
  }
})