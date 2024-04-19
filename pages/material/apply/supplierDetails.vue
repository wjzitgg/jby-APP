<template>
  <view class="wrapper">
    <u-navbar leftText="物资供应申请单" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="content">
      <view style="background: #fff">
        <u-tabs class="tabs" :list="list1" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"> </u-tabs>
      </view>
      <view v-show="current == 0" style="width:750rpx">
        <tableForm :list="[
        {name:'申请单号',value:details.orderCode,show:true},
        {name:'申请单位',value:details.customName,show:true},
        {name:'填表人',value:details.leaderName,show:true},
        {name:'业务时间',value:details.serviceTime,show:true},
        {name:'制单人',value:details.createUserName,show:true},
        {name:'单据时间',value:details.createTime,show:true},
        {name:'备注',value:details.remark,show:true},
        ]"
        ></tableForm>
        <!-- <u--form labelPosition="left" :model="details" class="item-edit-form" style="
            padding: 8px 16px;
            background: rgb(255, 255, 255);
            margin-top: 2px;
          ">
          <u-form-item label="申请单号:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
            {{ details.orderCode }}
          </u-form-item>
          <u-form-item label="申请单位:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
            {{ details.customName }}
          </u-form-item>
          <u-form-item label="负 责  人:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
            {{ details.leaderName }}
          </u-form-item>
          <u-form-item label="业务时间:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
            {{ details.serviceTime }}
          </u-form-item>
          <u-form-item label="制 单  人:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
            {{ details.createUserName }}
          </u-form-item>
          <u-form-item label="单据时间:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
            {{ details.createTime }}
          </u-form-item>
          <u-form-item label="备   注:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="100">
            {{ details.remark }}
          </u-form-item>
        </u--form> -->
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
            <tr v-for="(item, index) in details.materialDetailsVoList" :key="index">
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
    <u-popup :show="show1" mode="center" @close="close" @open="open">
      <view style="padding:6px">
        <view>驳回原因:</view>
        <view style="margin-top: 6px;">
          <u--textarea v-model="reason" placeholder="请输入内容" maxlength="100"></u--textarea>
        </view>
        <view style="margin-top: 6px;text-align: right;">
          <u-button type="primary" text="确定" @click="submit(3)"></u-button>
        </view>
      </view>
    </u-popup>
    <view class="box-btn" >
      <u-button type="error" v-if="details.handleStatus == '1'" text="驳回" @click="redact"></u-button>
      <u-button type="primary"  v-if="details.handleStatus == '1'" text="处理" @click="submit(2)"></u-button>
    </view>
  </view>
</template>

<script>
import tableForm from '../../../components/table-form/table-form.vue';
export default {
  components:{tableForm},
  data() {
    return {
      list1: [{ name: "基础信息" }, { name: "物料信息" }],
      rowData: {},
      details: {
        materialDetailsVoList: [],
      },
      current: 0,
      contractDetails: {},
      show1: false,
      reason: ""
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);

    this.init();
  },
  methods: {
    open() {
      // console.log('open');
    },
    close() {
      this.show1 = false
      this.reason = ""
      // console.log('close');
    },
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
      this.reason = ""
      this.show1 = true;
    },
    submit(val) {
      let data = {
        pkId: this.details.pkId,
        businessType: val,
        reason: this.reason
      };
      this.$api.updateApplyCode(data).then((res) => {
        if (res.code == 200) {
          // uni.navigateTo({
          //   url: "/pages/material/apply/supplier?",
          // });
          uni.showToast({ icon: "none", title: res.msg });
            setTimeout(() => {
              let pages = getCurrentPages()
              let prevPage = pages[pages.length - 2]; // 上一页面实例
              prevPage.$vm.resh() // 调用上一页 定义的方法
              uni.navigateBack({ delta: 1 });
            }, 500)
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

/deep/ .u-popup__content {
  width: 100%;
}
</style>
