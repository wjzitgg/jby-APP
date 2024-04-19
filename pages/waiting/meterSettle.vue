<template>
  <view class="content">
    <!-- 计量结算 -->
  </view>
</template>

<script>
export default {
  onLoad(options) {
    uni.showLoading({
      mask: true
    })
    uni.redirectTo({
      url: `/pages/waiting/todoList?tags=4`,
      success:()=>{
        uni.hideLoading()
      }
    });
  },
}
</script>

<style>

</style>