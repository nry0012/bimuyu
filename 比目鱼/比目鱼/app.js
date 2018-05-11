//app.js
var Api = require('utils/api.js')
var util = require('utils/util.js')
import { ToastPannel } from './component/toast/toast'
var aldstat = require("./utils/ald-stat.js")

function isBlank(str) {
  if (Object.prototype.toString.call(str) === '[object Undefined]') {//空
    return true
  } else if (
    Object.prototype.toString.call(str) === '[object String]' ||
    Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
    return str.length == 0 ? true : false
  } else if (Object.prototype.toString.call(str) === '[object Object]') {
    return JSON.stringify(str) == '{}' ? true : false
  } else {
    return true
  }
}

App({
  ToastPannel,
  onLaunch: function () {
    //调用API从本地缓存中获取数据
  },

  getAuthKey: function () {
    var that = this
    return new Promise(function (resolve, reject) {
      // 调用登录接口
      var logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)
      //   wx.clearStorageSync()
      wx.getSystemInfo({
        success: function (res) {
          that.globalData.width = res.windowWidth
          that.globalData.height = res.windowHeight
          var w = res.windowWidth
          var w16, w24, w11
          if (w < 350) {
            w11 = 10
            w16 = 13
            w24 = 22
          }
          else if (w < 400) {
            w11 = 11
            w16 = 15
            w24 = 23
          }
          else {
            w11 = 13
            w16 = 16
            w24 = 24
          }
          that.globalData.w11 = w11
          that.globalData.w16 = w16
          that.globalData.w24 = w24
          that.globalData.w0 = 0
        }
      })
      //  登录
      //   wx.clearStorageSync()
      var token = wx.getStorageSync('token');
      if (token) {
        util.checkToken(token, (res1, res2) => {
          if (res1 == 0) {
            wx.clearStorageSync()
            console.log('check error')
            that.bindLogin(0, (code) => {
              resolve(code)
            })
          }
          else if (res1 == 1) {
            var isAgent, userid
            if (res2.userState == 0) {
              isAgent = 0
              userid = 0
            }
            else {
              isAgent = res2.isAgent
              if (isAgent == null)
                isAgent = 0
              userid = res2.userid
            }
            that.globalData.userid = userid
            that.globalData.isAgent = isAgent
            that.globalData.payTime = res2.payTime
            that.globalData.continueday = res2.continueday
            that.globalData.agentLevel = res2.agentLevel
            that.globalData.userRate = res2.userRate
            that.globalData.lvEmblem = res2.lvEmblem
            that.globalData.lvName = res2.lvName
            that.globalData.lvNameFull = res2.lvNameFull
            that.globalData.lvPic = res2.lvPic
            that.globalData.userParentID = res2.userParentID
            that.globalData.userRigisterDate = res2.userRigisterDate
            that.globalData.isCommissionDisplay = res2.isCommissionDisplay
            that.globalData.loadFinish = 1
            
            
            that.getUserInfo((cb) => {

            })
            resolve(userid)
          }
        })

      }
      else {
        that.bindLogin(0, (code) => {
          resolve(code)
        })
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          console.log(res.userInfo)
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  bindLogin: function (iStyle, cb) {
    var that = this
    wx.showToast({
      title: '登录中',
      icon: 'loading'
    })
    if (iStyle) {
      wx.getSetting({
        success(res) {
          console.log('getSetting success!')
          if (!res.authSetting['scope.userInfo']) {
            console.log('Setting no auth')
            wx.openSetting({
              //            scope: 'scope.userInfo',
              success: function (data) {
                if (data) {
                  if (data.authSetting["scope.userInfo"] == true) {
                    util.getToken((res) => {
                      console.log(res)
                      //用户拒绝授权
                      if (res.errMsg == 'userDenyed') {
                        that.globalData.agentLevel = 6
                        that.globalData.lvEmblem = '../image/emblemNoauth.png'
                        that.globalData.lvName = '未授权用户'
                        that.globalData.lvNameFull = '未授权用户'
                        typeof cb === "function" && cb(0)
                        /*       wx.redirectTo({
                                 url: '/pages/unAuth/unAuth',
                               }) */
                      }
                      //用户允许授权
                      else {
                        that.globalData.userInfo = res[1]
                        var s = util.myDecode(res[0])
                        var userid = parseInt(s.substr(1, s.length - 2))
                        that.globalData.isAgent = res[2].isAgent
                        that.globalData.agentLevel = res[2].agentLevel
                        that.globalData.continueday = res[2].continueday
                        that.globalData.userRate = res[2].userRate
                        that.globalData.payTime = res[2].payTime
                        that.globalData.allowAuth = 1
                        that.globalData.userid = userid
                        that.globalData.lvEmblem = res[2].lvEmblem
                        that.globalData.lvName = res[2].lvName
                        that.globalData.lvNameFull = res[2].lvNameFull
                        that.globalData.lvPic = res[2].lvPic
                        that.globalData.userParentID = res[2].userParentID
                        that.globalData.userRigisterDate = res[2].userRigisterDate
                        that.globalData.isCommissionDisplay = res[2].isCommissionDisplay
                        that.globalData.loadFinish = 1
                        wx.setStorage({
                          key: 'token',
                          data: res[0],
                          fail: function () {
                            console.error('存储token时失败')
                          }
                        })
                        typeof cb === "function" && cb(userid)
                      }
                    })
                  }
                }

              },
              fail: function () {
                console.log('no auth')
                that.globalData.agentLevel = 6
                that.globalData.lvEmblem = '../image/emblemNoauth.png'
                that.globalData.lvName = '未授权用户'
                that.globalData.lvNameFull = '未授权用户'
                typeof cb === "function" && cb(0)
              }
            })
          }
          else {
            console.log('Setting has auth')
            util.getToken((res) => {
              console.log(res)
              //用户拒绝授权
              if (res.errMsg == 'userDenyed') {
                that.globalData.agentLevel = 6
                that.globalData.lvEmblem = '../image/emblemNoauth.png'
                that.globalData.lvName = '未授权用户'
                that.globalData.lvNameFull = '未授权用户'
                typeof cb === "function" && cb(0)
                /*       wx.redirectTo({
                         url: '/pages/unAuth/unAuth',
                       }) */
              }
              //用户允许授权
              else {
                that.globalData.userInfo = res[1]
                var s = util.myDecode(res[0])
                var userid = parseInt(s.substr(1, s.length - 2))
                that.globalData.isAgent = res[2].isAgent
                that.globalData.agentLevel = res[2].agentLevel
                that.globalData.continueday = res[2].continueday
                that.globalData.payTime = res[2].payTime
                that.globalData.userRate = res[2].userRate
                that.globalData.allowAuth = 1
                that.globalData.userid = userid
                that.globalData.lvEmblem = res[2].lvEmblem
                that.globalData.lvName = res[2].lvName
                that.globalData.lvNameFull = res[2].lvNameFull
                that.globalData.lvPic = res[2].lvPic
                that.globalData.userParentID = res[2].userParentID
                that.globalData.userRigisterDate = res[2].userRigisterDate
                that.globalData.isCommissionDisplay = res[2].isCommissionDisplay
                that.globalData.loadFinish = 1
                wx.setStorage({
                  key: 'token',
                  data: res[0],
                  fail: function () {
                    console.error('存储token时失败')
                  }
                })
                typeof cb === "function" && cb(userid)
              }
            })

          }
        }
      })
    }
    else {
      util.getToken((res) => {
        console.log(res)
        //用户拒绝授权
        if (res.errMsg == 'userDenyed') {
          that.globalData.agentLevel = 6
          that.globalData.lvEmblem = '../image/emblemNoauth.png'
          that.globalData.lvName = '未授权用户'
          that.globalData.lvNameFull = '未授权用户'
          typeof cb === "function" && cb(0)
          /*       wx.redirectTo({
                   url: '/pages/unAuth/unAuth',
                 }) */
        }
        //用户允许授权
        else {
          that.globalData.userInfo = res[1]
          var s = util.myDecode(res[0])
          var userid = parseInt(s.substr(1, s.length - 2))
          that.globalData.isAgent = res[2].isAgent
          that.globalData.agentLevel = res[2].agentLevel
          that.globalData.userRate = res[2].userRate
          that.globalData.continueday = res[2].continueday
          that.globalData.payTime = res[2].payTime
          that.globalData.allowAuth = 1
          that.globalData.userid = userid
          that.globalData.lvEmblem = res[2].lvEmblem
          that.globalData.lvName = res[2].lvName
          that.globalData.lvNameFull = res[2].lvNameFull
          that.globalData.lvPic = res[2].lvPic
          that.globalData.userParentID = res[2].userParentID
          that.globalData.userRigisterDate = res[2].userRigisterDate
          that.globalData.isCommissionDisplay = res[2].isCommissionDisplay
          that.globalData.loadFinish = 1
         wx.setStorage({
            key: 'token',
            data: res[0],
            fail: function () {
              console.error('存储token时失败')
            }
          })
          typeof cb === "function" && cb(userid)
        }
      })
    }
  },

  doPresearch: function (userid, that, pageNumber, skType, keyWord, jum, isCompare, sortKey, bigType, funType, cb) {
    var sortType = that.data.sortType ? that.data.sortType : 1
    if (keyWord) {
      if (keyWord == '优选' || keyWord == '全部' || keyWord.toLowerCase() == 'all') {
        funType = funType & 4094
      }
    }

    if (!sortKey)
      sortKey = keyWord
    if (!bigType)
      bigType = sortKey
    util.showLoading()  
    var command = "item/itemsearchnew"
    var parm = { "keywords": keyWord, "userId": this.globalData.userid, "Records": 40, "PageNumber": pageNumber, "skType": skType, "sortType": sortType, "hisSearch": sortKey, "funType": funType }
    console.log(parm)
    util.myRequest(userid, command, parm, (res) => {
      console.log(res)

      if (res == keyWord || isBlank(res.res)) {
        this.globalData.searchCount = 0
        wx.showToast({
          title: '未搜到相关内容',
          icon: 'success',
          duration: 2000,
        })
        typeof cb === "function" && cb()
      }
      else {
        if (isCompare) // 三方比价
          res.res.unshift(this.globalData.curGoods)
        for (var i = 0; i < res.res.length; i++) {
          if (isCompare && i > 0 && res.res[i].id == res.res[0].id)
            res.res.splice(i, 1)
          else {
            res.res[i].title = util.myStrLeft(res.res[i].title, this.globalData.w11) + "..."
            res.res[i].usercommission = res.res[i].usercommission ? parseFloat(res.res[i].usercommission).toFixed(2) : 0
            res.res[i].coupon_price = parseFloat(res.res[i].coupon_price).toFixed(1)
            res.res[i]["iid"] = i + 1
          }
        }
        this.globalData.searchCount = res.total
        this.globalData.searchResult = res.res
        if (sortKey)
          keyWord = sortKey
        util.cancelLoading()
        if (jum) {
          keyWord = encodeURIComponent(keyWord)
          wx.navigateTo({
            url: '../sortsearch/sortsearch?searchItem=' + keyWord + '&bigType=' + bigType
          })
        }
        else {
          wx.navigateTo({
            url: '../search/search?searchItem=' + keyWord + '&isCompare=1'
          })
        }
      }
    })
    //  })
  },
  globalData: {
    userid: 0,
    isAgent: 0,
    agentLevel: 1,
    continueday: 0,
    payTime: 0,
    userInfo: null,
    logins: null,
    height: null,
    width: null,
    searchResult: null,
    searchCount: 0,
    referrer: null,
    parentID: 0,
    curGoods: null,
    allowAuth: 0,
    memberLevels: ['非会员', '普通会员', '青铜会员', '白银会员', '黄金会员'],
    userRate: 0
  }
})
