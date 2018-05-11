// pages/tehui/tehui.js
var app = getApp()
var util = require('../../utils/util.js');
var countdown = 0.03
var scountdown = ""
var Qtime = 9000
var pageNumber = 1, userid, timer, baseHigh = 200, clicked = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    goodsdata: [],
    scrollTop: 0,
    scountdown: "",
  },
  diaoyong: function (mss) {
    var hours = parseInt((mss % (60 * 60 * 24)) / (60 * 60));
    var minutes = parseInt((mss % (60 * 60)) / (60));
    var seconds = (mss % (60));
    var hours = hours < 10 ? "0" + hours : hours
    var minutes = minutes < 10 ? "0" + minutes : minutes
    var seconds = seconds < 10 ? "0" + seconds : seconds
    return hours + ":" + minutes + ":" + seconds;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    countdown = 3
    Qtime = 9000
    userid = app.globalData.userid 
    var that = this;
    util.moduleLog(app.globalData.userid, 5)
    /*
    var command = "item/itemcountdown"
    var parm = { "userID": userid, "Records": 15, "PageNumber": pageNumber, "sortType": 1 }
    console.log(parm)
    util.myRequest(userid, command, parm, (res) => {
      for (var i = 0; i < res.length; i++) {
        res[i].title = util.myStrLeft(res[i].title, app.globalData.w16) + "..."
        res[i].usercommission = res[i].usercommission ? res[i].usercommission.toFixed(2) : 0
        res[i].coupon_price = parseFloat(res[i].coupon_price).toFixed(1)
        if (!res[i].quan || res[i].quan == 0)
          res[i].quan = (res[i].price - res[i].coupon_price).toFixed(1)
      }
      console.log(res)
      that.setData({
        goodsdata: res
      })
*/
    var command = "item/itemsearchnew"
    var parm = { "keywords": "限时特惠", "userId": userid, "Records": 15, "PageNumber": 1, "skType": 2, "sortType": 1, "hisSearch": "限时特惠", "funType": 2048 }
    console.log(parm)
    util.myRequest(userid, command, parm, (res) => {
      for (var i = 0; i < res.res.length; i++) {
        res.res[i].title = util.myStrLeft(res.res[i].title, app.globalData.w16) + "..."
        //    res.res[i].usercommission = res.res[i].usercommission ? res.res[i].usercommission.toFixed(2) : 0
        res.res[i].coupon_price = parseFloat(res.res[i].coupon_price).toFixed(1)
        if (!res.res[i].quan || res.res[i].quan == 0)
          res.res[i].quan = (res.res[i].price - res.res[i].coupon_price).toFixed(1)
      }
      console.log(res)
      that.setData({
        goodsdata: res.res
      })

/*
       timer = setInterval(function () {
        var dd = new Date();
        var dqsj = new Date(dd.getFullYear(), dd.getMonth(), dd.getDate(), 23, 59, 59);
 //       dd.setDate(dd.getDate() + 1);
        var countdown = Math.floor((dqsj - dd) / 1000)
        var scountdown = that.diaoyong(countdown)
        that.setData({
          scountdown: scountdown,
        })
        
      }, 1000)
*/
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
  //加载更多
  jiazhaigengduo: function () {
    console.log('加载更多')
    var that = this
    /*
    setTimeout(() => {
      pageNumber++
      var command = "item/itemcountdown"
      var parm = { "userID": userid, "Records": 40, "PageNumber": pageNumber, "sortType": 1 }
      console.log(parm)
      util.myRequest(userid, command, parm, (res) => {
        var dd = that.data.goodsdata
        for (var i = 0; i < res.length; i++) {
          res[i].title = util.myStrLeft(res[i].title, app.globalData.w16) + "..."
          res[i].usercommission = res[i].usercommission ? res[i].usercommission.toFixed(2) : 0
          res[i].coupon_price = parseFloat(res[i].coupon_price).toFixed(1)
          if (!res[i].quan || res[i].quan == 0)
            res[i].quan = (res[i].price - res[i].coupon_price).toFixed(1)
          if (res[i].scountdown > 0) {
            var dDate = util.stringToDate(res[i].endTime)
            var cDate = new Date()
            res[i].scountdown = Math.floor((dDate - cDate) / 1000)
            res[i].shengyushijian = that.diaoyong(res[i].scountdown)
          }
          dd.push(res[i])
        }
        console.log(res)
        that.setData({
          goodsdata: dd
        })
     
        var goodsdata = dd;

        if (timer)
          clearInterval(timer)
        timer = setInterval(function () {
          for (var i = 0; i < goodsdata.length; i++) {
          if (goodsdata[i].scountdown > 0) {
            var dDate = util.stringToDate(goodsdata[i].endTime)
            var cDate = new Date()
            goodsdata[i].scountdown = Math.floor((dDate - cDate) / 1000)
            goodsdata[i].shengyushijian = that.diaoyong(goodsdata[i].scountdown)
          }
          }
          that.setData({
            goodsdata: goodsdata,
          })
        }, 1000)
      })
    }, 1000) */
  },
  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop

      var i = baseHigh + (pageNumber - 1) * 20 * 280 + 10 * 280
      if (e.detail.scrollTop >= i) {
        this.jiazhaigengduo()

      }
    
  },
  //商品详情页
  showGoods: function (e) {
    if (clicked)
      return
    clicked = true
    var goods_id = e.currentTarget.id;
    console.log(e.currentTarget)
    wx.navigateTo({
      url: '../chanpinneiye/chanpinneiye?goods_id=' + goods_id
    })
  },
})