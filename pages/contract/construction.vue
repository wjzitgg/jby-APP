<!-- 施工合同 -->
<template>
  <view>
    <list contractTitle="施工合同" contractType="1" ref="conList"></list>
  </view>
</template>

<script>
import list from './publicContract.vue';
export default {
  components: { list },
  data() {
    return {
    
    };
  },

  methods: {
    resh(){
      this.$refs.conList.resh()
    }
  },
};
</script>

<style lang="scss" scoped>
</style>