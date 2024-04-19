<template>
  <view class="wrapper">
    <u-navbar
      leftText="成本汇总"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="search">
      <view class="search-datas">
        <h5 class="title">汇总周期：</h5>
        <view class="data-input">
          <view class="left" @click="openCale">{{ endTime }}</view>
          <view class="right">
            <u-icon
              name="calendar-fill"
              class="icons"
              color="#2a82e4"
              size="18"
            ></u-icon>
          </view>
        </view>
        <view style="width:20rpx;text-align:center">-</view>
        <view class="data-input disableds">{{nowData}}</view>
      </view>
      <u-tabs :list="list" :current="current" @change="currentChange" :activeStyle="{ color: 'rgba(32, 52, 87, 1)' }" :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }" > </u-tabs>
    </view>
    <view class="content">
      <view style="overflow:auto;height: 100%" v-if="current === 0">
        <view class="summary">
          <view class="summary-item">
            <view class="summary-title">上期末成本</view>
            <view class="summary-content">￥{{summaryData.lastCost}}</view>
          </view>
          <view class="summary-item">
            <view class="summary-title">本期成本</view>
            <view class="summary-content">￥{{summaryData.currentCost}}</view>
          </view>
          <view class="summary-item">
            <view class="summary-title">累计成本</view>
            <view class="summary-content">￥{{summaryData.costAmount}}</view>
          </view>
        </view>
        <view class="cart2">
        <view class="cart2-title">各单位本期成本占比</view>
        <echart :option="option" :width="702" :height="536" class="mb-10" v-if="echartShow"></echart>
         <view class="noEchart" v-else>
          <u-empty style="height: calc(100% - 32rpx)" mode="data" text="暂无数据" icon="/static/image/noSettleData.png"></u-empty>
        </view>
    </view>
      </view>
      <u-list scroll-x scroll-y @scrolltolower="scrolltolower" style="height: 100%" v-if="current === 1">
      <view class="table_detail table_empty" style="max-height: 100%"  >
        <table v-if="showList.length">
          <thead>
            <tr>
              <th><u-icon name="/static/image/tableIndex.png" style="display: inline-block"></u-icon></th>
              <th v-if="user.orgType == 11 || user.orgType == 12">建设单位</th>
              <th v-if="user.orgType == 10">下属单位</th>
              <th v-if="user.orgType == 11 || user.orgType == 12">项目</th>
              <th>标段</th>
              <th>上期末成本</th>
              <th>本期成本</th>
              <th>合同金额</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in showList" :key="index">
              <td><text  class="clickTd" @click="tdClick(item)">{{ index + 1 }}</text></td>
              <td v-if="user.orgType == 11 || user.orgType == 12">
                {{ item.orgName }}
              </td>
              <td v-if="user.orgType == 10">
                {{ item.subUnitName}}
              </td>
              <td v-if="user.orgType == 11 || user.orgType == 12">
                {{item.fkProjectName }}
              </td>
              <td>{{ item.fkBidProjectName  }}</td>
              <td>{{ item.lastCost }}</td>
              <td>{{ item.currentCost }}</td>
              <td>{{ item.costAmount }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="showList.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png" :style="{top: showList.length>6?'':'calc(100% - 400rpx)'}"></u-empty>
        <u-empty v-else style="height: 100%" mode="data" text="暂无数据" icon="/static/image/noData.png" ></u-empty>
      </view>
      </u-list>
    </view>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :endDate="nowData"/>
  </view>
</template>

<script>
import moment from "moment";
export default {
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  data() {
    return {
        nowData:"",
      endTime: "",
      list: [{ name: "数据汇总" }, { name: "列表明细" }],
      current: 0,
      total:0,
      pageNum:1,
      showList: [],
      option:{},
      summaryData:{},
      echartShow:false
    };
  },
  onLoad(options) {
    let now =moment(new Date()).format("YYYY-MM-DD")
    this.endTime = now;
    this.nowData = now
    this.searchCostPage();
    this.getSummaryAmount()
  },
  methods: {
    scrolltolower(e){
        if (this.pageNum * 20 > this.total) {
          return;
        }
        this.pageNum = this.pageNum + 1;
        this.searchCostPage();
    },
    getSummaryAmount() {
      this.$api.getSummaryAmount({ beginTime: this.endTime }).then((res) => {
        if (res.code == 200) {
            this.summaryData =res.data
            let arr = res.data.costSummaryPieVoList.map(item=>({ value: item.summaryAmount, name: item.unitName }))
            if(arr.length){
                this.option = {
                tooltip: {
                  trigger: "item",
                  formatter:"{a} <br/>{b} : {c} ({d}%)",
                },
                legend: {
                left: "center",
                top: "bottom",
              },
                toolbox: {
                  show: true,
                  feature: {
                    mark: { show: true },
                  },
                },
                series: [
                  {
                    name: "各单位本期成本占比",
                    type: "pie",
                    radius: ["20%", "40%"],
                    center: ["50%", "50%"],
                    itemStyle: {
                      borderRadius: 5,
                    },
                    label: {
                        show: true,
                        // position: "center",
                        position: 'outer',
                        alignTo: 'edge',
                        margin: 20,
                        edgeDistance: 10,
                        formatter: function(param){
                           let text = param.data.name;
                            if (text.length < 10) {
                              return text + '\n' + param.percent + '%'
                            } else {
                              return text.substring(0, 10) + '...' + '\n' + param.percent + '%'
                            }
                        },
                        margin: 20
                      },
                    emphasis: {
                      label: {
                        show: true,
                      },
                    },
                    data: arr,
                  },
                ],
                };
                this.echartShow=true
            }else{
                this.echartShow=false
            }
        } else {
          this.echartShow=false
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    searchCostPage() {
      let data = {
        pageSize: 20,
        pageNum: this.pageNum,
        beginTime: this.endTime,
      };
      this.$api.searchCostPage(data).then((res) => {
        if (res.code === 200) {
            if(data.pageNum==1){
                this.showList = res.data.records;
            }else{
                this.showList = [...this.showList,...res.data.records]
            }
            this.total=res.data.total
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    tdClick(row) {
      console.log(row);
      uni.navigateTo({ url: `/pages/costData/constDetail?beginTime=${this.endTime}&endTime=${this.nowData}&row=${JSON.stringify(row)}` })
    },
    openCale(type, date) {
      this.$refs.calendar.open();
    },
    caleConfirm(e) {
      this.endTime = e.fulldate;
      this.searchCostPage();
      this.getSummaryAmount()
    },
    currentChange(item) {
      this.current = item.index;
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  background-color: #fff;
  margin-bottom: 8rpx;
}
.search-datas {
  display: flex;
  align-items: center;
  width: 750rpx;
  height: 100rpx;
  padding: 0 20rpx;
  .search-item {
    flex: 1;
    padding: 0 10rpx;
  }

  .easySelect {
    /deep/.uni-input-wrapper {
      .uni-input-input {
        font-size: 28rpx;
      }
    }
  }
  // background-color: #fff;
  .title {
    width: 140rpx;
  }

  .to {
    margin: 0 10rpx;
  }

  .data-input {
    display: flex;
    align-items: center;
    position: relative;
    // width: 500rpx;
    flex: 1;
    height: 60rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    border: 1px solid rgba(180, 208, 240, 1);
    border-radius: 6rpx;
    .left {
      display: flex;
      align-items: center;
      // width: 450rpx;
      width: 100%;
      height: 60rpx;
    }
    .right {
      position: absolute;
      right: 20rpx;
    }
    .closeBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: 6rpx;
      width: 30rpx;
      height: 30rpx;
      background-color: #eee;
      color: #ccc;
      font-size: 16rpx;
      z-index: 5;
      border-radius: 50%;
    }
  }
  .disableds{
    background-color :#e2e2e2;
  }
  .mr-14 {
    margin-right: 14rpx;
  }
}
.content {
  height: calc(100vh - 288rpx);
  .summary {
    min-height: 500rpx;
    padding: 40rpx;
    margin-bottom: 8rpx;
    background-color: #fff;
    .summary-item {
      margin-bottom: 60rpx;
      .summary-title {
        font-size: 24rpx;
        margin-bottom: 16rpx;
      }
      .summary-content {
        font-size: 48rpx;
        font-weight: 700;
        color: #f59a23;
      }
    }
  }
  .cart2{
  width: 750rpx;
  padding: 32rpx 24rpx;
  border-radius: 4px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
  .cart2-title{
    font-size: 32rpx;
    font-weight: 700;
  }
  .noEchart{
    height: 600rpx;
    padding: 32rpx 22rpx;
  }
}
}
.table_detail{
  /*#ifdef APP-PLUS*/
	height: calc(100vh - 362rpx);
	/*#endif*/
	/*#ifdef H5*/
  height: calc(100vh - 294rpx);
	/*#endif*/
}
</style>
