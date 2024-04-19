<template>
  <view class="wrapper">
    <u-navbar
      :leftText="detailsTitle"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="workflow">
      <!-- [5,6].includes(showData.settleStatus) -->
      <view class="workflow-left" v-if="[5, 6].includes(showData.settleStatus)">
        <view
          class="tabs-item"
          :class="{ currentTab: nowTab === 0 }"
          @click="nowTab = 0"
          >盖章详情</view
        >
        <view
          class="tabs-item"
          :class="{ currentTab: nowTab === 1 }"
          @click="nowTab = 1"
          >业务详情</view
        >
      </view>
      <!-- class="workflow-right" -->
      <view
        :class="{
          'workflow-right': ![5, 6].includes(showData.settleStatus),
          'workflow-right2': [5, 6].includes(showData.settleStatus),
        }"
      >
        <view class="pad"></view>
        <view
          v-show="nowTab === 0"
          v-if="[5, 6].includes(showData.settleStatus)"
        >
          <signDetail
            :signDetail="showData.sealBusinessVo"
            :key="nowTab"
          ></signDetail>
        </view>
        <view class="content" v-show="nowTab === 1">
          <view
            class="sticky"
            :class="{ 'sticky-left': [5, 6].includes(showData.settleStatus) }"
          >
            <u-tabs
              :list="list"
              :current="current"
              @change="currentChange"
              class="tabs"
              :activeStyle="{ color: 'rgba(32, 52, 87, 1)' }"
              :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }"
            >
              <view slot="right" style="padding-left: 4px" @tap="hamburg">
                <u-icon name="list" size="21" bold></u-icon>
              </view>
            </u-tabs>
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
          </view>
          <view
            class="detail"
            v-if="current === 0"
            :style="{
              width: [5, 6].includes(showData.settleStatus)
                ? '710rpx'
                : '750rpx',
            }"
          >
            <tableForm
              v-if="idx == 0"
              :emptyShow="false"
              :pageMr="false"
              :list="[
                { name: '结算名称', value: showData.settleName, show: true },
                {
                  name: '结算对象',
                  value: showData.settleOrgName,
                  show: true,
                },
                {
                  name: '结算周期',
                  value: showData.beginDate + ' 至 ' + showData.endDate,
                  show: true,
                },
                { name: '结算日期', value: showData.settleDate, show: true },
                {
                  name: '上期末含税结算金额',
                  value:
                    '￥' + (menuCodeData == 1
                      ? showData.lastSettleAmount
                      : '***'),
                  show: true,
                },
                {
                  name: '本期结算金额',
                  value:
                    '￥' + (menuCodeData == 1 ? showData.settleAmount : '***'),
                  show: true,
                },
                {
                  name: '税金',
                  value: '￥' + (menuCodeData == 1 ? taxRate : '***'),
                  show: true,
                },
                {
                  name: '本期含税结算金额',
                  value:
                    '￥' + (menuCodeData == 1
                      ? showData.endSettleAmount
                      : '***'),
                  show: true,
                },
                {
                  name: '本期末含税结算金额',
                  value:
                    '￥' + (menuCodeData == 1 ? showData.settleTotalAmount : '***'),
                  show: true,
                },
                { name: '备注', value: showData.remark, show: true },
              ]"
            >
            </tableForm>
            <!-- <view class="card">
          <view class="list-item">
			  <text>结算名称</text>
			  <text class="item">{{ showData.settleName }}</text>
		  </view>
          <view class="list-item">
			  <text>结算对象</text>
			  <text class="item">{{ showData.settleOrgName }}</text>
		  </view>
          <view class="list-item"><text>计算周期</text><text class="item">{{ showData.beginDate }} 至 {{ showData.endDate }}</text>
          </view>
          <view class="list-item"><text>结算日期</text><text class="item">{{ showData.settleDate }}</text></view>
          <view class="list-item" v-if="menuCodeData==1"><text>上期末含税结算金额</text><text class="item">￥{{menuCodeData==1? showData.lastSettleAmount :'***'}}元</text></view>
          <view class="list-item" v-if="menuCodeData==1"><text>本期结算金额</text><text class="item" style="color:red">￥{{menuCodeData==1? showData.settleAmount :'***'}}元</text></view>
          <view class="list-item" v-if="menuCodeData==1"><text>税金</text><text class="item">￥{{menuCodeData==1? taxRate :'***'}}元</text></view>
          <view class="list-item" v-if="menuCodeData==1"><text>本期含税结算金额</text><text class="item">￥{{menuCodeData==1? (showData.settleAmount - 0 + taxRate) :'***'}}元</text></view>
          <view class="list-item" v-if="menuCodeData==1"><text>本期末含税结算金额</text><text class="item">￥{{menuCodeData==1? showData.endSettleAmount :'***'}}元</text></view>
          <view class="list-item"><text>备注</text><text class="item">{{ showData.remark }}</text></view>
		  <u-empty class="empty" width="300" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
        </view> -->
          </view>
          <view v-if="idx === 1" style="width: 750rpx; overflow: auto">
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
          <view
            v-if="idx === 2"
            style="width: 740rpx; overflow: auto"
            :class="{ 'widtd-left': [5, 6].includes(showData.settleStatus) }"
          >
            <!-- 表格 -->
            <uni-table border emptyText="暂无更多数据" :key="idx">
              <!-- 表头行 -->
              <uni-tr>
                <uni-th align="center" width="80">费用名称</uni-th>
                <uni-th align="center" width="100">合同金额</uni-th>
                <uni-th align="center" width="100">上期末结算金额</uni-th>
                <uni-th align="center" width="50">结算金额</uni-th>
                <uni-th align="center" width="100">本期末结算金额</uni-th>
              </uni-tr>
              <!-- 表格数据行 -->
              <uni-tr
                v-for="(item, index) in showData.engExpenseDetailVos"
                :key="index"
              >
                <uni-td align="center">{{ item.detailName }}</uni-td>
                <uni-td align="center">{{ menuCodeData == 1 ? item.costAmount : "***" }}</uni-td>
                <uni-td align="center">{{ menuCodeData == 1 ? item.afterAmount : "***" }}</uni-td>
                <uni-td align="center">{{ menuCodeData == 1 ? item.settleAmount : "***" }}</uni-td>
                <uni-td align="center">{{ menuCodeData == 1 ? item.type == 0 ? "" : ((item.afterAmount-0) + (item.settleAmount - 0)).toFixed(2) : "***" }}</uni-td>
              </uni-tr>
            </uni-table>
          </view>
          <!-- 分项减扣列表 -->
          <view
            v-if="idx === 3"
            style="width: 750rpx; overflow: auto"
            :class="{ 'widtd-left': [5, 6].includes(showData.settleStatus) }"
          >
            <!-- 表格 -->
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
              <uni-tr
                v-for="(item, index) in showData.itemDeductions"
                :key="index"
              >
                <uni-td align="center">{{ item.itemName }}</uni-td>
                <uni-td align="center">{{ item.unitName }}</uni-td>
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
          <view
            v-if="idx === 4"
            style="width: 750rpx; overflow: auto"
            :class="{ 'widtd-left': [5, 6].includes(showData.settleStatus) }"
          >
            <!-- 表格 -->
            <uni-table border emptyText="暂无更多数据" :key="idx">
              <!-- 表头行 -->
              <uni-tr>
                <uni-th align="center" width="100">序号</uni-th>
                <uni-th align="center" width="140">清单姓名名称</uni-th>
                <uni-th align="center" width="100">合同单价</uni-th>
                <uni-th align="center" width="120">设计工程量</uni-th>
                <uni-th align="center" width="100">金额</uni-th>
                <uni-th align="center" width="160">本期完成工程量</uni-th>
                <!-- <uni-th align="center" width="100">结算单价</uni-th> -->
                <uni-th align="center" width="140">本期结算金额</uni-th>
              </uni-tr>
              <!-- 表格数据行 -->
              <uni-tr v-for="(item, index) in detail" :key="index">
                <uni-td align="center">{{ index + 1 }}</uni-td>
                <uni-td align="center">{{ item.itemName }}</uni-td>
                <uni-td align="center">{{
                  menuCodeData == 1 ? item.price : "***"
                }}</uni-td>
                <uni-td align="center">{{ item.designNumber }}</uni-td>
                <uni-td align="center">{{
                  menuCodeData == 1 ? item.designAmount : "***"
                }}</uni-td>
                <uni-td align="center">{{ item.finishNumber }}</uni-td>
                <!-- <uni-td align="center">{{ item.settlePrice }}</uni-td> -->
                <uni-td align="center">{{
                  menuCodeData == 1 ? item.finishAmount : "***"
                }}</uni-td>
              </uni-tr>
            </uni-table>
          </view>
          <!-- 审批附件记录 -->
          <view v-if="idx === 6">
            <view class="app-record" v-if="showData.approveDetailList.length">
              <view
                class="app-record-item"
                v-for="(item, index) in showData.approveDetailList"
                :key="index"
              >
                <view class="item-header">
                  <view style="display: flex; align-items: center">
                    <u-icon name="account" color="#8f99ab" size="24"></u-icon>
                    <view>{{ item.approver }}</view>
                  </view>
                  <view class="checkBtn" @click="checkNodes(item)" v-if="item.approveStatus !== 2">查看</view>
                </view>
                <view class="item-content">
                  <view class="item-content-head">
                    <!-- <u-icon class="icons" name="file-text" size="28"></u-icon> -->
                    <image
                      class="appimg"
                      src="../../static/image/audit.png"
                      mode="widthFix"
                    />
                    <view
                      >发表：<text>{{ item.approveTime }}</text></view
                    >
                  </view>
                  <view class="contents">{{ item.approveComment }}</view>
                </view>
                <view class="item-files">
                  <view
                    class="files-item bdb"
                    v-for="(item2, index2) in item.fileList
                      ? item.fileList
                      : []"
                    :key="index2"
                  >
                    <u-icon class="file-icon" :name="getFileTypes(item2.fileUrl)" size="24"></u-icon>
                    <view class="file-name text-hidden">{{
                      item2.fileName
                    }}</view>
                  </view>
                </view>
              </view>
            </view>
            <view v-else class="no-data"> 暂无数据 </view>
          </view>
          <!-- 动态表格 -->
          <view v-show="idx === 5" style="width: 750rpx; overflow: auto">
            <processForm
              :tableData="workflowTableList"
              :tableIndex="tableIndex"
              @sendGzipTableHtml="sendGzipTableHtml"
              :disabled="showData.handleStatus !== 1 && todo != 1"
              ref="processForm"
            ></processForm>
            <!-- <table style="border-collapse: collapse; overflow: auto; margin: 0 auto" ref="printPage" :key="tableIndex">
          <tr v-for="(item, idx) in workflowTableList[tableIndex].tableHtml" :key="idx" style="" v-show="item.status">
            <td style="
                box-sizing: content-box;
                border: none;
                margin: 0;
                padding: 0;
              " v-for="(i, id) in item.arr" :style="[i.style]" :key="id" :rowspan="i.row" :colspan="i.span"
              :id="'td' + idx + id" :ref="'td' + idx + id">
              <input type="text" v-model="i.name" :disabled="i.disabled == false || (i.id == user.pkId && i.name != '')||showData.handleStatus !== 1&&todo!=1
                " v-show="i.attributeTypes == 1 && i.checkout == false" @blur="tdBlur(i)" />
              <input v-if="i.attributeTypes == 1 && i.checkout == 1"
                :disabled="(i.id != '' && i.id == user.pkId && i.name != '')||showData.handleStatus !== 1&&todo!=1" @input="tdNameChange(item, id, i.name)"
                @blur="tdNameBlur(item, id, i.name)" v-model="i.name" />
              <span v-if="i.attributeTypes == 3">{{ i.signatureDate.content }}:</span>
              <easy-select ref="easySelect" size="medium" :tableIndex="tableIndex" :idx="idx" :id="id"
                v-if="i.attributeTypes == 2" :options="i.option" :value="i.name" @selectOne="selectOne" :forbidden="(i.id != '' && i.id == user.pkId && i.name != '')|| showData.handleStatus !== 1&&todo!=1 && i.id != '' && i.id == user.pkId && i.name != ''"></easy-select>
            </td>
          </tr>
        </table> -->
          </view>
          <!-- 材料扣减列表 -->
          <view v-if="idx === 7" style="width: 750rpx; overflow: auto">
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
                <uni-td align="center">{{ menuCodeData == 1 ? item.excessPrice : "***" }}</uni-td>
                <uni-td align="center">{{ menuCodeData == 1 ? item.supplyNum : "***" }}</uni-td>
                <uni-td align="center">{{ menuCodeData == 1 ? item.amount : "***" }}</uni-td>
                <uni-td align="center">{{ menuCodeData == 1 ? item.lastDeductionAmount : "***" }}</uni-td>
                <uni-td align="center">{{ menuCodeData == 1 ? item.settleAmount : "***" }}</uni-td>
                <uni-td align="center">{{ menuCodeData == 1 ? item.settleAmount?(item.lastDeductionAmount-0 + item.settleAmount-0):0 : "***" }}</uni-td>
              </uni-tr>
            </uni-table>
          </view>
          <!-- 汇总表 -->
          <view
            v-if="idx === 9"
            style="width: 750rpx; overflow: auto"
            :class="{ 'widtd-left': [5, 6].includes(showData.settleStatus) }"
          >
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
              <uni-tr
                v-for="(item, index) in showData.settleSummaryList
                  ? showData.settleSummaryList
                  : []"
                :key="index"
              >
                <uni-td align="center">{{ index + 1 }}</uni-td>
                <uni-td align="center">{{ item.chapterName }}</uni-td>
                <uni-td align="center">{{
                  menuCodeData == 1 ? item.currentSettleAmount : "***"
                }}</uni-td>
                <uni-td align="center">{{
                  menuCodeData == 1 ? item.settleAmount : "***"
                }}</uni-td>
              </uni-tr>
            </uni-table>
          </view>
          <!-- 章节列表 -->
          <view class="table_detail" style="width: 750rpx;overflow: auto;height: calc(100vh - 288rpx)"  v-if="idx === 8" :class="{ 'widtd-left': [5, 6].includes(showData.settleStatus) }">
        <table v-if="chartTable.length">
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
              <td>{{ menuCodeData == 1 ? item.price : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.lastQuantities : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.lastSettleAmount : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.currentQuantities : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.currentSettleAmount : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.quantitiesAmount : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.settleAmount : "***" }}</td>
            </tr>
          </tbody>
        </table>
      </view>
      <!-- uni-table在app上不支持合并行 -->
          <!-- <view
            v-if="idx === 8"
            style="width: 750rpx; overflow: auto"
            :class="{ 'widtd-left': [5, 6].includes(showData.settleStatus) }"
          >
            <uni-table border emptyText="暂无更多数据" :key="idx">
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
                <uni-td align="center">{{
                  menuCodeData == 1 ? item.price : "***"
                }}</uni-td>
                <uni-td align="center">{{
                  menuCodeData == 1 ? item.currentQuantities : "***"
                }}</uni-td>
                <uni-td align="center">{{
                  menuCodeData == 1 ? item.currentSettleAmount : "***"
                }}</uni-td>
                <uni-td align="center">{{
                  menuCodeData == 1 ? item.quantitiesAmount : "***"
                }}</uni-td>
                <uni-td align="center">{{
                  menuCodeData == 1 ? item.settleAmount : "***"
                }}</uni-td>
              </uni-tr>
            </uni-table>
          </view> -->
        </view>
        <view class="pdb" v-if="!todo || todo == 1"></view>
        <view class="footer" v-if="!todo">
          <view
            class="footer-btn error"
            v-if="showData.cancelStatus === 1"
            @click="recall"
            >撤回</view
          >
          <view
            class="footer-btn error"
            v-if="showData.sealWithdrawStatus === 1"
            @click="getApproType(1)"
            >撤回</view
          >
          <view
            class="footer-btn primary"
            v-if="showData.handleStatus === 1"
            @click="appBtn"
            >处理</view
          >
          <view
            class="footer-btn primary"
            @click="goSign"
            v-if="showData.sealStatus"
            >{{ showData.sealStatus == 1 ? "发起签章" : "重新发起签章" }}</view
          >
          <view
            class="footer-btn primary"
            @click="edit"
            v-if="showData.relaunchStatus"
            >重新发起</view
          >
          <view
            class="footer-btn primary"
            @click="edit"
            v-if="showData.editStatus"
            >编辑</view
          >
          <view class="footer-btn error" @click="del" v-if="showData.deleteStatus">删除</view>
          <view
            class="footer-btn primary"
            v-if="showData.sealApproveStatus"
            @click="sealApprove"
            >{{ showData.sealPersonStatus == 1 ? "盖章" : "审批" }}</view
          >
        </view>
        <view class="btn" v-if="todo == 1" @click="appBtn">处理</view>
        <!-- <view class="btn"  @click="appBtn">处理</view> -->
      </view>
    </view>
    <suspensionTabs
      :process="true"
      @tabsExamine="tabsExamine"
      v-show="nowTab === 1"
    ></suspensionTabs>
    <processForm2
      style="position: relative; z-index: -999"
      ref="processForm2"
      :tableData="tableHtml2"
      @sendGzipTableHtml="sendGzipTableHtml2"
    ></processForm2>
    <approvePopup
      :app-show="appShow"
      @close="closeApp"
      @reject="reject"
      @submit="submit"
      :approverName="approverName"
      :approverList="approverList"
      :approverShow="approverShow"
      :app-title="'节点审批设置'"
      :tableData="workflowTableList"
      :sysRoleId="showData.sysRoleId"
      :roleId="showData.roleId"
      @signUrlImg="signUrlImg"
      :getFiles="fileList"
    ></approvePopup>
    <!-- 技术交底弹框 -->
    <u-modal
      :show="recallShow"
      title="提醒"
      content="确认要撤回该审批？"
      @confirm="modConfirm"
      @cancel="modCancel"
      showCancelButton
    ></u-modal>
    <u-modal
      :show="modelShow"
      :closeOnClickOverlay="true"
      @close="modelShow = false"
      showCancelButton
      title="发起盖章确认"
      confirmText="需要"
      cancelText="不需要"
      @confirm="confirmSign"
      @cancel="cancelSign"
      content="您的审批流程已审批完成,请确认是否需要发起盖章流程?"
    ></u-modal>
    <u-modal
      :show="modshow"
      title="提示"
      :content="modcontent"
      :showCancelButton="true"
      :showConfirmButton="showConfirmButton"
      :confirmText="confirmText"
      @confirm="modconfirm"
      @cancel="modshow = false"
    ></u-modal>
    <u-modal :show="delShow" :closeOnClickOverlay="true" @close="delShow=false" showCancelButton title="删除确认" confirmText="是" cancelText="否" @confirm="confirmDel" @cancel="delShow=false" content='是否删除该结算？'></u-modal>
    <addPopup @submit="submit2" :app-title="'签名'" ref="addPopup"></addPopup>
  </view>
</template>

<script>
import approvePopup from "../../components/approve-popup/approve-popup";
import suspensionTabs from "../../components/suspension-tabs/suspension-tabs";
import signDetail from "../../components/signDetail/signDetail.vue";
import processForm from "../../components/process-form/process-form.vue";
import processForm2 from "../../components/process-form/process-form2.vue";
import moment from "moment";
import tableForm from "../../components/table-form/table-form.vue";
import { getFileType } from "../../common/common";
import addPopup from "../../components/approve-popup/add-popup.vue";
export default {
  components: {
    approvePopup,
    suspensionTabs,
    signDetail,
    processForm,
    processForm2,
    tableForm,
    addPopup
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
    detail() {
      // const arr = this.showData.settleDetails.filter(item => item.grade == 4);
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
      // const arr3 = this.showData.engExpenseDetailVos.map(item => ({ ...item, itemName: item.detailName, price: item.costAmount, settlePrice: item.costAmount, designNumber: 1, designAmount: item.costAmount, finishNumber: item.costAmount ? (item.settleAmount / item.costAmount).toFixed(2) - 0 : 0, finishAmount: item.settleAmount }));
      // const arr4 = this.engDeductionDetailVos.map(item => ({ ...item, itemName: item.materialName, price: item.excessPrice, settlePrice: item.settlePrice, designNumber: item.supplyNum,finishNumber:item.supplyNum,designAmount:(item.supplyNum * item.settlePrice).toFixed(2) - 0, finishAmount: 0 - (item.supplyNum * item.settlePrice).toFixed(2) }));
      // const filterArr = this.showData.itemDeductions.filter(item => item.grade == 4);
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
      // console.log('扣减',arr4);
      // // let arr5 = this.itemDeductions.filter(item => item.grade == 4).map(item => ({ ...item, itemName: item.itemName, price: item.price, designNumber: item.designNumber, finishAmount:0-item.finishNumber }));
      // const detailList = [...arr2, ...arr3, ...arr4, ...arr5.map(item => ({ ...item, finishAmount: item.settleAmount, finishNumber: 0 - item.finishNumber }))];
      return this.detailList;
    },
    taxRate() {
      // if(this.showData.taxRate){
      //   return ((this.showData.taxRate*this.showData.settleAmount.toFixed(2) - 0) / 100).toFixed(2) -0
      // }else{
      //   return 0
      // }
      return (
        (this.showData.endSettleAmount - this.showData.settleAmount).toFixed(
          2
        ) - 0
      );
    },
    chartTable() {
      console.log(this.settleChapterVos[this.chartIdx]);
      return this.showData.settleChapterVos[this.chartIdx].details;
    },
  },
  data() {
    return {
      withdrawPkid: "",
      list: [
        { name: "结算信息", idx: 0 },
        // { name: "分项列表", idx: 1 },
        // { name: "费用列表", idx: 2 },
        // { name: "分项扣减列表", idx: 3 },
        // { name: "结算列表", idx: 4 },
        // { name: "审批附件记录", idx: 6 },
      ],
      current: 0,
      tableIndex: 0,
      idx: 0,
      appShow: false,
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
      workflowTableList: [],
      engDeductionDetailVos: [],
      showData: {
        engExpenseDetailVos: [],
        itemDeductions: [],
        details: [],
        statsTaskFinishList: [],
        statsSysRole: {
          sysUserList: [],
        },
        beginDate:"",
        endDate:"",
        lastSettleAmount:0,
        settleAmount:0,
        endSettleAmount:0,
      },
      user: {},
      recallShow: false,
      settlementType: 0,
      approverName: "",
      approverList: [],
      approverShow: false,
      menuCodeData: "",
      modelShow: false,
      nowTab: 1,
      detailsTitle: "",
      todo: 0,
      tableHtml: [],
      tableHtml2: [],
      sendData: {},
      modshow: false,
      modcontent: "",
      showConfirmButton: false,
      confirmText: "",
      detailList: [],
      settleChapterVos: [],
      chartIdx: 0,
      sup:false,
      delShow:false,
      appShow2:false,
			unique:"",
			approType:0,
      fileList:[]
    };
  },
  onLoad(item) {
    console.log("====================================");
    console.log(item);
    this.withdrawPkid = item.pkId;
    console.log("====================================");
    this.sup=!!item.sup
    // 计量结算
    // debugger
    if (item.settleType == 2) {
      this.detailsTitle = "分包详情";
    } else {
      this.detailsTitle = "计量结算";
    }
    // this.rowData = JSON.parse(item.row);
    this.user = uni.getStorageSync("user");
    if (item.todo) {
      this.todo = item.todo - 0;
    } else {
      this.todo = 0;
    }
    if (this.todo == 2) {
      let data = JSON.parse(item.row);
      this.$api.getDoneTaskDetail(data).then((res) => {
        if (res.code === 200) {
          this.showData = res.data.engStatsProjectSettleVo;
          this.detailList = this.showData.settleInfoList;
          this.workflowTableList = this.showData.workflowTableList
            ? this.showData.workflowTableList
            : [];
          this.engDeductionDetailVos = this.showData.engDeductionDetailVos
            ? this.showData.engDeductionDetailVos.map(item => ({ ...item,settleAmount: item.deductionAmount }))
            : [];
          this.setTab();
          if ([5, 6].includes(this.showData.settleStatus)) {
            this.nowTab = 0;
          } else {
            this.nowTab = 1;
          }
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    } else {
      this.user.pkId = this.user.userId;
      this.type = item.sendType - 0;
      this.settlementType = item.type;
      this.projectQuerySettleInfo(item.pkId);
      this.searchMenuDataAuthorize();
    }
  },
  methods: {
    signUrlImg(e) {
				console.log("22222222222222")
				console.log(e)
				console.log(this.tableHtml2)
				console.log("22222222222222")
				// this.$refs.processForm2.signUrlImg(e,this.showData.sysRoleId,this.showData.roleId)



				this.tableHtml.forEach(item => {
					item.tableHtml = this.utils.unzip(item.tableHtml);
					if (item.tableHtml instanceof Array) {} else {
						item.tableHtml = JSON.parse(item.tableHtml);
					}
				});
				if (this.tableHtml.length > 0) {
					this.tableHtml.forEach(item => {
						if (item.tableHtml != undefined && item.tableHtml != null && item.tableHtml.length != 0) {
							item.tableHtml.forEach(items => {
								items.arr.forEach(i => {
									if (i.attributeTypes == 3) {
										if (i.signatureDate.signer == this.showData.sysRoleId || i.signatureDate.signer == this
											.showData.roleId) {
											i.signatureDate.img = e;
										}
									}
								});
							});

						}
					});
					this.tableHtml.forEach(item => {
            if (item.tableHtml instanceof Array) {
              item.tableHtml = JSON.stringify(item.tableHtml);
						  item.tableHtml = this.utils.zip(JSON.stringify(item.tableHtml));
            } else {
					  }
					});
				}
				this.tableHtml2 = this.tableHtml

			},
    getApproType(type){
				this.approType = type
				this.$refs.addPopup.noApprove()
			},
			submit2(e){
				if(e){
					this.unique = e.unique
				}else{
					this.unique = ""
				}
				if(this.approType==0){
					let data = {
            settleId: this.withdrawPkid,
            currentNodeId: this.showData.currentNodeId,
            unique:this.unique
          };
          let api =this.sup?this.$api.withdrawalSettle:this.$api.withdrawalProcessingNode
          api(data).then((res) => {
            if (res.code === 200) {
              uni.showToast({ icon: "success", title: "撤回成功" });
              this.modCancel();
              this.getDetail2();
            } else {
              uni.showToast({ icon: "none", title: res.msg });
            }
          });
				}else if(this.approType==1){
					this.signWithdraw()
				}
			},
    getFileTypes(url) {
      console.log(url);
				let type = getFileType(url);
				if (type === "image") {
					return "photo";
				} else if (type === "excel") {
					return "../../static/fileImg/file-excel.png";
				} else if (type === "word") {
					return "../../static/fileImg/word.png";
				} else if (type === "pdf") {
					return "../../static/fileImg/PDF.png";
				} else {
					return "../../static/fileImg/file-text.png";
				}
			},
    confirmDel(){
       this.$api.delSettle({pkId:this.showData.pkId}).then(res=>{
        if(res.code===200){
          uni.showToast({title:"操作成功"})
          this.getDetail2()
        }else{
          uni.showToast({
              title: res.msg,
              icon: "none",
            });
        }
      })
    },
    del(){
      this.delShow=true
    },
    checkNodes(item) {
      uni.navigateTo({
        url: "/pages/nodeCheck/nodeCheck?type=3&data=" + JSON.stringify(item),
      });
    },
    edit() {
      console.log("重新发起");
      uni.navigateTo({
        url: `/pages/measure/editSettingDetail?settlementType=${this.settlementType}&pkId=${this.showData.pkId}`,
      });
    },
    modconfirm() {
      if (this.confirmText == "前往实名") {
        this.modshow = false;
        uni.navigateTo({ url: "/pages/certification/business-certification" });
      } else if (this.confirmText == "前往授权") {
        uni.showLoading({ mask: true });
        this.$api
          .authorization("https://erp.jianwangkeji.cn/back.html")
          .then((res) => {
            uni.hideLoading();
            if (res.code == 200) {
              this.$store.commit("isEnterAuth", true);
              this.modshow = false;
              uni.navigateTo({
                url:
                  "/pages/esign/esign?url=" +
                  encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl)),
              });
            } else {
              uni.hideLoading();
            }
          })
          .catch((err) => {
            uni.hideLoading();
          });
      }
    },
    getOrgSealState() {
      this.$api.getOrgSealState().then((res) => {
        if (res.code === 200) {
          if (res.data == 1) {
            uni.navigateTo({
              url:
                "/pages/signSend/sealApporval?pkId=" + this.showData.sealPkId,
            });
          } else {
            if (this.user.isMaster) {
              if (res.data == 0) {
                this.modcontent = "企业未实名";
                this.confirmText = "前往实名";
              } else if (res.data == 2) {
                this.modcontent = "E签宝授权已过期";
                this.confirmText = "前往授权";
              }
              this.showConfirmButton = true;
            } else {
              if (res.data == 0) {
                this.modcontent = "企业未实名，请联系管理员进行实名";
              } else if (res.data == 2) {
                this.modcontent = "企业授权已过期，请联系管理员进行授权";
              }
              this.showConfirmButton = false;
            }
            this.modshow = true;
          }
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    sealApprove() {
      if (this.showData.sealPersonStatus) {
        this.getOrgSealState();
      } else {
        uni.navigateTo({
          url: "/pages/signSend/sealApporval?pkId=" + this.showData.sealPkId,
        });
      }
    },
    getDetail() {
      this.projectQuerySettleInfo(this.showData.pkId, 2);
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 3]; // 上一页面实例
      prevPage.$vm.resh(); // 调用上一页 定义的方法
    },
    getDetail2() {
      // this.projectQuerySettleInfo(this.showData.pkId,2)
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]; // 上一页面实例
      prevPage.$vm.resh(); // 调用上一页 定义的方法
      uni.navigateBack();
    },
    confirmSign() {
      uni.navigateTo({
        url: "/pages/signSend/sendSeal?type=1&bizId=" + this.showData.pkId,
      });
      this.modelShow = false;
    },
    cancelSign() {
      this.$api
        .initiateSealProcess({
          bizType: 1,
          fkBizId: this.showData.pkId,
          needSealStatus: 0,
        })
        .then((res) => {
          if (res.code === 200) {
            this.getDetail2();
            this.modelShow = false;
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        });
    },
    goSign() {
      this.modelShow = true;
    },
    recall() {
      this.recallShow = true;
    },
    signWithdraw() {
      this.$api.withdrawSeal({ pkId: this.showData.sealPkId ,unique:this.unique}).then((res) => {
        if (res.code === 200) {
          uni.showToast({ title: "操作成功" });
          this.getDetail2();
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    modConfirm() {
      this.getApproType(0)
    },
    modCancel() {
      this.recallShow = false;
    },
    tabsExamine() {
      console.log("流程图");
      uni.navigateTo({
        url:
          "/pages/nodeCheck/flow?taskFinishVoList=" +
          JSON.stringify(this.showData.taskFinishVoList),
      });
    },
    selectOne(val) {
      this.workflowTableList[val.tableIndex].tableHtml[val.idx].arr[
        val.id
      ].name = val.options.label;
      this.workflowTableList[val.tableIndex].tableHtml[val.idx].arr[val.id].id =
        this.user.pkId;
    },
    findUserListByWorkflowId() {
      this.$api
        .findUserListByWorkflowId({ pkId: this.rowData.pkId })
        .then((res) => {
          if (res.code === 200) {
            if (res.data) {
              this.approverName = res.data.roleName;
              this.approverList = res.data.sysUserList
                ? res.data.sysUserList.map((item) => ({
                    label: item.userName,
                    value: item.pkId,
                  }))
                : [];
              this.approverShow = true;
            } else {
              this.approverShow = false;
            }
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        });
    },
    projectQuerySettleInfo(id) {
      let api =this.sup?this.$api.projectQuerySettleInfo:this.$api.findStatsProjectSettleById
      api({ pkId: id, type: this.type })
        .then((res) => {
          if (res.code == 200) {
            console.log(res);
            this.showData = res.data;
            this.detailList = this.showData.settleInfoList
              ? this.showData.settleInfoList
              : [];
            this.workflowTableList = this.showData.workflowTableList
              ? this.showData.workflowTableList
              : [];
            this.engDeductionDetailVos = this.showData.engDeductionDetailVos
              ? this.showData.engDeductionDetailVos.map(item => ({ ...item,settleAmount: item.deductionAmount }))
              : [];
              this.fileList = []
					this.showData.fileList.forEach(item=>{
                    item.prodReProcessFileList.forEach(item2=>{
                      if(item2.deleteFlag){
                        this.fileList.push(item2)
                      }
                    })
                   })
            this.setTab();
            if ([5, 6].includes(this.showData.settleStatus)) {
              this.nowTab = 0;
              this.detailsTitle = "审批信息";
            } else {
              this.nowTab = 1;
            }
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        });
    },
    setTab() {
      if ([0, "0"].includes(this.showData.settleStatus)) {
        if (this.showData.settleDetails.length) {
          this.list.push({ name: "分项列表", idx: 1 });
        }
        if (this.showData.engExpenseDetailVos.length) {
          this.list.push({ name: "费用列表", idx: 2 });
        }
        if (this.showData.itemDeductions.length) {
          this.list.push({ name: "分项扣减列表", idx: 3 });
        }
        this.list.push({ name: "结算列表", idx: 4 });
      }
      if (
        ![0, "0"].includes(this.showData.settleStatus) &&
        this.showData.settleChapterVos &&
        this.showData.settleChapterVos.length
      ) {
        this.list.push({ name: "汇总表", idx: 9 });
        this.showData.settleChapterVos.forEach((item, index) => {
          this.list.push({ name: item.chapterName, idx: 8, chartIdx: index });
        });
      }
      if (this.workflowTableList.length) {
        let tableArr = this.workflowTableList.map((item, index) => ({
          name: item.tableName,
          idx: 5,
          tableInd: index,
        }));
        this.list.splice(5, 0, ...tableArr);
      }
      this.list.push({ name: "审批附件记录", idx: 6 });
      if (this.engDeductionDetailVos.length) {
        this.list.splice(7, 0, ...[{ name: "材料扣减表", idx: 7 }]);
      }
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
      if (item.idx === 8) {
        this.chartIdx = item.chartIdx;
      }
    },
    appBtn() {
      this.$refs.processForm.gzipTable();
      this.appShow = true;
    },
    closeApp() {
      this.appShow = false;
    },
    sendGzipTableHtml(e) {
      console.log(e);
      this.tableHtml = e;
      this.sendData.workflowTableList = this.tableHtml;
      this.tableHtml2 = e.filter((item) => item.convertPdfStatus);
    },
    sendGzipTableHtml2(e) {
      this.tableHtml2 = e;
      this.tableHtml.forEach((item) => {
        this.tableHtml2.forEach((item2) => {
          if (item.fkTableId == item2.fkTableId) {
            item.tablePdfUrl = item2.tablePdfUrl;
          }
        });
      });
      this.sendData.workflowTableList = this.tableHtml;
      this.projectExamine();
    },
    reject(e) {
      console.log(e);
      let fileList = [
        ...(this.showData.fileVoList
          ? this.showData.fileVoList.filter((item) => item.deleteFlag)
          : []),
        ...e.fileList,
      ];
      let data = {
        pkId: this.showData.pkId,
        auditStatus: 2,
        approveComment: e.opinion ? e.opinion : "审批不通过",
        signUrl: e.signUrl,
        fileList: e.fileList,
        // workflowTableList:this.tableHtml,
      };
      if(e.unique){
					data.unique = e.unique
				}
      this.sendData = data;
      uni.showLoading({ mask: true });
      this.projectExamine();
      // this.$refs.processForm2.tableToImg();
      // this.$api
      //   .projectExamine(data)
      //   .then((res) => {
      //     uni.hideLoading();
      //     if (res.code === 200) {
      //       uni.showToast({ icon: "success", title: "审批成功" });
      //       this.closeApp();
      //       uni.navigateBack({
      //         delta: 1,
      //       });
      //     } else {
      //       uni.showToast({ icon: "none", title: res.msg });
      //     }
      //   })
      //   .catch((err) => {
      //     uni.hideLoading();
      //     // uni.showToast({icon:'none',title:'审批失败'})
      //   });
    },
    submit(e) {
      if (e.signUrl) {
        this.$refs.processForm.signUrl(e.signUrl, e.signerId);
      }
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
        fileList: e.fileList,
        workflowTableList: this.tableHtml,
      };
      if(e.unique){
					data.unique = e.unique
				}
      this.sendData = data;
      uni.showLoading({ mask: true });
      this.projectExamine();
      // this.$refs.processForm2.tableToImg();
    },
    projectExamine() {
      // this.sendData.workflowTableList = this.tableHtml;
      let api =this.sup?this.$api.projectExamine2:this.$api.projectExamine
      api(this.sendData)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.showToast({ icon: "success", title: "审批成功" });
            this.closeApp();
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh();
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
    // 获取当前登录用户角色关联菜单权限数据集
    searchMenuDataAuthorize() {
      this.$api.searchMenuDataAuthorize().then((res) => {
        if (res.code == 200) {
          res.data.forEach((element) => {
            if (element.menuCode == "settlement"&&!this.sup) {
              this.menuCodeData = element.states;
            }
            if (element.menuCode == "projectManage/metering"&&this.sup) {
              this.menuCodeData = element.states;
            }
          });
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pad {
  padding-top: 98rpx;
}
.workflow {
  display: flex;
  .workflow-left {
    width: 60rpx;
    .tabs-item {
      display: flex;
      align-items: center;
      width: 60rpx;
      padding: 30rpx 0;
      border: 2rpx solid #d7d7d7;
      // border-top: 0;
      // border-right: 0;
      writing-mode: vertical-lr;
      cursor: pointer;
    }
    .currentTab {
      background-color: #81d3f8;
      color: #fff;
    }
  }
  .workflow-right {
    flex: 1;
  }
  .workflow-right2 {
    width: calc(100% - 60rpx);
  }
}
.content {
  position: relative;
}

// 详情
.card {
  background: #fff;
  width: 750rpx;
  height: calc(1306rpx - 242rpx);
  // border-left: 8rpx solid #dddddd;
  // padding: 24rpx 40rpx;
  margin-top: 2rpx;

  .list-item {
    height: 80rpx;
    line-height: 80rpx;
    font-size: 28rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    &:first-child {
      border-top: 1px solid rgba(238, 238, 238, 1);
    }
    text:first-child {
      display: inline-block;
      min-width: 196rpx;
      height: 80rpx;
      line-height: 80rpx;
      padding: 0 40rpx;
      border-right: 1px solid rgba(238, 238, 238, 1);
      text-align: justify;
      text-justify: distribute-all-lines;
      text-align-last: justify;
    }
    .item {
      display: inline-block;
      // width: 414rpx;
      padding-left: 10rpx;
      color: #79859a;
    }
  }
}

.empty {
  position: fixed;
  left: 50%;
  // bottom: 340rpx;
  bottom: 140rpx;
  transform: translate(-50%, 0%);
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

.arrow-up {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer {
  position: fixed;
  width: 100%;
  bottom: 0;
  display: flex;
  // height: 100rpx;
  background-color: #fff;
  z-index: 11;

  .footer-btn {
    flex: 1;
    height: 100rpx;
    line-height: 100rpx;
    font-size: 32rpx;
    text-align: center;
    border: none;
    color: #fff;
  }

  .error {
    background-color: red;
  }

  .primary {
    background-color: #4995e9;
  }
}

.app-record {
  .app-record-item {
    padding: 0 20rpx;
    background-color: #fff;
    margin-bottom: 10rpx;
    font-size: 26rpx;
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;
      color: #bcc2cc;
      .checkBtn {
        color: #1576e6;
      }
    }

    .item-content {
      // display: flex;
      border-bottom: 1px solid rgba(238, 238, 238, 1);

      .item-content-head {
        .appimg {
          width: 40rpx;
          margin-right: 8rpx;
        }
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

/deep/.fixed-box {
  z-index: 10;
}
.pdb {
  height: 100rpx;
}
.widtd-left {
  width: 700rpx !important;
}
</style>
