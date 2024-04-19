<template>
	<view class="wrapper">
		<u-navbar :leftText="navBarTitle" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="content">
			<view>
				<view class="title">会议主题</view>
				<view class="inputs">
					<u-input placeholder="请输入" v-model="form.meetingTitle" :disabled="navBarTitle == '会议信息'" border="none"
						maxlength="100" clearable></u-input>
				</view>
			</view>
			<view>
				<view class="title">会议场所</view>
				<view class="inputs">
					<u-input placeholder="请输入" v-model="form.meetingPlace" :disabled="navBarTitle == '会议信息'" border="none"
						maxlength="100" clearable></u-input>
				</view>
			</view>
			<view>
				<view class="title">会议主讲人</view>
				<view class="inputs">
					<u-input placeholder="请输入" v-model="form.speaker" :disabled="navBarTitle == '会议信息'" border="none" clearable
						maxlength="50"></u-input>
				</view>
			</view>
			<view>
				<view class="title">会议时间</view>
				<view class="inputs" style="display: flex;">
					<view class="inputs-item" @click="dateShow = true">

						<!-- <uni-icons type="down" size="30"></uni-icons> -->
						<u-input class="inputs-item-1" border="none" v-model="meetingStartTime" clearable disabled
							placeholder="请选择开始时间"> </u-input>
						<!-- {{ meetingStartTime }}  -->
						<u-icon name="calendar" style="display: inline-block;"></u-icon>

					</view> --


					<!-- <view style="flex: 1;display: flex;" @click="timeShow = true">
                        <u-icon name="clock" class="ico-close"></u-icon>
                        <view
                            style="line-height: 25px;height: 25px;border: 1px solid #eee;width: 100%; text-align: center;">
                            {{ beginTime }}</view>
                    </view>
                    <view class="inputs-item" @click="endTimeShow = true">至 {{ endTime }}</view> -->

					<view class="inputs-item" @click="endTimeShow = true">

						<u-input class="inputs-item-1" border="none" v-model="endTime" clearable disabled placeholder="请选择结束时间" />
						<!-- {{ endTime }} -->
						<u-icon name="calendar" style="display: inline-block;"></u-icon>

					</view>
				</view>
			</view>
			<view>
				<view class="title">会议时长</view>
				<view class="inputs">
					<!-- <u-input v-model="form.speaker" :disabled="navBarTitle == '会议信息'" border="none" clearable></u-input> -->
					<text v-if="dayDiff != 0 && dayDiff.length != 0">{{ dayDiff + '天' }}</text>
					<text v-if="hours.length != 0">{{ hours + '小时' }}</text>
					<text v-if="minutes.length != 0">{{ minutes+seconds + '分钟' }}</text>
					<!-- dayDiff: "", //天数
            hours: "", //小时
            minutes: "", //分钟 -->
				</view>
			</view>
			<view>
				<view class="title">参加人员
				</view>
				<view class="participant">

					<view class="participant-item" v-for="(item, idx) in selectList" :key="idx">{{ item.userName }} <u-icon
							name="close" class="ico-close" style="" v-if="navBarTitle != '会议信息'" color="#ddd"
							@click="remove(idx)"></u-icon>

					</view>
					<view class="choice" v-if="navBarTitle != '会议信息'" @click="choice">添加</view>

				</view>
			</view>
			<view>
				<view class="title">其他人员</view>
				<view class="inputs">
					<u-input placeholder="请输入" v-model="form.otherStaff" :disabled="navBarTitle == '会议信息'" border="none"
						maxlength="200"></u-input>
				</view>
			</view>
			<view v-if="navBarTitle == '会议信息'">
				<view class="title">会议状态</view>
				<view class="inputs">
					<!-- <u-input v-model="form.speaker" :disabled="navBarTitle == '会议信息'" border="none" clearable></u-input> -->
					<view v-if="enableStatus == 0">草稿</view>
					<view v-if="enableStatus == 1">已发布</view>
				</view>
			</view>
			<!-- <view>
                <view class="title">文章类型</view>
                <view class="inputs select" @click="openPicker">
                    <view class="name">{{ cusTypeName }}</view>
                    <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
                </view>
            </view> -->
			<!-- <view>
                <view class="title">发布平台</view>
                <view class="textarea" style="position: relative;background: #fff;padding:26px 13px;">
                    <u-checkbox-group v-model="checkboxValue1" :disabled="navBarTitle == '会议信息'" placement="column"
                        @change="checkboxChange">
                        <u-checkbox :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in checkboxList1"
                            :key="index" :label="item.name" :name="item.name">
                        </u-checkbox>
                    </u-checkbox-group>
                    <view v-if="form.rotationUrl !== ''" style="position: absolute;top: 12px;right: 26px;">
                        <u--image :src="form.rotationUrl" mode="widthFix" width="80px" height="80px"></u--image>
                    </view>
                    <view v-else style=" position: absolute;top: 12px;right: 26px; background: #f2f2f2;width: 120px;">
                        <u-icon name="plus" color="#ccc" style="margin-left: 50px" size="20px"></u-icon>
                        <lsj-upload ref="lsjUpload1" childId="upload2" :width="width" :height="height" :option="option"
                            :size="size" :formats="formats" :debug="debug" :count="10" :nowCount="fileList.length"
                            :instantly="instantly" @change="onChange" @progress="onprogress"
                            style="margin-top: 10px; padding:6px" @uploadEnd="onuploadEnd"
                            <view class="upload-btn" :style="{ width: width, height: height }">APP首页轮播图</view>
                        </lsj-upload>
                    </view>
                </view>
            </view> -->
			<!-- <view>
                <view class="title">文章摘要</view>
                <view class="textarea">
                    <u-textarea v-model="form.noticeAbstract" :disabled="navBarTitle == '会议信息'" placeholder="请输入内容"
                        border="none"></u-textarea>
                </view>
            </view> -->
			<view>
				<view class="title">会议内容</view>
				<view class="textarea" style="position: relative;">
					<u-parse v-if="navBarTitle == '会议信息'" :content="form.meetingContent"></u-parse>
					<!-- <edit class="textarea-hui" v-if="editStatus && navBarTitle != '会议信息'" :value="form.meetingContent"
						ref="editRef" @editorChange="editorChange"></edit> -->
					<editors class="textarea-hui" v-if="editStatus && navBarTitle != '会议信息'" :content="form.meetingContent"
						ref="editRef"></editors>

				</view>
			</view>



			<view v-if="navBarTitle == '会议信息'"
				style="position: absolute;top:0;width:100%;height:110%;background: #f3f3f3;background: rgba(0,0,0,.0);">
			</view>
		</view>
		<view class="pdb"></view>

		<view class="footer">
			<view v-if="type == 0 || navBarTitle == '编辑会议'" class="footerBtn add" style="margin-right: 0px;"
				@click="addOk(0)">保存草稿</view>

			<view v-if="type == 0 || navBarTitle == '编辑会议'" class="footerBtn adds" style="margin-left: 0px;"
				@click="addOk(1)">发布</view>

			<view v-if="$auth('assess:notice:update')&&type == 1 && enableStatus == 0 && navBarTitle != '编辑会议'" class="footerBtn add"
				style="margin-right: 0px;" @click="redact">编辑 </view>
			<view v-if="$auth('assess:notice:delete')&&type == 1 && enableStatus == 0 && navBarTitle != '编辑会议'" class="footerBtn error"
				style="margin-left: 0px;" @click="expurgate(1)">删除</view>
			<view v-if="$auth('assess:notice:withdraw')&&type == 1 && enableStatus == 1 && form.cancelStatus == 1" class="footerBtnOne errors"
				style="margin-left: 0px;" @click="expurgate(2)">撤回</view>
		</view>
		<u-picker title="请选择文章类型" :show="pickerShow" :columns="[cusTypeList]" keyName="name" @confirm="pickerConfirm"
			@cancel="pickerCancel"></u-picker>
		<u-modal :show="show2" title="提示" :content="promptContent" showCancelButton @cancel="show2 = false"
			@confirm="confirm"></u-modal>

		<u-popup :show="showPop" @close="closePop" mode="bottom" class="opo">
			<view class="popup">
				<view class="popup-search">
					<view class="search-item">
						<easy-select ref="easySelect2" size="mini" class="easySelect" :value="types" @selectOne="selectOne2"
							:options="typeList"></easy-select>
					</view>
					<view class="search-item">
						<u-input v-model="optionForm.keyWord" @blur="keyWordBlur" placeholder="员工姓名/手机" clearable></u-input>
					</view>
					<view class="search-item">
						<view class="footerBtnOne" @click="selectOk">确定</view>
					</view>
				</view>
				<u-checkbox-group v-model="checkboxValue" placement="column">
					<view class="table_detail" style="margin-top: 2px;">
						<table>
							<thead>
								<tr>
									<th>序号</th>
									<th style="width:40px">选择</th>
									<th>员工姓名</th>
									<th>所属部分</th>
									<th>手机号码</th>

								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in itemNameList" :key="index">

									<td><u-checkbox style="margin-left: 10px;" :label="''" :name="index"></u-checkbox></td>
									<td>{{ index+1 }}</td>
									<td>{{ item.userName }}</td>
									<td>{{ item.deptName }}</td>
									<td>{{ item.telephone }}</td>
								</tr>
								<view v-if="itemNameList.length == 0" style="height: 60px;"></view>
							</tbody>
						</table>
					</view>
				</u-checkbox-group>
			</view>
		</u-popup>
		<!--  -->
		<u-datetime-picker :show="dateShow" v-model="value1" mode="datetime" @cancel="dateCancel"
			@confirm="dateConfirm"></u-datetime-picker>
		<!-- <u-datetime-picker :show="timeShow" v-model="value2" mode="time" @cancel="timeCancel"
            @confirm="timeConfirm"></u-datetime-picker> -->
		<u-datetime-picker :show="endTimeShow" v-model="value3" mode="datetime" @cancel="endTimeCancel"
			@confirm="endTimeConfirm"></u-datetime-picker>
	</view>
</template>

<script>
	import request from "@/common/request";
	import edit from "@/components/xia-editor/xia-editor/xia-editor";
	import editors from "@/components/editors/editors";
	import moment from "moment";
	export default {
		components: { edit,editors },
		onLoad(options) {
			this.searchEasyDeptList();
			this.type = options.type;
			if (options.type == 0) {
				this.navBarTitle = "新增会议";
			} else if (options.type == 1) {
				this.navBarTitle = "会议信息";
				let obj = JSON.parse(options.obj);
				this.enableStatus = obj.enableStatus;
				this.oaMeetingFindById(obj.pkId);
			}

		},
		data() {
			return {
				showPop: false,
				typeList: [],
				// typeVal: "",
				types: "全部",
				itemNameList: [],
				checkboxValue: [],
				selectList: [],
				dateShow: false,
				value1: Number(new Date()),
				meetingStartTime: "",
				timeShow: false,
				value2: "",
				beginTime: "",
				endTimeShow: false,
				value3: Number(new Date()),
				endTime: "",
				type: "",
				form: {
					meetingTitle: "",
					meetingPlace: "",
					speaker: "",
					meetingContent: "",
					otherStaff:""
					// rotationUrl: "",
					// noticeType: "",
				},
				optionForm: {
					deptId: "",
					keyWord: ""
				},



				enableStatus: "",
				show2: false,
				promptContent: "",

				checkboxValue1: [],
				// 基本案列数据
				checkboxList1: [{
						name: "PC端",
						disabled: false,
						id: 0,
					},
					{
						name: "APP端",
						disabled: false,
						id: 1,
					},
				],
				//==============


				fileList: [],
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
				width: "190rpx",
				height: "40rpx",
				// 限制允许上传的格式，空串=不限制，默认为空
				formats: "",
				// 文件上传大小限制
				size: 30,
				// 是否打印日志
				debug: false,
				// ================ 


				navBarTitle: "编辑会议",
				subList: [],
				tiltetype: "1",

				cusTypeList: [
					{ id: 0, name: "公司新闻" },
					{ id: 1, name: "公司公告" },
				],

				pickerShow: false,
				cusTypeName: "",

				subSelShow: false,
				editStatus: true,
				dayDiff: "", //天数
				hours: "", //小时
				minutes: "", //分钟
				seconds: 0,
			};
		},
		methods: {
			duration() {
				if (this.meetingStartTime.length != null && this.meetingStartTime.length != 0 && this.endTime.length != null &&
					this.endTime.length != 0) {
					let dateBegin = new Date(this.meetingStartTime.replace(/-/g, "/")); //replace方法将-转为/
					let dateEnd = new Date(this.endTime.replace(/-/g, "/")); //replace方法将-转为/
					//如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
					// let dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
					// let dateEnd = new Date();//获取当前时间
					let dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
					let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
					let leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
					let hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
					//计算相差分钟数
					let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
					var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
					//计算相差秒数
					let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
					let seconds = Math.round(leave3 / 1000);
					this.dayDiff = dayDiff;
					this.hours = hours;
					this.minutes = minutes;
					if (seconds > 0) {
						this.seconds = 1;
					}

					console.log(" 相差 " + dayDiff + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒");
				}

				// console.log(dateDiff + "时间差的毫秒数", dayDiff + "计算出相差天数", leave1 + "计算天数后剩余的毫秒数"
				//     , hours + "计算出小时数", minutes + "计算相差分钟数", seconds + "计算相差秒数");


			},
			keyWordBlur() {
				this.sysUserSearch();
			},
			dateCancel() {
				this.dateShow = false;
			},
			dateConfirm(e) {
				this.meetingStartTime = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
				this.dateShow = false;
				this.duration();
			},
			remove(idx) {
				this.selectList.splice(idx, 1);
			},
			timeCancel() {
				this.timeShow = false;
			},
			timeConfirm(e) {
				console.log(e);
				this.beginTime = e.value;
				// moment(e.value).format();
				this.timeShow = false;
			},

			endTimeCancel() {
				this.endTimeShow = false;
			},
			endTimeConfirm(e) {
				console.log(e);
				this.endTime = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
				// moment(e.value).format();
				this.endTimeShow = false;
				this.duration();
			},
			selectOk() {
				// console.log(this.checkboxValue)
				let arr = [];
				this.checkboxValue.forEach(item => {
					arr.push(this.itemNameList[item]);
				});
				// console.log(this.selectList)
				this.selectList = this.unique(arr);
				this.closePop();
			},
			unique(arr) {
				const res = new Map();
				return arr.filter(arr => !res.has(arr.pkId) && res.set(arr.pkId, 1));
			},
			choice() {
				this.optionForm = {
					deptId: "",
					keyWord: ""
				};
				this.showPop = true;
				this.types = "全部";
				this.sysUserSearch();
			},
			sysUserSearch() {
				this.$api.sysUserSearch({ ...this.optionForm, isMaster: 0 }).then(res => {
					if (res.code == 200) {
						this.itemNameList = res.data;
						// this.checkboxValue
						this.checkboxValue = [];
						if (this.selectList.length) {
							this.itemNameList.forEach((item, index) => {
								this.selectList.forEach(e => {
									if (item.pkId == e.pkId) {
										this.checkboxValue.push(index);
									}
								});
							});
						}
						console.log(this.selectList);
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			searchEasyDeptList() {
				this.$api.searchEasyDeptList().then(res => {
					if (res.code == 200) {
						res.data.forEach(item => {
							item.label = item.deptName,
								item.value = item.pkId;
						});
						this.typeList = res.data;
						this.typeList.unshift({ label: "全部", value: "" });
						// deptId
					}
				});
			},
			selectOne2(e) {
				console.log(e);
				this.types = e.options.label;
				this.optionForm.deptId = e.options.value;
				this.sysUserSearch();
			},



			closePop() {
				this.showPop = false;
			},


			redact() {

				this.navBarTitle = "编辑会议";
			},
			// 删除确认
			confirm() {
				this.show2 = false;
				if (this.promptContent == "确定删除此会议信息？") {
					this.deleteDep();
				} else {
					this.revocation(this.form.pkId);
				}

			},
			expurgate(val) {
				if (val == 1) {
					this.promptContent = "确定删除此会议信息？";
				} else {
					this.promptContent = "确定撤回该会议的发布？";
				}
				this.show2 = true;
			},
			// 删除
			deleteDep() {
				uni.showLoading({ mask: true });
				this.$api.oaMeetingDelete({ pkId: this.form.pkId }).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						uni.showToast({ title: "删除成功" });
						setTimeout(() => {
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 2]; // 上一页面实例
							prevPage.$vm.resh(); // 调用上一页 定义的方法
							uni.navigateBack({ delta: 1 });
						}, 500);
						// uni.navigateBack({ delta: 1 });
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			// 撤回
			revocation(pkId) {
				uni.showLoading({ mask: true });
				this.$api.oaMeetingCancel({ pkId }).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						uni.showToast({ title: "撤回成功" });
						// uni.navigateBack({ delta: 1 });
						setTimeout(() => {
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 2]; // 上一页面实例
							prevPage.$vm.resh(); // 调用上一页 定义的方法
							uni.navigateBack({ delta: 1 });
						}, 500);

					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			// 详情
			oaMeetingFindById(pkId) {
				this.editStatus = false;
				this.$api.oaMeetingFindById({ pkId }).then(res => {
					if (res.code == 200) {
						console.log(res);
						this.form = res.data;
						res.data.users.forEach(item => {
							item.pkId = item.fkUserId;

						});
						this.selectList = res.data.users;
						this.meetingStartTime = res.data.meetingStartTime;
						this.endTime = res.data.meetingEndTime;
						this.editStatus = true;
						if (this.$refs.editRef != undefined) {
							this.$refs.editRef.onEditorReady();
						}

						this.duration();
					} else {
						this.editStatus = true;
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			checkboxChange(n) {
				console.log("change", n);
				this.checkboxValue1 = n;
			},
			// 富文本内容
			editorChange(val) {
				// console.log(val)
				this.form.meetingContent = val;
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
						//   this.fileList.push({
						//     enclosureName: e.name,
						//     enclosureUrl: res.data,
						//   });
						// console.log(res)
						// console.log(e)
						let data = {
							enclosureName: e.name,
							enclosureUrl: res.data,
						};
						// this.fileList =
						this.form.rotationUrl = res.data;
					}
				}
			},

			cancel() {
				uni.navigateBack();
			},
			addOk(type) {
				this.form.meetingContent = this.$refs.editRef.getText()
				if (!this.form.meetingTitle) {
					uni.showToast({ title: "请填写会议主题", icon: "none" });
				}
				if (!this.form.meetingPlace) {
					uni.showToast({ title: "请填写会议场所", icon: "none" });
				}
				if (!this.form.speaker) {
					uni.showToast({ title: "请填写主讲人", icon: "none" });
				}
				if (!this.meetingStartTime) {
					uni.showToast({ title: "请选择会议开始时间", icon: "none" });
				}
				// if (!this.beginTime) {
				//     uni.showToast({ title: "请选择会议开始时间", icon: "none" });
				// }
				if (!this.endTime) {
					uni.showToast({ title: "请选择会议结束时间", icon: "none" });
				}
				if (this.selectList.length == 0) {
					uni.showToast({ title: "请选择参加人员", icon: "none" });
				}
				let data = { ...this.form, enableStatus: type };
				data.meetingStartTime = this.meetingStartTime;
				data.meetingEndTime = this.endTime;
				data.userIds = [];
				this.selectList.forEach(item => {
					// console.log(item)
					data.userIds.push(item.pkId);

				});
				// return console.log(data)
				// if(this.checkboxValue)
				// data.publishing = this.checkboxValue1.length == 2 ? 2 : this.checkboxValue1[0];
				// console.log(this.checkboxValue1.length)
				// return console.log(this.checkboxValue1)
				// if (data.publishing == 'APP端') {
				//     data.publishing = 1
				// } else if (data.publishing == 'PC端') {
				//     data.publishing = 0
				// }
				uni.showLoading({ mask: true });
				if (this.navBarTitle != "编辑会议") {
					this.$api
						.oaMeetingAdd(data)
						.then(res => {
							uni.hideLoading();
							if (res.code === 200) {
								uni.showToast({ title: "新增成功" });
								setTimeout(() => {
									let pages = getCurrentPages();
									let prevPage = pages[pages.length - 2]; // 上一页面实例
									prevPage.$vm.resh(); // 调用上一页 定义的方法
									uni.navigateBack({ delta: 1 });
								}, 500);
							} else {
								uni.showToast({ title: res.msg, icon: "none" });
							}
						})
						.catch(err => {
							uni.hideLoading();
						});


				} else {
					delete data.users;
					delete data.userName;
					this.$api
						.oaMeetingUpdate(data)
						.then(res => {
							uni.hideLoading();
							if (res.code === 200) {
								uni.showToast({ title: "编辑成功" });
								setTimeout(() => {
									let pages = getCurrentPages();
									let prevPage = pages[pages.length - 2]; // 上一页面实例
									prevPage.$vm.resh(); // 调用上一页 定义的方法
									uni.navigateBack({ delta: 1 });
								}, 500);
							} else {
								uni.showToast({ title: res.msg, icon: "none" });
							}
						})
						.catch(err => {
							uni.hideLoading();
						});
				}
			},
			delSub(row, idx) {
				console.log(row, idx);
				this.subList = this.subList.filter(item => item.pkId !== row.pkId);
			},
			openPicker() {
				if (this.navBarTitle == "会议信息") {
					return;
				}
				this.pickerShow = true;
			},
			pickerConfirm(e) {
				console.log(e);
				if (e.value && e.value[0]) {
					console.log(e.value[0]);
					this.cusTypeName = e.value[0].name;
					this.form.noticeType = e.value[0].id;
				}

				this.pickerShow = false;
			},
			pickerCancel() {
				this.pickerShow = false;
			},

		},
	};
</script>

<style lang="scss" scoped>
	.content {
		padding-top: 20rpx;
		font-size: 28rpx;
		background-color: #fff;
	}

	.title {
		padding-left: 20rpx;
		font-size: 28rpx;
		font-weight: 600;
		margin: 10rpx 0;
	}

	.calendar-icon {
		width: 12px;
		height: 6px;
		opacity: 1;
		border-radius: 1px;

	}

	.textarea {
		width: 355px;
		height: 260px;
		opacity: 1;
		border-radius: 2px;
		background: rgba(249, 249, 255, 1);

		border: 1px solid rgba(221, 226, 240, 1);
		margin: 15px auto;
		/deep/ table{
		  border: -1px solid #ccc;
		  border-collapse: collapse;
		  th,td{
			border: 1px solid #ccc;
		  }
		}
		 table td{
		  padding: 0px 5px;
		}

	}





	.inputs-item-1 {
		text-indent: .8em;
	}

	.inputs {
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		margin-bottom: 20rpx;
		width: 355px;
		height: 50px;
		opacity: 1;
		border-radius: 2px;
		background: rgba(249, 249, 255, 1);
		border: 1px solid rgba(221, 226, 240, 1);
		margin: 10px auto;

		.inputs-item {
			flex: 1;
			height: 25px;
			line-height: 25px;
			display: flex;
			align-items: center;
			margin-left: -5px;

		}
	}

	.participant {

		padding: 0 20rpx;
		display: flex;
		flex-wrap: wrap;
		overflow: auto;
		// background: rgba(249, 249, 255, 1);
		width: 355px;
		height: 80px;
		opacity: 1;
		border-radius: 2px;
		background: rgba(249, 249, 255, 1);
		border: 1px solid rgba(221, 226, 240, 1);
		margin: 15px auto;

		.participant-item {
			position: relative;
			// background: #f3f3f3;
			margin: 3px;
			padding: 0px 10px;
			// line-height: 22px;
			// height: 22px;
			// display: inline-block;
			// padding-right: 18px;

			width: 90px;
			height: 30px;
			opacity: 1;
			border-radius: 2px;
			background: rgba(255, 255, 255, 1);
			display: flex;
			align-items: center;
			color: rgba(32, 52, 87, 1);

			.ico-close {
				position: absolute;
				right: 5px;
				top: 7px;

			}
		}
	}

	.select {
		justify-content: space-between;
	}

	.subList {
		overflow: auto;
		max-height: 350rpx;
		background-color: #fff;

		.subList-item {
			display: flex;
			justify-content: space-around;
			height: 80rpx;
			padding: 0 20rpx;
			// border-bottom: 1px solid #eee;

			.name {
				width: 580rpx;
				height: 80rpx;
				line-height: 80rpx;
				overflow: hidden;
				/*超出部分隐藏*/
				white-space: nowrap;
				/*禁⽌换⾏*/
				text-overflow: ellipsis;
				/*省略号*/
			}
		}
	}





	.footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		display: flex;
		height: 100rpx;



		.footerBtn {
			width: 375rpx;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
		}

		.footerBtnOne {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
		}

		.cancel {
			background-color: #eeeeee;
			color: #aaaaaa;
		}

		.add {
			width: 135px;
			height: 60px;
			opacity: 1;

			background: rgba(67, 207, 124, 1);
			color: #fff;
		}

		.adds {
			width: 240px;
			height: 60px;
			opacity: 1;
			background: rgba(21, 118, 230, 1);
			color: #fff;
		}

		.error {
			width: 240px;
			height: 60px;
			background-color: red;
			color: #fff;
		}

		.errors {

			background-color: red;
			color: #fff;
		}

	}

	.popup {
		background: #fff;
		padding-top: 6px;

		.popup-search {
			display: flex;
			// display: flex;
			align-items: center;
			height: 80rpx;
			padding-top: 20px;
			// background: #fff !important;
			// padding-top: 20px !important;

			.search-item {
				flex: 1;
				padding: 0 10rpx;

				// background-color: #fff;
				/deep/ .u-input--square {
					padding: 3px 8px !important;

				}

				.footerBtnOne {
					width: 100rpx;
					height: 55rpx;
					line-height: 55rpx;
					text-align: center;
					background-color: #1576e6;
					color: #fff;
					border-radius: 5px;
				}
			}

			.easySelect {
				/deep/.uni-input-wrapper {
					.uni-input-input {
						font-size: 28rpx;

					}
				}
			}
		}

		.table_detail {
			margin-top: 10px !important;
		}
	}

	.choice {

		width: 80px;
		height: 30px;
		opacity: 1;
		border-radius: 4px;
		background: rgba(255, 255, 255, 1);
		text-align: center;
		line-height: 30px;
		font-size: 14px;
		font-weight: 500;
		color: rgba(43, 143, 237, 1);
		margin: 3px;

	}

	/deep/ ._root {
		padding-left: 12px !important;
		padding-right: 12px !important;

	}
</style>