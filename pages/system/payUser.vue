<template>
	<view class="wrapper">
		<u-navbar leftText="付费用户" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="pad"></view>
		<view class="sticky">
			<u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="true"
				:activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"> </u-tabs>
			<view class="search">
				<view class="search-input">
					<u-input placeholder="请输入用户名称或者手机号码" border="none" v-model="inpDate.keyWord">
						<view slot="suffix">
							<u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon>
						</view>
					</u-input>
				</view>
				<view class="more-search" @click="openPop">
					<image src="../../static/image/u486.png" mode="widthFix" class="filterImg" />
					<view>筛选</view>
				</view>
			</view>
		</view>
		<view class="content">
			<u-list @scrolltolower="scrollTolower" class="u-list" :height="'calc(100vh - 268rpx)'">
				<u-list-item v-for="(item, index) in list" :key="index">
					<view class="item" @click="detail(item)">
						<view class="icons">
							<u-icon name="file-text" size="20" color="#2a82e4"></u-icon>
						</view>
						<view class="content">
							<view class="name">{{ '【'+orgList[item.orgType]+'】'+item.accountName }}</view>
							<view class="detail">续费日期：{{ item.renewalDate }}</view>
						</view>
						<view class="tags">
							<!--  0：审批中 1：审批通过 2：审批不通过 -->
							<view class="tag"
								:class="{ default: item.approveStatus==0, success: item.approveStatus==1, error: item.approveStatus==2 }">
								{{item.approveStatus==0?'审批中':item.approveStatus==1?'审批通过':item.approveStatus==2?'审批不通过':"" }}</view>
						</view>
					</view>
				</u-list-item>
			</u-list>
		</view>
		<u-popup :show="showPop" @close="closePop" mode="right" class="opo" bgColor="rgba(255, 255, 255, 0)">
			<view class="popup">
				<view class="popup-content">
					<view class="search-item mb-20">
						<h5 class="mb-20">企业类型</h5>
						<!-- <text
              class="pop-item"
              :class="inpDate.inventoryCode === '' ? 'active' : ''"
              @click="selectItem({ keyName: '' })"
              >全部</text
            > -->
						<text class="pop-item" :class="{ active: item.value == inpDate.orgType }" v-for="(item, index) in typeList"
							:key="index" @click="selectItem(item, index)">{{ item.label }}</text>
					</view>
					<view class="search-item">
						<h5 class="mb-20">续费日期</h5>
						<view class="search-datas">
							<view class="data-input">
								<view class="left" @click="openCale(1)">{{ inpDate.beginTime }}</view>
								<view class="closeBtn" @click="cleanDate(1)">X</view>
							</view>
							<view class="to">至</view>
							<view class="data-input">
								<view class="left" @click="openCale(2, inpDate.endTime)">{{ inpDate.endTime }}</view>
								<view class="closeBtn" @click="cleanDate(2)">X</view>
							</view>
						</view>
					</view>
				</view>
				<view class="footer">
					<view class="footerBtn cancel" @click="closePop">取消</view>
					<view class="footerBtn add" @click="searchOk">确认</view>
				</view>
			</view>
			<uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" />
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: [
					{ name: "全部", value: "" },
					{ name: "未处理", value: "0" },
					{ name: "审批通过", value: "1" },
					{ name: "审批不通过", value: "2" },
				],
				current: 0,
				showPop: false,
				pageNum: 1,
				approveStatus: "",
				inpDate: {
					beginTime: "",
					endTime: "",
					orgType: "1",
					keyWord: ""
				},
				searchDate: {
					beginTime: "",
					endTime: "",
					orgType: "1",
					keyWord: ""
				},
				// 0：商务用户，1：付费用户，2：建设单位，3：监理公司 ，4：施工单位， 5：项目部， 6：供应商 ，7：分包商 ，8：劳务工人， 9：设计院
				typeList: [
					{ label: "全部", value: "1" },
					{ label: "供应商", value: "6" },
					{ label: "分包商", value: "7" },
				],
				clickDate: "",
				caleType: "",
				list: [],
				orgList: ["系统运营商", "系统代理商", "建设单位", "监理公司", "施工单位", "项目部", "供应商", "分包单位", "劳务工人", "设计院"]
			};
		},
		onLoad(options) {
			this.getList();
		},
		methods: {
			resh() {
				this.pageNum = 1;
				this.getList();
			},
			getList() {
				let data = {
					pageNum: this.pageNum,
					pageSize: 20,
					approveStatus: this.approveStatus,
					...this.searchDate
				};
				this.$api.approvalMatterSearchPage(data).then(res => {
					if (res.code == 200) {
						if (this.pageNum == 1) {
							this.list = res.data.records;
						} else {
							this.list = [...this.list, ...res.data.records];
						}
						this.total = res.data.total - 0;
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			currentChange(e) {
				this.pageNum = 1;
				this.current = e.index;
				console.log(e);
				this.approveStatus = e.value;
				this.getList();
			},
			detail(item) {
				uni.navigateTo({ url: "/pages/waiting/renewayApproval?type=0&row=" + JSON.stringify({ fkBusinessId: item
							.fkRenewalId, ...item }) });
			},
			scrollTolower() {
				if (this.pageNum * 20 > this.total) {
					return;
				}
				this.pageNum = this.pageNum + 1;
				this.getList();
			},
			openPop() {
				this.showPop = true;
			},
			selectItem(item, index) {
				console.log(item);
				this.inpDate.orgType = item.value;
			},
			searchOk() {
				this.pageNum = 1;
				this.searchDate = { ...this.inpDate };
				this.getList();
				this.showPop = false;
			},
			search() {
				this.pageNum = 1;
				this.searchDate = { ...this.inpDate };
				this.getList();
			},
			closePop() {
				this.showPop = false;
				this.inpDate = { ...this.searchDate };
			},
			cleanDate(e) {
				console.log(e);
				if (e == 1) {
					this.inpDate.beginTime = "";
				} else {
					this.inpDate.endTime = "";
				}
			},
			openCale(type, date) {
				this.clickDate = date;
				this.caleType = type;
				// this.caleShow=true
				this.$refs.calendar.open();
			},
			caleConfirm(e) {
				console.log(e);
				if (this.caleType === 1) {
					this.inpDate.beginTime = e.fulldate;
				} else if (this.caleType === 2) {
					this.inpDate.endTime = e.fulldate;
				}
			},
		}
	};
</script>

<style lang="scss" scoped>
	.mb-20 {
		margin-bottom: 20rpx;
	}

	.pad {
		height: 178rpx;
	}

	.search {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		padding: 0 20rpx;

		.search-input {
			width: 540rpx;
			padding-left: 20rpx;
			border: 1px solid #2a82e4;
			border-radius: 6rpx;
		}

		.more-search {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 160rpx;
			height: 60rpx;
			border: 1px solid #2a82e4;
			border-radius: 6rpx;
			font-size: 30rpx;
			color: #2a82e4;

			.filterImg {
				width: 36rpx;
				margin-right: 6rpx;
			}
		}
	}

	.popup {
		position: relative;
		width: 600rpx;
		/*#ifdef APP-PLUS*/
		height: calc(100vh - 156rpx);
		/*#endif*/
		/*#ifdef H5*/
		height: calc(100vh - 88rpx);
		/*#endif*/
		padding: 30rpx;
		/*#ifdef APP-PLUS*/
		margin-top: 156rpx;
		/*#endif*/
		/*#ifdef H5*/
		margin-top: 88rpx;
		/*#endif*/
		background-color: #f2f2f2;

		.popup-pad {
			/*#ifdef APP-PLUS*/
			height: 156rpx;
			/*#endif*/
			/*#ifdef H5*/
			height: 88rpx;
			/*#endif*/
		}

		.popup-content {
			height: calc(100% - 100rpx);
			overflow: auto;
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

		.title-item {
			display: block;
			font-weight: 600;
			font-size: 28rpx;
			margin: 36rpx 0;
		}

		.pop-item {
			display: inline-block;
			border: 1px solid #000;
			width: 170rpx;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 30rpx;
			font-size: 28rpx;
			background-color: #fff;
			text-align: center;
			// background-color: #f6f6f6;
			border: 1px solid #eee;
			margin-bottom: 24rpx;
			margin-right: 8rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.active {
			color: #2a82e4 !important;
			background-color: #e6f7ff !important;
			border: 1px solid #2a82e4 !important;
		}

		.footer {
			position: absolute;
			left: 0;
			bottom: 0;
			display: flex;
			width: 580rpx;
			height: 100rpx;

			.footerBtn {
				width: 290rpx;
				height: 100rpx;
				line-height: 100rpx;
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

	.search-datas {
		display: flex;
		align-items: center;
		height: 80rpx;

		// background-color: #fff;
		.title {
			width: 180rpx;
		}

		.to {
			margin: 0 10rpx;
		}

		.data-input {
			display: flex;
			align-items: center;
			position: relative;
			width: 520rpx;
			height: 60rpx;
			// padding: 0 20rpx;
			font-size: 28rpx;
			border: 1px solid #dcdfe6;
			background-color: #fff;
			border-radius: 6rpx;

			.left {
				display: flex;
				align-items: center;
				width: 200rpx;
				height: 60rpx;
			}

			.closeBtn {
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				right: 6rpx;
				width: 30rpx;
				height: 30rpx;
				background-color: #eee;
				color: #ccc;
				font-size: 16rpx;
				z-index: 5;
				border-radius: 50%;
			}
		}
	}

	.item {
		display: flex;
		padding: 20rpx;
		background-color: #fff;
		margin-bottom: 10rpx;

		.icons {
			width: 60rpx;
		}

		.content {
			.name {
				width: 520rpx;
				margin-bottom: 20rpx;
				font-weight: 600;
				font-size: 30rpx;
				overflow: hidden;
				/*超出部分隐藏*/
				white-space: nowrap;
				/*禁⽌换⾏*/
				text-overflow: ellipsis;
				/*省略号*/
			}
		}

		.detail {
			width: 520rpx;
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

		.tags {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 120rpx;
			height: 74rpx;

			.tag {
				width: 120rpx;
				padding: 10rpx 0;
				text-align: center;
				font-size: 24rpx;
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

			.primary {
				background-color: #c7e1ff;
				color: #4995e9;
			}
		}
	}
</style>