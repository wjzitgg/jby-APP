<!-- 查看流程 -->
<template>
	<view class="wrapper">
		<u-navbar :leftText="nodeData.workflowName" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff"
			@leftClick="back"></u-navbar>
		<view class="content">
			<view class="list-top">
				<view class="list-item">
					<text class="item-title">流程名称:</text>
					<text class="details">{{ nodeData.workflowName }}</text>
				</view>
				<view class="list-item">
					<text class="item-title">单位工程:</text>
					<text class="details">{{ nodeData.oneParentName }}2</text>
				</view>
				<view class="list-item">
					<text class="item-title">分部工程:</text>
					<text class="details">{{ nodeData.secondParentName }}</text>
				</view>
				<view class="list-item">
					<text class="item-title">分项工程:</text>
					<text class="details">{{ nodeData.itemName }}</text>
				</view>
				<view class="list-item" v-if="nodeData.itemType > 0">
					<text class="item-title" v-if="nodeData.itemType == 2">剩余进尺:</text>
					<text class="item-title" v-if="nodeData.itemType == 1">剩余最大填高:</text>
					<text class="details">{{ nodeData.surplusMax }}米</text>
				</view>
				<view class="list-item" v-if="nodeData.itemType > 0">
					<text class="item-title" v-if="nodeData.itemType == 2">施工进尺:</text>
					<text class="item-title" v-if="nodeData.itemType == 1">施工设计面最大填高:</text>
					<text class="details">{{ nodeData.footage2 }}米</text>
				</view>
				<!-- <view class="list-item">
					<text class="item-title">下一节点:</text>
					<text class="details">{{ nodeData.roleName }}</text>
				</view>
				<view class="list-item">
					<text class="item-title">负责人:</text>
					<text class="details">{{ nodeData.approver }}</text>
				</view> -->
				<view class="list-item">
					<text class="item-title">完成状态:</text>
					<text class="details">{{ nodeData.roleName }}</text>
				</view>
			</view>
			<!-- 验收文件 -->
			<view class="list-bottom">
				<view class="title">验收文件</view>
				<view class="list-item" v-for="(item, index) in nodeData.fileList" :key="index">
					<u-icon class="icons" name="file-text" size="24"></u-icon>
					<text class="file-name">{{ item.fileName }}</text>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="btn-left" @click="editPro">编辑</view>
			<view class="btn-right" @click="accraditation">审批</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			nodeData: {},
			reItemApproveDTOS: [{ fkItemId: "" }],
			num: "",
			approverList:[]
		};
	},
	onLoad(option) {
		this.num = option.num;
		console.log(this.num);
			console.log(option)
		if (this.num == 1) {
			this.nodeData = uni.getStorageSync("nodeData");
			this.approverList = JSON.parse(option.approverList)
			this.reItemApproveDTOS[0].fkItemId = this.nodeData.subentryId;
			console.log(this.nodeData);
		}
	},
	methods: {
		back() {
			// 新增时候的返回
			if (this.num == 1) {
				uni.navigateBack({
					delta: 2
				});
			}
		},
		// 新增的编辑
		editPro() {
			if (this.num == 1) {
				uni.navigateBack();
			}
		},
		// 审批
		accraditation() {
			uni.showLoading({
				mask: true
			});
			let data = {
				approveStatus: 1,
				approver: this.nodeData.approver, // 审批人
				fkApproverId: this.nodeData.fkApproverId, // 审批人
				fkPrecessId: this.nodeData.pkId, // 工序流程IDid
				itemType: this.nodeData.itemType,
				processName: this.nodeData.itemName, //工序流程名称
				reItemApproveDTOS: this.reItemApproveDTOS,
				prodReProcessFileList: this.nodeData.fileList,
				prodWorkflowUserAdds:this.approverList
			};
			if(data.itemType ==1 || data.itemType ==2){
				data.fillHeight=this.nodeData.surplusMax;
				// data. = this.nodeData.completeItemName;
				// data.reItemApproveDTOS.foreach(item=>{
				// 	item.itemName= this.nodeData.completeItemName;
				// })
				for(let e =0 ;e<data.reItemApproveDTOS.length;e++){
					data.reItemApproveDTOS[e].itemName = this.nodeData.completeItemName;
				}
			}
			// return console.log(this.nodeData)
			this.$api
				.addprocess(data)
				.then(res => {
					uni.hideLoading();
					if (res.code === 200) {
						console.log(res);
						uni.showToast({
							title: "发起审批成功",
							icon: "success",
							mask: true
						});
						setTimeout(() => {
							uni.reLaunch({
								url: "/pages/production/deliveryReceiving"
							});
						}, 1000);
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							mask: true,
							duration: 3000,
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: err,
						icon: "error"
					});
					uni.hideLoading();
				});
		}
	}
};
</script>

<style lang="scss">
.content {
	padding-bottom: 140rpx;
}

.list-top {
	background-color: #fff;
	padding: 20rpx 40rpx 40rpx 40rpx;
	font-size: 28rpx;
	margin-bottom: 20rpx;

	.list-item {
		line-height: 80rpx;
		border-bottom: 1px solid #eeeeee;

		.item-title {
			margin-right: 20rpx;
		}

		.details {
			color: #79859a;
		}
	}
}

.list-bottom {
	background-color: #fff;
	padding: 20rpx 0 40rpx 40rpx;
	font-size: 28rpx;

	.title {
		line-height: 80rpx;
	}

	.list-item {
		display: flex;
		align-items: center;
		height: 80rpx;
		border-bottom: 1px solid #eee;
	}
}

.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 120rpx;
	display: flex;

	view {
		width: 50%;
		font-size: 32rpx;
		text-align: center;
		line-height: 120rpx;
		color: #fff;
	}

	.btn-left {
		background-color: #43cf7c;
	}

	.btn-right {
		background-color: #1576e6;
	}
}</style>
