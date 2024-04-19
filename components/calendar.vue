<template>
  <view class="calendar">
    <picker mode="date" fields="month" :value="date" @change="bindDateChange">
      <view class="uni-input"
        >{{ date }}
        <image src="../static/image/u314.png" mode="widthFix" />
      </view>
    </picker>
    <scroll-view scroll-x="true" :scroll-left="scrollLeft">
      <block v-for="(item, index) in dayList" :key="index">
        <view
          class="dayTitle"
          :class="current == index ? 'select' : ''"
          @click="timeSelectd(index)"
        >
          <view class="days">
            <view>{{ item.day }}</view>
            <view
              v-if="
                item.month == new Date().getMonth() + 1 &&
                index == new Date().getDate() - 1
              "
              >今天</view
            >
            <view v-else>周{{ item.week }}</view>
            <view
              class="red-dot"
              v-if="
                !!redList.length &&
                redList.includes(
                  item.year +
                    '-' +
                    (item.month > 10 ? item.month : '0' + item.month) +
                    '-' +
                    (item.day > 10 ? item.day : '0' + item.day)
                )
              "
            ></view>
          </view>
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
import common from "../common/common";
export default {
  props: {
    redList: {
      default: () => {
        return [];
      },
    },
  },
  created() {
    uni.getSystemInfo({
      success: (res) => {
        if (res.osName === "ios") {
          this.replaceStr = "/";
        } else {
          this.replaceStr = "-";
        }
      },
    });
    // this.dayList = common.weekDate().dayList;
    this.dayList = this.getDaysInMonth(
      new Date().getFullYear(),
      new Date().getMonth() + 1
    );
    this.$emit("getDate", common.GetNowTime(new Date()));
  },
  computed: {
    scrollLeft() {
      return (
        (uni.getWindowInfo().screenWidth / 750) *
        140 *
        (new Date().getDate() - 3)
      );
    },
  },
  data() {
    return {
      current: new Date().getDate() - 1,
      dayList: [],
      xzTime: common.GetNowTime(new Date()),
      date:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1 > 10
          ? new Date().getMonth() + 1
          : "0" + (new Date().getMonth() + 1)),
      replaceStr: "-",
    };
  },
  methods: {
    // 选择月份
    bindDateChange(e) {
      this.$emit("getMonth", e.detail.value);
      this.date = e.detail.value;
      let time = e.detail.value.split("-");
      this.dayList = this.getDaysInMonth(time[0], time[1]);
      this.timeSelectd(this.current);
    },
    // 日期选择
    timeSelectd(index) {
      this.current =
        index > this.dayList.length - 1 ? this.dayList.length - 1 : index;
      let date =
        this.dayList[this.current].year +
        this.replaceStr +
        this.dayList[this.current].month +
        this.replaceStr +
        this.dayList[this.current].day;
      date = common.GetNowTime(new Date(date));
      this.xzTime = date;
      this.$emit("getDate", date);
    },
    //根据某年某月计算出具体日期
    getDaysInMonth(year, month) {
      const daysOfMonth = [];
      month = parseInt(month, 10);
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      for (let i = 1; i <= lastDayOfMonth; i++) {
        if (i < 10) {
          daysOfMonth.push(
            year + this.replaceStr + month + this.replaceStr + "0" + i
          );
        } else {
          daysOfMonth.push(
            year + this.replaceStr + month + this.replaceStr + i
          );
        }
      }
      let arr = [];
      daysOfMonth.forEach((item) => {
        arr.push({
          day: new Date(item).getDate(),
          month: new Date(item).getMonth() + 1,
          week: common.toWeekDay(new Date(item).getDay()),
          year: new Date(item).getFullYear(),
        });
      });
      return arr;
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.calendar {
  padding: 30rpx;
  margin-bottom: 40rpx;
  background-color: #fff;
}
scroll-view {
  padding: 20rpx 0;
  width: 100%;
  white-space: nowrap;
}
.days {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 30rpx;
}
.dayTitle {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-left: 20rpx;
  text-align: center;
  display: inline-block;
}
.select {
  color: #ffffff;
  background-color: #4196e8;
}
.uni-input {
  text-align: center;
  image {
    width: 32rpx;
    margin-left: 6rpx;
  }
}
.red-dot {
  position: absolute;
  width: 5px;
  height: 5px;
  bottom: 6rpx;
  left: 50%;
  transform: translateX(-50%);
  background-color: red;
  border-radius: 50%;
}
</style>
