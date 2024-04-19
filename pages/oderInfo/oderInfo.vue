<template>
	<view class="wrapper">
		<!-- 表单 -->
		<view class="list">
			<view class="item">
				<text>采购计划单号:</text>
				<view class="item-text">{{ model1.orderCode }}</view>
			</view>
			<view class="item">
				<text>负责人:</text>
				<view class="item-text">{{ model1.leaderName }}</view>
			</view>
			<view class="item">
				<text>供应商:</text>
				<view class="item-text">
					{{ model1.customerName }}
					<u-icon name="arrow-down" class="ico"></u-icon>
				</view>
			</view>
			<view class="item">
				<text>业务时间:</text>
				<view class="item-text">{{ model1.serviceTime }}</view>
			</view>
			<view class="item" v-if="model1.supplyCustomerName">
				<text>直供分包商:</text>
				<view class="item-text">
					{{ model1.supplyCustomerName }}
					<u-icon name="arrow-down" class="ico"></u-icon>
				</view>
			</view>
			<view class="item">
				<text>备注:</text>
				<u--textarea v-model="model1.remark" disabled confirmType="done"></u--textarea>
			</view>
		</view>
		<!-- 表格 -->
		<uni-table border emptyText="暂无更多数据">
			<!-- 表头行 -->
			<uni-tr>
				<uni-th align="center" width="50">序号</uni-th>
				<uni-th align="center" width="80">材料</uni-th>
				<uni-th align="center" width="100">材料分类</uni-th>
				<uni-th align="center" width="50">单位</uni-th>
				<uni-th align="center" width="80">需求量</uni-th>
			</uni-tr>
			<!-- 表格数据行 -->
			<uni-tr v-for="(item, index) in model1.orderApplyMaterialDetails" :key="index">
				<uni-td align="center">{{ index + 1 }}</uni-td>
				<uni-td align="center">{{ item.materialName }}</uni-td>
				<uni-td align="center">{{ item.materialTypeName }}</uni-td>
				<uni-td align="center">{{ item.unitName }}</uni-td>
				<uni-td align="center">{{ item.purchaseNum }}</uni-td>
			</uni-tr>
		</uni-table>
		<u-button type="primary" text="填写供货单" class="btn" @click="fillOrder" v-if="model1.orderApplyMaterialDetails.length"></u-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			model1: {
				orderCode: "",
				leaderName: "",
				customerName: "",
				remark: "",
				serviceTime: "",
				orderApplyMaterialDetails: []
			},
			orderCode: ""
		};
	},
	onLoad(option) {
		console.log(option);
		this.orderCode = option.orderCode; // 入库单号
		this.getData(option);
	},
	methods: {
		// 获取订单数据
		getData(data) {
			this.$api
				.findPurchaseOrderById(data)
				.then(res => {
					if (res.code === 200) {
						this.model1 = res.data;
					} else {
						uni.showToast({
							title: res.msg,
							duration: 4000,
							icon: "error"
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: err,
						icon: "error"
					});
				});
		},
		// 跳转供货信息
		fillOrder() {
			// 物料存本地传给下个界面
			uni.setStorageSync("data", this.model1.orderApplyMaterialDetails);
			uni.setStorageSync("phone", this.model1.phone);
			uni.setStorageSync("pkId", this.model1.pkId);
			uni.setStorageSync("orderCode", this.orderCode);
			uni.navigateTo({
				url: "/pages/oderInfo/supplyInfo"
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #fff;
}
.wrapper {
	padding: 20rpx;
}
.uni-table-th {
	background: #f9f9f9;
}
.item {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
	text {
		width: 100px;
		text-align: right;
		padding-right: 10rpx;
		font-size: 28rpx;
	}
	.item-text {
		font-size: 26rpx;
		flex: 1;
		background-color: #efefef;
		min-height: 60rpx;
		line-height: 60rpx;
		padding: 0 10rpx;
		position: relative;
		.ico {
			position: absolute;
			right: 5px;
			top: 14rpx;
		}
	}
}
.btn {
	width: 260rpx;
	position: fixed;
	bottom: 60rpx;
	left: 50%;
	margin-left: -130rpx;
}
</style>
