<template>
  <view class="filter-btn" @click="$emit('click')" :class="{'ml-16':marginLeft}" :style="{height:height + 'rpx'}">
    <image src="/static/image/searchImg.png" mode="widthFix" style="width:28rpx;margin-right:12rpx"/>
    筛选
    <!-- <view class="red-dot" v-if="nums>0">{{nums}}</view> -->
  </view>
</template>

<script>
export default {
props:{
  nums:{
    type:Number,
    default:0
  },
  marginLeft:{
    type:Boolean,
    default:false
  },
  height:{
    type:Number,
    default: 60
  }
}
}
</script>

<style lang="scss" scoped>
.ml-16{
  margin-left: 16rpx;
}
.filter-btn{
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140rpx;
  height: 60rpx;
  background-color: #fff;
  border: 1px solid #b4d0f0;
  font-size: 28rpx;
  color: #2a82e4;
  border-radius: 10rpx;
  *{
    color: inherit;
  }
}
.red-dot{
  position: absolute;
  left: 36rpx;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  font-size: 20rpx;
  background-color: #8a94a6;
  border: 1px solid #fff;
  color: #fff;
}
</style>