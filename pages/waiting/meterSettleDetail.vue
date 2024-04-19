<template>
  <view class="wrapper">
    <u-navbar
      leftText="计量结算"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>

    <view class="content">
      <u-sticky bgColor="#fff">
        <u-tabs
          :list="list"
          :current="current"
          @change="currentChange"
          class="tabs"
          :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
        >
          <view slot="right" style="padding-left: 4px" @tap="hamburg">
            <u-icon name="list" size="21" bold></u-icon>
          </view>
        </u-tabs>
      </u-sticky>
      <view class="pull-down" v-show="show">
        <text
          :class="index == current ? 'action' : ''"
          v-for="(item, index) in list"
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
      <view class="detail" v-if="current === 0">
        <view class="card">
          <view class="list-item"
            >结算名称:<text class="item">{{ showData.settleName }}</text></view
          >
          <view class="list-item"
            >结算对象:<text class="item">{{
              showData.settleOrgName
            }}</text></view
          >
          <view class="list-item"
            >计算周期:<text class="item"
              >{{ showData.beginDate }}至{{ showData.endDate }}</text
            >
          </view>
          <view class="list-item"
            >结算日期:<text class="item">{{ showData.settleDate }}</text></view
          >
          <view class="list-item"
            >上期末结算金额:<text class="item"
              >{{ showData.endSettleAmount }}元</text
            ></view
          >
          <view class="list-item"
            >本期结算金额:<text class="item"
              >{{ showData.settleAmount }}元</text
            ></view
          >
          <view class="list-item"
            >本期末结算金额:<text class="item"
              >{{ showData.endSettleAmount }}元</text
            ></view
          >
          <view class="list-item"
            >备注:<text class="item">{{ showData.remark }}</text></view
          >
          <!-- <view class="list-item">下一审批岗位:<text class="item">{{  showData.remark }}</text></view> -->
          <!-- <view class="list-item" >负责人:<text class="item">{{  showData.remark }}</text></view> -->
        </view>
      </view>
      <view v-if="idx === 1">
        <view>
          <!-- 表格 -->
          <uni-table border emptyText="暂无更多数据">
            <!-- 表头行 -->
            <uni-tr>
              <uni-th align="center" width="50">项目编号</uni-th>
              <uni-th align="center" width="80">项目名称</uni-th>
              <uni-th align="center" width="100">设计工程量</uni-th>
              <uni-th align="center" width="100">本期完成工程量</uni-th>
              <uni-th align="center" width="100">合同单价</uni-th>
              <!-- <uni-th align="center" width="50">设计产值</uni-th> -->
              <uni-th align="center" width="80">本期完成产值</uni-th>
            </uni-tr>
            <!-- 表格数据行 -->
            <uni-tr
              v-for="(item, index) in showData.settleDetails"
              :key="index"
            >
              <uni-td align="center">{{ item.itemCode }}</uni-td>
              <uni-td align="center">{{ item.itemName }}</uni-td>
              <uni-td align="center">{{ item.grade == 4?item.finishNumber:'' }}</uni-td>
              <uni-td align="center">{{ item.grade == 4?item.finishNumber:'' }}</uni-td>
              <uni-td align="center">{{ item.price }}</uni-td>
              <!-- <uni-td align="center">{{ item.purchaseNum }}</uni-td> -->
              <uni-td align="center">{{ item.finishAmount }}</uni-td>
            </uni-tr>
          </uni-table>
        </view>
      </view>
      <!-- 费用列表 -->
      <view v-if="idx === 2">
        <!-- 表格 -->
        <uni-table border emptyText="暂无更多数据">
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
            <uni-td align="center">{{ item.costAmount }}</uni-td>
            <uni-td align="center">{{ item.settleAmount }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
      <!-- 分项减扣列表 -->
      <view v-if="idx === 3">
        <!-- 表格 -->
        <uni-table border emptyText="暂无更多数据">
          <!-- 表头行 -->
          <uni-tr>
            <uni-th align="center" width="80">清单项目名称</uni-th>
            <uni-th align="center" width="80">合同单价</uni-th>
            <uni-th align="center" width="80">设计工程量</uni-th>
            <uni-th align="center" width="80">设计产值</uni-th>
            <uni-th align="center" width="80">本期完成工程量</uni-th>
            <uni-th align="center" width="80">本期完成产值</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr v-for="(item, index) in showData.itemDeductions" :key="index">
            <uni-td align="center">{{ item.itemName }}</uni-td>
            <uni-td align="center">{{ item.price }}</uni-td>
            <uni-td align="center">{{ item.designNumber }}</uni-td>
            <uni-td align="center">{{ item.designAmount }}</uni-td>
            <uni-td align="center">{{ item.finishNumber }}</uni-td>
            <uni-td align="center">{{ item.finishAmount }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
      <!-- 结算列表 -->
      <view v-if="idx === 4">
        <!-- 表格 -->
        <uni-table border emptyText="暂无更多数据">
          <!-- 表头行 -->
          <uni-tr>
            <uni-th align="center" width="80">清单姓名名称</uni-th>
            <uni-th align="center" width="80">合同单价</uni-th>
            <uni-th align="center" width="80">设计工程量</uni-th>
            <uni-th align="center" width="80">设计产值</uni-th>
            <uni-th align="center" width="80">本期完成工程量</uni-th>
            <uni-th align="center" width="80">本期完成产值</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr v-for="(item, index) in showData.details" :key="index">
            <uni-td align="center">{{ item.itemName }}</uni-td>
            <uni-td align="center">{{ item.price }}</uni-td>
            <uni-td align="center">{{ item.designNumber }}</uni-td>
            <uni-td align="center">{{ item.designAmount }}</uni-td>
            <uni-td align="center">{{ item.finishNumber }}</uni-td>
            <uni-td align="center">{{ item.finishAmount }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
      <!-- 审批附件记录 -->
      <view v-if="idx === 6">
        <view class="app-record" v-if="showData.statsTaskFinishList.length">
          <view
            class="app-record-item"
            v-for="(item, index) in showData.statsTaskFinishList"
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
              </view>
            </view>
          </view>
        </view>
        <view v-else class="no-data"> 暂无数据 </view>
      </view>
      <!-- 动态表格 -->
      <view v-if="idx === 5">
        <table
          style="border-collapse: collapse; overflow: auto; margin: 0 auto"
          ref="printPage"
          :key="tableIndex"
        >
          <tr
            v-for="(item, idx) in tableDTOS[tableIndex].tableHtml"
            :key="idx"
            style=""
            v-show="item.status"
          >
            <td
              style="
                box-sizing: content-box;
                border: none;
                margin: 0;
                padding: 0;
              "
              v-for="(i, id) in item.arr"
              :style="[i.style]"
              :key="id"
              :rowspan="i.row"
              :colspan="i.span"
              :id="'td' + idx + id"
              :ref="'td' + idx + id"
            >
              <input
                type="text"
                v-model="i.name"
                :disabled="
                  i.disabled == false || (i.id == user.pkId && i.name != '')
                "
                v-show="i.attributeTypes == 1 && i.checkout == false"
                @blur="tdBlur(i)"
              />
              <input
                v-if="i.attributeTypes == 1 && i.checkout == 1"
                :disabled="i.id != '' && i.id == user.pkId && i.name != ''"
                @input="tdNameChange(item, id, i.name)"
                @blur="tdNameBlur(item, id, i.name)"
                v-model="i.name"
              />
              <span v-if="i.attributeTypes == 3"
                >{{ i.signatureDate.content }}:</span
              >
              <!-- <select
                ref="scroll"
                v-if="i.attributeTypes == 2"
                size="mini"
                :disabled="i.id != '' && i.id == user.pkId && i.name != ''"
                v-model="i.name"
								:value="i.name"
                placeholder="请选择"
              >
                <option
                  v-for="(e, index) in i.option"
                  :key="index"
                  :label="e.label"
                  :value="e.label"
                ></option>
              </select> -->
              <!-- <hyj-select v-model="i.name" placeholder="请选择" :key="id" v-if="i.attributeTypes == 2" :disabled="i.id != '' && i.id == user.pkId && i.name != ''">
								<hyj-option v-for="(item,index) in  i.option" :label="item.label" :key="index"   :value="item.label" ></hyj-option>
						  </hyj-select> -->
              <easy-select
                ref="easySelect"
                size="medium"
                :tableIndex="tableIndex"
                :idx="idx"
                :id="id"
                v-if="i.attributeTypes == 2"
                :options="i.option"
                :value="i.name"
                @selectOne="selectOne"
              ></easy-select>
            </td>
          </tr>
        </table>
      </view>
      <!-- 材料扣减列表 -->
      <view v-if="idx === 7">
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
          <uni-tr v-for="(item, index) in showData.details" :key="index">
            <uni-td align="center">{{ item.materialName }}</uni-td>
            <uni-td align="center">{{ item.materialTypeName }}</uni-td>
            <uni-td align="center">{{ item.supplyNum }}</uni-td>
            <uni-td align="center">{{ item.excessPrice }}</uni-td>
            <uni-td align="center">{{
              item.supplyNum * item.excessPrice
            }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
    </view>
    <suspensionTabs :process="true" @tabsExamine="tabsExamine"></suspensionTabs>
    <view class="footer" v-if="rowData.handleStatus === 0">
      <u-button
        type="primary"
        text="处理"
        @click="appBtn"
        class="btn"
      ></u-button>
    </view>
    <approvePopup
      :app-show="appShow"
      @close="closeApp"
      @reject="reject"
      @submit="submit"
      :approverName="approverName"
      :approverList="approverList"
      :approverShow='approverShow'
      :app-title="'节点审批设置'"
    ></approvePopup>
  </view>
</template>

<script>
import approvePopup from "../../components/approve-popup/approve-popup";
import suspensionTabs from "../../components/suspension-tabs/suspension-tabs"
export default {
  components: { approvePopup ,suspensionTabs},
  data() {
    return {
      list: [
        { name: "结算信息", idx: 0 },
        { name: "分项列表", idx: 1 },
        { name: "费用列表", idx: 2 },
        { name: "分项扣减列表", idx: 3 },
        { name: "结算列表", idx: 4 },
        { name: "审批附件记录", idx: 6 },
      ],
      current: 0,
      tableIndex: 0,
      idx: 0,
      appShow: false,
      model1: { orderApplyMaterialDetails: [] },
      appRecordList: [
        {
          upName: "张三",
          time: "2022-10-05",
          content: "13212131231",
          files: [
            { name: "设计变更计划.pdf" },
            { name: "设计变更计划2.pdf" },
            { name: "设计变更计划3.pdf" },
          ],
        },
        {
          upName: "李四",
          time: "2022-10-06",
          content: "13212131231sfsdfsd",
          files: [{ name: "流程图.png" }],
        },
      ],
      show: false,
      rowData: {},
      tableDTOS: [],
      engDeductionDetailVos: [],
      showData: {
        engExpenseDetailVos: [],
        itemDeductions: [],
        details: [],
        statsTaskFinishList: [],
        statsSysRole: {
          sysUserList: [],
        },
      },
      user: {},
      approverName:'',
      approverList:[],
      approverShow:false
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);
    this.user = uni.getStorageSync("user");
    this.user.pkId = this.user.userId;

    this.projectQuerySettleInfo(this.rowData.fkBusinessId);
  },
  methods: {
    tabsExamine(val){
      console.log(val)
    },
    selectOne(val) {
      this.tableDTOS[val.tableIndex].tableHtml[val.idx].arr[val.id].name =
        val.options.label;
      this.tableDTOS[val.tableIndex].tableHtml[val.idx].arr[val.id].id =
        this.user.pkId;
    },
    projectQuerySettleInfo(id) {
      this.$api.projectQuerySettleInfo({ settleId: id }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.showData = res.data;
          this.findUserListByWorkflowId()
          this.tableDTOS = this.showData.tableDTOS
            ? this.showData.tableDTOS
            : [];

          if (this.tableDTOS.length) {
            let tableArr = this.tableDTOS.map((item, index) => ({
              name: item.tableName,
              idx: 5,
              tableInd: index,
            }));
            this.list.splice(5, 0, ...tableArr);
            // 处理表格
            this.tableDTOS.forEach((item) => {
              item.tableHtml = this.utils.unzip(item.tableHtml);
              if (item.tableHtml instanceof Array) {
              } else {
                item.tableHtml = JSON.parse(item.tableHtml);
              }
            });
          }
          this.engDeductionDetailVos = this.showData.engDeductionDetailVos
            ? this.showData.engDeductionDetailVos
            : [];
          if (this.engDeductionDetailVos.length) {
            this.list.splice(7, 0, ...[{ name: "材料扣减表", idx: 7 }]);
          }
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    findUserListByWorkflowId(){
      this.$api.findUserListByWorkflowId({pkId:this.rowData.fkBusinessId}).then(res=>{
        if(res.code===200){
          if(res.data){
            this.approverName=res.data.roleName
            this.approverList=res.data.sysUserList?res.data.sysUserList.map((item) => ({
                  label: item.userName,
                  value: item.pkId,
                })):[]
            this.approverShow=true
          }else{
            this.approverShow=false
          }
        }else{
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      })
    },
    hamburg() {
      this.show = true;
    },
    shut() {
      this.show = false;
    },
    listSelet(item, index) {
      // 展开传值
      if (index !== undefined) {
        this.current = index;
        this.idx = item.idx;
      } else {
        this.current = item.index;
      }
      this.show = false;
    },
    currentChange(item) {
      this.current = item.index;
      this.idx = item.idx;
      console.log(this.current);
      if (item.idx === 5) {
        this.tableIndex = item.tableInd;
      }
    },
    appBtn() {
      this.appShow = true;
    },
    closeApp() {
      this.appShow = false;
    },
    reject(e) {
      let data = {
        pkId: this.showData.pkId,
        auditStatus: 2,
        signUrl: e.signUrl,
        approveComment: e.opinion,
      };
      this.$api
        .projectExamine(data)
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
    submit(e) {
      let fileList = [
        ...(this.showData.fileVoList
          ? this.showData.fileVoList.filter((item) => item.deleteFlag)
          : []),
        ...e.fileList,
      ];
      let data = {
        currentNodeId: this.showData.currentNodeId,
        pkId: this.showData.pkId,
        auditStatus: 1,
        signUrl: e.signUrl,
        approveComment: e.opinion,
        fkApproverId: e.approverId,
        prodReProcessFileList: fileList,
      };
      if (this.bottomShow) {
        delete data.approveId;
      } else {
        // if (!data.fkApproverId) {
        //   return uni.showToast({ icon: "none", title: "请选择下一审批人" });
        // }
      }
      // if (!data.signUrl) {
      //   return uni.showToast({ icon: "none", title: "请签名" });
      // }
      // 处理表格数据 压缩
      let table = this.tableDTOS;
      table.forEach((item) => {
        item.tableHtml = this.utils.zip(item.tableHtml);
      });
      data.tableDTOS = table;
      this.$api
        .projectExamine(data)
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
    tdBlur(i) {
      i.id = this.user.pkId;
    },
    // 表格校验
    tdNameChange(item, id, val) {
      //  纯数字
      if (item.arr[id].checkType == 1) {
        val = val.replace(/[^0-9]/g, "");
        item.arr[id].name = val;
      }
      // 小数
      if (item.arr[id].checkType == 2) {
        val = val.replace(/[^\d.]/g, "");
        item.arr[id].name = val;
      }
      // 金额
      if (item.arr[id].checkType == 3) {
        val = val.replace(/[^\d.]/g, ""); // 清除“数字”和“.”以外的字符
        val = val.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
        val = val.replace(".", "$#$");
        val = val.replace(/\./g, "");
        val = val.replace("$#$", ".");
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
        item.arr[id].name = val;
      }
      // // 日期
      if (item.checkType == 4) {
        val = val.replace(/[^0-9-]/g, "");
        item.arr[id].name = val;
      }
      // 电话号码
      if (item.arr[id].checkType == 5) {
        val = val.replace(/[^0-9]/g, "");
        val = val.slice(0, 11);
        if (val.length >= 11) {
          const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
          if (!reg.test(val)) {
            uni.showToast({ icon: "none", title: "请输入正确的手机号" });
            item.arr[id].name = "";
          } else {
            item.arr[id].name = val;
          }
        }
      }
      // 身份证
      if (item.checkType == 6) {
        val = val.replace(
          /[\u4e00-\u9fa5/\s+/]|[^a-zA-Z0-9\u4E00-\u9FA5]/g,
          ""
        );
        item.arr[id].name = val;
      }
    },
    // 表格校验
    tdNameBlur(item, id, val) {
      // 手机号
      if (item.arr[id].checkType == 5) {
        const mobile = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (val.length != 0) {
          if (!mobile.test(val)) {
            uni.showToast({ icon: "none", title: "请输入正确的手机号" });
            item.arr[id].name = "";
          }
        }
      }

      // 日期
      if (item.arr[id].checkType == 4) {
        const data =
          /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
        if (val.length != 0) {
          if (data.test(val)) {
          } else {
            item.arr[id].name = "";
            return uni.showToast({
              icon: "none",
              title: "请输入正确的时间格式xxxx-xx-xx",
            });
          }
        }
      }
      // 身份证
      if (item.arr[id].checkType == 6) {
        const reg =
          /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        // 15位身份证号码校验正则
        const regs =
          /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/;
        if (val.length != 0) {
          if (reg.test(val) || regs.test(val)) {
          } else {
            item.arr[id].name = "";
            return uni.showToast({
              icon: "none",
              title: "请输入正确的身份证号码",
            });
          }
        }
      }
      item.arr[id].id = this.user.pkId;
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
}
// 详情
.card {
  background: #fff;
  border-left: 8rpx solid #dddddd;
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
}
.tabs {
  padding: 0 12rpx;
  font-size: 20rpx;
  .hamburg {
    padding-left: 4rpx;
    border-left: 1px solid #d5d0d0;
  }
}
// 下拉选中颜色
.action {
  color: #203457;
}
.pull-down {
  color: #d5d9df;
  font-size: 28rpx;
  padding-bottom: 60rpx;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: absolute;
  top: 0;
  z-index: 999;
  background: #fff;
  border-radius: 0 0 20rpx 20rpx;
  text {
    width: 33.33%;
    padding: 29rpx;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  // height: 100rpx;
  background-color: #fff;
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
