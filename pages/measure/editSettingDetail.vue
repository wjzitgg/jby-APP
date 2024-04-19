<template>
  <view class="wrapper addPageBg">
    <u-navbar
      leftText="编辑结算信息"
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
        :scrollable="true"
        :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
      >
      </u-tabs>
    </view>
    <view class="pad"></view>
    <view class="content">
      <view v-show="idx === 0">
        <!-- <view class="add-inputs">
            <view class="inputs-label">备注</view>
            <view class="inputs-content">
              <u--textarea v-model="rowData.remark" placeholder="请输入内容" autoHeight border="none" maxlength="100"></u--textarea>
            </view>
          </view> -->
        <view class="add-inputs">
          <view class="inputs-label">结算名称</view>
          <view class="inputs-content" >
            <u--textarea v-model="form.settleName" placeholder="请输入内容" autoHeight border="none" maxlength="100" :disabled="step==2"></u--textarea>
          </view>
        </view>
        <!-- <view class="add-inputs">
          <view class="inputs-label">结算单位</view>
          <view class="inputs select" @click="openPicker(1)">
            <view class="name">{{ form.fkProjectName }}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view> -->
        <view class="add-inputs">
          <view class="inputs-label">合同名称</view>
          <view class="inputs-content select" :class="{disabled:step==2}" @click="openPicker(1)">
            <view class="name">{{ form.contractName }}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <!-- <view class="add-inputs">
          <view class="inputs-label">结算周期</view>
          <view class="timers">
            <view class="time disabled">{{ form.beginDate }}</view>
            <view class="to">至</view>
            <view class="time" :class="{disabled:step==2}" @click="openCale(1,form.endDate)">{{ form.endDate }}</view>
          </view>
        </view> -->
        <view class="add-inputs">
          <view class="inputs-label">结算开始日期</view>
          <view class="inputs-content select">
            <view>{{ form.beginDate }}</view>
            <u-icon name="lock-fill" class="icons" size="14"></u-icon>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">结算结束日期</view>
          <view class="inputs-content select" @click="openCale(1,form.endDate)">
            <view>{{ form.endDate }}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">结算日期</view>
          <view class="inputs-content select" :class="{disabled:step==2}" @click="openCale(2,form.settleDate)">
            <view class="name">{{ form.settleDate }}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">上期末结算金额</view>
          <view class="inputs-content select">
            <view class="name">{{ form.lastSettleAmount }}</view>
            <u-icon name="lock-fill" class="icons" size="14"></u-icon>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">本期结算金额</view>
          <view class="inputs-content select">
            <view class="name">{{ form.settleAmount }}</view>
            <u-icon name="lock-fill" class="icons" size="14"></u-icon>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">税金</view>
          <view class="inputs-content select">
            <view class="name">{{ form.taxes }}</view>
            <u-icon name="lock-fill" class="icons" size="14"></u-icon>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">本期含税金额</view>
          <view class="inputs-content select">
            <view class="name">{{ form.settleTotalAmount }}</view>
            <u-icon name="lock-fill" class="icons" size="14"></u-icon>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">本期末结算金额</view>
          <view class="inputs-content select">
            <view class="name">{{ form.endSettleAmount }}</view>
            <u-icon name="lock-fill" class="icons" size="14"></u-icon>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">备注</view>
          <view class="inputs-content">
            <u--textarea v-model="form.remark" placeholder="请输入内容" autoHeight border="none" maxlength="100" :disabled="step==2"></u--textarea>
          </view>
        </view>
        <view v-if="step==1" class="add-inputs">
          <view class="inputs-label">审批人设置</view>
          <view class="inputs-content setBtn">
            <view class="custom-style">
              <u-button
                :type="isSet?'primary':'error'"
                class="custom-style"
                :text="isSet?'已设置':'未设置'"
                @click="setApprover"
              ></u-button>
            </view>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">附件</view>
          <view class="inputs-fileList">
            <view v-if="fileList.length">
            <view class="inputs-fileList-item" v-for="(item, index) in fileList" :key="item.id">
							<view class="left">
								<u-icon class="icons" name="file-text" size="20"></u-icon>
								<view class="name text-hidden">{{ item.fileName }}</view>
							</view>
							<view class="file-closeBtn close" @click="delFile(item, index)" v-if="step==1"></view>
						</view>
            </view>
            <view class="fileListBtn">
            <lsj-upload v-if="step==1" ref="lsjUpload1" childId="upload2" :option="option" :size="size" :formats="formats" :debug="debug" :count="count" :nowCount="fileList.length" :instantly="instantly" @change="onChange" @progress="onprogress" @uploadEnd="onuploadEnd" >
              <view class="addBtn">上传附件</view>
            </lsj-upload>
            </view>
          </view>
        </view>
        <!-- <view class="approve-files">
          <view class="approve-files-head">
            <view class="inputs-label">附件</view>
            <lsj-upload
              v-if="step==1"
              ref="lsjUpload1"
              childId="upload2"
              :width="width"
              :height="height"
              :option="option"
              :size="size"
              :formats="formats"
              :debug="debug"
              :count="count"
              :nowCount="fileList.length"
              :instantly="instantly"
              @change="onChange"
              @progress="onprogress"
              @uploadEnd="onuploadEnd"
            >
              <view class="upload-btn" :style="{ width: width, height: height }"
                >上传附件</view
              >
            </lsj-upload>
          </view>
          <view class="fileList" v-if="!!fileList.length">
            <view
              class="fileList-item"
              v-for="(item, index) in fileList"
              :key="item.id"
            >
              <view class="left" >
                <u-icon class="icons" name="file-text" size="28"></u-icon>
                <view class="fileName text-hidden">{{ item.fileName }}</view>
              </view>
              <view class="file-closeBtn" @click="delFile(item, index)" v-if="step==1">X</view>
            </view>
          </view>
        </view> -->
      </view>
      <!-- 分项列表 -->
      <view v-if="idx===1">
        <uni-table border emptyText="暂无更多数据" :key="idx">
            <!-- 表头行 -->
            <uni-tr>
              <uni-th align="center" width="200">项目编号</uni-th>
              <uni-th align="center" width="200">项目名称</uni-th>
              <uni-th align="center" width="200">单位</uni-th>
              <uni-th align="center" width="200">合同单价</uni-th>
              <uni-th align="center" width="200">设计工程量</uni-th>
              <uni-th align="center" width="200">金额</uni-th>
              <uni-th align="center" width="200">完成工程量</uni-th>
              <uni-th align="center" width="200">结算金额</uni-th>
              <!-- <uni-th align="center" colspan="2" width="400">上期末</uni-th>
              <uni-th align="center" colspan="2" width="400">本期</uni-th>
              <uni-th align="center" colspan="2" width="400">本期末</uni-th> -->
              <!-- <uni-th align="center" width="160">本期完成工程量</uni-th>
              <uni-th align="center" width="160">本期结算金额</uni-th> -->
            </uni-tr>
            <!-- <uni-tr>
              <uni-th align="center" width="200">完成工程量</uni-th>
              <uni-th align="center" width="200">结算金额</uni-th>
              <uni-th align="center" width="200">完成工程量</uni-th>
              <uni-th align="center" width="200">结算金额</uni-th>
              <uni-th align="center" width="200">完成工程量</uni-th>
              <uni-th align="center" width="200">结算金额</uni-th>
            </uni-tr> -->
            <!-- 表格数据行 -->
            <uni-tr v-for="(item, index) in form.settleDetails" :key="index">
              <uni-td align="center">{{ item.itemCode }}</uni-td>
              <uni-td align="center">{{ item.itemName }}</uni-td>
              <uni-td align="center">{{ item.unitName }}</uni-td>
              <uni-td align="center">{{ item.grade == 4?item.price:'' }}</uni-td>
              <uni-td align="center">{{ item.grade == 4?item.designNumber:'' }}</uni-td>
              <uni-td align="center">{{ item.designAmount }}</uni-td>
              <!-- <uni-td align="center">{{ item.grade == 4?item.lastFinishNumber:'' }}</uni-td>
              <uni-td align="center">{{ item.lastFinishAmount }}</uni-td> -->
              <uni-td align="center">{{ item.grade == 4?item.finishNumber:'' }}</uni-td>
              <uni-td align="center">{{ item.settleAmount }}</uni-td>
              <!-- <uni-td align="center">{{ item.grade == 4?item.endFinishNumber:'' }}</uni-td>
              <uni-td align="center">{{ item.endFinishAmount }}</uni-td> -->
            </uni-tr>
          </uni-table>
      </view>
      <!-- 费用列表 -->
      <view v-if="idx===2">
        <uni-table border emptyText="暂无更多数据" :key="idx">
          <!-- 表头行 -->
          <uni-tr>
            <uni-th align="center" width="100">费用名称</uni-th>
            <uni-th align="center" width="100">合同金额</uni-th>
            <uni-th align="center" width="100">上期末结算金额</uni-th>
            <uni-th align="center" width="100">结算金额</uni-th>
            <uni-th align="center" width="100">本期末结算金额</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr v-for="(item, index) in form.engExpenseDetailVos" :key="index">
            <uni-td align="center">{{ item.detailName }}</uni-td>
            <uni-td align="center">{{item.type==1?item.costAmount:'' }}</uni-td>
            <uni-td align="center">{{ menuCodeData == 1 ? item.afterAmount : "***" }}</uni-td>
            <uni-td align="center">
              <u-input v-if="item.type==1" type="number" v-model="item.settleAmount" @input="priceInput($event,2,item)" @blur="expenBlur(item)"></u-input>
            </uni-td>
            <uni-td align="center">{{ menuCodeData == 1 ? item.type == 0 ? "" : ((item.afterAmount-0) + (item.settleAmount - 0)).toFixed(2) : "***" }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
      <!-- 分项扣减表 -->
      <view v-if="idx===3">
        <uni-table border emptyText="暂无更多数据" :key="idx">
          <!-- 表头行 -->
          <uni-tr>
            <uni-th align="center" width="140">清单项目名称</uni-th>
            <uni-th align="center" width="140">单位</uni-th>
            <uni-th align="center" width="100">合同单价</uni-th>
            <uni-th align="center" width="120">工程量</uni-th>
            <uni-th align="center" width="100">合同金额</uni-th>
            <uni-th align="center" width="160">本期完成工程量</uni-th>
            <uni-th align="center" width="160">本期结算金额</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr v-for="(item, index) in form.itemDeductions" :key="index">
            <uni-td align="center">{{ item.itemName }}</uni-td>
                <uni-td align="center">{{ item.unitName }}</uni-td>
                <uni-td align="center">{{ item.price }}</uni-td>
                <uni-td align="center">{{ item.designNumber }}</uni-td>
                <uni-td align="center">{{ item.designAmount }}</uni-td>
                <uni-td align="center">{{ item.finishNumber }}</uni-td>
                <uni-td align="center">{{ 0 - item.settleAmount }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
      <!-- 结算表 -->
      <view v-show="idx===4">
        <uni-table border emptyText="暂无更多数据" :key="idx">
          <!-- 表头行 -->
          <uni-tr>
            <uni-th align="center" width="100">子目号</uni-th>
            <uni-th align="center" width="140">清单姓名名称</uni-th>
            <uni-th align="center" width="120">设计工程量</uni-th>
            <uni-th align="center" width="100">合同单价</uni-th>
            <uni-th align="center" width="100">金额</uni-th>
            <uni-th align="center" width="160">本期完成工程量</uni-th>
            <!-- <uni-th align="center" width="100">结算单价</uni-th> -->
            <uni-th align="center" width="140">本期结算金额</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr v-for="(item, index) in detail" :key="index">
            <uni-td align="center">{{ item.subitemNum }}</uni-td>
            <uni-td align="center">{{ item.detailName }}</uni-td>
            <uni-td align="center">{{ item.quantities }}</uni-td>
            <uni-td align="center">{{ item.price }}</uni-td>
            <uni-td align="center">{{ item.settleAmount }}</uni-td>
            <uni-td align="center">{{ item.currentQuantities }}</uni-td>
            <!-- <uni-td align="center">{{ item.settlePrice }}</uni-td> -->
            <uni-td align="center">{{ item.currentSettleAmount }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
      <view v-show="idx === 5">
        <processForm
          :tableData="workflowTableList"
          :tableIndex="tableIndex"
          @sendGzipTableHtml="sendGzipTableHtml"
          :currentNodeId="currentNodeId"
          ref="processForm"
        ></processForm>
      </view>
      <!-- 材料扣减列表 -->
      <view v-if="idx === 7">
        <!-- 表格 -->
        <uni-table border emptyText="暂无更多数据">
              <!-- 表头行 -->
              <uni-tr>
                <uni-th align="center" width="80">子目号</uni-th>
                <uni-th align="center" width="80">材料名称</uni-th>
                <uni-th align="center" width="80">单位</uni-th>
                <uni-th align="center" width="80">超额供应量</uni-th>
                <uni-th align="center" width="80">超额扣款单价</uni-th>
                <uni-th align="center" width="80">累计超额供应量</uni-th>
                <uni-th align="center" width="80">超额应扣款金额</uni-th>
                <uni-th align="center" width="80">上期末累计扣款金额</uni-th>
                <uni-th align="center" width="80">本期扣款金额</uni-th>
                <uni-th align="center" width="80">本期末累计扣款金额</uni-th>
              </uni-tr>
              <!-- 表格数据行 -->
              <uni-tr
                v-for="(item, index) in engDeductionDetailVos"
                :key="index"
              >
                <uni-td align="center">{{ item.subitemNum }}</uni-td>
                <uni-td align="center">{{ item.materialName }}</uni-td>
                <uni-td align="center">{{ item.unitName }}</uni-td>
                <uni-td align="center">{{ item.supplyNum }}</uni-td>
                <uni-td align="center">{{ item.excessPrice }}</uni-td>
                <uni-td align="center">{{ item.supplyNum }}</uni-td>
                <uni-td align="center">{{ item.amount }}</uni-td>
                <uni-td align="center">{{ item.lastDeductionAmount }}</uni-td>
                <uni-td align="center"><u-input v-if="item.type==1" type="number" v-model="item.settleAmount" @input="priceInput($event,3,item)" @blur="expenBlur(item)"></u-input></uni-td>
                <uni-td align="center">{{ item.settleAmount?(item.lastDeductionAmount-0 + item.settleAmount-0):0 }}</uni-td>
              </uni-tr>
            </uni-table>
      </view>
      <!-- 汇总表 -->
      <view v-if="idx === 9" style="width:750rpx;overflow:auto">
        <!-- 表格 -->
        <uni-table border emptyText="暂无更多数据" :key="idx">
          <!-- 表头行 -->
          <uni-tr>
            <uni-th align="center" width="100">序号</uni-th>
            <uni-th align="center" width="140">章节名称</uni-th>
            <uni-th align="center" width="140">本期结算金额</uni-th>
            <uni-th align="center" width="140">开累结算金额</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr v-for="(item, index) in form.settleSummaryList?form.settleSummaryList:[]" :key="index">
            <uni-td align="center">{{ index + 1 }}</uni-td>
            <uni-td align="center">{{ item.chapterName }}</uni-td>
            <uni-td align="center">{{ item.currentSettleAmount }}</uni-td>
            <uni-td align="center">{{ item.settleAmount }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
      <!-- 章节列表 -->
      <view v-if="idx === 8" class="table_detail" style="width:750rpx;overflow:auto">
        <!-- 表格 -->
        <table>
          <thead>
            <tr>
              <th rowspan="2">子目号</th>
              <th rowspan="2">清单名称</th>
              <th rowspan="2">单位</th>
              <th rowspan="2">合同单价</th>
              <th colspan="2">上期末</th>
              <th colspan="2">开累</th>
              <th colspan="2">本期末</th>
            </tr>
            <tr>
							<th class="tuoTh">完成工程量</th>
							<th class="tuoTh">结算金额</th>
							<th class="tuoTh">完成工程量</th>
							<th class="tuoTh">结算金额</th>
							<th class="tuoTh">完成工程量</th>
							<th class="tuoTh">结算金额</th>
						</tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in chartTable" :key="index">
              <td>{{ item.subitemNum }}</td>
              <td>{{ item.detailName  }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.lastQuantities }}</td>
              <td>{{ item.lastSettleAmount }}</td>
              <td>{{ item.currentQuantities }}</td>
              <td>{{ item.currentSettleAmount }}</td>
              <td>{{ item.quantitiesAmount }}</td>
              <td>{{ item.settleAmount }}</td>
            </tr>
          </tbody>
        </table>
        <!-- <uni-table border emptyText="暂无更多数据" :key="idx">
          <uni-tr>
            <uni-th align="center" rowspan="2" width="100">子目号</uni-th>
            <uni-th align="center" rowspan="2" width="140">清单名称</uni-th>
            <uni-th align="center" rowspan="2" width="100">单位</uni-th>
            <uni-th align="center" rowspan="2" width="140">合同单价</uni-th>
            <uni-th align="center" colspan="2">本期</uni-th>
            <uni-th align="center" colspan="2">开累</uni-th>
            
          </uni-tr>
           <uni-tr>
            <uni-th align="center" width="200">完成工程量</uni-th>
            <uni-th align="center" width="140">结算金额</uni-th>
            <uni-th align="center" width="200">完成工程量</uni-th>
            <uni-th align="center" width="140">结算金额</uni-th>
          </uni-tr>
          <uni-tr v-for="(item, index) in chartTable" :key="index">
            <uni-td align="center">{{ item.subitemNum }}</uni-td>
            <uni-td align="center">{{ item.detailName }}</uni-td>
            <uni-td align="center">{{ item.unitName }}</uni-td>
            <uni-td align="center">{{ item.price }}</uni-td>
            <uni-td align="center">{{ item.currentQuantities }}</uni-td>
            <uni-td align="center">{{ item.currentSettleAmount }}</uni-td>
            <uni-td align="center">{{ item.quantitiesAmount }}</uni-td>
            <uni-td align="center">{{ item.settleAmount }}</uni-td>
          </uni-tr>
        </uni-table> -->
      </view>
    </view>
    <view class="pdb"></view>
    <view class="footer">
      <view class="btns saveBtn" v-if="step==2" @click="backStep">上一步</view>
      <view class="btns submitBtn" v-if="step==1" @click="nextStep">下一步</view>
      <view class="btns saveBtn" @click="btnOk(0)" v-if="step==1">保存草稿</view>
      <view class="btns submitBtn" @click="sendApprove" v-if="step==2&&!stats">发起流程</view>
      <view class="btns submitBtn" @click="appShow = true" v-if="step==2&&stats">发起流程</view>
    </view>
    <u-picker
      title="请选择"
      :show="pickerShow"
      :columns="[pickerList]"
      keyName="label"
      @confirm="pickerConfirm"
      @cancel="pickerCancel"
    ></u-picker>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" :end-date="today"/>
    <addPopup :app-show="appShow" @close="closeApp" @submit="submit" @signUrlImg="signUrlImg" :app-title="'签名'" @getSign="getSign" ref="addPopup" :tableData="workflowTableList" :roleId="approverList.workflowNodeDTOS?approverList.workflowNodeDTOS[1].fkRoleId:''"  :sysRoleId="approverList.workflowNodeDTOS?approverList.workflowNodeDTOS[1].sysRoleId:''"></addPopup>
  </view>
</template>

<script>
import processForm from "../../components/process-form/process-form.vue";
import request from "../../common/request";
import moment from "moment";
import addPopup from '../../components/approve-popup/add-popup.vue';
export default {
  components: { processForm ,addPopup},
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
    detail() {
      // const arr = this.form.settleDetails.filter(item=>item.grade==4)
      // const arr2 = [];
      // for (let i = 0; i < arr.length; i++) {
      //   let flag = true;
      //   for (let j = 0; j < arr2.length; j++) {
      //     if (arr[i].fkItemDetailId === arr2[j].fkItemDetailId) {
      //       arr2[j].finishAmount = (arr2[j].settleAmount - 0 + (arr[i].settleAmount - 0)).toFixed(2) - 0;
      //       arr2[j].designNumber = (arr2[j].designNumber - 0 + (arr[i].designNumber - 0)).toFixed(2) - 0;
      //       arr2[j].designAmount = (arr2[j].designAmount - 0 + (arr[i].designAmount - 0)).toFixed(2) - 0;
      //       arr2[j].finishNumber = (arr2[j].finishNumber - 0 + (arr[i].finishNumber - 0)).toFixed(2) - 0;
      //       arr2[j].settleAmount = (arr2[j].settleAmount - 0 + (arr[i].settleAmount - 0)).toFixed(2) - 0;
      //       flag = false;
      //     }
      //   }
      //   if (flag) {
      //     arr2.push({ ...arr[i], finishAmount: arr[i].settleAmount });
      //   }
      // }
      // const arr3 = this.form.engExpenseDetailVos.map(item => ({ ...item, itemName: item.detailName, price: item.costAmount, settlePrice: item.costAmount,designNumber: 1, designAmount: item.costAmount, finishNumber: item.costAmount ? (item.settleAmount / item.costAmount).toFixed(2) - 0 : 0, finishAmount: item.settleAmount }));
      // const arr4 = this.engDeductionDetailVos.map(item => ({ ...item, itemName: item.materialName, price: item.excessPrice, settlePrice: item.settlePrice, designNumber: item.supplyNum,finishNumber:item.supplyNum,designAmount:(item.supplyNum * item.settlePrice).toFixed(2) - 0, finishAmount: 0 - (item.supplyNum * item.settlePrice).toFixed(2) }));
      // let filterArr =  this.form.itemDeductions.filter(item=>item.grade==4)
      // const arr5 = [];
      // for (let i = 0; i < filterArr.length; i++) {
      //   let flag = true;
      //   for (let j = 0; j < arr5.length; j++) {
      //     if (filterArr[i].fkItemDetailId === arr5[j].fkItemDetailId) {
      //       arr5[j].finishAmount = (arr5[j].finishAmount - 0 + (filterArr[i].finishAmount - 0)).toFixed(2) - 0;
      //       arr5[j].designNumber = (arr5[j].designNumber - 0 + (filterArr[i].designNumber - 0)).toFixed(2) - 0;
      //       arr5[j].designAmount = (arr5[j].designAmount - 0 + (filterArr[i].designAmount - 0)).toFixed(2) - 0;
      //       arr5[j].finishNumber = (arr5[j].finishNumber - 0 + (filterArr[i].finishNumber - 0)).toFixed(2) - 0;
      //       arr5[j].settleAmount = (arr5[j].settleAmount - 0 - (filterArr[i].settleAmount - 0)).toFixed(2) - 0;
      //       flag = false;
      //     }
      //   }
      //   if (flag) {
      //     arr5.push({ ...filterArr[i], settleAmount: 0 - filterArr[i].settleAmount });
      //   }
      // }
      // // let arr5 = this.itemDeductions.filter(item => item.grade == 4).map(item => ({ ...item, itemName: item.itemName, price: item.price, designNumber: item.designNumber, finishAmount:0-item.finishNumber }));
      // const detailList = [...arr2, ...arr3, ...arr4, ...arr5.map(item => ({ ...item, finishAmount: item.settleAmount, finishNumber: 0 - item.finishNumber }))];
      return this.detailList
    },
    chartTable(){
     return this.form.settleChapterVos[this.chartIdx]?this.form.settleChapterVos[this.chartIdx].details:[]
    },
    
  },
  data() {
    return {
      // ,{ name: "结算表", idx: 4 }
      tabList: [{ name: "结算信息", idx: 0 },{ name: "分项列表", idx: 1 },{ name: "费用列表", idx: 2 }],
      current: 0,
      tableIndex: 0,
      idx: 0,
      pickerList: [],
      pickerType: 1,
      pickerShow: false,
      contentList:[],
      workflowTableList: [],
      tableHtml: [],
      form: {
        settleDetails:[],
        engExpenseDetailVos:[],
        itemDeductions:[]
      },
      settleType:'',
      // 上传接口参数
      option: {
        // 上传服务器地址，此地址需要替换为你的接口地址
        url: request.baseUrl + "/app/file/upload/picture",
        // 上传附件的key
        name: "file",
        // 根据你接口需求自定义请求头,默认不要写content-type,让浏览器自适配
        header: {
          // 示例参数可删除
          Authorization: uni.getStorageSync("token"),
        },
        // 根据你接口需求自定义body参数
        // formData: {
        // 	// 'orderId': 1000
        // }
      },
      // 选择文件后是否立即自动上传，true=选择后立即上传
      instantly: true,
      // 必传宽高且宽高应与slot宽高保持一致
      width: "150rpx",
      height: "40rpx",
      // 限制允许上传的格式，空串=不限制，默认为空
      formats: "",
      // 文件上传大小限制
      size: 30,
      // 文件回显列表
      files: new Map(),
      // 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
      wxFiles: [],
      // 是否打印日志
      debug: false,
      count: 99,
      fileList: [],
      approverList: {},
      sendApproverList: [],
      isSet: false,
      clickDate: '',
      caleType: 1,
      engDeductionDetailVos:[],
      today:"",
      hasTaxAmount:0,
      taxAmount:0,
      detailList:[],
      step:1,
      chartIdx:0,
      stats:false,
      signUrl:"",
      currentNodeId:"",
      appShow: false,
    };
  },
  onLoad(options) {
    this.today=moment(Date.now()).format("YYYY-MM-DD");
    // let obj = JSON.parse(options.row);
    // console.log(obj,options);
    this.projectQuerySettleInfo(options.pkId)
    this.settleType=options.settlementType - 0
  },
  methods: {
    sendApprove(){
      if(this.approverList.launchType==2){
        this.$refs.addPopup.submit()
      }else{
        this.btnOk(1)
      }
    },
    closeApp(){
      this.appShow = false
    },
    submit(e){
      console.log('sumit方法',e);
      if(e){
        this.btnOk(1,e)
      }else{
        this.btnOk(1)
        // this.stats = false
      }
    },
    signUrlImg(e) {
        this.signUrl= e
        console.log("莱尔",e);
				this.workflowTableList.forEach(item => {
          if (item.tableHtml instanceof Array) {} else {
            item.tableHtml = this.utils.unzip(item.tableHtml);
            if (item.tableHtml instanceof Array) {} else {
              item.tableHtml = JSON.parse(item.tableHtml);
            }
					}
				});
				if (this.workflowTableList.length > 0) {
					this.workflowTableList.forEach(item => {
						if (item.tableHtml != undefined && item.tableHtml != null && item.tableHtml.length != 0) {
							item.tableHtml.forEach(items => {
								items.arr.forEach(i => {
									if (i.attributeTypes == 3) {
                    if ([this.approverList.workflowNodeDTOS[1].fkRoleId,this.approverList.workflowNodeDTOS[1].sysRoleId].includes(i.signatureDate.signer)) {
											i.signatureDate.img = e;
										}
									}
								});
							});
						}
					});
					console.log("xxxxxxxxxxxxxxxxxxxxx111xxxxxxxxxx")
					console.log(this.tableHtml)
					console.log("xxxxxxxxxxxxxxxxxxxx111xxxxxxxxxxx")
					this.tableHtml.forEach(item => {
						item.tableHtml = JSON.stringify(item.tableHtml);
						item.tableHtml = this.utils.zip(JSON.stringify(item.tableHtml));
					});
				}
			},
    getSign(e){
      console.log('获取的',e);
      this.stats = e
    },
    backStep(){
      this.step=1
      this.setTab()
    },
    nextStep(){
      // this.step=2
      if(!this.isSet||!this.sendApproverList.filter(item=>item.fkApproverId).length){
          return uni.showToast({title:"请设置审批人",icon:'none'})
      }
      this.getSettleInfo()
    },
    setTab(){
      if(this.step==1){
        this.tabList = [{ name: "结算信息", idx: 0 },{ name: "分项列表", idx: 1 },{ name: "费用列表", idx: 2 }]
        if(this.form.itemDeductions.length){
          this.tabList.push({ name: "分项扣减列表", idx: 3 })
        }
        if (this.workflowTableList.length) {
        let tableArr = this.workflowTableList.map((item, index) => ({
          name: item.tableName,
          idx: 5,
          tableInd: index,
        }));
        this.tabList.splice(5, 0, ...tableArr);
        }
        if (this.engDeductionDetailVos.length) {
          this.tabList.splice(7, 0, ...[{ name: "材料扣减表", idx: 7 }]);
        }
      }else if(this.step==2){
        this.tabList = [{ name: "结算信息", idx: 0 }]
        this.tabList.push({ name: "汇总表", idx: 9 })
        this.form.settleSummaryList.forEach((item,index)=>{
          this.tabList.push({ name: item.chapterName, idx: 8 ,chartIdx:index})
        })
        if (this.workflowTableList.length) {
        let tableArr = this.workflowTableList.map((item, index) => ({
          name: item.tableName,
          idx: 5,
          tableInd: index,
        }));
        this.tabList.splice(5, 0, ...tableArr);
        }
        if (this.engDeductionDetailVos.length) {
          this.tabList.splice(7, 0, ...[{ name: "材料扣减表", idx: 7 }]);
        }
      }
    },
    computedAmount(){
      let amount = 0
      const arr = this.form.settleDetails.filter(item=>item.grade==4)
      const arr2 = this.form.engExpenseDetailVos.filter(item=>item.type==1)
      const arr3 = this.engDeductionDetailVos.filter(item=>item.type==1)
      const arr4 = this.form.itemDeductions.filter(item=>item.grade==4).map(item=>({...item,settleAmount: 0 - item.settleAmount}))
      arr.forEach(item=>{
        amount += (item.settleAmount - 0)
      })
      arr2.forEach(item=>{
        amount +=(item.settleAmount - 0)
      })
      arr3.forEach(item=>{
        // item.settleAmount = item.settleAmount?0-item.settleAmount:0
        amount -=(item.settleAmount - 0)
      })
      arr4.forEach(item=>{
        amount +=(item.settleAmount - 0)
      })
      this.form.settleAmount = amount.toFixed(2) - 0;
      this.taxAmount = this.form.taxRate ? (((this.form.settleAmount * this.form.taxRate).toFixed(2) - 0) / 100).toFixed(2) - 0 : 0;
      this.hasTaxAmount = (this.form.settleAmount - 0 + this.taxAmount).toFixed(2) - 0;
      this.form.endSettleAmount = (this.form.lastSettleAmount - 0 + this.hasTaxAmount).toFixed(2) - 0;
    },
    projectQuerySettleInfo(id) {
      this.$api.projectQuerySettleInfo({ pkId: id,type:2 }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.form = res.data;
          this.isSet = !res.data.settingApproveFlag
          this.getSettleWorkflowDetail();
          this.searchSettleContract()
          this.searchStatsItemFinishByPkId(this.form.pkId)
          // this.getSettleInfo()
          this.engDeductionDetailVos = this.form.engDeductionDetailVos
            ? this.form.engDeductionDetailVos.map(item => ({ ...item,settleAmount: item.deductionAmount }))
            : [];
          if (this.engDeductionDetailVos.length) {
            this.tabList.splice(7, 0, ...[{ name: "材料扣减表", idx: 7 }]);
          }
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    getSettleInfo() {
      let arr =this.form.engExpenseDetailVos.filter(item=>item.type)
      let nums = 0
      this.engDeductionDetailVos.forEach(item=>{
         nums = nums + (item.settleAmount - 0)
      })
      let data = {
        endDate: moment(this.form.endDate).format("YYYY-MM-DD"),
        contractId: this.form.fkContractId,
        pkId:this.form.pkId,
        deductionAmount:nums,
        settleExpenseInfos:arr.map(item=>({fkDetailId:item.fkDetailId,settleAmount:item.settleAmount}))
      };
      uni.showLoading({mask:true})
      this.$api.getSettleInfo(data).then(res => {
        uni.hideLoading()
        if (res.code === 200) {
          this.form.settleChapterVos = res.data.settleChapterVos;
          this.form.settleSummaryList = res.data.settleSummaryList;
          this.step = 2;
          this.current = 0
          this.idx = 0;
          this.setTab()
        } else {
          this.$message.warning(res.msg);
        }
      });
    },
    currentChange(item) {
      this.current = item.index;
      this.idx = item.idx;
      if (item.idx === 5) {
        this.tableIndex = item.tableInd;
      }
      if (item.idx === 8) {
        this.chartIdx = item.chartIdx;
      }
    },
    searchSettleContract(){
        let data={contractType:this.settleType==1?1:4,customId:""}
        this.$api.searchSettleContract(data).then(res=>{
            if(res.code===200){
                this.contentList=res.data.map(item=>({...item, value: item.pkId, label: item.contractName}))
                this.contentList.forEach(item=>{
                    if(item.pkId===this.form.fkContractId){
                        this.form.contractName=item.contractName
                        this.form.taxRate=item.taxRate
                        this.taxAmount = this.form.taxRate ? (((this.form.settleAmount * this.form.taxRate).toFixed(2) - 0) / 100).toFixed(2) - 0 : 0;
                        this.hasTaxAmount = (this.form.settleAmount - 0 + this.taxAmount).toFixed(2) - 0;
                        this.form.endSettleAmount = (this.form.lastSettleAmount - 0 + this.hasTaxAmount).toFixed(2) - 0;
                    }
                })
            }else{
                uni.showToast({title:res.msg,icon:"none"})
            }
        })
    },
    getSettleWorkflowTable(){
        this.$api.getSettleWorkflowTable({settleType:this.settleType}).then(res=>{
            if(res.code==200){
                this.workflowTableList=res.data?res.data:[]
                if (this.workflowTableList.length) {
                let tableArr = this.workflowTableList.map((item, index) => ({
                  name: item.tableName,
                  idx: 5,
                  tableInd: index,
                }));
                this.tabList.splice(5, 0, ...tableArr);
                }
                if(this.approverList.launchType==2){
                  this.$refs.addPopup.getApproveStatus()
                }
                }
        })
    },
    sendGzipTableHtml(e) {
      console.log(e);
      this.tableHtml = e;
    },
    btnOk(settleStatus,getDatas) {
      if(!this.isSet){
          return uni.showToast({title:"请设置审批人",icon:'none'})
      }
      this.$refs.processForm.gzipTable();
      uni.showLoading({ mask: true });
      let data = {
        beginDate: moment(this.form.beginDate).format("YYYY-MM-DD"),
        endDate:moment(this.form.endDate).format("YYYY-MM-DD"),
        endSettleAmount:this.form.endSettleAmount,
        fkContractId:this.form.fkContractId,
        lastSettleAmount:this.form.lastSettleAmount,
        pkId:this.form.pkId,
        settleAmount:this.form.settleAmount,
        settleDate:this.form.settleDate,
        settleDetails:this.form.settleDetails,
        settleName:this.form.settleName,
        engDeductionDetailAdds:this.engDeductionDetailVos,
        engExpenseDetailAdds:this.form.engExpenseDetailVos,
        itemDeductionAdds:this.form.itemDeductions,
        isAgainChoice:true,
        workflowTableList: this.tableHtml,
        settleStatus,
        fileList: this.fileList.map(item=>({fileName:item.fileName,fileUrl:item.fileUrl,remark:""})),
        settleType:this.settleType,
        prodWorkflowUserAdds: this.sendApproverList,
      };
      if(getDatas){
        data = {...data,...getDatas}
      }
      this.$api
        .updateSettle(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.showToast({ title: "操作成功" });
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 3]; // 上一页面实例
            prevPage.$vm.resh() // 调用上一页 定义的方法
            uni.navigateBack({ delta: 2 });
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    priceInput(e,type,item){
        if(type==1){
            item.settlePrice = this.$limitInputNumber(e,99999999.99,0,2);
            this.form.settleDetails.forEach(item1 => {
              if (item1.fkItemDetailId == item.fkItemDetailId) {
                item1.settlePrice = val;
              }
            });
            // item.finishAmount = item.price * item.finishNumber;
            const arr = this.form.settleDetails;
            const arr1 = this.form.settleDetails.filter(item => item.grade === 1);
            const arr2 = this.form.settleDetails.filter(item => item.grade === 2);
            const arr3 = this.form.settleDetails.filter(item => item.grade === 3);
            const arr4 = this.form.settleDetails.filter(item => item.grade === 4);
            arr.forEach(item1 => {
              if (item1.isTemporary === 1 && item1.grade === 3) {
              } else {
                item1.settleAmount = 0;
                item1.finishAmount = 0;
              }
            });
            arr4.forEach(item1 => {
              item1.settleAmount = (item1.finishNumber * item1.settlePrice).toFixed(2) - 0;
              item1.finishAmount = (item1.designNumber * item1.price).toFixed(2) - 0;
            });
            arr3.forEach(item1 => {
              arr4.forEach(item2 => {
                if (item1.fkItemId == item2.fkParentItemId) {
                  item1.settleAmount = (item1.settleAmount - 0 + (item2.settleAmount - 0)).toFixed(2) - 0;
                  item1.finishAmount = (item1.finishAmount - 0 + (item2.finishAmount - 0)).toFixed(2) - 0;
                }
              });
            });
            arr2.forEach(item1 => {
              arr3.forEach(item2 => {
                if (item1.fkItemId == item2.fkParentItemId) {
                  item1.settleAmount = (item1.settleAmount - 0 + (item2.settleAmount - 0)).toFixed(2) - 0;
                  item1.finishAmount = (item1.finishAmount - 0 + (item2.finishAmount - 0)).toFixed(2) - 0;
                }
              });
            });
            arr1.forEach(item1 => {
              arr2.forEach(item2 => {
                if (item1.fkItemId == item2.fkParentItemId) {
                  item1.settleAmount = (item1.settleAmount - 0 + (item2.settleAmount - 0)).toFixed(2) - 0;
                  item1.finishAmount = (item1.finishAmount - 0 + (item2.finishAmount - 0)).toFixed(2) - 0;
                }
              });
            });
        }else if(type==2){
           setTimeout(()=>{
            item.settleAmount= this.$limitInputNumber(e,item.costAmount,0,2)
            this.computedAmount()
           },0)
        }else if(type==3){
          setTimeout(()=>{
            item.settleAmount= this.$limitInputNumber(e,item.amount,0,2)
            this.computedAmount()
           },0)
        }
    },
    expenBlur(row) {
      this.detailList.forEach(item => {
        if (item.pkId == row.fkDetailId) {
          item.currentSettleAmount = row.settleAmount;
        }
      });
    },
    setApprover() {
        console.log(this.approverList);
      uni.navigateTo({
        url:
          "/pages/setApprover/setoneApprover?row=" +
          JSON.stringify(this.approverList),
      });
    },
    getSettleWorkflowDetail() {
      let data = {
        pkId: this.form.pkId,
        settleType:this.settleType
      };
      if(this.settleType==2){
        data.customId=this.form.fkBySettleOrgId
      }
      this.$api.getSettleWorkflowDetail(data).then((res) => {
        if (res.code === 200) {
          if (res.data) {
            let arr2 = []
            res.data.workflowNodeDTOS.forEach((item,index) => {
              if (item.nodeType == 2) {
                if(res.data.launchType==2&&index==1){
                  this.currentNodeId =item.pkId
                  console.log(this.currentNodeId);
                }
                item.prodSysRoleVo =
                  item.prodSysRoleVo == null
                    ? { selectedUserId: "", sysUserList: [] }
                    : item.prodSysRoleVo;
                item.prodSysRoleVo.selectedUserId =
                  item.prodSysRoleVo.selectedUserId == null
                    ? ""
                    : item.prodSysRoleVo.selectedUserId;

                   if(!this.form.settingApproveFlag){
                     arr2.push({
                       bizType: 1,
                        fkRoleId: item.fkRoleId,
                        currentNodeId: item.pkId,
                        fkApproverId: item.prodSysRoleVo.selectedUserId
                     })
                    }
              }
            });
            this.sendApproverList = arr2
            this.approverList = res.data;
          } else {
            this.approverList = {
              workflowNodeDTOS: [
                {
                  prodSysRoleVo: {
                    sysUserList: [],
                  },
                },
              ],
            };
          }
          this.getSettleWorkflowTable()
        }
      });
    },
    getAddSettlementFront(){
        let data={ customId: "", contractId: this.form.fkContractId }
        if(this.settleType==2){
          data.customId=this.form.fkBySettleOrgId
        }
        this.$api.getAddSettlementFront(data).then(res=>{
            if(res.code===200){
                this.form.beginDate = res.data.beginDate;
                this.form.lastSettleAmount = res.data.lastSettleAmount;
                this.form.engExpenseDetailVos = res.data.engExpenseDetailVos ? res.data.engExpenseDetailVos.map(item => ({ ...item,settleAmount: 0 - item.excessPrice * item.supplyNum, settleAmount: item.costAmount })) : [];
                this.form.itemDeductions = res.data.itemDeductions ? res.data.itemDeductions : [];
                this.setTab()
            }
        })
    },
    searchStatsItemFinishByPkId(pkId){
        let data={
          endDate:  moment(this.form.endDate).format("YYYY-MM-DD"),
          orgType:this.settleType==1? 0:1,
          customerId: this.form.fkBySettleOrgId,
          contractId: this.form.fkContractId
        }
        if(pkId){
            data.pkId=pkId
        }
        this.$api.searchStatsItemFinishByPkId(data).then(res=>{
            if(res.code===200){
                const arr = res.data;
                const arr1 = res.data.filter(item => item.grade === 1);
                const arr2 = res.data.filter(item => item.grade === 2);
                const arr3 = res.data.filter(item => item.grade === 3);
                const arr4 = res.data.filter(item => item.grade === 4);
                arr.forEach(item => {
                    item.finishAmount = 0;
                    item.settleAmount = 0;
                });
                arr4.forEach(item => {
                  item.settlePrice = item.price;
                  item.finishAmount = (item.designNumber * item.price).toFixed(2) - 0;
                  item.settleAmount = (item.finishNumber * item.settlePrice).toFixed(2) - 0;
                });
                arr3.forEach(item => {
                  arr4.forEach(item2 => {
                    if (item.fkItemId == item2.fkParentItemId) {
                      item.finishAmount = item.finishAmount - 0 + (item2.finishAmount - 0);
                      item.settleAmount = item.settleAmount - 0 + (item2.settleAmount - 0);
                    }
                  });
                });
                arr2.forEach(item => {
                  arr3.forEach(item2 => {
                    if (item.fkItemId == item2.fkParentItemId) {
                      item.finishAmount = item.finishAmount - 0 + (item2.finishAmount - 0);
                      item.settleAmount = item.settleAmount - 0 + (item2.settleAmount - 0);
                    }
                  });
                });
                arr1.forEach(item => {
                  arr2.forEach(item2 => {
                    if (item.fkItemId == item2.fkParentItemId) {
                      item.finishAmount = item.finishAmount - 0 + (item2.finishAmount - 0);
                      item.settleAmount = item.settleAmount - 0 + (item2.settleAmount - 0);
                    }
                  });
                });
                this.form.settleDetails = arr
                this.computedAmount()
            }
        })
    },
    prevDateFun(obj) {
      obj.forEach((item) => (item.bizType = 3));
      this.sendApproverList =obj
      this.approverList.workflowNodeDTOS.forEach(item => {
        obj.forEach(item2=>{
            if (item.pkId===item2.currentNodeId) {
                item.prodSysRoleVo.selectedUserId=item2.fkApproverId
            }
        })
        })
      console.log(obj, "B页面返回过来的");
      this.isSet = true;
    },
    openPicker(type) {
      if(this.step==2){
        return
      }
      this.pickerType = type;
      this.pickerList = [];
      if (type === 1) {
        this.pickerList = this.contentList;
      } else if (type === 2) {
        
      }
      this.pickerShow = true;
    },
    pickerConfirm(e) {
      console.log(e);
      if (e.value.length) {
        if (this.pickerType === 1) {
          this.form.fkContractId = e.value[0].value;
          this.form.contractName = e.value[0].label;
          this.getAddSettlementFront()
          this.form.endDate = "";
        } else if (this.pickerType === 2) {
          
        } 
      }
      this.pickerCancel();
    },
    pickerCancel() {
      this.pickerShow = false;
    },
    delFile(row, index) {
      this.fileList = this.fileList.filter((item) => item.id !== row.id);
      this.$refs.lsjUpload1.clear(row.fileName);
    },
    openCale(type, date) {
      if(this.step==2) return
    //   this.clickDate = date;
      this.caleType = type;
      // this.caleShow=true
      this.$refs.calendar.open();
    },
    caleConfirm(e) {
      console.log(e);
      if (this.caleType === 1) {
        this.form.endDate = e.fulldate;
        this.searchStatsItemFinishByPkId()
      } else if (this.caleType === 2) {
        this.form.settleDate = e.fulldate;
      }
    },
    onChange(e) {
      console.log("改变事件", e);
    },
    onprogress(e) {
      console.log("中途事件", e);
    },
    onuploadEnd(e) {
      console.log("结束事件", e);
      console.log(this.$refs.lsjUpload1.files);
      if (e.responseText) {
        let res = JSON.parse(e.responseText);
        if (res.code === 200) {
          this.fileList.push({
            id: this.fileList.length
              ? this.fileList[this.fileList.length - 1].id + 1
              : 1,
            fileName: e.name,
            fileUrl: res.data,
          });
        }
      }
    },
  },
  watch:{
    detail: {
      deep: true,
      handler(val) {
          const values = val.map(item => Number(item.currentSettleAmount));
          let sum = 0;
          if (!values.every(value => isNaN(value))) {
            sum = values.reduce((prev, curr) => {
              return prev + curr;
            }, 0);
          }
        this.form.settleAmount = sum.toFixed(2) - 0;
        this.taxAmount = this.form.taxRate ? (((this.form.settleAmount * this.form.taxRate).toFixed(2) - 0) / 100).toFixed(2) - 0 : 0;
        this.hasTaxAmount = (this.form.settleAmount - 0 + this.taxAmount).toFixed(2) - 0;
        this.form.endSettleAmount = (this.form.lastSettleAmount - 0 + this.hasTaxAmount).toFixed(2) - 0;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.sticky{
  z-index: 98;
}
.pad {
  height: 98rpx;
}
.pdb {
  height: 100rpx;
}
.content {
  font-size: 28rpx;
}
.title {
  padding-left: 20rpx;
  font-size: 28rpx;
  font-weight: 600;
  margin: 10rpx 0;
}
.inputs {
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}
.timers{
    display: flex;
    align-items: center;
    height: 80rpx;
    // padding: 0 20rpx;
    margin-bottom: 20rpx;
    .time{
        display: flex;
        align-items: center;
        width: 47%;
        height: 80rpx;
        padding: 0 20rpx;
        background-color: #fff;
    }
    .disabled{
        background-color: #f3f3f3;
    }
    .to{
        display: flex;
        justify-content: center;
        width: 6%;
    }
}
.disabled{
    background-color: #f3f3f3;
}
.select {
  justify-content: space-between;
}
.addSubBtn {
  display: flex;
  align-items: center;
  padding-left: 40rpx;
  background-color: #fff;
  height: 80rpx;
  .btns {
    width: 100rpx;
    padding: 10rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    text-align: center;
    color: #2a82e4;
    background-color: #d9f4ff;
  }
}
.addMatBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 40rpx;
  background-color: #fff;
  height: 80rpx;
  .btns {
    width: 150rpx;
    padding: 10rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    text-align: center;
    color: #2a82e4;
    background-color: #d9f4ff;
  }
}
.orderList {
  overflow: auto;
  max-height: 350rpx;
  background-color: #fff;
  .orderList-item {
    display: flex;
    justify-content: space-around;
    height: 80rpx;
    padding: 0 20rpx;
    border-bottom: 1px solid #eee;
    .name {
      width: 580rpx;
      height: 80rpx;
      line-height: 80rpx;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
    }
  }
}
.formBtns {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100rpx;
  .next,
  .last {
    padding: 20rpx 40rpx;
    background-color: #1576e6;
    color: #fff;
  }
}
.table_height {
  /*#ifdef APP-PLUS*/
  max-height: calc(100vh - 554rpx);
  /*#endif*/
  /*#ifdef H5*/
  max-height: calc(100vh - 466rpx);
  /*#endif*/
}
.footer {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 750rpx;
  height: 100rpx;
  z-index: 10;
  .btns {
    display: flex;
    justify-content: center;
    align-items: center;
    // width: 375rpx;
    flex: 1;
    color: #fff;
  }
  .saveBtn {
    background-color: #43cf7c;
  }
  .submitBtn {
    background-color: #1576e6;
  }
}
.upload-btn {
  width: 150rpx;
  height: 40rpx;
  text-align: center;
  line-height: 40rpx;
  font-size: 24rpx;
  color: #5084fe;
  background-color: #dfedff;
  border-radius: 6rpx;
}
.approve-files {
  .approve-files-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60rpx;
  }
  .upload-btn {
    width: 150rpx;
    height: 40rpx;
    text-align: center;
    line-height: 40rpx;
    font-size: 24rpx;
    color: #5084fe;
    background-color: #dfedff;
    border-radius: 6rpx;
  }
}
.fileList-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60rpx;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  .left {
    display: flex;
    align-items: center;
  }
  .fileName {
    width: 500rpx;
  }
  .file-closeBtn {
    width: 60rpx;
    color: red;
  }
}
.file-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60rpx;
  background-color: #fff;
}
.setBtn {
  display: flex;
  justify-content: start;
  padding-left: 20rpx;
  .custom-style {
    width: 100rpx;
    height: 60rpx;
  }
}
</style>
