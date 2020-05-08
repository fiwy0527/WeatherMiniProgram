//获取应用实例
var app = getApp()
Page({
  data: {
    // 地区
    location: 'loading',
    // 滚动高度
    scrollHeight: 0,
    //  更新时间
    updataTime: '',
    cityWeatherData: {},
    // 十五天 天气预报
    furtherWeather: [],
    // 提示loading
    tips: 'loading....',
    // 显示当前温度
    currentTemperature: 'N/A',
    // 图标路径
    weathericon: '/images/iconfinder_weather_45_2682806.svg',
    // 图标大小
    iconImageHeight: 0,
    // 天气描述
    weatherDes: '',
    // 空气湿度
    humidity: 'N/A',
    // 空气质量
    quality: '',
    // pm25
    pm25: 'N/A',
    // pm10
    pm10: 'N/A'
  },
  //事件处理函数
  showDetailPage: function (e) {
    try {
      // console.log(e)
      var weatherIndex = e.currentTarget.dataset.index
      var currinformation = JSON.stringify(e.currentTarget.dataset.currinformation) || ''
      // console.log(currinformation)
    } catch (e) {}
    wx.navigateTo({
      url: `../detail/detail?index=${weatherIndex}&currinformation=${currinformation}`,
    })
  },
  showSettingPage: function () {
    wx.navigateTo({
      url: "../cities/cities",
    })
  },
  onLoad: function (option) {
    // console.log(option)
    this.calcScrollHeight()
    var that = this

    // 如果没有传回来的城市值执行定位
    if (!option.city) {
      //  获取经纬度
      wx.getLocation({
        type: "wgs84",
        success(res) {
          // 经纬度
          const latitude = res.latitude
          const longitude = res.longitude
          //获取天气api
          wx.request({
            url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=U3XBZ-FHD3P-JKLDG-VG4EY-SIJ3Q-TPF5K`,
            header: {
              "content-type": "application/json",
            },
            success(res) {
              // console.dir(res.data)
              // 获取到本机地址并显示
              let cityLocation = res.data.result.address_component.city.replace('市', '')
              that.setData({
                location: cityLocation
              })
              that.getWeatherData(cityLocation)
            },
          })
        },
      })
    } else {
      // 获取城市的code
      let cityLocation = option.city
      that.setData({
        location: cityLocation
      })
      that.getWeatherData(cityLocation)
    }

  },

  // 获取数据
  getWeatherData(cityLocation) {
    let that = this
    console.log(cityLocation)
    // 获取城市的code
    wx.request({
      url: `https://zhuzhu.icu/Weather/NationApi/weather/${cityLocation}`,
      // http://www.zhuzhu.icu/Weather/NationApi/weather?cityName=${cityLocation}
      // http://t.weather.sojson.com/api/weather/city/101190101
      // header: {
      //   "content-type": "application/json",
      // },
      success(res) {
        // console.log(res.data.status)
        // console.log(res.data)
        if (res.data.status !== '200') return false

        console.log(res.data)

        res.data.data.forecast.slice(0, 7).forEach(item => {
          item.high = item.high.substring(2)
          item.low = item.low.substring(2)
          item.ymd = item.ymd.substring(5)
          item.src = that.getWeatherIcon(item.type)
        })
        that.setData({
          // 将更新时间显示在页面
          updataTime: res.data.time,
          // 七天的数据
          furtherWeather: res.data.data.forecast.slice(0, 7),
          // 当前温度
          currentTemperature: res.data.data.wendu,
          // 天气的图标
          weathericon: that.getWeatherIcon(res.data.data.forecast[0].type),
          tips: res.data.data.ganmao,
          weatherDes: res.data.data.forecast[0].type + '/' + res.data.data.forecast[0].fx + '' + res.data.data.forecast[0].fl,
          humidity: res.data.data.shidu,
          quality: res.data.data.quality,
          pm25: res.data.data.pm25,
          pm10: res.data.data.pm10
        })

      },
    })
  },
  //计算高度
  calcScrollHeight() {
    let that = this
    let query = wx.createSelectorQuery().in(this)
    query.select('.top').boundingClientRect(function (res) {
      let titleHeight = res.height
      let screenHeight = wx.getSystemInfoSync().windowHeight
      let scrollHeight = screenHeight - titleHeight - 70

      that.setData({
        scrollHeight: scrollHeight,
        iconImageHeight: titleHeight / 2
      })
    }).exec()
  },
  // 天气图标的显示
  getWeatherIcon(weather) {
    switch (weather) {
      case '阴':
        return '/images/iconfinder_weather_2_2682849.svg'
      case '中雨':
        return '/images/iconfinder_weather_16_2682835.svg'
      case '大雨':
        return '/images/iconfinder_weather_44_2682807.svg'
      case '多云':
        return '/images/iconfinder_weather_2_2682849.svg'
      case '晴':
        return '/images/iconfinder_weather_3_2682848.svg'
      case '小雨':
        return '/images/iconfinder_weather_13_2682838.svg'
      case '暴雨':
        return '/images/iconfinder_weather_31_2682820.svg'
      case '阵雨':
        return '/images/iconfinder_weather_23_2682828.svg'
      case '雪':
        return '/images/iconfinder_weather_28_2682823.svg'
    }
  }
    
})