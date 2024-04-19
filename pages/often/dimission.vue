<template>
  <view class="content wrapper">
     <u-navbar leftText="离职" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <u--form
      labelPosition="left"
      labelAlign="right"
      ref="form"
      labelWidth="100"
    >
      <u-form-item label="施工项目:" borderBottom>
        <view>{{ form.projectName }}</view>
      </u-form-item>
      <u-form-item label="所属分包商:" borderBottom>
        <view>{{ form.subcontractorName }}</view>
      </u-form-item>
      <u-form-item label="所属班组:" borderBottom>
        <view>{{ form.className }}</view>
      </u-form-item>
      <u-form-item label="班组长:" borderBottom>
        <view>{{ form.leaderName }}</view>
      </u-form-item>
      <u-form-item label="离职日期:" borderBottom>
        <picker
          class="select"
          mode="date"
          :value="date"
          @change="dateChange"
          v-if="type !== 3"
        >
          <view class="uni-input">{{ date }}</view>
        </picker>
        <view v-else>{{ date }}</view>
      </u-form-item>
    </u--form>
    <view class="dimission">
      <u-button type="primary" :text="btnText" @click="dimission"> </u-button>
    </view>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    this.type = options.type - 0;
    if (options.type == 1) {
      uni.setNavigationBarTitle({
        title: "离职申请",
      });
      this.btnText = "提交申请";
      this.labourInfo()
    } else if (options.type == 2) {
      uni.setNavigationBarTitle({
        title: "辞退员工",
      });
      this.btnText = "确认辞退";
      this.form = JSON.parse(options.obj);
      this.memberId = this.form.pkId;
    } else {
      uni.setNavigationBarTitle({
        title: "员工离职",
      });
      this.btnText = "同意离职";
      this.form = JSON.parse(options.obj);
      this.date = this.form.resignationTime;
      this.memberId = this.form.pkId;
    }
  },
  data() {
    return {
      date: "",
      btnText: "",
      form: { },
      type: null,
      memberId: "",
    };
  },
  methods: {
    // 获取个人信息
    labourInfo() {
      this.$api.labourInfo().then((res) => {
        if (res.code === 200) {
          this.form =res.data
          this.form.subcontractorName=this.form.orgName
          this.memberId = this.form.memberId;
          // this.$store.commit("saveUserInfo", res.data);
					// uni.setStorageSync('user', res.data);
        }
      });
    },
    dateChange(e) {
      this.date = e.detail.value;
    },
    // 离职/辞退
    dimission() {
      console.log("请求接口");
      if(!this.date){
        return uni.showToast({title:"请选择离职日期",icon:"none"})
      }
      let data = {
        memberId: this.memberId,
        resignationTime: this.date,
        type: this.type,
      };
      this.$api.dismissMember(data).then((res) => {
        if (res.code === 200) {
          uni.showToast({
            title: "操作成功",
            icon: "success",
            mask: true,
          });
          this.getInfo()
          uni.navigateBack({ delta: 1 });
        }
      });
    },
    // 获取个人信息
    getInfo() {
      this.$api.getInfo().then((res) => {
        if (res.code === 200) {
          this.$store.commit("saveUserInfo", res.data);
					uni.setStorageSync('user', res.data);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// .content{
//     padding: 20rpx;
// }
.u-form-item {
  view {
    padding: 16rpx;
  }
}
.select {
  position: relative;
  width: 100%;
  height: 60rpx;
  margin-right: 6rpx;
  padding: 10rpx;
  background-color: #fff;
  border: 1px solid #d7d7d7;
}
.uni-input {
  position: absolute;
  top: 0;
}
.dimission {
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 2;
}
</style>
