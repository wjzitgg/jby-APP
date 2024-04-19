<template>
  <view class="content">
    <!-- 变更设计 -->
  </view>
</template>

<script>
export default {
  onLoad(options) {
    uni.showLoading({
      mask: true
    })
    uni.redirectTo({
      url: `/pages/waiting/todoList?tags=1`,
      success:()=>{
        uni.hideLoading()
      }
    });
  },
}
</script>

<style>

</style>