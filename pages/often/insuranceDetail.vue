<template>
  <view class="content wrapper">
     <u-navbar leftText="保险详情" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <pdf :fileUrl="fileUrl" :iframeStyle="{width:'100%',height:'90vh'}"></pdf>
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
