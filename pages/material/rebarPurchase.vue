<template>
	<view class="wrapper">
		<u-navbar :leftText="title" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="sticky">
			<u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="false"
				:activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"></u-tabs>
			<view class="search">
				<view class="search-input">
					<u-input placeholder="请输入" border="none" v-model="searchData.orderCode" fontSize="14" maxlength="50">
						<template slot="suffix">
							<u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon>
						</template>
					</u-input>
				</view>
				<filterBtn :marginLeft="true" @click="openPop" :nums="searchTag.length" :height="64"></filterBtn>
			</view>
			<searchTag :tagList="searchTag" @closeTag="closeTag"></searchTag>
		</view>
		<view :class="{pad:!searchTag.length,pad2:searchTag.length}"></view>
		<scroll-view class="box" scroll-y="true" @scrolltolower="reachBottom">
			<view :key="current">
				<view v-if="tableData.length">
					<view class="item" v-for="item in tableData" :key="item.pkId" @click="detail(item)">
						<view class="icons">
							<u-icon name="file-text" size="20" color="#0c457a"></u-icon>
							<view class="name">{{ item.orderCode }}</view>
							<view class="tags">
								<view class="tag success">{{ item.purchaseCode }}</view>
							</view>
						</view>
						<view class="describe">
							<view class="detail mb-20">供应商：{{ item.customerName }}</view>
							<view class="detail mb-20">填表人：{{ item.createUserName }}</view>
							<view class="detail">单据时间：{{ item.serviceTime }}</view>
						</view>
					</view>
					<u-loadmore :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
						:nomore-text="nomoreText" />
				</view>

				<u-empty v-else style="height: 100%" mode="data" text="暂无数据" icon="/static/image/noData.png"></u-empty>
			</view>
		</scroll-view>
		<!-- 筛选弹框 -->
		<u-popup :show="showPop" @close="closePop" mode="right" class="pop-bgImg" bgColor="rgba(255, 255, 255, 0)">
			<view class="popup">
				<view class="tip">请选择筛选条件</view>
				<view class="popup-content">
					<view class="filter-title">供应商</view>
					<view class="filter-content mb-20">
						<view class="tags" :class="ind == 10.1 ? 'tags-click' : ''" @click="selectItem({ customName: '' })">全部
						</view>
						<view class="tags" :class="{ 'tags-click': index == ind }" v-for="(item, index) in areaList" :key="index"
							@click="selectItem(item, index)">{{ item.customName }}</view>
					</view>
					<view class="filter-title">开始时间</view>
					<view class="filter-content">
						<view class="ctime">
							<view class="time" @click="opentime(1)">
								{{ searchData.beginTime }}
								<view class="closeBtn" @click.stop="cleanDate(1)">X</view>
							</view>
							<text>至</text>
							<view class="time" @click="opentime(2)">
								{{ searchData.endTime }}
								<view class="closeBtn" @click.stop="cleanDate(2)">X</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="pop-footer-btn">
				<view class="btns btnReset" @click="closePop">取消</view>
				<view class="btns btnOk" @click="searchOk">确定</view>
			</view>
			<uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" />
		</u-popup>
		<view class="btn" v-if="$auth('material:rebarPurchase:add')" @click="addProcess">新增采购计划单</view>
	</view>
</template>

<script>
	import filterBtn from "../../components/search-tag/filter-btn.vue";
	import searchTag from "../../components/search-tag/search-tag.vue";
	export default {
		components: { filterBtn, searchTag },
		data() {
			return {
				title: "钢筋半成品",
				tabList: [{ name: "全部", val: "" }, { name: "待确认", val: "1" }, { name: "已确认", val: "2" }, {
					name: "已驳回",
					val: "3"
				}, { name: "已完成", val: "4" }],
				tableData: [],
				current: 0,
				list1: [],
				list2: [],
				typeVal: "",
				// 筛选搜索参数
				searchData: {
					pageNum: 1,
					pageSize: 20,
					purchaseTypeCode: "purchase_rebar", //普通
					purchaseCode: "",
					orderCode: "", // 采购编号
					beginTime: "",
					endTime: "",
					fkCustomerId: "" // 客户Id
				},
				total: "", // 总页数
				showPop: false,
				areaList: [], // 供应商列表
				startTime: "",
				endTime: "",
				caleType: "",
				clickDate: "",
				ind: 10.1, // 控制工区选中状态
				status: "loading",
				loadingText: "加载更多",
				loadmoreText: "轻轻上拉",
				nomoreText: "没有更多了",
				searchTag: []
			};
		},
		mounted() {
			this.getData();
			// 获取发起人筛选列表
			this.sponsorList();
			// 从详情页返回该页面的获取数据
			uni.$on("refreshData", () => {
				this.getData();
			});
		},
		methods: {
			closeTag(row) {
				console.log(row);
				this.searchData.pageNum = 1;
				this.searchData[row.key] = "";
				if (row.key == "fkCustomerId") {
					this.ind = 10.1;
				}
				this.setTagList();
				this.getData();
			},
			setTagList() {
				let arr = [];
				if (this.searchData.fkCustomerId) {
					let obj = this.areaList.filter(item => item.pkId == this.searchData.fkCustomerId)[0];
					arr.push({ key: "fkCustomerId", value: obj.customName });
				}
				if (this.searchData.beginTime) {
					arr.push({ key: "beginTime", value: this.searchData.beginTime });
				}
				if (this.searchData.endTime) {
					arr.push({ key: "endTime", value: this.searchData.endTime });
				}
				this.searchTag = arr;
			},
			detail(item) {
				uni.navigateTo({
					url: "/pages/material/orderDetails?num=2&pkId=" + item.pkId
				});
			},
			getData() {
				uni.showLoading({ mask: true });
				let data = {
					...this.searchData
				};
				if (uni.getStorageSync("user").orgType !== 5 && uni.getStorageSync("user").orgType !== 6) {
					data.fkBidProjectId = uni.getStorageSync("nowProId");
				}
				this.$api
					.materialPurchasing(data)
					.then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							if (this.searchData.pageNum == 1) {
								this.tableData = res.data.records;
							} else {
								this.tableData = this.tableData.concat(res.data.records);
							}
							this.total = res.data.current; // 总页数
							console.log(this.tableData);
							if (this.tableData.length >= res.data.total) {
								this.status = "noMore";
							}
						} else {
							uni.showToast({
								title: res.msg,
								icon: "none"
							});
						}
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			// 新增流程
			addProcess(id) {
				uni.navigateTo({
					url: "/pages/material/newPlannedorder?num=2&type=1"
				});
			},
			// 获取发起人筛选列表
			sponsorList() {
				let projectBidId = "";
				let user = uni.getStorageSync("user");
				if (user.orgType != 5 && user.orgType !== 6) {
					projectBidId = uni.getStorageSync("nowProId");
				}
				this.$api.getClient({ customType: 3, supplierType: 3, projectBidId }).then(res => {
					if (res.code === 200) {
						this.areaList = res.data;
					} else {
						uni.showToast({
							title: res.msg,
							icon: "error"
						});
					}
				});
			},
			// 选择发起人
			selectItem(item, index) {
				if (item.customName == "") {
					this.ind = 10.1;
					this.searchData.fkCustomerId = "";
				} else {
					this.ind = index;
					this.searchData.fkCustomerId = item.pkId;
				}
			},
			// tab切换
			currentChange(e) {
				this.current = e.index;
				this.searchData.purchaseCode = e.val; // 状态
				this.tableData = [];
				this.searchData.pageNum = 1;
				this.getData();
			},
			// 上拉加载更多
			reachBottom() {
				console.log("sollr加载更多");
				if (this.searchData.pageNum >= this.total) {
					this.status = "noMore";
					return;
				} else {
					this.status = "loading";
				}
				this.searchData.pageNum++;
				// setTimeout(() => {
				this.getData();
				// }, 1000);
			},
			// 搜搜索
			search() {
				this.searchData.pageNum = 1;
				this.tableData = [];
				this.getData();
			},
			openPop() {
				this.showPop = true;
			},
			// 筛选弹框关闭
			closePop() {
				this.showPop = false;
			},
			searchOk() {
				this.searchData.pageNum = 1;
				this.tableData = [];
				this.setTagList();
				this.getData();
				this.closePop();
			},
			// 时间选择
			opentime(num) {
				this.caleType = num;
				if (num == 1) {
					this.clickDate = this.searchData.beginTime;
				} else {
					this.clickDate = this.searchData.endTime;
				}
				this.$refs.calendar.open();
			},
			// 时间确认
			caleConfirm(e) {
				console.log(e);
				if (this.caleType === 1) {
					this.searchData.beginTime = e.fulldate;
				} else if (this.caleType === 2) {
					this.searchData.endTime = e.fulldate;
				}
			},
			// 清空时间
			cleanDate(e) {
				if (e == 1) {
					this.searchData.beginTime = "";
				} else {
					this.searchData.endTime = "";
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.tabList {
		padding: 0 16rpx;
	}

	.active {
		color: #2a82e4 !important;
		background-color: #e6f7ff !important;
		border: 1px solid #2a82e4 !important;
	}

	.pad {
		height: 178rpx;
	}

	.pad2 {
		height: 240rpx;
	}

	.search {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100rpx;

		.search-input {
			width: 540rpx;
			height: 64rpx;
			padding-left: 20rpx;
			border: 1px solid #b4d0f0;
			border-radius: 6rpx;
			font-size: 28rpx;
		}

		.more-search {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 160rpx;
			height: 64rpx;
			border: 1px solid #b4d0f0;
			border-radius: 6rpx;
			font-size: 30rpx;
			color: #2a82e4;

			.filterImg {
				width: 36rpx;
				margin-right: 6rpx;
			}
		}
	}

	.box {
		/*#ifdef APP-PLUS*/
		height: calc(100vh - 454rpx);
		/*#endif*/
		/*#ifdef H5*/
		height: calc(100vh - 366rpx);

		/*#endif*/
		.item {
			padding: 20rpx;
			background-color: #fff;
			margin-bottom: 10rpx;

			.describe {
				padding-left: 54rpx;
			}

			.icons {
				display: flex;
				align-items: center;
				margin-bottom: 10rpx;

				// 分项名称
				.name {
					width: 520rpx;
					margin-left: 14rpx;
					font-weight: 600;
					font-size: 30rpx;
					overflow: hidden;
					/*超出部分隐藏*/
					white-space: nowrap;
					/*禁⽌换⾏*/
					text-overflow: ellipsis;
					/*省略号*/
				}

				.tags {
					flex: 1;
					text-align: -webkit-right;

					.tag {
						width: 120rpx;
						padding: 10rpx 0;
						text-align: center;
						font-size: 26rpx;
						border-radius: 8rpx;
					}

					.default {
						background-color: #eeeeee;
						color: #b8b8b8;
					}

					.waring {
						color: #ff9f3f;
						background-color: #ffe9d1;
					}

					.success {
						background-color: #d1ffe9;
						color: #5fd992;
					}

					.error {
						background-color: #ffd1d1;
						color: #d25a5a;
					}
				}
			}

			.detail {
				width: 520rpx;
				line-height: 1.5;
				font-size: 24rpx;
				color: #a6aebc;
				letter-spacing: 1px;
				overflow: hidden;
				/*超出部分隐藏*/
				white-space: nowrap;
				/*禁⽌换⾏*/
				text-overflow: ellipsis;
				/*省略号*/
			}
		}
	}

	.popup {

		// position: relative;
		// width: 660rpx;
		// padding: 30rpx 10rpx 30rpx 30rpx;
		// background-color: #fff;
		// /*#ifdef APP-PLUS*/
		// height: calc(100vh - 156rpx);
		// /*#endif*/
		// /*#ifdef H5*/
		// height: calc(100vh - 88rpx);
		// /*#endif*/
		// /*#ifdef APP-PLUS*/
		// margin-top: 156rpx;
		// /*#endif*/
		// /*#ifdef H5*/
		// margin-top: 88rpx;
		// /*#endif*/
		// .popup-pad {
		// 	/*#ifdef APP-PLUS*/
		// 	height: 156rpx;
		// 	/*#endif*/
		// 	/*#ifdef H5*/
		// 	height: 88rpx;
		// 	/*#endif*/
		// }
		// .popup-content {
		// 	height: calc(100% - 100rpx);
		// 	overflow: auto;
		// }
		// .select-top {
		// 	.title-item {
		// 		display: block;
		// 		font-weight: 600;
		// 		font-size: 28rpx;
		// 		margin: 36rpx 0;
		// 	}
		// 	.item {
		// 		display: inline-block;
		// 		border: 1px solid #000;
		// 		width: 190rpx;
		// 		height: 72rpx;
		// 		line-height: 72rpx;
		// 		border-radius: 36rpx;
		// 		font-size: 28rpx;
		// 		background-color: #fff;
		// 		text-align: center;
		// 		background-color: #f6f6f6;
		// 		border: 1px solid #eee;
		// 		margin-bottom: 24rpx;
		// 		margin-right: 8rpx;
		// 		overflow: hidden;
		// 		text-overflow: ellipsis;
		// 		white-space: nowrap;
		// 	}
		// }
		// .footer {
		// 	position: absolute;
		// 	left: 0;
		// 	bottom: 0;
		// 	display: flex;
		// 	width: 100%;
		// 	height: 100rpx;
		// 	.footerBtn {
		// 		width: 50%;
		// 		height: 100rpx;
		// 		line-height: 100rpx;
		// 		text-align: center;
		// 	}
		// 	.cancel {
		// 		background-color: #eeeeee;
		// 		color: #aaaaaa;
		// 	}
		// 	.add {
		// 		background-color: #1576e6;
		// 		color: #fff;
		// 	}
		// }
		// 日期
		.ctime {
			display: flex;
			align-items: center;

			.time {
				border: 1px solid #dfd9d9;
				width: 220rpx;
				height: 60rpx;
				line-height: 60rpx;
				padding-left: 8rpx;
				// text-align: center;
				border-radius: 10rpx;
				position: relative;
				font-size: 26rpx;

				.closeBtn {
					display: flex;
					justify-content: center;
					align-items: center;
					position: absolute;
					right: 6rpx;
					width: 30rpx;
					height: 30rpx;
					top: 15rpx;
					background-color: #eee;
					color: #ccc;
					font-size: 16rpx;
					z-index: 5;
					border-radius: 50%;
				}
			}

			text {
				margin: 0 20rpx;
			}
		}
	}
</style>