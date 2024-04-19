<template>
	<view class="">
		<div class="content">
			<div class="content-header">应用商店</div>
			<!-- 头部 -->
			<div class="top">
				<img src="../../static/logoceshi.png" class="img" />
				<div class="top-right">
					<div class="title">
						<div class="name">工程管理系统</div>
						<div class="type">Android应用</div>
					</div>
					<!-- 下载安卓apk包地址 -->
					<a href="https://epms-1307524156.cos.ap-guangzhou.myqcloud.com/androidAPP.apk" download class="download">安装</a>
				</div>
			</div>
			<!-- 评分 -->
			<div class="score">
				<div class="header">评分及评论</div>
				<div class="main">
					<div class="grade">
						<div class="five">4.7</div>
						<div class="max">满分 5 分</div>
					</div>
					<div class="persen">
						<div class="grade-per">
							<div class="grade-per-bg"></div>
							<div class="grade-per-front" style="width: 90%"></div>
						</div>
						<div class="grade-per">
							<div class="grade-per-bg"></div>
							<div class="grade-per-front" style="width: 5%"></div>
						</div>
						<div class="grade-per">
							<div class="grade-per-bg"></div>
							<div class="grade-per-front" style="width: 3%"></div>
						</div>
						<div class="grade-per">
							<div class="grade-per-bg"></div>
							<div class="grade-per-front" style="width: 2%"></div>
						</div>
						<div class="grade-per">
							<div class="grade-per-bg"></div>
							<div class="grade-per-front" style="width: 1%"></div>
						</div>
						<div class="total">19k 个评分</div>
					</div>
				</div>
			</div>
			<!-- 信息 -->
			<div class="message">
				<div class="message-header">信息</div>
				<div class="message-content">
					<div class="grad">
						<div class="text">大小</div>
						<div class="text-content">12.3M</div>
					</div>
					<div class="grad">
						<div class="text">更新时间</div>
						<div class="text-content">2022-07-11 20:58:59</div>
					</div>
					<div class="grad">
						<div class="text">语言</div>
						<div class="text-content">英文、简体中文</div>
					</div>
					<div class="grad">
						<div class="text">年龄分级</div>
						<div class="text-content">限4岁以上</div>
					</div>
					<div class="grad">
						<div class="text">Copyright</div>
						<div class="text-content"></div>
					</div>
					<div class="grad">
						<div class="text">价格</div>
						<div class="text-content">免费</div>
					</div>
					<div class="grad">
						<div class="text">隐私政策</div>
						<div class="text-content"></div>
					</div>
				</div>
			</div>
		</div>
		<!-- 微信弹框 -->
		<div v-show="showTip" id="weixinTip" ref="weixin" class="wxtip">
			<p class="wxtip-txt">
				<!-- 在微信中无法下载APP -->
				请使用系统APP扫码或者下载APP
				<br />
				1. 请点击右上角...按钮
				<br />
				2. 选择【在浏览器中打开】
			</p>
		</div>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showTip: false
		};
	},
	onLoad(option) {
		console.log(option);
		// uni.getSystemInfo({
		// 	success: function(res) {
		// 		console.log(res);
		// 	}
		// });
		this.getdeviceInfo();
		console.log("设备信息", this.getdeviceInfo());
		// this.showTip = true;
	},
	methods: {
		getdeviceInfo() {
			const ua = navigator.userAgent.toLowerCase();
			const isWeixin = ua.indexOf("micromessenger") !== -1;
			const isInApp = /(^|;\s)app\//.test(ua);
			if (isWeixin) {
				if (window.__wxjs_environment === "miniprogram") {
					return "wxapp";
				} else {
					this.showTip = true;
					return "wxh5";
				}
			} else {
				if (!isInApp) {
					return "browser";
				} else {
					return "app";
				}
			}
		}
	}
};
</script>

<style lang="scss">
* {
	box-sizing: border-box;
	font-size: 24rpx;
}

.content {
	padding: 20rpx 30rpx 0 30rpx;
}
.content-header {
	font-size: 50rpx;
	border-bottom: 1px solid #ccc;
}
.top {
	display: flex;
	height: 360rpx;
	padding: 40rpx 0;
}

.img {
	width: 300rpx;
	border-radius: 50rpx;
	margin-right: 40rpx;
}

.name {
	font-weight: 700;
	font-size: 44rpx;
}

.name::after {
	content: '4+';
	margin-left: 20rpx;
	border: 1px solid #000;
	font-size: 24rpx;
	vertical-align: middle;
}

.type {
	margin-top: 30rpx;
	font-size: 30rpx;
	color: rgba(0, 0, 0, 0.61);
}

.top-right {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 140rpx;
}

.download {
	width: 120rpx;
	border-radius: 40rpx;
	line-height: 50rpx;
	text-align: center;
	color: #fff;
	font-size: 28rpx;
	background-color: #3378f2;
}

.header {
	font-weight: 700;
	font-size: 44rpx;
	margin-bottom: 30rpx;
}

.main {
	display: flex;
	justify-content: space-between;
	padding: 0 20px;
}

.score {
	padding: 40rpx 30rpx;
	border-top: 1px solid #ccc;
	border-bottom: 1px solid #ccc;
}

.grade {
	text-align: center;
}

.five {
	font-weight: 700;
	font-size: 120rpx;
}

.max {
	margin-top: 34rpx;
	font-size: 34rpx;
	color: #8d8d8d;
}

.grade-per {
	position: relative;
	margin-bottom: 30rpx;
}

.grade-per-bg {
	width: 400rpx;
	height: 6px;
	background-color: #e9e9e9;
}
.persen {
	padding-top: 20rpx;
}
.grade-per-front {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 1;
	height: 6rpx;
	background-color: #909090;
}

.total {
	font-size: 26rpx;
	color: #8d8d8d;
	text-align: right;
}

.message {
	margin-top: 20rpx;
}

.message-header {
	font-size: 40rpx;
	font-weight: 700;
}

.message-content:nth-last-child(1) {
	border-bottom: none;
}

.grad {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 90rpx;
	font-size: 32rpx;
	border-bottom: 1px solid #f2f2f2;
}

.text {
	color: #a3a3a3;
}
a {
	text-decoration: none;
}
.wxtip {
	background: rgba(0, 0, 0, 0.8);
	text-align: center;
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 100;

	img {
		width: 100%;
	}
}

.wxtip-txt {
	margin-top: 107px;
	color: #fff;
	font-size: 20px;
	line-height: 1.8;
}
</style>
