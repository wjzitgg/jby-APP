<template>
  <view class="wrapper">
    <u-navbar
        leftText="保险"
        bgColor="rgb(0 0 0 / 0%)"
        leftIconColor="#fff"
        :autoBack="true"
      ></u-navbar>

      <view class="sticky search">
      <view class="search-left">
        <u-input
          placeholder="工人姓名/手机号码"
          border="none"
          v-model="input"
          maxlength="25"
        >
          <template slot="suffix">
            <!-- <u-icon
              name="search"
              size="26"
              color="#2a82e4"
              @click="searchBtn"
            ></u-icon> -->
             <span  name="search" class="sou"  @click="searchBtn">搜索</span>
          </template>
        </u-input>
      </view>

       
      <view class="search-right"  @click="showFilter = !showFilter">
        <image
          src="/static/image/searchImg.png"
          mode="widthFix"
         
        />
        <span class="Translation">筛选</span>  
      </view>


      





      <view class="filter" v-if="showFilter">
        <view class="toolip">请选择查询保险类型</view>
        <view class="checkbox">
          <!-- @change="checkboxChange" -->
          <u-checkbox-group v-model="checkboxValue" placement="column">
            <u-checkbox
              :customStyle="{ marginBottom: '20rpx' }"
              v-for="item in checkboxList"
              :key="item.id"
              :label="item.name"
              :name="item.id"
            >
            </u-checkbox>
          </u-checkbox-group>
        </view>
        <view class="startFilter">
          <u-button text="确定" @click="startFilter"></u-button>
        </view>
      </view>
    </view>
    <view class="pad"></view>
     <view class="content">
      <u-list
        height="calc( 87vh - 100rpx)"
        @scrolltolower="scrolltolower"
      >
        <u-list-item v-for="(item, index) in showList" :key="index">
          <u-cell isLink class="cell" @click="cellClick(item)">
            <view slot="title">
              <view class="cell-item mb-20">
                <h3 class="cell-item-title">{{item.userName}}</h3>
                <view class="grey">{{`(${item.teamName})`}}</view>
              </view>
              <view class="cell-item cell-item2 grey">
               
                <view>保险类型：{{item.insureType===1?'社保':item.insureType===2?'意外险':'其他'}}</view>
                <view>购买日期：{{item.purchaseTime}}</view>
              </view>
            </view>
          </u-cell>
        </u-list-item>
      </u-list>
    </view>
    <view class="btn" @click="addBtn" v-if="userInfo.orgType===7">新增保险</view>
  </view>
</template>

<script>
export default {
  computed: {
		userInfo() {
			return this.$store.state.userInfo;
		}
	},
  data(){
    return{
      input: "",
      searchName:"",
      showFilter: false,
      showList:[],
      total:0,
      pageNum:1,
      checkboxValue: [],
      checkboxList: [
        {
          id: 1,
          name: "社保",
        },
        {
          id: 2,
          name: "意外保险",
        },
        {
          id: 3,
          name: "其他保险",
        },
      ],
      refreshIfNeeded: false,
    }
  },
  onLoad(options) {
    this.searchInsurePage()
  },
  onShow() {
    // let pages = getCurrentPages(); // 获取当前页面栈
    // let currentPage = pages[pages.length - 1]; // 当前页面
    if (this.refreshIfNeeded) {
      this.refreshIfNeeded = false;
      this.pageNum=1
      this.searchInsurePage()
      // this.mescroll.resetUpScroll(); // 调用列表重置刷新页面
      // this.mescroll.scrollTo(0,0); // 滚动页面置顶
    }
  },
  methods:{
    searchInsurePage(){
      let data={
        pageNum:this.pageNum,
        pageSize:20,
        fkProjectBidId: [5,7].includes(this.userInfo.orgType) ? "" : uni.getStorageSync("nowProId"),
        keyWord: this.searchName,
        insureTypes:this.checkboxValue.join(',')
      }
      uni.showLoading({ mask: true });
      this.$api.searchInsurePage(data).then((res) => {
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
    addBtn(){
      uni.navigateTo({ url: '/pages/labour/insuranceDetail?type=1' })
    },
    scrolltolower(){
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
      this.searchInsurePage()
    },
    searchBtn() {
      this.searchName =this.input
      this.pageNum=1
      this.searchInsurePage()
    },
    cellClick(item){
      uni.navigateTo({ url: `/pages/labour/insuranceDetail?type=${this.userInfo.orgType===7?2:3}&data=${JSON.stringify(item)}` })
    },
    startFilter() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      });
      this.pageNum=1
      this.showFilter = false;
      this.searchInsurePage()
    },
  }
}
</script>

<style lang="scss" scoped>
.pad{
  height: 80rpx;
}
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 20rpx;
  .search-left {
    display: flex;
  align-items:center ;
  width: 265px;
height: 36px;
opacity: 1;
border-radius: 4px;
background: rgba(249, 249, 255, 1);
border: 1px solid rgba(180, 208, 240, 1);
    padding-left: 10rpx;
  

  }
  .search-right {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
   
    width: 78px;
height: 36px;
opacity: 1;
border-radius: 4px;
background: rgba(255, 255, 255, 1);

border: 1px solid rgba(180, 208, 240, 1);
    image {
      width: 14px;
      height: 14px;
    
    }
  }
  .filter {
    display: flex;
    align-items: center;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 80rpx;
    z-index: 2;
    width: 375rpx;
    padding: 20rpx;
    border: 1px solid #ccc;
    background-color: #fff;
  }
}
.Translation{
  font-size: 14px;
font-weight: 500;

line-height: 20.27px;
color: rgba(42, 130, 228, 1);
}
.sou{
  padding-right:10px ;
    font-size: 14px;
font-weight: 500;
letter-spacing: 0px;

color: rgba(42, 130, 228, 1);
}
.input {
  background-color: #fff;
  height: 54rpx;
}
.startFilter {
  width: 120rpx;
}
.checkbox {
  margin: 20rpx;
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