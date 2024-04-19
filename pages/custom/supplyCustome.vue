<template>
  <view class="wrapper">
    <u-navbar
      leftText="选择直供对象"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="sticky">
      <view class="search">
        <u-input placeholder="请输入分包商名称" border="none" v-model="name" maxlength="25">
          <template slot="suffix">
            <u-icon name="search" size="28" @click="search"></u-icon>
          </template>
        </u-input>
      </view>
    </view>
    <view class="pad"></view>
    <view class="content">
      <u-checkbox-group
        v-model="checkList"
        placement="column"
      >
        <view class="list-cell" v-for="(item, index) in showList" :key="index">
          <u-checkbox :label="item.customName" :name="item.pkId"> </u-checkbox>
        </view>
      </u-checkbox-group>
    </view>
    <!-- <view class="pdb"></view> -->
    <view class="btn" @click="btnOk">确认</view>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    this.customSearchByProOrgId();
    this.showList = this.list;
    let arr = JSON.parse(options.subList).map((item) => item.pkId);
    this.checkList = arr;
  },
  data() {
    return {
      name: "",
      allList: [],
      list: [],
      showList: [],
      checkList: [],
    };
  },
  methods: {
    customSearchByProOrgId() {
      this.$api.customSearchByProOrgId().then((res) => {
        if (res.code === 200) {
          this.list = res.data;
          this.showList = res.data;
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    btnOk() {
      let arr = this.list.filter((item) => this.checkList.includes(item.pkId));
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit("setList", { data: JSON.stringify(arr) });
      uni.navigateBack({ delta: 1 });
    },
    search() {
      this.showList = this.list.filter(
        (item) => item.customName.indexOf(this.name) !== -1
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.pad {
  height: 80rpx;
}
.sticky {
  display: flex;
  align-items: center;
  height: 80rpx;
  background-color: #fff;
  padding: 0 20rpx;
  .search {
    width: 700rpx;
    padding-left: 20rpx;
    border: 1px solid #2a82e4;
    border-radius: 6rpx;
  }
}

.list-cell {
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  background-color: #fff;
  border-bottom: 1px solid #f3f3f3;
}
.btn {
  z-index: 5;
}
.listPd {
  padding-bottom: 100rpx;
}
/deep/ scroll-view {
  max-height: 1060rpx !important;
}
// .pdb{
//     height: 100rpx;
// }
</style>
