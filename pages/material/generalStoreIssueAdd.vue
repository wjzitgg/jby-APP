<template>
  <view class="wrapper addPageBg">
    <u-navbar :leftText="rowData.itemTitle" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="content">
      <view style="background: #fff">
        <u-tabs class="tabs" :list="list1" :current="current" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}">
        </u-tabs>
      </view>
      <view v-show="current == 0">
        <view style="padding-bottom: 60px">
          <view class="add-inputs">
            <view class="inputs-label">发料需求单号</view>
            <view class="inputs-content">
					  	<u--textarea v-model="rowData.orderCode" placeholder="请输入内容" autoHeight maxlength="50" border="none"></u--textarea>
					  </view>
          </view>
          <view class="add-inputs">
            <view class="inputs-label">出库对象</view>
            <view class="inputs-content select" @click="sessionShow = true">
              <view class="name">{{ sessionData.label }}</view>
              <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
            </view>
            <u-picker :show="sessionShow" :columns="sessionList" keyName="label" @cancel="sessionClose"
              @confirm="sessionConfirm"></u-picker>
          </view>
          <view v-show="sessionData.id == 'delivery_subcontract' ||
            sessionData.id == 'delivery_supplier'
            "  class="add-inputs">
            <view class="inputs-label">{{ sessionData.label }}</view>
            <view class="inputs-content select" @click="clientShowClick">
              <view class="name">{{ clientData.customName }}</view>
              <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
            </view>
            <u-picker :show="clientShow" :columns="clientList" keyName="customName" @cancel="clientClose"
              @confirm="clientConfirm"></u-picker>
          </view>
          <view class="add-inputs">
            <view class="inputs-label">出库仓库</view>
            <view class="inputs-content select" @click="warehouseShow = true">
              <view class="name">{{ warehouseData.warehouseName }}</view>
              <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
            </view>
            <u-picker :show="warehouseShow" :columns="warehouseList" keyName="warehouseName" @cancel="warehouseClose"
              @confirm="warehouseConfirm"></u-picker>
          </view>
          <view class="add-inputs">
            <view class="inputs-label">填表人</view>
            <view class="inputs-content select">
              <u--input placeholder="请输入内容" border="none" v-model="rowData.leaderName" customStyle="" class="form-content-1"
              clearable></u--input>
            </view>
            
          </view>
          <view class="add-inputs">
            <view class="inputs-label">业务时间</view>
            <view class="inputs-content select" @click="dateShow = true">
              <view class="name">{{ presentationTime }}</view>
              <u-icon name="calendar-fill" class="icons" color="#2a82e4" size="12"></u-icon>
            </view>
            <u-datetime-picker :show="dateShow" v-model="value1" @cancel="dateShow = false" @confirm="dateSelect"
              mode="date"></u-datetime-picker>
          </view>
          <view v-if="rowData.itemTitle != '新增普通材料发料'" class="add-inputs">
            <view class="inputs-label">制单人</view>
            <view class="inputs-content select">
					  	<view>{{rowData.createUserName}}</view>
              <u-icon name="lock-fill" class="icons" size="14"></u-icon>
					  </view>
            <!-- <u--input placeholder="请输入内容" border="none" v-model="rowData.createUserName" disabled customStyle=""
              class="form-content" clearable></u--input> -->
          </view>
          <view v-if="rowData.itemTitle != '新增普通材料发料'" class="add-inputs">
            <view class="inputs-label">录入时间</view>
            <view class="inputs-content select">
					  	<view>{{rowData.createTime}}</view>
              <u-icon name="lock-fill" class="icons" size="14"></u-icon>
					  </view>
            <!-- <u--input placeholder="请输入内容" border="none" disabled v-model="rowData.createTime" customStyle=""
              class="form-content" clearable></u--input> -->
          </view>
          <view v-if="rowData.itemTitle != '新增普通材料发料'" class="add-inputs">
            <view class="inputs-label">单据金额</view>
            <view class="inputs-content select">
					  	<view>{{rowData.totalAmount}}</view>
              <u-icon name="lock-fill" class="icons" size="14"></u-icon>
					  </view>
            <!-- <u--input placeholder="请输入内容" border="none" disabled v-model="rowData.totalAmount" customStyle=""
              class="form-content" clearable></u--input> -->
          </view>
          <view class="add-inputs">
            <view class="inputs-label">关联入库单</view>
            <!-- <view class="multiSelect">

              <view class="item-code" v-for="(item, index) in checkboxData1" :key="index">
                <u-icon class="icons" name="file-text" size="24"></u-icon>
                <view class="fileName text-hidden">{{ item.orderCode }}</view>

                <text class="voucher-btn" @click="addStorage">添加</text>
              </view>
            </view> -->
            <view class="inputs-fileList">
              <view class="inputs-fileList-item" v-for="(item, index) in checkboxData1" :key="index">
                <u-icon class="icons" name="file-text" size="24"></u-icon>
                <view class="fileName name text-hidden">{{ item.orderCode }}</view>
              </view>
              <!-- <u-button text="添加" class="add-coder" @click="addStorage"></u-button> -->
              <view class="fileListBtn">
                <view class="addBtn" @click="addStorage">添加</view>
              </view>
            </view>
          </view>
          <view v-if="sessionData.label == '分包商'" class="add-inputs">
            <view class="inputs-label">关联申请单</view>
            <!-- <view class="select">
              <view class="name">
                <text class="voucher-btn" @click="addApplyFor">添加</text>
              </view>
            </view> -->
            <view class="inputs-fileList">
              <view class="inputs-fileList-item" v-for="(item, index) in checkboxData2" :key="index">
                <u-icon class="icons" name="file-text" size="24"></u-icon>
                <view class="fileName name text-hidden">{{ item.orderCode }}</view>
              </view>
              <!-- <u-button text="添加" class="add-coder" @click="addApplyFor"></u-button> -->
              <view class="fileListBtn">
                <view class="addBtn" @click="addApplyFor">添加</view>
              </view>
            </view>
          </view>
          <view class="add-inputs">
            <view class="inputs-label">收货地址</view>
            <view class="inputs-content">
              <u--textarea v-model="rowData.receiptAddress" placeholder="请输入内容" autoHeight maxlength="100" border="none"></u--textarea>
            </view>
          </view>
          <view class="add-inputs">
            <view class="inputs-label">备注</view>
            <view class="inputs-content">
              <u--textarea v-model="rowData.remark" placeholder="请输入内容" autoHeight maxlength="200" border="none"></u--textarea>
            </view>
          </view>
        </view>
      </view>
      <view class="table_detail" v-show="current == 1" style="margin-top: 2px">
        <table>
          <thead>
            <tr>
              <th style="width: 40px">序号</th>
              <th>物料名称</th>
              <th>物料分类</th>
              <th>单位</th>
              <th>需出库数量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in details" :key="index" @click="itemClick(item, index)">
              <td>{{ index + 1 }}</td>
              <td>{{ item.materialName }}</td>
              <td>{{ item.materialTypeName }}</td>
              <td>{{ item.fkUnitName }}</td>
              <td>{{ item.applyNum }}</td>
            </tr>
          </tbody>
        </table>
        <view v-if="checkboxData1.length == 0" class="table-btn" @click="tableAdd">添加物料</view>
      </view>
    </view>
    <view class="box-btn" v-if="current == 0">
      <u-button style="background: #eeeeee" class="btns cancle" type="default" text="取消" @click="abrogate"></u-button>
      <u-button class="btns" type="primary" text="下一步" @click="nextStep"></u-button>
    </view>
    <view class="box-btn" v-else>
      <u-button style="background: #eeeeee" class="btns cancle" type="default" text="上一步" @click="lastStep"></u-button>
      <u-button class="btns" type="primary" text="保存草稿" @click="preserve(0)"></u-button>
      <u-button class="btns" type="success" text="保存提交" @click="preserve(1)"></u-button>
    </view>
    <u-popup :show="showLinkPop">
      <view class="showLinkPop">
        <view class="head">
          <view class="name">{{ showLinkTitle }}</view>
          <u-icon name="close" color="#fff" class="closeBtn" @click="closeLinkPop"></u-icon>
        </view>
        <view class="content">
          <view>
            <view class="form-title">物料</view>
            <view class="select" @click="materialTypeSearch(1, {})">
              <view class="name">{{ materialData.materialName }}</view>
              <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
            </view>
          </view>
          <view>
            <view class="form-title">当前库存</view>
            <u--input placeholder="" border="none" v-model="materialData.supplyNum" customStyle="" suffixIcon="lock-fill"
              disabled class="form-content" clearable></u--input>
          </view>
          <view>
            <view class="form-title">需出库数量</view>
            <u--input placeholder="请输入内容" border="none" type="number" v-model="materialData.grantNum" customStyle=""
              class="form-content" clearable></u--input>
          </view>
          <view>
            <view class="form-title">物料单价</view>
            <u--input placeholder="请输入内容" border="none" type="number" v-model="materialData.materialPrice" customStyle=""
              class="form-content" clearable></u--input>
          </view>
          <view>
            <view class="form-title">金额</view>
            <!-- <u--input
              placeholder="请输入内容"
              border="none"
              v-model="materialData.applyNum"
              customStyle=""
              class="form-content"
              clearable
            ></u--input> -->
            <view class="form-content form-content-lh">{{
              materialData.grantNum * materialData.materialPrice > 0 ? materialData.grantNum * materialData.materialPrice
              : ""
            }}</view>
          </view>
        </view>
        <view class="footer" v-if="showLinkTitle == '新增物料'">
          <u-button class="btns cancle" type="default" text="取消" @click="closeLinkPop"></u-button>
          <u-button class="btns" type="primary" text="添加" @click="addition"></u-button>
        </view>
        <view class="footer" v-else>
          <u-button class="btns cancle" type="default" text="取消" @click="closeLinkPop"></u-button>
          <u-button class="btns" type="error" text="删除" v-if="checkboxData1.length == 0"
            @click="materialDataDelete"></u-button>
          <u-button class="btns" type="primary" text="保存" @click="materialDataSave"></u-button>
        </view>
      </view>
    </u-popup>
    <!-- 入库单 -->
    <u-popup :show="storageShow" @close="storageShow = false">
      <view class="selectShow">
        <view class="head">
          <view class="name">关联入库单</view>
          <view class="closeBtn" @click="notarize" style="color: #3c9cff">确认</view>
        </view>
        <view class="content">
          <view>
            <u-input style="margin: 6px 9px; height: 30px" placeholder="请输入内容" v-model="storageCode" maxlength="50">
              <template slot="suffix">
                <u-icon name="search" color="#0075ff"></u-icon>
              </template>
            </u-input>
          </view>
          <view>
            <u-radio-group style="margin: 8px" v-model="checkboxValue1" placement="column">
              <u-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in checkboxList1" :key="index"
                :label="item.orderCode" :name="item.pkId">
              </u-radio>
            </u-radio-group>
          </view>
        </view>
      </view>
    </u-popup>
    <!-- 申请单 -->
    <u-popup :show="applyForShow" @close="applyForShow = false">
      <view class="selectShow">
        <view class="head">
          <view class="name">关联申请单</view>
          <view class="closeBtn" @click="requestConfirmation" style="color: #3c9cff">确认</view>
        </view>
        <view class="content">
          <view>
            <u-input style="margin: 6px 9px; height: 30px" placeholder="请输入内容" v-model="applyForCode" maxlength="50">
              <template slot="suffix">
                <u-icon name="search" color="#0075ff"></u-icon>
              </template>
            </u-input>
          </view>
          <view>
            <u-checkbox-group style="margin: 8px" v-model="checkboxValue2" placement="column">
              <u-checkbox :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in checkboxList2" :key="index"
                :label="item.orderCode" :name="item.pkId">
              </u-checkbox>
            </u-checkbox-group>
          </view>
        </view>
      </view>
    </u-popup>
    <materialSelect :treeData="treeData" ref="materialSelect" @checked="checked"></materialSelect>
  </view>
</template>

<script>
import moment from "moment";
import materialSelect from "@/components/material-select/material-select.vue";
export default {
  components: {
    materialSelect,
  },
  data() {
    return {
      list1: [{ name: "基础信息" }, { name: "物料信息" }],
      current: 0,
      sessionShow: false, // 出库对象
      sessionList: [
        [
          {
            label: "无",
            id: "delivery_unit",
          },
          {
            label: "供应商",
            id: "delivery_supplier",
          },
          {
            label: "分包商",
            id: "delivery_subcontract",
          },
        ],
      ], // 出库对象
      sessionData: {
        id: ""
      }, // 出库对象
      clientShow: false, //出库客户状态
      clientData: {}, //出库客户选中数据
      clientList: [], //出库客户下拉列表
      warehouseList: [], //出库仓库
      warehouseShow: false, //出库仓库
      warehouseData: {}, //出库仓库
      storageShow: false, //入库单弹窗状态
      checkboxList1: [], //关联入库单列表
      checkboxValue1: "", //关联入库单
      storageCode: "",
      applyForShow: false, //申请单状态
      checkboxList2: [], //关联申请单列表
      checkboxValue2: [], //关联申请单
      applyForCode: "",

      rowData: {},
      details: [],

      contractDetails: {},

      dateShow: false,
      value1: Number(new Date()),
      presentationTime: "",

      showLinkPop: false,
      showLinkTitle: "",
      materialList: [],
      materialData: {},
      typeCode: "",
      treeData: [],
      checkboxData1: [],
      checkboxData2: [],
      itemIndex: 0
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);
    if (this.rowData.itemTitle == "编辑普通材料发料") {
      this.sessionData = {
        id: this.rowData.typeCode,
        label: this.rowData.typeCodeName,
      };
      this.clientData = {
        customName: this.rowData.customerName,
        pkId: this.rowData.fkCustomerId,
      };
      if (this.sessionData.id == "delivery_supplier") {
        this.getClient(3);
      } else if (this.sessionData.id == "delivery_subcontract") {
        this.getClient(4);
      }
      this.warehouseData = {
        warehouseName: this.rowData.fkWarehouseName,
        pkId: this.rowData.fkWarehouseId,
      };
      this.presentationTime = this.rowData.serviceTime;
      this.details = this.rowData.orderOrdinaryDetails;
      this.details.forEach(item => {
        item.applyNum = item.grantNum
        item.fkUnitName = item.unitName
        item.materialName = item.materialName
        item.pkId = item.fkMaterialId
      })
      // warehousingName
      // warehousingIds
      // checkboxData1
      if (this.rowData.warehousingIds.length != 0) {
        this.checkboxData1 = [{ orderCode: this.rowData.warehousingName, pkId: this.rowData.warehousingIds[0] }]
      } else {
        // this.checkboxData1 = []
      }

      this.checkboxValue1 = this.rowData.warehousingIds[0] == undefined ? "" : this.rowData.warehousingIds[0];
      this.checkboxValue2 = this.rowData.relationOutInventoryVos;
    } else {
      this.getBusinessCode();
    }
    this.findSelfWarehouse();
  },
  methods: {
    clientShowClick() {
      this.clientShow = true
    },
    requestConfirmation() {
      this.checkboxData2 = []
      this.checkboxList2.forEach(item => {
        this.checkboxValue2.forEach(e => {
          if (e == item.pkId) {
            this.checkboxData2.push(item)
          }
        })
      })
      this.applyForShow = false

      // let arr = []
      // if (this.checkboxData2.length != 0) {
      //   this.checkboxData2.forEach(item => {
      //     arr = [...arr, ...item.materialVos]
      //   })
      //   arr.forEach(item => {
      //     item.supplyNum = item.supplyNum
      //     item.grantNum = item.issueNum
      //     item.materialPrice = item.price
      //     item.applyNum = item.supplyNum
      //     item.materialTypeName = item.fkTypeName

      //   })

      // }
      // console.log("xxxxxxxxxxx*********************xxxxxxxxxxxxxx")
      // console.log(this.checkboxData1)
      // console.log(arr)
      // this.details = arr
      // console.log("xxxxxxxxxxx*********************xxxxxxxxxxxxxx")
    },
    notarize() {
      this.checkboxData1 = []
      this.checkboxList1.forEach(item => {
        // this.checkboxValue1.forEach(e => {
        if (this.checkboxValue1 == item.pkId) {
          this.checkboxData1.push(item)
        }
        // })
      })
      this.storageShow = false
      let arr = []
      if (this.checkboxData1.length != 0) {
        this.checkboxData1.forEach(item => {
          arr = [...arr, ...item.materialVos]
        })
        arr.forEach(item => {
          item.supplyNum = item.supplyNum
          item.grantNum = item.issueNum
          item.materialPrice = item.price
          item.applyNum = item.issueNum
          item.materialTypeName = item.fkTypeName

        })

      }
      console.log("xxxxxxxxxxx*********************xxxxxxxxxxxxxx")
      console.log(this.checkboxData1)
      console.log(arr)
      this.details = arr
      this.checkboxData2 = []
      this.checkboxValue2 = []
      console.log("xxxxxxxxxxx*********************xxxxxxxxxxxxxx")

    },

    // 切换头部Tab
    currentChange(item) {
      this.current = item.index;
      console.log(this.current);
    },
    // 出库对象
    sessionClose() {
      this.sessionShow = false;
    },
    // 出库对象
    sessionConfirm(e) {
      this.sessionData = e.value[0];
      if (this.sessionData.id == "delivery_supplier") {
        this.getClient(3);
      } else if (this.sessionData.id == "delivery_subcontract") {
        this.getClient(4);
      }
      this.clientData = {
        customName: "",
        pkId: ""
      }
      this.sessionShow = false;
      this.checkboxData2 = []
      this.checkboxData1 = []
      this.checkboxValue1 = ""
      this.checkboxValue2 = []
    },
    // 分包商 供应商
    clientClose() {
      this.clientShow = false;
    },
    // 分包商 供应商
    clientConfirm(e) {
      // return console.log(e.value[0])
      if (e.value[0] == undefined) {
        return this.clientShow = false;
      }
      this.clientData = e.value[0];
      this.clientShow = false;
    },
    // 获取
    getClient(val) {
      let data = {
        supplierType: val == 4 ? '' : 1,
        customType: val
      }
      this.$api.getClient(data).then((res) => {
        if (res.code == 200) {
          this.clientList = [res.data];
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    // 出库仓库
    warehouseClose() {
      this.warehouseShow = false;
    },
    // 出库仓库
    warehouseConfirm(e) {
      this.warehouseData = e.value[0];
      this.warehouseShow = false;
    },
    // 业务时间
    dateSelect(e) {
      this.presentationTime = moment(e.value).format("YYYY-MM-DD");
      this.dateShow = false;
    },
    // 生成发料需求单号
    getBusinessCode() {
      this.$api.getBusinessCode({ businessType: 4 }).then((res) => {
        if (res.code == 200) {
          this.typeCode = res.data.typeCode;
          this.rowData.orderCode = res.data.typeCode;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    // 获取出库仓库列表
    findSelfWarehouse() {
      this.$api.findSelfWarehouse().then((res) => {
        if (res.code == 200) {
          this.warehouseList = [res.data];
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    // 添加入库单
    addStorage() {
      if (!this.warehouseData.pkId || !this.sessionData.id) {
        return uni.showToast({ title: "请先选择仓库或出库对象", icon: "none" });
      } else {
        this.storageShow = true;
        this.findOrderInputByWarehouseId();
      }
    },
    // 获取关联入库单
    findOrderInputByWarehouseId() {
      let data = {
        pageNum: 1,
        pageSize: 20,
        issueCode: this.sessionData.id,
        fkWarehouseId: this.warehouseData.pkId,
        orderCode: this.storageCode,
        fkCustomerId: this.clientData.pkId == undefined ? "" : this.clientData.pkId
      };
      this.$api.findOrderInputByWarehouseId(data).then((res) => {
        if (res.code == 200) {
          this.checkboxList1 = res.data;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    // 添加申请单
    addApplyFor() {
      if (!this.warehouseData.pkId || !this.sessionData.id) {
        return uni.showToast({ title: "请先选择仓库或出库对象", icon: "none" });
      }
      if (!this.sessionData.label || !this.sessionData.id) {
        return uni.showToast({ title: "请先选择仓库或出库对象", icon: "none" });
      }
      if (this.sessionData.label == '无') {
        return uni.showToast({ title: "出库对象为无不能选择申请单", icon: "none" });
      }
      if (!this.clientData.customName || !this.clientData.customName) {
        return uni.showToast({ title: "请先选择分包商或供应商", icon: "none" });
      }
      this.applyForShow = true;
      this.findOrderApplyByCustomerId();

    },
    // 获取申请单列表
    findOrderApplyByCustomerId() {
      // {
      //       label: "供应商",
      //       id: "delivery_supplier",
      //     },
      //     {
      //       label: "分包商",
      //       id: "delivery_subcontract",
      let data = {
        pageNum: 1,
        pageSize: 20,
        customerType: this.sessionData.id == 'delivery_supplier' ? 3 : this.sessionData.id == 'delivery_subcontract' ? 4 : "",
        fkCustomerId: this.clientData.pkId,
        // fkWarehouseId: this.warehouseData.pkId,
        orderCode: this.applyForCode,
        inputIds: this.checkboxValue1
      };
      this.$api.findOrderApplyByCustomerId(data).then((res) => {
        if (res.code == 200) {
          this.checkboxList2 = res.data;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },

    // 取消新增修改
    abrogate() {
      uni.navigateBack();
    },
    // 下一步
    nextStep() {
      this.current = 1;
    },
    // 上一步
    lastStep() {
      this.current = 0;
    },
    // 保存
    preserve(val) {
      let data = {
        fkWarehouseId: this.warehouseData.pkId, //仓库Id
        issueCode: val,
        leaderName: this.rowData.leaderName,
        orderCode: this.rowData.orderCode,
        serviceTime: this.presentationTime,
        typeCode: this.sessionData.id,
        applyIds: this.checkboxValue2 == null ? [] : this.checkboxValue2,
        warehousingIds: this.checkboxValue1.length == 0 ? [] : [this.checkboxValue1],
        receiptAddress: this.rowData.receiptAddress,
        remark:this.rowData.remark
      };
      data.fkCustomerId =
        this.sessionData.id == "delivery_unit" ? 0 : this.clientData.pkId;
      data.isUpdate = this.typeCode == this.rowData.orderCode ? 0 : 1;
      let arr = [];
      this.details.forEach((item) => {
        arr.push({
          fkMaterialId: item.pkId,
          grantNum: item.grantNum,
          passStatus: item.passStatus,
          fkCustomerId: item.fkCustomerId,
          materialPrice: item.materialPrice
        });
      });
      data.orderOrdinaryDetails = arr;

      if (this.rowData.itemTitle != "编辑普通材料发料") {
        this.$api.orderOrdinaryApplyAdd(data).then((res) => {
          if (res.code == 200) {
            // uni.navigateTo({
            //   url: "/pages/material/generalStoreIssue?",
            // });
            uni.showToast({ icon: "none", title: res.msg });
            setTimeout(() => {
              let pages = getCurrentPages()
              let prevPage = pages[pages.length - 2]; // 上一页面实例
              prevPage.$vm.resh() // 调用上一页 定义的方法
              uni.navigateBack({ delta: 1 });
            }, 500)
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
      } else {
        data.pkId = this.rowData.pkId;
        this.$api.orderOrdinaryApplyUpdate(data).then((res) => {
          if (res.code == 200) {
            // uni.navigateTo({
            //   url: "/pages/material/generalStoreIssue?",
            // });
            uni.showToast({ icon: "none", title: res.msg });
            setTimeout(() => {
              let pages = getCurrentPages()
              let prevPage = pages[pages.length - 3]; // 上一页面实例
              prevPage.$vm.resh() // 调用上一页 定义的方法
              uni.navigateBack({ delta: 2 });
            }, 500)
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
      }
    },
    tableAdd() {
      this.showLinkTitle = "新增物料";
      this.materialData = {
      }
      this.showLinkPop = true;
    },
    itemClick(item, idx) {
      if (this.checkboxData1.length == 0) {
        this.showLinkTitle = "编辑物料";

        this.showLinkPop = true;
        this.materialData = item
        this.itemIndex = idx
      }

      //       item.supplyNum = item.supplyNum
      // item.grantNum = item.issueNum
      // item.materialPrice = item.price
    },
    closeLinkPop() {

      this.showLinkPop = false;
    },
    materialDataDelete() {
      this.details.splice(this.itemIndex, 1);
      this.closeLinkPop();
    },
    materialDataSave() {
      this.materialData.applyNum = this.materialData.grantNum
      this.details[this.itemIndex] = this.materialData
      this.closeLinkPop();
    },
    // 物料类型
    materialTypeSearch(id, item) {
      if (this.checkboxData1.length != 0) {
        return
      }
      if (!this.sessionData.id) {
        return uni.showToast({ icon: "none", title: "请选择出库对象" });
      }
      if (!this.warehouseData.pkId) {
        return uni.showToast({ icon: "none", title: "请选择出库仓库" });
      }
      this.selectMaterial();
      this.$refs.materialSelect.selectShow = true;
      if (this.materialData.materialName == undefined || this.materialData.materialName.length == 0) {
        this.$refs.materialSelect.treeData2 = [];
        this.$refs.materialSelect.checkedList = [];
      }
    },

    // 查询物料
    selectMaterial() {
      let data = {
        pageNum: 1,
        pageSize: 1000,
        type: 2,
        outTypeCode: this.sessionData.id,
        fkWarehouseId: this.warehouseData.pkId,
        materialTypeCode: this.details.length ? this.details[0].typeCode : ""
      };
      if (this.sessionData.id == "delivery_unit") {
        data.fkCustomId = 0;
      } else {
        data.fkCustomId = this.clientData.pkId;
      }
      this.$api.searchMaterialPage(data).then((res) => {
        if (res.code == 200) {
          this.treeData = res.data;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    // 物资选中回调
    checked(item) {
      console.log(item);
      item.materialPrice = item.price
      this.materialData = item;
    },
    // 添加物料
    addition() {
      this.materialData.applyNum = this.materialData.grantNum
      this.materialData.materialTypeName = this.materialData.fkTypeName


      if (this.materialData.materialName == undefined || this.materialData.materialName.length == 0) {
        return uni.showToast({ icon: "none", title: "请选择物料" });
      }
      if (this.materialData.grantNum == undefined || this.materialData.grantNum.length == 0) {
        return uni.showToast({ icon: "none", title: "请填写出库数量" });
      }
      if (this.materialData.grantNum == 0) {
        return uni.showToast({ icon: "none", title: "出库数量不能为0" });
      }
      let hasId1 = this.details.find(item => item.pkId === this.materialData.pkId);
      if (hasId1 == undefined) {
        this.details.push(this.materialData);
        this.closeLinkPop();
      } else {
        return uni.showToast({ icon: "none", title: "列表已存在该物料" });
      }
      // materialData.grantNum
      //  materialName
      // console.log("77777777777777777777777")
      // console.log(this.materialData)
      // console.log("77777777777777777777777")
      // this.details.push(this.materialData);
      // this.closeLinkPop();
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  /deep/ .u-tabs__wrapper__nav__item {
    flex: 1;
  }
}

.item-edit-form {
  padding: 8px 16px;
  background: rgb(255, 255, 255);
  margin-top: 2px;
}

.form-title {
  margin-left: 20rpx;
  line-height: 60rpx;
}

.form-content {
  padding-left: 6px;
  height: 80rpx;
  background: #fff;
}

.form-content-lh {
  line-height: 80rpx;
  background-color: #f3f3f3;
}

.select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  background-color: #fff;
}

.multiSelect {
  background-color: #fff;
  padding: 10rpx 0;
  padding-left: 40rpx;

  .item-code {
    display: flex;
    align-items: center;
    line-height: 100rpx;
    border-bottom: 1px solid #eee;

    .fileName {
      width: 600rpx;
      font-size: 28rpx;
    }
  }

  .add-coder {
    width: 160rpx;
    height: 60rpx;
    margin-top: 19rpx;
    background-color: #ebf4ff;
    color: #2b8fed;
    display: inline-grid;
  }
}

.name {
  width: 520rpx;
  // margin-bottom: 20rpx;
  font-weight: 600;
  font-size: 30rpx;
  overflow: hidden;
  /*超出部分隐藏*/
  white-space: nowrap;
  /*禁⽌换⾏*/
  text-overflow: ellipsis;
  /*省略号*/
}

.box-btn {
  display: flex;
  position: fixed;
  width: 100%;
  bottom: 0;
}

.table-btn {
  display: inline-block;
  background: #ebf4ff;
  color: #2b8fed;
  font-size: 10px;
  padding: 6px 23px;
  margin: 6px auto;
  margin-left: 41%;
}

.showLinkPop {
  height: 1000rpx;
  background-color: #2a82e4;

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    // line-height: 80rpx;
    padding: 0 20rpx;
    color: #fff;
    font-size: 28rpx;
  }

  .content {
    height: 825rpx;
    background-color: #f7f7ff;
    padding-top: 30rpx;
    font-size: 28rpx;
    border-radius: 20rpx 20rpx 0 0;

    .title {
      padding-left: 20rpx;
      font-weight: 600;
      margin-bottom: 10rpx;
    }

    .inputs {
      display: flex;
      align-items: center;
      height: 80rpx;
      padding: 0 20rpx;
      background-color: #fff;
      margin-bottom: 20rpx;
    }

    .searchRes {
      overflow: auto;
      height: 400rpx;
      background-color: #fff;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .footer {
    display: flex;
    bottom: 0;
    justify-content: space-evenly;
    align-items: center;
    height: 100rpx;
    background-color: #fff;

    .btns {
      width: 300rpx;
      margin: 2px;
    }

    .cancle {
      background-color: #eeeeee;
      color: #aaaaaa;
    }
  }
}

.voucher-btn {
  display: inline-block;
  color: #2b8fed;
  background: #ebf4ff;
  padding: 6px 13px;
  font-size: 12px;
  font-weight: 500;
}
.form-content-1{
    background: none;
}
.selectShow {
  height: 800rpx;

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    // line-height: 80rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
  }

  .content {
    // border-top: 1px solid;
  }
}
</style>
