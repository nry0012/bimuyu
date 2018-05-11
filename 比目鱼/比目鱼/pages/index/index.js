//index.js
//获取应用实例

var app = getApp()
var flag = 0;
var tiaozhuan = 0;
var util = require('../../utils/util.js');
var pageNumber = 1;
var userid, parentid;
var scountdown = ""
var ss, baseHigh = 700, sortScroll = 1700, clicked = false

function p_sortsearch(that, clickedtype, id) {
  var navs, navid1
  if (clickedtype == 1)
    navs = that.data.specialChannel
  else if (clickedtype == 2)
    navs = that.data.goodsCatalog
  navid1 = id;

  var bType, bRemark
  ss = navs[navid1 - 1].picSearchName
  bType = navs[navid1 - 1].picSearchType
  bRemark = navs[navid1 - 1].picRemark
  if (!ss)
    ss = navs[navid1 - 1].sortName
  if (bType == 1) {
    if (ss) {
      //    app.doPresearch(userid, that, 1, 2, ss, 1, 0, navs[navid1 - 1].sortName)
      pageNumber = 1
      util.doSearch(userid, that, pageNumber, 20, that.data.sortType, 2, ss, navs[navid1 - 1].sortName, 9, app.globalData.w11, function () {
        clicked = false
      }    )
      that.setData({
        scrollTop: sortScroll
      })
      var j = 0, toplist = that.data.goodsdata3
      for (var i = 0; i < toplist.length; i++) {
        if (toplist[i].colName == navs[navid1 - 1].picSearchName) {
          that.setData({
            isChecked: true,
            CheckItem: toplist[i].colID,
            isSearch: true
          })
          j = 1
        }
      }
      if (j == 0) {
        toplist[5].colName = navs[navid1 - 1].picSearchName
        //       toplist[5].sortKey = navs[navid1 - 1].sortKey
        that.setData({
          goodsdata3: toplist,
          isChecked: true,
          CheckItem: toplist[5].colID,
          isSearch: true
        }, function () {
          console.log('toplist')
          console.log(toplist)
          console.log(that.data.specialChannel)
        })
      }

    }
  }
  else if (bType == 3) {
    wx.navigateTo({
      url: bRemark
    })
  }
  else if (bType == 5) {
    wx.switchTab({
      url: bRemark
    })
  }
}


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
        console.log('parentID=' + parentid)
        console.log('转发成功！')
        var command = "share/log"
        userid = app.globalData.userid
        var parm = { "userId": userid, "goodsId": "", "shSource": 1, "shType": 2, "shTarget": "" }
        util.myRequest(userid, command, parm, (res) => {
          console.log(res)
        })
      },
      fail: function (res) {
        console.log('转发失败！')
        // 转发失败
      }
    }
  },
  data: {
    type: 1,
    scountdown: "",
    isChecked: false,
    isSearch: false,
    CheckItem: 0,
    isChecked1: false,
    // CheckItem1: 0,
    userInfo: {},
    tohe: 600,
    // totype: 0,
    renwushenfen: '',
    floorstatus: false,
    scrollTop: 0,
    isHideLoadMore: true,
    tanchu: 0,
    images: [],
    searchItem: '',
    sortType: 1,
    // goodsdata: {
    //   goodsamount: "11123",
    //   source: "1"
    // },
    goodsdata: [],
    jdgoods: [],
    goodsdata1: [
      { colName: "最新", colID: "1" },
      { colName: "销量", colID: "2" },
      { colName: "价格", colID: "3" },
      { colName: "优惠", colID: "4" }
    ],
    specialChannel: [],
    goodsdata3: [
      { colName: "优选", colID: "1" },
      { colName: "女装", colID: "2" },
      { colName: "居家", colID: "3" },
      { colName: "美妆", colID: "4" },
      { colName: "鞋包", colID: "5" },
      { colName: "数码", colID: "6" },

    ],
    goodsCatalog: [],
    hotArea: [],
    banners: [],

    getSystemInfo() {
      try {
        const res = wx.getSystemInfoSync();
        this.setData({
          scrollViewHeight: res.windowHeight * res.pixelRatio || 667
        });
      } catch (e) {
        console.log(e);
      }
    },
  },

  // 特惠推荐页面
  tehui: function () {
    if (clicked)
      return
    clicked = true

    wx.navigateTo({
      url: '../tehui/tehui',
    })
  },

  // 专用栏目点击
  specialChannelClick: function(e) {
    if (clicked)
      return
    clicked = true

    var name = e.target.dataset.name;
    if (!name)
      name = e.currentTarget.dataset.name;
    var id = e.currentTarget.id;
    var j = 0
    for (var i = 0; i < this.data.specialChannel.length;i ++) 
    {
      j++
      if (this.data.specialChannel[i].picSearchName == name) 
        break
    }
    if (j) {
      if (this.data.specialChannel[i].picSearchType == 1) { // 正常进入活动页
        var pic
        if (id == 13)
          pic = 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/food-lili.png'
        if (id == 14)
          pic = 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/spring.png'
        if (id == 15)
          pic = 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/douyin-banner.png'
        if (id == 16)
          pic = 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/juhuasuan.png'
        if (id == 17)
          pic = 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/star_bao.png'
        if (id == 18)
          pic = 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/jd-banner.png'
        if (id == 19)
          pic = 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/sh-banner.png'
        name = encodeURIComponent(name)
        wx.navigateTo({
          url: '../activity/activity?id=' + id + "&name=" + name + "&pic=" + pic
        })
      }
      else if (this.data.specialChannel[i].picSearchType == 3) { // 进入指定页面
        wx.navigateTo({
          url: this.data.specialChannel[i].picRemark
        })
      }
      else if (this.data.specialChannel[i].picSearchType == 5) { // 进入指定页面
        wx.switchTab({
          url: this.data.specialChannel[i].picRemark
        })
      }
      
    }
  },
  //活动页
  activity: function (e) {
    if (clicked)
      return
    clicked = true

    var name = e.target.dataset.name;
    if (!name)
      name = e.currentTarget.dataset.name;
    var id = e.currentTarget.id;
    
    var pic
    if (id == 13)
      pic = 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/food-lili.png'
    if (id == 14)
      pic = 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/spring.png'
    if (id == 15)
      pic = 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/douyin-banner.png'
    if (id == 16)
      pic = 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/juhuasuan.png'
    if (id == 17)
      pic = 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/star_bao.png'
    if (id == 18)
      pic = 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/jd-banner.png'
    if (id == 19)
      pic = 'http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/sh-banner.png'
    name = encodeURIComponent(name)
    wx.navigateTo({
      url: '../activity/activity?id=' + id + "&name=" + name + "&pic=" + pic
    })
  },
  //banner活动页
  bannerClick: function (e) {
    if (clicked)
      return
    clicked = true

    var name = e.target.dataset.name;
    var id = e.currentTarget.id;
    var pic = "", d = this.data.banners, picType, picRemark
    for (var i = 0; i < d.length; i++) {
      if (d[i].picSort == id) {
        pic = d[i].picUrl
        picType = d[i].picSearchType
        picRemark = d[i].picRemark
      }
    }
// 抖音单独处理
    if (picType == 6)
      id = 15
    name = encodeURIComponent(name)
    wx.navigateTo({
      url: '../activity/activity?id=' + id + "&name=" + name + "&pic=" + pic
    })
  },

  superSearch: function () {
    wx.navigateTo({
//      url: '../sort/sort'
      url: '../sousuowuxiao/sousuowuxiao'
    })
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
  //导航条点击事件  顶部
  navClick: function (e) {
    if (clicked)
      return
    clicked = true

    var navid = e.currentTarget.id;
    var that = this
    var sortName
    this.setData({
      isChecked: true,
      CheckItem: navid,
      isSearch: true
    })
    ss = ''
    for (var i = 0; i < that.data.goodsdata3.length; i++) {
      if (that.data.goodsdata3[i].colID == navid) {
        ss = that.data.goodsdata3[i].colName
        break
      }
    }
    if (ss) {
      pageNumber = 1
      util.doSearch(userid, this, pageNumber, 20, this.data.sortType, 2, ss, ss, 9, app.globalData.w11, function () {
        clicked = false
      }   )
      this.setData({
        scrollTop: sortScroll
      })
    }
    // 进行搜索
  },

  //遮盖层点击跳转事件
  sortsearch_zgc: function (e) {
    if (clicked)
      return
    clicked = true

    var navid1 = e.currentTarget.id;
    p_sortsearch(this, 2, navid1)
    this.setData({
      showModalStatus3: false,
      displayCir: 1,
      hasMask: false,
    })
    this.setData({
      scrollTop: sortScroll
    })

    flag = 0

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

  onLoad: function (options) {
    var that = this;
    console.log('onLoad index')
    console.log(options)
    if (options) {
      parentid = options.parentid
    }
    else {
      if (app.globalData.parentID1)
        parentid = app.globalData.parentID1
      else
        parentid = 0
    }
    console.log('parentID')
    console.log(parentid)

    // 限时特惠
    var command = "item/itemsearchnew"
    var parm = { "keywords": "限时特惠", "userId": 0, "Records": 1, "PageNumber": 1, "skType": 2, "sortType": 1, "hisSearch": "限时特惠", "funType": 2048 }
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
    })
    
    // 京东专区
    var command = "item/itemsearchnew"
    var parm = { "keywords": "京东", "userId": 0, "Records": 20, "PageNumber": 1, "skType": 2, "sortType": 1, "hisSearch": "京东", "funType": 512 }
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
        jdgoods: res.res
      })
    })

  // 加载首页栏目图片
    var command = "message/picsetting"
    var parm = { "picType": 0 }
    util.myRequest(userid, command, parm, (res) => {
      console.log(res)
      that.setData({
        banners: res["res1"],
        specialChannel: res["res2"],
        hotArea : res["res3"],
        goodsCatalog: res["res7"]
      })
    })

    var promise = app.getAuthKey()
    promise.then(function (res) {
      //调用应用实例的方法获取全局数据
      //更新数据
      console.log('start loading')
      if (!app.globalData.isAgent) {
        that.showModal2()
      }
      app.globalData.loadFinish = 1

      userid = app.globalData.userid
      if (app.globalData.isAgent) {
        app.globalData.parentID = userid
        parentid = userid
      }
      else {
        if (parentid) {
          app.globalData.parentID = parentid
          util.modiParent(userid, parentid)
        }
        else {
          if (app.globalData.parentID1) {
            parentid = app.globalData.parentID1
            app.globalData.parentID = parentid
            console.log('parentID111')
            console.log(app.globalData.parentID)
            util.modiParent(userid, parentid)
          }
          else
            app.globalData.parentID = 0
        }
      }

      that.setData({
        renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay,
        userLevel: app.globalData.agentLevel
      })
      pageNumber = 1
      util.moduleLog(app.globalData.userid, 1)
      util.doSearch(app.globalData.userid, that, pageNumber, 20, that.data.sortType, 2, '首页', '首页', 8, app.globalData.w11)
     
    })
  },
  onHide: function () {
    console.log('hide index')
  },

  onShow: function () {
    console.log('index show')
    clicked = false
    this.setData({
      renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay
    })
  },

  //加载更多
  jiazhaigengduo: function () {
    if (clicked)
      return
    clicked = true
    console.log('加载更多')
    //    setTimeout(() => {

    pageNumber++
    if (this.data.isSearch)
      util.doSearch(userid, this, pageNumber, 20, this.data.sortType, 2, ss, ss, 9, app.globalData.w11, function () {
        clicked = false
      }    )
    else
      util.doSearch(userid, this, pageNumber, 20, this.data.sortType, 2, '首页', '首页', 8, app.globalData.w11, function () {
        clicked = false
      }    )
    /*      this.setData({
            isHideLoadMore: true
          })
    */
    //    }, 1000)
  },

  // 显示遮罩层引导层部分
  showModal2: function () {
    if (flag == 1) {
      return false
    }
    this.setData({
      hasMask: true
    })
    flag = 1
    var animation2 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.animation2 = animation2
    animation2.opacity(0).rotateX(-100).step();
    this.setData({
      animationData2: animation2.export(),
      showModalStatus2: true
    })
    setTimeout(function () {
      animation2.opacity(1).rotateX(0).step();
      this.setData({
        animationData2: animation2.export()
      })
    }.bind(this), 200)
  },
  // 隐藏遮罩层引导层部分
  hideModal2: function () {
    flag = 0
    var animation2 = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation2 = animation2
    animation2.translateY(300).step()
    this.setData({
      animationData2: animation2.export(),
    })
    setTimeout(function () {
      animation2.translateY(0).step()
      this.setData({
        animationData2: animation2.export(),
        showModalStatus2: false
      })
    }.bind(this), 200)
    this.setData({
      hasMask: false
    })

  },
  // 隐藏遮罩层分类弹窗部分
  hideModal3: function () {
    // 隐藏遮罩层
    flag = 0
    var that = this
    var animation3 = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation3 = animation3
    // animation3.translateY(300).step()
    animation3.rotateX(0).rotateY(0).translateY(-300).step();
    this.setData({
      animationData3: animation3.export(),
      displayCir: 1,
      hasMask: false
    })
    setTimeout(function () {
      animation3.translateY(0).step()
      this.setData({
        animationData3: animation3.export(),
        showModalStatus3: false
      })
    }.bind(this), 200)
  },
  // 显示遮罩层分类弹窗部分
  showModal3: function () {
    if (flag == 1) {
      return false
    }
    this.setData({
      hasMask: true,
    })
    flag = 1

    var animation3 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.animation3 = animation3
    // animation.translateY(300).step()
    // 第3步：执行第一组动画 
    animation3.opacity(0).rotateX(0).rotateY(0).translateY(-300).step();
    this.setData({
      animationData3: animation3.export(),
      showModalStatus3: true,
      displayCir: 0,
    })
    setTimeout(function () {
      // animation.translateY(0).step()e
      animation3.opacity(1).rotateX(0).translateY(0).step();
      this.setData({
        animationData3: animation3.export()
      })
    }.bind(this), 500)
  },
  searchInput: function (e) {
    this.setData({
      searchItem: e.detail.value
    })
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
 /*     var i = baseHigh + (pageNumber - 1) * 20 * 280 + 10 * 280
      if (e.detail.scrollTop >= i) {
        pageNumber++
        if (this.data.isSearch)
          util.doSearch(userid, this, pageNumber, 20, this.data.sortType, 2, ss, ss, 9, app.globalData.w11)
        else
          util.doSearch(userid, this, pageNumber, 20, this.data.sortType, 2, ss, ss, 8, app.globalData.w11)

      } */
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  GetRP: function () {
    this.hideModal2()
    wx.switchTab({
      url: '../mine/mine' 
    })

  },
})
