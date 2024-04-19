<!-- 编辑和新增流程 -->
<template>
	<view class="wrapper">
		<u-navbar :leftText="title" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<!-- tabs -->
		<view class="sticky">
			<u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="false"
				:activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"></u-tabs>
		</view>
		<view class="content">
			<!-- ======================== -->
			<view class="list" v-show="current == 0">
				<view class="list-item" >
					{{itemData.orderRelation.orderType==1?'入库单号':'出库单号'}}：
					<text>{{ nodeDetels.orderCode }}</text>
				</view>
				<view class="list-item" v-if="itemData.orderRelation.orderType==1">
					来料对象：
					<text v-if="nodeDetels.issueCode =='issue_unit'">无</text>
					<text v-if="nodeDetels.issueCode == 'issue_supplier'">供应商</text>
					<text v-if="nodeDetels.issueCode == 'issue_subcontract'">分包商</text>
					<text v-if="nodeDetels.issueCode == 'issue_project'">项目部</text>
					<text v-if="nodeDetels.issueCode == 'issue_position'">施工单位</text>
				</view>
				<view class="list-item" v-if="itemData.orderRelation.orderType==2">
					出库对象：
					<text v-if="nodeDetels.issueCode =='delivery_unit'">无</text>
					<text v-if="nodeDetels.issueCode == 'delivery_supplier'">供应商</text>
					<text v-if="nodeDetels.issueCode == 'delivery_subcontract'">分包商</text>
					<text v-if="nodeDetels.issueCode == 'delivery_project'">项目部</text>
					<text v-if="nodeDetels.issueCode == 'delivery_position'">施工单位</text>
				</view>
				<view class="list-item" >
					{{itemData.orderRelation.orderType==1?'入库仓库':'出库仓库'}}：
					<text>{{ nodeDetels.warehouseName }}</text>
				</view>
				<!-- <view class="list-item"  v-if="itemData.orderRelation.orderType==2">
					出库仓库：
					<text>{{ nodeDetels.warehouseName }}</text>
				</view> -->
				<view class="list-item">
					供 应 商：
					<text>{{ nodeDetels.customerName }}</text>
				</view>
				<view class="list-item" v-if="itemData.orderRelation.orderType==1">
					关联采购计划单：
					<text v-if="nodeDetels.orderRelationList == null || nodeDetels.orderRelationList.length == 0 ||(nodeDetels.orderRelationList.length == 1 && nodeDetels.orderRelationList[0].isQuery == 0)">无</text>
					<text v-else v-for="(item,index) in nodeDetels.orderRelationList" v-show="item.isQuery == 1" :key="index">{{item.orderCode}}</text>
				</view>
				<view class="list-item" v-if="itemData.orderRelation.orderType==2">
					关联发料单：
					<text v-if="nodeDetels.orderRelationList == null || nodeDetels.orderRelationList.length == 0">无</text>
					<text v-else v-for="(item,index) in nodeDetels.orderRelationList"  v-show="item.orderType == 4"  :key="index">{{item.orderCode}}</text>
				</view>
				<view class="list-item" >
					负责人：
					<text>{{ nodeDetels.leaderName }}</text>
				</view>
				<view class="list-item" v-if="itemData.orderRelation.orderType==2">
					关联入库单：
					<text v-if="nodeDetels.orderRelationList == null || nodeDetels.orderRelationList.length == 0">无</text>
					<text v-else v-for="(item,index) in nodeDetels.orderRelationList" v-show="item.orderType == 3"  :key="index">{{item.orderCode}}</text>
				</view>
				<view class="list-item">
					业务时间：
					<text>{{ nodeDetels.serviceTime }}</text>
				</view>
				<view class="list-item">
					制 单 人：
					<text>{{ nodeDetels.createUserName }}</text>
				</view>
				<view class="list-item">
					录入时间：
					<text>{{ nodeDetels.createTime }}</text>
				</view>
				<view class="list-item" >
					单据状态：
					<text v-if="nodeDetels.receiverStatus == 0">待签收</text>
					<text v-if="nodeDetels.receiverStatus == 1">已完成</text>
					<text v-if="nodeDetels.receiverStatus == 2">已拒绝</text>
				</view>
				<view class="list-item">
					备注：
					<text>{{ nodeDetels.remark }}</text>
				</view>
				<view class="list-item" v-if="itemData.orderRelation.orderType==2">
					车牌号：
					<text>{{ nodeDetels.vehicleNum }}</text>
				</view>
				<view class="list-item" v-if="itemData.orderRelation.orderType==2">
					运输司机：
					<text>{{ nodeDetels.driverName }}</text>
				</view>
				<view class="list-item" v-if="itemData.orderRelation.orderType==2">
					联系方式：
					<text>{{ nodeDetels.driverPhone }}</text>
				</view>
				<view class="list-item">
					签收人：
					<text>{{ nodeDetels.receiverName }}</text>
				</view>
				<view class="list-item">
					签收时间：
					<text>{{ nodeDetels.receiverTime }}</text>
				</view>
				<view class="list-item" v-if="itemData.orderRelation.orderType==1">
					入库人：
					<text>{{ nodeDetels.warehousingUserName }}</text>
				</view>
				<view class="list-item" v-if="itemData.orderRelation.orderType==1">
					入库时间：
					<text>{{ nodeDetels.warehousingTime }}</text>
				</view>
			</view>
			<!-- 物料信息 -->
			<view v-show="current == 1">
				<view class="table_detail table_empty">
					<table>
						<thead>
							<tr>
								<th style="width: 40px">序号</th>
								<th>物料名称</th>
								<th>物料分类</th>
								<th v-if="itemData.orderRelation.orderType==1">供应商</th>
								<th v-if="itemData.orderRelation.orderType==2">检测状态</th>
								<th>单位</th>
								<th>物料单价</th>
								<th>入库数量</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in detailsVoList" :key="index">
								<td>{{ index + 1 }}</td>
								<td>{{ item.materialName }}</td>
								<td>{{ item.fkTypeName }}</td>
								<td v-if="itemData.orderRelation.orderType==1">{{ item.customerName }}</td>
								<td v-if="itemData.orderRelation.orderType==2">
									<text v-if="item.passStatus ==0">合格</text>
									<text v-if="item.passStatus ==1">不合格</text>
									<text v-if="item.passStatus ==2">待检测</text>
								</td>
								<td>{{itemData.orderRelation.orderType==1?item.fkUnitName:item.unitName }}</td>
								<td>{{ item.materialPrice }}</td>
								<td>{{ item.stockNum }}</td>
							</tr>
						</tbody>
					</table>
					<u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// import request from "../../common/request";
// import request from "../../common"
export default {
	data() {
		return {
			pkId: "", // 订单id
			title: "查看单据",
			tabList: [
				{
					name: "基础信息"
				},
				{
					name: "物料信息"
				}
			],
			current: 0,
			nodeDetels: {
				orderCode: "",
				approver: "", // 供应商
				fkCustomerId: "", // 供应商id，
				leaderName: "", // 负责人
				serviceTime: "",
				receiptAddress: "",
				remark: "",
				orderPurchaseMaterialDetails: [],
				purchaseTypeCode: "purchase_ordinary",
				purchaseCode: 1, //采购状态编码 0:草稿，1：待确认，2：已确认，3：已驳回，4：已完成
				rePurchaseApplies: []
			},
			num: 0,
			itemData:{
				orderRelation:{
					orderType:1
				}
			},
			detailsVoList:[]
		};
	},
	onLoad(option) {
		console.log(option)
		this.itemData = JSON.parse(option.row)
		console.log(this.itemData)
		// this.num = option.num - 0
		// this.pkId = option.pkId;
		this.getData();
	},
	methods: {
		// 获取数据
		getData() {
			if(this.itemData.orderRelation.orderType ==1){
				// 入库
				this.$api.findInputById({ pkId: this.itemData.orderRelation.pkId }).then(res => {
				if (res.code === 200) {
					this.nodeDetels = res.data;
					this.detailsVoList = res.data.detailsVoList
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			});
			}else{
				// 出库
				this.$api.findOutById({ pkId: this.itemData.orderRelation.pkId }).then(res => {
				if (res.code === 200) {
					this.nodeDetels = res.data;
					this.detailsVoList = res.data.orderDetailsList
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			});
			}
			// findInputById 入库
			// 出库  findOutById 出库


		},
		// tab切换
		currentChange(e) {
			this.current = e.index;
		},

	}
};
</script>

<style lang="scss" scoped>
.content {
	padding-bottom: 120rpx;
	padding-top: 88rpx;
}

// 详情
.list {
	padding: 20rpx 40rpx 40rpx;
	margin-top: 8rpx;
	background-color: #fff;
	font-size: 28rpx;

	.list-item {
		height: 80rpx;
		line-height: 80rpx;
		border-bottom: 1px solid #eee;

		text {
			color: #79859a;
		}
	}
}

.name {
	width: 520rpx;
	// margin-bottom: 20rpx;
	overflow: hidden;
	/*超出部分隐藏*/
	white-space: nowrap;
	/*禁⽌换⾏*/
	text-overflow: ellipsis;
	/*省略号*/
}

.popup-footer {
	position: fixed;
	bottom: 0;
	display: flex;
	width: 660rpx;
	height: 100rpx;

	// background-color: rgb(194, 155, 155);
	.btns {
		height: 100%;
		flex: 1;
		color: #fff;

		.btn-iem {
			background: #1576e6;
			border: none;
			border-radius: 0;
		}

		.btn-iem2 {
			background: #fa2020;
			border: none;
			border-radius: 0;
		}
	}
}

.u-checkbox {
	height: 80rpx;
	border-bottom: 1px solid #eee;
	padding-left: 12rpx;
}

.bottom-btn {
	// 添加物料
	background: #fff;
	padding: 24rpx;

	.add-material {
		width: 240rpx;
		height: 48rpx;
		line-height: 48rpx;
		background-color: #ebf4ff;
		color: #2b8fed;
	}
}

.codePop {
	padding: 20rpx;
}
</style>
