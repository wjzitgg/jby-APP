<template>
  <view class="wrapper">
    <u-navbar
      leftText="入库单详情"
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
      >
      </u-tabs>
    </view>
    <view class="pad"></view>
    <view class="content">
      <view v-if="current == 0" style="width:750rpx">
			  <tableForm class="mb-20" :pageHeight="false" :list="[
        {name:'入库编号',value:details.orderCode,show:true},
        {name:'来料对象',value:putIsscodeList[details.issueCode],show:true},
        {name:'标段项目',value:details.projectName,show:[6, 7].includes(user.orgType) && details.issueCode !== 'issue_unit'},
        {name:'入库仓库',value:details.warehouseName,show:true},
        {name:'分包商',value:details.customerName,show:details.issueCode === 'issue_subcontract'},
        {name:'供应商',value:details.customerName,show:details.issueCode === 'issue_supplier'},
        {name:'分项工程',value:details.orderItemList && details.orderItemList.length? details.orderItemList[0].itemName: '',show:details.issueCode === 'issue_position'},
        {name:'直供分包商',value:details.supplyCustomerName,show:subSelShow},
        {name:'关联采购计划单',value:details.orderRelationList && details.orderRelationList.filter(item=>item.orderType==1).length? details.orderRelationList.filter(item=>item.orderType==1).map((item) => item.orderCode).join(','): '无',show:details.issueCode === 'issue_supplier' && [4, 5].includes(user.orgType)},
        {name:'关联出库单',value:details.orderRelationList && details.orderRelationList.filter(item=>item.orderType==2).length? details.orderRelationList.filter(item=>item.orderType==2).map((item) => item.orderCode).join(','): '无',show:details.issueCode === 'issue_unit' || (user.orgType === 5 && details.issueCode === 'issue_subcontract')},
        {name:'关联申请单',value:details.applyStatus? '无':details.applyOrderCode,show:user.orgType ===7&&!['issue_position','issue_unit'].includes(details.issueCode)},
        {name:'填表人',value:details.leaderName,show:true},
        {name:'业务时间',value:details.serviceTime,show:true},
        {name:'制单人',value:details.createUserName,show:true},
        {name:'录入时间',value:details.createTime,show:true},
        {name:'单据状态',value:[5, 7].includes(user.orgType) && details.inventoryCode === 4 && !details.warehousingUser? '未入库已退货': putStatesList[details.inventoryCode],show:true},
        {name:'备注',value:details.remark,show:true},
        ]"
        ></tableForm>
        <tableForm :pageHeight="false" v-if="details.receiverStatus === 2 || ['2', '3'].includes(details.inventoryCode)" :list="[
        {name:'签收人',value:details.receiverName,show:['2', '3'].includes(details.inventoryCode)},
        {name:'签收时间',value:details.receiverTime,show:['2', '3'].includes(details.inventoryCode)},
        {name:'入库人',value:details.warehousingUserName,show:['3'].includes(details.inventoryCode)},
        {name:'入库时间',value:details.warehousingTime,show:['3'].includes(details.inventoryCode)},
        {name:'拒收人',value:details.receiverName,show:[2].includes(details.receiverStatus)},
        {name:'拒收时间',value:details.receiverTime,show:[2].includes(details.receiverStatus)},
        {name:'拒收理由',value:details.reason,show:[2].includes(details.receiverStatus)},
        ]"
        ></tableForm>
			</view>
      <!-- <view v-if="current === 0">
        <u--form labelPosition="left" class="form mb-20" :borderBottom="true">
          <u-form-item label="入库编号" labelWidth="80">
            <view>{{ details.orderCode }}</view>
          </u-form-item>
          <u-form-item label="来料对象" labelWidth="80">
            <view>{{ putIsscodeList[details.issueCode] }}</view>
          </u-form-item>
          <u-form-item
            label="标段项目"
            labelWidth="80"
            v-if="
              [6, 7].includes(user.orgType) &&
              details.issueCode !== 'issue_unit'
            "
          >
            <view>{{ details.projectName }}</view>
          </u-form-item>
          <u-form-item label="入库仓库" labelWidth="80">
            <view>{{ details.warehouseName }}</view>
          </u-form-item>
          <u-form-item
            label="分包商"
            labelWidth="80"
            v-if="details.issueCode === 'issue_subcontract'"
          >
            <view>{{ details.customerName }}</view>
          </u-form-item>
          <u-form-item
            label="供应商"
            labelWidth="80"
            v-if="details.issueCode === 'issue_supplier'"
          >
            <view>{{ details.customerName }}</view>
          </u-form-item>
          <u-form-item
            label="分项工程"
            labelWidth="80"
            v-if="details.issueCode === 'issue_position'"
          >
            <view>{{
              details.orderItemList && details.orderItemList.length
                ? details.orderItemList[0].itemName
                : ""
            }}</view>
          </u-form-item>
          <u-form-item label="直供分包商" labelWidth="100" v-if="subSelShow">
            <view>{{ details.supplyCustomerName }}</view>
          </u-form-item>
          <u-form-item
            label="关联采购计划单"
            labelWidth="120"
            v-if="
              details.issueCode === 'issue_supplier' &&
              [4, 5].includes(user.orgType)
            "
          >
            <view>{{
              details.orderRelationList && details.orderRelationList.filter(item=>item.orderType==1).length
                ? details.orderRelationList.filter(item=>item.orderType==1)
                    .map((item) => item.orderCode)
                    .join(",")
                : "无"
            }}</view>
          </u-form-item>
          <u-form-item
            label="关联出库单"
            labelWidth="100"
            v-if="
              details.issueCode === 'issue_unit' ||
              (user.orgType === 5 && details.issueCode === 'issue_subcontract')
            "
          >
            <view>{{
              details.orderRelationList && details.orderRelationList.filter(item=>item.orderType==2).length
                ? details.orderRelationList.filter(item=>item.orderType==2)
                    .map((item) => item.orderCode)
                    .join(",")
                : "无"
            }}</view>
          </u-form-item>
          <u-form-item
            label="关联申请单"
            labelWidth="100"
            v-if="user.orgType ===7&&!['issue_position','issue_unit'].includes(details.issueCode)"
          >
            <view>{{details.applyStatus? '无':details.applyOrderCode }}</view>
          </u-form-item>
          <u-form-item label="填表人" labelWidth="80">
            <view>{{ details.leaderName }}</view>
          </u-form-item>
          <u-form-item label="业务时间" labelWidth="80">
            <view>{{ details.serviceTime }}</view>
          </u-form-item>
          <u-form-item label="制单人" labelWidth="80">
            <view>{{ details.createUserName }}</view>
          </u-form-item>
          <u-form-item label="录入时间" labelWidth="80">
            <view>{{ details.createTime }}</view>
          </u-form-item>
          <u-form-item label="单据状态" labelWidth="80">
            <view>{{
              [5, 7].includes(user.orgType) &&
              details.inventoryCode === 4 &&
              !details.warehousingUser
                ? "未入库已退货"
                : putStatesList[details.inventoryCode]
            }}</view>
          </u-form-item>
          <u-form-item label="备注" labelWidth="80">
            <view class="remark">{{ details.remark }}</view>
          </u-form-item>
        </u--form>
        <u--form labelPosition="left" class="form" :borderBottom="true" v-if="details.receiverStatus === 2 || ['2', '3'].includes(details.inventoryCode)">
          <u-form-item label="签收人" labelWidth="80" v-if="['2', '3'].includes(details.inventoryCode)">
            <view>{{ details.receiverName }}</view>
          </u-form-item>
          <u-form-item label="签收时间" labelWidth="80" v-if="['2', '3'].includes(details.inventoryCode)">
            <view>{{ details.receiverTime }}</view>
          </u-form-item>
          <u-form-item label="入库人" labelWidth="80" v-if="['3'].includes(details.inventoryCode)">
            <view>{{ details.warehousingUserName }}</view>
          </u-form-item>
          <u-form-item label="入库时间" labelWidth="80" v-if="['3'].includes(details.inventoryCode)">
            <view>{{ details.warehousingTime }}</view>
          </u-form-item>
          <u-form-item label="拒收人" labelWidth="80" v-if="[2].includes(details.receiverStatus)">
            <view>{{ details.receiverName }}</view>
          </u-form-item>
          <u-form-item label="拒收时间" labelWidth="80" v-if="[2].includes(details.receiverStatus)">
            <view>{{ details.receiverTime }}</view>
          </u-form-item>
          <u-form-item label="拒收理由" labelWidth="80" v-if="[2].includes(details.receiverStatus)">
            <view>{{ details.reason }}</view>
          </u-form-item>
        </u--form>
      </view> -->
      <view v-if="current === 1">
        <view class="table_detail table_height table_empty">
          <table>
            <thead>
              <tr>
                <th>序号</th>
                <th>物料名称</th>
                <th>物料分类</th>
                <th>供应商</th>
                <th>单位</th>
                <th>入库数量</th>
                <th>物料单价</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.materialName }}</td>
                <td>{{ item.fkTypeName }}</td>
                <td>
                  {{ item.fkCustomerId === "0" ? "无" : item.customerName }}
                </td>
                <td>{{ item.fkUnitName }}</td>
                <td>{{ item.stockNum }}</td>
                <td>{{ item.materialPrice }}</td>
              </tr>
            </tbody>
          </table>
          <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
        </view>
      </view>
      <view class="pdb"></view>
      <view class="footer">
        <view
          class="btns green"
          v-if="details.inventoryCode === '0'"
          @click="edit"
          >编辑</view
        >
        <view
          class="btns red"
          v-if="details.deleteStatus"
          @click="delBtn"
          >删除</view
        >
        <!-- getObj.handleButton&& -->
        <view
          class="btns red"
          v-if="details.rejectionButton"
          @click="handleBtn(3)"
          >拒收</view
        >
        <!-- getObj.handleButton&& -->
        <view
          class="btns yellow"
          v-if="details.signButton"
          @click="handleBtn(1)"
          >签收</view
        >
        <!-- getObj.handleButton&& -->
        <view
          class="btns blue"
          v-if="details.signWarehousingButton"
          @click="handleBtn(2)"
          >签收入库</view
        >
        <view
          class="btns green"
          v-if="details.checkInforButton&&$auth('material:inventory:inInventoryCheck')"
          @click="checkDetail"
          >检测详情</view
        >
        <view class="btns blue" v-if="details.warehousingButton" @click="putStore">入库</view>
        <view class="btns red"  @click="openReturnPop" v-if="details.retreatButton">退货</view>
      </view>
    </view>
    <u-popup :show="handlePopShow" mode="center" :round="10">
      <view class="handlePop">
        <view class="handlePop-head">
          <view class="name">处理入库单</view>
          <u-icon
            name="close"
            class="closeBtn"
            @click="closeHandlePop"
          ></u-icon>
        </view>
        <view class="content">
          <u--form labelPosition="left" class="form" :borderBottom="true">
            <u-form-item label="入库仓库" labelWidth="80" @click="openPicker" v-if="handleStatus !==3">
              <view>{{ handleForm.warehouseName }}</view>
              <u-icon slot="right" name="arrow-right"></u-icon>
            </u-form-item>
            <!-- <u-form-item label="填表人" labelWidth="80">
              <u--input
                v-model="handleForm.leaderName"
                border="none"
              ></u--input>
            </u-form-item> -->
            <view v-if="[7].includes(user.orgType) && details.applyStatus&&details.issueCode !== 'issue_unit'" >
          <view class="title" style="font-size:30rpx">关联申请单</view>
          <view class="orderList">
            <view
              class="orderList-item"
              v-for="(item, idx) in fkApplyIdList"
              :key="idx"
            >
              <u-icon name="file-text" size="20"></u-icon>
              <view class="name">{{ item.orderCode }}</view>
              <u-icon
                name="trash"
                class="delBtn"
                size="20"
                @click="delSub(item, idx)"
              ></u-icon>
            </view>
          </view>
          <view class="addSubBtn">
            <view class="btns" @click="addOrderBtn"> 添加 </view>
          </view>
        </view>
            <u-form-item
              label="业务时间"
              labelWidth="80"
              @click="dateSelectShow = true"
            >
              <view>{{ handleForm.serviceTime }}</view>
              <u-icon slot="right" name="arrow-right"></u-icon>
            </u-form-item>
            <u-form-item label="备注" labelWidth="80" v-if="handleStatus !==3">
              <u--textarea v-model="handleForm.remark"></u--textarea>
            </u-form-item>
            <u-form-item label="拒收原因" labelWidth="80" v-if="handleStatus ===3">
              <u--textarea v-model="handleForm.reason"></u--textarea>
            </u-form-item>
          </u--form>
        </view>
        <view class="handlePop-footer">
          <view class="handlePopBtns" @click="closeHandlePop">取消</view>
          <view class="handlePopBtns primary" @click="handleOk">确认</view>
        </view>
        <u-datetime-picker
          :show="dateSelectShow"
          v-model="dates"
          mode="datetime"
          @confirm="dateSelect"
          @cancel="closeDateSelect"
        ></u-datetime-picker>
        <u-picker
          title="请选择"
          :show="pickerShow"
          :columns="[pickerList]"
          keyName="label"
          @confirm="pickerConfirm"
          @cancel="pickerCancel"
        ></u-picker>
      </view>
      <u-popup :show="popShow" @close='closePop1'>
            <view class="popup1">
                <view class="popup-header">
                <view class="name">选择关联申请单</view>
                <view class="submitPop1" @click="submitPop1">确认</view>
                </view>
                <view class="popup-content">
                    <view class="search-input">
                        <u-input
                          placeholder="请输入单据编号"
                          border="none"
                          v-model="searchOrder"
                        >
                          <view slot="suffix">
                            <u-icon
                              name="search"
                              size="28"
                              @click="searchOrders"
                              color="#2a82e4"
                            ></u-icon>
                          </view>
                        </u-input>
                    </view>
                     <u-checkbox-group
                        v-model="checkList"
                        placement="column"
                        @change="checkboxChange"
                        class="checkBoxGroup"
                    >
                        <u-checkbox
                            class="checkBox"
                            v-for="(item) in ordersList"
                            :key="item.pkId"
                            :label="item.orderCode"
                            :name="item.pkId"
                        >
                    </u-checkbox>
                    </u-checkbox-group>
                </view>
            </view>
	    </u-popup>
    </u-popup>
     <u-popup :show="returnPopShow" mode="center" :round="10">
      <view class="returnPopShow">
        <view class="returnPop-head">
          <view class="name">退货</view>
          <u-icon
            name="close"
            class="closeBtn"
            @click="closeReturnPop"
          ></u-icon>
        </view>
        <view class="returnPop-content">
          <u--form labelPosition="left" class="form" :borderBottom="true">
            <u-form-item label="退货时间" labelWidth="80" @click="openDateSelect2(1)" v-if="details.interfaceType === 1">
            <view>{{ subReturnForm.serviceTime }}</view>
            <u-icon slot="right" name="arrow-right"></u-icon>
          </u-form-item>
            <u-form-item label="退回地址" labelWidth="80">
            <u--input
              v-model="subReturnForm.receiptAddress"
              border="none"
              clearable
            ></u--input>
          </u-form-item>
          </u--form>
          <view v-if="[0, 2].includes(details.showTabStatus)">
          <u-divider text="本单位库存部分" :dashed="true"></u-divider>
          <u--form labelPosition="left" class="form" :borderBottom="true">
            <u-form-item label="出库单号" labelWidth="80">
            <u--input
              v-model="subReturnForm.orderCode"
              border="none"
              clearable
              @input="isUpdate=1"
            ></u--input>
          </u-form-item>
            <!-- <u-form-item label="填表人" labelWidth="80">
            <u--input
              v-model="subReturnForm.leaderName"
              border="none"
              clearable
            ></u--input>
          </u-form-item> -->
            <u-form-item label="退货时间" labelWidth="80" @click="openDateSelect2(1)">
            <view>{{ subReturnForm.serviceTime }}</view>
            <u-icon slot="right" name="arrow-right"></u-icon>
          </u-form-item>
          <u-form-item label="备注" labelWidth="80" >
             <u--input
              v-model="subReturnForm.remark"
              border="none"
              clearable
            ></u--input>
          </u-form-item>
          <u-form-item label="签收状态" labelWidth="80" v-if="details.signStatus">
            <u-radio-group v-model="subReturnForm.receiverStatus">
              <u-radio label="待签收" :name='0'></u-radio>
              <u-radio label="已签收" :name='1'></u-radio>
            </u-radio-group>
          </u-form-item>
          <u-form-item label="签收人" labelWidth="80" v-if="subReturnForm.receiverStatus === 1">
            <u--input
              v-model="subReturnForm.receiverName"
              border="none"
              clearable
            ></u--input>
          </u-form-item>
          <u-form-item label="签收时间" labelWidth="80" @click="openDateSelect2(2)" v-if="subReturnForm.receiverStatus === 1">
            <view>{{ subReturnForm.receiverTime }}</view>
            <u-icon slot="right" name="arrow-right"></u-icon>
          </u-form-item>
          <u-form-item label="车牌号" labelWidth="80">
            <u--input
              v-model="subReturnForm.vehicleNum"
              border="none"
              clearable
            ></u--input>
          </u-form-item>
          <u-form-item label="运输司机" labelWidth="80">
            <u--input
              v-model="subReturnForm.driverName"
              border="none"
              clearable
            ></u--input>
          </u-form-item>
          <u-form-item label="联系方式" labelWidth="80">
            <u--input
              v-model="subReturnForm.driverPhone"
              border="none"
              clearable
              type='number'
              maxlength="11"
            ></u--input>
          </u-form-item>
          </u--form>
          <view class="table_detail" v-if="returnMaterialList.length">
              <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>物料名称</th>
              <th>物料分类</th>
              <th>单位</th>
              <th>单据数量</th>
              <th v-if="details.interfaceType === 2 && details.showTabStatus === 2">可退数量</th>
              <th>物料单价</th>
              <th>退货数量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in returnMaterialList" :key="item.pkId">
              <!--  -->
              <td><text @click="openDetail(item,1)" :class="{clickTd:details.interfaceType!==1}">{{ index+1 }}</text></td>
              <td>{{item.materialName}}</td>
              <td>{{item.fkTypeName}}</td>
              <td>{{item.fkUnitName}}</td>
              <td>{{item.stockNum}}</td>
              <td v-if="details.interfaceType === 2 && details.showTabStatus === 2">{{item.marginNum}}</td>
              <td>{{item.price}}</td>
              <td>{{item.retreatNum}}</td>
            </tr>
          </tbody>
              </table>
            </view>
          </view>
          <view v-if="user.orgType==7">
          <!-- <u-divider text="本单位库存部分" :dashed="true"></u-divider> -->
          <u--form labelPosition="left" class="form" :borderBottom="true">
            <u-form-item label="出库单号" labelWidth="80" v-if="[2, 3].includes(details.interfaceType)">
            <u--input
              v-model="subReturnForm.orderCode"
              border="none"
              clearable
              @input="isUpdate=1"
            ></u--input>
          </u-form-item>
            <!-- <u-form-item label="填表人" labelWidth="80" v-if="[2, 3].includes(details.interfaceType)">
            <u--input
              v-model="subReturnForm.leaderName"
              border="none"
              clearable
            ></u--input>
          </u-form-item> -->
            <u-form-item label="退货时间" labelWidth="80" @click="openDateSelect2(1)" v-if="[2, 3].includes(details.interfaceType)">
            <view>{{ subReturnForm.serviceTime }}</view>
            <u-icon slot="right" name="arrow-right"></u-icon>
          </u-form-item>
          <u-form-item label="备注" labelWidth="80" >
             <u--input
              v-model="subReturnForm.remark"
              border="none"
              clearable
            ></u--input>
          </u-form-item>
          <u-form-item label="签收状态" labelWidth="80" v-if="details.signStatus">
            <u-radio-group v-model="subReturnForm.receiverStatus">
              <u-radio label="待签收" :name='0'></u-radio>
              <u-radio label="已签收" :name='1'></u-radio>
            </u-radio-group>
          </u-form-item>
          <u-form-item label="签收人" labelWidth="80" v-if="subReturnForm.receiverStatus === 1">
            <u--input
              v-model="subReturnForm.receiverName"
              border="none"
              clearable
            ></u--input>
          </u-form-item>
          <u-form-item label="签收时间" labelWidth="80" @click="openDateSelect2(2)" v-if="subReturnForm.receiverStatus === 1">
            <view>{{ subReturnForm.receiverTime }}</view>
            <u-icon slot="right" name="arrow-right"></u-icon>
          </u-form-item>
          <u-form-item label="车牌号" labelWidth="80">
            <u--input
              v-model="subReturnForm.vehicleNum"
              border="none"
              clearable
            ></u--input>
          </u-form-item>
          <u-form-item label="运输司机" labelWidth="80">
            <u--input
              v-model="subReturnForm.driverName"
              border="none"
              clearable
            ></u--input>
          </u-form-item>
          <u-form-item label="联系方式" labelWidth="80">
            <u--input
              v-model="subReturnForm.driverPhone"
              border="none"
              clearable
              type='number'
              maxlength="11"
            ></u--input>
          </u-form-item>
          </u--form>
          <view class="table_detail" v-if="returnMaterialList.length">
              <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>物料名称</th>
              <th>物料分类</th>
              <th>单位</th>
              <th>单据数量</th>
              <th v-if="details.interfaceType === 2 && details.showTabStatus === 2">可退数量</th>
              <th>物料单价</th>
              <th>退货数量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in returnMaterialList" :key="item.pkId">
              <!--  -->
              <td><text @click="openDetail(item,1)" :class="{clickTd:details.interfaceType!==1}"></text>{{ index+1 }}</td>
              <td>{{item.materialName}}</td>
              <td>{{item.fkTypeName}}</td>
              <td>{{item.fkUnitName}}</td>
              <td>{{item.stockNum}}</td>
              <td v-if="details.interfaceType === 2 && details.showTabStatus === 2">{{item.marginNum}}</td>
              <td>{{item.price}}</td>
              <td>{{item.retreatNum}}</td>
            </tr>
          </tbody>
              </table>
            </view>
          </view>
          <view v-if="[1, 2].includes(details.showTabStatus)">
            <u-divider text="已出料部分" :dashed="true"></u-divider>
            <view class="table_detail" v-if="afterMaterialList.length">
              <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>出料对象</th>
              <th>关联单据</th>
              <th>物料名称</th>
              <th>物料分类</th>
              <th>单位</th>
              <th>单据数量</th>
              <th>物料单价</th>
              <th>退货数量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in afterMaterialList" :key="item.pkId">
              <td><text @click="openDetail(item,2)" :class="{clickTd:item.type==4}">{{ index+1 }}</text></td>
              <td>{{item.customName}}</td>
              <td>{{item.codeUrl}}</td>
              <td>{{item.materialName}}</td>
              <td>{{item.materialTypeName}}</td>
              <td>{{item.fkUnitName}}</td>
              <td>{{item.stockNum}}</td>
              <td>{{item.price}}</td>
              <td>{{item.retreatNum}}</td>
            </tr>
          </tbody>
              </table>
            </view>
          </view>
        </view>
        <view class="returnPop-footer">
          <view class="returnPopBtns cancle" @click="closeReturnPop">取消</view>
          <view class="returnPopBtns primary" @click="returnDialogOk">确认</view>
        </view>
      </view>
      <u-datetime-picker
          :show="dateSelectShow2"
          v-model="dates2"
          mode="datetime"
          @confirm="dateSelect2"
          @cancel="closeDateSelect2"
        ></u-datetime-picker>
      <u-popup :show="popShow2" :round="20">
        <view class="popup2">
        <view class="popup2-head">
          <view class="name">编辑物料</view>
          <u-icon
            name="close"
            color="#fff"
            class="closeBtn"
            @click="closePop2"
          ></u-icon>
          <!-- <view ></view> -->
        </view>
        <view class="popup2-content">
           <view>
                <view class="title">物料</view>
                <view class="inputs select">
                  <view class="name">{{nowClickMaterial.materialName}}</view>
                  <u-icon
                    name="lock"
                    class="icons"
                    color="#2a82e4"
                    size="16"
                  ></u-icon>
                </view>
            </view>
            <view>
                <view class="title">物料分类</view>
                <view class="inputs select">
                  <view class="name">{{nowClickMaterial.fkTypeName}}</view>
                  <u-icon
                    name="lock"
                    class="icons"
                    color="#2a82e4"
                    size="16"
                  ></u-icon>
                </view>
            </view>
            <view>
                <view class="title">单位</view>
                <view class="inputs select">
                  <view class="name">{{nowClickMaterial.fkUnitName}}</view>
                  <u-icon
                    name="lock"
                    class="icons"
                    color="#2a82e4"
                    size="16"
                  ></u-icon>
                </view>
            </view>
            <view>
                <view class="title">单据数量</view>
                <view class="inputs select">
                  <view class="name">{{nowClickMaterial.stockNum}}</view>
                  <u-icon
                    name="lock"
                    class="icons"
                    color="#2a82e4"
                    size="16"
                  ></u-icon>
                </view>
            </view>
            <view v-if="details.interfaceType === 2 && details.showTabStatus === 2">
              <view class="title">可退数量</view>
              <view class="inputs select">
                <view class="name">{{nowClickMaterial.marginNum}}</view>
                  <u-icon
                    name="lock"
                    class="icons"
                    color="#2a82e4"
                    size="16"
                  ></u-icon>
              </view>
            </view>
            <view>
              <view class="title">物料单价</view>
              <view class="inputs select">
                <view class="name">{{nowClickMaterial.materialPrice}}</view>
                  <u-icon
                    name="lock"
                    class="icons"
                    color="#2a82e4"
                    size="16"
                  ></u-icon>
              </view>
            </view>
            <view>
              <view class="title">退货数量</view>
              <view class="inputs">
                <!-- @input="numChange" -->
                <u--input
                  v-model="nowClickMaterial.retreatNum"
                  border="none"
                  type='number'
                  clearable
                ></u--input>
              </view>
            </view>
        </view>
        <view class="pop-pdb"></view>
        <view class="footer">
            <view class="foot-btn btns1 cancle" @click="closePop2">取消</view>
            <view class="foot-btn btns1 save" @click="popOk2">保存</view>
        </view>
      </view>
    </u-popup>
     </u-popup>
  </view>
</template>

<script>
import moment from "moment";
import tableForm from '../../../components/table-form/table-form.vue';
export default {
  components:{tableForm},
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  data() {
    return {
      tabList: [{ name: "入库信息" }, { name: "物料信息" }],
      current: 0,
      getObj: {},
      details: {
        issueCode: "",
      },
      list: [],
      putIsscodeList: {
        issue_unit: "无",
        issue_supplier: "供应商",
        issue_subcontract: "分包商",
        issue_project: "项目部",
        issue_position: "施工部位",
      },
      putStatesList: [
        "草稿",
        "运输中",
        "待入库",
        "已完成",
        "已退货",
        "待退货",
        "退货中",
        "已拒收",
      ],
      subSelShow: false,
      handlePopShow: false,
      handleStatus: 1,
      handleForm: {
        leaderName: "",
        serviceTime: "",
        fkWarehouseId: "",
        remark: "",
        warehouseName: "",
        reason: "",
        fkApplyIdList:[]
      },
      dateSelectShow: false,
      dates: "",
      dateSelectShow2: false,
      dates2: "",
      pickerShow: false,
      pickerList: [],
      warehouserList:[],
      returnPopShow:false,
      subReturnForm: {
        driverName: "",
        driverPhone: "",
        inputId: "",
        leaderName: "",
        orderCode: "",
        remark: "",
        serviceTime: "",
        vehicleNum: "",
        receiverName: "",
        receiverTime: "",
        receiverStatus:0
      },
      dateSelectType:1,
      nowClickMaterial:{},
      popShow2:false,
      returnMaterialList:[],
      afterMaterialList:[],
      isUpdate:0,
      searchOrder:"",
      ordersList:[],
      checkList:[],
      fkApplyIdList:[],
      popShow:false
    };
  },
  onLoad(options) {
    this.dates = Number(new Date());
    this.dates2 = Number(new Date());
    if(options.type==1){
      let obj = JSON.parse(options.obj);
      console.log(obj);
      this.getObj = obj;
      this.findInputById();
    }else if(options.type==2){
      this.findInputByOrderCode(options.orderCode)
    }
  },
  methods: {
    delBtn(){
      uni.showModal({
        title: '提示',
        content: '确定删除？',
        showCancel: true,
        success: ({ confirm, cancel }) => {
          if(confirm){
            uni.showLoading({mask:true})
            this.$api.delPutInventory({pkId:this.details.pkId}).then(res=>{
              uni.hideLoading()
              if(res.code===200){
                  uni.showToast({ title: "删除成功", icon: "success" });
                  this.getDetail()
                  uni.navigateBack({ delta: 1 });
                }else{
                  uni.showToast({ title: res.msg, icon: "none" });
                }
              })
          }
        }
      })
    },
    addOrderBtn() {
      this.checkList=this.handleForm.fkApplyIdList
      this.findOrderApplyByInputId()
      this.openPop1()
    },
    checkboxChange(e){
        console.log(e);
    },
    openPop1(){
        this.popShow=true
    },
    searchOrders(){
      this.findOrderApplyByInputId(this.searchOrders)
    },
    submitPop1(){
        this.handleForm.fkApplyIdList=this.checkList
        this.fkApplyIdList=[]
        console.log(this.ordersList);
        this.ordersList.forEach(item=>{
          if(this.checkList.includes(item.pkId)){
            this.fkApplyIdList.push({ ...item })
          }
        })
        this.closePop1()
    },
    closePop1(){
        this.popShow=false
        this.searchOrder=''
        this.checkList=[]
    },
    findOrderApplyByInputId(orderCode){
      let data = { pageNum: 1, pageSize: 20, inputId:this.details.pkId,orderCode,applyIds:this.handleForm.fkApplyIdList.join(','), };
      this.$api.findOrderApplyByInputId(data).then(res=>{
         if(res.code===200){
          this.ordersList=res.data
        }else{
            uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    currentChange(e) {
      this.current = e.index;
    },
    findWarehouseByProjectId(bidProjectId){
        this.$api.findWarehouseByProjectId({bidProjectId}).then(res=>{
            if(res.code===200){
                let arr = res.data.map(item => ({ ...item, value: item.pkId, label: item.warehouseName }));
                this.warehouserList=arr
            }else{
                uni.showToast({ title: res.msg, icon: "none" });
            }
        })
    },
    findInputById() {
      uni.showLoading({ mask: true });
      this.$api
        .findInputById({ pkId: this.getObj.pkId })
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.details = res.data;
            this.list = res.data.detailsVoList;
            let arr1 = res.data.orderRelationList.filter(item => item.orderType === 1); //采购单
            let arr2 = res.data.orderRelationList.filter(item => item.orderType === 2); //出库单
            this.details.fkPurchaseId = arr1.length ? arr1[0].pkId : "";
            this.details.fkInventoryIdList = arr2.length ? arr2.map(item => item.pkId) : [];
            this.details.fkItemId = res.data.orderItemList && res.data.orderItemList.length ? res.data.orderItemList[0].fkItemId : "";
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    findInputByOrderCode(orderCode){
      this.$api.findInputByOrderCode({ orderCode}).then(res => {
        if (res.code === 200) {
          if (res.data) {
            console.log("订单号查询详情", res.data);
            this.getObj =res.data
            this.scanCodeType = res.data.inventoryCode === "1" ? 2 : res.data.inventoryCode === "2" ? 3 : 1;
            this.details = res.data;
            this.list = res.data.detailsVoList;
            let arr1 = res.data.orderRelationList.filter(item => item.orderType === 1); //采购单
            let arr2 = res.data.orderRelationList.filter(item => item.orderType === 2); //出库单
            this.details.fkPurchaseId = arr1.length ? arr1[0].pkId : "";
            this.details.fkInventoryIdList = arr2.length ? arr2.map(item => item.pkId) : [];
            this.details.fkItemId = res.data.orderItemList && res.data.orderItemList.length ? res.data.orderItemList[0].fkItemId : "";
            this.findWarehouseByProjectId(res.data.fkBidProjectId, 2, true);
          } else {
             uni.showToast({title:"该入库单不存在",icon:'none'})
          }
        } else {
          uni.showToast({title:res.msg,icon:'none'})
        }
      });
    },
    getBusinessCode() {
      this.$api.getBusinessCode({ businessType: 7 }).then((res) => {
        if (res.code === 200) {
          this.subReturnForm.orderCode = res.data.typeCode;
          this.maxlength = res.data.limitNum;
          this.allowModify = res.data.allowModify;
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    edit() {
      uni.navigateTo({
        url:
          "/pages/material/inventory/addInInventory?type=2&obj=" +
          JSON.stringify(this.details),
      });
    },
    getDetail(){
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]; // 上一页面实例
      prevPage.$vm.resh() // 调用上一页 定义的方法
    },
    submitBtn() {
      let data = {
        ...this.details,
        detailUpdateList: this.list,
        inventoryCode: 2,
        isUpdate: 0,
      };
      this.$api.updatePutInventory(data).then((res) => {
        if (res.code === 200) {
          uni.showToast({ title: "提交成功", icon: "success" });
          this.getDetail()
          uni.navigateBack({ delta: 1 });
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    checkDetail() {
      uni.navigateTo({
        url:
          "/pages/production/checkDetail?no=1&obj=" +
          JSON.stringify(this.getObj),
      });
    },
    putStore(){
      this.$api.inputWarehousing(this.details.pkId).then(res => {
          if (res.code === 200) {
            uni.showToast({title:'入库成功'})
            this.getDetail()
            uni.navigateBack()
          } else {
            uni.showToast({icon:'none',title:res.msg})
          }
        });
    },
    handleBtn(handleStatus) {
      this.handleStatus = handleStatus;
      this.openHandlePop();
      // if(d){}
    },
    handleOk() {
      let data = {
        pkId: this.getObj.pkId,
        leaderName: this.handleForm.leaderName,
        serviceTime: this.handleForm.serviceTime,
        fkWarehouseId: this.handleForm.fkWarehouseId,
        remark: this.handleForm.remark,
        handleStatus:this.handleStatus,
        fkApplyIdList:this.handleForm.fkApplyIdList
      };
      if (this.handleStatus !== 3 && !data.fkWarehouseId) {
       return uni.showToast({icon:'none',title:'请选择仓库'})
      }
      if(this.handleStatus !== 3&&this.details.applyStatus &&this.user.orgType ===7&&this.details.issueCode !== 'issue_unit'&&!data.fkApplyIdList.length){
        return uni.showToast({icon:'none',title:'请选择申请单'})
      }
      if (!data.leaderName) {
       return uni.showToast({icon:'none',title:'请填写负责人'})
      }
      if (!data.serviceTime) {
       return uni.showToast({icon:'none',title:'请选择业务时间'})
      }
      if(this.handleStatus === 3){
        data.reason= this.handleForm.reason
        if (!data.reason) {
            return uni.showToast({icon:'none',title:'请填写拒收理由'})
          }
      }
      uni.showLoading({mask:true})
      this.$api.handlePutInventory(data).then(res => {
        uni.hideLoading()
          if (res.code === 200) {
            uni.showToast({icon:'none',title:'操作成功'})
            this.getDetail()
            uni.navigateBack()
          } else {
             uni.showToast({icon:'none',title:res.msg})
          }
        });
    },
    closeHandlePop() {
      this.handlePopShow = false;
    },
    openHandlePop() {
      this.findWarehouseByProjectId(this.details.fkBidProjectId)
      this.handleForm.serviceTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      this.handleForm.leaderName=this.user.userName
      this.handlePopShow = true;
    },
    dateSelect(e) {
      //   this.dates = e.value;
      console.log(e.value);
      this.handleForm.serviceTime = moment(e.value).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.closeDateSelect();
    },
    closeDateSelect() {
      this.dateSelectShow = false;
    },
    openDateSelect2(type){
      this.dateSelectType=type
      this.dateSelectShow2 = true;
    },
    dateSelect2(e) {
      //   this.dates = e.value;
      console.log(e.value);
      let date=moment(e.value).format( "YYYY-MM-DD HH:mm:ss" );
      if(this.dateSelectType===1){
        this.subReturnForm.serviceTime = date
      }else if(this.dateSelectType===2){
        this.subReturnForm.receiverTime=date
      }
      this.closeDateSelect2();
    },
    closeDateSelect2() {
      this.dateSelectShow2 = false;
    },
    openPicker() {
      this.pickerShow = true;
      this.pickerList=this.warehouserList
    },
    pickerConfirm(e) {
      if (e.value.length && e.value[0]) {
        this.handleForm.warehouseName = e.value[0].label;
        this.handleForm.fkWarehouseId = e.value[0].value;
      }
      this.pickerCancel()
    },
    pickerCancel() {
      this.pickerShow = false;
    },
    closeReturnPop() {
      this.returnPopShow = false;
    },
    openReturnPop() {
       if (this.user.orgType === 7) {
         this.subReturnForm.receiptAddress = this.details.receiptAddress;
       }
       let time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
       if (this.details.interfaceType === 1) {
         this.subReturnForm.serviceTime = time;
         this.returnMaterialList = this.details.detailsVoList.map(item => ({ ...item, retreatNum: item.stockNum, price: item.materialPrice }));
       } else {
         if (this.details.interfaceType !== 4) {
           this.getBusinessCode(7);
         }
         this.subReturnForm.serviceTime = time;
         this.subReturnForm.receiverTime = time;
         this.subReturnForm.leaderName = this.user.userName;
         if (this.details.interfaceType === 2) {
           if (this.details.showTabStatus !== 2) {
             this.returnMaterialList = this.details.engOrderInputInventoryReturnDetailsVos ? this.details.engOrderInputInventoryReturnDetailsVos.map(item => ({ ...item, retreatNum: item.stockNum, price: item.materialPrice, fkUnitName: item.fkUnitName ? item.fkUnitName : item.unitName })) : [];
           }
           this.afterMaterialList = this.details.engDischargeVos ? this.details.engDischargeVos.map(item => ({ ...item, retreatNum: item.type == 4 ? item.returnNum : "", fkUnitName: item.fkUnitName ? item.fkUnitName : item.unitName })) : [];
          if (this.details.showTabStatus === 2) {
             this.returnMaterialList = this.details.engOrderInputInventoryReturnDetailsVos ? this.details.engOrderInputInventoryReturnDetailsVos.map(item => ({ ...item, retreatNum: item.marginNum, price: item.materialPrice, fkUnitName: item.fkUnitName ? item.fkUnitName : item.unitName })) : [];
           }
         } else if (this.details.interfaceType === 3) {
           this.returnMaterialList = this.details.detailsVoList.map(item => ({ ...item, retreatNum: item.stockNum, price: item.materialPrice }));
           console.log(this.returnMaterialList);
         } else if (this.details.interfaceType === 4) {
           this.returnMaterialList = this.details.detailsVoList.map(item => ({ ...item, retreatNum: item.stockNum, price: item.materialPrice }));
         }
       }
      this.returnPopShow = true;
    },
    // openPop2(type,item){
    //     this.popType2=type
    //     this.nowClickMaterial=item
    //     this.popShow2=true
    // },
    closePop2(){
        this.popShow2=false
    },
    popOk2(){
      if (this.popType2 === 1) {
        if (this.details.interfaceType === 2 && this.details.showTabStatus === 2) {
          if (this.nowClickMaterial.retreatNum > this.nowClickMaterial.marginNum) {
            // this.nowClickMaterial.retreatNum = this.nowClickMaterial.marginNum;
            return uni.showToast({title:'退货数量超出可退货数量',icon:'none'})
          }
        } else {
          if (this.nowClickMaterial.retreatNum > this.nowClickMaterial.stockNum) {
            // this.nowClickMaterial.retreatNum = this.nowClickMaterial.stockNum;
            return uni.showToast({title:'退货数量超出可退货数量',icon:'none'})
          }
        }
        this.returnMaterialList.filter(item=>item.fkMaterialId===this.nowClickMaterial.fkMaterialId)[0].retreatNum=this.nowClickMaterial.retreatNum
      }else if(this.popType2 === 2){
        if (this.nowClickMaterial.retreatNum > this.nowClickMaterial.stockNum) {
          // this.nowClickMaterial.retreatNum = this.nowClickMaterial.stockNum;
          return uni.showToast({title:'退货数量超出可退货数量',icon:'none'})
        }
        this.afterMaterialList.filter(item=>item.fkMaterialId===this.nowClickMaterial.fkMaterialId)[0].retreatNum=this.nowClickMaterial.retreatNum
      }
      this.closePop2()
    },
    openDetail(item,type){
      console.log(item);
      if(this.details.interfaceType === 1){
        return
      }
      if(type===2&&item.type!=4){
        return
      }
      this.popType2=type
      this.nowClickMaterial={...item}
      this.popShow2=true
      
    },
    returnDialogOk() {
      // 未入库时(项目部和分包商公用)：1，入库单退货-项目部已入库通用退货版:2,分包商已入库退货：3
      if([0, 2].includes(this.details.showTabStatus)){
        let reg=/^1(2|3|4|5|6|7|8|9)\d{9}$/
        if(!reg.test(this.subReturnForm.driverPhone)){
          return uni.showToast({icon:'none',title:"请输入正确的手机号"})
        }
      }
      if (this.details.interfaceType === 1) {
        let data = { pkId: this.details.pkId, receiptAddress: this.subReturnForm.receiptAddress };
        if (this.user.orgType === 5) {
          data = { ...data, serviceTime: this.subReturnForm.serviceTime };
          if (!data.serviceTime) {
            return uni.showToast({title:"请填写退货时间",icon:'none'});
          }
        }
        if (this.user.orgType === 7) {
          data = {
            ...data,
            driverName: this.subReturnForm.driverName,
            driverPhone: this.subReturnForm.driverPhone,
            vehicleNum: this.subReturnForm.vehicleNum
          };
          if (!data.driverName) {
            return uni.showToast({title:"请填写司机名称",icon:'none'});
          }
          if (!data.driverPhone) {
            return uni.showToast({title:"请填写司机联系方式",icon:'none'});
          }
          if (!data.vehicleNum) {
            return uni.showToast({title:"请填写车牌号",icon:'none'});
          }
          if (this.details.signStatus) {
            data.receiverStatus =this.subReturnForm.receiverStatus
            if(this.subReturnForm.receiverStatus){
              data.receiverName = this.subReturnForm.receiverName;
              data.receiverTime = this.subReturnForm.receiverTime;
              if (!data.receiverName) {
                return uni.showToast({title:"请填写签收人",icon:'none'});
              }
              if (!data.receiverTime) {
                return uni.showToast({title:"请填写签收时间",icon:'none'});
              }
            }
          }
        }
        console.log(data);
        this.$api.retreatPutInventoryNoOut(data).then(res => {
          if (res.code === 200) {
            uni.showToast({title:"退货成功"});
            this.getDetail();
            uni.navigateBack({ delta: 1 });
            this.closeReturnDialog();
          } else {
            this.$message.error(res.msg);
          }
        });
      } else if (this.details.interfaceType === 2) {
        let data = {
          detailInputAddList: this.returnMaterialList.map(item => ({ fkDetailsId: item.pkId, retreatNum: item.retreatNum })).filter(item => item.retreatNum > 0),
          detailOutAddList: this.afterMaterialList.map(item => ({ fkDetailsId: item.pkId, retreatNum: item.retreatNum })).filter(item => item.retreatNum > 0),
          orderCode: this.subReturnForm.orderCode,
          leaderName: this.subReturnForm.leaderName,
          serviceTime: this.subReturnForm.serviceTime,
          driverName: this.subReturnForm.driverName,
          driverPhone: this.subReturnForm.driverPhone,
          vehicleNum: this.subReturnForm.vehicleNum,
          remark: this.subReturnForm.remark,
          isUpdate: this.isUpdate,
          receiptAddress: this.subReturnForm.receiptAddress
        };
        if (this.details.showTabStatus === 0) {
          delete data.detailOutAddList;
        } else if (this.details.showTabStatus === 1) {
          delete data.detailInputAddList;
        }
        if (this.details.showTabStatus !== 1) {
          if (!data.leaderName) {
            return uni.showToast({title:"请填写负责人",icon:'none'});
          }
          if (!data.serviceTime) {
            return uni.showToast({title:"请填写退货时间",icon:'none'});
          }
          if (!data.driverName) {
            return uni.showToast({title:"请填写司机名称",icon:'none'});
          }
          if (!data.driverPhone) {
            return uni.showToast({title:"请填写司机联系方式",icon:'none'});
          }
          if (!data.vehicleNum) {
            return uni.showToast({title:"请填写车牌号",icon:'none'});
          }
        }
        if (this.details.signStatus && this.details.showTabStatus !== 1) {
          data.receiverStatus =this.subReturnForm.receiverStatus
          if(this.subReturnForm.receiverStatus){
            data.receiverName = this.subReturnForm.receiverName;
            data.receiverTime = this.subReturnForm.receiverTime;
            if (!data.receiverName) {
              return uni.showToast({title:"请填写签收人",icon:'none'});
            }
            if (!data.receiverTime) {
              return uni.showToast({title:"请填写签收时间",icon:'none'});
            }
          }
        }
        if (this.details.showTabStatus === 1) {
          data = { detailOutAddList: data.detailOutAddList, receiptAddress: data.receiptAddress };
        }
        // if (this.user.orgType === 5) {
        //   data.detailOutAddList = this.afterMaterialList.map(item => ({ fkDetailsId: item.pkId, retreatNum: item.retreatNum })).filter(item => item.retreatNum > 0);
        // } else {
        // }
        this.$api.retreatPutInventoryPro(data).then(res => {
          if (res.code === 200) {
            uni.showToast({title:"退货成功"});
            this.getDetail();
            uni.navigateBack({ delta: 1 });
            this.closeReturnDialog();
          } else {
            this.$message.error(res.msg);
          }
        });
      } else if (this.details.interfaceType === 3) {
        let { driverName, driverPhone, leaderName, orderCode, receiverName, receiverTime, remark, serviceTime, vehicleNum, receiptAddress } = this.subReturnForm;
        if (!orderCode) {
          return uni.showToast({title:"请填写出库编号",icon:'none'});
        }
        if (!leaderName) {
          return uni.showToast({title:"请填写负责人",icon:'none'});
        }
        if (!serviceTime) {
          return uni.showToast({title:"请填写退货时间",icon:'none'});
        }
        if (!driverPhone) {
          return uni.showToast({title:"请填写司机联系方式",icon:'none'});
        }
        if (!driverName) {
          return uni.showToast({title:"请填写司机名称",icon:'none'});
        }
        if (!vehicleNum) {
          return uni.showToast({title:"请填写车牌号",icon:'none'});
        }
        let data = { detailListAdd: this.returnMaterialList.map(item => ({ fkDetailsId: item.pkId, retreatNum: item.retreatNum })), driverName, driverPhone, inputId:this.details.pkId, leaderName, orderCode, remark, serviceTime, vehicleNum, isUpdate: this.isUpdate, receiptAddress };
        if (this.details.signStatus) {
          data.receiverStatus =this.subReturnForm.receiverStatus
          if(this.subReturnForm.receiverStatus){
            data.receiverName = receiverName;
            data.receiverTime = receiverTime;
            if (!receiverName) {
              return uni.showToast({title:"请填写签收人",icon:'none'});
            }
            if (!receiverTime) {
              return uni.showToast({title:"请填写签收时间",icon:'none'});
            }
          }
        }
        this.$api.retreatPutInventorySub(data).then(res => {
          if (res.code === 200) {
            uni.showToast({title:"退货成功"});
            this.getDetail();
            uni.navigateBack({ delta: 1 });
            this.closeReturnDialog();
          } else {
            this.$message.error(res.msg);
          }
        });
      } else if (this.details.interfaceType === 4) {
        let { driverName, driverPhone, receiverName, receiverTime, vehicleNum, receiptAddress } = this.subReturnForm;
        if (!driverPhone) {
          return uni.showToast({title:"请填写司机联系方式",icon:'none'});
        }
        if (!driverName) {
          return uni.showToast({title:"请填写司机名称",icon:'none'});
        }
        if (!vehicleNum) {
          return uni.showToast({title:"请填写车牌号",icon:'none'});
        }
        let data = { driverName, driverPhone, pkId: this.details.pkId, vehicleNum, receiptAddress };
        if (this.details.signStatus) {
          data.receiverStatus =this.subReturnForm.receiverStatus
          if(this.subReturnForm.receiverStatus){
            data.receiverName = receiverName;
            data.receiverTime = receiverTime;
            if (!receiverName) {
              return uni.showToast({title:"请填写签收人",icon:'none'});
            }
            if (!receiverTime) {
              return uni.showToast({title:"请填写签收时间",icon:'none'});
            }
          }
        }
        this.$api.retreatPutInventoryNoInput(data).then(res => {
          if (res.code === 200) {
            uni.showToast({title:"退货成功"});
            this.getDetail();
            uni.navigateBack({ delta: 1 });
            this.closeReturnDialog();
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    numChange(e) {
      console.log(e,this.nowClickMaterial,this.popType2);
      if (this.popType2 === 1) {
        if (this.details.interfaceType === 2 && this.details.showTabStatus === 2) {
          if (this.nowClickMaterial.retreatNum > this.nowClickMaterial.marginNum) {
            this.nowClickMaterial.retreatNum = this.nowClickMaterial.marginNum;
          }
        } else {
          if (this.nowClickMaterial.retreatNum > this.nowClickMaterial.stockNum) {
            this.nowClickMaterial.retreatNum = this.nowClickMaterial.stockNum;
          }
        }
      } else if (this.popType2 === 2) {
        if (this.nowClickMaterial.retreatNum > this.nowClickMaterial.stockNum) {
          this.nowClickMaterial.retreatNum = this.nowClickMaterial.stockNum;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pad {
  height: 98rpx;
}
.pdb {
  height: 100rpx;
}
.table_height {
  /*#ifdef APP-PLUS*/
  max-height: calc(100vh - 454rpx);
  /*#endif*/
  /*#ifdef H5*/
  max-height: calc(100vh - 366rpx);
  /*#endif*/
}
.form {
  padding: 10rpx 10rpx 30rpx;
  background-color: #fff;
}
.u-form-item {
  border-bottom: 1px solid #eee;
}
.remark {
  max-height: 400rpx;
  overflow: auto;
}
.footer {
  position: fixed;
  bottom: 0;
  display: flex;
  width: 750rpx;
  height: 100rpx;
  z-index: 10;
  .btns {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 28rpx;
  }
  .green {
    background-color: #43cf7c;
  }
  .blue {
    background-color: #1576e6;
  }
  .yellow {
    background-color: #f59a23;
  }
  .red {
    background-color: #fa2020;
  }
}
.handlePop {
  width: 700rpx;
  max-height: 1000rpx;
  border-radius: 20rpx;
  .handlePop-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    padding: 0 20rpx;
  }
  .content {
    max-height: 820rpx;
    overflow: auto;
  }
  .handlePop-footer {
    display: flex;
    height: 100rpx;
    .handlePopBtns {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .primary{
      color: #fff;
       background-color: #1576e6;
    }
  }
}
.returnPopShow{
  width: 730rpx;
  height: 1000rpx;
  border-radius: 20rpx;
  .returnPop-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    padding: 0 20rpx;
  }
  .returnPop-content {
    height: 820rpx;
    overflow: auto;
  }
  .returnPop-footer {
    display: flex;
    height: 100rpx;
    .returnPopBtns {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
    .primary{
      background-color: #1576e6;
    }
    .cancle{
      background-color: #ccc;
    }
  }
}
.popup2 {
  position: relative;
  width: 750rpx;
  height: 1200rpx;
  background-color: #2a82e4;
  border-radius: 20rpx 20rpx 0 0;
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
.select {
  justify-content: space-between;
}
  .popup2-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    // line-height: 80rpx;
    padding: 0 20rpx;
    color: #fff;
    font-size: 28rpx;
  }
  .popup2-content {
    height:1020rpx;
    padding-top: 40rpx;
    overflow: auto;
    background-color: #f7f7ff;
    // padding: 0 20rpx;
    border-radius: 20rpx 20rpx 0 0;
    .popup2-content-head{
      height: 60rpx;
      line-height: 60rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      background: linear-gradient(90deg, rgba(230, 235, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)
    }
    .info-item{
      padding-bottom: 20rpx;
      .imgList{
        display: flex;
        flex-wrap: wrap;
        padding: 10rpx 20rpx;
        image{
          width: 350rpx;
          margin-bottom: 10rpx;
        }
        :nth-child(2n){
          margin-left: 10rpx;
        }
      }
    }
    .remark{
        max-height: 400rpx;
        overflow: auto;
    }
    .u-form-item{
      padding: 0 20rpx;
      border-bottom: 1px solid #eee;
    }
  }
  .pop-pdb{
    height: 100rpx;
    // background-color: #f7f7ff;
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 100rpx;
    background-color: #f7f7ff;
    .foot-btn{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80rpx;
        font-size: 28rpx;
    }
    .btns1 {
      width: 210rpx;
    }
    .btns2{
        width: 300rpx;
    }
    .cancle {
      background-color: #eeeeee;
      color: #aaaaaa;
    }
    .del{
        color: #fff;
        background-color: red;
    }
    .save{
        color: #fff;
        background-color: #2a82e4;
    }
  }
}
.mb-20{
  margin-bottom: 20rpx;
}
.popup1{
    height: 900rpx;
    .popup-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 80rpx;
        // line-height: 80rpx;
        padding: 0 20rpx;
        // color: #fff;
        font-size: 28rpx;
        .submitPop1{
            color: #2a82e4;
        }
    }
    .popup-content{
        padding: 0 20rpx;
        .search-input{
            width: 700rpx;
            padding-left: 20rpx;
            border: 1px solid #2a82e4;
            border-radius: 6rpx;
        }
    }
    .checkBoxGroup{
    overflow: auto;
    height: 740rpx;
    margin-top: 10rpx;
    }
    .checkBox{
        height: 60rpx;
        line-height: 60rpx;
        border-bottom: 1px solid #f5f5f5;
    }
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
      width: 540rpx;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 26rpx;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
    }
  }
}
</style>
