<template>
  <view>
    <view v-if="!isImg">
      <MumuPreviewOffce
        :fileUrl="fileUrl"
        v-model="showPreview"
        v-if="!isImg"
        :iframeStyle="iframeStyle"
        :page="page"
      ></MumuPreviewOffce>
      <!-- <web-view :src="fileUrl" v-if="isIOS && !noPdf" /> -->
    </view>
    <view style="text-align: center;" v-if="isImg">
      <image v-for="(item,index) in imgList" :key="index" :src="item" mode="widthFix" :style="{ width: width }" @click="imgClick(index)"/>
    </view>
  </view>
</template>

<script>
import MumuPreviewOffce from "./mumu-previewOffce/components/mumu-previewOffce/mumu-previewOffce.vue";
export default {
  components: { MumuPreviewOffce },
  props: {
    fileUrl: {
      type: String,
    },
    // 传入样式调整iframe的大小
    iframeStyle: {
      type: Object,
      default: () => {
        let height = uni.getWindowInfo().windowHeight;
        return { width: "100%", height: height + "px" };
      },
    },
    imgs:{
      type:Boolean,
      default:true
    },
    page:{
      type:Number,
      default:1
    }
  },
  created() {
    this.checkName();
    // uni.getSystemInfo({
    //   success: (res) => {
    //     if (res.osName === "ios") {
    //       this.isIOS = true;
    //     } else {
    //       this.isIOS = false;
    //     }
    //   },
    // });
  },
  data() {
    return {
      // isIOS: false,
      isImg: false,
      // noPdf: false,
      showPreview: true,
      width: uni.getWindowInfo().windowWidth,
      imgList:[],
      nowImg:"",
      lookImg:false
    };
  },
  methods: {
    checkName() {
      let exit = this.fileUrl.split(".");
      exit = exit.pop();
      let noimgType = ["pdf", "docx"];
      if (noimgType.includes(exit)) {
        this.isImg = false;
      } else {
        this.isImg = true;
        if(this.imgs){
          this.imgList=JSON.parse(decodeURIComponent(this.fileUrl)).map(item=>item.path)
        }else{
          this.imgList=[this.fileUrl]
        }
        // if (exit !== "pdf") {
        //   this.noPdf = true;
        // } else {
        //   this.noPdf = false;
        // }
      }
    },
    imgClick(index){
      uni.previewImage({
        current:index,
        urls:this.imgList
      })
    }
  },
};
</script>

<style lang="scss" scoped></style>
