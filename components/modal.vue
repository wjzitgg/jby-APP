<template>
	<view class="mask" v-if="showPopup">
		<view class="popup_box">
			<view class="init_box">
				<view class="init">
					<view class="closeBtn" @click="closeMask">X</view>
					<view class="pop-title">实名认证</view>
					<u--form labelPosition="left" :model="cerData" :rules="rules" ref="form" labelWidth="90" labelAlign="right">
						<u-form-item label="个人姓名：" prop="name"><u--input v-model="cerData.name"></u--input></u-form-item>
						<u-form-item label="证件类型：" prop="certType"><uni-data-select v-model="cerData.certType" :localdata="certTypeList" :clear="false"></uni-data-select></u-form-item>
						<u-form-item label="证件号：" prop="certNo"><u--input v-model="cerData.certNo"></u--input></u-form-item>
						<u-form-item label="手机号码：" prop="account"><u--input v-model="cerData.account" maxlength="11"></u--input></u-form-item>
					</u--form>
					<u-button style="width: 40%; margin-top: 50rpx" type="primary" text="开始验证" @click="btnOk"></u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showPopup: this.show,
			viewTop: null, // 创建原生View控件
			viewBottom: null, // 创建原生View控件
			cerData: {
				redirectUrl: 'https://erp.jianwangkeji.cn/back.html',
				bizType: 'authentication',
				authType: 'personal', //认证类型：个人：personal, 企业：business
				name: '',
				certType: 'CRED_PSN_CH_IDCARD',
				certNo: '',
				account: ''
			},
			rules: {
				name: {
					required: true,
					message: '名字不能为空',
					trigger: ['blur', 'change']
				},
				certNo: [
					{
						required: true,
						message: '证件号不能为空',
						trigger: ['blur', 'change']
					},
					{
						validator: (rule, value, callback) => {
							if (this.cerData.certType === this.certTypeList[0].value) {
								return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/.test(value);
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
						message: '请输入正确的证件号',
						trigger: ['blur', 'change']
					}
				],
				account: [
					{
						required: true,
						message: '手机号号不能为空',
						trigger: ['blur', 'change']
					},
					{
						pattern: /^1(2|3|4|5|6|7|8|9)\d{9}$/,
						message: '请输入正确的手机号码',
						trigger: ['blur', 'change']
					}
				]
			},
			bizTypeList: {
				authentication: '代表实名认证模式',
				combination: '代表授权认证模式'
			},
			certTypeList: [
				{ text: '中国大陆居民身份证', value: 'CRED_PSN_CH_IDCARD' },
				{ text: '香港来往大陆通行证', value: 'CRED_PSN_CH_HONGKONG' },
				{ text: '澳门来往大陆通行证', value: 'CRED_PSN_CH_MACAO' },
				{ text: '台湾来往大陆通行证', value: 'CRED_PSN_CH_TWCARD' },
				{ text: '护照', value: 'CRED_PSN_PASSPORT' }
			]
		};
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		maskHidden: {
			type: Boolean
		}
	},
	mounted() {
		// #ifdef APP-PLUS
		// 原生控件对象可用于在屏幕上绘制图片或文本内容 参考地址 https://www.html5plus.org/doc/zh_cn/nativeobj.html#plus.nativeObj.View
		const res = uni.getSystemInfoSync();
		// 上蒙版
		this.viewTop = new plus.nativeObj.View('maskTop', {
			top: '0px',
			left: '0px',
			height: `${res.statusBarHeight + 44}`,
			width: '100%',
			backgroundColor: 'rgba(64, 64, 64, 0.4)'
		});
		// 下蒙版
		this.viewBottom = new plus.nativeObj.View('maskBott', {
			bottom: '0px',
			left: '0px',
			height: `${res.screenHeight - res.windowHeight - res.statusBarHeight - 24}`,
			width: '100%',
			backgroundColor: 'rgba(64, 64, 64, 0.1)'
		});
		if (this.showPopup) {
			this.viewTop.show();
			this.viewBottom.show();
		}
		// #endif
	},
	watch: {
		show: {
			immediate: true,
			handler(val) {
				this.showPopup = val;
				if (val) {
					this.viewTop.show();
					this.viewBottom.show();
				} else {
					// #ifdef APP-PLUS
					setTimeout(() => {
						// 使用延时为了与中间部分同步
						this.viewTop.hide();
						this.viewBottom.hide();
					}, 20);
					// #endif
				}
			}
		},
		maskHidden(val) {
			// #ifdef APP-PLUS
			if (val) {
				this.viewTop.show();
				this.viewBottom.show();
			} else {
				this.viewTop.hide();
				this.viewBottom.hide();
			}
			// #endif
		}
	},
	onLoad() {},
	methods: {
		closeMask() {
			// #ifdef APP-PLUS
			setTimeout(() => {
				// 使用延时为了与中间部分同步
				this.viewTop.hide();
				this.viewBottom.hide();
			}, 20);
			// #endif
			this.$emit('close');
			this.showPopup = false;
		},
		async btnOk() {
			await this.$refs.form.validate();
			this.$emit('btnOk', this.cerData);
			//   this.$store.commit("isCert", true);
			//   if (this.hasJur) {
			//     this.certification();
			//   } else {
			//     this.jurShow = true;
			//   }
		}
		// 企业专用
		// { text: "统一社会信用代码", value: "CRED_ORG_USCC" },
		// { text: "工商注册号", value: "CRED_ORG_REGCODE" },
	}
};
</script>

<style lang="scss" scoped>
.mask {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(64, 64, 64, 0.6);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999; /*h5端底部tabbar z-index为998 */

	.popup_box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		.init_box {
			height: 100%;
			overflow: scroll;
			.init {
				position: relative;
				width: 600rpx;
				padding: 30rpx;
				background-color: #ffffff;
				// text-align: center;
				padding-top: 60rpx;
				padding-bottom: 64rpx;
				.closeBtn {
					position: absolute;
					right: 30rpx;
					top: 30rpx;
					font-size: 36rpx;
				}
				.title {
					font-size: 36rpx;
					font-weight: bold;
					color: #333333;
				}
				.desc {
					margin-top: 24rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #666666;
					letter-spacing: 3rpx;
				}
				.btn {
					width: 368rpx;
					height: 72rpx;
					line-height: 72rpx;
					background: linear-gradient(180deg, #3178ff 0%, #6499ff 100%);
					font-size: 28rpx;
					font-weight: 400;
					color: #ffffff;
					margin: 0 auto;
					margin-top: 60rpx;
					letter-spacing: 10rpx;
					border-radius: 1800rpx;
				}
			}
			.close_box {
				width: 72rpx;
				margin: 0 auto;
				.close {
					width: 72rpx;
					height: 72rpx;
					background: #ffffff;
					margin-top: 48rpx;
				}
			}
		}
	}
}
.pop-title {
	margin-bottom: 10rpx;
	font-size: 40rpx;
	font-weight: 700;
	text-align: center;
}
</style>
