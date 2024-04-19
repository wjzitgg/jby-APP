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
							<u--textarea v-model="rowData.customName" placeholder="请输入内容" autoHeight maxlength="50"
								border="none"></u--textarea>
						</view>
					</view>
					<!-- <view>
            <view class="inputs-label">负责人</view>
            <u--input placeholder="请输入内容" border="none" v-model="rowData.leaderName" customStyle="" class="form-content"
              clearable></u--input>
          </view> -->
					<view class="add-inputs">
						<view class="inputs-label">业务时间</view>
						<view class="inputs-content select" @click="dateShow = true">
							<view class="name">{{ presentationTime }}</view>
							<u-icon name="calendar-fill" class="icons" color="#2a82e4" size="20"></u-icon>
						</view>
						<u-datetime-picker :show="dateShow" v-model="value1" @cancel="dateShow = false" @confirm="dateSelect"
							mode="datetime"></u-datetime-picker>
					</view>
					<view class="add-inputs">
						<view class="inputs-label">关联项目</view>
						<!-- <view class="select" @click="receiverClick">
              <view class="name">{{ receiverData.itemName }}</view>
              <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
            </view> -->
						<!-- <u-picker :show="receiveShow" :columns="receiverList" keyName="itemName" @cancel="receiveClose"
              @confirm="receiveConfirm"></u-picker> -->
						<view class="inputs-fileList">
							<view class="inputs-fileList-item" v-for="(item, index) in receiverDataList" :key="index">
								<u-icon class="icons" name="file-text" size="24"></u-icon>
								<view class="name text-hidden">{{ item.itemName }}</view>
							</view>
							<view class="fileListBtn">
								<view class="addBtn" @click="receiverClick">添加</view>
							</view>
							<!-- <u-button text="添加" class="add-coder" @click="receiverClick"></u-button> -->
						</view>
						<u-popup :show="receiveShow" @close="receiveShow = false">
							<view class="selectShow">
								<view class="head">
									<view class="name">关联项目</view>
									<view class="closeBtn" @click="requestConfirmation" style="color: #3c9cff">确认</view>
								</view>
								<view class="content">
									<!-- <view>  -->
									<tree ref="weert" class="price-amount" :wipeStatus="true" :selectedData="viewAuthorize"
										:localdata="receiverList" :associatedNode="false" valueKey="pkId" textKey="itemName"
										childrenKey="children"></tree>
									<!-- <u-checkbox-group style="margin: 8px" v-model="checkboxValue2" placement="column">
                      <u-checkbox :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in checkboxList2"
                        :key="index" :label="item.orderCode" :name="item.pkId">
                      </u-checkbox>
                    </u-checkbox-group> -->
									<!-- </view> -->
								</view>
							</view>
						</u-popup>
					</view>
					<view class="add-inputs">
						<view class="inputs-label">备注</view>
						<view class="inputs-content">
							<u--textarea v-model="rowData.remark" placeholder="请输入内容" autoHeight maxlength="100"
								border="none"></u--textarea>
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
							<th>物料分类</th>
							<th>当前库存</th>
							<th>单位</th>
							<th>申请数量</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in details" :key="index" @click="itemClick(item, index)">
							<td style="color: #2b8fed;">{{ index + 1 }}</td>
							<td>{{ item.materialName }}</td>

							<td>{{ item.fkTypeName }}</td>
							<td>{{ item.supplyNum }}</td>

							<td>{{ item.fkUnitName }}</td>
							<td>{{ item.applyNum }}</td>
						</tr>
					</tbody>
				</table>
				<view class="table-btn" @click="tableAdd">添加物料</view>
			</view>
		</view>
		<view class="box-btn" v-if="current == 0">
			<u-button style="background: #eeeeee" class="btns cancle" type="default" text="取消" @click="abrogate"></u-button>
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
						<view class="inputs-label">物料</view>
						<view class="select" @click="materialTypeSearch()">
							<view class="name">{{ materialData.fkTypeName }}</view>
							<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
						</view>
					</view>
					<view>
						<view class="inputs-label">当前库存</view>
						<u--input placeholder="" border="none" v-model="materialData.supplyNum" customStyle=""
							suffixIcon="lock-fill" disabled class="form-content" clearable></u--input>
					</view>
					<view>
						<view class="inputs-label">申请数量</view>
						<u--input placeholder="请输入内容" border="none" type="number" v-model="materialData.applyNum" customStyle=""
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
	// import tree from "@/components/ba-tree-picker/ba-tree-pickerpicker.vue";
	import tree from "../../components/ba-tree-picker-relevance/ba-tree-picker.vue";
	export default {
		components: {
			materialSelect,
			tree
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
				viewAuthorize: [],
				receiverDataList: []
			};
		},
		onLoad(item) {
			this.rowData = JSON.parse(item.row);
			if (this.rowData.itemTitle == "编辑物资申请") {
				this.details = this.rowData.orderApplyMaterialDetails;
				this.details.forEach(item => {
					item.pkId = item.fkMaterialId;
					// item.fkTypeName = item.materialName
					item.fkUnitName = item.unitName;
				});
				this.presentationTime = this.rowData.serviceTime;
				this.receiverData.itemName = this.rowData.itemName;
				this.receiverData.pkId = this.rowData.fkItemIds.toString();
				this.typeCode = this.rowData.orderCode;
			} else {
				this.getBusinessCode();
			}
			this.init();
		},
		methods: {
			receiverClick() {
				this.receiveShow = true;
				this.$nextTick(() => {
					this.$refs.weert._initTree();
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
				// searchItemsByProjectId
				// this.$api
				//   .getItemsByProjectId({ projectId: uni.getStorageSync("nowProId") })
				//   .then((res) => {
				//     if (res.code == 200) {
				//       this.receiverList = [res.data];
				//     } else {
				//       uni.showToast({ icon: "none", title: res.msg });
				//     }
				//   });
				let data = {
					projectId: uni.getStorageSync("user").orgType == 5 ? "" : uni.getStorageSync("nowProId"),
					filterStatus: uni.getStorageSync("user").orgType == 7 ? 1 : "",
					isOut: uni.getStorageSync("user").orgType == 7 ? 0 : "",
				};
				this.$api.searchItemsByProjectId(data).then(res => {
					if (res.code == 200) {
						this.receiverList = res.data;
						console.log("Xxxxxxxxxxxxxxxxxxxxx");
						// console.log(this.receiverList)
						// this.receiverList = [
						//   {itemName:"sd",
						//   pkId:"2",
						//   children:[{itemName:"13",pkId:"3"}],},
						//   {itemName:"sd3",children:[{itemName:"12",pkId:"13"}],pkId:"12"},
						// ]
						// console.log("Xxxxxxxxxxxxxxxxxxxxx")
						if (this.rowData.itemTitle == "编辑物资申请") {
							this.fkItemIds();
						}
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			fkItemIds() {
				if (this.rowData.fkItemIds != undefined && this.rowData.fkItemIds != null && this.rowData.fkItemIds.length !=
					0) {
					// debugger
					this.receiverDataList = [];
					this.viewAuthorize = this.rowData.fkItemIds;
					let arr = this.flatTreeData(this.receiverList);

					arr.forEach(item => {
						this.viewAuthorize.forEach(e => {
							if (item.pkId == e) {
								this.receiverDataList.push(item);
							}
						});
					});
				}
			},


			// 接收单位
			receiveClose() {
				this.receiveShow = false;
			},
			// 接收单位
			requestConfirmation() {
				this.receiverDataList = [];
				this.viewAuthorize = this.$refs.weert._confirm();
				let arr = this.flatTreeData(this.receiverList);
				arr.forEach(item => {
					this.viewAuthorize.forEach(e => {
						if (item.pkId == e) {
							this.receiverDataList.push(item);
						}
					});
				});
				this.receiveShow = false;
			},
			flatTreeData(list) {
				const res = [];

				function getData(list) {
					list.forEach(item => {
						res.push(item);
						if (item.children) {
							getData(item.children);
						}
					});
				}
				getData(list);
				return res;
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
					fkItemIds: this.viewAuthorize,
					fkBidProjectId: uni.getStorageSync("nowProId"),
					// isUpdate: "0",
					leaderName: this.rowData.leaderName,
					orderCode: this.rowData.orderCode,
					serviceTime: this.presentationTime,
					remark: this.rowData.remark,
				};
				// return  console.log(this.viewAuthorize)
				data.isUpdate = this.typeCode == this.rowData.orderCode ? 0 : 1;
				let arr = [];
				this.details.forEach(item => {
					arr.push({
						applyNum: item.applyNum,
						fkMaterialId: item.pkId,
						providedNum: item.providedNum,
					});
				});
				data.orderApplyMaterialDetails = arr;
				// fkItemIds
				if (this.rowData.itemTitle != "编辑物资申请") {
					this.$api.orderApplyAdd(data).then(res => {
						if (res.code == 200) {
							// uni.navigateTo({
							//   url: "/pages/material/apply?",
							// });
							uni.showToast({ title: "新增成功" });
							setTimeout(() => {
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 2]; // 上一页面实例
								prevPage.$vm.resh(); // 调用上一页 定义的方法
								uni.navigateBack({ delta: 1 });
							}, 500);


						} else {
							uni.showToast({ icon: "none", title: res.msg });
						}
					});
				} else {
					data.pkId = this.rowData.pkId;
					this.$api.orderApplyUpdate(data).then(res => {
						if (res.code == 200) {
							// uni.navigateTo({
							//   url: "/pages/material/apply?",
							// });
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
				this.selectMaterial();
				this.$refs.materialSelect.selectShow = true;
				if (this.materialData.fkTypeName == undefined || this.materialData.fkTypeName.length == 0) {
					this.$refs.materialSelect.treeData2 = [];
					this.$refs.materialSelect.checkedList = [];
				}

				// checkedList: [], // 已选中 用来展示选中一二三级
				// treeData2: [] // 用来展示选择tree children 的数据
			},
			// 查询物料
			selectMaterial() {
				let data = {
					pageNum: 1,
					pageSize: 1000,
					type: 1,
					materialTypeId: this.itemData.pkId,
					fkBidProjectId: uni.getStorageSync("nowProId"),
					materialTypeCode: this.details.length ? this.details[0].typeCode : ""
				};
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
				this.details[this.detailsIndex] = this.materialData;
				this.showLinkPop = false;
			},
			// 添加物料
			addition() {
				if (this.materialData.fkTypeName == undefined || this.materialData.fkTypeName.length == 0) {
					return uni.showToast({ icon: "none", title: "请选择物料" });
				}
				if (this.materialData.applyNum == undefined || this.materialData.applyNum.length == 0) {
					return uni.showToast({ icon: "none", title: "请填写申请数量" });
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

	.multiSelect {
		background-color: #fff;
		padding: 10rpx 0;
		padding-left: 40rpx;

		.item-code {
			display: flex;
			align-items: center;
			line-height: 100rpx;
			border-bottom: 1px solid #eee;

			.fileName {
				width: 600rpx;
				font-size: 28rpx;
			}
		}

		.add-coder {
			width: 160rpx;
			height: 60rpx;
			margin-top: 19rpx;
			background-color: #ebf4ff;
			color: #2b8fed;
			display: inline-grid;
		}
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

	/deep/ .uni-input-input,
	/deep/ .uni-input-placeholder {
		padding-left: 12px;
	}
</style>