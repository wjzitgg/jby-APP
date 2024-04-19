<template>
	<view class="wrapper">
		<u-navbar leftText="库存盘点" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<!-- 头部tabs -->
		<view class="sticky">
			<u-tabs :list="tabList" :current="current" @click="listSelet" class="tabs" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}">
				<view slot="right" class="hamburg" @tap="hamburg"><u-icon name="list" size="21" bold></u-icon></view>
			</u-tabs>
		</view>
		<view class="content">
			<view class="pull-down" v-show="show1">
				<text class="item-tab" :class="index == current ? 'action' : ''" v-for="(item, index) in tabList" :key="index" @click="listSelet(item, index)">{{ item.name }}</text>
				<!-- 箭头 -->
				<u-icon name="arrow-up" color="#dddddd" size="20" class="arrow-up" @click="shut"></u-icon>
			</view>
			<!-- tab对应面 -->
			<view class="" v-show="idx == 0">
				<view class="card">
					<view class="list-item">
						盘点单号：
						<text class="item">{{ showData.orderCode }}</text>
					</view>
					<view class="list-item">
						盘点仓库：
						<text class="item">{{ showData.warehouseName }}</text>
					</view>
					<view class="list-item">
						负责人：
						<text class="item">{{ showData.leaderName }}</text>
					</view>
					<view class="list-item">
						业务时间：
						<text class="item">{{ showData.createTime }}</text>
					</view>
					<view class="list-item">
						单据状态：
						<text class="item">{{ rowData.handleStatus !== 1 ? '未完成' : '已完成' }}</text>
					</view>
				</view>
			</view>
			<view v-show="idx == 1"><processForm :tableData="tableDTOS" :tableIndex="tableIndex" @sendGzipTableHtml="getGzipTableHtml" ref="formHtml"></processForm></view>
			<!-- 工程量 -->
			<view class="" v-show="idx == 2">
				<!-- 表格 -->
				<uni-table border emptyText="暂无更多数据">
					<!-- 表头行 -->
					<uni-tr>
						<uni-th align="center" width="70">物料名称</uni-th>
						<uni-th align="center" width="70">供应商</uni-th>
						<uni-th align="center" width="80">物料类型</uni-th>
						<uni-th align="center" width="50">单位</uni-th>
						<uni-th align="center" width="80">库存数量</uni-th>
						<uni-th align="center" width="80">盘点数量</uni-th>
						<uni-th align="center" width="80">盘盈数</uni-th>
						<uni-th align="center" width="80">盘亏数</uni-th>
					</uni-tr>
					<!-- 表格数据行 -->
					<uni-tr v-for="(item, index) in showData.engMatOrderInventoryDetailsVos" :key="index">
						<uni-td align="center">{{ item.materialName }}</uni-td>
						<uni-td align="center">{{ item.customerName }}</uni-td>
						<uni-td align="center">{{ item.materialTypeName }}</uni-td>
						<uni-td align="center">{{ item.unitName }}</uni-td>
						<uni-td align="center">{{ item.beforeNum }}</uni-td>
						<uni-td align="center">{{ item.inventoryNum }}</uni-td>
						<uni-td align="center">
							<text v-if="item.inventoryNum - item.beforeNum > 0">{{ item.inventoryNum - item.beforeNum }}</text>
						</uni-td>
						<uni-td align="center">
							<text v-if="item.inventoryNum - item.beforeNum < 0">{{ 0 - item.inventoryNum - item.beforeNum }}</text>
						</uni-td>
					</uni-tr>
				</uni-table>
			</view>
			<!-- 附件 -->
			<view class="" v-show="idx == 3">
				<view class="accessory" v-for="(item, index) in showData.userFiles" :key="index">
					<view class="acce-item">
						<u-icon name="account" color="#8f99ab" size="24"></u-icon>
						<text>{{ item.userName }}</text>
						<view class="ctime">{{ item.time }}</view>
					</view>
					<view class="acce-list" v-for="(file, ind) in item.prodReProcessFileList" :key="ind">
						<u-icon name="file-text" color="#3896ee" size="24" class="file-icon"></u-icon>
						<text @click="previewLook(file)">{{ file.fileName }}</text>
						<u-icon name="download" class="downLoad" size="24" @click="downLoad(file.fileUrl)"></u-icon>
					</view>
				</view>
			</view>
			<!-- 审批记录 -->
			<view class="" v-show="idx == 4">
				<view class="accessory" v-for="(item, index) in showData.prodTaskFinishList" :key="index">
					<view class="acce-item">
						<u-icon name="account" color="#8f99ab" size="24"></u-icon>
						<text>{{ item.assignee }}</text>
						<view class="ctime">{{ item.endTime }}</view>
					</view>
					<view class="record">
						<u-icon name="file-text-fill" color="#d73434" size="24" class="file-icon"></u-icon>
						<text>
							发表：
							<br />
							{{ item.comment }}
						</text>
					</view>
					<view class="record" v-for="(file, ind) in item.fileVoList" :key="ind">
						<u-icon name="file-text" color="#3896ee" size="24" class="file-icon"></u-icon>
						<text @click="previewLook(file)">{{ file.fileName }}</text>
						<u-icon name="download" class="downLoad" size="24" @click="downLoad(file.fileUrl)"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部固定处理按钮 -->
		<view class="btn" v-if="rowData.handleStatus !== 1" @click="appBtn">处理</view>
		<approvePopup
			:app-show="appShow"
			:approver-show="bottomShow"
			:approverName="staffList.roleName"
			:approverList="staffList.sysUserList"
			:approver-name="nextAppRole"
			:approver-list="approvalOptions"
			:rateShow="scoreFlag"
			@close="closeApp"
			@reject="reject"
			@submit="submit"
			:app-title="'审批'"
		></approvePopup>
	</view>
</template>

<script>
import approvePopup from "../../components/approve-popup/approve-popup";
import processForm from "../../components/process-form/process-form.vue";

export default {
	components: { approvePopup, processForm },
	data() {
		return {
			rowData: {}, // pkId流程
			appShow: false, // 控制处理弹框
			scoreFlag: true, // 控制评分
			bottomShow: true,
			nextAppRole: "",
			approvalOptions: [],
			staffList: {}, // 员工列表数据
			idx: 0,
			tableIndex: 0,
			tabList: [
				{
					name: "基础信息",
					idx: 0
				},
				{
					name: "盘点物料",
					idx: 2
				},
				{
					name: "附件",
					idx: 3
				},
				{
					name: "审批记录",
					idx: 4
				}
			],
			current: 0,
			show1: false, // 控制tabs下拉
			showData: {}, // 总体数据
			tableDTOS: [],
			tableHtml: [],
			user: {},
			show: true // 控制表格可不可以编辑
		};
	},
	onLoad(option) {
		this.rowData = JSON.parse(option.row);
		// 处理表格编辑问题
		this.getData(this.rowData.fkBusinessId);
		this.user = uni.getStorageSync("user");
		this.user.pkId = this.user.userId;
	},
	methods: {
		previewLook(item) {
			this.$refs.approve.previewUrl = item.fileUrl;
			this.$refs.approve.previewShow = true;
		},
		// 获取表格压缩后的数据
		getGzipTableHtml(tabledata) {
			this.tableHtml = tabledata;
			console.log("压缩后的表", this.tableHtml);
		},
		// tab点击
		listSelet(item, index) {
			// 展开传值
			if (index !== undefined) {
				this.current = index;
			} else {
				this.current = item.index;
			}
			this.show1 = false;
			this.idx = item.idx;
			if (item.idx === 1) {
				this.tableIndex = item.tableInd;
			}
		},
		// 获取数据
		getData(id) {
			uni.showLoading({
				mask: true
			});
			this.$api.getConstruction2({ pkId: id, type: this.rowData.processingResult === 0 ? 2 : 1 }).then(res => {
				uni.hideLoading();
				if (res.code === 200) {
					this.showData = res.data;
					this.scoreFlag = !!res.data.scoreFlag;
					this.tableDTOS = this.showData.tableDTOS ? this.showData.tableDTOS : [];
					if (this.tableDTOS.length) {
						let tableArr = this.tableDTOS.map((item, index) => ({ name: item.tableName, idx: 1, tableInd: index }));
						this.tabList.splice(1, 0, ...tableArr);
					}
				}
			});
		},
		// 汉堡点击展开tabs
		hamburg() {
			this.show1 = true;
		},
		shut() {
			this.show1 = false;
		},
		// 获取下一审批岗位和审批人列表
		getStaff() {
			uni.showLoading({
				mask: true
			});
			this.$api.getStaff2().then(res => {
				uni.hideLoading();
				if (res.code === 200) {
					if(res.data){
						this.bottomShow=true
						this.staffList = res.data;
						this.staffList.sysUserList.forEach(item => {
							item.value = item.pkId;
							item.label = item.userName;
						});
					}else{
						this.bottomShow=false
					}
				} else {
					uni.showToast({ icon: "none", title: res.msg });
				}
			});
		},
		// 处理按钮
		appBtn() {
			this.$refs.formHtml.gzipTable();
			this.getStaff();
			this.appShow = true;
		},
		closeApp() {
			this.appShow = false;
		},
		reject(e) {
			console.log(e);
			let data = {
				approveStatus: 2,
				pkId: this.showData.pkId,
				approveComment: e.opinion // 审批意见
			};
			data.approveComment = data.approveComment ? data.approveComment : "审批不通过";
			uni.showLoading({
				mask: true
			});
			this.$api
				.processFlow2(data)
				.then(res => {
					uni.hideLoading();
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: "驳回成功",
							mask: true,
							success: () => {
								this.closeApp();
								setTimeout(() => {
									uni.navigateBack();
								}, 2000);
							}
						});
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		submit(e) {
			console.log(e);
			let data = {
				approveStatus: 1,
				pkId: this.showData.pkId,
				approveComment: e.opinion, // 审批意见
				approveId: e.approverId,
				fileList: e.fileList,
				signUrl: e.signUrl,
				tableDTOS: this.tableHtml // tableDTOS
			};
			data.approveComment = data.approveComment ? data.approveComment : "审批通过";
			console.log(data.approveComment);
			uni.showLoading({
				mask: true
			});
			this.$api
				.processFlow2(data)
				.then(res => {
					uni.hideLoading();
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: "审批成功",
							mask: true,
							success: () => {
								this.closeApp();
								setTimeout(() => {
									uni.navigateBack();
								}, 2000);
							}
						});
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				})
				.catch(err => {
					uni.hideLoading();
				});
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
									title: "已保存至" + res2.savedFilePath
								});
								setTimeout(() => {
									uni.openDocument({
										filePath: res2.savedFilePath,
										success: result => {}
									});
								}, 1000);
							}
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	position: relative;
	padding-top: 90rpx;
}
.tabs {
	padding: 0 12rpx;
	font-size: 20rpx;
	margin-bottom: 1px;
	.hamburg {
		padding-left: 4rpx;
		border-left: 1px solid #d5d0d0;
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
// 详情
.card {
	background: #fff;
	border-left: 8rpx solid #dddddd;
	padding: 24rpx 40rpx;
	margin-top: 2rpx;
	.list-item {
		height: 64rpx;
		line-height: 64rpx;
		font-size: 28rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		.item {
			color: #79859a;
		}
	}
}
// 工程材料表
.uni-table-th,
.uni-table-td {
	font-size: 24rpx !important;
}
// 附件
.accessory {
	background-color: #fff;
	padding: 0 30rpx 44rpx;
	margin-bottom: 8rpx;
	font-size: 28rpx;
	.acce-item {
		height: 90rpx;
		line-height: 90rpx;
		padding: 0 30rpx;
		display: flex;
		color: #8f99ab;
		> text {
			padding-left: 12rpx;
		}
		.ctime {
			font-size: 24rpx;
			flex: 1;
			text-align: right;
		}
	}
	// 列表文件
	.acce-list {
		height: 100rpx;
		line-height: 100rpx;
		padding-left: 30rpx;
		display: flex;
		flex-wrap: wrap;
		position: relative;
		.file-icon {
			margin-right: 20rpx;
		}
		> text {
			flex: 1;
			border-bottom: 1px solid #eeeeee;
		}
		.downLoad {
			position: absolute;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
		}
	}
	// 审批记录留言
	.record {
		padding: 0 0 32rpx 30rpx;
		display: flex;
		align-items: flex-start;
		position: relative;
		.file-icon {
			margin-right: 20rpx;
		}
		> text {
			flex: 1;
			line-height: 1.4;
			border-bottom: 1px solid #eeeeee;
			padding-bottom: 34rpx;
		}
		.downLoad {
			position: absolute;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
		}
	}
}
</style>
