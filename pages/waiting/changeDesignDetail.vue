<template>
  <view class="wrapper">
    <u-navbar
      leftText="设计变更"
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
        :scrollable="!!tableDTOS.length"
        :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
      >
        <view
          slot="right"
          class="hamburg"
          @tap="hamburg"
          v-if="!!tableDTOS.length"
          ><u-icon name="list" size="21" bold></u-icon
        ></view>
      </u-tabs>
      <view class="pull-down" v-show="tabShow">
        <text
          class="item-tab"
          :class="index == current ? 'action' : ''"
          v-for="(item, index) in tabList"
          :key="index"
          @click="listSelet(item, index)"
          >{{ item.name }}</text
        >
        <!-- 箭头 -->
        <u-icon
          name="arrow-up"
          color="#dddddd"
          size="20"
          class="arrow-up"
          @click="shut"
        ></u-icon>
      </view>
    </view>
    <view :class="{ content: receiveData.handleStatus === 0 }">
      <view class="detail" v-show="idx === 0">
        <view class="detail-item">
          <view class="left bgc1"></view>
          <view class="right">
            <view class="mb-20"
              ><text class="fw-700">项目名称：</text
              ><text class="detail-color">{{
                showData.fkProjectName
              }}</text></view
            >
            <view class="mb-20"
              ><text class="fw-700">标段名称：</text
              ><text class="detail-color">{{
                showData.fkBidProjectName
              }}</text></view
            >
            <view class="mb-20"
              ><text class="fw-700">变更名称：</text
              ><text class="detail-color">{{
                showData.changesName
              }}</text></view
            >
            <view class="mb-20"
              ><text class="fw-700">变更申请日期：</text
              ><text class="detail-color">{{ showData.createTime }}</text></view
            >
            <view class="mb-20"
              ><text class="fw-700">变更申请发起单位：</text
              ><text class="detail-color">{{ showData.fkOrgName }}</text></view
            >
            <view
              ><text class="fw-700">变更申请发起人：</text
              ><text class="detail-color">{{
                showData.createUserName
              }}</text></view
            >
          </view>
        </view>
        <view class="detail-item">
          <view class="left bgc2"></view>
          <view class="right bgc4">
            <view class="mb-20">
              <view class="item-title">·变更类型：</view>
              <view class="hiddenView">{{
                showData.fkWorkflowTemplateName
              }}</view>
            </view>
            <view class="mb-20">
              <view class="item-head">
                <view class="item-title">·变更原因：</view>
                <view
                  class="custom-style"
                  @click="checkDetail('变更原因', showData.changesReason)"
                  >查看明细</view
                >
              </view>
              <view class="hiddenView">{{ showData.changesReason }}</view>
            </view>
            <view class="mb-20">
              <view class="item-head">
                <view class="item-title">·变更理由：</view>
                <view
                  class="custom-style"
                  @click="checkDetail('变更理由', showData.changesPlan)"
                  >查看明细</view
                >
              </view>
              <view class="hiddenView">{{ showData.changesPlan }}</view>
            </view>
            <view>
              <view class="item-head">
                <view class="item-title">·预估成本：</view>
                <view
                  class="custom-style"
                  @click="checkDetail('预估成本', showData.changesCost)"
                  >查看明细</view
                >
              </view>
              <view class="hiddenView">{{ showData.changesCost }}</view>
            </view>
          </view>
        </view>
        <view
          class="detail-item"
          v-for="(item, index) in approvalRecord"
          :key="index"
        >
          <view class="left bgc3"></view>
          <view class="right bgc5">
            <view class="mb-20">
              <view class="item-title">·审批意见：</view>
              <view class="item-reason">{{ item.comment }}</view>
              <view
                class="item-files"
                v-for="(item2, index) in item.fileVoList"
                :key="index"
              >
                <u-icon class="file-icon" name="file-text" size="28"></u-icon>
                <view class="file-name text-hidden">{{ item2.fileName }}</view>
                <view class="downLoad" @click="downLoad(item2.fileUrl)"
                  >下载</view
                >
              </view>
              <h4 class="tar lh-36 mr-20">{{ item.orgName }}</h4>
              <view class="tar lh-36 mr-20">{{ item.assignee }}</view>
              <view class="tar lh-36 mr-20">审批时间：{{ item.endTime }}</view>
            </view>
          </view>
        </view>
      </view>
      <view v-show="idx === 1">
		<processForm :tableData="tableDTOS" :tableIndex="tableIndex" @sendGzipTableHtml='sendGzipTableHtml' ref="processForm"></processForm>
      </view>
      <view v-show="idx === 2" v-html="flow" class="flow"></view>
      <view v-show="idx === 3">
        <view class="fileList">
          <view
            class="fileList-item"
            v-for="(item, index) in accessoryList"
            :key="index"
          >
            <view class="upload comonView">
              <view>{{ item.userName }}</view>
              <view>{{ item.time }}</view>
            </view>
            <view
              class="upload-files comonView"
              v-for="(item2, index2) in item.prodReProcessFileList"
              :key="index2"
            >
              <u-icon class="file-icon" name="file-text" size="28"></u-icon>
              <view class="file-name text-hidden">{{ item2.fileName }}</view>
              <view class="downLoad" @click="downLoad(item2.fileUrl)"
                >下载</view
              >
            </view>
            <!-- <view class="file-downLoad" @click="downLoad">下载</view> -->
          </view>
        </view>
      </view>
      <view v-show="idx === 4">
        <view class="app-record">
          <view
            class="app-record-item"
            v-for="(item, index) in approvalRecord"
            :key="index"
          >
            <view class="item-header">
              <view>{{ item.assignee }}</view>
              <view>{{ item.endTime }}</view>
            </view>
            <view class="item-content">
              <view class="item-content-head">
                <u-icon class="icons" name="file-text" size="28"></u-icon>
                <view>发表：</view>
              </view>
              <view class="contents">{{ item.comment }}</view>
            </view>
            <view class="item-files">
              <view
                class="files-item bdb"
                v-for="(item2, index2) in item.fileVoList"
                :key="index2"
              >
                <u-icon class="file-icon" name="file-text" size="28"></u-icon>
                <view class="file-name text-hidden">{{ item2.fileName }}</view>
                <view class="downLoad" @click="downLoad(item2.fileUrl)"
                  >下载</view
                >
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="btn" v-if="receiveData.handleStatus === 0" @click="appBtn"
      >处理</view
    >
    <!-- <view class="footer" v-if="receiveData.handleStatus!==1"><u-button type="primary" text="处理" @click="appBtn"></u-button></view> -->
    <!-- 查看明细弹框 -->
    <u-popup :show="reasonShow" mode="center" @close="closeReason" round="10">
      <view class="reasonPop">
        <view class="reasonPop-header">
          {{ popTitle }}
          <u-icon
            @click="closeReason"
            class="reasonPop-closeBtn"
            name="close-circle"
            size="18"
          ></u-icon>
        </view>
        <view class="reasonPop-content">
          <view class="reasonPop-reason">{{ popReason }}</view>
        </view>
      </view>
    </u-popup>
    <approvePopup
      :app-show="appShow"
      :approver-show="bottomShow"
      :approver-name="nextAppRole"
      :approver-list="approvalOptions"
      @close="closeApp"
      @reject="reject"
      @submit="submit"
      :app-title="'审批'"
    ></approvePopup>
  </view>
</template>

<script>
import approvePopup from "../../components/approve-popup/approve-popup";
import processForm from '../../components/process-form/process-form.vue';
export default {
  components: { approvePopup,processForm },
  data() {
    return {
      tabList: [
        { name: "变更详情", idx: 0 },
        { name: "流程图", idx: 2 },
        { name: "附件", idx: 3 },
        { name: "审批记录", idx: 4 },
      ],
      current: 0,
      tableIndex: 0,
      idx: 0,
      showData: {},
      approvalRecord: [],
      approveDetailList: [],
      reasonShow: false,
      popTitle: "",
      popContent: "",
      fileList: [],
      appShow: false,
      popReason: "",
      bottomShow: false,
      nextAppRole: "",
      approvalOptions: [],
      accessoryList: [],
      tableDTOS: [],
      receiveData: {},
      tabShow: false,
      flow: "",
	  tableHtml:[],
    };
  },
  onLoad(options) {
    let data = JSON.parse(options.row);
    console.log(data);
    let type = data.processingResult === 0 ? 2 : 1;
    this.receiveData = data;
    this.getDesignDetail(data.fkBusinessId, type);
  },
  computed:{
	user(){
		 return this.$store.state.userInfo;
	},
  },
  methods: {
    getDesignDetail(changeId, type) {
      uni.showLoading({
        mask: true,
      });
      // type查看类型：1 查看详情，2 处理查看详情
      this.$api
        .getDesignDetail({ changeId, type })
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.showData = res.data;
            this.approvalRecord = this.showData.taskFinishVoList
              ? this.showData.taskFinishVoList.map((item) => ({ ...item }))
              : [];
            if (type === 2) {
              this.findNextUser(
                this.showData.fkWorkflowTemplateId,
                this.showData.fkFlowCaseId,
                this.showData.currentNodeId
              );
              // deleteFlag为判定是否撤回后该审批人的附件
              this.accessoryList = this.showData.userFiles
                ? this.showData.userFiles
                : [];
              //   this.fileList = this.showData.fileVoList.filter(item => item.deleteFlag);
            } else {
              this.accessoryList = this.showData.userFiles
                ? this.showData.userFiles
                : [];
            }
            this.flow = res.data.hisProcessDiagram;
            // this.approveDetailList = this.showData.approveDetailList ? this.showData.approveDetailList.map(item => ({ ...item })) : [];
            this.tableDTOS = this.showData.tableDTOS
              ? this.showData.tableDTOS
              : [];
            if (this.tableDTOS.length) {
              let tableArr = this.tableDTOS.map((item, index) => ({
                name: item.tableName,
                idx: 1,
                tableInd: index,
              }));
              this.tabList.splice(1, 0, ...tableArr);
            }
            // this.tableDTOS.forEach((item) => {
            //   item.tableHtml = this.utils.unzip(item.tableHtml);
            //   if (item.tableHtml instanceof Array) {
            //   } else {
            //     item.tableHtml = JSON.parse(item.tableHtml);
            //   }
            // });
          } else {
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
    findNextUser(workflowTemplateId, flowCaseId, currentNodeId) {
      this.$api
        .findNextUser({ workflowTemplateId, flowCaseId, currentNodeId })
        .then((res) => {
          if (res.code === 200) {
            if (!res.data) {
              this.bottomShow = false;
            } else {
              this.approvalOptions = res.data.sysUserList
                ? res.data.sysUserList.map((item) => ({
                    ...item,
                    value: item.pkId,
                    label: item.userName,
                  }))
                : [];
              this.nextAppRole = res.data.roleName;
              this.bottomShow = true;
            }
          }
        });
    },
    currentChange(item) {
      console.log(item);
      this.current = item.index;
      this.idx = item.idx;
      if (item.idx === 1) {
        this.tableIndex = item.tableInd;
      }
    },
    // tab点击
    listSelet(item, index) {
      // 展开传值
      if (index !== undefined) {
        this.current = index;
      } else {
        this.current = item.index;
      }
      this.tabShow = false;
      this.idx = item.idx;
      if (item.idx === 1) {
        this.tableIndex = item.tableInd;
      }
    },
    // 汉堡点击展开tabs
    hamburg() {
      this.tabShow = !this.tabShow;
    },
    shut() {
      this.tabShow = false;
    },
    checkDetail(name, popReason) {
      this.popTitle = name;
      this.popReason = popReason;
      this.reasonShow = true;
    },
    closeReason() {
      this.reasonShow = false;
    },
    appBtn() {
		this.$refs.processForm.gzipTable();
      this.appShow = true;
    },
    closeApp() {
      this.appShow = false;
    },
	sendGzipTableHtml(e){
		console.log(e);
		this.tableHtml = e;
	},
    reject(e) {
      console.log(e);
      // let fileList = [...(this.showData.fileVoList ? this.showData.fileVoList.filter(item => item.deleteFlag) : []), ...e.fileList];
      let data = {
        // fileList,
        pkId: this.showData.pkId,
        approveStatus: 1,
        approveComment: e.opinion,
        // approveId: e.approverId
      };
      data.approveComment = data.approveComment
        ? data.approveComment
        : "审批不通过";
      uni.showLoading({
        mask: true,
      });
      this.$api
        .approvalProcess(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.showToast({ icon: "success", title: "审批成功" });
            this.closeApp();
            uni.navigateBack({
              delta: 1,
            });
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        })
        .catch((err) => {
          uni.hideLoading();
          // uni.showToast({icon:'none',title:'审批失败'})
        });
      // this.closeApp();
    },
    submit(e) {
      console.log(e);
      let fileList = [
        ...(this.showData.fileVoList
          ? this.showData.fileVoList.filter((item) => item.deleteFlag)
          : []),
        ...e.fileList,
      ];
      let data = {
        fileList,
        pkId: this.showData.pkId,
        approveStatus: 1,
        approveComment: e.opinion,
        approveId: e.approverId,
        signUrl: e.signUrl,
		tableDTOS:this.tableHtml
      };
      if (!this.bottomShow) {
        delete data.approveId;
      } else {
        if (!data.approveId) {
          return uni.showToast({ icon: "none", title: "请选择下一审批人" });
        }
      }
      if (!data.signUrl) {
        return uni.showToast({ icon: "none", title: "请签名" });
      }
      data.approveComment = data.approveComment
        ? data.approveComment
        : "审批通过";
		// 处理表格数据 压缩
    //   let table = this.tableDTOS;
    //   table.forEach((item) => {
    //     item.tableHtml = this.utils.zip(item.tableHtml);
    //   });
    //   data.tableDTOS = table;
      uni.showLoading({
        mask: true,
      });
      this.$api
        .approvalProcess(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.showToast({ icon: "success", title: "审批成功" });
            this.closeApp();
            uni.navigateBack({
              delta: 1,
            });
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        })
        .catch((err) => {
          uni.hideLoading();
          // uni.showToast({icon:'none',title:'审批失败'})
        });
    },
    downLoad(url) {
      const downLoadTask = uni.downloadFile({
        url: url, //仅为示例，并非真实的资源
        success: (res) => {
          if (res.statusCode === 200) {
            console.log("下载成功", res);
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: function (res2) {
                // var savedFilePath = res.savedFilePath;
                console.log(res2);
                uni.showToast({
                  title: "已保存至" + res2.savedFilePath,
                });
                setTimeout(() => {
                  uni.openDocument({
                    filePath: res2.savedFilePath,
                    success: (result) => {},
                  });
                }, 1000);
              },
            });
          }
        },
      });
    },
    selectOne(val) {
      this.tableDTOS[val.tableIndex].tableHtml[val.idx].arr[val.id].name =
        val.options.label;
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
.content {
  padding-bottom: 100rpx;
}
.detail {
  font-size: 28rpx;
  .detail-color {
    color: rgba(32, 52, 87, 1);
  }
  .detail-item {
    display: flex;
    background-color: #fff;
    margin-bottom: 10rpx;
    .left {
      width: 8rpx;
    }
    .right {
      width: 742rpx;
      padding: 20rpx;
      .item-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60rpx;
      }
      .item-title {
        width: 250rpx;
        font-size: 28rpx;
        font-weight: 700;
      }
      .custom-style {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150rpx;
        height: 50rpx;
        font-size: 26rpx;
        border: 1px solid #ccc;
        border-radius: 8rpx;
        background-color: #fff;
        color: #1576e6;
      }
      .hiddenView {
        position: relative;
        height: 90rpx;
        line-height: 30rpx;
        margin: 20rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        word-break: break-all;
        color: rgba(32, 52, 87, 1);
        &::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: linear-gradient(
            180deg,
            rgba(232, 243, 255, 0) 0%,
            rgba(232, 243, 255, 1) 100%
          );
          z-index: 1;
        }
      }
      .item-reason {
        min-height: 50rpx;
        margin: 20rpx;
        line-height: 30rpx;
        color: rgba(32, 52, 87, 1);
      }
      .item-files {
        display: flex;
        align-items: center;
        background-color: #fff;
        height: 80rpx;
        .file-name {
          width: 550rpx;
          height: 40rpx;
          line-height: 40rpx;
          font-size: 30rpx;
        }
      }
    }
  }
}
.reasonPop {
  width: 560rpx;
  height: 600rpx;
  border-radius: 20rpx;
  background-color: #d7d7d7;
  overflow: hidden;
  .reasonPop-header {
    position: relative;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: #fff;
    .reasonPop-closeBtn {
      position: absolute;
      right: 20rpx;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .reasonPop-content {
    padding: 20rpx;
    .reasonPop-reason {
      overflow: auto;
      height: 480rpx;
      padding: 20rpx;
      border-radius: 20rpx;
      font-size: 28rpx;
      background-color: #fff;
    }
  }
}
.fileList {
  .fileList-item {
    margin-bottom: 10rpx;
    .file-icon {
      width: 60rpx;
    }
    .file-name {
      width: 550rpx;
      height: 40rpx;
      line-height: 40rpx;
      font-size: 30rpx;
    }
    .upload {
      display: flex;
      justify-content: space-between;
    }
    .upload-files {
      border-bottom: 1px solid rgba(238, 238, 238, 1);
    }
  }
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
.comonView {
  display: flex;
  align-items: center;
  background-color: #fff;
  height: 80rpx;
  padding: 0 20rpx;
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  // height: 100rpx;
  background-color: #fff;
}
.mb-20 {
  margin-bottom: 20rpx;
}
.bgc1 {
  background-color: #dddddd;
}
.bgc2 {
  background-color: #8fc3ff;
}
.bgc3 {
  background-color: #ffabab;
}
.bgc4 {
  background-color: #e8f3ff;
}
.bgc5 {
  background-color: #fff7f7;
}
.tar {
  text-align: right;
  color: rgba(32, 52, 87, 1);
}
.bdb {
  border-bottom: 1px solid rgba(238, 238, 238, 1);
}
.mr-20 {
  margin-right: 20rpx;
}
.lh-36 {
  line-height: 36rpx;
}
.text-hidden {
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁⽌换⾏*/
  text-overflow: ellipsis; /*省略号*/
}
.record-item {
  .record-item-title {
    width: 160rpx;
    height: 40rpx;
    margin: 10rpx 0;
    line-height: 40rpx;
    font-size: 24rpx;
    text-align: center;
    background-color: #eeeeee;
  }
  .record-item-list {
    display: flex;
    align-items: center;
    height: 160rpx;
    padding: 24rpx;
    background-color: #fff;
    .list-content {
      width: 520rpx;
      padding: 0 20rpx;
    }
    .list-type {
      color: #72809a;
      font-size: 24rpx;
    }
    .type {
      width: 100rpx;
      color: #72809a;
      font-size: 26rpx;
      text-align: center;
    }
  }
}
.file-icon {
  width: 60rpx;
}
.hamburg {
  padding-left: 4rpx;
  border-left: 1px solid #d5d0d0;
}
.pull-down {
  width: 100%;
  color: #d5d9df;
  font-size: 28rpx;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: absolute;
  top: 0;
  z-index: 999;
  background: #fff;
  border-radius: 0 0 20rpx 20rpx;
  .item-tab {
    width: 33.33%;
    padding: 29rpx;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
// 下拉选中颜色
.action {
  color: #203457;
}
.arrow-up {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.flow {
  overflow: auto;
  width: 750rpx;
}
.fw-700 {
  font-weight: 700;
}
.downLoad {
  width: 80rpx;
  text-align: center;
  font-size: 28rpx;
}
.psr{
	position: relative;
}
</style>
