<template>
	<!-- <u-tabbar :value="nowTab" @change="tabbarChange" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true" zIndex="99">
	<u-tabbar-item text="首页" >
        <image class="u-page__item__slot-icon" slot="active-icon" src="../../static/image/icon_home_u257_mouseOver.png" ></image>
		<image class="u-page__item__slot-icon" slot="inactive-icon" src="../../static/image/icon_home_u257.png" ></image>
    </u-tabbar-item>
	<u-tabbar-item text="扫一扫" icon="static/image/scanImg.png" ></u-tabbar-item>
	<u-tabbar-item text="我的" icon="../../static/image/icon_me_u261.png" ></u-tabbar-item>
</u-tabbar> -->
	<m-tabbar fixed fill :current="tabName" :tabbar="tabbar" :tabbarHeight="180" :safeBottom="false">
		<template v-slot:tabbar_index_1>
			<view class="scanCode" @click="scanCode">
				<!-- <view class="img"></view> -->
				<view class="clice">
					<image class="scanImg" src="../../static/image/scanImg.png" mode="widthFix" />
					<view class="labels">扫一扫</view>
				</view>
				<view class="big_clice"></view>
				<!-- <view class="custom_style_icon">+</view> -->
			</view>
		</template>
	</m-tabbar>
</template>

<script>
	import permision from "@/common/permission.js";
	import TabbarConfig from "@/config/tabbar.js";
	export default {
		props: {
			tabName: {
				type: Number,
			}
		},
		data() {
			return {
				tabbar: TabbarConfig
			};
		},
		mounted() {
			uni.hideTabBar();
		},
		methods: {
			tabbarChange(val) {
				if (val == 1) {
					this.scanCodval();
				} else {
					this.nowTab = val;
					console.log(val, this.nowTab);
					if (val == 0) {
						uni.switchTab({ url: "/pages/index/index" });
					} else if (val == 2) {
						uni.switchTab({ url: "/pages/me/me" });
					}
				}
			},
			createPop(title, content) {
				this.popview = new plus.nativeObj.View("pop", {
					top: "0px",
					left: "0px",
					width: "100%",
					backgroundColor: "#444"
				});
				this.popview.drawText(title || "相机权限", {
					top: "0px",
					height: "68%"
				}, {
					color: "#ffffff",
					size: "25px"
				});
				this.popview.drawText(content || "为了给您提供上传图片、扫码、更换头像、等场景中使用", {
					top: "35px",
					width: "100%",
					height: "68%"
				}, {
					color: "#ffffff",
					whiteSpace: "normal",
				});
				this.$nextTick(() => {
					this.popview.show();
				});
			},

			scanCode() {
				let scanCode = () => {
					uni.scanCode({
						scanType: ["qrCode"],
						autoZoom: false,
						success: res => {
							console.log(res);
							if (res.result.indexOf("/app/labourTrain/addTrainUserSign") !== -1) {
								uni.showLoading({ mask: "" });
								// 签到
								let arr = res.result.substr(res.result.indexOf("?") + 1).split("&");
								let options = {};
								for (let i of arr) {
									let arr2 = i.split("=");
									options[arr2[0]] = arr2[1];
								}
								uni.request({
										url: res.result,
										method: "post",
										header: {
											"Content-Type": "application/json;charset=utf-8",
											Authorization: uni.getStorageSync("token")
										}
									}).then(data => {
										let [err, res2] = data;
										if (res2) {
											console.log("签到接口", res2);
											if (res2.statusCode === 500) {
												uni.hideLoading();
												uni.showToast({
													icon: "error",
													title: "系统内部错误",
													duration: 2000
												});
											}
											if (res2.data.code !== 200) {
												if (res2.data.code == 204512) {
													setTimeout(() => {

														uni.navigateTo({
															url: "/pages/often/sign-in?obj=" + JSON.stringify({
																...res2.data.data,
																stats: 0,
																pkId: options.fkTrainId
															}),
															success: () => {
																uni.hideLoading();
															}
														});
													}, 500);
													return;
												}
												uni.hideLoading();
												uni.showToast({
													title: res2.data.msg ? res2.data.msg : "系统内部错误",
													icon: "none",
													duration: 2000
												});
												setTimeout(() => {
													uni.switchTab({ url: "/pages/index/index" });
												}, 500);
											} else {
												if (res.result.indexOf("fkUserId") !== -1) {
													uni.hideLoading();
													uni.showToast({ title: "签到成功", duration: 2000 });
												} else {
													setTimeout(() => {
														uni.navigateTo({
															url: "/pages/often/sign-in?obj=" + JSON.stringify({
																...res2.data.data,
																stats: 1,
																pkId: options.fkTrainId
															}),
															success: () => {
																uni.hideLoading();
															}
														});
													}, 500);
												}
											}
										}
										if (err) {
											uni.hideLoading();
											uni.showToast({
												icon: "error",
												title: "网络错误",
												duration: 2000
											});
											reject(err);
										}
									})
									.catch(error => {
										uni.hideLoading();
										reject(error);
									});
							} else if (res.result.indexOf("/h5/#/pages/h5/scanCodeTran") !== -1) {
								console.log(res.result);
								let options = res.result.substr(res.result.indexOf("?") + 1);
								setTimeout(() => {
									uni.navigateTo({ url: "/pages/h5/scanCodeTran?" + options + "&isApp=1" });
								}, 500);
							} else if (res.result.indexOf("smlh5.esign.cn/webserver-identity/v1") !== -1) {
								console.log("进来了");
								uni.navigateTo({
									url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.result)),
								});
							} else if (res.result.indexOf("https://smlt.esign.cn") !== -1) {
								uni.navigateTo({
									url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.result)),
								});
							} else {
								uni.showToast({ icon: "error", title: "错误的二维码" });
							}
						},
						fail: err => {
							// uni.showToast({
							// 	icon: "error",
							// 	title: "扫码失败",
							// 	duration: 2000
							// });
						}
					});
				};
				console.log("触发");
				// #ifdef APP-PLUS
				uni.getSystemInfo({
					success: res => {
						console.log(res);
						if (res.osName === "ios") {
							scanCode();
							// let result = permision.judgeIosPermission('camera');
							// if(result){
							// 	scanCode()
							// }else{
							// 	// uni.showToast({title:"没有相机权限",icon:"error"})
							// 	// permision.gotoAppPermissionSetting('camera')
							// 	uni.showModal({
							// 		title: '提示',
							// 		content: '需要相机权限才能进行下一步操作，是否打开？',
							// 		showCancel: true,
							// 		success: ({ confirm, cancel }) => {
							// 			if (confirm) {
							// 			console.log('用户点击确定');
							// 			permision.gotoAppPermissionSetting('camera')
							// 			} else if (cancel) {
							// 				console.log('用户点击取消');
							// 			}
							// 		}
							// 	})
							// }
						} else {
							// 在点击需要权限的方法前先获取是否有权限
							var Manifest = plus.android.importClass("android.Manifest");
							var MainActivity = plus.android.runtimeMainActivity();
							let camera = MainActivity.checkSelfPermission(Manifest.permission.CAMERA);
							if (camera == -1) {
								this.createPop(); // 打开提示
							}; // 有权限则直接调用方法
							// plus.android.requestPermissions(["android.permission.CAMERA"], e => {
							// 	if (e.deniedPresent.length > 0 || e.deniedAlways.length > 0) { // 权限被拒绝或永久拒绝就给提示
							// 		uni.showModal({
							// 			title: "提示",
							// 			content: "需要相机权限才能进行下一步操作，是否打开？",
							// 			showCancel: true,
							// 			success: ({ confirm, cancel }) => {
							// 				if (confirm) {
							// 					console.log("用户点击确定");
							// 					permision.gotoAppPermissionSetting("camera");
							// 				} else if (cancel) {
							// 					console.log("用户点击取消");
							// 				}
							// 			}
							// 		});
							// 	}
							// 	this.popview.hide(); // 别忘了关闭提示
							// });

							// return;
							permision.requestAndroidPermission("android.permission.CAMERA").then(result => {
								if (result == 1) {
									scanCode();
									this.popview.hide(); // 别忘了关闭提示
								} else {
									// uni.showToast({title:"没有相机权限",icon:"error"})
									// permision.gotoAppPermissionSetting('android.permission.CAMERA')
									uni.showModal({
										title: "提示",
										content: "需要相机权限才能进行下一步操作，是否打开？",
										showCancel: true,
										success: ({ confirm, cancel }) => {
											if (confirm) {
												permision.gotoAppPermissionSetting("camera");
												this.popview.hide(); // 别忘了关闭提示
											} else if (cancel) {
												this.popview.hide(); // 别忘了关闭提示
											}
										}
									});
								}
							});
						}
					}
				});
				// #endif
			}
		}
	};
</script>

<style lang="scss" scoped>
	/deep/ .m-tabbar__flex {
		box-shadow: 0px -1px 9px 0px #dbdbdb;
	}

	/deep/ .m-tabbar__flex {
		height: 100%;
		align-items: center;

		.m-tabbar__item {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 0;
			background-color: #fff;
		}
	}

	.scanCode {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		background-color: #fff;
		z-index: 1;

		&::after {
			content: "";
			position: absolute;
			top: 0;
			right: -6rpx;
			bottom: 0;
			left: -6rpx;
			z-index: 1;
			background-color: #fff;
		}

		.big_clice {
			position: absolute;
			top: -30rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 242rpx;
			height: 242rpx;
			border-radius: 50%;
			background-color: #fff;
			z-index: -1;
			box-shadow: 0px -1px 9px 0px #dbdbdb;
		}

		.clice {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			overflow: hidden;
			width: 150rpx;
			height: 150rpx;
			border-radius: 50%;
			box-shadow: 0px 6rpx 8rpx #ccc;
			z-index: 2;

			&::after {
				content: "";
				position: absolute;
				// overflow: hidden;
				top: 0;
				left: 50%;
				right: 0;
				transform: translateX(-50%);
				width: 150rpx;
				height: 26rpx;
				z-index: 1;
				background: url("/static/image/scanLine.png");
				animation: scroll 6s infinite;
			}
		}

		.labels {
			margin-top: 6rpx;
			color: rgba(32, 52, 87, 1);
			font-size: 24rpx;
		}

		.scanImg {
			width: 44rpx;
			height: 44rpx;
		}
	}

	@keyframes scroll {
		0% {
			top: 0;
		}

		100% {
			top: 110%;
		}
	}
</style>