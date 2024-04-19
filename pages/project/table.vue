<template>
	<view class="wrapper">
		<u-navbar leftText="工程项目表" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="sticky">
			<view class="search">
				<u-input placeholder="请输入工程项目名称" border="none" v-model="name" maxlength="50">
					<template slot="suffix">
						<u-icon name="search" size="28" @click="search"></u-icon>
					</template>
				</u-input>
			</view>
		</view>
		<view class="pad"></view>
		<view class="content">
			<view class="table_detail table_empty table_height1">
				<table v-if="showList.length">
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
						<tr v-for="(item, index) in showList" :key="item.pkId">
							<td>
								<text @click="openDetail(item)" class="clickTd">{{
                  index + 1
                }}</text>
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
				<u-empty v-if="showList.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
				<u-empty v-else style="height: 100%" mode="data" text="暂无数据" icon="/static/image/noData.png">
				</u-empty>
			</view>
		</view>
		<u-popup :show="showPop" :round="10">
			<view class="popup">
				<view class="head">
					<view class="name">{{ nowClick.projectName }}</view>
					<u-icon name="close" color="rgba(170, 170, 170, 1)" class="closeBtn" @click="closePop"></u-icon>
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
					<!-- <view class="list-item">
				<text>工程部位名称</text>
				<text class="item">{{ nowClick.projectName }}</text>
			</view>
			<view class="list-item">
				<text>工程量</text>
				<text class="item">{{ nowClick.quantities }}</text>
			</view>
			<view class="list-item">
				<text>结构形式</text>
				<text class="item">{{ nowClick.structure }}</text>
			</view>
			<view class="list-item">
				<text>规模</text>
				<text class="item">{{ nowClick.largeScale }}</text>
			</view>
			<view class="list-item">
				<text>施工方案</text>
				<text class="item">{{ nowClick.projectScheme }}</text>
			</view>
			<view class="list-item">
				<text>工程造价</text>
				<text class="item">￥{{ nowClick.manufacture }}</text>
			</view> -->
				</view>
				<view class="pdb"></view>
				<view class="footer">
				<view class="footerBtn add" v-if="$auth('project:table:edit')" style="margin-right: 0px" @click="redact">编辑
				</view>
				<view class="footerBtn error" v-if="$auth('project:table:delete')" style="margin-left: 0px" @click="show2 = true">删除</view>
			</view>
			</view>
			
		</u-popup>
		<u-modal :show="show2" title="删除确认" content="确定删除？" showCancelButton @cancel="show2 = false"
			@confirm="confirm"></u-modal>
		<view type="primary" class="btn" @click="add" v-if="$auth('project:table:add')">新增</view>
	</view>
</template>

<script>
	import tableForm from "../../components/table-form/table-form.vue";
	export default {
		components: { tableForm },
		data() {
			return {
				name: "",
				showPop: false,
				list: [],
				showList: [],
				nowClick: {},
				proId: "",
				show2: false,
			};
		},

		onLoad(options) {
			if (options.proId) {
				this.proId = options.proId;
			}
			// this.findProjectTableByProjectId();
		},
		onShow() {
			this.findProjectTableByProjectId();
		},
		computed: {
			userInfo() {
				console.log(uni.getStorageSync("user"));
				return this.$store.state.userInfo;
			},
		},
		methods: {
			// 删除确认
			confirm() {
				this.$api.deleteProjectTable({ pkId: this.nowClick.pkId }).then(res => {
					if (res.code == 200) {
						this.findProjectTableByProjectId();
						this.showPop = false;
						this.show2 = false;
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			add() {
				let item = {
					itemTitle: "新增工程项目",
				};
				uni.navigateTo({
					url: "/pages/project/infoAddProject?row=" + JSON.stringify(item),
				});
			},
			// 编辑
			redact() {
				let item = {
					itemTitle: "编辑工程项目",
					...this.nowClick,
				};
				this.showPop = false;
				uni.navigateTo({
					url: "/pages/project/infoAddProject?row=" + JSON.stringify(item),
				});
			},
			resh() {
				this.search();
			},
			findProjectTableByProjectId() {
				let proOrgId =
					this.userInfo.orgType === 5 ?
					this.userInfo.orgId :
					!!this.proId ?
					this.proId :
					uni.getStorageSync("nowOrgId");
				this.$api.findProjectTableByProjectId({ proOrgId }).then(res => {
					console.log(res);
					if (res.code === 200) {
						this.list = res.data;
						this.showList = res.data;
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
						});
					}
				});
			},
			search() {
				console.log(this.name);
				this.showList = this.list.filter(
					item => item.projectName.indexOf(this.name) != -1
				);
			},
			openDetail(item) {
				this.nowClick = item;
				this.showPop = true;
			},
			closePop() {
				this.showPop = false;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.sticky {
		display: flex;
		align-items: center;
		height: 80rpx;
		background-color: #fff;
		padding: 0 20rpx;

		.search {
			width: 700rpx;
			padding-left: 20rpx;
			border: 1px solid #2a82e4;
			border-radius: 6rpx;
		}
	}

	.pad {
		height: 80rpx;
	}

	.popup {
		position: relative;
		width: 750rpx;
		height: 80vh;
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
			height: 100%;
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

		// .footer {
		//   position: absolute;
		//   bottom: 0;
		//   left: 0;
		//   right: 0;
		//   display: flex;
		//   justify-content: space-evenly;
		//   align-items: center;
		//   height: 100rpx;
		//   background-color: #fff;
		//   .btns {
		//     width: 210rpx;
		//   }
		//   .cancle {
		//     background-color: #eeeeee;
		//     color: #aaaaaa;
		//   }
		// }
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
				background: rgba(67, 207, 124, 1);
				font-size: 16px;
				font-weight: 500;
				letter-spacing: 0px;

				color: rgba(255, 255, 255, 1);
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
				background-color: red;
				color: #fff;
			}
		}
	}

	.btn {
		z-index: 99;
	}
</style>