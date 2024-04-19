<template>
	<view class="wrapper">
		<u-navbar leftText="仓库台账" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="pad"></view>
		<view class="sticky">
			<u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="true" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}">
				<view slot="right" class="hamburg" @tap="hamburg"><u-icon name="list" size="21" bold></u-icon></view>
			</u-tabs>
			<view class="pull-down" v-show="tabShow">
				<text class="item-tab" :class="index == current ? 'action' : ''" v-for="(item, index) in tabList" :key="index" @click="listSelet(item, index)">{{ item.name }}</text>
				<!-- 箭头 -->
				<u-icon name="arrow-up" color="#dddddd" size="20" class="arrow-up" @click="shut"></u-icon>
			</view>
			<view class="search">
				<view class="search-input">
					<u-input placeholder="请输入关联单据" border="none" v-model="searchDate.urlCode" maxlength="50">
						<view slot="suffix"><u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon></view>
					</u-input>
				</view>
				<view class="more-search" @click="openPop">
					<image src="../../../static/image/u486.png" mode="widthFix" class="filterImg" />
					<view>筛选</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="table_detail table_empty">
				<table>
					<thead>
						<tr>
							<th style="width: 40px"><u-icon name="list" style="display: inline-block"></u-icon></th>
							<th v-if="user.orgType!=6&&user.orgType!=7">供应商</th>
							<th>关联单据</th>
							<th>变动类型</th>
							<th>物料类型</th>
							<th>变动时间</th>
							<th>物料名称</th>
							<th>变动前数量</th>
							<th>变动数量</th>
							<th>变动后数量</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in tablelist" :key="index">
							<td>{{ index + 1 }}</td>
							<td v-if="user.orgType!=6&&user.orgType!=7">{{ item.customName }}</td>
							<td>{{ item.urlCode }}</td>
							<td>{{ item.changeCode }}</td>
							<td>{{ item.materialTypeName }}</td>
							<td>{{ item.changeTime }}</td>
							<td>{{ item.materialName }}</td>
							<td>{{ item.beforeNum }}</td>
							<td>{{ item.num }}</td>
							<td>{{ item.afterNum }}</td>
						</tr>
					</tbody>
				</table>
				<u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
			</view>
		</view>
		<u-popup :show="showPop" @close="closePop" mode="right" class="opo" bgColor="rgba(255, 255, 255, 0)">
			<view class="popup">
				<view class="popup-content">
					<view class="search-item mb-20">
						<h5 class="mb-20">变动类型：</h5>
						<text class="pop-item" :class="searchDate.changeCode === '' ? 'active' : ''" @click="selectItem(1, '')">全部</text>
						<text class="pop-item" :class="{ active: index === searchDate.changeCode }" v-for="(item, index) in typeList" :key="index" @click="selectItem(item, index)">
							{{ item }}
						</text>
					</view>
					<view class="search-item">
						<h5 class="mb-20">变动日期</h5>
						<view class="search-datas">
							<view class="data-input">
								<view class="left" @click="openCale(1, searchDate.beginTime)">{{ searchDate.beginTime }}</view>
								<view class="closeBtn" @click="cleanDate(1)">X</view>
							</view>
							<view class="to">至</view>
							<view class="data-input" >
								<!-- {{ searchDate.endTime }} -->
								<view class="left" @click="openCale(2, searchDate.endTime)">{{ searchDate.endTime }}</view>
								<view class="closeBtn" @click="cleanDate(2)">X</view>
							</view>
						</view>
					</view>
				</view>
				<view class="footer">
					<view class="footerBtn cancel" @click="closePop">取消</view>
					<view class="footerBtn add" @click="searchOk">确认</view>
				</view>
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
export default {
	computed: {
    	user() {
    	  return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    	},
  	},
	data() {
		return {
			tabList: [{name:'全部',pkId:""}],
			current: 0,
			tabShow: false,
			searchDate: {
				urlCode: "",
				materialTypeId: "", //物料分类id
				materialName: "", //物料名称
				beginTime: "",
				endTime: "",
				changeCode: "" // 变动类型 0:盘盈入库 1:盘亏出库 2:退货入库 3:退货出库 4:来料入库 5:供料出库 6:用料出库 7:余料入库
			},
			fkWarehouseId: "",
			typeList: ["盘盈入库", "盘亏出库", "退货入库", "退货出库", "来料入库", "供料出库", "用料出库", "余料入库"],
			clickDate: "",
			caleType: 1,
			tablelist: [],
			pageNum: 1,
			total: 0,
			showPop: false // 控制筛选
		};
	},
	onLoad(options) {
		this.findWarehouseByProjectId();
	},
	methods: {
		searchOk() {
			this.pageNum = 1;
			this.searchPutInventoryPage();
			this.closePop();
		},
		// 清除时间
		cleanDate(e) {
			console.log(e);
			if (e == 1) {
				this.searchDate.beginTime = "";
			} else {
				this.searchDate.endTime = "";
			}
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
				this.searchDate.changeCode = "";
			} else {
				this.searchDate.changeCode = index;
			}
		},
		closePop() {
			this.showPop = false;
		},
		// 获取表格数据
		searchPutInventoryPage() {
			let data = {
				pageNum: this.pageNum,
				pageSize: 100,
				warehouseId: this.fkWarehouseId,
				fkBidProjectId:this.user.orgType === 5 || this.user.orgType === 6 || this.user.orgType === 7 ? "" : uni.getStorageSync("nowProId"),
				...this.searchDate
			};
			uni.showLoading({ mask: true });
			this.$api
				.ledger(data)
				.then(res => {
					uni.hideLoading();
					if (res.code === 200) {
						this.tablelist = res.data.records;
						this.total = res.data.total - 0;
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		// 获取仓库
		findWarehouseByProjectId() {
			this.$api.findWarehouseByProjectId({bidProjectId: this.user.orgType === 5 || this.user.orgType === 6  || this.user.orgType === 7  ? "0" : uni.getStorageSync("nowProId")}).then(res => {
				if (res.code === 200) {
					let arr = [{name:'全部',pkId:""},...res.data.map(item => ({ ...item, name: item.warehouseName }))];
					// this.tabList = [{ name: "其他仓库", pkId: "0" }, ...arr];
					this.tabList = arr;
					if (res.data.length) {
						this.fkWarehouseId = this.tabList[0].pkId;
						this.searchPutInventoryPage();
					}
				} else {
					uni.showToast({ title: res.msg, icon: "none" });
				}
			});
		},
		currentChange(e) {
			this.current = e.index;
			this.fkWarehouseId = e.pkId;
			this.searchPutInventoryPage();
		},
		// tab点击
		listSelet(item, index) {
			// 展开传值
			this.current = index;
			this.fkWarehouseId = item.pkId;
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
			uni.navigateTo({ url: "/pages/material/inventory/materialDetail?obj=" + JSON.stringify(item) });
		}
	}
};
</script>
<style lang="scss" scoped>
.pad {
	height: 178rpx;
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
.popup {
	position: relative;
	width: 600rpx;
	/*#ifdef APP-PLUS*/
	height: calc(100vh - 156rpx);
	/*#endif*/
	/*#ifdef H5*/
	height: calc(100vh - 88rpx);
	/*#endif*/
	padding: 30rpx;
	/*#ifdef APP-PLUS*/
	margin-top: 156rpx;
	/*#endif*/
	/*#ifdef H5*/
	margin-top: 88rpx;
	/*#endif*/
	background-color: #f2f2f2;
	.popup-pad {
		/*#ifdef APP-PLUS*/
		height: 156rpx;
		/*#endif*/
		/*#ifdef H5*/
		height: 88rpx;
		/*#endif*/
	}
	.popup-content {
		height: calc(100% - 100rpx);
		overflow: auto;
	}
	.select {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 60rpx;
		padding: 0 20rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
	}
	.title-item {
		display: block;
		font-weight: 600;
		font-size: 28rpx;
		margin: 36rpx 0;
	}
	.pop-item {
		display: inline-block;
		border: 1px solid #000;
		width: 170rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 30rpx;
		font-size: 28rpx;
		background-color: #fff;
		text-align: center;
		// background-color: #f6f6f6;
		border: 1px solid #eee;
		margin-bottom: 24rpx;
		margin-right: 8rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.active {
		color: #2a82e4 !important;
		background-color: #e6f7ff !important;
		border: 1px solid #2a82e4 !important;
	}
	.footer {
		position: absolute;
		left: 0;
		bottom: 0;
		display: flex;
		width: 100%;
		height: 100rpx;
		.footerBtn {
			width: 50%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
		}
		.cancel {
			background-color: #eeeeee;
			color: #aaaaaa;
		}
		.add {
			background-color: #1576e6;
			color: #fff;
		}
	}
	.search-datas {
		display: flex;
		align-items: center;
		height: 80rpx;
		// background-color: #fff;
		.title {
			width: 180rpx;
		}
		.to {
			margin: 0 10rpx;
		}
		.data-input {
			display: flex;
			align-items: center;
			position: relative;
			width: 520rpx;
			height: 60rpx;
			// padding: 0 20rpx;
			font-size: 28rpx;
			border: 1px solid #dcdfe6;
			background-color: #fff;
			border-radius: 6rpx;
			.left{
    		  display: flex;
    		  align-items: center;
    		  width: 200rpx;
    		  height: 60rpx;
    		}
			.closeBtn {
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				right: 6rpx;
				width: 30rpx;
				height: 30rpx;
				background-color: #eee;
				color: #ccc;
				font-size: 16rpx;
				z-index: 5;
				border-radius: 50%;
			}
		}
	}
}
</style>
