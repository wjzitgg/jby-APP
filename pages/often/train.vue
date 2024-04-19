<template>
  <view class="content wrapper">
    <u-navbar   leftText="培训" bgColor="rgb(0 0 0 / 0%)"  leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="bg"></view>
    <view class="search">
      <view class="search-left">
        <u-input
          class="input"
          v-model="input"
          placeholder="培训主题"
          maxlength="50"
        >
        <view slot="suffix">
          <!-- <u-icon name="search" size="28" @click="search" color="#2a82e4" ></u-icon> -->
          <span name="search" @click="search" class="sou">搜索</span>
        </view>
        </u-input>
      </view>
      <view class="search-right"   @click="showFilter = !showFilter">
        <image
          src="/static/image/searchImg.png"
          mode="widthFix"
        />
        <span class="screen">筛选</span>
      </view>
      <view class="filter" v-if="showFilter">
        <view class="toolip">请选择查询标段项目</view>
        <view class="checkbox">
          <!-- @change="checkboxChange" -->
          <u-checkbox-group v-model="checkboxValue" placement="column">
            <u-checkbox
              :customStyle="{ marginBottom: '20rpx' }"
              v-for="item in checkboxList"
              :key="item.projectId"
              :label="item.projectName"
              :name="item.projectId"
            >
            </u-checkbox>
          </u-checkbox-group>
        </view>
        <view class="startFilter">
          <u-button text="确定" @click="startFilter"></u-button>
        </view>
      </view>
    </view>
    <z-paging
      class="list"
      ref="paging"
      v-model="showList"
      @query="queryList"
      refresher-only
      refresher-threshold="120rpx"
    >
      <view>
        <u-cell-group v-if="showList.length">
          <u-cell
            isLink
            v-for="(item, index) in showList"
            :key="index"
            class="item"
            @click="go(item)"
          >
            <view slot="title">
              <view class="item-head">{{ item.title }}</view>
              <view class="item-date">培训日期：{{ item.trainingTime }}</view>
              <view class="item-project">施工项目:{{ item.projectBidName+'  '+ item.trainingStartTime + '~'+item.trainingEndTime }}</view>
              <view class="item-unit">培训单位：{{ item.orgName }}</view>
            </view>
          </u-cell>
        </u-cell-group>
        <u-empty
          style="height: 100%"
          mode="data"
          icon="/static/image/noData.png"
          v-if="!showList.length"
        >
        </u-empty>
      </view>
    </z-paging>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    this.getProjects();
    this.selectTrain();
    // this.showList = this.list;
  },
  data() {
    return {
      list: [],
      showList: [],
      input: "",
      showFilter: false,
      checkboxValue: [],
      checkboxList: [],
    };
  },
  methods: {
    // 获所有任职过的项目
    getProjects() {
      this.$api.getProjects().then((res) => {
        if (res.code === 200) {
          this.checkboxList = res.data ? res.data : [];
        }
      });
    },
    // 查询培训信息
    selectTrain() {
      this.$api
        .selectTrain({pageNum:1,pageSize:10000, projectIds: this.checkboxValue,title:this.input })
        .then((res) => {
          // console.log(res);
          if (res.code === 200) {
            this.list = res.data.records
            this.showList = this.list;
          }
          this.$refs.paging.endRefresh();
        })
        .catch((err) => {
          console.log(err);
          this.$refs.paging.endRefresh();
        });
    },
    go(item) {
      uni.navigateTo({
        url: "/pages/often/trainDetail?obj=" + JSON.stringify(item),
      });
    },
    // inpChange(e) {
    //   this.input = e;
    //   this.showList = this.list.filter(
    //     (item) => item.title.indexOf(this.input) !== -1
    //   );
    // },
    search(){
      this.selectTrain()
    },
    startFilter() {
      // if (this.checkboxValue.length) {
      //   let arr = [];
      //   this.list.forEach((item) => {
      //     this.checkboxValue.forEach((item2) => {
      //       if (item.projectId === item2) {
      //         arr.push(item);
      //       }
      //     });
      //   });
      //   this.showList = arr;
      // } else {
      //   this.showList = this.list;
      // }
      this.selectTrain();
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      });
      this.showFilter = false;
    },
    queryList() {
      this.selectTrain();
    },
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
  .item-unit {
    font-size: 24rpx;
  }
  .item-unit,
  .item-project {
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
    // width: 50%;
width: 265px;
height: 36px;
opacity: 1;
border-radius: 4px;
background: rgba(249, 249, 255, 1);
border: 1px solid rgba(221, 226, 240, 1);
display:flex ;
align-items: center;


  }
  .search-right {
width: 78px;
height: 36px;
opacity: 1;
border-radius: 4px;
background: rgba(255, 255, 255, 1);
border: 1px solid rgba(221, 226, 240, 1);
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: relative;
    image {
      width: 14px;
      height: 10px;
      opacity: 1;
     border-radius: 1px 1px, 0px, NaNpx;
    
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
 
  height: 54rpx;
  border: none;
  
}
.startFilter {
  width: 120rpx;
}
.checkbox {
  margin: 20rpx;
}
.sou{
font-size: 14px;
font-weight: 500;
color: rgba(0, 122, 254, 1);
}
.screen{
font-size: 14px;
font-weight: 500;
color: rgba(42, 130, 228, 1);
}
</style>
