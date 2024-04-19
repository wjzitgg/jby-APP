<template>
	<view class="wrapper">
		<u-navbar leftText="技术交底" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="content">
			<view style="background: #fff" v-if="user.orgType == 5 || user.orgType == 4">
				<u-tabs class="tabs" :list="list1" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}"
					:inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"> </u-tabs>
			</view>
			<proSel @change="proChange"></proSel>
			<view class="search">
				<view class="left">
					<view class="search-input"><u-input border="none" placeholder="请输入交底名称" v-model="disclosureName"
							maxlength="50"> </u-input></view>
					<view class="separator">|</view>
					<view class="searchBtn" @click="init">搜索</view>
				</view>
				<view class="right">
					<filterBtn @click="openPop" :nums="searchTag.length"></filterBtn>
					<!-- <view class="screen" @click="openPop">筛选</view> -->
				</view>
			</view>
			<!-- : $auth('production:technicalDisclosure:add') -->
			<view :class="{ 'content-box':true }">
				<view class="content-list" v-for="(item, idx) in details" :key="idx" @click="listLick(item)">
					<view class="">
						<u-icon name="../../static/fileImg/file-text.png" size="20" style="display: inline-block"></u-icon>
						<text class="contract-name">{{ item.disclosureName }}</text>
					</view>
					<!--   <view class="contract-amount">
            交底编号:{{ item.technicalCode }}
          </view> -->
					<view class="contract-amount">
						交底方式：{{ item.receivingTypeName }}
					</view>
					<view class="contract-amount">
						交底指定方：{{ item.fkOrgName }}>{{ item.fkDeptName }}>{{ item.fkUserName }}
					</view>
					<view class="contract-amount">
						接收指定方：{{ item.fkReceivingOrgName }}>{{ item.fkReceivingDeptName }}>{{ item.fkReceivingUserName }}
					</view>
					<view class="contract-amount">
						交底时间：{{ item.disclosureTime }}
					</view>
					<view class="contract-status-normal" v-if="item.enableStatusName == '已接收'">
						{{ item.enableStatusName }}
					</view>
					<view v-else class="contract-status-suspend" :class="{orgColor:item.enableStatusName == '待接收'}">
						{{ item.enableStatusName }}
					</view>
				</view>
			</view>
		</view>
		<!--  v-if="$auth('production:technicalDisclosure:add')" -->
		<view type="primary" class="btn" @click="add">新增交底</view>
		<u-popup :show="popShow" mode="right" @close="closePop" @open="openPop" class="pop-bgImg"
			bgColor="rgba(255, 255, 255, 0)">
			<view class="popup">
				<view class="tip">请选择筛选条件</view>
				<view class="popup-content">
					<view class="filter-title">交底方式</view>
					<view class="filter-content">
						<view class="tags" :class="{ 'tags-click': nowTags === index }" v-for="(item, index) in wayList"
							:key="index" @click="tagsClick(item, 1, index)">{{ item.name }}</view>
					</view>
					<view class="filter-title">交底/接收时间:</view>
					<view class="filter-content">
						<view class="dates">
							<view class="dateInput" @click="openCale(1, inpDate.beginTime)">
								{{inpDate.beginTime}}
							</view>
							<view>至</view>
							<view class="dateInput" @click="openCale(2, inpDate.endTime)">
								{{inpDate.endTime}}
							</view>
						</view>
						<view class="reset" @click="reset">重置</view>
					</view>
				</view>
			</view>
			<view class="pop-footer-btn">
				<view class="btns btnReset" @click="closePop">取消</view>
				<view class="btns btnOk" @click="popOk">确定</view>
			</view>
			<uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" />
			<u-picker :show="pickShow" :columns="[materialList]" @confirm="pickConfirm" keyName="orgName"
				@cancel="pickCancel"></u-picker>
		</u-popup>

		<!-- 技术交底弹框 -->
		<u-modal :show="technicalDisclosureModel" title="技术交底确认" :content="technicalDisclosureContent" @confirm="confirm"
			@cancel="cancel" showCancelButton></u-modal>
	</view>
</template>

<script>
	import filterBtn from "../../components/search-tag/filter-btn.vue";
	import searchTag from "../../components/search-tag/search-tag.vue";
	import proSel from "./compoments/proSel.vue";
	export default {
		components: { filterBtn, searchTag, proSel },
		data() {
			return {
				list1: [{ name: "交底发送" }, { name: "交底接收" }],
				current: 0,
				receivingType: "",
				details: [],
				disclosureName: "",
				wayList: [
					{ name: "全部", id: "" },
					{ name: "会议交底", id: "1" },
					{ name: "书面交底", id: "2" },
					{ name: "会议与书面交底", id: "3" },
				],
				inpDate: {
					beginTime: "",
					endTime: "",
					orderCode: ""
				},
				materialName: "",
				rowData: {},
				popShow: false,
				roleList: [],
				areaIdList: [],
				nowTags: 0,
				caleType: 1,
				clickDate: "",
				pickShow: false,
				materialList: [],
				contractList: [
					{ name: "安全施工", status: 0 },
					{ name: "安全施工", status: 0 },
					{ name: "安全施工", status: 0 },
					{ name: "安全施工", status: 0 },
					{ name: "安全施工", status: 0 },
					{ name: "安全施工", status: 0 },
					{ name: "安全施工", status: 0 },
					{ name: "安全施工", status: 0 },
					{ name: "安全施工", status: 0 },
					{ name: "安全施工", status: 0 },
					{ name: "安全施工", status: 0 },
				],
				technicalDisclosureContent: "xxx单位发送过来的xxx技术交底文件，您是否接收并查看",
				technicalDisclosureModel: false,
				nowClickRow: {},
				fkReceivingOrgId: "",
				fkReceivingName: "",
				searchTag: [],
				fkProjectId: "",
				fkBidProjectId: "",
			};
		},
		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
			},
		},
		onLoad() {
			// this.rowData = JSON.parse(item.row);
			if (this.user.orgType == 7) {
				this.current = 1;
			} else {}
			this.init();
		},
		methods: {
			proChange(e) {
				this.fkProjectId = e.projectId;
				this.fkBidProjectId = e.projectBidId;
				this.init();
			},
			closeTag(row) {
				console.log(row);
				this.pageNum = 1;
				if (row.key == "roleId") {
					this.nowTags = 0;
					this.roleId = "";
					this.materialName = "";
				} else {
					this.inpDate[row.key] = "";
				}
				this.setTagList();
				this.init();
			},
			setTagList() {
				let arr = [];
				if (this.inpDate.beginTime) {
					arr.push({ key: "beginTime", value: this.inpDate.beginTime });
				}
				if (this.inpDate.endTime) {
					arr.push({ key: "endTime", value: this.inpDate.endTime });
				}
				if (this.nowTags) {
					let obj = this.wayList[this.nowTags];
					arr.push({ key: "roleId", value: obj.name });
				}
				console.log(arr);
				this.searchTag = arr;
			},
			resh() {
				this.init();
			},
			init() {
				let data = {
					disclosureType: this.current + 1,
					receivingType: this.receivingType,
					disclosureName: this.disclosureName,
					beginTime: this.inpDate.beginTime,
					endTime: this.inpDate.endTime,
					// fkOrgId: this.user.orgType == 4 ? uni.getStorageSync('nowOrgId') : "",
					fkReceivingOrgId: this.fkReceivingOrgId,
					fkProjectId: this.fkProjectId,
					fkBidProjectId: this.fkBidProjectId,
				};
				this.$api
					.searchProjectTechnicalDisclosure(data)
					.then(res => {
						if (res.code == 200) {
							this.details = res.data;
						} else {
							uni.showToast({ icon: "none", title: res.msg });
						}
					});
			},
			currentChange(item) {
				console.log(item);
				this.current = item.index;
				this.init();
			},
			confirm() {
				let data = {
					pkId: this.nowClickRow.pkId,
					enableStatus: 1
				};
				this.$api.updateEnableStatus2(data).then(res => {
					if (res.code == 200) {
						this.init();
						uni.navigateTo({
							url: "/pages/waiting/technicalDisclosureDetail?row=" +
								JSON.stringify(this.nowClickRow),
						});
						this.cancel();
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
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
			// ====================================
			add() {
				let data = { ...this.nowClickRow, type: 1 };
				uni.navigateTo({
					url: "/pages/production/addTechnicalDisclosure?row=" +
						JSON.stringify(data),
				});
			},

			listLick(row) {

				this.nowClickRow = row;
				if(row.enableStatus==2&&row.isReceive == 0){
        		  uni.showToast({title:"接收人未接收文件，您无权查看详情"})
        		  return 
        		}
				if (row.isReceive == 1) {
          this.technicalDisclosureContent=`${row.fkOrgName}单位发送过来的${disclosureName}技术交底文件，您是否接收并查看`
					this.technicalDisclosureModel = true;
					return;
				}
				// if () {
				uni.navigateTo({
					url: "/pages/waiting/technicalDisclosureDetail?row=" +
						JSON.stringify(this.nowClickRow),
				});
				this.cancel();
				// } 

			},
			cancel() {
				this.technicalDisclosureModel = false;
			},

			reset() {
				this.inpDate.beginTime = "";
				this.inpDate.endTime = "";
			},
			openPick() {
				this.pickShow = true;
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
			pickConfirm(e) {
				console.log(e);
				// fkReceivingOrgId:"",
				// fkReceivingName:""
				if (e.value[0] == undefined) {
					return this.pickCancel();
				}
				this.fkReceivingName = e.value[0].orgName;
				this.fkReceivingOrgId = e.value[0].pkId;
				this.pickCancel();
			},
			pickCancel() {
				this.pickShow = false;
			},
			openPop() {
				this.popShow = true;
			},
			popOk() {
				// this.pageNum = 1;
				this.setTagList();
				this.init();
				this.closePop();
			},
			closePop() {
				this.popShow = false;
				this.itemShow = false;
			},
			// 下载
			downLoad(url) {
				const downLoadTask = uni.downloadFile({
					url: url, //仅为示例，并非真实的资源
					success: res => {
						if (res.statusCode === 200) {
							console.log("下载成功", res);
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: function(res2) {
									// var savedFilePath = res.savedFilePath;
									console.log(res2);
									uni.showToast({
										title: "已保存至" + res2.savedFilePath,
									});
									setTimeout(() => {
										uni.openDocument({
											filePath: res2.savedFilePath,
											success: result => {},
										});
									}, 1000);
								},
							});
						}
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.tabs {
		/deep/ .u-tabs__wrapper__nav__item {
			flex: 1;
		}
	}

	.search {
		//   position: fixed;
		//   /* #ifdef H5 */
		//   top: 176rpx;
		//   /* #endif */
		//   /* #ifdef APP-PLUS */
		//   top: 240rpx;
		//   /* #endif */
		//   //   top: 176rpx;
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

	.content-box {

		margin-bottom: 70px;
		// max-height: calc(100vh - 210px);
		overflow: auto;
	}

	// .popup {
	//   // position: relative;
	//   width: 660rpx;
	//   /*#ifdef APP-PLUS*/
	//   height: calc(100vh - 156rpx);
	//   /*#endif*/
	//   /*#ifdef H5*/
	//   height: calc(100vh - 88rpx);
	//   /*#endif*/
	//   /*#ifdef APP-PLUS*/
	//   margin-top: 156rpx;
	//   /*#endif*/
	//   /*#ifdef H5*/
	//   margin-top: 88rpx;
	//   /*#endif*/
	//   background-color: #fff;

	//   .popup-title {
	//     height: 80rpx;
	//     line-height: 80rpx;
	//     margin-bottom: 20rpx;
	//     padding-left: 20rpx;
	//   }

	//   .popup-content {
	//     display: flex;
	//     flex-wrap: wrap;
	//     padding-left: 20rpx;

	//     .tags {
	//       width: 200rpx;
	//       height: 72rpx;
	//       margin-right: 8rpx;
	//       margin-bottom: 12rpx;
	//       line-height: 72rpx;
	//       text-align: center;
	//       font-size: 26rpx;
	//       color: #a0a8b6;
	//       // border: 1px solid rgba(180, 208, 240, 1);
	//       background-color: #f6f6f6;
	//       border-radius: 72rpx;
	//     }

	//     .tags-click {
	//       color: #2a82e4;
	//       border: 1px solid #2a82e4;
	//       background-color: #e6f7ff;
	//     }
	//   }

	//   .popup-footer {
	//     position: fixed;
	//     bottom: 0;
	//     display: flex;
	//     width: 660rpx;
	//     height: 80rpx;

	//     // background-color: rgb(194, 155, 155);
	//     .btns {
	//       //padding: 12rpx;
	//       flex: 1;

	//       .btn-iem {
	//         width: 95%;
	//       }
	//     }
	//   }
	// }

	.dates {
		display: flex;
		align-items: center;

		.dateInput {
			display: flex;
			// justify-content: center;
			align-items: center;
			width: 220rpx;
			height: 60rpx;
			font-size: 28rpx;
			background-color: #fff;
			border: 1px solid #b4d0f0;
			border-radius: 6rpx;
		}
	}

	.select {
		display: flex;
		border: 1px solid;
		justify-content: space-between;
		align-items: center;
		height: 60rpx;
		padding: 0 20rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
	}

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

	.reset {
		// width: 120rpx;
		// height: 40rpx;
		// line-height: 40rpx;
		// background-color: #1576e6;
		// color: #fff;
		// font-size: 26rpx;
		// text-align: center;
		// border-radius: 20rpx;
		width: 57px;
		/* height: 20px; */
		margin-left: 2px;
		margin-top: 6rpx;
		line-height: 28px;
		/* line-height: 1; */
		background-color: #1576e6;
		color: #fff;
		font-size: 13px;
		text-align: center;
	}

	.content-list {
		position: relative;
		margin-top: 4px;
		padding: 20rpx;
		background: #fff;

		.contract-name {
			margin-left: 13px;
			font-weight: 700;
			font-size: 28rpx;
		}

		.contract-amount {
			margin-left: 36px;
			line-height: 40rpx;
			font-size: 10px;
			color: #bbb;
			overflow: hidden;
			/*超出部分隐藏*/
			white-space: nowrap;
			/*禁⽌换⾏*/
			text-overflow: ellipsis;
			/*省略号*/
		}

		.contract-status-normal {
			position: absolute;
			right: 38rpx;
			top: 30rpx;
			font-size: 26rpx;
			padding: 8rpx 14rpx;
			background: #d1fff1;
			border-radius: 10rpx;
			color: #3db994;
		}

		.contract-status-suspend {
			position: absolute;
			right: 38rpx;
			top: 30rpx;
			font-size: 26rpx;
			padding: 8rpx 14rpx;
			background: #eeeeee;
			border-radius: 10rpx;
			color: #b8b8b8;
		}

		.orgColor {
			background: #ffe9d1;
			color: #ff9f3f;
		}
	}
</style>