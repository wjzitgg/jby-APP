<template>
  <view class="content">
    <!-- 库存盘点 -->
  </view>
</template>

<script>
export default {
  onLoad(options) {
    uni.showLoading({
      mask: true
    })
    uni.redirectTo({
      url: `/pages/waiting/todoList?tags=6`,
      success:()=>{
        uni.hideLoading()
      }
    });
  },
}
</script>

<style>

</style>