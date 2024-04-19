<template>
<view class="wrapper">
    <u-navbar
        leftText="收文待办"
        bgColor="rgb(0 0 0 / 0%)"
        leftIconColor="#fff"
        :autoBack="true"
      ></u-navbar>
      <!-- <u-empty style="height: 100%" mode="data" text="暂无数据" icon="/static/image/noData.png" /> -->
      <view class="content">
          <h4 class="title">{{data.articleTitle}}</h4>
          <view class="people">
            <view class="mr-30">发布人：{{type==1?data.userName:data.createUser}}</view>
            <view>{{data.sendingTime}}</view>
          </view>
        <u-parse :content="data.articleContent"></u-parse>
      </view>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    this.type=options.type
    this.data=JSON.parse(options.row)
  },
  data(){
    return{
      data:{},
      type:''
    }
  },
}
</script>

<style lang="scss" scoped>
.content{
  padding: 20rpx;
  background-color: #fff;
  padding: 20rpx;
  .title{
    text-align: center;
  }
  .people{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 40rpx;
    margin-bottom: 20rpx;
    font-size: 24rpx;
    color: #b2aaaa;
  }
}
.mr-30{
  margin-right: 30rpx;
}
</style>