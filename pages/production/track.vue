<template>
	<view class="wrapper">
		<u-navbar leftText="生产跟踪" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="sticky">
			<u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="false" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}" v-if="[5].includes(this.user.orgType)"></u-tabs>
			<view class="search">
				<view class="search-input">
					<u-input placeholder="请输入项目名称" border="none" v-model="searchData.itemName" fontSize="14" maxlength="100">
						<template slot="suffix">
							<u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon>
						</template>
					</u-input>
				</view>
				<!--  @click="showFilter = !showFilter" -->
				<filterBtn @click="openPop" :nums="searchTag.length" :marginLeft="true" :height="64"></filterBtn>
				<!-- <view class="more-search" @click="openPop">
					<image src="../../static/image/u486.png" mode="widthFix" class="filterImg" />
					<view>筛选</view>
				</view> -->
			</view>
			<searchTag :tagList="searchTag" @closeTag="closeTag"></searchTag>
		</view>
		<view :class="{pad:[5].includes(this.user.orgType)&&!searchTag.length,pad2:![5].includes(this.user.orgType)&&!searchTag.length,pad3:[5].includes(this.user.orgType)&&searchTag.length,pad4:![5].includes(this.user.orgType)&&searchTag.length}"></view>
		<view class="content">
			<view class="table_detail table_empty" :key="current">
				<table v-if="tableData.length">
					<thead>
						<tr>
							<th>编号</th>
							<th>项目名称</th>
							<th v-if="current === 1">工区</th>
							<th v-else-if="current === 0">分包商</th>
							<th>施工工序流程</th>
							<th>完成状态</th>
							<th>检查结果</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in tableData" :key="index">
							<td><text :class="{clickTd:!!item.detailBtnStatus}" @click="!!item.detailBtnStatus?tdClick(item):''">{{ item.itemCode }}</text></td>
							<td>{{ item.itemName }}</td>
							<!-- 工区 -->
							<td v-if="current === 1">{{ item.areaName }}</td>
							<td v-if="current === 0">{{ item.customerName }}</td>
							<td>{{ item.workflowName }}</td>
							<td :class="{ green: item.completionStatus === 2 }">{{ item.completionStatus === 1 ? '未完成' : '已完成' }}</td>
							<td>{{ item.checkResult === 0 ? '不合格' : item.checkResult === 1 ? '合格' :item.checkResult === 2? '良好':'' }}</td>
							<!-- 	<td v-if="item.checkResult == 0">不合格</td>
							<td v-if="item.checkResult == 1">合格</td>
							<td v-if="item.checkResult == 2">良好</td> -->
						</tr>
					</tbody>
				</table>
				<u-empty v-if="tableData.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
				<u-empty v-else mode="data" text="暂无数据" icon="/static/image/noData.png"></u-empty>
			</view>
		</view>
		<!-- 筛选弹框 -->
		<u-popup :show="showPop" @close="closePop" mode="right" class="pop-bgImg" bgColor="rgba(255, 255, 255, 0)">
			<view class="popup">
				<view class="tip">请选择筛选条件</view>
				<view class="popup-content">
					<view class="" v-if="current == 1">
						<view class="filter-title">工区筛选</view>
						<view class="filter-content">
							<view class="tags" :class="ind == 10.1 ? 'tags-click' : ''" @click="selectItem({ areaName: '' })">全部</view>
							<view class="tags" :class="{ 'tags-click': index == ind }" v-for="(item, index) in areaList" :key="index" @click="selectItem(item, index)">{{ item.areaName }}</view>
						</view>
					</view>
					<view class="" v-else-if="current == 0">
						<view class="filter-title">分包商筛选</view>
						<view class="filter-content">
						<view class="tags" :class="ind == 10.1 ? 'tags-click' : ''" @click="selectItem({ areaName: '' })">全部</view>
						<view class="tags" :class="{ 'tags-click': index == ind }" v-for="(item, index) in areaList2" :key="index" @click="selcustomName(item, index)">{{ item.customName }}</view>
						</view>
					</view>
					<view class="">
						<view class="filter-title">检查状态</view>
						<view class="filter-content">
						<view class="tags" :class="{ 'tags-click': index == searchData.finishStatus }" v-for="(item, index) in checkStatus" :key="index" @click="selectItem2(item.val)">
							{{ item.name }}
						</view>
						</view>
					</view>
					<view class="">
						<view class="filter-title">检查结果</view>
						<view class="filter-content">
						<view class="tags" :class="{ 'tags-click': index == searchData.checkResult }" v-for="(item, index) in checkStatus2" :key="index" @click="selectItem3(item.val)">
							{{ item.name }}
						</view>
						</view>
					</view>
				</view>
				<!-- <view class="footer">
					<view class="footerBtn cancel" @click="closePop">取消</view>
					<view class="footerBtn add" @click="searchOk">确认</view>
				</view> -->
			</view>
			<view class="pop-footer-btn">
      		  <view class="btns btnReset" @click="closePop">取消</view>
      		  <view class="btns btnOk" @click="searchOk">确定</view>
      		</view>
		</u-popup>
	</view>
</template>

<script>
import filterBtn from '../../components/search-tag/filter-btn.vue';
import searchTag from '../../components/search-tag/search-tag.vue';
export default {
	components:{filterBtn,searchTag},
	data() {
		return {
			tabList: [{ name: "分包商" }, { name: "工区" }],
			tableData: [],
			current: 0,
			list1: [],
			list2: [],
			typeVal: "",
			// 筛选搜索参数
			searchData: {
				itemName: "", // 关键字
				workAreaIds: [], // 工区id
				customerIds: [],
				finishStatus: 0, // 完成状态值
				checkResult: 0 // 检查结果
			},

			showPop: false,
			areaList: [], // 工区列表
			areaList2: [], // 分包商
			checkStatus: [{ name: "全部", val: 0 }, { name: "未完成", val: 1 }, { name: "已完成", val: 2 }],
			checkStatus2: [{ name: "全部", val: 0 }, { name: "合格", val: 1 }, { name: "不合格", val: 2 }],
			ind: 10.1 ,// 控制工区选中状态
			searchTag:[]
		};
	},
	computed: {
  	  user() {
  	    return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
  	  },
  	},
	onLoad(options) {
		if([5].includes(this.user.orgType)){
			// 获取工区列表
			this.searchAllWorkArea();
			this.findCustomByUserId();
		}else{
			this.current=3
		}
		this.getData();
	},
	methods: {
		closeTag(row){
			console.log(row);
			if(row.mode=='multiple'){
				this.ind=10.1
				this.searchData[row.key] = this.searchData[row.key].filter(item=>item!=row.id)
			}else{
				this.searchData[row.key] = 0
			}
			this.setSearchTag()
			this.getData();
		},
		setSearchTag(){
			let arr= []
			if(this.current==0){
				if(this.ind==10.1){
				}else{
					let arr2 =this.areaList2.filter(item=>this.searchData.customerIds.includes(item.pkId))
					arr2.forEach(item=>{
						arr.push({key:'customerIds',mode:"multiple",value:item.customName,id:item.pkId})
					})
				}
			}
			console.log(this.searchData.workAreaIds);
			if(this.current==1){
				if(this.ind==10.1){
				}else{
					
					let arr2 =this.areaList.filter(item=>this.searchData.workAreaIds.includes(item.areaId))
					arr2.forEach(item=>{
						arr.push({key:'workAreaIds',mode:"multiple",value:item.areaName,id:item.areaId})
					})
				}
			}
			if(this.searchData.finishStatus){
				arr.push({key:'finishStatus',value:this.checkStatus[this.searchData.finishStatus].name})
			}
			if( this.searchData.checkResult){
				arr.push({key:'checkResult',value:this.checkStatus2[this.searchData.checkResult].name})
			}
			this.searchTag =arr
		},
		tdClick(item){
			console.log(item);
			uni.navigateTo({ url: '/pages/waiting/deliveryReceivingDetail?todo=3&row='+JSON.stringify({fkBusinessId:item.pkId,approveStatus:4}) })
		},
		getData() {
			let data = {
				...this.searchData
			};
			if(this.current!=3){
				data.customerOrWorkArea = this.current;
			}
			let user = uni.getStorageSync("user");
			if (user.orgType != 5) {
				data.fkOrgId = uni.getStorageSync("nowOrgId");
			}
			uni.showLoading({ mask: true });
			this.$api
				.statsItemTrackSearch(data)
				.then(res => {
					uni.hideLoading();
					if (res.code === 200) {
						this.tableData = res.data;
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none"
						});
					}
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		// 获取工区
		searchAllWorkArea() {
			this.$api.searchAllWorkArea().then(res => {
				if (res.code === 200) {
					this.areaList = res.data;
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			});
		},
		// 获取分包商筛选
		findCustomByUserId() {
			let data ={}
			let user = uni.getStorageSync("user");
			if (user.orgType != 5) {
				data.fkOrgId = uni.getStorageSync("nowOrgId");
			}
			this.$api.findCustomByUserId(data).then(res => {
				if (res.code === 200) {
					this.areaList2 = res.data;
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			});
		},
		// 选择工区
		selectItem(item, index) {
			this.searchData.workAreaIds = []; // 清空选择的工区id
			if (item.areaName == "") {
				this.ind = 10.1;
			} else {
				this.ind = index;
				this.searchData.workAreaIds.push(item.areaId);
			}
		},
		// 选择分包商
		selcustomName(item, index) {
			this.searchData.customerIds = []; // 清空选择的工区id
			if (item.areaName == "") {
				this.ind = 10.1;
			} else {
				this.ind = index;
				this.searchData.customerIds.push(item.pkId);
			}
		},
		selectItem2(num) {
			this.searchData.finishStatus = num;
		},
		selectItem3(num) {
			this.searchData.checkResult = num;
		},
		currentChange(e) {
			this.current = e.index;
			this.ind = 10.1
			this.searchData.workAreaIds = [];
			this.searchData.customerIds = [];
			this.searchData.itemName = "";
			this.searchData.finishStatus = 0;
			this.searchData.checkResult = 0;
			this.searchTag = []
			this.getData();
		},
		// 搜搜索
		search() {
			this.getData();
		},
		openPop() {
			this.showPop = true;
		},
		// 筛选弹框关闭
		closePop() {
			this.showPop = false;
		},
		searchOk() {
			this.setSearchTag()
			this.getData();
			this.closePop();
		}
	}
};
</script>

<style lang="scss" scoped>
.active {
	color: #2a82e4 !important;
	background-color: #e6f7ff !important;
	border: 1px solid #2a82e4 !important;
}
.pad {
	height: 178rpx;
}
.pad2 {
	height: 108rpx;
}
.pad3 {
	height: 240rpx;
}
.pad4 {
	height: 170rpx;
}
.search {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100rpx;
	.search-input {
		width: 540rpx;
		height: 64rpx;
		padding-left: 20rpx;
		border: 1px solid #b4d0f0;
		border-radius: 6rpx;
		font-size: 28rpx;
	}
	.more-search {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 160rpx;
		height: 64rpx;
		border: 1px solid #b4d0f0;
		border-radius: 6rpx;
		font-size: 30rpx;
		color: #2a82e4;
		.filterImg {
			width: 36rpx;
			margin-right: 6rpx;
		}
	}
}
.table_detail {
	/*#ifdef APP-PLUS*/
	// height: calc(100vh - 354rpx);
	// /*#endif*/
	// /*#ifdef H5*/
	// height: calc(100vh - 266rpx);
	/*#endif*/
}

// .popup {
// 	position: relative;
// 	width: 660rpx;
// 	// height: 100%;
// 	padding: 30rpx 10rpx 30rpx 30rpx;
// 	/*#ifdef APP-PLUS*/
//   height: calc(100vh - 156rpx);
//   /*#endif*/
//   /*#ifdef H5*/
//   height: calc(100vh - 88rpx);
//   /*#endif*/
//   /*#ifdef APP-PLUS*/
//   margin-top: 156rpx;
//   /*#endif*/
//   /*#ifdef H5*/
//   margin-top: 88rpx;
//   /*#endif*/
// 	background-color: #fff;
// 	.popup-pad {
// 		/*#ifdef APP-PLUS*/
// 		height: 156rpx;
// 		/*#endif*/
// 		/*#ifdef H5*/
// 		height: 88rpx;
// 		/*#endif*/
// 	}
// 	.select-top {
// 		.title-item {
// 			display: block;
// 			font-weight: 600;
// 			font-size: 28rpx;
// 			margin: 36rpx 0;
// 		}
// 		.item {
// 			display: inline-block;
// 			border: 1px solid #000;
// 			width: 190rpx;
// 			height: 72rpx;
// 			line-height: 72rpx;
// 			border-radius: 36rpx;
// 			font-size: 28rpx;
// 			background-color: #fff;
// 			text-align: center;
// 			background-color: #f6f6f6;
// 			border: 1px solid #eee;
// 			margin-bottom: 24rpx;
// 			margin-right: 8rpx;
// 			overflow: hidden;
// 			text-overflow: ellipsis;
// 			white-space: nowrap;
// 		}
// 		text:nth-child(3n + 4) {
// 			// margin-right: 0 !important;
// 			// background-color: #333;
// 		}
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
.green {
	color: #43cf7c !important;
}
</style>
