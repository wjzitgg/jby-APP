<!-- 收发文 -->
<template>
  <view class="wrapper">
    <u-navbar leftText="收发文" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>

    <view class="pad"></view>

    <view class="sticky">
      <view style="background: #fff">
        <u-tabs class="tabs" :list="list1" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"> </u-tabs>
      </view>
      <view class="search">
        <view class="search-input">
          <u-input placeholder="关键字" border="none" v-model="inpDate.keyWord" maxlength="100">
            <view slot="suffix">
              <!-- <u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon> -->
              <view class="sou" name="search"  @click="search" >搜索</view>
            </view>
          </u-input>
        </view>
        <view class="more-search" @click="openPop">
          <view class="image-search"><image src="/static/image/searchImg.png" alt=""/> </view>
            <view class="Translation"> 筛选</view>

        </view>
      </view>
    </view>
    <view class="content">
      <u-list @scrolltolower="scrollTolower" class="u-list" :height="current == 0 ? 'calc(100vh - 368rpx)' : ''">
        <u-list-item v-for="(item, index) in list" :key="index">
          <view class="item" @click="detail(item)">
            <view class="icons">
              <u-icon name="file-text" size="20" color="#2a82e4"></u-icon>
            </view>
            <view class="content">
              <view class="name">{{ item.articleTitle }}</view>
              <!-- <view class="details mb-20">会议时间：{{ item.meetingTime }}</view> -->
              <view class="detail mb-20">发送单位：{{ item.orgName }}</view>
              <view class="detail mb-20">发送人：{{ item.userName }}</view>
              <view class="detail mb-20">发布时间：{{ item.sendingTime }}</view>
              <view v-if="current == 1" class="detail mb-20">接收人：{{ item.receiveName }}</view>
              <view v-if="current == 1" class="detail">接收时间：{{ item.receiveTime }}</view>
            </view>
            <view class="tags">
              <view class="tag draft" v-if="item.enableStatus == 0 && current == 0">草稿</view>
              <view class="tag default" v-if="item.enableStatus == 1 && current == 0">待接收</view>
              <view class="tag primary" v-if="item.enableStatus == 2 && current == 0">部分接收</view>
              <view class="tag waring" v-if="item.enableStatus == 3 && current == 0">已撤回</view>
              <view class="tag success" v-if="item.enableStatus == 4 && current == 0">已接受</view>
              <view class="tag rec" v-if="item.isAppear == 1 && current == 1" @click.stop="reception(item)">
                接收</view>

            </view>
          </view>
        </u-list-item>
      </u-list>
    </view>
    <view class="pdb" v-if="current == 0"></view>
    <view class="btn" @click="addBtn" v-if="$auth('assess:receive:add')&&current == 0">新增</view>
    <!-- <view class="footer-btns" v-if="current == 0">
      <view class="foot-btn addBtn" @click="addBtn">新增</view>
    </view> -->
    <u-popup :show="showPop" @close="closePop" mode="right" class="opo" bgColor="rgba(255, 255, 255, 0)">
      <view class="popup">
        <view class="popup-content">
          <!-- <view class="search-item mb-20">
                <h5 class="mb-20">状态</h5>
                <text class="pop-item" :class="inpDate.inventoryCode === '' ? 'active' : ''" @click="selectItem({ keyName: '' })">全部</text>
                <text class="pop-item" :class="{ active: item.keyName === inpDate.inventoryCode }" v-for="(item, index) in typeList" :key="index" @click="selectItem(item, index)">{{ item.keyVal }}</text>
                      </view> -->
          <view class="search-item">
            <h5 class="mb-20">{{ current==0?'发送日期':'收文日期' }} </h5>
            <view class="search-datas">
              <view class="data-input" @click="openCale(1)">
                {{ inpDate.beginTime }}
                <view class="closeBtn" @click.stop="cleanDate(1)">X</view>
              </view>
              <view class="to">至</view>
              <view class="data-input" @click="openCale(2, inpDate.endTime)">
                {{ inpDate.endTime }}
                <view class="closeBtn" @click.stop="cleanDate(2)">X</view>
              </view>
            </view>
          </view>
        </view>
        <view class="footer">
          <view class="footerBtn cancel" @click="closePop">取消</view>
          <view class="footerBtn add" @click="searchOk">确认</view>
        </view>
      </view>
      <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" />
    </u-popup>

    
    <u-modal :show="show2" title="提示" content="确定接收该发文信息？" showCancelButton @cancel="show2 = false"
      @confirm="confirm"></u-modal>
  </view>
</template>
    
<script>
export default {
  data() {
    return {
      list1: [{ name: "发文" }, { name: "收文" }],
      current: 0,
      show2: false,
      // tabList: [],
      // current: 0,
      // tabShow: false,
      showPop: false,
      inpDate: {
        keyWord: '',
        beginTime: '',
        endTime: ''
      },
      searchDate: {
        keyWord: '',
        beginTime: '',
        endTime: ''
      },
      inventoryCode: '',
      fkWarehouseId: '',
      typeList: [],
      clickDate: '',
      caleType: 1,
      list: [],
      pageNum: 1,
      total: 0,
      rowPkId: ""
    };
  },
  onShow() {
    // this.oaArticleSearchPage();
  },
  onLoad() {
    this.oaArticleSearchPage()
  },
  methods: {
    resh(){
      this.pageNum = 1
      this.oaArticleSearchPage();
    },
    confirm() {
      this.$api.receiveOaArticle({ pkId: this.rowPkId }).then(res => {
        if (res.code == 200) {
          this.show2 = false
          this.oaArticleSearchPage()
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    reception(row) {
      this.show2 = true
      this.rowPkId = row.pkId
      // this.confirm(row.pkId)
    },
    currentChange(item) {
      this.current = item.index;
      console.log(this.current);
      this.pageNum = 1
      this.oaArticleSearchPage();
    },
    oaArticleSearchPage() {
      let data = {
        pageNum: this.pageNum,
        pageSize: 20,
        type: this.current,
        ...this.searchDate
      }
      uni.showLoading({ mask: true })
      this.$api.oaArticleSearchPage(data).then((res) => {
        uni.hideLoading()
        if (res.code === 200) {

          this.total = res.data.total - 0
          if (this.pageNum > 1) {
            this.list = [...this.list, ...res.data.records]
          } else {
            this.list = res.data.records
          }
          console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
          console.log(this.list)
          console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      }).catch((err) => {
        uni.hideLoading()
      });
    },
    openPop() {
      this.showPop = true;
    },
    // 选择发起人
    selectItem(item, index) {
      if (item.keyName == "") {
        this.inpDate.inventoryCode = "";
      } else {
        this.inpDate.inventoryCode = item.keyName;
      }
    },
    searchOk() {
      this.pageNum = 1
      this.searchDate = { ...this.inpDate };
      this.oaArticleSearchPage()
      this.closePop();
    },
    search() {
      this.pageNum = 1
      this.searchDate = { ...this.inpDate };
      this.oaArticleSearchPage()
    },
    closePop() {
      this.showPop = false;
      this.inpDate = { ...this.searchDate };
    },
    cleanDate(e) {
      console.log(e);
      if (e == 1) {
        this.inpDate.beginTime = "";
      } else {
        this.inpDate.endTime = "";
      }
    },
    openCale(type, date) {
      this.clickDate = date;
      this.caleType = type;
      // this.caleShow=true
      this.$refs.calendar.open();
    },
    caleConfirm(e) {
      console.log(e);
      if (this.caleType === 1) {
        this.inpDate.beginTime = e.fulldate;
      } else if (this.caleType === 2) {
        this.inpDate.endTime = e.fulldate;
      }
    },
    detail(item) {
      if(item.isAppear ==1){
        return
      }
      if (this.current == 0) {
        uni.navigateTo({ url: '/pages/assess/addMessageCenter?type=1&obj=' + JSON.stringify(item) })
      } else {
        uni.navigateTo({ url: '/pages/assess/previewInformation?type=1&obj=' + JSON.stringify(item) })

      }

    },
    scrollTolower() {
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
      this.oaArticleSearchPage()
    },
    addBtn() {
      uni.navigateTo({ url: '/pages/assess/addMessageCenter?type=0' })
    }
  },
};
</script>
<style lang="scss" scoped>
.tabs {
  /deep/ .u-tabs__wrapper__nav__item {
    // flex: 1;
    // text-align: center;
  }
}

.pad {
  height: 188rpx;
}

.pdb {
  height: 100rpx;
}

// .hamburg {
//   padding-left: 4rpx;
//   border-left: 1px solid #d5d0d0;
// }

.pull-down {
  width: 100%;
  color: #d5d9df;
  font-size: 28rpx;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: absolute;
  top: 0;
  z-index: 999;
  background: #fff;
  border-radius: 0 0 20rpx 20rpx;

  .item-tab {
    width: 33.33%;
    padding: 29rpx;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

// 下拉选中颜色
.action {
  color: #203457;
}

.arrow-up {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flow {
  overflow: auto;
  width: 750rpx;
}

.mb-20 {
  margin-bottom: 20rpx;
}

.sticky {
  z-index: 99;
}
.search-input{
  display: flex;
  align-items:center ;
  width: 265px;
height: 36px;
opacity: 1;
border-radius: 4px;
background: rgba(249, 249, 255, 1);
border: 1px solid rgba(180, 208, 240, 1);


}
.sou{
    padding-right:10px ;
    font-size: 14px;
font-weight: 500;
letter-spacing: 0px;

color: rgba(42, 130, 228, 1);
}
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;

  .search-input {
  
    padding-left: 20rpx;
    
  }

  .more-search {
    display: flex;
    justify-content: space-around;
    align-items: center;
    // width: 160rpx;
    // height: 60rpx;
    // border: 1px solid #2a82e4;
    // border-radius: 6rpx;
    // font-size: 30rpx;
    // color: #2a82e4;
 
    width: 78px;
height: 36px;
opacity: 1;
border-radius: 4px;
background: rgba(255, 255, 255, 1);

border: 1px solid rgba(180, 208, 240, 1);


    


  }
}
.image-search image{
   width: 14px;
   height: 14px;
}

.Translation{
  font-size: 14px;
font-weight: 500;

line-height: 20.27px;
color: rgba(42, 130, 228, 1);

}

.popup {
  position: relative;
  width: 600rpx;
  /*#ifdef APP-PLUS*/
  height: calc(100vh - 156rpx);
  /*#endif*/
  /*#ifdef H5*/
  height: calc(100vh - 88rpx);
  /*#endif*/
  padding: 30rpx;
  /*#ifdef APP-PLUS*/
  margin-top: 156rpx;
  /*#endif*/
  /*#ifdef H5*/
  margin-top: 88rpx;
  /*#endif*/
  background-color: #f2f2f2;

  .popup-pad {
    /*#ifdef APP-PLUS*/
    height: 156rpx;
    /*#endif*/
    /*#ifdef H5*/
    height: 88rpx;
    /*#endif*/
  }

  .popup-content {
    height: calc(100% - 100rpx);
    overflow: auto;
  }

  .select {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60rpx;
    padding: 0 20rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
  }

  .title-item {
    display: block;
    font-weight: 600;
    font-size: 28rpx;
    margin: 36rpx 0;
  }

  .pop-item {
    display: inline-block;
    border: 1px solid #000;
    width: 170rpx;
    height: 60rpx;
    line-height: 60rpx;
    border-radius: 30rpx;
    font-size: 28rpx;
    background-color: #fff;
    text-align: center;
    // background-color: #f6f6f6;
    border: 1px solid #eee;
    margin-bottom: 24rpx;
    margin-right: 8rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .active {
    color: #2a82e4 !important;
    background-color: #e6f7ff !important;
    border: 1px solid #2a82e4 !important;
  }

  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    width: 580rpx;
    height: 100rpx;

    .footerBtn {
      width: 290rpx;
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
    }

    .cancel {
      background-color: #eeeeee;
      color: #aaaaaa;
    }

    .add {
      background-color: #1576e6;
      color: #fff;
    }
  }
}

.search-datas {
  display: flex;
  align-items: center;
  height: 80rpx;

  // background-color: #fff;
  .title {
    width: 180rpx;
  }

  .to {
    margin: 0 10rpx;
  }

  .data-input {
    display: flex;
    align-items: center;
    position: relative;
    width: 520rpx;
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

.item {
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 10rpx;

  .icons {
    width: 60rpx;
  }

  .content {
    .name {
      width: 520rpx;
      margin-bottom: 20rpx;
      font-weight: 600;
      font-size: 30rpx;
      overflow: hidden;
      /*超出部分隐藏*/
      white-space: nowrap;
      /*禁⽌换⾏*/
      text-overflow: ellipsis;
      /*省略号*/
    }
  }

  .detail {
    width: 520rpx;
    font-size: 24rpx;
    color: #a6aebc;
    letter-spacing: 1px;
    overflow: hidden;
    /*超出部分隐藏*/
    white-space: nowrap;
    /*禁⽌换⾏*/
    text-overflow: ellipsis;
    /*省略号*/
  }

  .details {
    width: 620rpx;
    font-size: 24rpx;
    color: #a6aebc;
    letter-spacing: 1px;
    overflow: hidden;
    /*超出部分隐藏*/
    white-space: nowrap;
    /*禁⽌换⾏*/
    text-overflow: ellipsis;
    /*省略号*/
  }

  .tags {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120rpx;
    height: 74rpx;
    font-size: 24rpx;

    // .tag {
    //   width: 120rpx;
    //   padding: 10rpx 0;
    //   text-align: center;
    //   font-size: 24rpx;
    // }
    .filterImg {
      width: 36rpx;
      margin-right: 6rpx;
    }

    .rec {
      padding: 10rpx 12rpx;
      color: #fff;
      border-radius: 4rpx;
      background: #007aff;
    }

    .tag {
      padding: 10rpx 12rpx
    }

    .default {
      font-size: 12px;
    font-weight: 500;
    line-height: 16.46px;
    color: rgba(255, 87, 51, 1);

    }
    .draft{
      // background-color: #ffe9d1;
      color: #ddd;
    }

    .waring {
      color: #ff9f3f;
      background-color: #ffe9d1;
    }

    .success {
      background-color: #d1ffe9;
      color: #5fd992;
    }

    .error {
      background-color: #ffd1d1;
      color: #d25a5a;
    }

    .primary {
      background-color: #c7e1ff;
      color: #4995e9;
    }
  }
}

.footer-btns {
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 750rpx;
  height: 100rpx;
  z-index: 5;

  .addBtn {
    background-color: #1576e6;
  }

  .foot-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 100rpx;
    font-size: 28rpx;
    color: #fff;
  }
}

// .u-list {
//   padding-top: 80rpx;
// }</style>