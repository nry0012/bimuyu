// search.js
var app = getApp()
var userid, pageNumber = 1, clicked = false
var ss
var util = require('../../utils/util.js')
var header = require('../../component/title/title.js');

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
      comTitle: "商品搜索"
    },

    isChecked: false,
    CheckItem: 0,
    sortType:10,
    renwushenfen: 0,
    sousuo: 1,
    yangshi: true,
    searchItem: '',
    images: [],
    sortSel: 1,
    isFocus: 1,
    goodsdata: {
      goodsamount: "11123",
    },
    goodsdata1: [
      { colName: "最新", colID: "0" },
      { colName: "销量", colID: "9" },
      { colName: "价格", colID: "4" },
      { colName: "优惠", colID: "1" }
    ],
    goodsdata2: [],
    goodsdata3: []
  },

  //超级搜索事件处理函数
  search: function () {
    if (this.data.searchItem) {
      app.doPresearch(userid, this, 1, 1, this.data.searchItem, 0, 0, this.data.searchItem, this.data.searchItem, 1)
    }
    else
    {
      this.show('请输入关键词')
    }
  },

  hotSearch: function (e) {
    if (clicked)
      return
    clicked = true

    var hot = e.currentTarget.id;
    var navs = this.data.goodsdata3
    var ss
  //  ss = navs[hot - 1].sortKey
  //  if (!ss)
      ss = navs[hot - 1].remen

    console.log('navName')
    console.log(ss)
    if (ss) {
      app.doPresearch(userid, this, 1, 2, ss, 0, 0, navs[hot - 1].remen, navs[hot - 1].remen, 1, function () {
        clicked = false
      } )
    }
/*
    if (hot) {
      app.doPresearch(userid, this, 1, 2, hot)
    } */
  },
  historySearch: function (e) {
    if (clicked)
      return
    clicked = true
    var his = e.currentTarget.id;
    if (his) {
      app.doPresearch(userid, this, 1, 1, his, 0, 0, his, his, 1, function () {
        clicked = false
      } )
    }
  },

  // search: function () {
  //   this.setData({
  //     yangshi: true
  //   })
  // },
  //事件处理函数
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  //立即领券跳转事件处理函数
  // lijilingquan:function(){
  //   wx.redirectTo({
  //     url: '../chanpinneiye/chanpinneiye'
  //   })
  // },
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
  //导航条点击事件
  serviceSelection: function (e) {
    var navid = e.currentTarget.id;

    this.setData({
      isChecked: true,
      CheckItem: navid
    })
    wx.redirectTo({
      url: '../index/index?id=' + navid
    })
  },
  qingkong: function () {
    console.log(1)
    this.yangshi = true;
    this.setData({
      goodsdata2: []
    },function(){
      var command = "Search/seek_log_delete"
      var parm = { "userId": app.globalData.userid }
      util.myRequest(app.globalData.userid, command, parm, (res) => {
      })
    })
  },

  onLoad: function () {
    console.log('onLoad seachnodata')
    new app.ToastPannel();
    header.init.apply(this, []);
    userid = app.globalData.userid
    var that = this
    //调用应用实例的方法获取全局数据

    util.moduleLog(app.globalData.userid, 22)
    var command = "search/seek_log_hot"
    var parm = { "userId": app.globalData.userid }
    util.myRequest(app.globalData.userid, command, parm, (res) => {
      console.log(res)
      for (var i = 0; i < res.length; i++) {
        res[i]["remenID"] = i + 1
      }
        that.setData({
          goodsdata3: res
        }, function () {
          console.log('goodsdata3')
          console.log(that.data.goodsdata3)
        })
    })


    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay
      })
    })

    var command = "item/seeklog"
    var parm = { "userid": app.globalData.userid, "records": 50 }
    util.myRequest(app.globalData.userid, command, parm, (res) => {
      console.log(res)
      if (res) {
        var s, isign, ilen = res.length
        for (var i = 0; i < ilen; i++) {
          isign = 0
          res[i].skKey = res[i].skKey.substr(0,10)
          for (var j = 0;j < i;j ++)
          {
            if (res[i].skKey == res[j].skKey)
            {
              res.splice(i, 1)
              i--
              ilen--
              isign = 1
            }
          }
          if (isign)
          {
          }
          else
            res[i]["id"] = i
        }
        that.setData({
          goodsdata2: res
        })
      }
    })
    console.log('require end')

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