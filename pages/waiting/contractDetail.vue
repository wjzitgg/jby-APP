<template>
  <view class="wrapper">
    <u-navbar
      leftText="合同详情"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
      
    >
  </u-navbar>

  
  
    <view class="content">
      <view class="cell">
        <view class="cell-item">
          <view class="label">合同名称</view>
          <view class="value">{{getData.contractName}}</view>
        </view>
        <view class="cell-item">
          <view class="label">合同类型</view>
          <view class="value">{{getData.removeFlowId?'解约合同':getData.contractType===1?'入职合同':'定向邀签'}}</view>
        </view>
        <!-- <view class="cell-item">
          <view class="label">甲方签署人：</view>
          <view class="value">{{getData.nailPerson}}</view>
        </view>
        <view class="cell-item">
          <view class="label">甲方签署时间：</view>
          <view class="value">{{getData.nailPerson}}</view>
        </view> -->
        <view v-for="(item,index) in getData.appSignScheduleVos" :key="index">
          <view class="cell-item">
          <view class="label">{{item.type===0?'甲方签署人':'乙方签署人'}}</view>
          <view class="value">{{item.userName}} <text :style="{color:item.contractStatus===0?'#d9001b':'#70b603'}">{{item.contractStatus===0?'（待签）':'（已签）'}}</text></view>
        </view>
        <view class="cell-item">
          <view class="label">{{(item.type===0?'甲方':'乙方') +'签署时间'}}</view>
          <view class="value">{{item.updateTime}}</view>
        </view>
        </view>
      </view>

      <!-- <pdf
        v-if="pdfShow"
        :iframeStyle="{ height: 'calc(57vh - 100rpx)' }"
        :fileUrl="fileUrl"
      ></pdf> -->

      <image :src="getData.pdfToImge" mode="widthFix" style="width: 750rpx" @click="previewPdf"/>
    </view>
    <view class="btn" v-if="data.handleStatus==0&getData.confirmStatus===0 && getData.removeFlowId" @click="resCon">解约</view>
    <view class="btn" v-if="data.handleStatus==0&getData.confirmStatus===0 && !getData.removeFlowId" @click="goSign">开始签约</view>
  </view>
</template>

<script>
import pdf from "../../components/pdf-preview.vue";
export default {
  components: { pdf },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  data() {
    return {
      current: 0,
      sign:false,
      getData:{},
      data:{},
      typeList:['生效', '失效','待生效', '已作废','解约中','已解约'],
      fileUrl:"",
      signState:[],
      pdfShow:false,
    };
  },
  onLoad(options) {
    let data=JSON.parse(options.row)
    // this.signScheduleById()
    this.data=data
    this.findLabourContractById(data.fkBusinessId)
  },
  methods: {
    previewPdf(){
      this.$checkName(this.getData.templateUrl)
    },
    signScheduleById(){
      this.$api.signScheduleById({pkId:this.getData.pkId}).then((res) => {
        if(res.code===200){
          this.signState=res.data
        }else{
          uni.showToast({
            title: res.msg,
            icon: 'none'
          })
      }
      })
    },
    findLabourContractById(pkId){
      this.$api.findLabourContractById({pkId}).then((res) => {
        if(res.code===200){
          this.getData=res.data
          this.fileUrl=res.data.templateUrl
          this.pdfShow=true
        }else{
          uni.showToast({
            title: res.msg,
            icon: 'none'
          })
      }
      })
    },
    // reshPage() {
    //   var pages = getCurrentPages(); //当前页面栈
    //   if (pages.length > 1) {
    //     var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
    //     beforePage.$vm.refreshIfNeeded = true;
    //   }
    // },
    goSign(){
      uni.showLoading({ mask: true })
      this.$api.getPartyBUrl2({pkId:this.data.fkBusinessId,urlType:2}).then(res=>{
        uni.hideLoading()
        if(res.code===200){
          this.$store.commit('saveContentSign',true)
          uni.navigateTo({ url: '/pages/esign/esign?url='+encodeURIComponent(JSON.stringify(res.data.shortUrl)) })
        }else{
          uni.showToast({
            title: res.msg,
            icon: 'none'
          })
      }
      }).catch(err=>{
        uni.hideLoading()
      })
    },
    resCon(){
      let data={
        redirectUrl:"https://erp.jianwangkeji.cn/back.html",
        pkId:this.getData.fkContractId
      }
      uni.showLoading({ mask: true })
      this.$api.rescindById2(data).then(res=>{
        uni.hideLoading()
        if(res.code===200){
          // this.reshPage()
          this.$store.commit('saveContentSign',true)
          uni.navigateTo({ url: '/pages/esign/esign?url='+encodeURIComponent(JSON.stringify(res.data)) })
        }else{
          uni.showToast({
            title: res.msg,
            icon: 'none'
          })
      }
      }).catch(err=>{
        uni.hideLoading()
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.cell {
  
  .cell-item {
    display: flex;
    align-items: center;
    min-height: 80rpx;
    padding: 0 20px;
    font-size: 30rpx;
    background-color: #fff;
    border-bottom: 1px solid #f2f2f2;
    
    .label {
      width: 270rpx;
      
      height:42px;
      border-right: 1px solid rgba(238, 238, 238, 1);
      line-height: 42px;
      
      text-align: left;
    }
    .value {
      width: 500rpx;
      padding-left: 20px;
      // overflow: hidden;
      // white-space: nowrap; /*禁⽌换⾏*/
      // text-overflow: ellipsis; /*省略号*/
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100rpx;
  background-color: #fff;
  .btns {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 320rpx;
    height: 80rpx;
    border-radius: 10rpx;
    color: #fff;
    font-size: 28rpx;
  }
  .edit {
    background-color: #169bd5;
  }
  .del {
    background-color: #da0721;
  }
  .wh-600{
    width: 600rpx;
  }
}
 

</style>
