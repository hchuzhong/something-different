// pages/combine/combine.js
const app=getApp();
Page({

  data: {
    iconWidth: 0,
    iconHeight: 0
  },

  onLoad: function (options) {
    var that = this;
    wx.getImageInfo({
      src: app.globalData.iconSrc,
      success(res){
        var width = res.width;
        var height = res.height;
        if (width >= height) { //当图片宽度比高度大时，将高度减小
          var ratio = width / height;
          that.data.iconWidth = 100;
          that.data.iconHeight = 100 / ratio;
        }
        else { //当图片高度比宽度大时，将宽度减小
          var ratio = height / width;
          that.data.iconWidth = 100 / ratio;
          that.data.iconHeight = 100;
        }
      },
      fail(res){
        console.log(res)
      }
    })
    wx.getImageInfo({
      src:app.globalData.bgPic,
      success: res => {
        this.picWidth = app.globalData.picWidth;
        this.picHeight = app.globalData.picHeight;
        this.bgPic=res.path;
        this.draw();
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  
  draw() {
    let scale = app.globalData.scale;
    let rotate = app.globalData.rotate;
    let iconCenterX = app.globalData.iconCenterX;
    let iconCenterY = app.globalData.iconCenterY;
    let iconSrc = app.globalData.iconSrc;
    const pc = wx.createCanvasContext('myCanvas');
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const iconWidthSize = this.data.iconWidth * scale;
    const iconHeightSize = this.data.iconHeight * scale;

    pc.clearRect(0, 0, windowWidth, 300);
    pc.drawImage(this.bgPic, windowWidth / 2 - this.picWidth/2, (300-this.picHeight)/2, this.picWidth, this.picHeight);
    pc.translate(iconCenterX,iconCenterY);
    pc.rotate(rotate * Math.PI / 180);
    pc.drawImage(iconSrc, -iconWidthSize / 2, -iconHeightSize / 2, iconWidthSize, iconHeightSize);
    pc.draw();
  },
  savePic() {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    wx.canvasToTempFilePath({
      x: windowWidth / 2 - this.picWidth/2,
      y: (300 - this.picHeight) / 2,
      width: this.picWidth,
      height: this.picHeight,
      destWidth:this.picWidth * wx.getSystemInfoSync().pixelRatio,
      destHeight: this.picHeight * wx.getSystemInfoSync().pixelRatio,
      canvasId: 'myCanvas',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res) => {
            wx.showToast({
              title: 'success',
              icon: 'success',
              duration: 1500,
              mask: true,
              success: function(){
                setTimeout(function(){
                  wx.reLaunch({
                    url: '../index/index',
                  })
                } ,1500)
              }
            })
          }, fail(e) {
          }
        })
      }
    });
  }
})