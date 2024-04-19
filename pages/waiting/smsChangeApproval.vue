<template>
<view class="content wrapper">
    <u-navbar
        leftText="短信变动审批"
        bgColor="rgb(0 0 0 / 0%)"
        leftIconColor="#fff"
        :autoBack="true"
      ></u-navbar>
      <!-- <u-empty style="height: 100%" mode="data" text="暂无数据" icon="/static/image/noData.png" /> -->
      <view class="detail">
        <view class="card">
          <view class="list-item bdb" >企业名称: <text class="item">{{ showData.orgName }}</text> </view >
          <view class="list-item bdb">管理员账号:<text class="item">{{ showData.managerMobile }}</text></view>
          <view class="list-item bdb" >剩余短信：<text class="item">{{'赠送'+ showData.residueGiveNum+'条 + 充值'+showData.residueRechargeNum+'条' }}</text></view >
          <view v-if="showData.approvalType===1">
            <view class="list-item bdb" >申请赠送短信：<text class="item">{{ showData.num +'条'}}</text></view >
            <view class="list-item bdb"> 赠送原因：<text class="item">{{ showData.reason }}</text></view >
          </view>
          <view v-if="showData.approvalType===2">
            <view class="list-item bdb">充值金额:<text class="item" >{{ showData.amount +'元'}}</text ></view>
            <view class="list-item bdb">充值短信:<text class="item" >{{ showData.num +'条'}}</text ></view>
            <view class="list-item bdb">充值方式:<text class="item" >{{ showData.paymentCode }}</text ></view>
            <view class="list-item">充值凭证:</view>
            <image :src="item.enclosureUrl" mode="widthFix" class="imgs" v-for="(item,index) in showData.enclosures" :key="index"/>
          </view>
        </view>
        <view class="states " :class="showData.approvalStatus===1?'green':'red'" v-if="showData.approvalStatus&&showData.approvalStatus!=0">
          <view class="state">{{showData.approvalStatus===1?'审批通过':'审批不通过'}}</view>
        </view>
      </view>
      <view class="pdb" v-if="showData.approvalStatus===0"></view>
      <view class="btn" @click="approveBtn" v-if="showData.approvalStatus===0">处理</view>
      <u-popup :show="appShow" mode="center" round="10">
        <view class="pop">
          <view class="pop-head">
            <view class="approve-title">审批意见</view>
					  <u-icon @click="closePop" class="approve-closeBtn" name="close-circle" size="18" color="#ff0000"></u-icon>
          </view>
          <u--textarea v-model="opinion" height='100' placeholder="请输入审批意见" class="mb-20"></u--textarea>
          <view class="pop-btns">
            <view class="btns blue" @click="btnOk(1)">审批通过</view>
            <view class="btns red" @click="btnOk(2)">审批不通过</view>
          </view>
        </view>
      </u-popup>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    let data= JSON.parse(options.row)
    this.findSmsRechargeByPkId(data.fkBusinessId)
  },
    data(){
      return{
        showData:{},
        appShow:false,
        opinion:""
      }
    },
    methods:{
      findSmsRechargeByPkId(pkId){
        this.$api.findSmsRechargeByPkId({pkId}).then(res=>{
          if(res.code===200){
            this.showData=res.data
          }else{
            uni.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
      },
      approveBtn(){
        this.appShow=true
      },
      btnOk(approvalStatus){
        console.log(approvalStatus);
        let data={
        	approvalReason: this.opinion,
        	approvalStatus,
        	pkId: this.showData.pkId
        }
        if(!data.approvalReason){
          if(approvalStatus===2){
            data.approvalReason='审批通过'
          }else if(approvalStatus===3){
            data.approvalReason='审批不通过'
          }
        }
        this.$api.approveSmsRecharge(data).then(res=>{
            if(res.code===200){
              uni.showToast({ title: '审批成功', icon: 'success' })
              uni.navigateBack({ delta: 1 })
              // this.findSmsRechargeByPkId(this.showData.pkId)
              // this.closePop()
            }else{
              uni.showToast({ title: res.msg, icon: 'none' })
            }
        })
      },
      closePop(){
        this.opinion=''
        this.appShow=false
      }
    }
}
</script>

<style lang="scss" scoped>
.pdb{
  height: 100rpx;
}
.detail{
  position: relative;
  .states{
    position: absolute;
    top: 40rpx;
    right: 20rpx;
    width: 150rpx;
    height: 150rpx;
    border-radius: 50%;
    .state{
      position: absolute;
      top: 30%;
      left: 0;
      transform: rotate(-25deg);
      width: 150rpx;
      padding: 10rpx 0;
      background-color: #fff;
      text-align: center;
    }
  }
  .green{
    background-color: #caf982;
    .state{
      color: #7dcc06;
      border: 1px solid #7dcc06;
    }
  }
  .red{
    background-color: #ec808d;
    .state{
      font-size: 28rpx;
      color: #f32840;
      border: 1px solid #f32840;
    }
  }
}
.card {
  background: #fff;
  // border-left: 8rpx solid #dddddd;
  padding: 24rpx 40rpx;
  margin-top: 2rpx;
  .list-item {
    height: 64rpx;
    line-height: 64rpx;
    font-size: 28rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .item {
      padding-left: 10rpx;
      color: #79859a;
    }
  }
  .imgs{
    width: 670rpx;
  }
}
.pop{
  width: 600rpx;
  padding: 0 20rpx 20rpx;
  border-radius: 20rpx;
  background-color: #fff;
  .pop-head{
    position: relative;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 20rpx;
    .approve-title {
      text-align: center;
			// font-size: 28rpx;
		}
		.approve-closeBtn {
			position: absolute;
			right: 20rpx;
			top: 50%;
			transform: translateY(-50%);
		}
  }
  .pop-btns{
    display: flex;
    justify-content: space-evenly;
    .btns{
      padding: 15rpx 30rpx;
      border-radius: 10rpx;
      color: #fff;
      font-size: 26rpx;
    }
    .blue{
      background-color: #169bd5;
    }
    .red{
      background-color: #e34155;
    }
  }
}
.mb-20{
  margin-bottom: 20rpx;
}
.bdb{
  border-bottom: 1px solid #d9d9d9;
}
</style>