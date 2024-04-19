<template>
	<view class="wrapper">
		<u-navbar leftText="班组管理" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="sticky">
			<view class="search">
				<u-input placeholder="班组名称/负责人/手机号码" border="none" v-model="inpName" maxlength="25">
					<template slot="suffix">
						<u-icon name="search" size="28" color="#2a82e4" @click="searchBtn"></u-icon>
					</template>
				</u-input>
			</view>
		</view>
		<view class="pad"></view>
		<view class="content">
			<u-list height="calc( 100vh - 300rpx)" @scrolltolower="scrolltolower">
				<u-list-item v-for="(item, index) in showList" :key="index">
					<u-cell isLink class="cell" @click="cellClick(item)">
						<view slot="title">
							<view class="cell-item mb-20">
								<h4 class="cell-item-title">班组名称：{{item.teamName}}</h4>
							</view>
							<view class="cell-item mb-20 grey">负责人：{{item.leaderName}}</view>
							<view class="cell-item grey">
								<view>手机号码：{{item.leaderPhone}}</view>
							</view>
						</view>
					</u-cell>
				</u-list-item>
			</u-list>
		</view>
		<!-- <view class="pab"></view> -->
		<view class="footer">
			<view class="btns" v-if="$auth('labour:team:add')" @click="addClass">创建班组</view>
			<view class="btns" @click="getOrgSealState">新增人员邀请码</view>
		</view>
		<u-modal :show="show" :content='content' showCancelButton @confirm="confirm" @cancel="cancel"
			:asyncClose="true"></u-modal>
	</view>
</template>

<script>
	export default {
		computed: {
			userInfo() {
				return this.$store.state.userInfo;
			}
		},
		data() {
			return {
				showList: [],
				total: 0,
				pageNum: 1,
				inpName: "",
				searchName: "",
				refreshIfNeeded: false,
				show: false,
				content: "企业未实名,是否跳转到去实名"
			};
		},
		onLoad(options) {
			this.teamsSearchPage();
		},
		onShow() {
			// let pages = getCurrentPages(); // 获取当前页面栈
			// let currentPage = pages[pages.length - 1]; // 当前页面
			if (this.refreshIfNeeded) {
				this.refreshIfNeeded = false;
				this.pageNum = 1;
				this.teamsSearchPage();
				// this.mescroll.resetUpScroll(); // 调用列表重置刷新页面
				// this.mescroll.scrollTo(0,0); // 滚动页面置顶
			}
		},
		methods: {
			teamsSearchPage() {
				let data = {
					pageNum: this.pageNum,
					pageSize: 20,
					keyWord: this.searchName,
					fkProjectId: [5, 7].includes(this.userInfo.orgType) ? "" : uni.getStorageSync("nowProId")
				};
				uni.showLoading({ mask: true });
				this.$api.teamsSearchPage(data).then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							if (this.pageNum === 1) {
								this.showList = res.data.records;
							} else {
								this.showList = [...this.showList, ...res.data.records];
							}
							this.total = res.data.total - 0;
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
			searchBtn() {
				this.searchName = this.inpName;
				this.pageNum = 1;
				this.teamsSearchPage();
			},
			cellClick(item) {
				uni
					.navigateTo({ url: `/pages/labour/teamDetail?type=${this.userInfo.orgType===7?2:3}&data=${JSON.stringify(item)}` });
			},
			addClass() {
				uni.navigateTo({ url: "/pages/labour/teamDetail?type=1" });
			},
			getOrgSealState() {
				uni.showLoading({ mask: true });
				this.$api.getOrgSealState().then(res => {
					uni.hideLoading();
					if (res.code === 200) {
						if (res.data == 1) {
							uni.navigateTo({ url: "/pages/labour/inviteCode" });
						}
						if (res.data == 0) {
							this.content = "企业未实名，是否去对应页面实名?";
							this.show = true;
						}
						if (res.data == 2) {
							this.content = "企业授权已过期，是否去对应页面实名?";
							this.show = true;
						}

					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
						});
					}
				});
			},
			confirm() {
				setTimeout(() => {
					uni.navigateTo({ url: "/pages/certification/business-certification" });
					this.show = false;
				}, 200);
			},
			cancel() {
				this.show = false;
			},
			scrolltolower() {
				if (this.pageNum * 20 > this.total) {
					return;
				}
				this.pageNum = this.pageNum + 1;
				this.teamsSearchPage();
			}
		},
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}

	.pad {
		height: 80rpx;
	}

	.pab {
		height: 100rpx;
	}

	.sticky {
		display: flex;
		align-items: center;
		height: 80rpx;
		padding-left: 20rpx;
		border-bottom: 1px solid #d7d7d7;
	}

	.search {
		width: 600rpx;
		padding-left: 10rpx;
		border: 1px solid #2a82e4;
	}

	.cell {
		background-color: #fff;

		.cell-item {
			display: flex;
			justify-content: space-between;
			font-size: 26rpx;

			.cell-item-title {
				width: 600rpx;
				overflow: hidden;
				white-space: nowrap;
				/*禁⽌换⾏*/
				text-overflow: ellipsis;
				/*省略号*/
			}

			.state {
				display: flex;

				.state-item {
					display: flex;
				}
			}

			.grey {
				color: #7f7f7f;
			}
		}
	}

	.mb-20 {
		margin-bottom: 20rpx;
	}

	.mr-20 {
		margin-right: 20rpx;
	}

	.footer {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100rpx;
		z-index: 2;
		background-color: #fff;

		.btns {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 320rpx;
			height: 80rpx;
			background-color: #02a7f0;
			color: #fff;
			border-radius: 10rpx;
			font-size: 28rpx;
		}
	}
</style>