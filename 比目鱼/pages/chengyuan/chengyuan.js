// pages/chengyuan/chengyuan.js
var app = getApp()
var util = require('../../utils/util.js');
var flag = 0, pid

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
        console.log('转发成功！')
        var command = "share/log"
        var userid = app.globalData.userid
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
    goodsdata: [],
    lowers: 0,
    userInfo: null,
    members: 0,
    agentLevel: 0,
    isBonus: 0 ,
    goodsdata1: {
      hongbao: "1.33",
      hongbaoChinese: "一元三角三分",
      jilu: "2018-03-05 19:43:44",
      degree: "青铜会员"

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 红包来了弹框样式
    // this.showModal2();

     pid = options.id 
     new app.ToastPannel();

    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    var dd = prevPage.data.worthys
    var members = prevPage.data.members
    var ids = pid.split(',')
    var isBonus = dd[ids[0]].worthy[ids[1]].msgState
//    var isBonus = 1

    var that = this
    var userid = app.globalData.userid
    var userinfo = app.globalData.userInfo
    util.moduleLog(userid, 45)
    var registerDate = util.timestampToTime(app.globalData.payTime).substring(0, 10)
    that.setData({
      userInfo: userinfo,
      members: members,
      isBonus: isBonus,
      registerDate: registerDate,
      agentLevel: app.globalData.agentLevel
    })

    var levelName = app.globalData.lvName
    this.setData({
      levelName: levelName
    })

    userid = 1407

    var command = "user/userlowerlist"
    var parm = { "userId": userid }
    util.myRequest(userid, command, parm, (res) => {
      console.log('下级列表')
      console.log(res)
      for (var i=0;i<res.length;i ++) {
        if (!res[i].payTime)
          res[i].payTime = ''
        else {
          res[i].payTime = util.timestampToTime(res[i].payTime)
          if (app.globalData.width < 350) 
            res[i].payTime = res[i].payTime.substr(0, 10)
        }
      }
      this.setData({
        staffs: res,
      })
    })

  },
  // 显示遮罩层红包来了 弹窗样式 惊喜弹窗
  bonusGetShow: function () {
    if (flag == 1) {
      return false
    }

    flag = 1

    var command = "redpacket/inviterp"
    var parm = { "userId": app.globalData.userid }
    console.log('redpacket create')
    console.log(parm)
    util.myRequest(app.globalData.userid, command, parm, (res) => {
      console.log(res)
      var hbje = res
      if (!res) {
        this.show("您当前没有新红包可拿！")
        flag = 0 
        return
      }

      var dt = util.formatTime(new Date(), 1)

      var dd = this.data.worthys
      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length - 2];//上一页面
      var dd = prevPage.data.worthys
      
      var ids = pid.split(',')
      dd[ids[0]].worthy[ids[1]].msgState = 0
      prevPage.setData({//直接给上移页面赋值
        worthys: dd
      })

      this.setData({
        bonus: hbje,
        bonusjilu: dt,  
        bonusLevel: app.globalData.lvName     
      })
      var animation2 = wx.createAnimation({
        duration: 300,
        timingFunction: "linear",
        delay: 0
      })

      this.animation2 = animation2
      animation2.opacity(0).rotateX(-100).step();
      this.setData({
        animationData2: animation2.export(),
        bonusGetStatus: true
      })
      setTimeout(function () {
        animation2.opacity(1).rotateX(0).step();
        this.setData({
          animationData2: animation2.export()
        })
      }.bind(this), 200)
    })


  },
  // 隐藏遮罩层红包来了 弹窗样式 惊喜弹窗
  bonusGetHide: function () {
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
        bonusGetStatus: false
      })
    }.bind(this), 200)
    this.setData({
      hasMask: false
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

  }

})