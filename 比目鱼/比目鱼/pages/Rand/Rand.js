// Rand.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:"ww",
    maxCombo:"12",
    insistTime:"232",
    first:{},
    personal: {
      order: "",
      img: "",
    },
    goodsdata:{
      haorenyuanshu:"12",
      lianxurenwu:"12",
      yongjin:"12.33",
      rank:"32"
    },
    rand:[
      { rank: "2", imgurl: "http://xcx.byscape.com/xbm_rootdir/mamamiya/resource/top2.png", nickename: "a.22", haorenyuanshu: "12", lianxurenwu: "3", yongjin:"12.21"}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    var that = this
    util.moduleLog(userid, 56)


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
  
  },

})