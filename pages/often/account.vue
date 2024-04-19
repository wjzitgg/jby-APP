<template>
  <view class="wrapper">
    <u-navbar leftText="结算发放流水" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="pdt-ios"></view>
    <view class="content">
    <view class="name" ref="name">{{ obj.memberName }} </view>
    <view class="list" v-if="showList.length">
      <view class="list-item" v-for="item in showList" :key="item.id">
        <view class="item-head">
          <view class="date">{{ item.settlementTime }}</view>
          <view class="time"
            >第{{ item.settlementNumber }}次
            <text
              :class="{
                'st-red': item.settlementType === 1,
                'st-org': item.settlementType !== 1,
              }"
            >
              {{ item.settlementType === 1 ? "结算" : "发放" }}
            </text>
          </view>
        </view>
        <view class="item-period" v-if="item.settlementType === 1">
          结算周期：{{ item.beginTime + "~" + item.endTime }}
        </view>
        <view class="item-middle">
          {{ item.settlementType === 1 ? "结算" : "工资" }}金额：{{
            item.settlementAmount
          }}
        </view>
        <view class="item-bottom">
          <view class="unit"
            >{{ item.settlementType === 1 ? "结算" : "发放" }}单位：{{
              item.orgName
            }}</view
          >
        </view>
        <view class="state" :class="{ 'st-green': item.confirmStatus === 1 }">
          {{ item.confirmStatus === 1 ? "已确认" : "待确认" }}
        </view>
      </view>
    </view>
    <u-empty
      style="height: 100%"
      mode="data"
      icon="/static/image/noData.png"
      v-if="!showList.length"
    >
    </u-empty>
    </view>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    console.log(options);
    this.obj = JSON.parse(options.obj);
    this.getSettlementInfo();
  },
  data() {
    return {
      obj: {},
      showList: [
        // {
        //   id: 1,
        //   date: "2021-12-10",
        //   money: "10000",
        //   unit: "广东路桥施工承包队",
        //   time: 1,
        //   know: 0,
        //   settlementType: 1,
        //   class: "路基班组",
        //   principal: "张三",
        //   projectId: 1,
        // },
        // {
        //   id: 2,
        //   date: "2022-3-10",
        //   beginDate: "2022-04-01",
        //   endDate: "2022-04-30",
        //   money: "10000",
        //   unit: "广东路桥施工承包队",
        //   time: 2,
        //   know: 1,
        //   settlementType: 2,
        //   class: "路基班组",
        //   principal: "张三",
        //   projectId: 2,
        // },
        // {
        //   id: 3,
        //   date: "2022-6-10",
        //   money: "10000",
        //   unit: "广东路桥施工承包队",
        //   time: 3,
        //   know: 1,
        //   settlementType: 1,
        //   class: "路基班组",
        //   principal: "张三",
        //   projectId: 3,
        // },
        // {
        //   id: 6,
        //   date: "2022-6-10",
        //   money: "10000",
        //   unit: "广东路桥施工承包队",
        //   time: 3,
        //   know: 1,
        //   settlementType: 1,
        //   class: "路基班组",
        //   principal: "张三",
        //   projectId: 3,
        // },
        // {
        //   id: 4,
        //   date: "2022-6-10",
        //   money: "10000",
        //   unit: "广东路桥施工承包队",
        //   time: 3,
        //   know: 1,
        //   settlementType: 1,
        //   class: "路基班组",
        //   principal: "张三",
        //   projectId: 3,
        // },
        // {
        //   id: 5,
        //   date: "2022-6-10",
        //   money: "10000",
        //   unit: "广东路桥施工承包队",
        //   time: 3,
        //   know: 1,
        //   settlementType: 1,
        //   class: "路基班组",
        //   principal: "张三",
        //   projectId: 3,
        // },
      ],
    };
  },
  methods: {
    // 获取结算和发放信息
    getSettlementInfo() {
      this.$api
        .getSettlementInfotwo({ fkUserId: this.obj.fkUserId })
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.showList = res.data ? res.data : [];
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.name {
  position: fixed;
  width: 100%;
  /*#ifdef APP-PLUS*/
	top: 156rpx;
	/*#endif*/
	/*#ifdef H5*/
	top: 88rpx;
	/*#endif*/
  left: 50%;
  transform: translateX(-50%);
  padding-top: 14rpx;
  z-index: 2;
  text-align: center;
  background-color: #f2f2f2;
}
.list {
  padding-top: 32rpx;
  .list-item {
    position: relative;
    width: 100%;
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-bottom: 1px solid #d6d7d97d;
    .item-head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;
      .date {
        font-size: 34rpx;
        font-weight: 700;
      }
      .time {
        font-size: 28rpx;
      }
    }
    .item-middle,
    .item-period {
      margin-bottom: 20rpx;
      font-size: 28rpx;
    }
    .item-bottom {
      color: #7f7f7f;
      font-size: 24rpx;
    }
    .state {
      position: absolute;
      right: 30rpx;
      bottom: 20rpx;
      font-size: 28rpx;
    }
    .st-green {
      color: #70b603;
    }
    .st-red {
      color: #f59a23;
    }
    .st-org {
      color: #ec808d;
    }
  }
}
</style>
