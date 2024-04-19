<template>
  <view class="wrapper addPageBg">
    <u-navbar leftText="新增入库单" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="sticky">
      <u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="false" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}">
      </u-tabs>
    </view>
    <view class="pad"></view>
    <view class="content">
      <view v-if="current === 0">
        <view class="add-inputs">
          <view class="inputs-label">入库单号</view>
          <view class="inputs-content">
            <u--textarea v-model="form.orderCode" placeholder="请输入内容" autoHeight maxlength="50" border="none" :disabled="allowModify !== 0" @input="isUpdate=1"></u--textarea>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">来料对象</view>
          <view class="inputs-content select" @click="openPicker(1)">
            <view class="name">{{ putIsscodeList[form.issueCode] }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
          </view>
        </view>
        <view v-if="[6, 7].includes(user.orgType) && form.issueCode !== 'issue_unit'"  class="add-inputs">
          <view class="inputs-label">标段项目</view>
          <view class="inputs-content select" @click="openPicker(7)">
            <view class="name">{{ form.projectName }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">入库仓库</view>
          <view class="inputs-content select" @click="openPicker(2)">
            <view class="name">{{ form.warehouseName }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
          </view>
        </view>
        <view v-if="form.issueCode === 'issue_subcontract'"  class="add-inputs">
          <view class="inputs-label">分包商</view>
          <view class="inputs-content select" @click="openPicker(3)">
            <view class="name">{{ form.customerName }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
          </view>
        </view>
        <view v-if="form.issueCode === 'issue_supplier'" class="add-inputs">
          <view class="inputs-label">供应商</view>
          <view class="inputs-content select" @click="openPicker(4)">
            <view class="name">{{ form.customerName }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
          </view>
        </view>
        <view v-if="form.issueCode === 'issue_position'" class="add-inputs">
          <view class="inputs-label">分项工程</view>
          <view class="inputs-content select" @click="openTree">
            <view class="name">{{ fkItemName }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
          </view>
        </view>
        <view v-if="subSelShow" class="add-inputs">
          <view class="inputs-label">直供分包商</view>
          <view class="inputs-content select" @click="openPicker(5)">
            <view class="name">{{ supplyCustomer }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
          </view>
        </view>
        <view v-if="form.issueCode === 'issue_supplier' && [4, 5].includes(user.orgType)" class="add-inputs">
          <view class="inputs-label">关联采购计划单</view>
          <view class="inputs-content select" @click="openPicker(6)">
            <view class="name">{{ fkPurchaseId[0].label }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
          </view>
        </view>
        <view v-if="form.issueCode === 'issue_unit' ||
          (user.orgType === 5 && form.issueCode === 'issue_subcontract')
          " class="add-inputs">
          <view class="inputs-label">关联出库单</view>
          <view class="inputs-fileList">
            <view class="inputs-fileList-item" v-for="(item, idx) in orderList" :key="idx">
              <u-icon name="file-text" size="20"></u-icon>
              <view class="name">{{ item.orderCode }}</view>
               <view class="close" @click="delSub(item, idx)"></view>
              <!-- <u-icon name="close" class="delBtn" size="20" color="red" @click="delSub(item, idx)"></u-icon> -->
            </view>
          <view class="fileListBtn">
            <view class="addBtn" @click="addOrderBtn">添加</view>
          </view>
          </view>
        </view>
        <!-- <view class="add-inputs">
          <view class="inputs-label">负责人</view>
          <view class="inputs">
            <u--input v-model="form.leaderName" border="none" clearable></u--input>
          </view>
        </view> -->
        <view class="add-inputs">
          <view class="inputs-label">业务时间</view>
          <view class="inputs-content select" @click="openDateSelect(1, form.serviceTime)">
            <view class="name">{{ form.serviceTime }}</view>
            <u-icon name="calendar" class="icons" color="#2a82e4" size="16"></u-icon>
          </view>
        </view>
        <view v-if="form.billCode === '0' && !subSelShow" class="add-inputs">
          <view class="inputs-label">签收人</view>
          <view class="inputs-content">
            <u--textarea v-model="form.receiverName" placeholder="请输入内容" autoHeight maxlength="25" border="none"></u--textarea>
          </view>
        </view>
        <view v-if="form.billCode === '0' && !subSelShow" class="add-inputs">
          <view class="inputs-label">签收时间</view>
          <view class="inputs-content select" @click="openDateSelect(2, form.receiverTime)">
            <view class="name">{{ form.receiverTime }}</view>
            <u-icon name="calendar" class="icons" color="#2a82e4" size="16"></u-icon>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">备注</view>
          <view class="inputs-content">
            <u--textarea v-model="form.remark" placeholder="请输入内容" autoHeight maxlength="100" border="none"></u--textarea>
          </view>
        </view>
        <view v-if="subSelShow">
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
              <u-input v-model="form.driverPhone" border="none" maxlength="11" type="number"></u-input>
            </view>
          </view>
          <view class="add-inputs">
            <view class="inputs-label">收料地址</view>
            <view class="inputs-content">
              <u--textarea v-model="form.receiptAddress" placeholder="请输入内容" autoHeight maxlength="100" border="none"></u--textarea>
            </view>
          </view>
          <view class="add-inputs">
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
              <u--textarea v-model="form.receiverName" placeholder="请输入内容" autoHeight maxlength="25" border="none"></u--textarea>
            </view>
          </view>
          <view v-if="form.receiverStatus === 1" class="add-inputs">
            <view class="inputs-label">签收时间</view>
            <view class="inputs-content select" @click="openDateSelect(2, form.receiverTime)">
              <view class="name">{{ form.receiverTime }}</view>
              <u-icon name="calendar" class="icons" color="#2a82e4" size="16"></u-icon>
            </view>
          </view>
        </view>
        <view class="formBtns">
          <view class="next" @click="next">下一步</view>
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
                <th>供应商</th>
                <th>单位</th>
                <th>入库数量</th>
                <th>物料单价</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list" :key="index">
                <td><text class="clickTd" @click="openPop2(2, item,index)">{{ index + 1 }}</text></td>
                <td>{{ item.materialName }}</td>
                <td>{{ item.fkTypeName }}</td>
                <td>{{ item.fkCustomerId === "0" ? "无" : item.customerName }}</td>
                <td>{{ item.fkUnitName }}</td>
                <td>{{ item.stockNum }}</td>
                <td>{{ item.materialPrice }}</td>
              </tr>
            </tbody>
          </table>
        </view>
        <view class="addMatBtn">
          <view class="btns" @click="addMatBtn"> 添加物料 </view>
        </view>
        <view class="formBtns">
          <view class="last" @click="last">上一步</view>
        </view>
      </view>
    </view>
    <view class="pdb"></view>
    <view class="footer">
      <view class="btns saveBtn" v-if="!subSelShow" @click="btnOk(0)">保存草稿</view>
      <view class="btns submitBtn" @click="btnOk(2)">直接提交</view>
    </view>
    <u-datetime-picker :show="dateSelectShow" v-model="dates" mode="datetime" @confirm="dateSelect"
      @cancel="closeDateSelect"></u-datetime-picker>
    <u-picker title="请选择" :show="pickerShow" :columns="[pickerList]" keyName="label" @confirm="pickerConfirm" :key="pickerType"
      @cancel="pickerCancel"></u-picker>
    <u-popup :show="popShow" @close='closePop1'>
      <view class="popup1">
        <view class="popup-header">
          <view class="name">选择出库单</view>
          <view class="submitPop1" @click="submitPop1">确认</view>
        </view>
        <view class="popup-content">
          <view class="search-input">
            <u-input placeholder="请输入单据编号" border="none" v-model="searchOrder" maxlength="50">
              <view slot="suffix">
                <u-icon name="search" size="28" @click="searchOrders" color="#2a82e4"></u-icon>
              </view>
            </u-input>
          </view>
          <u-checkbox-group v-model="checkList" placement="column" @change="checkboxChange" class="checkBoxGroup">
            <u-checkbox class="checkBox" v-for="(item) in ordersList" :key="item.pkId" :label="item.orderCode"
              :name="item.pkId">
            </u-checkbox>
          </u-checkbox-group>
        </view>
      </view>
    </u-popup>
    <u-popup :show="popShow2" :round="20">
      <view class="popup2">
        <view class="popup2-head">
          <view class="name">{{ popTitle2 }}</view>
          <u-icon name="close" color="#fff" class="closeBtn" @click="closePop2"></u-icon>
          <!-- <view ></view> -->
        </view>
        <view class="popup2-content">
          <view>
            <view class="title">物料</view>
            <view class="inputs select" @click="materialSearch">
              <view class="name">{{ nowMaterial.materialName }}</view>
              <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
            </view>
          </view>
          <view v-if="user.orgType != 6">
            <view class="title">供应商</view>
            <view class="inputs select">
              <view class="name">{{ nowMaterial.fkCustomerId === "0" ? "无" : nowMaterial.customerName }}</view>
              <u-icon name="lock" class="icons" color="#2a82e4" size="16"></u-icon>
            </view>
          </view>
          <view>
            <view class="title">单位</view>
            <view class="inputs select">
              <view class="name">{{ nowMaterial.fkUnitName }}</view>
              <u-icon name="lock" class="icons" color="#2a82e4" size="16"></u-icon>
            </view>
          </view>
          <view>
            <view class="title">入库数量</view>
            <view class="inputs">
              <u--input type='number' v-model="nowMaterial.stockNum" border="none"
                clearable></u--input>
            </view>
          </view>
          <view v-if="!edit||states == 1 && edit">
            <view class="title">物料单价</view>
            <view class="inputs" v-if="menuCodeData.states == 1">
              <u--input type='number' v-model="nowMaterial.materialPrice" border="none"
                clearable></u--input>
            </view>
            <view class="inputs select" v-else>
              <view class="name">{{ nowMaterial.materialPrice }}</view>
              <u-icon name="lock" class="icons" color="#2a82e4" size="16"></u-icon>
            </view>
          </view>
        </view>
        <view class="pop-pdb"></view>
        <view class="footer">
          <view class="foot-btn cancle" :class="{ btns2: popType2 === 1||popType2 === 2&&!(!form.fkPurchaseId&&!form.fkInventoryIdList.length), btns1: popType2 === 2&&!form.fkPurchaseId&&!form.fkInventoryIdList.length }" @click="closePop2">取消
          </view>
          <view class="foot-btn btns1 del" v-if="popType2 === 2&&!form.fkPurchaseId&&!form.fkInventoryIdList.length" @click="delMaterial">删除</view>
          <view class="foot-btn save" :class="{ btns2: popType2 === 1||popType2 === 2&&!(!form.fkPurchaseId&&!form.fkInventoryIdList.length), btns1: popType2 === 2&&!form.fkPurchaseId&&!form.fkInventoryIdList.length }" @click="saveMaterial">保存
          </view>
        </view>
      </view>
      <materialSelect :treeData="treeData" ref="materialSelect" @checked="checked" @search="materSearch"></materialSelect>
    </u-popup>
    <tki-tree ref="tkitree" :range="itemList" :selectParent="false" :children="'children'" :rangeKey="rangeKey" confirmColor="#4e8af7" @confirm="treeConfirm" />
  </view>
</template>

<script>
import moment from "moment";
import tkiTree from "@/components/tki-tree/tki-tree.vue";
import materialSelect from "@/components/material-select/material-select.vue";
export default {
  components: { tkiTree, materialSelect },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  data() {
    return {
      edit: false,
      states: 0,
      tabList: [{ name: "入库信息" }, { name: "物料信息" }],
      current: 0,
      form: {
        customerName: "",
        warehouseName: '',
        billCode: "0",
        fkBidProjectId: "",
        fkCustomerId: "",
        fkItemId: "",
        fkPurchaseId: "",
        fkInventoryIdList: [],
        fkWarehouseId: "",
        inventoryCode: "",
        issueCode: "issue_unit",
        leaderName: "",
        orderCode: "",
        receiverName: "",
        receiverTime: "",
        remark: "",
        serviceTime: "",
        fkSupplyCustomerId: "",
        receiptAddress: "",
        receiverStatus: 1
      },
      list: [],
      orderList: [],
      dates: 0,
      dateSelectShow: false,
      maxlength: 1000,
      allowModify: 0,
      isUpdate: 0,
      subSelShow: false,
      putIsscodeList: { issue_unit: "无", issue_supplier: "供应商", issue_subcontract: "分包商", issue_project: "项目部", issue_position: "施工部位" },
      pickerList: [],
      pickerType: 1,
      pickerShow: false,
      putObjectList: [],
      supSubOptions: [],
      warehouserList: [],
      supOptions: [],
      subOptions: [],
      proOptions: [],
      planBuyList: [{ value: '', label: '无' }],
      fkPurchaseId: [{ value: '', label: '无' }],
      itemList: [],
      rangeKey: 'itemName',
      supplyCustomer: '',
      popShow: false,
      searchOrder: '',
      checkList: [],
      ordersList: [],
      popShow2: false,
      popTitle2: '新增物料',
      popType2: 1,
      nowMaterial: {},
      treeData: [],
      nowIndex: 0,
      fkItemName: "",
      menuCodeData:{}
    };
  },

  onLoad(options) {
    console.log(options);
    if (options.type == 1) {
      this.getBusinessCode()
      let now = new Date()
      this.form.serviceTime = moment(now).format("YYYY-MM-DD HH:mm:ss");
      this.form.leaderName = this.user.userName
      this.form.receiverTime = moment(now).format("YYYY-MM-DD HH:mm:ss");
      this.form.receiverName = this.user.userName
    } else if (options.type == 2) {
      let obj = JSON.parse(options.obj)
      this.form = obj
      this.list = obj.detailsVoList
      let arr1 = obj.orderRelationList.filter(item => item.orderType === 1); //采购单
      let arr2 = obj.orderRelationList.filter(item => item.orderType === 2); //出库单
      // let arr3 = obj.orderRelationList.filter(item => item.orderType === 3); //入库单
      this.form.fkPurchaseId = arr1.length ? arr1[0].pkId : "";
      this.fkPurchaseId = arr1.length ? arr1[0] : [{ value: '', label: '无' }];
      this.fkInventoryIdList = arr2;
      this.form.fkInventoryIdList = arr2.length ? arr2.map(item => item.pkId) : [];
      this.checkList = this.form.fkInventoryIdList ? [this.form.fkInventoryIdList] : []
      if (obj.issueCode === "issue_position") {
      this.fkItemName = obj.orderItemList && obj.orderItemList.length ? obj.orderItemList[0].itemName : ""
      this.form.fkItemId = res.data.orderItemList ? res.data.orderItemList[0].fkItemId : "";
      this.searchItemsByProjectId();
    }
    }
    this.dates = Number(new Date());
    this.$store.dispatch("getDictionariesData", 17).then(res => {
      this.putObjectList = res.map(item => ({ ...item, value: item.keyName, label: item.keyVal }));
    });
    this.findProjectListByType(this.form.issueCode)
    if (this.user.orgType === 7) {
      this.findWarehouseByProjectId("0");
    } else {
      this.findWarehouseByProjectId("");
    }
    this.searchMenuDataAuthorize()
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
    getBusinessCode() {
      this.$api.getBusinessCode({ businessType: 8 }).then((res) => {
        if (res.code === 200) {
          this.form.orderCode = res.data.typeCode;
          this.maxlength = res.data.limitNum;
          this.allowModify = res.data.allowModify;
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    findProjectListByType(accessCode) {
      let data = {
        accessType: 2,
        accessCode
      }
      console.log(data);
      this.$api.findProjectListByType(data).then(res => {
        if (res.code === 200) {
          this.proOptions = res.data.map(item => ({ ...item, value: item.pkId, label: item.projectName }));
          if (this.user.orgType === 5) {
            this.searchProjCustomByType(3)
            this.searchProjCustomByType(4)
          }
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    findWarehouseByProjectId(bidProjectId) {
      this.$api.findWarehouseByProjectId({ bidProjectId }).then(res => {
        if (res.code === 200) {
          let arr = res.data.map(item => ({ ...item, value: item.pkId, label: item.warehouseName }));
          this.warehouserList = arr
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    searchProjCustomByType(customType) {
      let data = {
        bidProjectId: this.user.orgType === 5 ? this.proOptions[0].pkId : this.form.fkBidProjectId,
        customType,
        isZero: 2,
        sourceType: 0
      }
      this.$api.searchProjCustomByType(data).then(res => {
        if (res.code === 200) {
          let arr = res.data.map(item => ({ ...item, value: item.pkId, label: item.customName }));
          if (customType === 3) {
            this.supOptions = arr;
          } else if (customType === 4) {
            this.subOptions = arr;
          }
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    findOrderOutByWarehouseId(outIds, orderCode) {
      let data = {
        pageNum: 1,
        pageSize: 20,
        fkWarehouseId: this.form.fkWarehouseId,
        outIds, orderCode
      }
      this.$api.findOrderOutByWarehouseId(data).then(res => {
        if (res.code === 200) {
          this.ordersList = res.data
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    searchItemsByProjectId() {
      let data = {
        projectId: this.user.orgType === 5 ? '' : this.form.fkBidProjectId,
        filterStatus: 1,
        isOut:1
      }
      if(this.user.orgType !== 7){
        delete data.filterStatus
        delete data.isOut
      }
      this.$api.searchItemsByProjectId(data).then(res => {
        if (res.code === 200) {
          this.itemList = res.data
        } else {
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
            let arr = res.data.map(item => ({ ...item, value: item.pkId, label: item.orderCode }));
            this.planBuyList = [{ value: '', label: '无' }, ...arr]
          } else {
            this.$message.error(res.msg);
          }
        })
    },
    checkboxChange(e) {
      console.log(e);
    },
    currentChange(e) {
      this.$api.searchMenuDataAuthorize().then(res => {
        this.states = res.data[3].states
      })
      this.current = e.index;
    },
    addOrderBtn() {
      if (!this.form.fkWarehouseId) {
        return uni.showToast({ title: '请先选择仓库', icon: "none" })
      }
      this.findOrderOutByWarehouseId(this.checkList.join(','))
      this.openPop1()
    },
    delSub(item, idx) {
      this.orderList.splice(idx, 1);
      let arr1 = [];
      let arr2 = [];
      this.orderList.forEach(item => {
        item.materialVos.forEach(item2 => {
          arr1.push(item2);
        })
      })
      this.form.fkInventoryIdList = this.orderList.map(item => item.pkId)
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
    },
    next() {
      this.current = 1;
      this.$api.searchMenuDataAuthorize().then(res => {
        res.data.forEach(item=>{
          if(item.menuCode='updatePrice'){
            this.states=item.states
          }
        })
      })
    },
    last() {
      this.current = 0;
    },
    btnOk(type) {
      let reg =/^1(2|3|4|5|6|7|8|9)\d{9}$/
      if(!reg.test(this.form.driverPhone) && this.subSelShow){
        return uni.showToast({icon:'none',title:"请输入正确的手机号"})
      }
      console.log(this.form);
      let data = { ...this.form, isUpdate: this.isUpdate, inventoryCode: type }
      if (this.form.issueCode === "issue_supplier") {
          this.list = this.list.map(item => ({ ...item, fkCustomerId: this.form.fkCustomerId }));
      }
      if (!this.form.pkId) {
        data.detailListAdd = this.list;
      } else {
        data.detailUpdateList = this.list;
      }
      console.log(data);
      // if(!this.list.length){
      //   return uni.showToast({})
      // }
      if (!this.form.pkId) {
        this.$api.addPutInventory(data).then(res => {
          if (res.code === 200) {
            uni.showToast({ title: '新增成功' })
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh() // 调用上一页 定义的方法
            uni.navigateBack({ delta: 1 })
          } else {
            uni.showToast({ title: res.msg, icon: 'none' })
          }
        });
      } else {
        this.$api.updatePutInventory(data).then(res => {
          if (res.code === 200) {
            uni.showToast({ title: '编辑成功' })
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 3]; // 上一页面实例
            prevPage.$vm.resh() // 调用上一页 定义的方法
            uni.navigateBack({ delta: 2 })
          } else {
            uni.showToast({ title: res.msg, icon: 'none' })
          }
        });
      }
    },
    openDateSelect(type, time) {
      this.datesType = type
      this.dates = Number(new Date(time));
      this.dateSelectShow = true;
    },
    dateSelect(e) {
      //   this.dates = e.value;
      console.log(e.value);
      if (this.datesType === 1) {
        this.form.serviceTime = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
      } else if (this.datesType === 2) {
        this.form.receiverTime = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
      }
      this.closeDateSelect();
    },
    closeDateSelect() {
      this.dateSelectShow = false;
    },
    addMatBtn() {
      // this.list.push({})
      if (this.form.issueCode === "issue_supplier" && !this.form.fkCustomerId) {
        return uni.showToast({ title: "请选择供应商", icon: 'none' });
      }
      if (this.form.issueCode === "issue_subcontract" && !this.form.fkWarehouseId) {
        return uni.showToast({ title: "请选择仓库", icon: 'none' });
      }
      if (this.form.issueCode === "issue_subcontract" && !this.form.fkCustomerId) {
        return uni.showToast({ title: "请选择分包商", icon: 'none' });
      }
      if (this.form.issueCode === "issue_position" && !this.form.fkItemId) {
        return uni.showToast({ title: "请选择分项工程", icon: 'none' });
      }
      if (this.user.orgType === 5 && this.form.issueCode === "issue_supplier" && this.subSelShow && !this.form.fkSupplyCustomerId) {
        return uni.showToast({ title: "请选择直供分包商", icon: 'none' });
      }
      this.openPop2(1)
    },
    openPicker(type) {
      this.pickerType = type
      this.pickerList = []
      if (type === 1) {
        this.pickerList = this.putObjectList
      } else if (type === 2) {
        this.pickerList = this.warehouserList
      } else if (type === 3) {
        this.pickerList = this.subOptions
      } else if (type === 4) {
        this.pickerList = this.supOptions
      } else if (type === 5) {
        this.pickerList = this.supSubOptions
      } else if (type === 6) {
        this.pickerList = this.planBuyList
      } else if (type === 7) {
        this.pickerList = this.proOptions
      }
      this.pickerShow = true;
    },
    pickerConfirm(e) {
      console.log(e);
      if (e.value[0]) {
        if (this.pickerType === 1) {
          this.form.issueCode = e.value[0].value;
          if (this.subSelShow) {
            this.form.receiverTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.form.receiverName = this.user.userName
            this.subSelShow = false;
          }
          this.form.fkCustomerId = ''
          this.form.customerName = ''
          this.supplyCustomer = ''
          this.form.fkSupplyCustomerId = ''

          if (this.user.orgType !== 5) {
            this.findProjectListByType(this.form.issueCode);
          }
          if([6, 7].includes(this.user.orgType) && this.form.issueCode !== 'issue_unit'){
            this.findWarehouseByProjectId('0');
          }
        } else if (this.pickerType === 2) {
          this.form.fkWarehouseId = e.value[0].value;
          this.form.warehouseName = e.value[0].label
          this.orderList =[]
          this.list=[]
          let bidId = this.user.orgType === 5 ? this.proOptions[0].pkId : this.form.fkBidProjectId;
          if (this.form.issueCode === "issue_supplier" && bidId && this.form.fkWarehouseId && this.form.fkCustomerId) {
            this.findPurchaseOrderByProjectId(bidId, this.form.fkWarehouseId, this.form.fkCustomerId, this.form.fkPurchaseId);
          }
          if (this.form.issueCode === "issue_project" && bidId && this.form.fkWarehouseId && [2, 3].includes(this.putStoreDialogType)) {
            this.findPurchaseOrderByProjectId(bidId, this.form.fkWarehouseId, "0", this.form.fkPurchaseId);
          }
        } else if (this.pickerType === 3) {
          console.log(this.pickerList, e.value);
          this.form.customerName = e.value[0].label
          this.form.fkCustomerId = e.value[0].value
        } else if (this.pickerType === 4) {
          this.form.customerName = e.value[0].label
          this.form.fkCustomerId = e.value[0].value
          if (this.user.orgType === 5 && e.value[0].supplyCode !== "supply_common") {
            this.subSelShow = true;
            this.supSubOptions = e.value[0].supplyCustoms ? e.value[0].supplyCustoms.map(item => ({ ...item, value: item.pkId, label: item.customName })) : [];
            this.form.receiverTime = '';
            this.form.receiverName = ''
          } else {
            this.subSelShow = false;
            this.form.receiverTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.form.receiverName = this.user.userName
          }
          let bidId = this.user.orgType === 5 ? this.proOptions[0].pkId : this.form.fkBidProjectId;
          if (bidId && this.form.fkWarehouseId && this.form.fkCustomerId) {
            this.findPurchaseOrderByProjectId(bidId, this.form.fkWarehouseId, this.form.fkCustomerId, this.form.fkPurchaseId);
          }
        } else if (this.pickerType === 5) {
          this.supplyCustomer = e.value[0].label
          this.form.fkSupplyCustomerId = e.value[0].value
        } else if (this.pickerType === 6) {
          console.log(e.value[0]);
          this.form.fkPurchaseId = e.value[0].value
          this.fkPurchaseId = [...e.value]
          if (e.value[0] && e.value[0].materialVos) {
            this.list = e.value[0].materialVos.map(item => ({
              materialPrice: item.price,
              stockNum: item.issueNum,
              fkMaterialId: item.pkId,
              materialName: item.materialName,
              fkTypeName: item.fkTypeName,
              fkUnitName: item.fkUnitName,
              supplyNum: item.supplyNum,
              fkCustomerId: item.fkCustomerId,
              passStatus: item.passStatus,
              customerName: item.customerName
            }));
          } else {
            this.form.fkPurchaseId = ''
            this.list = []
          }
        } else if (this.pickerType === 7) {
          this.form.projectName = e.value[0].label
          this.form.fkBidProjectId = e.value[0].value
          let bidId = this.user.orgType === 5 ? this.proOptions[0].pkId : this.form.fkBidProjectId;
          this.findWarehouseByProjectId(bidId);
          if (this.form.issueCode === "issue_supplier" && bidId && this.form.fkWarehouseId && this.form.fkCustomerId) {
            this.findPurchaseOrderByProjectId(bidId, this.form.fkWarehouseId, this.form.fkCustomerId, this.form.fkPurchaseId);
          }
          if (this.form.issueCode === "issue_project" && this.user.orgType === 7 && this.form.fkBidProjectId && this.form.fkWarehouseId) {
            this.findPurchaseOrderByProjectId(this.form.fkBidProjectId, this.form.fkWarehouseId, "0", this.form.fkPurchaseId);
          }
          if (this.form.issueCode === "issue_position") {
              this.searchItemsByProjectId();
          }
        }
      }
      this.pickerCancel();
    },
    pickerCancel() {
      this.pickerShow = false;
    },
    openPop1() {
      this.popShow = true
      this.checkList = this.form.fkInventoryIdList ? this.form.fkInventoryIdList : []
    },
    searchOrders() {
      this.findOrderOutByWarehouseId(this.checkList.join(','), this.searchOrder)
    },
    submitPop1() {
      // this.orderList.push({ customName: "哈哈" });
      this.form.fkInventoryIdList = this.checkList
      let arr = []
      let arr1 = []
      let arr2 = [];
      this.ordersList.forEach(item => {
        if (this.checkList.includes(item.pkId)) {
          arr.push({ ...item })
          item.materialVos.forEach(item2 => {
            arr1.push(item2);
          })
        }
      })
      this.orderList = arr
      for (let i = 0; i < arr1.length; i++) {
        let flag = true;
        for (let j = 0; j < arr2.length; j++) {
          if (arr1[i].pkId === arr2[j].fkMaterialId && arr1[i].fkCustomerId === arr2[j].fkCustomerId) {
            if (new Date(arr2[j].createTime) < new Date(arr1[i].createTime)) {
              arr2[j].materialPrice = arr1[i].price;
            }
            arr2[j].maxNum += arr1[i].stockNum;
            arr2[j].stockNum += arr1[i].stockNum;
            flag = false;
          }
        }
        if (flag) {
          // form.fkInventoryIdList
          arr2.push({
            materialPrice: arr1[i].price,
            stockNum: arr1[i].stockNum,
            maxNum: arr1[i].stockNum,
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
      this.list = arr2
      this.closePop1()
    },
    closePop1() {
      this.popShow = false
      this.searchOrder = ''
      this.checkList = []
    },
    openPop2(type, item, index) {
      this.popType2 = type
      if (type === 1) {
        this.popTitle2 = '新增物料'
        this.edit = false
      } else if (type === 2) {
        this.popTitle2 = '编辑物料'

        this.edit = true
        this.nowIndex = index
        this.nowMaterial = { ...item }
      }
      this.popShow2 = true
    },
    delMaterial() {
      this.list.splice(this.nowIndex, 1)
      this.closePop2()
    },
    saveMaterial() {
      if (!this.nowMaterial.fkMaterialId) {
        return uni.showToast({ title: '请选择物料', icon: 'none' })
      }
      if(this.nowMaterial.materialPrice==undefined || this.nowMaterial.materialPrice.length == 0 || !this.nowMaterial.materialPrice){
        return uni.showToast({title:'请填写单价',icon:'none'})
      }
      if (this.popType2 === 1) {
        this.list.push({ ...this.nowMaterial })
      } else if (this.popType2 === 2) {
        this.list[this.nowIndex] = { ...this.nowMaterial }
        console.log(this.list);
        //  console.log(this.list[this.list.findIndex(item=>item.fkMaterialId=this.nowMaterial.pkId)],this.nowMaterial);
      }
      this.closePop2()
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
        pageSize: 10000,
        type: 3, // 1合同，2仓库  3出入库  4 盘点单
        fkCustomId: ["issue_supplier", "issue_subcontract"].includes(this.form.issueCode) ? this.form.fkCustomerId : '0',
        issueTypeCode: this.form.issueCode,
        materialTypeCode:this.list.length?this.list[0].typeCode:""
      };
      if(materialName){
        data.materialName=materialName
      }
      if (data.issueTypeCode === "issue_subcontract" && this.user.orgType === 5) {
        data.fkWarehouseId = this.form.fkWarehouseId;
      }
      if (this.user.orgType === 5 && data.issueTypeCode === "issue_supplier") {
        data.fkSupplyCustomerId = this.form.fkSupplyCustomerId
      }
      if ([6, 7].includes(this.user.orgType)) {
        if (data.issueTypeCode !== "issue_unit") {
          data.fkBidProjectId = this.fkBidProjectId;
          if (data.issueTypeCode === "issue_position") {
            data.fkItemId = this.fkItemId;
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
      if (this.list.filter(item2 => item2.fkMaterialId === item.pkId && item.fkCustomerId === item2.fkCustomerId).length) {
        return uni.showToast({ title: "该物料已经存在入库物料表中", icon: 'none' });
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
      this.$set(this.nowMaterial, "supplyNum", item.supplyNum);
      this.$set(this.nowMaterial, "purchaseNum", item.supplyNum);
      this.$set(this.nowMaterial, "typeCode", item.typeCode);
      this.$set(this.nowMaterial, "stockNum", "");
      this.$set(this.nowMaterial, "materialPrice", item.price);
    },
    closePop2() {
      this.popShow2 = false
      this.nowMaterial = {}
    },
    openTree() {
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
      overflow: hidden;
      /*超出部分隐藏*/
      white-space: nowrap;
      /*禁⽌换⾏*/
      text-overflow: ellipsis;
      /*省略号*/
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

.popup1 {
  height: 900rpx;

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    // line-height: 80rpx;
    padding: 0 20rpx;
    // color: #fff;
    font-size: 28rpx;

    .submitPop1 {
      color: #2a82e4;
    }
  }

  .popup-content {
    padding: 0 20rpx;

    .search-input {
      width: 700rpx;
      padding-left: 20rpx;
      border: 1px solid #2a82e4;
      border-radius: 6rpx;
    }
  }
}

.checkBoxGroup {
  overflow: auto;
  height: 740rpx;
  margin-top: 10rpx;
}

.checkBox {
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
    height: 1020rpx;
    padding-top: 40rpx;
    overflow: auto;
    background-color: #f7f7ff;
    // padding: 0 20rpx;
    border-radius: 20rpx 20rpx 0 0;

    .popup2-content-head {
      height: 60rpx;
      line-height: 60rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      background: linear-gradient(90deg, rgba(230, 235, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)
    }

    .info-item {
      padding-bottom: 20rpx;

      .imgList {
        display: flex;
        flex-wrap: wrap;
        padding: 10rpx 20rpx;

        image {
          width: 350rpx;
          margin-bottom: 10rpx;
        }

        :nth-child(2n) {
          margin-left: 10rpx;
        }
      }
    }

    .remark {
      max-height: 400rpx;
      overflow: auto;
    }

    .u-form-item {
      padding: 0 20rpx;
      border-bottom: 1px solid #eee;
    }
  }

  .pop-pdb {
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

    .foot-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80rpx;
      font-size: 28rpx;
    }

    .btns1 {
      width: 210rpx;
    }

    .btns2 {
      width: 300rpx;
    }

    .cancle {
      background-color: #eeeeee;
      color: #aaaaaa;
    }

    .del {
      color: #fff;
      background-color: red;
    }

    .save {
      color: #fff;
      background-color: #2a82e4;
    }
  }
}</style>
