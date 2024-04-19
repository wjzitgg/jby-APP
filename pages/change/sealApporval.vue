<template>
  <view class="wrapper">
    <u-navbar
      leftText="盖章审批"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="sticky">
      <u-tabs
        class="tabList"
        :list="tabList"
        :current="current"
        @change="currentChange"
        :scrollable="false"
        :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
      ></u-tabs>
    </view>
    <view class="pad"></view>
    <view class="content">
      <view v-show="idx === 0">
        <pdf
          :fileUrl="item.tableUrl"
          :iframeStyle="{ width: '750rpx', height: '78vh' }"
          :imgs="false"
          v-for="(item, index) in showData.engSealTableVoList"
          :key="index"
          v-show="index === pdfidx"
        ></pdf>
      </view>
      <view v-show="idx === 1">
        <view class="app-record">
          <view
            class="app-record-item"
            v-for="(item, index) in showData.engSealFileVoList"
            :key="index"
          >
            <view class="item-header">
              <view>{{ item.createUserName }}</view>
              <view>{{ item.endTime }}</view>
            </view>
            <view class="item-files">
              <view
                class="files-item bdb"
                v-for="(item2, index2) in showData.engSealFileVoList"
                :key="index2"
              >
                <u-icon class="file-icon" name="file-text" size="28"></u-icon>
                <view class="file-name text-hidden">{{ item2.fileName }}</view>
              </view>
            </view>
          </view>
        </view>
        <!-- <view v-else class="no-data"> 暂无数据 </view> -->
      </view>
    </view>
    <view class="pab"></view>
    <view class="btn" @click="dispose" v-if="rowData.sealApproveStatus||rowData.signatureStatus">处理</view>
    <signApprove
      :appTitle="'节点审批'"
      :appShow="appShow"
      @reject="reject"
      @submit="submit"
      @close="closeAppPop"
      :approverList="approverList"
      :approverName="approverName"
      :deptName="showData.deptName"
      :workflowName="showData.workflowName"
    />
  </view>
</template>

<script>
import pdf from "../../components/pdf-preview.vue";
import signApprove from "../../components/signApprove-popup/signApprove-popup.vue";
export default {
  components: { pdf, signApprove },
  data() {
    return {
      tabList: [{ name: "业务附件", idx: 1 }],
      current: 0,
      idx: 0,
      pdfidx: 0,
      previewUrl: "",
      // pdfList: [
      //   "https://epms-1307524156.cos.ap-guangzhou.myqcloud.com/202212121503096396d22d848e1181a6b193f3.pdf",
      //   "https://epms-1307524156.cos.ap-guangzhou.myqcloud.com/202212121500546396d1a6848e1181a6b193f2.pdf",
      // ],
      showData: {},
      rowData: {},
      user: {},
      approverName: "",
      approverList: [],
      fileList:[],
      appShow: false,
    };
  },
  onLoad(options) {
    this.rowData = JSON.parse(options.row);
    this.user = uni.getStorageSync("user");
    let type=this.rowData.sealApproveStatus?1:2
    this.findSealDetail(type);
  },
  methods: {
    findSealDetail(type) {
      let data = {
        type,
        pkId: this.rowData.pkId,
      };
      uni.showLoading({ mask: true });
      this.$api
        .findSealDetail(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.showData=res.data
            this.tabList.splice(0, 0, ...res.data.engSealTableVoList.map((item,index)=>({...item,name:item.tableName,pdfidx:index,idx:0})));
            this.approverName = res.data.nextDeptName;
            this.approverList = res.data.sysUserList.length
              ? res.data.sysUserList.map((item) => ({
                  ...item,
                  value: item.pkId,
                  label: item.userName,
                }))
              : [];
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    currentChange(e) {
      this.current = e.index;
      this.idx = e.idx;
      if (e.idx === 0) {
        this.pdfidx = e.pdfidx;
      }
    },
    dispose() {
      if(this.rowData.sealApproveStatus){
        this.appShow = true;
      }else if(this.rowData.signatureStatus){
        uni.showLoading({ mask: true });
        this.$api.getSignUrl({pkId:this.rowData.pkId}).then(res=>{
          uni.hideLoading();
          if(res.code===200){
            this.$store.commit('saveIsSign',true)
            uni.navigateTo({ url: '/pages/esign/esign?url='+encodeURIComponent(JSON.stringify(res.data)) })
          }else{
            uni.showToast({ title: res.msg, icon: "none" });
          }
        }).catch((err) => {
          uni.hideLoading();
        });
      }
    },
    reject(e) {
      console.log(e);
      let data = {
        approveComment: e.opinion?e.opinion:'审批不通过',
        approveId: e.approverId,
        approveStatus:0,
        pkId: this.rowData.pkId,
      };
      this.approvalSealProcess(data)
      this.closeAppPop();
    },
    submit(e) {
      console.log(e);
      let data = {
         approveComment: e.opinion?e.opinion:'审批通过',
        approveId: e.fkApproverId,
        approveStatus:1,
        pkId: this.showData.sealPkId,
      };
      this.approvalSealProcess(data)
      this.closeAppPop();
    },
    approvalSealProcess(data){
      uni.showLoading({ mask: true })
      this.$api.approvalSealProcess(data).then((res) => {
        uni.hideLoading()
        if(res.code===200){
          uni.showToast({ title: '审批成功', icon: 'success' })
          this.closeAppPop()
          uni.navigateBack({ delta: 1, });
        }else{
          uni.showToast({ title: res.msg, icon: 'none' })
        }
      }).catch((err) => {
        uni.hideLoading()
      });
    },
    closeAppPop() {
      this.appShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.pad {
  height: 88rpx;
}
.pab {
  height: 100rpx;
}
.app-record {
  .app-record-item {
    padding: 0 20rpx;
    background-color: #fff;
    margin-bottom: 10rpx;
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;
      color: #bcc2cc;
    }
    .item-content {
      // display: flex;
      border-bottom: 1px solid rgba(238, 238, 238, 1);
      .item-content-head {
        display: flex;
        align-items: center;
      }
      .contents {
        padding: 20rpx 0 20rpx 60rpx;
      }
    }
    .files-item {
      display: flex;
      align-items: center;
      background-color: #fff;
      height: 80rpx;
    }
    .file-icon {
      width: 60rpx;
    }
    .file-name {
      width: 550rpx;
      height: 40rpx;
      line-height: 40rpx;
      font-size: 30rpx;
    }
    .icons {
      width: 60rpx;
    }
  }
}
.no-data {
  margin: 0 auto;
  padding: 100rpx;
  text-align: center;
  background: #fff;
}
</style>
