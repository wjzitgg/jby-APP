<script>
import permision from '@/common/permission.js';
export default {
	onLaunch: function() {
		uni.onTabBarMidButtonTap(() => {
			let scanCode=()=>{
				uni.scanCode({
						scanType: ["qrCode"],
						success: res => {
							console.log(res);
							if (res.result.indexOf("/app/labourTrain/addTrainUserSign") !== -1) {
								uni.showLoading({ mask: "" });
								// 签到
								let arr=res.result.substr(res.result.indexOf('?')+1).split('&')
								let options={}
								for(let i of arr){
									let arr2 = i.split('=');
									options[arr2[0]]=arr2[1]
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
										console.log('签到接口',res2);
										if (res2.statusCode === 500) {
											uni.hideLoading();
											uni.showToast({
												icon: "error",
												title: "系统内部错误",
												duration: 2000
											});
										}
										if (res2.data.code !== 200) {
											if(res2.data.code == 204512){
												setTimeout(()=>{
													
													uni.navigateTo({
													url: "/pages/often/sign-in?obj=" + JSON.stringify({...res2.data.data,stats:0,pkId:options.fkTrainId}),
													success: () => {
														uni.hideLoading();
													}
												});
												},500)
												return
											}
											uni.hideLoading();
											uni.showToast({
												title: res2.data.msg ? res2.data.msg : "系统内部错误",
												icon:'none',
												duration: 2000
											});
											setTimeout(()=>{
												uni.switchTab({ url: "/pages/index/index" });
											},500)
										} else {
											if(res.result.indexOf('fkUserId')!==-1){
												uni.hideLoading();
												uni.showToast({title:'签到成功',duration: 2000})
											}else{
												setTimeout(()=>{
													uni.navigateTo({
													url: "/pages/often/sign-in?obj=" + JSON.stringify({...res2.data.data,stats:1,pkId:options.fkTrainId}),
													success: () => {
														uni.hideLoading();
													}
												});
												},500)
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
								}else if(res.result.indexOf("/h5/#/pages/h5/scanCodeTran")!==-1){
									console.log(res.result);
									let options=res.result.substr(res.result.indexOf('?')+1)
									setTimeout(()=>{
										uni.navigateTo({url:'/pages/h5/scanCodeTran?'+options+'&isApp=1'})
									},500)
								}else if(res.result.indexOf('smlh5.esign.cn/webserver-identity/v1')!==-1){
									console.log("进来了");
									uni.navigateTo({
										url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.result)),
									})
								}else if(res.result.indexOf('https://smlt.esign.cn')!==-1){
									uni.navigateTo({
										url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.result)),
									})
								}
						// 	else if (res.result.indexOf("/app/labourTeamMembers/addTeamMembers") !== -1) {
						// let signValidity = res.result
						// 	.split("?")[1]
						// 	.split("&")
						// 	.filter(item => item.indexOf("signValidity") !== -1)[0]
						// 	.split("=")[1];
						// if (Date.now() > new Date(signValidity + " 23:59:59")) {
						// 	return uni.showToast({ icon: "none", title: "该二维码已过期" });
						// }
						// uni.showLoading({ mask: true });
						// uni.navigateTo({
						// 	url: "/pages/esign/affirm?url=" + encodeURIComponent(JSON.stringify(res.result)),
						// 	success: () => {
						// 		uni.hideLoading();
						// 	}
						// });
						// 	} else if(res.result.indexOf('/h5/#/pages/h5/wechatCode')!==-1){
						// let str=res.result
						// let arr=res.result.split('?')[1].split('&')
						// let data={}
						// arr.forEach(item=>{
						// 	let arr=item.split('=')
						// 	data[arr[0]]=arr[1]
						// })
						// this.$api.checkSignPerson({pkId:data.userId}).then(res=>{
						// 	console.log(res,data,data.appStatus==1);
						// 	if(res.code===200){
						// 		if(res.data===0){
						// 			uni.navigateTo({ url: "/pages/esign/esign?type=1" })
						// 			return
						// 			// return uni.showToast({icon:"none",title:"非审批人本人，禁止审批"})
						// 		}else{
						// 			if(data.appStatus==1){
						// 				let faceUrl=str.substring(str.indexOf('https:'))
						// 				console.log(data);
						// 				data.faceUrl=faceUrl
						// 				uni.showLoading({ mask: true });
						// 				// 调用接口
						// 				uni.navigateTo({
						// 					url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(data.faceUrl)),
						// 					success: () => {
						// 					uni.hideLoading();
						// 				}
						// 				})
						// 			}else if(['2','3'].includes(data.appStatus)){
						// 				console.log(2);
						// 				uni.navigateTo({ url: "/pages/esign/approve-sign?data="+JSON.stringify(data) })
						// 			}
						// 		}
						// 	}else{
						// 		uni.showToast({ icon: "none", title: res.msg })
						// 	}
						// })

						// 	}else if (res.result.indexOf("ida.webank.com/api/web/login")!==-1) {
						// uni.showLoading({ mask: true });
						// uni.navigateTo({
						// 	url: "/pages/esign/esign?type=1&url=" + encodeURIComponent(JSON.stringify(res.result)),
						// 	success: () => {
						// 		uni.hideLoading();
						// 	}
						// });
						// 	} else if (res.result.indexOf("scanCode?")!==-1) {
						// 		uni.showLoading({ mask: true });
						// 		console.log(res.result);
						// 		let arr=res.result.split('?')
						// 		let scanCode=arr[1]
						// 		uni.navigateTo({
						// 			url: "/pages/login/scanCodeLogin?scanCode=" + scanCode ,
						// 			success: () => {
						// 				uni.hideLoading();
						// 			}
						// 		});
						// 	}
							else {
							uni.showToast({ icon: "error", title: "错误的二维码" });
							}
						},
						fail: err => {
							uni.showToast({
								icon: "error",
								title: "扫码失败",
								duration: 2000
							});
						}
				});
			}
			// #ifdef APP-PLUS
			uni.getSystemInfo({
			success: res => {
				console.log(res);
				if (res.osName === 'ios') {
					scanCode()
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
					permision.requestAndroidPermission('android.permission.CAMERA').then(result=>{
            		if(result==1){
						scanCode()
					}else{
						// uni.showToast({title:"没有相机权限",icon:"error"})
						// permision.gotoAppPermissionSetting('android.permission.CAMERA')
						uni.showModal({
							title: '提示',
							content: '需要相机权限才能进行下一步操作，是否打开？',
							showCancel: true,
							success: ({ confirm, cancel }) => {
								if (confirm) {
								console.log('用户点击确定');
								permision.gotoAppPermissionSetting('camera')
								} else if (cancel) {
									console.log('用户点击取消');
								}
							}
						})
					}
          });
				}
			}
		});
			// #endif
		});
				
		// ===============腾讯移动推送===================================================
		// #ifdef APP-PLUS 
		// const tpns = uni.requireNativePlugin('TX-TPNS');
		// console.log(tpns);
		// // tpns.addReceiveNotificationListener(result=>{
        // //    console.log('接收回调',result);
        // // })
		//设置打开回调
		// tpns&&tpns.addOpenNotificationListener(result=>{
		//     console.log('打开回调',result);
		// 	console.log('接收到的参数',JSON.parse(result.customContent));
		// })
		// #endif
	},
	method:{
	},
	onShow: function() {
		console.log("App Show2222");
	},
	onHide: function() {
		console.log("App Hide");
	},
};
</script>

<style lang="scss">
@import "uview-ui/index.scss";
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  color: rgba(32, 52, 87, 1);
}
/* 字体 */ 
@font-face{
	font-family: '思源黑体';
	font-display: swap;
	src: url('~@/static/siyuanheiti.ttf') format('truetype');
	// font-weight: normal;
	// font-style: normal;
}
@font-face{
	font-family: '阿里巴巴普惠体';
	font-display: swap;
	src: url('~@/static/alibabapuhuiti.ttf') format('truetype');
	// font-weight: normal;
	// font-style: normal;
}
*:not([class^='u-icon'],[class^='u-icon'] span,[class^='icon'],[class^='uni-icon']){
	font-family: "思源黑体";
	 font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
	// color: rgba(32, 52, 87, 1);
}
*:not(.u-icon__icon>span){
	@media #{$pad}{
		font-size: 28rpx;
	}
}
.uni-toast,.uni-toast__content{
	color: #fff;
}
body,
html {
  line-height: 1;
  background: #f7f7ff;
}
img,
image {
  vertical-align: bottom;
}
[class^='u-icon'] span,[class^='u-tabs'] span,[class^='u-empty'] span,[class^='u-badge'] span,[class^='u-text'] span,text span,[class^='u-button'],
[class^='uni-calendar']
{
	color: inherit;
}
.editors *{
	color: inherit;
	font-size: inherit;
	font-weight: inherit;
	font-style:inherit
}
// 设置公用导航栏样式
.u-navbar--fixed {
  width: 750rpx;
  background-image: url(@/static/img/navbar.png);
  background-size: 100% 100%;
  color: #ffffff;
  z-index: 999;
  .u-navbar__content__left__text>span{
	color: #ffffff;
  }
  .u-icon__icon>span{
	@media #{$pad}{
		font-size: 28rpx;
	}
  }
}
</style>
