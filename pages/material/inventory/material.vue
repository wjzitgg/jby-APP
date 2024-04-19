<template>
	<view class="wrapper">
		<u-navbar leftText="库存物料" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
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
					<u-input placeholder="请输入物料名称" border="none" v-model="searchDate.materialName" maxlength="50">
						<view slot="suffix"><u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon></view>
					</u-input>
				</view>
				<view class="mal-type">
					<view class="content" @click="selectMaterials">{{nowYear?nowYear:'全部物料'}}</view>
					<u-icon v-if="nowYear" @click="empty" name="trash-fill" class="icons icon" color="#2a82e4" size="16"></u-icon>
            		<u-icon v-else name="arrow-down-fill" class="icons " color="#2a82e4" size="12"></u-icon>
					<!-- <easy-select ref="easySelect2" size="mini" :value="nowYear" @selectOne="selectOne2" :options="yearList"></easy-select> -->
				</view>
			</view>
		</view>
		<view class="content">
			<view class="table_detail table_empty">
				<table>
					<thead>
						<tr>
							<th style="width: 40px"><u-icon name="list" style="display: inline-block"></u-icon></th>
							<th>物料名称</th>
							<th>物料分类</th>
							<th>单位</th>
							<th>入库量</th>
							<th>发货量</th>
							<th>盘盈量</th>
							<th>盘亏量</th>
							<th>库存数量</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in tablelist" :key="index">
							<td><text class="clickTd" @click="detail(item)">{{ index + 1 }}</text></td>
							<td>{{ item.materialName }}</td>
							<td>{{ item.materialTypeName }}</td>
							<td>{{ item.unitName }}</td>
							<td>{{ item.inRepositoryNum }}</td>
							<td>{{ item.outRepositoryNum }}</td>
							<td>{{ item.inventoryProfit }}</td>
							<td>{{ item.inventoryLosses }}</td>
							<td>{{ item.stockNum }}</td>
						</tr>
					</tbody>
				</table>
				<u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
			</view>
		</view>
		<materialSelect :treeData="treeData" ref="materialSelect" @checked="checked" :childList="'children'" :shabigongneng="true"></materialSelect>
	</view>
</template>

<script>
import materialSelect from "@/components/material-select/material-select2.vue";
export default {
	components:{materialSelect},
	data() {
		return {
			tabList: [{name:'全部',pkId:""}],
			current: 0,
			tabShow: false,
			inpDate: {
				orderCode: "",
				inventoryCode: "",
				beginTime: "",
				endTime: ""
			},
			searchDate: {
				materialTypeId: "", //物料分类id
				materialName: "" //物料名称
			},
			fkWarehouseId: "",
			typeList: [],
			clickDate: "",
			caleType: 1,
			tablelist: [],
			pageNum: 1,
			total: 0,
			nowYear: "",
			yearList: [],
			treeData:[]
		};
	},
	computed: {
    	user() {
    	  return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    	},
  	},
	onLoad(options) {
		this.$store.dispatch("getDictionariesData", 20).then(res => {
			this.typeList = res;
		});
		if(this.user.orgType==4){
    	  this.findWarehouseByProjectId(uni.getStorageSync("nowProId"));
    	}else{
    	  this.findWarehouseByProjectId("0");
    	}
		this.searchMaterialType();
	},
	methods: {
		selectOne2(e) {
			this.nowYear = e.options.label;
			this.searchDate.materialTypeId = e.options.value;
			this.searchPutInventoryPage(); // 获取数据
			console.log("物料分类", this.searchDate.materialTypeId);
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
					this.yearList.unshift({ label: "全部物料", value: "" });
				} else {
					uni.showToast({ title: res.msg, icon: "none" });
				}
			});
		},
		// 获取表格数据
		searchPutInventoryPage() {
			let data = {
				pageNum: this.pageNum,
				pageSize: 1000,
				fkWarehouseId: this.fkWarehouseId,
				fkOrgId:this.user.orgType !== 4 ? "" : uni.getStorageSync("nowOrgId"),
				...this.searchDate
			};
			uni.showLoading({ mask: true });
			this.$api
				.warehouseMaterialList(data)
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
			this.$api.findWarehouseByProjectId({bidProjectId: [5,6].includes(this.user.orgType)? "0" : uni.getStorageSync("nowProId")}).then(res => {
				if (res.code === 200) {
					let arr = res.data.map(item => ({ ...item, name: item.warehouseName }));
					this.tabList = [{name:'全部',pkId:""}, ...arr];
					// this.tabList = arr;
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
		},
		checked(e){
			console.log(e);
			this.nowYear = e.typeName;
			this.searchDate.materialTypeId = e.pkId;
			this.searchPutInventoryPage(); // 获取数据
		},
		empty(){
			this.nowYear=""
			this.searchDate.materialTypeId=""
			this.searchPutInventoryPage(); // 获取数据
		},
		selectMaterials() {
    	  this.getMaterials(this.user.orgType==4?uni.getStorageSync("nowOrgId"):'');
    	  this.$refs.materialSelect.selectShow = true;
    	},
    	// 查物料
    	getMaterials(orgId) {
    	  this.$api.searchMaterialsTree({orgId}).then((res) => {
    	    if (res.code == 200) {
    	      this.treeData = res.data;
    	    } else {
    	      uni.showToast({ title: res.msg, icon: "none" });
    	    }
    	  });
    	},
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
	.mal-type {
    	width: 220rpx;
    	height: 60rpx;
		margin-left: 10rpx;
    	border: 1px solid #b4d0f0;
    	overflow: hidden;
    	/*超出部分隐藏*/
    	white-space: nowrap;
    	/*禁⽌换⾏*/
    	text-overflow: ellipsis;
    	// text-align: center;
    	position: relative;
    	border-radius: 6rpx;
		.content{
			display: flex;
			align-items: center;
			width: 190rpx;
			height: 60rpx;
		}
    	.icons {
    	  position: absolute;
    	  right: 4px;
    	  top: 9px;
    	}
    	.icon{
    	  right: 0;
    	  top: 7px;
    	}

	}
	.search-input {
		width: 480rpx;
		padding-left: 20rpx;
		border: 1px solid #b4d0f0;
		border-radius: 6rpx;
	}
}
</style>
