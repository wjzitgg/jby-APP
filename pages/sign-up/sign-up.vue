<template>
	<view class="wrapper" :class="{bgcf:formData.orgType!=''}">
		<u-navbar :leftText="formData.orgType == ''?'选择注册账号类型':'注册'" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff"
			:autoBack="true"></u-navbar>
		<view class="content">
			<view class="register">
				<view class="pdt-ios"></view>
				<view class="role-type" v-if="formData.orgType == ''">
					<!-- <view class="title">请选择注册账号类型</view> -->
					<u-row span="12" class="identityList" justify="space-evenly">
						<u-col span="5" class="identityList-item" :class="{grey:![6, 7, 8, ''].includes(item.value)}"
							v-for="item in identityList" :key="item.value" @click="selectRole(item.value)" justify="center"
							align="center" customStyle="text-align:center">
							<image :src="item.img"></image>
							{{ item.name }}
						</u-col>
					</u-row>
				</view>
				<view v-else>
					<view style="height:40rpx"></view>
					<view class="inputs" :class="{'mb-40':formData.orgType!=8,'mb-20':formData.orgType==8}">
						<view class="ident" @click="selectRole('')">
							<view>身份类型：</view>
							<view class="role-name">
								<view>{{ roleName }}</view>
								<u-icon name="arrow-right" size="16"></u-icon>
							</view>
						</view>
					</view>
					<view class="inputs mb-20" v-if="this.formData.orgType !== 8">
						<view class="ident">
							<view>企业名称：</view>
							<u-input placeholder="请输入企业名称" v-model="formData.orgName" border="none" maxlength="50" />
						</view>
					</view>
					<u--form :model="formData" ref="uForm">
						<u-form-item label="">
							<view class="inputs">
								<u-input placeholder="请输入手机号码" v-model="formData.linkPhone" border="none" maxlength="11" type="number">
									<view slot="prefix" class="pres">
										<u-text text="+86" margin="0 3px 0 0" type="tips"></u-text>
										<view class="line"></view>
									</view>
								</u-input>
							</view>
						</u-form-item>
						<u-form-item label="">
							<view class="inputs">
								<u-input placeholder="请输入验证码" v-model="formData.code" border="none" maxlength="4" type="number">
									<template slot="suffix">
										<u--text @click="showPopup" size="14" :type="forbid ? 'info' : 'primary'"
											:text="!codeTime ? '获取验证码' : codeTime + 's'"></u--text>
										<!-- <u-button slort="right" type="primary" :disabled="forbid" size="mini" class="btn-code">{{ !codeTime ? '获取验证码' : codeTime + 's' }}</u-button> -->
									</template>
								</u-input>
							</view>
						</u-form-item>
						<view class="agree">
							<radio :checked="formData.status" @click="radioChange" class="radio" />
							我已阅读并同意
							<text @click.stop="agreement(1)">《服务协议》</text>
							与
							<text @click.stop="agreement">《隐私政策》</text>
						</view>
					</u--form>
					<view class="register-btn" @click="registration">注册</view>
					<!-- <u-button type="primary" class="register-btn" @click="registration">注册</u-button> -->
				</view>
				<u-action-sheet :show="showSex" :actions="actions" title="请选择规模" @close="showSex = false"
					@select="sexSelect"></u-action-sheet>
				<!-- 验证码弹窗组件 -->
				<popup :popStatus="popStatus" :phoneNumber="formData.linkPhone" @sendCode="getCode" @close="close"></popup>
			</view>
		</view>
	</view>
</template>

<script>
	import popup from "@/components/pop-up.vue";
	export default {
		data() {
			return {
				formData: {
					code: "",
					// linkMan: "",
					linkPhone: "",
					// loginName: "",
					// loginPassword: "",
					// loginPassword2: "",
					orgName: "",
					// orgScale: "",
					orgType: "",
					uuid: "",
					//同意状态
					status: false
				},
				scale: "", //	企业规模
				// 验证码倒计时用
				codeTime: 0,
				forbid: false,
				roleName: "",
				showSex: false,
				actions: [{
						name: "20人以下",
						value: "0"
					},
					{
						name: "20~99人",
						value: "1"
					},
					{
						name: "100~499人",
						value: "2"
					},
					{
						name: "500~999人",
						value: "3"
					},
					{
						name: "1000~4999人",
						vlaue: "4"
					},
					{
						name: "5000~9999人",
						value: "5"
					},
					{
						name: "10000人以上",
						value: "6"
					}
				],
				popStatus: false,
				possess: false, //控制手机号是否已经还是登录账号
				identityList: [
					{ name: "劳务工人", value: 8, img: "../../static/image/laowugongren.png" },
					{ name: "分包单位", value: 7, img: "../../static/image/fenbaoshang.png" },
					{ name: "供货商", value: 6, img: "../../static/image/gonghuoshang.png" },
					{ name: "项目部", value: 5, img: "../../static/image/xiangmubu.png" },
					{ name: "施工单位", value: 4, img: "../../static/image/shigongdanwei.png" },
					{ name: "监理单位", value: 3, img: "../../static/image/jianlidanwei.png" },
					{ name: "设计院", value: 9, img: "../../static/image/shejiyuan.png" },
					{ name: "建设单位", value: 2, img: "../../static/image/jianshedanwei.png" }
				]
			};
		},
		components: {
			popup
		},
		mounted() {
			uni.$on("agree", res => {
				console.log("监听的传参", res);
				this.formData.status = res.data > 0 ? true : false;
			});
		},
		// 实例销毁之前调用处理监听事件执行两次的问题
		beforeDestroy() {
			uni.$off("agree");
		},
		methods: {
			radioChange() {
				this.formData.status = !this.formData.status;
			},
			inputPhone(val) {
				if (val.length == 11 && this.formData.orgType !== 8) {
					this.yetSign();
				} else {
					this.possess = false;
				}
			},
			// 检测手机号是不是已存在账号
			yetSign() {
				this.$api.available({ loginName: this.formData.linkPhone }).then(res => {
					console.log(res);
					if (res.code == 200) {
						if (!res.data) {
							this.possess = true;
						} else {
							this.possess = false;
						}
					}
				});
			},
			sexSelect(e) {
				console.log(e);
				this.formData.orgScale = e.value;
				this.scale = e.name;
			},
			selectRole(num) {
				if (![6, 7, 8, ""].includes(num)) {
					return uni.showToast({
						title: "暂时不开放本单位的申请权限,请联系XX管理开通",
						icon: "none"
					});
				}
				this.formData.orgType = num;
				this.formData.status = false;
				if (num) {
					this.roleName = this.identityList.filter(item => item.value === num)[0].name;
				} else {
					this.roleName = "";
					Object.keys(this.formData).forEach(key => (this.formData[key] = ""));
				}
			},
			//发送图形验证
			showPopup() {
				// 校验手机号
				const mate = /^1(2|3|4|5|6|7|8|9)\d{9}$/;
				if (!mate.test(this.formData.linkPhone)) {
					return uni.showToast({ title: "请输入正确的手机号码", icon: "none" });
				}
				if (this.codeTime > 0) return;
				this.popStatus = true;
			},
			// 关闭图形验证码弹框
			close() {
				this.popStatus = false;
			},
			// 获取短信验证码
			getCode(data) {
				this.formData.uuid = data;
				this.popStatus = false;
				this.codeTime = 60;
				this.forbid = true;
				let timer = setInterval(() => {
					this.codeTime--;
					// console.log(this.codeTime)
					if (this.codeTime < 1) {
						clearInterval(timer);
						this.codeTime = 0;
						this.forbid = false;
					}
				}, 1000);
			},
			// 跳转协议界面
			agreement(num) {
				uni.navigateTo({
					url: "/pages/me/privacy?num=" + num
				});
			},
			// 注册按钮
			registration() {
				console.log(this.formData.status);
				if (this.formData.status == false) {
					return uni.showToast({ title: "请阅读并勾选页面协议", icon: "none" });
				}
				if (this.formData.orgName.length < 2 && this.formData.orgType !== 8) {
					return uni.showToast({
						title: "企业名称长度只能在2-50之间",
						icon: "none"
					});
				}
				// if (!this.formData.orgScale && this.formData.orgType !== 8) {
				// 	return uni.showToast({ title: "请选择企业规模", icon: "none" });
				// }
				// if (!this.formData.linkMan && this.formData.orgType !== 8) {
				// 	return uni.showToast({ title: "请输入联系人", icon: "none" });
				// }
				//校验手机号
				let myreg = /^1(2|3|4|5|6|7|8|9)\d{9}$/;
				if (!myreg.test(this.formData.linkPhone)) {
					return uni.showToast({ title: "请输入正确的手机号码", icon: "none" });
				}
				//手机验证码
				if (!this.formData.code) {
					return uni.showToast({ title: "请输入正确的验证码", icon: "none" });
				}
				// if (!this.formData.status) {
				// 	return uni.showToast({ title: '请先阅读隐私政策与协议', icon: 'none' });
				// }
				// if (this.formData.loginName.length < 4 && this.possess && this.formData.orgType !== 8) {
				// 	return uni.showToast({ title: "登陆账号长度只能在4-20之间", icon: "none" });
				// }
				// if (this.formData.loginPassword.length < 6) {
				// 	return uni.showToast({ title: "登陆密码长度只能在6-20之间", icon: "none" });
				// }
				// if (this.formData.loginPassword2 != this.formData.loginPassword) {
				// 	return uni.showToast({ title: "两次密码不一致", icon: "none" });
				// }
				// if (!this.formData.authPhotoUrl) {
				// 	return uni.showToast({ title: "请上传营业执照", icon: "none" });
				// }
				// return console.log(this.formData);
				uni.showLoading({
					mask: true
				});
				let data = { ...this.formData };
				this.$api
					.register(data)
					.then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							console.log(res.data);
							uni.setStorageSync("accountList", JSON.stringify(res.data.userList));
							uni.setStorageSync("areaToken", res.data.access_token);
							// #ifdef H5
							if (res.data.userList.length !== 1) {
								uni.navigateTo({ url: `/pages/login/select-account?mobile=${res.data.authStatusVo.mobile}` });
								console.log(res.data.authStatusVo.mobile);
							} else {
								uni.setStorageSync("token", res.data.access_token);
								this.getRoutes();
								uni.reLaunch({
									url: "/pages/index/index",
									success: () => {}
								});
							}
							// #endif
							// #ifdef APP-PLUS
							if (res.data.authStatusVo.checkStatus === 0) {
								this.btnDisabled = false;
								uni.navigateTo({
									url: `/pages/certification/certification?mobile=${res.data.authStatusVo.mobile}`
								});
							} else if (res.data.authStatusVo.checkStatus === 1) {
								// #ifdef APP-PLUS
								uni.getSystemInfo({
									success: res => {
										console.log(res);
										if (res.osName === "ios") {
											this.faceAuthorize();
											// let result = permision.judgeIosPermission('camera');
											// if(result){

											// }else{
											// 	// uni.showToast({title:"没有相机权限",icon:"error"})
											// 	// permision.gotoAppPermissionSetting('camera')
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
											// 	}
											// })
											// }
										} else {
											permision.requestAndroidPermission("android.permission.CAMERA").then(result => {
												if (result == 1) {
													this.faceAuthorize();
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
							} else if (res.data.authStatusVo.checkStatus === 2) {
								this.btnDisabled = false;
								if (res.data.userList.length !== 1) {
									uni.navigateTo({ url: `/pages/login/select-account?mobile=${res.data.authStatusVo.mobile}` });
								} else {
									uni.setStorageSync("token", res.data.access_token);
									this.getRoutes();
									uni.reLaunch({
										url: "/pages/index/index",
										success: () => {}
									});
								}
							}
							// #endif
						} else {
							uni.hideLoading();
							uni.showToast({
								title: res.msg,
								icon: "none"
							});
						}
					})
					.catch(err => {
						uni.hideLoading();
						uni.showToast({
							title: err.msg,
							icon: "error",
							duration: 5000
						});
					});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.wrapper {
		// background-color: #fff;
	}

	.bgcf {
		background-color: #fff;
	}

	.content {
		/*#ifdef APP-PLUS*/
		height: calc(100vh - 156rpx);
		/*#endif*/
		/*#ifdef H5*/
		height: calc(100vh - 88rpx);
		/*#endif*/
	}

	.register {
		padding: 0 70rpx;

		.register-btn {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 92rpx;
			margin-top: 60rpx;
			border-radius: 20rpx;
			color: #fff;
			background-color: #128dfa;
		}
	}

	.ident {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 48rpx;

		.role-name {
			display: flex;
		}
	}

	.inputs {
		width: 100%;
		padding: 20rpx;
		border: 1px solid #dff0ff;
		border-radius: 20rpx;
		background-color: #f7f8f9;

		.pres {
			display: flex;
		}

		.line {
			margin-left: 10rpx;
			height: 30rpx;
			border-left: 1px solid #cccccc;
		}
	}

	.btn-code {
		width: 180rpx !important;
	}

	.agree {
		display: flex;
		// justify-content: center;
		align-items: center;
		font-size: 24rpx;

		.radio {
			transform: scale(0.6);
		}

		text {
			color: royalblue;
		}
	}

	.role-type {
		text-align: center;

		.identityList {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-evenly;
			width: 100%;
			height: 100%;
		}

		.identityList-item {
			text-align: center;
			width: 100%;
			height: 100%;
			margin-top: 30rpx;
			padding: 20rpx;
			// border: 1px solid #e2e2e2;
			background-color: #fff;
		}

		.grey {
			filter: grayscale(100%);
		}

		.title {
			font-size: 50rpx;
			font-weight: 600;
		}

		image {
			// width: 524rpx;
			// height: 260rpx;
			// padding: 40rpx 0;
			width: 180rpx;
			height: 180rpx;
		}
	}

	.title-details {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 36rpx;

		text:last-child {
			color: #2979ff;
		}

		.role-name {
			margin: 0 30rpx;
			display: flex;
			align-items: center;
		}

		image {
			width: 50rpx;
			height: 50rpx;
		}
	}

	.mb-20 {
		margin-bottom: 20rpx;
	}

	.mb-40 {
		margin-bottom: 40rpx;
	}
</style>