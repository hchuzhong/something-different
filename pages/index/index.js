// pages/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgPic:null,
    picChoosed:false
  },

  assignPicChoosed() {
    if (this.data.bgPic) {
      this.setData({
        picChoosed: true
      })
      wx.getImageInfo({
        src: this.data.bgPic,
        success(res){
          var width = res.width;
          var height = res.height;
          if(width>=height){ //当图片宽度比高度大时，将高度减小
            var ratio = width/height;
            app.globalData.picWidth = 300;
            app.globalData.picHeight = 300/ratio;
          }
          else{ //当图片高度比宽度大时，将宽度减小
            var ratio = height/width;
            app.globalData.picWidth = 300/ratio;
            app.globalData.picHeight = 300;
          }
        },
        fail(res){
          console.log(res)
        }
      })
    } else {
      this.setData({
        picChoosed: false
      })
    }
  },
  getAvatar(e) {
    if (app.globalData.userInfo) {
      this.setData({
        bgPic: app.globalData.userInfo.avatarUrl,
      });
      this.assignPicChoosed();
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            bgPic: res.userInfo.avatarUrl
          });
          this.assignPicChoosed();
        }
      })
    }
  },
  chooseImage(){
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ['album', 'camera'],
      success:(res)=> {
        var tempFilePaths = res.tempFilePaths;
        this.setData({
          bgPic:res.tempFilePaths[0]
        });
        this.assignPicChoosed();
      },
      fail: (res)=>{
        this.assignPicChoosed();
        },
      complete: (res)=>{
        this.assignPicChoosed();
        },
    })
  },
  nextPage(){
      app.globalData.bgPic=this.data.bgPic;
      wx.navigateTo({
        url: '../imageeditor/imageeditor',
      })
  }
})