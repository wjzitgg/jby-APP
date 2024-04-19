<template>
  <view class="content">
    <u--form
      labelPosition="left"
      :model="passwordData"
      :rules="rules"
      ref="form"
      labelWidth="200rpx"
      :labelStyle="{ fontSize: '26rpx' }"
    >
      <u-form-item label="旧登录密码：" prop="oldPass" >
        <u--input
          v-model="passwordData.oldPass"
          border="bottom"
          type="password"
        ></u--input>
      </u-form-item>
      <u-form-item label="新登录密码：" prop="newPass" >
        <u--input
          v-model="passwordData.newPass"
          border="bottom"
          type="password"
        ></u--input>
      </u-form-item>
      <u-form-item label="确认登录密码：" prop="secondPassword" >
        <u--input
          v-model="passwordData.secondPassword"
          border="bottom"
          type="password"
        ></u--input>
      </u-form-item>
    </u--form>
    <u-button
      type="primary"
      text="确定"
      style="width: 200rpx; margin-top: 100rpx"
      @click="btnOK"
    ></u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      passwordData: {
        oldPass: "",
        newPass: "",
        secondPassword: "",
      },
      rules: {
        oldPass: [
          {
            type: "string",
            required: true,
            message: "请输入旧密码",
            trigger: ["blur", "change"],
          },
        ],
        newPass: [
          {
            type: "string",
            required: true,
            message: "请输入新密码",
            trigger: ["blur", "change"],
          },
        ],
        secondPassword: [
          {
            type: "string",
            required: true,
            message: "请再次输入新密码",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              return value === this.passwordData.newPass;
            },
            message: "两次输入的新密码不一致",
            // 触发器可以同时用blur和change
            trigger: ["blur"],
          },
        ],
      },
    };
  },
  methods: {
    async btnOK() {
      await this.$refs.form.validate();
      console.log(this.passwordData);
      uni.showLoading({ mask: true });
      this.$api.modifyPassWord(this.passwordData).then((res) => {
        uni.hideLoading();
        if (res.code === 200) {
          uni.showToast({
            title: res.msg,
            icon: 'success',
            mask: true
          })
          uni.navigateBack({
            delta: 1,
          });
        }
      }).catch(err=>{
        uni.hideLoading();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 30rpx;
}
</style>
