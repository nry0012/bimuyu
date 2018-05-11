//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js');
var pageNumber = 1;
var userid, ss
var baseHigh = 0, clicked = false

Page({
  data: {
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
    goodsdata2: [],
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
    wx.navigateTo({
      url: '../chanpinneiye/chanpinneiye?goods_id=' + goods_id
    })
  },

  //导航条点击事件
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
      if (ss)
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 1, app.globalData.w11, function () {
          clicked = false
        } )
      else
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 16, app.globalData.w11, function () {
          clicked = false
        } )
    })

  },

  // 一键置顶
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    var isScroll = e.detail.scrollTop > 500 ? true : false
    this.setData({
      floorstatus: isScroll
    })
    var i = baseHigh + (pageNumber - 1) * 20 * 280 + 10 * 280
    if (e.detail.scrollTop >= i) {
   /*   pageNumber++
      
      if (ss)
        util.doSearch(app.globalData.userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, 1, app.globalData.w11)
      else
        util.doSearch(app.globalData.userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, 16, app.globalData.w11)

*/
    }

  },

  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    ss = decodeURIComponent(options.searchItem)
    var bigType = options.bigType
    if (!bigType)
      bigType = ss

    util.moduleLog(app.globalData.userid, 21)
    //调用应用实例的方法获取全局数据
    //更新数据
    // 热区
    var command = "message/picsetting"
    var parm = { "picType": 5 }
    util.myRequest(userid, command, parm, (res) => {
      //      console.log(res)
      var k = 0
      var types2 = []
      for (var i = 0; i < res.length; i++) {
        if (res[i].picSearchName == bigType) {
          k = 1
          break
        }
      }
      if (k) {
        types2[0] = res[i]
        for (var j = 0; j < res.length; j++) {
          if (j < i)
            types2[j + 1] = res[j]
          else if (j > i)
            types2[j] = res[j]
          types2[j].picSort = j + 1;
        }
        this.setData({
          searchItem: bigType
        })
      }
      else
        types2 = res

      that.setData({
        goodsdata2: types2
      }, function () {
        console.log(that.data.goodsdata2)
      })

      //    })

    })


    that.setData({
      renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay,
      searchItem: options.searchItem
    }, function () {
      userid = app.globalData.userid
      console.log('renwufen' + app.globalData.isAgent)
      console.log('userid' + userid)
      pageNumber = 1
      //      util.doItems(userid, that, 1, 'itemlist99')
    })
    if (ss) {
      var res = app.globalData.searchResult
      for (var i = 0; i < res.length; i++) {
        res[i].title = util.myStrLeft(res[i].title, app.globalData.w11) + "..."
        res[i].commission = res[i].commission
        res[i]["iid"] = i + 1
      }
      console.log(res)
      that.setData({
        images: res
      })
    }
  },

  typeSearch: function (e) {
    if (clicked)
      return
    clicked = true
    console.log(e.target.dataset.name);
    this.setData({
      searchItem: e.target.dataset.name,
      scrollTop: 0
    })
    var navid1 = e.currentTarget.id;
    var navs = this.data.goodsdata2
    ss = navs[navid1 - 1].sortKey
    if (!ss)
      ss = navs[navid1 - 1].picSearchName
    pageNumber = 1
    util.doSearch(app.globalData.userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, 1, app.globalData.w11, function () {
      clicked = false
    } )
  },
  //加载更多
  onReachBottom: function () {
    if (clicked)
      return
    clicked = true
    console.log('加载更多')

    setTimeout(() => {
      pageNumber++
      
      if (ss)
        util.doSearch(app.globalData.userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, 1, app.globalData.w11, function () {
          clicked = false
        } )
      else
        util.doSearch(app.globalData.userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, 16, app.globalData.w11, function () {
          clicked = false
        } )
      this.setData({
        isHideLoadMore: true
      })

    }, 1000)
  },
  onShow: function () {
    clicked = false

  },
})
