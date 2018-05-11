var app = getApp()
var util = require('../../utils/util.js');
var pageNumber = 1;
var userid, ss, baseHigh=300

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
    flag: 0,
    isChecked: false,
    isSearch: false,
    CheckItem: 0,
    CheckItem1: 0,
    isChecked1: false,
    searchItem: '精选',
    sortType: 1,
    userInfo: {},
    tohe: 600,
    totype: 0,
  
    renwushenfen: 1,
    scrollTop: 0,
    floorstatus: false,
    images: [],
    goodsdata3: [
      { colName: "最新", colID: "1" },
      { colName: "销量", colID: "2" },
      { colName: "价格", colID: "3" },
      { colName: "优惠", colID: "4" },
    ],
    goodsdata: {
       source: "1"
    },
    goodsdata2: [
    ],
  },
  //事件处理函数
  search: function () {
    if (this.data.searchItem) {
      pageNumber = 1
      util.doSearch(userid, this, pageNumber, 40, this.data.sortType, 1, this.data.searchItem, this.data.searchItem, 3, app.globalData.w11)
      this.setData({
        isSearch: true
      })
    }
    else {
      this.show('请输入关键词')
    }
  },

  //商品详情页
  showGoods: function (e) {
    var goods_id = e.currentTarget.id;
    console.log(e.currentTarget)
    wx.navigateTo({
      url: '../chanpinneiye/chanpinneiye?goods_id=' + goods_id
    })
  },

  //导航条点击事件 平台不同
  serviceSelection: function (e) {
    var navid = e.currentTarget.id;
    var that = this
    this.setData({
      isChecked: true,
      CheckItem: navid
    }, function () {
      pageNumber = 1
      util.doSearch(userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 2, app.globalData.w11)
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
  //  console.log(e.detail.scrollTop)
    var isScroll = e.detail.scrollTop > 500 ? true : false
    this.setData({
      floorstatus: isScroll
    })
    var i = baseHigh + (pageNumber - 1) * 20 * 280 + 10 * 280
    if (e.detail.scrollTop >= i) {
      pageNumber++
      if (this.data.isSearch) {
        util.doSearch(userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, 3, app.globalData.w11)
      }
      else {
        util.doSearch(userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, 2, app.globalData.w11)
      }
    }

  },

  onLoad: function () {
    console.log('onLoad')
    new app.ToastPannel();
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay,
        // flag:1
      })
    })
    userid = app.globalData.userid
    util.moduleLog(app.globalData.userid, 4)
    pageNumber = 1
    util.doSearch(userid, that, pageNumber, 40, that.data.sortType, 2, ss, ss, 2, app.globalData.w11)

    var command = "message/picsetting"
    var parm = { "picType": 5 }
    util.myRequest(userid, command, parm, (res) => {
      //      console.log(res)
/*      var types = res
      var stype = ''
      for (var i = 0; i < types.length; i++) {
        stype += types[i].picSearchName + ','
      }
      stype = stype.substr(0, stype.length - 1)
      var command = "item/itemkey"
      var parm = { "stype": stype, "sortType": 2 }
      console.log(stype)
      util.myRequest(userid, command, parm, (res) => {
        console.log(res)
        var keys = util.strDuplex(res[0].typekey).split(';')
        for (var i = 0; i < types.length; i++) {
          keys[i] = util.strDuplex(keys[i])
          types[i]["sortKey"] = keys[i]
        }
*/
        that.setData({
          goodsdata2: res
        }, function () {
          console.log(that.data.goodsdata2)
        })

   //   })

    })


  },

  //加载更多
  onReachBottom: function () {
    console.log('加载更多')

    setTimeout(() => {
      pageNumber++
      if (this.data.isSearch) {
        util.doSearch(userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, 3, app.globalData.w11)
      }
      else {
        util.doSearch(userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, 2, app.globalData.w11)
      }
      this.setData({
        isHideLoadMore: true,
      })
    }, 1000)
  },

  searchInput: function (e) {
    this.setData({
      searchItem: e.detail.value
    })
  },

  sortsearch: function (e) {
    console.log(e.target.dataset.name);
    this.setData({
      searchItem: e.target.dataset.name,
      isSearch: true
    })
    var navid1 = e.currentTarget.id;
    var navs = this.data.goodsdata2
  //  ss = navs[navid1 - 1].sortKey
  //  if (!ss)
    ss = navs[navid1 - 1].picSearchName
    pageNumber = 1
    util.doSearch(userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, 3, app.globalData.w11)
  },
})
