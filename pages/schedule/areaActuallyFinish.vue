<template>
  <view class="wrapper">
    <u-navbar
      :leftText="navName"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="sticky">
      <u-tabs
        class="tabList"
        :list="tabList"
        :activeStyle="{ color: 'rgba(32, 52, 87, 1)' }"
        :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }"
        :current="current"
        @change="currentChange"
        :scrollable="false"
      ></u-tabs>
      <view class="search" v-if="!isOk">
        <view class="search-item" v-if="!isOk">
          <easy-select
            ref="easySelect"
            size="mini"
            class="easySelect"
            :value="nowArea"
            @selectOne="selectOne"
            :options="areaList"
          ></easy-select>
        </view>
        <view class="search-datas">
          <h5 class="title">截止日期：</h5>
          <!-- <view class="data-input" @click="openCale(1)">
          {{ beginTime }}
          <view class="closeBtn" @click.stop="cleanDate(1)">X</view>
        </view>
        <view class="to">至</view> -->
          <view class="data-input">
            <view class="left" @click="openCale(2)">{{ endTime }}</view>
            <view class="closeBtn" @click.stop="cleanDate(2)">X</view>
          </view>
        </view>
      </view>

      <view class="searchs">
        <view class="search-item" v-if="current === 1">
          <easy-select
            ref="easySelect2"
            size="mini"
            class="easySelect"
            :value="contractName"
            @selectOne="selectOne4"
            :options="contractList"
          ></easy-select>
        </view>
        <view class="search-item" v-if="current === 1">
          <easy-select ref="easySelect2" size="mini" class="easySelect" :value="detailtype" @selectOne="selectOne2"
            :options="detailTypeList"></easy-select>
        </view>
      </view>
    </view>
    <view :class="{ pad: current === 1, pad2: current !== 1 }"></view>
    <view class="content">
      <view class="table_detail table_height table_empty" v-if="current === 0">
        <table v-if="list1.length">
          <thead>
            <tr>
              <th>项目编号</th>
              <th>项目名称</th>
              <th>工区</th>
              <th>单位</th>
              <th>合同单价</th>
              <th>设计工程量</th>
              <th>合同金额</th>
              <th>完成工程量</th>
              <th>完成产值</th>
              <th>完成状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list1" :key="index">
              <td>{{ item.itemCode }}</td>
              <td>{{ item.itemName }}</td>
              <td>{{ item.areaName }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ menuCodeData == 1 ? item.price : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.designQuantities : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.designAmount : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.completeQuantities : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.finishAmount : "***" }}</td>
              <td :class="{ green: item.completionStatus === 2 }">
                {{
                  item.completionStatus === 1
                    ? "未完成"
                    : item.completionStatus === 2
                    ? "已完成"
                    : ""
                }}
              </td>
            </tr>
          </tbody>
        </table>
        <u-empty
          v-if="list1.length"
          mode="data"
          text="没有更多了"
          icon="/static/image/tableNoMore.png"
        ></u-empty>
        <u-empty
          v-if="!list1.length"
          style="height: 100%"
          mode="data"
          text="暂时没有数据哦"
          icon="/static/image/noData.png"
        ></u-empty>
      </view>
      <view
        class="table_detail table_empty"
        :class="{ table_height: !isOk, table_height2: isOk }"
        v-if="current === 1"
      >
        <table v-if="list2.length">
          <thead>
            <tr>
              <th>子目号</th>
              <th>清单名称</th>
              <th>工区</th>
              <th>单位</th>
              <th>合同工程量</th>
              <th>合同单价</th>
              <th>合同金额</th>
              <th>完成工程量</th>
              <th>完成产值</th>
              <th>完成百分比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list2" :key="index">
              <td>{{ item.itemCode }}</td>
              <td>{{ item.itemName }}</td>
              <td>{{ item.areaName }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ menuCodeData == 1 ? item.designQuantities : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.price : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.designAmount : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.completeQuantities : "***" }}</td>
              <td>{{ menuCodeData == 1 ? item.finishAmount : "***" }}</td>
              <td>
                {{
                  item.designAmount
                    ? (
                        ((item.finishAmount - 0) / (item.designAmount - 0)) *
                        100
                      ).toFixed(2) + "%"
                    : "0%"
                }}
              </td>
            </tr>
          </tbody>
        </table>
        <u-empty
          v-if="list2.length"
          mode="data"
          text="没有更多了"
          icon="/static/image/tableNoMore.png"
        ></u-empty>
        <u-empty
          v-if="!list2.length"
          style="height: 100%"
          mode="data"
          text="暂时没有数据哦"
          icon="/static/image/noData.png"
        ></u-empty>
      </view>
    </view>
    <uni-calendar
      ref="calendar"
      :insert="false"
      @confirm="caleConfirm"
      :date="clickDate"
    />
  </view>
</template>

<script>
export default {
  onLoad(options) {
    if (!!(options.isOk - 0)) {
      this.isOk = !!(options.isOk - 0);
      this.areaId = options.id;
      this.navName = options.name + "进度明细";
    } else {
      this.findWorkAreasByUserId();
    }

    // this.searchPlanActual(1);
    this.searchContracts();
    this.searchMenuDataAuthorize();
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
    list2(){
     return this.detailTypeList.length?this.detailTypeList.filter(item=>item.value==this.detailtype)[0].children:[]
    }
  },
  data() {
    return {
      navName: "工区实际完成",
      tabList: [{ name: "分项列表" }, { name: "清单列表" }],
      current: 0,
      list1: [],
      // list2: [],
      nowArea: "全部",
      areaId: "",
      areaList: [],
      type: "全部",
      typeId: 0,
      typeList: [
        { value: 0, label: "全部" },
        { value: 2, label: "未完成" },
        { value: 1, label: "已完成" },
      ],
      clickDate: "",
      caleType: 1,
      beginTime: "",
      endTime: "",
      isOk: false,
      menuCodeData: "",
      detailtype: "",
      detailTypeList: [],
      contractList: [],
      contractId: "",
      contractName: "",
    };
  },
  methods: {
    searchContracts() {
      let data = {
        contractType: 1,
        workAreaIds: this.areaId,
        fkOrgId:this.user.orgType!=5?uni.getStorageSync("nowOrgId"):""
        // customerIds,
        // workAreaIds
      };
      this.$api.searchContracts(data).then((res) => {
        if (res.code == 200) {
          console.log("111111111111111111111111");
          console.log(res);
          console.log("111111111111111111111111");
          let arr = res.data;
          this.contractName = arr[0].contractName;
          this.contractId = arr[0].pkId;
          this.contractList = arr.map((item) => ({
            value: item.pkId,
            label: item.contractName,
            ...item,
          }));
          this.searchPlanActual(this.current);
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    selectOne4(e) {
      this.detailTypeList=[]
      this.detailtype=""
      this.contractName = e.options.label;
      this.contractId = e.options.value;
      // this.detailtype = e.options.label;
      this.searchPlanActual(this.current);
    },
    findWorkAreasByUserId() {
      this.$api
        .findWorkAreasByUserId({
          fkOrgId:
            this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
        })
        .then((res) => {
          if (res.code === 200) {
            this.areaList = [
              { value: "", label: "全部" },
              ...res.data.map((item) => ({
                ...item,
                label: item.areaName,
                value: item.pkId,
              })),
            ];
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        });
    },
    searchPlanActual(isItemDetail) {
      let data = {
        isItemDetail,
        customerOrWorkArea: 1,
        // finishStatus: this.typeId,
        fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
        startTime: this.beginTime,
        endTime: this.endTime,
        fkWorkAreaId: this.areaId,
        contractId: this.contractId,
        fkBidProjectId:this.user.orgType!=5?uni.getStorageSync("nowProId"):"",
      };
      if (isItemDetail == 1) {
        let data1 = {
          contractType: 1,
          workAreaIds: this.areaId,
          fkOrgId:this.user.orgType!=5?uni.getStorageSync("nowOrgId"):"",
          fkBidProjectId:this.user.orgType!=5?uni.getStorageSync("nowProId"):""
          // customerIds,
          // workAreaIds
        };
        this.$api.searchContracts(data1).then((res) => {
          if (res.code == 200) {
            if (res.data.length == 0) {
              this.contractName = "";
              this.contractId = "";
              this.contractList = [];
              return
            }
            let arr1 = res.data;
            let arrs =arr1.filter(item=>item.pkId===data.contractId)
            if(!arrs.length){
              this.contractName = arr1[0].contractName;
              this.contractId = arr1[0].pkId;
              data.contractId = this.contractId
            }
            this.contractList = arr1.map((item) => ({
              value: item.pkId,
              label: item.contractName,
              ...item,
            }));
            this.$api
              .searchPlanActual(data)
              .then((res) => {
                if (res.code === 200) {
                  if (isItemDetail === 0) {
                    this.list1 = res.data;
                  } else {
                    // if (res.data[0].children) {
                    //   this.list2 = res.data[0].children;
                    // }

                    let arr = res.data;
                    this.detailtype=arr[0].itemName
                    this.detailTypeList = arr.map((item) => ({
                      value: item.itemName,
                      label: item.itemName,
                      ...item,
                    }));
                  }
                } else {
                  uni.showToast({
                    title: res.msg,
                    icon: "none",
                  });
                }
              })
              .catch((err) => {});
            // this.searchPlanActual(this.current);
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        });
      } else {
        this.$api
          .searchPlanActual(data)
          .then((res) => {
            if (res.code === 200) {
              if (isItemDetail === 0) {
                this.list1 = res.data;
              } else {
                if (res.data[0].children) {
                  this.list2 = res.data[0].children;
                }

                let arr = res.data;
                // this.detailtype=arr[0].itemName
                this.detailTypeList = arr.map((item) => ({
                  value: item.itemName,
                  label: item.itemName,
                  ...item,
                }));
              }
            } else {
              uni.showToast({
                title: res.msg,
                icon: "none",
              });
            }
          })
          .catch((err) => {});
      }
    },
    currentChange(e) {
      this.current = e.index;
      this.searchPlanActual(this.current);
      this.searchContracts();
    },
    selectOne(e) {
      console.log(e);
      this.detailTypeList=[]
      this.detailtype=""
      this.nowArea = e.options.label;
      this.areaId = e.options.value;
      // this.searchPlanActual(0);
      this.searchPlanActual(this.current);
    },
    selectOne2(e) {
      this.detailtype = e.options.label;
      // this.searchPlanActual(1);
    },
    cleanDate(e) {
      console.log(e);
      if (e == 1) {
        this.beginTime = "";
      } else {
        this.endTime = "";
      }
      this.searchPlanActual(this.current);
      // this.searchPlanActual(1);
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
      }
      this.searchPlanActual(this.current);
      // this.searchPlanActual(1);
    },
    // 获取当前登录用户角色关联菜单权限数据集
    searchMenuDataAuthorize() {
      this.$api.searchMenuDataAuthorize().then((res) => {
        if (res.code == 200) {
          res.data.forEach((element) => {
            if (element.menuCode == "schedule") {
              this.menuCodeData = element.states;
            }
          });
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sticky {
  z-index: 20;
}

.pad {
  height: 258rpx;
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
.searchs {
  display: flex;
  align-items: center;
  .search-item {
    flex: 1;
    padding: 0 10rpx;
  }
}
.search-datas {
  display: flex;
  align-items: center;
  width: 60%;
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
    width: calc(100% - 140rpx);
    height: 60rpx;
    padding: 0 20rpx;
    border: 1px solid #b4d0f0;
    border-radius: 6rpx;
    .left {
      display: flex;
      align-items: center;
      width: 450rpx;
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
</style>
