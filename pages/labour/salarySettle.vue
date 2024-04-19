<template>
  <view class="wrapper">
    <u-navbar
      leftText="工资结算"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>

    <view class="sticky">
      <u-subsection
        :list="topList"
        mode="subsection"
        :current="current"
        @change="sectionChange"
      ></u-subsection>
      <view class="search" v-if="current === 2">
        <view class="search-left">
          <u-input placeholder="班组名称" border="none" v-model="input" maxlength="25">
            <template slot="suffix">
              <u-icon
                name="search"
                size="26"
                color="#2a82e4"
                @click="searchBtn"
              ></u-icon>
            </template>
          </u-input>
        </view>
      </view>
    </view>
    <view
      class="pad"
      :style="{ height: current === 2 ? '140rpx' : '60rpx' }"
    ></view>
    <view class="content">
      <u-list
        :height=" 'calc( 87vh - 100rpx)' "
        @scrolltolower="scrolltolower"
      >
        <u-list-item v-for="(item, index) in showList" :key="index">
          <u-cell isLink class="cell" @click="cellClick(item)">
            <view slot="title" v-if="current < 2">
              <view class="cell-item mb-30">
                <h3 class="cell-item-title">班组名称:{{item.teamName}}</h3>
                <view class="state blue">{{ item.stats===0?'待确认':item.stats===1?'已确认':"草稿" }}</view>
              </view>
              <view class="cell-item cell-item2">
                <view v-if="current===0">结算周期：{{item.settlementCycle}}</view>
                <view v-if="current===1">发放日期：{{item.settlementTime}}</view>
                <view class="money">+{{item.settlementAmount}}</view>
              </view>
            </view>
            <view slot="title" v-if="current === 2">
              <view class="cell-item mb-20">
                <h3 class="cell-item-title wh-600">班组名称:{{item.teamName}}</h3>
              </view>
              <view class="cell-item mb-20 grey"> 结算金额：{{item.cumulativeSettlementAmount}}元 </view>
              <view class="cell-item grey">
                <view>发放金额：{{item.cumulativeGrantAmount}}元</view>
                <view>结余金额：{{item.payBalance}}元</view>
              </view>
            </view>
          </u-cell>
        </u-list-item>
      </u-list>
    </view>
    <view class="btn" @click="addBtn" v-if="current<2&&$auth('labour:salarySettle:add')">新增{{ current === 0 ? "结算" : "发放" }}</view>
  </view>
</template>

<script>
export default {
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  data() {
    return {
      topList: ["结算情况", "发放情况", "支付结余"],
      current: 0,
      refreshIfNeeded: false,
      input: "",
      searchName:"",
      showList:[],
      total:0,
      pageNum:1,
    };
  },
  onLoad(options) {
    this.searchSettlementPage()
  },
  onShow() {
    // let pages = getCurrentPages(); // 获取当前页面栈
    // let currentPage = pages[pages.length - 1]; // 当前页面
    if (this.refreshIfNeeded) {
      this.refreshIfNeeded = false;
      this.pageNum=1
      if(this.current<2){
        this.searchSettlementPage()
      }else{
        this.searchBalance()
      }
      // this.mescroll.resetUpScroll(); // 调用列表重置刷新页面
      // this.mescroll.scrollTo(0,0); // 滚动页面置顶
    }
  },
  methods: {
    searchSettlementPage(){
      let data={
         pageNum:this.pageNum,
        pageSize:20,
        keyWord:this.searchName,
        settlementType:this.current +1,
        projectOrgId:[5,7].includes(this.userInfo.orgType) ? "" : uni.getStorageSync("nowOrgId")
      }
      uni.showLoading({ mask: true })
      this.$api.searchSettlementPage(data).then(res=>{
         uni.hideLoading();
        if(res.code === 200){
          if (this.pageNum === 1) {
              this.showList = res.data.records;
            } else {
              this.showList = [...this.showList, ...res.data.records];
            }
            this.total = res.data.total-0;
        }else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    searchBalance(){
      let data={
         pageNum:this.pageNum,
        pageSize:20,
        keyWord:this.searchName,
        projectOrgId:[5,7].includes(this.userInfo.orgType) ? "" : uni.getStorageSync("nowOrgId")
      }
      uni.showLoading({ mask: true })
      this.$api.searchBalance(data).then((res) => {
         uni.hideLoading();
        if(res.code === 200){
          // if (this.pageNum === 1) {
          //     this.showList = res.data.records;
          //   } else {
          //     this.showList = [...this.showList, ...res.data.records];
          //   }
          this.showList=res.data
            // this.total = res.data.total-0;
        }else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    sectionChange(index) {
      this.current = index;
      this.showList = [];
      this.pageNum=1
      if(this.current<2){
        this.searchSettlementPage()
      }else{
        this.searchBalance()
      }
    },
    scrolltolower() {
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
      if(this.current<2){
        this.searchSettlementPage()
      }else{
        this.searchBalance()
      }
    },
    cellClick(item) {
      if (this.current === 0) {
        uni.navigateTo({ url: `/pages/labour/settingDetail?type=${this.userInfo.orgType===7?2:3}&data=${JSON.stringify(item)}` });
      } else if (this.current === 1) {
        uni.navigateTo({ url: `/pages/labour/grantDetail?type=${this.userInfo.orgType===7?2:3}&data=${JSON.stringify(item)}` });
      } else if (this.current === 2) {
        uni.navigateTo({ url: `/pages/labour/surplusDetail?type=${this.userInfo.orgType===7?2:3}&data=${JSON.stringify(item)}` });
      }
    },
    searchBtn() {
      this.searchName=this.input
      this.pageNum=1
      if(this.current<2){
        this.searchSettlementPage()
      }else{
        this.searchBalance()
      }
    },
    addBtn(){
      if (this.current === 0) {
        uni.navigateTo({ url: `/pages/labour/settingDetail?type=1` });
      } else if (this.current === 1) {
        uni.navigateTo({ url: `/pages/labour/grantDetail?type=1` });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.pad {
  height: 60rpx;
}
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 20rpx;
  border-bottom: 1px solid #d7d7d7;
  .search-left {
    width: 60%;
    padding-left: 10rpx;
    border: 1px solid #2a82e4;
  }
  .search-right {
    position: relative;
    image {
      width: 40rpx;
      // margin-top: 10rpx;
    }
  }
}
.cell {
  background-color: #fff;
  .cell-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26rpx;
    .cell-item-title {
      width: 450rpx;
      overflow: hidden;
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
    }
    .wh-600 {
      width: 600rpx;
    }
    .state {
      display: flex;
      .state-item {
        display: flex;
      }
    }
    .blue {
      color: #8b87ff;
    }
    .green {
      color: #7cbc18;
    }
    .money {
      color: #f59e33;
    }
  }
  .grey {
    font-size: 26rpx;
    color: #7f7f7f;
  }
}
.mb-20 {
  margin-bottom: 20rpx;
}
.mb-30 {
  margin-bottom: 30rpx;
}
.mr-20 {
  margin-right: 20rpx;
}
</style>
