// agent.js
var app = getApp()
var util = require('../../utils/util.js')
var verifyCode, verifyTimes = 0, openid, clicked = false, source

Page({

  data: {
    flag: false,
    codeDis: false,
    phoneCode: "获取验证码",
    telephone: "",
    codePhone: "",
    weixinhao: "",
    xingming: "",
    phone: "",
    yanzhengma: "",
    payAmount: "",
    goodsdata: { jine: "9.90" },
    source: 1,
  },

  changeCode() {
    var _this = this
    let telephone = this.data.telephone
    if (telephone.length != 11 || isNaN(telephone)) {
      this.show('请输入正确手机号码')
      return
    }
    console.log('verify code')
    this.setData({
      codeDis: true,
      phoneCode: 300
    })
    console.log('verify code2')

    var command = "sms/smallsend"
    var parm = { "userID": app.globalData.userid, "telephone": telephone }
    util.myRequest(app.globalData.userid, command, parm, (res) => {
      verifyCode = res
      console.log(res)
    })

    verifyTimes = 0

    let time = setInterval(() => {
      let phoneCode = _this.data.phoneCode
      phoneCode--
      _this.setData({
        phoneCode: phoneCode
      })
      if (phoneCode == 0) {
        clearInterval(time)
        _this.setData({
          phoneCode: "获取验证码",
          //          flag: true,
          codeDis: false
        })
      }
    }, 1000)
  },
  phoneinput(e) {
    console.log(e)
    let value = e.detail.value
    this.setData({
      telephone: value
    })
  },
  codeinput(e) {
    let value = e.detail.value
    this.setData({
      codePhone: value
    })
  },

  formSubmit: function (e) {
    if (clicked)
      return
    clicked = true

    console.log(1)
      if (verifyTimes > 2) {
        this.show('短信验证码输入次数超过3次，请重新申请验证码')
        clicked = false
        return
      }
      // var weixinhao = e.detail.value.weixinhao
      // var xingming = e.detail.value.xingming
      var phone = e.detail.value.phone
      var yanzhengma = e.detail.value.yanzhengma
      if (phone == '' || yanzhengma == '') {
        this.show('请填写相关信息')
        clicked = false
        return;
      }
      if (!/1[3-8]\d{9}/.test(phone)) {
        this.show('请输入正确的手机号')
        clicked = false
        return;
      }
      if (yanzhengma != verifyCode) {
        this.show('请输入正确的短信验证码')
        verifyTimes++
        clicked = false
        return
      }

    // 申请开通
    var command = "sms/smallapply"
    var parm = { "userID": app.globalData.userid, "userPhone": phone, "wxCode": this.data.weixinhao, "userName": this.data.xingming }
    console.log(parm)
    util.myRequest(app.globalData.userid, command, parm, (res) => {
      openid = res
      console.log(res)
      console.log('支付请求')
      // 支付请求

      command = "pay/getprepayid"
      parm = { "userID": app.globalData.userid, "openid": openid, "totalPrice": this.data.payAmount }
      //      parm = { "userID": app.globalData.userid, "openid": openid, "totalPrice": 9.90 }
      console.log(parm)
      util.myRequest(app.globalData.userid, command, parm, (res) => {
        console.log(res)
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        var nonceStr = 'ABCDVERFEGERR'
        var orderid = res.orderid
        console.log('orderid')
        console.log(orderid)
        console.log('timestamp')
        console.log(timestamp)
        timestamp = '' + res.timestamp
        var paySign = util.hexMD5('appId=wx3b8cca2fc1f8bec3&nonceStr=' + res.nonceStr + '&package=prepay_id=' + res.package + '& signType=MD5&timeStamp=' + res.timeStamp + '&key=Zsjiuew98232jhu23j110s0PuyWe023C')
        console.log(paySign)
        wx.requestPayment({
          'timeStamp': res.timeStamp,
          'nonceStr': res.nonceStr,
          'package': 'prepay_id=' + res.package,
          'signType': 'MD5',
          'paySign': res.paySign,
          'success': function (res) {
            console.log('支付接口调用成功')
            console.log(res);
          },
          'fail': function (res) {
            console.log('支付接口调用失败:' + JSON.stringify(res));
            clicked = false
          },
          'complete': function (res) {
            console.log('支付接口执行完成' + JSON.stringify(res))
            var command = "pay/getorder"
            var userid = app.globalData.userid
            var parm = { "orderid": orderid }
            console.log('orderID=' + orderid)
            util.myRequest(userid, command, parm, (res) => {
              console.log('query order')
              console.log(res)
              if (res == 'success') {
                var command = "user/paysuccess"
                var userid = app.globalData.userid
                var parm = { "userId": userid, "parentId": app.globalData.parentID }
                util.myRequest(userid, command, parm, (res) => {
                  console.log(res)
                  let pages = getCurrentPages();//当前页面
                  let prevPage = pages[pages.length - 2];//上一页面
                  prevPage.setData({//直接给上移页面赋值
                    payResult: 1
                  });
                  wx.navigateBack({//返回
                    delta: 1
                  })
                })
              }
            })
          }
        })
      })
    })
  },
  weixin: function () {
    wx.navigateTo({
      url: '../wexin/weixin',
    })
  },

  onLoad: function (options) {
    var fkfs = options.type
    var amount = options.amount

    new app.ToastPannel();
    this.setData({
      payAmount: amount
    })
    util.moduleLog(app.globalData.userid, 57)

  }
})
