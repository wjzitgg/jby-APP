<template>
	<view class="wrapper">
		<u-navbar leftText="员工管理" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="sticky">
			<u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="true"
				:activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}">
			</u-tabs>
			<view class="search">
				<view class="search-input">
					<u-input placeholder="请输入员工名称或者手机号码" border="none" v-model="name" maxlength="25">
						<view slot="suffix">
							<u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon>
						</view>
					</u-input>
				</view>
				<view class="more-search" @click="openPop">
					<image src="../../static/image/u486.png" mode="widthFix" class="filterImg" />
					<view>筛选</view>
				</view>
			</view>
		</view>
		<view class="pad"></view>
		<view class="content" style="padding-bottom: 65px">
			<view class="item" v-for="item in list" :key="item.pkId" @click="listClick(item)">
				<u-icon name="account" class="iconfont" size="20"></u-icon>
				<view class="item-content">
					<view class="name">
						{{ item.userName }}
						<u-icon name="man" v-show="item.sex == 1" style="display: inline-block; margin-left: 6px"></u-icon>
						<u-icon name="woman" v-show="item.sex == 2" style="display: inline-block; margin-left: 6px"></u-icon>
					</view>
					<view class="types">{{ item.telephone }}</view>
				</view>
				<view class="tag" :class="{
          'tag-link': !!item.enableStatus,
          'tag-nolink': !item.enableStatus,
        }">{{ !!item.enableStatus ? "启用" : "停用" }}</view>
			</view>
		</view>
		<view type="primary" v-if="$auth('org:user:add')" class="btn" @click="go(1)">新增员工</view>
		<u-popup :show="showPop" @close="closePop" mode="right">
			<view class="popup">
				<view class="screen">
					请选择筛选条件
				</view>
				<view class="popup-content">
					<view class="search-item mb-24">
						<h5 class="mb-24">性别</h5>
						<view class="item-tag" :class="sex == 1 ? 'checked-item-tag' : ''" @click="tagClick(1)">男</view>
						<view class="item-tag" :class="sex == 2 ? 'checked-item-tag' : ''" @click="tagClick(2)">女</view>
					</view>
					<view class="search-item mb-24">
						<h5 class="mb-24">所属角色</h5>
						<view v-for="(item, idx) in roleList" :key="idx" class="item-tag"
							:class="roleId == item.pkId ? 'checked-item-tag' : ''" @click="roleClick(item.pkId)">{{ item.roleName }}
						</view>
					</view>
					<view class="search-item mb-24">
						<h5 class="mb-24">账号状态</h5>
						<view class="item-tag" :class="enableStatus === 1 ? 'checked-item-tag' : ''" @click="tagStatus(1)">正常</view>
						<view class="item-tag" :class="enableStatus === 0 ? 'checked-item-tag' : ''" @click="tagStatus(0)">禁用</view>
					</view>
					<image src="/static/image/searchBg.png" mode="aspectFit" class="img-status"></image>
				</view>

				<view class="footer">
					<view class="footerBtn cancel" @click="closePop">取消</view>
					<view class="footerBtn add" @click="searchOk">确认</view>
				</view>
			</view>
		</u-popup>
		<u-popup :show="showEdit" :round="20">
			<view class="bottom-popup" @touchmove.stop.prevent="moveHandle">
				<view class="head">
					<view class="name">{{ rowData.userName }}</view>
					<u-icon name="close" color="#fff" class="closeBtn" @click="closeEdit"></u-icon>
					<!-- <view ></view> -->
				</view>
				<!-- <view class="content"> -->
				<u--form class="content" labelPosition="left" :borderBottom="true">
					<u-form-item label="性别:" labelWidth="80">
						<view>{{ rowData.sex == 1 ? "男" : "女" }}</view>
					</u-form-item>
					<u-form-item label="手机号:" labelWidth="80">
						<view>{{ rowData.telephone }}</view>
					</u-form-item>
					<u-form-item label="所属部门:" labelWidth="80">
						<view>{{ rowData.deptName }}</view>
					</u-form-item>
					<u-form-item label="所属角色:" labelWidth="80">
						<view>{{ rowData.roleName }}</view>
					</u-form-item>
					<u-form-item label="所属工区:" labelWidth="80" v-if="orgType == 5">
						<view>{{ rowData.areaName }}</view>
					</u-form-item>
					<u-form-item label="状态:" labelWidth="80">
						<view>{{ rowData.enableStatus === 0 ? "禁用" : "正常" }}</view>
						<!-- <view class="remark">{{ rowData.remark }}</view> -->
					</u-form-item>
				</u--form>
				<!-- </view> -->
				<view class="pdb"></view>
				<view class="footer">
					<u-button class="btns cancle" type="default" text="取消" @click="closeEdit"></u-button>
					<u-button class="btns" v-if="rowData.enableStatus === 1 && $auth('org:user:editStatus')" type="warning"
						text="禁用" @click="showDelMod = true"></u-button>
					<u-button class="btns" v-if="rowData.enableStatus === 0 && $auth('org:user:editStatus')" type="success"
						text="启用" @click="showLinkMod = true"></u-button>
					<u-button class="btns" type="primary" v-if="$auth('org:user:edit')" text="编辑" @click="go(2)"></u-button>
				</view>
			</view>
			<!-- 禁用弹框 -->
			<u-modal :show="showDelMod" title="禁用确认" content="确定禁用该员工？" showCancelButton @confirm="delConfirm"
				@cancel="closeDelMod"></u-modal>
			<!--  启用 -->
			<u-modal :show="showLinkMod" title="启用确认" content="确定启用该员工？" showCancelButton @confirm="linkModConfirm"
				@cancel="closeLinkMod"></u-modal>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orgId: "",
				name: "",
				searchName: "",
				tabList: [{ name: "全部", pkId: "" }],
				current: 0,
				tabShow: false,
				depId: "",
				list: [],
				roleList: [],
				showPop: false,
				sex: "",
				enableStatus: "",
				roleId: "",
				showEdit: false,
				rowData: {},
				showDelMod: false,
				showLinkMod: false,
				orgType: "",
			};
		},
		onLoad() {
			// this.orgId = options.orgId;
			this.searchDeptListByOrgId();
			// this.searchByDept();
			this.orgType = uni.getStorageSync("user").orgType;
		},
		onShow() {


		},
		methods: {
			moveHandle() {
				return false;
			},
			resh(val) {
				// debugger
				// this.$nextTick(()=>{
				// uni.showToast({ title:"编辑成功" });
				// })
				this.searchDeptListByOrgId();

				this.closeEdit();
				// uni.showToast({ title: "新增成功",icon: "success" });
			},
			go(val) {
				let id = val == 2 ? this.rowData.pkId : "";
				uni.navigateTo({
					url: "/pages/certification/staffAdd?pkId=" + id,
				});
			},
			listClick(row) {
				this.$api.appSysUser({ userId: row.pkId }).then(res => {
					if (res.code == 200) {
						this.showEdit = true;
						this.rowData = res.data;
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			closeDelMod() {
				this.showDelMod = false;
			},
			//  禁用
			delConfirm() {
				this.$api
					.updateStatus({ enableStatus: 0, userId: this.rowData.pkId })
					.then(res => {
						if (res.code == 200) {
							this.showDelMod = false;
							this.showLinkMod = false;
							this.showEdit = false;
							this.search();
							uni.showToast({ title: "禁用成功", icon: "none" });
						} else {
							uni.showToast({ title: res.msg, icon: "none" });
						}
					});
			},
			// 启用
			linkModConfirm() {
				this.$api
					.updateStatus({ enableStatus: 1, userId: this.rowData.pkId })
					.then(res => {
						if (res.code == 200) {
							this.showDelMod = false;
							this.showLinkMod = false;
							this.showEdit = false;
							this.search();
							uni.showToast({ title: "启用成功", icon: "none" });
						} else {
							uni.showToast({ title: res.msg, icon: "none" });
						}
					});
			},
			closeLinkMod() {
				this.showLinkMod = false;
			},
			closeEdit() {
				this.showEdit = false;
			},
			openPop() {
				this.searchByDept();
				this.showPop = true;
			},
			searchOk() {
				this.searchUserByOrg();
				this.closePop();
			},
			closePop() {
				this.showPop = false;
				// this.inpDate = { ...this.searchDate };
			},
			tagClick(val) {
				if (this.sex == val) {
					this.sex = "";
				} else {
					this.sex = val;
				}

			},
			tagStatus(val) {
				this.enableStatus === val ? this.enableStatus = "" : this.enableStatus = val;
			},
			roleClick(val) {
				this.roleId == val ? this.roleId = "" : this.roleId = val;
			},
			// 获取所有角色
			searchByDept() {
				let data = {
					deptId: this.depId
				};
				this.$api.searchByDept(data).then(res => {
					if (res.code == 200) {
						this.roleList = res.data;
						this.roleId = "";
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			add() {},
			searchDeptListByOrgId() {
				this.$api.searchEasyDeptList().then(res => {
					if (res.code === 200) {
						this.tabList = [
							{ name: "全部", pkId: "" },
							...res.data.map(item => ({ ...item, name: item.deptName })),
						];
						this.searchUserByOrg();
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			searchUserByOrg() {
				// fkOrgId:this.orgId,keyWord:this.searchName, roleNames
				this.$api
					.searchUserByOrg({
						fkDeptId: this.depId,
						roleOrTelephone: this.searchName,
						roleId: this.roleId,
						sex: this.sex,
						enableStatus: this.enableStatus,
					})
					.then(res => {
						if (res.code === 200) {
							this.list = res.data;
						} else {
							uni.showToast({ title: res.msg, icon: "none" });
						}
					});
			},
			search() {
				this.searchName = this.name;
				this.searchUserByOrg();
			},
			currentChange(e) {
				this.current = e.index;
				this.depId = e.pkId;
				this.list = [];;
				this.searchUserByOrg();
				// this.searchByDept();
			},
			// tab点击
			// listSelet(item, index) {
			//   // 展开传值
			//   this.current = index;
			//   this.depId = item.pkId;
			//   this.tabShow = false;
			//   this.searchUserByOrg();
			// },
			// 汉堡点击展开tabs
			// hamburg() {
			//   this.tabShow = !this.tabShow;
			// },
			// shut() {
			//   this.tabShow = false;
			// },
		},
	};
</script>

<style lang="scss" scoped>
	.pad {
		height: 178rpx;
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

	.mb-24 {
		margin-bottom: 24rpx;
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
			border: 1px solid #2a82e4;
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
				height: 40rpx;
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
			}
		}

		.tag {
			width: 100rpx;
			padding: 10rpx;
			font-size: 24rpx;
			text-align: center;
		}

		.tag-link {
			color: #18a87d;
			background-color: #d1fff1;
		}

		.tag-nolink {
			color: #aaaaaa;
			background-color: #eeeeee;
		}

		.linkBtn {
			width: 100rpx;
			height: 74rpx;
			line-height: 74rpx;
			text-align: center;
			background-color: #d4e6fa;
			color: #2a82e4;
		}
	}

	.popup {
		position: relative;
		width: 560rpx;
		/*#ifdef APP-PLUS*/
		height: calc(100vh - 156rpx);
		/*#endif*/
		/*#ifdef H5*/
		height: calc(100vh - 88rpx);
		/*#endif*/
		padding: 112rpx 24rpx 0;
		/*#ifdef APP-PLUS*/
		// margin-top: 156rpx;
		/*#endif*/
		/*#ifdef H5*/
		// margin-top: 88rpx;
		/*#endif*/
		background-color: #ffffff;
		position: relative;

		.screen {
			position: absolute;
			top: 24rpx;
			font-weight: 500;
			left: 0;
			width: 100%;
			height: 48rpx;
			line-height: 48rpx;
			padding-left: 20rpx;
			font-size: 24rpx;
			color: #BA890D;
			background: linear-gradient(90deg, #ffefbb 0%, #fffdf8 100%);
		}

		.popup-pad {
			/*#ifdef APP-PLUS*/
			height: 156rpx;
			/*#endif*/
			/*#ifdef H5*/
			height: 88rpx;
			overflow: hidden;
			/*#endif*/
		}

		.popup-content {

			height: calc(100% - 100rpx);
			overflow: auto;

			h5 {
				font-size: 32rpx;
			}
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

		.img-status {
			display: block;
			margin: 80rpx auto;
			width: 400rpx;
			height: 200rpx;
			// position: fixed;
			// bottom: 160rpx;
			// left: 50%;
			// margin-left: -100rpx;
		}

		.footer {
			position: absolute;
			left: 0;
			bottom: 0;
			display: flex;
			width: 580rpx;
			height: 120rpx;

			.footerBtn {
				width: 290rpx;
				height: 120rpx;
				line-height: 120rpx;
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
	}

	.item-tag {
		display: inline-block;
		margin: 0 18rpx 18rpx 0;
		padding: 0 52rpx;
		text-align: center;
		background: #f9f9f9;
		color: #4b5b77;
		font-size: 14px;
		line-height: 64rpx;
		border-radius: 5px;
		border: 1px solid #eeeeee;
	}

	.checked-item-tag {
		background: #e0efff;
		border: 1px solid #2a82e4;
		color: #465979;
	}

	.bottom-popup {
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
			background-color: #fff;
			padding: 0 20rpx;
			border-radius: 20rpx 20rpx 0 0;

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
				width: 210rpx;
			}

			.cancle {
				background-color: #eeeeee;
				color: #aaaaaa;
			}
		}
	}

	/deep/ .u-transition {
		margin-top: 44px !important;
	}
</style>