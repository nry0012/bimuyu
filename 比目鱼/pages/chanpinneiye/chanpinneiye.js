// chanpinneiye.js
var util = require('../../utils/util.js');
var app = getApp()
var goods_id, parentid, spmc1, clicked = false
var flag = 0;
var header = require('../../component/title/title.js');
Page({
  data: {
    type: 1,
    isShare: 0,
    shanggun: 0,
    jingdong: 1,
    renwushenfen: 0,
    animationData: 0,
    xiangqingData: {},
    showModalStatus1: false,
    comTitle:{
      isHide: true,
      comTitle: ""
    },
    show: 0,
    parent: 0,
    goodsdata1: [],
    items: [
      { name: 'pic', value: '商品图片与商品展示信息不搭', id: 1 },
      // { name: 'CHN', value: '中国', checked: 'true' },
      { name: 'price', value: '商品券后价与商品正价保持一致', id: 2 },
      { name: 'sort', value: '商品不应该属于此泪目中', id: 3 },

    ],
    items1: [
      { name: '', value: '成人用品', id: 1 },
      // { name: 'CHN', value: '中国', checked: 'true' },
      { name: '', value: '玩具', id: 2 },
      { name: '', value: '文具', id: 3 }


    ],
    goods_image: [],
    images: [],

  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    header.init.apply(this, []);
    goods_id = options.goods_id;
 
    console.log(options.str)
    console.log('goods_id' + goods_id)
    parentid = options.parentid
    if (parentid) {
      app.globalData.parentID1 = parentid
      app.globalData.parentID = parentid
      console.log('referrer is' + parentid)
      console.log('parentID')
      console.log(app.globalData.parentID1)
    }
    else
      parentid = app.globalData.parentID

    this.setData({
      renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay,
      parent: parentid
    })
    if (goods_id == 0) {
      var userid = app.globalData.userid
      this.setData({
        goodsdata: JSON.parse(options.str)
      })
      var qurl = decodeURIComponent(this.data.goodsdata.qurl)
      var command = "item/desc"
      var parm = { "userID": userid, "num_iid": this.data.goodsdata.num_iid, "title": this.data.goodsdata.title, "coupon_price": this.data.goodsdata.coupon_price, "pic_url": this.data.goodsdata.pic_url, "add_time": this.data.goodsdata.add_time, "commission": this.data.goodsdata.commission, "volume": this.data.goodsdata.volume, "qurl": qurl, "quan": this.data.goodsdata.quan, "price": this.data.goodsdata.price, "shop_type": this.data.goodsdata.shop_type,}
      util.myRequest(userid, command, parm, (res) => {
        console.log(res)
        if (this.data.goodsdata.shop_type != 'D') {
          var imgs = []
          var img, desc
          for (var i = 0; i < res.images.length; i++) {
            img = { "goodsimage": res.images[i] }
            imgs.push(img)
          }
          console.log('这个是生成淘口令的ID' + res.goodsID)
          this.setData({
            goods_image: imgs
          })
        }else{
          var imgs = []
          var img, desc
          var desc = util.myGoodsDesc(res.images)
          console.log(desc)
          this.setData({
            goods_image: desc
          })
        }
        goods_id = res.goodsID
        console.log('把生成的产品id放到要取淘口令的id里' + goods_id)
      })
    } else {
      console.log('怎么进到查看详情里了')
      var command = "item/itemdetail"
      var userid = app.globalData.userid
      util.moduleLog(userid, 2)
      var parm = { "id": goods_id, "userID": userid }
      util.myRequest(userid, command, parm, (res) => {

        console.log(res)
        console.log(userid)
        var imgs = []
        var img, desc
        res.title = util.myStrLeft(res.title, 40)
        //取小数点后两位
        res.usercommission = res.usercommission ? parseFloat(res.usercommission).toFixed(2) : 0
        desc = util.myGoodsDesc(res.desc)

        for (var i = 0; i < desc.length; i++) {
          img = { "goodsimage": desc[i] }
          imgs.push(img)
        }
        // 取相似商品

        this.setData({
          goodsdata: res,
          goods_image: imgs
        })
      })
    }
    
  },
  jiaocheng: function () {
    wx.navigateTo({
      url: '../jiaocheng/jiaocheng',
    })
  },
  //事件处理函数
  huobisanjia: function () {

    /*
        var goods = this.data.goodsdata
        if (!goods.usercommission)
          goods["usercommission"] = parseFloat(goods.commission)
        var tags = this.data.goodsdata.tags
        tags = tags.replace(/,/g, "&")
        tags = tags.replace(/\//g, "&")
        app.globalData.curGoods = goods
        app.doPresearch(app.globalData.userid, this, 1, 2, tags, 0, 1)
        */
    wx.redirectTo({
      url: '../similarGoods/similarGoods?goodsID=' + this.data.goodsdata.id
    })
  },
  //隐藏
  hideDetail: function (e) {
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear'
    })
    this.animation = animation;
    var re = 0;
    if (!this.data.show) {
      animation.rotate(180).step();
      re = 1;
    } else {
      animation.rotate(0).step();
    }
    this.setData({
      animationData: animation.export(),
      show: !this.data.show,
      shanggun: re
    }, function () {
      wx.pageScrollTo({
        scrollTop: 300
      })
    })
  },

  //立即领取
  tkl_prompt() {
    // 显示遮罩层
    this.setData({
      showModalStatus1: true
    })

  },

  tkl_hide() {
    // 隐藏遮罩层
    this.setData({
      showModalStatus1: false
    })

  },
  lingquan: function () {
    if (clicked)
      return
    clicked = true
    wx.navigateTo({
      url: '../lingquan/lingquan?goods_id=' + goods_id + '&userid=' + app.globalData.userid
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 2,
    })
  },
  shouye: function () {
    if (clicked)
      return
    clicked = true
    console.log('jump into index parentid')
    console.log(parentid)

    wx.switchTab({
      url: '../index/index'
    })
  },
  showModal1: function () {
    this.tkl_prompt()
  },

  hideModal1: function () {
    this.tkl_hide()
  },

  doPurchase: function () {
    // this.show('非京东商品')
    // 阿里商品，生成淘口令
    var that = this
    var command = "tao/getkouling"
    var userid = app.globalData.userid
    var parentid = app.globalData.parentID
    var isAgent = app.globalData.isAgent
    if (isAgent == 0)
      userid = parentid
    var parm = { "userId": userid, "goodsId": goods_id }
    console.log('生成淘口令参数' + goods_id)
    util.myRequest(userid, command, parm, (res) => {
      console.log(res)
      // 淘口令生成成功
      var tkl = res
      if (tkl == 'error') {
        that.tkl_hide()
        that.show('券已领完，请选择其他商品')
        setTimeout(function () {
          wx.navigateBack({//返回
            delta: 1
          })          //要延时执行的代码  
        }, 3000)

      }
      else

        wx.setClipboardData({
          data: tkl,
          success: function (res) {
            // 剪贴板设置成功
            console.log('淘口令复制成功')
            that.tkl_hide()
          }
        })
    })

  },
  // 隐藏遮罩层纠错弹窗部分
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
    animation3.translateY(300).step()
    this.setData({
      animationData3: animation3.export(),

    })
    setTimeout(function () {
      animation3.translateY(0).step()
      this.setData({
        animationData3: animation3.export(),
        showModalStatus3: false
      })
    }.bind(this), 200)
    this.setData({
      hasMask: false
    })
  },
  // 显示遮罩层纠错弹窗部分
  showModal3: function () {
    if (flag == 1) {
      return false
    }
    this.setData({
      hasMask: true
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
    animation3.translateY(300).step()
    this.setData({
      animationData3: animation3.export(),
      showModalStatus3: true,
      displayCir: 0,
    })
    setTimeout(function () {
      // animation.translateY(0).step()
      animation3.opacity(1).rotateX(0).step();
      this.setData({
        animationData3: animation3.export()
      })
    }.bind(this), 200)
  },
  //商品详情页.
  showGoods: function (e) {
    if (clicked)
      return
    clicked = true
    var goods_id = e.currentTarget.id;
    console.log(e.currentTarget)
    wx.redirectTo({
      url: '../chanpinneiye/chanpinneiye?goods_id=' + goods_id
    })
  },
  correct: function () {
    console.log('correct')
    this.setData({
      showModalStatus3: false
    })
  },
  onShow: function () {
    clicked = false
    console.log('index show')
    this.setData({
      renwushenfen: app.globalData.isAgent & app.globalData.isCommissionDisplay,
      isShare: 0
    })
  },

  onShareAppMessage: function (res) {
    var that = this

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      console.log('转发parentID' + app.globalData.parentID, )
      console.log('转发按钮')
    }
    that.setData({
      isShare: 1
    })


    let spmc1 = '【' + that.data.goodsdata.coupon_price + '元】 ' + that.data.goodsdata.title

    return {
      title: spmc1,
      desc: spmc1,
      //  imageUrl: 'https://xcx.byscape.com/xbm_rootdir/mamamiya/resource/Loginer.jpg',
      path: '/pages/chanpinneiye/chanpinneiye?goods_id=' + goods_id + '&parentid=' + app.globalData.parentID,
      success: function (res) {
        console.log('转发成功' + res)
        console.log('转发成功' + app.globalData.parentID, )
        var command = "share/log"

        var parm = { "userId": app.globalData.userid, "goodsId": goods_id, "shSource": 1, "shType": 1, "shTarget": "" }
        util.myRequest(app.globalData.userid, command, parm, (res) => {
          console.log(res)
        })

        wx.getShareInfo({
          success(res) {
            console.log(res.encryptedData)
            console.log(res.iv)
          }
        })
        that.setData({
          isShare: 0
        })

      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败  ' + res)
        console.log('转发失败  ' + spmc1)
        that.setData({
          isShare: 0
        })
      }
    }
  },
  jdPurchase: function () {
    if (clicked)
      return
    clicked = true
    console.log('hello');
    var command = "jdurl/get"
    var userid = app.globalData.parentID
    var parm = { "goodId": goods_id, "userId": userid }
    util.myRequest(userid, command, parm, (res) => {
      console.log('jd interface')
      console.log(res)
      clicked = false
      if (res) {
        wx.navigateToMiniProgram({
          appId: 'wx13e41a437b8a1d2e',
          path: 'pages/jingfen_twotoone/item?spreadUrl=' + res + '&customerinfo=bmyshxcc',
          envVersion: 'release'
        })
      }
      else {
        that.show('券已领完，请选择其他商品')
        setTimeout(function () {
          wx.navigateBack({//返回
            delta: 1
          })          //要延时执行的代码  
        }, 3000)

      }
    })
  }
})