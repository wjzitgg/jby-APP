<template>
  <view class="content wrapper">
    <u-navbar leftText="客服与帮助" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="pdt-ios"></view>
    <view class="service">
      <view class="main-head"><view class="rectangle"></view> 联系客服</view>
      <view class="main-content">
        <view class="call" @click="call(tel)">
          <u-icon
            size="20"
            name="kefu-ermai"
            color="#35a6e0"
            :label="`客服电话：${tel}`"
          ></u-icon>
        </view>
      </view>
    </view>
    <view class="help">
      <view class="main-head"><view class="rectangle"></view>常见问题</view>
      <view class="questions">
        <view class="questions-item">
          <view class="que">1、问：系统如何注册？</view>
          <view class="answer"
            >答：供应商、分包单位、劳务工人可通过手机端自主注册。</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tel: "",
    };
  },
  onLoad(options) {
    this.getCustomerTelephone()
  },
  methods: {
    // 拨打客服电话
    call(phoneNumber) {
      uni.makePhoneCall({
        phoneNumber,
      });
    },
    getCustomerTelephone(){
      this.$api.getCustomerTelephone().then(res=>{
        if(res.code===200){
          this.tel=res.data
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.service {
  margin-bottom: 20rpx;
}
.main-head {
  position: relative;
  padding: 0 30rpx;
  color: #4b7909e7;
  height: 46rpx;
  line-height: 46rpx;
  font-size: 28rpx;
  font-weight: 700;
  border-bottom: 1px solid #d6d7d97d;
  .rectangle {
    position: absolute;
    width: 12rpx;
    height: 36rpx;
    left: 10rpx;
    bottom: 6rpx;
    vertical-align: bottom;
    background-color: #f59a23;
    border: 1px solid #000;
  }
}
.main-content {
  width: 100%;
  // height: 150rpx;
  padding: 30rpx;
  border-bottom: 1px solid #d6d7d97d;
}
.questions {
  width: 100%;
  padding: 30rpx;
  .questions-item {
    font-size: 28rpx;
    margin-bottom: 30rpx;
  }
  .que {
    margin-bottom: 10rpx;
  }
}
</style>
