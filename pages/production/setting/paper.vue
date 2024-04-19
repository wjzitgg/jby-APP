<!-- 工程图纸 -->
<template>
  <view class="wrapper">
    <u-navbar
      leftText="工程图纸"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <view class="search-input">
        <u-input
          placeholder="请输入图纸名称"
          v-model="drawingName"
          maxlength="25"
        >
        <template slot="suffix">
          <u-icon name="search" color="#2a82e4" @click="init"></u-icon>
				</template>
      </u-input>
      </view>
      <view
        class="sheet-list-table"
        v-for="(item, index) in details"
        :key="index"
        @click="tableList(item)"
      >
      
        <u-icon name="../../../static/image/picture.png" class="list-table-ico" size="20"></u-icon>
        <!-- <image src="" mode="widthFix" class="list-icon"></image> -->
        <view>
          <view class="list-table-text">{{ item.drawingName }}</view>
          <view class="list-table-page">{{ item.drawingPages +"页" }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      drawingName: "",
      rowData: {},
      details: [],
      current: 0,
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);
    // console.log( this.rowData)
    this.init()
  },
  methods: {
    tableList(row) {
      uni.navigateTo({
        url: "/pages/production/setting/drawingEdit?row="+ JSON.stringify(row),
      });
    },
    init() {
     let data = {
      drawingName:this.drawingName
     }
      if(this.rowData.orgType != 5){
        data.fkOrgId = uni.getStorageSync('nowOrgId')
      }
      this.$api
        .prodEngineeringDrawing(data)
        .then((res) => {
          if (res.code == 200) {
            this.details = res.data;
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.search-input {
  padding: 10px;
  background: #fff;
}
.sheet-list-table {
  display: flex;
  margin-top: 6px;
  padding: 8px 0px;
  background: #fff;
  .list-table-ico {
    display: inline-block;
    margin-left: 4px;
    margin-right: 12rpx;
  }
  .list-table-text {
    display: inline-block;
  }
  .list-table-page {
    padding: 10rpx 0;
    font-size: 10px;
    color: #a6aebc;
  }
}
</style>
