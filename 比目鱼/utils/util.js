var Api = require('./api.js')
var app = getApp()
// 取用户code
var getCode = function (callback) {
  wx.login({
    success: function (res) {
      if (res.code) {
        console.log('获取code成功！' + res.code)
        typeof callback === "function" && callback(res.code)
      }
      else {
        console.log('获取code失败！' + res.errMsg)
      }
    },
    fail: function (res) {
      console.log(res)
    }
  })
}

function moduleLog(userID, mdID) {
  var command = "message/modulelog"
  var parm = { "userId": userID, "moduleID": mdID }

  myRequest(userID, command, parm, (res) => {
    console.log('moduleLog' + mdID)
  })
}

function modiParent(userID, parentID) {
  var command = "usertest/setparentid"
  var parm = { "userId": userID, "parentId": parentID }

  myRequest(userID, command, parm, (res) => {
    console.log('modiParent' + parentID)
  })
}

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
// 获取access_token
function getToken(callback) {
  getCode((code) => {
    var openid = ""
    console.log("code=", code)
    var userid = 0
    var command = "user/login"
    var parm = { "code": code }
    //return
    myRequest(userid, command, parm, (res1) => {
      console.log("login")
      console.log(res1)
      userid = res1
      var openid = res1.openId
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo
          var encryptedData = res.encryptedData
          var iv = res.iv
          console.log('用户允许授权')
          console.log(userInfo)
          userInfo.nickName = encodeURIComponent(userInfo.nickName)
          command = "usertest/register"
          parm = { "userInfo": userInfo, "userId": userid, "encryptedData": encryptedData, "iv": iv, "signature": res.signature, "rawData": res.rawData }
          console.log(parm)
          userInfo.nickName = decodeURIComponent(userInfo.nickName)
          myRequest(userid, command, parm, (res) => {
            console.log("用户注册成功")
            console.log(res)
            var s = "U" + userid + "F";
            var s1 = {}
            s1["isAgent"] = res.isAgent
            s1["agentLevel"] = res.agentLevel
            s1["continueday"] = res.continueday
            s1["payTime"] = res.payTime
            s1["userRate"] = res.userRate
            s1["lvEmblem"] = res.lvEmblem
            s1["lvName"] = res.lvName
            s1["lvNameFull"] = res.lvNameFull
            s1["lvPic"] = res.lvPic
            s1["userParentID"] = res.userParentID
            s1["userRigisterDate"] = res.userRigisterDate
            s1["isCommissionDisplay"] = res.isCommissionDisplay
            s = myEncode(s);
            var ret = []
            ret.push(s)
            ret.push(userInfo)
            ret.push(s1)
            typeof callback == "function" && callback(ret)
          })
        },
        fail: function (res) {
          if (res.errMsg) {
            console.log('用户拒绝授权', res)
            typeof callback == "function" && callback({ errMsg: "userDenyed" })
          }
        }
      })
      console.log("code return")
      console.log(res1)
    })
  })
}

// 检查token
var checkToken = function (token, callback) {
  var s = myDecode(token)
  var chkResult = 1
  console.log('check token')
  if (s.substr(0, 1) != "U" || s.substr(s.length - 1, 1) != "F") {
    chkResult = 0
    typeof callback == "function" && callback(chkResult, 0)
  }
  else {
    var userid = parseInt(s.substr(1, s.length - 2))
    console.log("userid=" + s)
    if (!userid) {
      chkResult = 0
      typeof callback == "function" && callback(chkResult, 0)
    }
    else {
      var command = "usertest/check"
      var parm = { "userId": userid }
      myRequest(userid, command, parm, (res) => {
        console.log('check result')
        console.log(res)
        if (!res || res.length == 0) {
          chkResult = 0
          console.log('check no data')
          typeof callback == "function" && callback(chkResult, 0)
        }
        else {
          console.log('check has data')
          res["userid"] = userid
          typeof callback == "function" && callback(chkResult, res)
        }
      })
    }
  }

}

function formatTime(x, m) {
  var c, strTime;

  c = "0000" + x.getFullYear();
  strTime = c.substr(c.length - 4, 4);

  c = "00" + (x.getMonth() + 1);
  strTime += '-' + c.substr(c.length - 2, 2);

  c = "00" + x.getDate();
  strTime += '-' + c.substr(c.length - 2, 2);

  if (m > 0) {
    c = "00" + x.getHours();
    strTime += " " + c.substr(c.length - 2, 2);

    c = "00" + x.getMinutes();
    strTime += ":" + c.substr(c.length - 2, 2);

    c = "00" + x.getSeconds();
    strTime += ":" + c.substr(c.length - 2, 2);
  }

  return strTime;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function myGetDate(year, month) {
  var d = new Date(year, month, 0);
  return d.getDate();
}

function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}
function myEncode(code) {
  var c = String.fromCharCode(code.charCodeAt(0) + code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
  }
  return escape(c)
}

function myDecode(code) {
  code = unescape(code);
  var c = String.fromCharCode(code.charCodeAt(0) - code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
  }
  return c;
}

var myRequest = function (user_id, command, parm, cb) {
  wx.request({
    url: Api.host + command,
    data: {
      parm: parm,
      user_id: user_id,
    },
    method: 'POST',
    success: function (res) {
      // success
      var res1
      if (typeof (res.data) == "object" &&
        Object.prototype.toString.call(res.data).toLowerCase() == "[object object]" && !res.data.length) {
        console.log('is json')
        res1 = res.data
      }
      else {
        console.log('is not a json')
        console.log(res.data)
        res1 = JSON.parse(res.data.substring(1))
      }
      if (res1.code == 200) {
        typeof cb == 'function' && cb(res1.data)
      }
      else {
        console.log('data error')
        console.log(res)
      }
    },
    fail: function (res) {
      console.log('require error')
      console.log(res)
    }
  })
}

function buttonClicked(self) {
  self.setData({
    buttonClicked: true
  })
  setTimeout(function () {
    self.setData({
      buttonClicked: false
    })
  }, 500)
}

var myStrLeft = function (s, subLength) {
  var realLength = 0, restLength = 0, res = ''
  for (var i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) < 255) //普通字符 3个算2个
    {
      if (restLength == 0) {
        restLength = 2
        realLength++
        if (realLength > subLength)
          return res
        else {
          res += s.charAt(i)
        }
      }
      else if (restLength == 1) {
        restLength = 0
        if (realLength > subLength)
          return res
        else {
          res += s.charAt(i)
        }
      }
      else if (restLength == 2) {
        restLength = 1
        realLength++
        if (realLength > subLength)
          return res
        else {
          res += s.charAt(i)
        }

      }
    }
    else // 汉字
    {
      realLength++
      if (realLength > subLength)
        return res
      else {
        res += s.charAt(i)
      }
    }
  }
  return res
}

function strNickname(s) {
  var s_1 = s.replace('?', '')
  s_1 = s_1.substr(0, 1) + '*'
  return s_1
}

function strDuplex(s) {
  var s1, s2
  if (s) {
    while (1) {
      s1 = s
      s = s.replace(/\s+/g, ' ')
      s = s.replace(/;;/g, ';')
      s = s.replace(/\|\|/g, '|')
      s = s.replace(/\|\s/g, '|')
      s = s.replace(/\s\|/g, '|')
      s = s.replace(/\+\+/g, '+')
      s = s.replace(/\s\+/g, '+')
      s = s.replace(/\+\s/g, '+')
      s = s.replace(/\&\s/g, '&')
      s = s.replace(/\&\&/g, '&')
      s = s.replace(/\s\&/g, '&')
      s = s.replace(/\+/g, '&')
      if (s == s1)
        break
    }
    while (1) {
      s1 = s
      s2 = s.substring(s.length - 1)
      if (s2 == ';' || s2 == '^' || s2 == '|' || s2 == '&')
        s = s.substring(0, s.length - 1)
      if (s == s1)
        break
    }
  }
  return s
}

var myGoodsDesc = function (desc) {
  var imgs, descType
  if (!desc)
    return []
  imgs = desc.match(/data\-original="[^"]*"/g)
  if (!imgs) {
    imgs = desc.match(/data\-original=[^\s]*\s/g)
    if (!imgs) {
      imgs = desc.match(/src="[^"]*"/g)
      if (!imgs) {
        imgs = desc.match(/src=[^\s>]*[\s|>]/g)
        if (imgs)
          for (var i = 0; i < imgs.length; i++) {
            imgs[i] = imgs[i].substr(4, imgs[i].length - 5)
          }
      }
      else {
        for (var i = 0; i < imgs.length; i++) {
          imgs[i] = imgs[i].substr(5, imgs[i].length - 6)
        }
      }
    }
    else {
      for (var i = 0; i < imgs.length; i++) {
        imgs[i] = imgs[i].substr(14)
      }
    }
  }
  else {
    for (var i = 0; i < imgs.length; i++) {
      imgs[i] = imgs[i].substr(15, imgs[i].length - 16)
    }
  }

  if (imgs) {
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].substr(0, 1) == '/')
        imgs[i] = "http:" + imgs[i]
    }
  }
  console.log(imgs)
  return imgs
}

function doItems(userid, that, pageNumber, comm, records, isRefresh) {
  var items, dd
  items = that.data.images
  if (!records)
    records = 40
  var sortType = that.data.CheckItem ? that.data.CheckItem : 1
  var command = "item/" + comm
  console.log(command)
  var parm = { "userID": userid, "Records": records, "PageNumber": pageNumber, "sortType": sortType }
  console.log(parm)
  myRequest(userid, command, parm, (res) => {
    for (var i = 0; i < res.length; i++) {
      res[i].title = myStrLeft(res[i].title, 11) + "..."
      res[i].usercommission = res[i].usercommission ? res[i].usercommission.toFixed(2) : 0
      res[i].coupon_price = parseFloat(res[i].coupon_price).toFixed(1)
      if (!res[i].quan || res[i].quan == 0)
        res[i].quan = (res[i].price - res[i].coupon_price).toFixed(1)
      res[i]["iid"] = i + 1
      items.push(res[i])
    }

    if (pageNumber == 1 || isRefresh)
      dd = res
    else
      dd = items
    console.log(res)
    that.setData({
      images: dd
    })
  })
}
// pub_parm($userID, $PageNumber, $Records, $sortType, $keywords, $skType, $fun_type)
function doSearch(userid, that, pageNumber, Records, sortType, skType, keyWord, hisSearch, funType, w11, cb) {
  var items = that.data.images
  if (!w11)
    w11 = 1100
  if (!hisSearch)
    hisSearch = keyWord

 // sortType = that.data.sortType ? that.data.sortType : 1
  if (keyWord) {
    if (keyWord == '优选' || keyWord == '精选' || keyWord == '全部' || keyWord.toLowerCase() == 'all')
    {
      funType = funType & 4094
    }
  }
  var command = "item/itemsearchnew"
  showLoading()
  var parm = { "keywords": keyWord, "userId": userid, "Records": Records, "PageNumber": pageNumber, "skType": skType, "sortType": sortType, "hisSearch": hisSearch, "funType": funType }
  console.log(parm)
  myRequest(userid, command, parm, (res) => {
    console.log(res)
    if (res == keyWord || isBlank(res.res)) {
      if (pageNumber == 1) {
        //        app.globalData.searchCount = 0
        wx.showToast({
          title: '未搜到相关内容',
          icon: 'success',
          duration: 2000,
          success: function () {
            that.setData({
              images: [],
              searchCount: 0
            }, function () {
              cancelLoading()
              typeof cb === "function" && cb()
            })
            
          }
        })
      }
      else {
        cancelLoading()
        typeof cb === "function" && cb()
      }
    }
    else {
      var dd
      for (var i = 0; i < res.res.length; i++) {
        
        res.res[i].title = myStrLeft(res.res[i].title, w11) + "..."
        res.res[i].usercommission = res.res[i].usercommission ? parseFloat(res.res[i].usercommission).toFixed(2) : 0
        res.res[i].coupon_price = parseFloat(res.res[i].coupon_price).toFixed(1)
        res.res[i].quan = parseFloat(res.res[i].quan).toFixed(0)

        res.res[i]["iid"] = i + 1
        items.push(res.res[i])
      }
      if (pageNumber == 1)
        dd = res.res
      else
        dd = items

      that.setData({
        images: dd,
        searchCount: res.total
      },function(){
        cancelLoading()
        typeof cb === "function" && cb()
      })
    }
  })
  //  })
}
// MD5 加密
function safe_add(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF)
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
  return (msw << 16) | (lsw & 0xFFFF)
}

/*  
 * Bitwise rotate a 32-bit number to the left.  
 */
function rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt))
}

/*  
 * These functions implement the four basic operations the algorithm uses.  
 */
function cmn(q, a, b, x, s, t) {
  return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
}
function ff(a, b, c, d, x, s, t) {
  return cmn((b & c) | ((~b) & d), a, b, x, s, t)
}
function gg(a, b, c, d, x, s, t) {
  return cmn((b & d) | (c & (~d)), a, b, x, s, t)
}
function hh(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t)
}
function ii(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | (~d)), a, b, x, s, t)
}

/*  
 * Calculate the MD5 of an array of little-endian words, producing an array  
 * of little-endian words.  
 */
function coreMD5(x) {
  var a = 1732584193
  var b = -271733879
  var c = -1732584194
  var d = 271733878

  for (var i = 0; i < x.length; i += 16) {
    var olda = a
    var oldb = b
    var oldc = c
    var oldd = d

    a = ff(a, b, c, d, x[i + 0], 7, -680876936)
    d = ff(d, a, b, c, x[i + 1], 12, -389564586)
    c = ff(c, d, a, b, x[i + 2], 17, 606105819)
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330)
    a = ff(a, b, c, d, x[i + 4], 7, -176418897)
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426)
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341)
    b = ff(b, c, d, a, x[i + 7], 22, -45705983)
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416)
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417)
    c = ff(c, d, a, b, x[i + 10], 17, -42063)
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162)
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682)
    d = ff(d, a, b, c, x[i + 13], 12, -40341101)
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290)
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329)

    a = gg(a, b, c, d, x[i + 1], 5, -165796510)
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632)
    c = gg(c, d, a, b, x[i + 11], 14, 643717713)
    b = gg(b, c, d, a, x[i + 0], 20, -373897302)
    a = gg(a, b, c, d, x[i + 5], 5, -701558691)
    d = gg(d, a, b, c, x[i + 10], 9, 38016083)
    c = gg(c, d, a, b, x[i + 15], 14, -660478335)
    b = gg(b, c, d, a, x[i + 4], 20, -405537848)
    a = gg(a, b, c, d, x[i + 9], 5, 568446438)
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690)
    c = gg(c, d, a, b, x[i + 3], 14, -187363961)
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501)
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467)
    d = gg(d, a, b, c, x[i + 2], 9, -51403784)
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473)
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734)

    a = hh(a, b, c, d, x[i + 5], 4, -378558)
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463)
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562)
    b = hh(b, c, d, a, x[i + 14], 23, -35309556)
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060)
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353)
    c = hh(c, d, a, b, x[i + 7], 16, -155497632)
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640)
    a = hh(a, b, c, d, x[i + 13], 4, 681279174)
    d = hh(d, a, b, c, x[i + 0], 11, -358537222)
    c = hh(c, d, a, b, x[i + 3], 16, -722521979)
    b = hh(b, c, d, a, x[i + 6], 23, 76029189)
    a = hh(a, b, c, d, x[i + 9], 4, -640364487)
    d = hh(d, a, b, c, x[i + 12], 11, -421815835)
    c = hh(c, d, a, b, x[i + 15], 16, 530742520)
    b = hh(b, c, d, a, x[i + 2], 23, -995338651)

    a = ii(a, b, c, d, x[i + 0], 6, -198630844)
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415)
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905)
    b = ii(b, c, d, a, x[i + 5], 21, -57434055)
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571)
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606)
    c = ii(c, d, a, b, x[i + 10], 15, -1051523)
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799)
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359)
    d = ii(d, a, b, c, x[i + 15], 10, -30611744)
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380)
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649)
    a = ii(a, b, c, d, x[i + 4], 6, -145523070)
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379)
    c = ii(c, d, a, b, x[i + 2], 15, 718787259)
    b = ii(b, c, d, a, x[i + 9], 21, -343485551)

    a = safe_add(a, olda)
    b = safe_add(b, oldb)
    c = safe_add(c, oldc)
    d = safe_add(d, oldd)
  }
  return [a, b, c, d]
}

/*  
 * Convert an array of little-endian words to a hex string.  
 */
function binl2hex(binarray) {
  var hex_tab = "0123456789abcdef"
  var str = ""
  for (var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
      hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF)
  }
  return str
}

/*  
 * Convert an array of little-endian words to a base64 encoded string.  
 */
function binl2b64(binarray) {
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  var str = ""
  for (var i = 0; i < binarray.length * 32; i += 6) {
    str += tab.charAt(((binarray[i >> 5] << (i % 32)) & 0x3F) |
      ((binarray[i >> 5 + 1] >> (32 - i % 32)) & 0x3F))
  }
  return str
}

/*  
 * Convert an 8-bit character string to a sequence of 16-word blocks, stored  
 * as an array, and append appropriate padding for MD4/5 calculation.  
 * If any of the characters are >255, the high byte is silently ignored.  
 */
function str2binl(str) {
  var nblk = ((str.length + 8) >> 6) + 1 // number of 16-word blocks    
  var blks = new Array(nblk * 16)
  for (var i = 0; i < nblk * 16; i++) blks[i] = 0
  for (var i = 0; i < str.length; i++)
    blks[i >> 2] |= (str.charCodeAt(i) & 0xFF) << ((i % 4) * 8)
  blks[i >> 2] |= 0x80 << ((i % 4) * 8)
  blks[nblk * 16 - 2] = str.length * 8
  return blks
}

/*  
 * Convert a wide-character string to a sequence of 16-word blocks, stored as  
 * an array, and append appropriate padding for MD4/5 calculation.  
 */
function strw2binl(str) {
  var nblk = ((str.length + 4) >> 5) + 1 // number of 16-word blocks    
  var blks = new Array(nblk * 16)
  for (var i = 0; i < nblk * 16; i++) blks[i] = 0
  for (var i = 0; i < str.length; i++)
    blks[i >> 1] |= str.charCodeAt(i) << ((i % 2) * 16)
  blks[i >> 1] |= 0x80 << ((i % 2) * 16)
  blks[nblk * 16 - 2] = str.length * 16
  return blks
}

/*  
 * External interface  
 */
function hexMD5(str) { return binl2hex(coreMD5(str2binl(str))) }
function hexMD5w(str) { return binl2hex(coreMD5(strw2binl(str))) }
function b64MD5(str) { return binl2b64(coreMD5(str2binl(str))) }
function b64MD5w(str) { return binl2b64(coreMD5(strw2binl(str))) }
/* Backward compatibility */
function calcMD5(str) { return binl2hex(coreMD5(str2binl(str))) }

function stringToDate(fDate) {
  var dDate = fDate.split(" ");
  var sDate, sTime, isS, isT
  for (var i = 0; i < dDate.length; i++) {
    if (dDate[i]) {
      if (isS) {
        if (!isT) {
          isT = true
          sTime = dDate[i].split(':')
        }
      }
      else {
        isS = true
        sDate = dDate[i].split('-')
      }
    }
  }
  if (!sTime) {
    sTime = [0, 0, 0]
  }

  return new Date(sDate[0], sDate[1] - 1, sDate[2], sTime[0], sTime[1], sTime[2]);
  }

function showLoading() {
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 200000,
  });
}

function cancelLoading() {
  wx.hideToast();
}

module.exports = {
  formatTime: formatTime,
  myRequest: myRequest,
  getCode: getCode,
  checkToken: checkToken,
  getToken: getToken,
  myEncode: myEncode,
  myDecode: myDecode,
  myGetDate: myGetDate, // 取月份天数
  myStrLeft: myStrLeft,
  myGoodsDesc: myGoodsDesc,
  doItems: doItems,
  doSearch: doSearch,
  buttonClicked: buttonClicked,
  hexMD5: hexMD5,
  strNickname: strNickname,
  strDuplex: strDuplex,
  stringToDate: stringToDate,
  isBlank: isBlank,
  timestampToTime: timestampToTime,
  showLoading: showLoading,
  cancelLoading: cancelLoading,
  moduleLog: moduleLog,
  modiParent: modiParent
}
