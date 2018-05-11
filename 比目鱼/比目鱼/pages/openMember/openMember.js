// pages/openMember/openMember.js
var app = getApp()
var util = require('../../utils/util.js');
var clicked = false, amount = 99, lvname = '黄金会员', iType
var isUpgrade

Page({

  /**
   * 页面的初始数据
   */
  data: {
    levelSel: 4,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    iType = options.id
    isUpgrade = options.isUpgrade

    util.moduleLog(app.globalData.userid, 60)
    var command = "message/userlevel"
    var parm = { "userId": app.globalData.userid }
    util.myRequest(app.globalData.userid, command, parm, (res) => {
      console.log(res)
      this.setData({
        levels: res
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: "老铁，甭扎心了，一起飞吧！",
      desc: '老铁，甭扎心了，一起飞吧！',
      path: '/pages/index/index?parentid=' + app.globalData.userid,
      imageUrl: 'https://xcx.byscape.com/xbm_rootdir/mamamiya/resource/share-invite.png',
      success: function (res) {
        console.log('parentID=' + app.globalData.parentID)
        console.log('转发成功！')
        var command = "share/log"
        userid = app.globalData.userid
        var parm = { "userId": userid, "goodsId": "", "shSource": 1, "shType": 2, "shTarget": "" }
        util.myRequest(userid, command, parm, (res) => {
          console.log(res)
        })
      },
      fail: function (res) {
        console.log('转发失败！')
        // 转发失败
      }
    }
  },
  selLevel: function (e) {
    var id = parseInt(e.currentTarget.id)
    var CLv = app.globalData.agentLevel
    if (iType == 1) {
      if (CLv >= id)
        return
    }
    console.log(id)
    this.setData({
      levelSel: id,
    })
    amount = this.data.levels[id - 1].lvPayAmount
    lvname = this.data.levels[id - 1].lvName
    console.log(amount)
  }, 
  millionAct: function () {
    wx.redirectTo({
      url: '../millionAct/millionAct',
    })
  },
  openMember: function () {
    if (clicked)
      return
    clicked = true
    console.log('lvName=' + lvname)
    if (iType == 1 && isUpgrade == 1) {
      var CLv = app.globalData.agentLevel
      var command = "user/levelamount"
      var parm = { "LvID": CLv }
      var lvAmount
      util.myRequest(app.globalData.userid, command, parm, (res) => {
        console.log('级别金额')
        console.log(res)
        lvAmount = res[0].lvPayAmount
        amount -= lvAmount
        console.log(amount)
        wx.redirectTo({
          url: '../huobisanjia/huobisanjia?userLevel=' + lvname + '&amount=' + amount,
        })
      })
    }
    else {
      console.log(amount)
      wx.redirectTo({
        url: '../huobisanjia/huobisanjia?userLevel=' + lvname + '&amount=' + amount,
      })
    }
  }
})