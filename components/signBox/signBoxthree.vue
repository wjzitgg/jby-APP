<template>
  <view class="signBox" @touchstart="touchstart" @touchmove.stop.prevent="touchmove" @touchend.stop.prevent="touchend" :id="id" :style="{ left: editInfo.x+ 'px', top: editInfo.y + 'px' }" style="position: absolute; text-align: center; background: rgba(194, 194, 194, 0.568); width: 60px; height: 60px; " ref="signBox" >
    <!-- <u-icon class="close" name="close" @click.stop.prevent="firstRemo"></u-icon> -->
    <view class="content">{{ content }}</view>
  </view>
</template>

<script>
export default {
  props: {
    top: {
      default: 0,
    },
    left: {
      default: 0,
    },
    id:{
      type:String,
      default:'signBox'
    },
    content: {
      default: "",
    },
    page: {
      default: 1,
    },
    index: "",
    position:{
      type:String,
      default:'absolute'
    },
    type:{
      default:1
    },
    padWid:{
      type:Number,
      default:0
    },
    preview:{
      type:Boolean,
      default:false
    },
    pstop:{
      type:Number,
      default:0
    }
  },
  mounted() {
    if (!!this.top) {
      this.editInfo.y = this.top;
    }
    if(!!this.left){
      this.editInfo.x = this.left;
    }
  },
  watch:{
    top(val){
      console.log('变了',val);
      if(val){
        if(this.type===2){
          if(this.editInfo.y <=this.pstop){
            this.editInfo.x=this.index*60+this.index*7+this.padWid/2+15
            this.editInfo.y=this.pstop
            this.$emit("getPosition", this.editInfo);
          }
        }else{
          this.editInfo.y = this.top;
        }
      }else{
        this.editInfo.y = 20
      }
    },
    left(val){
      if(val){
        console.log(1);
          this.editInfo.x = this.left;
      }else{
        this.editInfo.x = 0
      }
    }
  },
  data() {
    return {
      editInfo: {
        x: 0,
        y: 0,
      },
      isDrag: true,
      disX: "",
      disY: "",
    };
  },
  methods: {
    touchstart(e) {
      if(this.preview) return
      this.disX = e.touches[0].clientX - e.currentTarget.offsetLeft;
      this.disY = e.touches[0].clientY - e.currentTarget.offsetTop;
    },
    touchmove(e) {
      if(this.preview) return
      // 移动当前元素
      let left=e.touches[0].clientX-this.disX;
      let top=e.touches[0].clientY-this.disY;
      this.editInfo.x = left
      this.editInfo.y = top
      // 当x为0或者1都使它不能拖动
      if (left < 0 +this.padWid/2) {
        // 使左边距离的边距为固定的，就不会拖动出去了
        left=0+this.padWid/2
        this.editInfo.x = left;
      } else if (left >= 357 - 60 +this.padWid/2) {
        left=357 - 60 +this.padWid/2
        this.editInfo.x = left;
      }
      if (top < 0) {
        if(this.type===1){
          return
        }
        top=0
        this.editInfo.y = top;
      } else if (top >= (505.2*this.page-60)) {
        top=(505.2*this.page-60)
        this.editInfo.y = top;
      }
      
    },
    touchend(e) {
      if(this.preview) return
      // console.log(this.$refs.signBox.$el.style);
      if(this.type===1){
        if(this.editInfo.y<0){
          this.$emit("close");
        }
        this.$emit("getPosition", this.editInfo);
      }else{
        this.$emit("getPosition", this.editInfo);
        this.editInfo={
          x:this.index*60+this.index*7+this.padWid/2+15,
          y:this.pstop
        }
        console.log(this.editInfo);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  width: 100%;
  font-size: 24rpx;
}
.signBox {
  // position: relative;
  // display: flex;
  // justify-content: end;
}
</style>
