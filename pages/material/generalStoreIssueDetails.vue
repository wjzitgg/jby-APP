<template>
  <view class="wrapper">
    <u-navbar leftText="普通材料发料详情" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="content">
      <view style="background: #fff">
        <u-tabs class="tabs" :list="list1" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"> </u-tabs>
      </view>
      <view v-show="current == 0" style="width:750rpx">
			<tableForm :list="[
        		{name:'发料需求单号',value:details.orderCode,show:true},
        		{name:details.typeCodeName?details.typeCodeName:'',value:details.customerName,show:true},
        		{name:'出库仓库',value:details.fkWarehouseName,show:true},
        		{name:'填表人',value:details.leaderName,show:true},
        		{name:'业务时间',value:details.serviceTime,show:true},
        		{name:'制单人',value:details.createUserName,show:true},
        		{name:'录入时间',value:details.createTime,show:true},
        		{name:'单据金额',value:details.totalAmount,show:true},
        		{name:'关联入库单',value:details.warehousingName,show:true},
        		{name:'关联申请单',value:details.applyName,show:true},
        		{name:'收料地址',value:details.receiptAddress,show:true},
        		{name:'备注',value:details.remark,show:true},
        		{name:'单据状态',value:details.issueCode,show:true},
        		]"
        		></tableForm>
			</view>
      <!-- <view v-show="current == 0">
        <u--form labelPosition="left" :model="details" class="item-edit-form">
          <u-form-item label="发料需求单号:" prop="userInfo.name" borderBottom labelWidth="100" ref="item1">
            <text class="form-text"> {{ details.orderCode }}</text>
          </u-form-item>
          <u-form-item label="发料需求单号:" prop="userInfo.name" borderBottom labelWidth="100" ref="item1">
            <text class="form-text"> {{ details.typeCodeName }} </text>
          </u-form-item>
          <u-form-item :label="details.typeCodeName + ':'" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
            <text class="form-text">{{ details.customerName }}</text>
          </u-form-item>
          <u-form-item label="出库仓库:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
            <text class="form-text">{{ details.fkWarehouseName }}</text>
          </u-form-item>
          <u-form-item label="负 责  人:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
            <text class="form-text">{{ details.leaderName }}</text>
          </u-form-item>
          <u-form-item label="业务时间:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
            <text class="form-text">{{ details.serviceTime }}</text>
          </u-form-item>
          <u-form-item label="制 单  人:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
            <text class="form-text">{{ details.createUserName }}</text>
          </u-form-item>
          <u-form-item label="录入时间:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
            <text class="form-text">{{ details.createTime }}</text>
          </u-form-item>
          <u-form-item label="单据金额:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
            <text class="form-text">{{ details.totalAmount }}</text>
          </u-form-item>
          <u-form-item label="关联入库单:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="100">
            <text class="form-text">{{ details.warehousingName }}</text>
          </u-form-item>
          <u-form-item label="关联申请单:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="100">
            <text class="form-text">{{ details.applyName }}</text>
          </u-form-item>
          <u-form-item label="收料地址:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
            <text class="form-text">{{ details.receiptAddress }}</text>
          </u-form-item>
          <u-form-item label="备   注:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="70">
            <text class="form-text">{{ details.remark }}</text>
          </u-form-item>
          <u-form-item label="单据状态:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="100">
            <text class="form-text">{{ details.issueCode }}</text>
          </u-form-item>
        </u--form>
      </view> -->
      <view class="table_detail table_empty" v-show="current == 1" style="margin-top: 2px">
        <table>
          <thead>
            <tr>
              <th style="width: 40px">序号</th>
              <th>物料名称</th>
              <th>物料分类</th>
              <th>供应商</th>
              <th>检测状态</th>
              <th>单位</th>
              <!-- <th>当前库存量</th> -->
              <th>需出库数量</th>
              <th>物料单价</th>
              <th>金额</th>
          
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in details.orderOrdinaryDetails" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.materialName }}</td>
              <td>{{ item.materialTypeName }}</td>
              <td>{{ item.customerName }}</td>
              <td>
                <text v-if="item.passStatus =='0'">合格</text>
                <text v-if="item.passStatus =='1'">不合格</text> 
                <text v-if="item.passStatus =='2'">待检测</text>  
              </td>
              <td>{{ item.unitName }}</td>
              <!-- <td>{{ item.stockNum }}</td> -->
              <td>{{ item.grantNum }}</td>
              <td>{{ item.materialPrice }}</td>
              <td>{{ item.grantNum * item.materialPrice }}</td>
        
            </tr>
          </tbody>
        </table>
        <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      </view>
    </view>
    <u-modal :show="show2" title="提示" :content="promptContent" showCancelButton @cancel="show2 = false"
      @confirm="confirm"></u-modal>
    <view class="box-btn">
      <u-button type="success" v-if="details.isUpdate == '1' && $auth('material:generalStoreIssue:update')" text="编辑"
        @click="redact"></u-button>
      <u-button type="error" v-if="details.isWithdraw == '1' && $auth('material:generalStoreIssue:withdraw')" text="撤回"
        @click="expurgate(2)"></u-button>
      <!-- <u-button type="primary" v-if="details.issueCode == '0' || details.issueCode == '草稿'" text="提交单据"
        @click="submit"></u-button> -->
      <u-button type="error" v-if="details.isTermination == '1'" text="终止" @click="expurgate(3)"></u-button>
      <u-button type="error" v-if="details.isDelete == '1' && $auth('material:generalStoreIssue:delete')" text="删除"
        @click="expurgate(1)"></u-button>
    </view>

    <u-popup :show="handlePopShow" mode="center" :round="10">
      <view class="handlePop">
        <view class="handlePop-head">
          <view class="name">终止原因</view>
        </view>
        <view class="content" style="padding: 5px;">
          <u--textarea v-model="reason" maxlength="100"></u--textarea>
        </view>
        <view class="handlePop-footer">
          <view class="handlePopBtns" type="info" @click="closeHandlePop">取消</view>
          <view class="handlePopBtns primary" @click="handleOk">确认</view>
        </view>
      </view>

    </u-popup>
  </view>
</template>

<script>
import tableForm from '../../components/table-form/table-form.vue';
export default {
  components:{tableForm},
  data() {
    return {
      list1: [{ name: "基础信息" }, { name: "物料信息" }],
      rowData: {},
      details: {
        orderOrdinaryDetails: [],
      },
      current: 0,
      contractDetails: {},
      show2: false,
      promptContent: "",
      handlePopShow: false,
      reason: ""
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);

    this.init();
  },
  methods: {
    closeHandlePop() {
      this.reason = ""
      this.handlePopShow = false
    },
    handleOk() {
      this.revocation(2);
    },
    currentChange(item) {
      this.current = item.index;
      console.log(this.current);

    },
    init() {
      this.$api
        .orderOrdinaryApplyFindById({ pkId: this.rowData.pkId })
        .then((res) => {
          if (res.code == 200) {
            this.details = res.data;
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
    },
    redact() {
      let item = {
        itemTitle: "编辑普通材料发料",
        ...this.details,
      };
      uni.navigateTo({
        url: "/pages/material/generalStoreIssueAdd?row=" + JSON.stringify(item),
      });
    },
    submit() {
      let data = {
        issueCode: 1,
        fkCustomerId: this.details.fkCustomerId,
        fkWarehouseId: this.details.fkWarehouseId,
        isUpdate: this.details.isUpdate,
        leaderName: this.details.leaderName,
        orderCode: this.details.orderCode,
        pkId: this.details.pkId,
        serviceTime: this.details.serviceTime,
        typeCode: this.details.typeCode,
        applyIds: this.details.applyIds,
        orderOrdinaryDetails: this.details.orderOrdinaryDetails,
        receiptAddress: this.details.receiptAddress,
        warehousingIds: this.details.warehousingIds,
      };
      this.$api.orderOrdinaryApplyUpdate(data).then((res) => {
        if (res.code == 200) {
          uni.navigateTo({
            url: "/pages/material/generalStoreIssue?",
          });
          uni.showToast({ icon: "none", title: res.msg });
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    withdraw() {

    },
    expurgate(val) {
      if (val == 1) {
        this.promptContent = "确定删除该发料需求单？"
      } else if (val == 2) {
        this.promptContent = "确定撤回该发料需求单？"
      } else if (val == 3) {
        // this.promptContent = "确定终止该发料需求单？"
        return this.handlePopShow = true

      }
      this.show2 = true;
    },
    // 删除确认
    confirm() {
      this.show2 = false;
      if (this.promptContent == "确定删除该发料需求单？") {
        this.deleteDep();
      } else {
        this.revocation(this.promptContent == "确定撤回该发料需求单？" ? 1 : 2);
      }

    },
    deleteDep() {
      this.$api
        .orderOrdinaryApplyDelete({ pkId: this.details.pkId })
        .then((res) => {
          if (res.code == 200) {
            uni.showToast({ icon: "none", title: "删除成功" });
            // let pages = getCurrentPages()
            // let prevPage = pages[pages.length - 2]; // 上一页面实例
            // prevPage.$vm.search()
            // uni.navigateBack({ delta: 1 });
            // uni.showToast({ icon: "none", title: res.msg });
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
    revocation(val) {
      let data = {
        businessType: val,
        pkId: this.details.pkId,
      }
      if (val == 2) {
        data.reason = this.reason
      }
      uni.showLoading({ mask: true });
      this.$api.updateOrdinaryApplyByBusinessType(data).then(res => {
        uni.hideLoading();
        if (res.code == 200) {
          // this.closeHandlePop
          // let pages = getCurrentPages()
          // let prevPage = pages[pages.length - 2]; // 上一页面实例
          // prevPage.$vm.search()
          uni.showToast({ icon: "none", title: "操作成功" });
          setTimeout(() => {
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh() // 调用上一页 定义的方法
            uni.navigateBack({ delta: 1 });
          }, 500)
          // uni.navigateBack({ delta: 1 });
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      })
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

.item-edit-form {
  padding: 8px 16px;
  background: rgb(255, 255, 255);
  margin-top: 2px;

  .form-text {
    color: #79859a;
  }
}

.handlePop {
  width: 700rpx;
  max-height: 1000rpx;
  border-radius: 20rpx;

  .handlePop-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    padding: 0 20rpx;
  }

  .content {
    max-height: 820rpx;
    overflow: auto;
  }

  .handlePop-footer {
    display: flex;
    height: 100rpx;

    .handlePopBtns {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .primary {
      color: #fff;
      background-color: #1576e6;
    }
  }
}</style>
