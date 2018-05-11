// mine.js
var app = getApp()
var util = require('../../utils/util.js');
var cYear, cMonth, cDay, cNY, userid, rpState
var flag = 0;
var lingquchenggong = 1;
var cxt_arc
var views = 0, dispages = 6, goodFriends, loadings, gets, rpType, clicked = true, loads = 0, pageLoad = 1
var Qinvite = 10, Qflow = 60, Qorder = 15, isUpgrade = 0

function dataDeal(that) {
  if (app.globalData.isAgent) {
    // 取用户分数
    /*
        var idate = new Date()
        var sLevel = app.globalData.memberLevels[app.globalData.agentLevel]
    
        that.setData({
          degree: sLevel
        })
        // 下级用户个数、领取次数
        var command = "user/userlower"
        var parm = { "userId": userid }
        util.myRequest(userid, command, parm, (res) => {
          console.log('下级用户')
          console.log(res)
          gets = res.gets[0].gets
          if (!gets) 
            gets = 0
    
          goodFriends = res.lowers[0].lowers
          if (!goodFriends)
            goodFriends = 0 
    
          // goodFriends=6
          var fullg, g
          if (goodFriends < 6) {
            fullg = 0
            g = goodFriends
          }
          else {
            fullg = 1
            var gs = goodFriends - gets * 6
            if (gs >= 6)
            {
              g = 0
            }
            else
              g = goodFriends
          }
          that.setData({
            goodFriend_full: fullg,
            goodFriends: g
          })
        })
    */
    var command = "user/logincontinues"
    var parm = { "userId": userid }
    util.myRequest(userid, command, parm, (res) => {
      console.log('连续登陆')
      console.log(res)
      var cons = res.cons[0].cons
      // cons = 7
      var rpDate = res.rpDate
      var isTodayGet = res.isTodayGet
      cons = cons % 28;
      if (cons == 0)
        cons = 28;
      if (!isTodayGet)
        isTodayGet = 0
      else
        isTodayGet = 1

      that.setData({
        loading_full: isTodayGet,
        loadings: cons
      })
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
      title: "老铁，甭扎心了，一起飞吧！",
      desc: '老铁，甭扎心了，一起飞吧！',
      path: '/pages/index/index?parentid=' + app.globalData.parentID,
      imageUrl: 'https://xcx.byscape.com/xbm_rootdir/mamamiya/resource/share-invite.png',
      success: function (res) {
        console.log('parentID=' + app.globalData.parentID)
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
  /**
   * 页面的初始数据
   */
  data: {
    xiaoxi: 0,
    showModalStatus21: false,
    // 0未成为代理 1已成为代理
    renwushenfen: 0,
    // 0不展示上一月按钮 1展示上一月按钮
    userInfo: app.globalData.userInfo,
    payResult: 0,
    userLevel: 0,
    bonus: 0,
    rpType: 0, // 1:ordinary 2:cronze 3:sliver 4:golden 
    loadings: 0,
    loading_full: 0,
    images: [],
    isAuth: 1,
    userEmblemImg: "",
    userStatus: "",
    userStatusFull: "",
    worthyCount: 3,
    Qinvite: 10,
    Qflow: 60,
    Qorder: 15,
    worthys: [{ "wtID": 1, "wtPic": "../image/VIP.png", "wtName": "会员中心", "lwState": 1, "wtDealType": 1 },
    { "id": 2, "worthyImg": "../image/normalQuestion.png", "worthyText": "常见问题", "state": 1, "dealStyle": 1 },
    { "id": 3, "worthyImg": "../image/customer.png", "worthyText": "我的小蜜", "state": 1, "dealStyle": 3 },
    { "id": 4, "worthyImg": "../image/bonusLoading.png", "worthyText": "登陆红包", "state": 1, "dealStyle": 2 },
    { "id": 5, "worthyImg": "../image/bonusInvite.png", "worthyText": "邀请红包", "state": 1, "dealStyle": 2 },
    { "id": 6, "worthyImg": "../image/FreeStyle.png", "worthyText": "面单返现", "state": 1, "dealStyle": 1 },
    { "id": 7, "worthyImg": "../image/commission.png", "worthyText": "推广佣金", "state": 1, "dealStyle": 1 },
    { "id": 8, "worthyImg": "../image/messageCenter.png", "worthyText": "消息中心", "state": 1, "dealStyle": 1 },
    ],
    levels: [
      { "id": 0, "emblemImg": "../image/emblemVistor.png", "emblemFee": "-", "emblemName": "逛客用户", "emblemNameFull": "逛客用户  |  尚未开通会员身份" },
      { "id": 1, "emblemImg": "../image/emblemCommon.png", "emblemFee": "-", "emblemName": "普通会员", "emblemNameFull": "普通会员" },
      { "id": 2, "emblemImg": "../image/emblemCronze.png", "emblemFee": "-", "emblemName": "青铜会员", "emblemNameFull": "青铜会员" },
      { "id": 3, "emblemImg": "../image/emblemSilver.png", "emblemFee": "-", "emblemName": "白银会员", "emblemNameFull": "白银会员" },
      { "id": 4, "emblemImg": "../image/emblemGolden.png", "emblemFee": "-", "emblemName": "黄金会员", "emblemNameFull": "黄金会员" },
    ],
  },
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

  //查看更多下线成员用户
  chengyuan: function () {
    if (clicked)
      return
    clicked = true

    wx.navigateTo({
      url: '../chengyuan/chengyuan',
    })
  },

  onLoad: function () {
    // 红包来了弹窗 惊喜红包
    //  旧遮罩层
    //    this.showModal2();
    console.log('onLoad')
    if (!app.globalData.loadFinish) {
      clicked = true
      pageLoad = 0
      this.setData({
        showPageLoadingStatus: true
      })
      return
    }
    else {
      this.setData({
        showPageLoadingStatus: false
      })
    }
    new app.ToastPannel();
    var that = this
    //调用应用实例的方法获取全局数据
    //更新数据
    var iYear, iMonth, iDay
    that.setData({
      renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay,
      //  renwushenfen: 0,
      // flag:1,
      userInfo: app.globalData.userInfo,
      userLevel: app.globalData.agentLevel,
    })

    userid = app.globalData.userid
    util.moduleLog(userid, 40)
    var userStatus, userStatusFull, userEmblemImg, dw

    dataDeal(this)

    userStatus = app.globalData.lvName
    userStatusFull = app.globalData.lvNameFull
    userEmblemImg = app.globalData.lvEmblem
    dw = userStatus.substr(0, 2)
    this.setData({

    })
    var isUpdate=0
    // 个人权益
    var command = "message/personalstate"
    userid = app.globalData.userid
    var parm = { "userId": userid }
    util.myRequest(userid, command, parm, (res) => {
      console.log('个人权益')
      console.log(res)
      var j = 0, k = 0
      var worthys = [], worthy = []
      for (var i = 0; i < res.worthy.length; i++) {
        res.worthy[i]["DID"] = (Math.floor(i / 8)) + ',' + (i % 8)
        res.worthy[i]["IID"] = i % 8
        if (res.worthy[i].lwState)
          j++
        if (i > 0 && i % 8 == 0) {
          k = i / 8;
          worthys[k - 1] = {}
          worthys[k - 1]["id"] = k
          worthys[k - 1]["worthy"] = worthy
          worthy = []
        }
        worthy.push(res.worthy[i])
      }
      if (i > 0 && i % 8 > 0) {
        k = Math.ceil(i / 8)
        worthys[k - 1] = {}
        worthys[k - 1]["id"] = k
        worthys[k - 1]["worthy"] = worthy
      }
      if (app.globalData.isAgent) {
        if (app.globalData.userRigisterDate) {
          var dt2 = new Date()
          var dt1 = new Date(app.globalData.userRigisterDate * 1000)
          //          var dt1 = dt
          //          dt.setDate(dt.getDate() + res.lvValidity);
          //          var expireDate = util.formatTime(dt, 1)

          var days = dt2.getTime() - dt1.getTime();
          var times = parseInt(days / (1000 * 60 * 60 * 24));
          var leftDays = res.lvValidity - times
          userStatusFull += ' | 剩余天数：' + leftDays + '天'
          if (times <= res.lvUpgradeDates)
            isUpgrade = 1

          if (app.globalData.agentLevel == 4)
            isUpdate = 0
          else
            isUpdate = 1
        }
      }
      console.log("worthys=")
      console.log(worthys)
      that.setData({
        worthys: worthys,
        worthyCount: j,
        members: res.invites,
        invites: res.invites,
        flows: res.recomments,
        orders: res.orders,
        Pinvite: res.invites * 100 / Qinvite,
        Pflow: res.recomments * 100 / Qflow,
        Porder: res.orders * 100 / Qorder,
        userStatus: userStatus,
        userStatusFull: userStatusFull,
        userEmblemImg: userEmblemImg,
        lvName1: dw,
        isUpdate: isUpdate,
      })
    })
    var ss = ''
    util.doSearch(app.globalData.userid, that, 1, 8, 1, 2, "9.9", "9.9", 16, app.globalData.w11, function () {
      clicked = false
    })
    that.setData({
      //        userInfo: userInfo,
      //      renwushenfen: 0,
      renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay
    })
  },

  onReady: function () {
    // 页面渲染完成 

  },

  onHide: function () {
    // 页面隐藏 
  },

  onUnload: function () {
    // 页面关闭 
  },

  worthyClick: function (e) {
    var that = this
    var id = e.currentTarget.id;
    var ids = id.split(',')
    var wtDealType = that.data.worthys[ids[0]].worthy[ids[1]].wtDealType
    var wtDealLinker = that.data.worthys[ids[0]].worthy[ids[1]].wtDealLinker
    var lwState = that.data.worthys[ids[0]].worthy[ids[1]].lwState

    if (!lwState)
      return

    if (!wtDealLinker)
      return

    if (clicked)
      return
    clicked = true
    switch (wtDealType) {
      case 1:
        //        eval(wtDealLinker)
        if (wtDealLinker == 'showBonusLoading')
          that.showBonusLoading(id)
        clicked = false
        break;
      case 2:
        wx.navigateTo({
          url: wtDealLinker + "?id=" + id,
        })
        break;
      case 3:
        wx.switchTab({
          url: wtDealLinker,
        })
        break;
      case 4:
        clicked = false;
        break;
      case 5:
        clicked = false;
        break;
      default:
        clicked = false;
        break;
    }
  },
  userTrace: function () {
    if (clicked)
      return
    clicked = true
    wx.navigateTo({
      url: '../goods/goods',
    })

  },
  onShow: function () {
    // 页面显示
    if (loads)
      clicked = false
    loads = 1
    if (!app.globalData.loadFinish) {
      return
    }
    if (!pageLoad) {
      this.onLoad()
    }
    console.log('支付回调')
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (currPage.data.payResult == 1) { // 支付成功后返回
      app.globalData.isAgent = 1
      app.globalData.agentLevel = 1
      app.globalData.parentID = app.globalData.userid
      var dt = new Date()
      app.globalData.payTime = dt.valueOf() / 1000
      // currPage.showModal4()
      console.log('支付回调111')
      currPage.setData({
        xiaoxi: 1,
        renwushenfen: 1,
        payResult: 0
      })
      dataDeal(this)
    }
    else {
      var that = this;
      that.setData({
        //        userInfo: userInfo,
        //      renwushenfen: 0,
        renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay
      })
      userid = app.globalData.userid
      var ss = ''
      console.log('userid')
      console.log(userid)
      if (views == 5) {
        views = 0
        dispages++
        util.doSearch(userid, that, 1, 40, that.data.sortType, 2, '9.9', '9.9', 16, app.globalData.w11)
      }
      else
        views++

      // 计算红包金额
      var command = "user/viewgoods"
      var parm = { "userId": userid }
      util.myRequest(userid, command, parm, (res) => {
        console.log('商品个数')
        console.log(res)
        var cons = res[0].cons
        if (!cons)
          cons = 0
        this.setData({
          viewGoods: cons,
        })
      })
      if (this.data.renwushenfen) {

        if (app.globalData.payTime) {
          var dDate = new Date(app.globalData.payTime * 1000)
          this.setData({
            regYear: dDate.getFullYear(),
            regMonth: dDate.getMonth() + 1,
            regDay: dDate.getDate(),
            regDayO: dDate.getDate(),

          })
        }
      }
    }
  },

  //领取红包时 跳转代理页
  Apptest: function () {
        wx.navigateTo({
          url: '../withdrawAct/withdrawAct'
        })
  },
  // 登陆完成  查看登录奖励弹窗样式
  showBonusLoading: function (pid) {
    var ids = pid.split(',')
    var msgState = this.data.worthys[ids[0]].worthy[ids[1]].msgState
    if (!msgState) {
      this.show("您当天红包已领")
      return
    }
    console.log("loadings = " + this.data.loadings)
    if (!this.data.loadings)
      return

    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    var command = "redpacket/userredpacketeverydaynew"
    var parm = { "userID": userid, "logins": this.data.loadings }
    console.log('redpacket create')
    console.log(parm)
    util.myRequest(app.globalData.userid, command, parm, (res) => {
      console.log(res)
      var hbje = res.rpAmount.toFixed(2)
      var rpID = res.rpId
      var dt = util.formatTime(new Date(), 1)

      var dd = this.data.worthys

      dd[ids[0]].worthy[ids[1]].msgState = 0
      this.setData({
        bonus: hbje,
        bonusjilu: dt,
        loading_full: 1,
        worthys: dd
      })
    })
    this.animation = animation

    animation.opacity(0).rotateX(-100).step();
    this.setData({
      animationData: animation.export(),
      showBonusLoadingStatus: true
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏查看奖励弹窗样式
  hideBonusLoading: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    clicked = false

    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showBonusLoadingStatus: false,
        loading_full: 1,
        loadings: 10,
        hasMask: false
      })
    }.bind(this), 200)
  },
  memberCenter: function () {
    if (clicked)
      return
    clicked = true
    var that = this
    if (this.data.userLevel == 6) // 授权
    {
      app.bindLogin(1, (code) => {
        console.log(code)
        if (code > 0) {
          that.setData({
            userInfo: app.globalData.userInfo,
            deny: 1
          }, function () {
            that.onLoad()
          })
        }
      })
    }
    else {
      wx.navigateTo({
        url: '../memberCenter/memberCenter',
      })
    }
  },
  openMember: function (e) {
    if (clicked)
      return
    clicked = true
    var id = e.currentTarget.id
    // id=1 升级 id=2 会员注册
    wx.navigateTo({
      url: '../openMember/openMember?id=' + id + '&isUpgrade=' + isUpgrade,
    })
  },
  memberUpgrade: function () {
    if (clicked)
      return
    clicked = true
    wx.navigateTo({
      url: '../memberUpgrade/memberUpgrade?isUpgrade=' + isUpgrade,
    })
  },
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
})
// Page(conf);
