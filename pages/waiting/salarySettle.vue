<template>
<view class="content wrapper">
    <u-navbar
        leftText="工资结算"
        bgColor="rgb(0 0 0 / 0%)"
        leftIconColor="#fff"
        :autoBack="true"
      ></u-navbar>
      <!-- <u-empty style="height: 100%" mode="data" text="暂无数据" icon="/static/image/noData.png" /> -->
      <view class="detail">
        <view class="card">
          <view class="list-item bdb" ><view class="label">标段项目:</view> <text class="item">{{ showData.projectName }}</text> </view >
          <view class="list-item bdb" ><view class="label">服务单位:</view><text class="item">{{ showData.orgName }}</text></view>
          <view class="list-item bdb" ><view class="label">所在班组:</view><text class="item">{{ showData.teamName }}</text></view >
          <view class="list-item bdb" ><view class="label">结算周期:</view><text class="item">{{ showData.beginTime+'~'+showData.endTime }}</text></view>
          <view class="list-item bdb" ><view class="label">结算日期:</view><text class="item">{{ showData.settlementTime }}</text></view >
          <view class="list-item bdb" ><view class="label">确认金额:</view><text class="item">{{ showData.settlementAmount }}</text></view >
          <view class="list-item bdb" ><view class="label">结算人:</view><text class="item">{{ showData.createUserName }}</text></view >
          <!-- <view class="list-item bdb" ><view class="label">状态:</view><text class="item">{{ showData.settleDate }}</text></view >
          <view class="list-item bdb" ><view class="label">确认人:</view><text class="item">{{ showData.settleDate }}</text></view >
          <view class="list-item bdb" ><view class="label">确认时间:</view><text class="item">{{ showData.createTime }}</text></view > -->
        </view>
      </view>
      <view class="btn" @click="btnOk" v-if="!showData.state">确认</view>

      <u-modal
      :show="show"
      :content="'是否确认结算金额?'"
      showCancelButton
      buttonReverse
      @cancel="modalCancel"
      @confirm="modalConfirm"
    ></u-modal>
  </view>
</template>

<script>
import request from "../../common/request";
import permision from '@/common/permission.js';
export default {
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  data(){
    return{
      showData:{},
      show:false
    }
  },
  onLoad(options) {
    let obj = JSON.parse(options.row)
    this.getSettlementDetail(obj.fkBusinessId)
  },
  methods:{
    getSettlementDetail(pkId) {
      uni.showLoading({  mask: true });
      this.$api
        .getSettlementDetailtwo({ pkId })
        .then((res) => {
          if (res.code === 200) {
            this.showData = res.data;
          } else {
            uni.showToast({ icon: "none", title: res.msg, });
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title: err.msg ? err.msg : "系统内部错误",
            duration: 2000,
          });
        });
    },
    queryList(){
      this.getSettlementDetail(this.showData.pkId)
    },
    btnOk(){
      this.show = true;
    },
    modalCancel() {
      this.show = false;
    },
    modalConfirm() {
      this.$store.commit("saveSettingPkId", this.showData.pkId);
      this.getPreAuthorizeTime();
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
                    "/app/labourSettlement/confirmSettlement?pkId=" + this.showData.pkId
                  )
                  .then((res) => {
                    console.log("确认结算", res);
                    if (res.code === 200) {
                      uni.showToast({
                        title: res.msg,
                        icon: "success",
                        mask: true,
                      });
                      this.getSettlementDetail(this.showData.pkId);
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
    faceAuthorize() {
      let data = {
        callbackUrl: "https://erp.jianwangkeji.cn/back.html?contextId=1",
        faceauthMode: "TENCENT",
        idNo: this.userInfo.certNo,
        name: this.userInfo.realName,
        contextId: 1,
        mobile: this.userInfo.phoneNum,
      };
      let apis =()=>{
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
      }
    // #ifdef APP-PLUS
		uni.getSystemInfo({
		  success: res => {
			  if (res.osName === 'ios') {
          uni.showLoading({
            mask: true,
          });
			  	apis()
			  } else {
			  	permision.requestAndroidPermission('android.permission.CAMERA').then(result=>{
          if(result==1){
            uni.showLoading({
              mask: true,
            });
			  		apis()
			  	}else{
			  		uni.showModal({
			  			title: '提示',
			  			content: '需要相机权限才能进行下一步操作，是否打开？',
			  			showCancel: true,
			  			success: ({ confirm, cancel }) => {
			  				if (confirm) {
			  				console.log('用户点击确定');
			  				permision.gotoAppPermissionSetting('camera')
			  				} else if (cancel) {
			  					console.log('用户点击取消');
			  				}
			  			}
			  		})
			  	}
          });
			  }
		  }
		});
		// #endif
    },
  }
}
</script>

<style lang="scss" scoped>
.card {
  background: #fff;
  // border-left: 8rpx solid #dddddd;
  padding: 24rpx 40rpx;
  margin-top: 2rpx;
  .list-item {
    display: flex;
    height: 64rpx;
    line-height: 64rpx;
    font-size: 28rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .label{
      width: 150rpx;
    }
    .item {
      padding-left: 10rpx;
      color: #79859a;
    }
  }
  .imgs{
    width: 670rpx;
  }
}
.mb-20{
  margin-bottom: 20rpx;
}
.bdb{
  border-bottom: 1px solid #d9d9d9;
}
</style>