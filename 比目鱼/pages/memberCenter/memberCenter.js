// pages/memberCenter/memberCenter.js
var app = getApp()
var clicked = false, zt = ["1", "已结算", "待结算", "已取消"], pageNumber = 1

var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navSel: 1,
    forecastAmount: '',
    pDateID: 1,
    pDateSel: [{ "id": 1, "pDateName": "昨天", "income": 235, "orders": 25 },
    { "id": 2, "pDateName": "近7天", "income": 235, "orders": 25 },
    { "id": 3, "pDateName": "近30天", "income": 235, "orders": 25 }
    ],
    bDateID: 1,
    bDateSel: [{ "id": 1, "bDateName": "今天", "loading": 235, "invite": 25 },
    { "id": 2, "bDateName": "昨天", "loading": 235, "invite": 25 },
    { "id": 3, "bDateName": "近7天", "loading": 235, "invite": 25 },
    { "id": 4, "bDateName": "近30天", "loading": 235, "invite": 25 }
    ],

    orderSel: [
      { "id": 1, "orderNavName": "全部" },
      { "id": 2, "orderNavName": "直属" },
      { "id": 3, "orderNavName": "推荐" },
    ],
    orderID: 1,
    orderType: [
      { "id": 1, "orderTypeName": "所有订单" },
      { "id": 2, "orderTypeName": "有效订单" },
      { "id": 3, "orderTypeName": "无效订单" },
    ],
    orderTypeID: 1,
    goodsData: [],
    income: 235,
    volume: 26,
    bonusLoading: 0.49,
    bonusInvite: 1.67

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*  
      var data = this.data.goodsData;
      for (var i = 0; i < data.length; i++) {
        data[i]["createDate"] = util.timestampToTime(data[i].add_time)
        data[i]["payAmount"] = data[i].coupon_price
        if (i % 2 == 0)
          data[i]["state"] = "待结算"
        else
          data[i]["state"] = "已结算"
      }
      this.setData({
        goodsData: data 
      }) */

    util.moduleLog(app.globalData.userid, 50)

    var command = "message/settle"
    var parm = { "userId": app.globalData.userid }
    util.myRequest(app.globalData.userid, command, parm, (res) => {
      console.log('下级用户')
      console.log(res)
      var pDate = this.data.pDateSel
      var bDate = this.data.bDateSel
      pDate[0].income = res.incomes_yestoday[0].je.toFixed(2)
      pDate[0].orders = res.incomes_yestoday[0].sl
      pDate[1].income = res.incomes_week[0].je.toFixed(2)
      pDate[1].orders = res.incomes_week[0].sl
      pDate[2].income = res.incomes_month[0].je.toFixed(2)
      pDate[2].orders = res.incomes_month[0].sl
      bDate[0].loading = res.loading_today[0].rpAmount.toFixed(2)
      bDate[0].invite = res.invite_today[0].rpAmount.toFixed(2)
      bDate[1].loading = res.loading_yestoday[0].rpAmount.toFixed(2)
      bDate[1].invite = res.invite_yestoday[0].rpAmount.toFixed(2)
      bDate[2].loading = res.loading_week[0].rpAmount.toFixed(2)
      bDate[2].invite = res.invite_week[0].rpAmount.toFixed(2)
      bDate[3].loading = res.loading_month[0].rpAmount.toFixed(2)
      bDate[3].invite = res.invite_month[0].rpAmount.toFixed(2)

      this.setData({
        forecastAmount: res.withdraw.toFixed(2),
        pDateSel: pDate,
        bDateSel: bDate,
        pDateID: 1,
        bDateID: 1,
        income: pDate[0].income,
        volume: pDate[0].orders,
        bonusLoading: bDate[0].loading,
        bonusInvite: bDate[0].invite
      })
    })

    var command = "message/orders"
    //      var parm = { "userId": app.globalData.userid, "orderType": 1, "orderSource": 1 }
    var parm = { "userId": app.globalData.userid, "orderType": 1, "orderSource": 1, "pageNumber": pageNumber, "Records": 20 }
    util.myRequest(app.globalData.userid, command, parm, (res) => {
      console.log('下级用户')
      console.log(res)
      for (var i = 0; i < res.length; i++) {
        res[i]["state"] = zt[res[i].yn]
        res[i].userCommission = res[i].userCommission.toFixed(2)
      }
      var dd = res.length
      this.setData({
        noOrder: dd,
        goodsData: res
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

  pDate: function (e) {
    var navid = parseInt(e.currentTarget.id);
    this.setData({
      pDateID: navid,
      income: this.data.pDateSel[navid - 1].income,
      volume: this.data.pDateSel[navid - 1].orders,
    })
  },
  bDate: function (e) {
    var navid = parseInt(e.currentTarget.id);
    this.setData({
      bDateID: navid,
      bonusLoading: this.data.bDateSel[navid - 1].loading,
      bonusInvite: this.data.bDateSel[navid - 1].invite,
    })
  },
  navClick: function (e) {
    var navid = e.currentTarget.id;
    this.setData({
      navSel: navid
    })
    if (navid == 2) {

    }
  },
  orderNav: function (e) {
    var navid = parseInt(e.currentTarget.id);
    var that = this
    that.setData({
      orderID: navid
    }, function () {
      pageNumber = 1
      var command = "message/orders"
      //      var parm = { "userId": app.globalData.userid, "orderType": 1, "orderSource": 1 }
      var parm = { "userId": 1699, "orderType": that.data.orderTypeID, "orderSource": that.data.orderID, "pageNumber": pageNumber, "Records": 20 }
      util.myRequest(app.globalData.userid, command, parm, (res) => {
        console.log('下级用户')
        console.log(res)
        for (var i = 0; i < res.length; i++) {
          res[i]["state"] = zt[res[i].yn]
          res[i].userCommission = res[i].userCommission.toFixed(2)
        }
        var dd = res.length
        that.setData({
          noOrder: dd,
          goodsData: res
        })
      })
    })

  },
  orderType: function (e) {
    var navid = parseInt(e.currentTarget.id);
    var that = this
    that.setData({
      orderTypeID: navid
    }, function () {
      pageNumber = 1
      var command = "message/orders"
      //      var parm = { "userId": app.globalData.userid, "orderType": 1, "orderSource": 1 }
      var parm = { "userId": 1699, "orderType": that.data.orderTypeID, "orderSource": that.data.orderID, "pageNumber": pageNumber, "Records": 20 }
      util.myRequest(app.globalData.userid, command, parm, (res) => {
        console.log('下级用户')
        console.log(res)
        for (var i = 0; i < res.length; i++) {
          res[i]["state"] = zt[res[i].yn]
          res[i].userCommission = res[i].userCommission.toFixed(2)
        }
        var dd = res.length
        that.setData({
          noOrder: dd,
          goodsData: res
        })
      })
    })
  },
  //加载更多
  onReachBottom: function () {
    if (clicked)
      return
    clicked = true
    console.log('加载更多')
    setTimeout(() => {
      pageNumber++

      var command = "message/orders"
      //      var parm = { "userId": app.globalData.userid, "orderType": 1, "orderSource": 1 }
      var parm = { "userId": 1699, "orderType": 1, "orderSource": 1, "pageNumber": pageNumber, "Records": 20 }
      util.myRequest(app.globalData.userid, command, parm, (res) => {
        console.log('下级用户')
        console.log(res)
        var ddd = this.data.goodsData
        for (var i = 0; i < res.length; i++) {
          res[i]["state"] = zt[res[i].yn]
          res[i].userCommission = res[i].userCommission.toFixed(2)
          ddd.push(res[i])
        }
        this.setData({
          goodsData: res
        })
      })
    }, 1000)
  },
  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    //   console.log(e.detail.scrollTop)
    var isScroll = e.detail.scrollTop > 500 ? true : false
    this.setData({
      floorstatus: isScroll
    })
  },
  goIndex: function () {
    wx.switchTab({
      url: '../index/index'
    })
  }, 
  withdraw: function () {
    wx.navigateTo({
      url: '../memberCenter2/memberCenter2?je=' + this.data.forecastAmount
    })
  },
  withdrawRecord: function () {
    wx.navigateTo({
      url: '../withdraw/withdraw'
    })
  },
})