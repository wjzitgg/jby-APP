<template>
	<view></view>
</template>

<script>
var wv; //计划创建的webview
export default {
	computed: {
		user() {
			return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
		},
	},
	onLoad(options) {
		// this.createWebVew()
		// type为1时是扫码登录，2为e签宝页面,3为审批签署，4为加入班组,5为物料采购单，6印章管理扫码
		console.log(options);
		// let facility = this.getdeviceInfo();
		let isApp = !!options.isApp;
		if(options.unique){
			if(isApp){
				this.$api.updateQRCode({ unique: options.unique });
			}else{
				this.$api.updateQRCode2({ unique: options.unique });
			}
			
		}
		let getData = options.data;
		let type = options.type;
		if (!isApp) {
			if (type == 2) {
				this.openUrl = JSON.parse(decodeURIComponent(options.data));
				this.createWebVew();
			} else if (type == 5) {
				let url = JSON.parse(decodeURIComponent(options.data));
				let str = url.split("?")[1];
				console.log(str);
				uni.redirectTo({ url: "/pages/oderInfo/oderInfo?" + str });
			} else {
				uni.redirectTo({ url: "/pages/h5/wechatCode" });
				
			}
		} else {
			if (type == 4) {
				let datas = JSON.parse(decodeURIComponent(options.data));
				console.log(datas, options);
				let signValidity = datas
					.split("?")[1]
					.split("&")
					.filter(item => item.indexOf("signValidity") !== -1)[0]
					.split("=")[1];
				if (Date.now() > new Date(signValidity)) {
					uni.navigateBack({ delta: 1 })
					return uni.showToast({ icon: "none", title: "该二维码已过期" });
				}
				uni.showLoading({ mask: true });
				uni.redirectTo({
					url: "/pages/esign/affirm?url=" + encodeURIComponent(JSON.stringify(datas)),
					success: () => {
						uni.hideLoading();
					}
				});
			} else if (type == 3) {
				let datas = JSON.parse(decodeURIComponent(options.data));
				let str = datas;
				let arr = datas.split("?")[1].split("&");
				let data = {};
				arr.forEach(item => {
					let arr = item.split("=");
					data[arr[0]] = arr[1];
				});
				if (this.user.phoneNum != data.phoneNum) {
					uni.navigateBack({ delta: 1 })
					// uni.showToast({icon:"none",title:"非审批人本人，禁止审批"})
					return;
					// return uni.showToast({icon:"none",title:"非审批人本人，禁止审批"})
				} else {
					if (data.appStatus == 1) {
						this.$api.getFaceAuthStatus({unique:options.unique,needSign:0}).then(res=>{
							console.log('是否需要人脸',res);
							if(res.code==200){
								if(res.data.verifyStatus){
									this.$api.scanQRCode({unique:options.unique,callbackUrl: 'https://erp.jianwangkeji.cn/back.html?contextId=5'}).then(res=>{
										console.log(res);
										if(res.code==200){
											data.faceUrl = res.data.faceSwipingUrl;
											uni.showLoading({ mask: true });
											// 调用接口
											uni.redirectTo({
												url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(data.faceUrl)),
												success: () => {
													uni.hideLoading();
												}
											});
										}else{
											uni.navigateBack({ delta: 1 })
											uni.showToast({icon:"none",title:res.msg})
										}
									})
									
								}else{
									uni.navigateBack({ delta: 1 })
									uni.showToast({icon:"none",title:'认证成功'})
								}
							}else{
								uni.navigateBack({ delta: 1 })
								uni.showToast({ icon: "none", title: res.msg });
							}
						})
					} else if (["2", "3"].includes(data.appStatus)) {
						console.log(2);
						uni.redirectTo({
							url: "/pages/esign/approve-sign?data=" + JSON.stringify(data)
						});
					}
				}
			} else if (type == 2) {
				uni.showLoading({ mask: true });
				let url = JSON.parse(decodeURIComponent(getData));
				uni.redirectTo({
					url: "/pages/esign/esign?type=1&url=" + encodeURIComponent(JSON.stringify(url)),
					success: () => {
						uni.hideLoading();
					}
				});
			} else if (type == 1) {
				uni.showLoading({ mask: true });
				console.log(getData);
				let arr = getData.split("?");
				let scanCode = arr[1].split("=")[1];
				console.log(arr, scanCode);
				uni.redirectTo({
					url: "/pages/login/scanCodeLogin?scanCode=" + scanCode,
					success: () => {
						uni.hideLoading();
					}
				});
			} else if (type == 5) {
				let url = JSON.parse(decodeURIComponent(options.data));
				let str = url.split("?")[1];
				console.log(str);
				uni.redirectTo({ url: "/pages/oderInfo/oderInfo?" + str });
			}else if(type == 6){
				if(options.data){
					let openUrl = JSON.parse(decodeURIComponent(options.data));
					uni.redirectTo({ url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(openUrl)) });
				}else{
					// 调用接口生成e签宝链接再打开
					let data={userId:options.userId,userFaceDistinguishId:options.userFaceDistinguishId,redirectUrl:'https://erp.jianwangkeji.cn/back.html'}
					this.$api.getTwoCode(data).then(res=>{
						console.log(res);
						if(res.code==200){
							uni.redirectTo({ url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.data)) });
						}else{
							uni.navigateBack({ delta: 1 })
							uni.showToast({title:res.msg,icon:"none"})
						}
					})
					// 
				}
			}
		}
	},
	data() {
		return {
			openUrl: ""
		};
	},
	methods: {
		createWebVew() {
			// #ifdef APP-PLUS
			wv = plus.webview.create("", "custom-webview", {
				plusrequire: "none", //禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
				"uni-app": "none", //不加载uni-app渲染层框架，避免样式冲突
				top: uni.getSystemInfoSync().statusBarHeight + 44 //放置在titleNView下方。如果还想在webview上方加个地址栏的什么的，可以继续降低TOP值
			});
			wv.loadURL(this.openUrl);
			var currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
			currentWebview.append(wv); //一定要append到当前的页面里！！！才能跟随当前页面一起做动画，一起关闭
			setTimeout(function() {
				console.log(wv.getStyle());
			}, 1000); //如果是首页的onload调用时需要延时一下，二级页面无需延时，可直接获取
			// #endif

			// #ifdef H5
			console.log(3333);
			window.location.href = this.openUrl;
			// #endif
		},
		getdeviceInfo() {
			const ua = navigator.userAgent.toLowerCase();
			const isWeixin = ua.indexOf("micromessenger") !== -1;
			const isInApp = /(^|;\s)app\//.test(ua);
			if (isWeixin) {
				if (window.__wxjs_environment === "miniprogram") {
					return "wxapp";
				} else {
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

<style lang="scss" scoped></style>
