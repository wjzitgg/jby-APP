<template>
  <view class="content wrapper">
    <u-navbar leftText="保险" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff"  :autoBack="true"></u-navbar>
    <view class="bg"></view>
    <view class="search">
      <view class="search-left">
        <view class="search_box">
           <u-input class="input" v-model="input" placeholder="服务单位" maxlength="56">
          
           </u-input>
         <view class="search_btn" @click="search">搜索</view>
         <!-- <view  slot="suffix">
          <u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon> 
          </view> -->
        </view>
      </view>
      <view class="search-right"  @click="showFilter = !showFilter" >
        <image src="/static/image/searchImg.png" mode="widthFix"/><span class="translationScreening">筛选</span>
      </view>
      <view class="filter" v-if="showFilter">
        <view class="toolip">请选择查询保险类型</view>
        <view class="checkbox">
          <!-- @change="checkboxChange" -->
          <!-- <u-checkbox-group v-model="checkboxValue" placement="column">
            <u-checkbox :customStyle="{ marginBottom: '20rpx' }" v-for="item in checkboxList" :key="item.id"
              :label="item.name" :name="item.id">
            </u-checkbox>
          </u-checkbox-group> -->
          <u-radio-group v-model="insureType" placement="column" >
            <u-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in checkboxList" :key="index"
              :label="item.name" :name="item.id" >
            </u-radio>
          </u-radio-group>
        </view>
        <view class="startFilter">
          <u-button text="确定" @click="startFilter"></u-button>
        </view>
      </view>
    </view>
    <z-paging class="list" ref="paging" v-model="showList" @query="queryList" refresher-only refresher-threshold="120rpx">
      <u-cell-group v-if="showList.length">
        <u-cell isLink v-for="(item, index) in showList" :key="index" class="item" @click="go(item)"
          :rightIconStyle="{ fontSize: '60rpx' }">
          <view slot="title">
            <view class="item-head">{{
              item.insureType == 1
              ? "社保"
              : item.insureType == 2
                ? "意外保险"
                : "其他保险"
            }}</view>
            <view class="item-date">购买日期：{{ item.purchaseTime }}</view>
            <view class="item-project">施工项目：{{ item.projectName }}</view>
            <view class="item-unit">服务单位：{{ item.orgName }}</view>
          </view>
        </u-cell>
      </u-cell-group>
      <u-empty style="height: 100%" mode="data" icon="/static/image/noData.png"
        v-if="!showList.length">
      </u-empty>
    </z-paging>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    this.selectSelfInfo();
    // this.showList = this.list;
  },
  data() {
    return {
      list: [],
      showList: [],
      input: "",
      showFilter: false,
      checkboxValue: [],
      checkboxList: [
        {
          id: "",
          name: "全部",
        },
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
      insureType: ""
    };
  },
  methods: {
    go(item) {
      uni.navigateTo({
        url: `/pages/labour/insuranceDetail?type=${3}&data=${JSON.stringify(item)}`,
      });
    },
    inpChange(e) {
      this.insureTypes = e;
      console.log("xxxxxxxxxxxxx=============xxxxxxxxxxxxxx")
      console.log(this.insureTypes)
      console.log("xxxxxxxxxxxxx=============xxxxxxxxxxxxxx")
      this.showList = this.list.filter(
        (item) => item.orgName.indexOf(this.input) !== -1
      );
    },
    search() {
      this.selectSelfInfo()
    },
    startFilter() {
      this.selectSelfInfo();
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      });
      this.showFilter = false;
    },
    selectSelfInfo() {
      this.$api
        .selectSelfInfo({orgName: this.input,insureType:this.insureType })
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.list = res.data ? res.data : [];
            this.showList = this.list;
          }
          this.$refs.paging.endRefresh();
        }).catch(err => {
          this.$refs.paging.endRefresh();
        });
    },
    queryList() {
      this.selectSelfInfo()
    }
  },
};
</script>

<style lang="scss" scoped>
.bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-color: #f2f2f2;
}

* {
  box-sizing: border-box;
}

.list {
  /*#ifdef APP-PLUS*/
  padding-top: 240rpx;
  /*#endif*/
  /*#ifdef H5*/
  padding-top: 180rpx;
  /*#endif*/
}

.item {
  width: 100%;
  margin-bottom: 20rpx;
  background-color: #fff;

  .item-head {
    margin-bottom: 10rpx;
    font-size: 34rpx;
    font-weight: 700;
  }

  .item-date,
  .item-project {
    margin-bottom: 10rpx;
    font-size: 28rpx;
  }

  .item-project {
    color: #7f7f7f;
  }

  .item-unit {
    font-size: 24rpx;
    color: #7f7f7f;
  }
}

.search {
  background-color: #fff;
  position: fixed;
  width: 100%;
  /*#ifdef APP-PLUS*/
  top: 156rpx;
  /*#endif*/
  /*#ifdef H5*/
  top: 88rpx;
  /*#endif*/
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 20rpx;

  .search-left {
    width: 50%;
  }

  .search-right {
    position: relative;

    image {

width: 15px;
height: 12px;
opacity: 1;
// background: rgba(42, 130, 228, 1);



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

.input {
  // background-color: #fff;
  // height: 54rpx;

// width: 265px;
// height: 32px;
// opacity: 1;
// border-radius: 4px;
// background: rgba(249, 249, 255, 1);

// border: 1px solid rgba(221, 226, 240, 1);
   border: none;

}

.startFilter {
  width: 120rpx;
}

.checkbox {
  margin: 20rpx;
}

.search_btn{


font-size: 14px;
font-weight: 500;
letter-spacing: 0px;
line-height: 20.27px;
color: rgba(0, 122, 254, 1);
text-align: right;
vertical-align: top;
 margin-right:10px ;
}
.search_box{
   
    display: flex;
    width: 265px;
    align-items: center;
height: 32px;
opacity: 1;
border-radius: 4px;
background: rgba(249, 249, 255, 1);
border: 1px solid rgba(221, 226, 240, 1);
 
}
.search-right{

display: flex;
justify-content: space-around;
align-items: center;
width: 70px;
height: 32px;
opacity: 1;
border-radius: 4px;
background: rgba(255, 255, 255, 1);

border: 1px solid rgba(221, 226, 240, 1);
color: rgba(42, 130, 228, 1);

}
.translationScreening{

font-size: 14px;
font-weight: 500;
letter-spacing: 0px;
line-height: 20.27px;
color: rgba(42, 130, 228, 1);
text-align: left;
vertical-align: top;

}
</style>
