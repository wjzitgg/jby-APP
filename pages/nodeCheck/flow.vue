<template>
  <view class="wrapper">
    <u-navbar
      leftText="流程图"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="flows">
      <view class="flow-chart-box">
        <view class="flow-char-begin">
          <view class="circle">
            <view class="circle-item"></view>
            <view class="circle-icon-bottom">
              <!-- <i class="el-icon-arrow-down circle-icon"></i> -->
              <u-icon size="15" name="arrow-down" class="el-icon-arrow-down circle-icon"></u-icon>
            </view>
            <view v-if="approveSum != null&&beginRow" class="circle-icon-right">
              <i class="el-icon-arrow-left icon-right-left"></i>
              <u-icon size="15" name="arrow-left" class="el-icon-arrow-left icon-right-left"></u-icon>
            </view>
          </view>
          <view class="begin-details">
            <view>{{ taskFinishVoList.length?taskFinishVoList[0].assignee:"" }}</view>
            <view>{{ taskFinishVoList.length?taskFinishVoList[0].endTime:"" }}</view>
            <view>发起流程</view>
          </view>
        </view>

        <view
          class="flow-char-item"
          v-for="(item, index) in taskFinishVoList.length?taskFinishVoList.slice(1):[]"
          :key="index"
        >
          <view
            class="char-item-left"
            :class="{
              'char-item-pass': item.approveStatus == 2,
              'char-item-nopass': item.approveStatus == 1,
            }"
          >
            <view class="char-item-left-name">
              <image src="../../static/image/avg.png" mode="widthFix" />
              <view>{{ item.activityName }}</view>
            </view>
            <view class="down-arrow">
                <u-icon size="15" name="arrow-down" class="el-icon-arrow-down arrow"></u-icon>
              <!-- <i class="el-icon-arrow-down arrow"></i> -->
            </view>
            <view v-show="item.approveStatus == 3" class="circle-icon-right">
              <i class="el-icon-arrow-left icon-right-left"></i>
              <u-icon size="15" name="arrow-left" class="el-icon-arrow-left icon-right-left"></u-icon>
            </view>
            <view
              v-show="item.approveStatus == 1 || item.approveStatus == 3"
             :class="{ 'right-arrow': item.approveStatus == 3, 'right-arrow2': item.approveStatus == 1 }"
            ></view>
            <view
              v-show="approveSum > index || approveSum == index"
              :class="{ 'upper-right': item.approveStatus != 1, 'upper-right2': item.approveStatus == 1 }"
            ></view>
            <view
              v-show="item.approveStatus == 1 || item.approveStatus == 3"
              :class="{ 'turn-down': item.approveStatus == 1, 'turn-down2': item.approveStatus == 3 }"
              >{{ item.approveStatus == 1 ? "审批不通过" : "撤回" }}</view
            >
          </view>
          <view class="char-item-right">
            <view>{{ item.assignee ? item.assignee : "跳过" }}</view>
            <view v-if="item.endTime != null">{{ item.endTime }}</view>
            <view v-if="item.approveStatus == 2">审批通过</view>
            <view v-if="item.approveStatus == 1">审批不通过</view>
          </view>
        </view>
        <view class="flow-char-end">
          <view class="circle">
            <view class="circle-item"></view>
            <view class="end">结束</view>
          </view>
          <view class="begin-details"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    this.taskFinishVoList=options.taskFinishVoList?JSON.parse(options.taskFinishVoList):[]
    if(this.taskFinishVoList.length){
      this.taskFinishVoList.slice(1).forEach((item, index) => {
        if (item.approveStatus == 1 || item.approveStatus == 3) {
          this.approveSum = index;
          if(item.approveStatus == 1){
            this.beginRow=true
          }
        }
      });
    }
  },
    data(){
        return{
            showData:{
                taskFinishVoList:[{},{activityName:"1",approveStatus:0,assignee:"张三",endTime:"2022-10-01 10:10:10"}]
            },
            taskFinishVoList:[{},{activityName:"1",approveStatus:0,assignee:"张三",endTime:"2022-10-01 10:10:10"}],
            approveSum:null,
            beginRow:false
        }
    }
};
</script>

<style lang="scss" scoped>
.flows{
    text-align: center;
}
.flow-chart-box {
  width: 600rpx;
  height: 100%;
  overflow: hidden auto;
    image{
        width: 30rpx;
    }
  .flow-char-begin {
    display: flex;
    justify-content: space-between;
    padding: 40rpx;

    .circle {
      width: 180rpx;
      line-height: 120rpx;
      text-align: center;
      vertical-align: middle;
      text-align: center;
      position: relative;

      .circle-item {
        width: 60rpx;
        height: 60rpx;
        border-radius: 30rpx;
        border: 2rpx solid;
        vertical-align: middle;
        display: inline-block;
      }

      .circle-icon-bottom {
        width: 2rpx;
        height: 80rpx;
        border-right: 2rpx solid #70b603;
        position: absolute;
        left: 49%;
        bottom: -68rpx;

        .circle-icon {
          color: #70b603;
          position: absolute;
          bottom: -18rpx;
          left: -14rpx;
        }
      }

      .circle-icon-right {
        position: absolute;
        width: 100rpx;
        border-top: 2rpx solid;
        top: 54rpx;
        left: 73%;

        .icon-right-left {
          position: absolute;
          bottom: -14rpx;
          left: -10rpx;
        }
      }
    }

    .begin-details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 240rpx;
      height: 120rpx;
      // text-align: center;
      border: 2rpx dashed;
      font-size: 22rpx;
    }
  }

  .flow-char-item {
    display: flex;
    justify-content: space-between;
    padding: 40rpx;

    .char-item-left {
      width: 180rpx;
      // line-height: 60px;
      text-align: center;
      border: 2rpx solid;
      vertical-align: middle;
      position: relative;
      border-radius: 10rpx;
      .char-item-left-name {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 120rpx;
      }
      .down-arrow {
        width: 2rpx;
        height: 80rpx;
        border-right: 2rpx dashed;
        position: absolute;
        left: 49%;

        .arrow {
          position: absolute;
          bottom: -12rpx;
          left: -14rpx;
        }
      }
      .circle-icon-right {
        position: absolute;
        width: 50rpx;
        border-top: 2rpx solid;
        top: 54rpx;
        right: -54rpx;

        .icon-right-left {
          position: absolute;
          bottom: -14rpx;
          left: -10rpx;
        }
      }
      .right-arrow {
        position: absolute;
        width: 140rpx;
        border-top: 2rpx solid;
        top: 156rpx;
        left: 50%;
      }

      .upper-right {
        position: absolute;
        height: 104rpx;
        border-right: 2rpx solid;
        left: 228rpx;
        bottom: -38rpx;
      }
      .right-arrow2 {
        position: absolute;
        width: 50rpx;
        border-top: 2rpx solid;
        top: 70rpx;
        left: 178rpx;
      }
      .upper-right2 {
        position: absolute;
        height: 218rpx;
        border-right: 2rpx solid;
        left: 228rpx;
        bottom: 48rpx;
      }
      .turn-down {
        position: absolute;
        background: #ffff;
        left: 220rpx;
        top: -134rpx;
      }
      .turn-down2{
        position: absolute;
        background: #ffff;
        left: 220rpx;
        top: 58%;
        font-size: 28rpx;
      }
    }

    .char-item-pass {
      background: #dafba9;
      border-color: #dafba9;

      .down-arrow {
        border-right: 2rpx solid #70b603;

        .arrow {
          color: #70b603;
        }
      }
    }
    .char-item-nopass {
      background: #f2a6af;
      border-color: #f2a6af;
    }
    .char-item-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 240rpx;
      height: 120rpx;
      // text-align: center;
      border: 2rpx dashed;
      // line-height: 60px;
      font-size: 24rpx;
    }
  }
  .flow-char-end {
    display: flex;
    justify-content: space-between;
    padding: 40rpx;

    .circle {
      width: 180rpx;
      line-height: 120rpx;
      text-align: center;
      vertical-align: middle;
      text-align: center;
      position: relative;

      .circle-item {
        width: 60rpx;
        height: 60rpx;
        border-radius: 30rpx;
        border: 2rpx solid;
        vertical-align: middle;
        display: inline-block;
        background-color: #000;
      }

      .circle-icon-bottom {
        width: 2rpx;
        height: 80rpx;
        border-right: 2rpx solid #70b603;
        position: absolute;
        left: 49%;
        bottom: -68rpx;

        .circle-icon {
          color: #70b603;
          position: absolute;
          bottom: -18rpx;
          left: -14rpx;
        }
      }

      .circle-icon-right {
        position: absolute;
        width: 100rpx;
        border-top: 2rpx solid;
        top: 54rpx;
        left: 73%;

        .icon-right-left {
          position: absolute;
          bottom: -14rpx;
          left: -10rpx;
        }
      }
    }
    .end {
      position: absolute;
      top: 0;
      right: -30rpx;
    }
    .begin-details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 240rpx;
      height: 120rpx;
      // text-align: center;
      // border: 1px dashed;
      font-size: 22rpx;
    }
  }
}
</style>
