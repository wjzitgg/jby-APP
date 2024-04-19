<template>
  <view>
    <view class="sticky" :class="{ 'sticky-left': true }">
      <u-tabs
        :list="tabList"
        :current="current"
        @change="currentChange"
        :scrollable="true"
        :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
      >
      </u-tabs>
      <view v-show="current == 0">
        <u-scroll-list
          class="scroll-list"
          :indicator="signDetail.sealScheduleDetailList.length > 2"
        >
          <view
            class="signList"
            v-for="(item, index) in signDetail.sealScheduleDetailList"
            :key="index"
          >
            <view class="sign-item">
              <view class="left"></view>
              <view class="right">
                <view class="mb-10">{{item.approveTime}}</view>
                <view class="mb-10">盖章单位:{{item.sealUnitName}}</view>
                <view class="mb-10">盖章结果:{{item.approveResult}}</view>
              </view>
            </view>
          </view>
        </u-scroll-list>
        <view class="pdfList">
          <view  v-for="(item,index) in signDetail.sealTableList" :key="index">
            <view class="img-item" v-for="(item2,index) in item.pdfToImgeList" :key="index">
              <image
              class="imgs"
              :src="item2"
              mode="widthFix"
            />
            <view class="circles" @click="checkImg(item2)">
              <image
                class="magnify"
                src="../../static/image/magnify.png"
                mode="widthFix"
              />
            </view>
            </view>
          </view>
        </view>
      </view>
      <view v-show="current == 1">
        <view class="flow-chart-box">
          <view class="flow-char-begin">
            <view class="circle">
              <view class="circle-item"></view>
              <view class="circle-icon-bottom">
                <!-- <i class="el-icon-arrow-down circle-icon"></i> -->
                <u-icon
                  size="15"
                  name="arrow-down"
                  class="el-icon-arrow-down circle-icon"
                ></u-icon>
              </view>
              <view v-if="approveSum != null" class="circle-icon-right">
                <i class="el-icon-arrow-left icon-right-left"></i>
                <u-icon size="15" name="arrow-left" class="el-icon-arrow-left icon-right-left" ></u-icon>
              </view>
            </view>
            <view class="begin-details">
              <view>{{signDetail.sealApproveDetailVo.approveDetailList&&signDetail.sealApproveDetailVo.approveDetailList.length? signDetail.sealApproveDetailVo.approveDetailList[0].approver:'' }}</view>
              <view style="text-align: center">{{ signDetail.sealApproveDetailVo.approveDetailList&&signDetail.sealApproveDetailVo.approveDetailList.length?signDetail.sealApproveDetailVo.approveDetailList[0].approveTime :''}}</view>
              <view>发起流程</view>
            </view>
            <view class="checkDetail" v-if="signDetail.sealApproveDetailVo.approveDetailList&&signDetail.sealApproveDetailVo.approveDetailList.length" @click="checkDetail(signDetail.sealApproveDetailVo.approveDetailList[0])">查看详情</view>
          </view>

          <view
            class="flow-char-item"
            v-for="(item, index) in signDetail.sealApproveDetailVo.taskFinishList"
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
                <u-icon
                  size="15"
                  name="arrow-down"
                  class="el-icon-arrow-down arrow"
                ></u-icon>
                <!-- <i class="el-icon-arrow-down arrow"></i> -->
              </view>
              <view v-show="item.approveStatus == 3" class="circle-icon-right">
                <i class="el-icon-arrow-left icon-right-left"></i>
                <u-icon size="15" name="arrow-left" class="el-icon-arrow-left icon-right-left"></u-icon>
              </view>
              <view
                v-show="item.approveStatus == 1 || item.approveStatus == 3"
                :class="{
                  'right-arrow': item.approveStatus == 3,
                  'right-arrow2': item.approveStatus == 1,
                }"
              ></view>
              <view
                v-show="approveSum > index || approveSum == index"
                :class="{
                  'upper-right': item.approveStatus != 1,
                  'upper-right2': item.approveStatus == 1,
                }"
              ></view>
              <view
                v-show="item.approveStatus == 1 || item.approveStatus == 3"
                :class="{ 'turn-down': item.approveStatus == 1, 'turn-down2': item.approveStatus == 3 }"
                >{{ item.approveStatus == 1 ? "审批不通过" : "撤回" }}</view
              >
            </view>
            <view class="char-item-right">
              <view>{{ item.assignee ? item.assignee : "跳过" }}</view>
              <view v-if="item.endTime != null" style="text-align: center">{{
                item.endTime
              }}</view>
              <view v-if="item.approveStatus == 2">审批通过</view>
              <view v-if="item.approveStatus == 1">审批不通过</view>
            </view>
            <view class="checkDetail" v-if="item.approveStatus" @click="checkDetail(item)">查看详情</view>
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
  </view>
</template>

<script>
export default {
  props: {
    signDetail: {
      type: Object,
      default: () => {
        return {
          sealApproveDetailVo: {
          taskFinishList: [], },
          sealScheduleDetailList: [{}, {}, {}],
          sealTableList: [],
        };
      },
    },
  },
  data() {
    return {
      tabList: [
        { name: "盖章信息", idx: 0 },
        { name: "本单位审批信息", idx: 1 },
      ],
      current: 0,
      showData: { taskFinishVoList: [] },

      approveSum: null,
    };
  },
  methods: {
    checkImg(url){
      console.log(url);
      // if(!item.tableUrl){
      //   return uni.showToast({
      //     title: '该文件无法预览',
      //     icon: 'none'
      //   })
      // }
      uni.previewImage({urls:[url],success:(e)=>{console.log(e);},fail:(e)=>{
        console.log(e);
      }})
    },
    currentChange(item) {
      this.current = item.index;
    },
    checkDetail(item) {
      console.log(item);
      uni.navigateTo({ url: "/pages/nodeCheck/signNodeCheck?data="+JSON.stringify(item) });
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-list {
  width: 690rpx;
  background-color: #fff;
  .signList {
    display: flex;
    width: 100%;
  }
  .sign-item {
    display: flex;
    width: 300rpx;
    height: 180rpx;
    margin: 10rpx;
    .left {
      width: 10rpx;
      height: 100%;
      background-color: #81d3f8;
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 6rpx;
      font-size: 26rpx;
      background-color: #f2f2f2;
      .mb-10 {
        margin-bottom: 10rpx;
      }
      .red {
        color: red;
      }
      .green {
        color: #70b603;
      }
    }
  }
}
.pdfList {
  overflow: auto;
  /*#ifdef APP-PLUS*/
	height: calc(100vh - 576rpx);
	/*#endif*/
	/*#ifdef H5*/
	height: calc(100vh - 488rpx);
	/*#endif*/
  
  .img-item {
    position: relative;
    width: 680rpx;
    overflow: hidden;
    .imgs {
      width: 680rpx;
    }
  }
  .circles {
    position: absolute;
    right: -80rpx;
    top: -80rpx;
    width: 160rpx;
    height: 160rpx;
    background-color: #35b9f3;
    border-radius: 50%;
    z-index: 5;
    .magnify {
      position: absolute !important;
      bottom: 20rpx;
      left: 20rpx;
      width: 50rpx;
    }
  }
}
.flow-chart-box {
  width: 600rpx;
  height: 100%;
  //   overflow: hidden auto;
  image {
    width: 30rpx;
  }
  .flow-char-begin {
    position: relative;
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
  .checkDetail {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -80rpx;
    font-size: 28rpx;
    color: #0faaf0;
  }
  .flow-char-item {
    position: relative;
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
        height: 228rpx;
        border-right: 2rpx solid;
        left: 228rpx;
        bottom: 48rpx;
      }
      .turn-down {
        position: absolute;
        background: #ffff;
        left: 220rpx;
        top: -154rpx;
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
