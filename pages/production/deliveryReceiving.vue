<template>
	<view class="wrapper">
		<u-navbar leftText="施工验收" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="sticky">
			<u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="true"
				:activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"></u-tabs>
			<view class="search">
				<view class="search-input">
					<u-input placeholder="请输入分项名称" border="none" v-model="searchData.itemName" fontSize="14" maxlength="100">
						<template slot="suffix">
							<u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon>
						</template>
					</u-input>
				</view>
				<filterBtn @click="openPop" :nums="searchTag.length"></filterBtn>
				<!--  @click="showFilter = !showFilter" -->
				<!-- <view class="more-search" @click="openPop">
					<image src="../../static/image/u486.png" mode="widthFix" class="filterImg" />
					<view>筛选</view>
				</view> -->
			</view>
			<searchTag :tagList="searchTag" @closeTag="closeTag"></searchTag>
		</view>
		<view :class="{pad:!searchTag.length,pad2:searchTag.length}"></view>
		<scroll-view class="box"  :class="{ 'content-box': $auth('production:deliveryReceiving:add') }" scroll-y="true" @scrolltolower="reachBottom">
			<view :key="current">
				<view v-if="tableData.length">
					<view class="item" v-for="item in tableData" :key="item.pkId" @click="detail(item)">
						<view class="icons">
							<u-icon name="../../static/fileImg/file-text.png" size="20"></u-icon>
							<view class="name">{{ item.itemNames }}</view>
							<view class="tags">
								<!-- 0：草稿，1：审批中，2：审批完成 3:已拒绝-->
								<view v-if="item.approveStatus === 0" class="tag default">{{ item.approveStatusStr }}</view>
								<view v-if="item.approveStatus === 1" class="tag success">{{ item.approveStatusStr }}</view>
								<view v-if="item.approveStatus === 2 || item.approveStatus === 4" class="tag waring">
									{{ item.approveStatusStr }}
								</view>
								<view v-if="item.approveStatus === 3" class="tag error">{{ item.approveStatusStr }}</view>
								<view v-if="item.approveStatus > 3 && item.approveStatus != 4" class="tag seal">
									{{ item.approveStatusStr }}
								</view>
							</view>
						</view>
						<view class="describe">
							<view class="detail mb-20">发起人：{{ item.createUserName }}</view>
							<view class="detail mb-20">当前任务：{{ item.currentTaskName }}</view>
							<view class="detail mb-20">当前办理人：{{ item.approver }}</view>
							<view class="detail">开始时间：{{ item.createTime }}</view>
						</view>
					</view>
					<u-loadmore :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
						:nomore-text="nomoreText" />
				</view>

				<u-empty v-else style="height: 100%" mode="data" text="暂无数据"
					icon="/static/image/noData.png"></u-empty>
			</view>
		</scroll-view>
		<!-- 筛选弹框 -->
		<u-popup :show="showPop" @close="closePop" mode="right"  class="pop-bgImg" bgColor="rgba(255, 255, 255, 0)">
			<view class="popup">
				<view class="tip">请选择筛选条件</view>
				<view class="popup-content">
						<view class="filter-title">发起人</view>
						<view class="filter-content">
							<view class="tags" :class="ind == 10.1 ? 'tags-click' : ''"
							@click="selectItem({ userName: '' })">全部</view>
							<view class="tags" :class="{ 'tags-click': index == ind }" v-for="(item, index) in areaList" :key="index"
							@click="selectItem(item, index)">{{ item.userName }}</view>
						</view>
						<view class="filter-title">开始时间</view>
						<view class="filter-content ctime">
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
				<!-- <view class="footer">
					<view class="footerBtn cancel" @click="closePop">取消</view>
					<view class="footerBtn add" @click="searchOk">确认</view>
				</view> -->
			</view>
			<view class="pop-footer-btn">
      		  <view class="btns btnReset" @click="closePop">取消</view>
      		  <view class="btns btnOk" @click="searchOk">确定</view>
      		</view>
			<uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" />
		</u-popup>
		<view class="btn" @click="addProcess" v-if="$auth('production:deliveryReceiving:add')">新增工程验收</view>
	</view>
</template>

<script>
import filterBtn from '../../components/search-tag/filter-btn.vue';
import searchTag from '../../components/search-tag/search-tag.vue';
export default {
	components:{filterBtn,searchTag},
	data() {
		return {
			tabList: [{ name: "全部", val: "" }, { name: "审批中", val: "1" }, { name: "已审批", val: "2" }, {
				name: "签章中",
				val: "5"
			}, { name: "已签章", val: "6" }],
			tableData: [],
			current: 0,
			list1: [],
			list2: [],
			typeVal: "",
			// 筛选搜索参数
			searchData: {
				pageNum: 1,
				pageSize: 20,
				approveStatus: "",
				itemName: "", // 分项工程名称
				beginTime: "",
				endTime: "",
				sponsorId: "",// 发起人Id
				fkBidProjectId: uni.getStorageSync('nowProId')
			},
			total: "", // 总页数
			showPop: false,
			areaList: [], // 发起人列表
			startTime: "",
			endTime: "",
			caleType: "",
			clickDate: "",
			ind: 10.1, // 控制工区选中状态
			status: "loading",
			loadingText: "加载更多",
			loadmoreText: "轻轻上拉",
			nomoreText: "没有更多了",
			searchTag:[]
		};
	},
	mounted() {
		this.getData();
		// 获取发起人筛选列表
		this.sponsorList();
		this.searchProcessApproveStates();
	},
	methods: {
		resh() {
			this.getData(true);
		},
		searchProcessApproveStates() {
			this.$api.searchProcessApproveStates().then(res => {
				if (res.code === 200) {
					this.tabList = [{ name: "全部", value: "" }, ...res.data.map(item => ({
						name: item.key,
						value: item.name
					}))];
				} else {
					uni.showToast({
						title: res.msg,
						icon: "none",
					});
				}
			});
		},
		getData(resh) {
			if (resh) {
				this.tableData = [];
				this.searchData.pageNum = 1;
			}
			uni.showLoading({ mask: true });
			let data = {
				...this.searchData
			};
			// 后端接口不规范导致要这样做
			// if (this.current == 3) {
			// 	data.approveStatusdata = 5;
			// } else if (this.current == 4) {
			// 	data.approveStatusdata = 6;
			// } else if (this.current == 0) {
			// 	data.approveStatusdata = "";
			// } else {
			// 	data.approveStatus = this.current;
			// }
			this.$api
				.flowCheckout(data)
				.then(res => {
					uni.hideLoading();
					if (res.code === 200) {
						this.tableData = this.tableData.concat(res.data.records);
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
				url: "/pages/production/newProcess"
			});
		},
		detail(item) {
			// if (item.approveStatus == 0) {
			// 	return uni.showToast({
			// 		icon: "none",
			// 		title: "草稿状态无法查看"
			// 	});
			// }
			console.log('item -----> ', item);
			let handleStatus = 1;
			if (item.handleStatus == 1) {
				handleStatus = 0;
			}
			let obj = {
				fkBusinessId: item.pkId,
				handleStatus,
				clearBtnStatus: item.clearBtnStatus,
				sealStatus: item.sealStatus,
				sealWithdrawStatus: item.sealWithdrawStatus,
				approveStatus: item.approveStatus,
				approveStatusStr: item.approveStatusStr,

			};
			// if (item.approveStatus == 5 || item.approveStatus == 6 || item.approveStatus == 7) {
			// 	console.log(item)
			// 	// /pages/production//checkDetail?obj=
			// 	// return uni.navigateTo({ url: "/pages/production/checkDetail?obj="+JSON.stringify(item) });
			// 	// uni.navigateTo({
			// 	// 	url:
			// 	// 		`/pages/material/inventory/checkDetail?pkId=${item.pkId}&type=${item.approveStatus == '0' ? 1 : 2}`,
			// 	// });
			// 	// return
			// }
			//    
			// return console.log(item)
			uni.navigateTo({ url: `/pages/waiting/deliveryReceivingDetail?row=` + JSON.stringify(obj) });
		},
		// 获取发起人筛选列表
		sponsorList() {
			this.$api.sponsorList().then(res => {
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
			if (item.userName == "") {
				this.ind = 10.1;
				this.searchData.sponsorId = "";
			} else {
				this.ind = index;
				this.searchData.sponsorId = item.pkId;
			}
		},
		// tab切换
		currentChange(e) {
			this.searchData.approveStatus = e.value; // 状态
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
// .workflow {
//   display: flex;
//   .workflow-left{
//     width: 60rpx;
//     .tabs-item {
//       display: flex;
//       align-items: center;
//       width: 60rpx;
//       padding: 30rpx 0;
//       border: 2rpx solid #d7d7d7;
//       // border-top: 0;
//       // border-right: 0;
//       writing-mode: vertical-lr;
//       cursor: pointer;
//     }
//     .currentTab {
//       background-color: #81d3f8;
//       color: #fff;
//     }
//   }
//   .workflow-right{
//     flex: 1;
//   }
//   .workflow-right2{
//     width: calc(100% - 60rpx);
//   }
// }
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
					color: #2a82e4;
					background-color: #c7e1ff;
				}

				.seal {
					color: #1890ff;
					background-color: #ecf5ff;
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

	.select-top {
		.title-item {
			display: block;
			font-weight: 600;
			font-size: 28rpx;
			margin: 36rpx 0;
		}

		.item {
			display: inline-block;
			border: 1px solid #000;
			width: 190rpx;
			height: 72rpx;
			line-height: 72rpx;
			border-radius: 36rpx;
			font-size: 28rpx;
			background-color: #fff;
			text-align: center;
			background-color: #f6f6f6;
			border: 1px solid #eee;
			margin-bottom: 24rpx;
			margin-right: 8rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

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

/deep/ .uni-scroll-view,
.uni-scroll-view-content {
	min-height: 100% !important;
	height: auto;
}

.content-box {

	margin-bottom: 50px;
	// max-height: calc(100vh - 210px);
	overflow: auto;
}</style>