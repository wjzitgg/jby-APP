<template>
  <view class="pad">
    <!-- <web-view :src="urls" v-if="show"/> -->
    <MumuPreviewOffce :fileUrl="urls" :page="page" :value="true"></MumuPreviewOffce>
  </view>
</template>

<script>
import MumuPreviewOffce from "../../uni_modules/mumu-previewOffce/components/mumu-previewOffce/mumu-previewOffce.vue";
export default {
    components:{MumuPreviewOffce},
onLoad(options) {
    this.urls=options.url
    this.page=options.page?options.page - 0:1
    if(options.title){
        uni.setNavigationBarTitle({  
           title:options.title
        })
    }
},
data(){
    return {
        urls:"",
        show:false,
        page:1
    }
},
methods:{
          
}
}
</script>

<style lang="scss" scoped>
// .pad{
//     padding-top: 156rpx;
// }
</style>