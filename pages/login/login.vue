<template>
	<view class="content">
		<view class="wrap">
			<view class="bg"></view>
			<view class="status_bar"></view>
			<!-- <image src="../../static/image/u145.png" mode="widthFix" class="bai"></image> -->
			<view class="topimg"></view>
			<!-- <view class="title">工程生产管理系统</view> -->
			<view class="appName">
				<view class="name">建必优</view>
				<view class="sys">工程生产管理系统</view>
			</view>
			<image src="https://img.js.design/assets/img/641bc1919cdb530541a0d756.png" mode="widthFix" class="logos"></image>
			<!-- 手机号登录 -->
			<view class="form">
				<u--form labelPosition="left">
					<u-form-item label="">
						<view class="inputs">
							<u-input placeholder="请输入手机号码" type="number" border="none" v-model="phone" maxlength="11">
								<view slot="prefix" class="pres">
									<u-text text="+86" margin="0 3px 0 0" type="tips"></u-text>
									<view class="line"></view>
								</view>
							</u-input>
						</view>
					</u-form-item>
					<u-form-item label="">
						<view class="inputs">
							<u-input type="number" maxlength="4" border="none" placeholder="请输入验证码" v-model="phoneCode">
								<template slot="suffix">
									<u-code ref="uCode" @change="codeChange" :keepRunning="true" startText="获取验证码" changeText="X秒重新后获取" @end="endCode" @start="startCode"></u-code>
									<!-- <u-button @tap="getCode" :text="tips" type="success" size="mini" :disabled="btnDisabled"></u-button> -->
									<u--text @tap="getCode" :type="btnDisabled ? 'info' : 'primary'" :text="tips"></u--text>
								</template>
							</u-input>
						</view>
					</u-form-item>
				</u--form>
				<!-- <u-button type="primary" text="登录" class="login" @click="btnLogin"></u-button> -->
				<view class="login"  @click="btnLogin">登录</view>
				<!-- <u-button type="primary" text="测试定位" class="login" @click="btns"></u-button> -->
				<view class="agree">
					<radio :checked="status" @click="radioChange" class="radio" />
					我已阅读并同意
					<text @click.stop="agreement(1)">《服务协议》</text>
					与
					<text @click.stop="agreement">《隐私政策》</text>
				</view>
			</view>

			<view class="operate">
				<text>没有账号?</text>
				<text @click="register" class="register">注册</text>
				<!-- <text @click="noteLogin">{{ hint }}</text> -->
				<!-- <text @click="forgetPassword">忘记密码</text> -->
			</view>
			<!-- 账户秘密end -->
			<!-- 强制登录提示框 -->
			<u-modal :show="show" title="提示" :content="content" showCancelButton @confirm="confirm" @cancel="cancel"></u-modal>
		</view>
		<!-- 验证码弹窗组件 -->
		<popup :popStatus="popStatus" :phoneNumber="phone" @sendCode="getPhoneCode" @close="close"></popup>
	</view>
</template>

<script>
import permision from '@/common/permission.js';
import popup from '@/components/pop-up.vue';
import request from '../../common/request';
export default {
	components: { popup },
	data() {
		return {
			loginName: '',
			password: '',
			show: false, //强制登录提示框
			content: '', //强行登录的提示
			noteStatus: false,
			phone: '', //手机号码登录
			hint: '短信验证登录',
			tips: '',
			popStatus: false,
			uuid: '',
			phoneCode: '',
			btnDisabled: false,
			forceType: 0,
			osName: '',
			deviceToken: '',
			status: false
		};
	},
	onLoad(options) {
		// 清空所有缓存
		// uni.clearStorage();
		// this.$store.commit('cleanAllStore');
		// #ifdef APP-PLUS
		let that = this;
		uni.getSystemInfo({
			success: res => {
				console.log(res);
				that.osName = res.osName;
			}
		});
		// #endif
	},
	onShow() {
		uni.clearStorage();
		this.$store.commit('cleanAllStore');
	},
	methods: {
		// 跳转协议界面
		agreement(num) {
			uni.navigateTo({
				url: '/pages/me/privacy?num=' + num
			});
		},
		radioChange() {
			this.status = !this.status;
		},
		btns() {
			uni.getLocation({
				geocode: true,
				type: 'gcj02',
				success: e => {
					console.log(e);
					// e.address
				},
				fail: e => {
					console.log(e);
				}
			});
		},
		// 登录
		btnLogin() {
			if (this.status == false) {

				
				return uni.showToast({ title: '请阅读并勾选页面协议', icon: 'none' });
			}
			// uni.reLaunch({
			//   url: "/pages/index/index",
			// });
			const mate = /^1(2|3|4|5|6|7|8|9)\d{9}$/;
			if (!mate.test(this.phone)) {
				return uni.showToast({ title: '请输入正确的手机号码', icon: 'none' });
			}
			if(!this.uuid){
				return uni.showToast({ title: '请先获取验证码', icon: 'none' });
			}
			if (!this.phoneCode) {
				return uni.showToast({ title: '请输入验证码', icon: 'none' });
			}
			uni.showLoading({mask:true})
			// this.getAuthStatus();
			this.tpnsLogin();

			return;
			//   if (this.loginName.length < 4) {
			//     uni.showToast({
			//       title: "请输入正确的账号",
			//       icon: "none",
			//     });
			//     return;
			//   }
			//   if (this.password.length < 6) {
			//     uni.showToast({
			//       title: "请输入正确的密码",
			//       icon: "none",
			//     });
			//     return;
			//   }
			//   let params = {
			//     forceType: 0, //强制登录的问题
			//     sourceType: 2, //登录来源,2是app
			//     loginName: this.loginName,
			//     password: this.password,
			//   };
			//   uni.showLoading({ mask: true });
			//   this.$api
			//     .userLogin(params)
			//     .then((res) => {
			//       uni.hideLoading();
			//       if (res.code === 200) {
			//         uni.setStorageSync("token", res.data.access_token);
			//         uni.reLaunch({
			//           url: "/pages/index/index",
			//         });
			//         // 强制登录207517
			//       } else if (res.code == 207517) {
			//         this.content = res.msg;
			//         // this.content = "是否强制登录？";
			//         this.show = true;
			//       } else {
			//         uni.showToast({ title: res.msg, icon: "none" });
			//       }
			//     })
			//     .catch((err) => {
			//       uni.hideLoading();
			//       uni.showToast({
			//         title: err,
			//         icon: "error",
			//       });
			//     });
		},
		// 确认强制登录
		confirm() {
			this.forceType = 1;
			this.btnLogin();
		},
		cancel() {
			this.show = false;
			this.tpnsunLogin();
		},
		login() {
			let deviceType = null;
			if (this.osName === 'ios') {
				deviceType = 2;
			} else if (this.osName === 'android') {
				deviceType = 1;
			} else if (this.osName === 'mac') {
				deviceType = 3;
			}

			let params = {
				forceType: this.forceType, //强制登录的问题
				sourceType: 2, //登录来源,2是app
				code: this.phoneCode,
				phoneNumber: this.phone,
				uuid: this.uuid,
				deviceType,
				deviceToken: this.deviceToken,
				tagList: [this.phone]
			};
			console.log(params);
			this.$api
				.userLogin(params)
				.then(res => {
					console.log(res);
					uni.hideLoading();
					if (res.code === 200) {
						let that = this;
						this.forceType = 0;
						this.phoneCode = '';
						this.uuid = '';
						uni.setStorageSync('accountList', JSON.stringify(res.data.userList));
						uni.setStorageSync('areaToken', res.data.access_token);
						if (res.data.userList.length !== 1) {
							this.$store.commit('saveGoSelect', true);
						} else {
							this.$store.commit('saveGoSelect', false);
						}
						// #ifdef H5
						if (res.data.userList.length !== 1) {
							uni.navigateTo({ url: `/pages/login/select-account?mobile=${this.phone}`});
							console.log(this.phone);
						} else {
							uni.setStorageSync('token', res.data.access_token);
							this.getRoutes();
							uni.reLaunch({
								url: '/pages/index/index',
								success: () => {}
							});
						}
						// #endif
						// #ifdef APP-PLUS
						if (res.data.authStatusVo.checkStatus === 0) {
							this.$refs.uCode.reset();
							this.btnDisabled = false;
							uni.navigateTo({
								url: `/pages/certification/certification?mobile=${this.phone}`
							});
						} else if (res.data.authStatusVo.checkStatus === 1) {
							// #ifdef APP-PLUS
							uni.getSystemInfo({
								success: res => {
									console.log(res);
									if (res.osName === 'ios') {
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
										permision.requestAndroidPermission('android.permission.CAMERA').then(result => {
											if (result == 1) {
												this.faceAuthorize();
											} else {
												// uni.showToast({title:"没有相机权限",icon:"error"})
												// permision.gotoAppPermissionSetting('android.permission.CAMERA')
												uni.showModal({
													title: '提示',
													content: '需要相机权限才能进行下一步操作，是否打开？',
													showCancel: true,
													success: ({ confirm, cancel }) => {
														if (confirm) {
															console.log('用户点击确定');
															permision.gotoAppPermissionSetting('camera');
														} else if (cancel) {
															console.log('用户点击取消');
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
							this.$refs.uCode.reset();
							this.btnDisabled = false;
							if (res.data.userList.length !== 1) {
								uni.navigateTo({ url: `/pages/login/select-account?mobile=${this.phone}` });
							} else {
								uni.setStorageSync('token', res.data.access_token);
								this.getRoutes();
								uni.reLaunch({
									url: '/pages/index/index',
									success: () => {}
								});
							}
						}
						// else if (res.data.authStatusVo.checkStatus === 3) {
						// 	// #ifdef APP-PLUS
						// 	uni.getSystemInfo({
						// 		success: res => {
						// 			console.log(res);
						// 			if (res.osName === 'ios') {
						// 				this.noTokenFaceSwiping();
						// 			} else {
						// 				permision.requestAndroidPermission('android.permission.CAMERA').then(result => {
						// 					if (result == 1) {
						// 						this.noTokenFaceSwiping();
						// 					} else {
						// 						uni.showModal({
						// 							title: '提示',
						// 							content: '需要相机权限才能进行下一步操作，是否打开？',
						// 							showCancel: true,
						// 							success: ({ confirm, cancel }) => {
						// 								if (confirm) {
						// 									console.log('用户点击确定');
						// 									permision.gotoAppPermissionSetting('camera');
						// 								} else if (cancel) {
						// 									console.log('用户点击取消');
						// 								}
						// 							}
						// 						});
						// 					}
						// 				});
						// 			}
						// 		}
						// 	});
						// 	// #endif
						// }
						// #endif
					} else if (res.code == 203917) {
						this.content = res.msg;
						// this.content = "是否强制登录？";
						this.show = true;
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
						this.tpnsunLogin();
					}
				})
				.catch(err => {
					console.log(err);
					this.tpnsunLogin();
					uni.redirectTo({
						url: '/pages/login/login'
					});
					uni.hideLoading();
					uni.showToast({
						title: err.msg,
						icon: 'error'
					});
				});
		},
		tpnsLogin() {
			// #ifdef APP-PLUS
			let that = this;
			const tpns = uni.requireNativePlugin('TX-TPNS');
			console.log(tpns);
			//注册获取token
			tpns &&
				tpns.registerPush({}, res => {
					console.log('注册', res);
					that.deviceToken = res.token;
					//如果是安卓调用此方法获取手机厂商的三方token，ios请忽略
					// if(that.osName==='android'){
					// 	let token = tpns.getOtherPushToken();
					// 	that.deviceToken=token
					// 	console.log(token);
					// }else{
					// 	that.deviceToken=res.token
					// }
				});
			// #endif
			setTimeout(() => {
				this.login();
			}, 500);
		},
		tpnsunLogin() {
			// #ifdef APP-PLUS
			const tpns = uni.requireNativePlugin('TX-TPNS');
			//注册获取token
			tpns && tpns.unregisterPush();
			// #endif
		},
		getRoutes() {
			this.$api.getOftenRouter().then(res => {
				if (res.code === 200) {
					let routes = res.data;
					this.$store.commit('saveRoutes', routes);
					uni.setStorageSync('routes', JSON.stringify(routes));
				}
			});
		},
		// 获取个人信息
		getInfo() {
			this.$api.getInfo().then(res => {
				if (res.code === 200) {
					this.$store.commit('saveUserInfo', res.data);
					uni.setStorageSync('user', JSON.stringify(res.data));
				}
			});
		},
		// 获取实名状态
		getAuthStatus() {
			this.$api
				.getAuthStatus({
					mobile: this.phone,
					code: this.phoneCode,
					uuid: this.uuid
				})
				.then(res => {
					if (res.code === 200) {
						//  0:实名认证 1:核身认证
						let params = {
							phoneNumber: this.phone,
							code: this.phoneCode,
							sourceType: 2,
							uuid: this.uuid
						};
						this.$store.commit('saveGetAccountParams', params);
						console.log(res.data.checkStatus === 0, res.data);
						this.phoneCode = '';
						this.uuid = '';
						this.$refs.uCode.reset();
						this.btnDisabled = false;
						// uni.navigateTo({
						//   url: `/pages/certification/certification?mobile=${this.phone}`,
						// });
						// return;
						// uni.navigateTo({
						// 	url: '/pages/login/select-account'
						// });
						// return;
						if (res.data.checkStatus === 0) {
							uni.navigateTo({
								url: `/pages/certification/certification?mobile=${this.phone}`
							});
						} else if (res.data.checkStatus === 1) {
							this.faceAuthorize();
						} else if (res.data.checkStatus === 2) {
							uni.navigateTo({
								url: '/pages/login/select-account'
							});
						}
					}
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err,
						icon: 'error'
					});
				});
		},
		register() {
			uni.navigateTo({
				url: '/pages/sign-up/sign-up'
			});
		},
		forgetPassword() {
			uni.navigateTo({
				url: '/pages/sign-up/forget-password'
			});
		},
		//短信登录
		noteLogin() {
			this.noteStatus = !this.noteStatus;
			if (this.noteStatus) {
				this.hint = '账号密码登录';
			} else {
				this.hint = '短信验证登录';
			}
		},
		// 手机登录
		phoneLogin() {
			// 校验手机号
			const mate = /^1(2|3|4|5|6|7|8|9)\d{9}$/;
			if (!mate.test(this.phone)) {
				return uni.showToast({ title: '请输入正确的手机号码', icon: 'none' });
			}
			uni.setStorageSync('phone', this.phone);
			uni.navigateTo({
				url: '/pages/sign-up/code-login'
			});
		},
		codeChange(text) {
			this.tips = text;
		},
		getCode() {
			if (this.btnDisabled) {
				return;
			}
			const mate = /^1(2|3|4|5|6|7|8|9)\d{9}$/;
			if (!mate.test(this.phone)) {
				return uni.showToast({ title: '请输入正确的手机号码', icon: 'none' });
			}
			this.popStatus = true;
		},
		getPhoneCode(data) {
			this.uuid = data;
			this.popStatus = false;
			if (this.$refs.uCode.canGetCode) {
				// 模拟向后端请求验证码
				uni.showLoading({
					title: '正在获取验证码'
				});
				setTimeout(() => {
					uni.hideLoading();
					// 这里此提示会被this.start()方法中的提示覆盖
					uni.$u.toast('验证码已发送');
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start();
				}, 2000);
			} else {
				uni.$u.toast('倒计时结束后再发送');
			}
		},
		close() {
			this.popStatus = false;
		},
		// 人脸识别
		faceAuthorize() {
			let data = {
				callbackUrl: 'https://erp.jianwangkeji.cn/back.html?contextId=2',
				mobile: this.phone
			};
			// const ocr = uni.requireNativePlugin("DC-WBH5FaceVerifyService")
			// console.log(ocr);
			let that =this
			uni.showLoading({
				mask: true
			});
			console.log(data);
			// 
			uni.request({
				url:request.baseUrl+ '/app/enterprise/swipingAuthentication',
				method: "get",
				data,
				header: {
					"Content-Type": "application/json;charset=utf-8",
					Authorization: uni.getStorageSync("areaToken")
				}
			}).then(data=>{
				let [err, res] = data;
				console.log(data);
				console.log(res);
				if (res.statusCode === 500) {
					uni.hideLoading();
					uni.showToast({
						icon: "error",
						title: "系统内部错误",
						duration: 2000
					});
				}
				if (res.data.code !== 200) {
					uni.hideLoading();
					uni.showToast({
						title: res.data.msg ? res.data.msg : "系统内部错误",
						icon:'none',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					that.$refs.uCode.reset();
					that.btnDisabled = false;
					that.$store.commit('isLoginFace', true);
					// const ocr = uni.requireNativePlugin("DC-WBH5FaceVerifyService")
					// console.log(ocr,ocr.startH5FaceVerify);
					// res.data.data.faceSwipingUrl
					// ocr.startH5FaceVerify({h5faceurl:'https://erp.jianwangkeji.cn/back.html?contextId=2'})
					uni.navigateTo({
						url: `/pages/esign/esign?phone=${that.phone}&url=` + encodeURIComponent(JSON.stringify(res.data.data.faceSwipingUrl))
					});
				}
			})
			// this.$api
			// 	.faceAuthorize(data)
			// 	.then(res => {
			// 		console.log(res);
			// 		uni.hideLoading();
			// 		if (res.code === 200) {
			// 			this.$refs.uCode.reset();
			// 			this.btnDisabled = false;
			// 			this.$store.commit('isLoginFace', true);
			// 			uni.navigateTo({
			// 				url: `/pages/esign/esign?phone=${this.phone}&url=` + encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl))
			// 			});
			// 		}
			// 	})
			// 	.catch(err => {
			// 		uni.hideLoading();
			// 	});
		},
		noTokenFaceSwiping(){
			let that =this
			uni.showLoading({ mask: true });
			uni.request({
				url:request.baseUrl+ '/app/user/personAuthorization?callbackUrl=https://erp.jianwangkeji.cn/back.html',
				data:'https://erp.jianwangkeji.cn/back.html',
				method: "post",
				header: {
					"Content-Type": "application/json;charset=utf-8",
					Authorization: uni.getStorageSync("areaToken")
				}
			}).then(data=>{
				let [err, res] = data;
				if (res.statusCode === 500) {
					uni.hideLoading();
					uni.showToast({
						icon: "error",
						title: "系统内部错误",
						duration: 2000
					});
				}
				if (res.data.code !== 200) {
					uni.hideLoading();
					uni.showToast({
						title: res.data.msg ? res.data.msg : "系统内部错误",
						icon:'none',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					that.$refs.uCode.reset();
					that.btnDisabled = false;
					that.$store.commit('saveImpower', true);
					uni.navigateTo({
						url: `/pages/esign/esign?phone=${that.phone}&url=` + encodeURIComponent(JSON.stringify(res.data.data.faceSwipingUrl))
					});
				}
			})
		},
		startCode() {
			this.btnDisabled = true;
		},
		endCode() {
			this.btnDisabled = false;
		}
	}
};
</script>
<style scoped lang="scss">
.content {
	position: relative;
	width: 100%;
	height: 100vh;
	background-color: #fff;
}
.bg {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: -1;
	background-color: #fff;
}
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}
.appName {
	position: absolute;
	top: 200rpx;
	left: 75rpx;
	.name {
		margin-bottom: 30rpx;
		font-size: 64rpx;
		// font-weight: 600;
		color: #128dfa;
	}
	.sys {
		margin-left: 20rpx;
		font-size: 48rpx;
		// font-weight: 600;
		color: #666666;
	}
}
.inputs {
	width: 100%;
	padding: 22rpx;
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
.logos {
	position: absolute;
	opacity: 0.1;
	top: 120rpx;
	right: 20rpx;
	width: 388rpx;
	height: 376rpx;
}
.wrap {
	// position: absolute;
	// bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	//   padding: 20rpx 40rpx;
	// background-color: #f2f2f2;
	//  height: 950rpx;
}
.topimg {
	width: 100%;
	height: 400rpx;
	background-size: 100% 100%;
}
.logo {
	height: 200rpx;
	width: 200rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 50rpx;
	font-weight: 600;
	letter-spacing: 4px;
	color: #333333;
	padding: 20rpx;
	text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.6);
}
.form {
	width: calc(100% - 140rpx);
	padding-top: 80rpx;
}
.operate {
	position: absolute;
	bottom: 20rpx;
	width: calc(100% - 140rpx);
	font-size: 28rpx;
	display: flex;
	justify-content: center;
	//   text:nth-child(1) {
	//     color: skyblue;
	//   }
	.register {
		margin-left: 10rpx;
		color: #3c9cff;
	}
}
.login {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 92rpx;
	margin-top: 80rpx;
	border-radius: 20rpx;
	color: #fff;
	background-color: #128dfa;
}
.agree {
	margin-top: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 24rpx;
	.radio {
		transform: scale(0.6);
	}
	text {
		color: royalblue;
	}
}
</style>
