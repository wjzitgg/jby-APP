<template>
  <view class="wrapper">
    <u-navbar
      leftText="管理成本"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="pdt-ios"></view>
    <view class="head">
      <view class="search-datas pad-20">
          <h5 class="title">年度：</h5>
          <picker mode="date" :value="endDate" fields="year"  @change="bindDateChange">
				        <view class="data-input"> {{endDate}} </view>
			    </picker>
        </view>
    </view>
    <view class="conntent">
      <view class="table_detail table_empty table_height">
      <table v-if="list.length">
        <thead>
          <tr>
            <th>费用类别</th>
            <th>费用</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.className }}</td>
            <td>{{ item.costAmount }}</td>
          </tr>
        </tbody>
        <tfoot>
            <tr>
              <td>合计</td>
              <td>{{ '￥' + amount }}</td>
            </tr>
        </tfoot>
      </table>
      <u-empty v-if="list.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      <u-empty
        v-else
        style="height: 100%"
        mode="data"
        text="暂无数据"
        icon="/static/image/noData.png"
      ></u-empty>
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
      list:[],
      clickDate:'',
      endDate:'',
      amount:0
    }
  },
  onLoad(options) {
    let date=new Date()
    // let month = date.getMonth()+1>10?date.getMonth()+1:'0'+(date.getMonth()+1)
    this.endDate=date.getFullYear()
    this.searchCostManage()
  },
  methods:{
    bindDateChange(e){
        this.endDate=e.detail.value
         this.searchCostManage()
    },
    searchCostManage(){
      let data={
        sourceType:1,
        fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
        deadline:this.endDate
      }
      uni.showLoading({ mask: true })
      this.$api.searchCostManage(data).then((res) => {
        uni.hideLoading()
        if(res.code===200){
          this.list=res.data.appCostManageVoList
          this.amount=res.data.amount
        }else{
          uni.showToast({ title: res.msg, icon: 'none' })
        }
      }).catch((err) => {
        uni.hideLoading()
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.head{
  background-color: #fff;
  margin-bottom: 10rpx;
}
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  .search-input {
    // width: 540rpx;
    padding-left: 20rpx;
    border: 1px solid #2a82e4;
    border-radius: 6rpx;
  }
  .w-540{
    width: 540rpx;
  }
  .w-700{
    width: 700rpx;
  }
  .more-search {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 160rpx;
    height: 60rpx;
    border: 1px solid #2a82e4;
    border-radius: 6rpx;
    font-size: 30rpx;
    color: #2a82e4;
    .filterImg {
      width: 36rpx;
      margin-right: 6rpx;
    }
  }
}
.pad-20{
  padding: 0 20rpx;
}
.search-datas {
  display: flex;
  align-items: center;
  height: 80rpx;
  // background-color: #fff;
  .title {
    width: 150rpx;
  }
  .to {
    margin: 0 10rpx;
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
    background-color: #fff;
    border-radius: 6rpx;
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
}
.table_height {
  /*#ifdef APP-PLUS*/
  max-height: calc(100vh - 290rpx);
  height: calc(100vh - 290rpx);
  /*#endif*/
  /*#ifdef H5*/
  max-height: calc(100vh - 190rpx);
  height: calc(100vh - 190rpx);
  /*#endif*/
}
</style>