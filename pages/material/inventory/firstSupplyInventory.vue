<template>
	<view class="wrapper">
		<u-navbar leftText="甲供库存" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view :class="{pad:!searchTag.length,pad2:searchTag.length}"></view>
		<view class="sticky">
			<view class="search">
				<view class="search-input">
					<u-input placeholder="请输入物料名称" border="none" v-model="searchDate.materialName" maxlength="50">
						<view slot="suffix"><u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon></view>
					</u-input>
				</view>
				<filterBtn @click="openPop" :nums="searchTag.length"></filterBtn>
				<!-- <view class="more-search" @click="openPop">
					<image src="../../../static/image/u486.png" mode="widthFix" class="filterImg" />
					<view>筛选</view>
				</view> -->
			</view>
			<searchTag :tagList="searchTag" @closeTag="closeTag"></searchTag>
		</view>
		<view class="content">
			<view class="table_detail table_empty">
				<table>
					<thead>
						<tr>
							<th style="width: 40px"><u-icon name="list" style="display: inline-block"></u-icon></th>
							<th>分包单位</th>
							<th>物料名称</th>
							<th>物料分类</th>
							<th>仓库</th>
							<th>单位</th>
							<th>供货量</th>
							<th>退货量</th>
							<th>使用量</th>
							<th>盘盈量</th>
							<th>盘亏量</th>
							<th>库存数量</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in tablelist" :key="index">
							<td><text class="clickTd" @click="detail(item)">{{ index + 1 }}</text></td>
							<td>{{ item.customName }}</td>
							<td>{{ item.materialName }}</td>
							<td>{{ item.materialTypeName }}</td>
							<td>{{ item.warehouseName }}</td>
							<td>{{ item.unitName }}</td>
							<td>{{ item.supplyNum }}</td>
							<td>{{ item.backNum }}</td>
							<td>{{ item.useNum }}</td>
							<td>{{ item.inventoryProfit }}</td>
							<td>{{ item.inventoryLosses }}</td>
							<td>{{ item.stockNum }}</td>
						</tr>
					</tbody>
				</table>
				<u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
			</view>
		</view>
		<u-popup :show="showPop" @close="closePop" mode="right" class="pop-bgImg" bgColor="rgba(255, 255, 255, 0)">
			<view class="popup">
				<view class="tip">请选择筛选条件</view>
				<view class="popup-content">
					<view class="filter-title">分包商</view>
					<view class="filter-content mb-20">
						<easy-select ref="easySelect" size="mini" class="easySelect" :value="subcontractorName"
							@selectOne="selectOne" :options="subcontractorList"></easy-select>
					</view>
					<view class="filter-title">物料分类</view>
					<view class="filter-content">
						<easy-select ref="easySelect2" size="mini" :value="nowYear" @selectOne="selectOne2"
							:options="yearList"></easy-select>
					</view>
					<!-- <view class="search-item mb-20">
						<h5 class="mb-20">分包商：</h5>
						<view class="">
							<easy-select ref="easySelect" size="mini" class="easySelect" :value="subcontractorName" @selectOne="selectOne" :options="subcontractorList"></easy-select>
						</view>
					</view>
					<view class="search-item">
						<h5 class="mb-20">物料分类：</h5>
						<view class=""><easy-select ref="easySelect2" size="mini" :value="nowYear" @selectOne="selectOne2" :options="yearList"></easy-select></view>
					</view> -->
				</view>
			</view>
			<!-- <view class="footer">
					<view class="footerBtn cancel" @click="closePop">取消</view>
					<view class="footerBtn add" @click="searchOk">确认</view>
				</view> -->
			<view class="pop-footer-btn">
				<view class="btns btnReset" @click="closePop">取消</view>
				<view class="btns btnOk" @click="searchOk">确定</view>
			</view>
			<!-- <u-picker
		    :show="pickShow"
		    :columns="[pickList]"
		    @confirm="pickConfirm"
		    keyName="label"
		    @cancel="pickCancel"
		  ></u-picker> -->
			<uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" />
		</u-popup>
	</view>
</template>

<script>
	import filterBtn from "../../../components/search-tag/filter-btn.vue";
	import searchTag from "../../../components/search-tag/search-tag.vue";
	export default {
		components: { filterBtn, searchTag },
		data() {
			return {
				current: 0,
				tabShow: false,

				searchDate: {
					customId: "",
					materialTypeId: "", //物料分类id
					materialName: "" //物料名称
				},
				fkWarehouseId: "",
				typeList: ["盘盈入库", "盘亏出库", "退货入库", "退货出库", "来料入库", "供料出库", "用料出库", "余料入库"],
				clickDate: "",
				caleType: 1,
				tablelist: [],
				pageNum: 1,
				total: 0,
				showPop: false, // 控制筛选
				yearList: [],
				subcontractorList: [], // 分包商
				nowYear: "全部物料类型",
				subcontractorName: "全部", // 分包商
				searchTag: [],
				fkBidProjectId: ""
			};
		},
		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
			},
		},
		onLoad(options) {
			this.searchPutInventoryPage();
			this.searchMaterialType();
			this.customSearchByProOrgId();
		},
		methods: {
			setTagList() {
				let arr = [];
				if (this.searchDate.customId) {
					console.log(this.searchDate.customId, !!this.searchDate.customId);
					arr.push({ key: "customId", value: this.subcontractorName });
				}
				if (this.searchDate.materialTypeId) {
					arr.push({ key: "materialTypeId", value: this.nowYear });
				}
				console.log(arr);
				this.searchTag = arr;
			},
			closeTag(row) {
				this.searchDate[row.key] = "";
				console.log(this.searchDate[row.key]);
				if (row.key == "customId") {
					this.subcontractorName = "全部";
				}
				if (row.key == "materialTypeId") {
					this.nowYear = "全部物料类型";
				}
				this.setTagList();
				this.searchPutInventoryPage();
			},
			searchOk() {
				this.pageNum = 1;
				this.setTagList();
				this.searchPutInventoryPage();
				this.closePop();
			},
			selectOne2(e) {
				this.nowYear = e.options.label;
				this.searchDate.materialTypeId = e.options.value;
				console.log("物料分类", this.searchDate.materialTypeId);
			},
			selectOne(e) {
				this.subcontractorName = e.options.label;
				this.searchDate.customId = e.options.value;
				console.log("分包商", this.searchDate.customId);
			},
			// 查物料类型
			searchMaterialType() {
				this.$api.searchMaterialType().then(res => {
					if (res.code == 200) {
						res.data.forEach(item => {
							item.label = item.typeName;
							item.value = item.pkId;
						});
						this.yearList = res.data;
						this.yearList.unshift({ label: "全部物料类型", value: "" });
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			customSearchByProOrgId() {
				this.$api.customSearchByProOrgId().then(res => {
					if (res.code == 200) {
						res.data.forEach(item => {
							item.label = item.customName;
							item.value = item.pkId;
						});
						this.subcontractorList = res.data;
						this.subcontractorList.unshift({ label: "全部", value: "" });
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
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
					this.searchDate.beginTime = e.fulldate;
				} else if (this.caleType === 2) {
					this.searchDate.endTime = e.fulldate;
				}
			},
			// 选择发起人
			selectItem(item, index) {
				console.log(item, index);
				if (item == "") {
					this.searchDate.customId = "";
				} else {
					this.searchDate.customId = index;
				}
			},
			closePop() {
				this.showPop = false;
			},
			// 获取表格数据

			searchPutInventoryPage() {

				let data = {
					pageNum: this.pageNum,
					pageSize: 50,
					...this.searchDate,
					projectId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowProId")
				};

				uni.showLoading({ mask: true });
				this.$api
					.warehouseMaterialList2(data)
					.then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							if (this.pageNum == 1) {
								this.tablelist = res.data.records;
							} else {
								this.tablelist = [...this.tablelist, ...res.data.records];
							}
							this.total = res.data.total - 0;
						} else {
							uni.showToast({ title: res.msg, icon: "none" });
						}
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			currentChange(e) {
				this.current = e.index;
				this.fkWarehouseId = e.pkId;
				this.pageNum = 1;
				this.searchPutInventoryPage();
			},
			// tab点击
			listSelet(item, index) {
				// 展开传值
				this.current = index;
				this.fkWarehouseId = item.pkId;
				this.pageNum = 1;
				this.searchPutInventoryPage();
				this.tabShow = false;
			},
			// 汉堡点击展开tabs
			hamburg() {
				this.tabShow = !this.tabShow;
			},
			shut() {
				this.tabShow = false;
			},
			openPop() {
				this.showPop = true;
			},
			search() {
				this.pageNum = 1;
				this.searchDate = { ...this.searchDate };
				this.searchPutInventoryPage();
			},
			detail(item) {
				console.log(item);
				uni.navigateTo({ url: "/pages/material/inventory/ledgerRecord?obj=" + JSON.stringify(item) });
			}
		}
	};
</script>
<style lang="scss" scoped>
	.pad {
		height: 88rpx;
	}

	.pad2 {
		height: 150rpx;
	}

	.pdb {
		height: 100rpx;
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

	.flow {
		overflow: auto;
		width: 750rpx;
	}

	.mb-20 {
		margin-bottom: 20rpx;
	}

	.sticky {
		z-index: 99;
	}

	.search {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		padding: 0 20rpx;

		.search-input {
			width: 540rpx;
			padding-left: 20rpx;
			border: 1px solid #b4d0f0;
			border-radius: 6rpx;
		}

		.more-search {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 160rpx;
			height: 60rpx;
			border: 1px solid #2a82e4;
			border-radius: 6rpx;
			font-size: 30rpx;
			color: #2a82e4;

			.filterImg {
				width: 36rpx;
				margin-right: 6rpx;
			}
		}
	}

	// .popup {
	// 	position: relative;
	// 	width: 600rpx;
	// 	/*#ifdef APP-PLUS*/
	// 	height: calc(100vh - 156rpx);
	// 	/*#endif*/
	// 	/*#ifdef H5*/
	// 	height: calc(100vh - 88rpx);
	// 	/*#endif*/
	// 	padding: 30rpx;
	// 	/*#ifdef APP-PLUS*/
	// 	margin-top: 156rpx;
	// 	/*#endif*/
	// 	/*#ifdef H5*/
	// 	margin-top: 88rpx;
	// 	/*#endif*/
	// 	background-color: #f2f2f2;
	// 	.popup-pad {
	// 		/*#ifdef APP-PLUS*/
	// 		height: 156rpx;
	// 		/*#endif*/
	// 		/*#ifdef H5*/
	// 		height: 88rpx;
	// 		/*#endif*/
	// 	}
	// 	.popup-content {
	// 		height: calc(100% - 100rpx);
	// 		overflow: auto;
	// 	}
	// 	.select {
	// 		display: flex;
	// 		justify-content: space-between;
	// 		align-items: center;
	// 		height: 60rpx;
	// 		padding: 0 20rpx;
	// 		background-color: #fff;
	// 		margin-bottom: 20rpx;
	// 	}
	// 	.title-item {
	// 		display: block;
	// 		font-weight: 600;
	// 		font-size: 28rpx;
	// 		margin: 36rpx 0;
	// 	}
	// 	.footer {
	// 		position: absolute;
	// 		left: 0;
	// 		bottom: 0;
	// 		display: flex;
	// 		width: 100%;
	// 		height: 100rpx;
	// 		.footerBtn {
	// 			width: 50%;
	// 			height: 100rpx;
	// 			line-height: 100rpx;
	// 			text-align: center;
	// 		}
	// 		.cancel {
	// 			background-color: #eeeeee;
	// 			color: #aaaaaa;
	// 		}
	// 		.add {
	// 			background-color: #1576e6;
	// 			color: #fff;
	// 		}
	// 	}
	// }
</style>