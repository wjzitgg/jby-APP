<template>
  <view class="wrapper">
    <u-navbar leftText="盖章审批" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="sticky">
      <u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="true" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"></u-tabs>
    </view>
    <view class="pad"></view>
    <view class="content">
      <view v-show="idx === 0">
        <!-- <pdf :fileUrl="item.tableUrl" :iframeStyle="{ width: '750rpx', height: '78vh' }" :imgs="false"
          v-for="(item, index) in showData.engSealTableVoList" :key="index" v-show="index === pdfidx"></pdf> -->
          <image :src="item.pdfToImge" mode="widthFix" style="width:750rpx" @click="previewPdf(item.tableUrl)" v-for="(item, index) in showData.engSealTableVoList" :key="index" v-show="index === pdfidx"/>
      </view>
      <view v-show="idx === 1">
        <processForm :tableData="workflowTableList" :tableIndex="tableIndex" @sendGzipTableHtml="sendGzipTableHtml"
          :disabled="workflowTableList.length ? workflowTableList[tableIndex].editFlag != 1 : false" ref="processForm">
        </processForm>
      </view>
    </view>
    <view class="pab"></view>
    <view class="btn" @click="dispose">处理</view>
    <signApprove :appTitle="'节点审批'" :appShow="appShow" @reject="reject" @submit="submit" @close="closeAppPop"
      :deptName="showData.deptName" :workflowName="showData.workflowName" :sysRoleId="showData.sysRoleId" :roleId="showData.roleId" :tableData="workflowTableList" />
  </view>
</template>

<script>
import pdf from "../../components/pdf-preview.vue";
import signApprove from "../../components/signApprove-popup/signApprove-popup.vue";
import processForm from '../../components/process-form/process-form.vue';
export default {
  components: { pdf, signApprove, processForm },
  data() {
    return {
      tabList: [],
      current: 0,
      idx: 0,
      pdfidx: 0,
      tableIndex: 0,
      previewUrl: "",
      // pdfList: [
      //   "https://epms-1307524156.cos.ap-guangzhou.myqcloud.com/202212121503096396d22d848e1181a6b193f3.pdf",
      //   "https://epms-1307524156.cos.ap-guangzhou.myqcloud.com/202212121500546396d1a6848e1181a6b193f2.pdf",
      // ],
      showData: {},
      user: {},
      fileList: [],
      appShow: false,
      workflowTableList: [],
      todo: false
    };
  },
  onLoad(options) {
    this.pkId = options.pkId
    this.user = uni.getStorageSync("user");
    this.findSealDetail();
    if (options.todo) {
      this.todo = true
    }
  },
  methods: {
    previewPdf(url){
      this.$checkName(url)
    },
    findSealDetail() {
      let data = {
        pkId: this.pkId,
      };
      uni.showLoading({ mask: true });
      this.$api
        .findSealDetail(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.showData = res.data
            this.tabList.splice(0, 0, ...res.data.engSealTableVoList.map((item, index) => ({ ...item, name: item.tableName, pdfidx: index, idx: 0 })));
            this.tabList.push(...res.data.workflowTableList.map((item, index) => ({ name: item.tableName, tableIdx: index, idx: 1 })))
            this.workflowTableList = JSON.parse(JSON.stringify(res.data.workflowTableList.filter(item => item.tableHtml)))
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
      if (e.idx === 1) {
        this.tableIndex = e.tableIdx;
        console.log(this.workflowTableList[this.tableIndex].editFlag);
      }
    },
    sendGzipTableHtml(e) {
      console.log(e);
      this.tableHtml = e;
    },
    dispose() {
      this.$refs.processForm.gzipTable();
      this.appShow = true;
      return
      if (this.rowData.sealApproveStatus) {
        this.appShow = true;
      } else if (this.rowData.signatureStatus) {
        uni.showLoading({ mask: true });
        this.$api.getSignUrl({ pkId: this.rowData.pkId }).then(res => {
          uni.hideLoading();
          if (res.code === 200) {
            this.$store.commit('saveIsSign', true)
            uni.navigateTo({ url: '/pages/esign/esign?url=' + encodeURIComponent(JSON.stringify(res.data)) })
          } else {
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
        approveComment: e.opinion ? e.opinion : '审批不通过',
        approveStatus: 0,
        pkId: this.pkId,
        workflowTableList: this.tableHtml,
        redirectUrl:'https://erp.jianwangkeji.cn/back.html'
      };
      this.approvalSealProcess(data)
      this.closeAppPop();
    },
    submit(e) {
      console.log(e);
      if(e.signUrl){
				this.$refs.processForm.signUrl(e.signUrl,e.signerId)
			}
      // return
      let data = {
        approveComment: e.opinion ? e.opinion : '审批通过',
        approveStatus: 1,
        pkId: this.pkId,
        workflowTableList: this.tableHtml,
        redirectUrl:'https://erp.jianwangkeji.cn/back.html'
      };
      this.approvalSealProcess(data, e.uniqueIdentification)
      this.closeAppPop();
    },
    approvalSealProcess(data, uniqueIdentification) {
      uni.showLoading({ mask: true })
      this.$api.approvalSealProcess(data).then((res) => {
        uni.hideLoading()
        if (res.code === 200) {
          if (!res.data) {
            uni.showToast({ title: '审批成功', icon: 'success' })
            this.closeAppPop()
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.getDetail() // 调用上一页 定义的方法
            uni.navigateBack({ delta: 2 })
            // console.log('uniqueIdentification -----> ', uniqueIdentification);
            // uniqueIdentification == 1 ? setTimeout(() => {
            //   uni.navigateBack({ delta: 2 });
            //   console.log('2 -----> ', 2);
            // }, 1500) : uni.navigateBack({ delta: 1 });
            // if (this.todo) {
            //   prevPage.$vm.resh()
            // } else {
              
            // }
      
          } else {
            if (this.todo) {
              this.$store.commit("saveTodo", true);
            }
            this.$store.commit("saveApproveSign", true);
            uni.navigateTo({ url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.data)) })
          }
        } else {
          uni.showToast({ title: res.msg, icon: 'none' })
        }
      }).catch((err) => {
        console.log(err);
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
