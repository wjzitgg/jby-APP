<!-- 供应商结算 -->
<template>
  <view class="wrapper">
    <u-navbar
      leftText="收付款管理"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <view class="bg-white head-amount">
        <view class="head-amount-labe">当前累计结算金额</view>
        <view class="head-amount-text">
          <text class="head-amount-amount">{{
            rowData.amount
          }}</text>
          <text class="monetary-unit">元</text>
        </view>
      </view>
      <view class="bg-white current-amount">
        <view class="left item">
          <view class="label">上期累计支付金额</view>
          <view class="item-text">
            <text class="item-text-amount">{{ rowData.preAmount }}</text>
            <text class="monetary-unit">元</text>
          </view>
        </view>
        <view class="right item">
          <view class="label right-label">当前应付金额</view>
          <view class="item-text">
            <text class="item-text-amount">{{
              rowData.payment
            }}</text>
            <text class="monetary-unit">元</text>
          </view>
        </view>
      </view>
      <view class="bg-white" style="margin-top: 4px">
        <u-tabs class="tabs" :list="list1" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"> </u-tabs>
      </view>
      <view
        v-if="current == 0"
        class="bg-white"
        style="display: flex; padding: 8px 12px"
      >
        <text style="line-height: 30px; margin-right: 5px">截止日期:</text>
        <view class="time-box" @click="(timeShow=true)">
          {{endTime}}
          <u-icon v-if="endTime.length == 0" class="ico" color="#2a82e4" name="calendar-fill"></u-icon>
          <u-icon v-else class="ico" @click.native.stop="(endTime = '')" color="#2a82e4" name="trash-fill"></u-icon>
        </view>
        <u-datetime-picker
          :show="timeShow"
          v-model="value1"
          mode="date"
          @cancel="timeClose"
          @confirm="confirm"
        ></u-datetime-picker>
      </view>
      <view class="search" v-if="current == 1">
        <view class="left">
          <view class="search-input"
            ><u--input border="none" v-model="inspectName"> </u--input
          ></view>
          <view class="separator">|</view>
          <view class="searchBtn" @click="init">搜索</view>
        </view>
        <view class="right">
          <view class="screen" @click="openPop">筛选</view>
        </view>
      </view>
      <view class="table_detail table_empty" v-if="current == 0" style="margin-top: 4px">
        <table>
          <thead>
            <tr>
              <th style="width: 40px">
                <u-icon name="list" style="display: inline-block"></u-icon>
              </th>
              <th>付款期名</th>
              <th>支付日期</th>
              <th>累计结算金额</th>
              <th>上期末累计付款</th>
              <th>当前应付金额</th>
              <th>本期付款</th>
              <th>本期末累计付款</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in childList" :key="index">
              <td @click="compile(item)">{{ index + 1 }}</td>
              <td>{{ item.stageName }}</td>
              <td>{{ item.payTime }}</td>
              <td>{{ item.totalSettlementAmount }}</td>
              <td>{{ item.payBalanceFront }}</td>
              <td>{{ item.totalUnpaidAmount }}</td>
              <td>{{ item.payAmount }}</td>
              <td>{{ item.payBalanceAfter }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      </view>
      <view class="table_detail table_empty" v-if="current == 1" style="margin-top: 4px">
        <table>
          <thead>
            <tr>
              <th style="width: 40px">
                <u-icon name="list" style="display: inline-block"></u-icon>
              </th>
              <th>入库单号</th>
              <th>物料类型</th>
              <th>检验日期</th>
              <th>单据金额</th>
              <th>累计结算金额</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in dataList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.inventoryName }}</td>
              <td>{{ item.materialType }}</td>
              <!-- <td>
                <text v-if="(item.materialType==0)">供货</text>
                <text v-if="(item.materialType==1)">退货</text>
              </td> -->
              <td>{{ item.checkDate }}</td>
              <td>{{ item.materialAmount }}</td>
              <td>{{ item.beforeAmount }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      </view>
    </view>
    <u-popup :show="showPop" @close="closePop" mode="right" bgColor="rgba(255, 255, 255, 0)">
      <view class="popup">
        <view class="popup-content">
          <view
            class="tags"
            :class="{ 'tags-click': nowTags === index }"
            v-for="(item, index) in list"
            :key="index"
            @click="tagsClick(item, 1, index)"
            >{{ item.name }}</view
          >
        </view>
        <view class="popup-content">
          <view class="search-item mb-20">
            <h5 class="mb-20" style="line-height: 20px">物料类别</h5>
            <view class="dates">
              <easy-select style="background: #fff"
                ref="easySelect2"
                size="mini"
                class="easySelect"
                :value="type"
                @selectOne="selectOne2"
                :options="typeList"
              ></easy-select>
            </view>
            <h5 class="mb-20" style="line-height: 20px">检验日期</h5>
            <view class="dates">
              <view class="dateInput" @click="openCale(1, inpDate.beginTime)">
                <!-- <u--input
                  v-model="inpDate.beginTime"
                  border="none"
                  clearable
                ></u--input> -->
                <view >{{ inpDate.beginTime }}</view>  
              </view>
              <view>至</view>
              <view class="dateInput" @click="openCale(2, inpDate.endTime)">
                <!-- <u--input
                  v-model="inpDate.endTime"
                  border="none"
                  clearable
                ></u--input> -->
                <view >{{ inpDate.endTime }}</view>  
              </view>
            </view>
          </view>
          <view class="reset" @click="reset">重置</view>
        </view>
        <view class="footer">
          <view class="footerBtn cancel" @click="closePop">取消</view>
          <view class="footerBtn add" @click="searchOk">确认</view>
        </view>
      </view>
      <uni-calendar
        ref="calendar"
        :insert="false"
        @confirm="caleConfirm"
        :date="clickDate"
      />
      <u-picker
        :show="pickShow"
        :columns="[materialList]"
        @confirm="pickConfirm"
        @cancel="pickCancel"
      ></u-picker>
    </u-popup>
  </view>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      rowData: {},
      list1: [{ name: "支付流水" }, { name: "供货结算流水" }],
      current: 0,
      dataList: [],//支付流水列表
      inspectName: "",
      searchName: "",
      showPop: false,
      list: [],
      inpDate: {
        beginTime: "",
        endTime: "",
        orderCode: "",
      },
      clickDate: "",
      pickShow: false,
      materialList: [],
      timeShow:false,
      value1: Number(new Date()),
      endTime:"",
      childList:[],
      type:"",
      typeId:"",
      typeList:[],
    };
  },
  onLoad(item) {
    // this.rowData = JSON.parse(item.row);
    // this.childList = this.rowData.childList == null?[]:this.rowData.childList;
    this.user = uni.getStorageSync("user");
    this.getFinanceIntercourseSummary()
    this.getData();
    this.searchMaterialType();
  },
  methods: {
    confirm(e) {
      console.log(e);
      this.endTime = moment(e.value).format("YYYY-MM-DD");
      console.log(this.value1);
      this.getData()
      this.timeShow = false;
    },
    timeClose() {
      this.timeShow = false;
    },
    pickConfirm(e) {
      console.log(e);
      this.pickCancel();
    },
    pickCancel() {
      this.pickShow = false;
    },
    openPop() {
      this.showPop = true;
    },
    init() {
      this.searchName=this.inspectName
      this.materialSettleSearchPage()
    },
    searchOk(){
      this.closePop()
      this.materialSettleSearchPage()
    },
    getFinanceIntercourseSummary(){
      this.$api.getFinanceIntercourseSummary({projectId:uni.getStorageSync("nowProId")}).then(res=>{
        if(res.code===200){
          this.rowData=res.data
        }else{
           uni.showToast({ icon: "none", title: res.msg });
        }
      })
    },
    materialSettleSearchPage() {
      let data = {
        pageNum: 1,
        pageSize: 20,
        beginTime:this.inpDate.beginTime,
        endTime:this.inpDate.endTime,
        materialTypeId:this.typeId,
        orderCode:this.searchName
      };
      this.$api.materialSettleSearchPage(data).then((res) => {
        if (res.code == 200) {
          this.dataList = res.data.records;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    settlePage() {
      let data = {
        pageNum: 1,
        pageSize: 20,
        endTime:this.endTime
      };
      this.$api.settlePage(data).then((res) => {
        if (res.code == 200) {
          this.childList = res.data.records;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    currentChange(item) {
      this.current = item.index;
      // console.log(this.current);
      this.getData()
    },
    getData(){
      if(this.current == 0){
        this.settlePage()
        }else if(this.current == 1){
        this.materialSettleSearchPage()
      }
    },
    openPop() {
      this.showPop = true;
    },
    closePop() {
      this.showPop = false;
      // this.inpDate={...this.searchDate}
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
    },
    reset() {
      this.inpDate.beginTime = "";
      this.inpDate.endTime = "";
      this.type =""
      this.typeId =""
    },
    selectOne2(e) {
      // console.log(e);
      this.type = e.options.label;
      this.typeId = e.options.value;
      // this.searchPlanActual(0);
      // this.searchPlanActual(1);
    },
    // 物料类别下拉
    searchMaterialType() {
      this.$api.searchMaterialType().then((res) => {
        if (res.code == 200) {
          res.data.forEach(item=>{
            item.label=item.typeName
            item.value=item.pkId
          })
          // res.data
          this.typeList = res.data
          console.log("物料类别下拉");
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.text-hidden {
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁⽌换⾏*/
  text-overflow: ellipsis; /*省略号*/
}
.bg-white {
  background: #fff;
}
.head-amount {
  padding: 8px;
  .head-amount-labe {
    display: inline-block;
    padding: 6px 12px;
    color: #fff;
    background: #ff8d1a;
  }
  .head-amount-text {
    line-height: 64rpx;
    .head-amount-amount {
      font-weight: 700;
      color: #ff8d1a;
    }
  }
}
.current-amount {
  display: flex;
  padding: 12px;
  .item {
    width: 50%;
    .label {
      color: #fff;
      background: #2a82e4;
      display: inline-block;
      padding: 5px 8px;
      font-size: 12px;
    }
    .right-label {
      background: #a26dde;
    }
    .item-text {
      margin: 8px 0px;
      .item-text-amount {
        font-weight: 700;
        color: #000;
      }
    }
  }
}

.tabs {
  /deep/ .u-tabs__wrapper__nav__item {
    flex: 1;
  }
}
.monetary-unit {
  font-size: 10px;
  margin-left: 4px;
  color: #ccc;
}
.time-box {
  width: 520rpx;
  line-height: 60rpx;
  border-radius: 8rpx;
  height: 60rpx;
  padding-left: 20rpx;
  border: 1px solid #b4d0f0;
  position: relative;
  .ico {
    position: absolute;
    right: 8rpx;
    top: 10rpx;
  }
}
.search {
  //   position: fixed;
  //   /* #ifdef H5 */
  //   top: 176rpx;
  //   /* #endif */
  //   /* #ifdef APP-PLUS */
  //   top: 240rpx;
  //   /* #endif */
  //   //   top: 176rpx;
  display: flex;
  align-items: center;
  width: 100%;
  height: 80rpx;
  padding: 0 32rpx;
  background-color: #fff;
  .left {
    display: flex;
    width: 530rpx;
    height: 60rpx;
    border: 1px solid rgba(180, 208, 240, 1);
    border-radius: 10rpx;
    .search-input {
      display: flex;
      align-items: center;
      flex: 1;
      height: 60rpx;
    }
    .searchBtn {
      width: 120rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 26rpx;
      text-align: center;
      color: #2a82e4;
    }
    .separator {
      line-height: 54rpx;
      color: rgba(180, 208, 240, 1);
    }
  }
  .right {
    margin-left: 20rpx;
    .screen {
      width: 140rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 26rpx;
      text-align: center;
      color: #2a82e4;
      border: 1px solid rgba(180, 208, 240, 1);
      border-radius: 10rpx;
    }
  }
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
  .dates {
    display: flex;
    align-items: center;
    .dateInput {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 220rpx;
      height: 60rpx;
      font-size: 28rpx;
      background-color: #fff;
      border: 1px solid #000;
    }
  }
  .reset {
    margin-top: 12px;
    width: 120rpx;
    height: 40rpx;
    line-height: 40rpx;
    background-color: #1576e6;
    color: #fff;
    font-size: 26rpx;
    text-align: center;
    border-radius: 20rpx;
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
  .popup-content {
    display: flex;
    flex-wrap: wrap;
    padding-left: 20rpx;
    .tags {
      width: 200rpx;
      height: 72rpx;
      margin-right: 8rpx;
      margin-bottom: 12rpx;
      line-height: 72rpx;
      text-align: center;
      font-size: 26rpx;
      color: #a0a8b6;
      // border: 1px solid rgba(180, 208, 240, 1);
      background-color: #f6f6f6;
      border-radius: 72rpx;
    }
    .tags-click {
      color: #2a82e4;
      border: 1px solid #2a82e4;
      background-color: #e6f7ff;
    }
  }
}
</style>
