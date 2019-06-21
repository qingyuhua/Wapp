const db = wx.cloud.database();
const app = getApp();
Page({
  data: {
    avatarUrl: '',
    userInfo: {},
  },
  userLogin: function () {
    wx.getSetting({ //调用接口判断是否登录
      success: res => { //调用成功调用获取信息API
        console.log('调用getsetting成功');
        wx.getUserInfo({
          success: res => { //调用成功获取用户信息
            console.log('获取信息成功' + res);
            this.setData({ //将用户信息传递给data
              avatarUrl: res.userInfo.avatarUrl,
              userInfo: res.userInfo,
            })

            wx.cloud.callFunction({ //调用云函数，获取用户openid
              name: 'login',
              data: {},
              success: res => { //调用成功并获取到用户openid将openid传递给globalData
                console.log('云函数调用成功')
                app.globalData.openid = res.result.openid
              },
              fail: err => {
                console.error(' 调用云函数失败', err)
              }
            })

            db.collection('userInfo').where({
              _openid: app.globalData.openid,
            }).get({ //根据openid寻找到对应集合，如果没有记录则添加记录
              success: res => {
                if (res.data.length == 0) {
                  console.log('未找到记录，正在添加');
                  db.collection('userInfo').add({
                    data: {
                      avatarUrl: this.data.avatarUrl,
                      userInfo: this.data.userInfo,
                    }
                  })
                  console.log('用户数据添加成功')
                } else {
                  console.log('已有记录，不添加');
                }
              },
              fail: res => {
                console.log(res)
              }
            })
          },
          fail: res => {
            console.log(res)
          }
        })
      },
      fail: res => {
        console.log('接口调用失败')
      }
    })

    // 调用云函数







  },
  goIndex: function () { //授权完成跳转到首页
    db.collection('userInfo').where({
      _openid: app.globalData.openid,
    }).get({
      success: res => {
        db.collection('userInfo').doc(res.data[0]._id).get({
          success: res => { //判断数据库中是否有相应openid的注册数据，如果没有则跳转到注册页面
            if ((res.data.name || res.data._class) == undefined) {
              wx.reLaunch({
                url: '../register/register',
                success: res => {
                  console.log(res)
                }
              })
            } else {
              wx.reLaunch({ //有相关注册数据，跳转到首页
                url: '../index/index',
                success: res => {
                  console.log(res)
                }
              })

            }
          }
        })
      }
    })

  },

  onLoad: function (options) {

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
              })
            }
          })
        }
      }
    })



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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})