<template>
	<view class="wrapper">
		<u-navbar leftText="审批信息" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="bg"></view>
		<view class="pad"></view>
		<view class="sticky">
			<u-tabs :list="tabList" :current="current" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}"
				:inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}">
				<view slot="right" class="hamburg" @tap="hamburg"><u-icon name="list" size="21" bold></u-icon></view>
			</u-tabs>
			<view class="pull-down" v-show="tabShow">
				<text class="item-tab" :class="index == current ? 'action' : ''" v-for="(item, index) in tabList" :key="index"
					@click="listSelet(item, index)">{{ item.name }}</text>
				<!-- 箭头 -->
				<u-icon name="arrow-up" color="#dddddd" size="20" class="arrow-up" @click="shut"></u-icon>
			</view>
		</view>
		<view v-show="idx === 0" class="detail">
			<view class="detail-item">
				<!-- <view class="left bgc1"></view> -->
				<view class="right">
					<view class="mb-20">
						<text class="fw-700">处理结果：</text>
						<text class="detail-color">
							{{showData.approveStatusStr}}
						</text>
					</view>
					<view class="mb-20"><text class="fw-700">处理岗位：</text><text class="detail-color">{{
              showData.roleName
            }}</text></view>
					<view class="mb-20"><text class="fw-700">处理人：</text><text class="detail-color">{{ showData.approver }}</text>
					</view>
					<view class="mb-20"><text class="fw-700">处理时间：</text><text
							class="detail-color">{{ showData.approveTime }}</text></view>
					<view class="mb-20">
						<text class="fw-700">处理意见：</text>
						<text class="detail-color">{{ showData.approveComment }}</text>
					</view>
					<view class="mb-20">
						<text class="fw-700">工程评分：</text>
						<text class="detail-color">{{ ['不合格', '合格', '良好'][this.showData.checkResult] }}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-show="idx === 1">
			<!-- @sendGzipTableHtml='sendGzipTableHtml' -->
			<processForm :tableData="workflowTableList" :disabled="true" :tableIndex="tableIndex" ref="processForm">
			</processForm>
		</view>
		<!-- 工程量 -->
		<view class="" v-show="idx == 2">
			<!-- 表格 -->
			<uni-table border emptyText="暂无更多数据">
				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="center">项目编号</uni-th>
					<uni-th align="center">项目名称</uni-th>
					<uni-th align="center">设计工程量</uni-th>
					<uni-th align="center">单位</uni-th>
					<uni-th align="center">完成工程量</uni-th>
					<uni-th align="center">备注</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="(item, index) in showData.prodItemList" :key="index">
					<uni-td align="center">{{ item.itemCode }}</uni-td>
					<uni-td align="center">{{ item.itemName }}</uni-td>
					<uni-td align="center">{{ item.designQuantities }}</uni-td>
					<uni-td align="center">{{ item.unitName }}</uni-td>
					<uni-td align="center">{{item.completeQuantities}}</u--input>
					</uni-td>
					<uni-td align="center">{{item.remark}}</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		<!-- 材料用量 -->
		<view class="" v-show="idx == 3">
			<!-- 表格 -->
			<uni-table border emptyText="暂无更多数据">
				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="center" width="70">物资名称</uni-th>
					<uni-th align="center" width="70">物资类别</uni-th>
					<uni-th align="center" width="80">扣款方式</uni-th>
					<uni-th align="center" width="50">单位</uni-th>
					<uni-th align="center" width="80">设计使用量</uni-th>
					<uni-th align="center" width="80">实际使用量</uni-th>
					<uni-th align="center" width="80">备注</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="(item, index) in showData.materialItemList" :key="index">
					<uni-td align="center">{{ item.materialName }}</uni-td>
					<uni-td align="center">{{ item.typeName }}</uni-td>
					<uni-td align="center">定量供应，超额扣款</uni-td>
					<uni-td align="center">{{ item.materialUnitName }}</uni-td>
					<uni-td align="center">{{ item.materiaDesignQuantities }}</uni-td>
					<uni-td align="center">{{item.actualUsage}}</uni-td>
					<uni-td align="center">{{item.materialRemark}}</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		<view v-show="idx === 4">
			<view class="fileList">
				<view class="fileList-item" v-for="(item2, index2) in fileList" :key="index2">
					<u-icon class="file-icon" name="file-text" size="28"></u-icon>
					<view class="file-name text-hidden" @click="preview(item2)">{{ item2.fileName }}</view>
					<!-- <view class="downLoad" @click="downLoad(item2.fileUrl)">下载</view> -->
				</view>
			</view>
		</view>
		<u-popup :show="previewShow" mode="center" round="10" closeable @close="closePreview">
			<view class="preview">
				<view class="preview-top">预览</view>
				<pdf :fileUrl="previewUrl" :iframeStyle="{ width: '700rpx', height: '1080rpx' }" :imgs="false"></pdf>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import pdf from "../../components/pdf-preview.vue";
	import processForm from "../../components/process-form/process-form.vue";
	export default {
		components: { processForm, pdf },
		data() {
			return {
				tabList: [
					{ name: "基本信息", idx: 0 },
					// { name: "工程量", idx: 2 },
					// { name: "材料用量", idx: 3 },
					{ name: "附件", idx: 4 },
				],
				current: 0,
				tableIndex: 0,
				workflowTableList: [],
				tabShow: false,
				idx: 0,
				fileList: [],
				showData: {},
				previewShow: false,
				previewUrl: ""
			};
		},
		onLoad(options) {
			console.log(options);
			let obj = options.data ? JSON.parse(options.data) : {};
			this.searchByBusinessNode(obj.flowCaseId, obj.currentNodeId, obj.taskId);
		},
		methods: {
			setTabs() {
				if (this.showData.quantitiesTable && this.showData.quantitiesTable != 0) {
					this.tabList.splice(1, 0, { name: "工程量", idx: 2 });
				}
				if (this.showData.materialUsedTable && this.showData.materialUsedTable != 0) {
					let idx = this.showData.materialUsedTable != 0 ? 2 : 1;
					this.tabList.splice(idx, 0, { name: "材料用量", idx: 3 });
				}
			},
			currentChange(item) {
				console.log(item);
				this.current = item.index;
				this.idx = item.idx;
				if (item.idx === 1) {
					this.tableIndex = item.tableInd;
				}
			},
			searchByBusinessNode(flowCaseId, nodeId, taskId) {
				let data = { flowCaseId, nodeId, taskId };
				uni.showLoading({ mask: true });
				this.$api.searchByBusinessNode(data).then(res => {
					uni.hideLoading();
					if (res.code === 200) {
						this.showData = res.data.prodProcessApproveVo;
						this.setTabs();
						this.fileList = this.showData.fileList;
						let arr = JSON.stringify(this.showData.workflowTableList);
						this.workflowTableList = JSON.parse(arr);
						if (this.workflowTableList.length) {
							let tableArr = this.workflowTableList.map((item, index) => ({
								name: item.tableName,
								idx: 1,
								tableInd: index,
							}));
							this.tabList.splice(1, 0, ...tableArr);
						}
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				}).catch(err => {
					uni.hideLoading();
				});
			},
			// tab点击
			listSelet(item, index) {
				// 展开传值
				if (index !== undefined) {
					this.current = index;
				} else {
					this.current = item.index;
				}
				this.tabShow = false;
				this.idx = item.idx;
				if (item.idx === 0) {
					this.tableIndex = item.tableInd;
				}
			},
			// 汉堡点击展开tabs
			hamburg() {
				this.tabShow = !this.tabShow;
			},
			shut() {
				this.tabShow = false;
			},
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
			preview(item) {
				this.$checkName(item.fileUrl);
				return;
				this.previewUrl = item.fileUrl;
				this.previewShow = true;
			},
			closePreview() {
				this.previewShow = false;
				this.previewUrl = "";
			},
		},
	};
</script>

<style lang="scss" scoped>
	.pad {
		padding-top: 98rpx;
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

	.hamburg {
		padding-left: 4rpx;
		border-left: 1px solid #d5d0d0;
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

	.fileList {
		.fileList-item {
			display: flex;
			align-items: center;
			height: 80rpx;
			background-color: #fff;
			border-bottom: 1px solid rgba(238, 238, 238, 1);

			.file-icon {
				width: 60rpx;
			}

			.file-name {
				width: 550rpx;
				height: 40rpx;
				line-height: 40rpx;
				font-size: 30rpx;
			}

			.text-hidden {
				overflow: hidden;
				/*超出部分隐藏*/
				white-space: nowrap;
				/*禁⽌换⾏*/
				text-overflow: ellipsis;
				/*省略号*/
			}

			.upload {
				display: flex;
				justify-content: space-between;
			}

			.upload-files {
				border-bottom: 1px solid rgba(238, 238, 238, 1);
			}

			.downLoad {
				width: 100rpx;
				text-align: center;
				font-size: 28rpx;
			}
		}
	}

	.detail {
		font-size: 28rpx;

		.detail-color {
			color: rgba(32, 52, 87, 1);
		}

		.mb-20 {
			display: flex;
			align-items: center;
			height: 60rpx;
			margin-bottom: 20rpx;
			border-bottom: 1px solid #eeeeee;
		}

		.bgc1 {
			background-color: #dddddd;
		}

		.fw-700 {
			font-weight: 700;
		}

		.detail-item {
			display: flex;
			background-color: #fff;
			margin-bottom: 10rpx;

			.left {
				width: 8rpx;
			}

			.right {
				width: 742rpx;
				padding: 20rpx;

				.item-head {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 60rpx;
				}

				.item-title {
					width: 250rpx;
					font-size: 28rpx;
					font-weight: 700;
				}

				.custom-style {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 150rpx;
					height: 50rpx;
					font-size: 26rpx;
					border: 1px solid #ccc;
					border-radius: 8rpx;
					background-color: #fff;
					color: #1576e6;
				}

				.hiddenView {
					position: relative;
					height: 90rpx;
					line-height: 30rpx;
					margin: 20rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 3;
					word-break: break-all;
					color: rgba(32, 52, 87, 1);

					&::before {
						content: "";
						position: absolute;
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
						background: linear-gradient(180deg,
								rgba(232, 243, 255, 0) 0%,
								rgba(232, 243, 255, 1) 100%);
						z-index: 1;
					}
				}

				.item-reason {
					min-height: 50rpx;
					margin: 20rpx;
					line-height: 30rpx;
					color: rgba(32, 52, 87, 1);
				}

				.item-files {
					display: flex;
					align-items: center;
					background-color: #fff;
					height: 80rpx;

					.file-name {
						width: 550rpx;
						height: 40rpx;
						line-height: 40rpx;
						font-size: 30rpx;
					}
				}
			}
		}
	}

	.preview {
		width: 700rpx;
		max-height: 1200rpx;
		padding-bottom: 10rpx;
		overflow: hidden;

		.preview-top {
			height: 100rpx;
			line-height: 100rpx;
			padding-left: 40rpx;
		}
	}
</style>