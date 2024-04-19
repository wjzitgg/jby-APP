<template>
  <view class="wrapper">
    <u-navbar
      leftText="物资申请单详情"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <view style="background: #fff">
        <u-tabs class="tabs" :list="list1" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"> </u-tabs>
      </view>
      <view v-show="current == 0">
        <u--form
          labelPosition="left"
          :model="details"
          class="item-edit-form"
          style="
            padding: 8px 16px;
            background: rgb(255, 255, 255);
            margin-top: 2px;
          "
        >
          <u-form-item
            label="申请单号:"
            prop="userInfo.name"
            borderBottom
            labelWidth="80"
            ref="item1"
          >
            {{ details.orderCode }}
          </u-form-item>
          <u-form-item
            label="申请单位:"
            prop="userInfo.sex"
            borderBottom
            ref="item1"
            labelWidth="80"
          >
            {{ details.customName }}
          </u-form-item>
          <u-form-item
            label="填 表  人:"
            prop="userInfo.sex"
            borderBottom
            ref="item1"
            labelWidth="80"
          >
            {{ details.leaderName }}
          </u-form-item>
          <u-form-item
            label="业务时间:"
            prop="userInfo.sex"
            borderBottom
            ref="item1"
            labelWidth="80"
          >
            {{ details.serviceTime }}
          </u-form-item>
          <!-- <u-form-item
            label="制 单  人:"
            prop="userInfo.sex"
            borderBottom
            ref="item1"
            labelWidth="80"
          >
            {{ details.createUserName }}
          </u-form-item> -->
          <u-form-item
            label="单据时间:"
            prop="userInfo.sex"
            borderBottom
            ref="item1"
            labelWidth="80"
          >
            {{ details.createTime }}
          </u-form-item>
          <u-form-item
            label="关联项目:"
            prop="userInfo.sex"
            borderBottom
            ref="item1"
            labelWidth="100"
          >
            {{ details.projectName }}
          </u-form-item>
          <u-form-item
            label="备   注:"
            prop="userInfo.sex"
            borderBottom
            ref="item1"
            labelWidth="100"
          >
            {{ details.remark }}
          </u-form-item>
        </u--form>
      </view>
      <view class="table_detail table_empty" v-show="current == 1" style="margin-top: 2px">
        <table>
          <thead>
            <tr>
              <th style="width: 40px">序号</th>
              <th>物料明细</th>
              <th>单位</th>
              <th>申请数量</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in details.materialDetailsVoList"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ item.materialTypeName }}{{ item.materialName }}</td>
              <td>{{ item.fkUnitName }}</td>
              <td>{{ item.applyNum }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      </view>
    </view>
    <view class="box-btn" v-if="details.applyCode == '0'">
      <u-button type="success" text="编辑" @click="redact"></u-button>
      <u-button type="primary" text="提交单据" @click="submit"></u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list1: [{ name: "基础信息" }, { name: "物料信息" }],
      rowData: {},
      details: {
        materialDetailsVoList: [],
      },
      current: 0,
      contractDetails: {},
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);

    this.init();
  },
  methods: {
    currentChange(item) {
      this.current = item.index;
      console.log(this.current);
    },
    init() {
      this.$api.orderOutApplyFindById({ pkId: this.rowData.pkId }).then((res) => {
        if (res.code == 200) {
          this.details = res.data;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    redact() {
      let item = {
        itemTitle: "编辑物资申请",
        ...this.details,
      };
      uni.navigateTo({
        url: "/pages/often/stock/applyAdd?row=" + JSON.stringify(item),
      });
    },
    submit() {
      let data = {
        applyCode: 1,
        fkBidProjectId: this.details.fkBidProjectId,
        fkItemIds: this.details.fkItemIds,
        isUpdate: 0,
        leaderName: this.details.leaderName,
        materialDetailList: this.details.materialDetailsVoList,
        orderCode: this.details.orderCode,
        pkId: this.details.pkId,
        serviceTime: this.details.serviceTime,
        remark: this.details.remark,
      };
      this.$api.orderOutApplyUpdate(data).then((res) => {
        if (res.code == 200) {
          uni.navigateTo({
            url: "/pages/often/stock/request?",
          });
          uni.showToast({ icon: "none", title: res.msg });
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  /deep/ .u-tabs__wrapper__nav__item {
    flex: 1;
  }
}
.box-btn {
  display: flex;
  position: fixed;
  width: 100%;
  bottom: 0;
}
</style>
