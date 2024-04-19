<template>
<view class="content wrapper">
    <u-navbar
        leftText="续费审批"
        bgColor="rgb(0 0 0 / 0%)"
        leftIconColor="#fff"
        :autoBack="true"
      ></u-navbar>
      <!-- <u-empty style="height: 100%" mode="data" text="暂无数据" icon="/static/image/noData.png" /> -->
      <view class="detail">
        <view class="card">
          <view class="list-item bdb" > 用户名称: <text class="item">{{ showData.accountName }}</text> </view>
          <view class="list-item bdb">管理员账号:<text class="item">{{ showData.telephone }}</text></view>
          <view class="list-item bdb" >账号类型：<text class="item">{{ getOrgName(showData.orgType) }}</text></view >
          <view class="list-item bdb" >续期至:<text class="item" >{{ showData.renewalDate }}</text ></view >
          <view class="list-item">续期凭证:</view>
          <image :src="showData.proofUrl" mode="widthFix" class="imgs" />
        </view>
        <view class="states " :class="showData.approveStatus===1?'green':'red'" v-if="!!showData.approveStatus">
          <view class="state">{{showData.approveStatus===1?'审批通过':'审批不通过'}}</view>
        </view>
      </view>
      <view class="pdb" v-if="showData.approveStatus==0"></view>
      <view class="btn" @click="approveBtn" v-if="showData.approveStatus==0">处理</view>
      
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
    this.getData={
      ...data,
      type:options.type-0
    }
    this.findRenewalByPkId(data.fkBusinessId,options.type-0)
  },
    data(){
      return{
        getData:{},
        showData:{},
        appShow:false,
        opinion:""
      }
    },
    methods:{
      findRenewalByPkId(pkId,type){
        this.$api.findRenewalByPkId({pkId,type}).then((res) => {
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
      btnOk(approveStatus){
        console.log(approveStatus);
        let data={approveStatus,renewalId:this.showData.pkId,remark:this.opinion}
        if(!data.remark){
          if(approveStatus===1){
            data.remark='审批通过'
          }else{
            data.remark='审批不通过'
          }
        }
        this.$api.approveRenewal(data).then(res=>{
            if(res.code===200){
              let pages = getCurrentPages()
      	      let prevPage = pages[pages.length - 2]; // 上一页面实例
      	      prevPage.$vm.resh() // 调用上一页 定义的方法
              uni.navigateBack({ delta: 1 })
              uni.showToast({ title: '审批成功', icon: 'success' })
              // this.findRenewalByPkId(this.showData.pkId,this.getData.type)
              // this.closePop()
            }else{
              uni.showToast({ title: res.msg, icon: 'none' })
            }
        })
      },
      closePop(){
        this.opinion=''
        this.appShow=false
      },
      getOrgName(orgType){
        let arr= ['系统运营商' ,'系统代理商' , '建设单位（业主方）' ,'监理公司' ,'施工单位','项目部' ,'供应商' ,'分包商' ,'劳务工人' ,'设计院']
        return arr[orgType]
      }
    }
}
</script>

<style lang="scss" scoped>
.pdb{
  height: 100rpx;
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
      transform: translate(-50%,-50%);
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