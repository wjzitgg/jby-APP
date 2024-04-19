<template>
  <view class="content">
    <!-- 施工验收 -->
  </view>
</template>

<script>
export default {
  onLoad(options) {
    uni.showLoading({
      mask: true
    })
    uni.redirectTo({
      url: `/pages/waiting/todoList?tags=5`,
      success:()=>{
        uni.hideLoading()
      }
    });
  },
}
</script>

<style>

</style>