<!-- 上级质量检查 -->
<template>
  <view class="wrapper">
    <u-navbar
      leftText="设备成本"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="pdt-ios"></view>
    <view class="content">
      <view style="background: #fff">
        <u-tabs class="tabs" :list="list1" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"> </u-tabs>
      </view>
      <!-- <view class="search" v-if="current ==0">
        <view class="left">
          <view class="search-input"
            ><u--input border="none" v-model="contractName"> </u--input
          ></view>
          <view class="separator">|</view>
          <view class="searchBtn" @click="init">搜索</view>
        </view>
      </view>   v-if="current ==1"-->
      <view class="search-box">
        <view class="left">
          <view class="search-item">
            <easy-select
              ref="easySelect"
              size="mini"
              class="easySelect"
              :value="nowYear"
              @selectOne="selectOne"
              :options="yearList"
            ></easy-select>
          </view>
        </view>
        <view class="right">
          <!-- <view class="screen" @click="openPop">筛选</view> -->
          <view class="search-input"
            ><u-input border="none" placeholder="请输入设备名称" v-model="contractName" maxlength="50">
              <template slot="suffix">
                <u-icon name="search" @click="init"></u-icon>
              </template> </u-input
          ></view>
        </view>
      </view>
      <view class="table_detail table_empty" style="margin-top: 2px">
        <table>
          <thead>
            <tr>
              <th style="width: 40px">
                <u-icon name="list" style="display: inline-block"></u-icon>
              </th>
              <th>设备名称</th>
              <th>设备类型</th>
              <th>{{ current == 0 ? "租赁" : "购买" }}单价</th>
              <th>{{ current == 0 ? "租赁期限" : "折旧期限" }}</th>
              <th>{{ current == 0 ? "月租金" : "月折旧价" }}</th>
              <th>{{ current == 0 ? "租赁" : "购买" }}数量</th>
              <th>{{ current == 0 ? "月租金" : "月折旧价" }}合计</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in itemNameList" :key="index">
              <td><text class="clickTd" @click="itemLick(item)">{{ index + 1 }}</text></td>
              <td>{{ item.deviceName }}</td>
              <td>{{ item.className }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.liveTime }}</td>
              <td>{{ item.depreciationPrice }}</td>
              <td>{{ item.buyNum }}</td>
              <td>{{ item.buyNum * item.price }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      </view>
    </view>
    <u-popup :show="showPop" @close="closePop" mode="right">
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
            <h5 class="mb-20" style="line-height: 20px">日期范围选择</h5>
            <view class="dates">
              <view class="dateInput" @click="openCale(1, inpDate.beginTime)">
                <u--input
                  v-model="inpDate.beginTime"
                  border="none"
                  clearable
                ></u--input>
              </view>
              <view>至</view>
              <view class="dateInput" @click="openCale(2, inpDate.endTime)">
                <u--input
                  v-model="inpDate.endTime"
                  border="none"
                  clearable
                ></u--input>
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
    <u-popup
      :show="itemShow"
      mode="bottom"
      :round="20"

      @close="closePops"
      @open="openPops"
    >
      <view class="item-edit" >
        <view class="tem-edit-title">
          {{ contractDetails.deviceName }}
          <u-icon
            name="close"
            color="#fff"
            @click="closePops"
            class="tem-edit-ico"
          ></u-icon>
        </view>
        <view style="height: 700rpx;overflow: auto;">
          <view class="list-title">基础信息</view>
          <view>
            <u--form
              labelPosition="left"
              :model="contractDetails"
              class="item-edit-form"
            >
              <u-form-item
                label="设备名称:"
                prop="userInfo.name"
                borderBottom
                labelWidth="80"
                ref="item1"
              >
                {{ contractDetails.deviceName }}
              </u-form-item>
              <u-form-item
                label="设备类型:"
                prop="userInfo.sex"
                borderBottom
                ref="item1"
                labelWidth="80"
              >
                {{ contractDetails.className }}
              </u-form-item>
              <u-form-item
                label="设备型号:"
                prop="userInfo.sex"
                borderBottom
                ref="item1"
                labelWidth="80"
              >
                {{ contractDetails.deviceCode }}
              </u-form-item>
              <u-form-item
                label="设备品牌:"
                prop="userInfo.sex"
                borderBottom
                ref="item1"
                labelWidth="80"
              >
                {{ contractDetails.brandName }}
              </u-form-item>
              <u-form-item
                label="设备厂商:"
                prop="userInfo.sex"
                borderBottom
                ref="item1"
                labelWidth="80"
              >
                {{ contractDetails.manufacturer }}
              </u-form-item>
              <u-form-item
                label="设备出厂日期:"
                prop="userInfo.sex"
                borderBottom
                ref="item1"
                labelWidth="80"
              >
                {{ contractDetails.factoryTime }}
              </u-form-item>
            </u--form>
          </view>
          <view style="background: #f6f6fc; height: 5px; margin-top: 20px"></view>
          <view class="list-title">其他信息</view>
          <view>
            <u--form
              labelPosition="left"
              :model="contractDetails"
              class="item-edit-form"
            >
              <u-form-item v-for="(item,idx) in  contractDetails.deviceAttributes" :key="idx"
                :label="item.attributeName+':'"
                prop="userInfo.name"
                borderBottom
                labelWidth="80"
                ref="item1"
              >
                {{ item.attributeVal }}
              </u-form-item>
            </u--form>
          </view>
          <view style="background: #f6f6fc; height: 5px; margin-top: 20px"></view>
          <view class="list-title">{{
            current == 0 ? "租赁信息" : "购买信息"
          }}</view>
          <view>
            <u--form
              labelPosition="left"
              :model="contractDetails"
              class="item-edit-form"
            >
              <u-form-item
                :label="current == 0 ? '租赁合计' : '合计金额'"
                prop="userInfo.name"
                borderBottom
                labelWidth="80"
                ref="item1"
              >
                {{ contractDetails.buyNum * contractDetails.price }}
              </u-form-item>
              <u-form-item
                :label="current == 0 ? '租赁单价' : '购买单价'"
                prop="userInfo.sex"
                borderBottom
                ref="item1"
                labelWidth="80"
              >
                {{ contractDetails.price }}
              </u-form-item>
              <u-form-item
                :label="current == 0 ? '租赁设备数' : '购买设备数'"
                prop="userInfo.sex"
                borderBottom
                ref="item1"
                labelWidth="80"
              >
                {{ contractDetails.buyNum }}
              </u-form-item>
              <u-form-item
                :label="current == 0 ? '月折旧价' : '月折旧价'"
                prop="userInfo.sex"
                borderBottom
                ref="item1"
                labelWidth="80"
              >
                {{ contractDetails.depreciationPrice }}
              </u-form-item>
              <u-form-item
                :label="current == 0 ? '使用期限' : '折旧期限'"
                prop="userInfo.sex"
                borderBottom
                ref="item1"
                labelWidth="80"
              >
                {{ contractDetails.liveTime }}
              </u-form-item>
            </u--form>
          </view>
          <!-- <view style="background: #f6f6fc; height: 5px; margin-top: 20px"></view> -->
          <!-- <view class="list-title">使用信息</view>
          <view>
            <u--form
              labelPosition="left"
              :model="contractDetails"
              class="item-edit-form"
            >
              <u-form-item
                label="使用部门:"
                prop="userInfo.name"
                borderBottom
                labelWidth="80"
                ref="item1"
              >
                {{ contractDetails.deptName }}
              </u-form-item>
              <u-form-item
                label="使用部位:"
                prop="userInfo.sex"
                borderBottom
                ref="item1"
                labelWidth="80"
              >
                {{ contractDetails.itemName }}
              </u-form-item>
            </u--form>
          </view> -->
          <view style="background: #f6f6fc; height: 5px; margin-top: 20px"></view>
          <view class="list-title">设备照片</view>
          <u--image v-for="(item,idx) in contractDetails.arr" :key="idx" :src="item" width="80px" height="80px"></u--image>
        </view>
        <!-- <view style="padding: 8px">
          <view>合同附件</view>
          <view
            class="file-set-list"
            v-for="(item, idx) in contractDetails.attachments"
            :key="idx"
          >
            <u-icon
              class="file-set-lef"
              style="display: inline-block"
              name="file-text"
            ></u-icon>
            <text class="text-hidden">{{ item.attachName }}</text>
            <u-icon name="arrow-right" class="file-set-right"></u-icon>
          </view>
        </view>
        <view style="background: #f6f6fc; height: 5px; margin-top: 20px"></view> -->
        <!-- <view
          class="popup-footer"
          style="justify-content: space-between; width: 100%"
        >
          <view class="btns">
            <u-button
              class="btn-iem"
              type="primary"
              text="查看单项目表"
              @click="compile"
            ></u-button>
          </view>
        </view> -->
      </view>
    </u-popup>
  </view>
</template>

<script>
// import solarClender from "./solarClender.vue";
export default {
  // components: { solarClender },
  data() {
    return {
      list1: [{ name: "设备出租" }, { name: "设备购买" }],
      contractName: "",

      list: [
        { name: "全部", id: "" },
        { name: "正常", id: "0" },
        { name: "终止", id: "1" },
      ],
      inpDate: {
        beginTime: "",
        endTime: "",
        orderCode: "",
      },
      itemNameList: [],

      // markDays: [],
      showPop: false,
      pickShow: false,
      materialList: [],

      caleType: 1,
      clickDate: "",

      nowTags: 0,
      itemShow: false,
      contractDetails: {},
      current: 0,
      nowYear: "全部",
      userName: "",
      yearList: [],
      areaId:""
    };
  },
   computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  onLoad() {
    this.init();
    // if(this.current == 0){
      this.searchDeviceClass(this.current)
    // }
  },
  methods: {
    selectOne(e) {
      this.nowYear = e.options.label;
      this.areaId = e.options.value;
    },
    searchDeviceClass(val){
      let data ={
        consumeType:val,
      }
      if(this.user.orgType != 5){
        data.fkOrgId =  uni.getStorageSync("nowOrgId")
      }
      this.$api.searchDeviceClass(data).then(res=>{
        if(res.code == 200){
          res.data.forEach(item => {
            item.label = item.className;
            item.value = item.pkId;
          });
          this.yearList = res.data
          this.yearList.unshift({label:"全部",value:""})
        }else{
          uni.showToast({ icon: "none", title: res.msg });
        }
      })
    },
    currentChange(item) {
      this.current = item.index;
      this.nowYear = "全部"
      this.areaId = ""
      this.init()
      this.searchDeviceClass(this.current)
    },
    itemLick(row) {
      this.$api.findDeviceById({ pkId: row.pkId }).then((res) => {
        if (res.code == 200) {
          this.contractDetails = res.data;
          this.contractDetails.arr =[]
          this.contractDetails.arr = res.data.deviceUrl.split(',')
          console.log(  this.contractDetails.arr)
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
      this.itemShow = true;
    },
    openPops() {
      this.itemShow = true;
    },
    closePops() {
      this.itemShow = false;
    },
    searchOk() {
      // this.pageNum = 1;
      this.init();
      this.closePop();
    },
    tagsClick(item, index, idx) {
      console.log(item);
      if (index == 1) {
        this.roleId = item.pkId;
        this.nowTags = idx;
      } else if (index == 2) {
        this.areaId = item.areaId;
        this.sendTags = idx;
      }
      this.receivingType = item.id;
    },

    openPop() {
      this.showPop = true;
    },
    closePop() {
      this.showPop = false;
      // this.inpDate={...this.searchDate}
    },
    // openPick() {
    //   this.pickShow = true;
    // },
    reset() {
      this.inpDate.beginTime = "";
      this.inpDate.endTime = "";
    },
    caleConfirm(e) {
      console.log(e);
      if (this.caleType === 1) {
        this.inpDate.beginTime = e.fulldate;
      } else if (this.caleType === 2) {
        this.inpDate.endTime = e.fulldate;
      }
    },
    openCale(type, date) {
      this.clickDate = date;
      this.caleType = type;
      // this.caleShow=true
      this.$refs.calendar.open();
    },
    pickConfirm(e) {
      console.log(e);
      this.pickCancel();
    },
    pickCancel() {
      this.pickShow = false;
    },
    init() {
      let data = {
        // enableStatus: this.list[this.nowTags].id,
        // signDate: this.inpDate.beginTime,
        // endDate: this.inpDate.endTime,
        // contractName: this.contractName,
        deviceTypeId:this.areaId,
        consumeType: this.current,
        deviceName: this.contractName,
        fkOrgId:this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId")
      };
      this.$api.searchCostDevice(data).then((res) => {
        if (res.code == 200) {
          this.itemNameList = res.data;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    add() {
      let data = {
        type: 1,
      };
      uni.navigateTo({
        url: "/pages/quality/addCheck?row=" + JSON.stringify(data),
      });
    },
    compile() {
      let item = this.contractDetails;
      uni.navigateTo({
        url: "/pages/contract/listItems?row=" + JSON.stringify(item),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
    width: 100%;
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
.search-box {
  //   position: fixed;
  //   /* #ifdef H5 */
  //   top: 176rpx;
  //   /* #endif */
  //   /* #ifdef APP-PLUS */
  //   top: 240rpx;
  //   /* #endif */
  //   //   top: 176rpx;
  margin-top: 4px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 80rpx;
  padding: 0 32rpx;
  background-color: #fff;
  .right {
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
  .left {
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
  height: 100%;
  padding: 30rpx;
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
.reset {
  width: 120rpx;
  height: 40rpx;
  line-height: 40rpx;
  background-color: #1576e6;
  color: #fff;
  font-size: 26rpx;
  text-align: center;
  border-radius: 20rpx;
}
.u-list {
  max-height: calc(100vh - 240px) !important;
}
.itemList {
  background: #fff;
  margin-top: 4px;
  padding: 6px;
  .item-bottom-text {
    padding: 2px 26px;
    font-size: 10px;
    color: #bbb;
  }
  .text-hidden {
    margin-left: 5px;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*禁⽌换⾏*/
    text-overflow: ellipsis; /*省略号*/
  }
}
.item-edit {
  // padding-bottom: 90rpx;
  .tem-edit-title {
    line-height: 80rpx;
    background: #2a82e4;
    color: #fff;
    text-indent: 2em;
  }
  .tem-edit-ico {
    position: absolute;
    right: 40rpx;
    top: 24rpx;
  }
  .item-edit-form {
    padding: 0 12rpx;
  }
}

.file-set-list {
  position: relative;
  line-height: 35px;
  border-bottom: 1px solid #eee;
  .file-set-lef {
    display: inline-block;
  }
  .file-set-right {
    position: absolute;
    right: 0;
    top: 8px;
  }
}
.popup-footer {
  position: fixed;
  bottom: 0;
  display: flex;
  width: 660rpx;
  height: 80rpx;
  // background-color: rgb(194, 155, 155);
  .btns {
    //padding: 12rpx;
    flex: 1;
    .btn-iem {
      width: 95%;
    }
  }
}
.text-hidden {
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁⽌换⾏*/
  text-overflow: ellipsis; /*省略号*/
}
.tabs {
  /deep/ .u-tabs__wrapper__nav__item {
    flex: 1;
  }
}
.list-title {
  background: linear-gradient(to right, #e6ebff, #fdfeff);
  line-height: 30px;
  padding-left: 6px;
  margin-top: 5px;
}
</style>
