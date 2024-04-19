<template>
  <view class="content">
    用章管理
  </view>
</template>

<script>
export default {
  onLoad(options) {
    uni.redirectTo({
      url: `/pages/waiting/todoList?tags=3`,
    });
  },
}
</script>

<style>

</style>