<template>
  <view class="wrapper">
    <u-navbar
      leftText="合同详情"
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
    <view class="content" v-show="current===0">
      <view class="cell">
        <view class="cell-item">
          <view class="label">合同名称：</view>
          <view class="value">{{getData.contractName}}</view>
        </view>
        <view class="cell-item">
          <view class="label">合同类型：</view>
          <view class="value">{{getData.contractType===1?'入职合同':'定向邀签'}}</view>
        </view>
        <view class="cell-item">
          <view class="label">甲方签署人：</view>
          <view class="value">{{getData.nailPerson}}</view>
        </view>
        <view class="cell-item">
          <view class="label">乙方签署人：</view>
          <view class="value">{{getData.bperson.join('')}}</view>
        </view>
        <view class="cell-item">
          <view class="label">合同状态：</view>
          <view class="value">{{typeList[getData.contractStatus]}}</view>
        </view>
      </view>
      <!-- <view class="pdfs"></view> -->
      <!-- <pdf
      v-if="pdfShow"
        :iframeStyle="{ height: 'calc(57vh - 100rpx)' }"
        :fileUrl="fileUrl"
      ></pdf> -->
      <image :src="getData2.pdfToImge" mode="widthFix" style="width: 750rpx" @click="previewPdf"/>
    </view>
    <view class="content" v-show="current===1">
        <uni-table border emptyText="暂无更多数据">
          <!-- 表头行 -->
          <uni-tr>
            <uni-th align="center" width="60">签署方</uni-th>
            <uni-th align="center" width="60">甲方/乙方</uni-th>
            <uni-th align="center" width="60">签署时间</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr
            v-for="(item, index) in signState"
            :key="index"
          >
            <uni-td align="center">{{ item.userName }}</uni-td>
            <uni-td align="center">{{ item.type===0?'甲方':'乙方' }}</uni-td>
            <uni-td align="center">{{ item.updateTime }}</uni-td>
          </uni-tr>
        </uni-table>
    </view>
    <!-- <view class="btn" v-if="sign"></view> --> 
    <view class="btn"   v-show="$menuPerm('labour:contract:termination')" v-if="[0,4].includes(getData.contractStatus)" @click="resCon">解约</view>
    <view class="footer" v-if="getData.contractStatus===2||getData.nailState===0&&getData.nailAllow===1">
      <view class="btns del" v-show="$menuPerm('labour:contract:cancel')" v-if="getData.contractStatus === 2 " @click="cancelBtn">作废</view>
      <view class="btns edit" v-if="getData.nailState===0 && getData.nailAllow===1" @click="goSign">开始签约</view>
    </view>
    <u-modal
      :show="modelShow"
      title="删除提示"
      content="确定作废该合同？"
      showCancelButton
      @confirm="confirmDel"
      @cancel="cancelDel"
    ></u-modal>
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
      topList: ["合同信息", "签署情况"],
      current: 0,
      sign:false,
      getData:{},
      getData2:{},
      typeList:['生效', '失效','待生效', '已作废','解约中','已解约'],
      fileUrl:"",
      signState:[],
      pdfShow:false,
      modelShow:false
    };
  },
  onLoad(options) {
    let data=JSON.parse(options.data)
    this.getData=data
    console.log(data);
    this.fileUrl=data.templateUrl
    this.pdfShow=true
    this.signScheduleById()
    this.findLabourContractById(data.pkId)
  },
  methods: {
    previewPdf(){
      this.$checkName(this.getData2.templateUrl)
    },
    findLabourContractById(pkId){
      this.$api.findLabourContractById({pkId}).then((res) => {
        if(res.code===200){
          this.getData2=res.data
          // this.fileUrl=res.data.templateUrl
          // this.pdfShow=true
        }else{
          uni.showToast({
            title: res.msg,
            icon: 'none'
          })
      }
      })
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
    reshPage() {
      var pages = getCurrentPages(); //当前页面栈
      if (pages.length > 1) {
        var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
        beforePage.$vm.refreshIfNeeded = true;
      }
    },
    sectionChange(index) {
      this.current = index;
      // this.showList = [];
    },
    goSign(){
      uni.showLoading({ mask: true })
      this.$api.nailUrlByOrgId({pkId:this.getData.pkId,urlType:2}).then(res=>{
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
        pkId:this.getData.pkId
      }
      uni.showLoading({ mask: true })
      this.$api.rescindById(data).then(res=>{
        uni.hideLoading()
        if(res.code===200){
          this.reshPage()
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
    cancelBtn(){
      this.modelShow = true;
    },
    confirmDel() {
      uni.showLoading({ mask: true });
      this.$api
        .cancelContractById({pkId:this.getData.pkId})
        .then((res) => {
          uni.hideLoading();
          if (res.code == 200) {
            this.modelShow = false;
            this.reshPage();
            uni.navigateBack({ delta: 1 });
            uni.showToast({ title: "作废成功", icon: "success" });
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    cancelDel() {
      this.modelShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.pad {
  margin-top: 70rpx;
}
.cell {
  .cell-item {
    display: flex;
    align-items: center;
    min-height: 80rpx;
    padding: 0 20rpx;
    font-size: 30rpx;
    background-color: #fff;
    border-bottom: 1px solid #f2f2f2;
    .label {
      width: 180rpx;
      text-align: right;
    }
    .value {
      width: 500rpx;
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
