<template>
  <view class="wrapper">
    <u-navbar
      leftText="成本核算"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="pdt-ios"></view>
    <view class="content">
      <view class="head">
        <view class="head-title">成本汇总合计</view>
        <view class="head-money" >{{itemData.totalAmount}} <text style="font-size: 10px; color: #000">元</text></view
        >
      </view>
      <view class="box">
        <view class="left">
          <view :style="'height'+':'+itemData.materialCostPercentage +'%'" style=";background: #2edb96"></view>
          <view :style="'height'+':'+itemData.costManagePercentage +'%'" style="background: #cf7cfc"></view>
          <view :style="'height'+':'+itemData.customCostPercentage +'%'" style="background: #ff5733"></view>
          <view :style="'height'+':'+itemData.deviceCostPercentage +'%'" style="background:  #2a82e4"></view>
        </view>
        <view class="right">
          <view class="right-item" style="">
            <view class="item-bg" style="background: #2edb96"> {{ itemData.materialCostPercentage }}% </view>
            <view class="item-right" style="">
              <view class="item-text border-bot">物资成本</view>
              <view class="item-text">自使用物资</view>
              <view class="item-money border-bot"
                >{{ itemData.ownCost }}<text class="unit">元</text></view
              >
              <view class="item-text">甲供不扣款</view>
              <view class="item-money border-bot"
                >{{ itemData.nailCost }}<text class="unit">元</text></view
              >
            </view>
          </view>
          <view class="right-item" style="">
            <view class="item-bg" style="background: #cf7cfc"> {{ itemData.costManagePercentage }}% </view>
            <view class="item-right" style="">
              <view class="item-text">管理成本</view>
              <view class="item-money border-bot"
                >{{ itemData.costManage }}<text class="unit">元</text></view
              >
            </view>
          </view>
          <view class="right-item" style="">
            <view class="item-bg" style="background: #ff5733"> {{ itemData.customCostPercentage }}% </view>
            <view class="item-right" style="">
              <view class="item-text">分包成本</view>
              <view class="item-money border-bot"
                >{{ itemData.customCost }}<text class="unit">元</text></view
              >
            </view>
          </view>
          <view class="right-item" style="">
            <view class="item-bg" style="background: #2a82e4"> {{ itemData.deviceCostPercentage }}% </view>
            <view class="item-right" style="">
              <view class="item-text border-bot">设备成本</view>
              <view class="item-text">设备租赁</view>
              <view class="item-money border-bot"
                >{{ itemData.deviceLease }}<text class="unit">元</text></view
              >
              <view class="item-text">设备购买</view>
              <view class="item-money border-bot"
                >{{ itemData.devicePurchase }}<text class="unit">元</text></view
              >
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      itemData: {
        materialCostPercentage:"",
        costManagePercentage:"",
        customCostPercentage:"",
        deviceCostPercentage:""
      },
    };
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  onLoad() {
    this.init();
  },
  methods: {
    init() {
      let data = {
        // consumeType: this.current,
        // deviceName: this.contractName,
        fkOrgId:this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId")
      };
      this.$api.businessAccountList(data).then((res) => {
        if (res.code == 200) {
          this.itemData = res.data;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.head {
  background: #fff;
  padding: 4px 20px;
  .head-title {
    background: #ff8d1a;
    color: #fff;
    display: -webkit-inline-box;
    margin: 6px;
    padding: 4px 10px;
  }
  .head-money {
    font-size: 22px;
    font-weight: 800;
    padding: 8px;
    color: #db6e00;
  }
}
.box {
  display: flex;
  margin-top: 4px;
  background: #fff;
  .left {
    width: 62px;
    height: 500px;
    margin: 25px;
    margin-right: 0;
    background: #eee;
  }
  .right {
    width: 100%;

    .right-item {
      display: flex;
      background: #fff;
      padding: 13px;
      margin: 22px;
      box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.2);
      .item-bg {
        width: 60px;
        line-height: 40px;
        border-radius: 2px;
        height: 40px;
        // background: rgba(46, 219, 150, 1);
        color: #fff;
        padding: 0px 6px;
        font-size: 13px;
      }
      .item-right {
        width: 100%;
        margin: 0px 10px;
        .item-text {
          line-height: 20px;
          font-size: 14px;
          padding: 2px;
        }
        .item-money {
          line-height: 30px;
          font-weight: 800;
          font-size: 18px;
          padding: 2px;
          .unit {
            font-size: 10px;
            color: #bbb;
          }
        }
      }
    }
  }
}
.border-bot {
  border-bottom: 1px solid #eee;
}
</style>
