// pages/goods/goods.js
var app = getApp()
var util = require('../../utils/util.js');
var navid, userid, pageNumber, baseHigh = 10, clicked = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    renwushenfen: 1,
    CheckItem: 0,
    scrollTop: 0,
    goodsdata3: [
      { colName: "足迹()", colID: "1" },
      { colName: "有优惠", colID: "2" },
      { colName: "将过期", colID: "3" },
      { colName: "已过期", colID: "4" },
    ],
    goodsdata1: [],
  },
  //导航条点击事件
  typeClick: function (e) {
    if (clicked)
      return
    clicked = true

    navid = e.currentTarget.id;
    var that = this
    this.setData({
      isChecked: true,
      CheckItem: navid,
      sortType: navid,
      scrollTop: 0
    })
    var command = "item/itemtrail"
    pageNumber = 1
    var parm = { "userID": userid, "Records": 40, "PageNumber": pageNumber, "trailType": navid }
    console.log(parm)
    util.myRequest(userid, command, parm, (res) => {
      console.log("trail ")
      console.log(res)
      for (var i = 0; i < res.length; i++) {
        res[i].title = util.myStrLeft(res[i].title, app.globalData.w16) + "..."
        res[i].usercommission = res[i].usercommission ? parseFloat(res[i].usercommission).toFixed(2) : 0
      }
      this.setData({
        goodsdata1: res,
      })
      clicked = false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    userid = app.globalData.userid
    var command = "item/itemtrailtotal"
    pageNumber = 1
    util.moduleLog(userid, 46)
    var parm = { "userID": userid }
    console.log(parm)
    util.myRequest(userid, command, parm, (res) => {


      console.log("trailTotal ")
      console.log(res)
      var trails = that.data.goodsdata3
      trails[0].colName = '足迹(' + res.trails + ')'
      trails[1].colName = '有优惠'
      trails[2].colName = '将过期'
      trails[3].colName = '已过期'
      that.setData({
        goodsdata3: trails,
      })

      var command = "item/itemtrail"
      pageNumber = 1
      navid = 1
      var parm = { "userID": userid, "Records": 40, "PageNumber": pageNumber, "trailType": navid }
      console.log(parm)
      util.myRequest(userid, command, parm, (res) => {
        console.log("load trail ")
        console.log(res)
        for (var i = 0; i < res.length; i++) {
          res[i].title = util.myStrLeft(res[i].title, app.globalData.w16) + "..."
          res[i].usercommission = res[i].usercommission ? parseFloat(res[i].usercommission).toFixed(2) : 0
        }
        this.setData({
          goodsdata1: res,
        })
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
    this.setData({
      renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay,
    })
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
  //商品详情页
  showGoods: function (e) {
    if (clicked)
      return
    clicked = true
    var goods_id = e.currentTarget.id;
    console.log(e.currentTarget)
    if (navid == 4) {
      wx.navigateTo({
        url: '../similarGoods/similarGoods?goodsID=' + goods_id
      })
    }
    else {
      wx.navigateTo({
        url: '../chanpinneiye/chanpinneiye?goods_id=' + goods_id
      })
    }
  },

  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop

/*    var i = baseHigh + (pageNumber - 1) * 20 * 280 + 10 * 280
    if (e.detail.scrollTop >= i) {
      pageNumber++
      var command = "item/itemtrail"
      var parm = { "userID": userid, "Records": 40, "PageNumber": pageNumber, "trailType": navid }
      console.log(parm)
      util.myRequest(userid, command, parm, (res) => {
        console.log("load trail ")
        console.log(res)
        var items = this.data.goodsdata1
        for (var i = 0; i < res.length; i++) {
          res[i].title = util.myStrLeft(res[i].title, app.globalData.w16) + "..."
          res[i].usercommission = res[i].usercommission ? parseFloat(res[i].usercommission).toFixed(2) : 0
          res[i].coupon_price = parseFloat(res[i].coupon_price).toFixed(1)
          if (!res[i].quan || res[i].quan == 0)
            res[i].quan = (res[i].price - res[i].coupon_price).toFixed(1)
          res[i]["iid"] = i + 1
          items.push(res[i])
        }

        this.setData({
          goodsdata1: items,
        })
      })
    }  */

  },
  addMore: function () {
    if (clicked)
      return
    clicked = true
    console.log('加载更多')

    setTimeout(() => {
      pageNumber++
      var command = "item/itemtrail"
      var parm = { "userID": userid, "Records": 40, "PageNumber": pageNumber, "trailType": navid }
      console.log(parm)
      util.myRequest(userid, command, parm, (res) => {
        if (res.length == 0) {
          clicked = false
          return
        }
        console.log("load trail ")
        console.log(res)

        var items = this.data.goodsdata1
        for (var i = 0; i < res.length; i++) {
          res[i].title = util.myStrLeft(res[i].title, app.globalData.w16) + "..."
          res[i].usercommission = res[i].usercommission ? parseFloat(res[i].usercommission).toFixed(2) : 0
          res[i].coupon_price = parseFloat(res[i].coupon_price).toFixed(1)
          if (!res[i].quan || res[i].quan == 0)
            res[i].quan = (res[i].price - res[i].coupon_price).toFixed(1)
          res[i]["iid"] = i + 1
          items.push(res[i])
        }

        this.setData({
          goodsdata1: items,
        })
        clicked = false
      })

    }, 1000)
  },
})