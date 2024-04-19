<template>
	<view class="wrapper">
		<u-navbar :leftText="title" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="sticky" bgColor="#fff">
			<u-tabs class="tabList" :list="list1" :current="current" @change="currentChange" :scrollable="false"
				:activeStyle="{ color: 'rgba(32, 52, 87, 1)' }" :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }"></u-tabs>
		</view>
		<view class="pad2"></view>
		<view class="content">
			<view class="addPageBg" v-show="current == 0">
				<!-- <view class="add-inputs">
				<view class="inputs-label">部门描述</view>
				<view class="inputs-content">
          <u--textarea v-model="depData.remark" placeholder="请输入内容" autoHeight maxlength="100" border="none"></u--textarea>
        </view>
			</view> -->
				<view class="add-inputs">
					<view class="inputs-label">员工姓名</view>
					<view class="inputs-content">
						<u--textarea v-model="depData.userName" placeholder="请输入内容" autoHeight maxlength="25"
							border="none"></u--textarea>
					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">性别</view>
					<view class="inputs-content select" @click="showSex = true">
						<view class="name">{{ sexData.name }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<!-- <u-action-sheet :show="showSex"    v-model="value1" :actions="actions" title="请选择性别" @close="showSex = false" @select="sexSelect">
          </u-action-sheet> -->
				</view>
				<view class="add-inputs">
					<view class="inputs-label">手机号</view>
					<view class="inputs-content" v-if="!depData.realNameVerify">
						<u-input maxlength="11" placeholder="请输入手机号" type="number" border="none" v-model="depData.telephone"
							class="feed" @input="telInput"></u-input>
					</view>
					<view class="inputs-content select" v-else>
						<view class="name">{{ depData.telephone }}</view>
						<u-icon name="lock" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
				</view>
				<view class="add-inputs" v-if="codeStatus">
					<view class="inputs-label">验证码</view>
					<view class="inputs-content">
						<u-input maxlength="4" placeholder="请输入验证码" border="none" v-model="code" class="feed">
							<template slot="suffix">
								<u-code @change="codeChange" @end="disabled = false" ref="uCode"></u-code>
								<view class="codeBtn" @click="showPop" :class="{ codeDisabled: disabled }">{{ tips }}</view>
								<!-- <u-button size="normal" type="primary" :text="tips" @tap="showPop" :disabled="disabled"></u-button> -->
							</template>
						</u-input>
					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">所属部门</view>
					<view class="inputs-content select" @click="departmentShow = true">
						<view class="name">{{ departmentData.name }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<!-- <u-action-sheet :show="departmentShow" :actions="department" title="请选择所属部门" @close="departmentShow = false" -->
					<!-- @select="departmentSelect">
          </u-action-sheet> -->
				</view>

				<!-- <view class="add-inputs">
          <h6>所管工区</h6>
          <view class="select" @click="workAreaShow = true">
            <view class="name">{{ workAreaData.name }}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
          <u-action-sheet
            :show="workAreaShow"
            :actions="workArea"
            title="请选择所管工区"
            @close="workAreaShow = false"
            @select="workAreaSelect"
          >
          </u-action-sheet>
        </view> -->
				<view class="add-inputs">
					<view class="inputs-label">所属角色</view>
					<view class="inputs-content select" @click="roleShow = true">
						<view class="name">{{ roleData.name }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<!-- <u-action-sheet
            :show="roleShow"
            :actions="role"
            title="请选择所属角色"
            @close="roleShow = false"
            @select="roleSelect"
          >
          </u-action-sheet> -->
				</view>
				<view class="add-inputs" v-if="[9,10,11].includes(user.orgType)">
					<view class="inputs-label">{{ "管理单位" }}</view>
					<view class="inputs-content select" @click="orgNameShow = true">
						<view class="name">{{ orgNameData.orgName }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
				</view>
				<view class="add-inputs" v-else-if="user.orgType != 5 && user.orgType != 0">
					<view class="inputs-label">{{ "管理项目" }}</view>
					<view class="inputs-content select" @click="orgNameShow = true">
						<view class="name">{{ orgNameData.orgName }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">备注</view>
					<view class="inputs-content">
						<u--textarea v-model="depData.remark" placeholder="请输入内容" maxlength="100" autoHeight
							border="none"></u--textarea>
					</view>
				</view>
			</view>
			<u-picker :show="showSex" :columns="[actions]" :defaultIndex="sexDataIndex" title="请选择性别" keyName="name"
				@cancel="showSex = false" @confirm="sexSelect"></u-picker>
			<u-picker :show="departmentShow" :columns="[department]" :defaultIndex="departmentIndex" title="请选择所属部门"
				keyName="name" @cancel="departmentShow = false" @confirm="departmentSelect"></u-picker>
			<multiple-picker :show="roleShow" :columns="role" :defaultIndex="defaultIndex" @cancel="roleShow = false"
				@confirm="roleSelect">
			</multiple-picker>
			<view class="" v-show="current == 1">
				<view class="">
					<tree ref="treePicker" :selectedData="depData.defaultMenuIdPcList" :localdata="sysMenuListPc" valueKey="pkId"
						:disabled="true" textKey="menuName" childrenKey="children" @select-change="selectChange"></tree>
					<view class="forbidden" style=""> </view>
				</view>
			</view>
			<view class="" v-show="current == 2">
				<view class="">
					<tree ref="treePicker2" :selectedData="depData.defaultMenuIdAppList" :localdata="sysMenuListApp"
						valueKey="pkId" :disabled="true" textKey="menuName" childrenKey="children"></tree>
					<view class="forbidden" style=""> </view>
				</view>
			</view>
			<view class="meun" v-show="current == 3">
				<view class="data-authority" v-if="user.orgType !== 4 && user.manageDataStatus ==1">
					<view class="title" style="padding-top: 20px">查看和管理他人数据</view>
					<u-radio-group disabled v-model="depData.manageAuthorize.type" placement="row" style="padding: 10px">
						<u-radio :customStyle="{ marginBottom: '8px', marginRight: '10px' }" v-for="(item, index) in radioList"
							:key="index" :label="item.name" :name="item.value">
						</u-radio>
					</u-radio-group>
				</view>
				<!-- v-show="user.manageDataStatus == 1" -->
				<view class="data-authority" v-if="user.orgType !== 4 && user.manageDataStatus ==1">
					<view class="title">数据权限</view>
					<tree ref="treePicker3" :selectedData="depData.manageAuthorize.userId" :localdata="departmentList"
						valueKey="pkId" textKey="aliasName" :disabled="true" childrenKey="children"></tree>
				</view>
				<view class="data-authority" style="padding-top: 5px">
					<view class="title">单价和金额权限</view>
					<tree ref="treePicker4" class="price-amount" :selectedData="depData.viewAuthorize"
						:localdata="sysMenuListData" :disabled="true" :associatedNode="false" valueKey="pkId" textKey="menuName"
						childrenKey="child"></tree>
				</view>
			</view>
		</view>
		<view class="pad"></view>
		<view class="foot">
			<view class="cancel" @click="cancel">取消</view>
			<view class="submit" @click="submit">保存</view>
		</view>
		<!-- 验证码弹窗组件 -->
		<popup :popStatus="popStatus" :phoneNumber="depData.telephone" :sendType="'4'" @sendCode="getCode" @close="close">
		</popup>
		<!-- 选择管理项目 -->
		<multiple-picker :show="orgNameShow" :columns="orgNameList" :defaultIndex="orgNameIndex" title="请选择"
			keyName="orgName" @cancel="orgNameShow = false" @confirm="orgNameSelect"></multiple-picker>
		<!-- <multiple-picker
        :show="roleShow"
        :columns="role"
        :defaultIndex="defaultIndex"
        @cancel="roleShow = false"
        @confirm="roleSelect"
      > -->
	</view>
</template>

<script>
	import tree from "@/components/ba-tree-picker/ba-tree-picker.vue";
	import multiplePicker from "@/components/multiple-picker/multiple-picker.vue";
	import popup from "@/components/pop-up.vue";
	export default {
		components: {
			tree,
			multiplePicker,
			popup,
		},
		data() {
			return {
				title: "新增员工",
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
					ramark: "",
				},
				showSex: false,
				actions: [{
						name: "男",
						id: "1",
					},
					{
						name: "女",
						id: "2",
					},
				],
				sexData: {
					name: "",
					id: "",
				},
				department: [],
				departmentShow: false,
				departmentData: {},
				workAreaShow: false,
				workArea: [],
				workAreaData: {},
				roleShow: false,
				roleData: {},
				role: [],
				depData: {
					roleName: "",
					sortval: "",
					remark: "",
					telephone: "",
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
				defaultIndex: [],
				uuid: "",
				code: "",
				popStatus: false,
				tips: "获取验证码",
				disabled: false,
				tel: "",
				removedList: [],
				value1: "",
				sexDataIndex: [],
				departmentIndex: [],
				orgNameList: [],
				orgNameShow: false,
				orgNameIndex: [],
				orgNameData: {},
				codeStatus: false
			};
		},
		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
			},
		},
		onLoad(option) {
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
			// console.log(option);
			this.pkId = option.pkId;
			if (this.pkId != "") {
				this.title = "编辑员工";
				this.getData();
			} else {
				this.menuPermission();
			}
			this.searchEasyDeptList();
			// this.searchAllWorkArea();
			this.searchRoleList();
			this.getAllCanViewMenu(); //获取数据权限
			this.getAllDept();
			if ([2, 3, 9, 4].includes(this.user.orgType)) {
				this.itemList();
			} else {
				this.subsetOrgList();
			}
		},
		methods: {
			telInput(e) {
				if (this.depData.telephone.length == 11 && !this.depData.realNameVerify) {
					this.$api.availableTelephone({ telephone: this.depData.telephone }).then(res => {
						if (res.data) {
							this.codeStatus = true;
						} else {
							this.codeStatus = false;
							this.code = "";
							this.uuid = "";
						}
					});
				} else {
					this.codeStatus = false;
					this.code = "";
					this.uuid = "";
				}
			},
			orgNameSelect(e) {
				if (e.value.length == 0) {
					this.orgNameData.orgName = "";
					this.orgNameData.pkId = [];
					this.orgNameIndex = [];

					return (this.orgNameShow = false);
				}

				let name = [];
				e.selected.forEach(item => {
					name.push(item.label);
				});
				this.orgNameData.orgName = name.join();
				this.orgNameData.pkId = e.value;
				this.orgNameIndex = e.value;
				this.orgNameShow = false;
			},
			subsetOrgList() {
				this.$api.subsetOrgList().then(res => {
					if (res.code == 200) {
						this.orgNameList = res.data.map(item => ({ ...item, label: item.orgName, value: item.pkId }));
					} else {}
				});
			},
			itemList() {
				this.$api.itemList().then(res => {
					if (res.code == 200) {
						this.orgNameList = res.data.map(item => ({ ...item, label: item.projectName, value: item.pkId }));
					} else {}
				});
			},
			codeChange(text) {
				this.tips = text;
				console.log("xxxxxxxxxxxxxxxxxxxxxx");
				console.log(text);
				if (text == "重新获取" || text == "获取验证码") {
					this.disabled = false;
				}
				console.log("xxxxxxxxxxxxxxxxxxxxxx");
			},
			showPop() {
				if (this.disabled) {
					return;
				}
				const mate = /^1(2|3|4|5|6|7|8|9)\d{9}$/;
				if (!mate.test(this.depData.telephone)) {
					return uni.showToast({ title: "请输入正确的手机号码", icon: "none" });
				}
				this.popStatus = true;
			},
			close() {
				this.popStatus = false;
				// disabled
			},
			getCode(data) {
				this.disabled = true;
				this.$refs.uCode.start();
				this.close();
				this.uuid = data;
			},
			cancel() {
				uni.navigateBack();
			},
			// 提交并获取权限菜单
			submit() {
				console.log(this.depData.userName); //员工姓名
				console.log(this.sexData); //员工性别
				console.log(this.depData.telephone); //手机号
				console.log(this.departmentData); //部门
				// console.log(this.workAreaData.name)//工区
				console.log(this.roleData); //角色
				console.log(this.depData.remark); //备注

				// return console.log("==================")
				if (!this.depData.userName) {
					return uni.showToast({
						title: "请填写员工姓名",
						icon: "none",
					});
				}
				if (this.sexData.name === "") {
					return uni.showToast({
						title: "请选择员工性别",
						icon: "none",
					});
				}
				if (this.depData.telephone === "" || !this.depData.telephone) {
					return uni.showToast({
						title: "请填写手机号",
						icon: "none",
					});
				}
				if (this.departmentData.name === "" || !this.departmentData.name) {
					return uni.showToast({
						title: "请选择所属部门",
						icon: "none",
					});
				}
				// if (this.workAreaData.name === "" || !this.workAreaData.name) {
				//   return uni.showToast({
				//     title: "请选择工区",
				//     icon: "none",
				//   });
				// }
				if (this.roleData.name === "" || !this.roleData.name) {
					return uni.showToast({
						title: "请选择角色",
						icon: "none",
					});
				}

				if (this.defaultIndex.length == 0) {
					return uni.showToast({
						title: "请选择角色",
						icon: "none",
					});
				}
				// return console.log(this.depData.remark)
				let parameter = {
					sourceType: 1, //注册来源（ PC: 0, APP:1）
					userName: this.depData.userName, //员工姓名
					sex: this.sexData.id, //性别
					telephone: this.depData.telephone, //手机号
					fkDeptId: this.departmentData.pkId, //部门
					addRoleIdList: this.defaultIndex,
					remark: this.depData.remark,
					uuid: this.uuid,
					code: this.code,
					manageCustomIdList: ![2, 3, 9, 4].includes(this.user.orgType) ? this.orgNameIndex : [],
					projectIdListSet: [2, 3, 9, 4].includes(this.user.orgType) ? this.orgNameIndex : []
				};

				if (this.removedList.length != 0) {
					let arr = [];
					this.removedList.forEach(item => {
						let states = true;
						this.defaultIndex.forEach(e => {
							if (item == e) {
								states = false;
							}
						});
						if (states) {
							arr.push(item);
						}
					});
					parameter.deleteRoleIdList = arr;
				}

				if (this.title == "新增员工") {
					uni.showLoading({
						mask: true,
					});
					this.$api.addSysUser(parameter).then(res => {
						if (res.code == 200) {
							uni.showToast({ title: "新增成功", icon: "success", mask: true });
							setTimeout(() => {
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 2]; // 上一页面实例
								prevPage.$vm.resh(1); // 调用上一页 定义的方法
								uni.navigateBack();
							}, 500);
						} else {
							uni.showToast({
								title: res.msg,
								icon: "none",
							});
						}
						uni.hideLoading();
					});
				} else {
					uni.showLoading({
						mask: true,
					});
					parameter.pkId = this.pkId;
					this.$api.putSysUser(parameter).then(res => {
						if (res.code == 200) {
							uni.showToast({ title: "编辑成功", icon: "success", mask: true });
							setTimeout(() => {
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 2]; // 上一页面实例
								prevPage.$vm.resh(2); // 调用上一页 定义的方法
								uni.navigateBack();
							}, 500);
						} else {
							uni.showToast({
								title: res.msg,
								icon: "none",
							});
						}
						uni.hideLoading();
					});
				}
			},
			// 部门下拉数据
			searchEasyDeptList() {
				this.$api.searchEasyDeptList().then(res => {
					if (res.code === 200) {
						this.department = [
							...res.data.map(item => ({ ...item, name: item.deptName })),
						];
						// this.searchUserByOrg();
						// if(this.title == "编辑员工"){
						//   // this.title = "编辑员工";
						// }
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			// 工区下拉数据
			searchAllWorkArea() {
				this.$api.searchAllWorkArea().then(res => {
					if (res.code == 200) {
						this.workArea = [
							...res.data.map(item => ({ ...item, name: item.areaName })),
						];
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			// 角色下拉
			searchRoleList() {
				this.$api.searchRoleList().then(res => {
					if (res.code == 200) {
						this.role = [
							...res.data.map(item => ({ ...item, name: item.roleName })),
						];
						console.log("=============================");
						console.log(this.role);
						let arr = [];
						this.role.forEach(item => {
							item.label = item.name;
							item.value = item.pkId;
							if (this.defaultIndex.length != 0) {
								this.defaultIndex.forEach(e => {
									if (e == item.value) {
										arr.push(item.name);
									}
								});
							}
						});
						// this.defaultIndex
						this.roleData.name = arr.join();
						console.log("=============================");
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			// 选择性别
			sexSelect(e) {
				this.sexData = e.value[0];
				this.showSex = false;
			},
			// 选择部门
			departmentSelect(e) {
				if (e.value[0] == undefined) {
					return;
				}
				this.departmentData = e.value[0];
				this.departmentShow = false;
			},
			// 选择工区
			workAreaSelect(e) {
				this.workAreaData = e;
			},
			// 选择角色
			roleSelect(e) {
				// return console.log(e)
				if (e.value.length == 0) {
					this.roleData.name = "";
					this.roleData.pkId = [];
					this.defaultIndex = [];
					this.depData.defaultMenuIdPcList = [];
					this.depData.defaultMenuIdAppList = [];
					return (this.roleShow = false);
				}
				// console.log(this.role)
				// defaultMenuIdPcList
				// // defaultMenuIdAppList
				// return console.log(e)
				let arr1 = [];
				let arr2 = [];
				e.value.forEach(item => {
					this.role.forEach(e => {
						if (item == e.pkId) {
							arr1 = [...arr1, ...e.defaultMenuIdPcList];
							arr2 = [...arr2, ...e.defaultMenuIdAppList];
						}
					});
				});
				arr1 = new Set(arr1);
				arr1 = Array.from(arr1);
				arr2 = new Set(arr2);
				arr2 = Array.from(arr2);
				this.depData.defaultMenuIdPcList = arr1;
				this.depData.defaultMenuIdAppList = arr2;
				let arr = e.value.join();
				console.log(e);
				// roleData
				let name = [];
				e.selected.forEach(item => {
					name.push(item.label);
				});
				this.roleData.name = name.join();
				this.roleData.pkId = e.value;
				this.defaultIndex = e.value;
				this.getUserAuthorizeByRoleId(arr);
				this.roleShow = false;
			},
			getUserAuthorizeByRoleId(id) {
				this.$api.getUserAuthorizeByRoleId({ roleIds: id }).then(res => {
					if (res.code == 200) {
						console.log(res);
						// this.depData.defaultMenuIdPcList = res.data.defaultMenuIdPcList;
						// this.depData.defaultMenuIdAppList = res.data.defaultMenuIdAppList;
						this.depData.manageAuthorize = res.data.manageAuthorize;
						this.depData.manageAuthorize.type =
							this.depData.manageAuthorize.type + "";
						this.depData.viewAuthorize = res.data.viewAuthorize;
					} else {
						uni.showToast({
							title: res.msg,
							icon: "error",
						});
					}
				});
			},
			// tab切换
			currentChange(e) {
				this.current = e.index;
			},
			// 根据id 查员工信息
			getData() {
				this.$api.appSysUser({ userId: this.pkId }).then(res => {
					if (res.code === 200) {
						this.depData = res.data;
						this.tel = res.data.telephone;
						this.depData.manageAuthorize =
							res.data.dataAuthorizeVo.manageAuthorize;
						this.depData.manageAuthorize =
							this.depData.manageAuthorize == null ? { type: "", userId: [] } :
							this.depData.manageAuthorize;
						this.depData.viewAuthorize =
							res.data.dataAuthorizeVo.viewAuthorize == undefined ? [] :
							(this.depData.viewAuthorize =
								res.data.dataAuthorizeVo.viewAuthorize);
						//   manageAuthorize: {
						// 	type: "", //管理类型 1:可查看 2:可编辑
						// 	userId: [] //人员id集合
						// },
						// viewAuthorize: [] //可查看数据权限
						this.depData.manageAuthorize.type =
							this.depData.manageAuthorize.type + "";
						// this.depData.viewAuthorize = res.data.dataAuthorizeVo.viewAuthorize
						this.sexData = {
							id: res.data.sex,
							name: res.data.sex == 1 ? "男" : "女",
						};
						this.sexDataIndex = res.data.sex == 1 ? [0] : [1];
						this.departmentData = {
							pkId: res.data.fkDeptId,
							name: res.data.deptName,
						};
						if (this.departmentData.name == null) {
							this.department.forEach((item, idx) => {
								if (item.pkId == res.data.fkDeptId) {
									this.departmentData.name = item.deptName;
									this.departmentIndex = [idx];
								}
							});
						} else {
							this.department.forEach((item, idx) => {
								if (item.pkId == res.data.fkDeptId) {
									this.departmentIndex = [idx];
								}
							});
						}
						this.workAreaData = {
							name: res.data.areaName,
							pkId: res.data.areaName,
						};
						this.roleData = {
							name: res.data.roleName,
							pkId: res.data.roleName,
						};
						this.sysMenuListPc = res.data.sysMenuPcList;
						this.sysMenuListApp = res.data.sysMenuAppList;
						this.defaultIndex = res.data.roleList;
						this.removedList = res.data.roleList;
						if (res.data.roleList != null && res.data.roleList.length != 0) {
							let arr = res.data.roleList;
							arr = new Set(arr);
							arr = Array.from(arr);
							let nameList = [];
							arr.forEach(item => {
								this.role.forEach(e => {
									if (item == e.pkId) {
										nameList.push(e.name);
									}
								});
							});
							this.getUserAuthorizeByRoleId(res.data.roleList.join(","));
							this.roleData.name = nameList.join();
							this.roleData.pkId = arr;
							this.defaultIndex = arr;
						}
						if ([2, 3, 9, 4].includes(this.user.orgType)) {
							this.orgNameIndex = res.data.projectIdListSet;
						} else {
							this.orgNameIndex = res.data.manageCustomIdList;
						}
						//   :
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
				this.$api.getMenuList().then(res => {
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
				this.$api.getAllCanViewMenu().then(res => {
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
				this.$api.getAllDept().then(res => {
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
	.pad2 {
		height: 88rpx;
	}

	.item {
		margin-top: 30rpx;

		h6 {
			font-size: 28rpx;
			padding-left: 24rpx;
			margin-bottom: 8rpx;
		}

		.feed {
			background-color: #fff;
			height: 80rpx;
			padding-left: 24rpx;
		}

		.disflex {
			display: flex;
		}

		.describe {
			background-color: #fff;
			padding: 24rpx;
		}
	}

	.pad {
		height: 120rpx;
	}

	.foot {
		width: 100%;
		height: 120rpx;
		line-height: 120rpx;
		position: fixed;
		z-index: 2;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: space-between;

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

	.select {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		padding: 0 20rpx;
		background-color: #fff;
	}

	.name {
		width: 520rpx;
		// margin-bottom: 20rpx;
		font-weight: 600;
		font-size: 30rpx;
		overflow: hidden;
		/*超出部分隐藏*/
		white-space: nowrap;
		/*禁⽌换⾏*/
		text-overflow: ellipsis;
		/*省略号*/
	}

	.forbidden {
		position: fixed;
		height: 100%;
		width: 100%;
		top: 80px;
	}

	.meun {
		margin-top: 10rpx;
		padding-bottom: 60px;

		.data-authority {
			padding-left: 20px;
			background-color: #fff;

			.title {
				font-weight: 600;
				font-size: 14px;
			}
		}
	}
</style>