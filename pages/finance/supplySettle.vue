<!-- 供应商结算 -->
<template>
    <view class="wrapper">
      <u-navbar leftText="供应商结算" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
      <view class="pdt"></view>
      <view class="content">
        <view class="search">
          <view class="left">
            <view class="search-item">
              <view class="time-box" @click="timeShow = true" style="">
                <text style="padding-left: 4px">{{ endTime }}</text>
                <!-- <u-icon v-if="endTime.length == 0" class="ico" color="#2a82e4" name="calendar-fill"></u-icon>
                <u-icon v-else class="ico" color="#2a82e4" name="trash" @click.native.stop="cleanDate"></u-icon> -->
                <u-icon class="ico" color="#2a82e4" name="arrow-down-fill"></u-icon>
              </view>
              <!-- <u-datetime-picker :show="timeShow" v-model="value1" mode="date" @cancel="timeClose"
                @confirm="confirm"></u-datetime-picker> -->
                <u-picker
              :show="timeShow"
              :columns="informant"
              keyName="customName"
              @cancel="timeClose"
              @confirm="confirm"
            ></u-picker>
            </view>
          </view>
          <!-- <view class="right">
            <view class="search-input"><u-input border="none" placeholder="请输入供应商名称" v-model="userName" maxlength="50">
                <template slot="suffix">
                  <u-icon color="#2a82e4" name="search" @click="init"></u-icon>
                </template> </u-input></view>
          </view> -->
        </view>
        <view style="margin-top: 2px;">
          <u-list class="u-list" @scrolltolower="scrolltolower">
            <view class="table_detail table_empty u-list">
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px">
                      <u-icon name="list" style="display: inline-block"></u-icon>
                    </th>
                    <th>供应商</th>
                    <th>累计供应金额</th>
                    <th>已结算金额</th>
                    <th>当前结余金额</th>
                    <!-- <th>支付日期</th>
                    <th>累计结算金额</th>
                    <th>上期末累计付款</th>
                    <th>当前应付金额</th>
                    <th>本期付款</th>
                    <th>本期末累计付款</th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in dataList" :key="index">
                    <td><text  @click="compile(item)" class="clickTd">{{ index + 1 }}</text></td>
                    <td>{{ item.customName }}</td>
                    <td>{{ item.supplyAmountTotal }}</td>
                    <td>{{ item.settleAmount }}</td>
                    <td>{{ item.residueAmount }}</td>
                    <!-- <td>{{ item.payTime }}</td>
                    <td>{{ item.totalSettlementAmount }}</td>
                    <td>{{ item.payBalanceFront }}</td>
                    <td>{{ item.totalUnpaidAmount }}</td>
                    <td>{{ item.payAmount }}</td>
                    <td>{{ item.payBalanceAfter }}</td> -->
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td>合计</td>
                    <td></td>
                    <td>{{supplyAmountTotal}}</td>
                    <td>{{settleAmount}}</td>
                    <td>{{residueAmount}}</td>
                    <!-- <td></td>
                    <td>{{totalSettlementAmount}}</td>
                    <td>{{payBalanceFront}}</td>
                    <td>{{totalUnpaidAmount }}</td>
                    <td>{{payAmount }}</td>
                    <td>{{payBalanceAfter }}</td> -->
                  </tr>
                </tfoot>
              </table>
              <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
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
        endTime: "",
        pageNum: 1,
        total: "",
        userName: "",
        dataList: [],
        totalSettlementAmount:0,//累计结算金额合计
        payBalanceFront:0,//上期末累计付款合计
        totalUnpaidAmount:0,//当前应付金额合计
        payAmount:0,//本期付款合计
        payBalanceAfter:0,//本期末累计付款合计
        informant:[],
        customId:"",
        supplyAmountTotal:0,
        settleAmount:0,
        residueAmount:0
      };
    },
    computed: {
      user() {
        return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
      },
    },
    onLoad() {
      this.searchPage();
      this.getClient();
    },
    methods: {
      getClient() {
      this.$api.getClient({ customType: 3 }).then((res) => {
        if (res.code == 200) {
          this.endTime = "全部";
          this.customId = "";
          res.data.unshift({ customName: "全部", pKId: "" });
          this.informant = [res.data];
        }
      });
    },
      scrolltolower() {
        if (this.pageNum * 20 > this.total) {
          return;
        }
        this.pageNum = this.pageNum + 1;
        this.searchPage()
			},
      cleanDate(){
        this.endTime =""
      },
      confirm(e) {
        // console.log(e);
        // this.endTime = moment(e.value).format("YYYY-MM-DD");
        // console.log(this.value1);
        // this.timeShow = false;
        // console.log(e.value[0]);
      this.endTime = e.value[0].customName;
      this.customId = e.value[0].pkId;
      // this.endTime = moment(e.value).format("YYYY-MM-DD");
      // console.log(this.value1);
      this.timeShow = false;
      this.pageNum =1;
      this.searchPage();
      },
      timeClose() {
        this.timeShow = false;
      },
      init() {
        this.searchPage();
      },
      searchPage() {
        let data = {
          pageNum: this.pageNum,
          pageSize: 20,
          // customType: 3,
          // endTime: this.endTime,
          projectBidId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
          customId: this.customId,
          // userName
        };
        this.$api.summaryStandSearch(data).then((res) => {
          if (res.code == 200) {
            this.dataList = res.data.records;
            this.total = res.data.total;
            this.supplyAmountTotal = res.data.supplyAmount
            this.settleAmount = res.data.settleAmount
            this.residueAmount = res.data.residueAmount
            // this.totalSettlementAmount=res.data.totalSettlementAmount
            // this.payBalanceFront=res.data.payBalanceFront
            // this.totalUnpaidAmount=res.data.totalUnpaidAmount
            // this.payAmount=res.data.payAmount
            // this.payBalanceAfter=res.data.payBalanceAfter
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
      },
  
  
  
      compile(row) {
        let data = row;
        data.type = 2;
        uni.navigateTo({
          url: "/pages/finance/supplySettleEdit?row=" + JSON.stringify(data),
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
        // width: 280rpx;
        width: 560rpx;
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
    overflow: hidden;
    /*超出部分隐藏*/
    white-space: nowrap;
    /*禁⽌换⾏*/
    text-overflow: ellipsis;
    /*省略号*/
  }
  
  .u-list {
    height: calc(100vh - 200rpx) !important;
  }
  .pdt{
    height: 14rpx;
  }
  </style>
  