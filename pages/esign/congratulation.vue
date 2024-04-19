<template>
  <view class="content">
    <view style="position: relative">
      <image src="../../static/image/u135.png" mode="widthFix" />
      <view class="tip">已加入团队</view>
    </view>
    <view class="operate">
      <text @click="go">查看劳务信息</text>
      <text @click="gohome">返回首页</text>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    go() {
      uni.redirectTo({ url: "/pages/often/info" });
    },
    gohome() {
      uni.switchTab({ url: "/pages/index/index" });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  text-align: center;
}
.operate {
  display: flex;
  justify-content: space-evenly;
  margin-top: 50rpx;
  color: #02a7f0;
}
.tip {
  position: absolute;
  bottom: 12rpx;
  left: 52%;
  transform: translateX(-50%);
  line-height: 60rpx;
  width: 180rpx;
  height: 60rpx;
  color: #fff;
  background-color: #ff5b5b;
}
</style>
