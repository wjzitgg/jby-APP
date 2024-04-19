<template>
  <view class="wrapper">
    <u-navbar
      leftText="用章管理"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <u-tabs :list="list" :current="current" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}">
        <view slot="right" style="padding-left: 4px" @tap="hamburg">
          <u-icon name="list" size="21" bold></u-icon>
        </view>
      </u-tabs>
      <view class="pull-down" v-show="show">
        <text
          :class="index == current ? 'action' : ''"
          v-for="(item, index) in list"
          :key="index"
          @click="listSelet(item, index)"
          >{{ item.name }}</text
        >
        <!-- 箭头 -->
        <u-icon
          name="arrow-up"
          color="#dddddd"
          size="20"
          class="arrow-up"
          @click="shut"
        ></u-icon>
      </view>
      <view v-show="current === 0">
        <!-- <web-view  src="https://uniapp.dcloud.io/static/web-view.html"></web-view> -->
        <iframe
          class="xq-edit"
          ref="thirdParty"
          src="https://uniapp.dcloud.io/static/web-view.html"
        ></iframe>
      </view>
      <view v-if="current === 1">
        <view>动态表格 </view>
      </view>
      <view v-if="current === 2">
        <view>流程图 </view>

      </view>
      <view v-if="current === 3">
        <view class="app-record">
          <view
            class="app-record-item"
            v-for="(item, index) in appRecordList"
            :key="index"
          >
            <view class="item-header">
              <view>{{ item.upName }}</view>
              <view>{{ item.time }}</view>
            </view>
            <view class="item-files">
              <view
                class="files-item bdb"
                v-for="(item2, index2) in item.files"
                :key="index2"
              >
                <u-icon class="file-icon" name="file-text" size="28"></u-icon>
                <view class="file-name text-hidden">{{ item2.name }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="current === 4">
        <view class="app-record">
          <view
            class="app-record-item"
            v-for="(item, index) in appRecordList"
            :key="index"
          >
            <view class="item-header">
              <view>{{ item.upName }}</view>
              <view>{{ item.time }}</view>
            </view>
            <view class="item-content">
              <view class="item-content-head">
                <u-icon class="icons" name="file-text" size="28"></u-icon>
                <view>发表：</view>
              </view>
              <view class="contents">{{ item.content }}</view>
            </view>
            <view class="item-files">
              <view
                class="files-item bdb"
                v-for="(item2, index2) in item.files"
                :key="index2"
              >
                <u-icon class="file-icon" name="file-text" size="28"></u-icon>
                <view class="file-name text-hidden">{{ item2.name }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="footer">
      <u-button
        type="primary"
        text="处理"
        @click="appBtn"
        class="btn"
      ></u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { name: "变更详情" },
        { name: "动态表格" },
        { name: "流程图" },
        { name: "附件" },
        { name: "审批记录" },
      ],
      current: 0,
      appRecordList: [
        {
          upName: "张三",
          time: "2022-10-05",
          content: "13212131231",
          files: [
            { name: "设计变更计划.pdf" },
            { name: "设计变更计划2.pdf" },
            { name: "设计变更计划3.pdf" },
          ],
        },
        {
          upName: "李四",
          time: "2022-10-06",
          content: "13212131231sfsdfsd",
          files: [{ name: "流程图.png" }],
        },
      ],
      show: false,
    };
  },
  onLoad(item) {
    console.log("===========================")
    console.log(item)
    console.log("===========================")
    // this.altitude();
  },
  watch: {

    current(val) {
      if (val == 0) {
        // console.log("=====================");
        this.altitude()
        
        console.log(uni.getWindowInfo().windowHeight);
        console.log(this.$refs.thirdParty.style.height);
        // console.log("=====================");
        // const that = this;
        // uni
        //   .createSelectorQuery()
        //   .select("#thirdParty")
        //   .boundingClientRect(function (data) {
        //     console.log("元素信息0：", data);
        //     that.vHeight += 10;
        //   })
        //   .exec();
      }
    },
  },
  methods: {
    altitude() {
      // this.$refs.thirdParty.style.height =
      this.$refs.thirdParty.style.height = uni.getWindowInfo().windowHeight + "px";
      //   uni.getWindowInfo().windowHeight + "rpx";
    },
    currentChange(item) {
      this.current = item.index;
      console.log(this.current);
    },
    appBtn() {
      this.appShow = true;
    },
    hamburg() {
      this.show = true;
    },
    shut() {
      this.show = false;
    },
    listSelet(item, index) {
      console.log("item", item);
      // 展开传值
      if (index !== undefined) {
        this.current = index;
      } else {
        this.current = item.index;
      }
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.xq-edit {
  width: 100%;
}
.content {
  position: relative;
}
.app-record {
  .app-record-item {
    padding: 0 20rpx;
    background-color: #fff;
    margin-bottom: 10rpx;
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;
      color: #bcc2cc;
    }
    .item-content {
      // display: flex;
      border-bottom: 1px solid rgba(238, 238, 238, 1);
      .item-content-head {
        display: flex;
        align-items: center;
      }
      .contents {
        padding: 20rpx 0 20rpx 60rpx;
      }
    }
    .files-item {
      display: flex;
      align-items: center;
      background-color: #fff;
      height: 80rpx;
    }
    .file-icon {
      width: 60rpx;
    }
    .file-name {
      width: 550rpx;
      height: 40rpx;
      line-height: 40rpx;
      font-size: 30rpx;
    }
    .icons {
      width: 60rpx;
    }
  }
}
.action {
  color: #203457;
}
.pull-down {
  color: #d5d9df;
  font-size: 28rpx;
  padding-bottom: 60rpx;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: absolute;
  top: 0;
  z-index: 999;
  background: #fff;
  border-radius: 0 0 20rpx 20rpx;
  text {
    width: 33.33%;
    padding: 29rpx;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
