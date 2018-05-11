// search.js
//获取应用实例
var app = getApp()
var userid, pageNumber = 1
var util = require('../../utils/util.js')
var skType, baseHigh = 150, ss, clicked = false
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
    type: 1,
    flag: 1,  // 是否找到相关商品
    isChecked: false,
    CheckItem: 0,
    userInfo: {},
    totype: 0,
    renwushenfen: 1,
    scrollTop: 0,
    amount: 1836,
    searchItem: '',
    searchCount: 0,
    sortType: 1,
    isHideLoadMore: 1,
    images: [],
    floorstatus: false,
    goodsdata3: [
      { colName: "最新", colID: "1" },
      { colName: "销量", colID: "2" },
      { colName: "价格", colID: "3" },
      { colName: "优惠", colID: "4" },
    ],
    goodsdata1: [ ],
    goodsdata2: [ ],

    movies: [],
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
      /*
      var i = baseHigh + (pageNumber - 1) * 20 * 280 + 20 * 280
      if (e.detail.scrollTop >= i) {
        pageNumber++
        if (this.data.isSearch)
          util.doSearch(app.globalData.userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, 1, app.globalData.w11)
        else
          util.doSearch(app.globalData.userid, this, pageNumber, 40, this.data.sortType, 2, ss, ss, 0, app.globalData.w11)

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
    var goods_id = e.currentTarget.id;
    console.log(e.currentTarget)
    wx.navigateTo({
      url: '../chanpinneiye/chanpinneiye?goods_id=' + goods_id
    })
  },
  //返回顶部事件处理函数
  back: function () {
    console.log(1)
    this.setData({
      totype: 0
    })
  },
 
  onLoad: function (options) {

    var goods_id = options.goodsID
    var command = "item/itemdetail"
    userid = app.globalData.userid
    util.moduleLog(app.globalData.userid, 24)
    var parm = { "id": goods_id, "userID": userid }
    util.myRequest(userid, command, parm, (res) => {
      console.log(res)
      //     if (!res.quan || res.quan == 0)
      //       res.quan = (res.price - res.coupon_price).toFixed(0)
      res.title = util.myStrLeft(res.title, app.globalData.w16) + "..."
      //取小数点后两位
      res.usercommission = res.usercommission ? parseFloat(res.usercommission).toFixed(2) : 0
      ss = res.tags
      this.setData({
        goods: res
      })
      // 货比三家
      util.showLoading()  
      var command = "item/itemsearchnew"
      var parm = { "keywords": ss, "userId": userid, "Records": 40, "PageNumber": 1, "skType": 3, "sortType": 4, "hisSearch": ss, "funcType": 1 }
      console.log(parm)
      util.myRequest(userid, command, parm, (res) => {
        console.log('similar goods')
        console.log(res)
        var flag
        if (res == ss || util.isBlank(res.res)) {
          console.log('no data compare')
          this.setData({
            flag: 0
          })
        }
        else {
          for (var i = 0; i < res.res.length; i++) {
            if (res.res[i].id == goods_id) {
              res.res.splice(i, 1)
              i--
            }
            else {
              res.res[i].title = util.myStrLeft(res.res[i].title, app.globalData.w16) + "..."
              res.res[i].usercommission = res.res[i].usercommission ? parseFloat(res.res[i].usercommission).toFixed(2) : 0
              res.res[i].coupon_price = parseFloat(res.res[i].coupon_price).toFixed(1)

              res.res[i]["iid"] = i + 1
            }
          }
          if (res.res.length == 0)
            flag = 0
          else
            flag = 1
          this.setData({
            images: res.res,
            flag: flag
          })
        }
        util.cancelLoading()
      })
    })

    new app.ToastPannel();
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        // flag: 1,
        userInfo: userInfo,
        renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay,
      })
    })


  },
  //加载更多
  onReachBottom: function () {
    console.log('加载更多')

  },

  onPullDownRefresh: function () {
    console.log('下拉刷新')
  },
  onShow: function () {
    clicked = false
  },
})
