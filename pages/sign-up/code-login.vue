<template>
	<view class="code-login">
		<view class="">验证码已发送至 {{ mphone }}</view>
		<view class="code-input"><u-code-input v-model="value2" mode="line" :maxlength="4" :focus="false" hairline @finish="finish"></u-code-input></view>
		<view class="resend" @click="showPopup">{{ !codeTime ? '重新发送' : codeTime + '秒后可重新获取' }}</view>
		<view class="resend" v-if="codeTime">
			<!-- <view class="">{{ codeTime + '秒后可重新获取' }}</view> -->
			短信已发送，请注意查收短信
		</view>
		<!-- 验证码弹窗组件 -->
		<popup :popStatus="popStatus" :phoneNumber="userPhone" @sendCode="getCode" @close="close"></popup>
		<!-- 账号列表组建 -->
		<u-picker title="请选择要登录的账号" :show="show" :columns="columns" keyName="loginName" @confirm="confirm" @cancel="show = false"></u-picker>
	</view>
</template>

<script>
import popup from "@/components/pop-up.vue";
export default {
	data() {
		return {
			value2: "",
			userPhone: "", // 用户手机号
			mphone: "", // 加密手机号
			codeTime: 0, // 验证码倒计时用
			popStatus: true,
			uuid: "",
			loginName: "",
			code: "", //登录传给后端的code
			show: false, //控制手机号列表显示隐藏
			columns: [
				[
					{
						userId: "1529091342132441090",
						loginName: "js_8"
					},
					{
						userId: "1529091461061931010",
						loginName: "laowu"
					},
					{
						userId: "1529091611922657281",
						loginName: "laowu"
					},
					{
						userId: "1529091748266897410",
						loginName: "xm_8"
					}
				]
			]
		};
	},
	components: {
		popup
	},
	mounted() {
		this.userPhone = uni.getStorageSync("phone");
		let number = this.userPhone; //获取到手机号码字段
		this.mphone = number.substring(0, 3) + "****" + number.substring(7);
		// this.getCode();
	},
	methods: {
		// 重新发送
		showPopup() {
			if (this.codeTime > 0) return;
			this.popStatus = true;
			this.value2 = "";
		},
		close() {
			this.popStatus = false;
		},
		// 短信发送成功的回调
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
		// 验证码字数满了回调手机号获取账号列表
		finish(e) {
			if (e.length === 4) {
				uni.showLoading({
					mask: true
				});
				let params = {
					phoneNumber: this.userPhone,
					code: this.value2,
					sourceType: 2,
					uuid: this.uuid
				};
				this.$api
					.getAccountList(params)
					.then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							if (res.data.userList.length === 1) {
								this.uuid = res.data.uuid;
								this.code = res.data.code;
								this.loginName = res.data.userList[0].loginName;
								this.selectLogin();
								return;
							}
							if (res.data.userList && res.data.userList != undefined) {
								this.$set(this.columns, "0", res.data.userList);
								this.uuid = res.data.uuid;
								this.code = res.data.code;
								this.show = true;
							} else {
								uni.showToast({
									title: "请先去注册",
									icon: "none",
									duration: 3000
								});
							}
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
		},
		changeHandler(e) {
			console.log(e);
		},
		confirm(e) {
			console.log(e);
			this.loginName = e.value[0].loginName;
			this.show = false;
			this.selectLogin();
		},
		// 选完列表后登录
		selectLogin() {
			uni.showLoading({
				mask: true
			});
			let params = {
				forceType: 0, //强制登录的问题
				sourceType: 2, //登录来源,2是app
				code: this.code,
				loginName: this.loginName,
				phoneNumber: this.userPhone,
				uuid: this.uuid
			};
			this.$api
				.userLogin(params)
				.then(res => {
					uni.hideLoading();
					if (res.code === 200) {
						uni.setStorageSync("token", res.data.access_token);
						uni.reLaunch({
							url: "/pages/index/index",
							success: () => {}
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
.code-login {
	text-align: center;
	padding: 140rpx 0;
	.code-input {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0 70rpx;
	}
	.resend {
		color: #02a7f0;
		font-size: 26rpx;
		margin-bottom: 20rpx;
	}
}
</style>
