<template>
  <view class="wrapper">
    <u-navbar
      leftText="培训"
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
        v-if="[4, 5, 7].includes(userInfo.orgType)"
      ></u-subsection>

      <!-- <u-tabs
  mode="subsection"
  :list="topList"
  :current="current"
  @change="sectionChange"
  :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
>
</u-tabs> -->

       


      <view class="search">
        <view class="search-left">
          <u-input placeholder="培训主题" border="none" v-model="input" maxlength="50">
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
    <view :style="{ height: [4, 5, 7].includes(userInfo.orgType)? '140rpx' : '80rpx' } " ></view>
    <view class="content">
      <u-list
        :height="[4, 5, 7].includes(userInfo.orgType)?'calc( 87vh - 160rpx)':'calc( 87vh - 100rpx)'"
        @scrolltolower="scrolltolower"
      >
        <u-list-item v-for="(item, index) in showList" :key="index">
          <u-cell isLink class="cell" @click="cellClick(item)">
            <view slot="title">
              <view class="cell-item mb-20">
                <h3 class="cell-item-title">{{item.title}}</h3>
              </view>
              <view class="cell-item mb-20">
                <view>培训日期：{{item.trainingTime}}</view>
              </view>
              <view class="cell-item grey">
                <view>培训单位：{{item.orgName}}</view>
              </view>
            </view>
          </u-cell>
        </u-list-item>
      </u-list>
    </view>
    <view class="btn" v-if="$auth('labour:train:add')&&current === 0" @click="addBtn">新增培训</view >
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
      topList: ["内部培训", "上级培训"],
      current: 0,
      refreshIfNeeded: false,
      input: "",
      searchName:"",
      pageNum:1,
      total:0,
      showList:[]
    };
  },
  onLoad(options) {
    if (this.userInfo.orgType === 7) {
      this.topList = ["内部培训", "上级培训"];
    } else if ([4, 5].includes(this.userInfo.orgType)) {
      this.topList = ["项目部培训", "分包单位培训"];
    } else {
    }
    this.searchTrainPage()
  },
  onShow() {
    this.reshPage()
  },
  methods: {
    reshPage(){
    //   let pages = getCurrentPages(); // 获取当前页面栈
    // let currentPage = pages[pages.length - 1]; // 当前页面
    // console.log(getCurrentPages(),currentPage);
    if (this.refreshIfNeeded) {
      this.refreshIfNeeded = false;
      // console.log("重新获取列表");
      this.pageNum=1
      this.searchTrainPage()
      // this.mescroll.resetUpScroll(); // 调用列表重置刷新页面
      // this.mescroll.scrollTo(0,0); // 滚动页面置顶
    }
    },
    searchTrainPage(){
      let trainingType=''
      if(this.userInfo.orgType===7){
        if(this.current===0){
          trainingType=1
        }else{
          trainingType=2
        }
      }else if([4,5].includes(this.userInfo.orgType)){
        if(this.current===0){
          trainingType=2
        }else{
          trainingType=1
        }
      }else{
        trainingType=2
      }
      let data={
        trainingType,
        pageNum:this.pageNum,
        pageSize:20,
        title:this.searchName,
        fkOrgId:[5,7].includes(this.userInfo.orgType) ? "" : uni.getStorageSync("nowOrgId")
      }
      uni.showLoading({ mask: true })
      this.$api.searchTrainPage(data).then((res) => {
        uni.hideLoading()
        if(res.code===200){
          if(this.pageNum===1){
            this.showList=res.data.records
          }else{
            this.showList=[...this.showList,...res.data.records]
          }
          this.total=res.data.total-0
        }else{
          uni.showToast({
          title: res.msg,
          icon: 'none'
        })
        }
      }).catch((err) => {
        uni.hideLoading()
      });
    },
    sectionChange(index) {
      this.current = index;
      this.showList = [];
      this.pageNum=1
      this.searchTrainPage()
    },
    searchBtn() {
      this.searchName =this.input
      this.pageNum=1
      this.searchTrainPage()
    },
    scrolltolower(){
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
      this.searchTrainPage()
    },
    addBtn(){
      uni.navigateTo({ url: `/pages/labour/trainDetail?type=1` })
    },
    cellClick(item){
      uni.navigateTo({ url: `/pages/labour/trainDetail?type=${[5, 7].includes(this.userInfo.orgType)&& this.current === 0?2:3}&data=${JSON.stringify(item)}` })
    }
  },
};
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 20rpx;
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
    // justify-content: space-between;
    align-items: center;
    font-size: 26rpx;
    .state {
      display: flex;
      .state-item {
        display: flex;
      }
    }
  }
  .grey {
      font-size: 24rpx;
      color: #7f7f7f;
    }
  .cell-item2{
    justify-content: space-between;
  }
}
.mb-20 {
  margin-bottom: 20rpx;
}
.mr-20 {
  margin-right: 20rpx;
}
</style>
