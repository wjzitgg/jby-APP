<template>
  <view class="wrapper">
    <u-navbar
      leftText="审批信息"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="bg"></view>
    <view class="pad"></view>
    <view class="sticky">
      <u-tabs
        :list="tabList"
        :current="current"
        @change="currentChange"
        :scrollable="false"
        :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
      >
      </u-tabs>
    </view>
    <view v-show="current == 0">
      <view class="base-item">
        <view class="header">基本信息</view>
        <view class="item-content">
          <u-form labelPosition="left" ref="uForm" labelWidth="80">
            <u-form-item label="流程名称" borderBottom >
              <u-input v-model="showData.workflowName" border="none"></u-input>
            </u-form-item>
            <u-form-item label="负责岗位" borderBottom >
              <u-input v-model="showData.roleName" border="none"></u-input>
            </u-form-item>
            <u-form-item label="负责人" borderBottom >
              <u-input v-model="showData.approver" border="none"></u-input>
            </u-form-item>
            <u-form-item label="审批时间" borderBottom >
              <u-input v-model="showData.approveTime" border="none"></u-input>
            </u-form-item>
            <u-form-item label="审批结果" borderBottom >
              <u-input v-model="showData.sealPersonStatus" border="none"></u-input>
            </u-form-item>
            <u-form-item label="审批意见" borderBottom >
              <u-input v-model="showData.approveComment" border="none"></u-input>
            </u-form-item>
          </u-form>
        </view>
      </view>
      <view class="table-item">
        <view class="header">审批表</view>
        <view class="item-content">
            <processForm :tableData="workflowTableList" :disabled="true"></processForm>
        </view>
      </view>
    </view>
    <view v-show="current == 1">
      <view class="pdfList">
            <view class="img-item" v-for="(item,index) in showData.engSealTableVoList" :key="index">
            <image class="imgs" :src="item.tableUrl" mode="widthFix" />
            <view class="circles">
                <image class="magnify" src="../../static/image/magnify.png" mode="widthFix" />
            </view>
            </view>
        </view>
    </view>
    <view v-show="current === 2">
      <view class="fileList">
        <view class="fileList-item" v-for="(item2, index2) in fileList" :key="index2">
            <u-icon class="file-icon" name="file-text" size="28"></u-icon>
            <view class="file-name text-hidden" @click="preview(item2)">{{ item2.fileName }}</view>
            <view class="downLoad" @click="downLoad(item2.fileUrl)">下载</view>
          </view>
      </view>
    </view>
    <u-popup :show="previewShow" mode="center" round="10" closeable @close="closePreview">
			<view class="preview">
				<view class="preview-top">预览</view>
				<pdf :fileUrl="previewUrl" :iframeStyle="{ width: '700rpx', height: '1080rpx' }" :imgs="false"></pdf>
			</view>
		</u-popup>
  </view>
</template>

<script>
import processForm from "../../components/process-form/process-form2.vue";
export default {
components:{processForm},
  data() {
    return {
      tabList: [
        { name: "审批信息", idx: 0 },
        { name: "盖章文件", idx: 1 },
        { name: "业务附件", idx: 2 },
      ],
      current: 0,
      showData:{},
      workflowTableList:[],
      previewShow: false,
			previewUrl: '',
      fileList:[]
    };
  },
  onLoad(options) {
    let obj=options.data?JSON.parse(options.data):{}
    this.searchByBusinessNode(obj.flowCaseId,obj.currentNodeId,obj.taskId)
  },
  methods: {
    currentChange(item) {
      this.current = item.index;
    },
    searchByBusinessNode(flowCaseId,nodeId,taskId){
      let data={flowCaseId,nodeId,taskId}
      uni.showLoading({ mask: true });
      this.$api.searchByBusinessNode(data).then((res) => {
        uni.hideLoading();
        if(res.code===200){
          this.showData=res.data.sealDetailVo
          this.fileList=this.showData.fileList?this.showData.fileList:[]
          this.workflowTableList=JSON.parse(JSON.stringify(this.showData.workflowTableList))
          console.log(this.workflowTableList);
        }else{
          uni.showToast({icon:"none",title:res.msg})
        }
      }).catch(err=>{
        uni.hideLoading();
      })
    },
    preview(item) {
			this.previewUrl = item.fileUrl;
			this.previewShow = true;
		},
		closePreview() {
			this.previewShow = false;
			this.previewUrl = '';
		},
  },
};
</script>

<style lang="scss" scoped>
.pad {
  padding-top: 98rpx;
}
.bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-color: #f7f7ff;
}
.header {
  display: flex;
  align-items: center;
  height: 60rpx;
  padding-left: 10rpx;
  background-color: #f2f2f2;
  &::before {
    content: "";
    width: 10rpx;
    height: 60rpx;
    background-color: #81d3f8;
    margin-right: 6rpx;
  }
}
.base-item{
    margin-bottom: 6rpx;
    background-color: #fff;
    /deep/ .u-form-item__body{
        padding: 14rpx 0;
    }
}
.item-content{
    padding: 10rpx;
    background-color: #fff;
}
.pdfList{
    // overflow: auto;
    // height: 1000rpx;
    .img-item{
        position: relative;
        width: 750rpx;
        overflow: hidden;
        margin-bottom: 10rpx;
        background-color: #fff;
        .imgs{
            width: 750rpx;
        }

    }
    .circles{
        position: absolute;
        right: -80rpx;
        top: -80rpx;
        width: 160rpx;
        height: 160rpx;
        background-color: #35b9f3;
        border-radius: 50%;
        .magnify{
            position: absolute !important;
            bottom: 20rpx;
            left: 20rpx;
            width: 50rpx;
        }
    }
}
.fileList {
  .fileList-item {
    display: flex;
    align-items: center;
    height: 80rpx;
    background-color: #fff;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    .file-icon {
      width: 60rpx;
    }
    .file-name {
      width: 550rpx;
      height: 40rpx;
      line-height: 40rpx;
      font-size: 30rpx;
    }
    .text-hidden {
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
    }
    .upload {
      display: flex;
      justify-content: space-between;
    }
    .upload-files {
      border-bottom: 1px solid rgba(238, 238, 238, 1);
    }
    .downLoad {
      width: 100rpx;
      text-align: center;
      font-size: 28rpx;
    }
  }
}
.preview {
	width: 700rpx;
	max-height: 1200rpx;
  padding-bottom: 10rpx;
	overflow: hidden;
	.preview-top {
		height: 100rpx;
		line-height: 100rpx;
		padding-left: 40rpx;
	}
}
</style>
