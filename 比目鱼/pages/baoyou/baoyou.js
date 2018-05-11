//baoyou.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js');
var pageNumber = 1;
var userid, ss, navid = 1
var baseHigh = 10, clicked = false
var header = require('../../component/title/title.js');
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
    comTitle: {
      isHide: false,
      comTitle: ""
    },

    searchItem:"",
    searchItem1:1,
    isChecked: false,
    CheckItem: 1,
    isChecked1: false,
    isFocus: 1,
    // CheckItem1: 0,
    userInfo: {},
    tohe: 600,
    totype: 0,
    sortType: 1,
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
    goodsdata4: [
       { sortName: "9.9", sortID: "1", sorturl: "../image/baoyou1.png", sorturl1: "../image/baoyou1-1.png", sortText:"9.9包邮" },
       { sortName: "19.9", sortID: "2", sorturl: "../image/baoyou2.png", sorturl1: "../image/baoyou2-2.png", sortText: "19.9包邮" },
       { sortName: "29.9", sortID: "3", sorturl: "../image/baoyou3.png", sorturl1: "../image/baoyou3-3.png", sortText: "29.9包邮" }
   
    ],
    sortSel: 1
  },
  //事件处理函数

  //商品详情页.
  showGoods: function (e) {
    if (clicked)
      return
    clicked = true
    console.log("1122")
    var goods_id = e.currentTarget.id;
    console.log(e.currentTarget)
    wx.navigateTo({
      url: '../chanpinneiye/chanpinneiye?goods_id=' + goods_id
    })
  },

  baoyou:function(e){
    if (clicked)
      return
    clicked = true
    navid = e.currentTarget.id;
    var jk, fl
    console.log(e.currentTarget.id)
    this.setData({
      searchItem1: e.currentTarget.id,
      searchItem: '',
      scrollTop: 0,
      sortSel: navid
    })
    pageNumber = 1
    var that = this
    this.setData({
      isChecked: true,
      CheckItem1: navid
    })
    if (navid == 1) {
      jk = 16
      fl = "9.9"
    }
    else if (navid == 2) {
      jk = 32
      fl = "19.9"
    }
    else {
      jk = 64
      fl = "29.9"
    }
    util.doSearch(userid, that, pageNumber, 40, that.data.sortType, 2, fl, fl, jk, app.globalData.w11, function () {
      clicked = false
    }    )
   },
  //排序点击事件
  sortClick: function (e) {
    if (clicked)
      return
    clicked = true
    pageNumber = 1
    var navid1 = e.currentTarget.id;
    var that = this
    this.setData({
      isChecked: true,
      CheckItem: navid1,
      sortType: navid1,
      scrollTop: 0
    }, function () {
      var jk, fl
      if (navid == 1) {
        jk = 16
        fl = "9.9"
      }
      else if (navid == 2) {
        jk = 32
        fl = "19.9"
      }
      else {
        jk = 64
        fl = "29.9"
      }

      if (ss)
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, jk + 1, app.globalData.w11, function () {
          clicked = false
        }    )
      else
        util.doSearch(app.globalData.userid, that, pageNumber, 40, that.data.sortType, 2, fl, fl, jk, app.globalData.w11, function () {
          clicked = false
        }    )
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
 //   console.log(e.detail.scrollTop)
    var isScroll = e.detail.scrollTop > 500 ? true : false
    this.setData({
      floorstatus: isScroll
    })
   /* 
    var i = baseHigh + (pageNumber - 1) * 20 * 280 + 10 * 140
    if (e.detail.scrollTop >= i) {
      var jk
      if (navid == 1)
        jk = 16
      else if (navid == 2)
        jk = 32
      else
        jk = 64
      pageNumber++
      if (ss)
        util.doSearch(app.globalData.userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, jk + 1, app.globalData.w11)
 //       util.doSearch(app.globalData.userid, this, pageNumber, 2, ss, "item/baoyou")
      else {
        util.doSearch(app.globalData.userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, jk, app.globalData.w11)
      }

  } */
  },

  onLoad: function () {
    console.log('onLoad')
    new app.ToastPannel();
    var that = this
    //调用应用实例的方法获取全局数据
    //更新数据

    that.setData({
      renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay
    }, function () {
      userid = app.globalData.userid
      util.moduleLog(userid, 30)

      console.log('renwufen' + app.globalData.isAgent)
      console.log('userid' + userid)
      pageNumber = 1
      util.doSearch(app.globalData.userid, that, pageNumber, 40, 1, 2, '9.9', '9.9', 16, app.globalData.w11)
    })

  },
  //事件处理函数
  search: function () {
    if (clicked)
      return
    clicked = true

    // debugger
    if (this.data.searchItem) {
      var jk
      if (navid == 1)
        jk = 16
      else if (navid == 2)
        jk = 32
      else
        jk = 64
      ss = this.data.searchItem ;
      pageNumber = 1
      util.doSearch(userid, this, pageNumber, 40, this.data.sortType, 1, ss, ss, jk + 1, app.globalData.w11, function () {
        console.log("加载完成")
        clicked = false
      })
      this.setData({
        scrollTop: 0
      })
    }
    else {
      this.show('请输入关键词')
      // this.setData({
      //   flag: 1
      // })
    }

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

  //加载更多
  onReachBottom: function () {
    if (clicked)
      return
    clicked = true
    console.log('加载更多')
    var jk, fl
    if (navid == 1) {
      jk = 16
      fl = "9.9"
    }
    else if (navid == 2) {
      jk = 32
      fl = "19.9"
    }
    else {
      jk = 64
      fl = "29.9"
    }
    setTimeout(() => {
      pageNumber++
      
      if (ss)
        util.doSearch(app.globalData.userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, jk + 1, app.globalData.w11, function() {
          console.log("加载完成")
          clicked = false
        } )
      else
      {
        util.doSearch(app.globalData.userid, this, pageNumber, 40, this.data.sortType, 2, fl, fl, jk, app.globalData.w11, function () {
          console.log("加载完成")
          clicked = false
        })
      }
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
  inputFocus:function(e) {
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
  cancelInput : function () {
    ss = ''
    this.setData({
      searchItem: ss,
      showCancel: 0,
      isFocus: 1
    })
  },
  lostFocus : function () {
    if (!this.data.searchItem) {
      this.setData({
        isFocus: 1 
      })
    }
  }
})
