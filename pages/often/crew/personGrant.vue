<template>
  <view class="content wrapper">
    <u-navbar leftText="班组人员发放" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="search" ref="search">
      <view class="search-left" >
        <!-- <u-subsection :list="topList" mode="subsection" :current="current" @change="sectionChange" ></u-subsection > -->
        <!-- <view class="search-datas">
              <view class="data-input" @click="openCale(1)">
                {{ inpDate.beginTime }}
                <view class="closeBtn" @click.native.stop="cleanDate(1)">X</view>
              </view>
              <view class="to">至</view>
              <view class="data-input" @click="openCale(2, inpDate.endTime)">
                {{ inpDate.endTime }}
                <view class="closeBtn" @click.native.stop="cleanDate(2)">X</view>
              </view>
            </view> -->
          <u-input class="input" v-model="input" placeholder="班组或服务单位名称" maxlength="50">
            <view slot="suffix">
                  <u-icon name="search" size="28" @click="inpChange" color="#2a82e4"></u-icon>
            </view>
        </u-input>
      </view>
      <view class="search-right">
        <image
          src="../../../static/image/u486.png"
          mode="widthFix"
          @click="showFilter = !showFilter"
        />
      </view>
      <view class="filter" v-if="showFilter">
        <view class="toolip">请选择查询标段项目</view>
        <uni-data-select
            style="margin: 20rpx;"
            v-model="checkboxValue"
            :localdata="checkboxList"
            :clear="false"
            @change="selChange"
          >
          </uni-data-select>
          <view v-show="!!checkboxValue">
          <view class="toolip" style="text-align:center">请选择班组</view>
          <view class="checkbox">
            <u-checkbox-group v-model="checkboxValue2" placement="column">
             <u-checkbox
                :customStyle="{ marginBottom: '20rpx' }"
                v-for="item in checkboxList2"
                :key="item.pkId"
                :label="item.teamName"
                :name="item.pkId"
              >
              </u-checkbox>
            </u-checkbox-group>
        </view>
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
      <!-- <view
        :animation="animationData"
        @touchstart="touchstart"
        @touchend="touchend"
        :style="{ height: height + 'px' }"
      > -->
        <view class="list2" v-if="showList.length">
          <view
            class="list2-item"
            v-for="item in showList"
            :key="item.pkId"
            @click="go(item, 2)"
          >
            <view class="date">
              {{ item.settlementTime ? item.settlementTime : "  -  -" }}
            </view>
            <view class="period" v-if="current === 1">
              结算周期：{{ item.beginTime }}~{{ item.endTime }}
            </view>
            <view class="unit">服务单位：{{ item.orgName }}</view>
            <view class="iclass">所在班组：{{ item.className }}</view>
            <view class="money"
              >{{ topList[current] }}金额：￥{{ item.settlementAmount }}</view
            >
            <view class="people">合计人数：{{ item.peopleNum }}人</view>
            <view class="time">
              第{{ item.settlementNum }}次{{ topList[current] }}
            </view>
            <view class="affirm">
              <view class="ok">已确认{{ item.settlementPeopleNum }}人</view>
              <view class="botok st-red">
                未确认{{ item.noSettlementPeopleNum }}人
              </view>
            </view>
            <view class="arrows">
              <image src="../../../static/image/u242.png" mode="widthFix" />
            </view>
          </view>
        </view>
        <u-empty
          style="height: 100%"
          mode="data"
          icon="/static/image/noData.png"
          v-if="!showList.length"
        >
        </u-empty>
      <!-- </view> -->
    </z-paging>

    <view class="add" v-if="current > 0">
      <u-button
        @click="go({}, 1)"
        type="primary"
        :text="`新增${current === 1 ? '结算' : '发放'}`"
      >
      </u-button>
    </view>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm"/>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    this.animation = uni.createAnimation({
      timingFunction: "ease",
      duration: 120,
    });
    let winHeight = uni.getWindowInfo().windowHeight;
    if (process.env.UNI_PLATFORM == "h5") {
      this.height = winHeight;
    } else {
      this.height = (winHeight / 750) * (winHeight - 60);
    }
    // this.getTeamMembersInfo();
    this.getProjects();
  },
  onShow() {
    if (this.current > 0) {
      this.getTeamSettlementInfo();
    } else {
      this.getTeamMembersInfo();
    }
  },
  data() {
    return {
      topList: ["人员管理", "结算", "发放"],
      current:2,
      showList: [],
      input:"",
      showFilter: false,
      checkboxValue: "",
      checkboxValue2: [],
      checkedIds: [],
      checkboxList: [{text:'全部',value:""}],
      checkboxList2:[],
      height: "",
      animationData: {},
      oprateShow: false,
      inpDate:{
        beginTime:"",
        endTime:""
      },
      timer:"",
      input:"",
      search:{
        fkOrgId:"",
        teamIds:"",
      }
    };
  },
  methods: {
    selChange(e){
      this.checkboxValue2=[]
      if(e){
        this.labourTeamSearch(e)
      }
    },
    // 获所有任职过的项目
    getProjects() {
      uni.showLoading({ title: "加载中...", mask: true });
      this.$api
        .getProjects({isSupervisor:1})
        .then((res) => {
          if (res.code === 200) {
            this.checkboxList = res.data ? [{text:'全部',value:""},...res.data.map(item=>({...item,text:item.projectName,value:item.fkOrgId}))]: [{text:'全部',value:""}];
          } else {
            uni.showToast({
              icon: "error",
              title: res.msg,
              duration: 2000,
            });
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    // 获取班组
    labourTeamSearch(projectOrgId){
      uni.showLoading({ title: "加载中...", mask: true });
      this.$api
        .labourTeamSearch({projectOrgId})
        .then((res) => {
          if (res.code === 200) {
            this.checkboxList2 = res.data ? res.data:[];
          } else {
            uni.showToast({
              icon: "error",
              title: res.msg,
              duration: 2000,
            });
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    // 获取人员信息列表
    getTeamMembersInfo() {
      uni.showLoading({ title: "加载中...", mask: true });
      this.$api
        .getTeamMembersInfo({ fkOrgId: this.checkboxValue})
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.showList = res.data
              ? res.data.map((item) => ({ ...item, operate: false }))
              : [];
          } else {
            uni.showToast({
              icon: "error",
              title: res.msg,
              duration: 2000,
            });
          }
          uni.hideLoading();
          this.$refs.paging.endRefresh();
        })
        .catch((err) => {
          uni.hideLoading();
          this.$refs.paging.endRefresh();
        });
    },
    // 获取结算/发放列表
    getTeamSettlementInfo() {
      let data={ ...this.search,keyWord:this.input,settlementType: this.current, }
      uni.showLoading({ title: "加载中...", mask: true });
      this.$api
        .getTeamSettlementInfo(data)
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.showList = res.data ? res.data : [];
          } else {
            uni.showToast({
              icon: "error",
              title: res.msg,
              duration: 2000,
            });
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
    checkboxChange(e) {
      let arr = [];
      this.checkboxList.forEach((item) => {
        e.forEach((item2) => {
          if (item.name == item2) {
            arr.push(item.id);
          }
        });
      });
      this.checkedIds = arr;
    },
    startFilter() {
      this.search={
        fkOrgId: this.checkboxValue,
        teamIds:this.checkboxValue2
      }
      if (this.current > 0) {
        this.getTeamSettlementInfo();
      } else {
        this.getTeamMembersInfo();
      }
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      });
      this.showFilter = false;
    },
    go(item, type) {
      if (this.current === 0) {
        uni.navigateTo({
          url: "/pages/often/account?obj=" + JSON.stringify(item),
        });
      } else {
        uni.navigateTo({
          url: `/pages/often/crew/setting?obj=${JSON.stringify(
            item
          )}&type=${type}&current=${this.current}`,
        });
      }
    },
    queryList() {
      if (this.current > 0) {
        this.getTeamSettlementInfo();
      } else {
        this.getTeamMembersInfo();
      }
    },
    cleanDate(e) {
      console.log(e);
      if (e == 1) {
        this.inpDate.beginTime = "";
      } else {
        this.inpDate.endTime = "";
      }
      if (this.current > 0) {
        this.getTeamSettlementInfo();
      } else {
        this.getTeamMembersInfo();
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
      if (this.current > 0) {
        this.getTeamSettlementInfo();
      } else {
        this.getTeamMembersInfo();
      }
    },
    // 离职/辞退
    dimission(row) {
      console.log(row);
      row.operate = false;
      let type = null;
      if (row.dismissalStatus === 2) {
        type = 3;
      } else {
        type = 2;
      }
      uni.navigateTo({ url: "/pages/often/dimission?type="+type +'&obj='+JSON.stringify(row)});
    },
    inpChange(e) {
      this.queryList()
    },
  },
};
</script>

<style lang="scss" scoped>
uni-page-body {
  height: 100%;
}
* {
  box-sizing: border-box;
}
.content {
  height: 100%;

  // padding-bottom: 84rpx;
}
.list{
  padding-top: 240rpx;
}
.list1,
.list2 {
  padding-bottom: 84rpx;
}
.df {
  display: flex;
  align-items: center;
  .iclass {
    margin-right: 40rpx;
  }
}
.search {
  background-color: #fff;
  position: fixed;
  width: 100%;
  /*#ifdef APP-PLUS*/
	top: 166rpx;
	/*#endif*/
	/*#ifdef H5*/
	top: 88rpx;
	/*#endif*/
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  //   padding: 20rpx 0;
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
    top: 80rpx;
    z-index: 2;
    width: 375rpx;
    padding: 20rpx;
    border: 1px solid #ccc;
    background-color: #fff;
  }
}
.startFilter {
  width: 180rpx;
}
.checkbox {
  margin: 20rpx;
}
.list1-item {
  position: relative;
  padding: 10rpx 20rpx;
  background-color: #fff;
  border-bottom: 1px solid #f2f2f2;
  view {
    margin-bottom: 18rpx;
    font-size: 28rpx;
  }
  .name {
    font-size: 32rpx;
    font-weight: 700;
  }
  .item-bottom {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
  }
  .iclass,
  .money {
    margin-bottom: 0;
  }
  .state {
    position: absolute;
    top: 20rpx;
    right: 70rpx;
    display: flex;
    align-items: center;
    z-index: 5;
    margin-bottom: 0;
  }
  .operation {
    position: absolute;
    top: 16rpx;
    right: 20rpx;
    margin-bottom: 0;
    .operate {
      position: absolute;
      width: 132rpx;
      bottom: -46rpx;
      left: -108rpx;
      margin-bottom: 0;
      padding: 10rpx;
      text-align: center;
      background-color: #d7d7d7;
      z-index: 5;
    }
  }
}
.list2-item {
  position: relative;
  padding: 10rpx 20rpx;
  background-color: #fff;
  border-bottom: 1px solid #f2f2f2;
  view {
    margin-bottom: 18rpx;
    font-size: 28rpx;
  }
  .date {
    font-size: 34rpx;
    font-weight: 700;
  }
  .people {
    margin-bottom: 0;
  }
  .time {
    position: absolute;
    right: 20rpx;
    top: 20rpx;
  }
  .affirm {
    position: absolute;
    text-align: right;
    right: 20rpx;
    bottom: -24rpx;
  }
}
.st-red {
  color: red;
}
.arrows {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  image {
    width: 40rpx;
    transform: rotate(180deg);
  }
}
.add {
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 2;
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
.input {
  background-color: #fff;
  height: 54rpx;
}
</style>
