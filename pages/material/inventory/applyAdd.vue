<template>
	<view class="wrapper addPageBg">
		<u-navbar :leftText="rowData.itemTitle" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="content">
			<view style="background: #fff">
				<u-tabs class="tabs" :list="list1" :current="current" @change="currentChange"
					:activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}">
				</u-tabs>
			</view>
			<view v-show="current == 0">
				<view style="padding-bottom: 60px">
					<view class="add-inputs">
						<view class="inputs-label">申请单号</view>
						<view class="inputs-content">
							<u--textarea v-model="rowData.orderCode" placeholder="请输入内容" autoHeight maxlength="50"
								border="none"></u--textarea>
						</view>
					</view>
					<view v-if="rowData.itemTitle != '新增供货申请单'" class="add-inputs">
						<view class="inputs-label">申请单位</view>
						<view class="inputs-content">
							<u--textarea v-model="rowData.customName" placeholder="请输入内容" autoHeight border="none"></u--textarea>
						</view>
						<!-- <u--input placeholder="请输入内容" border="none" disabled v-model="rowData.customName" customStyle=""
              class="form-content" clearable></u--input> -->
					</view>
					<view class="add-inputs">
						<view class="inputs-label">出库对象</view>
						<view class="inputs-content select" @click="outgoingObjectShow = true">
							<view class="name">{{ outgoingObject.keyVal }}</view>
							<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
						</view>
						<u-picker :show="outgoingObjectShow" :columns="outgoingObjectList" keyName="keyVal" @cancel="outgoingClose"
							@confirm="outgoingConfirm"></u-picker>
					</view>
					<!--  -->
					<view v-if="outgoingObject.keyName == 'delivery_subcontract'" class="add-inputs">
						<view class="inputs-label">分包单位</view>
						<view class="inputs-content select" @click="fkCustomerShow = true">
							<view class="name">{{ fkCustomerData.customName }}</view>
							<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
						</view>
						<u-picker :show="fkCustomerShow" :columns="fkCustomerList" keyName="customName" @cancel="customerClose"
							@confirm="customerConfirm"></u-picker>
					</view>
					<!--  -->
					<view class="add-inputs">
						<view class="inputs-label">关联采购计划单</view>
						<view class="inputs-content select" @click="procurementShow = true">
							<view class="name">{{ procurementObject.orderCode }}</view>
							<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
						</view>
						<u-picker :show="procurementShow" :columns="procurementList" keyName="orderCode" @cancel="outgoingClose"
							@confirm="procurementConfirm"></u-picker>
					</view>
					<!-- <view class="add-inputs">
            <view class="inputs-label">负责人</view>
            <u--input placeholder="请输入内容" border="none" v-model="rowData.leaderName" customStyle="" class="form-content"
              clearable></u--input>
          </view> -->
					<view class="add-inputs">
						<view class="inputs-label">业务时间</view>
						<view class="inputs-content select" @click="dateShow = true">
							<view class="name">{{ presentationTime }}</view>
							<u-icon name="calendar-fill" class="icons" color="#2a82e4" size="12"></u-icon>
						</view>
						<u-datetime-picker :show="dateShow" v-model="value1" @cancel="dateShow = false" @confirm="dateSelect"
							mode="datetime"></u-datetime-picker>
					</view>
					<!-- <view class="add-inputs">
            <view class="inputs-label">关联项目</view>
            <view class="select" @click="receiveShow = true">
              <view class="name">{{ receiverData.itemName }}</view>
              <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
            </view>
            <u-picker :show="receiveShow" :columns="receiverList" keyName="itemName" @cancel="receiveClose"
              @confirm="receiveConfirm"></u-picker>
          </view> -->
					<view class="add-inputs">
						<view class="inputs-label">备注</view>
						<view class="inputs-content">
							<u--textarea v-model="rowData.remark" placeholder="请输入内容" autoHeight border="none"
								maxlength="100"></u--textarea>
						</view>
					</view>
				</view>
			</view>
			<view class="table_detail" v-show="current == 1" style="margin-top: 2px">
				<table>
					<thead>
						<tr>
							<th style="width: 40px">序号</th>
							<th>物料名称</th>
							<th>物料类型</th>
							<th>单位</th>
							<th>申请数量</th>
							<th>单价</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in details" :key="index" @click="itemClick(item, index)">
							<td>{{ index + 1 }}</td>
							<td>{{ item.materialName }}</td>
							<td>{{ item.fkTypeName }}</td>
							<td>{{ item.fkUnitName }}</td>
							<td>{{ item.applyNum }}</td>
							<td>{{ item.price }}</td>
						</tr>
					</tbody>
				</table>
				<view class="table-btn" @click="tableAdd" v-if="!this.procurementObject.orderCode">添加物料</view>
			</view>
		</view>
		<view class="box-btn" v-if="current == 0">
			<!-- <u-button style="background: #eeeeee" class="btns cancle" type="default" text="取消" @click="abrogate"></u-button> -->
			<u-button class="btns" type="primary" text="下一步" @click="nextStep"></u-button>
		</view>
		<view class="box-btn" v-else>
			<u-button style="background: #eeeeee" class="btns cancle" type="default" text="上一步" @click="lastStep"></u-button>
			<u-button class="btns" type="primary" text="保存草稿" @click="preserve(0)"></u-button>
			<u-button class="btns" type="success" text="保存提交" @click="preserve(1)"></u-button>
		</view>
		<u-popup :show="showLinkPop">
			<view class="showLinkPop">
				<view class="head">
					<view class="name">{{ showLinkTitle }}</view>
					<u-icon name="close" color="#fff" class="closeBtn" @click="closeLinkPop"></u-icon>
				</view>
				<view class="content">
					<view>
						<view class="form-title">物料</view>
						<view class="select" @click="materialTypeSearch()">
							<view class="name">{{ materialData.materialName }}</view>
							<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
						</view>
					</view>
					<!-- <view>
            <view class="form-title">当前库存</view>
            <u--input placeholder="" border="none" v-model="materialData.supplyNum" customStyle="" suffixIcon="lock-fill"
              disabled class="form-content" clearable></u--input>
          </view> -->
					<view>
						<view class="form-title">申请数量</view>
						<u--input placeholder="请输入内容" border="none" type="number" v-model="materialData.applyNum" customStyle=""
							class="form-content" clearable></u--input>
					</view>
					<view>
						<view class="form-title">物料单价</view>
						<u--input placeholder="请输入内容" border="none" type="number" v-model="materialData.price" customStyle=""
							class="form-content" clearable></u--input>
					</view>
				</view>
				<view class="footer" v-if="showLinkTitle == '新增物料'">
					<u-button class="btns cancle" type="default" text="取消" @click="closeLinkPop"></u-button>
					<u-button class="btns" type="primary" text="添加" @click="addition"></u-button>
				</view>
				<view class="footer" v-else>
					<u-button class="btns cancle" type="default" text="取消" @click="closeLinkPop"></u-button>
					<u-button class="btns" type="error" text="删除" @click="expurgate"></u-button>
					<u-button class="btns" type="primary" text="保存" @click="modification"></u-button>
				</view>
			</view>
		</u-popup>
		<materialSelect :treeData="treeData" ref="materialSelect" @checked="checked"></materialSelect>
	</view>
</template>

<script>
	import moment from "moment";
	import materialSelect from "@/components/material-select/material-select.vue";
	export default {
		components: {
			materialSelect,
		},
		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
			},
		},
		data() {
			return {
				list1: [{ name: "基础信息" }, { name: "物料信息" }],
				rowData: {},
				details: [],
				current: 0,
				contractDetails: {},

				// =============
				dateShow: false,
				value1: Number(new Date()),
				presentationTime: "",
				receiverList: [], //关联单位
				receiverData: {},
				receiveShow: false, //关联项目弹窗状态
				showLinkPop: false,
				showLinkTitle: "",
				// selectShow: false,
				typeList: [],
				indexList: [],
				itemData: {},
				materialList: [],
				recordLis: [],
				materialData: {},
				typeCode: "",
				treeData: [],
				detailsIndex: 0,
				outgoingObjectList: [],
				outgoingObject: {},
				outgoingObjectShow: false,
				procurementObject: {
					orderCode: ""
				},
				procurementList: [],
				procurementShow: false,
				// 
				fkCustomerShow: false,
				fkCustomerData: {},
				fkCustomerList: []
			};
		},
		onLoad(item) {
			this.rowData = JSON.parse(item.row);
			if (this.rowData.itemTitle == "编辑物资申请") {
				console.log(this.rowData);
				this.details = this.rowData.materialDetailsVoList;
				this.details.forEach(item => {
					item.pkId = item.fkMaterialId;
					item.price = item.materialPrice;
				});

				this.presentationTime = this.rowData.serviceTime;
				// console.log("hahahahhahahahahdddddddddddddddd")
				// console.log(this.rowData.reOutApplyVoList)
				// console.log("hahahahhahahahahdddddddddddddddd")
				if (this.rowData.reOutApplyVoList.length != 0) {
					this.procurementObject.orderCode = this.rowData.reOutApplyVoList[0].purchaseOrderCode;
					this.procurementObject.pkId = this.rowData.reOutApplyVoList[0].fkPurchaseId;
				}
				this.fkCustomerData = {
					customName: this.rowData.customName,
					pkId: this.rowData.fkCustomerId,
				};


				// issueCode
				// this.receiverData.itemName = this.rowData.itemName;
				// this.receiverData.pkId = this.rowData.fkItemIds.toString();
				// this.typeCode = this.rowData.orderCode;
			} else {
				this.getBusinessCode();
			}
			this.init();
			this.findDictBySupplyType();
			this.findDictProjectId();
		},
		methods: {
			customerClose() {
				this.fkCustomerShow = false;
			},
			customerConfirm(e) {
				if (e.value[0] == undefined) {
					return this.fkCustomerShow = false;
				}
				this.fkCustomerData = e.value[0];
				this.fkCustomerShow = false;
				// console.log("Xxxxxxxxxxxxxxxxxxxxxxx")
				// console.log(e.value[0])
				// console.log("Xxxxxxxxxxxxxxxxxxxxxxx")
				// if (this.outgoingObject.keyName == 'delivery_subcontract') {
				//   this.searchProjCustomByType();
				// }
			},
			searchProjCustomByType() {
				let data = {
					bidProjectId: uni.getStorageSync("nowProId"),
					customType: 4,
					isZero: 0,
					sourceType: 1
				};
				this.$api.searchProjCustomByType(data).then(res => {
					if (res.code == 200) {
						this.fkCustomerList = [res.data];
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}

				});
			},
			procurementConfirm(e) {
				console.log(e);
				if (e.value[0] == undefined) {
					return this.outgoingObjectShow = false;
				}
				this.procurementObject = e.value[0];
				e.value[0].materialDetailsVoList.forEach(item => {
					item.fkTypeName = item.materialTypeName;
					item.fkUnitName = item.unitName;
					item.applyNum = item.purchaseNum;
					item.pkId = item.fkMaterialId;
					// materialPrice
					// <td>{{ item.fkTypeName }}</td>
					//       <td>{{ item.fkUnitName }}</td>
					//       <td>{{ item.applyNum }}</td>
				});
				this.details = e.value[0].materialDetailsVoList;
				this.procurementShow = false;
			},
			findDictProjectId() {
				let data = {
					pageNum: 1,
					pageSize: 10000,
					fkBidProjectId: uni.getStorageSync("nowProId")
				};
				this.$api.findDictProjectId(data).then(res => {
					if (res.code == 200) {
						this.procurementList = [res.data];
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			outgoingClose() {
				this.outgoingObjectShow = false;
				this.procurementShow = false;
			},
			outgoingConfirm(e) {
				if (e.value[0] == undefined) {
					return this.outgoingObjectShow = false;
				}
				this.outgoingObject = e.value[0];
				this.outgoingObjectShow = false;
				console.log("Xxxxxxxxxxxxxxxxxxxxxxx");
				console.log(e.value[0]);
				console.log("Xxxxxxxxxxxxxxxxxxxxxxx");
				if (this.outgoingObject.keyName == "delivery_subcontract") {
					this.searchProjCustomByType();
				}
			},
			findDictBySupplyType() {
				this.$api.findDictBySupplyType().then(res => {
					if (res.code == 200) {
						this.outgoingObjectList = [res.data];
						if (this.rowData.itemTitle == "编辑物资申请") {
							console.log("Xxxxxxxxxxxxxxxxxxxxxxx");
							console.log(this.rowData.issueCode);
							console.log("Xxxxxxxxxxxxxxxxxxxxxxx");
							// if()
							res.data.forEach(item => {
								// console.log()
								if (this.rowData.issueCode == item.keyName) {
									this.outgoingObject = item;
									// debugger
								}
							});
						}
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			getBusinessCode() {
				this.$api.getBusinessCode({ businessType: 2 }).then(res => {
					if (res.code == 200) {
						this.typeCode = res.data.typeCode;
						this.rowData.orderCode = res.data.typeCode;
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			currentChange(item) {
				this.current = item.index;
				console.log(this.current);
			},
			init() {
				this.$api
					.getItemsByProjectId({ projectId: uni.getStorageSync("nowProId") })
					.then(res => {
						if (res.code == 200) {
							this.receiverList = [res.data];
						} else {
							uni.showToast({ icon: "none", title: res.msg });
						}
					});
			},

			// 接收单位
			receiveClose() {
				this.receiveShow = false;
			},
			// 接收单位
			receiveConfirm(e) {
				this.receiverData = e.value[0];
				this.receiveShow = false;
			},

			// 业务时间
			dateSelect(e) {
				this.presentationTime = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
				this.dateShow = false;
			},
			// 取消新增修改
			abrogate() {
				uni.navigateBack();
			},
			// 下一步
			nextStep() {
				this.current = 1;
			},
			// 上一步
			lastStep() {
				this.current = 0;
			},
			// 保存
			preserve(val) {
				if (this.details.length == 0) {
					return uni.showToast({ icon: "none", title: "物料信息不能为空" });
				}
				let data = {
					applyCode: val,
					// fkItemIds:this.receiverData.pkId==null?[]:[this.receiverData.pkId],
					fkBidProjectId: uni.getStorageSync("nowProId"),
					// isUpdate: "0",
					leaderName: this.rowData.leaderName ? this.rowData.leaderName : this.user.realName,

					orderCode: this.rowData.orderCode,
					serviceTime: this.presentationTime,
					remark: this.rowData.remark,
					issueCode: this.outgoingObject.keyName,
					fkPurchaseId: this.procurementObject.pkId == undefined ? "" : this.procurementObject.pkId,
				};
				if (this.outgoingObject.keyName == "delivery_subcontract" && (this.fkCustomerData.pkId == undefined || this
						.fkCustomerData.pkId == null || this.fkCustomerData.pkId.length == 0)) {
					// this.searchProjCustomByType();
					// 
					return uni.showToast({ icon: "none", title: "请选择分包单位" });
				}
				if (this.outgoingObject.keyName == "delivery_subcontract") {
					data.fkCustomerId = this.fkCustomerData.pkId;
				}
				data.isUpdate = this.typeCode == this.rowData.orderCode ? 0 : 1;
				let arr = [];
				this.details.forEach(item => {
					arr.push({
						applyNum: item.applyNum,
						fkMaterialId: item.pkId,
						providedNum: item.providedNum,
					});
				});
				data.materialDetailList = arr;

				if (this.rowData.itemTitle != "编辑物资申请") {
					this.$api.orderOutApplyAdd(data).then(res => {
						if (res.code == 200) {
							uni.showToast({ icon: "none", title: "新增成功" });
							setTimeout(() => {
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 2]; // 上一页面实例
								prevPage.$vm.resh();
								uni.navigateBack();
							}, 500);

						} else {
							uni.showToast({ icon: "none", title: res.msg });
						}
					});
				} else {
					data.isUpdate = 0;
					delete data.fkBidProjectId;
					data.pkId = this.rowData.pkId;
					this.$api.orderOutApplyUpdate(data).then(res => {
						if (res.code == 200) {

							uni.showToast({ title: "编辑成功" });
							setTimeout(() => {
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 3]; // 上一页面实例
								prevPage.$vm.resh(); // 调用上一页 定义的方法
								uni.navigateBack({ delta: 2 });
							}, 500);
						} else {
							uni.showToast({ icon: "none", title: res.msg });
						}
					});
				}
			},
			// 添加物料
			tableAdd() {
				this.materialData = {};
				this.showLinkTitle = "新增物料";
				this.showLinkPop = true;
			},
			// 编辑物料
			itemClick(item, idx) {
				this.detailsIndex = idx;
				this.materialData = item;
				this.showLinkTitle = "编辑物料";
				this.showLinkPop = true;
			},
			closeLinkPop() {
				this.showLinkPop = false;
			},
			// 物料类型
			materialTypeSearch() {
				if (this.outgoingObject.keyVal == undefined || this.outgoingObject.keyVal.length == 0) {
					return uni.showToast({ icon: "none", title: "请选择出库对象" });
				}
				if (this.outgoingObject.keyName == "delivery_subcontract" && (this.fkCustomerData.pkId == undefined || this
						.fkCustomerData.pkId == null || this.fkCustomerData.pkId.length == 0)) {
					return uni.showToast({ icon: "none", title: "请选择分包单位" });
				}
				this.selectMaterial();
				this.$refs.materialSelect.selectShow = true;
				if (this.materialData.fkTypeName == undefined || this.materialData.fkTypeName.length == 0) {
					this.$refs.materialSelect.treeData2 = [];
					this.$refs.materialSelect.checkedList = [];
				}
			},
			// 查询物料
			selectMaterial() {
				let data = {
					pageNum: 1,
					pageSize: 1000,
					type: 1,
					materialTypeId: this.itemData.pkId,
					fkBidProjectId: uni.getStorageSync("nowProId"),
					outTypeCode: this.outgoingObject.keyName,
					materialTypeCode: this.details.length ? this.details[0].typeCode : ""
				};

				if (this.outgoingObject.keyName == "delivery_subcontract") {
					data.fkCustomId = this.fkCustomerData.pkId;
				}
				this.$api.searchMaterialPage(data).then(res => {
					if (res.code == 200) {
						// res.data.records.forEach((item) => {
						//   item.itemName = item.fkTypeName;
						// });

						this.treeData = res.data;
						// this.indexList = res.data.records;
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			// 物资选中回调
			checked(item) {
				console.log(item);
				this.materialData = item;
			},
			// 删除物料
			expurgate() {
				this.details.splice(
					this.details.findIndex(item => item.pkId === this.materialData.pkId),
					1
				);
				this.showLinkPop = false;
			},
			modification() {
				if (this.materialData.applyNum == undefined || this.materialData.applyNum == null || this.materialData.applyNum
					.length == 0) {
					return uni.showToast({ icon: "none", title: "请填写申请数量" });
				}
				if (this.materialData.applyNum == 0) {
					return uni.showToast({ icon: "none", title: "申请数量不能为0" });
				}
				if (this.materialData.price == undefined || this.materialData.price == null || this.materialData.price.length ==
					0) {
					return uni.showToast({ icon: "none", title: "请填写物料单价" });
				}
				this.details[this.detailsIndex] = this.materialData;
				this.showLinkPop = false;
			},
			// 添加物料
			addition() {
				if (this.materialData.materialName == undefined || this.materialData.materialName.length == 0) {
					return uni.showToast({ icon: "none", title: "请选择物料" });
				}
				if (this.materialData.applyNum == undefined || this.materialData.applyNum == null || this.materialData.applyNum
					.length == 0) {
					return uni.showToast({ icon: "none", title: "请填写申请数量" });
				}

				if (this.materialData.price == undefined || this.materialData.price == null || this.materialData.price.length ==
					0) {
					return uni.showToast({ icon: "none", title: "请填写物料单价" });
				}
				if (this.materialData.applyNum == 0) {
					return uni.showToast({ icon: "none", title: "申请数量不能为0" });
				}
				let hasId1 = this.details.find(item => item.pkId === this.materialData.pkId);
				if (hasId1 == undefined) {
					this.details.push(this.materialData);
					this.closeLinkPop();
				} else {
					return uni.showToast({ icon: "none", title: "列表已存在该物料" });
				}
				// this.details.push(this.materialData);
				// this.closeLinkPop();
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

	.item-edit-form {
		padding: 8px 16px;
		background: rgb(255, 255, 255);
		margin-top: 2px;
	}

	.form-title {
		margin-left: 20rpx;
		line-height: 60rpx;
	}

	.form-content {
		height: 80rpx;
		background: #fff;
	}

	.select {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		padding: 0 20rpx;
		background-color: #fff;
	}

	.name {
		width: 520rpx;
		// margin-bottom: 20rpx;
		font-weight: 600;
		font-size: 30rpx;
		overflow: hidden;
		/*超出部分隐藏*/
		white-space: nowrap;
		/*禁⽌换⾏*/
		text-overflow: ellipsis;
		/*省略号*/
	}

	.box-btn {
		display: flex;
		position: fixed;
		width: 100%;
		bottom: 0;
	}

	.table-btn {
		display: inline-block;
		background: #ebf4ff;
		color: #2b8fed;
		font-size: 10px;
		padding: 6px 23px;
		margin: 6px auto;
		margin-left: 41%;
	}

	.showLinkPop {
		height: 800rpx;
		background-color: #2a82e4;

		.head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80rpx;
			// line-height: 80rpx;
			padding: 0 20rpx;
			color: #fff;
			font-size: 28rpx;
		}

		.content {
			height: 620rpx;
			background-color: #f7f7ff;
			padding-top: 30rpx;
			font-size: 28rpx;
			border-radius: 20rpx 20rpx 0 0;

			.title {
				padding-left: 20rpx;
				font-weight: 600;
				margin-bottom: 10rpx;
			}

			.inputs {
				display: flex;
				align-items: center;
				height: 80rpx;
				padding: 0 20rpx;
				background-color: #fff;
				margin-bottom: 20rpx;
			}

			.searchRes {
				overflow: auto;
				height: 400rpx;
				background-color: #fff;
			}

			.loading {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.footer {
			display: flex;
			bottom: 0;
			justify-content: space-evenly;
			align-items: center;
			height: 100rpx;
			background-color: #fff;

			.btns {
				width: 300rpx;
				margin: 2px;
			}

			.cancle {
				background-color: #eeeeee;
				color: #aaaaaa;
			}
		}
	}

	.selectShow {
		height: 800rpx;

		.head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80rpx;
			// line-height: 80rpx;
			padding: 0 20rpx;
			font-size: 28rpx;
		}

		.content {
			border-top: 1px solid;
		}
	}

	/deep/ .u-input--square {
		// text-indent: 12px;
		padding-left: 12px;
	}
</style>