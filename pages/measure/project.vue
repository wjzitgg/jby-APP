<template>
  <view class="wrapper">
    <u-navbar leftText="项目计量" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="sticky">
      <u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="true" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"></u-tabs>
      <view class="search-datas">
        <h5 class="title">统计周期：</h5>
        <view class="data-input" >
          <view class="left" @click="openCale(1)">{{ beginTime }}</view>
          <view class="closeBtn" @click="cleanDate(1)">X</view>
        </view>
        <view class="to">至</view>
        <view class="data-input" >
          <view class="left" @click="openCale(2)">{{ endTime }}</view>
          <view class="closeBtn" @click="cleanDate(2)">X</view>
        </view>
      </view>
    </view>
    <view class="pad"></view>
    <view class="content">
      <u-list @scrolltolower="scrollTolower" class="u-list">
        <u-list-item v-for="(item, index) in list" :key="index">
          <view @click="detail(item)" class="item">
            <view class="df mb-20">
              <view class="icons">
                <u-icon name="file-text" size="20" color="#2a82e4"></u-icon>
              </view>
              <view class="content">
                <view class="name">{{ item.settleName }}</view>
                <view class="detail">{{ item.beginDate + '~' + item.endDate }}</view>
              </view>
              <view class="tags">
                <!-- 结算状态，0：草稿   1：审批中  2：已完成 3: 已拒绝,4:待签章，5：签章中，6：签章已完成-->
                <view class="tag" :class="{
                  default: item.settleStatusStr === '草稿',
                  waring: ['审批中', '待签章','盖章中'].includes(item.settleStatusStr)||item.settleStatus===5,
                  success: ['审批完成','已完成'].includes(item.settleStatusStr),
                  error: ['已拒绝','已撤回'].includes(item.settleStatusStr),
                }">
                {{item.settleStatusStr}}
                </view>
              </view>
            </view>
            <view class="money">
              <view class="money-detail">
                <view class="title">上期末含税结算金额</view>
                <view class="num">{{menuCodeData==1? item.lastSettleAmount:'***' }}</view>
              </view>
              <view class="money-detail">
                <view class="title">本期含税结算金额</view>
                <view class="num">{{menuCodeData==1?  item.settleAmount:'***' }}</view>
              </view>
              <view class="money-detail">
                <view class="title">本期末含税结算金额</view>
                <view class="num">{{menuCodeData==1?  item.endSettleAmount :'***'}}</view>
              </view>
            </view>
          </view>
        </u-list-item>
      </u-list>
    </view>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" />
  </view>
</template>

<script>
export default {
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  data() {
    return {
      tabList: [
        { name: "全部", value: "" },
        // { name: "草稿", value: 0 },
        { name: "审批中", value: 1 },
        { name: "审批完成", value: 2 },
        { name: "待签章", value: 4 },
        { name: "签章中", value: 5 },
        { name: "签章完成", value: 6 },
      ],
      current: 0,
      clickDate: "",
      caleType: 1,
      beginTime: "",
      endTime: "",
      pageNum: 1,
      total: 0,
      settleStatus: "",
      list: [],
      menuCodeData:""
    };
  },
  onLoad(options) {
    this.searchSettingPage();
    this.searchMenuDataAuthorize();
  },
  methods: {
    scrollTolower() {
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
      this.searchSettingPage();
    },
    resh(){
      this.searchSettingPage(true);
    },
    searchSettingPage(resh) {
      if(resh){
        this.pageNum=1
      }
      //settleStatus 0：草稿 1：审批中 2：已完成 3: 已拒绝,4:待签章，5：签章中，6：签章已完成
      let data = {
        pageNum: this.pageNum,
        pageSize: 20,
        beginTime: this.beginTime,
        endTime: this.endTime,
        fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
        settleStatus: this.settleStatus,
        settleType: this.user.orgType === 7?2:1,
      };
      uni.showLoading({ mask: true });
      this.$api
        .searchSettingPage(data)
        .then((res) => {
          uni.hideLoading()
          if (res.code === 200) {
            if(this.pageNum==1){
               this.list=res.data.records
            }else{
              this.list = [...this.list,...res.data.records];
            }
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        })
        .catch((err) => {
          uni.hideLoading()
        });
    },
    detail(item) {
      console.log(item);
      //settleStatus 0：草稿 1：审批中 2：已完成 3: 已拒绝,4:待签章，5：签章中，6：签章已完成
       uni.navigateTo({ url: `/pages/measure/settingDetail?type=1&sendType=${[0,7].includes(item.settleStatus)?1:2}&pkId=${item.pkId}` });
      // if (item.settleStatus < 4) {
      //   uni.navigateTo({ url: "/pages/measure/settingDetail?type=1&row=" + JSON.stringify(item) });
      // } else {
      //   uni.navigateTo({ url: "/pages/measure/sealApporval?type=1&row=" + JSON.stringify(item) });
      // }
    },
    currentChange(e) {
      this.current = e.index;
      this.settleStatus = e.value;
      this.searchSettingPage();
    },
    cleanDate(e) {
      console.log(e);
      if (e == 1) {
        this.beginTime = "";
      } else {
        this.endTime = "";
      }
      this.searchSettingPage(true)
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
        this.beginTime = e.fulldate;
      } else if (this.caleType === 2) {
        this.endTime = e.fulldate;
      }
      this.searchSettingPage(true)
    },
    // 获取当前登录用户角色关联菜单权限数据集
    searchMenuDataAuthorize() {
      this.$api.searchMenuDataAuthorize().then(res => {
        if (res.code == 200) {
          res.data.forEach(element => {
            if (element.menuCode == 'settlement') {
              this.menuCodeData = element.states
            }
          });
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.pad {
  height: 178rpx;
}

.sticky {
  z-index: 80;
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
    width: 270rpx;
    height: 60rpx;
    padding: 0 20rpx;
    border: 1px solid #dcdfe6;
    border-radius: 6rpx;
    .left{
      display: flex;
      align-items: center;
      width: 200rpx;
      height: 60rpx;
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
}

.item {
  //   display: flex;
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 10rpx;

  .df {
    display: flex;
  }

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

  .tags {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120rpx;
    height: 74rpx;

    .tag {
      width: 120rpx;
      padding: 10rpx 0;
      text-align: center;
      font-size: 26rpx;
    }

    .default {
      background-color: #eeeeee;
      color: #b8b8b8;
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

  .money {
    display: flex;
    justify-content: space-evenly;

    // height: 80rpx;
    .money-detail {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      width: 220rpx;
      height: 80rpx;
      font-size: 24rpx;
      background-color: #fafafa;
      word-break: break-all;
      word-wrap: break-word;
    }
  }
}

.mb-20 {
  margin-bottom: 20rpx;
}</style>
