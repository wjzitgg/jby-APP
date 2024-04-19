<template>
   <view class="wrapper">
    <u-navbar
      leftText="管理成本"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <echart :option="option" class="mb-10" v-if="echartShow"></echart>
      <view class="search">
        <view class="search-datas">
          <h5 class="title">统计月份：</h5>
          <picker mode="date" :value="beginTime" fields='month'  @change="bindDateChange">
				        <view class="data-input"> {{beginTime}} </view>
			    </picker>
          <!-- <view class="data-input" @click="openCale(1)">
            {{ beginTime }}
            <view class="closeBtn" @click.native.stop="cleanDate(1)">X</view>
          </view> -->
        </view>
      </view>
    </view>
    <view class="table_detail table_empty table_height">
      <table v-if="list1.length">
        <thead>
          <tr>
            <th>类别名称</th>
            <th>本期结算时间</th>
            <th>上期末结算金额</th>
            <th>本期结算金额</th>
            <th>本期末结算金额</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list1" :key="index">
            <td>{{ item.className }}</td>
            <td>{{ item.settleDate }}</td>
            <td>{{ item.lastSettleAmount }}</td>
            <td>{{ item.settleAmount }}</td>
            <td>{{ item.endSettleAmount }} </td>
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
    <uni-calendar
      ref="calendar"
      :insert="false"
      @confirm="caleConfirm"
      :date="clickDate"
    />
   </view>
</template>

<script>
import echart from "../../components/echart/echart.vue";
export default {
  components: { echart },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  data() {
    return {
      echartShow: false,
      option: {},
      tabList: [{ name: "产值汇总" }, { name: "清单项目汇总" }],
      current: 0,
      list1: [],
      caleType: "",
      beginTime: "",
      endTime: "",
      clickDate: "",
      spanArr:[]
    };
  },
  onLoad(options) {
    let date=new Date()
    let month = date.getMonth()+1>10?date.getMonth()+1:'0'+(date.getMonth()+1)
    this.beginTime=date.getFullYear()+'-'+month
    this.costManagePage();
  },
  methods: {
    bindDateChange(e){
        this.beginTime=e.detail.value
        this.costManagePage()
    },
    // costManagePage(){
    //     uni.showLoading({ mask: true });
    //     this.$api.costManagePage(data).then(res=>{
    //         uni.hideLoading();
    //         if(res.code===200){
    //             this.list1=res.data
    //         }else{
    //             uni.showToast({ title: res.msg, icon: "none" });
    //         }
    //     }).catch((err) => {
    //       uni.hideLoading();
    //     });
    // },
    // 筛选合并行的数组
    costManagePage() {
      let data={
            deadline:this.beginTime,
            fkOrgId:this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
            sourceType:1
        }
      uni.showLoading({ mask: true });
      this.$api
        .costManagePage(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.list1=res.data
            let count1 = 0;
            let count2 = 0;
            let echartsList1 = [];
            let echartsList2 = [];
            this.list1.forEach((item) => {
              count1 += item.settleAmount - 0;
              count2 += item.endSettleAmount - 0;
              echartsList1.push({
                ...item,
                name: item.className,
                value: item.settleAmount,
              });
              echartsList2.push({
                ...item,
                name: item.className,
                value: item.endSettleAmount,
              });
            });
            this.option = {
              title: [
                {
                  text: "当期类别支出",
                  subtext: "合计：" + count1,
                  left: "23%",
                  top: "12%",
                  textAlign: "center",
                  subtextStyle: {
                    textAlign: "center",
                    textVerticalAlign: "middle",
                  },
                },
                {
                  text: "累计类别支出",
                  subtext: "合计：" + count2,
                  left: "73%",
                  top: "12%",
                  textAlign: "center",
                  subtextStyle: {
                    textAlign: "center",
                    textVerticalAlign: "middle",
                  },
                },
              ],
              color: [
                "#5470c6",
                "#91cc75",
                "#fac858",
                "#ee6666",
                "#73c0de",
                "#3ba272",
                "#fc8452",
                "#9a60b4",
                "#ea7ccc",
              ],
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)",
              },
              legend: {
                left: "center",
                top: "bottom",
              },
              toolbox: {
                show: true,
                feature: {
                  mark: { show: true },
                },
              },
              series: [
                {
                  name: "设计产值占比",
                  type: "pie",
                  radius: ["20%", "40%"],
                  center: ["25%", "50%"],
                  itemStyle: {
                    borderRadius: 5,
                  },
                  label: {
                    show: false,
                    position: "center",
                    formatter: "{d}%",
                  },
                  emphasis: {
                    label: {
                      show: true,
                    },
                  },
                  data: echartsList1,
                },
                {
                  name: "已完成产值占比",
                  type: "pie",
                  radius: ["20%", "40%"],
                  center: ["75%", "50%"],
                  itemStyle: {
                    borderRadius: 5,
                  },
                  label: {
                    show: false,
                    position: "center",
                    formatter: "{d}%",
                  },
                  emphasis: {
                    label: {
                      show: true,
                    },
                  },
                  data: echartsList2,
                },
              ],
            };
            this.echartShow = true;
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
    cleanDate(e) {
      console.log(e);
      if (e == 1) {
        this.beginTime = "";
      } else {
        this.endTime = "";
      }
      this.costManagePage();
    },
  },
};
</script>

<style lang="scss" scoped>
.pad {
  height: 178rpx;
}
.search {
  background-color: #fff;
}
.mb-10 {
  margin-bottom: 10rpx;
}
.table_height {
  /*#ifdef APP-PLUS*/
  max-height: calc(100vh - 284rpx);
  /*#endif*/
  /*#ifdef H5*/
  max-height: calc(100vh - 176rpx);
  /*#endif*/
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
    width: 540rpx;
    height: 60rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    border: 1px solid #dcdfe6;
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
</style>
