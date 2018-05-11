// search.js
//获取应用实例
var app = getApp()
var userid, pageNumber = 1
var util = require('../../utils/util.js')
var skType, baseHigh = 150, clicked = false,ss
var header = require('../../component/title/title.js');
// var flag=0
Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '比目有价，实惠有余',
      desc: '比目有价，实惠有余',
      path: '/pages/index/index?parentid=' + app.globalData.parentID,
      imageUrl: 'https://xcx.byscape.com/xbm_rootdir/mamamiya/resource/share-index.png',
      // path: '/page/mine?goods_id=' + goods_id + '',
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
    comTitle: {
      isHide: true,
      comTitle: "商品详情"
    },
    flag: 1,
    isChecked: false,
    CheckItem: 0,
    userInfo: {},
    totype: 0,
    renwushenfen: 1,
    scrollTop: 0,
    amount: 1836,
    searchItem: '',
    searchCount: 0,
    sortType: 0,
    isHideLoadMore: 1,
    isFocus: 1,
    images: [],
    floorstatus: false,
    goodsdata3: [
      { colName: "最新", colID: "0" },
      { colName: "销量", colID: "9" },
      { colName: "价格", colID: "4" },
      { colName: "优惠", colID: "1" },
    ],
    goodsdata1: [],
    goodsdata2: [],
    movies: [],
  },

  //事件处理函数
  search: function () {
    if (clicked)
      return
    clicked = true

    console.log(1)
    // debugger
    if (this.data.searchItem) {
      pageNumber = 1
      util.doSearch(userid, this, pageNumber, 40, this.data.sortType, 1, this.data.searchItem, this.data.searchItem, 1, app.globalData.w11)
      this.setData({
        scrollTop: 0
      }, function(){
        clicked = false 
      })
    }
    else {
      this.show('请输入关键词')
      // this.setData({
      //   flag: 1
      // })
    }

  },
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if (e.detail.scrollTop > 500) {
      //      console.log(e.detail.scrollTop)
      this.setData({
        floorstatus: true
      });
      /*    var i = baseHigh + (pageNumber - 1) * 20 * 280 + 10 * 280
          if (e.detail.scrollTop >= i) {
            pageNumber++
            if (this.data.isSearch)
             util.doSearch(userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, 1, app.globalData.w11)
            else
              util.doSearch(userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, 0, app.globalData.w11)
     
          } */
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //商品详情页
  showGoods: function (e) {
    if (clicked)
      return
    clicked = true
    var id = e.currentTarget.id;
    var idarray = id.split("-")
    var goods_id = idarray[0]
    var num_iid = idarray[1]
    console.log(e.currentTarget)
    console.log('good_id' + goods_id)
    console.log('num_iid' + num_iid)
    var good = this.data.images.find(function (x) {
      return x.num_iid == num_iid;
    })
    good.qurl = encodeURIComponent(good.qurl)
    console.log(JSON.stringify(good))
    wx.navigateTo({
      url: '../chanpinneiye/chanpinneiye?goods_id=0&str=' + JSON.stringify(good)
    })
  },
  //返回顶部事件处理函数
  back: function () {
    console.log(1)
    this.setData({
      totype: 0
    })
  },
  //导航条点击事件
  sortClick: function (e) {
    var navid = e.currentTarget.id;
    var that = this
    console.log(navid)
    this.setData({
      isChecked: true,
      CheckItem: navid,
      sortType: navid
    }, function () {
      pageNumber = 1
      util.doSearch(userid, that, pageNumber, 40, that.data.sortType, 1, that.data.searchItem, that.data.searchItem, 1, app.globalData.w11)
      this.setData({
        scrollTop: 0
      })
    })
  },

  onLoad: function (options) {
    header.init.apply(this, []);
    var ss = options.searchItem
    var showCancel
    if (ss)
      showCancel = 1
    else
      showCancel = 0 

    var isCompare = options.isCompare
    new app.ToastPannel();
    console.log('onLoad')
    var that = this
    //更新数据
    that.setData({
      // flag: 1,
      searchItem: ss,
      renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay,
      showCancel: showCancel
    })
    userid = app.globalData.userid
    console.log('用户id' + userid)
    util.moduleLog(app.globalData.userid, 23)
    if (ss) {
      var res = app.globalData.searchResult
      for (var i = 0; i < res.length; i++) {
        res[i].title = util.myStrLeft(res[i].title, app.globalData.w11) + "..."
        //        res[i].commission = res[i].commission.toFixed(2)
        res[i].usercommission = res[i].usercommission ? parseFloat(res[i].usercommission).toFixed(2) : 0
        res[i]["iid"] = i + 1
      }
      console.log(res)
      that.setData({
        images: res,
        searchCount: app.globalData.searchCount
      })
      if (isCompare) {
        var tags = ss
        tags = tags.replace(/,/g, "&")
        tags = tags.replace(/\//g, "&")
        var Atags = tags.split('&')
        if (Atags.length > 2)
          tags = Atags[0] + '&' + Atags[1]
        app.globalData.curGoods = res
        var command = "item/itemsearchnew"
        var parm = { "keywords": tags, "userId": userid, "Records": 4, "PageNumber": 1, "skType": 3, "sortType": 4, "hisSearch": tags }
        console.log(parm)
        util.myRequest(userid, command, parm, (res) => {
          console.log('similar goods')
          console.log(res)

          if (res == tags || util.isBlank(res.res)) {
            app.globalData.searchCount = 0
          }
          else {
            for (var i = 0; i < res.res.length; i++) {

              res.res[i].title = util.myStrLeft(res.res[i].title, app.globalData.w16) + "..."
              res.res[i].usercommission = res.res[i].usercommission ? parseFloat(res.res[i].usercommission).toFixed(2) : 0
              res.res[i].coupon_price = parseFloat(res.res[i].coupon_price).toFixed(1)
              res.res[i]["iid"] = i + 1
            }
            this.setData({
              goodsdata1: res.res
            })
          }
        })
      }
    }
  },
  //加载更多
  onReachBottom: function () {
    if (clicked)
      return
    clicked = true
    console.log('加载更多')
    setTimeout(() => {
      pageNumber++
      util.doSearch(userid, this, pageNumber, 40, this.data.sortType, 1, this.data.searchItem, this.data.searchItem, 1, app.globalData.w11, function () {
        clicked = false
      })
    }, 1000)
  },
  searchInput: function (e) {
    ss = e.detail.value
    var showCancel
    if (ss)
      showCancel = 1
    else
      showCancel = 0

    this.setData({
      searchItem: e.detail.value,
      showCancel: showCancel
    })
  },
  onShow: function () {
    clicked = false
    console.log('index show')
  },
  inputFocus: function (e) {
    ss = e.detail.value
    var showCancel
    if (ss)
      showCancel = 1
    else
      showCancel = 0

    this.setData({
      showCancel: showCancel,
      isFocus: 0
    })
  },
  cancelInput: function () {
    ss = ''
    this.setData({
      searchItem: ss,
      showCancel: 0,
      isFocus: 1
    })
  },
  lostFocus: function () {
    if (!this.data.searchItem) {
      this.setData({
        isFocus: 1
      })
    }
  }
})
