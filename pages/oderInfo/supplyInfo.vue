<template>
	<view class="wrapper" v-if="finish">
		<!-- 表格 -->
		<uni-table border emptyText="暂无更多数据">
			<!-- 表头行 -->
			<uni-tr>
				<uni-th align="center" width="50">序号</uni-th>
				<uni-th align="center" width="60">材料</uni-th>
				<uni-th align="center" width="60">需求量</uni-th>
				<uni-th align="center" width="70">单价</uni-th>
				<uni-th align="center" width="90">实际供货量</uni-th>
			</uni-tr>
			<!-- 表格数据行 -->
			<uni-tr v-for="(item, index) in orderApplyMaterialDetails" :key="index">
				<uni-td align="center">{{ index + 1 }}</uni-td>
				<uni-td align="center">{{ item.materialName }}</uni-td>
				<uni-td align="center">{{ item.purchaseNum2 }}</uni-td>
				<uni-td align="center"><u--input type="number" border="surround" v-model="item.price"></u--input></uni-td>
				<uni-td align="center"><u--input type="number" border="surround" v-model="item.purchaseNum"></u--input></uni-td>
			</uni-tr>
		</uni-table>
		<u-button type="primary" text="确定供货" class="btn" @click="confirmSupply" v-if="orderApplyMaterialDetails.length"></u-button>
		<!-- 手机号码弹框 -->
		<u-popup :show="show" mode="center" :round="10" closeable @close="phoneClose">
			<view class="form">
				<u--form ref="uForm" labelAlign="right">
					<u-form-item label="手机号码:" labelWidth="80" prop="name"><u-input v-model="phone" disabled /></u-form-item>
					<u-form-item label="验证码:" labelWidth="80" prop="name">
						<u-input v-model="phoneCode" type="number" />
						<!-- <u-button type="primary" size="small" text="获取验证码" slot="right" class="btn-code" @click="getCode"></u-button> -->
						<template slot="right">
							<u-code ref="uCode" @change="codeChange" changeText="X秒重新后获取" @end="endCode" @start="startCode"></u-code>
							<u-button @tap="getCode" :text="tips" type="success" size="mini" :disabled="btnDisabled"></u-button>
						</template>
					</u-form-item>
				</u--form>
				<u-button type="primary" @click="submit" class="submit">确定</u-button>
			</view>
		</u-popup>
		<!-- 验证码弹窗组件 -->
		<popup :popStatus="popStatus" :phoneNumber="phone" @sendCode="getPhoneCode" @close="close"></popup>
	</view>
	<view class="namv" v-else><u-empty text="供货完成" icon="http://cdn.uviewui.com/uview/empty/list.png"></u-empty></view>
</template>

<script>
import popup from "@/components/pop-up.vue";
export default {
	data() {
		return {
			tips: "",
			btnDisabled: false,
			orderApplyMaterialDetails: [],
			show: false,
			popStatus: false,
			phone: "",
			pkId: "",
			code: "",
			phoneCode: "",
			uuid: "",
			finish: true
		};
	},
	components: {
		popup
	},
	onLoad(option) {
		let arr = uni.getStorageSync("data");
		for (let i = 0; i < arr.length; i++) {
			arr[i].purchaseNum2 = arr[i].purchaseNum;
		}
		this.orderApplyMaterialDetails = arr;
		this.phone = uni.getStorageSync("phone");
		this.pkId = uni.getStorageSync("pkId");
		if (!this.phone) {
			this.finish = false;
		}
	},
	// 监听页面返回
	onBackPress(e) {
		console.log(e);
		// 订单结束后关闭所有界面
		if (!this.finish) {
			return false;
		} else {
			console.log("正常炒作");
		}
	},
	beforeDestroy() {
		if (!this.finish) {
			//防止页面后退
			window.history.forward(1);
		} else {
			console.log(window.history);
		}
	},
	methods: {
		// 关闭手机号弹框
		phoneClose() {
			this.show = false;
		},
		codeChange(text) {
			this.tips = text;
		},
		startCode() {
			this.btnDisabled = true;
		},
		endCode() {
			this.btnDisabled = false;
		},
		// 获取订单数据
		confirmSupply() {
			console.log(this.orderApplyMaterialDetails);
			this.show = true;
		},
		// 提交供货
		submit() {
			if (!this.phoneCode) {
				return uni.showToast({ title: "请输入验证码", icon: "none" });
			}
			let data = {
				appConfirmOrderPurchaseDetails: this.orderApplyMaterialDetails,
				code: this.phoneCode,
				pkId: this.pkId,
				orderCode: uni.getStorageSync("orderCode") ? uni.getStorageSync("orderCode") : "",
				uuid: this.uuid
			};
			console.log(data);
			this.$api
				.confirmOrder(data)
				.then(res => {
					if (res.code === 200) {
						uni.clearStorage(); // 成功清除本地缓存
						this.show = false;
						this.orderApplyMaterialDetails = [];
						this.pkId = "";
						this.phone = "";
						this.phoneCode = "";
						this.finish = false;
						uni.showToast({
							title: res.msg,
							icon: "success"
						});
					} else {
						uni.showToast({
							title: res.msg,
							icon: "error"
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: err,
						icon: "error"
					});
				});
		},
		getCode() {
			this.popStatus = true;
		},
		// 图形验证码
		getPhoneCode(data) {
			this.uuid = data;
			this.popStatus = false;
			if (this.$refs.uCode.canGetCode) {
				// 模拟向后端请求验证码
				uni.showLoading({
					title: "正在获取验证码",
					mask: true
				});
				setTimeout(() => {
					uni.hideLoading();
					// 这里此提示会被this.start()方法中的提示覆盖
					uni.$u.toast("验证码已发送");
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start();
				}, 2000);
			} else {
				uni.$u.toast("倒计时结束后再发送");
			}
		},
		close() {
			this.popStatus = false;
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #fff;
}
.wrapper {
	padding: 20rpx;
}
.uni-table-th {
	background: #f9f9f9;
}
.u-input {
	padding: 0 !important;
}
.btn {
	width: 260rpx;
	position: fixed;
	bottom: 60rpx;
	left: 50%;
	margin-left: -130rpx;
}
.form {
	width: 600rpx;
	padding: 52rpx;
	.btn-code {
		margin-left: 10rpx;
	}
}
// /deep/ .u-form-item__body__right {
// 	flex: none !important;
// }
.submit {
	width: 300rpx;
	margin-top: 60rpx;
}
</style>
