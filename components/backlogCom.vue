<template>
  <view>
    <view v-if="finishType === 1" class="item" @click="itemClick">
      <view class="title mb-20">
        <view>{{ data.name }}</view>
        <view class="red">未处理</view>
      </view>
      <view class="date">待办时间：{{ data.date }}</view>
    </view>
    <view v-if="finishType === 2" class="item" @click="itemClick">
      <view class="title mb-20">
        <view>{{ data.name }}</view>
        <view class="green">已通过</view>
      </view>
      <view class="date mb-20">待办时间：{{ data.date }}</view>
      <view class="date mb-20">处理时间：{{ data.date }}</view>
      <view class="opinion mb-20">处理意见：</view>
      <view class="content bg1">{{ data.date }}</view>
    </view>
    <view v-if="finishType === 3" class="item" @click="itemClick">
      <view class="title mb-20">
        <view>{{ data.name }}</view>
        <view class="grey">未通过</view>
      </view>
      <view class="date mb-20">待办时间：{{ data.date }}</view>
      <view class="date mb-20">处理时间：{{ data.date }}</view>
      <view class="opinion mb-20">处理意见：{{ data.date }}</view>
      <view class="content bg2">{{ data.date }}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 1为未处理，2为已通过，3为未通过
    finishType: {
      type: Number,
      default: 1,
    },
    data: {},
  },
  methods: {
    itemClick() {
      console.log(this.data);
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  // width: 100%;
  padding: 30rpx;
  //   margin-bottom: 10rpx;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  .title {
    // width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .date {
    font-size: 24rpx;
    color: #a6aebc;
  }
  .opinion {
    font-size: 24rpx;
    color: #a6aebc;
  }
  .content {
    height: 50rpx;
    line-height: 50rpx;
    font-size: 24rpx;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*禁⽌换⾏*/
    text-overflow: ellipsis; /*省略号*/
  }
  .bg1 {
    background-color: #fff6eb;
  }
  .bg2 {
    background-color: #ffebeb;
  }
  .mb-20 {
    margin-bottom: 20rpx;
  }
}
.red {
  color: red;
}
.green {
  color: rgba(67, 207, 124, 1);
}
.grey {
  color: rgba(170, 170, 170, 1);
}
</style>
