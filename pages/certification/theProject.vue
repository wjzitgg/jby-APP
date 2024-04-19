<template>
	<view class="wrapper">
		<u-navbar leftText="所辖项目" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="sticky">
			<view class="search">
				<u-input placeholder="请输入负责人姓名或者联系电话" border="none" v-model="name" maxlength="25">
					<template slot="suffix">
						<u-icon name="search" size="28" @click="search"></u-icon>
					</template>
				</u-input>
			</view>
		</view>
		<view class="pad"></view>
		<view class="content">
			<view class="item" v-for="item in list" :key="item.pkId" @click="openPop(item)">
				<u-icon name="photo" class="iconfont" size="20"></u-icon>
				<view class="item-content">
					<view class="name">{{ item.orgName }}</view>
					<view class="types">负责人：{{ item.linkMan }}</view>
				</view>
			</view>
		</view>
		<u-popup :show="showPop" :round="20">
			<view class="popup">
				<view class="head">
					<view class="name">{{ nowClick.orgName }}</view>
					<u-icon name="close" color="#fff" class="closeBtn" @click="closePop"></u-icon>
				</view>
				<view class="content">
					<u--form labelPosition="left" :borderBottom="true" class="form">
						<u-form-item label="负责人" labelWidth="80">
							<view>{{ nowClick.linkMan }}</view>
						</u-form-item>
						<u-form-item label="联系电话" labelWidth="80">
							<view>{{ nowClick.linkPhone }}</view>
						</u-form-item>
						<u-form-item label="备注" labelWidth="80">
							<view class="remark">{{ nowClick.lremark }}</view>
						</u-form-item>
					</u--form>
					<view class="line"></view>
					<u--form labelPosition="left" :borderBottom="true" class="form">
						<u-form-item label="项目名称" labelWidth="80">
							<view>{{ nowClick.projectName }}</view>
						</u-form-item>
						<u-form-item label="项目地点" labelWidth="80">
							<view class="remark">{{ nowClick.detailAddress }}</view>
						</u-form-item>
						<u-form-item label="建设单位" labelWidth="80">
							<view>{{ nowClick.investorName }}</view>
						</u-form-item>
						<u-form-item label="合同金额" labelWidth="80">
							<view>{{ nowClick.contractAmount }}</view>
						</u-form-item>
						<u-form-item label="工期" labelWidth="80">
							<view>{{ nowClick.duration }}</view>
						</u-form-item>
						<u-form-item label="开工日期" labelWidth="80">
							<view>{{ nowClick.beginTime }}</view>
						</u-form-item>
						<u-form-item label="竣工日期" labelWidth="80">
							<view>{{ nowClick.endTime }}</view>
						</u-form-item>
						<u-form-item label="标段描述" labelWidth="80">
							<view class="remark">{{ nowClick.remark }}</view>
						</u-form-item>
					</u--form>
				</view>
				<view class="pdb"></view>
				<view class="footer">
					<u-button class="btns green" v-if="$auth('org:jurisdiction:framework')" text="组织架构"
						@click="organization"></u-button>
					<u-button class="btns blue" v-if="$auth('org:jurisdiction:engineering')" text="工程项目表"
						@click="table"></u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: "",
				searchName: "",
				list: [],
				showPop: false,
				nowClick: {},
			};
		},
		onLoad(options) {
			this.searchProjectOrg();
		},
		methods: {
			searchProjectOrg() {
				this.$api.searchProjectOrg({ keyWord: this.searchName }).then(res => {
					if (res.code === 200) {
						this.list = res.data;
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
						});
					}
				});
			},
			openPop(item) {
				this.$api.findProjectByProOrgId({ proOrgId: item.pkId }).then(res => {
					if (res.code === 200) {
						this.nowClick = {
							...res.data,
							linkMan: item.linkMan,
							linkPhone: item.linkPhone,
							orgName: item.orgName,
							lremark: item.remark,
							proId: item.pkId
						};
						this.showPop = true;
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
						});
					}
				});
			},
			closePop() {
				this.showPop = false;
			},
			search() {
				this.searchName = this.name;
				this.searchProjectOrg();
			},
			organization() {
				uni.navigateTo({ url: "/pages/certification/organization?orgId=" + this.nowClick.proId });
			},
			table() {
				uni.navigateTo({ url: "/pages/project/table?proId=" + this.nowClick.proId });
			}
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
		height: 90rpx;
	}

	.pdb {
		height: 100rpx;
	}

	.item {
		display: flex;
		align-items: start;
		padding: 30rpx 20rpx;
		background-color: #fff;
		margin-bottom: 10rpx;

		.iconfont {
			width: 60rpx;
		}

		.item-content {
			width: 550rpx;

			.name {
				max-width: 550rpx;
				margin-bottom: 20rpx;
				font-size: 30rpx;
				font-weight: 600;
				overflow: hidden;
				/*超出部分隐藏*/
				white-space: nowrap;
				/*禁⽌换⾏*/
				text-overflow: ellipsis;
				/*省略号*/
			}

			.types {
				font-size: 24rpx;
				color: #a6aebc;
			}
		}
	}

	.popup {
		position: relative;
		width: 750rpx;
		height: 1100rpx;
		background-color: #2a82e4;
		border-radius: 20rpx 20rpx 0 0;

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
			height: 920rpx;
			overflow: auto;
			background-color: #fff;

			border-radius: 20rpx 20rpx 0 0;

			.form {
				padding: 0 20rpx;

				.u-form-item {
					border-bottom: 1px solid #f6f6f6;
				}
			}

			.line {
				height: 10rpx;
				background-color: #f6f6fc;
			}

			.remark {
				max-height: 400rpx;
				overflow: auto;
			}
		}

		.footer {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			height: 100rpx;
			background-color: #fff;

			.btns {
				width: 300rpx;
				color: #fff;
			}

			.cancle {
				background-color: #eeeeee;
				color: #aaaaaa;
			}

			.green {
				background-color: #43cf7c;
			}

			.blue {
				background-color: #2a82e4;
			}
		}
	}
</style>