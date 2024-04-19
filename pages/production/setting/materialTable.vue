<template>
  <view class="wrapper">
    <u-navbar
      leftText="材料项目表"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="sticky">
      <u-tabs
        class="tabList"
        :list="tabList"
        :current="current"
        @change="currentChange"
        :scrollable="false"
        :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
      ></u-tabs>
    </view>
    <view class="pad"> </view>
    <view class="content">
      <view class="list1 table_detail table_empty" v-if="current === 0">
        <table v-if="list.length">
          <thead>
            <tr>
              <th>编号</th>
              <th>项目名称</th>
              <th>设计使用量</th>
              <th>单位</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.itemCode }}</td>
              <td>{{ item.itemName }}</td>
              <td>{{ item.signNum }}</td>
              <td>{{ item.unitName }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="list.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
        <u-empty
          v-else
          style="height: 100%"
          mode="data"
          text="暂无数据"
          icon="/static/image/noData.png"
        ></u-empty>
      </view>
      <view class="list2 table_detail table_empty" v-if="current === 1">
        <table v-if="list2.length">
          <thead>
            <tr>
              <th>材料类型</th>
              <th>材料名称</th>
              <th>设计使用量</th>
              <th>单位</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list2" :key="index">
              <td>{{ item.materialType }}</td>
              <td>{{ item.materialName }}</td>
              <td>{{ item.signNum }}</td>
              <td>{{ item.unitName }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="list2.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
        <u-empty
          v-else
          style="height: 100%"
          mode="data"
          text="暂无数据"
          icon="/static/image/noData.png"
        ></u-empty>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    this.searchItemWithMaterials();
    this.searchMaterialSummary()
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  data() {
    return {
      tabList: [{ name: "分项材料表" }, { name: "材料汇总表" }],
      current: 0,
      list: [],
      list2: [],
    };
  },
  methods: {
    searchItemWithMaterials() {
      uni.showLoading({ mask: true });
      this.$api.searchItemWithMaterials({ fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId") })
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.list = res.data;
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    searchMaterialSummary() {
      this.$api.searchMaterialSummary({fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId")}).then((res) => {
        if (res.code == 200) {
          this.list2 = res.data;
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    currentChange(e) {
      this.current = e.index;
    },
  },
};
</script>

<style lang="scss" scoped>
.pad {
  height: 98rpx;
}
.table_detail {
  max-height: calc(100vh - 200rpx);
}
.tabList {
  background-color: #fff;
}
</style>
