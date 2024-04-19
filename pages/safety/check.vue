<!-- 上级质量检查 -->
<template>
	<view class="wrapper">
		<u-navbar leftText="上级安全检查" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="content">
			<solarClender @change="change" @init="clickInit" ref="solarClender" :markDays="markDays"></solarClender>
			<view class="search">
				<view class="left">
					<view class="search-input"><u--input border="none" v-model="inspectName" placeholder="输入检查名称" maxlength="50">
						</u--input></view>
					<view class="separator">|</view>
					<view class="searchBtn" @click="init">搜索</view>
				</view>
				<view class="right">
					<view class="screen" @click="openPop">筛选</view>
				</view>
			</view>
			<u-list @scrolltolower="scrollTolower" class="u-list">
				<view class="itemList" v-for="(item, index) in itemNameList" :key="index" @click="listClick(item)">
					<view>
						<u-icon name="../../static/fileImg/file-text.png" size="20" style="display: inline-block"></u-icon>
						<text class="text-hidden">{{ item.inspectName }}</text>
					</view>
					<view class="item-bottom-text">上级单位:{{ item.companyName }}</view>
					<view class="item-bottom-text">检查时间:{{ item.inspectTime }}</view>
				</view>
			</u-list>
		</view>
		<u-popup :show="showPop" @close="closePop" mode="right">
			<view class="popup">
				<!-- <view class="popup-content">
          <h5 class="mb-20" style="line-height: 30px">上级单位</h5>
        </view> -->
				<!-- <view class="popup-content">
          <view class="tags" :class="{ 'tags-click': nowTags === index }" v-for="(item, index) in list" :key="index"
            @click="tagsClick(item, 1, index)">{{ item.name }}</view>
        </view> -->
				<view class="popup-content">
					<view class="search-item mb-20">
						<h5 class="mb-20" style="line-height: 20px">日期范围选择</h5>
						<view class="dates">
							<view class="dateInput" @click="openCale(1, inpDate.beginTime)">
								<u--input style="pointer-events: none;" v-model="inpDate.beginTime" border="none" clearable></u--input>
							</view>
							<view>至</view>
							<view class="dateInput" @click="openCale(2, inpDate.endTime)">
								<u--input style="pointer-events: none;" v-model="inpDate.endTime" border="none" clearable></u--input>
							</view>
						</view>
					</view>
					<view class="reset" @click="reset">重置</view>
				</view>
				<view class="footer">
					<view class="footerBtn cancel" @click="closePop">取消</view>
					<view class="footerBtn add" @click="searchOk">确认</view>
				</view>
			</view>
			<uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" />
			<u-picker :show="pickShow" :columns="[materialList]" @confirm="pickConfirm" @cancel="pickCancel"></u-picker>
		</u-popup>
		<u-popup :show="itemShow" mode="bottom" :round="20" @close="closePops" @open="openPops">
			<view class="item-edit">
				<view class="tem-edit-title">
					{{ contractDetails.inspectName }}
					<u-icon name="close" color="#fff" @click="closePops" class="tem-edit-ico"></u-icon>
				</view>
				<view>
					<u--form labelPosition="left" :model="contractDetails" class="item-edit-form">
						<u-form-item label="检查日期:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
							{{ contractDetails.inspectTime }}
						</u-form-item>
						<u-form-item label="检查单位:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
							{{ contractDetails.inspectUnitName }}
						</u-form-item>
						<u-form-item label="参与单位:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
							{{ contractDetails.companyName }}
						</u-form-item>
						<u-form-item label="参加人员:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
							{{ contractDetails.participantName }}
						</u-form-item>
						<u-form-item label="录入人员:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
							{{ contractDetails.createUserName }}
						</u-form-item>
						<u-form-item label="检查时间:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
							{{ contractDetails.inspectTime }}
						</u-form-item>
					</u--form>
				</view>
				<view style="background: #f6f6fc; height: 5px; margin-top: 20px"></view>
				<view style="
            line-height: 30px;
            margin: 10px 10px;
            border-bottom: 1px solid #eee;
          ">记 录:{{ contractDetails.content }}</view>
				<view style="background: #f6f6fc; height: 5px; margin-top: 20px"></view>
				<view style="padding: 8px">
					<view>附件</view>
					<view class="file-set-list" v-for="(item, idx) in contractDetails.enclosures" :key="idx"
						@click="itemClick(item)">
						<u-icon class="file-set-lef" name="file-text"></u-icon>
						<text class="text-hidden">{{ item.enclosureName }}</text>
						<u-icon name="arrow-right" class="file-set-right"></u-icon>
					</view>
				</view>
				<view style="background: #f6f6fc; height: 5px; margin-top: 20px"></view>
				<view class="accessory" v-for="(item, idx) in contractDetails.attachments" :key="idx"
					@click="accessoryClick(item)">
					<u-icon name="file-text-fill" size="24" class="accessory-ico"></u-icon>
					<text class="text-hidden" style="width: 90%; display: inline-flex">{{
            item.attachName
          }}</text>
					<u-icon name="arrow-right" size="24" color="#dddddd" class="accessory-right-ico"></u-icon>
					<view style="font-size: 10px">{{ item.suffix }}</view>
				</view>
				<view class="popup-footer" style="justify-content: space-between; width: 100%">
					<view class="btns">
						<u-button class="btn-iem" type="error" text="删除" @click="deleteItem"
							v-if="contractDetails.deleteStatus"></u-button>
					</view>
					<view class="btns">
						<u-button class="btn-iem" type="primary" text="编辑" @click="compile"
							v-if="contractDetails.editStatus"></u-button>
					</view>
				</view>
			</view>
		</u-popup>
		<view type="primary" class="btn" @click="add" v-if="user.orgType == 5">新增上级安全量检查</view>
		<prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop>
	</view>
</template>

<script>
	import solarClender from "./solarClender.vue";
	import prviewPop from "../../components/prview-pop/prview-pop.vue";
	import moment from "moment";
	export default {
		components: { solarClender, prviewPop },
		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
			},
		},
		data() {
			return {
				inspectName: "",
				itemNameList: [],
				markDays: [],
				showPop: false,
				pickShow: false,
				materialList: [],
				identifying: false,
				inpDate: {
					beginTime: "",
					endTime: "",
					orderCode: "",
				},
				dateTime: new Date().toISOString().split("T")[0],
				caleType: 1,
				clickDate: "",
				list: [
					{ name: "全部", id: "" },
					{ name: "建设单位(业主方)", id: "2" },
					{ name: "监理公司", id: "3" },
					{ name: "施工单位", id: "4" },
					{ name: "其他", id: "5" },
				],
				nowTags: 0,
				itemShow: false,
				contractDetails: {},
				yearMonth: "",
				time: "",
				previewShow: false,
				previewUrl: ""
			};
		},
		mounted() {
			this.yearMonth = moment(Date.now()).format("YYYY-MM");
			this.init();
			this.searchOther();
		},
		methods: {
			itemClick(item) {
				this.$checkName(item.enclosureUrl);
				return;
				this.previewUrl = item.enclosureUrl;
				this.previewShow = true;
			},
			closePre() {
				this.previewShow = false;
			},
			resh() {
				this.init();
				this.searchOther();
			},
			clickInit(item) {

				this.identifying = false;
				// this.yearMonth = ""
				if (this.$refs.solarClender.choose != "") {
					this.yearMonth = "";
				} else {
					this.yearMonth = moment(item.date).format("YYYY-MM");
				}

				this.time = this.identifying ? this.dateTime : this.$refs.solarClender.choose;
				this.init();
			},
			change(y, m) {
				this.dateTime = "";
				this.yearMonth = `${y + "-" + m}`;
				this.identifying = true;
				// console.log()
				this.time = "";
				this.init();
				this.searchOther();
			},
			searchOther() {
				let data = { hierarchyType: 2, fkOrgId: uni.getStorageSync("nowOrgId"), yearMonth: this.yearMonth, time: this
						.time };
				this.$api.firstQualityAll(data).then(res => {
					if (res.code == 200) {
						this.yearList = [];
						this.markDays = res.data.allDate ? res.data.allDate : [];
						// this.markDays.push(new Date().toISOString().split('T')[0])
						res.data.allUser && res.data.allUser.forEach(element => {
							this.yearList.push({ label: element.userName, value: element.pkId });
						});
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			deleteItem() {
				uni.showLoading({ mask: true });
				this.$api
					.firstQualityDelete({ pkId: this.contractDetails.pkId })
					.then(res => {
						uni.hideLoading();
						if (res.code == 200) {
							this.init();
							this.searchOther();
							this.itemShow = false;
						} else {
							uni.showToast({ icon: "none", title: res.msg });
						}
					});
			},
			firstQualityById(pkId) {
				this.$api.firstQualityById({ pkId }).then(res => {
					if (res.code === 200) {
						this.contractDetails = res.data;
						this.itemShow = true;
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			listClick(row) {
				this.firstQualityById(row.pkId);
				console.log(row);
			},
			openPops() {
				this.itemShow = true;
			},
			closePops() {
				this.itemShow = false;
			},
			searchOk() {
				// this.pageNum = 1;
				this.init();
				this.closePop();
			},
			tagsClick(item, index, idx) {
				console.log(item);
				if (index == 1) {
					this.roleId = item.pkId;
					this.nowTags = idx;
				} else if (index == 2) {
					this.areaId = item.areaId;
					this.sendTags = idx;
				}
				this.receivingType = item.id;
			},
			scrollTolower() {
				// if (this.pageNum * 20 > this.total) {
				//   return;
				// }
				// this.pageNum = this.pageNum + 1;
				this.init();
			},

			// ====================
			openPop() {
				this.showPop = true;
			},
			closePop() {
				this.showPop = false;
				// this.inpDate={...this.searchDate}
			},
			// openPick() {
			//   this.pickShow = true;
			// },
			reset() {
				this.inpDate.beginTime = "";
				this.inpDate.endTime = "";
			},
			caleConfirm(e) {
				console.log(e);
				if (this.caleType === 1) {
					this.inpDate.beginTime = e.fulldate;
				} else if (this.caleType === 2) {
					this.inpDate.endTime = e.fulldate;
				}
			},
			openCale(type, date) {
				this.clickDate = date;
				this.caleType = type;
				// this.caleShow=true
				this.$refs.calendar.open();
			},
			pickConfirm(e) {
				console.log(e);
				this.pickCancel();
			},
			pickCancel() {
				this.pickShow = false;
			},
			init() {
				let data = {
					pageNum: 1,
					pageSize: 200,
					hierarchyType: 2,
					inspectType: this.list[this.nowTags].id,
					beginTime: this.inpDate.beginTime,
					time: this.identifying ? this.dateTime : this.$refs.solarClender.choose,
					endTime: this.inpDate.endTime,
					inspectName: this.inspectName,
					fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
					fkProjectBidId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowProId"),
					yearMonth: this.yearMonth
				};
				this.$api.firstQualitySearchPage(data).then(res => {
					if (res.code == 200) {
						this.itemNameList = res.data.records;
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			add() {
				let data = {
					type: 1,
					add: 1,
				};
				uni.navigateTo({
					url: "/pages/safety/addCheck?row=" + JSON.stringify(data),
				});
			},
			compile() {
				let data = this.contractDetails;
				data.type = 2;
				uni.navigateTo({
					url: "/pages/safety/addCheck?row=" + JSON.stringify(data),
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.search {
		//   position: fixed;
		//   /* #ifdef H5 */
		//   top: 176rpx;
		//   /* #endif */
		//   /* #ifdef APP-PLUS */
		//   top: 240rpx;
		//   /* #endif */
		//   //   top: 176rpx;
		margin-top: 4px;
		display: flex;
		align-items: center;
		width: 100%;
		height: 80rpx;
		padding: 0 32rpx;
		background-color: #fff;

		.left {
			display: flex;
			width: 530rpx;
			height: 60rpx;
			border: 1px solid rgba(180, 208, 240, 1);
			border-radius: 10rpx;

			.search-input {
				display: flex;
				align-items: center;
				flex: 1;
				height: 60rpx;
				padding-left: 8rpx;
			}

			.searchBtn {
				width: 120rpx;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 26rpx;
				text-align: center;
				color: #2a82e4;
			}

			.separator {
				line-height: 54rpx;
				color: rgba(180, 208, 240, 1);
			}
		}

		.right {
			margin-left: 20rpx;

			.screen {
				width: 140rpx;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 26rpx;
				text-align: center;
				color: #2a82e4;
				border: 1px solid rgba(180, 208, 240, 1);
				border-radius: 10rpx;
			}
		}
	}

	.popup {
		position: relative;
		width: 580rpx;
		height: 100%;
		padding: 30rpx;
		background-color: #f2f2f2;

		.popup-pad {
			/*#ifdef APP-PLUS*/
			height: 156rpx;
			/*#endif*/
			/*#ifdef H5*/
			height: 88rpx;
			/*#endif*/
		}

		.dates {
			display: flex;
			align-items: center;

			.dateInput {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 220rpx;
				height: 60rpx;
				font-size: 28rpx;
				background-color: #fff;
				border: 1px solid #000;
			}
		}

		.reset {
			margin-top: 12px;
			width: 120rpx;
			height: 40rpx;
			line-height: 40rpx;
			background-color: #1576e6;
			color: #fff;
			font-size: 26rpx;
			text-align: center;
			border-radius: 20rpx;
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

		.popup-content {
			display: flex;
			flex-wrap: wrap;
			padding-left: 20rpx;

			.tags {
				width: 200rpx;
				height: 72rpx;
				margin-right: 8rpx;
				margin-bottom: 12rpx;
				line-height: 72rpx;
				text-align: center;
				font-size: 26rpx;
				color: #a0a8b6;
				// border: 1px solid rgba(180, 208, 240, 1);
				background-color: #f6f6f6;
				border-radius: 72rpx;
			}

			.tags-click {
				color: #2a82e4;
				border: 1px solid #2a82e4;
				background-color: #e6f7ff;
			}
		}
	}

	.reset {
		width: 120rpx;
		height: 40rpx;
		line-height: 40rpx;
		background-color: #1576e6;
		color: #fff;
		font-size: 26rpx;
		text-align: center;
		border-radius: 20rpx;
	}

	.u-list {
		max-height: calc(100vh - 240px) !important;
	}

	.itemList {
		background: #fff;
		margin-top: 4px;
		padding: 6px;

		.item-bottom-text {
			padding: 2px 26px;
			font-size: 10px;
			color: #bbb;
		}

		.text-hidden {
			margin-left: 5px;
			overflow: hidden;
			/*超出部分隐藏*/
			white-space: nowrap;
			/*禁⽌换⾏*/
			text-overflow: ellipsis;
			/*省略号*/
		}
	}

	.item-edit {
		padding-bottom: 90rpx;

		.tem-edit-title {
			line-height: 80rpx;
			background: #2a82e4;
			color: #fff;
			text-indent: 2em;
		}

		.tem-edit-ico {
			position: absolute;
			right: 40rpx;
			top: 24rpx;
		}

		.item-edit-form {
			padding: 0 12rpx;
		}
	}

	.file-set-list {
		position: relative;
		line-height: 35px;
		border-bottom: 1px solid #eee;

		.file-set-lef {
			display: inline-block;
		}

		.file-set-right {
			position: absolute;
			right: 0;
			top: 8px;
		}
	}

	.popup-footer {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 660rpx;
		height: 80rpx;

		// background-color: rgb(194, 155, 155);
		.btns {
			//padding: 12rpx;
			flex: 1;

			.btn-iem {
				width: 95%;
			}
		}
	}

	.text-hidden {
		overflow: hidden;
		/*超出部分隐藏*/
		white-space: nowrap;
		/*禁⽌换⾏*/
		text-overflow: ellipsis;
		/*省略号*/
	}

	/deep/ .u-slide-right-enter-to,
	/deep/ .u-transition {
		// margin-top: 80px !important;
		/*#ifdef APP-PLUS*/
		margin-top: 80px !important;
		/*#endif*/
		/*#ifdef H5*/
		margin-top: 40px !important;
		/*#endif*/
	}
</style>