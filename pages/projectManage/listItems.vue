<template>
  <view class="wrapper">
    <u-navbar
      leftText="清单详情"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content content-top">
      <view style="background: #fff" class="sticky">
        <u-tabs
          :list="list1"
          :current="current"
          @change="currentChange"
          :activeStyle="{ color: 'rgba(32, 52, 87, 1)' }"
          :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }"
        >
          <view slot="right" style="padding-left: 4px" @tap="show = true">
            <u-icon name="list" size="21" bold></u-icon>
          </view>
        </u-tabs>
      </view>
      <view class="pull-down" v-show="show">
        <text
          class="item-tab"
          :class="index == current ? 'action' : ''"
          v-for="(item, index) in list1"
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
      <view class="table_detail table_empty">
        <table>
          <thead>
            <tr>
              <!-- <th style="width: 40px">
                <u-icon name="list" style="display: inline-block"></u-icon>
              </th> -->
              <th>子目号</th>
              <th>{{ contractType == 3 ? "物料名称" : "清单名称" }}</th>
              <th>{{ contractType == 3 ? "物料分类" : "清单类型" }}</th>
              <th>单位</th>
              <th v-if="['1', '2', '4'].includes(contractType)">设计数量</th>
              <th>合同数量</th>
              <th>清单价</th>
              <th>清单总额</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in details" :key="index">
              <td>{{ item.subitemNum }}</td>
              <td>{{ item.detailName }}</td>
              <td>{{ item.inventoryCodeName }}</td>
              <td>{{ item.unitName }}</td>
              <td v-if="['1', '2', '4'].includes(contractType)"> {{ item.inventoryCodeName == "费用类清单" ? 1 : item.quantities }} </td>
              <td> {{ item.inventoryCodeName == "费用类清单" ? 1 : item.contractNum }} </td>
              <td> {{ item.inventoryCodeName == "费用类清单" ? item.amount : item.price }} </td>
              <td>{{  item.amount  }}</td>
              <td>{{ item.remark }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty
          v-if="list1.length"
          mode="data"
          text="没有更多了"
          icon="/static/image/tableNoMore.png"
        ></u-empty>
      </view>
    </view>
    <view type="primary" class="btn" @click="derive">导出</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      rowData: {},
      list1: [],
      details: [],
      show: false,
      current: 0,
      detailListVos: [],
      contractType: "",
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);
    this.contractType = item.type;
    this.initList();
  },
  methods: {
    derive() {
      uni.showLoading({ mask: true });
      let data = { contractId: this.rowData.pkId };
      if (this.contractType == 4) {
        data.type = 1;
      }
      this.$api.contractDetailExportFile2(data).then((res) => {
        uni.hideLoading();
        if (res.code == 200) {
          this.downLoad(res.data);
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },

    initList() {
      this.$api
        .contractDetailsByContractId2({ contractId: this.rowData.pkId })
        .then((res) => {
          if (res.code == 200) {
            console.log(res);
            res.data.forEach((item) => {
              this.list1.push({
                name: item.fkChapterName,
                fkChapterId: item.fkChapterId,
              });
            });
            this.details = res.data.length
              ? res.data[0].contractDetailListVos
              : [];
            this.detailListVos = res.data;
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
    },
    currentChange(item) {
      console.log(item);
      this.current = item.index;
      this.details = this.detailListVos[this.current].contractDetailListVos;
    },
    listSelet(item, index) {
      console.log("item", item);
      // 展开传值
      if (index !== undefined) {
        this.current = index;
        this.details = this.detailListVos[index].contractDetailListVos;
      } else {
        this.current = item.index;
      }
      this.show = false;
    },
    shut() {
      this.show = false;
    },
    // 下载
    downLoad(url) {
      const downLoadTask = uni.downloadFile({
        url: url, //仅为示例，并非真实的资源
        success: (res) => {
          if (res.statusCode === 200) {
            console.log("下载成功", res);
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: function (res2) {
                // var savedFilePath = res.savedFilePath;
                console.log(res2);
                uni.showToast({
                  title: "已保存至" + res2.savedFilePath,
                });
                setTimeout(() => {
                  uni.openDocument({
                    filePath: res2.savedFilePath,
                    success: (result) => {},
                  });
                }, 1000);
              },
            });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  position: relative;
}

.content-top {
  padding-top: 90rpx;
  /deep/ .u-icon--right {
    width: 100%;
    .uicon-arrow-up {
      left: 45%;
    }
  }
}

.pull-down {
  width: 100%;
  color: #d5d9df;
  font-size: 28rpx;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: absolute;
  top: 0;
  z-index: 999;
  background: #fff;
  border-radius: 0 0 20rpx 20rpx;

  .item-tab {
    width: 33.33%;
    padding: 29rpx;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.action {
  color: #203457;
}
</style>
