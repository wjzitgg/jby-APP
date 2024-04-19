<template>
	<view class="wrapper">
		<u-navbar leftText="季度计划" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="sticky">
			<u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="false"
				:activeStyle="{ color: 'rgba(32, 52, 87, 1)' }" :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }"></u-tabs>
			<view class="search">
				<view class="search-item">
					<easy-select ref="easySelect" size="mini" class="easySelect" :value="nowYear" @selectOne="selectOne"
						:options="yearList"></easy-select>
				</view>
				<view class="search-item">
					<easy-select ref="easySelect" size="mini" class="easySelect" :value="nowQuarter" @selectOne="selectOne3"
						:options="quarterList"></easy-select>
				</view>
				<!-- <view class="search-item" v-if="current === 0">
          <easy-select
            ref="easySelect2"
            size="mini"
            class="easySelect"
            :value="type"
            @selectOne="selectOne2"
            :options="typeList"
          ></easy-select>
        </view> -->
				<view class="search-item" v-if="current === 1">
					<easy-select ref="easySelect" size="mini" class="easySelect" :value="contractName" @selectOne="selectOne5"
						:options="contractList"></easy-select>
				</view>
			</view>
			<view class="search" v-if="current === 1">
				<view class="search-item">
					<easy-select ref="easySelect2" size="mini" class="easySelect" :value="detailtype" @selectOne="selectOne4"
						:options="detailTypeList"></easy-select>
				</view>
			</view>
		</view>
		<view class="pad" v-if="current === 0"></view>
		<view class="pad2" v-if="current === 1"></view>
		<view class="content">
			<view class="table_detail table_empty" v-if="current === 0">
				<table v-if="list1.length">
					<thead>
						<tr>
							<th rowspan="2">项目编号</th>
							<th rowspan="2">项目名称</th>
							<th rowspan="2">单位</th>
							<th rowspan="2">合同单价</th>
							<th rowspan="2">设计工程量</th>
							<th rowspan="2">合同金额</th>
							<th colspan="2">上月度末累计计划</th>
							<th colspan="2">上月度末累计已完成</th>
							<th colspan="2">本月度计划</th>
							<th colspan="2">本月度末计划累计完成</th>
						</tr>
						<tr>
							<th class="tuoTh">工程量</th>
							<th class="tuoTh">产值</th>
							<th class="tuoTh">工程量</th>
							<th class="tuoTh">产值</th>
							<th class="tuoTh">工程量</th>
							<th class="tuoTh">产值</th>
							<th class="tuoTh">工程量</th>
							<th class="tuoTh">产值</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in list1" :key="index">
							<td>{{ item.itemCode }}</td>
							<td>{{ item.itemName }}</td>
							<td>{{ item.unitName }}</td>
							<td>{{ item.grade==4?(menuCodeData == 1 ? item.price : "***"):"" }}</td>
							<td>{{ item.grade==4?item.planQuantities:'' }}</td>
							<td>{{ item.grade==4?(menuCodeData == 1 ? item.designAmount : "***"):"" }}</td>
							<td>{{ item.upperPlanFinishQuantities }}</td>
							<td>{{ menuCodeData == 1 ? item.upperAmount : "***" }}</td>
							<td>{{ item.upperFinishQuantities }}</td>
							<td>{{ menuCodeData == 1 ? item.upperFinishAmount : "***" }}</td>
							<td>{{ item.planFinishQuantities }}</td>
							<td>{{ menuCodeData == 1 ? item.amount : "***" }}</td>
							<td>{{ item.finishQuantities }}</td>
							<td>{{ menuCodeData == 1 ? item.finishAmount : "***" }}</td>
						</tr>
					</tbody>
				</table>
				<u-empty v-if="list1.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
				<u-empty v-if="!list1.length" style="height: 100%" mode="data" text="暂时没有数据哦"
					icon="/static/image/noData.png"></u-empty>
			</view>
			<view class="table_detail table_detail2 table_empty" v-if="current === 1">
				<table v-if="list2.length">
					<thead>
						<tr>
							<th rowspan="2">序号</th>
							<th rowspan="2">项目名称</th>
							<th rowspan="2">单位</th>
							<th rowspan="2">合同单价</th>
							<th rowspan="2">合同工程量</th>
							<th rowspan="2">合同金额</th>
							<th colspan="2">上年度末计划</th>
							<th colspan="2">上年度末已完成</th>
							<th colspan="2">本年度计划</th>
							<th colspan="2">本年度末计划累计完成</th>
						</tr>
						<tr>
							<th class="tuoTh">工程量</th>
							<th class="tuoTh">产值</th>
							<th class="tuoTh">工程量</th>
							<th class="tuoTh">产值</th>
							<th class="tuoTh">工程量</th>
							<th class="tuoTh">产值</th>
							<th class="tuoTh">工程量</th>
							<th class="tuoTh">产值</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in list2" :key="index">
							<td>{{ index + 1 }}</td>
							<td>{{ item.itemName }}</td>
							<td>{{ item.unitName }}</td>
							<td>{{ menuCodeData == 1 ? item.price : "***" }}</td>
							<td>{{ item.planQuantities }}</td>
							<td>{{ menuCodeData == 1 ? item.designAmount : "***" }}</td>
							<td>{{ item.upperPlanFinishQuantities }}</td>
							<td>{{ menuCodeData == 1 ? item.upperAmount : "***" }}</td>
							<td>{{ item.upperFinishQuantities }}</td>
							<td>{{ menuCodeData == 1 ? item.upperFinishAmount : "***" }}</td>
							<td>{{ item.planFinishQuantities }}</td>
							<td>{{ menuCodeData == 1 ? item.amount : "***" }}</td>
							<td>{{ item.finishQuantities }}</td>
							<td>{{ menuCodeData == 1 ? item.finishAmount : "***" }}</td>
						</tr>
					</tbody>
				</table>
				<u-empty v-if="list2.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
				<u-empty v-if="!list2.length" style="height: 100%" mode="data" text="暂时没有数据哦"
					icon="/static/image/noData.png"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			let nowYear = new Date().getFullYear();
			let nowMonth = new Date().getMonth() + 1;
			this.searchData.planYear = nowYear;
			if ([1, 2, 3].includes(nowMonth)) {
				this.nowQuarter = "第一季度";
				this.searchData.planQuarter = 1;
			} else if ([4, 5, 6].includes(nowMonth)) {
				this.nowQuarter = "第二季度";
				this.searchData.planQuarter = 2;
			} else if ([7, 8, 9].includes(nowMonth)) {
				this.nowQuarter = "第三季度";
				this.searchData.planQuarter = 3;
			} else if ([10, 11, 12].includes(nowMonth)) {
				this.nowQuarter = "第四季度";
				this.searchData.planQuarter = 4;
			}
			this.nowYear = nowYear + "年";
			let arr = [];
			for (let index = nowYear - 5; index < nowYear + 5; index++) {
				arr.push({ label: index + "年", value: index });
			}
			this.yearList = arr.reverse();
			// this.searchPlanAndDetail(0);
			// this.searchPlanAndDetail(1);
			this.searchPlanAndDetail(this.current);
			this.searchMenuDataAuthorize();
		},
		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
			},
			showList() {
				if (this.typeVal === 0) {
					return this.list1.filter(item => !item.finishStatus);
				} else if (this.typeVal === 1) {
					return this.list1.filter(item => item.finishStatus);
				} else {
					return this.list1;
				}
			},
			list2() {
				return this.detailTypeList.length ?
					this.detailTypeList.filter(item => item.value == this.detailtype)[0]
					.planDetails :
					[];
			},
		},
		data() {
			return {
				tabList: [{ name: "分项列表" }, { name: "清单列表" }],
				current: 0,
				list1: [],
				// list2: [],
				yearList: [],
				nowYear: "",
				quarterList: [
					{ value: 1, label: "第一季度" },
					{ value: 2, label: "第二季度" },
					{ value: 3, label: "第三季度" },
					{ value: 4, label: "第四季度" },
				],
				nowQuarter: "",
				typeList: [
					{ value: "", label: "全部" },
					{ value: 0, label: "未完成" },
					{ value: 1, label: "已完成" },
				],
				type: "全部",
				typeVal: "",
				searchData: {
					planYear: "",
					planQuarter: "",
					planType: 1,
				},
				menuCodeData: "",
				detailtype: "",
				detailTypeList: [],
				contractId: "",
				contractName: "",
				contractList: [],
			};
		},
		methods: {
			getContractList() {
				this.$api
					.searchContracts({
						contractType: 1,
						fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
					})
					.then(res => {
						if (res.code == 200) {
							this.contractList = res.data.map(item => ({
								value: item.pkId,
								label: item.contractName,
								...item,
							}));
							if (res.data.length) {
								this.contractId = res.data[0].pkId;
								this.contractName = res.data[0].contractName;
								this.searchPlanAndDetail(1);
							}
						}
					});
			},
			searchPlanAndDetail(isDetail) {
				let data = {
					...this.searchData,
					fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
					isDetail,
					finishStatus: this.typeVal,
				};
				if (isDetail === 1) {
					data.contractId = this.contractId;
				}
				uni.showLoading({ mask: true });
				this.$api
					.searchPlanAndDetail(data)
					.then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							if (res.data.length) {
								if (isDetail === 0) {
									this.list1 = res.data[0].planDetails;
								} else if (isDetail === 1) {
									let arr = res.data[0].planChapterVos;
									this.detailtype = arr.length ? arr[0].chapterName : "";
									this.detailTypeList = arr.map(item => ({
										value: item.chapterName,
										label: item.chapterName,
										...item,
									}));
									// this.list2 = res.data[0].planDetails;
								}
							} else {
								this.list1 = [];
								// this.list2 = [];
							}
						} else {
							uni.showToast({
								title: res.msg,
								icon: "none",
							});
						}
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			currentChange(e) {
				this.current = e.index;
				this.getList();
			},
			getList() {
				if (this.current == 1) {
					this.getContractList();
				} else {
					this.searchPlanAndDetail(this.current);
				}
			},
			selectOne(e) {
				console.log(e);
				this.nowYear = e.options.label;
				this.searchData.planYear = e.options.value;
				// this.searchPlanAndDetail(0);
				// this.searchPlanAndDetail(1);
				this.searchPlanAndDetail(this.current);
			},
			selectOne2(e) {
				console.log(e);
				this.type = e.options.label;
				this.typeVal = e.options.value;
				this.searchPlanAndDetail(this.current);
			},
			selectOne3(e) {
				console.log(e);
				this.nowQuarter = e.options.label;
				this.searchData.planQuarter = e.options.value;
				// this.searchPlanAndDetail(0);
				// this.searchPlanAndDetail(1);
				this.searchPlanAndDetail(this.current);
			},
			selectOne4(e) {
				this.detailtype = e.options.label;
			},
			selectOne5(e) {
				this.contractName = e.options.label;
				this.contractId = e.options.value;
				this.searchPlanAndDetail(1);
			},
			// 获取当前登录用户角色关联菜单权限数据集
			searchMenuDataAuthorize() {
				this.$api.searchMenuDataAuthorize().then(res => {
					if (res.code == 200) {
						res.data.forEach(element => {
							if (element.menuCode == "schedule") {
								this.menuCodeData = element.states;
							}
						});
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.pad {
		height: 178rpx;
	}

	.pad2 {
		height: 258rpx;
	}

	.search {
		display: flex;
		align-items: center;
		height: 80rpx;

		.search-item {
			flex: 1;
			padding: 0 10rpx;
		}

		.easySelect {
			/deep/.uni-input-wrapper {
				.uni-input-input {
					font-size: 28rpx;
				}
			}
		}
	}

	.table_detail {
		/*#ifdef APP-PLUS*/
		height: calc(100vh - 354rpx);
		/*#endif*/
		/*#ifdef H5*/
		height: calc(100vh - 266rpx);
		/*#endif*/
	}

	.table_detail2 {
		/*#ifdef APP-PLUS*/
		height: calc(100vh - 434rpx);
		/*#endif*/
		/*#ifdef H5*/
		height: calc(100vh - 346rpx);
		/*#endif*/
	}

	.green {
		color: #43cf7c;
	}
</style>