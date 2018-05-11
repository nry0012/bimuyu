// pages/sort/sort.js
var app = getApp()
var util = require('../../utils/util.js');
var pageNumber = 1;
var userid, ss, navid = 1, clicked = false
var header = require('../../component/title/title.js');

Page({

  data: {
    comTitle: {
      isHide: false,
      comTitle: ""
    },
    searchItem: 1,
    isChecked: false,
    CheckItem: 0,
    goodsdata2: [],
    toView: 'inToView1',
    act_addList: [],
  },

  //右侧滚动监听 左侧锚点变化样式 
  scroll: function (e) {
 //   console.log(e.detail.scrollTop)
    // 1.获取右侧数组
    var actlist = this.data.act_addList;
    // 2.获取滚动高度
    var he = e.detail.scrollTop;
    // 3.定义起始高度
    var gaodu = 0;
    // 4.for循环 右侧数组长度
    for (var i = 0; i < actlist.length; i++) {
      // 5.获取所有小分类个数
      var count = actlist[i].city.length;
     // 6.利用math.ceil函数 取不小于它的最小整数 
      var hangshu = Math.ceil(count / 3);
  //    console.log(e.detail.scrollTop)
  //    console.log("hangshu:" + hangshu)
      // 7.定义高度 利用行数乘以每一块的高度是第一块的高度 依次的高度再原本的基础上加gaodu
      var gaodu = (hangshu * 85) + gaodu + 178;
      // 8.判断滚动高度在此块范围内 将右侧列表的id赋值给searchItem，即可将左侧的变为彩色展示
      if (he < gaodu) {
//        console.log("i:" + i)
        this.setData({
          searchItem: actlist[i].id
        })
        // 9.跳出循环
        break
      } else {
 //       console.log("错误i:" + i)
      }
    }
  },
  //导航条点击事件 平台不同
  serviceSelection: function (e) {
    if (clicked)
      return
    clicked = true
    var navid = e.currentTarget.id;
    console.log(e.currentTarget.id)
    this.setData({
      toView: 'inToView' + navid,
      searchItem: e.currentTarget.id
    })
    var that = this
    this.setData({
      isChecked: true,
      CheckItem: navid
    },function(){
      clicked = false
    })
  },

  //事件处理函数
  search: function () {
    if (clicked)
      return
    clicked = true
    wx.navigateTo({
      url: '../sousuowuxiao/sousuowuxiao'
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('sort page loading')
    userid = app.globalData.userid
    util.moduleLog(app.globalData.userid, 20)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      },
    })
    // 大类
    var command = "message/picsetting"
    var parm = { "picType": 8 }
    util.myRequest(userid, command, parm, (res) => {
      console.log(res)
        that.setData({
          goodsdata2: res
        }, function () {
          console.log(that.data.goodsdata2)
        })
    //  })
    })
    // 小类

    var command = "message/picsettingnew"
    var parm = { "picType": 9 }
    util.myRequest(userid, command, parm, (res) => {
      console.log("接口 9")
      console.log(res)
        // 拼接数据
        var subType = {}, subInfo = [], subTypes = []
        var mainType = 0, mainType1 = 0, k = 1 
        for (var i = 0; i < res.res9.length; i++) {
//          res.res9[i].picSort = res.res9[i].picParentID * 100 + k
          mainType1 = res.res9[i].picParentID
          if (mainType != mainType1) {
            k = 1
            res.res9[i].picSort = res.res9[i].picParentID * 100 + k
            if (subInfo.length > 0) {
              subType.city = subInfo
              subTypes.push(subType)
            }
            mainType = mainType1
            subType = {}
            subInfo = []
            subType.id = res.res9[i].picParentID
            subType.region = res.res9[i].picParentName
            for (var j=0;j<res.res6.length;j ++)
            {
              if (res.res6[j].picSort == res.res9[i].picParentID) {
                subType.typeBanner = res.res6[j].picUrl
                subType.picSearchType = res.res6[j].picSearchType
                subType.picRemark = res.res6[j].picRemark
                break
              }
            }
             
            subInfo.push(res.res9[i])
          }
          else {
            k ++ 
            res.res9[i].picSort = res.res9[i].picParentID * 100 + k
            subInfo.push(res.res9[i])
          }
        }
        if (subInfo.length > 0) {
          subType.city = subInfo
          subTypes.push(subType)

        }
        //        var dx = JSON.stringify(subTypes)
        that.setData({
          act_addList: subTypes
        }, function () {
          console.log("subTypes")
          console.log(subTypes)
        })
    })
    console.log('sort page loading finish')

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
    clicked = false
    console.log('sort page show')
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

  },

  sortsearch: function (e) {
    if (clicked)
      return
    clicked = true
    var navid1 = e.currentTarget.id
    var dl = Math.floor(navid1 / 100)
    var xl = navid1 % 100
    var navs = this.data.act_addList
 //   ss = navs[dl - 1].city[xl - 1].sortKey
 //   if (!ss)
      ss = navs[dl - 1].city[xl - 1].picSearchName
      var bigType = navs[dl - 1].region
      app.doPresearch(userid, this, 1, 2, ss, 1, 0, navs[dl - 1].city[xl - 1].picSearchName, bigType, 1, function () {
        clicked = false
      }   )
  },

  searchMore: function (e) {
    if (clicked)
      return
    clicked = true
    var navid1 = e.currentTarget.id
    var id = navid1
    var navs = this.data.goodsdata2
//    ss = navs[id - 1].sortKey
//    if (!ss)
      ss = navs[id - 1].picSearchName

      app.doPresearch(userid, this, 1, 2, ss, 1, 0, navs[id - 1].picSearchName, navs[id - 1].picSearchName, 1, function () {
        clicked = false
      }   )
  },
})