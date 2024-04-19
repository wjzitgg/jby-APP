<template>
	<view class="wrapper">
		<u-navbar leftText="项目概况" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="sticky">
			<u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="true"
				:activeStyle="{ color: 'rgba(32, 52, 87, 1)' }" :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }">
			</u-tabs>
			<searchInput placeholder="请输入关键字搜索" v-model="name" maxlength="50" v-if="current == 0" @search="search">
			</searchInput>
			<view class="search2" v-if="current == 1">
				<view class="left">
					<easy-select ref="easySelect2" size="mini" class="easySelect" :value="proName" @selectOne="selectOne"
						:options="proList"></easy-select>
				</view>
				<view class="right">
					<searchInput placeholder="请输入关键字搜索" v-model="searchName" maxlength="50" @search="search"></searchInput>
				</view>
			</view>
		</view>
		<view class="pad"></view>
		<view class="content">
			<view class="table_detail table_empty" v-if="current == 0">
				<table v-if="list1.length">
					<thead>
						<tr>
							<th>序号</th>
							<th>项目名称</th>
							<th>合同金额</th>
							<th>工期</th>
							<th>开工日期</th>
							<th>竣工日期</th>
							<th>项目地点</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in list1" :key="item.pkId">
							<td>
								<text @click="openDetail1(item)" class="clickTd">{{
                  index + 1
                }}</text>
							</td>
							<td>{{ item.projectName }}</td>
							<td>{{ item.contractAmount }}</td>
							<td>{{ item.duration }}</td>
							<td>{{ item.beginTime }}</td>
							<td>{{ item.endTime }}</td>
							<td>{{ item.detailAddress }}</td>
						</tr>
					</tbody>
				</table>
				<u-empty v-if="list1.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
				<u-empty v-else style="height: 100%" mode="data" text="暂无数据" icon="/static/image/noData.png">
				</u-empty>
			</view>
			<view class="table_detail table_empty" v-if="current == 1">
				<table v-if="list2.length">
					<thead>
						<tr>
							<th>序号</th>
							<th>工程部位名称</th>
							<th>工程量</th>
							<th>结构形式</th>
							<th>规模</th>
							<th>施工方案</th>
							<th>工程造价</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in list2" :key="item.pkId">
							<td @click="openDetail2(item)">
								<text class="clickTd">{{ index + 1 }}</text>
							</td>
							<td>{{ item.projectName }}</td>
							<td>{{ item.quantities }}</td>
							<td>{{ item.structure }}</td>
							<td>{{ item.largeScale }}</td>
							<td>{{ item.projectScheme }}</td>
							<td>{{ item.manufacture }}</td>
						</tr>
					</tbody>
				</table>
				<u-empty v-if="list2.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
				<u-empty v-else style="height: 100%" mode="data" text="暂无数据" icon="/static/image/noData.png">
				</u-empty>
			</view>
		</view>
		<u-popup :show="showPop1" :round="10">
			<view class="popup">
				<view class="head">
					<view class="name">{{ nowClick.projectName }}</view>
					<u-icon name="close" color="rgba(170, 170, 170, 1)" class="closeBtn" @click="closePop1"></u-icon>
					<!-- <view ></view> -->
				</view>
				<view class="card pdboom">
					<tableForm :pageHeight="false" :pageMr="false" :list="[
              { name: '项目名称', value: nowClick.projectName, show: true },
              { name: '合同金额', value: nowClick.contractAmount, show: true },
              { name: '工期', value: nowClick.duration, show: true },
              { name: '开工日期', value: nowClick.beginTime, show: true },
              { name: '竣工日期', value: nowClick.endTime, show: true },
              { name: '项目地点', value: nowClick.detailAddress, show: true },
              { name: '项目描述', value: nowClick.remark, show: true },
            ]">
					</tableForm>
					<!-- 后端未给对应接口和字段 -->
					<!-- 	<tableForm :pageHeight="false" :pageMr="false" @click="tableClick" :list="[
          {name:'关联标段项目',value:'点击关联',show:true,click:true},
          ]">
					</tableForm> -->
					<!-- 关联标段项目 -->
					<view class="project-list">
						<view class="item-left">
							关联标段项目
						</view>
						<view class="item-right">
							<view class="item-bor" v-for="(item,index) in nowClick.projectBidVos" :key="index"
								v-if="nowClick.projectBidVos.length>0 && item.isChecked == 1">
								<text>{{item.projectName}}</text>
							</view>
							<view class="item-bor" @click="tableClick" v-if="$auth('projectManage:info:overviewSection')">
								点击关联
							</view>
						</view>
					</view>
				</view>
				<view class="pdb"></view>
			</view>
			<view class="footer">
				<view class="footerBtn add" style="margin-right: 0px" @click="redact"  v-if="$auth('projectManage:info:overviewEdit')">编辑
				</view>
				<view class="footerBtn error" style="margin-left: 0px" @click="show2 = true" v-if="$auth('projectManage:info:overviewDelete')">删除</view>
			</view>
		</u-popup>
		<u-popup :show="showPop2" :round="10">
			<view class="popup">
				<view class="head">
					<view class="name">{{ nowClick.projectName }}</view>
					<u-icon name="close" color="rgba(170, 170, 170, 1)" class="closeBtn" @click="closePop2"></u-icon>
					<!-- <view ></view> -->
				</view>
				<view class="card">
					<tableForm :pageHeight="false" :pageMr="false" :list="[
              { name: '工程部位名称', value: nowClick.projectName, show: true },
              { name: '工程量', value: nowClick.quantities, show: true },
              { name: '结构形式', value: nowClick.structure, show: true },
              { name: '规模', value: nowClick.largeScale, show: true },
              { name: '施工方案', value: nowClick.projectScheme, show: true },
              {
                name: '工程造价',
                value: '￥' + nowClick.manufacture,
                show: true,
              },
            ]">
					</tableForm>
				</view>
				<view class="pdb"></view>
			</view>
			<view class="footer">
				<view class="footerBtn add" style="margin-right: 0px" @click="redact"  v-if="$auth('projectManage:info:itemEdit')">编辑
				</view>
				<view class="footerBtn error" style="margin-left: 0px" @click="show2 = true" v-if="$auth('projectManage:info:itemDelete')">删除</view>
			</view>
		</u-popup>
		<u-modal :show="show2" title="删除确认" content="确定删除？" showCancelButton @cancel="show2 = false"
			@confirm="confirm"></u-modal>
		<view type="primary" v-if="current == 0&&$auth('projectManage:info:overviewAdd')" class="btn" @click="addProject">新增项目概况</view>
		<view type="primary" v-if="current == 1&&$auth('projectManage:info:itemAdd')" class="btn" @click="add">新增</view>
	</view>
</template>

<script>
	import tableForm from "../../components/table-form/table-form.vue";
	import searchInput from "../../components/search-tag/search-input.vue";
	export default {
		components: { tableForm, searchInput },
		data() {
			return {
				name: "",
				searchName: "",
				showPop1: false,
				showPop2: false,
				tabList: [{ name: "项目概况" }, { name: "工程项目表" }],
				current: 0,
				list1: [],
				list2: [],
				nowClick: {},
				proId: "",
				proName: "全部",
				proList: [{ label: "全部", value: "" }],
				show2: false,
			};
		},
		// onLoad(options) {
		// 	this.projectSearchPage();
		// 	this.searchProject();
		// },
		onShow() {
			this.searchName = "";
			this.proId = "";
			this.name = "";
			this.proName = "全部";
			this.projectSearchPage();
			this.searchProject();
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo;
			},
		},
		// watch:{

		// }
		methods: {
			resh() {
				this.search();
			},
			addProject() {
				let item = {
					itemTitle: "新增项目概况",
				};
				uni.navigateTo({
					url: "/pages/projectManage/infoAdd?row=" + JSON.stringify(item),
				});
			},
			add() {
				let item = {
					itemTitle: "新增工程项目",
				};
				uni.navigateTo({
					url: "/pages/projectManage/infoAddProject?row=" + JSON.stringify(item),
				});
			},
			// 编辑
			redact() {
				if (this.current == 0) {
					let item = {
						itemTitle: "编辑项目概况",
						...this.nowClick,
					};
					this.showPop1 = false;
					uni.navigateTo({
						url: "/pages/projectManage/infoAdd?row=" + JSON.stringify(item),
					});
				} else {
					let item = {
						itemTitle: "编辑工程项目",
						...this.nowClick,
					};
					this.showPop2 = false;
					uni.navigateTo({
						url: "/pages/projectManage/infoAddProject?row=" + JSON.stringify(item),
					});
				}
			},
			// 删除确认
			confirm() {
				if (this.current == 0) {
					this.$api.deleteProject({ pkId: this.nowClick.pkId }).then(res => {
						if (res.code == 200) {
							this.name = "";
							this.projectSearchPage();
							this.showPop1 = false;
							this.show2 = false;
						} else {
							uni.showToast({ title: res.msg, icon: "none" });
						}
					});
				} else {
					this.searchName = "";
					this.$api
						.projectDeleteProjectTable({ pkId: this.nowClick.pkId })
						.then(res => {
							if (res.code == 200) {
								this.projectTableSearchPage();
								this.showPop2 = false;
								this.show2 = false;
							} else {
								uni.showToast({ title: res.msg, icon: "none" });
							}
						});
				}

				//   this.nowClick.pkId
				// pkId
			},
			searchProject() {
				this.$api.searchProject().then(res => {
					if (res.code === 200) {
						this.proList = [
							{ label: "全部", value: "" },
							...res.data.map(item => ({
								...item,
								value: item.pkId,
								label: item.projectName,
							})),
						];
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			// 关联分项工成
			tableClick() {
				uni.navigateTo({
					url: `/pages/projectManage/linkPro?pkId=${this.nowClick.pkId}`,
					events: {
						// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
						someEvent: data => {
							let arr = data.data;
							if (arr.length == 0) {
								this.nowClick.projectBidVos.forEach(item => {
									if (item.isChecked == 1) {
										item.isChecked = 0;
									}
								});
							} else {
								this.nowClick.projectBidVos.forEach(item => {
									arr.forEach(jtem => {
										if (item.pkId == jtem) {
											console.log(234);
											item.isChecked = 1;
										}
									});
								});
							}
						}
					},
					success: res => {}
				});
			},
			currentChange(item) {
				this.name = "";
				this.searchName = "";
				this.current = item.index;
				if (this.current == 0) {
					this.projectSearchPage();
				} else {
					this.projectTableSearchPage();
				}
			},
			selectOne(e) {
				this.proName = e.options.label;
				this.proId = e.options.value;
				this.projectTableSearchPage();
			},
			projectTableSearchPage() {
				let data = {
					pageNum: 1,
					pageSize: 10000,
					projectName: this.searchName,
					fkOrgId: this.proId,
				};
				this.$api.projectTableSearchPage(data).then(res => {
					if (res.code === 200) {
						this.list2 = res.data.records;
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			projectSearchPage() {
				let data = {
					pageNum: 1,
					pageSize: 10000,
					projectName: this.name,
				};
				this.$api.projectSearchPage(data).then(res => {
					if (res.code === 200) {
						this.list1 = res.data.records;
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			search() {
				if (this.current == 0) {
					this.projectSearchPage();
				} else {
					this.projectTableSearchPage();
				}
			},
			openDetail1(item) {
				console.log(item);
				this.getfindProjectById(item.pkId);
				this.showPop1 = true;
			},
			// 根据工程id查询项目详情
			getfindProjectById(id) {
				uni.showLoading();
				this.$api.getfindProjectById({ pkId: id }).then(res => {
					uni.hideLoading();
					if (res.code) {
						this.nowClick = res.data;
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			closePop1() {
				this.showPop1 = false;
			},
			openDetail2(item) {
				this.nowClick = item;
				this.showPop2 = true;
			},
			closePop2() {
				this.showPop2 = false;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.sticky {
		//   display: flex;
		//   align-items: center;
		//   height: 80rpx;
		background-color: #fff;
		padding: 0 20rpx;

		.search {
			width: 700rpx;
			padding-left: 20rpx;
			border: 1px solid #2a82e4;
			border-radius: 6rpx;
		}

		.search2 {
			display: flex;
			align-items: center;

			.left {
				width: 280rpx;
				// margin-right: 8rpx;
			}

			.right {
				flex: 1;
			}
		}
	}

	.pad {
		height: 186rpx;
	}

	.popup {
		position: relative;
		width: 750rpx;
		height: 80vh;
		overflow-y: scroll;
		// background-color: #2a82e4;
		border-radius: 20rpx 20rpx 0 0;

		.head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			// line-height: 80rpx;
			padding: 0 20rpx;
			padding-top: 20rpx;
			color: #fff;
			font-size: 36rpx;

			.name {
				font-weight: 800;
			}
		}

		.card {
			width: 750rpx;
			// height: 100%;
			background-color: #fff;

			// padding: 0 20rpx;
			.list-item {
				height: 80rpx;
				line-height: 80rpx;
				font-size: 28rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				border-bottom: 1px solid rgba(238, 238, 238, 1);

				&:first-child {
					border-top: 1px solid rgba(238, 238, 238, 1);
				}

				&:last-child {
					.item {
						color: rgba(255, 87, 51, 1);
					}
				}

				text:first-child {
					display: inline-block;
					/* 超出4字，不限制宽度，随字数向右延展 */
					min-width: 196rpx;
					height: 80rpx;
					line-height: 80rpx;
					padding: 0 40rpx;
					border-right: 1px solid rgba(238, 238, 238, 1);
					text-align: justify;
					text-justify: distribute-all-lines;
					text-align-last: justify;
				}

				.item {
					display: inline-block;
					// width: 414rpx;
					padding-left: 10rpx;
					color: #79859a;
				}
			}
		}

		.table-form {
			height: auto;
		}
	}

	.pdboom {
		padding-bottom: 110rpx;
		// height: 2000rpx;
		// overflow-y: auto;
	}

	.footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		display: flex;
		height: 100rpx;

		.footerBtn {
			width: 375rpx;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
		}

		.footerBtnOne {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
		}

		.cancel {
			background-color: #eeeeee;
			color: #aaaaaa;
		}

		.add {
			// width: 135px;
			height: 60px;
			opacity: 1;
			background: #1576e6;
			font-size: 16px;
			font-weight: 500;
			letter-spacing: 0px;
			color: #ffffff;
			text-align: center;
		}

		.adds {
			width: 240px;
			height: 60px;
			opacity: 1;
			background: rgba(21, 118, 230, 1);
			font-size: 16px;
			font-weight: 500;
			letter-spacing: 0px;
			color: rgba(255, 255, 255, 1);
			text-align: center;
		}

		.error {
			background-color: #e64343;
			color: #fff;
		}
	}

	/deep/ .u-modal {
		background: #cccccc40;
	}

	// 解决按钮显示问题
	.btn {
		z-index: 99;
	}

	//关联标段项目
	.project-list {
		display: flex;
		border-top: 1px solid #eeeeee;
		border-bottom: 1px solid #eeeeee;
		color: #79859a;
		// padding-left: 248rpx;
		// position: relative;

		.item-left {
			width: 248rpx;
			padding-top: 28rpx;
			padding-left: 38rpx;
			height: auto;
			left: 40rpx;
			color: #203457;
			font-size: 28rpx;
			font-weight: 600;
			border-right: 1px solid #eeeeee;
		}

		.item-right {
			flex: 1;

			.item-bor {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				padding-left: 20rpx;
				color: #79859a;
				font-size: 26rpx;
				border-bottom: 1px solid #eeeeee;
			}

			.item-bor:last-child {
				color: #2A82E4;
				position: relative;
			}

			.item-bor:last-child::after {
				content: "";
				border-bottom: 1px solid #2a82e4;
				width: 102rpx;
				position: absolute;
				display: block;
				bottom: 20rpx;
			}
		}
	}
</style>