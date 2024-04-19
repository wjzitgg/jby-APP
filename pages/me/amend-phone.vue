<template>
  <view class="wrapper">
    <u-navbar
      leftText="修改手机号"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <u--form
        labelPosition="left"
        :model="phoneData"
        :rules="rules"
        ref="form"
        labelWidth="200rpx"
        :labelStyle="{ fontSize: '26rpx' }"
      >
        <u-form-item label="旧手机号码：" prop="oldPhoneNum"
          ><u--input
            type="number"
            disabled
            v-model="phoneData.oldPhoneNum"
            border="bottom"
            maxlength="11"
          ></u--input
        ></u-form-item>
        <u-form-item label="需迁移账号:" >
          <view class="accList">
            <u-checkbox-group v-model="checked" placement="column">
        	    <u-checkbox :label="item.orgName +(item.authorizerStatus?'(e签宝授权过期)':'')" :name="item.pkId" v-for="item in changePhoneUserList" :key="item.pkId" :disabled="(!userInfo.isMaster&&userInfo.userId==item.pkId)||!!item.authorizerStatus"></u-checkbox>
            </u-checkbox-group>
          </view>
        </u-form-item>
        <u-form-item label="新手机号码：" prop="newPhoneNum"
          ><u-input
            type="number"
            v-model="phoneData.newPhoneNum"
            border="bottom"
            maxlength="11"
            :disabled="!checked.length"
            @input="phoneInput"
          ></u-input
        ></u-form-item>
        <u-form-item label="手机验证码：" prop="code" v-show="codeShow">
          <u--input
            v-model="phoneData.code"
            border="bottom"
            maxlength="4"
          ></u--input>
          <u-code @change="codeChange" @end="end" ref="uCode"></u-code>
          <u-button
            size="normal"
            slot="right"
            type="primary"
            :text="tips"
            @tap="showPop"
            :disabled="disabled"
          ></u-button>
        </u-form-item>
      </u--form>
      <u-button class="btn" type="primary" text="下一步" @click="btnOK" ></u-button>
      <!-- 验证码弹窗组件 -->
      <popup
        :popStatus="popStatus"
        :phoneNumber="phoneData.newPhoneNum"
        @sendCode="getCode"
        @close="close"
      ></popup>
    </view>
  </view>
</template>

<script>
import popup from "@/components/pop-up.vue";
export default {
  components: { popup },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  data() {
    return {
      phoneData: {
        oldPhoneNum: "",
        newPhoneNum: "",
        code: "",
        uuid: "",
      },
      rules: {
        oldPhoneNum: [
          {
            type: "string",
            required: true,
            message: "请输入旧手机号码",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^1(2|3|4|5|6|7|8|9)\d{9}$/,
            transform(value) {
              return String(value);
            },
            message: "请输入正确的手机号码",
            trigger: ["blur", "change"],
          },
        ],
        newPhoneNum: [
          {
            type: "string",
            required: true,
            message: "请输入新手机号码",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^1(2|3|4|5|6|7|8|9)\d{9}$/,
            transform(value) {
              return String(value);
            },
            message: "请输入正确的手机号码",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              if (value === this.phoneData.oldPhoneNum) {
                return false;
              }
            },
            message: "新旧手机号码不能一致",
            trigger: ["blur", "change"],
          },
        ],
        code: [
          {
            type: "string",
            required: true,
            message: "请输入手机验证码",
            trigger: ["blur", "change"],
          },
        ],
      },
      popStatus: false,
      tips: "获取验证码",
      disabled: false,
      codeShow:false,
      changePhoneUserList:[],
      checked:[],
      validateCode:"",
      out:false
    };
  },
  onLoad(options) {
    this.phoneData.oldPhoneNum=this.userInfo.phoneNum
    this.getAccList()
  },
  onShow() {
    this.getInfo()
  },
  methods: {
    // 获取个人信息
		getInfo() {
			this.$api.getInfo().then(res => {
				if (res.code === 200) {
					this.$store.commit("saveUserInfo", res.data);
					uni.setStorageSync('user', res.data);
				}
			});
		},
    getAccList(){
      this.$api.getUserList().then(res=>{
        if(res.code===200){
          this.changePhoneUserList=res.data
          if(!this.userInfo.isMaster){
            res.data.forEach(item=>{
              if(!item.authorizerStatus&&item.pkId==this.userInfo.userId){
                this.checked=[this.userInfo.userId]
                this.out=true
              }
            })
          }
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    phoneInput(val) {
      console.log(val);
      const myreg = /^1(2|3|4|5|6|7|8|9)\d{9}$/;
      if (myreg.test(val)) {
        console.log(val);
        // this.getUrlByNewTelephone();
        this.validateModifyTelephone()
      } else {
        this.codeShow=false
      }
    },
    validateModifyTelephone(){
      let data={
        userIds:this.checked.join(','),
        telephone:this.phoneData.newPhoneNum
      }
      this.$api.validateModifyTelephone(data).then(res=>{
        if(res.code==200){
          this.codeShow=true
        }else{
          this.codeShow=false
          this.errMsg=res.msg
          uni.showToast({ title: res.msg, icon: 'none' })
        }
      })
    },
    async btnOK() {
      await this.$refs.form.validate();
      console.log(this.phoneData);
      let data={
        telephone:this.phoneData.newPhoneNum,
        code:this.phoneData.code,
        uuid:this.phoneData.uuid,
      }
      this.$api.validateTelephoneIsAccess(data).then(res=>{
        if(res.code==200){
          this.validateCode=res.data
          this.modifyTelephone();
        }else{
          uni.showToast({ title: res.msg, icon: 'none' })
        }
      })
      
    },
    close() {
      this.popStatus = false;
    },
    getCode(data) {
      this.phoneData.uuid = data;
      this.disabled = true;
      this.$refs.uCode.start();
      this.close();
      console.log(data);
    },
    codeChange(text) {
      this.tips = text;
    },
    showPop() {
      this.$refs.form.validateField("oldPhoneNum", (res) => {
        if (!res.length) {
          this.$refs.form.validateField("newPhoneNum", (res) => {
            if (!res.length) {
              this.popStatus = true;
            }
          });
        }
      });
    },
    end() {
      this.disabled = false;
    },
    modifyTelephone() {
      uni.showLoading({
        mask: true,
      });
      let data = {
        telephone: this.phoneData.newPhoneNum,
        userIds: this.checked,
        validateCode:this.validateCode,
        redirectUrl:"https://erp.jianwangkeji.cn/back.html"
      };
      this.$api.modifyTelephone(data).then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            let url = "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl))
            if(this.out){
              url +=`&out=1`
            }
            uni.navigateTo({
              url:url,
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    // 人脸识别
    faceAuthorize() {
      uni.showLoading({
        mask: true,
      });
      let phoneData = {
        newPhoneNum: this.phoneData.newPhoneNum,
        oldPhoneNum: this.phoneData.oldPhoneNum,
        businessKey: 4,
      };
      let data = {
        callbackUrl: `https://erp.jianwangkeji.cn/back.html?contextId=${JSON.stringify(
          phoneData
        )}`,
        authType: 1,
				mobile: this.phoneData.newPhoneNum
      };
      this.$api
        .faceAuthorize(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.navigateTo({
              url:
                "/pages/esign/esign?url=" +
                encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl)),
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getPreAuthorizeTime() {
      this.$api.getPreAuthorizeTime().then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.faceAuthorize();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  /*#ifdef APP-PLUS*/
  height: calc(100vh - 156rpx);
	/*#endif*/
	/*#ifdef H5*/
  height: calc(100vh - 88rpx);
	/*#endif*/
  padding: 30rpx;
  background-color: #fff;
}
.top {
  width: 300rpx;
  margin: 0 auto;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  .button {
    width: 100rpx;
  }
}
.imgCode {
  width: 200rpx;
  height: 76rpx;
}
.accList{
  overflow: auto;
  height: 300rpx;
  padding: 0 20rpx;
  background: #f2f2f2;
}
</style>
