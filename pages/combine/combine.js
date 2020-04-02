// pages/combine/combine.js
const app=getApp();
Page({

  data: {
  
  },

  onLoad: function (options) {
    wx.getImageInfo({
      src:app.globalData.bgPic,
      success: res => {
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
    const iconSize = 100 * scale;

    pc.clearRect(0, 0, windowWidth, 300);
    pc.drawImage(this.bgPic, windowWidth / 2 - 150, 0, 300, 300);
    pc.translate(iconCenterX,iconCenterY);
    pc.rotate(rotate * Math.PI / 180);
    pc.drawImage(iconSrc, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
    pc.draw();
  },
  savePic() {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    wx.canvasToTempFilePath({
      x: windowWidth / 2 - 150,
      y: 0,
      height: 300,
      width: 300,
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
                  wx.navigateTo({
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