<template>
  <view class="wrapper">
    <u-navbar leftText="进度汇总" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="content">
      <view class="pad"></view>
      <view class="search">
        <u-tabs class="tabList scroll-tabs" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}" :list="tabList" :current="current" @change="currentChange" :scrollable="true"></u-tabs>
        <view class="search-datas">
          <h5 class="title">截止日期：</h5>
          <view class="data-input">
            <view class="left" @click="openCale(2)">{{ endTime }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="cartList" v-if="current === 0">
      <view class="cart" v-for="(item,index) in cartList" :key="index">
        <view class="cart-left">
          <circleProgress :value="item.per" :widths="156" :breadth="60" :activeColor="colorList[index]" defaultColor="#dddddd"></circleProgress>
        </view>
        <view class="cart-right">
          <view class="titles">{{item.name}}</view>
          <view class="nums">
            <view class="nums-left">
              <view class="nums-title">完成产值</view>
              <view :style="{color:colorList[index]}" class="fw">￥{{item.val1}}</view>
            </view>
            <view class="nums-right">
              <view class="nums-title">计划产值</view>
              <view style="color:rgba(32, 52, 87, 1)" class="fw">￥{{item.val2}}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- <view class="cart2" v-if="current === 1">
        <view class="cart2-title">设计产值占比</view>
        <echart :option="option" :width="662" :height="536" class="mb-10" v-if="echartShow"></echart>
    </view> -->
    <view class="table_detail table_height table_empty" v-if="current === 1">
      <table v-if="list1.length">
        <thead>
          <tr>
            <th rowspan="2"><u-icon name="/static/image/tableIndex.png" style="display: inline-block"></u-icon></th>
            <th rowspan="2" v-if="user.orgType == 11 || user.orgType == 12">建设单位</th>
              <th rowspan="2" v-if="user.orgType == 10">下属单位</th>
              <th rowspan="2" v-if="user.orgType == 11 || user.orgType == 12">项目</th>
            <th rowspan="2">标段</th>
            <th colspan="3">本月度</th>
            <th colspan="3">本季度</th>
            <th colspan="3">本年度</th>
            <th colspan="3">开累</th>
          </tr>
          <tr>
            <th class="tuoTh">计划产值</th>
            <th class="tuoTh">完成产值</th>
            <th class="tuoTh">完成占比</th>
            <th class="tuoTh">计划产值</th>
            <th class="tuoTh">完成产值</th>
            <th class="tuoTh">完成占比</th>
            <th class="tuoTh">计划产值</th>
            <th class="tuoTh">完成产值</th>
            <th class="tuoTh">完成占比</th>
            <th class="tuoTh">合同金额</th>
            <th class="tuoTh">完成产值</th>
            <th class="tuoTh">完成占比</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list1" :key="index">
            <td><text @click="tdClick(item)" class="clickTd">{{ index + 1 }}</text></td>
            <!-- <td v-if="!!spanArr[index]" :rowspan="spanArr[index]" :colspan="spanArr[index] > 0 ? 1 : 0">{{ item.orgName }}
            </td> -->
            <td v-if="user.orgType == 11 || user.orgType == 12">{{ item.orgName }}</td>
            <td v-if="user.orgType == 10">{{ item.orgName }}</td>
            <td v-if="user.orgType == 11 || user.orgType == 12">{{ item.fkProjectName }}</td>
            <td>{{ item.fkBidProjectName }}</td>
            <td>{{item.monthlyPlanAmount}}</td>
            <td>{{item.monthlyAmount}}</td>
            <td>{{item.monthlyPercentage}}</td>
            <td>{{item.quarterPlanAmount}}</td>
            <td>{{item.quarterAmount}}</td>
            <td>{{item.quarterPercentage}}</td>
            <td>{{item.yearPlanAmount}}</td>
            <td>{{item.yearAmount}}</td>
            <td>{{item.yearPercentage}}</td>
            <td>{{item.contractAmount}}</td>
            <td>{{item.amount}}</td>
            <td>{{item.percentage +'%'}}</td>
          </tr>
        </tbody>
      </table>
      <u-empty v-if="list1.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      <u-empty v-if="!list1.length" style="height: 100%" mode="data" text="暂时没有数据哦" icon="/static/image/noData.png"></u-empty>
    </view>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" />
  </view>
</template>

<script>
import echart from "../../components/echart/echart.vue";
import circleProgress  from '../../components/progress/czc-circle-progress.vue';
import moment from "moment";
export default {
  components: { echart ,circleProgress },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  data() {
    return {
      echartShow: false,
      option: {},
      tabList: [{ name: "数据汇总" }, { name: "各单位统计" }],
      current: 0,
      list1: [],
      list2: [],
      caleType: "",
      beginTime: "",
      endTime: "",
      clickDate: "",
      spanArr: [],
      menuCodeData:"",
      colorList:["#19a674", "#2a82e4", "#f7823e", "#ba0022"],
      cartList:[]
    };
  },
  onLoad(options) {
    let now=new Date()
    this.endTime = moment(now).format("YYYY-MM-DD");
    this.superiorSummary();
    this.searchRealityPage()
  },
  methods: {
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
    superiorSummary() {
      let data = {
        engDate: this.endTime,
      };
      uni.showLoading({ mask: true });
      this.$api
        .superiorSummary(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.cartList=[
              {name:"本月度计划完成占比",val1:res.data.monthlyAmount,val2:res.data.monthlyPlanAmount,per:res.data.monthlyPercentage},
              {name:"本季度计划完成占比",val1:res.data.quarterAmount,val2:res.data.quarterPlanAmount,per:res.data.quarterPercentage},
              {name:"本年度计划完成占比",val1:res.data.yearAmount,val2:res.data.yearPlanAmount,per:res.data.yearPercentage},
              {name:"开累计划完成占比",val1:res.data.amount,val2:res.data.contractAmount,per:res.data.percentage},
            ]
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    searchRealityPage() {
      let data = {
        pageNum:1,
        pageSize:10000,
        endTime: this.endTime,
      };
      uni.showLoading({ mask: true });
      this.$api
        .searchRealityPage(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.list1=res.data.records
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    tdClick(item) {
      console.log(item);
      uni.navigateTo({
        url: `/pages/scheduleData/actuallyFinish?id=${item.pkId}&endTime=${this.endTime}`,
      });
    },
    currentChange(e) {
      this.current = e.index;
    },
    cleanDate(e) {
      console.log(e);
      if (e == 1) {
        this.beginTime = "";
      } else {
        this.endTime = "";
      }
      this.superiorSummary();
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
      this.superiorSummary();
      this.searchRealityPage()
    },
    // 获取当前登录用户角色关联菜单权限数据集
    searchMenuDataAuthorize() {
      this.$api.searchMenuDataAuthorize().then(res => {
        if (res.code == 200) {
          res.data.forEach(element => {
            if (element.menuCode == 'schedule') {
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
  /*#ifdef APP-PLUS*/
  height: 18rpx
  /*#endif*/

}

.search {
  background-color: #fff;
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
  height: 80rpx;
  padding: 0 40rpx;

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
.cartList{
   /*#ifdef APP-PLUS*/
  height: calc(100vh - 354rpx);
  /*#endif*/
  /*#ifdef H5*/
  height: calc(100vh - 266rpx);
  /*#endif*/
  background-color: #fff;
  padding: 20rpx;
  .cart{
    display: flex;
    align-items: center;
    height: 240rpx;
    padding: 40rpx;
    margin-bottom: 20rpx;
    box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
    .cart-left{
      margin-right: 40rpx;
    }
    .cart-right{
      flex: 1;
      height: 100%;
      
      .titles{
        font-weight: 700;
        font-size: 32rpx;
        margin-bottom: 24rpx;
        margin-top: 22rpx;
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
          .nums-title{
            margin-bottom: 10rpx;
            font-size: 24rpx;
          }
        }
        .nums-left{
          border-right: 2rpx solid #ccc;
        }
        .nums-right{
          padding-left: 32rpx;
        }
        .fw{
          font-weight: 700;
        }
      }
    }
  }
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
}
.tabList{
  font-weight: 700;
}
</style>
