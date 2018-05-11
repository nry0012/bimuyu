// activity.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js');
var pageNumber = 1;
var userid, ss, baseHigh = 300, typeid, clicked = false

Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: "比目有价，实惠有余",
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
  data: {
    actID : 0,
    isChecked: false,
    CheckItem: 1,
    isChecked1: false,
    // CheckItem1: 0,
    userInfo: {},
    tohe: 600,
    totype: 0,
    sortType: 0,
    renwushenfen: 1,
    scrollTop: 0,
    scrollState: true,
    name:0,
    banner: "",
    floorstatus: false,
    isHideLoadMore: true,
    images: [],
    goodsdata: {
      // goodsamount: "11123",
      source: "1"
    },
    goodsdata1: [
      { colName: "最新", colID: "1" },
      { colName: "销量", colID: "2" },
      { colName: "价格", colID: "3" },
      { colName: "优惠", colID: "4" }
    ],
    movies: [
      { url: 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/huodong1.png', id: 1 },
      { url: 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/huodong2.png', id: 2 },
      { url: 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/huodong3.png', id: 3 }
    ],
    goodsdata3: [
      { colName: "最新", colID: "1" },
      { colName: "销量", colID: "2" },
      { colName: "价格", colID: "3" },
      { colName: "优惠", colID: "4" },
    ],
  },
  //事件处理函数

  //商品详情页.
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

  //排序点击事件
  sortClick: function (e) {
    if (clicked)
      return
    clicked = true

    pageNumber = 1
    var navid = e.currentTarget.id;
    var that = this
    this.setData({
      isChecked: true,
      CheckItem: navid,
      sortType: navid
    }, function () {
//      util.showLoading()
      if (typeid == 15) // 抖音单独处理
      {
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 128, app.globalData.w11, function () {
          clicked = false
        })
      }
      else if (typeid == 17) { // 明星单独处理
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 256, app.globalData.w11, function () {
          clicked = false
        })
      }
      else if (typeid == 18) { // 京东专区单独处理
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 512, app.globalData.w11, function () {
          clicked = false
        })
      }
      else if (typeid == 19) { // 实惠好物单独处理
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 2, app.globalData.w11, function () {
          clicked = false
        })
      }
      else {
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 9, app.globalData.w11, function () {
          clicked = false
        })
      }
    })
//    util.cancelLoading()
  },

  // 一键置顶
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
  //  console.log(e.detail.scrollTop)
    var isScroll = e.detail.scrollTop > 200 ? false : true
    var that = this
  //  console.log(isScroll)
    this.setData({
      scrollState: isScroll,
      scrollState1: true
    })
    /*
    var i = baseHigh + (pageNumber - 1) * 20 * 280 + 10 * 280
    if (e.detail.scrollTop >= i) {
      pageNumber++
//      util.showLoading()
      if (typeid == 15) // 抖音单独处理
      {
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 128, app.globalData.w11)
      }
      else if (typeid == 17) { // 明星单独处理
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 256, app.globalData.w11)
      }
      else if (typeid == 18) { // 京东专区单独处理
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 512, app.globalData.w11)
      }
      else if (typeid == 19) { // 实惠好物单独处理
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 2, app.globalData.w11)
      }
      else {
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 9, app.globalData.w11)
      }
//      util.cancelLoading()
    }*/
  },

  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    //更新数据
    that.setData({
      renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay,
      actID: options.id,
      banner: options.pic
    }, function () {
      userid = app.globalData.userid
      util.moduleLog(userid, 3)
      console.log('renwufen' + app.globalData.isAgent)
      console.log('userid' + userid)
      pageNumber = 1
      typeid = options.id
      ss = decodeURIComponent(options.name)
//      util.showLoading()
      if (typeid == 15) // 抖音单独处理
      {
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 128, app.globalData.w11)
      }
      else if (typeid == 17) { // 明星单独处理
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 256, app.globalData.w11)
      }
      else if (typeid == 18) { // 京东专区单独处理
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 512, app.globalData.w11)
      }
      else if (typeid == 19) { // 实惠好物单独处理
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 2, app.globalData.w11)
      }
      else { 
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 9, app.globalData.w11)
      }
//      util.cancelLoading()
    })

  },

  //加载更多
  onReachBottom: function () {
    if (clicked)
      return
    clicked = true

    console.log('加载更多')
    var that = this
    setTimeout(() => {
      pageNumber++
//      util.showLoading()
      if (typeid == 15) // 抖音单独处理
      {
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 128, app.globalData.w11, function () {
          clicked = false
        }    )
      }
      else if (typeid == 17) { // 明星单独处理
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 256, app.globalData.w11, function () {
          clicked = false
        }    )
      }
      else if (typeid == 18) { // 京东专区单独处理
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 512, app.globalData.w11, function () {
          clicked = false
        }    )
      }
      else if (typeid == 19) { // 实惠好物单独处理
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 2, app.globalData.w11, function () {
          clicked = false
        }    )
      }
      else {
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 9, app.globalData.w11, function () {
          clicked = false
        }    )
      }
//      util.cancelLoading()
       this.setData({
        isHideLoadMore: true
      }) 

    }, 1000)
  },
  onShow: function () {
    clicked = false
    console.log('index show')
    this.setData({
      renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay
    })
  },
})
