<template>
  <view class="content wrapper">
    <u-navbar
      leftText="工资结余"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="bg"></view>
    <view class="search">
      <view class="search-left" >
        <!-- <u-subsection :list="topList" mode="subsection" :current="current" @change="sectionChange" ></u-subsection > -->
        <view class="search-datas">
              <view class="data-input">
                <view class="left" @click="openCale(1)">{{ inpDate.beginTime }}</view>
                <view class="closeBtn" @click="cleanDate(1)">X</view>
              </view>
              <view class="to">至</view>
              <view class="data-input">
                <view class="left" @click="openCale(2, inpDate.endTime)">{{ inpDate.endTime }}</view>
                <view class="closeBtn" @click="cleanDate(2)">X</view>
              </view>
            </view>
      </view>
      <view class="search-right"
        ><image
          src="../../static/image/u486.png"
          mode="widthFix"
          @click="showFilter = !showFilter"
      /></view>
      <view class="filter" v-if="showFilter">
        <view class="toolip">请选择查询标段项目</view>
        <view class="checkbox">
          <u-checkbox-group v-model="checkboxValue" placement="column">
            <u-checkbox
              :customStyle="{ marginBottom: '20rpx' }"
              v-for="item in checkboxList"
              :key="item.projectId"
              :label="item.projectName"
              :name="item.projectId"
            ></u-checkbox>
          </u-checkbox-group>
        </view>
        <view class="startFilter"
          ><u-button text="确定" @click="startFilter"></u-button
        ></view>
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
      <!-- <view
        :animation="animationData"
        @touchstart="touchstart"
        @touchend="touchend"
        :style="{ height: '85vh' }"
      > -->
        <!-- 结算和发放列表 -->
        <view class="list1" v-if="current < 2 && showList.length">
          <view class="list-item" v-for="item in showList" :key="item.pkId">
            <view class="item-head">
              <view class="date">{{ item.settlementTime }}</view>
              <view class="time"
                >{{item.number}}</view
              >
            </view>
            <view
              class="item-period"
              v-if="userInfo.teamType === 1 && current !== 1"
              >结算周期：{{item.settlementCycle}}</view
            >
            <view class="item-middle"
              >{{
                current === 1
                  ? "发放"
                  : userInfo.teamType === 1
                  ? "结算"
                  : "工资"
              }}金额：￥{{ item.settlementAmount }}</view
            >
            <view class="item-bottom">
              <view class="unit"
                >{{ userInfo.teamType === 1 ? "结算" : "所在" }}单位：{{
                  item.orgName
                }}</view
              >
              <!-- 路基班组 张三 -->
              <view class="df" v-if="userInfo.teamType !== 1">
                <view class="iclass">所在班组：{{ item.className }}</view>
                <view class="principal"
                  >{{ current === 1 ? "发放" : "结算" }}负责人：{{
                    item.managerName
                  }}</view
                >
              </view>
            </view>
            <view
              class="state"
              :class="{ 'st-blue': item.stats !== 1 }"
              @click="setting(item)"
              >{{ item.stats === 1 ? "已确认" : "待确认" }}</view
            >
          </view>
        </view>
        <!-- 结余列表 -->
        <view class="list2" v-if="current == 2 && showList.length">
          <view
            class="list-item"
            v-for="(item, index) in showList"
            :key="index"
          >
            <view class="item-head">
              <view class="unit">服务单位：{{ item.orgName }}</view>
              <view class="state" :class="{ 'st-red': item.state==='未结清' }" >{{ item.state }}</view >
            </view>
            <view class="df2" v-if="userInfo.teamType !== 1">
              <view class="iclass">所在班组：{{ item.className }}</view>
              <view class="principal">工资负责人：{{ item.userName }}</view>
            </view>
            <view class="time" >服务时间：{{ item.time }} </view >
            <view class="setting-money"
              >结算金额：￥{{ item.cumulativeSettlementAmount }}</view
            >
            <view class="item-bottom">
              <view class="send-money"
                >已发放金额：￥{{ item.cumulativeGrantAmount }}</view
              >
              <view
                class="surplus-money"
                v-if="item.payBalance > 0"
                >结余金额：￥{{
                  item.payBalance
                }}</view
              >
            </view>
          </view>
        </view>
        <u-empty
          style="height: 100%"
          mode="data"
          icon="/static/image/noData.png"
          v-if="!showList.length"
        ></u-empty>
      <!-- </view> -->
    </z-paging>
    <!-- 确认弹框 -->
    <u-modal
      :show="show"
      :content="content"
      showCancelButton
      buttonReverse
      @cancel="modalCancel"
      @confirm="modalConfirm"
    ></u-modal>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm"/>
    <!-- <u-loading-page
      :loading="loading"
      bg-color="rgba(0,0,0,.5)"
      style="z-index: 99"
    ></u-loading-page> -->
    <!-- @disconnected="disconnected"
			@connected="connected"
			@retry="retry" -->
  </view>
</template>

<script>
import request from "../../common/request";
export default {
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  onLoad(options) {
    this.animation = uni.createAnimation({
      timingFunction: "ease",
      duration: 120,
    });
    // this.showList = this.list;
    let winHeight = uni.getWindowInfo().windowHeight;
    if (process.env.UNI_PLATFORM == "h5") {
      this.height = winHeight;
    } else {
      this.height = (winHeight / 750) * (winHeight - 60);
    }
    this.getProjects();
    // this.getSettlementInfo(1);
  },
  onShow() {
    this.queryList();
  },
  data() {
    return {
      topList: ["结算", "发放", "工资结余"],
      current:2,
      showList: [],
      showFilter: false,
      checkboxValue: [],
      checkboxList: [
        {
          projectId: 1,
          projectName: "标段项目A1",
        },
        {
          projectId: 2,
          projectName: "标段项目A2",
        },
        {
          projectId: 3,
          projectName: "标段项目B3",
        },
        {
          projectId: 4,
          projectName: "标段项目C2",
        },
      ],
      show: false,
      content: "是否确认结算金额",
      height: "",
      animationData: {},
      pkId: "",
      inpDate:{
        beginTime:"",
        endTime:""
      }
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
    cleanDate(e) {
      console.log(e);
      if (e == 1) {
        this.inpDate.beginTime = "";
      } else {
        this.inpDate.endTime = "";
      }
      if (this.current < 2) {
        this.getSettlementInfo(this.current + 1);
      } else {
        this.getSurplusInfo();
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
      if (this.current < 2) {
        this.getSettlementInfo(this.current + 1);
      } else {
        this.getSurplusInfo();
      }
    },
    // 获取结余信息
    getSurplusInfo() {
      uni.showLoading({ title: "加载中...", mask: true });
      this.$api
        .getSurplusInfo({ projectIds: this.checkboxValue,...this.inpDate })
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.showList = res.data;
          }
          uni.hideLoading();
          this.$refs.paging.endRefresh();
        })
        .catch((err) => {
          uni.hideLoading();
          this.$refs.paging.endRefresh();
        });
    },
    // 获取结算和发放信息
    getSettlementInfo(settlementType) {
      uni.showLoading({ title: "加载中...", mask: true });
      this.$api
        .getSettlementInfo({ settlementType, projectIds: this.checkboxValue,pageNum:1,pageSize:10000,...this.inpDate,objectType:this.userInfo.teamType?1:2 })
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.showList =  res.data.records
          }
          uni.hideLoading();
          this.$refs.paging.endRefresh();
        })
        .catch((err) => {
          uni.hideLoading();
          this.$refs.paging.endRefresh();
        });
    },
    sectionChange(index) {
      this.current = index;
    },
    setting(item) {
      if (item.confirmStatus === 1) {
        return;
      }
      if (this.current === 0) {
        this.content = "是否确认结算金额？";
      } else {
        this.content = "是否确认已收到发放金额？";
      }
      this.pkId = item.pkId;
      this.show = true;
    },
    startFilter() {
      if (this.current < 2) {
        this.getSettlementInfo(this.current + 1);
      } else {
        this.getSurplusInfo();
      }
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      });
      this.showFilter = false;
    },
    modalCancel() {
      this.show = false;
    },
    modalConfirm() {
      this.$store.commit("saveSettingPkId", this.pkId);
      this.getPreAuthorizeTime();
    },
    touchstart(e) {
      this.startX = e.changedTouches[0].clientX;
    },
    touchend(e) {
      let endX = e.changedTouches[0].clientX;
      if (this.startX > endX && this.startX - endX > 100) {
        if (this.current < 2) {
          this.current += 1;
          // 动画：右出左进
          this.animation
            .translateX("100%")
            .step() //先横向向右移⾄100%，即整块移没
            .opacity(0)
            .step({ duration: 10 }) //再使题⽬部分透明
            .translateX("-100%")
            .step({ duration: 10 }) //然后趁透明横向向左移⾄-100%
            .translateX(0)
            .opacity(1)
            .step(); //接着横向向右移动⾄初始位置并恢复透明度
          this.animationData = this.animation.export(); //动态动画
          // 为避免uniapp动画只有第⼀次⽣效，必须延迟删除动画实例数据
          setTimeout(() => {
            this.animationData = {};
          }, 250);
        }
      } else if (this.startX < endX && endX - this.startX > 100) {
        if (this.current > 0) {
          this.current -= 1;
          // 动画：左出右进
          this.animation
            .translateX("-100%")
            .step()
            .opacity(0)
            .step({ duration: 10 })
            .translateX("100%")
            .step({ duration: 10 })
            .translateX(0)
            .opacity(1)
            .step();
          this.animationData = this.animation.export();
          setTimeout(() => {
            this.animationData = {};
          }, 250);
        }
      }
    },
    queryList() {
      if (this.current < 2) {
        this.getSettlementInfo(this.current + 1);
      } else {
        this.getSurplusInfo();
      }
    },
    faceAuthorize() {
      uni.showLoading({
        mask: true,
      });
      let data = {
        callbackUrl: "https://erp.jianwangkeji.cn/back.html?contextId=1",
        faceauthMode: "TENCENT",
        idNo: this.userInfo.certNo,
        name: this.userInfo.realName,
        contextId: 1,
        mobile: this.userInfo.phoneNum,
      };
      this.$api
        .faceAuthorize(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.show = false;
            uni.navigateTo({
              url:
                "/pages/esign/esign?url=" +
                encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl)),
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getPreAuthorizeTime() {
      uni.showLoading({
        mask: true,
      });
      this.$api
        .getPreAuthorizeTime()
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            uni.hideLoading();
              if (res.data) {
                this.faceAuthorize();
              } else {
                request
                  .put(
                    "/app/labourSettlement/confirmSettlement?pkId=" + this.pkId
                  )
                  .then((res) => {
                    console.log("确认结算", res);
                    if (res.code === 200) {
                      uni.showToast({
                        title: res.msg,
                        icon: "success",
                        mask: true,
                      });
                      this.queryList();
                      this.modalCancel();
                    }
                  });
              }
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
  },
  watch: {
    current(val) {
      // if (val < 2) {
      //   this.getSettlementInfo(val + 1);
      // } else {
      //   this.getSurplusInfo();
      // }
      this.animation
        .translateX("100%")
        .step() //先横向向右移⾄100%，即整块移没
        .opacity(0)
        .step({ duration: 10 }) //再使题⽬部分透明
        .translateX("-100%")
        .step({ duration: 10 }) //然后趁透明横向向左移⾄-100%
        .translateX(0)
        .opacity(1)
        .step(); //接着横向向右移动⾄初始位置并恢复透明度
      this.animationData = this.animation.export(); //动态动画
      // 为避免uniapp动画只有第⼀次⽣效，必须延迟删除动画实例数据
      setTimeout(() => {
        this.animationData = {};
      }, 250);
      this.showList = [];
      this.startFilter();
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
}
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
.list1 {
  .list-item {
    position: relative;
    width: 100%;
    // height: 200rpx;
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-bottom: 1px solid #d6d7d97d;
    .item-head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;
      .date {
        font-size: 34rpx;
        font-weight: 700;
      }
      .time {
        font-size: 28rpx;
      }
    }
    .item-middle,
    .item-period {
      margin-bottom: 20rpx;
      font-size: 28rpx;
    }
    .item-bottom {
      // display: flex;
      // justify-content: space-between;
      // align-items: center;
      color: #7f7f7f;
      font-size: 24rpx;
    }
    .state {
      position: absolute;
      right: 30rpx;
      bottom: 20rpx;
      font-size: 28rpx;
    }
    .st-blue {
      color: #02a7f0;
    }
  }
}
.list2 {
  line-height: 40rpx;
  .list-item {
    position: relative;
    width: 100%;
    // height: 220rpx;
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-bottom: 1px solid #d6d7d97d;
    font-size: 26rpx;
  }
  .item-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .unit {
      width: 80%;
      font-size: 28rpx;
      font-weight: 700;
    }
    .st-red {
      color: red;
    }
  }
  // .state {
  //     position: absolute;
  //     right: 30rpx;
  //     bottom: 20rpx;
  //     font-size: 28rpx;
  //   }
  .item-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.df,
.df2 {
  display: flex;
  align-items: center;
  .iclass {
    margin-right: 40rpx;
  }
}
.df {
  margin-top: 20rpx;
}
.search {
  display: flex;
  justify-content: space-between;
  position: fixed;
  width: 100%;
  height: 60rpx;
  /*#ifdef APP-PLUS*/
  top: 166rpx;
  /*#endif*/
  /*#ifdef H5*/
  top: 88rpx;
  /*#endif*/
  z-index: 5;
  background-color: #fff;
  // margin-top: 20rpx;
  .search-left {
    width: 80%;
  }
  .search-right {
    position: relative;
    margin-right: 20rpx;
    image {
      width: 40rpx;
      margin-top: 10rpx;
    }
  }
  .filter {
    display: flex;
    align-items: center;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 60rpx;
    z-index: 2;
    width: 375rpx;
    padding: 20rpx;
    border: 1px solid #ccc;
    background-color: #fff;
  }
}
.startFilter {
  width: 120rpx;
}
.checkbox {
  margin: 20rpx;
}
.list {
   /*#ifdef APP-PLUS*/
	padding-top: 230rpx;
	/*#endif*/
	/*#ifdef H5*/
	padding-top: 160rpx;
	/*#endif*/
}
.search-datas {
  display: flex;
  align-items: center;
  height: 60rpx;

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
    // padding: 0 20rpx;
    font-size: 28rpx;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    border-radius: 6rpx;
    .left{
      display: flex;
      align-items: center;
      width: 220rpx;
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
</style>
