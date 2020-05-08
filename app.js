App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用2.2.3或以上的基础库')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {}
  }
})