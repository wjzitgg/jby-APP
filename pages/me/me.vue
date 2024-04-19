<template>
	<view class="content">
		<view class="bottomshadow"></view>
		<view class="user-info">

			<view class="user-info-top">
				<!-- @click="openAlbum" -->
				<u-avatar class="user-info-header" :src="userInfo.portraitUrl" :size="isPad?120:60" bg-color="#fff"></u-avatar>
				<view class="user-info-msg ">
					<!-- <view class="tel">{{ tel }}</view> -->
					<view class="username">{{ userInfo.userName ? userInfo.userName : '未登录' }}</view>

					<view class="msg-item" v-if="!!userInfo.orgName">
						<view class="tag">公司</view>
						<view class="workArea">{{ userInfo.orgName ? userInfo.orgName : '' }}</view>
					</view>
					<view class="msg-item" v-if="!!userInfo.deptName">
						<view class="tag">部门</view>
						<view class="workArea">{{ userInfo.deptName ? userInfo.deptName : '' }}</view>
					</view>
					<view class="msg-item" v-if="!!userInfo.roleName">
						<view class="tag">职位</view>
						<view class="workArea">{{ userInfo.isMaster ?  '管理员': userInfo.roleName?userInfo.roleName:'' }}</view>
					</view>


					<!-- <view class="workArea">{{ userInfo.roleName ? userInfo.roleName : '' }}</view> -->
					<!-- <view class="workArea" v-else>暂未加入班组</view> -->
				</view>





			</view>
			<!-- <view class="user-info-bottom">{{ userInfo.orgName }}</view> -->
		</view>

		<!-- <view class="user-info  infoadd" >
			<view class="header-info">
				<view class="user-info-1">
					<u-avatar class="user-info-header" :src="userInfo.portraitUrl" :size="isPad?120:60" bg-color="#fff"></u-avatar>
		       </view>
			   <view class="username-1">{{ userInfo.userName ? userInfo.userName : '未登录' }}</view>
			</view>
			
		</view> -->





		<!-- <view class="approve">
      <view class="approve-head"> 审批事项 </view>
      <view class="approve-main">
        <view class="approve-main-item" @click="go('/pages/often/backlog')">
          <image src="../../static/image/u563.png" mode="widthFix" />
          <view>待办事项</view>
        </view>
        <view class="approve-main-item" @click="go('/pages/often/completed')">
          <image src="../../static/image/u560.png" mode="widthFix" />
          <view>已办事项</view>
        </view>
      </view>
    </view> -->
		<view class="content-box">
			<view class="approve" v-if="orgRouter.length">
				<view class="approve-head">组织机构</view>

				<view class="approveContent">
					<view class="approve-main">

						<view class="approve-main-item" v-if="orgRouter.filter(item=>item.name=='企业实名').length">
							<image src="../../static/image/qiyeshiming.png" mode="widthFix" @click="auth" />
							<view class="approve-name">企业实名</view>
						</view>

						<view class="approve-main-item" @click="go('/pages/certification/department')"
							v-if="orgRouter.filter(item=>item.name=='部门管理').length">
							<image src="../../static/image/bumenguanli.png" mode="widthFix" />
							<view class="approve-name">部门管理</view>
						</view>
						<view class="approve-main-item" @click="go('/pages/certification/role')"
							v-if="orgRouter.filter(item=>item.name=='权限设置').length">
							<image src="../../static/image/jueseguanli.png" mode="widthFix" />
							<view class="approve-name">权限设置</view>
						</view>
						<view class="approve-main-item" @click="go('/pages/certification/staff')"
							v-if="orgRouter.filter(item=>item.name=='员工管理').length">
							<image src="../../static/image/yuangongguanli.png" mode="widthFix" />
							<view class="approve-name">员工管理</view>
						</view>
						<view class="approve-main-item" @click="go('/pages/certification/theProject')"
							v-if="orgRouter.filter(item=>item.name=='所辖项目').length">
							<image src="../../static/image/suoxiaxiangmu.png" mode="widthFix" />
							<view class="approve-name">所辖项目</view>
						</view>
						<view class="approve-main-item" @click="go('/pages/certification/superior')"
							v-if="userInfo.orgType==4 || userInfo.orgType==2">
							<image src="../../static/image/suoxiaxiangmu.png" mode="widthFix" />
							<view class="approve-name">上级单位</view>
						</view>
						<view class="approve-main-item" @click="go('/pages/certification/affiliatedUnits')"
							v-if="orgRouter.filter(item=>item.name=='所辖单位').length">
							<image src="../../static/image/suoxiaxiangmu.png" mode="widthFix" />
							<view class="approve-name">所辖单位</view>
						</view>
					</view>
				</view>


			</view>

			<!-- <u-cell-group class="cell-group">
			<u-cell title="设置" isLink @click="go('/pages/me/setting')"><image slot="icon" src="../../static/image/setting.png" mode="widthFix"></image></u-cell>
			<u-cell title="客服与帮助" isLink @click="go('/pages/me/service')"><image slot="icon" src="../../static/image/service.png" mode="widthFix"></image></u-cell>
			<u-cell title="关于我们" isLink @click="go('/pages/me/about-us')"><image slot="icon" src="../../static/image/service.png" mode="widthFix"></image></u-cell>
			<u-cell title="版本更新" isLink @click="update"><image slot="icon" src="../../static/image/u10124.png" mode="widthFix"></image></u-cell>
			<u-cell title="切换单位" isLink @click="findUserByTelephone"><image slot="icon" src="../../static/image/u10118.png" mode="widthFix"></image></u-cell>
		</u-cell-group>
		<u-cell-group class="cell-group">
			<u-cell title="账号退出" @click="logOutDialog"><image slot="icon" src="../../static/image/layout.png" mode="widthFix"></image></u-cell>
		</u-cell-group> -->
			<view class="cell-group">
				<view class="cell" @click="go('/pages/me/setting')">
					<image src="../../static/image/setting.png" mode="widthFix" class="imgs"></image>
					<view class="cell-content">设置</view>
					<u-icon size="20" name="arrow-right" color="#dddddd"></u-icon>
					<!-- <view class="cell-content">设置</view> -->
				</view>
				<view class="cell" @click="go('/pages/me/service')">
					<image src="../../static/image/whatsapp.png" mode="widthFix" class="imgs"></image>
					<view class="cell-content">客服与帮助</view>
					<u-icon size="20" name="arrow-right" color="#dddddd"></u-icon>
				</view>
				<view class="cell" @click="go('/pages/me/about-us')">
					<image src="../../static/image/deploymentunit.png" mode="widthFix" class="imgs"></image>
					<view class="cell-content">关于我们</view>
					<u-icon size="20" name="arrow-right" color="#dddddd"></u-icon>
				</view>
				<view class="cell" @click="update">
					<image src="../../static/image/cloud-upload.png" mode="widthFix" class="imgs"></image>
					<view class="cell-content">版本更新</view>
					<u-icon size="20" name="arrow-right" color="#dddddd"></u-icon>
				</view>

			</view>
			<view class="cell-group">
				<view class="cell" @click="findUserByTelephone">
					<image src="../../static/image/switchuser.png" mode="widthFix" class="imgs"></image>
					<view class="cell-content bottoms">切换账号</view>
					<u-icon size="20" name="arrow-right" color="#dddddd"></u-icon>
				</view>
				<view class="cell" @click="logOutDialog">
					<image src="../../static/image/u10124.png" mode="widthFix" class="imgs"></image>
					<view class="cell-content bottoms">退出账号</view>
					<u-icon size="20" name="arrow-right" color="#dddddd"></u-icon>
				</view>
			</view>
			<u-modal :show="show" content="确定退出账号？" showCancelButton @cancel="show = false" @confirm="logOut"></u-modal>

			<!-- <u-picker
      title="请选择要切换的账号"
      :show="accountShow"
      :columns="accountList"
      keyName="loginName"
      @confirm="accountCut"
      @cancel="accountShow = false"
    ></u-picker> -->

			<u-popup :show="accountShow" mode="center" @close="closeAcc" round="10">
				<view class="accountHeader">单位选择</view>
				<view class="accountList">
					<view class="accountList-item" v-for="item in accountList" :key="item.userId" @click="accountCut(item)">
						<image src="../../static/image/isMaster.png" class="images" mode="widthFix" v-if="item.isMaster" />
						<image src="../../static/image/noMaster.png" class="images" mode="widthFix" v-if="!item.isMaster" />
						<view class="name" :class="{ blue: userId === item.userId }">
							<span>{{ item.loginName }}</span>
							<span v-if="item.isMaster == 1" class="violet">(管理员)</span>
						</view>
					</view>
				</view>
			</u-popup>
			<tabbar :tabName="2"></tabbar>
		</view>





	</view>


</template>

<script>
	import tabbar from "../../components/tabbar/tabbar.vue";

	export default {
		components: { tabbar },
		onLoad(options) {
			this.getInfo();
			console.log(this.$isIpad);
			// #ifdef APP-PLUS
			let that = this;
			uni.getSystemInfo({
				success: res => {
					console.log(res);
					that.osName = res.osName;
				}
			});
			// #endif
			// this.userInfo = this.$store.state.userInfo;
		},
		computed: {
			// tel() {
			//   let tel = this.userInfo.phoneNum ? this.userInfo.phoneNum : "***********";
			//   return tel.substr(0, 3) + "****" + tel.substr(7);
			// },
			userInfo() {
				return this.$store.state.userInfo;
			},
			isPad() {
				return this.$isIpad;
			},
			orgRouter() {
				return this.userInfo && this.userInfo.routerList && this.userInfo.routerList.length ? this.userInfo.routerList[0]
					.children : [];
			}
		},
		data() {
			return {
				show: false,
				settingShow: false,
				helpShow: false,
				accountShow: false,
				accountList: [],
				userId: "",
				osName: "",
				deviceToken: "",
				authDate: {},

			};
		},
		methods: {
			auth() {
				uni.navigateTo({ url: "/pages/certification/business-certification" });

			},
			getAuth() {
				this.$api.getAuthInfo({ type: 1 }).then(res => {
					if (res.code === 200) {
						this.authDate = res.data;
					}
				});
			},

			cutToekn() {
				uni.setStorageSync("token", "123456");
			},
			// 弹出弹框
			logOutDialog() {
				this.show = true;
			},
			// 版本更新
			update() {
				uni.showToast({
					title: "已是最新版本！",
					icon: "none"
				});
			},
			// 退出登录
			logOut() {
				this.$api.logOut().then(res => {
					console.log(res);
					if (res.code === 200) {
						uni.removeStorage({
							key: "token"
						});
						uni.removeStorage({
							key: "routes"
						});
						this.tpnsunLogin();
						this.$store.commit("saveUserInfo", {});
						uni.reLaunch({
							url: "/pages/login/login"
						});
					}
				});
			},
			go(path) {
				console.log(path);
				uni.navigateTo({ url: path });
			},
			closeAcc() {
				this.accountShow = false;
				this.userId = "";
			},
			findUserByTelephone() {

				uni.showLoading({
					mask: true
				});
				this.$api.getAccountList({ sourceType: 2 }).then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							this.accountList = res.data;
							uni.setStorageSync("areaToken", uni.getStorageSync("token"));
							uni.setStorageSync("accountList", JSON.stringify(res.data));
							uni.navigateTo({ url: `/pages/login/select-account?isCut=1&mobile=${this.userInfo.phoneNum}` });
							this.tpnsLogin();
						}
					})
					.catch(err => {
						uni.hideLoading();
					});


			},
			tpnsLogin() {
				// #ifdef APP-PLUS
				let that = this;
				const tpns = uni.requireNativePlugin("TX-TPNS");
				console.log(tpns);
				//注册获取token
				tpns &&
					tpns.registerPush({}, res => {
						console.log("注册", res);
						that.deviceToken = res.token;
					});
				// #endif
			},
			tpnsunLogin() {
				// #ifdef APP-PLUS
				const tpns = uni.requireNativePlugin("TX-TPNS");
				//注册获取token
				tpns && tpns.unregisterPush();
				// #endif
			},
			accountCut(item) {
				let deviceType = null;
				if (this.osName === "ios") {
					deviceType = 2;
				} else if (this.osName === "android") {
					deviceType = 1;
				} else if (this.osName === "mac") {
					deviceType = 3;
				}
				let params = {
					forceType: 0,
					phoneNumber: this.userInfo.phoneNum,
					pkId: item.userId,
					sourceType: 2,
					deviceType,
					deviceToken: this.deviceToken,
					tagList: [this.userInfo.phoneNum]
				};
				uni.showLoading({
					mask: true
				});
				this.$api
					.switchLogin(params)
					.then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							this.$store.commit("cleanDictionariesData");
							uni.setStorageSync("token", res.data.access_token);
							uni.setStorageSync("nowProId", "");
							uni.setStorageSync("nowOrgId", "");
							this.$store.commit("saveGetPro", true);
							this.getRoutes();
							this.getInfo();
							this.closeAcc();
						}
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			getRoutes() {
				this.$api.getOftenRouter().then(res => {
					if (res.code === 200) {
						let routes = res.data;
						this.$store.commit("saveRoutes", routes);
						uni.setStorageSync("routes", JSON.stringify(routes));
					}
				});
			},
			// 获取个人信息
			getInfo() {
				this.$api.getInfo().then(res => {
					if (res.code === 200) {
						this.$store.commit("saveUserInfo", res.data);
						uni.setStorageSync("user", res.data);
						if (res.data.isMaster && this.orgRouter.filter(item => item.name == "企业实名").length) {
							this.getAuth();
						}
					}
				});
			},
			openAlbum() {
				uni.chooseImage({
					count: 1,
					sizeType: ["original", "compressed"],
					sourceType: ["album"], //这要注意，camera掉拍照，album是打开手机相册
					success: res => {
						console.log(res);
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.bottomshadow {
		position: fixed;
		left: 0;
		right: 0;
		/*#ifdef APP-PLUS*/
		bottom: -10rpx;
		/*#endif*/
		/*#ifdef H5*/
		bottom: 90rpx;
		/*#endif*/
		z-index: 99;
		// width: 100%;
		box-shadow: 0px -12rpx 20rpx 2rpx #8a9cf7;
	}

	* {
		box-sizing: border-box;
	}

	.u-cell-group {
		image {
			width: 38rpx;
		}
	}

	.header-info {
		display: flex;
		align-items: center;

	}


	.infoadd {
		margin-left: 10px;
		margin-top: 20px;
	}

	.user-info {
		position: relative;
		display: flex;
		// justify-content: space-between;
		align-items: flex-end;
		width: 100%;
		height: 350rpx;
		padding: 40rpx 60rpx;
		color: #fff;
		background-color: #6699ff;
		z-index: 1;
		background: url('../../static/image/bg.png');
		background-size: 100% 100%;

		view {
			color: #fff;
		}

		// background: -webkit-linear-gradient(to right ,#1164d9, #00d394); /* Safari 5.1 - 6.0 */
		// background: -o-linear-gradient(to right, #1164d9, #00d394); /* Opera 11.1 - 12.0 */
		// background: -moz-linear-gradient(to right ,#1164d9, #00d394); /* Firefox 3.6 - 15 */
		// background: linear-gradient(to right, #1164d9, #00d394); /* 标准的语法（必须放在最后） */
		// &::before {
		//   content: "";
		//   position: absolute;
		//   width: 100%;
		//   height: 100%;
		//   left: 0;
		//   right: 0;
		//   top: 0;
		//   bottom: 0;
		//   background: url('../../static/image/mebg.png');
		//   background-size: 100% 140%;
		//   background-position: 0 -80rpx;
		//   opacity: 0.2;
		//   z-index: -1;
		// }
		.user-info-top {
			display: flex;
			// justify-content: space-between;

			// align-items: center;
			width: 100%;
			// height: 100%;
			// height: auto;



		}

		.user-info-bottom {
			font-size: 28rpx;
		}

		.user-info-header-1 {
			height: 100%;
			padding-top: 120rpx;
		}

		.user-info-header {
			margin-right: 20rpx;

		}

		.mt-120 {
			margin-top: 120rpx;
		}

		.user-info-msg {
			font-size: 30rpx;
			// text-align: right;


			// height: auto;

			.msg-item {
				display: flex;
				align-items: center;
				font-size: 26rpx;
				margin-bottom: 6rpx;

				.tag {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 72rpx;
					background-color: rgba(255, 255, 255, 0.308);
					color: #fff;
					padding: 10rpx 0;
					margin-right: 10rpx;
					border-radius: 10rpx;
				}

				.workArea {
					flex: 1;
					overflow: hidden;
					display: -webkit-box; //将元素设为盒子伸缩模型显示
					-webkit-box-orient: vertical; //伸缩方向设为垂直方向
					-webkit-line-clamp: 3; //超出3行隐藏，并显示省略号
				}
			}

			.username {
				font-size: 50rpx;
				margin-bottom: 30rpx;
				// margin-top: 50px;
				// margin: 20px 0;


			}

			// .workArea {
			// 	font-size: 26rpx;
			// }
			.tel {
				font-size: 20rpx;
			}
		}
	}

	.approve {
		position: relative;
		width: 95%;
		height: 110px;
		margin: 20rpx auto;
		padding: 0 20rpx;
		// border: 1px solid #ccc;
		border-radius: 10px;
		background-color: #fff;
		z-index: 2;

		.approve-head {
			height: 60rpx;
			line-height: 60rpx;
			font-size: 28rpx;
			font-weight: 700;
			color: #79859a;
		}

		.approve-main {
			width: 120%;
			display: flex;

			font-size: 28rpx;
			overflow-x: auto;

			// width: auto;
			.approve-main-item {
				width: 80px;
				height: 80px;
				text-align: center;
				margin: 0 3px;

				// padding:  0 20px;
				// margin-right: 20rpx;
				// background-color: #6699ff;
				image {
					width: 40px;
					height: 40px;
					margin-bottom: 10rpx;
				}
			}
		}
	}

	.approve-name {
		font-size: 12px;
		font-weight: 400;
		color: rgba(32, 52, 87, 1);
		text-align: center;
		vertical-align: top;
	}

	.accountHeader {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-bottom: 1px solid #d7d7d7;
	}

	.accountList {
		overflow: auto;
		width: 550rpx;
		max-height: 400rpx;

		// margin-bottom: 4rpx;
		.accountList-item {
			display: flex;
			// justify-content: center;
			align-items: center;
			width: 100%;
			height: 80rpx;
			padding: 0 40rpx 0 70rpx;
			// border-top: 1px solid #000;
			border-bottom: 1px solid #d7d7d7;

			&:nth-last-child(1) {
				border-bottom: none;
			}

			image {
				width: 50rpx;
				height: 50rpx;
				margin-right: 10rpx;
				// border: 1px solid #d7d7d7;
			}

			.name {
				flex: 1;
				overflow: hidden;
				/*超出部分隐藏*/
				white-space: nowrap;
				/*禁⽌换⾏*/
				text-overflow: ellipsis;
				/*省略号*/
			}

			.violet {
				font-size: 24rpx;
				color: rgb(90, 11, 163);
			}
		}
	}

	.blue {
		color: skyblue;
	}

	.cell-group {
		width: 95%;
		margin: 10rpx auto;
		background-color: #fff;
		margin-top: 20rpx;
		padding: 10rpx;
		border-radius: 10px;

		.cell {
			position: relative;
			display: flex;
			align-items: center;
			height: 100rpx;
			padding: 0 30rpx;

			.imgs {
				width: 40rpx;
				height: 40rpx;
				margin-right: 6rpx;
			}

			.cell-content {
				display: flex;
				align-items: center;
				width: calc(100% - 46rpx);
				height: 100rpx;
				border-bottom: 1px solid #f2f2f2;
				font-size: 14px;
				font-weight: 400;
				color: rgba(0, 0, 0, 1);
				text-align: left;
				margin-left: 5px;


			}

			/deep/.uicon-arrow-right {
				position: absolute;
				font-size: 40rpx !important;
				line-height: 40rpx !important;
				right: 40rpx;
				top: 50% !important;
				transform: translateY(-50%);
			}

			.bottoms {
				// border-bottom: none;
				border-bottom: solid 1px #f2f2f2;

			}
		}

	}

	.approveContent {
		width: 100%;
		overflow-x: auto;

	}
</style>