<template>
  <view class="content wrapper">
    <u-navbar leftText="劳务合同" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="bg"></view>
    <calendar
      class="calendar"
      @getDate="getDate"
      @getMonth="getMonth"
    ></calendar>
    <z-paging
      class="list"
      ref="paging"
      v-model="showList"
      @query="queryList"
      refresher-only
      refresher-threshold="120rpx"
    >
      <u-cell-group v-if="showList.length">
        <u-cell
          v-for="(item, index) in showList"
          :key="index"
          class="item"
          @click="go(item)"
        >
          <view slot="title" class="title">
            <view class="item-head">{{ item.title }}</view>
            <view class="item-date">时间：{{ item.trainingTime }}</view>
            <view class="item-class">地址：{{ item.detailAddress }}</view>
            <view class="item-speaker">主讲人：{{ item.speaker }}</view>
          </view>
        </u-cell>
      </u-cell-group>
      <u-empty
        style="height: 100%"
        mode="data"
        icon="/static/image/noData.png"
        v-if="!showList.length"
        text="暂无已办事项"
      >
      </u-empty>
    </z-paging>
  </view>
</template>

<script>
import calendar from "../../components/calendar.vue";
export default {
  components: { calendar },
  onLoad(options) {
    let time =
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1 > 10
        ? new Date().getMonth() + 1
        : "0" + (new Date().getMonth() + 1));
    this.getWait(time);
    this.date = time;
  },
  data() {
    return {
      list: [],
      showList: [],
      currentDate: "",
      date: "",
    };
  },
  methods: {
    getWait(date) {
      this.$api
        .getWait({ date })
        .then((res) => {
          this.$refs.paging.endRefresh();
          console.log(res);
          if (res.code === 200) {
            this.list = res.data
              ? res.data.filter((item) => item.handelStatus)
              : [];
            this.showList = this.list.filter(
              (item) => item.trainingTime === this.currentDate
            );
          }
        })
        .catch((err) => {
          this.$refs.paging.endRefresh();
        });
    },
    // 跳转到详情页
    go(item) {
      uni.navigateTo({
        url: `/pages/often/trainDetail?obj=${JSON.stringify(item)}`,
      });
    },
    getDate(date) {
      this.currentDate = date;
      //   假数据
      this.showList = this.list.filter((item) => item.trainingTime === date);
    },
    getMonth(date) {
      this.date = date;
      this.getWait(date);
    },
    queryList() {
      this.getWait(this.date);
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-color: #f2f2f2;
}
* {
  box-sizing: border-box;
}
.main {
  width: 100%;
  height: 100%;
  margin-top: 40rpx;
}
/deep/ .item {
  width: 100%;
  margin-bottom: 20rpx;
  background-color: #fff;
  .title {
    color: #7f7f7f;
    font-size: 28rpx;
  }
  .item-head {
    position: relative;
    color: #000;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    // &::before {
    //   content: "!";
    //   position: absolute;
    //   left: -16rpx;
    //   color: red;
    //   font-size: 30rpx;
    // }
  }
  .item-date,
  .item-class {
    margin-bottom: 20rpx;
  }
}
.search {
  display: flex;
  padding: 20rpx;
}
.uni-input {
  display: flex;
  width: 270rpx;
  padding: 10rpx;
  margin-right: 10rpx;
  background-color: #fff;
  border: 1rpx solid #dadbde;

  image {
    width: 32rpx;
    margin-left: 10rpx;
  }
}
.input {
  background-color: #fff;
  height: 54rpx;
}
.list {
  padding-top: 400rpx;
}
.calendar {
  position: fixed;
  width: 100%;
  /*#ifdef APP-PLUS*/
	top: 156rpx;
	/*#endif*/
	/*#ifdef H5*/
	top: 88rpx;
	/*#endif*/
  z-index: 5;
}
</style>
