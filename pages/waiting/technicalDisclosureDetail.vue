<template>
	<view class="wrapper">
		<view class="content">
			<u-navbar leftText="技术交底" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
			<view class="bg"></view>
			<view class="sticky">
				<u-tabs :list="tabList" :current="current" @change="currentChange" :scrollable="false"
					:activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"></u-tabs>
			</view>
			<view class="pad"></view>
			<view class="detail" v-if="current === 0">
				<tableForm :emptyShow="false" :pageHeight="false" :pageMr="false" style="margin-bottom: 10rpx;" :list="[
				{name:'标段',value:showData.fkBidProjectName,show:true},
				{name:'交底名称',value:showData.disclosureName,show:true},
				{name:'交底方式',value:showData.receivingType == '1'?'会议交底':showData.receivingType == '2'?'书面交底':'会议书面交底',show:true},
				]">
				</tableForm>
				<tableForm :emptyShow="false" :pageHeight="false" :pageMr="false" style="margin-bottom: 10rpx;" :list="[
				{name:'交底单位',value:showData.fkOrgName,show:true},
				{name:'交底部门',value:showData.fkDeptName,show:true},
				{name:'交底人',value:showData.fkUserName,show:true},
				{name:'交底时间',value:showData.disclosureTime,show:true},
				]">
				</tableForm>
				<tableForm :emptyShow="false" :pageHeight="false" :pageMr="false" style="margin-bottom: 10rpx;" :list="[
				{name:'接收单位',value:showData.fkReceivingOrgName,show:true},
				{name:'接收部门',value:showData.fkReceivingDeptName,show:user.orgType != 7 && showData.disclosureType != 3},
				{name:'接收人',value:showData.fkReceivingUserName,show:true},
				{name:'接收时间',value:showData.receivingTime,show:true},
				]">
				</tableForm>
				<!-- <view class="detail-item">
		  <view class="card">
		    <view class="list-item">
		      <text>编号</text>
		      <text class="item">{{ showData.technicalCode }}</text>
		    </view>
			<view class="list-item">
		  	  <text>标段</text>
		  	  <text class="item">{{ showData.fkBidProjectName }}</text>
		    </view>
			<view class="list-item">
		  	  <text>交底名称</text>
		  	  <text class="item">{{ showData.disclosureName }}</text>
		    </view>
			
			<view class="list-item">
			  <text>交底方式</text>
			  <text class="item" v-if="showData.receivingType == '1'">会议交底</text>
			  <text class="item" v-if="showData.receivingType == '2'">书面交底</text>
			  <text class="item" v-if="showData.receivingType == '3'">会议书面交底</text>
			</view>
		  </view>
        </view> -->
				<!-- <view class="detail-item">
		  <view class="card">
		    <view class="list-item">
		      <text>交底单位</text>
		      <text class="item">{{ showData.fkOrgName }}</text>
		    </view>
			<view class="list-item">
			  <text>交底部门</text>
			  <text class="item">{{ showData.fkDeptName }}</text>
			</view>
			<view class="list-item">
			  <text>交底人</text>
			  <text class="item">{{ showData.fkUserName }}</text>
			</view>
			<view class="list-item">
			  <text>交底时间</text>
			  <text class="item">{{ showData.disclosureTime }}</text>
			</view>
		  </view>
        </view> -->
				<!-- <view class="detail-item">
		  <view class="card">
		    <view class="list-item">
		      <text>接收单位</text>
		      <text class="item">{{ showData.fkReceivingOrgName }}</text>
		    </view>
			<view class="list-item"  v-if="user.orgType != 7">
			  <text>接收部门</text>
			  <text class="item">{{ showData.fkReceivingDeptName }}</text>
			</view>
			<view class="list-item">
			  <text>接收人</text>
			  <text class="item">{{ showData.fkReceivingUserName }}</text>
			</view>
			<view class="list-item">
			  <text>接收时间</text>
			  <text class="item">{{ showData.receivingTime }}</text>
			</view>
		  </view>
          
        </view> -->
				<view class="detail-item">
					<view class="left"></view>
					<view class="right">
						<view class="file-item"  v-for="(item, idx) in showData.enclosures" :key="idx">
							<u-icon class="file-icon" :name="getFileTypes(item.enclosureUrl)" size="24"></u-icon>
							<view class="file-name">
								<view class="name text-hidden" @click="preview(item)">{{ item.enclosureName }}</view>
								<!-- <view class="date">2022-10-05</view> -->
							</view>
							<view class="file-downLoad" @click="downLoad(item.enclosureUrl)">下载</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="current === 1">
				<view class="record">
					<!-- <view
            class="record-item"
            v-for="(item, index) in dateList"
            :key="index"
          > -->
					<!-- <view class="record-item-title">{{ item }}</view> -->
					<view class="record-item">
						<view class="record-item-list" v-for="(item2, index2) in showData.copyVos" :key="index2">
							<u-avatar src=""></u-avatar>
							<view class="list-content">
								<view class="name mb-10">{{ item2.fkReceivingUserName }}</view>
								<view class="list-type">
									<text v-if="item2.receivingType == '1'">会议交底</text>
									<text v-if="item2.receivingType == '2'">书面交底</text>
									<text v-if="item2.receivingType == '3'">会议与书面交底</text>
								</view>
							</view>
							<view class="type">
								<text>{{item2.receiveStatusStr}}</text>
								<text @click="retractCopy(item2.pkId)" style="display: block;margin-top: 10px;color: #3c9cff;"
									v-if="item2.receiveStatus==1 || item2.receiveStatus==2">撤回</text>

							</view>
						</view>
					</view>
					<!-- </view> -->
				</view>
			</view>
		</view>
		<!-- <view class="footer">
      <view class="cancleBtn footer-btns" @click="cancel"> 取消 </view>
      <view class="copyBtn footer-btns" v-if="showData.isCopy ==1" @click="copy"> 抄送 </view>
    </view> -->
		<view class="box-btn">
			<u-button type="primary"
				v-if="showData.isWithdraw =='1'&&( $auth('production:technicalDisclosure:handle')  || $auth('projectManage:disclosure:withdraw'))"
				@click="withdraw"> 撤回</u-button>
			<u-button type="primary" v-if="
          showData.isCopy == 1 && $auth('production:technicalDisclosure:copy')
        " @click="copy">抄送</u-button>
			<u-button type="error" v-if="showData.isDelete == '1'" @click="deleteItem">删除</u-button>
			<u-button type="primary" v-if="showData.isUpdate == 1" @click="isEdit">编辑</u-button>
		</view>

		<u-popup :show="staffShow" mode="center" @close="closeStaff" :round="20">
			<view class="staff">
				<view class="staff-title">抄送部门</view>
				<view class="staff-content">
					<u-checkbox-group v-model="checked" iconPlacement="right" placement="column" @change="checkboxChange">
						<view class="staff-item" v-for="(item, index) in depList" :key="index">
							<view class="staff-item-dep">{{ item.deptName }}</view>
							<u-checkbox class="staff-item-list" v-for="(item2, index2) in item.users" :key="index2"
								:label="item2.userName" :name="item2.pkId"></u-checkbox>
						</view>
					</u-checkbox-group>
				</view>
				<view class="staff-footer">
					<view class="staff-btns staff-cancle" @click="closeStaff">取消</view>
					<view class="staff-btns staff-ok" @click="staffOk">确认</view>
				</view>
			</view>
		</u-popup>
		<prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop>
		<prviewVideo :src="video" :show="videoShow" @close="closePreview" ref="domVideo"></prviewVideo>
	</view>
</template>

<script>
	import prviewPop from "../../components/prview-pop/prview-pop.vue";
	import { getFileType } from "../../common/common";
	import tableForm from "../../components/table-form/table-form.vue";
	import prviewVideo from "../../components/ls-dom-video/ls-dom-video.vue";
	export default {
		components: { prviewPop, tableForm, prviewVideo },
		// import prviewPop from '../../components/prview-pop/prview-pop.vue';
		data() {
			return {
				videoShow: false,
				appShow: true,
				tabList: [{ name: "交底详情" }, { name: "抄送记录" }],
				current: 0,
				dateList: ["2022-10-01", "2022-10-05", "未接收"],
				recordList: [
					{ date: "2022-10-01", name: "我", code: 0 },
					{ date: "2022-10-05", name: "张三", code: 1 },
					{ date: "2022-10-05", name: "李四", code: 2 },
					{ date: "2022-10-05", name: "李四", code: 1 },
				],
				staffShow: false,
				depList: [],
				checked: [],
				rowData: {},
				showData: {
					enclosures: [],
					copyVos: [],
				},
				previewShow: false,
				previewUrl: "",
				video:""
			};
		},
		onLoad(item) {
			this.rowData = JSON.parse(item.row);
			this.technicalDisclosure(this.rowData.pkId);
			this.deptListById();
		},
		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
			},
		},
		methods: {
			closePreview() {
				this.videoShow = false;
				this.video = "";
			},
			getFileTypes(url) {
				let type = getFileType(url);
				if (type === "image") {
					return "photo";
				} else if (type === "excel") {
					return "../../static/fileImg/file-excel.png";
				} else if (type === "word") {
					return "../../static/fileImg/word.png";
				} else if (type === "pdf") {
					return "../../static/fileImg/PDF.png";
				} else {
					return "../../static/fileImg/file-text.png";
				}
			},
			preview(item) {
				let src = item.enclosureUrl;
				let exit = src.split(".");
				exit = exit.pop();
				let noimgType = ["avi", "wmv", "mpg", "mpeg", "mov", "rm", "ram", "swf", "flv", "mp4", "wma", "rm", "rmvb",
					"flv", "mpg", "mkv"
				];
				if (noimgType.includes(exit)) {
					this.video = item.enclosureUrl;
					this.videoShow = true;
					return console.log("视频");
					let domVideo = this.$refs.domVideo;
					domVideo.play();
				}
				console.log(item);
				this.$checkName(item.enclosureUrl);
				return;
				this.previewUrl = item.enclosureUrl;
				this.previewShow = true;
			},
			closePre() {
				this.previewShow = false;
			},
			isEdit() {
				let data = {
					type: 2,
					...this.showData
				};
				uni.navigateTo({
					url: "/pages/production/addTechnicalDisclosure?row=" +
						JSON.stringify(data),
				});
			},
			withdraw() {
				uni.showModal({
					title: "提示",
					content: "确定撤回该交底?？",
					showCancel: true,
					success: ({ confirm, cancel }) => {
						if (confirm) {
							let api = [5, 6, 7].includes(this.user.orgType) ? this.$api.updateEnableStatus : this.$api
								.updateEnableStatus2;
							api({ enableStatus: 2, pkId: this.rowData.pkId })
								.then(res => {
									if (res.code == 200) {
										uni.showToast({
											icon: "success",
											title: "撤回成功",
										});
										let pages = getCurrentPages();
										let prevPage = pages[pages.length - 2]; // 上一页面实例
										prevPage.$vm.resh(); // 调用上一页 定义的方法
										uni.navigateBack(1);
									} else {
										uni.showToast({
											icon: "none",
											title: res.msg,
										});
									}
								});
						} else if (cancel) {
							// console.log('用户点击取消');
						}
					},
				});
			},
			deleteItem() {
				uni.showModal({
					title: "提示",
					content: "确定删除该交底?？",
					showCancel: true,
					success: ({ confirm, cancel }) => {
						if (confirm) {
							let api = [5, 6, 7].includes(this.user.orgType) ? this.$api.prodTechnicalDisclosureDelete : this.$api
								.delProjectTechnicalDisclosure;
							api({ pkId: this.rowData.pkId })
								.then(res => {
									if (res.code == 200) {
										uni.showToast({
											icon: "success",
											title: "删除成功",
										});
										setTimeout(() => {
											let pages = getCurrentPages();
											let prevPage = pages[pages.length - 2]; // 上一页面实例
											prevPage.$vm.resh(); // 调用上一页 定义的方法
											uni.navigateBack(1);
										}, 500);
									} else {
										uni.showToast({
											icon: "none",
											title: res.msg,
										});
									}
								});
						} else if (cancel) {
							// console.log('用户点击取消');
						}
					},
				});
			},
			retractCopy(pkId) {
				uni.showModal({
					title: "提示",
					content: "确定撤回该记录？",
					showCancel: true,
					success: ({ confirm, cancel }) => {
						if (confirm) {
							let api = [5, 6, 7].includes(this.user.orgType) ? this.$api.retractCopy : this.$api.retractCopy2;
							api.retractCopy({ copyIds: [pkId] })
								.then(res => {
									if (res.code == 200) {
										uni.showToast({
											icon: "success",
											title: "撤回成功",
										});
										setTimeout(() => {
											let pages = getCurrentPages();
											let prevPage = pages[pages.length - 2]; // 上一页面实例
											prevPage.$vm.resh(); // 调用上一页 定义的方法
											uni.navigateBack(1);
										}, 500);
									} else {
										uni.showToast({
											icon: "none",
											title: res.msg,
										});
									}
								});
						} else if (cancel) {
							// console.log('用户点击取消');
						}
					},
				});
			},
			// 获取抄送部门信息
			deptListById() {
				this.$api.deptListById({ pkId: this.rowData.pkId }).then(res => {
					if (res.code == 200) {
						this.depList = res.data;
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			// 根据ID查询技术交底
			technicalDisclosure(id) {
				let api = [5, 6, 7].includes(this.user.orgType) ? this.$api.technicalDisclosure : this.$api.findDisclosureById;
				api({ pkId: id }).then(res => {
					if (res.code == 200) {
						this.showData = res.data;
						console.log(this.showData.enclosures);
						if (res.data.fkParentId == "0" && res.data.copyVos != null) {
							this.tabList[1].disabled = false;
						} else {
							this.tabList[1].disabled = true;
						}
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			currentChange(item) {
				this.current = item.index;
				console.log("vvvvvvvvvvvvvvvvvvvvvvv");
				console.log(item);
				console.log("vvvvvvvvvvvvvvvvvvvvvvv");
			},
			downLoad(enclosureUrl) {
				const downLoadTask = uni.downloadFile({
					url: enclosureUrl, //仅为示例，并非真实的资源
					success: res => {
						if (res.statusCode === 200) {
							console.log("下载成功", res);
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: function(res2) {
									// var savedFilePath = res.savedFilePath;
									console.log(res2);
									uni.showToast({
										title: "以保存至" + res2.savedFilePath,
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
				// downLoadTask.onProgressUpdate((res) => {
				//   console.log("下载进度" + res.progress);
				//   console.log("已经下载的数据长度" + res.totalBytesWritten);
				//   console.log("预期需要下载的数据总长度" + res.totalBytesExpectedToWrite);
				// });
			},
			cancel() {
				uni.navigateBack({
					delta: 1,
				});
			},
			copy() {
				this.staffShow = true;
			},
			closeStaff() {
				this.staffShow = false;
				this.checked = [];
			},
			checkboxChange(e) {
				console.log(e);
			},
			// 抄送
			staffOk() {
				let data = {
					pkId: this.rowData.pkId,
					userIds: this.checked,
				};
				uni.showLoading({ mask: true });
				let api = [5, 6, 7].includes(this.user.orgType) ? this.$api.carbonCopy : this.$api.carbonCopy2;
				api(data).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						uni.showToast({ icon: "success", title: "抄送成功" });
						this.closeStaff();
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.wrapper {
		padding-bottom: 80rpx;
	}

	.bg {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
		background-color: #f7f7ff;
	}

	.detail {
		font-size: 28rpx;

		.detail-item {
			display: flex;
			background-color: #fff;
			margin-bottom: 10rpx;

			.card {
				background: #fff;
				width: 750rpx;
				// height: calc( 1306rpx - 242rpx);
				// border-left: 8rpx solid #dddddd;
				// padding: 24rpx 40rpx;
				margin-top: 2rpx;

				.list-item {
					height: 80rpx;
					line-height: 80rpx;
					font-size: 28rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					border-bottom: 1px solid rgba(238, 238, 238, 1);

					&:first-child {
						border-top: 1px solid rgba(238, 238, 238, 1);
					}

					text:first-child {
						display: inline-block;
						min-width: 196rpx;
						height: 80rpx;
						line-height: 80rpx;
						padding: 0 40rpx;
						border-right: 1px solid rgba(238, 238, 238, 1);
						text-align: justify;
						text-justify: distribute-all-lines;
						text-align-last: justify;
					}

					.item {
						display: inline-block;
						// width: 414rpx;
						padding-left: 10rpx;
						color: #79859a;
					}
				}
			}

			.left {
				width: 8rpx;
			}

			.right {
				flex: 1;
				padding: 20rpx;
			}

			.file-item {
				display: flex;
				align-items: center;
				height: 80rpx;
				border-bottom: 1px solid #f1f1f1;

				.file-icon {
					width: 60rpx;
				}

				.file-name {
					width: 590rpx;

					.name {
						width: 580rpx;
						// margin-bottom: 14rpx;
					}

					.date {
						font-size: 24rpx;
						color: #a0a8b6;
					}
				}

				.file-downLoad {
					width: 56rpx;
					height: 80rpx;
					line-height: 80rpx;
				}
			}
		}
	}

	.record-item {
		.record-item-title {
			width: 160rpx;
			height: 40rpx;
			margin: 10rpx 0;
			line-height: 40rpx;
			font-size: 24rpx;
			text-align: center;
			background-color: #eeeeee;
		}

		.record-item-list {
			display: flex;
			align-items: center;
			height: 160rpx;
			padding: 24rpx;
			margin: 8rpx;
			background-color: #fff;

			.list-content {
				width: 520rpx;
				padding: 0 20rpx;
			}

			.list-type {
				color: #72809a;
				font-size: 24rpx;
			}

			.type {
				width: 100rpx;
				color: #72809a;
				font-size: 26rpx;
				text-align: center;
			}
		}
	}

	.text-hidden {
		width: 580rpx;
		line-height: 20px;
		overflow: hidden;
		/*超出部分隐藏*/
		white-space: nowrap;
		/*禁⽌换⾏*/
		text-overflow: ellipsis;
		/*省略号*/
	}

	.mb-10 {
		margin-bottom: 10rpx;
	}

	.bgc1 {
		background-color: #2a82e4;
	}

	.bgc2 {
		background-color: #38c4d6;
	}

	.bgc3 {
		background-color: #46c782;
	}

	.footer {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 750rpx;
		height: 120rpx;

		.footer-btns {
			width: 375rpx;
			height: 120rpx;
			line-height: 120rpx;
			text-align: center;
		}

		.cancleBtn {
			background-color: #eeeeee;
			color: #aaaaaa;
		}

		.copyBtn {
			background-color: #1576e6;
			color: #fff;
		}
	}

	.staff {
		position: relative;
		// overflow: auto;
		width: 560rpx;
		height: 800rpx;
		border-radius: 20rpx;
		background-color: #f2f2f2;

		.staff-title {
			height: 80rpx;
			line-height: 80rpx;
			padding-left: 20rpx;
			font-size: 28rpx;
		}

		.staff-content {
			overflow: auto;
			height: 640rpx;
			padding-bottom: 10rpx;

			.staff-item {
				.staff-item-dep {
					height: 60rpx;
					line-height: 60rpx;
					padding-left: 20rpx;
					background-color: #d7d7d7;
					font-size: 28rpx;
				}

				.staff-item-list {
					display: flex;
					align-items: center;
					height: 60rpx;
					line-height: 60rpx;
					padding: 0 20rpx;
					background-color: #fff;
					border-bottom: 1px solid #d7d7d7;

					&:nth-last-child(1) {
						border-bottom: none;
					}
				}

				.userName {
					padding-left: 20rpx;
					font-size: 26rpx;
				}
			}
		}

		.staff-footer {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			height: 80rpx;

			.staff-btns {
				width: 50%;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
			}

			.staff-cancle {
				background-color: #fff;
				border-radius: 0 0 0 10rpx;
			}

			.staff-ok {
				color: #fff;
				background-color: #1576e6;
				border-radius: 0 0 10rpx 0;
			}
		}
	}

	.pad {
		padding-top: 98rpx;
	}

	.box-btn {
		display: flex;
		position: fixed;
		width: 100%;
		bottom: 0;
		z-index: 99;
	}
</style>