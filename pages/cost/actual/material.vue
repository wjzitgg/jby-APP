<template>
  <view class="wrapper">
    <u-navbar
      leftText="物资成本"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="pdt-ios"></view>
    <view class="head">
      <u-tabs
          class="tabList"
          :list="tabList"
          :current="current"
          @change="currentChange"
          :scrollable="false"
          :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
        ></u-tabs>
       <view class="search">
        <view class="search-input" :class="{'w-540':current===1,'w-700':current===0}">
          <u-input
            placeholder="请输入物料名称"
            border="none"
            v-model="inpDate.materialName"
            maxlength="50"
          >
            <template slot="suffix">
							<u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon>
						</template>
          </u-input>
        </view>
        <view class="more-search" @click="openPop" v-if="current===1">
          <image
            src="../../../static/image/u486.png"
            mode="widthFix"
            class="filterImg"
          />
          <view>筛选</view>
        </view>
      </view>
      <view class="search-datas pad-20" v-if="current===0">
          <h5 class="title">截止日期：</h5>
          <view class="data-input" @click="openCale(1)">
            {{ inpDate.beginTime }}
            <view class="closeBtn" @click.stop="cleanDate(1)">X</view>
          </view>
          <view class="to">至</view>
          <view class="data-input" @click="openCale(2)">
            {{ inpDate.endTime }}
            <view class="closeBtn" @click.stop="cleanDate(2)">X</view>
          </view>
        </view>
    </view>
    <view class="content">
      <view class="table_detail table_empty table_height2" v-if="current === 0">
      <table v-if="list1.length">
        <thead>
          <tr>
            <th>序号</th>
            <th>材料名称</th>
            <th>单价</th>
            <th>单位</th>
            <th>出库量</th>
            <th>出库日期</th>
            <th>材料金额</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list1" :key="index">
            <td><text class="clickTd" @click="openPop2(item,item.materialName)">{{ index + 1 }}</text></td>
            <td>{{ item.materialName }}</td>
            <td>{{ item.costPrice }}</td>
            <td>{{ item.unitName }}</td>
            <td>{{ item.stockNum}} </td>
            <td>{{ item.deliveryTime }}</td>
            <td>{{ item.totalPrice}} </td>
          </tr>
        </tbody>
      </table>
      <u-empty v-if="list1.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      <u-empty
        v-else
        style="height: 100%"
        mode="data"
        text="暂无数据"
        icon="/static/image/noData.png"
      ></u-empty>
    </view>
    <view class="table_detail table_empty table_height1" v-if="current === 1">
      <table  v-if="list2.length">
        <thead>
          <tr>
            <th>序号</th>
            <th>分包商</th>
            <th>出库单号</th>
            <th>材料类别</th>
            <th>材料名称</th>
            <th>单价</th>
            <th>单位</th>
            <th>出库量</th>
            <th>出库日期</th>
            <th>材料金额</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list2" :key="index">
            <td> <text class="clickTd" @click="openPop2(item,item.customerName)">{{ index + 1 }}</text></td>
            <td> {{ item.customerName }} </td>
            <td>{{ item.orderCode }}</td>
            <td>{{ item.materialTypeName }}</td>
            <td>{{ item.materialName }}</td>
            <td>{{ item.costPrice }}</td>
            <td>{{ item.unitName }}</td>
            <td> {{ item.stockNum }} </td>
            <td>{{ item.deliveryTime }}</td>
            <td> {{ item.totalPrice }} </td>
          </tr>
        </tbody>
      </table>
      <u-empty v-if="list2.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      <u-empty
        v-else
        style="height: 100%"
        mode="data"
        text="暂无数据"
        icon="/static/image/noData.png"
      ></u-empty>
    </view>
    </view>
     <u-popup
      :show="showPop"
      @close="closePop"
      mode="right"
      class="opo"
      bgColor="rgba(255, 255, 255, 0)"
    >
      <view class="popup">
        <view class="popup-content">
          <view class="search-item mb-20">
            <h5 class="mb-20">分包商筛选</h5>
            <view class="select" @click="openPick(1)">
              <view class="name">{{ cusName }}</view>
              <u-icon
                name="arrow-down-fill"
                class="icons"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
          </view>
          <view class="search-item">
            <h5 class="mb-20">出库截止日期</h5>
            <view class="search-datas">
          <view class="data-input" @click="openCale(1)">
            {{ inpDate.beginTime }}
            <view class="closeBtn" @click.stop="cleanDate(1)">X</view>
          </view>
          <view class="to">至</view>
          <view class="data-input" @click="openCale(2)">
            {{ inpDate.endTime }}
            <view class="closeBtn" @click.stop="cleanDate(2)">X</view>
          </view>
        </view>
          </view>
          <view class="search-item mb-20">
            <h5 class="mb-20">出库单号</h5>
            <view class="select">
              <u--input
                placeholder="请输入出库单号"
                border="none"
                v-model="inpDate.orderCodeLike"
                maxlength="50"
              >
              </u--input>
            </view>
          </view>
        </view>
        <view class="footer">
          <view class="footerBtn cancel" @click="closePop">取消</view>
          <view class="footerBtn add" @click="searchOk">确认</view>
        </view>
      </view>
      <u-picker
        :show="pickShow"
        :columns="[pickList]"
        @confirm="pickConfirm"
        keyName="customName"
        @cancel="pickCancel"
      ></u-picker>
      <uni-calendar
      ref="calendar"
      :insert="false"
      @confirm="caleConfirm"
      :date="clickDate"
      v-if="current===1"
    />
    </u-popup>
    <uni-calendar
      ref="calendar"
      :insert="false" 
      @confirm="caleConfirm"
      :date="clickDate"
      v-if="current===0"
    />
    <u-popup :show="showPop2" :round="20">
      <view class="popup2">
        <view class="popup2-head">
          <view class="name">{{popName2}}</view>
          <u-icon
            name="close"
            color="#fff"
            class="closeBtn"
            @click="closePop2"
          ></u-icon>
          <!-- <view ></view> -->
        </view>
        <view class="popup2-content">
          <view class="basic-info mb-20">
            <view class="popup2-content-head">基本信息</view>
            <u--form labelPosition="left" :borderBottom='true'>
            <u-form-item label="出库单号:" labelWidth='100'>
              <view>{{nowClick.orderCode}}</view>
            </u-form-item>
            <u-form-item label="出库对象:" labelWidth='80'>
              <view>{{orderType==1?issueCodeList2[nowClick.issueCode]:issueCodeList[nowClick.issueCode]}}</view>
            </u-form-item>
            <u-form-item label="分包商:" labelWidth='80'>
              <view>{{nowClick.customerName}}</view>
            </u-form-item>
            <u-form-item label="出库仓库:" labelWidth='80'>
                <view>{{nowClick.warehouseName}}</view>
            </u-form-item>
            <u-form-item label="关联发料需求单:" labelWidth='120' v-if="orderType==0">
                <view class="remark">{{!fkOrdinaryId ? '无' : fkOrdinaryId.orderCode}}</view>
            </u-form-item>
            <u-form-item label="负责人:" labelWidth='80'>
                <view>{{nowClick.leaderName}}</view>
            </u-form-item>
            <u-form-item label="业务时间:" labelWidth='80'>
                <view>{{nowClick.serviceTime}}</view>
            </u-form-item>
            <u-form-item label="制单人:" labelWidth='80'>
                <view>{{nowClick.createUser}}</view>
            </u-form-item>
            <u-form-item label="录入时间:" labelWidth='80'>
                <view>{{nowClick.createTime}}</view>
            </u-form-item>
            <u-form-item label="关联入库单:" labelWidth='100' v-if="orderType==0">
                <view class="remark">{{fkInputIdList.length ? fkInputIdList.map(item => item.orderCode).join(',') : '无'}}</view>
            </u-form-item>
            <u-form-item label="关联物资申请单:" labelWidth='120' v-if="orderType==0">
                <view  class="remark">{{fkApplyIdList.length ? fkApplyIdList.map(item => item.orderCode).join(",") : "无"}}</view>
            </u-form-item>
            <u-form-item label="关联采购单:" labelWidth='100' v-if="orderType==1">
                <view  class="remark">{{fkPurchaseId.length ? fkPurchaseId.map(item => item.orderCode).join(",") : "无"}}</view>
            </u-form-item>
            <u-form-item label="关联出库单:" labelWidth='100' v-if="orderType==1">
                <view class="remark">{{fkOutIdList.length ? fkInputIdList.map(item => item.orderCode).join(',') : '无'}}</view>
            </u-form-item>
            <u-form-item label="单据状态:" labelWidth='80'>
                <view>{{nowClick.inventoryCodeName}}</view>
            </u-form-item>
            <u-form-item label="备注:" labelWidth='80'>
                <view class="remark">{{nowClick.remark}}</view>
            </u-form-item>
            </u--form>
          </view>
          <view class="transport-info" v-if="orderType==0">
            <view class="popup2-content-head">运输信息</view>
            <u--form labelPosition="left" :borderBottom='true'>
              <u-form-item label="车牌号:" labelWidth='80'>
                <view>{{nowClick.vehicleNum}}</view>
              </u-form-item>
              <u-form-item label="运输司机:" labelWidth='80'>
                <view>{{nowClick.driverName}}</view>
              </u-form-item>
              <u-form-item label="联系方式:" labelWidth='80'>
                <view>{{nowClick.driverPhone}}</view>
              </u-form-item>
              <u-form-item label="签收人:" labelWidth='80'>
                  <view>{{nowClick.receiverName}}</view>
              </u-form-item>
              <u-form-item label="签收时间:" labelWidth='80'>
                  <view>{{nowClick.receiverTime}}</view>
              </u-form-item>
            </u--form>
          </view>
        </view>
        <view class="pdb"></view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data(){
    return{
      tabList: [{ name: "自使用物资" }, { name: "甲供不扣款" }],
      current: 0,
      inpDate:{
        beginTime:'',
        endTime:'',
        fkCustomerId:'',
        materialName:'',
        orderCodeLike:''
      },
      searchDate:{
        beginTime:'',
        endTime:'',
        fkCustomerId:'',
        materialName:'',
        orderCodeLike:''
      },
      list1:[],
      list2:[],
      clickDate:'',
      showPop:false,
      showPop2:false,
      cusName:'全部',
      pickShow:false,
      pickList:[],
      nowClick:{},
      popName2:'',
      issueCodeList: { delivery_unit: "无", delivery_supplier: "供应商", delivery_subcontract: "分包商", delivery_project: "项目部", delivery_position: "施工部位" },
      issueCodeList2: { issue_unit: "无", issue_supplier: "供应商", issue_subcontract: "分包商", issue_project: "项目部", issue_position: "施工部位" },
      fkApplyIdList:[],
      fkInputIdList:[],
      fkOutIdList:[],
      fkPurchaseId:'',
      fkOrdinaryId:'',
      orderType:0
    }
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  onLoad(options) {
    this.actualCostMaterialSearch()
    this.searchHaveLinkOrgId()
  },
  methods:{
    searchHaveLinkOrgId(){
      this.$api.searchHaveLinkOrgId().then(res=>{
        if(res.code == 200){
          this.pickList = res.data
          this.pickList.unshift({pkId:'',customName:'全部'}) 
        }else{
          uni.showToast({ title: res.msg, icon: 'none' })
        }
      })
    },
    actualCostMaterialSearch(){
      let data={
        sourceType:this.current,
        fkOrgId:this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
        ...this.searchDate
      }
      uni.showLoading({ mask: true })
      this.$api.actualCostMaterialSearch(data).then((res) => {
        uni.hideLoading()
        if(res.code===200){
            if(this.current===0){
              this.list1=res.data
            }else if(this.current===1){
               this.list2=res.data
            }
        }else{
            uni.showToast({ title: res.msg, icon: 'none' })
        }
      }).catch((err) => {
        uni.hideLoading()
      });
    },
    findOutById(pkId){
      uni.showLoading({ mask: true })
      this.$api.findOutById({pkId}).then(res=>{
        uni.hideLoading()
        if(res.code===200){
            this.nowClick=res.data
            const arr1 = res.data.orderRelationList.filter(item => item.orderType == 2); // 物资申请单
            const arr2 = res.data.orderRelationList.filter(item => item.orderType == 3); // 入库单
            const arr3 = res.data.orderRelationList.filter(item => item.orderType == 1); // 采购计划单
            const arr4 = res.data.orderRelationList.filter(item => item.orderType == 4); // 发料单
            this.fkApplyIdList = arr1;
            this.fkInputIdList = arr2;
            this.fkPurchaseId = arr3.length ? arr3[0] : "";
            this.fkOrdinaryId = arr4.length ? arr4[0] : "";
            this.showPop2=true
        }else{
            uni.showToast({ title: res.msg, icon: 'none' })
        }
      }).catch((err) => {
        uni.hideLoading()
      });
    },
    findInputById(pkId) {
      uni.showLoading({ mask: true });
      this.$api
        .findInputById({ pkId })
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.nowClick = res.data;
            this.list = res.data.detailsVoList;
            let arr1 = res.data.orderRelationList.filter(item => item.orderType === 1); //采购单
            let arr2 = res.data.orderRelationList.filter(item => item.orderType === 2); //出库单
            this.fkPurchaseId = arr1.length ? arr1[0].pkId : "";
            this.fkOutIdList = arr2.length ? arr2.map(item => item.pkId) : [];
            this.showPop2=true
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    currentChange(e){
      this.current=e.index
      this.inpDate={
        beginTime:'',
        endTime:'',
        fkCustomerId:'',
        materialName:'',
        orderCodeLike:''
      }
      this.searchDate={
        beginTime:'',
        endTime:'',
        fkCustomerId:'',
        materialName:'',
        orderCodeLike:''
      }
      this.actualCostMaterialSearch()
    },
    openPop() {
      this.showPop = true;
    },
    searchOk() {
      this.searchDate = { ...this.inpDate };
      this.actualCostMaterialSearch()
      this.closePop();
    },
    search() {
      this.searchDate = { ...this.inpDate };
      this.actualCostMaterialSearch()
    },
    closePop() {
      this.showPop = false;
      this.inpDate = { ...this.searchDate };
    },
    cleanDate(e) {
      console.log(e);
      if (e == 1) {
        this.inpDate.beginTime = "";
      } else {
        this.inpDate.endTime = "";
      }
      if(this.current===0){
        this.actualCostMaterialSearch()
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
        this.inpDate.beginTime = e.fulldate;
      } else if (this.caleType === 2) {
        this.inpDate.endTime = e.fulldate;
      }
      if(this.current===0){
        this.actualCostMaterialSearch()
      }
    },
     openPick() {
      this.pickShow = true;
    },
    pickConfirm(e) {
      console.log(e);
      if (e.value[0]) {
        this.inpDate.fkCustomerId = e.value[0].pkId;
        this.cusName = e.value[0].customName;
      }
      this.pickCancel();
    },
    pickCancel() {
      this.pickShow = false;
    },
    openPop2(item,name) {
      // this.nowClick=item
      if(this.current==1){
        this.orderType=0
        this.popName2=name
        this.findOutById(item.pkId)
      }else{
        this.orderType=item.orderType
        if(item.orderType==0){
          this.popName2=name
          this.findOutById(item.pkId)
        }else{
          this.popName2=name
          this.findInputById(item.pkId)
        }
      }
    },
    closePop2(){
      this.showPop2=false
    }
  }
}
</script>

<style lang="scss" scoped>
.head{
  background-color: #fff;
  margin-bottom: 10rpx;
}
.popup {
  position: relative;
  width: 580rpx;
  /*#ifdef APP-PLUS*/
  height: calc(100vh - 156rpx);
  /*#endif*/
  /*#ifdef H5*/
  height: calc(100vh - 88rpx);
  /*#endif*/
  padding: 30rpx;
  /*#ifdef APP-PLUS*/
  margin-top: 156rpx;
  /*#endif*/
  /*#ifdef H5*/
  margin-top: 88rpx;
  /*#endif*/
  background-color: #f2f2f2;
  .popup-pad {
    /*#ifdef APP-PLUS*/
    height: 156rpx;
    /*#endif*/
    /*#ifdef H5*/
    height: 88rpx;
    /*#endif*/
  }
  .popup-content {
    height: calc(100% - 100rpx);
    overflow: auto;
  }
  .select {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60rpx;
    padding: 0 20rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
  }
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    width: 580rpx;
    height: 100rpx;
    .footerBtn {
      width: 290rpx;
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
    }
    .cancel {
      background-color: #eeeeee;
      color: #aaaaaa;
    }
    .add {
      background-color: #1576e6;
      color: #fff;
    }
  }
}
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  .search-input {
    // width: 540rpx;
    padding-left: 20rpx;
    border: 1px solid #2a82e4;
    border-radius: 6rpx;
  }
  .w-540{
    width: 540rpx;
  }
  .w-700{
    width: 700rpx;
  }
  .more-search {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 160rpx;
    height: 60rpx;
    border: 1px solid #2a82e4;
    border-radius: 6rpx;
    font-size: 30rpx;
    color: #2a82e4;
    .filterImg {
      width: 36rpx;
      margin-right: 6rpx;
    }
  }
}
.pad-20{
  padding: 0 20rpx;
}
.search-datas {
  display: flex;
  align-items: center;
  height: 80rpx;
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
    width: 250rpx;
    height: 60rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    border-radius: 6rpx;
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
.table_height1 {
  /*#ifdef APP-PLUS*/
  max-height: calc(100vh - 354rpx);
  // height: calc(100vh - 354rpx);
  /*#endif*/
  /*#ifdef H5*/
  max-height: calc(100vh - 266rpx);
  // height: calc(100vh - 266rpx);
  /*#endif*/
}
.table_height2 {
   /*#ifdef APP-PLUS*/
  height: calc(100vh - 434rpx);
  /*#endif*/
  /*#ifdef H5*/
  height: calc(100vh - 346rpx);
  /*#endif*/
}
.popup2 {
  position: relative;
  width: 750rpx;
  height: 80vh;
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
    height: calc(100% - 80rpx);
    padding-top: 40rpx;
    overflow: auto;
    background-color: #fff;
    // padding: 0 20rpx;
    border-radius: 20rpx 20rpx 0 0;
    .popup2-content-head{
      height: 60rpx;
      line-height: 60rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      background: linear-gradient(90deg, rgba(230, 235, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)
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
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 100rpx;
    background-color: #fff;
    .btns {
      width: 210rpx;
    }
    .cancle {
      background-color: #eeeeee;
      color: #aaaaaa;
    }
  }
}
.mb-20{
  margin-bottom: 20rpx;
}
</style>