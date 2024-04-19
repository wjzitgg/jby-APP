<!-- 分包商结算 -->
<template>
  <view style="height:100%">
    <view class="content">
      <view style="margin-top: 2px;">
        <u-list class="u-list" @scrolltolower="scrolltolower" >
        <view class="table_detail table_empty">
          <table v-if="dataList.length">
            <thead>
                  <tr>
                    <th>期次名称</th>
                    <th>支付日期</th>
                    <th>累计结算金额</th>
                    <th>上期末累计付款</th>
                    <th>当前应付金额</th>
                    <th>本期付款</th>
                    <th>本期末累计付款</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in dataList" :key="index">
                    <td>{{ item.stageName }}</td>
                    <td>{{ item.payTime }}</td>
                    <td>{{ item.totalSettlementAmount }}</td>
                    <td>{{ item.payBalanceFront }}</td>
                    <td>{{ item.totalUnpaidAmount }}</td>
                    <td>{{ item.payAmount }}</td>
                    <td>{{ item.payBalanceAfter }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td>合计</td>
                    <td></td>
                    <td>{{totalSettlementAmount}}</td>
                    <td>{{payBalanceFront}}</td>
                    <td>{{totalUnpaidAmount }}</td>
                    <td>{{payAmount }}</td>
                    <td>{{payBalanceAfter }}</td>
                  </tr>
                </tfoot>
          </table>
          <u-empty v-if="dataList.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png" :style="{top: dataList.length>6?'':'calc(100% - 400rpx)'}"></u-empty>
          <u-empty v-else style="height: 100%" mode="data" text="暂无数据" icon="/static/image/noData.png" ></u-empty>
        </view>
        </u-list>
      </view>
    </view>
  </view>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      timeShow: false,
      value1: Number(new Date()),
      // endTime: "",
      pageNum: 1,
      total: "",
      userName: "",
      dataList: [],
      totalSettlementAmount:0,
      payBalanceFront:0,
      totalUnpaidAmount:0,
      payAmount:0,
      payBalanceAfter:0,
    };
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  props:{
    fkOrgId:"",
    beginTime:"",
    endTime:"",
    bidProjectId:""
  },
  mounted() {
    this.searchPage();
  },
  methods: {
    cleanDate(){
      this.endTime =""
    },
    confirm(e) {
      console.log(e);
      this.endTime = moment(e.value).format("YYYY-MM-DD");
      console.log(this.value1);
      this.timeShow = false;
    },
    timeClose() {
      this.timeShow = false;
    },
    scrollTolower() {
      return console.log("11111111111111")
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
    },
    init() {
      this.searchPage();
    },
    searchPage() {
      let data = {
        pageNum: this.pageNum,
        pageSize: 20,
        customType: 4,
        beginTime:this.beginTime,
        bidProjectId:this.bidProjectId,
      };
      this.$api.financeSearchPage(data).then((res) => {
        if (res.code == 200) {
          // this.dataList = this.dataList.concat(res.data.records);
          this.dataList = res.data.records
          this.totalSettlementAmount=res.data.totalSettlementAmount
          this.payBalanceFront=res.data.payBalanceFront
          this.totalUnpaidAmount=res.data.totalUnpaidAmount
          this.payAmount=res.data.payAmount
          this.payBalanceAfter=res.data.payBalanceAfter
          this.total = res.data.total;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },


   
    compile(row) {
      let data = row;
      data.type = 2;
      uni.navigateTo({
        url: "/pages/finance/subSettleEdit?row=" + JSON.stringify(data),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  //   position: fixed;
  //   /* #ifdef H5 */
  //   top: 176rpx;
  //   /* #endif */
  //   /* #ifdef APP-PLUS */
  //   top: 240rpx;
  //   /* #endif */
  //   //   top: 176rpx;
  display: flex;
  align-items: center;
  width: 100%;
  height: 80rpx;
  padding: 0 8rpx;
  background-color: #fff;
  .right {
    display: flex;
    width: 530rpx;
    height: 60rpx;
    border: 1px solid rgba(180, 208, 240, 1);
    border-radius: 10rpx;
    .search-input {
      display: flex;
      align-items: center;
      flex: 1;
      height: 60rpx;
    }
    .searchBtn {
      width: 120rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 26rpx;
      text-align: center;
      color: #2a82e4;
    }
    .separator {
      line-height: 54rpx;
      color: rgba(180, 208, 240, 1);
    }
  }
  .left {
    // margin-left: 20rpx;
    .screen {
      width: 140rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 26rpx;
      text-align: center;
      color: #2a82e4;
      border: 1px solid rgba(180, 208, 240, 1);
      border-radius: 10rpx;
    }
  }
}
.search {
  display: flex;
  align-items: center;
  height: 80rpx;
  .search-item {
    flex: 1;
    padding: 0 10rpx;
    .time-box {
      width: 280rpx;
      line-height: 60rpx;
      border-radius: 8rpx;
      height: 60rpx;
      border: 1px solid #b4d0f0;
      position: relative;
      .ico {
        position: absolute;
        right: 8rpx;
        top: 10rpx;
      }
    }
  }
  .easySelect {
    /deep/.uni-input-wrapper {
      .uni-input-input {
        font-size: 28rpx;
      }
    }
  }
}
.text-hidden {
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁⽌换⾏*/
  text-overflow: ellipsis; /*省略号*/
}

// .u-list {
//   max-height: calc(100vh - 240px) !important;
// }
// /deep/ .u-list[data-v-525c718d]{
//   max-height: none;
// }
.u-list {
  max-height: calc(100vh - 180rpx) !important;
}
.pdt{
  height: 14rpx;
}
.table_detail{
  height: calc(100vh - 180rpx);
}
</style>
