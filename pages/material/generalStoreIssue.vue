<!-- 普通材料发料 -->
<template>
	<view class="wrapper">
		<u-navbar leftText="普通材料发料" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="sticky">
			<u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="true"
				:activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}">
			</u-tabs>
			<view class="search">
				<view class="search-input">
					<u-input placeholder="请输入发料单号" border="none" v-model="inpDate.orderCode" maxlength="50">
						<view slot="suffix">
							<u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon>
						</view>
					</u-input>
				</view>
				<!--  @click="showFilter = !showFilter" -->
				<filterBtn :marginLeft="true" @click="openPop" :nums="searchTag.length" :height="64"></filterBtn>
			</view>
			<searchTag :tagList="searchTag" @closeTag="closeTag"></searchTag>
		</view>
		<view :class="{pad:!searchTag.length,pad2:searchTag.length}"></view>
		<view class="content">
			<u-list @scrolltolower="scrollTolower" class="u-list" :height="'calc(100vh - 268rpx)'">
				<u-list-item v-for="(item, index) in list" :key="index">
					<view class="item" @click="detail(item)">
						<view class="icons">
							<u-icon name="file-text" size="20" color="#2a82e4"></u-icon>
						</view>
						<view class="content">
							<view class="name">{{ item.orderCode }}</view>
							<view class="detail mb-20">出库对象：{{ item.customerName }}</view>
							<view class="detail mb-20">填表人：{{ item.createUserName }}</view>
							<view class="detail">业务时间：{{ item.serviceTime }}</view>
						</view>
						<view class="tags">
							<view v-if="item.issueCode === '草稿'" class="tag default">{{ item.issueCode }}</view>
							<view v-else-if="item.issueCode === '待出库'" class="tag waring">{{ item.issueCode }}</view>
							<view v-else-if="item.issueCode === '已完成'" class="tag success">{{ item.issueCode }}</view>
							<view v-else-if="item.issueCode === '已终止'" class="tag error">{{ item.issueCode }}</view>
							<view v-else-if="item.issueCode === '部分出库'" class="tag waring">{{ item.issueCode }}</view>
							<view v-else class="tag waring">{{ item.issueCode }}</view>
						</view>
					</view>
				</u-list-item>
			</u-list>
		</view>
		<view type="primary" v-if="$auth('material:generalStoreIssue:add')" class="btn" @click="add">新增发料单</view>
		<u-popup :show="showPop" @close="closePop" mode="right" class="pop-bgImg" bgColor="rgba(255, 255, 255, 0)">
			<view class="popup">
				<view class="tip">请选择筛选条件</view>
				<view class="popup-content">
					<view class="filter-title">出库对象</view>
					<view class="filter-content mb-20">
						<view class="tags" :class="{ 'tags-click': index == ind }" v-for="(item, index) in areaList" :key="index"
							@click="selectItem(item, index)">{{ item.name }}</view>
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
			<u-picker :show="pickShow" :columns="[pickList]" @confirm="pickConfirm" keyName="label"
				@cancel="pickCancel"></u-picker>
		</u-popup>
	</view>
</template>

<script>
	import filterBtn from "../../components/search-tag/filter-btn.vue";
	import searchTag from "../../components/search-tag/search-tag.vue";
	export default {
		components: { filterBtn, searchTag },
		data() {
			return {
				// 物资申请单状态编码 0:草稿，1：待确认，2：已确认，3：已驳回，4：已完成 不传即为查全部
				tabList: [
					{ name: "全部", value: "" },
					{ name: "待出库", value: 1 },
					{ name: "部分出库", value: 2 },
					{ name: "已终止", value: 3 },
					{ name: "已完成", value: 4 },
				],
				user: {},
				current: 0,
				list: [],
				showPop: false,
				pickShow: false,
				pickType: 1,
				pickList: [],
				pageNum: 1,
				total: 0,
				userName: "全部",
				templateName: "全部",
				inpDate: {
					orderCode: "",
					createUser: "",
					fkWorkflowTemplateId: "",
				},
				searchDate: {
					changesName: "",
					createUser: "",
					fkWorkflowTemplateId: "",
				},
				changesStatus: "",
				typeList: [],
				userList: [],
				searchData: {
					pageNum: 1,
					pageSize: 20,
					purchaseTypeCode: "purchase_ordinary", //普通
					purchaseCode: "",
					orderCode: "", // 采购编号
					beginTime: "",
					endTime: "",
					fkCustomerId: "", // 客户Id
				},
				areaList: [
					{ name: "无", id: "delivery_unit" },
					{ name: "分包商", id: "delivery_subcontract" },
					{ name: "供应商", id: "delivery_supplier" },
				], //
				ind: null,
				clickDate: "",
				searchTag: []
			};
		},
		onLoad(options) {
			this.user = uni.getStorageSync("user");
			this.getChangeType();
			this.getCreateUserList();
			this.searchChangesDesigPage();
		},
		methods: {
			closeTag(row) {
				console.log(row);
				this.searchData.pageNum = 1;
				if (row.key == "typeCode") {
					this.ind = null;
				} else {
					this.searchData[row.key] = "";
				}
				this.setTagList();
				this.searchChangesDesigPage();
			},
			setTagList() {
				let arr = [];
				if (this.ind != null) {
					let obj = this.areaList[this.ind];
					arr.push({ key: "typeCode", value: obj.name });
				}
				if (this.searchData.beginTime) {
					arr.push({ key: "beginTime", value: this.searchData.beginTime });
				}
				if (this.searchData.endTime) {
					arr.push({ key: "endTime", value: this.searchData.endTime });
				}
				this.searchTag = arr;
			},
			resh() {
				this.pageNum = 1;
				this.searchChangesDesigPage();
			},
			selectItem(item, index) {
				this.ind = index;
			},
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
			},
			getChangeType() {
				this.$api.getChangeType().then(res => {
					if (res.code === 200) {
						this.typeList = [
							{ label: "全部", value: "" },
							...res.data.map(item => ({
								...item,
								label: item.name,
								value: item.key,
							})),
						];
						console.log(this.typeList);
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			getCreateUserList() {
				this.$api.getCreateUserList().then(res => {
					if (res.code === 200) {
						this.userList = [
							{ label: "全部", value: "" },
							...res.data.map(item => ({
								...item,
								label: item.userName,
								value: item.userId,
							})),
						];
						console.log(this.typeList);
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			searchChangesDesigPage() {
				let data = {
					pageNum: this.pageNum,
					pageSize: 20,
					issueCode: this.changesStatus,
					typeCode: this.ind == null ? "" : this.areaList[this.ind].id,
					beginTime: this.searchData.beginTime,
					endTime: this.searchData.endTime,
					// fkOrgId:"1589501280150953986",
					// ...this.searchDate,
					orderCode: this.inpDate.orderCode,
					fkBidProjectId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowProId"),
				};
				uni.showLoading({ mask: true });
				this.$api
					.orderOrdinaryApplyPage(data)
					.then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							this.list = res.data.records;
							this.total = res.data.total - 0;
						} else {
							uni.showToast({ title: res.msg, icon: "none" });
						}
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			detail(item) {
				if (item.changesStatus < 4) {
					uni.navigateTo({
						url: "/pages/material/generalStoreIssueDetails?row=" +
							JSON.stringify(item),
					});
				} else {
					uni.navigateTo({
						url: "/pages/material/generalStoreIssueDetails?row=" +
							JSON.stringify(item),
					});
				}
			},
			scrollTolower() {
				if (this.pageNum * 20 > this.total) {
					return;
				}
				this.pageNum = this.pageNum + 1;
				this.searchChangesDesigPage();
			},
			currentChange(e) {
				this.current = e.index;
				this.changesStatus = e.value;
				this.searchChangesDesigPage();
			},
			add() {
				let item = {
					itemTitle: "新增普通材料发料",
				};
				uni.navigateTo({
					url: "/pages/material/generalStoreIssueAdd?row=" + JSON.stringify(item),
				});
			},
			openPop() {
				this.showPop = true;
			},
			searchOk() {
				this.searchDate = { ...this.inpDate };
				this.setTagList();
				this.searchChangesDesigPage();
				this.closePop();
			},
			search() {
				this.searchDate = { ...this.inpDate };
				this.searchChangesDesigPage();
			},
			closePop() {
				this.showPop = false;
				this.inpDate = { ...this.searchDate };
			},
			openPick(type) {
				this.pickType = type;
				if (type === 1) {
					this.pickList = this.typeList;
				} else if (type === 2) {
					this.pickList = this.userList;
				}
				console.log(this.pickList);
				this.pickShow = true;
			},
			pickConfirm(e) {
				console.log(e);
				if (e.value[0]) {
					if (this.pickType === 1) {
						this.inpDate.fkWorkflowTemplateId = e.value[0].value;
						this.templateName = e.value[0].label;
					} else if (this.pickType === 2) {
						this.inpDate.createUser = e.value[0].value;
						this.userName = e.value[0].label;
					}
				}
				this.pickCancel();
			},
			pickCancel() {
				this.pickShow = false;
				//   this.inpDate = { ...this.searchDate };
			},
		},
	};
</script>

<style lang="scss" scoped>
	.tabList {
		/deep/ .u-tabs__wrapper__nav__item {
			width: 20%;
			padding: 0;
		}
	}

	.pad {
		height: 178rpx;
	}

	.pad2 {
		height: 240rpx;
	}

	.mb-20 {
		margin-bottom: 20rpx;
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

	.pull-down {
		width: 100%;
		color: #d5d9df;
		font-size: 28rpx;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		position: absolute;
		top: 0;
		z-index: 999;
		background: #fff;
		border-radius: 0 0 20rpx 20rpx;

		.item-tab {
			width: 33.33%;
			padding: 29rpx;
			text-align: center;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	// 下拉选中颜色
	.action {
		color: #203457;
	}

	.arrow-up {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.flow {
		overflow: auto;
		width: 750rpx;
	}

	// /deep/.opo{
	//     background-color: rgba(255, 255, 255, 0);
	// }
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
		//   /*#ifdef APP-PLUS*/
		//   height: 156rpx;
		//   /*#endif*/
		//   /*#ifdef H5*/
		//   height: 88rpx;
		//   /*#endif*/
		// }

		// .popup-content {
		//   height: calc(100% - 100rpx);
		//   overflow: auto;
		// }

		// .select-top {
		//   .title-item {
		//     display: block;
		//     font-weight: 600;
		//     font-size: 28rpx;
		//     margin: 36rpx 0;
		//   }

		//   .item {
		//     display: inline-block;
		//     border: 1px solid #000;
		//     width: 190rpx;
		//     height: 72rpx;
		//     //line-height: 72rpx;
		//     border-radius: 36rpx;
		//     font-size: 28rpx;
		//     background-color: #fff;
		//     text-align: center;
		//     background-color: #f6f6f6;
		//     border: 1px solid #eee;
		//     margin-bottom: 24rpx;
		//     margin-right: 8rpx;
		//     overflow: hidden;
		//     text-overflow: ellipsis;
		//     white-space: nowrap;
		//   }
		// }

		// .footer {
		//   position: absolute;
		//   left: 0;
		//   bottom: 0;
		//   display: flex;
		//   width: 100%;
		//   height: 100rpx;

		//   .footerBtn {
		//     width: 50%;
		//     height: 100rpx;
		//     line-height: 100rpx;
		//     text-align: center;
		//   }

		//   .cancel {
		//     background-color: #eeeeee;
		//     color: #aaaaaa;
		//   }

		//   .add {
		//     background-color: #1576e6;
		//     color: #fff;
		//   }
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

	.active {
		color: #2a82e4 !important;
		background-color: #e6f7ff !important;
		border: 1px solid #2a82e4 !important;
	}
</style>