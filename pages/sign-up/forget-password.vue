<template>
	<view class="register">
		<view class="" v-if="next">
			<u--form :model="formData" ref="uForm">
				<u-form-item leftIcon="phone-fill" labelWidth="40" :leftIconStyle="iconStyle">
					<u-input placeholder="请输入手机号码" type="number" v-model="formData.phone" border="bottom" maxlength="11" />
				</u-form-item>
				<u-form-item leftIcon="chat" labelWidth="40" :leftIconStyle="iconStyle">
					<u-input placeholder="请输入验证码" v-model="formData.code" border="bottom" maxlength="4" />
					<u-button slort="right" type="primary" :disabled="forbid" size="mini" class="btn-code" @click="showPopup">{{ !codeTime ? '获取验证码' : codeTime + 's' }}</u-button>
				</u-form-item>
				<!-- 	<u-form-item leftIcon="qq-fill" prop="name"><u-input placeholder="请输入新的登录密码" v-model="formData.password" border="bottom" /></u-form-item>
				<u-form-item leftIcon="qq-fill" prop="name"><u-input placeholder="请再次输入新的登录密码" v-model="formData.password2" border="bottom" /></u-form-item> -->
			</u--form>
			<u-button type="primary" class="register-btn" @click="nextStep">下一步</u-button>
		</view>
		<view class="" v-else>
			<u--form :model="formData" ref="uForm">
				<u-form-item label="登录账号:" labelWidth="70"><uni-data-select v-model="value" :localdata="range" :clear="false" @change="change"></uni-data-select></u-form-item>
				<u-form-item label="新密码:" labelWidth="70">
					<u-input placeholder="请输入登录密码" v-model="formData.password" type="password" border="bottom" maxlength="20" />
				</u-form-item>
				<u-form-item label="确认密码:" labelWidth="70">
					<u-input placeholder="请再次输入登录密码" v-model="formData.password2" type="password" border="bottom" maxlength="20" />
				</u-form-item>
			</u--form>
			<u-button type="primary" class="register-btn" @click="registration">完成</u-button>
		</view>
		<!-- 验证码弹窗组件 -->
		<popup :popStatus="popStatus" :phoneNumber="formData.phone" @sendCode="getCode" @close="close"></popup>
	</view>
</template>

<script>
import popup from "@/components/pop-up.vue";
export default {
	data() {
		return {
			formData: {
				phone: "",
				code: "",
				loginName: "",
				password: "",
				password2: "",
				//同意状态
				status: false
			},
			// 验证码倒计时用
			codeTime: 0,
			forbid: false, //控制点击状态
			iconStyle: {
				fontSize: "50rpx"
			},
			next: true, //控制下一步
			value: "",
			range: [],
			popStatus: false,
			uuid: ""
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
		change(e) {
			console.log("e:", e);
			this.formData.loginName = e;
		},
		// 下一步
		nextStep() {
			// 校验手机号
			const mate = /^1(2|3|4|5|6|7|8|9)\d{9}$/;
			if (!mate.test(this.formData.phone)) {
				return uni.showToast({ title: "请输入正确的手机号码", icon: "none" });
			}
			if (!this.formData.code) {
				return uni.showToast({ title: "请输入短信验证码", icon: "none" });
			}

			uni.showLoading({
				mask: true
			});
			let params = {
				sourceType: 2, //登录来源,2是app
				code: this.formData.code,
				phoneNumber: this.formData.phone,
				uuid: this.uuid
			};
			this.$api
				.getAccountList(params)
				.then(res => {
					uni.hideLoading();
					if (res.code === 200) {
						console.log(res.data.userList);
						if (res.data.userList && res.data.userList != undefined) {
							this.next = false;
							this.uuid = res.data.uuid;
							this.formData.code = res.data.code;
							// 修改账号列表的key
							let accountList = res.data.userList;
							this.range = accountList.map(obj => {
								var rObj = {};
								rObj.value = obj.loginName;
								rObj.text = obj.loginName;
								return rObj;
							});
							this.value = this.range[0].value;
							this.formData.loginName = this.range[0].value;
						} else {
							uni.showToast({
								title: "手机号未注册!",
								icon: "none",
								duration: 4000
							});
						}

						// uni.reLaunch({
						// 	url: "/pages/index/index",
						// 	success: () => {
						// 	}
						// });
					} else {
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
						icon: "error"
					});
				});
		},
		// 关闭图形验证码弹框
		close() {
			this.popStatus = false;
		},
		//发送图形验证
		showPopup() {
			// 校验手机号
			const mate = /^1(2|3|4|5|6|7|8|9)\d{9}$/;
			if (!mate.test(this.formData.phone)) {
				return uni.showToast({ title: "请输入正确的手机号码", icon: "none" });
			}
			if (this.codeTime > 0) return;
			this.popStatus = true;
		},
		// 验证通过后发送短信验证
		getCode(data) {
			this.uuid = data;
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
		//点击同意协议
		agreeAdhere() {
			this.formData.status = !this.formData.status;
		},
		// 跳转协议界面
		agreement() {
			uni.navigateTo({
				url: "/pages/sign-up/privacy-policy"
			});
		},
		// 完成按钮
		registration() {
			if (this.formData.loginName == "") {
				return uni.showToast({ title: "请选择登录账号", icon: "none" });
			}
			if (this.formData.password.length < 6) {
				return uni.showToast({ title: "登陆密码长度只能在6-20之间", icon: "none" });
			}
			if (this.formData.password2 != this.formData.password) {
				return uni.showToast({ title: "两次密码不一致", icon: "none" });
			}
			uni.showLoading({
				mask: true
			});
			let params = {
				code: this.formData.code,
				phoneNumber: this.formData.phone,
				loginName: this.formData.loginName,
				uuid: this.uuid,
				loginPassword: this.formData.password
			};
			this.$api
				.resetPassword(params)
				.then(res => {
					uni.hideLoading();
					console.log(res);
					if (res.code === 200) {
						uni.showToast({
							title: "密码修改成功",
							icon: "success",
							mask: true,
							duration: 2000,
							success: res => {
								setTimeout(() => {
									uni.reLaunch({
										url: "/pages/login/login"
									});
								}, 2000);
							}
						});
					} else {
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
						icon: "error"
					});
				});
		}
	}
};
</script>

<style lang="scss">
.register {
	padding: 40rpx;
	.register-btn {
		margin-top: 40rpx;
	}
}
.btn-code {
	width: 180rpx !important;
}
.agree {
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
