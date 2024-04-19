<!-- 物资结算 -->
<template>
  <view class="wrapper">
    <u-navbar leftText="物资结算" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="sticky">
      <u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="false" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"></u-tabs>
      <view class="search">
        <view class="search-item" v-if="user.orgType ==5 || user.orgType ==4 ">
          <easy-select ref="easySelect" size="mini" class="easySelect" :value="nowArea" @selectOne="selectOne"
            :options="areaList"></easy-select>
        </view>
        <view class="search-item">
          <easy-select ref="easySelect2" size="mini" class="easySelect" :value="type" @selectOne="selectOne2"
            :options="typeList"></easy-select>
        </view>
      </view>
      <view class="search-datas">
        <h5 class="title">接收周期：</h5>
        <view class="data-input">
          <view class="left" @click="openCale(1)">{{ beginTime }}</view>
          <view class="closeBtn" @click="cleanDate(1)" v-if="beginTime">X</view>
        </view>
        <view class="to">至</view>
        <view class="data-input">
          <view class="left" @click="openCale(2)">{{ endTime }}</view>
          <view class="closeBtn" @click="cleanDate(2)" v-if="endTime">X</view>
        </view>
      </view>
    </view>
    <view class="pad"></view>
    <view class="content" style="margin-top: 126px;" :class="{ boxContent: userData.orgType === 6 || userData.orgType === 7 }">
      <view class="table_detail table_height" :class="{ itemOrgtype: userData.orgType === 6 || userData.orgType === 7 }"
        v-if="current === 0">
        <table v-if="list1.length">
          <thead>
            <tr>
              <th>分包商</th>
              <th>结算前金额(元)</th>
              <th>结算金额(元)</th>
              <th>结算后金额(元)</th>
              <th>结算单据编号</th>
              <th>签收日期</th>
              <th>物料类型</th>
              <!-- <th>计划完成产值</th> -->
              <!-- <th>已完成产值</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list1" :key="index">
              <td>{{ item.customName }}</td>
              <td>{{ item.settleBeforeAmount }}</td>
              <td>{{ item.settleAmount }}</td>
              <td :class="{ green: item.completionStatus === 2 }">
                {{ item.settleAfterAmount }}
              </td>
              <td>{{ item.orderCode }}</td>
              <td>{{ item.acceptDate }}</td>
              <td>{{ item.materType }}</td>
              <!-- <td>{{ item.amount }}</td> -->
              <!-- <td>{{ item.finishAmount }}</td> -->
            </tr>
          </tbody>
        </table>
        <u-empty v-if="list1.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
        <u-empty v-else style="height: 100%" mode="data" text="暂无数据"
          icon="/static/image/noData.png"></u-empty>
      </view>
      <view class="table_detail table_empty table_height" :class="{ itemOrgtype: userData.orgType === 6 || userData.orgType === 7 }"
        v-if="current === 1">
        <table v-if="list2.length">
          <thead>
            <tr>
              <th>{{ userData.orgType == 6?"标段项目":"供应商" }}</th>
              <th>结算前金额(元)</th>
              <th>结算金额(元)</th>
              <th>结算后金额(元)</th>
              <th>单据编号</th>
              <th>检验日期</th>
              <th>物料类型</th>
              <!-- <th>已完成产值</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list2" :key="index">
              <!-- <td>{{ index + 1 }}</td> -->
              <td>{{ userData.orgType == 6? item.projectName:item.customName }}</td>
              <td> {{ menuCodeData == 1 ? item.beforeAmount : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.materialAmount : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.afterAmount : "***" }}</td>
              <td>{{ item.inventoryName }}</td>
              <td>{{ item.checkDate }}</td>
              <td>{{ item.materialType }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="list2.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
        <u-empty v-else style="height: 100%" mode="data" text="暂无数据"
          icon="/static/image/noData.png"></u-empty>
      </view>
    </view>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" />
  </view>
</template>

<script>
export default {
  onLoad(options) {
    // if(!!(options.isOk-0)){
    //   this.isOk=!!(options.isOk-0)
    //   this.areaId=options.id
    //   // this.navName=options.name+'进度明细'
    // }else{
    //   this.findWorkAreasByUserId()
    // }
    // this.searchPlanActual(0);
    // this.searchPlanActual(1);
    this.searchMaterialType();
 
    this.searchMenuDataAuthorize();
  },
  onShow() {
    /**
     * @userData 读取本地存储做角色判断
     */
    this.userData = uni.getStorageSync('user');
    this.tabList = (this.userData.orgType === 6 || this.userData.orgType === 7) ? [] : this.tabList;
    this.userData.orgType == 6 ? this.current = 1 : this.current = 0
    // this.materialDeductSearchPage()
    // this.current == 0 && this.userData.orgType === 7 ? this.materialDeductSearchPage() : this.materialSettleSearchPage();
    if (this.current == 0) {
        this.materialDeductSearchPage();
      } else if (this.current== 1) {
        this.materialSettleSearchPage();
      }
    this.fkOrgId= uni.getStorageSync('nowOrgId')
    let data={
      fkOrgId:this.fkOrgId
    }
    this.getSubOrg(data);
    this.getSupplyOrg(data);

  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  data() {
    return {
      fkOrgId:'',
      userData: '',
      // navName:'工区实际完成',
      tabList: [{ name: "分包商扣款" }, { name: "供应商结算" }],
      current: 0,
      list1: [],
      list2: [],
      nowArea: "",
      areaId: "",
      areaList: [],
      type: "",
      typeId: "",
      typeList: [],
      clickDate: "",
      caleType: 1,
      beginTime: "",
      endTime: "",
      isOk: false,
      subContractor: [],
      supplierList: [],
      menuCodeData: ""
    };
  },
  methods: {
    // 查询物料分类下拉
    searchMaterialType() {
      this.$api.searchMaterialType().then((res) => {
        if (res.code == 200) {
          res.data.forEach((item) => {
            item.label = item.typeName;
            item.value = item.pkId;
          });
          this.typeList = res.data;
          this.typeList.unshift({ label: "全部物料类型", value: "" });
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    // 获取供应商
    getSupplyOrg(data) {
      this.$api.getSupplyOrg(data).then((res) => {
        if (res.code == 200) {
          res.data.forEach((item) => {
            item.label = item.orgName;
            item.value = item.pkId;
          });
          res.data.unshift({ label: "全部供应商", value: "" });
          this.supplierList = res.data;
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    // 获取分包商
    getSubOrg(data) {
      this.$api.getSubOrg(data).then((res) => {
        if (res.code == 200) {
          res.data.forEach((item) => {
            item.label = item.orgName;
            item.value = item.pkId;
          });
          res.data.unshift({ label: "全部分包商", value: "" });
          this.subContractor = res.data;
          this.areaList = res.data;
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    // 分包商扣款
    materialDeductSearchPage() {
      let data = {
        pageNum: 1,
        pageSize: 1000,
        beginTime: this.beginTime,
        endTime: this.endTime,
        customId: this.areaId,
        materialTypeId: this.typeId,
      }
      if(this.userData.orgType == 2 ||this.userData.orgType == 3 || this.userData.orgType == 4 || this.userData.orgType == 6 ||this.userData.orgType == 7){
        data.fkProjectId=uni.getStorageSync('nowProId')
      }
      this.$api.materialDeductSearchPage(data).then(res => {
        if (res.code == 200) {
          this.list1 = res.data.records
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      })
    },
    // 供应商结算
    materialSettleSearchPage() {
      let data = {
        pageNum: 1,
        pageSize: 1000,
        beginTime: this.beginTime,
        endTime: this.endTime,
        customId: this.areaId,
        materialTypeId: this.typeId,
      }
      if(this.userData.orgType == 2 ||this.userData.orgType == 3 || this.userData.orgType == 4 || this.userData.orgType == 6 ||this.userData.orgType == 7){
        data.projectBidId=uni.getStorageSync('nowProId');
      }
      this.$api.materialSettleSearchPage(data).then(res => {
        if (res.code == 200) {
          this.list2 = res.data.records
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      })
    },
    // findWorkAreasByUserId() {
    //   this.$api
    //     .findWorkAreasByUserId({
    //       orgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
    //     })
    //     .then((res) => {
    //       if (res.code === 200) {
    //         this.areaList = [
    //           { value: "", label: "全部" },
    //           ...res.data.map((item) => ({
    //             ...item,
    //             label: item.areaName,
    //             value: item.pkId,
    //           })),
    //         ];
    //       } else {
    //         uni.showToast({
    //           title: res.msg,
    //           icon: "none",
    //         });
    //       }
    //     });
    // },
    // searchPlanActual(isItemDetail) {
    //   let data = {
    //     isItemDetail,
    //     customerOrWorkArea: 1,
    //     finishStatus: this.typeId,
    //     fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
    //     startTime: this.beginTime,
    //     endTime: this.endTime,
    //     fkWorkAreaId: this.areaId,
    //   };
    //   this.$api
    //     .searchPlanActual(data)
    //     .then((res) => {
    //       if (res.code === 200) {
    //         if (isItemDetail === 0) {
    //           this.list1 = res.data;
    //         } else {
    //           this.list2 = res.data;
    //         }
    //       } else {
    //         uni.showToast({
    //           title: res.msg,
    //           icon: "none",
    //         });
    //       }
    //     })
    //     .catch((err) => {});
    // },
    currentChange(e) {
      this.current = e.index;
      if (e.index == 0) {
        this.areaList = this.subContractor;
        this.materialDeductSearchPage();
        console.log('0 -----> ', 0);
      } else if (e.index == 1) {
        this.areaList = this.supplierList;
        this.materialSettleSearchPage();
        console.log('1 -----> ', 1);
      }
      this.type = "全部物料类型";
      this.nowArea = "全部";
    },
    selectOne(e) {
      console.log(e);
      this.nowArea = e.options.label;
      this.areaId = e.options.value;
      if (this.current == 0) {
        this.materialDeductSearchPage();
      } else if (this.current== 1) {
        this.materialSettleSearchPage();
      }
    },
    selectOne2(e) {
      console.log(e);
      this.type = e.options.label;
      this.typeId = e.options.value;
      if (this.current == 0) {
        this.materialDeductSearchPage();
      } else if (this.current== 1) {
        this.materialSettleSearchPage();
      }
    },
    cleanDate(e) {
      console.log(e);
      if (e == 1) {
        this.beginTime = "";
      } else {
        this.endTime = "";
      }
      // this.searchPlanActual(0);
      // this.searchPlanActual(1);
      if (this.current == 0) {
        this.materialDeductSearchPage();
      } else if (this.current== 1) {
        this.materialSettleSearchPage();
      }
    },
    openCale(type, date) {
      this.clickDate = date;
      this.caleType = type;
      // this.caleShow=true
      this.$refs.calendar.open();
    },
    caleConfirm(e) {
      console.log(e);
      if (this.caleType === 1) {
        this.beginTime = e.fulldate;
      } else if (this.caleType === 2) {
        this.endTime = e.fulldate;

        // this.current == 0 && this.userData.orgType === 7 ? this.materialDeductSearchPage() : this.materialSettleSearchPage();
      }
      if (this.current == 0) {
        this.materialDeductSearchPage();
      } else if (this.current== 1) {
        this.materialSettleSearchPage();
      }
      // this.searchPlanActual(0);
      // this.searchPlanActual(1);
    },
    // 获取当前登录用户角色关联菜单权限数据集
    searchMenuDataAuthorize() {
      this.$api.searchMenuDataAuthorize().then(res => {
        if (res.code == 200) {
          res.data.forEach(element => {
            if (element.menuCode == 'supplies') {
              this.menuCodeData = element.states
            }
          });
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.sticky {
  z-index: 20;
}

.pad {
  max-height: 258rpx;

}

.pad2 {
  height: 178rpx;
}

.search {
  display: flex;
  align-items: center;
  height: 80rpx;

  .search-item {
    flex: 1;
    padding: 0 10rpx;
  }

  .easySelect {
    /deep/.uni-input-wrapper {
      .uni-input-input {
        font-size: 28rpx;
      }
    }
  }
}

.search-datas {
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 10rpx;

  // background-color: #fff;
  .title {
    width: 140rpx;
  }

  .to {
    margin: 0 10rpx;
  }

  .data-input {
    display: flex;
    align-items: center;
    position: relative;
    width: 270rpx;
    height: 60rpx;
    // padding: 0 20rpx;
    border: 1px solid #dcdfe6;
    border-radius: 6rpx;
    .left{
      display: flex;
      align-items: center;
      width: 200rpx;
      height: 60rpx;
    }
    .closeBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: 6rpx;
      width: 30rpx;
      height: 30rpx;
      background-color: #eee;
      color: #ccc;
      font-size: 16rpx;
      z-index: 5;
      border-radius: 50%;
    }
  }
}

.table_height {
  border: 0rpx;
  /*#ifdef APP-PLUS*/
  height: calc(100vh - 434rpx);
  /*#endif*/
  /*#ifdef H5*/
  height: calc(100vh - 346rpx);
  /*#endif*/
}

.table_height2 {
  /*#ifdef APP-PLUS*/
  height: calc(100vh - 354rpx);
  /*#endif*/
  /*#ifdef H5*/
  height: calc(100vh - 266rpx);
  /*#endif*/
}

.green {
  color: #43cf7c;
}

// /deep/ .table_height[data-v-0e5dcb6c] {
//   height: 100vh;
//   margin-top: 125px;
// }

.itemOrgtype {
  height: calc(100vh - 346rpx);

}
.boxContent{
  margin-top: 83px !important;

}
</style>
