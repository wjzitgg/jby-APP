<template>
  <view class="wrapper">
    <u-navbar
      :leftText="rowData.itemTitle"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <view style="background: #fff">
        <u-tabs
          class="tabs"
          :list="list1"
          :current="current"
          @change="currentChange"
          :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
        >
        </u-tabs>
      </view>
      <view v-show="current == 0">
        <view style="padding-bottom: 60px">
          <view>
            <view class="form-title">申请单号</view>
            <u--input
              placeholder="请输入内容"
              border="none"
              v-model="rowData.orderCode"
              customStyle=""
              class="form-content"
              clearable
               maxlength="50"
            ></u--input>
          </view>
              <view>
            <view class="form-title">出库单位</view>
            <view class="select" @click="outboundUnit = true">
              <view class="name">{{ outboundUnitData.keyVal }}</view>
              <u-icon
                name="arrow-down-fill"
                class="icons"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
            <u-picker
              :show="outboundUnit"
              :columns="outboundUnitList"
              keyName="keyVal"
              @cancel="receiveClose"
              @confirm="outboundUnitConfirm"
            ></u-picker>
          </view>
          <view>
            <view class="form-title">负责人</view>
            <u--input
              placeholder="请输入内容"
              border="none"
              v-model="rowData.leaderName"
              customStyle=""
              class="form-content"
              clearable
              maxlength="25"
            ></u--input>
          </view>
          <view>
            <view class="form-title">业务时间</view>
            <view class="select" @click="dateShow = true">
              <view class="name">{{ presentationTime }}</view>
              <u-icon
                name="calendar-fill"
                class="icons"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
            <u-datetime-picker
              :show="dateShow"
              v-model="value1"
              @cancel="dateShow = false"
              @confirm="dateSelect"
              mode="datetime"
            ></u-datetime-picker>
          </view>
          <view>
            <view class="form-title">关联项目</view>
            <view class="select" @click="receiveShow = true">
              <view class="name">{{ receiverData.projectName }}</view>
              <u-icon
                name="arrow-down-fill"
                class="icons"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
            <u-picker
              :show="receiveShow"
              :columns="receiverList"
              keyName="projectName"
              @cancel="receiveClose"
              @confirm="receiveConfirm"
            ></u-picker>
          </view>
          <view>
            <view class="form-title">计划采购单</view>
            <view class="select" @click="multipleShow = true">
              <view class="name">{{ multipleData.orderCode }}</view>
              <u-icon
                name="arrow-down-fill"
                class="icons"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
            <u-picker
              :show="multipleShow"
              :columns="multipleList"
              keyName="orderCode"
              @cancel="receiveClose"
              @confirm="multipleConfirm"
            ></u-picker>
            <!-- <multiple-picker :show="multipleShow" :columns="multipleList" >
            </multiple-picker> -->
          </view>
          <view>
            <view class="form-title">备注</view>
            <u--input
              placeholder="请输入内容"
              border="none"
              v-model="rowData.remark"
              customStyle=""
              class="form-content"
              clearable
              maxlength="100"
            ></u--input>
          </view>
        </view>
      </view>
      <view class="table_detail" v-show="current == 1" style="margin-top: 2px">
        <table>
          <thead>
            <tr>
              <th style="width: 40px">序号</th>
              <th>物料明细</th>
              <th>单位</th>
              <th>申请数量</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in details"
              :key="index"
              @click="itemClick(item, index)"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ item.fkTypeName }}</td>
              <td>{{ item.fkUnitName }}</td>
              <td>{{ item.applyNum }}</td>
            </tr>
          </tbody>
        </table>
        <view class="table-btn" @click="tableAdd">添加物料</view>
      </view>
    </view>
    <view class="box-btn" v-if="current == 0">
      <u-button
        style="background: #eeeeee"
        class="btns cancle"
        type="default"
        text="取消"
        @click="abrogate"
      ></u-button>
      <u-button
        class="btns"
        type="primary"
        text="下一步"
        @click="nextStep"
      ></u-button>
    </view>
    <view class="box-btn" v-else>
      <u-button
        style="background: #eeeeee"
        class="btns cancle"
        type="default"
        text="上一步"
        @click="lastStep"
      ></u-button>
      <u-button
        class="btns"
        type="primary"
        text="保存"
        @click="preserve"
      ></u-button>
    </view>
    <u-popup :show="showLinkPop">
      <view class="showLinkPop">
        <view class="head">
          <view class="name">{{ showLinkTitle }}</view>
          <u-icon
            name="close"
            color="#fff"
            class="closeBtn"
            @click="closeLinkPop"
          ></u-icon>
        </view>
        <view class="content">
          <view>
            <view class="form-title">物料</view>
            <view class="select" @click="materialTypeSearch()">
              <view class="name">{{ materialData.fkTypeName }}</view>
              <u-icon
                name="arrow-down-fill"
                class="icons"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
          </view>
          <view>
            <view class="form-title">当前库存</view>
            <u--input
              placeholder=""
              border="none"
              v-model="materialData.supplyNum"
              customStyle=""
              suffixIcon="lock-fill"
              disabled
              class="form-content"
              clearable
            ></u--input>
          </view>
          <view>
            <view class="form-title">申请数量</view>
            <u--input
              placeholder="请输入内容"
              border="none"
              v-model="materialData.applyNum"
              customStyle=""
              class="form-content"
              clearable
            ></u--input>
          </view>
        </view>
        <view class="footer" v-if="showLinkTitle == '新增物料'">
          <u-button
            class="btns cancle"
            type="default"
            text="取消"
            @click="closeLinkPop"
          ></u-button>
          <u-button
            class="btns"
            type="primary"
            text="添加"
            @click="addition"
          ></u-button>
        </view>
        <view class="footer" v-else>
          <u-button
            class="btns cancle"
            type="default"
            text="取消"
            @click="closeLinkPop"
          ></u-button>
          <u-button
            class="btns"
            type="error"
            text="删除"
            @click="expurgate"
          ></u-button>
          <u-button
            class="btns"
            type="primary"
            text="保存"
            @click="modification"
          ></u-button>
        </view>
      </view>
    </u-popup>
    <materialSelect
      :treeData="treeData"
      ref="materialSelect"
      @checked="checked"
    ></materialSelect>
  </view>
</template>

<script>
import moment from "moment";
import materialSelect from "@/components/material-select/material-select.vue";
import multiplePicker from "@/components/multiple-picker/multiple-picker.vue"
export default {
  components: {
    materialSelect,multiplePicker
  },
  data() {
    return {
      list1: [{ name: "基础信息" }, { name: "物料信息" }],
      rowData: {},
      details: [],
      current: 0,
      contractDetails: {},

      // =============
      dateShow: false,
      value1: Number(new Date()),
      presentationTime: "",
      receiverList: [], //关联单位
      receiverData: {
        projectName:""
      },
      receiveShow: false, //关联项目弹窗状态
      showLinkPop: false,
      showLinkTitle: "",
      // selectShow: false,
      typeList: [],
      indexList: [],
      itemData: {},
      materialList: [],
      recordLis: [],
      materialData: {},
      typeCode: "",
      treeData: [],
      detailsIndex: 0,
      outboundUnit:false,
      outboundUnitList:[],
      outboundUnitData:{},
      multipleShow:false,
      multipleList:[],
      multipleData:{
        orderCode:""
      }
    };
  },
  onLoad(item) {
    this.init();
    this.rowData = JSON.parse(item.row);
    if (this.rowData.itemTitle == "编辑物资申请") {
      console.log(this.rowData);
      this.details = this.rowData.orderApplyMaterialDetails;
      this.presentationTime = this.rowData.serviceTime;
      this.receiverData.projectName = this.rowData.projectName;
      this.receiverData.pkId = this.rowData.fkBidProjectId;
      if(this.rowData.reOutApplyVoList!=null && this.rowData.reOutApplyVoList.length != 0){
        this.findDictProjectId(this.rowData.fkBidProjectId)
      }
      // fkMaterialId
      // this.typeCode = this.rowData.orderCode;
      if(this.rowData.materialDetailsVoList != null && this.rowData.materialDetailsVoList.length!= 0){
        this.rowData.materialDetailsVoList.forEach(item=>{
        item.pkId = item.fkMaterialId
      })
      }

      this.details = this.rowData.materialDetailsVoList
      // this.outboundUnitData.keyVal = this.rowData.issueCode
      
      console.log(this.outboundUnitList)
      console.log(this.rowData)
    } else {
      this.getBusinessCode();
      this.rowData.leaderName = uni.getStorageSync("user").userName
    }
   
  },
  methods: {
    getBusinessCode() {
      this.$api.getBusinessCode({ businessType: 2 }).then((res) => {
        if (res.code == 200) {
          this.typeCode = res.data.typeCode;
          this.rowData.orderCode = res.data.typeCode;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    currentChange(item) {
      this.current = item.index;
      console.log(this.current);
    },
    init() {
      // this.$api
      //   .getItemsByProjectId({ projectId: uni.getStorageSync("nowProId") })
      //   .then((res) => {
      //     if (res.code == 200) {
      //       // this.receiverList = [res.data];
      //       console.log("=============1111=======================")
      //       console.log(res.data)
      //       console.log("==============1111======================")
      //     } else {
      //       uni.showToast({ icon: "none", title: res.msg });
      //     }
      //   });
      this.projectListNoUserId();
      this.findDictBySupplyType();
    },

    // 接收单位
    receiveClose() {
      this.receiveShow = false;
      this.outboundUnit = false
      this.multipleShow = false
    },
    // 接收单位
    receiveConfirm(e) {
      // return console.log(e)
      if(e.value[0] == undefined){
        return  this.receiveShow = false;
      }
      this.receiverData = e.value[0];
      // console.log(e.value[0])
      this.findDictProjectId(e.value[0].pkId)
      this.receiveShow = false;
      
    },
    multipleConfirm(e){
      if(e.value[0] == undefined){
        return  this.multipleShow = false;
      }
      this.multipleData = e.value[0];
      this.multipleShow = false;
      // return console.log(e)
      this.details = e.value[0].materialDetailsVoList
      this.details.forEach(item=>{
        item.fkTypeName = item.materialName
        item.fkUnitName = item.unitName
        item.applyNum = item.purchaseNum
        item.pkId = item.fkMaterialId
        item.materialPrice = item.price
      })
    },

    findDictProjectId(id){
      let data = {
        pageNum:1,
        pageSize:50,
        fkBidProjectId:id
      }
      this.$api.findDictProjectId(data).then(res=>{
        if(res.code == 200){
          res.data.forEach(item=>{
            item.label = item.orderCode
            item.value = item.pkId
          })
          this.multipleList =[res.data]
          if (this.rowData.itemTitle == "编辑物资申请") {
            res.data.forEach(item=>{
              if(item.pkId == this.rowData.reOutApplyVoList[0].fkPurchaseId){
                  this.multipleData = item
              }
            })
          }
        }else{
          uni.showToast({ icon: "none", title: res.msg });
        }
      })
    },
    outboundUnitConfirm(e){
      if(e.value[0] == undefined){
        return  this.outboundUnit = false;
      }
      this.outboundUnitData = e.value[0];
      this.outboundUnit = false;
    },
    // 业务时间
    dateSelect(e) {
      this.presentationTime = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
      this.dateShow = false;
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
    preserve() {
      let data = {
        applyCode: 0,
        fkBidProjectId: this.receiverData.pkId,
        issueCode:this.outboundUnitData.keyName,
        leaderName: this.rowData.leaderName,
        orderCode: this.rowData.orderCode,
        serviceTime: this.presentationTime,
        remark: this.rowData.remark,
        fkPurchaseId:this.multipleData.pkId
      };
      data.isUpdate = this.typeCode == this.rowData.orderCode ? 0 : 1;
      let arr = [];
      this.details.forEach((item) => {
        arr.push({
          applyNum: item.applyNum,
          fkMaterialId: item.pkId,
          providedNum: item.providedNum,
          materialPrice:item.materialPrice
        });
      });
      data.materialDetailList = arr;

      if (this.rowData.itemTitle != "编辑物资申请") {
        this.$api.orderOutApplyAdd(data).then((res) => {
          if (res.code == 200) {
            uni.navigateTo({
              url: "/pages/often/stock/request?",
            });
            uni.showToast({ icon: "none", title: res.msg });
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
      } else {
        data.pkId = this.rowData.pkId;
        this.$api.orderOutApplyUpdate(data).then((res) => {
          if (res.code == 200) {
            uni.navigateTo({
              url: "/pages/often/stock/request?",
            });
            uni.showToast({ icon: "none", title: res.msg });
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
      }
    },
    // 添加物料
    tableAdd() {
      this.materialData = {};
      this.showLinkTitle = "新增物料";
      this.showLinkPop = true;
    },
    // 编辑物料
    itemClick(item, idx) {
      this.detailsIndex = idx;
      this.materialData = item;
      this.showLinkTitle = "编辑物料";
      this.showLinkPop = true;
    },
    closeLinkPop() {
      this.showLinkPop = false;
    },
    // 物料类型
    materialTypeSearch() {
      this.selectMaterial();
      this.$refs.materialSelect.selectShow = true;
    },
    // 查询物料
    selectMaterial() {
      let data = {
        pageNum: 1,
        pageSize: 1000,
        type: 1,
        outTypeCode:"delivery_supplier",
        materialTypeId: this.itemData.pkId,
        fkBidProjectId: uni.getStorageSync("nowProId"),
        materialTypeCode:this.details.length?this.details[0].typeCode:""
      };
      // searchMaterialPage
      this.$api.searchMaterialPage(data).then((res) => {
        if (res.code == 200) {
          // res.data.records.forEach((item) => {
          //   item.itemName = item.fkTypeName;
          // });

          this.treeData = res.data;
          // this.indexList = res.data.records;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    // 物资选中回调
    checked(item) {
      console.log(item);
      this.materialData = item;
    },
    // 删除物料
    expurgate() {
      this.details.splice(
        this.details.findIndex((item) => item.pkId === this.materialData.pkId),
        1
      );
      this.showLinkPop = false;
    },
    modification() {
      this.details[this.detailsIndex] = this.materialData;
      this.showLinkPop = false;
    },
    // 添加物料
    addition() {
      this.details.push(this.materialData);
      this.closeLinkPop();
    },
    projectListNoUserId() {
      this.$api.projectBidByProjectId().then(res => {
        if (res.code === 200) {
          // console.log("xxxxxxxxxxxxxxxxxxxxxx")
          // console.log(res)
          // console.log("xxxxxxxxxxxxxxxxxxxxxx")
          // this.typeList = [
          //   { label: "全部", value: "" },
          //   ...res.data.map((item) => ({
          //     ...item,
          //     label: item.investorName,
          //     value: item.pkId,
          //   })),
          // ];
          this.receiverList = [res.data]
            //           console.log("====================================")
            // console.log(res.data)
            // console.log("====================================")
          // console.log(this.typeList);
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    findDictBySupplyType(){
      this.$api.findDictBySupplyType().then(res=>{
        if(res.code == 200){
          this.outboundUnitList = [res.data]
          if(this.rowData.itemTitle == "编辑物资申请"){
            res.data.forEach(item=>{
              if(item.keyName == this.rowData.issueCode){
                this.outboundUnitData = item
              }
            })
          }
        }else{
          uni.showToast({ title: res.msg, icon: "none" });
        }
      })
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
  height: 80rpx;
  background: #fff;
}
.select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  background-color: #fff;
}
.name {
  width: 520rpx;
  // margin-bottom: 20rpx;
  font-weight: 600;
  font-size: 30rpx;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁⽌换⾏*/
  text-overflow: ellipsis; /*省略号*/
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
  height: 800rpx;
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
    height: 620rpx;
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
    border-top: 1px solid;
  }
}
</style>
