<template>
	<view class="wrapper">
		<u-navbar leftText="实名认证" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="content">
			<u--form labelPosition="left" :model="cerData" :rules="rules" ref="form" labelWidth="90" labelAlign="right">
				<u-form-item label="真实姓名：" prop="name"><u--input v-model="cerData.name"></u--input></u-form-item>
				<u-form-item label="证件类型：" prop="certType"><uni-data-select v-model="cerData.certType" :localdata="certTypeList"
						:clear="false"></uni-data-select></u-form-item>
				<u-form-item label="证件号码：" prop="certNo"><u--input v-model="cerData.certNo"></u--input></u-form-item>
				<!-- <u-form-item label="验证码：" prop="code">
          <u-input
            type="number"
            maxlength="4"
            placeholder="请输入验证码"
            v-model="cerData.code"
          >
            <template slot="suffix">
              <u-code
                ref="uCodes"
                @change="codeChange"
                changeText="X秒重新后获取"
                @end="endCode"
                @start="startCode"
              ></u-code>
              <u-button
                @tap="getCode"
                :text="tips"
                type="success"
                size="mini"
                :disabled="btnDisabled"
              ></u-button>
            </template>
          </u-input>
        </u-form-item> -->
			</u--form>
			<u-button style="width: 40%; margin-top: 50rpx" type="primary" text="下一步" @click="btnOk"></u-button>
		</view>
		<!-- 验证码弹窗组件 -->
		<popup :popStatus="popStatus" :phoneNumber="cerData.account" @sendCode="getPhoneCode" @close="close"></popup>
	</view>
</template>

<script>
	import popup from "@/components/pop-up.vue";
	import permision from "@/common/permission.js";
	export default {
		components: { popup },
		onLoad(options) {
			this.cerData.account = options.mobile;
		},
		data() {
			return {
				cerData: {
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
					name: {
						required: true,
						message: "名字不能为空",
						trigger: ["blur", "change"],
					},
					certNo: [{
							required: true,
							message: "证件号不能为空",
							trigger: ["blur", "change"],
						},
						{
							validator: (rule, value, callback) => {
								if (this.cerData.certType === this.certTypeList[0].value) {
									return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/
										.test(
											value
										);
								} else if (this.cerData.certType === this.certTypeList[1].value) {
									return /^[Hh]{1}([0-9]{10}|[0-9]{8})$/.test(value);
								} else if (this.cerData.certType === this.certTypeList[2].value) {
									return /^[Mm]{1}([0-9]{10}|[0-9]{8})$/.test(value);
								} else if (this.cerData.certType === this.certTypeList[3].value) {
									return /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/.test(value);
								} else if (this.cerData.certType === this.certTypeList[4].value) {
									return /^([a-zA-z]|[0-9]){5,17}$/.test(value);
								}
							},
							message: "请输入正确的证件号",
							trigger: ["blur", "change"],
						},
					],
					code: {
						required: true,
						message: "验证码不能为空",
						trigger: ["blur", "change"],
					},
				},
				bizTypeList: {
					authentication: "代表实名认证模式",
					combination: "代表授权认证模式",
				},
				certTypeList: [
					{ text: "中国大陆居民身份证", value: "CRED_PSN_CH_IDCARD" },
					{ text: "香港来往大陆通行证", value: "CRED_PSN_CH_HONGKONG" },
					{ text: "澳门来往大陆通行证", value: "CRED_PSN_CH_MACAO" },
					{ text: "台湾来往大陆通行证", value: "CRED_PSN_CH_TWCARD" },
					{ text: "护照", value: "CRED_PSN_PASSPORT" },
				],
				popStatus: false,
				tips: "",
				btnDisabled: false,
			};
		},
		methods: {
			async btnOk() {
				await this.$refs.form.validate();
				// #ifdef APP-PLUS
				uni.getSystemInfo({
					success: res => {
						console.log(res);
						if (res.osName === "ios") {
							this.certification(this.cerData);
							// 		let result = permision.judgeIosPermission('camera');
							// 		if(result){
							// 			this.certification(this.cerData);
							// 		}else{
							// 			// uni.showToast({title:"没有相机权限",icon:"error"})
							// 			// permision.gotoAppPermissionSetting('camera')
							// uni.showModal({
							// 	title: '提示',
							// 	content: '需要相机权限才能进行下一步操作，是否打开？',
							// 	showCancel: true,
							// 	success: ({ confirm, cancel }) => {
							// 		if (confirm) {
							// 		console.log('用户点击确定');
							// 		permision.gotoAppPermissionSetting('camera')
							// 		} else if (cancel) {
							// 			console.log('用户点击取消');
							// 		}
							// 			}
							// 		})
							// 		}
						} else {
							permision.requestAndroidPermission("android.permission.CAMERA").then(result => {
								if (result == 1) {
									this.certification(this.cerData);
								} else {
									// uni.showToast({title:"没有相机权限",icon:"error"})
									// permision.gotoAppPermissionSetting('android.permission.CAMERA')
									uni.showModal({
										title: "提示",
										content: "需要相机权限才能进行下一步操作，是否打开？",
										showCancel: true,
										success: ({ confirm, cancel }) => {
											if (confirm) {
												console.log("用户点击确定");
												permision.gotoAppPermissionSetting("camera");
											} else if (cancel) {
												console.log("用户点击取消");
											}
										}
									});
								}
							});
						}
					}
				});
				// #endif
			},
			certification(data) {
				uni.setStorageSync("token", uni.getStorageSync("areaToken"));
				this.$api.peoCertification(data).then(res => {
					uni.removeStorage({ key: "token" });
					if (res.code === 200) {
						this.$store.commit("isCert", true);
						uni.navigateTo({
							url: `/pages/esign/esign?phone=${this.cerData.account}&url=` +
								encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl)),
						});
					}
				});
			},
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				// const mate = /^1(2|3|4|5|6|7|8|9)\d{9}$/;
				// if (!mate.test(this.phone)) {
				// 	return uni.showToast({ title: "请输入正确的手机号码", icon: "none" });
				// }
				this.popStatus = true;
			},
			getPhoneCode(data) {
				console.log(1);
				this.cerData.uuid = data;
				this.popStatus = false;
				if (this.$refs.uCodes.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: "正在获取验证码",
					});
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						uni.$u.toast("验证码已发送");
						// 通知验证码组件内部开始倒计时
						this.$refs.uCodes.start();
					}, 2000);
				} else {
					uni.$u.toast("倒计时结束后再发送");
				}
			},
			close() {
				this.popStatus = false;
			},
			startCode() {
				this.btnDisabled = true;
			},
			endCode() {
				this.btnDisabled = false;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.content {
		padding: 10rpx;
	}
</style>