<template>
  <view class="sign-box">
    <!-- <image
      class="signImg"
      v-if="newValue"
      :src="newValue"
      mode="widthFix"
    ></image> -->

    <canvas
      class="mycanvas"
      canvas-id="mycanvas"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
      disable-scroll
    ></canvas>
    <u--text class="text" @click="clear" type="primary" text="清除"></u--text>
    <!-- <view class="footer">
      <view class="left box-bg" @click.stop="finish">完成</view>
      <view class="right box-bg" @click.stop="clear">清除</view>
    </view> -->
  </view>
</template>

<script>
// var x = 20;
// var y = 20;
// import { config } from "@/utils/config.js";
export default {
  props: {
    value: "",
  },
  data() {
    return {
      ctx: "", //绘图图像
      points: [], //路径点集合
      // action: config.baseUrl + "api/update",

      newValue: "",
    };
  },

  watch: {
    value(val, oldVal) {
      // console.log('value',val, oldVal)
      this.newValue = val;
    },
  },
  created() {
    this.ctx = uni.createCanvasContext("mycanvas", this); //创建绘图对象
    this.ctx.setFillStyle("#fff");
    //设置画笔样式
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
  },
  methods: {
    //触摸开始，获取到起点
    touchstart: function (e) {
      let startX = e.changedTouches[0].x;
      let startY = e.changedTouches[0].y;
      let startPoint = {
        X: startX,
        Y: startY,
      };

      /* **************************************************
				    #由于uni对canvas的实现有所不同，这里需要把起点存起来
				 * **************************************************/
      this.points.push(startPoint);

      //每次触摸开始，开启新的路径
      this.ctx.beginPath();
    },

    //触摸移动，获取到路径点
    touchmove: function (e) {
      let moveX = e.changedTouches[0].x;
      let moveY = e.changedTouches[0].y;
      let movePoint = {
        X: moveX,
        Y: moveY,
      };
      this.points.push(movePoint); //存点
      let len = this.points.length;
      if (len >= 2) {
        this.draw(); //绘制路径
      }
    },

    // 触摸结束，将未绘制的点清空防止对后续路径产生干扰
    touchend: function () {
      this.points = [];
    },

    /* ***********************************************
			#   绘制笔迹
			#   1.为保证笔迹实时显示，必须在移动的同时绘制笔迹
			#   2.为保证笔迹连续，每次从路径集合中区两个点作为起点（moveTo）和终点(lineTo)
			#   3.将上一次的终点作为下一次绘制的起点（即清除第一个点）
			************************************************ */
    draw: function () {
      let point1 = this.points[0];
      let point2 = this.points[1];
      this.points.shift();
      this.ctx.moveTo(point1.X, point1.Y);
      this.ctx.lineTo(point2.X, point2.Y);
      this.ctx.stroke();
      this.ctx.draw(true);
    },

    //清空画布
    clear: function () {
      let that = this;
      that.newValue = "";
      uni.getSystemInfo({
        success: function (res) {
          let canvasw = res.windowWidth;
          let canvash = res.windowHeight;
          that.ctx.setFillStyle("#fff");
          that.ctx.clearRect(0, 0, canvasw, canvash);
          that.ctx.draw(true);
        },
      });
    },

    //完成绘画并保存到本地
    finish: function () {
      var that = this;

      uni.canvasToTempFilePath(
        {
          canvasId: "mycanvas",
          success: function (res) {
            // console.log(res);
            // uni.showToast({
            //   title: "签名成功",
            // });
            let path = res.tempFilePath;
            that.$emit("path", path);
            // that.imgUpload(path);
          },
          fail: function (res) {
            console.log(res);
          },
        },
        that
      );
    },
    imgUpload(tempFilePaths) {
      new Promise((resolve, reject) => {
        const uploadTask = uni.uploadFile({
          url: this.action,
          filePath: tempFilePaths,
          name: "file",
          fileType: "image",

          header: {
            Token: uni.getStorageSync("token"),
          },
          success: (uploadFileRes) => {
            if (typeof this.uploadSuccess == "function") {
              if (this.uploadSuccess(uploadFileRes).success) {
                this.value.push(this.uploadSuccess(uploadFileRes).url);
              }
            }
            resolve(uploadFileRes);
            this.$emit("uploadSuccess", uploadFileRes);
          },
          fail: (err) => {
            reject(err);
            this.$emit("uploadFail", err);
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.sign-box {
  position: relative;
  padding: 40rpx 80rpx 50rpx 80rpx;
  background-color: #ccc;
  .text {
    position: absolute;
    left: 20rpx;
    bottom: 10rpx;
  }
  .mycanvas {
    background-color: #f2f2f2;
  }
}
</style>
