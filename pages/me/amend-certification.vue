<template>
<view class="wrapper">
    <u-navbar
      leftText="修改实名信息"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
  <view class="content">
    <u--form
      labelPosition="left"
      :model="certificationData"
      :rules="rules"
      ref="form"
      labelWidth="200rpx"
      :labelStyle="{ fontSize: '26rpx' }"
    >
      <u-form-item label="个人姓名：" prop="name"
        ><u--input v-model="certificationData.name" border="bottom" maxlength="25"></u--input
      ></u-form-item>
      <u-form-item label="证件类型：" prop="certType"
          ><uni-data-select
            v-model="certificationData.certType"
            :localdata="certTypeList"
            :clear="false"
          ></uni-data-select
        ></u-form-item>
      <u-form-item label="新证件号：" prop="certNo"
        ><u--input v-model="certificationData.certNo" border="bottom"></u--input
      ></u-form-item>
      <u-form-item label="手机号码："
        ><u--input
          disabled
          :value="userInfo.phoneNum"
          border="bottom"
        ></u--input
      ></u-form-item>
      <u-form-item label="手机验证码：" prop="code">
        <u--input
          v-model="certificationData.code"
          border="bottom"
          maxlength="4"
        ></u--input>
        <view slot="right">
          <u-code @change="codeChange" @end="end" ref="uCode"></u-code>
          <u-button
            size="normal"
            type="primary"
            :text="tips"
            @tap="showPop"
            :disabled="disabled"
          ></u-button>
        </view>
      </u-form-item>
    </u--form>
    <u-button class="btn" type="primary" text="下一步" @click="btnOk" ></u-button>
    <!-- 验证码弹窗组件 -->
    <popup
      :popStatus="popStatus"
      :phoneNumber="userInfo.phoneNum"
      @sendCode="getCode"
      @close="close"
    ></popup>
  </view>
</view>
</template>

<script>
import popup from "@/components/pop-up.vue";
import permision from '@/common/permission.js';
export default {
  components: { popup },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  data() {
    return {
      certificationData: {
        redirectUrl: "https://erp.jianwangkeji.cn/back.html",
        bizType: "authentication",
        authType: "personal", //认证类型：个人：personal, 企业：business
        name: "",
        certType: "CRED_PSN_CH_IDCARD",
        certNo: "",
        account: "",
        uuid: "",
        code: "",
      },
      rules: {
        certNo: [
          {
            required: true,
            message: "证件号不能为空",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              if (this.certificationData.certType === this.certTypeList[0].value) {
                return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/.test(
                  value
                );
              } else if (this.certificationData.certType === this.certTypeList[1].value) {
                return /^[Hh]{1}([0-9]{10}|[0-9]{8})$/.test(value);
              } else if (this.certificationData.certType === this.certTypeList[2].value) {
                return /^[Mm]{1}([0-9]{10}|[0-9]{8})$/.test(value);
              } else if (this.certificationData.certType === this.certTypeList[3].value) {
                return /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/.test(value);
              } else if (this.certificationData.certType === this.certTypeList[4].value) {
                return /^([a-zA-z]|[0-9]){5,17}$/.test(value);
              }
            },
            message: "请输入正确的证件号",
            trigger: ["blur", "change"],
          },
        ],
        name: [
          {
            type: "string",
            required: true,
            message: "请填写姓名",
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
       certTypeList: [
        { text: "中国大陆居民身份证", value: "CRED_PSN_CH_IDCARD" },
        { text: "香港来往大陆通行证", value: "CRED_PSN_CH_HONGKONG" },
        { text: "澳门来往大陆通行证", value: "CRED_PSN_CH_MACAO" },
        { text: "台湾来往大陆通行证", value: "CRED_PSN_CH_TWCARD" },
        { text: "护照", value: "CRED_PSN_PASSPORT" },
      ],
      popStatus: false,
      tips: "获取验证码",
      disabled: false,
    };
  },
  onLoad(options) {
    this.certificationData.name=this.userInfo.realName
  },
  methods: {
    codeChange(text) {
      this.tips = text;
    },
    showPop() {
      this.popStatus = true;
    },
    close() {
      this.popStatus = false;
    },
    getCode(data) {
      this.disabled = true;
      this.$refs.uCode.start();
      this.close();
      this.certificationData.uuid=data
    },
    async btnOk() {
        await this.$refs.form.validate();
        this.certificationData.account=this.userInfo.phoneNum
        // #ifdef APP-PLUS
            uni.getSystemInfo({
              success: res => {
                console.log(res);
                if (res.osName === 'ios') {
                  this.certification();
              //     let result = permision.judgeIosPermission('camera');
              //     if(result){
              //       this.certification();
              //     }else{
              //       // uni.showToast({title:"没有相机权限",icon:"error"})
              //       // permision.gotoAppPermissionSetting('camera')
              // uni.showModal({
              //   title: '提示',
              //   content: '需要相机权限才能进行下一步操作，是否打开？',
              //   showCancel: true,
              //   success: ({ confirm, cancel }) => {
              //     if (confirm) {
              //     console.log('用户点击确定');
              //     this.$refs.uCode.reset();
              //     permision.gotoAppPermissionSetting('camera')
              //     } else if (cancel) {
              //       console.log('用户点击取消');
              //     }
              //       }
              //     })
              //     }
                } else {
                  permision.requestAndroidPermission('android.permission.CAMERA').then(result=>{
                        if(result==1){
                    this.certification();
                  }else{
                    // uni.showToast({title:"没有相机权限",icon:"error"})
                    // permision.gotoAppPermissionSetting('android.permission.CAMERA')
                    uni.showModal({
                      title: '提示',
                      content: '需要相机权限才能进行下一步操作，是否打开？',
                      showCancel: true,
                      success: ({ confirm, cancel }) => {
                        if (confirm) {
                        console.log('用户点击确定');
                        this.$refs.uCode.reset();
                        permision.gotoAppPermissionSetting('camera')
                        } else if (cancel) {
                          console.log('用户点击取消');
                        }
                      }
                    })
                  }
                  });
                }
              }
            });
                // #endif
    },
    certification() {
      this.$api.peoCertification(this.certificationData).then((res) => {
        if (res.code === 200) {
          this.$store.commit("isReCert", true);
          uni.navigateTo({
            url:
              "/pages/esign/esign?url=" +
              encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl)),
          });
        }
      });
    },
    end() {
      this.disabled = false;
    },
    modifySelfInfo() {
      uni.showLoading({
        mask: true,
      });
      this.$api
        .modifySelfInfo(this.certificationData)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.navigateBack({ delta: 1 })
            uni.showToast({ title: '修改成功', icon: 'success' })
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    faceAuthorize() {
      uni.showLoading({
        mask: true,
      });
      let data = {
        authType: 1,
				callbackUrl: 'https://erp.jianwangkeji.cn/back.html?contextId=6',
				mobile: this.userInfo.phoneNum
      };
      this.$api
        .faceAuthorize(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            let that = this;
						uni.navigateTo({
							url: '/pages/esign/esign?url=' + encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl)),
							events: {
								// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
								isOk: function(data) {
									console.log(data);
									if (data.data) {
										// 调用接口 that
                    that.modifySelfInfo()
									}
								}
							},
							success: (res) => {
								uni.hideLoading();
								res.eventChannel.emit('isOk', { data: false });
							}
						});
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    validateCode() {
      uni.showLoading({
        mask: true,
      });
      this.$api
        .validateCode({
          code:this.certificationData.code,
          uuid:this.certificationData.uuid,
          phoneNum: this.userInfo.phoneNum,
        })
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.faceAuthorize();
          }
        })
        .catch((err) => {
          uni.hideLoading();
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
</style>
