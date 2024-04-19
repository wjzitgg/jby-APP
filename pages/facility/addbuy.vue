<!-- 工程图纸详情 -->
<template>
	<view class="wrapper addPageBg">
		<u-navbar :leftText="title" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view style="background: #fff">
			<u-tabs class="sticky" :list="tab" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}"
				:inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"> </u-tabs>
		</view>
		<view class="content-box">
			<view style="padding-bottom: 120px" v-show="tabcunt == 0">
				<view class="add-inputs">
					<view class="inputs-label">设备图片</view>
					<view class="inputs-fileList">
						<view class="fileListBtn">
							<lsj-upload ref="lsjUpload1" childId="upload2" :option="option" :size="size" :formats="formats"
								accept="image/jpg,image/jpeg,image/png" :debug="debug" :count="6" :nowCount="fileList.length"
								:instantly="instantly" @change="onChange" @progress="onprogress" @uploadEnd="onuploadEnd">
								<view class="jia">
									+
								</view>
								<view class="addBtn"> 请上传 </view>
							</lsj-upload>
						</view>
						<view style="width: 100%; overflow-x: scroll; display: inline-flex;">
							<view style="max-width: 600px; display: flex;">
								<view class="inputs-fileList-item" v-for="(item, idx) in fileList" :key="idx">
									<view class="left" @click="preview(item)">
										<image :src="item.enclosureUrl" mode="scaleToFill"></image>
									</view>
									<view class="closes" @click="delFile(item, index)"></view>
								</view>
							</view>
						</view>

					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">设备名称</view>
					<view class="inputs-content select" @click="receiverClick">
						<view class="name">{{ receiverData.deviceName }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="disclosureUnitShow" :columns="disclosureUnit" keyName="deptName"
						@cancel="disclosureUnitClose" @confirm="disclosureUnitConfirm"></u-picker>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">设备类型</view>
					<view class="inputs-content select">
						<view class="name">{{ receiverData.className }}</view>
						<u-icon name="lock-fill" class="icons" size="14"></u-icon>
					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">设备品牌</view>
					<view class="inputs-content">
						<u--textarea v-model="receiverData.brandName" placeholder="请输入" autoHeight maxlength="50"
							border="none"></u--textarea>
					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">设备型号</view>
					<view class="inputs-content">
						<u--textarea v-model="receiverData.deviceCode" placeholder="请输入" autoHeight maxlength="50"
							border="none"></u--textarea>
					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">设备厂商</view>
					<view class="inputs-content">
						<u--textarea v-model="receiverData.manufacturer" placeholder="请输入" autoHeight maxlength="50"
							border="none"></u--textarea>
					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">出厂日期</view>
					<view class="inputs-content select" @click="dateShow = true">
						<view class="name">{{ receiverData.factoryTime }}</view>
						<u-icon name="calendar-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-datetime-picker :show="dateShow" v-model="value1" @cancel="dateShow = false" @confirm="dateSelect"
						mode="date"></u-datetime-picker>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">{{dialogType === 1 ? '购买日期' : '租聘日期'}}</view>
					<view class="inputs-content select" @click="dateShow = true">
						<view class="name">{{ receiverData.consumeTime }}</view>
						<u-icon name="calendar-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-datetime-picker :show="dateShow" v-model="value2" @cancel="dateShow = false" @confirm="dateSelect"
						mode="date"></u-datetime-picker>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">{{dialogType === 1 ? '购买单价' : '租赁单价'}}</view>
					<view class="inputs-content">
						<u--textarea v-model="receiverData.price" placeholder="请输入" autoHeight maxlength="50"
							border="none"></u--textarea>
					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">使用期限</view>
					<view class="inputs-content">
						<u--textarea v-model="receiverData.liveTime" placeholder="请输入" autoHeight maxlength="50"
							border="none"></u--textarea>
					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">{{dialogType === 1 ? '月折旧价' : '月租金'}}</view>
					<u--input v-model="receiverData.depreciationPrice" placeholder="-" disabled suffixIcon="lock-fill"
						suffixIconStyle="color: #909399;font-size: 14px !important;" class="inputs-content"></u--input>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">{{dialogType === 1 ? '购买数量' : '租聘数量'}}</view>
					<u--input placeholder="请输入" v-model="receiverData.buyNum" class="inputs-content"></u--input>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">使用部门</view>
					<view class="inputs-content select" @click="receivingTypeShow = true">
						<view class="name">{{ receiverData.department }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="receivingTypeShow" :columns="receivingList" keyName="deptName" @cancel="receivingClose"
						@confirm="receivingConfirm"></u-picker>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">使用部位</view>
					<view class="inputs-content select" @click="receiverClick2">
						<view class="name">{{ consumeItemName }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="disclosureUnitShow" :columns="disclosureUnit" keyName="deptName"
						@cancel="disclosureUnitClose" @confirm="disclosureUnitConfirm"></u-picker>
				</view>
			</view>
			<view v-show="tabcunt == 1">
				<view class="">
					<view style="background-color: #f7f7ff;height: 8rpx;"></view>
					<view class="add-inputs">
						<view class="inputs-label">自定义标签名称</view>
						<u--input placeholder="请输入" v-model="receiverData.buyNum" class="inputs-content"></u--input>
					</view>
					<view class="add-inputs">
						<view class="inputs-label">自定义标签内容</view>
						<u--input placeholder="请输入" v-model="receiverData.buyNum" class="inputs-content"></u--input>
					</view>
				</view>
				<view class="btn-add">
					添加标签
				</view>
			</view>
			<view class="popup-footer" style="justify-content: space-between; width: 100%">

				<u-button class="btn-iem" text="取消" @click="download"></u-button>
				<!-- <u-button class="btn-iem" type="primary" text="保存草稿" @click="examine(1)"></u-button> -->


				<u-button class="btn-iem btn-iem2" type="success" text="确认提交" @click="examine(2)"></u-button>

			</view>
		</view>
		<prviewVideo :src="video" :show="videoShow" @close="closePreview" ref="domVideo"></prviewVideo>
		<!-- 设备类型下拉弹框 -->
		<u-popup :show="receiveShow" @close="receiveShow = false" class="highest">
			<view class="selectShow">
				<view class="head">
					<view class="name">选择设备</view>
					<!-- <view class="closeBtn" @click="requestConfirmation" style="color: #3c9cff">确认</view> -->
					<u-icon name="close" class="item-icon" @click="receiveShow = false"></u-icon>
				</view>
				<view class=" item-bgc" @click="back" v-if="num > 0">
					<u-icon name="arrow-left" class="item-icon"></u-icon>
					<text>{{num == 1 ? superiorName : superiorName2}}</text>
				</view>
				<view class="content" v-if="num == 0">
					<view class="cont-item" v-for="(item,index) in yearList" :key="index" @click="junior(item)">
						<text>{{item.itemName}}</text>
						<u-icon name="arrow-right" class="item-icon"></u-icon>
					</view>
				</view>
				<view class="content" v-if="num == 1">
					<view class="cont-item" v-for="(item,index) in yearList2" :key="index" @click="junior(item)">
						<text>{{item.itemName}}</text>
						<u-icon name="arrow-right" class="item-icon"></u-icon>
					</view>
				</view>
				<!-- 选择 -->
				<view class="content" v-if="num == 2">
					<view class="cont-item" v-for="(item,index) in receiverDataList" :key="index" @click="junior2(item)">
						<text>{{item.deviceName}}</text>
					</view>
				</view>
			</view>
			<!-- 		<tree ref="weert" class="price-amount" :selectedData="viewAuthorize" :multiple="false" :selectParent="false"
				:associatedNode="false" :disabled="false" :wipeStatus="true" :localdata="yearList" valueKey="pkId"
				textKey="itemName" childrenKey="children"></tree> -->
		</u-popup>
		<!-- 使用部位 -->
		<u-popup :show="receiveShow2" @close="receiveShow2 = false" class="highest">
			<view class="selectShow">
				<view class="head">
					<view class="name">使用部位</view>
					<view class="closeBtn" @click="requestConfirmation2" style="color: #3c9cff">确认</view>
				</view>
				<view class="content">
					<tree ref="weert2" class="price-amount" :selectedData="viewAuthorize2" :localdata="treeData" valueKey="pkId"
						textKey="itemName" childrenKey="children"></tree>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import moment from "moment";
	import request from "@/common/request";
	import prviewVideo from "../../components/ls-dom-video/ls-dom-video.vue";
	import tree from "../../components/ba-tree-picker/ba-tree-picker.vue";
	export default {
		data() {
			return {
				tab: [{ name: "基础信息" }, { name: "自定义信息" }],
				tabcunt: 0,
				dialogType: 1,
				rowData: {
					disclosureName: "",
					forwardType: "",
				},
				radiolist: [{
						name: "允许",
						disabled: false,
						id: "1",
					},
					{
						name: "不允许",
						disabled: false,
						id: "2",
					},
				],
				show: false,
				receiveShow: false,
				receiveShow2: false,
				viewAuthorize: [],
				viewAuthorize2: [],
				consumeItemName: "",
				yearList: [],
				treeData: [],
				yearList2: [],
				superiorName: "",
				receiverDataList: [],
				receiverData: {
					department: "", // 部门名称
					fkDeptId: "", // 部门id
				},
				columns: [
					[{
							label: "上级交底",
							// 其他属性值
							id: 1,
							// ...
						},
						{
							label: "内部交底",
							id: 2,
						},
						{
							label: "对下交底",
							id: 3,
						},
					],
				],
				receivingType: {
					label: "",
					id: "",
				},
				dateShow: false,
				value1: Number(new Date()),
				value2: Number(new Date()),
				presentationTime: "",
				// ===============附件=================
				fileList: [],
				video: "",
				videoShow: false,
				appShow: true,
				clickCheck: false,
				// 上传接口参数
				option: {
					// 上传服务器地址，此地址需要替换为你的接口地址
					url: request.baseUrl + "/app/file/upload/picture",
					// 上传附件的key
					name: "file",
					// 根据你接口需求自定义请求头,默认不要写content-type,让浏览器自适配
					header: {
						// 示例参数可删除
						Authorization: uni.getStorageSync("token"),
					},
					// 根据你接口需求自定义body参数
					// formData: {
					// 	// 'orderId': 1000
					// }
				},

				// 选择文件后是否立即自动上传，true=选择后立即上传
				instantly: true,
				// 必传宽高且宽高应与slot宽高保持一致
				width: "150rpx",
				height: "40rpx",
				// 限制允许上传的格式，空串=不限制，默认为空
				formats: "",
				// 文件上传大小限制
				size: 30,
				// 文件回显列表
				files: new Map(),
				// 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
				wxFiles: [],
				// 是否打印日志
				debug: false,
				previewShow: false,
				previewUrl: "",
				// ===============附件=================

				receiverList: [], //接收单位
				receiverData: {},
				receivedBy: [], //接部门
				receivedByShow: false, //接收人弹窗状态
				receivedByData: {},
				receivedUser: [],
				receivedUserShow: false,
				receivedUserData: {},
				receiverStatus: true,
				disclosureUnitShow: false, //交底单位
				disclosureUnit: [], //交底单位
				disclosureUnitData: {}, //交底单位
				disclosureDepartment: [], //交底部门
				disclosureShow: false, //交底部门
				disclosureData: {}, //交底部门
				informant: [], //交底人
				informantShow: false, //交底人
				informantData: {}, //交底人
				disclosureStatus: false,
				receivingTypeShow: false,
				receivingData: {
					laber: "",
					fkDeptId: "" // 部门id
				},
				receivingList: [],
				title: "新增设备",
				itemData: {},
				num: 0,
			};
		},
		onLoad(item) {
			this.searchByTree();
			this.projDeviceDeptList();
		},
		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
			},
		},
		components: {
			prviewVideo,
			tree
		},
		watch: {
			receiveShow(val) {
				if (val) {
					this.num = 0;
					this.searchByTree();
				}
			}
		},
		methods: {
			currentChange(item) {
				this.tabcunt = item.index;
				// console.log(this.searchDate.enableStatus);
				// this.searchDate.pageNum = 1;
				// this.getData();
			},
			back() {
				this.num = this.num - 1;
			},
			junior(item) {
				console.log(item);
				if (item.children !== null && item.children.length > 0) {
					this.superiorName = item.itemName;
					this.yearList2 = item.children;
					this.num = this.num + 1;
					console.log(this.num);
				} else {
					this.num = this.num + 1;
					this.superiorName2 = item.itemName;
					this.deviceTemplateSearchPage(item.pkId);
				}
			},
			junior2(item) {
				console.log(item);
				this.receiverData = item;
				this.fileList = [];
				this.fileList.push({ enclosureUrl: item.deviceUrl });
				this.receiveShow = false;
			},
			// 设备下拉选择
			receiverClick() {
				this.receiveShow = true;
				// this.$nextTick(() => {
				// 	this.$refs.weert._initTree();
				// });
			},
			// 设备选择
			requestConfirmation() {
				this.viewAuthorize = this.$refs.weert._confirm();
				if (this.viewAuthorize.length == 0) {
					return this.receiveShow = false;
				}
				let arr = this.flatTreeData(this.yearList);
				arr.forEach(item => {
					this.viewAuthorize.forEach(e => {
						if (item.pkId == e) {
							this.deviceTemplateSearchPage(item.pkId);
						}
					});
				});
				this.receiveShow = false;
			},
			requestConfirmation2() {
				this.consumeItemName = "";
				this.viewAuthorize2 = this.$refs.weert2._confirm();
				if (this.viewAuthorize2.length == 0) {
					return this.receiveShow2 = false;
				}
				let arr2 = this.flatTreeData(this.treeData);
				arr2.forEach(item => {
					this.viewAuthorize2.forEach(e => {
						if (item.pkId == e && item.grade == 3) {
							this.consumeItemName = this.consumeItemName + item.itemName + ",";
						}
					});
				});
				console.log(this.consumeItemName);
				console.log(this.viewAuthorize2);
				this.receiveShow2 = false;
			},
			// 下拉选择
			receiverClick2() {
				this.receiveShow2 = true;
				this.$nextTick(() => {
					this.$refs.weert2._initTree();
				});
			},
			flatTreeData(list) {
				const res = [];

				function getDate(list) {
					list.forEach(item => {
						res.push(item);
						if (item.children) {
							getDate(item.children);
						}
					});
				}
				getDate(list);
				return res;
			},
			searchByTree() {
				this.$api.searchByTree().then(res => {
					if (res.code == 200) {
						this.yearList = res.data;
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			// 获取部门 和 部位
			projDeviceDeptList() {
				this.$api.projDeviceDeptList().then(res => {
					if (res.code == 200) {
						this.receivingList = [res.data.deptListVos];
						this.treeData = res.data.prodItemsVos;
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},

			deviceTemplateSearchPage(id) {
				this.$api.deviceTemplateSearchPage({ pageNum: 1, pageSize: 1000, fkClassId: id }).then(res => {
					if (res.code == 200) {
						console.log(res.data.records);
						this.receiverDataList = res.data.records;
						console.log(this.receiverDataList);
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			closePreview() {
				this.videoShow = false;
				this.video = "";
			},
			preview(item) {
				console.log(item);
				let src = item.enclosureUrl;
				let exit = src.split(".");
				exit = exit.pop();
				let noimgType = ["avi", "wmv", "mpg", "mpeg", "mov", "rm", "ram", "swf", "flv", "mp4", "wma", "rm", "rmvb",
					"flv", "mpg", "mkv"
				];
				if (noimgType.includes(exit)) {
					this.video = item.enclosureUrl;
					this.videoShow = true;
					return console.log("视频");
					let domVideo = this.$refs.domVideo;
					domVideo.play();
				}
				this.$checkName(item.enclosureUrl);
				return;
				this.previewUrl = item.enclosureUrl;
				this.previewShow = true;
			},
			receivingClose() {
				this.receivingTypeShow = false;
			},
			receivingConfirm(e) {
				this.receiverData.department = e.value[0].deptName;
				this.receiverData.fkDeptId = e.value[0].pkId;
				this.receivingTypeShow = false;
			},
			projectListByOrgId() {
				let data = { fkOrgId: uni.getStorageSync("nowOrgId") };
				this.$api.projectListByOrgId(data).then(res => {
					if (res.code == 200) {
						res.data.forEach(item => {
							item.customName = item.projectOrgName;
							item.deptVos = item.deptVoLists;
							item.fkLinkOrgId = item.fkOrgId;
							if (
								this.title == "编辑技术交底" &&
								this.itemData.fkReceivingOrgId == item.fkLinkOrgId
							) {
								this.receiverData = item;
								if (item.customType == 4) {
									this.receivedUser = item.users;
								} else {
									this.receivedBy = item.deptVos;
									console.log("ccccccccccccccccccc");
									console.log(this.receivedBy);
									console.log("cccccccccccccccccccccc");
								}
							} {
								this.receivedBy = item.deptVos;
								console.log("bbbbbbbbbbbbbbbbbbb");
								console.log(this.receivedBy);
								console.log("bbbbbbbbbbbbbbbbb");
								this.receivedBy.forEach(s => {
									if (s.fkOrgId == this.itemData.fkReceivingOrgId) {
										this.receivedByData = s;
										s.users.forEach(e => {
											if (this.itemData.fkReceivingUserId == e.pkId) {
												this.receivedUserData = e;
											}
										});
									}
								});
							}
						});
						this.receiverList = [res.data];
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			deptListByOrgId() {
				this.$api.deptListByOrgId().then(res => {
					if (res.code == 200) {
						// this.receiverList = [res.data];
						res.data.forEach(item => {
							if (
								this.title == "编辑技术交底" &&
								this.itemData.fkDeptId == item.pkId
							) {
								console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
								console.log(res.data);
								console.log(item.users);
								console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
								this.disclosureUnitData = item;
								// this.informant = item.users;
								this.$set(this.informant, 0, item.users);
								item.users.forEach(s => {
									if (s.pkId == this.itemData.fkUserId) {
										this.informantData = s;
									}
								});
							} else {
								// this.receivedBy = item.deptVos;
								//   console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
								//   console.log(item);
								//   console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
								//   this.receivedBy.forEach((s) => {
								//     if (s.fkOrgId == this.itemData.fkReceivingOrgId) {
								//       this.receivedByData = s;
								//       s.users.forEach((e) => {
								//         if (this.itemData.fkReceivingUserId == e.pkId) {
								//           this.receivedUserData = e;
								//         }
								//       });
								//     }
								//   });
							}
						});

						this.disclosureUnit = [res.data];
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			// 交底单位
			disclosureUnitClose() {
				this.disclosureUnitShow = false;
			},
			// 交底单位
			disclosureUnitConfirm(e) {
				console.log(e.value[0]);
				this.disclosureUnitData = e.value[0];
				// disclosureDepartment
				console.log(this.disclosureUnitData);
				// customType
				// if(e.value[0].customType ==4){
				this.disclosureStatus = false;
				this.informant = [e.value[0].users];
				// }else{
				//   this.disclosureStatus =true
				//   this.disclosureDepartment = [e.value[0].deptVos];
				// }

				this.disclosureUnitShow = false;
			},
			// 交底部门
			disclosureClose() {
				this.disclosureShow = false;
			},
			// 交底部门
			disclosureConfirm(e) {
				this.disclosureData = e.value[0];
				this.informant = [e.value[0].users];
				this.disclosureShow = false;
			},
			// 交底人
			informantClose() {
				this.informantShow = false;
			},
			// 交底人
			informantConfirm(e) {
				this.informantData = e.value[0];
				this.informantShow = false;
			},

			// 接收部门
			receivedByClose() {
				this.receivedByShow = false;
			},
			// 接收部门
			receivedByConfirm(e) {
				this.receivedByData = e.value[0];
				// console.log(this.receivedByData);
				this.receivedUser = [e.value[0].users];
				this.receivedByShow = false;
				this.receivedUserData = {};
			},
			//  接收人
			receivedUserClose() {
				this.receivedUserShow = false;
			},
			//  接收人
			receivedUserConfirm(e) {
				this.receivedUserData = e.value[0];
				this.receivedUserShow = false;
			},
			onChange(e) {
				console.log("改变事件", e);
			},
			onprogress(e) {
				console.log("中途事件", e);
				uni.showLoading({
					mask: true,
				});
			},
			close() {
				this.show = false;
			},
			dateSelect(e) {
				this.presentationTime = moment(e.value).format("YYYY-MM-DD");
				this.dateShow = false;
			},
			confirm(val) {
				this.receivingType = val.value[0];
				this.show = false;
			},
			onuploadEnd(e) {
				uni.hideLoading();
				if (e.responseText) {
					let res = JSON.parse(e.responseText);
					if (res.code === 200) {
						this.fileList.push({
							enclosureName: e.name,
							enclosureUrl: res.data,
						});
					}
				}
				console.log(this.fileList);
			},
			delFile(row, index) {
				this.fileList.splice(index, 1);
				this.$refs.lsjUpload1.clear(row.enclosureName);
			},
			download() {
				uni.navigateBack({
					delta: 1,
				});
			},
			openPick() {
				this.show = true;
			},
			examine(val) {
				uni.showLoading({
					mask: true,
				});
				let data = {
					disclosureName: this.rowData.disclosureName,
					disclosureTime: this.presentationTime,
					// disclosureType: this.receivingType.id,
					enableStatus: val,
					fkDeptId: this.disclosureUnitData.pkId,
					fkReceivingUserId: this.receivedUserData.pkId,
					fkUserId: this.informantData.pkId,
					forwardType: this.rowData.forwardType,
					receivingType: this.receivingData.id,
					enclosures: this.fileList,
					fkReceivingOrgId: this.receiverData.fkLinkOrgId,
					fkReceivingDeptId: this.receivedByData.fkOrgId == undefined ?
						"" : this.receivedByData.pkId,
				};
				// if(this.user.orgType ==2)
				data.disclosureType = 1;
				if (this.user.orgType == 1 || this.user.orgType == 3) {
					data.disclosureType = 1;
				}
				if (
					data.enclosures == undefined ||
					data.enclosures.length == 0 ||
					data.enclosures == null
				) {
					uni.hideLoading();
					return uni.showToast({ icon: "none", title: "附件不能为空" });
				}

				if (this.user.orgType == 5) {
					data.disclosureType =
						this.receiverData.customType == 2 ?
						2 :
						this.receiverData.customType == 4 ?
						3 :
						2;
				}
				if (this.user.orgType == 9) {
					data.disclosureType = 1;
				}
				if (
					data.fkReceivingUserId != undefined &&
					data.fkUserId != undefined &&
					data.fkReceivingUserId == data.fkUserId &&
					data.fkReceivingUserId.length != 0 &&
					data.fkUserId.length != 0
				) {
					uni.hideLoading();
					return uni.showToast({
						icon: "none",
						title: "交底人和接收人不能是同一个人",
					});
				}
				if (
					this.user.orgType == 2 ||
					this.user.orgType == 3 ||
					this.user.orgType == 9
				) {
					data.fkBidProjectId = uni.getStorageSync("nowProId");
				}
				if (
					this.receiverData.fkLinkOrgId == undefined ||
					this.receiverData.fkLinkOrgId.length == 0 ||
					this.receiverData.fkLinkOrgId == null
				) {
					uni.hideLoading();
					return uni.showToast({ icon: "none", title: "请选择接收单位" });
				}
				if (this.title == "新增技术交底") {
					let api = [5, 6, 7].includes(this.user.orgType) ? this.$api.prodTechnicalDisclosureAdd : this.$api
						.addProjectTechnicalDisclosure;
					api(data).then(res => {
						uni.hideLoading();
						if (res.code == 200) {
							uni.showToast({ icon: "none", title: "新增成功" });
							setTimeout(() => {
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 2]; // 上一页面实例
								prevPage.$vm.resh();
								uni.navigateBack({ delta: 1 });
							}, 500);
						} else {
							uni.showToast({ icon: "none", title: res.msg });
						}
					});
				} else {
					data.pkId = this.itemData.pkId;
					let api = [5, 6, 7].includes(this.user.orgType) ? this.$api.prodTechnicalDisclosureUpdate : this.$api
						.updateProjectTechnicalDisclosure;
					api(data).then(res => {
						uni.hideLoading();
						if (res.code == 200) {
							uni.showToast({ icon: "none", title: "编辑成功" });
							setTimeout(() => {
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 3]; // 上一页面实例
								prevPage.$vm.resh();
								uni.navigateBack({ delta: 2 });
							}, 500);
						} else {
							uni.showToast({ icon: "none", title: res.msg });
						}
					});
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.content-box {
		padding-top: 88rpx;
	}

	.form-title {
		margin-left: 20rpx;
		line-height: 60rpx;
	}

	.form-content {
		height: 80rpx;
		background: #fff;
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

	.popup-footer {
		position: fixed;
		bottom: 0;
		display: flex;
		// width: 660rpx;
		height: 120rpx;

		// background-color: rgb(194, 155, 155);
		.btn-iem {
			width: 270rpx;
			height: 120rpx;
			line-height: 120rpx;
			border-radius: 0;
			background-color: #eeeeee;
		}

		.btn-iem2 {
			flex: 1;
			background-color: #2a82e4;
			border-color: #2a82e4;
		}

	}

	.groupChange {
		background: #fff;
		height: 40px;
		padding-left: 12px;
		padding-top: 8px;
	}

	.form-content {
		height: 80rpx;
		background: #fff;
	}

	/deep/ .u-cell__title-text {
		width: 500rpx;
		overflow: hidden;
		/*超出部分隐藏*/
		white-space: nowrap;
		/*禁⽌换⾏*/
		text-overflow: ellipsis;
		/*省略号*/
	}

	/deep/ .uni-input-input,
	/deep/ .uni-input-placeholder {
		padding-left: 12px;
	}

	.upload-btn {
		width: 150rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #5084fe;
		background-color: #dfedff;
		border-radius: 6rpx;
	}

	.inputs-fileList {
		padding: 20rpx 16rpx 20rpx 216rpx !important;
		height: 220rpx;
		position: relative;
		overflow-x: scroll;
		display: flex;
	}

	.fileListBtn {
		position: absolute;
		left: 16rpx;
		width: 180rpx;
		height: 180rpx !important;
		background-color: #fff;


		.lsj-file {
			width: 180rpx !important;
			height: 180rpx !important;
			display: flex;
			align-items: center;
		}

		/deep/ .hFile {
			font-weight: 600;
			width: 180rpx !important;
			height: 180rpx !important;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			color: rgba(42, 130, 228, 1);

			.jia {
				font-size: 20px;
				font-weight: 600;
				color: rgba(42, 130, 228, 1);
			}
		}
	}

	.inputs-fileList-item {
		width: 180rpx !important;
		height: 180rpx !important;
		overflow: hidden;
		padding: 0 !important;
		margin-right: 16rpx;

		.left {
			width: 100%;
			height: 100%;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.closes {
		width: 40rpx;
		height: 40rpx;
		background-image: url('../../static/sanjiao.png');
		background-repeat: no-repeat;
		position: absolute;
		right: 0;
		top: 0;
	}

	.selectShow {
		height: 1100rpx;

		.head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80rpx;
			// line-height: 80rpx;
			padding: 0 20rpx;
			font-size: 28rpx;
		}

		.content {
			border-top: 1px solid #eeeeee;
			height: 1000rpx;
			padding-left: 24rpx;
			overflow: auto;

			.cont-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 100rpx;
				border-bottom: 1px solid #eee;

				text {
					color: #4d5d79;
					font-weight: 600;
				}

				.item-icon {
					color: #ddd;
					padding-right: 24rpx;
				}
			}


		}

		.item-bgc {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			height: 100rpx;
			padding-left: 12rpx;
			border-bottom: 1px solid #eee;
			background: linear-gradient(90deg, rgba(230, 235, 255, 1) 0%, rgba(250, 250, 255, 1) 100%);
			font-weight: 600;

			.item-icon {
				color: #ddd;
				padding-right: 24rpx;
			}
		}
	}

	.inputs-content {
		/deep/ .uni-input-placeholder {
			padding-left: 8rpx;
		}

		/deep/ .uni-input-input {
			padding-left: 8rpx;
		}
	}

	.btn-add {
		width: 100%;
		height: 116rpx;
		line-height: 100rpx;
		text-align: center;
		color: #2A82E4;
		border: 8rpx solid #f7f7ff;
		border-left: none;
		border-right: none;
	}
</style>