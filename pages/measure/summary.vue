<template>
  <view class="wrapper">
    <u-navbar leftText="工区计量汇总" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="content">
      <view class="search">
        <view class="search-datas">
          <h5 class="title">截止日期：</h5>
          <view class="data-input">
            <view class="left" @click="openCale(2)">{{ endTime }}</view>
            <view class="right">
              <u-icon name="calendar-fill" class="icons" color="#2a82e4" size="18" ></u-icon>
            </view>
          </view>
        </view>
        <view class="search-datas">
          <view class="search-item mr-14 " v-if="user.orgType != 5">
          <easy-select ref="easySelect" size="mini" class="easySelect" :value="nowBid" @selectOne="selectOne"
              :options="bidList"></easy-select>
          </view>
          <view class="search-item">
            <easy-select ref="easySelect2" size="mini" class="easySelect" :value="contractName" @selectOne="selectOne2"
              :options="contractList"></easy-select>
          </view>
        </view>
      </view>
    </view>
    <view v-if="list1.contractChapters&&list1.contractChapters.length">
      <u-tabs class="tabList bgw" :list="tabList" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}" :current="current" @change="currentChange" :scrollable="true"></u-tabs>
      <view class="cartList" v-if="current === 0">
        <view class="cart">
          <view class="cart-title">完成产值占比</view>
          <view class="progress">
            <circleProgress :value="list1.finishAmountPercentage<=1?list1.finishAmountPercentage * 100:100" :widths="200" :breadth="80" activeColor="#2a82e4" defaultColor="#dddddd"></circleProgress>
          </view>
          <view class="nums">
            <view class="nums-left">
               <view class="mb-12">已完成产值</view>
                <view :style="{color:'#2a82e4'}" class="fw">￥{{list1.finishAmount}}</view>
            </view>
            <view class="nums-right">
               <view class="mb-12">设计产值</view>
                <view class="fw" style="color: #79859a;">￥{{list1.amount}}</view>
            </view>
          </view>
        </view>
        <view class="cart">
          <view class="cart-title">已结算金额完成占比</view>
          <view class="progress">
            <circleProgress :value="list1.settleAmountPercentage<=1?list1.settleAmountPercentage * 100:100" :widths="200" :breadth="80" activeColor="#f7823e" defaultColor="#dddddd"></circleProgress>
          </view>
          <view class="nums">
            <view class="nums-left">
               <view class="mb-12">已结算金额</view>
                <view :style="{color:'#f7823e'}" class="fw">￥{{list1.settleAmount}}</view>
            </view>
            <view class="nums-right">
               <view class="mb-12">总结算金额</view>
                <view class="fw" style="color: #79859a;">￥{{list1.finishAmount}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="bgw" v-if="current === 1">
      <view style="height:20rpx"></view>
      <view class="cart2">
        <echart :option="option" :width="710" class="mb-10" v-if="echartShow"></echart>
        <view class="noEchart" v-else>
          <view class="noEchart-title fw">清单结算占比</view>
          <u-empty style="height: calc(100% - 32rpx)" mode="data" text="暂无结算清单数据" icon="/static/image/noSettleData.png"></u-empty>
        </view>
      </view>
      <u-tabs class="tabList bgw" :list="tabList2" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}" :current="current2" @change="currentChange2" :scrollable="true"></u-tabs>
      <view class="table_detail table_empty table_height">
      <table v-if="list2.length">
        <thead>
          <tr>
            <th>序号</th>
            <th>子目号</th>
            <th>清单名称</th>
            <th>单位</th>
            <th>合同单价</th>
            <th>合同工程量</th>
            <th>合同金额</th>
            <th>完成工程量</th>
            <th>已完成产值</th>
            <th>已结算金额</th>
            <th>已结算占比</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list2" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.subitemNum }}</td>
            <td>{{ item.detailName }}</td>
            <td>{{ item.unitName }}</td>
            <td>{{ menuCodeData==1?item.price:'***' }}</td>
            <td>{{ menuCodeData==1? item.amount:'***' }}</td>
            <td>{{ menuCodeData==1?item.finishNumber:'***'}}</td>
            <td>{{ item.finishNumber }} </td>
            <td>{{ menuCodeData==1?item.finishAmount :'***'}}</td>
            <td>{{ menuCodeData==1?item.settleAmount :'***'}}</td>
            <td>{{ item.settleAmountPercentage|| item.settleAmountPercentage===0?item.settleAmountPercentage * 100 + '%':''}}</td>
          </tr>
        </tbody>
      </table>
      <u-empty v-if="list2.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      <u-empty v-else style="height: 100%" mode="data" text="暂无数据"
        icon="/static/image/noData.png"></u-empty>
      </view>
      </view>
    </view>
    <view class="noData" v-else>
      <u-empty style="height: 100%" mode="data" text="该合同暂无结算数据" icon="/static/image/noData.png"></u-empty>
    </view>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" />
  </view>
</template>

<script>
import echart from "../../components/echart/echart.vue";
import circleProgress  from '../../components/progress/czc-circle-progress.vue';
import moment from "moment";
export default {
  components: { echart,circleProgress },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
    list2(){
      return this.list1.contractChapters&&this.list1.contractChapters.length ?this.list1.contractChapters[this.current2].details:[]
    }
  },
  data() {
    return {
      echartShow: false,
      option: {},
      tabList: [{ name: "计量汇总" }, { name: "按章节统计" }],
      tabList2:[],
      current: 0,
      current2: 0,
      list1: [],
      caleType: "",
      beginTime: "",
      endTime: "",
      clickDate: "",
      spanArr: [],
      count1: 0,
      count2: 0,
      count3: 0,
      menuCodeData:"",
      nowBid:"",
      bidId:"",
      bidList:[],
      contractName:"",
      contractId:"",
      contractList:[],
    };
  },
  onLoad(options) {
    let now=new Date()
    this.endTime = moment(now).format("YYYY-MM-DD");
    if(this.user.orgType==5){
      this.searchContracts()
    }else{
      this.projectListNoUserId()
    }
    this.searchMenuDataAuthorize();
  },
  methods: {
    projectListNoUserId() {
			this.$api.projectBidByProjectId().then(res => {
				if (res.code === 200) {
					this.bidList = res.data.map(item=>({...item,value:item.fkOrgId,label:item.projectName}));
					if (res.data.length) {
						this.nowBid = res.data[0].projectName;
						this.bidId = res.data[0].fkOrgId;
            this.searchContracts()
					} else {
						this.nowBid = "";
						this.bidId = "";
					}
				} else {
					uni.showToast({ title: res.msg });
				}
			});
		},
    searchContracts(){
      let data={
        contractType:1,
        fkOrgId: this.user.orgType === 5 ? "" : this.bidId,
      }
      this.$api.searchContracts(data).then(res=>{
        if(res.code===200){
          this.contractList= res.data.map(item=>({...item,label:item.contractName,value:item.pkId}))
          if(res.data.length){
            this.contractId =res.data[0].pkId
            this.contractName =res.data[0].contractName
            this.searchPlanSummary();
          }
        }
      })
    },
    selectOne(e) {
      console.log(e);
      this.nowBid = e.options.label;
      this.bidId = e.options.value;
      this.searchContracts()
      // this.searchPlanSummary();
    },
    selectOne2(e) {
      console.log(e);
      this.current2 = 0
      this.contractName = e.options.label;
      this.contractId = e.options.value;
      this.searchPlanSummary();
    },
    selectOne3(e) {
      console.log(e);
      this.contractName = e.options.label;
      this.contractId = e.options.value;
      this.searchPlanSummary();
    },
    // 筛选合并行的数组
    getSpanArr(data, id) {
      // data就是我们从后台拿到的数据
      this.spanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i][id] === data[i - 1][id]) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    searchPlanSummary() {
      let data = {
        contractId:this.contractId,
        endTime:this.endTime
      };
      uni.showLoading({ mask: true });
      this.$api
        .getSettleSummary(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            console.log(res.data);
            this.list1 = res.data;
            this.tabList2=res.data.contractChapters.map(item=>({name:item.chapterName}))
            // this.list2 = res.data.planSummaryDetailVos;
            let count1 = 0;
            let count2 = 0;
            let count3 = 0;
            let echartsList1 = [];
            count1 = res.data.designAmount
            count2 = res.data.completeAmount
            count3 = res.data.settleAmount
            this.count1 = this.menuCodeData == 1 ? count1 : "***"
            this.count2 = this.menuCodeData == 1 ? count2 : "***"
            this.count3 = this.menuCodeData == 1 ? count3 : "***"
            echartsList1 = res.data.contractDetailPieVos? res.data.contractDetailPieVos.map(item=>({value:item.settleAmount,name:item.detailName})):[]
            this.option = {
              title: [
                {
                  text: "清单结算占比",
                  left: "15%",
                  top: "0",
                  textAlign: "center",
                  subtextStyle: {
                    textAlign: "center",
                    textVerticalAlign: "middle",
                    fontSize:"16px"
                  },
                }
              ],
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
                  name: "清单结算占比",
                  type: "pie",
                  radius: ["20%", "40%"],
                  center: ["50%", "50%"],
                  itemStyle: {
                    borderRadius: 5,
                  },
                  label: {
                    show: true,
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
                  },
                  labelLine: {
                    length: 15,
                    length2: 0,
                    maxSurfaceAngle: 80
                  },
                   labelLayout: function (params) {
                      const isLeft = params.labelRect.x < myChart.getWidth() / 2;
                      const points = params.labelLinePoints;
                      // Update the end point.
                      points[2][0] = isLeft
                        ? params.labelRect.x
                        : params.labelRect.x + params.labelRect.width;
                      return {
                        labelLinePoints: points
                      };
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
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    currentChange(e) {
      this.current = e.index;
    },
    currentChange2(e) {
      this.current2 = e.index;
    },
    cleanDate(e) {
      console.log(e);
      if (e == 1) {
        this.beginTime = "";
      } else {
        this.endTime = "";
      }
      this.searchPlanSummary();
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
      this.searchPlanSummary();
    },
    // 获取当前登录用户角色关联菜单权限数据集
    searchMenuDataAuthorize() {
      this.$api.searchMenuDataAuthorize().then(res => {
        if (res.code == 200) {
          res.data.forEach(element => {
            if (element.menuCode == 'settlement') {
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
.pad {
  height: 178rpx;
}
.bgw{
  background-color: #fff;
}
.search {
  background-color: #fff;
  margin-bottom: 8rpx;
}

.mb-10 {
  margin-bottom: 10rpx;
}

.table_height {
  /*#ifdef APP-PLUS*/
  max-height: calc(100vh - 354rpx);
  /*#endif*/
  /*#ifdef H5*/
  max-height: calc(100vh - 266rpx);
  /*#endif*/
}

.search-datas {
  display: flex;
  align-items: center;
  width: 750rpx;
  height: 100rpx;
  padding: 0 20rpx;
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
    // width: 500rpx;
    flex: 1;
    height: 60rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    border: 1px solid rgba(180, 208, 240, 1);
    border-radius: 6rpx;
    .left{
      display: flex;
      align-items: center;
      // width: 450rpx;
      width: 100%;
      height: 60rpx;
    }
    .right{
      position: absolute;
      right: 20rpx;
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
  .mr-14{
    margin-right: 14rpx;
  }
}

.summary {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 750rpx;
  height: 150rpx;
  background-color: #fff;
  font-size: 28rpx;

  .summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 220rpx;
    height: 130rpx;
    background-color: #fafafa;
    border-top: 4px solid #dddddd;

    .count {
      color: #d56032;
    }
  }
}
.cartList{
   /*#ifdef APP-PLUS*/
  height: calc(100vh - 480rpx);
  /*#endif*/ 
  /*#ifdef H5*/
  height: calc(100vh - 392rpx);
  /*#endif*/
  overflow: auto;
  background-color: #fff;
  padding: 20rpx;
  .cart{
    height: 520rpx;
    padding: 32rpx 22rpx;
    margin-bottom: 20rpx;
    box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
    .cart-title{
      font-size: 32rpx;
      font-weight: 700;
    }
    .progress{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 320rpx;
    }
    .nums{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .nums-left,
        .nums-right{
          flex:1;
          font-size: 28rpx;
          
        }
        .nums-left{
          border-right: 2rpx solid #ccc;
          padding-left: 48rpx;
        }
        .nums-right{
          padding-left: 76rpx;
        }
      }
      .fw{
        font-weight: 700;
      }
    .mb-12{
      margin-bottom: 24rpx;
    }
  }
}
.cart2{
  margin: 20rpx;
  margin-top: 0;
  width: 710rpx;
  border-radius: 4px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
  .noEchart{
    height: 600rpx;
    padding: 32rpx 22rpx;
    .noEchart-title{
      font-size: 32rpx;
      font-weight: 700;
    }
  }
}
.noData{
   /*#ifdef APP-PLUS*/
  height: calc(100vh - 388rpx);
  /*#endif*/ 
  /*#ifdef H5*/
  height: calc(100vh - 300rpx);
  /*#endif*/
  background-color: #fff;
}
</style>
