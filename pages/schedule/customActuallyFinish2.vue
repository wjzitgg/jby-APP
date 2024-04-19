<template>
  <view class="wrapper">
    <u-navbar :leftText="navName" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="cart2">
        <view class="cart2-title">各清单产值占比</view>
        <echart :option="option" :width="662" :height="536" class="mb-10" v-if="echartShow"></echart>
         <view class="noEchart" v-else>
          <u-empty style="height: calc(100% - 32rpx)" mode="data" text="暂无清单数据" icon="/static/image/noSettleData.png"></u-empty>
        </view>
    </view>
      <u-tabs class="tabList scroll-tabs" :list="tabList" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}" :current="current" @change="currentChange" :scrollable="true"></u-tabs>
      <view class="searchs" v-if="current === 1">
      <view class="search-item">
          <easy-select ref="easySelect" size="mini" class="easySelect" :value="nowCon" @selectOne="selectOne"
            :options="conList"></easy-select>
        </view>
      <view class="search-item">
        <easy-select ref="easySelect2" size="mini" class="easySelect" :value="detailtype" @selectOne="selectOne4" :placeholder="'暂无章节'"
          :options="detailTypeList"></easy-select>
      </view>
      </view>
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
              <td>{{item.unitName}}</td>
              <td>{{ menuCodeData == 1 ? item.price : '***' }}</td>
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
      <u-empty v-if="list1.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      <u-empty v-if="!list1.length" style="height: 100%" mode="data" text="暂时没有数据哦" icon="/static/image/noData.png"></u-empty>
      </view>
      <view class="table_detail table_height2 table_empty" v-if="current === 1">
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
              <td>{{ menuCodeData == 1 ? item.designQuantities : '***' }}</td>
              <td>{{ menuCodeData == 1 ? item.price : '***' }}</td>
              <td>{{ menuCodeData == 1 ? item.designAmount : '***' }}</td>
              <td>{{ menuCodeData == 1 ? item.completeQuantities : '***' }}</td>
              <td>{{ menuCodeData == 1 ? item.finishAmount : '***' }}</td>
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
        <u-empty v-if="list2.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
        <u-empty v-if="!list2.length" style="height: 100%" mode="data" text="暂时没有数据哦" icon="/static/image/noData.png"></u-empty>
      </view>
    </view>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" />
  </view>
</template>

<script>
export default {
  onLoad(options) {
    if (!!(options.isOk - 0)) {
      this.isOk = !!(options.isOk - 0)
      this.areaId = options.id
      this.navName = options.name + '进度明细'
      this.endTime = options.endTime
    }
    this.searchMenuDataAuthorize();
    this.searchPlanActual(this.current);
    this.projectDetailPie()
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
      navName: '工区实际完成',
      tabList: [{ name: "分项列表" }, { name: "清单列表" }],
      current: 0,
      list1: [],
      // list2: [],
      nowCon: "",
      conId: "",
      conList: [],
      clickDate: "",
      caleType: 1,
      beginTime: "",
      endTime: "",
      isOk: false,
      menuCodeData: "",
      detailtype:"",
      detailTypeList:[],
      option:{},
      echartShow:true
    };
  },
  methods: {
    selectOne4(e) {
      this.detailtype = e.options.label;
    },
    searchContracts(){
      let data={
        contractType:4,
        fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
        customerIds:this.areaId
      }
      this.$api.searchContracts(data).then(res=>{
        if(res.code===200){
          this.conList= res.data.map(item=>({...item,label:item.contractName,value:item.pkId}))
          if(res.data.length){
            this.conId =res.data[0].pkId
            this.nowCon =res.data[0].contractName
            this.searchPlanActual(this.current);
          }
        }
      })
    },
    projectDetailPie(){
      let data={
        type:0,
        id:this.areaId,
        endTime:this.endTime,
        fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
      }
      this.$api.projectDetailPie(data).then(res=>{
        if(res.code===200){
          let echartsList1 = [];
          res.data.forEach((item) => {
            echartsList1.push({
              ...item,
              name: item.detailName,
              value: item.amount,
            });
          });
          console.log(echartsList1);
          this.option = {
            tooltip: {
              trigger: "item",
              formatter:this.menuCodeData==1?"{a} <br/>{b} : {c} ({d}%)":"{a} <br/>{b} : *** ({d}%)",
            },
            toolbox: {
              show: true,
              feature: {
                mark: { show: true },
              },
            },
            series: [
              {
                name: "各清单产值占比",
                type: "pie",
                radius: ["20%", "40%"],
                center: ["50%", "50%"],
                itemStyle: {
                  borderRadius: 5,
                },
                label: {
                    show: true,
                    // position: "center",
                    position: 'outer',
                    alignTo: 'edge',
                    margin: 20,
                    edgeDistance: 10,
                    formatter: function(param){
                       let text = param.data.name;
                        if (text.length < 10) {
                          return text + '\n' + param.percent + '%'
                        } else {
                          return text.substring(0, 10) + '...' + '\n' + param.percent + '%'
                        }
                    },
                    margin: 20
                  },
                emphasis: {
                  label: {
                    show: true,
                  },
                },
                data: echartsList1,
              },
            ],
          };
          if(echartsList1.length){
            this.echartShow = true;
          }else{
            this.echartShow = false;
          }
        }
      })
    },
    searchPlanActual(isItemDetail) {
      let data = {
        isItemDetail,
        customerOrWorkArea: 0,
        // finishStatus: this.typeId,
        fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
        startTime: this.beginTime,
        endTime: this.endTime,
        fkCustomerId: this.areaId,
      };
      if (isItemDetail === 1) {
        data.contractId=this.conId
      }
      this.$api
        .searchPlanActual(data)
        .then((res) => {
          if (res.code === 200) {
            if (isItemDetail === 0) {
              this.list1 = res.data;
            } else {
              // this.list2 = res.data;
              let arr=res.data
              this.detailTypeList = arr.map(item=>({value:item.itemName,label:item.itemName,...item}));
              this.detailtype=arr.length?arr[0].itemName:""
            }
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        })
        .catch((err) => { });
    },
    currentChange(e) {
      this.current = e.index;
      if(this.current==1){
        this.searchContracts()
      }else{
        this.searchPlanActual(this.current);
      }
    },
    selectOne(e) {
      console.log(e);
      this.detailTypeList=[]
      this.detailtype =""
      this.nowCon = e.options.label;
      this.conId = e.options.value;
      this.searchPlanActual(this.current);
    },
    selectOne2(e) {
      console.log(e);
      this.type = e.options.label;
      this.typeId = e.options.value;
      this.searchPlanActual(this.current);
    },
    cleanDate(e) {
      console.log(e);
      if (e == 1) {
        this.beginTime = "";
      } else {
        this.endTime = "";
      }
      this.searchPlanActual(this.current);
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
    },
    // 获取当前登录用户角色关联菜单权限数据集
    searchMenuDataAuthorize() {
      this.$api.searchMenuDataAuthorize().then(res => {
        if (res.code == 200) {
          res.data.forEach(element => {
            if (element.menuCode == 'schedule') {
              this.menuCodeData = element.states
              console.log(this.menuCodeData);
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
.wrapper{
  background-color: #fff;
}
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
.searchs{
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
    width: calc( 100% - 140rpx);
    height: 60rpx;
    padding: 0 20rpx;
    border: 1px solid #b4d0f0;
    border-radius: 6rpx;
    .left{
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
.cart2{
  margin: 20rpx;
  width: 710rpx;
  padding: 32rpx 24rpx;
  border-radius: 4px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
  .cart2-title{
    font-size: 32rpx;
    font-weight: 700;
  }
  .noEchart{
    height: 600rpx;
    padding: 32rpx 22rpx;
  }
}
</style>
