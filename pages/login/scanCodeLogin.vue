<template>
  <view class="wrapper">
    <view class="content">
      <image
      src="../../static/image/PC.png"
      mode="widthFix"
      class="images"
    />
    <view class="mb-20">建必优系统登陆确认</view>
    <view class="tip">请不要扫描来源不明的二维码</view>
    <view class="btns">
      <view class="btnCls login" @click="btnOk(3)">确认登录</view>
      <view class="btnCls noLogin" @click="btnOk(5)">取消登录</view>
    </view>
    </view>
    <view class="bg"></view>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    this.scanCode=options.scanCode
    console.log(options);
  },
  data(){
    return{
      scanCode:""
    }
  },
  methods:{
    btnOk(loginStatus){
      uni.showLoading({
        mask: true
      })
      console.log({loginStatus,scanCode:this.scanCode});
      this.$api.updateStatusByScanCode({loginStatus,scanCode:this.scanCode}).then((res) => {
        uni.hideLoading()
        if(res.code===200){
          if(res.data.isPromptError){
            uni.navigateBack()
            uni.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            mask: true
          })
          }else{
            uni.navigateBack()
            if(loginStatus===3){
              uni.showToast({
                title: '登录成功',
                icon: 'success',
                mask: true
              })
            }
          }
        }else{
          uni.navigateBack()
          uni.showToast({
            title: res.msg,
            icon: 'none',
            mask: true
          })
        }
      }).catch((err) => {
        uni.hideLoading()
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.bg{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fafafa;
  }
.content{
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 1;
}
.images{
  width: 300rpx;
  // height: 100rpx;
  margin-bottom: 30rpx;
}
.mb-20{
  margin-bottom: 20rpx;
}
.tip{
  margin-bottom: 260rpx;
  color:#aaaaaa
}
.btns{
  .btnCls{
    width: 600rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    text-align: center;
  }
  .login{
      margin-bottom: 20rpx;
      color: #fff;
      background: -webkit-linear-gradient(to right ,#f28d28, #e44a5d); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(to right, #f28d28, #e44a5d); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(to right ,#f28d28, #e44a5d); /* Firefox 3.6 - 15 */
      background: linear-gradient(to right, #f28d28, #e44a5d); /* 标准的语法（必须放在最后） */
	    background-size: 100% 100%;
    }
    .noLogin{
      background-color: #f2f2f2;
    }
}
</style>