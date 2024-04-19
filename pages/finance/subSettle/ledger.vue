<template>
  <view class="wrapper">
    <u-navbar leftText="汇总台账" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="pdt"></view>
    <view class="content">
      <view class="search">
        <view class="left">
          <view class="search-item">
            <view class="time-box" @click="timeShow = true" style="">
              <text style="padding-left: 4px">{{ endTime }}</text>
              <u-icon v-if="endTime.length == 0" class="ico" color="#2a82e4" name="calendar-fill"></u-icon>
              <u-icon v-else class="ico" color="#2a82e4" name="trash" @click.native.stop="cleanDate"></u-icon>
             
            </view>
            <u-datetime-picker :show="timeShow" v-model="value1" mode="date" @cancel="timeClose"
              @confirm="confirm"></u-datetime-picker>
          </view>
        </view>
        <view class="right">
          <easy-select style="width: 100%; border: 1px solid rgba(180, 208, 240, 1);" ref="easySelect2" size="mini" class="easySelect" :value="customIdName" @selectOne="selectOne2"
          :options="typeList"></easy-select>
        </view>
      </view>
      <view style="margin-top: 2px;">
        <u-list class="u-list" @scrolltolower="scrolltolower">
          <view class="table_detail table_empty">
            <table>
              <thead>
                <tr>
                  <th style="width: 40px">
                    <u-icon name="list" style="display: inline-block"></u-icon>
                  </th>
                  <th>分包单位</th>
                  <th>金额变动截至时间</th>
                  <th>分包计价</th>
                  <th>物资扣除</th>
                  <th>当前结余金额</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in dataList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.customName }}</td>
                  <td>{{ item.deadlineDate }}</td>
                  <td>{{ item.priceAmount }}</td>
                  <td>{{ item.materialDeduct }}</td>
                  <td>{{ item.residueAmount }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>合计</td>
                  <td></td>
                  <td></td>
                  <td>{{ priceAmount }}</td>
                  <td>{{ materialDeduct }}</td>
                  <td>{{ residueAmount }}</td>
                </tr>
              </tfoot>
            </table>
            <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
          </view>
        </u-list>
      </view>
    </view>
  </view>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      timeShow: false,
      value1: Number(new Date()),
      endTime: "",
      pageNum: 1,
      total: "",
      userName: "",
      dataList: [],
      customIdName:"全部",
      customId:"",
      typeList: [
      { value: "", label: "全部" },
      { value: 0, label: "未完成" },
      { value: 1, label: "已完成" },
    ],
    priceAmount:0,
    materialDeduct:0,
    residueAmount:0,
    };
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  onLoad() {
    this.searchPage();
    this.searchHaveLinkOrgId();
  },
  methods: {
    selectOne2(e) {
    console.log(e);
    this.customIdName = e.options.label;
    this.customId = e.options.value;
    this.searchPage();
  },
    searchHaveLinkOrgId(){
      this.$api.searchHaveLinkOrgId({customType:4}).then(res=>{
        if(res.code == 200){
          res.data.forEach(item => {
            item.label = item.customName;
            item.value = item.pkId
          });
          this.typeList = res.data
          this.typeList.unshift({value: "", label: "全部"})
        }else{}
      })
    },
    cleanDate(){
      this.endTime =""
      this.searchPage();
    },
    confirm(e) {
      console.log(e);
      this.endTime = moment(e.value).format("YYYY-MM-DD");
      console.log(this.value1);
      this.timeShow = false;
      this.searchPage();
    },
    timeClose() {
      this.timeShow = false;
    },
    scrollTolower() {
      return console.log("11111111111111")
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
    },
    searchPage() {
      let data = {
        pageNum: this.pageNum,
        pageSize: 20,
        customId:this.customId,
        endTime: this.endTime,

        // fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
        // customName: this.userName,
        // userName
      };
      this.$api.subLedgerAmountSearchPage(data).then((res) => {
        if (res.code == 200) {
          this.dataList = res.data.records;
          this.total = res.data.total;
          this.priceAmount=res.data.priceAmount
          this.materialDeduct=res.data.materialDeduct
          this.residueAmount=res.data.residueAmount
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
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
  padding: 0 8rpx;
  background-color: #fff;

  .right {
    display: flex;
    width: 530rpx;
    // height: 60rpx;
    // border: 1px solid rgba(180, 208, 240, 1);
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

    // margin-left: 20rpx;
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

.search {
  display: flex;
  align-items: center;
  height: 80rpx;

  .search-item {
    flex: 1;
    padding: 0 10rpx;

    .time-box {
      width: 280rpx;
      line-height: 60rpx;
      border-radius: 8rpx;
      height: 60rpx;
      border: 1px solid #b4d0f0;
      position: relative;

      .ico {
        position: absolute;
        right: 8rpx;
        top: 10rpx;
      }
    }
  }

  .easySelect {
    /deep/.uni-input-wrapper {
      .uni-input-input {
        font-size: 28rpx;
      }
    }
  }
}

.text-hidden {
  overflow: hidden;
  /*超出部分隐藏*/
  white-space: nowrap;
  /*禁⽌换⾏*/
  text-overflow: ellipsis;
  /*省略号*/
}

.u-list {
  max-height: calc(100vh - 240px) !important;
}
.pdt{
  height: 14rpx;
}
</style>
