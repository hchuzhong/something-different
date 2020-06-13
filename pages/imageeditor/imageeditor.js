//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    bgPic:null,
    iconSrc:null,
    showIcon:false,

    iconCenterX:wx.getSystemInfoSync().windowWidth/2,
    iconCenterY:150,
    controlX:wx.getSystemInfoSync().windowWidth/2+50-2,
    controlY:200,

    iconSize:100,

    scale:1,
    rotate:0,

    imgList: ["../../image/1.png", "../../image/2.png", "../../image/3.png",
      "../../image/4.png", "../../image/5.png", "../../image/6.png",
      "../../image/7.png", "../../image/8.png", "../../image/9.png",
      "../../image/10.png"],
  },
  onLoad(){
    this.setData({
      bgPic: app.globalData.bgPic
    })
  },
  
  onReady(){  //将当前页面的参数赋值给window
    this.iconCenterX = this.data.iconCenterX;
    this.iconCenterY = this.data.iconCenterY;
    this.controlX=this.data.controlX;
    this.controlY=this.data.controlY;

    this.scale=this.data.scale;
    this.rotate=this.data.rotate;
    
    this.touchTarget="";
    this.startX=0;
    this.startY=0;
  },
  touchStart(e){
    if(e.target.id=="icon"){
      this.touchTarget="icon";
    }else if(e.target.id=="control"){
      this.touchTarget="control"
    }else{
      this.touchTarget=""
    };
    
    if(this.touchTarget!=""){
      this.startX=e.touches[0].clientX;
      this.startY=e.touches[0].clientY;
    }
  },
  touchEnd(e){
    this.iconCenterX=this.data.iconCenterX;
    this.iconCenterY=this.data.iconCenterY;
    this.controlX=this.data.controlX;
    this.controlY=this.data.controlY;
    this.touchTarget="";
    this.scale=this.data.scale;
    this.rotate=this.data.rotate;
  },
  touchMove(e){
      var currentX=e.touches[0].clientX;
      var currentY=e.touches[0].clientY;
      var movedX=currentX-this.startX;
      var movedY=currentY-this.startY;
      var tempWidth = wx.getSystemInfoSync().windowWidth / 2;
      if(this.touchTarget==="icon"){
        //100 = 150(头像框大小的一般) - 50(icon大小的一半)
        //判断icon是否会超出头像框
        if (currentX > (tempWidth + 100)) {
          this.setData({
            iconCenterX: tempWidth + 100,
            controlX: tempWidth + 150
          })
        }
        else if (currentX < tempWidth - 100) {
          this.setData({
            iconCenterX: tempWidth - 100,
            controlX: tempWidth - 50
          })
        }
        else {
          this.setData({
            iconCenterX: this.data.iconCenterX + movedX,
            controlX: this.data.controlX + movedX
          })
        };
        if (currentY > 250) {
          this.setData({
            iconCenterY: 250,
            controlY: 300
          })
        }
        else if (currentY < 50) {
          this.setData({
            iconCenterY: 50,
            controlY: 100
          })
        }
        else {
          this.setData({
            iconCenterY: this.data.iconCenterY + movedY,
            controlY: this.data.controlY + movedY
          })
        }
      }
      if(this.touchTarget==="control"){
        this.setData({
          controlX:this.data.controlX+movedX,
          controlY: this.data.controlY+movedY
        });
        let diffBeforeX = this.controlX - this.iconCenterX;
        let diffBeforeY = this.controlY - this.iconCenterY;
        let diffAfterX = this.data.controlX - this.iconCenterX;
        let diffAfterY = this.data.controlY - this.iconCenterY;
        let distanceBefore = Math.sqrt(diffBeforeX * diffBeforeX + diffBeforeY * diffBeforeY);
        let distanceAfter = Math.sqrt(diffAfterX * diffAfterX + diffAfterY * diffAfterY);
        let angleBefore = Math.atan2(diffBeforeY, diffBeforeX) / Math.PI * 180;
        let angleAfter = Math.atan2(diffAfterY, diffAfterX) / Math.PI * 180;
        this.setData({
          scale: distanceAfter / distanceBefore * this.scale,
          rotate: angleAfter - angleBefore + this.rotate
        })
      }
      this.startX=currentX;
      this.startY=currentY;
  },
  
  chooseIcon(){
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var tempFilePaths = res.tempFilePaths;
        this.setData({
          iconSrc: res.tempFilePaths[0],
          showIcon: true
        });
      },
      fail: (res) => { },
      complete: (res) => { },
    })
  },

  getIcon(e){
    this.setData({
      iconSrc: this.data.imgList[e.target.dataset.iconId],
      showIcon: true
    })
  },
  nextPage(){
    app.globalData.scale=this.scale;
    app.globalData.rotate = this.rotate;
    app.globalData.iconCenterX = this.iconCenterX;
    app.globalData.iconCenterY = this.iconCenterY;
    app.globalData.iconSrc = this.data.iconSrc;
    wx.navigateTo({
      url: '../combine/combine',
    })
  }
})