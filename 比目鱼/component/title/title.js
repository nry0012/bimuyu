
function init() {
  var that = this;

  //header中相应的 操作
  that.Back = function () {
    wx.navigateBack({
      delta: 1
    })
  }
}

module.exports = {
  init: init
}