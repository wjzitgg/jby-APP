<template>
  <view class="wrapper">
    <u-navbar leftText="清单明细" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true" ></u-navbar>
  </view>
</template>

<script>
export default {
onLoad(options) {
    let obj =JSON.parse(options.row)
    this.getData=obj
},
data(){
    return{
        getData:{},
    }
},
methods:{

},
computed:{
}
}
</script>

<style lang="scss" scoped>
.pad{
    height: 70rpx;
}
.table_empty{
    /*#ifdef APP-PLUS*/
	height: calc(100vh - 326rpx);
	/*#endif*/
	/*#ifdef H5*/
  height: calc(100vh - 258rpx);
	/*#endif*/
}
.sticky{
    display: flex;
    align-items: center;
    padding: 0 12rpx;
    .sel{
        width: 580rpx;
    }
    .edits{
        display: flex;
        align-items: center;
        margin-left: 28rpx;
        color: rgba(21, 118, 230, 1);
        font-size: 28rpx;
        .imgg{
            width: 32rpx;
        }
    }
}
.addChartPop{
  .addChartPop-title{
    padding-left: 40rpx;
    margin-top: 40rpx;
    margin-bottom: 22rpx;
  }
  .addChartPop-content{
    padding-left: 20rpx;
  }
  .addChartPop-footer{
    display: flex;
    height: 100rpx;
    .addChartPop-footer-btns{
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28rpx;
    }
    .cancel{
      width: 270rpx;
      background: rgba(238, 238, 238, 1);
      color: rgba(170, 170, 170, 1);
    }
    .comfit{
      width: 480rpx;
      color: #fff;
      background: #1576e6;
    }
  }
}
</style>