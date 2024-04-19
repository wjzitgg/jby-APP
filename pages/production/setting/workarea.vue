<!-- 工区管理 -->
<template>
  <view class="wrapper">
    <u-navbar leftText="工区管理" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="content">
      <view v-if="status" style="display: flex;flex: 1;">
        <view class="left">
          <view :class="index == current ? 'pitch-on' : ''" class="item" v-for="(item, index) in details" :key="index"
            @click="itemClick(index)">{{ item.areaName }}</view>
        </view>
        <view class="right">
          <view class="item overhidden" v-for="(item, index) in list" :key="index">{{ item.itemName }}</view>
        </view>
      </view>
      <view v-else style="" class="not-enabled">
        未启用工区
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      rowData: {},
      details: [],
      current: 0,
      list: [],
      status: true
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);

    this.$api.findWorkAreaStats( uni.getStorageSync("nowOrgId")).then(res => {
      if (res.code == 200) {
        this.status = res.data
        if (res.data) {
    this.init()

        }
      } else {
        uni.showToast({ icon: "none", title: res.msg });
      }
    })

  },
  methods: {
    init() {
      let data = {}
      if (this.rowData.orgType != 5) {
        data.fkOrgId =  uni.getStorageSync("nowOrgId")
      }
      this.$api
        .searchWorkArea(data)
        .then((res) => {
          if (res.code == 200) {
            this.details = res.data;
            this.list = res.data[0].itemNameList
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
    },
    itemClick(idx) {
      this.current = idx
      this.list = this.details[idx].itemNameList
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;

  .left {
    width: 160rpx;
    // padding: 2px;
    overflow: auto;
    // height: 100vh;
    /*#ifdef APP-PLUS*/
	  height: calc(100vh - 156rpx);
	  /*#endif*/
	  /*#ifdef H5*/
    height: calc(100vh - 88rpx);
	  /*#endif*/
    border-top: 1px solid #eeeeee;

    background-color: #fafafa;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80rpx;
      // line-height: 40px;
      text-align: center;
      /* background: #ccc; */
      border-bottom: 1px solid #eee;
    }
  }

  .right {
    // flex: 1;
    overflow: auto;
    width: 590rpx;
    word-break: break-all;
    /*#ifdef APP-PLUS*/
	  max-height: calc(100vh - 156rpx);
	  /*#endif*/
	  /*#ifdef H5*/
    	max-height: calc(100vh - 88rpx);
	  /*#endif*/
    padding-bottom: 180px;
    background: #fff;
    border-top: 1px solid #eeeeee;
    border-left: 1px solid #eeeeee;

    .item {
      line-height: 80rpx;
      padding-left: 4px;
      // line-height: 1.2;
      // line-height: 40px;
      border-bottom: 1px solid #eee;
    }
  }

  .pitch-on {
    border-bottom-color: #2a82e4 !important;
    background: linear-gradient(to right, #e6ebff, #ffffff);

    // background: linear-gradient(to bottom, red, green 20%, orange 80%, blue);
  }
}
.overhidden{
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*禁⽌换⾏*/
    text-overflow: ellipsis; /*省略号*/
}
.not-enabled {
  background-color: #fff;
  height: 100%;
  margin: 0 auto;
  margin-top: 50%;
  font-weight: 800;
  font-size: 20px;
}</style>
