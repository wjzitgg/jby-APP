<template>
  <view class="content">
    <!-- 技术交底 -->
  </view>
</template>

<script>
export default {
   onLoad(options) {
    uni.showLoading({
      mask: true
    })
    uni.redirectTo({
      url: `/pages/waiting/todoList?tags=2`,
      success:()=>{
        uni.hideLoading()
      }
    });
  },
}
</script>

<style>

</style>