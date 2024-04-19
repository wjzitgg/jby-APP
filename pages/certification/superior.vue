<template>
	<view class="wrapper">
		<u-navbar leftText="管理单位" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="list-content">
			<u-swipe-action>
				<u-swipe-action-item :options="options1" @click="unfriend" :disabled="obj1.pkId ? false : true" ref="slide">
					<view class="swipe-action u-border-top u-border-bottom">
						<view class="item" @click="obj1.pkId ? openPop(1) : go(0)">
							<view class="line bg1"></view>
							<view class="orgContent" v-if="!!obj1.pkId">
								<view class="orgType">
									<view class="orgTypeName">集团总公司</view>
								</view>
								<view class="orgName">{{ obj1.orgName }}</view>
								<view class="linkUser">{{ obj1.orgLinkMan }}</view>
								<view class="linkPhone">{{ obj1.orgLinkPhone }}</view>
								<image class="logo" mode="widthFix" :src="
                    obj1.orgLogo ? obj1.orgLogo : '/static/image/superiors1.png'
                  "></image>
							</view>
							<view class="noOrg" v-if="!obj1.pkId">
								<u-icon name="plus" class="add" size="30" color="#ccc"></u-icon>
								<view class="addTitle">绑定集团总公司</view>
							</view>
						</view>
					</view>
					<!-- <template slot="right" >
						 <view class="slot-button">删除</view>
					  </template> -->
				</u-swipe-action-item>
			</u-swipe-action>

			<view v-if="user.orgType == 2">
				<u-swipe-action>
					<u-swipe-action-item v-for="(item, index) in list" :key="item.pkId" :options="options1"
						@click="unfriends(item, index)" :disabled="obj1.pkId ? false : true" :ref="'slide' + index">
						<view class="item" @click="control(index)">
							<view class="line bg3"></view>

							<view class="orgContent" v-if="!!item.pkId">
								<view class="orgType">
									<view class="orgTypeName">监管单位</view>
								</view>
								<view class="orgName">{{ item.orgName }}</view>
								<view class="linkUser">{{ item.orgLinkMan }}</view>
								<view class="linkPhone">{{ item.orgLinkPhone }}</view>
								<image class="logo" mode="widthFix" :src="
                    item.orgLogo ? item.orgLogo : '/static/image/superiors3.png'
                  "></image>
							</view>
						</view>
					</u-swipe-action-item>
				</u-swipe-action>
				<view class="item" @click="go(1)">
					<view class="line bg3"></view>
					<view class="noOrg">
						<u-icon name="plus" class="add" size="30" color="#ccc"></u-icon>
						<view class="addTitle">绑定监管单位</view>
						<image class="logo" mode="widthFix" src="/static/image/superiors3.png"></image>
					</view>
				</view>
			</view>
		</view>
		<u-action-sheet :actions="actionList" @select="selectClick" title="操作" :show="showPop"
			@close="showPop = false"></u-action-sheet>
		<u-modal :show="showLinkMod" title="解除关联确认" content="确定解除该客户信息在系统中关联关系？" showCancelButton @confirm="linkModConfirm"
			@cancel="closeLinkMod"></u-modal>
		<u-modal :show="showLinkMod2" title="绑定关联确认" content="当前已产生关联数据，是否重新绑定原公司？" showCancelButton
			@confirm="linkModConfirm2" @cancel="closeLinkMod2" confirmText="重新绑定"></u-modal>
	</view>
</template>

<script>
	import tableForm from "../../components/table-form/table-form.vue";
	export default {
		components: { tableForm },
		data() {
			return {
				showPop: false,
				showLinkPop: false,
				showDelMod: false,
				showLinkMod: false,
				cusTypeList: [
					{ id: 2, name: "建设单位" },
					{ id: 3, name: "监理公司" },
					{ id: 9, name: "设计院" },
				],
				orgTypeList: [
					"系统运营商",
					"系统代理商",
					"建设单位",
					"监理公司",
					"施工单位",
					"项目部",
					"供应商",
					"分包商",
					"劳务工人",
					"设计院",
					"施工单位集团公司",
					"政府监管单位",
					"建设单位集团公司",
				],
				nowClick: {},
				loading: false,
				linkList: [],
				linkPhone: "",
				obj1: {},
				list: [],
				showLinkMod2: false,
				actionList: [{ name: "解绑公司" }],
				options1: [{ text: "", disabled: false }],
				num: 0, //控制建设单位
				num2: 0, //控制监理单位
			};
		},
		onLoad(options) {
			this.getList();
		},
		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
			},
		},
		methods: {
			unfriend(e) {
				console.log("11111111111111111");
				this.$refs.slide.closeHandler();
				this.nowClick.pkId = this.obj1.pkId;
				this.selectClick(this.obj1);
			},
			unfriends(item, idx) {
				console.log(item);
				// return this.list[idx].show = true;
				this.$refs["slide" + idx][0].closeHandler();
				this.nowClick.pkId = item.pkId;
				this.selectClick(item);
			},
			getList() {
				this.searchSuperiorOrg(0);
				if (this.user.orgType == 2) {
					this.searchSuperiorOrg(1);
				}
			},
			selectClick(item) {
				console.log(item);
				let data = {
					customId: this.nowClick.pkId,
				};
				this.$api.secureBinding(data).then(res => {
					if (res.code == 200) {
						this.resh();
						this.showPop = false;
						uni.showToast({ title: "解除成功" });
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			resh() {
				this.closePop();
				this.getList();
			},
			searchSuperiorOrg(type) {
				this.$api.searchSuperiorOrg({ superiorOrgType: type }).then(res => {
					if (res.code === 200) {
						if (type == 0) {
							if (res.data.length) {
								this.obj1 = res.data[0];
							} else {
								this.obj1 = {};
							}
						} else if (type == 1) {
							this.list = res.data;
							this.list.forEach(item => {
								item.show = false;
							});
						}
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			go(superiorOrgType) {
				let orgType = "";
				if (this.user.orgType == 4) {
					orgType = 10;
				}
				if (this.user.orgType == 2 && superiorOrgType == 0) {
					orgType = 12;
				}
				if (this.user.orgType == 2 && superiorOrgType == 1) {
					orgType = 11;
				}
				let url = `/pages/certification/selectLink?orgType=${orgType}`;
				uni.navigateTo({ url });
			},
			openPop(item) {
				let status = this.$refs.slide.status;
				if (status == "close" && this.num == 0) {
					this.$refs.slide.status = "open";
					this.num = 1;
				} else {
					this.num = 0;
					// this.$refs.slide.$attrs.status = "close";
				}
				// if (item == "1") {
				//   return;
				// }
				// this.nowClick = item;
				// this.showPop = true;
			},
			// 监管单位处理
			control(index) {
				let status = this.$refs["slide" + index][0].status;
				if (status == "close" && this.num2 == 0) {
					this.$refs["slide" + index][0].status = "open";
					this.num2 = 1;
				} else {
					this.num2 = 0;
				}
			},
			delCus() {
				this.showDelMod = true;
			},
			relieveLink() {
				this.showLinkMod = true;
			},
			linkModConfirm() {
				this.updateRelationById(this.nowClick.pkId);
			},
			closeLinkMod() {
				this.showLinkMod = false;
			},
			linkModConfirm2() {
				this.updateRelationById(this.nowClick.pkId, this.nowClick.fkLinkOrgId);
			},
			closeLinkMod2() {
				this.showLinkMod2 = false;
			},
			closePop() {
				this.showPop = false;
			},
			openLinkPop() {
				if (this.nowClick.fkLinkOrgId && this.nowClick.fkLinkOrgId != "0") {
					this.showLinkMod2 = true;
				} else {
					uni.navigateTo({
						url: `/pages/custom/selectLink?pkId=${this.nowClick.pkId}&orgType=${this.nowClick.orgType}`,
					});
				}
			},
			isLink(row) {
				console.log(row);
				this.updateRelationById(this.nowClick.pkId, row.pkId);
			},
			searchLinkList() {
				let data = {
					linkPhone: this.linkPhone,
					orgType: this.nowClick.orgType,
				};
				this.loading = true;
				this.$api
					.searchOrgLinkPhone(data)
					.then(res => {
						this.loading = false;
						if (res.code === 200) {
							this.linkList = res.data;
						} else {
							uni.showToast({ title: res.msg, icon: "none" });
						}
					})
					.catch(err => {
						this.loading = false;
					});
			},
			closeLinkPop() {
				this.linkPhone = "";
				this.linkList = [];
				this.showLinkPop = false;
				this.loading = false;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.list-content {
		padding: 0 24rpx;
	}

	.item {
		position: relative;
		display: flex;
		width: 100%;
		height: 360rpx;
		margin-top: 20rpx;
		border-radius: 8rpx;
		overflow: hidden;
		background-color: #fff;
		z-index: 1;

		.logo {
			position: absolute;
			bottom: 0;
			right: 22rpx;
			width: 230rpx;
			height: 230rpx;
			z-index: -1;
		}

		.line {
			width: 12rpx;
			height: 100%;
		}

		.orgContent {
			flex: 1;
			padding: 46rpx 28rpx;

			.orgType {
				display: flex;
				font-size: 24rpx;
				margin-bottom: 18rpx;

				.orgTypeName {
					color: #095cab;
				}

				.linkType {
					margin-left: 20rpx;
					opacity: 0.2;
				}
			}

			.orgName {
				font-weight: 700;
				font-size: 32rpx;
				line-height: 44rpx;
				margin-bottom: 56rpx;
			}

			.linkUser {
				margin-bottom: 8rpx;
			}

			.linkUser,
			.linkPhone {
				line-height: 36rpx;
				font-size: 24rpx;
			}
		}

		.noOrg {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.add {
				color: #cccccc;
				margin-bottom: 18rpx;
			}

			.addTitle {
				font-size: 24rpx;
				opacity: 0.6;
			}
		}

		.bg1 {
			background: linear-gradient(180deg,
					rgba(42, 130, 228, 1) 0%,
					rgba(185, 165, 250, 1) 100%);
		}

		.bg2 {
			background: linear-gradient(180deg,
					rgba(85, 242, 93, 1) 0%,
					rgba(41, 205, 227, 1) 100%);
		}

		.bg3 {
			background: linear-gradient(180deg,
					rgba(242, 143, 85, 1) 0%,
					rgba(227, 41, 41, 1) 100%);
		}
	}

	.item-bg1 {
		background-image: url("/static/image/superiors1.png");
	}

	.item-bg2 {
		background-image: url("/static/image/superiors2.png");
	}

	.item-bg3 {
		background-image: url("/static/image/superiors3.png");
	}

	.pdb {
		height: 100rpx;
	}

	.popup {
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
				width: 220rpx;
				margin: 0;
			}

			.cancle {
				background-color: #eeeeee;
				color: #aaaaaa;
			}
		}
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
			justify-content: space-evenly;
			align-items: center;
			height: 100rpx;
			background-color: #fff;

			.btns {
				width: 300rpx;
			}

			.cancle {
				background-color: #eeeeee;
				color: #aaaaaa;
			}
		}
	}

	/deep/ .u-swipe-action-item__content {
		background: #f7f7ff;
	}

	/deep/ .u-swipe-action-item__right__button__wrapper {
		background-image: url("../../static/image/relieve.png") !important;
		/* 根据自己项目结构调整路径 */
		width: 120rpx !important;
		height: 120rpx !important;
		background-size: cover !important;
		/* 控制背景图大小适配 */
		border-radius: 50% !important;
		margin-top: 140rpx;
		margin-left: 20rpx;
	}

	/deep/ .u-swipe-action-item__right__button__wrapper__text {
		color: #79859a !important;
		font-size: 11px !important;
		display: inline-block !important;
	}
</style>