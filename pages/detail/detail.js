// detail.js
//获取应用实例
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面天气
    weatherArr: {},
    // 生活指数
    suggestion:{}
  },
  showData(){
    console.log(this.data.weatherArr.ymd)
  },
  onLoad: function (e) {
    let weatherdata = JSON.parse(e.currinformation)
    console.log(weatherdata)
    this.setData({
      weatherArr: weatherdata,
      suggestion:weatherdata.suggestion
    })
  }

})