<template>
	<view class="wrapper">
		<u-navbar :leftText="title" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="sticky">
			<u-tabs class="tabList" :list="list1" :current="current" @change="currentChange" :scrollable="false"
				:activeStyle="{ color: 'rgba(32, 52, 87, 1)' }" :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }"></u-tabs>
		</view>
		<view class="pad"></view>
		<view class="content">
			<view class="addPageBg" v-show="current == 0">
				<view class="add-inputs">
					<view class="inputs-label">角色名称</view>
					<view class="inputs-content">
						<u--textarea v-model="depData.roleName" placeholder="请输入内容" autoHeight maxlength="25"
							border="none"></u--textarea>
					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">排序值</view>
					<view class="inputs-content">
						<u--input placeholder="请输入排序值" border="none" v-model="depData.sortval" type="number" maxlength="6"
							@input="inpt"></u--input>
					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">角色描述</view>
					<view class="inputs-content">
						<u--textarea v-model="depData.remark" placeholder="请输入内容" autoHeight maxlength="100"
							border="none"></u--textarea>
					</view>
				</view>
			</view>
			<view class="meun" v-show="current == 1">
				<view class="">
					<tree ref="treePicker" :wipeStatus="false" :associatedNode="true" :selectedData="depData.defaultMenuIdPcList"
						:localdata="sysMenuListPc" valueKey="pkId" :disabled="false" textKey="menuName" childrenKey="children"
						@select-change="selectChange"></tree>
				</view>
			</view>
			<view class="meun" v-show="current == 2">
				<view class="">
					<tree ref="treePicker2" :disabled="false" :wipeStatus="false" :associatedNode="true"
						:selectedData="depData.defaultMenuIdAppList" :localdata="sysMenuListApp" valueKey="pkId" textKey="menuName"
						childrenKey="children"></tree>
				</view>
			</view>
			<view class="meun" v-show="current == 3">
				<view class="data-authority" v-show="user.manageDataStatus == 1">
					<view class="title" style="padding-top: 20px">查看和管理他人数据</view>
					<u-radio-group v-model="depData.manageAuthorize.type" placement="row" style="padding: 10px">
						<u-radio :customStyle="{ marginBottom: '8px', marginRight: '10px' }" v-for="(item, index) in radioList"
							:key="index" :label="item.name" :name="item.value">
						</u-radio>
					</u-radio-group>
				</view>
				<view class="data-authority" v-show="user.manageDataStatus == 1">
					<view class="title">数据权限</view>
					<tree ref="treePicker3" :selectedData="depData.manageAuthorize.userId" :localdata="departmentList"
						valueKey="pkId" textKey="aliasName" :disabled="false" :wipeStatus="false" childrenKey="children"></tree>
				</view>
				<view class="data-authority">
					<view class="title">单价和金额权限</view>
					<tree ref="treePicker4" class="price-amount" :selectedData="depData.viewAuthorize"
						:localdata="sysMenuListData" valueKey="pkId" textKey="menuName" childrenKey="child">
					</tree>
				</view>
			</view>
		</view>
		<view class="foot">
			<view class="cancel" @click="cancel">取消</view>
			<view class="submit" @click="submit">保存</view>
		</view>
	</view>
</template>

<script>
	import tree from "@/components/ba-tree-picker/ba-tree-picker.vue";
	export default {
		components: {
			tree,
		},
		data() {
			return {
				title: "新增权限",
				pkId: "",
				current: 0,
				list1: [{
						name: "基本信息",
					},
					{
						name: "PC权限",
					},
					{
						name: "APP权限",
					},
					{
						name: "数据权限",
					},
				],
				depData: {
					roleName: "",
					sortval: "",
					remark: "",
					defaultMenuIdPcList: [], // PC选中的菜单
					defaultMenuIdAppList: [], // APP选中的菜单
					manageAuthorize: {
						type: "", //管理类型 1:可查看 2:可编辑
						userId: [], //人员id集合
					},
					viewAuthorize: [], //可查看数据权限
				},
				sysMenuListPc: [],
				sysMenuListApp: [],
				pcList: [], // 选中的id
				appList: [], // 选中app id集合
				sysMenuListData: [],
				// radioValue:"",
				radioList: [{
						name: "仅查看",
						value: "1",
						disabled: false,
					},
					{
						name: "可编辑",
						value: "2",
						disabled: false,
					},
				],
				departmentList: [],
			};
		},
		onLoad(option) {
			// alert(uni.getStorageSync("user").orgType)
			this.menuPermission(); // 获取菜单权限
			this.getAllCanViewMenu(); //获取数据权限
			this.getAllDept();
			if (
				uni.getStorageSync("user").orgType == 0 ||
				uni.getStorageSync("user").orgType == 10 ||
				uni.getStorageSync("user").orgType == 11 ||
				uni.getStorageSync("user").orgType == 12
			) {
				this.list1 = [{
						name: "基本信息",
					},
					{
						name: "PC权限",
					},
					{
						name: "APP权限",
					},
				];
			}
			this.pkId = option.pkId;
			if (this.pkId != "") {
				this.title = "编辑权限";
				this.getData();
			}

		},
		onUnload() {
			uni.$emit("getdata", {}); //这里可以传个空,也可以传值过去
		},
		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
			},
		},
		methods: {
			inpt(value) {
				if (value <= 0) value = 0;
				if (value >= 999999) value = 999999;
				value = parseInt(value)
				this.$nextTick(() => {
					this.depData.sortval = value;
				})
			},
			//监听选择（ids为数组）
			selectChange(ids) {
				console.log(ids);
				this.depData.defaultMenuIdPcList = ids;
			},
			cancel() {
				uni.navigateBack();
			},
			// 提交并获取权限菜单
			submit() {
				if (!this.depData.roleName) {
					return uni.showToast({
						title: "请填写角色名称",
						icon: "none",
					});
				}
				if (this.depData.sortval === "") {
					return uni.showToast({
						title: "请填写排序值",
						icon: "none",
					});
				}
				this.pcList = this.$refs.treePicker._confirm();
				this.appList = this.$refs.treePicker2._confirm();
				console.log("PC", this.pcList);
				console.log("APP", this.appList);
				let arr = this.pcList.concat(this.appList); //修改后选中后的权限
				let defaultSelectdata = this.depData.defaultMenuIdPcList.concat(
					this.depData.defaultMenuIdAppList
				); //默认选中的权限

				let userList = this.$refs.treePicker3._confirm(); //
				let dataList = this.$refs.treePicker4._confirm();
				// 编辑的时候得把菜单权限分开 diff方法
				const arrData = diff(defaultSelectdata, arr);
				let addPermission = arrData[1]; // 新增arr
				if (arr.length == 0) {
					return uni.showToast({
						title: "请选择权限",
						icon: "none",
					});
				}
				uni.showLoading({
					mask: true,
				});

				let data = {
					addMenuListSet: addPermission,
					roleName: this.depData.roleName,
					sortval: this.depData.sortval,
					remark: this.depData.remark,
					pkId: this.pkId,
					manageAuthorize: {
						type: this.depData.manageAuthorize.type,
						userId: userList,
					},
					viewAuthorize: dataList,
				};
				if (!this.pkId) {
					this.$api.addRole(data).then((res) => {
						uni.hideLoading();
						if (res.code == 200) {
							uni.showToast({
								title: res.msg,
								icon: "success",
							});
							uni.navigateBack();
						} else {
							uni.showToast({
								title: res.msg,
								icon: "none",
							});
						}
					});
				} else {
					data.deleteMenuListSet = arrData[0];
					this.$api.editRole(data).then((res) => {
						uni.hideLoading();
						if (res.code == 200) {
							uni.showToast({
								title: res.msg,
								icon: "success",
							});
							uni.navigateBack();
						} else {
							uni.showToast({
								title: res.msg,
								icon: "none",
							});
						}
					});
				}

				function diff(arr1, arr2) {
					console.log("执行了diff");
					const newArr = [];
					const arr3 = [];
					for (let i = 0; i < arr1.length; i++) {
						if (arr2.indexOf(arr1[i]) === -1) arr3.push(arr1[i]);
					}
					const arr4 = [];
					for (let j = 0; j < arr2.length; j++) {
						if (arr1.indexOf(arr2[j]) === -1) arr4.push(arr2[j]);
					}
					// newArr = arr3.concat(arr4);
					const names = new Array(arr3, arr4);
					return names;
				}
			},
			checkboxChange(n) {
				console.log("change", n);
			},
			// tab切换
			currentChange(e) {
				this.current = e.index;
			},
			// 根据id 查角色信息
			getData() {
				uni.showLoading({
					mask: true,
				});
				this.$api.queRole({ roleId: this.pkId }).then((res) => {
					uni.hideLoading();
					if (res.code === 200) {
						res.data.manageAuthorize.type = res.data.manageAuthorize.type + "";
						this.depData = res.data;
						// userId
						console.log("xxxxxxxxxxxxxxxxxxx");
						console.log(this.depData.manageAuthorize.userId);

						// this.$set(this.depData.defaultMenuIdPcList, "selectedData", res.data.defaultMenuIdPcList);
					} else {
						uni.showToast({
							title: res.msg,
							icon: "error",
						});
					}
				});
			},
			// 获取菜单权限
			menuPermission() {
				this.$api.getMenuList().then((res) => {
					if (res.code === 200) {
						console.log(res.data);
						this.sysMenuListPc = res.data.sysMenuListPc;
						this.sysMenuListApp = res.data.sysMenuListApp;
					} else {
						uni.showToast({
							title: res.msg,
							icon: "error",
						});
					}
				});
			},
			// 获取数据权限
			getAllCanViewMenu() {
				this.$api.getAllCanViewMenu().then((res) => {
					if (res.code == 200) {
						this.sysMenuListData = res.data;
					} else {
						uni.showToast({
							title: res.msg,
							icon: "error",
						});
					}
				});
			},
			// 查询该公司下所有的部门以及部门下的员工
			getAllDept() {
				this.$api.getAllDept().then((res) => {
					if (res.code == 200) {
						this.departmentList = [res.data];
					} else {
						uni.showToast({
							title: res.msg,
							icon: "error",
						});
					}
				});
			},
		},
	};
</script>

<style lang="scss">
	.item {
		margin-top: 30rpx;

		h6 {
			font-size: 28rpx;
			padding-left: 24rpx;
			margin-bottom: 8rpx;
		}

		.feed {
			background-color: #fff;
			height: 100rpx;
			padding-left: 24rpx;
		}

		.describe {
			background-color: #fff;
			padding: 24rpx;
		}
	}

	.content {
		padding-bottom: 200rpx;
	}

	.pad {
		height: 88rpx;
	}

	.foot {
		width: 100%;
		height: 120rpx;
		line-height: 120rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: space-between;
		z-index: 2;

		.submit {
			flex: 1;
			background-color: #1576e6;
			color: #fff;
			text-align: center;
		}

		.cancel {
			flex: 1;
			background-color: #eee;
			color: #aaaaaa;
			text-align: center;
		}
	}

	// 菜单权限
	.meun {
		margin-top: 10rpx;

		.data-authority {
			padding-left: 20px;
			background-color: #fff;

			.title {
				font-weight: 600;
				font-size: 14px;
			}
		}
	}

	.price-amount {
		/deep/ .tree-item:first-of-type {
			.item-check {
				display: none;
			}
		}
	}
</style>