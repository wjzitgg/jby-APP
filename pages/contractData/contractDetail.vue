<!-- 施工合同 -->
<template>
  <view>
    <list contractTitle="施工合同" contractType="1" :projectBidId="projectBidId"></list>
  </view>
</template>

<script>
import list from './publicContract.vue';
export default {
  components: { list },
  data() {
    return {
      projectBidId:""
    };
  },
  onLoad(options) {
    this.projectBidId = options.projectBidId
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
</style>