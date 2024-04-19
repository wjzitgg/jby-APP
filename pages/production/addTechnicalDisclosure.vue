<!-- 工程图纸详情 -->
<template>
	<view class="wrapper addPageBg">
		<u-navbar :leftText="title" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="content">
			<view style="padding-bottom: 60px">
				<view class="add-inputs">
					<view class="inputs-label">交底名称</view>
					<view class="inputs-content">
						<u--textarea v-model="rowData.disclosureName" placeholder="请输入内容" autoHeight maxlength="50"
							border="none"></u--textarea>
					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">{{
            [2, 3, 5, 9].includes(user.orgType) ? "交底部门" : "交底单位"
          }}</view>
					<view class="inputs-content select" @click="disclosureUnitShow = true">
						<view class="name">{{ disclosureUnitData.deptName }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="disclosureUnitShow" :columns="disclosureUnit" keyName="deptName"
						@cancel="disclosureUnitClose" @confirm="disclosureUnitConfirm"></u-picker>
				</view>
				<view v-if="disclosureStatus" class="add-inputs">
					<view class="inputs-label">交底部门</view>
					<view class="inputs-content select" @click="disclosureShow = true">
						<view class="name">{{ disclosureData.deptName }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="disclosureShow" :columns="disclosureDepartment" keyName="deptName" @cancel="disclosureClose"
						@confirm="disclosureConfirm"></u-picker>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">交底人</view>
					<view class="inputs-content select" @click="informantShow = true">
						<view class="name">{{ informantData.userName }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="informantShow" :columns="informant" keyName="userName" @cancel="informantClose"
						@confirm="informantConfirm"></u-picker>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">交底时间</view>
					<view class="inputs-content select" @click="dateShow = true">
						<view class="name">{{ presentationTime }}</view>
						<u-icon name="calendar-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-datetime-picker :show="dateShow" v-model="value1" @cancel="dateShow = false" @confirm="dateSelect"
						mode="date"></u-datetime-picker>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">接收单位</view>
					<view class="inputs-content select" @click="receiveShow = true">
						<view class="name">{{ receiverData.customName }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="receiveShow" :columns="receiverList" keyName="customName" @cancel="receiveClose"
						@confirm="receiveConfirm"></u-picker>
				</view>
				<view v-if="receiverData.customType != 4" class="add-inputs">
					<view class="inputs-label">接收部门</view>
					<view class="inputs-content select" @click="receivedByShow = true">
						<view class="name">{{ receivedByData.deptName }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="receivedByShow" :columns="receivedBy" keyName="deptName" @cancel="receivedByClose"
						@confirm="receivedByConfirm"></u-picker>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">接收人</view>
					<view class="inputs-content select" @click="receivedUserShow = true">
						<view class="name">{{ receivedUserData.userName }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="receivedUserShow" :columns="receivedUser" keyName="userName" @cancel="receivedUserClose"
						@confirm="receivedUserConfirm"></u-picker>
				</view>
				<!-- <view>
          <view class="form-title">交底类型</view>
          <view class="select" @click="openPick">
            <view class="name">{{ receivingType.label }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
          </view>
          <u-picker :show="show" :columns="columns" keyName="label" @cancel="close" @confirm="confirm"></u-picker>
        </view> -->
				<view class="add-inputs">
					<view class="inputs-label">交底方式</view>
					<view class="inputs-content select" @click="receivingTypeShow = true">
						<view class="name">{{ receivingData.label }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="receivingTypeShow" :columns="receivingList" keyName="label" @cancel="receivingClose"
						@confirm="receivingConfirm"></u-picker>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">允许抄送</view>
					<u-radio-group v-model="rowData.forwardType" placement="row" class="inputs-content">
						<u-radio :customStyle="{ marginBottom: '8px', marginLeft: '8px' }" v-for="(item, index) in radiolist"
							:key="index" :label="item.name" :name="item.id">
						</u-radio>
					</u-radio-group>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">附件</view>
					<view class="inputs-fileList">
						<view class="inputs-fileList-item" v-for="(item, idx) in fileList" :key="idx">
							<view class="left" @click="preview(item)">
								<u-icon name="file-text"></u-icon>
								<view class="name">{{item.enclosureName}}</view>
							</view>
							<view class="close" @click="delFile(item, index)"></view>
							<!-- <u-icon class="close" color="red" name="close" @click="delFile(item, idx)" ></u-icon> -->
						</view>
						<view class="fileListBtn">
							<lsj-upload ref="lsjUpload1" childId="upload2" :option="option" :size="size" :formats="formats"
								:debug="debug" :count="10" :nowCount="fileList.length" :instantly="instantly" @change="onChange"
								@progress="onprogress" @uploadEnd="onuploadEnd">
								<view class="addBtn"> 上传附件 </view>
							</lsj-upload>
						</view>
					</view>
				</view>
			</view>
			<view class="popup-footer" style="justify-content: space-between; width: 100%">
				<view class="btns">
					<!-- <u-button class="btn-iem" text="取消" @click="download"></u-button> -->
					<u-button class="btn-iem" type="primary" text="保存草稿" @click="examine(1)"></u-button>
				</view>
				<view class="btns">
					<u-button class="btn-iem" type="success" text="确认提交" @click="examine(2)"></u-button>
				</view>
			</view>
		</view>
		<prviewVideo :src="video" :show="videoShow" @close="closePreview" ref="domVideo"></prviewVideo>
	</view>
</template>

<script>
	import moment from "moment";
	import request from "@/common/request";
	import prviewVideo from "../../components/ls-dom-video/ls-dom-video.vue";
	export default {
		data() {
			return {
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
				receiveShow: false, //接收单位弹窗状态
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
				receivingData: {},
				receivingList: [
					[
						{ label: "会议交底", id: "1" },
						{ label: "书面交底", id: "2" },
						{ label: "会议与书面交底", id: "3" },
					],
				],
				title: "新增技术交底",
				itemData: {},
			};
		},
		onLoad(item) {
			let data = JSON.parse(item.row);
			// console.log("==================================");
			// console.log(data);
			if (data.type == 1) {
				this.title = "新增技术交底";
			} else if (data.type == 2) {
				this.title = "编辑技术交底";
				this.itemData = data;
				this.rowData.disclosureName = data.disclosureName;
				this.presentationTime = data.disclosureTime;
				this.disclosureTime = data.disclosureTime;
				this.rowData.forwardType = data.forwardType + "";
				this.fileList = data.enclosures;
				if (data.receivingType == 1) {
					this.receivingData = { label: "会议交底", id: "1" };
				} else if (data.receivingType == 2) {
					this.receivingData = { label: "书面交底", id: "2" };
				} else if (data.receivingType == 3) {
					this.receivingData = { label: "会议与书面交底", id: "3" };
				}
			}
			// console.log("==================================");
			this.deptListByOrgId();
			if (
				this.user.orgType == 2 ||
				this.user.orgType == 3 ||
				this.user.orgType == 4 ||
				this.user.orgType == 9
			) {
				this.projectListByOrgId();
			} else {
				this.customsContainByOrgId();
			}
			//
		},
		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
			},
		},
		components: {
			prviewVideo
		},
		methods: {
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
				this.receivingData = e.value[0];
				this.receivingTypeShow = false;
			},
			// 项目部
			customsContainByOrgId() {

				this.$api.customsContainByOrgId().then(res => {
					if (res.code == 200) {
						this.receiverList = [res.data];
						res.data.forEach(item => {
							if (
								this.title == "编辑技术交底" &&
								this.itemData.fkReceivingOrgId == item.fkLinkOrgId
							) {
								this.receiverData = item;
								if (item.customType == 4) {
									this.$set(this.receivedUser, 0, item.users);
									// this.receivedUser = item.users;
									item.users.forEach(e => {
										if (this.itemData.fkReceivingUserId == e.pkId) {
											this.receivedUserData = e;
										}
									});
								} else {
									this.receivedBy = item.deptVos;
									console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
									console.log(item);
									console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
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
									//
								}
								//
							}
						});
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
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
			// 接收单位
			receiveClose() {
				this.receiveShow = false;
			},
			// 接收单位
			receiveConfirm(e) {
				this.receiverData = e.value[0];
				// console.log("xxxxxxxxxxxxxxxxxxxxxx")
				// console.log(e.value[0])
				// console.log("xxxxxxxxxxxxxxxxxxxxxx")
				// this.receivedBy = [e.value[0].deptVos];
				this.receiveShow = false;

				if (e.value[0].customType == 4) {
					this.receivedUser = [e.value[0].users];
				} else {
					// this.disclosureDepartment = [e.value[0].deptVos];
					this.receivedBy = [e.value[0].deptVos];
					this.receivedByData = {};
					this.receivedUserData = {};
				}
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
		width: 660rpx;
		height: 80rpx;

		// background-color: rgb(194, 155, 155);
		.btns {
			//padding: 12rpx;
			flex: 1;
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
</style>