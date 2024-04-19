<template>
  <view class="wrapper">
    <u-navbar
      leftText="成本汇总"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="pdt-ios"></view>
      <view class="search">
      
        <u-tabs
          class="tabList"
          :list="tabList"
          :current="current"
          @change="currentChange"
          :scrollable="false"
          :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
        ></u-tabs>
        <view class="search-datas" v-if="current!==2">
          <h5 class="title">汇总日期：</h5>
          <picker mode="date" :value="year" fields='year' @change="bindDateChange">
				      <view class="data-input"> {{year +'年'}} </view>
			    </picker>
        </view>
      </view>
    <view class="content">
      <view class="table_detail table_empty" :class="{'table_height2':current===2,'table_height':current!==2}">
        <!-- v-if="list.length" -->
      <table >
        <thead>
          <tr>
            <th v-if="current===0">月份</th>
            <th v-if="current===1">季度</th>
            <th v-if="current===2">年份</th>
            <th>分包成本</th>
            <th>物资成本</th>
            <th>设备成本</th>
            <th>管理成本</th>
            <th>合计</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list" :key="index">
            <td v-if="current===0">{{  item.monthly + "月" }}</td>
            <td v-if="current===1">{{ "第" + item.quarter + "季度" }}</td>
            <td v-if="current===2">{{ item.year + "年"}}</td>
            <td>{{ item.customCost }}</td>
            <td>{{ item.materialCost }}</td>
            <td>{{ item.deviceCost }}</td>
            <td>{{ item.costManage }} </td>
            <td>{{ item.totalAmount }} </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>合计</td>
            <td>￥{{totalData.customCost?totalData.customCost:0}}</td>
            <td>￥{{totalData.materialCost?totalData.materialCost:0}}</td>
            <td>￥{{totalData.deviceCost?totalData.deviceCost:0}}</td>
            <td>￥{{totalData.costManage?totalData.costManage:0}}</td>
            <td>￥{{totalData.totalAmount?totalData.totalAmount:0}}</td>
          </tr>
        </tfoot>
      </table>
      <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      <!-- <u-empty
        v-else
        style="height: 100%"
        mode="data"
        text="暂无数据"
        icon="/static/image/noData.png"
      ></u-empty> -->
    </view>
    </view>
  </view>
</template>

<script>
export default {
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
data(){
  return{
      tabList: [{ name: "月度汇总" },{ name: "季度汇总" }, { name: "年度汇总" }],
      current: 0,
      clickDate:"",
      year:'',
      list:[],
      totalData:{}
  }
},
onLoad(options) {
  this.year=new Date().getFullYear()
  this.actualCostAccountList()
},
methods:{
  actualCostAccountList(){
    let data={
      type:this.current,
      fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
      year:this.year
    }
    this.$api.actualCostAccountList(data).then((res) => {
      uni.hideLoading()
        if(res.code===200){
          if (this.current === 0) {
              this.list = res.data.monthlySummary.filter(item => item.monthly !== 13);
              this.totalData = res.data.monthlySummary.filter(item => item.monthly === 13)[0];
            } else if (this.current === 1) {
              this.list = res.data.quarterSummary.filter(item => item.quarter !== 5);
              this.totalData = res.data.quarterSummary.filter(item => item.quarter === 5)[0];
            } else if (this.current === 2) {
              this.list = res.data.yearSummary.filter(item => item.year !== 0);
              this.totalData = res.data.yearSummary.filter(item => item.year === 0)[0];
            }
        }else{
          uni.showToast({ title: res.msg, icon: 'none' })
        }
      }).catch((err) => {
        uni.hideLoading()
      });
  },
  currentChange(e) {
      this.current = e.index;
      if(e.index!==2){
        this.year=new Date().getFullYear()
      }else{
        this.year=''
      }
      this.list =[]
      this.actualCostAccountList()
    },
    bindDateChange(e){
        this.year=e.detail.value
        this.actualCostAccountList()
    },
}
}
</script>

<style lang="scss" scoped>
.table_height {
  /*#ifdef APP-PLUS*/
  max-height: calc(100vh - 354rpx);
  /*#endif*/
  /*#ifdef H5*/
  max-height: calc(100vh - 266rpx);
  /*#endif*/
}
.table_height2 {
  /*#ifdef APP-PLUS*/
  height: calc(100vh - 274rpx);
  /*#endif*/
  /*#ifdef H5*/
  height: calc(100vh - 186rpx);
  /*#endif*/
}
.search{
  background-color: #fff;
}
.search-datas {
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 10rpx;
  // background-color: #fff;
  .title {
    width: 140rpx;
  }
  .data-input {
    display: flex;
    align-items: center;
    position: relative;
    width: 550rpx;
    height: 60rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    border: 1px solid #dcdfe6;
    border-radius: 6rpx;
  }
}
</style>