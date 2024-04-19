<template>
  <view class="wrapper">
    <u-navbar leftText="会议签到" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="content">
      <!-- 当天签到 -->
      <view v-if="obj.stats === 1">
        <view style="position: relative">
          <image src="../../static/image/u135.png" mode="widthFix" />
          <view class="tip">已完成签到</view>
        </view>
        <view class="operate">
          <text @click="go">查看会议信息</text>
          <text @click="gohome">返回首页</text>
        </view>
      </view>
      <!-- 非当天签到 -->
      <view class="notToday" v-if="obj.stats === 0">
        <view>非当天会议签到码</view>
        <view>签到失败</view>
      </view>
      <!-- 已签到过 -->
      <view class="reSignIn" v-if="obj.stats === 2">
        <view>您已经签到过了</view>
        <view>请勿重复签到</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    let obj = JSON.parse(options.obj);
    this.obj = obj;
  },
  data() {
    return {
      obj: {},
    };
  },
  methods: {
    go() {
      console.log("11", this.obj);
      uni.redirectTo({
        url: "/pages/often/trainDetail?obj=" + JSON.stringify(this.obj),
      });
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
  left: 51%;
  transform: translateX(-50%);
  line-height: 60rpx;
  width: 180rpx;
  height: 60rpx;
  color: #fff;
  background-color: #ff5b5b;
}
.notToday,
.reSignIn {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%);
  line-height: 80rpx;
  font-size: 40rpx;
  font-weight: 700;
}
</style>
