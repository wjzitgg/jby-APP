<template>
  <view class="wrapper">
    <u-navbar leftText="物资申请单详情" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="content">
      <view style="background: #fff">
        <u-tabs class="tabs" :list="list1" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"> </u-tabs>
      </view>
      <view v-show="current == 0" style="width:750rpx">
        <tableForm :list="[
        {name:'出库对象',value:details.issueCodeName,show:true},
        {name:'申请单号',value:details.orderCode,show:true},
        {name:'标段项目',value:details.projectName,show:true},
        {name:'分包单位',value:details.customName,show:details.issueCode == 'delivery_subcontract'},
        {name:'关联采购计划单',value:details.reOutApplyVoList[0]?details.reOutApplyVoList[0].purchaseOrderCode:'',show:details.reOutApplyVoList[0]},
        {name:'负责人',value:details.leaderName,show:true},
        {name:'申请时间',value:details.serviceTime,show:true},
        {name:'录入时间',value:details.createTime,show:true},
        {name:'状态',value:details.applyCode,show:true},
        {name:'备注',value:details.remark,show:true},
        ]"
        ></tableForm>
        <!-- <u--form labelPosition="left" :model="details" class="item-edit-form" style="
            padding: 8px 16px;
            background: rgb(255, 255, 255);
            margin-top: 2px;
          ">
          <u-form-item label="出库对象:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
            {{ details.issueCodeName }}
          </u-form-item>
          <u-form-item label="申请单号:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
            {{ details.orderCode }}
          </u-form-item>
          <u-form-item label="标段项目:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
            {{ details.projectName }}
          </u-form-item>
          <u-form-item v-if="details.issueCode == 'delivery_subcontract'" label="分包单位:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
            {{ details.customName }}
          </u-form-item>
          <u-form-item label="关联采购计划单:" v-if="details.reOutApplyVoList[0] != undefined" prop="userInfo.sex" borderBottom ref="item1" labelWidth="90">
            {{ details.reOutApplyVoList[0].purchaseOrderCode }}
          </u-form-item>
          <u-form-item label="填 表  人:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
            {{ details.leaderName }}
          </u-form-item>
          <u-form-item label="申请时间:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
            {{ details.serviceTime }}
          </u-form-item>
          <u-form-item label="录入时间:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
            {{ details.createTime }}
          </u-form-item>
          <u-form-item label="状态:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
            {{ details.applyCode }}
          </u-form-item>
          <u-form-item label="备注:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
            {{ details.remark }}
          </u-form-item>
        </u--form> -->
      </view>
      <view class="table_detail table_empty" v-show="current == 1" style="margin-top: 2px">
        <table>
          <thead>
            <tr>
              <th style="width: 40px">序号</th>
              <th>物料名称</th>
              <th>物料分类</th>
              <th>单位</th>
              <th>采购计划数量</th>
              <th>物料单价</th>
              <th>申请数量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in details.materialDetailsVoList" :key="index">
              <td>{{ index + 1 }}</td>
              <!-- <td>{{ item.fkTypeName }}>{{ item.materialName }}</td> -->
              
              <td>{{ item.materialName }}</td>
              <td>{{ item.fkTypeName }}</td>


              <td>{{ item.fkUnitName }}</td>
              <td>{{ item.purchaseApplyNum }}</td>
              <td>{{ item.materialPrice }}</td>
              <td>{{ item.applyNum }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      </view>
    </view>
    <view class="box-btn">
      <u-button v-if="details.applyCode == '0' || details.applyCode == '草稿'" type="success" text="编辑"
        @click="redact"></u-button>
      <u-button v-if="details.applyCode == '0' || details.applyCode == '草稿'" type="error" text="删除"
        @click="expurgate(0)"></u-button>
      <!-- <u-button v-if="details.applyCode == '0' || details.applyCode == '草稿'" type="primary" text="提交单据"
        @click="submit"></u-button> -->
      <u-button v-if="details.applyCode == '1' || details.applyCode == '待确认'" type="error" text="撤回"
        @click="expurgate(1)"></u-button>
    </view>
    <u-modal :show="show2" title="提示" :content="promptContent" showCancelButton @cancel="show2 = false"
      @confirm="confirm"></u-modal>
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
        orderApplyMaterialDetails: [],
        reOutApplyVoList:[]
      },
      current: 0,
      contractDetails: {},
      show2: false,
      promptContent: "确定删除该申请单信息？",
    };
  },
  onLoad(item) {
    if (item.row != undefined) {
      this.rowData = JSON.parse(item.row);
    }


    this.init();
  },
  methods: {
    expurgate(val) {
      this.show2 = true;
      if (val == 0) {
        this.promptContent = "确定删除该申请单信息？";
      } else {
        this.promptContent = " 确定撤回该物资申请单？";
      }
    },
    // 删除确认
    confirm() {
      this.show2 = false;
      uni.showLoading({ mask: true })
      if (this.promptContent == "确定删除该申请单信息？") {
        this.orderOutApplyDelete()
      } else {
        this.updateApplyCode()
      }

    },
    updateApplyCode() {
      let data = { pkId: this.rowData.pkId, businessType: 1, reason: "" }
      this.$api.updateApplyCode(data).then(res => {
        uni.hideLoading();
        if (res.code == 200) {
          // this.$nextTick(() => {
          //   uni.showToast({ title: "撤回成功" });
          //   uni.navigateTo({
          //     url: "/pages/material/inventory/request?",
          //   });
          //   // uni.navigateBack({ delta: 1 });
          // }, 1000)
          uni.showToast({ title: "撤回成功" });
          setTimeout(() => {
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh()
            uni.navigateBack();
          }, 500)
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    orderOutApplyDelete() {
      this.$api.orderOutApplyDelete({ pkId: this.rowData.pkId }).then(res => {
        uni.hideLoading();
        if (res.code == 200) {
          // this.$nextTick(() => {
          // uni.showToast({ title: "删除成功" });
          // uni.navigateTo({
          //   url: "/pages/material/inventory/request?",
          // });
          // uni.navigateBack({ delta: 1 });
          // }, 1000)
          uni.showToast({ title: "删除成功" });
          setTimeout(() => {
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh()
            uni.navigateBack();
          }, 500)
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    currentChange(item) {
      this.current = item.index;
      console.log(this.current);
    },
    init() {
      this.$api.orderOutApplyFindById({ pkId: this.rowData.pkId }).then((res) => {
        if (res.code == 200) {
          this.details = res.data;
          // materialDetailsVoList
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
      // 
      uni.navigateTo({
        url: "/pages/material/inventory/applyAdd?row=" + JSON.stringify(item),
      });
    },
    submit() {
      let data = {
        applyCode: 1,
        isUpdate: 0,
        materialDetailList: this.details.materialDetailsVoList,
        orderCode: this.details.orderCode,
        pkId: this.details.pkId,
        serviceTime: this.details.serviceTime,
        fkCustomerId: this.details.fkCustomerId,
        remark: this.details.remark,
        // fkBidProjectId: this.details.fkBidProjectId,
        // fkItemIds: this.details.fkItemIds,
        // leaderName: this.details.leaderName,
      };
      // details.orderCode
      // orderOutApplyUpdate
      this.$api.orderOutApplyUpdate(data).then((res) => {
        if (res.code == 200) {
          let pages = getCurrentPages()
          let prevPage = pages[pages.length - 2]; // 上一页面实例
          prevPage.$vm.search()
          uni.navigateBack(1);
          // uni.navigateBack({ delta: 1 });
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
