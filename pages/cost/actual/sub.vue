<template>
  <view class="wrapper">
    <u-navbar
      leftText="分包成本"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="sticky">
      <view class="search">
        <view class="search-input">
          <u-input placeholder="请输入期名" border="none" v-model="name" maxlength="100" >
            <template slot="suffix">
              <u-icon name="search" size="28" @click="search"></u-icon>
            </template>
          </u-input>
        </view>
        <view class="search-datas">
          <h5 class="title">截止日期：</h5>
          <view class="data-input" @click="openCale(nowdate)">
            {{ nowdate }}
            <view class="closeBtn" @click.stop="cleanDate">X</view>
          </view>
        </view>
      </view>
    </view>
    <view class="pad"></view>
    <view class="content">
        <view class="table_detail table_height table_empty" >
        <table v-if="list.length">
          <thead>
            <tr>
              <th>序号</th>
              <th>结算对象</th>
              <th>期名</th>
              <th>结算周期</th>
              <th>上期末结算金额</th>
              <th>本期结算金额</th>
              <th>本期末结算金额</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td><text class="clickTd" @click="clickTd(item)">{{ index +1  }}</text></td>
              <td>{{ item.settleOrgName }}</td>
              <td>{{ item.settleName }}</td>
              <td>{{ item.settleCycle }} </td>
              <td>{{ item.lastSettleAmount }}</td>
              <td>{{ item.settleAmount }}</td>
              <td>{{ item.endSettleAmount }}</td>
            </tr>
          </tbody>
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
    <uni-calendar
      ref="calendar"
      :insert="false"
      @confirm="caleConfirm"
      :date="clickDate"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      nowdate:'',
      clickDate:'',
      list:[]
    };
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  onLoad(options) {
    this.actualCostSearch()
  },
  methods: {
    actualCostSearch(){
        let data={
            settleEndDate:this.nowdate,
            settleName:this.name,
            fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
        }
        uni.showLoading({ mask: true })
        this.$api.actualCostSearch(data).then((res) => {
            uni.hideLoading()
            if(res.code===200){
                this.list=res.data
            }else{
                uni.showToast({ title: res.msg, icon: 'none' })
            }
        }).catch((err) => {
             uni.hideLoading()
        });
    },
    clickTd(item){
        console.log(item);
        uni.navigateTo({ url: "/pages/measure/settingDetail?todo=3&sendType=2&type=2&pkId="+item.pkId });
    },
    search() {
        this.actualCostSearch()
    },
    cleanDate(e) {
        this.nowdate=''
        this.actualCostSearch()
    },
    openCale(date) {
      this.clickDate = date;
      this.$refs.calendar.open();
    },
    caleConfirm(e) {
      console.log(e);
      this.nowdate=e.fulldate
      this.actualCostSearch()
    },
  },
};
</script>

<style lang="scss" scoped>
.pad{
    height: 170rpx;
}
.sticky{
    z-index: 99;
}
.search {
  // display: flex;
  // align-items: center;
  padding: 10rpx 20rpx;
  // height: 80rpx;
  .search-input {
    width: 700rpx;
    padding-left: 20rpx;
    border: 1px solid #2a82e4;
    border-radius: 6rpx;
  }
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
  .to {
    margin: 0 10rpx;
  }
  .data-input {
    display: flex;
    align-items: center;
    position: relative;
    width: 540rpx;
    height: 60rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    border: 1px solid #dcdfe6;
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
.table_height{
    /*#ifdef APP-PLUS*/
  height: calc(100vh - 354rpx);
  /*#endif*/
  /*#ifdef H5*/
  height: calc(100vh - 266rpx);
  /*#endif*/
}
</style>
