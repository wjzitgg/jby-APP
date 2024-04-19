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
        :scrollable="true"
        :activeStyle="{ color: 'rgba(32, 52, 87, 1)' }"
        :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }"
      >
        <view slot="right" class="hamburg" @tap="hamburg"
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
    <view v-show="idx === 0" class="detail">
      <view class="detail-item">
        <!-- <view class="left bgc1"></view> -->
        <view class="right">
          <view class="mb-20"
            ><text class="fw-700">处理结果：</text
            ><text class="detail-color">{{
              showData.approveStatus ? "审批通过" : "审批不通过"
            }}</text></view
          >
          <view class="mb-20"
            ><text class="fw-700">处理岗位：</text
            ><text class="detail-color">{{ showData.roleName }}</text></view
          >
          <view class="mb-20"
            ><text class="fw-700">处理人：</text
            ><text class="detail-color">{{ showData.approver }}</text></view
          >
          <view class="mb-20"
            ><text class="fw-700">处理时间：</text
            ><text class="detail-color">{{ showData.approveTime }}</text></view
          >
          <view class="mb-20"
            ><text class="fw-700">处理意见：</text
            ><text class="detail-color">{{ showData.approveComment }}</text>
          </view>
        </view>
      </view>
    </view>
    <view v-show="idx === 1">
      <!-- @sendGzipTableHtml='sendGzipTableHtml' -->
      <processForm
        :tableData="workflowTableList"
        :disabled="true"
        :tableIndex="tableIndex"
        ref="processForm"
      ></processForm>
    </view>
    <view v-show="idx === 2">
      <view class="fileList">
        <view
          class="fileList-item"
          v-for="(item2, index2) in fileList"
          :key="index2"
        >
          <u-icon class="file-icon" name="file-text" size="28"></u-icon>
          <view class="file-name text-hidden" @click="preview(item2)">{{
            item2.fileName
          }}</view>
          <view class="downLoad" @click="downLoad(item2.fileUrl)">下载</view>
        </view>
      </view>
    </view>
    <view v-if="type == 3 && idx == 3">
      <view v-if="settleIdx === 0" style="width: 750rpx; overflow: auto">
        <view>
          <!-- 表格 -->
          <uni-table border emptyText="暂无更多数据" :key="idx">
            <!-- 表头行 -->
            <uni-tr>
              <uni-th align="center" width="100">项目编号</uni-th>
              <uni-th align="center" width="100">项目名称</uni-th>
              <uni-th align="center" width="100">设计工程量</uni-th>
              <uni-th align="center" width="160">本期完成工程量</uni-th>
              <uni-th align="center" width="100">合同单价</uni-th>
              <uni-th align="center" width="100">金额</uni-th>
              <uni-th align="center" width="160">本期结算金额</uni-th>
            </uni-tr>
            <!-- 表格数据行 -->
            <uni-tr
              v-for="(item, index) in showData.settleDetails"
              :key="index"
            >
              <uni-td align="center">{{ item.itemCode }}</uni-td>
              <uni-td align="center">{{ item.itemName }}</uni-td>
              <uni-td align="center">{{ item.designNumber }}</uni-td>
              <uni-td align="center">{{ item.finishNumber }}</uni-td>
              <uni-td align="center">{{
                menuCodeData == 1 ? item.price : "***"
              }}</uni-td>
              <uni-td align="center">{{
                menuCodeData == 1 ? item.designAmount : "***"
              }}</uni-td>
              <uni-td align="center">{{
                menuCodeData == 1 ? item.settleAmount : "***"
              }}</uni-td>
            </uni-tr>
          </uni-table>
        </view>
      </view>
      <!-- 费用列表 -->
      <view v-if="settleIdx === 1" style="width: 740rpx; overflow: auto">
        <!-- 表格 -->
        <uni-table border emptyText="暂无更多数据" :key="idx">
          <!-- 表头行 -->
          <uni-tr>
            <uni-th align="center" width="80">费用名称</uni-th>
            <uni-th align="center" width="100">合同金额</uni-th>
            <uni-th align="center" width="50">结算金额</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr
            v-for="(item, index) in showData.engExpenseDetailVos"
            :key="index"
          >
            <uni-td align="center">{{ item.detailName }}</uni-td>
            <uni-td align="center">{{
              menuCodeData == 1 ? item.costAmount : "***"
            }}</uni-td>
            <uni-td align="center">{{
              menuCodeData == 1 ? item.settleAmount : "***"
            }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
      <!-- 分项减扣列表 -->
      <view v-if="settleIdx === 2" style="width: 750rpx; overflow: auto">
        <!-- 表格 -->
        <uni-table border emptyText="暂无更多数据" :key="idx">
          <!-- 表头行 -->
          <uni-tr>
            <uni-th align="center" width="140">清单项目名称</uni-th>
            <uni-th align="center" width="100">合同单价</uni-th>
            <uni-th align="center" width="120">设计工程量</uni-th>
            <uni-th align="center" width="100">金额</uni-th>
            <uni-th align="center" width="160">本期完成工程量</uni-th>
            <uni-th align="center" width="160">本期结算金额</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr v-for="(item, index) in showData.itemDeductions" :key="index">
            <uni-td align="center">{{ item.itemName }}</uni-td>
            <uni-td align="center">{{
              menuCodeData == 1 ? item.price : "***"
            }}</uni-td>
            <uni-td align="center">{{ item.designNumber }}</uni-td>
            <uni-td align="center">{{
              menuCodeData == 1 ? item.designAmount : "***"
            }}</uni-td>
            <uni-td align="center">{{ item.finishNumber }}</uni-td>
            <uni-td align="center">{{
              menuCodeData == 1 ? 0 - item.settleAmount : "***"
            }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
      <!-- 结算列表 -->
      <view v-if="settleIdx === 3" style="width: 750rpx; overflow: auto">
        <!-- 表格 -->
        <uni-table border emptyText="暂无更多数据" :key="idx">
          <!-- 表头行 -->
          <uni-tr>
            <uni-th align="center" width="100">子目号</uni-th>
            <uni-th align="center" width="200">清单姓名名称</uni-th>
            <uni-th align="center" width="120">设计工程量</uni-th>
            <uni-th align="center" width="100">合同单价</uni-th>
            <uni-th align="center" width="100">金额</uni-th>
            <uni-th align="center" width="160">本期完成工程量</uni-th>
            <uni-th align="center" width="140">本期结算金额</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr v-for="(item, index) in showData.settleInfoList" :key="index">
            <uni-td align="center">{{ item.subitemNum }}</uni-td>
            <uni-td align="center">{{ item.detailName }}</uni-td>
            <uni-td align="center">{{ item.quantities }}</uni-td>
            <uni-td align="center">{{
              menuCodeData == 1 ? item.price : "***"
            }}</uni-td>
            <uni-td align="center">{{
              menuCodeData == 1 ? item.settleAmount : "***"
            }}</uni-td>
            <uni-td align="center">{{ item.currentQuantities }}</uni-td>
            <uni-td align="center">{{
              menuCodeData == 1 ? item.currentSettleAmount : "***"
            }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
      <!-- 材料扣减列表 -->
      <view v-if="settleIdx === 4" style="width: 750rpx; overflow: auto">
        <!-- 表格 -->
        <uni-table border emptyText="暂无更多数据">
          <!-- 表头行 -->
          <uni-tr>
            <uni-th align="center" width="80">物料名称</uni-th>
            <uni-th align="center" width="80">物料分类</uni-th>
            <uni-th align="center" width="80">超额供应量</uni-th>
            <uni-th align="center" width="80">超额扣款单价</uni-th>
            <uni-th align="center" width="80">超额扣款金额</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr v-for="(item, index) in engDeductionDetailVos" :key="index">
            <uni-td align="center">{{ item.materialName }}</uni-td>
            <uni-td align="center">{{ item.materialTypeName }}</uni-td>
            <uni-td align="center">{{ item.supplyNum }}</uni-td>
            <uni-td align="center">{{
              menuCodeData == 1 ? item.excessPrice : "***"
            }}</uni-td>
            <uni-td align="center">{{
              menuCodeData == 1 ? 0 - item.supplyNum * item.excessPrice : "***"
            }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
    </view>
    <u-popup
      :show="previewShow"
      mode="center"
      round="10"
      closeable
      @close="closePreview"
    >
      <view class="preview">
        <view class="preview-top">预览</view>
        <pdf
          :fileUrl="previewUrl"
          :iframeStyle="{ width: '700rpx', height: '1080rpx' }"
          :imgs="false"
        ></pdf>
      </view>
    </u-popup>
  </view>
</template>

<script>
import pdf from "../../components/pdf-preview.vue";
import processForm from "../../components/process-form/process-form.vue";
export default {
  components: { processForm, pdf },
  data() {
    return {
      tabList: [
        { name: "基本信息", idx: 0 },
        { name: "附件", idx: 2 },
      ],
      current: 0,
      tableIndex: 0,
      workflowTableList: [],
      tabShow: false,
      idx: 0,
      fileList: [],
      showData: {},
      type: "", //1为设计变更，2为盘点单，3为计量
      previewShow: false,
      previewUrl: "",
      settleIdx: 0,
      menuCodeData: "",
      engDeductionDetailVos: [],
    };
  },
  onLoad(options) {
    console.log(options);
    this.type = options.type - 0;
    let obj = options.data ? JSON.parse(options.data) : {};
    this.searchByBusinessNode(obj.flowCaseId, obj.currentNodeId,obj.taskId);
    this.searchMenuDataAuthorize();
  },
  methods: {
    // 获取当前登录用户角色关联菜单权限数据集
    searchMenuDataAuthorize() {
      this.$api.searchMenuDataAuthorize().then((res) => {
        if (res.code == 200) {
          res.data.forEach((element) => {
            if (element.menuCode == "settlement") {
              this.menuCodeData = element.states;
            }
          });
        } else {
          uni.showToast({ icon: "none", title: res.msg });
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
      if (item.idx == 3) {
        this.settleIdx = item.settleIdx;
      }
    },
    searchByBusinessNode(flowCaseId, nodeId,taskId) {
      let data = { flowCaseId, nodeId,taskId };
      uni.showLoading({ mask: true });
      this.$api
        .searchByBusinessNode(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            if (this.type === 1) {
              this.showData = res.data.changeDesignDetailVo;
            } else if (this.type === 2) {
              this.showData = res.data.engMatOrderInventoryVo;
            } else if (this.type === 3) {
              this.showData = res.data.engStatsProjectSettleVo;
              if (nodeId == "0") {
                this.engDeductionDetailVos = this.showData.engDeductionDetailVos
                  ? this.showData.engDeductionDetailVos
                  : [];
                let arr = [
                  { name: "分项列表", idx: 3, settleIdx: 0 },
                  { name: "费用列表", idx: 3, settleIdx: 1 },
                  { name: "分项减扣列表", idx: 3, settleIdx: 2 },
                  { name: "结算列表", idx: 3, settleIdx: 3 },
                ];
                if (this.engDeductionDetailVos.length) {
                  arr.push({ name: "材料扣减列表", idx: 3, settleIdx: 4 });
                }
                this.tabList.splice(1, 0, ...arr);
              }
            }
            this.fileList = this.showData.fileList;
            let arr = JSON.stringify(this.showData.workflowTableList);
            this.workflowTableList = JSON.parse(arr);
            if (this.workflowTableList.length) {
              let tableArr = this.workflowTableList.map((item, index) => ({
                name: item.tableName,
                idx: 1,
                tableInd: index,
              }));
              this.tabList.splice(1, 0, ...tableArr);
            }
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
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
      if (item.idx === 0) {
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
    preview(item) {
      this.$checkName(item.fileUrl);
      return;
      this.previewUrl = item.fileUrl;
      this.previewShow = true;
    },
    closePreview() {
      this.previewShow = false;
      this.previewUrl = "";
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
.detail {
  font-size: 28rpx;
  .detail-color {
    color: rgba(32, 52, 87, 1);
  }
  .mb-20 {
    display: flex;
    align-items: center;
    height: 60rpx;
    margin-bottom: 20rpx;
    border-bottom: 1px solid #eeeeee;
  }
  .bgc1 {
    background-color: #dddddd;
  }
  .fw-700 {
    font-weight: 700;
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
