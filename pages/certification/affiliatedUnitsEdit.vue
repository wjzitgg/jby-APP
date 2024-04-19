<template>
	<view class="wrapper">
		<u-navbar :leftText="title" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="list-content">
			<view class="swipe-action u-border-top u-border-bottom">
				<view class="item">
					<view class="line bg1"></view>
					<view class="orgContent">
						<view class="orgType">
							<view class="orgTypeName">单位子公司</view>
						</view>
						<view class="orgName">{{ this.objData.orgName }}</view>
						<view class="linkUser">{{ objData.linkMan }}</view>
						<view class="linkPhone">{{ objData.linkPhone }}</view>
						<image class="logo" mode="widthFix" :src="
                objData.orgLogo
                  ? objData.orgLogo
                  : '/static/image/superiors1.png'
              "></image>
					</view>
				</view>
			</view>
			<view class="content">
				<view class="content-title">人员信息</view>
				<view class="table_detail">
					<table>
						<thead>
							<tr>
								<th style="width: 40px">
									<u-icon name="list" style="display: inline-block"></u-icon>
								</th>
								<th>员工姓名</th>
								<th>性别</th>
								<th>手机号码</th>
								<th>所属部门</th>
								<th>所属角色</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in tableData" :key="index">
								<td>{{ index + 1 }}</td>
								<td>{{ item.aliasName }}</td>
								<td>{{ item.sex==1?'男':'女' }}</td>
								<td>{{ item.telephone }}</td>
								<td>{{ item.deptName }}</td>
								<td>{{ item.roleNameList }}</td>
							</tr>
						</tbody>
					</table>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tableForm from "../../components/table-form/table-form.vue";
	export default {
		components: { tableForm },
		data() {
			return {
				loading: false,
				objData: {},
				title: "",
				tableData: [],
			};
		},
		onLoad(options) {
			// this.getList();
			console.log("11111111111111");
			// this.title = options.title
			this.objData = JSON.parse(options.item);
			this.title = this.objData.orgName;
			console.log(this.objData);
			console.log("11111111111111");
			this.jurisdictionalOrg(this.objData.pkId);
			// this.getChildOrg();
		},
		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
			},
		},
		methods: {
			jurisdictionalOrg(id) {
				let data = {
					pageNum: 1,
					pageSize: 1000,
					orgId: id,
				};
				this.loading = true;
				this.$api.jurisdictionalOrg(data).then(res => {
					if (res.code == 200) {
						this.tableData = res.data.records;
						this.loading = false;
					} else {
						this.loading = false;
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
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
	}

	.content {
		margin-top: 20rpx;

		.content-title {
			background: #fff;
			padding: 20rpx;
			font-weight: 800;
		}
	}
</style>