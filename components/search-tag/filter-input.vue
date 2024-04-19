<template>
  <view class="filter-input">
      <view class="search-input" >
        <u-input border="none" v-bind="$attrs" v-on="$listeners"> 
            <view slot="suffix">
              <view class="searchBtn" @click="$emit('search')">搜索</view>
            </view>
        </u-input >
      </view>
    </view>
</template>

<script>
export default {

}

</script>

<style lang="scss" scoped>
.filter-input {
    display: flex;
    align-items: center;
    width: 100%;
    height: 72rpx;
    border: 1px solid #b4d0f0;
    border-radius: 10rpx;
    .search-input {
      display: flex;
      align-items: center;
      flex: 1;
      height: 70rpx;
      padding-left: 10rpx;
    }
    .searchBtn {
      width: 120rpx;
      height: 72rpx;
      line-height: 72rpx;
      font-size: 26rpx;
      text-align: center;
      color: #2a82e4;
    }
  }
</style>