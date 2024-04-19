<template>
  <view class="content wrapper">
    <u-navbar leftText="工作经历" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="bg"></view>
    <z-paging
      class="list"
      ref="paging"
      v-model="showList"
      @query="queryList"
      refresher-only
      refresher-threshold="120rpx"
    >
      <u-cell-group v-if="showList.length">
        <u-cell v-for="(item, index) in showList" :key="index" class="item">
          <view slot="title" class="title">
            <view class="item-head"
              >{{ item.inductionTime }}~{{
                item.resignationTime ? item.resignationTime : "至今"
              }}</view
            >
            <view class="item-project">施工项目：{{ item.projectName }}</view>
            <view class="item-unit">服务单位：{{ item.orgName }}</view>
            <view class="item-class">班组：{{ item.className }}</view>
            <view class="item-time">期间参加过{{ item.trainTime }}次培训</view>
          </view>
        </u-cell>
      </u-cell-group>
      <u-empty
        style="height: 100%"
        mode="data"
        icon="/static/image/noData.png"
        v-if="!showList.length"
      >
      </u-empty>
    </z-paging>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    this.getWorkExpList();
  },
  data() {
    return {
      showList: [],
    };
  },
  methods: {
    getWorkExpList() {
      this.$api
        .getWorkExpList()
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.showList = res.data;
          }
          this.$refs.paging.endRefresh();
        })
        .catch((err) => {
          this.$refs.paging.endRefresh();
        });
    },
    queryList() {
      this.getWorkExpList();
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
/deep/ .item {
  position: relative;
  width: 100%;
  margin-bottom: 20rpx;
  background-color: #fff;
  .title {
    color: #7f7f7f;
  }
  .item-head {
    margin-bottom: 20rpx;
    font-size: 32rpx;
    font-weight: 700;
  }
  .item-unit,
  .item-project {
    margin-bottom: 20rpx;
    font-size: 28rpx;
  }
  .item-class {
    font-size: 28rpx;
  }
  .item-time {
    position: absolute;
    right: 20rpx;
    bottom: 26rpx;
    font-size: 24rpx;
  }
}
.list{
  /*#ifdef APP-PLUS*/
	padding-top: 170rpx;
	/*#endif*/
	/*#ifdef H5*/
	padding-top: 100rpx;
	/*#endif*/
}
</style>
