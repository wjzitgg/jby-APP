<!-- 工程图纸详情 -->
<template>
	<view class="wrapper addPageBg">
		<u-navbar :leftText="editTitle" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="content">
			<view>
				<view class="add-inputs">
					<view class="inputs-label">填表人</view>
					<view class="inputs-content select">
						<u--textarea v-model="rowData.userName" placeholder="请输入内容" autoHeight maxlength="25" border="none"
							disabled></u--textarea>
						<u-icon name="lock-fill" class="icons" color="#2a82e4" size="16"></u-icon>
					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">填表日期</view>
					<view class="inputs-content select">
						<u--textarea v-model="rowData.time" placeholder="请输入内容" autoHeight maxlength="25" border="none"
							disabled></u--textarea>
						<u-icon name="lock-fill" class="icons" color="#2a82e4" size="16"></u-icon>
					</view>
				</view>
				<view v-if="editTitle != '新增日志'" class="add-inputs">
					<view class="inputs-label">填表时间</view>
					<view class="inputs-content select">
						<u--textarea v-model="rowData.data" placeholder="请输入内容" autoHeight maxlength="25" border="none"
							disabled></u--textarea>
						<u-icon name="lock-fill" class="icons" color="#2a82e4" size="16"></u-icon>
					</view>
					<!-- <u-input placeholder="请输入内容" border="none" customStyle="" v-model="rowData.data" :disabled="true"
            suffixIcon="lock-fill" class="form-content" clearable></u-input> -->
				</view>
				<view class="add-inputs">
					<view class="inputs-label">分项选择</view>
					<view class="inputs-content select" @click="receiverClick">
						<view class="name">{{ subentryData.itemName }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="subentryShow" :columns="subentryList" keyName="itemName" @cancel="subentryClose"
						@confirm="subentryconfirm"></u-picker>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">当前温度</view>
					<!-- <u-input placeholder="请输入内容" border="none" customStyle="" v-model="rowData.temperature" class="form-content"
            clearable></u-input> -->
					<view class="inputs-content select" @click="openPick2">
						<view class="name">
							{{ rowData.temperature.length==0?'': rowData.temperature+'°C'}}
						</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="show2" ref="picker2" :columns="columns2" :defaultIndex="[20]" keyName="temperatureName"
						@cancel="close2" @confirm="confirm2"></u-picker>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">当前天气</view>
					<view class="inputs-content select" @click="openPick">
						<view class="name">
							{{ receivingType.weatherStats }}
						</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="show" ref="picker" :columns="columns" keyName="weatherStats" @cancel="close"
						@confirm="confirm"></u-picker>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">当前风力</view>
					<view class="inputs-content select" @click="windGradeShow = true">
						<view class="name">
							{{ windGradeData.windGradeName }}
						</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="windGradeShow" ref="picker" :columns="[windGradeList]" keyName="windGradeName"
						@cancel="windGradeClose" @confirm="windGradeConfirm"></u-picker>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">日志内容</view>
					<view class="inputs-content">
						<u--textarea v-model="rowData.content" placeholder="请输入内容" autoHeight border="none"
							maxlength="500"></u--textarea>
					</view>
					<!-- <u-input placeholder="请输入内容" border="none" customStyle="" v-model="rowData.content" class="form-content inputs"
            clearable></u-input> -->
				</view>
				<view class="add-inputs">
					<view class="inputs-label">附件</view>
					<view class="inputs-fileList">
						<view class="inputs-fileList-item" v-for="(item, index) in fileList" :key="item.id">
							<view class="left" @click="preview(item.enclosureUrl)">
								<u-icon class="icons" name="file-text" size="20"></u-icon>
								<view class="name text-hidden">{{ item.enclosureName }}</view>
							</view>
							<view class="file-closeBtn close" @click="delFile(item, index)"></view>
						</view>
						<view class="fileListBtn">
							<lsj-upload ref="lsjUpload1" childId="upload2" :option="option" :size="size" v-if="!receiveShow"
								:formats="formats" :debug="debug" :count="10" :nowCount="fileList.length" :instantly="instantly"
								@change="onChange" @progress="onprogress" @uploadEnd="onuploadEnd">
								<view class="addBtn">上传附件</view>
							</lsj-upload>
						</view>
					</view>
				</view>
			</view>
			<!-- ======================== -->
			<view class="pad"></view>
			<u-button class="btn" type="primary" text="确认" @click="submit"></u-button>
		</view>
		<prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop>
		<treeSelect :list="subentryList" ref="treeSelect" @checked="checked"></treeSelect>
		<u-popup :show="receiveShow" @close="receiveShow = false">
			<view class="selectShow">
				<view class="head">
					<view class="name">关联项目</view>
					<view class="closeBtn" @click="requestConfirmation" style="color: #3c9cff">确认</view>
				</view>
				<view class="content">
					<tree ref="weert" class="price-amount" :selectedData="viewAuthorize" :multiple="false" :selectParent="false"
						:localdata="subentryList" :associatedNode="false" valueKey="pkId" textKey="itemName" childrenKey="children">
					</tree>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import request from "@/common/request";
	import prviewPop from "../../components/prview-pop/prview-pop.vue";
	import treeSelect from "@/components/tree-select/tree-select.vue";
	import tree from "../../components/ba-tree-picker-radio/ba-tree-picker.vue";
	export default {
		components: { prviewPop, treeSelect, tree },
		data() {
			return {
				show: false,
				columns: [],
				show2: false,
				columns2: [],
				temperatureName: "",
				receivingType: { weatherCode: "", weatherStats: "" },
				editTitle: "",
				subentryList: [],
				subentryShow: false,
				subentryData: {
					itemName: "",
					pkId: "",
				},
				rowData: {

				},

				fileList: [],
				appShow: true,
				selecValue: "",
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
						"Authorization": uni.getStorageSync("token"),
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
				receiveShow: false,
				viewAuthorize: [],
				windGradeList: [],
				windGradeData: {
					windGrade: "",
					windGradeName: ""
				},
				windGradeShow: false
			};
		},
		onLoad(item) {
			this.rowData = JSON.parse(item.row);
			if (this.rowData.type == 1) {
				this.rowData.temperature = "";
				this.rowData.content = "";
				//       rowData.userName
				// rowData.time
				// rowData.data

				this.editTitle = "新增日志";
				let date = uni.getStorageSync("user");
				this.rowData.userName = date.userName;
				this.rowData.time = this.getNowFormatDate();
				this.rowData.temperature = 0;
				// this.windGradeData = this.windGradeList[0]
				// console.log()
			} else {
				console.log(this.rowData);
				this.editTitle = "编辑日志";
				this.subentryData = { pkId: this.rowData.fkItemId, itemName: this.rowData.itemName };
				this.receivingType = { weatherCode: this.rowData.weatherCode, weatherStats: this.rowData.weatherCodeName };
				this.fileList = this.rowData.enclosures;
				// windGradeData
				this.windGradeData = {
					windGrade: this.rowData.windGrade,
					windGradeName: this.rowData.windGradeName,
				};
			}
			// this.init()
			this.weatherStatsAllList();
			this.searchItemsByOrgId();
			this.temperatureAllList();
			this.windGradeAllList();
		},
		methods: {
			windGradeConfirm(val) {
				this.windGradeData = val.value[0];
				this.windGradeShow = false;
			},
			windGradeClose() {
				this.windGradeShow = false;
			},
			windGradeAllList() {
				this.$api.windGradeAllList().then(res => {
					if (res.code == 200) {
						this.windGradeList = res.data;
						if (this.editTitle == "新增日志") {
							this.windGradeData = res.data[0];
						}
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			receiverClick() {
				this.receiveShow = true;
				this.$nextTick(() => {
					this.$refs.weert._initTree();
				});
			},
			// 接收单位
			receiveClose() {
				this.receiveShow = false;
			},
			// 接收单位
			requestConfirmation() {
				this.receiverDataList = [];
				console.log(this.$refs.weert._confirm());
				this.viewAuthorize = this.$refs.weert._confirm();
				let arr = this.flatTreeData(this.subentryList);
				arr.forEach(item => {
					this.viewAuthorize.forEach(e => {
						if (item.pkId == e) {
							console.log("kan", item);
							this.subentryData = item;
						}
					});
				});
				// this.subentryData =e
				this.receiveShow = false;
			},
			flatTreeData(list) {
				const res = [];

				function getData(list) {
					list.forEach(item => {
						res.push(item);
						if (item.children) {
							getData(item.children);
						}
					});
				}
				getData(list);
				return res;
			},
			openPick() {
				if (this.receivingType.weatherStats) {
					let index = this.columns[0].findIndex(item => item.weatherStats == this.receivingType.weatherStats);
					console.log(index);
					this.$refs.picker.setIndexs([index]);
				}
				console.log(!!this.receivingType.weatherStats);
				this.show = true;
			},
			openPick2() {
				if (this.rowData.temperature) {
					let index = this.columns2[0].findIndex(item => item.temperature == this.rowData.temperature);
					this.$refs.picker2.setIndexs([index]);
				}
				console.log(!!this.rowData.temperature);
				this.show2 = true;
			},
			checked(e) {
				console.log(e);
				this.subentryData = e;
			},
			itemSearch() {
				this.$refs.treeSelect.selectShow = true;
			},
			preview(url) {
				this.$checkName(url);
				return;
				this.previewUrl = url;
				this.previewShow = true;
			},
			closePre() {
				this.previewShow = false;
			},
			getNowFormatDate() {
				let date = new Date();
				let seperator1 = "-";
				let seperator2 = ":";
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				let currentdate = year + seperator1 + month + seperator1 + strDate;

				return currentdate;
			},
			temperatureAllList() {
				this.$api.temperatureAllList().then(res => {
					if (res.code == 200) {
						this.columns2 = [res.data];
					}
				});
			},
			close() {
				this.show = false;
			},
			confirm(val) {
				this.receivingType = val.value[0];
				this.show = false;
			},
			close2() {
				this.show2 = false;
			},
			confirm2(val) {
				this.rowData.temperature = val.value[0].temperature;
				this.show2 = false;
			},
			subentryClose() {
				this.subentryShow = false;
			},
			subentryconfirm(e) {
				this.subentryData = e.value[0];
				this.subentryShow = false;
			},
			weatherStatsAllList() {
				this.$api.weatherStatsAllList().then(res => {
					if (res.code == 200) {
						// console.log(res);
						this.columns = [res.data];
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			searchItemsByOrgId() {
				this.$api.searchItemsByOrgId().then(res => {
					if (res.code == 200) {
						this.subentryList = res.data;
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			onChange(e) {
				console.log("改变事件", e);
			},
			onprogress(e) {
				console.log("中途事件", e);
			},

			onuploadEnd(e) {
				console.log("结束事件", e);
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
			// 取消
			download() {
				uni.navigateTo({
					url: "/pages/production/log?",
				});
			},
			// 确定提交
			submit() {
				let data = {
					content: this.rowData.content,
					fkItemId: this.subentryData.pkId,
					temperature: this.rowData.temperature,
					weatherCode: this.receivingType.weatherCode,
					enclosures: this.fileList,
					windGrade: this.windGradeData.windGrade
				};
				if (!data.content) {
					return uni.showToast({ title: "请填写日志内容", icon: "none" });
				}
				if (!data.fkItemId) {
					return uni.showToast({ title: "请选择分项工程", icon: "none" });
				}
				if (!data.temperature && data.temperature !== 0) {
					return uni.showToast({ title: "请选择温度", icon: "none" });
				}
				if (!data.weatherCode) {
					return uni.showToast({ title: "请选择天气", icon: "none" });
				}
				uni.showLoading({ mask: true });
				if (this.editTitle == "新增日志") {
					this.$api
						.constructionLogAdd([data])
						.then(res => {
							uni.hideLoading();
							if (res.code == 200) {
								uni.showToast({ title: "新增成功" });
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 2]; // 上一页面实例
								prevPage.$vm.resh(); // 调用上一页 定义的方法
								uni.navigateBack({ delta: 1 });
							} else {
								uni.showToast({ icon: "none", title: res.msg });
							}
						});
				} else {
					data.pkId = this.rowData.pkId;
					this.$api.constructionLogUpdate(data).then(res => {
						if (res.code == 200) {
							uni.showToast({ title: "编辑成功" });
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 3]; // 上一页面实例
							prevPage.$vm.resh(); // 调用上一页 定义的方法
							uni.navigateBack({ delta: 2 });
						} else {
							uni.showToast({ icon: "none", title: res.msg });
						}
					});
				}
			},
			delFile(row, index) {
				this.fileList = this.fileList.filter(item => item.id !== row.id);
				this.$refs.lsjUpload1.clear(row.fileName);
			},
		},
	};
</script>

<style lang="scss" scoped>
	.content {
		margin-top: 20rpx;
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
		//margin-bottom: 20rpx;
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

	/deep/.inputs {
		padding: 0 20rpx !important;

		.u-icon__icon {
			font-size: 32rpx !important;
			line-height: 32rpx !important;
		}
	}

	.form-content2 {
		background-color: #fff;
	}

	.file-empty {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 30rpx;
		background-color: #fff;
	}

	.fileList-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 60rpx;
		background-color: #fff;
		border-bottom: 1px solid #eee;

		.left {
			display: flex;
			align-items: center;
		}

		.fileName {
			width: 500rpx;
		}

		.file-closeBtn {
			width: 60rpx;
			color: red;
		}
	}

	.pad {
		height: 100rpx;
	}

	.selectShow {
		height: 800rpx;

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
			height: 700rpx;
			overflow: auto;
			border-top: 1px solid;
		}
	}

	/deep/.u-input {
		background-color: #fff !important;
	}
</style>