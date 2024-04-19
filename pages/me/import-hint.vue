<template>
  <view class="wrapper">
		<u-navbar leftText="重要提示" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
        <view class="header">
            <u-icon name="info-circle" color='#ff0000' size='70' class="u8"></u-icon>
            <view>注销申请生效后，您的手机号码及账号信息将会永久从系统移除。您的手机号码可重新注册新的账号用于平台登陆</view>
        </view>
  </view>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.header{
    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    height: 300rpx;
    padding: 20rpx;
    .u8{
        margin-bottom: 10rpx;
    }
}
</style>