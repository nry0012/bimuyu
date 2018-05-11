//suggest.js  
//获取应用实例  
var app = getApp()
var util = require('../../utils/util.js');
var moduleID = 41, pid

Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '老铁，快来和我一起走向人生巅峰吧',
      desc: '老铁，快来和我一起走向人生巅峰吧',
      path: '/pages/index/index?parentid=' + app.globalData.parentID,
      imageUrl: 'https://xcx.byscape.com/xbm_rootdir/mamamiya/resource/share-index.png',
      success: function (res) {
        var command = "share/log"
        var userid = app.globalData.userid
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

    selectPerson: true,
    selectArea: false,
    isChecked: false,
    CheckItem: 0,
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    yangshi: false,
    suggestion: '',
    xianshi: 1,
    questions: [],
  },
  
  onLoad: function (e) {
    var that = this;
    pid = e.id

    util.moduleLog(app.globalData.userid, 41)


    var command = "question/questionlistnew"
    var userid = app.globalData.userid
    var parm = { "userID": userid, "isAgent" : app.globalData.isAgent }
    util.myRequest(userid, command, parm, (res) => {
      console.log(res)

      var qtid = 0, qtid1 = 0, questions = [], j = 0, k = 0, question = [], quesitem = {}, quitem = {}
      for (var i = 0; i < res.length; i++) {
        qtid = res[i].qtID
        if (qtid == qtid1) {
          // 同一分类
          j++
          quesitem = {}
          quesitem["qsContent"] = res[i].qsContent
          quesitem["asContent"] = res[i].asContent
          quesitem["qsID"] = res[i].qsID
          quesitem["id"] = k + ',' + j
          quesitem["Last"] = 0
          question.push(quesitem)
        }
        else {
          // 不同分类
          qtid1 = qtid
          if (i > 0) {
            k ++
            j = 0
            question[question.length - 1].Last = 1
            quitem["Question"] = question
            questions.push(quitem)
            question = []
            quesitem = {}
            quitem = {}
            quesitem["qsContent"] = res[i].qsContent
            quesitem["asContent"] = res[i].asContent
            quesitem["qsID"] = res[i].qsID
            quesitem["id"] = k + ',' + j
            question.push(quesitem)
            quitem["qtID"] = qtid
            quitem["qtName"] = res[i].qtName
            quitem["qtPic"] = res[i].qtPic
          }
          else {
            quitem["qtID"] = qtid
            quitem["qtName"] = res[i].qtName
            quitem["qtPic"] = res[i].qtPic
            quesitem["qsContent"] = res[i].qsContent
            quesitem["asContent"] = res[i].asContent
            quesitem["qsID"] = res[i].qsID
            quesitem["id"] = k + ',' + j
            quesitem["Last"] = 0
            question.push(quesitem)
          }
        }
      }
      question[question.length - 1].Last = 1
      quitem["Question"] = question
      questions.push(quitem)
      that.setData({
        questions: questions,
      }, function() {
        console.log(questions)
      })
    })

  },

  quesItem: function (e) {
    var id = e.currentTarget.id
    var ids = id.split(',')
    var qs = this.data.questions[ids[0]].Question[ids[1]].qsContent
    var ans = this.data.questions[ids[0]].Question[ids[1]].asContent
    this.setData({
      question: qs,
      answer: ans,
      showStatus: true 
    })
  },

  hideItem : function () {
    this.setData({
      showStatus: false
    })
  },
  onShow: function () {
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    var dd = prevPage.data.worthys

    var ids = pid.split(',')
    dd[ids[0]].worthy[ids[1]].msgState = 0
    prevPage.setData({//直接给上移页面赋值
      worthys: dd
    })
  },

})  