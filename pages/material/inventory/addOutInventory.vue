<template>
  <view class="wrapper addPageBg">
    <u-navbar
      leftText="新增出库单"
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
      <view v-if="current === 0">
        <view v-if="this.user.orgType==6&&form.issueCode !== 'delivery_unit'&&!form.fkOutApplyId">
          <view class="add-inputs">
          <view class="inputs-label">出库单号</view>
          <view class="inputs-content">
            <u--textarea v-model="form.orderCode" placeholder="请输入内容" autoHeight maxlength="50" border="none" :disabled="allowModify !== 0" @input="isUpdate=1"></u--textarea>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">出库对象</view>
          <view class="inputs-content select" @click="openPicker(1)">
            <view class="name">{{outIsscodeList[form.issueCode]}}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view v-if="user.orgType === 6 && form.issueCode !== 'delivery_unit' " class="add-inputs">
          <view class="inputs-label">供货申请单</view>
          <view class="inputs-content select" @click="openPicker(5)">
            <view class="name">{{fkOutApplyId.orderCode}}</view>
            <u-icon
              :key="form.issueCode"
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        </view>
        <view v-else class="add-inputs">
        <view class="add-inputs">
          <view class="inputs-label">出库单号</view>
          <view class="inputs-content">
            <u--textarea v-model="form.orderCode" placeholder="请输入内容" autoHeight maxlength="50" border="none" :disabled="allowModify !== 0" @input="isUpdate=1"></u--textarea>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">出库对象</view>
          <view class="inputs-content select" @click="openPicker(1)">
            <view class="name">{{outIsscodeList[form.issueCode]}}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view v-if=" user.orgType === 6 && form.issueCode !== 'delivery_unit' " class="add-inputs">
          <view class="inputs-label">供货申请单</view>
          <view class="inputs-content select" @click="openPicker(5)">
            <view class="name">{{fkOutApplyId.orderCode}}</view>
            <u-icon
              :key="form.issueCode"
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view v-if="[6, 7].includes(user.orgType) && form.issueCode !== 'delivery_unit'" class="add-inputs">
          <view class="inputs-label">标段项目</view>
          <view class="inputs-content select" @click="openPicker(7)">
            <view class="name">{{form.projectName}}</view>
            <u-icon
              :name="[6].includes(user.orgType) && form.issueCode !== 'delivery_unit'?'lock':'arrow-down-fill'"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">出库仓库</view>
          <view class="inputs-content select" @click="openPicker(2)">
            <view class="name">{{form.warehouseName}}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view v-if="form.issueCode === 'delivery_subcontract'" class="add-inputs">
          <view class="inputs-label">分包商</view>
          <view class="inputs-content select" @click="openPicker(3)">
            <view class="name">{{form.customerName}}</view>
            <u-icon
              :name="[6].includes(user.orgType) && form.issueCode !== 'delivery_unit'?'lock':'arrow-down-fill'"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view v-if="form.issueCode === 'delivery_supplier'" class="add-inputs">
          <view class="inputs-label">供应商</view>
          <view class="inputs-content select" @click="openPicker(4)">
            <view class="name">{{form.customerName}}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view v-if="form.issueCode === 'delivery_position'" class="add-inputs">
          <view class="inputs-label">分项工程</view>
          <view class="inputs-content select" @click="openTree">
            <view class="name">{{ fkItemName }}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view v-if=" [4, 5].includes(user.orgType) " class="add-inputs">
          <view class="inputs-label">关联发料单</view>
          <view class="inputs-content select" @click="openPicker(6)">
            <view class="name">{{fkOrdinaryId.length?fkOrdinaryId[0].label:''}}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view v-if=" user.orgType === 6 && form.issueCode !== 'delivery_unit' " class="add-inputs">
          <view class="inputs-label">关联采购计划单</view>
          <view class="inputs-content select">
            <view class="name">{{fkPurchaseId.orderCode}}</view>
            <u-icon
              name="lock"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view v-if="[4, 5,7].includes(user.orgType)" class="add-inputs">
          <view class="inputs-label">关联入库单</view>
          <view class="inputs-fileList" >
            <view v-if="fkInputIdList.length">
            <view
              class="inputs-fileList-item"
              v-for="(item, idx) in fkInputIdList"
              :key="idx"
            >
              <u-icon name="file-text" size="20"></u-icon>
              <view class="name">{{ item.orderCode }}</view>
              <view class="close" @click="delSub(item, idx,2)" v-if="!form.fkOrdinaryId"></view>
              <!-- <u-icon
              v-if="!form.fkOrdinaryId"
                name="close"
                color="red"
                class="delBtn"
                size="20"
                @click="delSub(item, idx,2)"
              ></u-icon> -->
            </view>
            </view>
            <view class="fileListBtn" v-if="!form.fkOrdinaryId">
              <view class="addBtn" @click="addOrderBtn(2)">添加</view>
            </view>
          <view v-if="!fkInputIdList.length&&form.fkOrdinaryId" class="emptys">无</view>
          </view>
          
          <!-- <view class="addSubBtn" v-if="!form.fkOrdinaryId">
            <view class="btns" @click="addOrderBtn(2)"> 添加 </view>
          </view> -->
        </view>
        <view v-if="[4, 5].includes(user.orgType) && form.issueCode === 'delivery_subcontract'" class="add-inputs">
          <view class="inputs-label">关联申请单</view>
          <view class="inputs-fileList">
            <view v-if="fkApplyIdList.length">
              <view
              class="inputs-fileList-item"
              v-for="(item, idx) in fkApplyIdList"
              :key="idx"
            >
              <u-icon name="file-text" size="20"></u-icon>
              <view class="name">{{ item.orderCode }}</view>
              <view class="close" @click="delSub(item, idx,3)" v-if="!form.fkOrdinaryId"></view>
              <!-- <u-icon
              v-if="!form.fkOrdinaryId"
                name="trash"
                class="delBtn"
                size="20"
                @click="delSub(item, idx,3)"
              ></u-icon> -->
              </view>
            </view>
            <view class="fileListBtn" v-if="!form.fkOrdinaryId">
              <view class="addBtn" @click="addOrderBtn(3)">添加</view>
            </view>
            <view v-if="!fkApplyIdList.length&&form.fkOrdinaryId" class="emptys">无</view>
          </view>
          
        </view>
        <!-- <view class="add-inputs">
          <view class="inputs-label">负责人</view>
          <view class="inputs">
            <u--input
              v-model="form.leaderName"
              border="none"
              clearable
            ></u--input>
          </view>
        </view> -->
        <view class="add-inputs">
          <view class="inputs-label">业务时间</view>
          <view class="inputs-content select" @click="openDateSelect(1,form.serviceTime)">
            <view class="name">{{form.serviceTime}}</view>
            <u-icon
              name="calendar"
              class="icons"
              color="#2a82e4"
              size="16"
            ></u-icon>
          </view>
        </view>
         <view class="add-inputs">
            <view class="inputs-label">收料地址</view>
            <view class="inputs-content">
              <u--textarea v-model="form.receiptAddress" placeholder="请输入内容" autoHeight maxlength="100" border="none"></u--textarea>
            </view>
          </view>
        <view class="add-inputs">
          <view class="inputs-label">备注</view>
          <view class="inputs-content">
            <u--textarea v-model="form.remark" placeholder="请输入内容" autoHeight maxlength="100" border="none"></u--textarea>
          </view>
        </view>
        <view >
            <view class="add-inputs">
                <view class="inputs-label">车牌号</view>
                <view class="inputs-content">
                  <u--textarea v-model="form.vehicleNum" placeholder="请输入内容" autoHeight maxlength="25" border="none"></u--textarea>
                </view>
            </view>
            <view class="add-inputs">
                <view class="inputs-label">运输司机</view>
                <view class="inputs-content">
                  <u--textarea v-model="form.driverName" placeholder="请输入内容" autoHeight maxlength="50" border="none"></u--textarea>
                </view>
            </view>
            <view class="add-inputs">
                <view class="inputs-label">联系方式</view>
                <view class="inputs-content">
                  <u--input v-model="form.driverPhone" border="none" placeholder="请输入内容" maxlength="11" type="number"></u--input>
                </view>
            </view>
            <view v-if="timeShow" class="add-inputs">
                <view class="inputs-label">签收状态</view>
                <view class="inputs-content">
                 <u-radio-group v-model="form.receiverStatus">
                	<u-radio label="待签收" :name='0'></u-radio>
                	<u-radio label="已签收" :name='1'></u-radio>
                </u-radio-group>
                </view>
            </view>
            <view v-if="form.receiverStatus === 1" class="add-inputs">
              <view class="inputs-label">签收人</view>
              <view class="inputs-content">
                <u--textarea v-model="form.receiverName" placeholder="请输入内容" autoHeight border="none"></u--textarea>
              </view>
            </view>
            <view v-if="form.receiverStatus === 1" class="add-inputs">
              <view class="inputs-label">签收时间</view>
              <view class="inputs-content select" @click="openDateSelect(2,form.receiverTime)">
                <view class="name">{{form.receiverTime}}</view>
                <u-icon
                  name="calendar"
                  class="icons"
                  color="#2a82e4"
                  size="16"
                ></u-icon>
              </view>
            </view>
        </view>
        <view class="formBtns">
          <view class="next" @click="next">下一步</view>
        </view>
        </view>
      </view>
      <view v-if="current === 1">
        <view class="table_detail table_height">
          <table v-if="list.length">
            <thead>
              <tr>
                <th>序号</th>
                <th>物料名称</th>
                <th>物料分类</th>
                <th>检测状态</th>
                <th v-if="user.orgType!=6">供应商</th>
                <th>单位</th>
                <th>当前库存量</th>
                <th v-if="user.orgType==6&&form.issueCode !== 'delivery_unit'">申请数量</th>
                <th v-if="user.orgType==6&&form.issueCode !== 'delivery_unit'">已供数量</th>
                <th>本次出库数量</th>
                <th>物料单价</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list" :key="index">
                <td><text class="clickTd" @click="openPop2(2,item,index)">{{ index + 1 }}</text></td>
                <td>{{ item.materialName }}</td>
                <td>{{ item.fkTypeName }}</td>
                <td>{{ item.passStatus === 0 ? "合格" : item.passStatus === 1 ? "不合格" : item.passStatus === 2 ? "待检测" : "" }}</td>
                <td v-if="user.orgType!=6">{{ item.fkCustomerId === "0" ? "无" : item.customerName }}</td>
                <td>{{ item.fkUnitName }}</td>
                <td>{{ item.supplyNum }}</td>
                <td v-if="user.orgType==6&&form.issueCode !== 'delivery_unit'">{{ item.applyNum }}</td>
                <td v-if="user.orgType==6&&form.issueCode !== 'delivery_unit'">{{ item.applyProvidedNum }}</td>
                <td>{{ item.stockNum }}</td>
                <td>{{ item.materialPrice }}</td>
              </tr>
            </tbody>
          </table>
        </view>
        
        <view class="addMatBtn" v-if="!form.fkOrdinaryId && !form.fkInputIdList.length && !form.fkOutApplyId&&!([6].includes(user.orgType) && form.issueCode !== 'delivery_unit')">
          <view class="btns" @click="addMatBtn"> 添加物料 </view>
        </view>
        <view class="formBtns">
          <view class="last" @click="last">上一步</view>
        </view>
      </view>
    </view>
    <view class="pdb"></view>
    <view class="footer">
        <view class="btns saveBtn" @click="btnOk(0)">保存草稿</view>
        <view class="btns submitBtn" @click="btnOk(1)">直接提交</view>
    </view>
    <u-datetime-picker
      :show="dateSelectShow"
      v-model="dates"
      mode="datetime"
      @confirm="dateSelect"
      @cancel="closeDateSelect"
    ></u-datetime-picker>
    <u-picker title="请选择" :show="pickerShow" :columns="[pickerList]" keyName="label" @confirm="pickerConfirm" @cancel="pickerCancel" :key="pickerType"></u-picker>
    <u-popup :show="popShow" @close='closePop1'>
        <view class="popup1">
            <view class="popup-header">
            <view class="name">选择{{addType===1?'关联采购计划单':addType===2?'关联入库单':addType===3?'关联申请单':''}}</view>
            <view class="submitPop1" @click="submitPop1">确认</view>
            </view>
            <view class="popup-content">
                <view class="search-input">
                    <u-input
                      placeholder="请输入单据编号"
                      border="none"
                      v-model="searchOrder"
                       maxlength="50"
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
                        :disabled='addType===2&&deliveryDisabled === 0 ? false : deliveryDisabled === 1 ? item.isMultiple !== 0 : deliveryDisabled === 2 ? fkInputIdList[0].pkId !== item.pkId : false'
                    >
                </u-checkbox>
                </u-checkbox-group>
            </view>
        </view>
	</u-popup>
    <u-popup :show="popShow2" :round="20">
        <view class="popup2">
        <view class="popup2-head">
          <view class="name">{{popTitle2}}</view>
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
                <view class="inputs select" @click="materialSearch">
                  <view class="name">{{nowMaterial.materialName}}</view>
                  <u-icon
                    :name="!form.fkOrdinaryId && !form.fkInputIdList.length && !form.fkPurchaseId?'arrow-down-fill':'lock'"
                    class="icons"
                    color="#2a82e4"
                    :size="!form.fkOrdinaryId && !form.fkInputIdList.length && !form.fkPurchaseId?'12':'16'"
                  ></u-icon>
                </view>
            </view>
            <view>
                <view class="title">供应商</view>
                <view class="inputs select">
                  <view class="name">{{nowMaterial.fkCustomerId === "0" ? "无" : nowMaterial.customerName}}</view>
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
                  <view class="name">{{nowMaterial.fkUnitName}}</view>
                  <u-icon
                    name="lock"
                    class="icons"
                    color="#2a82e4"
                    size="16"
                  ></u-icon>
                </view>
            </view>
            <view>
                <view class="title">当前库存</view>
                <view class="inputs select">
                  <view class="name">{{nowMaterial.supplyNum}}</view>
                  <u-icon
                    name="lock"
                    class="icons"
                    color="#2a82e4"
                    size="16"
                  ></u-icon>
                </view>
            </view>
            <view v-if="user.orgType==6&&form.issueCode !== 'delivery_unit'">
                <view class="title">申请供应数量</view>
                <view class="inputs select">
                  <view class="name">{{nowMaterial.applyNum}}</view>
                  <u-icon
                    name="lock"
                    class="icons"
                    color="#2a82e4"
                    size="16"
                  ></u-icon>
                </view>
            </view>
            <view v-if="user.orgType==6&&form.issueCode !== 'delivery_unit'">
                <view class="title">已供数量</view>
                <view class="inputs select">
                  <view class="name">{{nowMaterial.applyProvidedNum}}</view>
                  <u-icon
                    name="lock"
                    class="icons"
                    color="#2a82e4"
                    size="16"
                  ></u-icon>
                </view>
            </view>
            <view>
              <view class="title">出库数量</view>
              <view class="inputs">
                <u-input
                  type='number'
                  v-model="nowMaterial.stockNum"
                  border="none"
                ></u-input>
              </view>
            </view>
            <view>
              <view class="title">物料单价</view>
              <view class="inputs" v-if="menuCodeData.states == 1">
                <u--input
                type='number'
                  v-model="nowMaterial.materialPrice"
                  border="none"
                  clearable
                  :disabled="menuCodeData.states != 1"
                ></u--input>
              </view>
              <view class="inputs select" v-else>
              <view class="name">{{ nowMaterial.materialPrice }}</view>
              <u-icon name="lock" class="icons" color="#2a82e4" size="16"></u-icon>
            </view>
            </view>
        </view>
        <view class="pop-pdb"></view>
        <view class="footer">
            <view class="foot-btn cancle" :class="{btns2:popType2===1||(popType2===2&&!(!form.fkInputIdList.length&&!form.fkOrdinaryId&&!form.fkOutApplyId)),btns1:popType2===2&&!form.fkInputIdList.length&&!form.fkOrdinaryId&&!form.fkOutApplyId}" @click="closePop2">取消</view>
            <view class="foot-btn btns1 del" v-if="popType2===2&&!form.fkInputIdList.length&&!form.fkOrdinaryId&&!form.fkOutApplyId" @click="delMaterial">删除</view>
            <view class="foot-btn save" :class="{btns2:popType2===1||(popType2===2&&!(!form.fkInputIdList.length&&!form.fkOrdinaryId&&!form.fkOutApplyId)),btns1:popType2===2&&!form.fkInputIdList.length&&!form.fkOrdinaryId&&!form.fkOutApplyId}" @click="saveMaterial">保存</view>
        </view>
      </view>
      <materialSelect :treeData="treeData" ref="materialSelect" @checked="checked" @search="materSearch"></materialSelect>
    </u-popup>
    <tki-tree ref="tkitree" :range="itemList" :selectParent="false" :rangeKey="rangeKey" :children="'children'" confirmColor="#4e8af7" @confirm="treeConfirm" />
  </view>
</template>

<script>
import moment from "moment";
import tkiTree from "@/components/tki-tree/tki-tree.vue";
import materialSelect from "@/components/material-select/material-select.vue";
export default {
  components:{tkiTree,materialSelect},
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  onShow() {
    console.log(this.user);
  },
  data() {
    return {
      tabList: [{ name: "出库信息" }, { name: "物料信息" }],
      current: 0,
      form: {
        customerName: "",
        driverName: "",
        driverPhone: "",
        fkApplyIdList: [],
        fkBidProjectId: "",
        fkCustomerId: "",
        fkInputIdList: [],
        fkItemId: "",
        fkOrdinaryId: "",
        fkPurchaseId: "",
        fkWarehouseId: "",
        inventoryCode: "",
        issueCode: "delivery_unit",
        leaderName: "",
        orderCode: "",
        remark: "",
        serviceTime: "",
        vehicleNum: "",
        receiverStatus: 0,
        fkOutApplyId:""
      },
      list: [],
      orderList: [],
      fkOrdinaryId:[{value:'',label:'无'}],
      fkPurchaseId:{orderCode:""},
      fkApplyIdList:[],
      fkInputIdList:[],
      dates: 0,
      dateSelectShow: false,
      maxlength: 1000,
      allowModify: 0,
      isUpdate:0,
      subSelShow: false,
      timeShow:true,
      outIsscodeList: { delivery_unit:'无', delivery_supplier:'供应商', delivery_subcontract:'分包商', delivery_project:'项目部', delivery_position:'施工部位' },
      pickerList:[],
      pickerType:1,
      pickerShow: false,
      outObjectList:[],
      supSubOptions:[],
      warehouserList:[],
      supOptions:[],
      subOptions:[],
      proOptions:[],
      itemList:[],
      rangeKey:'itemName',
      supplyCustomer:'',
      popShow:false,
      searchOrder:'',
      checkList:[],
      linkSendList:[{value:'',label:'无'}],
      ordersList:[],
      applyList:[],
      planBuyList:[{value:'',label:'无'}],
      popShow2:false,
      popTitle2:'新增物料',
      popType2:1,
      nowMaterial:{},
      addType:1,
      treeData: [], // 物料选择树形数据
      nowIndex:0,
      deliveryDisabled:0,
      materialIds:[],
      fkOutApplyId:{},
      supAppList:[],
      fkItemName:"",
      menuCodeData:{}
    };
  },
  onLoad(options) {
    console.log(options);
    if(options.type==1){
        this.getBusinessCode()
        let now=new Date()
        this.form.serviceTime = moment(now).format("YYYY-MM-DD HH:mm:ss");
        this.form.leaderName=this.user.userName
        this.form.receiverTime=moment(now).format("YYYY-MM-DD HH:mm:ss");
        this.form.receiverName=this.user.userName
    }else if(options.type==2){
        let obj=JSON.parse(options.obj)
        this.form=obj
        this.list=obj.orderDetailsList?obj.orderDetailsList.map(item=>({...item,fkUnitName:item.unitName})):[]
        this.findOrderOrdinaryByWarehouseId("", this.form.fkOrdinaryId);
        if(this.user.orgType===6&&obj.issueCode !== "delivery_unit"){
           let arr5=obj.orderRelationList.filter(item => item.orderType == 6);
           this.fkOutApplyId=arr5.length ? arr5[0] : {pkId:""};
           this.form.fkOutApplyId=arr5.length ? arr5[0].pkId : "";
         }
         let arr1 = obj.orderRelationList.filter(item => item.orderType == 2); //物资申请单
          let arr2 = obj.orderRelationList.filter(item => item.orderType == 3); // 入库单
          let arr3 = obj.orderRelationList.filter(item => item.orderType == 1); // 采购计划单
          let arr4 = obj.orderRelationList.filter(item => item.orderType == 4); // 发料单
          this.fkApplyIdList = arr1;
          this.fkInputIdList = arr2;
          this.fkPurchaseId = arr3.length ? arr3[0] : "";
          this.fkOrdinaryId = arr4.length ? arr4[0] : "";
          this.form.fkApplyIdList = arr1.length ? arr1.map(item => item.pkId) : [];
            this.form.fkInputIdList = arr2.length ? arr2.map(item => item.pkId) : [];
            this.form.fkPurchaseId = arr3.length ? arr3[0].pkId : "";
            this.form.fkOrdinaryId = arr4.length ? arr4[0].pkId : "";
            if (["delivery_unit", "delivery_position"].includes(obj.issueCode)) {
              this.timeShow = true;
            } else {
              this.timeShow = false;
            }
            if ([5, 7].includes(this.user.orgType)) {
              this.findWarehouseByProjectId(this.form.fkBidProjectId);
              this.findOrderOrdinaryByWarehouseId("", this.form.fkOrdinaryId);
              this.findOrderInputByWarehouseId( "", this.form.fkInputIdList);
              // if (this.user.orgType === 5) {
              //   if (obj.issueCode === "delivery_subcontract") {
              //     this.getOrderApply(this.form.fkCustomerId, "", this.form.fkApplyIdList, this.form.fkInputIdList);
              //   }
              // }
            } else if (this.user.orgType === 6) {
              // if (obj.issueCode !== "delivery_unit") {
              //   this.findPurchaseOrderByProjectId(this.form.fkBidProjectId, this.form.fkWarehouseId, this.form.fkCustomerId, this.form.fkPurchaseId);
              // }
              if (obj.issueCode !== "delivery_unit") {
                this.findOrderOutApplyBySource()
                this.searchOrderOutApply(true)
              }
            }
            if (obj.issueCode === "delivery_position") {
              this.fkItemName = obj.orderItemList && obj.orderItemList.length ? obj.orderItemList[0].itemName : ""
              this.form.fkItemId = res.data.orderItemList ? res.data.orderItemList[0].fkItemId : "";
              this.searchItemsByProjectId(this.form.fkBidProjectId, 2);
            }
    }
    this.dates = Number(new Date());
    this.$store.dispatch("getDictionariesData", 26).then(res => {
          this.outObjectList = res.map(item => ({ ...item, value: item.keyName, label: item.keyVal }));
        });
    this.findProjectListByType(this.form.issueCode)
    if (this.user.orgType === 7) {
      this.findWarehouseByProjectId("0");
    }else{
        this.findWarehouseByProjectId("");
    }
  },
  methods: {
    searchMenuDataAuthorize() {
      this.$api.searchMenuDataAuthorize().then((res) => {
        if (res.code == 200) {
          res.data.forEach((element) => {
            if (element.menuCode == "updatePrice") {
              this.menuCodeData = element;
            }
          });
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    // stockNumInput(e){
    //   if(this.user.orgType===6&&this.form.issueCode!='delivery_unit'){
    //     console.log(this.nowMaterial.stockNum,e);
    //    let max = this.nowMaterial.supplyNum-this.nowMaterial.providedNum
    //     this.nowMaterial.stockNum=this.$limitInputNumber(e,max,0,6)
    //   }else{
    //     this.nowMaterial.stockNum=this.$limitInputNumber(e,this.nowMaterial.supplyNum,0,6)
    //   }
    // },
    getBusinessCode() {
      this.$api.getBusinessCode({ businessType: 7 }).then((res) => {
        if (res.code === 200) {
          this.form.orderCode = res.data.typeCode;
          this.maxlength = res.data.limitNum;
          this.allowModify = res.data.allowModify;
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    findProjectListByType(accessCode){
        let data={
            accessType:1,
            accessCode
        }
        console.log(data);
        this.$api.findProjectListByType(data).then(res=>{
            if(res.code===200){
                this.proOptions=res.data.map(item => ({ ...item, value: item.pkId, label: item.projectName }));
                if(this.user.orgType===5&&this.proOptions.length){
                    this.searchProjCustomByType(3)
                    this.searchProjCustomByType(4)
                }
            }else{
                uni.showToast({ title: res.msg, icon: "none" });
            }
        })
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
    searchProjCustomByType(customType){
        let data={
            bidProjectId:this.user.orgType === 5?this.proOptions[0].pkId:this.form.fkBidProjectId,
            customType,
            isZero:0,
            sourceType:1
        }
        this.$api.searchProjCustomByType(data).then(res=>{
            if(res.code===200){
                let arr = res.data.map(item => ({ ...item, value: item.pkId, label: item.customName }));
                 if (customType === 3) {
                    this.supOptions = arr;
                }else if(customType === 4){
                    this.subOptions = arr;
                }
            }else{
                 uni.showToast({ title: res.msg, icon: "none" });
            }
        })
    },
    // 采购计划单
    findPurchaseOrderByProjectId(fkBidProjectId, fkWarehouseId, fkCustomerId, purchaseIds, orderCode) {
      let data = { pageNum: 1, pageSize: 20, fkBidProjectId, fkWarehouseId, fkCustomerId, purchaseIds, orderCode };
      if (this.form.issueCode === "delivery_project") {
        delete data.fkCustomerId;
      }
      this.$api
        .findPurchaseOrderByProjectId(data)
        .then(res => {
          if (res.code === 200) {
            let arr= res.data.map(item => ({ ...item, value: item.pkId, label: item.orderCode }));
            this.planBuyList =[{value:'',label:'无'},...arr]
          } else {
            this.$message.error(res.msg);
          }
        })
    },
    // 物资供货申请单
    findOrderOutApplyBySource(orderCode) {
      let data = { pageNum: 1, pageSize: 20,issueCode:this.form.issueCode,applyIds:this.form.fkOutApplyId, orderCode };
      this.$api
        .findOrderOutApplyBySource(data)
        .then(res => {
          if (res.code === 200) {
            let arr= res.data.map(item => ({ ...item, value: item.pkId, label: item.orderCode }));
            this.supAppList =arr
          } else {
            this.$message.error(res.msg);
          }
        })
    },
    findOrderOrdinaryByWarehouseId(orderCode, ordinaryIds){
      let data = { pageNum: 1, pageSize: 20, fkWarehouseId:this.form.fkWarehouseId, typeCode:this.form.issueCode, fkCustomerId:this.form.fkCustomerId, orderCode, ordinaryIds };
      this.$api.findOrderOrdinaryByWarehouseId(data).then(res=>{
        if(res.code===200){
          let arr= res.data.map(item => ({ ...item, value: item.pkId, label: item.orderCode }));
          this.linkSendList =[{value:'',label:'无'},...arr]
        }else{
            uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    findOrderInputByWarehouseId(inputIds,orderCode){
      let data={
            pageNum:1,
            pageSize:20,
            fkWarehouseId:this.form.fkWarehouseId,
            issueCode:this.form.issueCode,
            fkCustomerId:this.form.fkCustomerId,
            fkBidProjectId:this.form.fkBidProjectId,
            inputIds,orderCode
        }
        if (data.issueCode === "delivery_position") {
          data.fkItemId = this.form.fkItemId;
        }
      this.$api.findOrderInputByWarehouseId(data).then(res=>{
        if(res.code===200){
          this.ordersList=res.data
        }else{
            uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    findOrderApplyByCustomerId(orderCode,applyIds,inputIds){
      let customerType = this.form.issueCode === "delivery_subcontract" ? 4 : 3;
      let data={
             pageNum: 1, pageSize: 20, customerType, fkCustomerId:this.form.fkCustomerId, orderCode,applyIds,inputIds
        }
        this.$api.findOrderApplyByCustomerId(data).then(res=>{
          if(res.code==200){
            this.applyList = res.data;
            this.ordersList=res.data
          }else{
            uni.showToast({title:res.msg,icon:'none'})
          }
        })
    },
    materialSearch() {
			this.selectMaterial(); // 获取物料树形选择数据
			this.$refs.materialSelect.selectShow = true;
		},
    materSearch(e){
      console.log(e);
      this.selectMaterial(e)
    },
    selectMaterial(materialName) {
			let data = {
				pageNum: 1,
				pageSize: 100,
				type: 3, // 1合同，2仓库  3出入库  4 盘点单
				fkCustomId: ["delivery_supplier", "delivery_subcontract"].includes(this.form.issueCode)?this.form.fkCustomerId:'0',
        fkWarehouseId:this.form.fkWarehouseId,
        outTypeCode:this.form.issueCode,
        materialIds: this.materialIds.join(","),
        materialTypeCode:this.list.length?this.list[0].typeCode:""
			};
      if(materialName){
        data.materialName=materialName
      }
      if ([6, 7].includes(this.user.orgType)) {
        if (data.outTypeCode !== "delivery_unit") {
             data.fkBidProjectId = this.form.fkBidProjectId;
             if (data.outTypeCode === "delivery_position") {
               data.fkItemId = this.form.fkItemId;
             }
           }
      }
			this.$api.searchMaterialPage(data).then(res => {
				if (res.code == 200) {
					this.treeData = res.data;
				} else {
					uni.showToast({ icon: "none", title: res.msg });
				}
			});
		},
    // 物资选中回调
		checked(item) {
      if (this.list.filter(mater => mater.fkMaterialId === item.pkId && item.fkCustomerId === mater.fkCustomerId && item.passStatus === mater.passStatus).length) {
          return uni.showToast({title:"该物料已经存在出库物料表中",icon:'none'});
        }
      if(this.list.length&&this.list[0].typeCode!=item.typeCode){
        return uni.showToast({title:"该物料类型与已添加物料类型不一致",icon:"none"})
      }
			console.log(item);
			// this.nowMaterial = item;
      this.$set(this.nowMaterial, "fkMaterialId", item.pkId);
      this.$set(this.nowMaterial, "materialName", item.materialName);
      this.$set(this.nowMaterial, "fkUnitName", item.fkUnitName);
      this.$set(this.nowMaterial, "fkTypeName", item.fkTypeName);
      this.$set(this.nowMaterial, "passStatus", item.passStatus);
      this.$set(this.nowMaterial, "fkCustomerId", item.fkCustomerId);
      this.$set(this.nowMaterial, "customerName", item.customerName);
      if (this.user.orgType === 5) {
        this.$set(this.nowMaterial, "supplyNum", item.sureNum);
      } else {
        this.$set(this.nowMaterial, "supplyNum", item.supplyNum);
      }
      // this.$set(this.nowMaterial, "supplyNum", item.supplyNum);
      this.$set(this.nowMaterial, "purchaseNum", item.supplyNum);
      this.$set(this.nowMaterial, "typeCode", item.typeCode);
      this.$set(this.nowMaterial, "stockNum", "");
      this.$set(this.nowMaterial, "materialPrice", item.price);
      if (this.user.orgType === 5) {
        this.$set(this.nowMaterial, "price", item.price);
        this.$set(this.nowMaterial, "validNum", item.validNum);
        this.$set(this.nowMaterial, "bool", item.bool);
        this.$set(this.nowMaterial, "providedNum", item.providedNum ? item.providedNum : 0);
      }
		},
    searchItemsByProjectId(){
        let data={
            projectId:this.user.orgType===5?'':this.form.fkBidProjectId,
            filterStatus:1,
            isOut:1
        }
        if(this.user.orgType !== 7){
        delete data.filterStatus
        delete data.isOut
      }
        this.$api.searchItemsByProjectId(data).then(res=>{
            if(res.code===200){
                this.itemList=res.data
            }else{
                uni.showToast({ title: res.msg, icon: "none" });
            }
        })
    },
    checkboxChange(e){
        console.log(e);
        if(this.addType===2){
          if(e.length){
            this.ordersList.forEach(item=>{
              if(e.includes(item.pkId)&&item.isMultiple === 0){
                this.deliveryDisabled = 1;
              }else if(e.includes(item.pkId)&&item.isMultiple === 1){
                this.deliveryDisabled = 2;
              }
            })
          }else{
            this.deliveryDisabled = 0
          }
        }
    },
    currentChange(e) {
      this.current = e.index;
    },
    addOrderBtn(type) {
      this.addType=type
        if(type===1){
          
        }else if(type===2){
          if(!this.form.fkWarehouseId){
           return uni.showToast({title: '请先选择仓库', icon: "none"})
        }
        if(this.user.orgType!==5&&this.form.issueCode!='delivery_unit'&&!this.form.fkBidProjectId){
           return uni.showToast({title: '请先选择标段项目', icon: "none"})
        }
        if (this.form.issueCode === "delivery_position"&&!this.form.fkItemId) {
          return uni.showToast({title: '请先选择分项工程', icon: "none"})
        }
        this.findOrderInputByWarehouseId(this.form.fkInputIdList?this.form.fkInputIdList.join(','):'','')
        this.checkList=this.form.fkInputIdList
        }else if(type===3){
          if(!this.form.fkCustomerId){
            return uni.showToast({title: '请先选择分包商', icon: "none"})
          }
          let str1=this.form.fkApplyIdList?this.form.fkApplyIdList.join(','):''
          let str2=this.form.fkInputIdList?this.form.fkInputIdList.join(','):''
          this.findOrderApplyByCustomerId('',str1,str2)
           this.checkList=this.form.fkApplyIdList?this.form.fkApplyIdList:[]
        }
        this.openPop1()
    },
    delSub(item, idx,type) {
      if(type===1){
        this.fkPurchaseId.splice(idx, 1)
        this.form.fkPurchaseId=this.fkPurchaseId.map(item=>item.pkId)
      }else if(type===2){
        this.fkInputIdList.splice(idx, 1);
        this.form.fkInputIdList=this.fkInputIdList.map(item=>item.pkId)
        let arr1 = [];
      let arr2 = [];
      this.fkInputIdList.forEach(item=>{
        item.materialVos.forEach(item2=>{
         arr1.push(item2);
        })
      })
      for (let i = 0; i < arr1.length; i++) {
        let flag = true;
        for (let j = 0; j < arr2.length; j++) {
          if (arr1[i].pkId === arr2[j].fkMaterialId && arr1[i].fkCustomerId === arr2[j].fkCustomerId) {
            // arr2[j].stockNum += arr1[i].issueNum;
            if (new Date(arr2[j].createTime) < new Date(arr1[i].createTime)) {
              arr2[j].materialPrice = arr1[i].price;
            }
            flag = false;
          }
        }
        if (flag) {
          arr2.push({
            materialPrice: arr1[i].price,
            stockNum: arr1[i].issueNum,
            fkMaterialId: arr1[i].pkId,
            materialName: arr1[i].materialName,
            fkTypeName: arr1[i].fkTypeName,
            fkUnitName: arr1[i].fkUnitName,
            supplyNum: arr1[i].supplyNum,
            purchaseNum: arr1[i].issueNum,
            fkCustomerId: arr1[i].fkCustomerId,
            passStatus: arr1[i].passStatus,
            customerName: arr1[i].customerName,
            createTime: arr1[i].createTime
          });
        }
      }
      this.list = arr2;
      }else if(type===3){
        this.fkApplyIdList.splice(idx, 1);
        this.form.fkApplyIdList=this.fkApplyIdList.map(item=>item.pkId)
      }
    },
    next() {
      this.current = 1;
    },
    last() {
      this.current = 0;
    },
    btnOk(type){
        let materList = this.list
        console.log(materList,this.list,!materList.length);
      if (!materList.length) {
        return uni.showToast({title:"出库物料不能为空",icon:'none'});
      }
      let arr =materList.filter(item=>!item.stockNum)
      if(arr.length){
         return uni.showToast({title:`物料${arr[0].materialName}出库数量不能为0`,icon:'none'});
      }
      let data = { ...this.form, inventoryCode: type, isUpdate: this.isUpdate };
      if (!data.orderCode) {
        return uni.showToast({title:"请填写入库单号",icon:'none'});
      }
      if (!data.fkWarehouseId) {
        return uni.showToast({title:"请选择仓库",icon:'none'});
      }
      if (!data.leaderName) {
        return uni.showToast({title:"请填写负责人",icon:'none'});
      }
      if (!data.serviceTime) {
        return uni.showToast({title:"请选择业务时间",icon:'none'});
      }
      if (!data.receiptAddress) {
        return uni.showToast({title:"请填写收货地址",icon:'none'});
      }
      let reg =/^1(2|3|4|5|6|7|8|9)\d{9}$/
      if(!reg.test(data.driverPhone)){
        return uni.showToast({icon:'none',title:"请输入正确的手机号"})
      }
      if (!this.form.pkId) {
        data.detailListAdd = materList.filter(item => item.stockNum);
      } else {
        data.detailUpdateList = materList.filter(item => item.stockNum);
      }
      if (this.user.orgType === 5 || (this.user.orgType !== 5 && data.issueCode === "delivery_unit")) {
        delete data.fkBidProjectId;
      } else {
        if (!data.fkBidProjectId) {
          return uni.showToast({title:"请选择标段项目",icon:'none'});
        }
      }
      if (["delivery_supplier", "delivery_subcontract"].includes(data.issueCode) && !data.fkCustomerId) {
        return uni.showToast({title:"请选择客户",icon:'none'});
      }
      if (this.timeShow && data.receiverStatus === 1) {
        if (!data.receiverName) {
          return uni.showToast({title:"请输入签收人",icon:'none'});
        }
        if (!data.receiverTime) {
          return uni.showToast({title:"请输入签收时间",icon:'none'});
        }
      }
      if (data.issueCode !== "delivery_subcontract") {
        delete data.fkApplyIdList;
      }
      if (data.issueCode !== "delivery_position") {
        delete data.fkItemId;
      } else {
        if (!data.fkItemId) {
          return uni.showToast({title:"请选择项目部位",icon:'none'});
        }
      }
      uni.showLoading({ mask: true })
        if (!this.form.pkId) {
          this.$api.addOutInventory(data).then(res => {
            uni.hideLoading()
            if (res.code === 200) {
              uni.showToast({title:'新增成功'})
              let pages = getCurrentPages()
              let prevPage = pages[pages.length - 2]; // 上一页面实例
              prevPage.$vm.resh() // 调用上一页 定义的方法
              uni.navigateBack()
            } else {
              uni.showToast({title:res.msg,icon:'none'})
            }
          }).catch(err=>{uni.hideLoading()});
        } else {
          this.$api.updateOutInventory(data).then(res => {
            uni.hideLoading()
            if (res.code === 200) {
              uni.showToast({title:'编辑成功'})
              let pages = getCurrentPages()
              let prevPage = pages[pages.length - 3]; // 上一页面实例
              prevPage.$vm.resh() // 调用上一页 定义的方法
              uni.navigateBack({ delta: 2 })
            } else {
              uni.showToast({title:res.msg,icon:'none'})
            }
          }).catch(err=>{uni.hideLoading()});
        }
    },
    openDateSelect(type,time) {
      this.datesType=type
      this.dates = Number(new Date(time));
      this.dateSelectShow = true;
    },
    dateSelect(e) {
      //   this.dates = e.value;
      console.log(e.value);
      if(this.datesType===1){
        this.form.serviceTime = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
      }else if(this.datesType===2){
        this.form.receiverTime=moment(e.value).format("YYYY-MM-DD HH:mm:ss");
      }
      this.closeDateSelect();
    },
    closeDateSelect() {
      this.dateSelectShow = false;
    },
    addMatBtn() {
        // this.list.push({})
        if(this.user.orgType==6&&this.form.issueCode !== 'delivery_unit'){
          return uni.showToast({title:"请选择物资申请单",icon:'none'});
        }
        if (this.form.issueCode === "delivery_supplier" && !this.form.fkCustomerId) {
        return uni.showToast({title:"请选择供应商",icon:'none'});
      }
      if (this.form.issueCode === "delivery_subcontract" && !this.form.fkCustomerId) {
        return uni.showToast({title:"请选择分包商",icon:'none'});
      }
      if (!this.form.fkWarehouseId) {
        return uni.showToast({title:"请选择仓库",icon:'none'});
      }
        this.openPop2(1)
    },
    openPicker(type){
        this.pickerType=type
        this.pickerList=[]
        if(type===1){
          this.pickerList=this.outObjectList
        }else if(type===2){
            this.pickerList=this.warehouserList
        }else if(type===3){
          if([6].includes(this.user.orgType) && this.form.issueCode !== 'delivery_unit'){
            return
          }
            this.pickerList=this.subOptions
        }else if(type===4){
            this.pickerList=this.supOptions
        }else if(type===5){
           this.pickerList = this.supAppList
        }else if(type===6){
            this.pickerList =this.linkSendList
        }else if(type===7){
          if([6].includes(this.user.orgType) && this.form.issueCode !== 'delivery_unit'){
            return
          }
            this.pickerList =this.proOptions
        }
        this.pickerShow = true;
    },
    pickerConfirm(e) {
		console.log(e);
		if (e.value[0]) {
            if(this.pickerType===1){
                this.form.issueCode = e.value[0].value;
                if(this.subSelShow){
                    this.form.receiverTime=moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                    this.form.receiverName=this.user.userName
                    this.subSelShow = false;
                }
                if (this.user.orgType !== 5) {
                  this.findProjectListByType(this.form.issueCode);
                }
                this.form.fkCustomerId=''
                this.form.customerName=''
                this.form.fkBidProjectId = "";
                this.form.fkCustomerId = "";
                this.form.fkItemId = "";
                this.form.fkOrdinaryId = "";
                this.form.fkApplyIdList = "";
                this.form.fkInputIdList = "";
                this.form.fkPurchaseId = "";
                this.form.fkOutApplyId = "";
                this.fkOrdinaryId = "";
                this.fkApplyIdList = [];
                this.fkInputIdList = [];
                this.fkPurchaseId = {};
                this.fkOutApplyId = {};
                this.materialIds=[]
                this.list =[]
                if(this.user.orgType==7&&!!this.form.fkBidProjectId){
                  this.findWarehouseByProjectId(this.form.fkBidProjectId);
                }else{
                  this.findWarehouseByProjectId('0');
                }
                if (["delivery_unit", "delivery_position"].includes(e.value[0].value)) {
                  this.timeShow = true;
                } else {
                  this.timeShow = false;
                }
                if(this.user.orgType==6&&this.form.issueCode !== "delivery_unit"){
                  this.findOrderOutApplyBySource()
                }
                if ((this.user.orgType === 5&&this.form.fkWarehouseId && this.form.issueCode === "delivery_unit") || (this.user.orgType === 5&&this.form.fkWarehouseId && this.form.issueCode !== "delivery_unit" && this.form.fkCustomerId)) {
                  this.findOrderOrdinaryByWarehouseId();
                  this.findOrderInputByWarehouseId();
                }
            }else if(this.pickerType===2){
              if(e.value[0]){
                this.form.fkWarehouseId = e.value[0].pkId;
                this.form.warehouseName=e.value[0].label
                if ((this.user.orgType === 5 && this.form.issueCode === "delivery_unit") || (this.user.orgType === 5 && this.form.issueCode !== "delivery_unit" && this.form.fkCustomerId)) {
                  this.findOrderOrdinaryByWarehouseId();
                  this.findOrderInputByWarehouseId();
                }
                this.fkInputIdList=[]
                this.materialIds=[]
                // if (this.form.issueCode !== "delivery_unit" && this.user.orgType === 6 && this.form.fkBidProjectId && this.form.fkWarehouseId && this.form.fkCustomerId) {
                //   this.findPurchaseOrderByProjectId(this.form.fkBidProjectId, this.form.fkWarehouseId, this.form.fkCustomerId, this.form.fkPurchaseId);
                // }
                if(e.value[0].pkId&&this.user.orgType===6&&this.form.issueCode!='delivery_unit'){
                  this.searchOrderOutApply()
                }
              }else{
                this.form.fkWarehouseId=""
                this.form.warehouseName=""
              }
            }else if(this.pickerType===3){
                console.log(this.pickerList,e.value);
                this.form.customerName=e.value[0].label
                this.form.fkCustomerId=e.value[0].value
                if(this.user.orgType===5){
                  this.findOrderOrdinaryByWarehouseId("", this.form.fkOrdinaryId);
                }
                // if (this.user.orgType === 6 && this.form.fkBidProjectId && this.form.fkWarehouseId) {
                //   this.findPurchaseOrderByProjectId(this.form.fkBidProjectId, this.form.fkWarehouseId, this.form.issueCode === "issue_project" ? "0" : this.form.fkCustomerId, this.form.fkPurchaseId);
                // }
                // if (this.user.orgType === 6 && this.form.issueCode === "delivery_project" && this.form.fkBidProjectId && this.form.fkWarehouseId) {
                //   this.findPurchaseOrderByProjectId(this.form.fkBidProjectId, this.form.fkWarehouseId, "0", this.form.fkPurchaseId);
                // }
                this.materialIds=[]
                if (e.value[0].fkLinkOrgId === "0") {
                  this.timeShow = true;
                } else {
                  this.timeShow = false;
                }
            }else if(this.pickerType===4){
                this.form.customerName=e.value[0].label
                this.form.fkCustomerId=e.value[0].value
                if(this.user.orgType===5){
                  this.findOrderOrdinaryByWarehouseId("", this.form.fkOrdinaryId);
                }
                if ((this.user.orgType === 5&&this.form.fkWarehouseId && this.form.issueCode === "delivery_unit") || (this.user.orgType === 5&&this.form.fkWarehouseId && this.form.issueCode !== "delivery_unit" && this.form.fkCustomerId)) {
                  this.findOrderOrdinaryByWarehouseId();
                  this.findOrderInputByWarehouseId();
                }
                // if (this.user.orgType === 6 && this.form.fkBidProjectId && this.form.fkWarehouseId) {
                //   this.findPurchaseOrderByProjectId(this.form.fkBidProjectId, this.form.fkWarehouseId, this.form.issueCode === "issue_project" ? "0" : this.form.fkCustomerId, this.form.fkPurchaseId);
                // }
                this.materialIds=[]
                if (e.value[0].fkLinkOrgId === "0") {
                  this.timeShow = true;
                } else {
                  this.timeShow = false;
                }
            }else if(this.pickerType===5){
                if(e.value[0]){
                  this.fkOutApplyId=e.value[0]
                  this.form.fkOutApplyId = e.value[0].pkId;
                  this.form.fkBidProjectId=e.value[0].fkBidProjectId
                  this.form.projectName=e.value[0].projectName
                  if(this.form.issueCode === 'delivery_subcontract'){
                    this.form.fkCustomerId=e.value[0].fkCustomerId
                    this.form.customerName=e.value[0].customName
                  }
                  this.form.fkPurchaseId=e.value[0].purchaseId
                  this.fkPurchaseId={pkId:e.value[0].purchaseId,orderCode:e.value[0].purchaseOrderCode}
                  if(e.value[0].pkId){
                    this.findWarehouseByProjectId(e.value[0].fkBidProjectId)
                    if(this.form.fkWarehouseId){
                      this.searchOrderOutApply()
                    }
                  }else{
                    this.list =[]
                  }
                  if ((this.user.orgType === 5&&this.form.fkWarehouseId && this.form.issueCode === "delivery_unit") || (this.user.orgType === 5&&this.form.fkWarehouseId && this.form.issueCode !== "delivery_unit" && this.form.fkCustomerId)) {
                  this.findOrderOrdinaryByWarehouseId();
                  this.findOrderInputByWarehouseId();
                }
                }else{
                  this.fkOutApplyId={}
                  this.fkPurchaseId={}
                  this.form.fkPurchaseId=''
                  this.list =[]
                }
            }else if(this.pickerType===6){
                if(e.value[0]){
                  this.fkOrdinaryId=e.value
                this.form.fkOrdinaryId=e.value[0].value
                this.fkInputIdList = e.value[0].inputName ? e.value[0].inputName.split(",").map(item => ({ orderCode: item })) : [];
                this.fkApplyIdList = e.value[0].applyName ? e.value[0].applyName.split(",").map(item => ({ orderCode: item })) : [];
                console.log(this.fkInputIdList,this.fkApplyIdList);
                this.materialIds=[]
                this.list =e.value[0].materialVos? e.value[0].materialVos.map(item => ({
                  materialPrice: item.price,
                  stockNum: item.issueNum,
                  fkMaterialId: item.pkId,
                  materialName: item.materialName,
                  fkTypeName: item.fkTypeName,
                  fkUnitName: item.fkUnitName,
                  supplyNum: item.supplyNum,
                  fkCustomerId: item.fkCustomerId,
                  purchaseNum: item.issueNum,
                  passStatus: item.passStatus,
                  customerName: item.customerName
                })):[];
                }else{
                  this.fkOrdinaryId=[]
                  this.form.fkOrdinaryId=''
                  this.fkInputIdList =[]
                  this.fkApplyIdList =[]
                  this.list =[]
                }
            }else if(this.pickerType===7){
              this.form.projectName =e.value[0].label
              this.form.fkBidProjectId=e.value[0].value
              if (this.form.issueCode === "delivery_position") {
              this.searchItemsByProjectId();
            }
            if(this.user.orgType==7){
              this.form.warehouseName=""
              this.form.fkWarehouseId=""
              if(!!this.form.fkBidProjectId){
                this.findWarehouseByProjectId(this.form.fkBidProjectId);
              }else{
                this.findWarehouseByProjectId('0');
              }
            }
            }
		}
		this.pickerCancel();
	},
	pickerCancel() {
		this.pickerShow = false;
	},
  searchOrderOutApply(isTrue){
      let data={outApplyId:this.form.fkOutApplyId,fkWarehouseId:this.form.fkWarehouseId}
      this.$api.searchOrderOutApply(data).then(res=>{
        if(res.code==200){
          if(isTrue){
              this.list.forEach(item => {
                res.data.forEach(item2 => {
                  if (item.fkMaterialId === item2.pkId) {
                    this.$set(item, "supplyNum", item2.supplyNum);
                    this.$set(item, "applyProvidedNum", item2.applyProvidedNum);
                    this.$set(item, "applyNum", item2.applyNum);
                  }
                });
              });
          }else{
            this.list=res.data.map(item=>({
              materialPrice: item.price,
              stockNum: 0,
              fkMaterialId: item.pkId,
              materialName: item.materialName,
              fkTypeName: item.fkTypeName,
              fkUnitName: item.fkUnitName,
              supplyNum: item.supplyNum,
              fkCustomerId: item.fkCustomerId,
              purchaseNum: item.purchaseNum,
              passStatus: item.passStatus,
              customerName: item.customerName,
              providedNum: item.providedNum,
              applyProvidedNum: item.applyProvidedNum,
              applyNum: item.applyNum,
              passStatus:item.passStatus
            }))
            console.log(this.list,res.data);
          }
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    openPop1(){
        this.popShow=true
        // this.checkList=this.form
    },
    searchOrders(){
       if(this.addType===1){
          
        }else if(this.addType===2){
        this.findOrderInputByWarehouseId(this.form.fkInputIdList.join(','),this.searchOrder)
        }else if(this.addType===3){
           this.findOrderApplyByCustomerId(this.searchOrder,this.form.fkApplyIdList.join(','),this.form.fkInputIdList.join(','))
        }
    },
    submitPop1(){
        if(this.addType===1){
           this.form.fkPurchaseId=this.checkList
        }else if(this.addType===2){
          this.form.fkInputIdList=this.checkList
          this.form.fkApplyIdList=[]
          this.fkApplyIdList=[]
         let arr1 = [];
          let arr2 = [];
          this.fkInputIdList=[]
          this.ordersList.forEach(item=>{
          if(this.checkList.includes(item.pkId)){
            this.fkInputIdList.push({ ...item })
            item.materialVos.forEach(item2=>{
              arr1.push(item2);
            })
          }
        })
      for (let i = 0; i < arr1.length; i++) {
        let flag = true;
        for (let j = 0; j < arr2.length; j++) {
          if (arr1[i].pkId === arr2[j].fkMaterialId && arr1[i].fkCustomerId === arr2[j].fkCustomerId) {
            // arr2[j].stockNum += arr1[i].issueNum;
            if (new Date(arr2[j].createTime) < new Date(arr1[i].createTime)) {
              arr2[j].materialPrice = arr1[i].price;
            }
            flag = false;
          }
        }
        if (flag) {
          arr2.push({
            materialPrice: arr1[i].price,
            stockNum: arr1[i].issueNum,
            fkMaterialId: arr1[i].pkId,
            materialName: arr1[i].materialName,
            fkTypeName: arr1[i].fkTypeName,
            fkUnitName: arr1[i].fkUnitName,
            supplyNum: arr1[i].supplyNum,
            purchaseNum: arr1[i].issueNum,
            fkCustomerId: arr1[i].fkCustomerId,
            passStatus: arr1[i].passStatus,
            customerName: arr1[i].customerName,
            createTime: arr1[i].createTime
          });
        }
      }
      this.list = arr2;
      
        }else if(this.addType===3){
          this.form.fkApplyIdList=this.checkList
          this.fkApplyIdList=[]
          let arr=[]
          this.ordersList.forEach(item=>{
            if(this.checkList.includes(item.pkId)){
            this.fkApplyIdList.push(item)
              item.materialVos.forEach(item2 => {
                arr.push(item2);
              })
            }
          })
          this.materialIds=arr.map(item => item.pkId);
        }
        this.closePop1()
    },
    closePop1(){
        this.popShow=false
        this.searchOrder=''
        this.deliveryDisabled=0
        this.checkList=[]
    },
    openPop2(type,item,index){
        this.popType2=type
        if(type===1){
            this.popTitle2='新增物料'
        }else if(type===2){
            this.popTitle2='编辑物料'
            this.nowIndex=index
            this.nowMaterial={...item}
        }
        this.popShow2=true
    },
    delMaterial(){
      this.list.splice(this.nowIndex,1)
      this.closePop2()
    },
    saveMaterial(){
      if(!this.nowMaterial.fkMaterialId){
        return uni.showToast({title:'请选择物料',icon:'none'})
      }
      // if(!this.nowMaterial.materialPrice){
      //   return this.showToast({title:'请填写单价',icon:'none'})
      // }
      if(!(this.nowMaterial.stockNum - 0)){
        return uni.showToast({title:'出库数量为0',icon:'none'})
      }
      if(this.nowMaterial.stockNum>this.nowMaterial.supplyNum){
        return uni.showToast({title:'出库数量超出库存数量',icon:'none'})
      }
      if(this.user.orgType===6&&this.form.issueCode!='delivery_unit'&&(this.nowMaterial.stockNum>(this.nowMaterial.applyNum-this.nowMaterial.applyProvidedNum))){
        return uni.showToast({title:'出库数量超出申请单数量',icon:'none'})
      }
      if(this.nowMaterial.materialPrice>99999999.99){
        return uni.showToast({title:'单价不能大于99999999.99',icon:'none'})
      }
      if(this.popType2===1){
        this.list.push({...this.nowMaterial})
      }else if(this.popType2===2){
       this.list[this.nowIndex]={...this.nowMaterial}
      //  console.log(this.list[this.list.findIndex(item=>item.fkMaterialId=this.nowMaterial.pkId)],this.nowMaterial);
      }
      this.closePop2()
    },
    closePop2(){
        this.popShow2=false
        this.nowMaterial={}
    },
    openTree(){
        this.$refs.tkitree._show();
    },
    // 分项树形选择
	treeConfirm(data) {
		console.log(data);
    this.form.fkItemId = data[0].pkId
    this.fkItemName = data[0].itemName
		// this.itemType = data[0].itemType; // 0 通用类型  1 路基土  2隧道
		// this.subentryId = data[0].pkId; //分项id
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
.select {
  justify-content: space-between;
}
.emptys{
  display: flex;
  align-items: center;
  padding-left: 20rpx;
  background-color: #f9f9ff;
  height: 80rpx;
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
.footer{
    display: flex;
    position: fixed;
    bottom: 0;
    width: 750rpx;
    height: 100rpx;
    z-index: 10;
    .btns{
        display: flex;
        justify-content: center;
        align-items: center;
        // width: 375rpx;
        flex: 1;
        color: #fff;
    }
    .saveBtn{
        background-color: #43cf7c;
    }
    .submitBtn{
        background-color: #1576e6;
    }
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
.popup2 {
  position: relative;
  width: 750rpx;
  height: 1200rpx;
  background-color: #2a82e4;
  border-radius: 20rpx 20rpx 0 0;
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
</style>
