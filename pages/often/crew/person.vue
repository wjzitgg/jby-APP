<template>
  <view class="content wrapper">
    <u-navbar leftText="班组人员管理" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="search" ref="search">
      <view class="search-left">
        <!-- suffixIcon="search"
          suffixIconStyle="color: #909399" -->
        <u-input class="input" v-model="input" placeholder="工人姓名"  maxlength="25">
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
            <u-checkbox-group v-model="checkboxValue3" placement="column">
              <u-checkbox
                :customStyle="{ marginBottom: '20rpx' }"
                v-for="item in checkboxList3"
                :key="item.pkId"
                :label="item.teamName"
                :name="item.pkId"
              >
              </u-checkbox>
            </u-checkbox-group>
        </view>
        </view>
        <view class="toolip">请选择查询人员</view>
        <view class="checkbox">
          <u-checkbox-group v-model="checkboxValue2" placement="row">
            <u-checkbox
              :customStyle="{ marginBottom: '20rpx',transform:'scale(0.8)' }"
              v-for="item in checkboxList2"
              :key="item.value"
              :label="item.label"
              :name="item.value"
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
      <!-- <view
        :animation="animationData"
        @touchstart="touchstart"
        @touchend="touchend"
        :style="{ height: height + 'px' }"
      > -->
        <view class="list1" v-if="current === 0 && showList.length">
          <view
            class="list1-item"
            v-for="item in showList"
            :key="item.pkId"
          >
            <view class="name" @click="checkDetail(item)"
              >姓名：<span class="name-content" style="color: #02a7f0;">{{item.memberName}} <view class="redDot" v-if="item.userStatus == 0"></view></span>
              <span style="font-weight:500;color:#ccc;">{{ (item.userStatus == 2 ? "(已离职)" : "") }}</span>
              </view >
            <view @click="go(item)">
            <view class="project">施工项目：{{ item.projectName }}</view>
            <view class="unit">服务单位：{{ item.orgName }}</view>
            <view class="date">
              服务时间：{{ item.inductionTime }} ~
              {{ item.resignationTime ? item.resignationTime : "至今" }}
            </view>
            <view class="item-bottom">
              <view class="iclass">所在班组：{{ item.className }}</view>
              <view class="money" v-if="item.surplusAmount">
                结余金额：￥{{ item.surplusAmount }}
              </view>
            </view>
            <view class="state" :class="{ 'st-red': item.surplusAmount }">
              {{ !item.surplusAmount ? "已结清" : "未结清" }}
            </view>
            </view>
            <!-- <view class="operation">
              <image
                src="../../../static/image/u1024.png"
                mode="widthFix"
                style="width: 36rpx"
                v-if="
                  item.dismissalStatus === 0 ||
                  (item.dismissalStatus === 2 && item.consentStatus === 0)||
                  !item.dismissalStatus
                "
                @click.stop="item.operate = !item.operate"
              />
              <view
                class="operate"
                v-if="item.operate"
                @click.stop="dimission(item)"
                >{{ !item.dismissalStatus? "辞退" : "同意离职" }}</view
              >
            </view> -->
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
      current: 0,
      input:"",
      list:[],
      showList: [],
      showFilter: false,
      search:{
        fkOrgId:"",
        staffStatus:""
      },
      checkboxValue: "",
      checkboxValue2: [],
      checkboxValue3:[],
      checkedIds: [],
      checkboxList: [{text:'全部',value:""}],
      checkboxList2:[{label:'在职人员',value:1},{label:'离职人员',value:0}],
      checkboxList3:[],
      height: "",
      animationData: {},
      oprateShow: false,
      timer:null
    };
  },
  methods: {
    checkDetail(item){
      console.log('查看个人详情');
      uni.navigateTo({url:"/pages/often/crew/info?row=" + JSON.stringify(item)})
    },
    selChange(e){
      this.checkboxValue3=[]
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
            this.checkboxList3 = res.data ? res.data:[];
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
      let data={ ...this.search,staffName:this.input }
      uni.showLoading({ title: "加载中...", mask: true });
      this.$api
        .getTeamMembersInfo(data)
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.showList = res.data
              ? res.data.map((item) => ({ ...item, operate: false }))
              : [];
               this.list= res.data
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
      uni.showLoading({ title: "加载中...", mask: true });
      this.$api
        .getTeamSettlementInfo({
          fkOrgId: this.checkboxValue,
          settlementType: this.current,
        })
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
        staffStatus: this.checkboxValue2.length===1?this.checkboxValue2[0]:'',
        teamIds:this.checkboxValue3
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
        console.log(item);
        uni.navigateTo({
          url: "/pages/often/account?obj=" + JSON.stringify(item),
        });
      } else {
        uni.navigateTo({
          url: `/pages/often/setting?obj=${JSON.stringify(
            item
          )}&type=${type}&current=${this.current}`,
        });
      }
    },
    // touchstart(e) {
    //   this.startX = e.changedTouches[0].clientX;
    // },
    // touchend(e) {
    //   let endX = e.changedTouches[0].clientX;
    //   if (this.startX > endX && this.startX - endX > 100) {
    //     if (this.current < 2) {
    //       this.current += 1;
    //       // 动画：右出左进
    //       this.animation
    //         .translateX("100%")
    //         .step() //先横向向右移⾄100%，即整块移没
    //         .opacity(0)
    //         .step({ duration: 10 }) //再使题⽬部分透明
    //         .translateX("-100%")
    //         .step({ duration: 10 }) //然后趁透明横向向左移⾄-100%
    //         .translateX(0)
    //         .opacity(1)
    //         .step(); //接着横向向右移动⾄初始位置并恢复透明度
    //       this.animationData = this.animation.export(); //动态动画
    //       // 为避免uniapp动画只有第⼀次⽣效，必须延迟删除动画实例数据
    //       setTimeout(() => {
    //         this.animationData = {};
    //       }, 250);
    //     }
    //   } else if (this.startX < endX && endX - this.startX > 100) {
    //     if (this.current > 0) {
    //       this.current -= 1;
    //       // 动画：左出右进
    //       this.animation
    //         .translateX("-100%")
    //         .step()
    //         .opacity(0)
    //         .step({ duration: 10 })
    //         .translateX("100%")
    //         .step({ duration: 10 })
    //         .translateX(0)
    //         .opacity(1)
    //         .step();
    //       this.animationData = this.animation.export();
    //       setTimeout(() => {
    //         this.animationData = {};
    //       }, 250);
    //     }
    //   }
    // },
    queryList() {
      if (this.current > 0) {
        this.getTeamSettlementInfo();
      } else {
        this.getTeamMembersInfo();
      }
    },
    inpChange(e) {
      this.queryList()
      // clearTimeout(this.timer)
      // this.input = e;
      // this.timer = setTimeout(()=>{
        // this.queryList()
      // },500)
    },
    // 离职/辞退
    dimission(row) {
      console.log(row);
      row.operate = false;
      let type = null;
      if (row.dismissalStatus === 2) {
        type = 3;
        if(!row.surplusAmount){
        uni.navigateTo({ url: "/pages/often/dimission?type="+type +'&obj='+JSON.stringify(row)});
        }else{
           uni.showModal({
              title: '提示',
              content: "有未结算完成的工资，是否继续同意辞职？",
              showCancel: true,
              success: ({ confirm, cancel }) => {
                if(confirm){
                  uni.navigateTo({ url: "/pages/often/dimission?type="+type +'&obj='+JSON.stringify(row)});
                }
              }
            })
        }
      } else {
        type = 2;
        uni.navigateTo({ url: "/pages/often/dimission?type="+type +'&obj='+JSON.stringify(row)});
      }
    },
  },
  // watch: {
  //   current(val, oldval) {
  //     if (val > oldval) {
  //       this.animation
  //         .translateX("100%")
  //         .step() //先横向向右移⾄100%，即整块移没
  //         .opacity(0)
  //         .step({ duration: 10 }) //再使题⽬部分透明
  //         .translateX("-100%")
  //         .step({ duration: 10 }) //然后趁透明横向向左移⾄-100%
  //         .translateX(0)
  //         .opacity(1)
  //         .step(); //接着横向向右移动⾄初始位置并恢复透明度
  //       this.animationData = this.animation.export(); //动态动画
  //       // 为避免uniapp动画只有第⼀次⽣效，必须延迟删除动画实例数据
  //       setTimeout(() => {
  //         this.animationData = {};
  //       }, 250);
  //     } else {
  //       this.animation
  //         .translateX("-100%")
  //         .step()
  //         .opacity(0)
  //         .step({ duration: 10 })
  //         .translateX("100%")
  //         .step({ duration: 10 })
  //         .translateX(0)
  //         .opacity(1)
  //         .step();
  //       this.animationData = this.animation.export();
  //       setTimeout(() => {
  //         this.animationData = {};
  //       }, 250);
  //     }
  //     this.startFilter();
  //   },
  // },
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
    width: 60%;
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
    top: 8%;
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
    .name-content{
      position: relative;
    }
  }
  .redDot{
    position: absolute;
    top: 6rpx;
    right: -10rpx;
    width: 8rpx;
    height: 8rpx;
    background-color: red;
    border-radius: 50%;
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
.input {
  background-color: #fff;
  height: 54rpx;
}
</style>
