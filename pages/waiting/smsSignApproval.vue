<template>
<view class="content wrapper">
    <u-navbar
        leftText="短信签名审批"
        bgColor="rgb(0 0 0 / 0%)"
        leftIconColor="#fff"
        :autoBack="true"
      ></u-navbar>
      <!-- <u-empty style="height: 100%" mode="data" text="暂无数据" icon="/static/image/noData.png" /> -->
      <view class="detail">
        <view class="card">
          <view class="list-item bdb"><view>企业名称: </view><text class="item">{{showData.orgName}}</text> </view >
          <view class="list-item bdb"><view>管理员账号:</view><text class="item">{{ showData.telephone }}</text></view>
          <view class="list-item bdb" ><view>账号类型：</view><text class="item">{{ getOrgName(showData.orgType) }}</text></view >
          <view class="list-item bdb" ><view>申请签名:</view><text class="item" >{{ showData.signName }}</text ></view >
          <view class="list-item bdb" ><view>用途:</view><text class="item" >{{ showData.reason }}</text ></view >
          <view class="list-item bdb"><view>附件：</view>
          <view class="fileName" v-if="fileList.length" @click="preview(fileList[0])">{{fileList[0].enclosureName}}</view>
          <text class="item" v-if="!fileList.length">无</text >
          </view>
          <view v-if="fileList.length>1">
            <view class="list-item bdb" v-for="(item,index) in fileList.slice( 1, fileList.length )" :key="index">
            <view style="width:84rpx"></view>
            <view class="fileName" @click="preview(item)">{{item.enclosureName}}</view>
          </view>
          </view>
        </view>
        <view class="states " :class="showData.enableStatus===2?'green':'red'" v-if="[2,3].includes(showData.enableStatus)">
          <view class="state">{{showData.enableStatus===2?'审批通过':'审批不通过'}}</view>
        </view>
      </view>
      <view class="pdb" v-if="showData.enableStatus===1"></view>
      <view class="btn" @click="approveBtn" v-if="showData.enableStatus===1">处理</view>
      <u-popup :show="appShow" mode="center" round="10">
        <view class="pop">
          <view class="pop-head">
            <view class="approve-title">审批意见</view>
					  <u-icon @click="closePop" class="approve-closeBtn" name="close-circle" size="18" color="#ff0000"></u-icon>
          </view>
          <u--textarea v-model="opinion" height='100' placeholder="请输入审批意见" class="mb-20"></u--textarea>
          <view class="pop-btns">
            <view class="btns blue" @click="btnOk(2)">审批通过</view>
            <view class="btns red" @click="btnOk(3)">审批不通过</view>
          </view>
        </view>
      </u-popup>
      <!-- 预览 -->
		<u-popup :show="previewShow" mode="center" round="10" closeable @close="closePreview">
			<view class="preview">
				<view class="preview-top">预览</view>
				<pdf :fileUrl="previewUrl" :iframeStyle="{ width: '700rpx', height: '1080rpx' }" :imgs="false"></pdf>
			</view>
		</u-popup>
  </view>
</template>

<script>
import pdf from '../../components/pdf-preview.vue';
export default {
  components:{pdf},
  onLoad(options) {
    let obj = JSON.parse(options.row)
    this.findSmsSignByPkId(obj.fkBusinessId)
  },
    data(){
      return{
        showData:{},
        appShow:false,
        opinion:"",
        fileList:[],
        previewShow:false,
        previewUrl:""
      }
    },
    methods:{
      findSmsSignByPkId(pkId){
        this.$api.findSmsSignByPkId({pkId}).then((res) => {
          if(res.code===200){
            this.showData=res.data
            this.fileList=res.data.enclosures
          }else{
            uni.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        }).catch((err) => {
          
        });
      },
      approveBtn(){
        this.appShow=true
      },
      btnOk(approvalStatus){
        console.log(approvalStatus);
        let data={
          approvalReason:this.opinion,
          approvalStatus,
          pkId:this.showData.pkId
        }
        if(!data.approvalReason){
          if(approvalStatus===2){
            data.approvalReason='审批通过'
          }else if(approvalStatus===3){
            data.approvalReason='审批不通过'
          }
        }
        this.$api.approveSmsSign(data).then(res=>{
          if(res.code===200){
              uni.showToast({ title: '审批成功', icon: 'success' })
              uni.navigateBack({ delta: 1 })
              // this.findSmsSignByPkId(this.showData.pkId)
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
      preview(item) {
        this.previewUrl = item.enclosureUrl;
        this.$checkName(this.previewUrl)
        return
			this.previewShow = true;
		},
		closePreview() {
			this.previewShow = false;
			this.previewUrl = '';
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
    display: flex;
    align-items: center;
    min-height: 64rpx;
    // line-height: 64rpx;
    font-size: 28rpx;
    .item {
      width: 500rpx;
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
.fileName {
  width: 500rpx;
  height: 40rpx;
  line-height: 40rpx;
	overflow: hidden; /*超出部分隐藏*/
	white-space: nowrap; /*禁⽌换⾏*/
	text-overflow: ellipsis; /*省略号*/
  color: #02a7f0;
}
.preview {
	width: 700rpx;
	height: 1200rpx;
	overflow: hidden;
	.preview-top {
		height: 100rpx;
		line-height: 100rpx;
		padding-left: 40rpx;
	}
}
</style>