<template>
	<view class="wrapper">
		<u-navbar leftText="设备购买" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="sticky">
			<view style="background: #fff">
				<u-tabs class="tabs" :list="tab" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}"
					:inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"> </u-tabs>
			</view>
			<view class="search">
				<view class="search-input">
					<u-input placeholder="请输入关键字搜索" border="none" v-model="searchDate.deviceName" maxlength="100">
						<view slot="suffix">
							<!-- <u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon> -->
							<view class="sou" name="search" @click="search">搜索</view>
						</view>
					</u-input>
				</view>
				<view class="more-search" @click="openPop">
					<view class="image-search">
						<image src="/static/image/searchImg.png" alt="" />
					</view>
					<view class="Translation"> 筛选</view>

				</view>
			</view>
			<!-- 分页 -->
			<scroll-view class="box" scroll-y="true" @scrolltolower="reachBottom">
				<view class="list">
					<view class="item" v-for="(item,index) in listData" :key="index">
						<view class="facility-img">
							<image src="../../static/logo.png" mode="widthFix"></image>
						</view>
						<view class="facility-title">
							<view class="item-title">
								{{item.deviceName}}
							</view>
							<view class="item-describe">
								{{item.className}}
							</view>
						</view>
						<view class="facility-num">
							{{item.buyNum }}{{item.unitName}}
						</view>
					</view>
				</view>
			</scroll-view>
			<u-button class="btn" text="新增设备" @click="addbuy"></u-button>
		</view>
		<!-- 筛选弹框 -->
		<u-popup :show="showPop" @close="closePop" mode="right">
			<view class="popup">
				<view class="screen">
					请选择筛选条件
				</view>
				<view class="popup-content">
					<view class="search-item mb-24">
						<h5 class="mb-24">设备类型</h5>
						<view class="select-type" @click="receiverClick">
							<text class="no-name" v-if="receiverDataList.itemName == ''">请选择</text>
							<text class="tr-name" v-else>{{ receiverDataList.itemName }}</text>
							<u-icon v-if="receiverDataList.itemName.length != 0" @click.native.stop="empty" name="trash-fill"
								class="icons icon" color="#2a82e4" size="16"></u-icon>
							<u-icon v-else name="arrow-down-fill" class="icons " color="#2a82e4" size="12"></u-icon>
						</view>
					</view>
					<view class="search-item mb-24">
						<h5 class="mb-24">使用部门</h5>
						<view class="search-item">
							<easy-select ref="easySelect" size="mini" class="easySelect" :value="nowArea" @selectOne="selectOne"
								:options="areaList"></easy-select>
						</view>
					</view>
					<view class="search-item mb-24">
						<h5 class="mb-24">使用部位</h5>
						<view class="select-type" @click="receiverClick2">
							<text class="no-name" v-if="receiverDataList2.itemName == ''">请选择</text>
							<text class="tr-name" v-else>{{ receiverDataList2.itemName }}</text>
							<u-icon v-if="receiverDataList2.itemName.length != 0" @click.native.stop="empty2" name="trash-fill"
								class="icons icon" color="#2a82e4" size="16"></u-icon>
							<u-icon v-else name="arrow-down-fill" class="icons " color="#2a82e4" size="12"></u-icon>
						</view>
					</view>
					<image src="/static/image/searchBg.png" mode="aspectFit" class="img-status"></image>
				</view>

				<view class="footer">
					<view class="footerBtn cancel" @click="closePop">取消</view>
					<view class="footerBtn add" @click="searchOk">确认</view>
				</view>
			</view>
		</u-popup>
		<!-- 设备类型下拉弹框 -->
		<u-popup :show="receiveShow" @close="receiveShow = false" class="highest">
			<view class="selectShow">
				<view class="head">
					<view class="name">设备类型</view>
					<view class="closeBtn" @click="requestConfirmation" style="color: #3c9cff">确认</view>
				</view>
				<view class="content">
					<tree ref="weert" class="price-amount" :selectedData="viewAuthorize" :multiple="false" :associatedNode="false"
						:disabled="false" :wipeStatus="true" :localdata="yearList" valueKey="pkId" textKey="itemName"
						childrenKey="children"></tree>
				</view>
			</view>
		</u-popup>
		<!-- 使用部位 -->
		<u-popup :show="receiveShow2" @close="receiveShow2 = false" class="highest">
			<view class="selectShow">
				<view class="head">
					<view class="name">使用部位</view>
					<view class="closeBtn" @click="requestConfirmation2" style="color: #3c9cff">确认</view>
				</view>
				<view class="content">
					<tree ref="weert2" class="price-amount" :selectedData="viewAuthorize2" :multiple="false"
						:associatedNode="false" :disabled="false" :wipeStatus="true" :localdata="yearList2" valueKey="pkId"
						textKey="itemName" childrenKey="children"></tree>
				</view>
			</view>
		</u-popup>
	</view>

</template>

<script>
	import tree from "../../components/ba-tree-picker-radio/ba-tree-picker.vue";
	export default {
		data() {
			return {
				tab: [{ name: "服务中" }, { name: "已过期" }],
				showPop: false,
				total: "",
				searchDate: {
					pageNum: 1,
					pageSize: 20,
					sourceType: 1,
					consumeType: 1,
					enableStatus: 0, //0服务中 1已过期
					deviceName: "", //设备名称
					beginTime: "",
					endTime: ""
				},
				receiveShow: false,
				viewAuthorize: [],
				yearList: [],
				receiverDataList: {
					itemName: ""
				},
				receiveShow2: false,
				viewAuthorize2: [],
				yearList2: [],
				receiverDataList2: {
					itemName: ""
				},
				nowArea: "",
				areaId: "",
				areaList: [],
				// 分页数据
				listData: []
			};
		},
		components: {
			tree
		},
		onLoad() {
			this.getData();
			//  获取设备类型
			this.searchByTree();
			//  获取部门
			this.projDeviceSearchDeptList();
			//  获取使用部位
			this.projDeviceDeptList();
		},
		methods: {
			getData() {
				uni.showLoading();
				this.$api.projDeviceSearchPage(this.searchDate).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						this.listData = res.data.records;
					} else {

					}
				});
			},
			addbuy() {
				uni.navigateTo({
					url: "/pages/facility/addbuy"
				});
			},
			// 上拉加载更多
			reachBottom() {
				console.log("sollr加载更多");
				// if (this.searchData.pageNum >= this.total) {
				// 	this.status = "noMore";
				// 	return;
				// } else {
				// 	this.status = "loading";
				// }
				// this.searchData.pageNum++;
				// setTimeout(() => {
				this.getData();
				// }, 1000);
			},
			currentChange(item) {
				this.searchDate.enableStatus = item.index;
				console.log(this.searchDate.enableStatus);
				this.searchDate.pageNum = 1;
				this.getData();
			},
			openPop() {
				this.showPop = true;
			},
			// 搜索
			search() {
				this.searchDate.pageNum = 1;
				this.getData();
				// this.searchDate = { ...this.inpDate };
				// this.oaArticleSearchPage()
			},
			// 筛选确认
			searchOk() {
				this.searchDate.pageNum = 1;
				// this.oaArticleSearchPage();
				this.showPop = false;
			},
			closePop() {
				this.empty();
				this.empty2();
				this.nowArea = "";
				this.showPop = false;
			},
			// 使用部位树形选择
			requestConfirmation() {
				this.viewAuthorize = this.$refs.weert._confirm();
				if (this.viewAuthorize.length == 0) {
					return this.receiveShow = false;
				}
				let arr = this.flatTreeData(this.yearList);
				arr.forEach(item => {
					this.viewAuthorize.forEach(e => {
						if (item.pkId == e) {
							this.receiverDataList = item;
						}
					});
				});
				this.receiveShow = false;
			},
			requestConfirmation2() {
				this.viewAuthorize2 = this.$refs.weert2._confirm();
				if (this.viewAuthorize2.length == 0) {
					return this.receiveShow2 = false;
				}
				let arr2 = this.flatTreeData(this.yearList2);
				arr2.forEach(item => {
					this.viewAuthorize2.forEach(e => {
						if (item.pkId == e) {
							this.receiverDataList2 = item;
						}
					});
				});
				this.receiveShow2 = false;
			},
			flatTreeData(list) {
				const res = [];

				function getDate(list) {
					list.forEach(item => {
						res.push(item);
						if (item.children) {
							getDate(item.children);
						}
					});
				}
				getDate(list);
				return res;
			},
			searchByTree() {
				this.$api.searchByTree().then(res => {
					if (res.code == 200) {
						this.yearList = res.data;
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			projDeviceDeptList() {
				this.$api.projDeviceDeptList().then(res => {
					if (res.code == 200) {
						this.yearList2 = res.data.prodItemsVos;
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},

			// 下拉选择
			receiverClick() {
				this.receiveShow = true;
				this.$nextTick(() => {
					this.$refs.weert._initTree();
				});
			},
			// 下拉选择
			receiverClick2() {
				this.receiveShow2 = true;
				this.$nextTick(() => {
					this.$refs.weert2._initTree();
				});
			},
			empty() {
				this.receiverDataList = {
					itemName: "",
					pkId: ""
				};
				this.viewAuthorize = [];
			},
			empty2() {
				this.receiverDataList2 = {
					itemName: "",
					pkId: ""
				};
				this.viewAuthorize2 = [];
			},
			// 部门
			selectOne(e) {
				console.log(e);
				this.nowArea = e.options.label;
				this.areaId = e.options.value;
				// if (this.current == 0) {
				// 	this.materialDeductSearchPage();
				// } else if (this.current == 1) {
				// 	this.materialSettleSearchPage();
				// }
			},
			// 获取部门
			projDeviceSearchDeptList() {
				this.$api.projDeviceSearchDeptList().then(res => {
					if (res.code == 200) {
						if (res.data.length > 0) {
							res.data.forEach(item => {
								item.label = item.deptName;
								item.value = item.pkId;
							});
							res.data.unshift({ label: "全部", value: "" });
							this.areaList = res.data;
						} else {
							this.areaList = [];
						}

					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
						});
					}
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
	.sticky {
		z-index: 99;

		/deep/ .u-tabs__wrapper__nav__item {
			height: 100rpx !important;
		}
	}

	//搜索
	.search {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14rpx 20rpx;

		.search-input {
			display: flex;
			align-items: center;
			width: 265px;
			height: 36px;
			opacity: 1;
			border-radius: 4px;
			background: rgba(249, 249, 255, 1);
			border: 1px solid rgba(180, 208, 240, 1);

			padding-left: 20rpx;

			.sou {
				padding-right: 10px;
				font-size: 14px;
				font-weight: 500;
				letter-spacing: 0px;

				color: rgba(42, 130, 228, 1);
			}
		}

		.more-search {
			display: flex;
			justify-content: space-around;
			align-items: center;
			width: 78px;
			height: 36px;
			opacity: 1;
			border-radius: 4px;
			background: rgba(255, 255, 255, 1);
			border: 1px solid rgba(180, 208, 240, 1);

			.image-search image {
				width: 14px;
				height: 14px;
			}
		}
	}

	//筛选
	/deep/ .u-transition {
		margin-top: 44px !important;
	}

	.popup {
		position: relative;
		width: 560rpx;
		/*#ifdef APP-PLUS*/
		height: calc(100vh - 156rpx);
		/*#endif*/
		/*#ifdef H5*/
		height: calc(100vh - 88rpx);
		/*#endif*/
		padding: 112rpx 24rpx 0;
		/*#ifdef APP-PLUS*/
		// margin-top: 156rpx;
		/*#endif*/
		/*#ifdef H5*/
		// margin-top: 88rpx;
		/*#endif*/
		background-color: #ffffff;
		position: relative;

		.screen {
			position: absolute;
			top: 24rpx;
			font-weight: 500;
			left: 0;
			width: 100%;
			height: 48rpx;
			line-height: 48rpx;
			padding-left: 20rpx;
			font-size: 24rpx;
			color: #BA890D;
			background: linear-gradient(90deg, #ffefbb 0%, #fffdf8 100%);
		}

		.popup-pad {
			/*#ifdef APP-PLUS*/
			height: 156rpx;
			/*#endif*/
			/*#ifdef H5*/
			height: 88rpx;
			overflow: hidden;
			/*#endif*/
		}

		.popup-content {

			height: calc(100% - 100rpx);
			overflow: auto;

			.search-item {
				margin-bottom: 48rpx;

				.easySelect {
					height: 72rpx;

					/deep/ .uni-input-wrapper {
						font-size: 28rpx;

					}

					/deep/ .input-placeholder {
						color: #d2d6dd;
					}
				}
			}

			h5 {
				font-size: 32rpx;
				margin-bottom: 20rpx;
			}



			//下拉选择框
			.select-type {
				width: 512rpx;
				height: 72rpx;
				line-height: 72rpx;
				padding: 0 34rpx 0 24rpx;
				border: 1px solid #B4D0F0;
				border-radius: 8rpx;
				font-size: 28rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				position: relative;

				.icons {
					position: absolute;
					right: 4px;
					top: 9px;
				}

				.no-name {
					color: #d2d6dd;
				}

				.tr-name {
					color: #333333;
				}

			}
		}

		.select {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 60rpx;
			padding: 0 20rpx;
			background-color: #fff;
			margin-bottom: 20rpx;
		}

		.img-status {
			display: block;
			margin: 80rpx auto;
			width: 400rpx;
			height: 200rpx;
			// position: fixed;
			// bottom: 160rpx;
			// left: 50%;
			// margin-left: -100rpx;
		}

		.footer {
			position: absolute;
			left: 0;
			bottom: 0;
			display: flex;
			width: 580rpx;
			height: 120rpx;

			.footerBtn {
				width: 290rpx;
				height: 120rpx;
				line-height: 120rpx;
				text-align: center;
			}

			.cancel {
				background-color: #eeeeee;
				color: #aaaaaa;
			}

			.add {
				background-color: #1576e6;
				color: #fff;
			}
		}


	}

	.selectShow {
		height: 800rpx;

		.head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80rpx;
			// line-height: 80rpx;
			padding: 0 20rpx;
			font-size: 28rpx;
		}

		.content {
			border-top: 1px solid #eeeeee;
			height: 720rpx;
			overflow: auto;
		}
	}

	.highest {
		/deep/ .u-transition {
			z-index: 10075 !important;
		}

	}

	// 分页处理
	.box {
		background-color: #f7f7ff;

		.list {


			.item {
				padding: 24rpx 24rpx 0 20rpx;
				margin-top: 8rpx;
				display: flex;
				height: 140rpx;
				background-color: #fff;

				// 图片
				.facility-img {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 20rpx;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.facility-title {
					margin-top: 8rpx;
					flex: 1;

					.item-title {
						width: 90%;
						font-size: 28rpx;
						font-weight: 600;
						color: #203457;
						margin-bottom: 24rpx;
						overflow: hidden;
						/*超出部分隐藏*/
						white-space: nowrap;
						/*禁⽌换⾏*/
						text-overflow: ellipsis;
					}

					.item-describe {
						font-size: 24rpx;
						color: #a6aebc;
					}
				}

				.facility-num {
					margin-top: 8rpx;
					font-size: 28rpx;
					color: #d2d6dd;
					font-weight: 600;
				}
			}
		}
	}

	.btn {
		background-color: #1576e6;
		background-image: none;
		height: 120rpx;
	}
</style>