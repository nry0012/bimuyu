// lingquan.js
var util = require('../../utils/util.js');
var app = getApp()
var goods_id, userid

Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      console.log('转发按钮')
    }
    var spmc = '【' + this.data.goodsdata.coupon_price + '元】 ' + this.data.goodsdata.title 
    return {
      title: spmc,
      desc: '',
    //  imageUrl: 'https://xcx.byscape.com/xbm_rootdir/mamamiya/resource/Loginer.jpg',
      path: '/pages/chanpinneiye/chanpinneiye?goods_id=' + goods_id + '&parentid=' + app.globalData.parentID,
      success: function (res) {
        console.log('转发成功' + res)
        var command = "share/log"
        
        var parm = { "userId": app.globalData.userid, "goodsId": goods_id, "shSource": 1, "shType": 1, "shTarget": "" }
        util.myRequest(userid, command, parm, (res) => {
          console.log(res)
        })

        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success(res) {
            console.log(res.encryptedData)
            console.log(res.iv)
            // 后台解密，获取 openGId
          }
        })

      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败  ' + res)
      }
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    isShare: 0,
    goodsdata: {
      goodsname: "秋冬衣衣女生季女保暖内衣女生内衣女生季女保暖内衣女",
      storename: "熊熊睡衣家居馆",
      quane: "55",
      saleprice: "105",
      originalprice:"160"
    },
    goodsdata1: [
      { active: "1. 点击“立即领取”按钮，在支付时减免;", activeID: 1 },
      { active: "2. 因优惠券领取用户级别、数量、时间等均不同，可能存在无法领取的情况，请遵守比目鱼生活优惠券领取规则，先领先得;", activeID: 2 },
      { active: "3. 优惠券领取成功后，请遵守比目鱼生活使用规则，以订单结算页中的优惠券使用提示为准;", activeID: 3 },
      { active: "4. 获取、使用优惠券时如存在违规行为（作弊领取、恶意套现、虚假交易等），将取消用户领取资格、撤销违规交易且收回全部优惠券（含已使用及未使用的），必要时将追究法律责任;", activeID: 4 }
    ],
    goodsdata2: [
      { guize: "上传至该页面的商品与优惠券信息，会被合作电商平台收录并给其他用户使用。上传者上传此类信息的，表明上传者已与商家达成一致，即商家同意官方收录且给其他用户使用。如商家不同意，请上传者不要上传，如否导致的纠纷由上传者解决并承担责任。", guizeID: 1 }
    ],
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
 //     if (goods_id)
 //       return
      goods_id = options.goods_id;
      var referrer = options.userid
      if (referrer) {
        if (referrer != app.globalData.userid)
        {
        app.globalData.referrer = referrer
        console.log('referrer is' + referrer)
        this.setData ({
          isShare: 1
        })
        }
      }

      var command = "item/itemdetail"
      userid = app.globalData.userid
      util.moduleLog(app.globalData.userid, 6)
      var parm = { "id": goods_id, "userID": userid }
      util.myRequest(userid, command, parm, (res) => {
        console.log(res)
        res.title = util.myStrLeft(res.title, app.globalData.w24) + '...'
        if (!res.quan || res.quan == 0)
          res.quan = (res.price - res.coupon_price).toFixed(1)
 //       res["quane"] = (res.price - res.coupon_price).toFixed(2)
        this.setData({
          goodsdata: res
        })
      }) 
    },
    //下单流程
    guize: function () {
      wx.navigateTo({
        url: '../guize/guize',
      })
    },
    //立即领取
    showModal1: function () {
      // 显示遮罩层idiao
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      // animation.translateY(300).step()
      // 第3步：执行第一组动画 
      animation.opacity(0).rotateX(-100).step();
      this.setData({
        animationData: animation.export(),
        showModalStatus1: true
      })
      setTimeout(function () {
        // animation.translateY(0).step()
        animation.opacity(1).rotateX(0).step();
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },

    hideModal1: function () {
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus1: false
        })
      }.bind(this), 200)
    },
    chanpinneiye:function(){
/*      wx.redirectTo({
        url: '../chanpinneiye/chanpinneiye?goods_id=' + goods_id,
      })*/
      wx.navigateBack({
        delta: 1
      })
    }

  })