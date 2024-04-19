<template>
  <view class="search-inputs">
    <u-input border="none" v-bind="$attrs" v-on="$listeners"> 
        <view slot="suffix">
          <view class="searchBtn" @click="$emit('search')">搜索</view>
        </view>
    </u-input >
  </view>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.search-inputs{
	display: flex;
	align-items: center;
	height: 72rpx;
	margin:20rpx 24rpx;
	padding: 29rpx 24rpx;
	background-color: #f9f9ff;
	border: 2rpx solid #dde2f0;
	border-radius: 8rpx;
	.input-placeholder,.placeholder{
		color: #20345733;
	}
    .searchBtn{
        font-size: 28rpx;
        color: rgba(0, 122, 254, 1);
    }
}
</style>