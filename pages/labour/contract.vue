<template>
  <view class="wrapper">
    <u-navbar
      leftText="劳务合同"
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
    </view>
    <view class="pad"></view>
    <!-- <view
      :animation="animationData"
      @touchstart="touchstart"
      @touchend="touchend"
      :style="{ height: current !== 3 ? '88vh' : 'calc(88vh - 100rpx)' }"
    > -->
      <u-list
        :height="current !== 3 ? '88vh' : 'calc(88vh - 100rpx)'"
        @scrolltolower="scrolltolower"
      >
        <u-list-item v-for="(item, index) in showList" :key="index">
          <u-cell isLink class="cell" @click="cellClick(item)">
            <view slot="title">
              <view class="cell-item mb-20">
                <h3 class="cell-item-title">{{current !== 3?item.contractName:item.templateName}}</h3>
                <view class="state" v-if="current !== 3">
                  <!-- clock-fill  checkmark-circle-fill-->
                  <view class="state-item mr-20"
                    ><view>甲方</view>
                    <u-icon
                      :name="!item.nailState ? 'clock-fill' : 'checkmark-circle-fill'"
                      :color="!item.nailState ? '#2979ff' : '#16c4af'"
                      size="15"
                    ></u-icon
                  ></view>
                  <view class="state-item"
                    >乙方
                    <u-icon
                      :name="!item.bstate ? 'clock-fill' : 'checkmark-circle-fill'"
                      :color="!item.bstate ? '#2979ff' : '#16c4af'"
                      size="15"
                    ></u-icon
                  ></view>
                </view>
                <view class="state" v-else>{{ item.enableStatus===1 ? "禁用" :item.enableStatus===2? "正常":'' }}</view>
              </view>
              <view class="cell-item mb-20 grey" v-if="current !== 3"
                >合同对象：{{item.userName}}</view
              >
              <view class="cell-item grey" v-if="current !== 3">
                <view>所在班组：{{item.teamName}}</view>
                <view class="state" v-if="current === 2">{{typeList[item.contractStatus]}}</view>
              </view>
              <view class="cell-item grey" v-if="current === 3"
                >模板类型：{{item.contractType===1?'入职合同':'定向邀签'}}</view
              >
            </view>
          </u-cell>
        </u-list-item>
      </u-list>
    <!-- </view> -->
    <view class="btn" v-if="current === 3" @click="addContract">新增合同模板</view>
    <u-modal :show="modshow" title="提示" :content='modcontent' :showCancelButton="true" :showConfirmButton="showConfirmButton" :confirmText="confirmText" @confirm="modconfirm" @cancel="modshow=false"></u-modal>
  </view>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.userInfo;
    },
  },
  data() {
    return {
      topList: ["已签合同", "未完成合同", "失效合同", "合同模板"],
      current: 0,
      showList: [],
      total:0,
      pageNum:1,
      animationData: {},
      height: "",
      startX: "",
      refreshIfNeeded:false,
      typeList:['生效', '失效','待生效', '已作废','解约中','已解约'],
      modshow:false,
      modcontent:'',
      showConfirmButton:false,
      confirmText:""
    };
  },
  onLoad(options) {
    // this.animation = uni.createAnimation({
    //   timingFunction: "ease",
    //   duration: 120,
    // });
    if (this.user.orgType === 7) {
      this.topList = ["已签合同", "未完成合同", "失效合同", "合同模板"];
    } else {
      this.topList = ["已签合同", "未完成合同"];
    }
    this.searchLabourContractPage()
  },
  onShow() {
    // let pages = getCurrentPages(); // 获取当前页面栈
    // let currentPage = pages[pages.length - 1]; // 当前页面
    if (this.refreshIfNeeded) {
      this.refreshIfNeeded = false;
      if(this.current<3){
        this.searchLabourContractPage()
      }else{
        this.searchContractTemplatePage()
      }
      // this.mescroll.resetUpScroll(); // 调用列表重置刷新页面
      // this.mescroll.scrollTo(0,0); // 滚动页面置顶
    }
  },
  methods: {
    searchLabourContractPage(){
      let data={
         pageNum:this.pageNum,
        pageSize:20,
        contractStatus:this.current===0?0:this.current===1?2:this.current===2?1:'',
        fkProjectBidId:[5,7].includes(this.user.orgType) ? "" : uni.getStorageSync("nowProId")
      }
      uni.showLoading({ mask: true })
      this.$api.searchLabourContractPage(data).then(res=>{
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
    searchContractTemplatePage(){
      let data={
         pageNum:this.pageNum,
        pageSize:20,
      }
      uni.showLoading({ mask: true })
      this.$api.searchContractTemplatePage(data).then(res=>{
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
    sectionChange(index) {
      this.current = index;
      this.showList=[]
      this.pageNum=1
      if(index<3){
        this.searchLabourContractPage()
      }else{
        this.searchContractTemplatePage()
      }
    },
    scrolltolower() {
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
      if(this.current<3){
        this.searchLabourContractPage()
      }else{
        this.searchContractTemplatePage()
      }
    },
    cellClick(item){
      if(this.current!==3){
        uni.navigateTo({ url: `/pages/labour/contractDetail?data=${JSON.stringify(item)}&current=${this.current}` })
      }else{
        uni.navigateTo({ url: `/pages/labour/contractSign?type=2&data=${JSON.stringify(item)}` })
      }
    },
    modconfirm(){
      if(this.confirmText=='前往实名'){
        this.modshow=false
        uni.navigateTo({url:'/pages/certification/business-certification'})
      }else if(this.confirmText=='前往授权'){
        uni.showLoading({mask:true})
        this.$api.authorization("https://erp.jianwangkeji.cn/back.html").then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						this.$store.commit("isEnterAuth", true);
            this.modshow=false
						uni.navigateTo({
							url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl)),
						});
					} else {
						uni.hideLoading();
					}
				}).catch(err=>{
          uni.hideLoading();
        });
      }
    },
    addContract(){
      this.$api.getOrgSealState().then(res=>{
        if(res.code===200){
          if(res.data==1){
            uni.navigateTo({ url: `/pages/labour/contractSign?type=1` })
          }else{
            if(this.user.isMaster){
              if(res.data==0){
                this.modcontent='企业未实名'
                this.confirmText="前往实名"
              }else if(res.data==2){
                this.modcontent='E签宝授权已过期'
                this.confirmText="前往授权"
              }
              this.showConfirmButton=true
            }else{
              if(res.data==0){
                this.modcontent='企业未实名，请联系管理员进行实名'
              }else if(res.data==2){
                this.modcontent='企业授权已过期，请联系管理员进行授权'
              }
              this.showConfirmButton=false
            }
            this.modshow=true
          }
        }else{
          uni.showToast({title:res.msg,icon:"none"})
        }
      })
    },
    // touchstart(e) {
    //   this.startX = e.changedTouches[0].clientX;
    // },
    // touchend(e) {
    //   let endX = e.changedTouches[0].clientX;
    //   if (this.startX > endX && this.startX - endX > 100) {
    //     if (this.current < this.topList.length - 1) {
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
    //       // this.showList = [];
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
    //       // this.showList = [];
    //     }
    //   }
    // },
  },
  // watch: {
  //   current(val) {
  //     // this.getContractList(val);
  //     this.animation
  //       .translateX("100%")
  //       .step() //先横向向右移⾄100%，即整块移没
  //       .opacity(0)
  //       .step({ duration: 10 }) //再使题⽬部分透明
  //       .translateX("-100%")
  //       .step({ duration: 10 }) //然后趁透明横向向左移⾄-100%
  //       .translateX(0)
  //       .opacity(1)
  //       .step(); //接着横向向右移动⾄初始位置并恢复透明度
  //     this.animationData = this.animation.export(); //动态动画
  //     // 为避免uniapp动画只有第⼀次⽣效，必须延迟删除动画实例数据
  //     setTimeout(() => {
  //       this.animationData = {};
  //     }, 250);
  //   },
  // },
};
</script>

<style lang="scss" scoped>
.pad {
  margin-top: 60rpx;
}
.cell {
  background-color: #fff;
  .cell-item {
    display: flex;
    justify-content: space-between;
    font-size: 26rpx;
    .cell-item-title {
      width: 450rpx;
      overflow: hidden;
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
    }
    .state {
      display: flex;
      .state-item {
        display: flex;
      }
    }
    .grey {
      color: #7f7f7f;
    }
  }
}
.mb-20 {
  margin-bottom: 20rpx;
}
.mr-20 {
  margin-right: 20rpx;
}
</style>
