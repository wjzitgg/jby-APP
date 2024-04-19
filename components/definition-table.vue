<template>
	<view class="card">
		<view class="list-item">
			<text>工程部位名称</text>
			<text class="item"> {{ formData.projectName }}</text>
		</view>
		<view class="list-item">
			<text>工程量</text>
			<text class="item">66666</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"definition-table",
		props:["formData"],
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.card {
  background: #fff;
  width: 750rpx;
  // height: calc( 1306rpx - 242rpx);
  // border-left: 8rpx solid #dddddd;
  // padding: 24rpx 40rpx;
  margin-top: 2rpx;

  .list-item {
	height: 80rpx;
	line-height: 80rpx;
	font-size: 28rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	border-bottom: 1px solid rgba(238, 238, 238, 1);
	&:first-child{
		border-top: 1px solid rgba(238, 238, 238, 1);
	}
	text:first-child{
		display: inline-block;
		min-width: 196rpx;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 40rpx;
		border-right: 1px solid rgba(238, 238, 238, 1);
		text-align: justify;
		text-justify: distribute-all-lines;
		text-align-last: justify;
	}
	.item {
	  display: inline-block;
	  // width: 414rpx;
	  padding-left: 10rpx;
	  color: #79859a;
	}
  }
}
</style>