const db = wx.cloud.database();
const app = getApp();
var tag = 0;
Page({
  options: {
    addGlobalClass: true,
  },
  data: {
    btnName:'下一题',
    questions: [],
    tags: 0,
    newArr: [], //随机数数组
  },

  


  beforeQuestion: function () { //改变tags改变题目
    tag = tag - 1;
    if (tag < 0) {
      console.log("第一题");
      tag = 0;
    } else {
      this.setData({
        tags: tag,
      })
    }
  },

  nextQuestion: function () {
    tag = tag + 1;
    if (tag >= this.data.newArr.length) {
      console.log("最后一题");
      tag = this.data.newArr.length;
     
    } else {
      this.setData({
        tags: tag,
      })
    };

  },



  onLoad: function (options) {
    db.collection('questionBank').get({
      success: res => {
        const answerBank = res.data[0].question[0];
        this.setData({
          questions: res.data[0].question,
        })
        console.log(this.data.questions)
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
  onShow: function () { //生成随机数数组，指定范围并且不能出现重复的数字
    var oldArr = [0, 1, 2, 3, 4, 5, 6, 7];
    var newArr = [];
    while (oldArr.length) {
    var index = parseInt(Math.random() * oldArr.length);
      newArr = newArr.concat(oldArr.splice(index, 1))
    }
    console.log(newArr);
    this.setData({
      newArr: newArr,
    })

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