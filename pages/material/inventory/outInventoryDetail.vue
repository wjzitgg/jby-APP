<template>
  <view class="wrapper">
    <u-navbar leftText="出库单详情" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="sticky">
      <u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="false" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}">
      </u-tabs>
    </view>
    <view class="pad"></view>
    <view class="content">
        <view v-if="current == 0" style="width:750rpx">
			  <tableForm :pageHeight="false" :pageMr="false" :list="[
          		{name:'出库单号',value:details.orderCode,show:true},
          		{name:'出库对象',value:outIsscodeList[details.issueCode],show:true},
          		{name:'标段项目',value:details.projectName,show:[6, 7].includes(user.orgType) && details.issueCode !== 'issue_unit'},
          		{name:'出库仓库',value:details.warehouseName,show:true},
          		{name:'分包商',value:details.warehouseName,show:details.issueCode === 'delivery_subcontract'},
          		{name:'供应商',value:details.warehouseName,show:details.issueCode === 'delivery_supplier'},
          		{name:'分项工程',value:details.orderItemList && details.orderItemList.length? details.orderItemList[0].itemName: '',show:details.issueCode === 'delivery_position'},
          		{name:'关联发料单',value:!fkOrdinaryId ? '无' : fkOrdinaryId.orderCode,show:[4, 5].includes(user.orgType)},
          		{name:'供货申请单',value:fkOutApplyId.orderCode ? fkOutApplyId.orderCode : '',show:user.orgType === 6 && details.issueCode !== 'delivery_unit'},
          		{name:'关联采购计划单',value:fkPurchaseId.orderCode ? fkPurchaseId.orderCode : '无',show:user.orgType === 6 && details.issueCode !== 'delivery_unit'},
          		{name:'关联入库单',value:fkInputIdList.length? fkInputIdList.map((item) => item.orderCode).join(','): '无',show:[4, 5, 7].includes(user.orgType)},
              {name:'关联申请单',value:fkApplyIdList.length? fkApplyIdList.map((item) => item.orderCode).join(','): '无',show:[4, 5].includes(user.orgType) && details.issueCode === 'delivery_subcontract'},
              {name:'填表人',value:details.leaderName,show:true},
              {name:'业务时间',value:details.serviceTime,show:true},
              {name:'制单人',value:details.createUserName,show:true},
              {name:'录入时间',value:details.createTime,show:true},
              {name:'单据状态',value:outStatesList[details.inventoryCode],show:true},
              {name:'收料地址',value:details.receiptAddress,show:true},
              {name:'备注',value:details.remark,show:true},
              {name:'车牌号',value:details.vehicleNum,show:true},
              {name:'运输司机',value:details.driverName,show:true},
              {name:'联系方式',value:details.driverPhone,show:true},
              {name:'签收人',value:details.receiverName,show:details.receiverStatus === 1},
              {name:'签收时间',value:details.receiverTime,show:details.receiverStatus === 1},
          		]"
          		></tableForm>
			  </view>
      <!-- <view v-if="current === 0">
        <u--form labelPosition="left" class="form" :borderBottom="true" :key="details.issueCode">
          <u-form-item label="出库单号" labelWidth="80">
            <view>{{ details.orderCode }}</view>
          </u-form-item>
          <u-form-item label="出库对象" labelWidth="80">
            <view>{{ outIsscodeList[details.issueCode] }}</view>
          </u-form-item>
          <u-form-item label="标段项目" labelWidth="80" v-if="[6, 7].includes(user.orgType) &&
            details.issueCode !== 'issue_unit'
            ">
            <view>{{ details.projectName }}</view>
          </u-form-item>
          <u-form-item label="出库仓库" labelWidth="80">
            <view>{{ details.warehouseName }}</view>
          </u-form-item>
          <u-form-item label="分包商" labelWidth="80" v-if="details.issueCode === 'delivery_subcontract'">
            <view>{{ details.customerName }}</view>
          </u-form-item>
          <u-form-item label="供应商" labelWidth="80" v-if="details.issueCode === 'delivery_supplier'">
            <view>{{ details.customerName }}</view>
          </u-form-item>
          <u-form-item label="分项工程" labelWidth="80" v-if="details.issueCode === 'delivery_position'">
            <view>{{
              details.orderItemList && details.orderItemList.length
              ? details.orderItemList[0].itemName
              : ""
            }}</view>
          </u-form-item>
          <u-form-item label="关联发料单" labelWidth="100" v-if="[4, 5].includes(user.orgType)">
            <view>{{ !fkOrdinaryId ? "无" : fkOrdinaryId.orderCode }}</view>
          </u-form-item>
          <u-form-item label="供货申请单" labelWidth="120" v-if="user.orgType === 6 && details.issueCode !== 'delivery_unit'">
            <view>{{ fkOutApplyId.orderCode ? fkOutApplyId.orderCode : "" }}</view>
          </u-form-item>
          <u-form-item label="关联采购计划单" labelWidth="120"
            v-if="user.orgType === 6 && details.issueCode !== 'delivery_unit'">
            <view>{{
              fkPurchaseId.orderCode ? fkPurchaseId.orderCode : "无"
            }}</view>
          </u-form-item>
          <u-form-item label="关联入库单" labelWidth="100" v-if="[4, 5, 7].includes(user.orgType)">
            <view>{{
              fkInputIdList.length
              ? fkInputIdList.map((item) => item.orderCode).join(",")
              : "无"
            }}</view>
          </u-form-item>
          <u-form-item label="关联申请单" labelWidth="100" v-if="[4, 5].includes(user.orgType) && details.issueCode === 'delivery_subcontract'">
            <view>{{
              fkApplyIdList.length
              ? fkApplyIdList.map((item) => item.orderCode).join(",")
              : "无"
            }}</view>
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
            <view>{{ outStatesList[details.inventoryCode] }}</view>
          </u-form-item>
          <u-form-item label="收料地址" labelWidth="80">
            <view class="remark">{{ details.receiptAddress }}</view>
          </u-form-item>
          <u-form-item label="备注" labelWidth="80">
            <view class="remark">{{ details.remark }}</view>
          </u-form-item>
          <u-form-item label="车牌号" labelWidth="80">
            <view>{{ details.vehicleNum }}</view>
          </u-form-item>
          <u-form-item label="运输司机" labelWidth="80">
            <view>{{ details.driverName }}</view>
          </u-form-item>
          <u-form-item label="联系方式" labelWidth="80">
            <view>{{ details.driverPhone }}</view>
          </u-form-item>
          <u-form-item label="签收人" labelWidth="80" v-if="details.receiverStatus === 1">
            <view>{{ details.receiverName }}</view>
          </u-form-item>
          <u-form-item label="签收时间" labelWidth="80" v-if="details.receiverStatus === 1">
            <view>{{ details.receiverTime }}</view>
          </u-form-item>
        </u--form>
      </view> -->
      <view v-if="current === 1">
        <view class="table_detail table_empty table_height">
          <table v-if="list.length">
            <thead>
              <tr>
                <th>序号</th>
                <th>物料名称</th>
                <th>物料分类</th>
                <th>检测状态</th>
                <th v-if="user.orgType!=6">供应商</th>
                <th>单位</th>
                <!-- <th>当前库存量</th> -->
                <th>本次出库数量</th>
                <th>物料单价</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list" :key="index">
                <td>
                  {{ index + 1 }}
                </td>
                <td>{{ item.materialName }}</td>
                <td>{{ item.fkTypeName }}</td>
                <td>
                  {{
                    item.passStatus === 0
                    ? "合格"
                    : item.passStatus === 1
                      ? "不合格"
                      : item.passStatus === 2
                        ? "待检测"
                        : ""
                  }}
                </td>
                <td v-if="user.orgType!=6">
                  {{ item.fkCustomerId === "0" ? "无" : item.customerName }}
                </td>
                <td>{{ item.fkUnitName }}</td>
                <!-- <td>{{ item.supplyNum }}</td> -->
                <td>{{ item.stockNum }}</td>
                <td>{{ item.materialPrice }}</td>
              </tr>
            </tbody>
          </table>
          <u-empty v-if="list.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
        </view>
      </view>
      <view class="pdb"></view>
      <view class="footer">
        <view class="btns green" v-if="details.inventoryCode === '0'" @click="edit">编辑</view>
        <view class="btns red" v-if="details.deleteStatus" @click="delBtn" >删除</view >
        <view class="btns blue" @click="entering" v-if="getObj.enterButton">录入签收信息</view>
      </view>
    </view>
    <u-popup :show="popShow2" :round="20" mode="center">
      <view class="popup2">
        <view class="popup2-head">
          <view class="name">录入签收信息</view>
          <u-icon name="close" color="#fff" class="closeBtn" @click="closePop2"></u-icon>
          <!-- <view ></view> -->
        </view>
        <view class="popup2-content">
          <view>
            <view class="title">签收人</view>
            <view class="inputs">
              <u--input v-model="enterData.receiverName" border="none" clearable></u--input>
            </view>
          </view>
          <view>
            <view class="title">签收时间</view>
            <view class="inputs select" @click="openDateSelect">
              <view class="name">{{ enterData.receiverTime }}</view>
              <u-icon name="calendar" class="icons" color="#2a82e4" size="16"></u-icon>
            </view>
          </view>
        </view>
        <view class="pop-pdb"></view>
        <view class="footer">
          <view class="foot-btn cancle btns2" @click="closePop2">取消</view>
          <view class="foot-btn save btns2" @click="saveEnter">保存</view>
        </view>
      </view>
      <u-datetime-picker :show="dateSelectShow" v-model="dates" mode="datetime" @confirm="dateSelect"
        @cancel="closeDateSelect"></u-datetime-picker>
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
      tabList: [{ name: "出库信息" }, { name: "物料信息" }],
      current: 0,
      getObj: {},
      details: {
        issueCode: "",
      },
      list: [],
      outIsscodeList: {
        delivery_unit: "无",
        delivery_supplier: "供应商",
        delivery_subcontract: "分包商",
        delivery_project: "项目部",
        delivery_position: "施工部位",
      },
      outStatesList: ["草稿", "运输中", "被拒收", "已完成"],
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
      },
      dateSelectShow: false,
      dates: "",
      dateSelectShow2: false,
      dates2: "",
      pickerShow: false,
      pickerList: [],
      warehouserList: [],
      isUpdate: 0,
      fkPurchaseId: "",
      fkInputIdList: [],
      fkOrdinaryId: "",
      fkApplyIdList: [],
      popShow2: false,
      enterData: {
        receiverName: '',
        receiverTime: ''
      },
      fkOutApplyId: {}
    };
  },
  onLoad(options) {
    let obj = JSON.parse(options.obj);
    console.log(obj);
    this.getObj = obj;
    this.dates = Number(new Date());
    this.dates2 = Number(new Date());
    this.findOutById();
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
            this.$api.delOutInventory({pkId:this.details.pkId}).then(res=>{
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
    currentChange(e) {
      this.current = e.index;
    },
    findWarehouseByProjectId(bidProjectId) {
      this.$api.findWarehouseByProjectId({ bidProjectId }).then((res) => {
        if (res.code === 200) {
          let arr = res.data.map((item) => ({
            ...item,
            value: item.pkId,
            label: item.warehouseName,
          }));
          this.warehouserList = arr;
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    findOutById() {
      uni.showLoading({ mask: true });
      this.$api
        .findOutById({ pkId: this.getObj.pkId })
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.details = res.data;
            this.list = res.data.orderDetailsList.map((item) => ({
              ...item,
              fkUnitName: item.unitName,
            }));
            if (this.user.orgType === 6 && res.data.issueCode !== "delivery_unit") {
              let arr5 = res.data.orderRelationList.filter(item => item.orderType == 6);
              this.fkOutApplyId = arr5.length ? arr5[0] : { pkId: "" };
              this.details.fkOutApplyId = arr5.length ? arr5[0].pkId : "";
            }
            let arr1 = res.data.orderRelationList.filter(
              (item) => item.orderType == 2
            ); //物资申请单
            let arr2 = res.data.orderRelationList.filter(
              (item) => item.orderType == 3
            ); // 入库单
            let arr3 = res.data.orderRelationList.filter(
              (item) => item.orderType == 1
            ); // 采购计划单
            let arr4 = res.data.orderRelationList.filter(
              (item) => item.orderType == 4
            ); // 发料单
            this.fkApplyIdList = arr1;
            this.fkInputIdList = arr2;
            this.fkPurchaseId = arr3.length ? arr3[0] : "";
            this.fkOrdinaryId = arr4.length ? arr4[0] : "";
            this.details.fkApplyIdList = arr1.length
              ? arr1.map((item) => item.pkId)
              : [];
            this.details.fkInputIdList = arr2.length
              ? arr2.map((item) => item.pkId)
              : [];
            this.details.fkPurchaseId = arr3.length ? arr3[0].pkId : "";
            this.details.fkOrdinaryId = arr4.length ? arr4[0].pkId : "";
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
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
          "/pages/material/inventory/addOutInventory?type=2&obj=" +
          JSON.stringify(this.details),
      });
    },
    submitBtn() {
      let data = {
        ...this.details,
        // driverName: this.details.driverName,
        // driverPhone: this.details.driverPhone,
        // fkApplyIdList: this.details.fkApplyIdList,
        // fkBidProjectId: this.details.fkBidProjectId,
        // fkCustomerId: this.details.fkCustomerId,
        // fkInputIdList: this.details.fkInputIdList,
        // fkItemId: this.details.fkItemId,
        // fkOrdinaryId: this.details.fkOrdinaryId,
        // fkOutApplyId: this.details.fkOutApplyId,
        // fkPurchaseId: this.details.fkPurchaseId,
        // fkWarehouseId: this.details.fkWarehouseId,
        // issueCode: this.details.issueCode,
        // leaderName: this.details.leaderName,
        // orderCode: this.details.orderCode,
        // pkId: this.details.pkId,
        // receiptAddress: this.details.receiptAddress,
        // receiverName: this.details.receiverName,
        // receiverTime: this.details.receiverTime,
        // remark: this.details.remark,
        // serviceTime: this.details.serviceTime,
        // vehicleNum: this.details.vehicleNum,
        detailUpdateList: this.list,
        inventoryCode: 1,
        isUpdate: 0,
      };
      this.$api.updateOutInventory(data).then((res) => {
        if (res.code === 200) {
          uni.showToast({ title: "提交成功", icon: "success" });
          this.getDetail()
          uni.navigateBack({ delta: 1 });
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    getDetail() {
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]; // 上一页面实例
      prevPage.$vm.resh() // 调用上一页 定义的方法
    },
    checkDetail() {
      uni.navigateTo({
        url:
          "/pages/production//checkDetail?obj=" +
          JSON.stringify(this.getObj),
      });
    },
    entering() {
      this.openPop2()
    },
    saveEnter() {
      let data = {
        pkId: this.getObj.pkId,
        receiverStatus: 1,
        receiverName: this.enterData.receiverName,
        receiverTime: this.enterData.receiverTime,
      };
      uni.showLoading({ mask: true });
      this.$api
        .enterInfo(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code == 200) {
            uni.showToast({ title: "录入成功" });
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh() // 调用上一页 定义的方法
            uni.navigateBack();
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    openPop2() {
      this.popShow2 = true;
    },
    closePop2() {
      this.popShow2 = false;
    },
    openDateSelect(type, time) {
      this.dates = Number(new Date(time));
      this.dateSelectShow = true;
    },
    dateSelect(e) {
      console.log(e.value);
      this.enterData.receiverTime = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
      this.closeDateSelect();
    },
    closeDateSelect() {
      this.dateSelectShow = false;
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

    .primary {
      color: #fff;
      background-color: #1576e6;
    }
  }
}

.returnPopShow {
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

    .primary {
      background-color: #1576e6;
    }

    .cancle {
      background-color: #ccc;
    }
  }
}

.popup2 {
  position: relative;
  width: 750rpx;
  max-height: 1200rpx;
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
    max-height: 1020rpx;
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
      background: linear-gradient(90deg,
          rgba(230, 235, 255, 1) 0%,
          rgba(255, 255, 255, 1) 100%);
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
}
</style>
