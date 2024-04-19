<!-- 获取短信验证弹窗 -->
<template>
	<u-popup :show="popStatus" mode="center" :round="5" > 
		<!-- <view class="popup">
			<view class="title">请输入验证码</view>
			<view class="img-code">
				<image :src="codeImg" mode=""></image>
				<image src="../static/image/refresh.png" mode="aspectFit" @click="getImgCode"></image>
			</view>
			<input type="number" maxlength="4" class="auth-code" v-model="numberCode" placeholder="" />
		</view>
		<view class="btns">
			<u-button type="primary" :plain="true" text="返回" @click="cancel"></u-button>
			<view class="center-border"></view>
			<u-button type="primary" :plain="true" text="确定" @click="confirm"></u-button>
		</view> -->
		<validationPT class="setVef" ref="vefCode" @ref="ref" @cancel="cancel"  @VefCodeTrue="getVefCodeTrue" :inputPhone="phoneNumber" :sendType="sendType" theme="dialog"></validationPT>
	</u-popup>
</template>
<script>
import validationPT from '@/components/validationPT/validationPT.vue'

export default {
	components: {
        validationPT
    },
	data() {
		return {
			codeImg: "", //图形验证码图
			numberCode: "", //验证码值,
			uuid: "",
			codeData: null
		};
	},
	props: {
		//控制弹框显示隐藏
		popStatus: {
			type: Boolean,
			default: false
		},
		phoneNumber: {
			type: String,
			default: ""
		},
		sendType:{
			type: String,
			default: "1"
		}
	},
	watch: {
		popStatus: function(type) {
			if (type) {
				// this.getImgCode();
				this.getCode();
			} else {
				this.numberCode = "";
			}
		}
	},
	mounted() {
		if (this.popStatus) {
			// this.getImgCode();
		}
	},
	methods: {
	
		ref(data){

			this.$emit("sendCode",data);
		},
		getCode() {
			this.getCodePT();
		},
		//获取弹窗
		getCodePT(msg) {
			this.$nextTick(()=>{
				 console.log(this.$refs.vefCode)
				 this.$refs.vefCode.GetSlideBlockApi(); //调用图片接口，获取验证图片
			this.$refs.vefCode.clkOpenRef(); //验证通过，打开拼图验证
			this.$refs.vefCode.initial();//重置
			})
			// return
			
		},
        // 滑块验证结果回调函数
        //拼图验证是否成功
		getVefCodeTrue(msg) {
			this.VefInfosBk = msg;
			if (msg.Res == true) {
				//获取验证码
			} 
		},

// 		// 获取验证码
		getImgCode() {
			this.$api.imgCode().then(res => {
				this.codeImg = res.img;
				this.uuid = res.uuid;
			});
		},
		confirm() {
			if (!this.numberCode) {
				return uni.showToast({ title: "请输入验证码", icon: "none" });
			}
			uni.showLoading({
				mask: true
			});
			let params = {
				code: this.numberCode,
				phoneNumber: this.phoneNumber,
				uuid: this.uuid,
				sendType: this.sendType
			};
			this.$api.mobileMsg(params).then(res => {
				uni.hideLoading();
				console.log(res);
				if (res.code === 200) {
					uni.showToast({ title: "发送成功", icon: "success" });
					this.$emit("sendCode", res.data);
				} else {
					this.getImgCode();
					uni.showToast({ title: res.msg, icon: "none" });
				}
			});
		},
		cancel() {
			this.$emit("close", 0);
		}
	}
};
</script>
<style lang="scss">
.popup {
	width: 520rpx;
	padding: 38rpx 38rpx 0 38rpx;
	.title {
		padding-bottom: 40rpx;
	}
	.img-code {
		display: flex;
		align-items: center;
		justify-content: center;
		//图形验证码
		image:first-child {
			width: 320rpx;
			height: 100rpx;
			border: 1px solid #999;
		}
		//刷新按钮
		image:last-child {
			padding: 0 20rpx;
			width: 70rpx;
			height: 100rpx;
			border: 1px solid #999;
		}
	}
	// 输入框验证码
	.auth-code {
		border-bottom: 1px solid #02a7f0;
		margin: 30rpx 0 80rpx;
		height: 60rpx;
		color: #02a7f0;
		font-size: 52rpx;
		text-align: center;
	}
}
// .hint {
// 	font-size: 30rpx;
// 	color: #fff;
// }
.btns {
	display: flex;
	border-top: 1px solid #dedede;
	.center-border {
		width: 1rpx;
		background-color: #dedede;
	}
	.u-button {
		border: none;
	}
}
</style>
