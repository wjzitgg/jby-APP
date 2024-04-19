<template>
  <view class="wrapper">
    <u-navbar leftText="劳务合同详情" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true" class="nav"></u-navbar>
    <view class="content">
      <pdf :fileUrl="fileUrl" :iframeStyle="{width:'100%',height:'90vh'}"></pdf>
    </view>
  </view>
</template>

<script>
import pdf from "../../components/pdf-preview.vue";
export default {
  components: { pdf },
  onLoad(options) {
    this.fileUrl = options.url;
  },
  data() {
    return {
      fileUrl: "",
    };
  },
};
</script>

<style lang="scss" scoped>
.wrapper ,
.content{
  height: 100%;
}
</style>
