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
			<view v-show="current == 0" style="width:750rpx">
			<tableForm :list="[
        		{name:'采购计划单号',value:nodeDetels.orderCode,show:true},
        		{name:'供应商',value:nodeDetels.customerName,show:true},
        		{name:'关联物资申请单',value:nodeDetels.rePurchaseApplies,show:true},
        		{name:'填表人',value:nodeDetels.leaderName,show:true},
        		{name:'业务时间',value:nodeDetels.serviceTime,show:true},
        		// {name:'制单人',value:nodeDetels.nodeDetels,show:true},
        		{name:'单据时间',value:nodeDetels.createTime,show:true},
        		{name:'收料地址',value:nodeDetels.receiptAddress,show:true},
        		{name:'备注',value:nodeDetels.remark,show:true},
        		]"
        		></tableForm>
			</view>
			<!-- <view class="list" v-show="current == 0">
				
				<view class="list-item">
					采购计划单号：
					<text>{{ nodeDetels.orderCode }}</text>
				</view>
				<view class="list-item">
					供 应 商：
					<text>{{ nodeDetels.customerName }}</text>
				</view>
				<view class="list-item">
					关联物资申请单：
					<text>{{ nodeDetels.rePurchaseApplies }}</text>
				</view>
				<view class="list-item">
					负 责 人：
					<text>{{ nodeDetels.leaderName }}</text>
				</view>
				<view class="list-item">
					业务时间：
					<text>{{ nodeDetels.serviceTime }}</text>
				</view>
				<view class="list-item" v-if="num != 0">
					直供分包商：
					<text>{{ nodeDetels.fkSupplyCustomerName }}</text>
				</view>
				<view class="list-item">
					制 单 人：
					<text>{{ nodeDetels.createUserName }}</text>
				</view>
				<view class="list-item">
					单据时间：
					<text>{{ nodeDetels.createTime }}</text>
				</view>
				<view class="list-item">
					收料地址：
					<text>{{ nodeDetels.receiptAddress }}</text>
				</view>
				<view class="list-item">
					备 注：
					<text>{{ nodeDetels.remark }}</text>
				</view>
			</view> -->
			<!-- 物料信息 -->
			<view v-show="current == 1">
				<view class="table_detail  table_empty">
					<table>
						<thead>
							<tr>
								<th style="width: 40px">序号</th>
								<th>物料名称</th>
								<th>物料分类</th>
								<th>单位</th>
								<th>需求数量</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in nodeDetels.orderApplyMaterialDetails" :key="index">
								<td>{{ index + 1 }}</td>
								<td>{{ item.materialName }}</td>
								<td>{{ item.materialTypeName }}</td>
								<td>{{ item.unitName }}</td>
								<td>{{ item.purchaseNum }}</td>
							</tr>
						</tbody>
					</table>
					<u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
				</view>

				<!-- <view class="bottom-btn" v-if="!checkboxValue1.length"><u-button text="添加物料" class="add-material" @click="tableAdd"></u-button></view> -->
			</view>
		</view>
		<!-- ======================== -->
		<view class="popup-footer" style="justify-content: space-between; width: 100%">
			<view class="btns" v-if="nodeDetels.isWithdraw"><u-button class="btn-iem2" type="primary" text="撤回"
					@click="cancel" size="large"></u-button></view>
			<view class="btns" v-if="nodeDetels.isCode"><u-button class="btn-iem" type="primary" text="分享二维码"
					@click="examine" size="large"></u-button></view>
			<view class="btns" v-if="nodeDetels.isDelete"><u-button class="btn-iem2" type="error" text="删除" @click="deletes"
					size="large"></u-button></view>
			<view class="btns" v-if="nodeDetels.isUpdate"><u-button class="btn-iem" type="primary" text="编辑" @click="isEdit" size="large"></u-button></view>		
		</view>
		<u-popup :show="popShow" mode="center" @close="closePop">
			<view class="codePop">
				<w-qrcode :options="options"></w-qrcode>
			</view>
		</u-popup>
	</view>
</template>

<script>
import request from "../../common/request";
// import request from "../../common"
import tableForm from '../../components/table-form/table-form.vue';
export default {
	components:{tableForm},
	data() {
		return {
			pkId: "", // 订单id
			title: "普通材料采购计划单",
			tabList: [
				{
					name: "基础信息"
				},
				{
					name: "物料信息"
				}
			],
			current: 0,
			listData: [],
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
			valtime: Number(new Date()),
			statusCode: "", // 最原本单号没修改过
			areaList: [[]], // 供应商
			checkboxValue1: [],
			// 基本案列数据
			checkboxList1: [],
			searchOrdercode: "",
			num: 0,
			popShow: false,
			options: {
				code: "",
				size: 460,
			},
			qrcodeNumber: ""
		};
	},
	onLoad(option) {
		console.log(option);
		this.num = option.num - 0
		if (option.num == 1) {
			this.title = "混凝土采购详情";
			this.nodeDetels.purchaseTypeCode = "purchase_concrete"; // 混凝土
		}
		if (option.num == 2) {
			this.title = "钢筋半成品详情";
			this.nodeDetels.purchaseTypeCode = "purchase_rebar"; // 钢筋半成品
		}
		this.pkId = option.pkId;
		this.getData();
	},
	methods: {
		isEdit(){
			uni.navigateTo({
				url: "/pages/material/newPlannedorder?num="+this.num+"&type=2&pkId="+this.pkId
			});
		},
		// 获取数据
		getData() {
			this.$api.queryMaterialOder({ pkId: this.pkId }).then(res => {
				if (res.code === 200) {
					this.nodeDetels = res.data;
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			});
		},
		// tab切换
		currentChange(e) {
			this.current = e.index;
		},
		// 撤回
		cancel() {
			let data = {
				businessType: 1, // 1：撤回，2：确认，3：驳回
				pkId: this.pkId
			};
			uni.showModal({
				title: "提示",
				content: "是否撤回该物资采购单？",
				showCancel: true,
				cancelText: "取消",
				confirmText: "确认",
				success: res => {
					if (res.confirm) {
						this.$api.modifyStatus(data).then(res => {
							if (res.code === 200) {
								uni.showToast({
									title: "撤回成功",
									icon: "success"
								});
								// uni.$emit("refreshData");
								let pages = getCurrentPages()
								let prevPage = pages[pages.length - 2]; // 上一页面实例
								prevPage.$vm.search()
								uni.navigateBack(1);
							} else {
								uni.showToast({
									title: res.msg,
									icon: "error"
								});
							}
						});
					} else {
						// 否则点击了取消
					}
				}
			});
		},

		deletes() {
			uni.showModal({
				title: "提示",
				content: "是否删除该物资采购单？",
				showCancel: true,
				cancelText: "取消",
				confirmText: "确认",
				success: res => {
					if (res.confirm) {
						this.$api.orderPurchaseDelete({ pkId: this.pkId }).then(res => {
							if (res.code === 200) {
								uni.showToast({
									title: "删除成功",
									icon: "success"
								});
								let pages = getCurrentPages()
								let prevPage = pages[pages.length - 2]; // 上一页面实例
								prevPage.$vm.search()
								uni.navigateBack(1);
							} else {
								uni.showToast({
									title: res.msg,
									icon: "error"
								});
							}
						});
					} else {
						// 否则点击了取消
					}
				}
			});
		},
		// 获取采购单号
		getBusinessCode(num) {

			let data = {
				businessType: num
			};
			this.$api.getBusinessCode(data).then(res => {
				if (res.code === 200) {
					this.qrcodeNumber = res.data.typeCode;
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			});
		},
		examine() {
			if (this.num == 0) {
				this.getBusinessCode(3); //获取采购单号3:普通材料采购单,5:混凝土采购计划单,6:钢筋半成品
			}
			if (this.num == 1) {
				this.getBusinessCode(5); //获取采购单号3:普通材料采购单,5:混凝土采购计划单,6:钢筋半成品
			}
			if (this.num == 2) {
				this.getBusinessCode(6); //获取采购单号3:普通材料采购单,5:混凝土采购计划单,6:钢筋半成品
			}
			// this.num
			const data = JSON.stringify(encodeURIComponent(`${request.baseUrl}/h5/#/pages/oderInfo/oderInfo?pkId=${this.id}&orderCode=${this.qrcodeNumber}`));
			this.options.code = `${request.baseUrl}/h5/#/pages/h5/scanCodeTran?type=5&data=${data}`
			this.$nextTick(() => {
				this.popShow = true
			})
		},
		closePop() {
			this.popShow = false;
		},
		// 保存新增 num  0:草稿，1：待确认
		submitMaterial(num) {
			let data = { ...this.nodeDetels };
			if (num) {
				data.purchaseCode = num;
			}
			if (this.nodeDetels.orderCode == this.statusCode) {
				data.isUpdate = 0;
			} else {
				data.isUpdate = 1;
			}
			this.$api
				.addMaterialOder(data)
				.then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: "新增采购单成功",
							icon: "success",
							mask: true
						});
						setTimeout(() => {
							uni.redirectTo({
								url: "/pages/material/generalPurchase"
							});
						}, 500);
					} else {
						uni.showToast({
							title: res.msg,
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
		}
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
