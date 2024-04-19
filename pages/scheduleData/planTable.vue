<template>
  <view class="wrapper">
    <u-navbar :leftText="planName + '计划'" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true" ></u-navbar>
    <view class="search">
      <view class="search-item">
        <view class="search-item-item">
            <easy-select
            ref="easySelect"
            size="mini"
            class="easySelect"
            :value="nowYear"
            @selectOne="selectOne"
            :options="yearList"
          ></easy-select>
        </view>
        <view class="search-item-item" v-if="planType==1">
            <easy-select
            ref="easySelect"
            size="mini"
            class="easySelect"
            :value="nowQuarter"
            @selectOne="selectOne2"
            :options="quarterList"
          ></easy-select>
        </view>
        <view class="search-item-item" v-if="planType==2">
            <easy-select
            ref="easySelect"
            size="mini"
            class="easySelect"
            :value="nowMonth"
            @selectOne="selectOne3"
            :options="monthList"
          ></easy-select>
        </view>
      </view>
      <u-tabs :list="list" :current="current" @change="currentChange" :activeStyle="{ color: 'rgba(32, 52, 87, 1)' }" :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }" > </u-tabs>
    </view>
    <view class="content">
      <view style="overflow:auto;height: 100%" v-if="current === 0">
        <view class="summary">
          <view class="summary-item">
            <view class="summary-title">上{{ planName }}计划产值</view>
            <view class="summary-content">￥{{summaryData.upperAmount}}</view>
          </view>
          <view class="summary-item">
            <view class="summary-title">本{{ planName }}计划产值</view>
            <view class="summary-content">￥{{summaryData.nowAmount}}</view>
          </view>
          <view class="summary-item">
            <view class="summary-title">累计计划产值</view>
            <view class="summary-content">￥{{summaryData.amount}}</view>
          </view>
        </view>
        <view class="cart2">
        <view class="cart2-title">各单位{{ planName }}计划产值占比</view>
        <echart :option="option" :width="702" :height="536" class="mb-10" v-if="echartShow"></echart>
         <view class="noEchart" v-else>
          <u-empty style="height: calc(100% - 32rpx)" mode="data" text="暂无数据" icon="/static/image/noSettleData.png"></u-empty>
        </view>
    </view>
      </view>
      <u-list scroll-x scroll-y @scrolltolower="scrolltolower" style="height: 100%" v-if="current === 1">
      <view class="table_detail table_empty" style="height: calc(100vh - 288rpx)"  >
        <table v-if="showList.length">
          <thead>
            <tr>
              <th><u-icon name="/static/image/tableIndex.png" style="display: inline-block"></u-icon></th>
              <th v-if="user.orgType == 11">建设单位</th>
              <th v-if="[10, 12].includes(user.orgType)">下属单位</th>
              <th v-if="user.orgType == 2">项目</th>
              <th>标段</th>
              <th>{{'上' + planName + '末计划产值'}}</th>
              <th>{{'本' + planName + '计划产值'}}</th>
              <th>累计计划产值</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in showList" :key="index">
              <td><text class="clickTd" @click="tdClick(item)">{{ index + 1 }}</text></td>
              <td v-if="user.orgType == 11">
                {{ item.orgName}}
              </td>
              <td v-if="[10, 12].includes(user.orgType)">
                {{  item.orgName }}
              </td>
              <td v-if="user.orgType == 2">
                {{ item.fkProjectName }}
              </td>
              <td>{{ item.fkBidProjectName }}</td>
              <td>{{ item.upperAmount }}</td>
              <td>{{ item.nowAmount }}</td>
              <td>{{ item.amount }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="showList.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png" ></u-empty>
        <u-empty v-else style="height: 100%" mode="data" text="暂无数据" icon="/static/image/noData.png" ></u-empty>
      </view>
      </u-list>
    </view>
  </view>
</template>

<script>
export default {
props:{
    planType:{
        type:Number,
        default:0
    },
},
computed:{
    planName(){
        return this.planType===0?'年度':this.planType===1?'季度':this.planType===2?'月度':''
    },
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
},
data() {
    return {
      list: [{ name: "进度汇总" }, { name: "列表明细" }],
      current: 0,
      pageNum:1,
      showList: [],
      option:{},
      summaryData:{},
      echartShow:false,
      searchData:{
        planYear:"",
        planQuarter:"",
        planMonth:""
      },
      nowYear:"",
      yearList:[],
      nowQuarter:"",
      quarterList: [
        { value: 1, label: "第一季度" },
        { value: 2, label: "第二季度" },
        { value: 3, label: "第三季度" },
        { value: 4, label: "第四季度" },
      ],
      nowMonth:"",
      monthList: [
        { value: 1, label: "一月" },
        { value: 2, label: "二月" },
        { value: 3, label: "三月" },
        { value: 4, label: "四月" },
        { value: 5, label: "五月" },
        { value: 6, label: "六月" },
        { value: 7, label: "七月" },
        { value: 8, label: "八月" },
        { value: 9, label: "九月" },
        { value: 10, label: "十月" },
        { value: 11, label: "十一月" },
        { value: 12, label: "十二月" },
      ],
    };
  },
  mounted() {
    let nowYear = new Date().getFullYear();
    this.nowYear = nowYear + "年";
    let nowMonth = new Date().getMonth() + 1;
    this.searchData.planYear = nowYear;
    let arr = [];
    for (let index = nowYear - 5; index < nowYear + 5; index++) {
      arr.push({ label: index + "年", value: index });
    }
    this.yearList = arr.reverse();
    if(this.planType==1){
        if ([1, 2, 3].includes(nowMonth)) {
          this.nowQuarter = "第一季度";
          this.searchData.planQuarter = 1;
        } else if ([4, 5, 6].includes(nowMonth)) {
          this.nowQuarter = "第二季度";
          this.searchData.planQuarter = 2;
        } else if ([7, 8, 9].includes(nowMonth)) {
          this.nowQuarter = "第三季度";
          this.searchData.planQuarter = 3;
        } else if ([10, 11, 12].includes(nowMonth)) {
          this.nowQuarter = "第四季度";
          this.searchData.planQuarter = 4;
        }
    }else if(this.planType==2){
        this.nowMonth = this.monthList.filter(
          (item) => item.value === nowMonth
        )[0].label;
        this.searchData.planMonth = nowMonth;
    }
    this.getList()
  },
methods: {
    scrolltolower(e){
        if (this.pageNum * 20 > this.total) {
          return;
        }
        this.pageNum = this.pageNum + 1;
        this.searchPlanPage();
    },
    selectOne(e){
        this.pageNum = 1
        this.nowYear = e.options.label;
        this.searchData.planYear = e.options.value;
        this.getList()
    },
    selectOne2(e){
        this.pageNum = 1
        this.nowQuarter = e.options.label;
        this.searchData.planQuarter = e.options.value;
        this.getList()
    },
    selectOne3(e){
        this.pageNum = 1
        this.nowMonth = e.options.label;
        this.searchData.planMonth = e.options.value;
        this.getList()
    },
    getList(){
        this.planPie()
        this.searchPlanPage()
    },
    planPie() {
      this.$api.planPie({ planType:this.planType, ...this.searchData }).then((res) => {
        if (res.code == 200) {
            this.summaryData =res.data
            let arr = res.data.planPieListVos.map(item=>({ value: item.nowAmount, name: item.name }))
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
                    name: `各单位${this.planName}计划产值占比`,
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
    searchPlanPage() {
      let data = {
        pageSize: 20,
        pageNum: this.pageNum,
        planType:this.planType,
        ...this.searchData
      };
      this.$api.searchPlanPage(data).then((res) => {
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
      uni.navigateTo({ url: `/pages/scheduleData/planTable2?fkOrgId=${row.fkOrgId}&planType=${this.planType}&fkProjectId=${row.pkId}&planYear=${this.searchData.planYear}&planQuarter=${this.searchData.planQuarter}&planMonth=${this.searchData.planMonth}` })
    },
    currentChange(item) {
      this.current = item.index;
    },
  },
}
</script>

<style lang="scss" scoped>
.search {
  background-color: #fff;
  margin-bottom: 8rpx;
}
.search-item{
    display: flex;
    align-items: center;
    margin: 10rpx 0;
    .search-item-item{
        flex:1;
        padding: 0 20rpx;
    }
}
.search-datas {
  display: flex;
  align-items: center;
  width: 750rpx;
  height: 100rpx;
  padding: 0 20rpx;
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
  .mr-14 {
    margin-right: 14rpx;
  }
}
.content {
  height: calc(100vh - 288rpx);
  .summary {
    height: 500rpx;
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
</style>