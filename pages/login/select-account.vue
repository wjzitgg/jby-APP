<template>
	<view class="wrapper">
		<u-navbar leftText="选择账号" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<!-- <u-radio-group
    v-model="radiovalue"
    placement="column"
    @change="groupChange"
  >
    <u-radio
      v-for="(item, index) in accountList"
      :key="index"
      :label="item.loginName"
      :name="item.userId"
      @change="radioChange"
    >
    </u-radio>
  </u-radio-group> -->
		<view class="bg"></view>
		<view class="content">
			<view class="translate" v-if="pkId2!=undefined && pkId2 !=null && pkId2 != ''">当前账号</view>

			<radio-group @change="radioChange" v-if="pkId2!=undefined && pkId2 !=null && pkId2 != ''">
				<label class="uni-list-cell">
					<view class="uni-list-s">
						<view class="df">
							<!-- <image v-if="item.orgType == 1" class="images" mode="widthFix"   src="../../static/images/construction company.png"  /> -->
							<!-- <image v-if="onData.orgType == 0" src={{  }}  class="images" mode="widthFix"  /> -->
							<!-- <img src="../../static/images/construction company.png" class="images"  mode="widthFix"  > -->
							<image v-if="onData.orgType == 0" src="../../static/images/yy.png" class="images"
								mode="widthFix" />
							<image v-if="onData.orgType == 1" src="../../static/images/dl.png" class="images"
								mode="widthFix" />
							<image v-if="onData.orgType == 2" src="../../static/images/js.png" class="images"
								mode="widthFix" />
							<image v-if="onData.orgType == 3" src="../../static/images/jl.png" class="images"
								mode="widthFix" />
							<image v-if="onData.orgType == 4" src="../../static/images/sg.png" class="images"
								mode="widthFix" />
							<image v-if="onData.orgType == 5" src="../../static/images/xm.png" class="images"
								mode="widthFix" />
							<image v-if="onData.orgType == 6" src="../../static/images/gy.png" class="images"
								mode="widthFix" />
							<image v-if="onData.orgType == 7" src="../../static/images/fb.png" class="images"
								mode="widthFix" />
							<image v-if="onData.orgType == 8" src="../../static/images/lw.png" class="images"
								mode="widthFix" />
							<image v-if="onData.orgType == 9" src="../../static/images/sj.png" class="images"
								mode="widthFix" />

							<image v-if="onData.orgType == 10" src="../../static/images/sgjt.png" class="images"
								mode="widthFix" />
							<image v-if="onData.orgType == 11" src="../../static/images/zfjg.png"
								class="images" mode="widthFix" />
							<image v-if="onData.orgType == 12" src="../../static/images/jsjt.png" class="images"
								mode="widthFix" />
						</view>
						<view>

							<view class="radioContent">{{onData.orgName}}</view>
							<view class="df">
								<view>{{onData.loginName}}</view>
								<view class="isMaster">{{onData.isMaster?'管理员':''}}</view>
							</view>
							<!-- <view  v-if="onData.isMaster == 1" class="isMaster" >{{onData.isMaster?'管理员':''}}</view> -->
						</view>
					</view>
					<view>
						<radio :value="onData.userId" :checked="onData.userId === pkId" />
					</view>

				</label>
			</radio-group>



			<view class="translate">请选择</view>
			<radio-group @change="radioChange">

				<label class="uni-list-cell" v-for="item in accountList" :key="item.userId" v-show="item.userId !== pkId2">
					<view class="uni-list-s">
						<view class="imgs">
							<!-- <image v-if="item.orgType == 1" class="images" mode="widthFix"   src="../../static/images/construction company.png"  /> -->
							<image v-if="item.orgType == 0" src="../../static/images/yy.png" class="images"
								mode="widthFix" />
							<image v-if="item.orgType == 1" src="../../static/images/dl.png" class="images"
								mode="widthFix" />
							<image v-if="item.orgType == 2" src="../../static/images/js.png" class="images"
								mode="widthFix" />
							<image v-if="item.orgType == 3" src="../../static/images/jl.png" class="images"
								mode="widthFix" />
							<image v-if="item.orgType == 4" src="../../static/images/sg.png" class="images"
								mode="widthFix" />
							<image v-if="item.orgType == 5" src="../../static/images/xm.png" class="images"
								mode="widthFix" />
							<image v-if="item.orgType == 6" src="../../static/images/gy.png" class="images"
								mode="widthFix" />
							<image v-if="item.orgType == 7" src="../../static/images/fb.png" class="images"
								mode="widthFix" />
							<image v-if="item.orgType == 8" src="../../static/images/lw.png" class="images"
								mode="widthFix" />
							<image v-if="item.orgType == 9" src="../../static/images/sj.png" class="images"
								mode="widthFix" />

							<image v-if="item.orgType == 10" src="../../static/images/sgjt.png" class="images"
								mode="widthFix" />
							<image v-if="item.orgType == 11" src="../../static/images/zfjg.png"
								class="images" mode="widthFix" />
							<image v-if="item.orgType == 12" src="../../static/images/jsjt.png" class="images"
								mode="widthFix" />

							<!-- <img src="../../static/images/construction company.png" class="images"  mode="widthFix"  > -->
						</view>
						<view>

							<view class="radioContent">{{item.orgName}}</view>
							<view class="df">
								<view>{{item.loginName}}</view>
								<view class="isMaster">{{item.isMaster?'管理员':''}}</view>
							</view>
							<!-- <view  v-if="item.isMaster == 1" class="isMaster" >{{item.isMaster?'管理员':''}}</view> -->
						</view>
					</view>
					<view>
						<radio :value="item.userId" :checked="item.userId === pkId" :disabled="!item.pastStatus" />
					</view>

				</label>
			</radio-group>

		</view>

		<u-picker title="请选择要登录的账号" :show="show" :columns="columns" keyName="loginName" @confirm="confirm"
			@cancel="cancel"></u-picker>
	</view>
</template>

<script>
	export default {

		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};

			},
		},


		onLoad(options) {
			this.pkId = uni.getStorageSync("user").userId;
			this.pkId2 = uni.getStorageSync("user").userId;

			//  this.userid = uni.getStorageSync('user');
			//  let lists= JSON.parse(uni.getStorageSync('accountList'))
			// this.accountList=lists


			console.log(this.pkId, "33333333");
			console.log(uni.getStorageSync("user").userId, "22222222222222222");



			// 获取本地 ID
			//  console.log(uni.getStorageSync('accountList userId'),"本地idqqqqq")
			//   console.log( uni.getStorageSync("user").userId, "dddddd")

			this.phone = options.mobile;
			this.isCut = !!options.isCut;
			let arr = JSON.parse(uni.getStorageSync("accountList"));
			this.accountList = arr;

			console.log(this.accountList);

			this.accountList.forEach(item => {
				if (item.userId == this.pkId) {
					this.onData = item;

					//  console.log( this.onData ,"11111111111111111111111111111111")
				}

			});

			this.image.map(item => {

				console.log(item, "11111111111111111111111111111111");

			});


			this.$set(this.columns, "0", arr.map(item => ({
				...item,
				loginName: item.loginName + (item.isMaster ? "管理员" :
					"")
			})));


			this.tpnsLogin();
			// #ifdef APP-PLUS
			let that = this;
			uni.getSystemInfo({
				success: res => {
					console.log(res);
					that.osName = res.osName;
				}
			});
			// #endif
			// this.show = true;

		},


		onBackPress() {
			if (this.isCut) {
				return false;
			} else {
				uni.redirectTo({ url: "/pages/login/login" });
				this.tpnsunLogin();
				return true;
			}
		},
		computed: {
			accountParams() {
				return this.$store.state.accountParams;
			},
		},
		data() {
			return {
				columns: [],
				params: {},
				pkId: "",
				pkId2: "",
				uuid: "",
				show: false,
				phone: "",
				lists: [],
				accountList: [],
				radiovalue: [],
				osName: "",
				deviceToken: "",
				tabPosition: "",
				isCut: false,
				onData: {},

				image: [
					{ img0: "../../static/images/mobile network operator.png", },
					{ img1: "../../static/images/subcontractingunit.png" },
					{ img2: "../../static/images/construction unit subsidiary.png" },
					{ img3: "../../static/images/supervisioncompany.png" },
					{ img4: "../../static/images/construction branch.png" },
					{ img5: "../../static/images/project department.png" },
					{ img6: "../../static/images/subcontractingunit.png" },
					{ img7: "../../static/images/labor service company.png" },
					{ img8: "../../static/images/construction company.png" },
					{ img9: "../../static/images/design institute.png" },
					{ img10: "../../static/images/construction company.png" },
					{ img11: "../../static/images/government regulatory authority.png" },
					{ img12: "../../static/images/constructionunit.png" },
				]
			};
		},
		methods: {
			tpnsLogin() {
				// #ifdef APP-PLUS 
				let that = this;
				const tpns = uni.requireNativePlugin("TX-TPNS");
				console.log(tpns);
				//注册获取token
				tpns && tpns.registerPush({}, res => {
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
			accountCut() {
				let deviceType = null;
				if (this.osName === "ios") {
					deviceType = 2;
				} else if (this.osName === "android") {
					deviceType = 1;
				} else if (this.osName === "mac") {
					deviceType = 3;
				}
				let params = {
					// forceType: 0,
					phoneNumber: this.phone,
					pkId: this.pkId,
					sourceType: 2,
					deviceType,
					deviceToken: this.deviceToken,
					tagList: [this.phone]
				};
				uni.setStorageSync("token", uni.getStorageSync("areaToken"));
				uni.showLoading({
					mask: true
				});
				this.$api
					.switchLogin(params)
					.then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							this.$store.commit("cleanDictionariesData");
							this.$store.commit("cleanAllStore");
							uni.setStorageSync("token", res.data.access_token);
							uni.setStorageSync("nowProId", "");
							uni.setStorageSync("nowOrgId", "");
							this.$store.commit("saveGetPro", true);
							this.getRoutes();
							this.getInfo();
							uni.reLaunch({
								url: "/pages/index/index",
								success: () => {},
							});
							this.pkId2 = this.pkId;
						} else {
							uni.redirectTo({
								url: "/pages/login/login",
							});
							uni.showToast({
								title: res.msg,
								icon: "none",
							});
							this.tpnsunLogin();
						}
					})
					.catch(err => {
						// this.tpnsunLogin()
						uni.hideLoading();
					});
			},
			getAccountList(phoneNumber) {
				uni.showLoading({
					mask: true
				});
				this.$api
					.getAccountList({
						sourceType: 2
					})
					.then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							this.$set(this.columns, "0", res.data.map(item => ({
								...item,
								loginName: item.loginName + (item
									.isMaster ? "管理员" : "")
							})));
							console.log(this.columns);
							this.show = true;
						}
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			// 选完列表后登录
			selectLogin() {
				uni.showLoading({
					mask: true,
				});
				let params = {
					forceType: 0, //强制登录的问题
					sourceType: 2, //登录来源,2是app
					code: this.accountParams.code,
					pkId: this.pkId,
					phoneNumber: this.accountParams.phoneNumber,
					uuid: this.uuid,
				};
				this.$api
					.userLogin(params)
					.then(res => {
						console.log(res);
						uni.hideLoading();
						if (res.code === 200) {
							uni.setStorageSync("token", res.data.access_token);
							this.getRoutes();
							this.getInfo();
							uni.reLaunch({
								url: "/pages/index/index",
								success: () => {},
							});
							this.pkId2 = this.pkId;
						} else {
							uni.redirectTo({
								url: "/pages/login/login",
							});
							uni.showToast({
								title: res.msg,
								icon: "none",
							});
						}
					})
					.catch(err => {
						uni.redirectTo({
							url: "/pages/login/login",
						});
						uni.hideLoading();
						uni.showToast({
							title: err.msg,
							icon: "error",
						});
					});
			},
			radioChange(e) {
				// if(iem.pastStatus=='0'){
				//    return
				// }
				console.log(e);
				console.log(e.target.value);
				this.pkId = e.target.value;
				this.accountCut();
			},




			confirm(e) {
				console.log(e);
				this.pkId = e.value[0].userId;
				this.accountCut();
			},
			cancel() {
				uni.redirectTo({
					url: "/pages/login/login",
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
					}
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.wrapper {
		background-color: #fafafa;
	}

	.bg {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		background-color: #fafafa;
	}

	.translate {
		font-size: 18px;
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 25px;
		color: rgba(32, 52, 87, 1);
		text-align: left;
		vertical-align: top;
	}

	.content {
		position: relative;
		padding: 20rpx;
		z-index: 2;
		background: rgba(247, 247, 255, 1);

		&::after {
			content: "";
			position: fixed;
			top: 562rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 644rpx;
			height: 625rpx;
			background: url('../../static/image/logo.png') no-repeat;
			background-size: 644rpx 625rpx;
			opacity: 0.1;
			z-index: -1;
		}
	}

	.uni-list-cell {
		display: flex;
		align-items: center;
		padding: 20rpx;
		margin: 15rpx auto;
		background-color: #ffffff80;
		border-radius: 20rpx;
		justify-content: space-between;

		width: 351px;
		height: 72px;
		opacity: 1;
		border-radius: 4px;
		background: rgba(255, 255, 255, 1);

		.imgs {
			display: flex;
			align-items: center;
		}

		.radioContent {
			max-width: 460rpx;
			overflow: hidden;
			/*超出部分隐藏*/
			white-space: nowrap;
			/*禁⽌换⾏*/
			text-overflow: ellipsis;
			/*省略号*/
		}

		.isMaster {
			// width: 34px;
			font-size: 12px;
			// height: 16px;
			border-radius: 2px;
      padding: 1px;
			// background: rgba(204, 204, 204, 1);
      color: #aaaaaa;
			text-align: center;
			// line-height: 16px;
      background: #f0f0f0;
      margin-left: 3px;

		}
	}

	.uni-list-s {
		display: flex;
	}

	.images {

		margin: 0 20rpx;
		width: 32px;
		height: 32px;


	}

	.df {
		display: flex;
		align-items: center;
		margin-top: 5px;
		font-size: 12px;
		height: 18px;
		opacity: 0.3;
		border-radius: 2px;
    color: rgba(32, 52, 87, .6);
	}

	.orgTyepName {
		margin-top: 5px;
		font-size: 12rpx;
	}
</style>