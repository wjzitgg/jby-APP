<template>
	<view class="wrapper">
		<u-navbar :leftText="navBarTitle" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="content">
			<view class="content-wen">
				<view class="content-title">
					<view class="title">文章标题</view>
					<view class="choice" v-if="navBarTitle != '发文信息'" @click="cite">引用文章</view>
				</view>

				<view class="inputs">
					<u-input placeholder="请输入" v-model="form.articleTitle" :disabled="navBarTitle == '发文信息'" border="none"
						maxlength="100" clearable></u-input>
				</view>
			</view>

			<view>
				<view class="title">发送类型</view>
				<view class="inputs select" @click="openPicker">
					<view class="name">{{ cusTypeName }}</view>
					<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
				</view>
			</view>
			<!-- <view>
                <view class="title">会议场所</view>
                <view class="inputs">
                    <u-input v-model="form.meetingPlace" :disabled="navBarTitle == '发文信息'" border="none"
                        clearable></u-input>
                </view>
            </view>
            <view>
                <view class="title">会议主讲人</view>
                <view class="inputs">
                    <u-input v-model="form.speaker" :disabled="navBarTitle == '发文信息'" border="none" clearable></u-input>
                </view>
            </view>
            <view>
                <view class="title">会议时间</view>
                <view class="inputs" style="display: flex;">
                    <view class="inputs-item" @click="dateShow = true">
                        <u-icon name="calendar" style="display: inline-block;"></u-icon>
                        {{ meetingStartTime }}
                    </view>
                    至
                    <view class="inputs-item" @click="endTimeShow = true">
                        <u-icon name="calendar" style="display: inline-block;"></u-icon>
                        {{ endTime }}
                    </view>
                </view>
            </view> -->
			<view>
				<view class="title" v-if="form.sendingType === 0">参加单位 </view>
				<view class="title" v-if="form.sendingType === 1">参加人员 </view>

				<view class="participant" v-if="form.sendingType === 0">
					<view class="participant-item" v-for="(item, idx) in selectList" :key="idx">{{ item.customName }}
						<u-icon v-if="navBarTitle != '发文信息'" name="close" class="ico-close" style="" color="#ddd"
							@click="remove(idx)"></u-icon>
					</view>
					<view class="choice-1" v-if="navBarTitle != '发文信息'" @click="choice">选择</view>
				</view>
				<view class="participant" v-if="form.sendingType === 1">
					<view class="participant-item" v-for="(item, idx) in selectList" :key="idx">{{ item.userName }}
						<u-icon name="close" class="ico-close" style="" v-if="navBarTitle != '发文信息'" color="red"
							@click="remove(idx)"></u-icon>
					</view>
					<view class="choice-1" v-if="navBarTitle != '发文信息'" @click="choice2">选择</view>
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
                    <u-checkbox-group v-model="checkboxValue1" :disabled="navBarTitle == '发文信息'" placement="column"
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
                    <u-textarea v-model="form.noticeAbstract" :disabled="navBarTitle == '发文信息'" placeholder="请输入内容"
                        border="none"></u-textarea>
                </view>
            </view> -->
			<view>
				<view class="title" style="line-height: 20px">附件</view>

				<view class="upload-con">
					<u-cell-group style="background: #fff">
						<u-cell v-for="(item, idx) in fileList" :key="idx" @click.stop="fileListPreview(item)"
							:title="item.enclosureName" arrow-direction="left">
							<u-icon slot="icon" name="file-text"></u-icon>
							<u-icon v-if="navBarTitle != '发文信息'" slot="right-icon" name="trash"
								@click.stop="delFile(item, idx)"></u-icon>
						</u-cell>
					</u-cell-group>

					<view class="form-content" v-if="navBarTitle != '发文信息'">
						<lsj-upload class="upload-btn1" ref="lsjUpload1" childId="upload2" :width="width" :option="option"
							:size="size" :formats="formats" :debug="debug" :count="10" :nowCount="fileList.length"
							:instantly="instantly" @change="onChange" @progress="onprogress"
							style="margin-top: 10px; margin-left: 15px" @uploadEnd="onuploadEnd" v-show="showPop == false">
							<view class="upload-btn" style="color: #2b8fed"> 添加 </view>
						</lsj-upload>
					</view>
				</view>
			</view>
			<view>
				<view class="title">会议内容</view>
				<view class="textarea-hui">
					<u-parse v-if="navBarTitle == '发文信息'" :content="form.articleContent"></u-parse>
					<!-- <edit v-else style="" :value="form.articleContent" ref="editRef" @editorChange="editorChange"></edit> -->
					<editors v-else style="" :content="form.articleContent" ref="editRef"></editors>
				</view>
			</view>
			<!-- <view v-if="navBarTitle == '发文信息'"
                style="position: absolute;top:0;width:100%;height:110%;background: #f3f3f3;background: rgba(0,0,0,.0);">
            </view> -->
		</view>
		<view class="pdb"></view>
		<view class="footers">
			<view v-if="type == 0 || navBarTitle == '编辑文章'" class="footerBtn add" style="margin-right: 0px" @click="addOk(0)">
				保存草稿</view>
			<view v-if="type == 0 || navBarTitle == '编辑文章'" class="footerBtn adds" style="margin-left: 0px" @click="addOk(1)">
				发布</view>
			<view v-if="$auth('assess:receive:update')&&type == 1 && enableStatus == 0 && navBarTitle != '编辑文章'" class="footerBtn adds"
				style="margin-right: 0px" @click="redact">编辑
			</view>
			<view v-if="$auth('assess:receive:delete')&&type == 1 && enableStatus == 0 && navBarTitle != '编辑文章'" class="footerBtn error"
				style="margin-left: 0px" @click="expurgate(1)">删除</view>
			<view v-if="$auth('assess:receive:withdraw')&&type == 1 && enableStatus == 1" class="footerBtnOne error" style="margin-left: 0px"
				@click="expurgate(2)">撤回</view>
		</view>
		<u-picker title="请选择文章类型" :show="pickerShow" :columns="[cusTypeList]" keyName="name" @confirm="pickerConfirm"
			@cancel="pickerCancel"></u-picker>
		<u-modal :show="show2" title="提示" :content="promptContent" showCancelButton @cancel="show2 = false"
			@confirm="confirm"></u-modal>

		<u-popup :show="showPop" @close="closePop" mode="bottom" class="opo">
			<view class="popup">
				<view class="popup-search" style="padding-top:10px">
					<view class="search-item">
						<easy-select ref="easySelect2" size="mini" class="easySelect" :value="types" @selectOne="selectOne4"
							:options="typeLists"></easy-select>
					</view>
					<view class="search-item">
						<u-input v-model="orgName" @blur="keyWordBlurs" placeholder="单位名称" clearable></u-input>
					</view>
					<!-- <view class="pup-title">合作单位</view> -->
					<view class="search-item">
						<view class="footerBtnOne" style="position: absolute; right: 6px; top: 16px" @click="selectOk">确定
						</view>
					</view>
				</view>
				<view class="popup-content">
					<u-checkbox-group v-model="checkboxValue" placement="column">
						<view class="table_detail" style="margin-top: 2px">
							<table>
								<thead>
									<tr>
										<th style="width: 40px">选择</th>
										<th>序号</th>
										<th>单位名称</th>
										<th>联系人</th>
										<th>联系电话</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(item, index) in itemNameList" :key="index">
										<td>
											<u-checkbox style="margin-left: 10px" :label="''" :name="index"></u-checkbox>
										</td>
										<td>{{ index + 1 }}</td>
										<td>{{ item.customName }}</td>
										<td>{{ item.linkMan }}</td>
										<td>{{ item.linkPhone }}</td>
									</tr>
									<view v-if="itemNameList.length == 0" style="height: 60px"></view>
								</tbody>
							</table>
						</view>
					</u-checkbox-group>
				</view>
			</view>
		</u-popup>
		<u-popup :show="showPop2" @close="closePop2" mode="bottom" class="opo">
			<view class="popup">
				<view class="popup-search">
					<view class="search-item">
						<easy-select ref="easySelect2" size="mini" class="easySelect" :value="types" @selectOne="selectOne3"
							:options="typeList"></easy-select>
					</view>
					<view class="search-item">
						<u-input v-model="optionForm.keyWord" @blur="keyWordBlur" placeholder="员工姓名/手机" clearable></u-input>
					</view>
					<view class="search-item">
						<view class="footerBtnOne" @click="selectOk2">确定</view>
					</view>
				</view>
				<u-checkbox-group v-model="checkboxValue" placement="column">
					<view class="table_detail" style="margin-top: 2px">
						<table>
							<thead>
								<tr>
									<th style="width: 40px">选择</th>
									<th>员工姓名</th>
									<th>所属部分</th>
									<th>手机号码</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in itemNameList" :key="index">
									<td>
										<u-checkbox style="margin-left: 10px" :label="''" :name="index"></u-checkbox>
									</td>
									<td>{{ item.userName }}</td>
									<td>{{ item.deptName }}</td>
									<td>{{ item.telephone }}</td>
								</tr>
								<view v-if="itemNameList.length == 0" style="height: 60px"></view>
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
		<!-- 引用文章 -->
		<u-popup :show="citeShowPop" @close="citeClosePop" mode="bottom" class="opo">
			<view class="popup">
				<view class="popup-search">
					<view class="search-item">
						<easy-select ref="easySelect2" size="mini" class="easySelect" :value="types" @selectOne="selectOne2"
							:options="citeTypeList"></easy-select>
					</view>
					<view class="search-item">
						<!-- <u-input v-model="optionForm.keyWord" @blur="keyWordBlur" placeholder="员工姓名/手机" clearable></u-input> -->
					</view>
					<view class="search-item">
						<view class="footerBtnOne" style="margin-left: 55px" @click="selectOk">确定</view>
					</view>
				</view>
				<!-- <u-checkbox-group v-model="checkboxValue" placement="column"> -->
				<view class="table_detail" style="margin-top: 2px">
					<table>
						<thead>
							<tr>
								<th style="width: 50px">选择</th>
								<th>文章标题</th>
								<th>发布人</th>
								<th>发布日期</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in citeDataList" :key="index">
								<td>
									<view class="choice" @click="selectFare(item)">选择</view>
								</td>
								<td>{{ item.articleTitle }}</td>
								<td>{{ item.userName }}</td>
								<td>{{ item.sendingTime }}</td>
							</tr>
							<view v-if="citeDataList.length == 0" style="height: 60px"></view>
						</tbody>
					</table>
				</view>
				<!-- </u-checkbox-group> -->
			</view>
		</u-popup>

		<prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop>
	</view>
</template>

<script>
	import request from "@/common/request";
	import edit from "@/components/xia-editor/xia-editor/xia-editor";
	import editors from "@/components/editors/editors";
	import prviewPop from "../../components/prview-pop/prview-pop.vue";
	import moment from "moment";
	export default {
		components: { edit, prviewPop,editors },
		onLoad(options) {
			this.searchEasyDeptList();
			this.type = options.type;
			if (options.type == 0) {
				this.navBarTitle = "新增发文";
				this.cusTypeName = "外部发文";
				this.form.sendingType = 0;
			} else if (options.type == 1) {
				this.navBarTitle = "发文信息";
				this.obj = JSON.parse(options.obj);
				this.enableStatus = this.obj.enableStatus;
				this.oaMeetingFindById(this.obj.pkId);
			}
		},
		data() {
			return {
				form: {
					articleTitle: "",
					articleContent: "",
				},
				citeShowPop: false,
				citeTypeList: [
					{ label: "公司新闻", value: "0" },
					{ label: "公司公告", value: "1" },
					{ label: "公司会议", value: "2" },
				],
				citeDataList: [],

				showPop: false,
				showPop2: false,
				typeList: [],
				// typeVal: "",
				types: "",
				itemNameList: [],
				checkboxValue: [],
				selectList: [],
				dateShow: false,
				value1: "",
				meetingStartTime: "",
				timeShow: false,
				value2: "",
				beginTime: "",
				endTimeShow: false,
				value3: "",
				endTime: "",
				type: "",

				optionForm: {
					deptId: "",
					keyWord: "",
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
				width: "190rpx",
				height: "40rpx",
				// 限制允许上传的格式，空串=不限制，默认为空
				formats: "",
				// 文件上传大小限制
				size: 30,
				// 是否打印日志
				debug: false,
				// ================

				navBarTitle: "编辑文章",
				subList: [],
				tiltetype: "2",

				cusTypeList: [
					{ id: 0, name: "外部发文" },
					{ id: 1, name: "内部发文" },
				],

				pickerShow: false,
				cusTypeName: "",

				subSelShow: false,
				obj: {},
				previewShow: false,
				previewUrl: "",
				showPop2: false,
				typeLists: [],
				orgName: ""
			};
		},
		methods: {
			choice2() {
				this.optionForm = {
					deptId: "",
					keyWord: "",
				};
				this.showPop2 = true;
				this.types = "全部";
				this.optionForm.deptId = "";
				this.sysUserSearch2();
			},
			sysUserSearch2() {

				this.$api
					.sysUserSearch({ ...this.optionForm, isMaster: 0 })
					.then(res => {
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
			selectOk2() {
				let arr = [];
				this.checkboxValue.forEach(item => {
					arr.push(this.itemNameList[item]);
				});
				this.selectList = this.unique(arr);
				this.closePop2();
			},
			unique2(arr) {
				const res = new Map();
				return arr.filter(arr => !res.has(arr.pkId) && res.set(arr.pkId, 1));
			},
			fileListPreview(row) {
				this.$checkName(row.enclosureUrl);
				return;
				this.previewUrl = row.enclosureUrl;
				this.previewShow = true;
			},
			closePre() {
				this.previewShow = false;
			},
			delFile(row, index) {
				this.fileList.splice(index, 1);
				this.$refs.lsjUpload1.clear(row.enclosureName);
			},
			cite() {
				this.types = "公司新闻";
				this.optionForm.deptId = "0";
				this.citeShowPop = true;
				this.oaArticleQuoteArticle();
			},
			oaArticleQuoteArticle() {
				let data = {
					pageNum: 1,
					pageSize: 10,
					type: this.optionForm.deptId,
				};
				this.$api.oaArticleQuoteArticle(data).then(res => {
					if (res.code == 200) {
						this.citeDataList = res.data.records;
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			keyWordBlur() {
				this.sysUserSearch2();
			},
			dateCancel() {
				this.dateShow = false;
			},
			dateConfirm(e) {
				this.meetingStartTime = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
				this.dateShow = false;
			},
			remove(idx) {
				console.log(this.checkboxValue);
				console.log(this.selectList);
				this.selectList.splice(idx, 1);
				this.checkboxValue.splice(idx, 1);
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
			},
			selectOk() {
				let arr = [];
				this.checkboxValue.forEach(item => {
					// this.selectList.push(this.itemNameList[item])
					arr.push(this.itemNameList[item]);
				});
				// console.log(this.selectList)
				// this.selectList = this.unique(this.selectList)
				this.selectList = this.unique(arr);
				this.closePop();
			},
			unique(arr) {
				const res = new Map();
				return arr.filter(arr => !res.has(arr.pkId) && res.set(arr.pkId, 1));
			},
			choice() {
				// this.optionForm = {
				//     deptId: "",
				//     keyWord: ""
				// }
				this.searchCompanyRole();
				this.types = "全部";
				this.optionForm.deptId = "";
				this.orgName = "";
				this.showPop = true;
				this.sysUserSearch();
			},
			sysUserSearch() {
				this.$api
					.cooperationCompany({ pageNum: 1, pageSize: 100000, type: this.optionForm.deptId, orgName: this.orgName })
					.then(res => {
						if (res.code == 200) {
							this.itemNameList = res.data.records;
							if (this.selectList.length) {
								this.checkboxValue = [];
								this.itemNameList.forEach((item, index) => {
									this.selectList.forEach(e => {
										if (item.pkId == e.pkId) {
											this.checkboxValue.push(index);
										}
									});
								});
							}
						} else {
							uni.showToast({ title: res.msg, icon: "none" });
						}
					});
			},
			searchEasyDeptList() {
				this.$api.searchEasyDeptList().then(res => {
					if (res.code == 200) {
						res.data.forEach(item => {
							// (item.label = item.companyName), (item.value = item.type);
							(item.label = item.deptName), (item.value = item.pkId);
						});
						// res.data.unshift({label:"全部",value:""})
						this.typeList = res.data;

					}
				});
			},
			searchCompanyRole() {
				this.$api.searchCompanyRole().then(res => {
					if (res.code == 200) {
						res.data.forEach(item => {
							(item.label = item.companyName), (item.value = item.type);
						});
						res.data.unshift({ label: "全部", value: "" });
						this.typeLists = res.data;

					}
				});
			},
			selectOne2(e) {
				console.log(e);
				this.types = e.options.label;
				this.optionForm.deptId = e.options.value;
				// this.sysUserSearch()
				this.oaArticleQuoteArticle();
			},
			selectOne4(e) {
				this.types = e.options.label;
				this.optionForm.deptId = e.options.value;
				this.sysUserSearch();
			},
			keyWordBlurs() {
				this.sysUserSearch();
			},
			selectOne3(e) {
				console.log(e);
				this.types = e.options.label;
				this.optionForm.deptId = e.options.value;
				this.sysUserSearch2();
			},

			closePop() {
				this.showPop = false;
			},
			closePop2() {
				this.showPop2 = false;
			},
			citeClosePop() {
				this.citeShowPop = false;
			},
			selectFare(row) {
				console.log(row);
				this.form = row;
				this.form.articleContent = row.articleContent;
				// this.$refs.editRef.onEditorReady()
				let title = this.navBarTitle;
				this.navBarTitle = "";
				this.navBarTitle = title;
				this.cusTypeName = "外部发文";
				this.form.sendingType = 0;
				this.citeClosePop();
				//
				this.$nextTick(() => {
					//
					this.$refs.editRef.onEditorReady();
				});
			},
			redact() {
				this.navBarTitle = "编辑文章";
			},
			// 删除确认
			confirm() {
				this.show2 = false;
				if (this.promptContent == "确定删除此发文信息？") {
					this.deleteDep();
				} else {
					this.revocation(this.form.pkId);
				}
			},
			expurgate(val) {
				if (val == 1) {
					this.promptContent = "确定删除此发文信息？";
				} else {
					this.promptContent = "确定撤回该会议的发布？";
				}
				this.show2 = true;
			},
			// 删除
			deleteDep() {
				this.$api.oaArticleDelete({ pkId: this.form.pkId }).then(res => {
					if (res.code == 200) {
						uni.showToast({ title: "删除成功" });
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
			// 撤回
			revocation(pkId) {
				this.$api.withdrawOaArticle({ pkId }).then(res => {
					if (res.code == 200) {
						uni.showToast({ title: "撤回成功" });
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
				this.$api.oaArticleFindById({ pkId }).then(res => {
					if (res.code == 200) {
						console.log(res);
						this.form = res.data;
						let arr = [];

						if (
							res.data.articleReceives != null &&
							res.data.articleReceives.length
						) {
							res.data.articleReceives.forEach(item => {
								item.pkId = item.fkOrgId;
								// item.fkOrgId = item.fkUserId
								item.customName = item.customerName;
							});
							arr = res.data.articleReceives;
						}

						if (res.data.users != null && res.data.users.length) {
							res.data.users.forEach(item => {
								item.pkId = item.fkUserId;
								// item.fkOrgId = item.fkUserId
								item.customName = item.userName;
							});
							arr = res.data.users;
						}
						this.cusTypeName = this.cusTypeList.filter(
							item => item.id == this.form.sendingType
						)[0].name;
						this.selectList = arr;
						this.fileList =
							res.data.enclosures == null ? [] : res.data.enclosures;
						// this.meetingStartTime=   res.data.meetingStartTime
						// this.endTime= res.data.meetingEndTime ;
						// this.$nextTick(()=>{
						if (this.$refs.editRef != undefined) {
							this.$refs.editRef.onEditorReady();
						}

						// })
					} else {
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
				this.form.articleContent = val;
			},

			onChange(e) {
				console.log("改变事件", e);
			},
			onprogress(e) {
				console.log("中途事件", e);
			},

			onuploadEnd(e) {
				if (e.responseText) {
					let res = JSON.parse(e.responseText);
					if (res.code === 200) {
						this.fileList.push({
							enclosureName: e.name,
							enclosureUrl: res.data,
						});
					}
				}
				// console.log(this.fileList);
			},

			cancel() {
				uni.navigateBack();
			},
			addOk(type) {
				this.form.articleContent = this.$refs.editRef.getText()
				if (!this.form.articleTitle) {
					uni.showToast({ title: "请填写文章主题", icon: "none" });
				}
				if (!this.form.articleContent) {
					uni.showToast({ title: "请填写文章内容", icon: "none" });
				}

				if (this.selectList.length == 0) {
					uni.showToast({ title: "请选择接收单位", icon: "none" });
				}
				let data = {};
				data.articleReceives = [];
				data.userIds = [];
				this.selectList.forEach(item => {
					if (this.form.sendingType == 0) {
						data.articleReceives.push({
							fkOrgId: item.pkId,
							customerName: item.customName,
						});
					} else {
						data.userIds.push(item.pkId);
					}
				});
				data.articleContent = this.form.articleContent;
				data.articleTitle = this.form.articleTitle;
				data.enableStatus = type;
				data.enclosures = this.fileList;
				data.sendingType = this.form.sendingType;
				// this.fileList.push({
				//             enclosureName: e.name,
				//             enclosureUrl: res.data,
				//         });
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
				if (this.navBarTitle != "编辑文章") {
					this.$api
						.oaArticleAdd(data)
						.then(res => {
							uni.hideLoading();
							if (res.code === 200) {
								uni.showToast({ title: "新增成功" });
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 2]; // 上一页面实例
								prevPage.$vm.resh(); // 调用上一页 定义的方法
								uni.navigateBack({ delta: 1 });
							} else {
								uni.showToast({ title: res.msg, icon: "none" });
							}
						})
						.catch(err => {
							uni.hideLoading();
						});
				} else {
					// delete data.users;
					// delete data.userName;
					data.pkId = this.obj.pkId;
					this.$api
						.oaArticleUpdate(data)
						.then(res => {
							uni.hideLoading();
							if (res.code === 200) {
								uni.showToast({ title: "编辑成功" });
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 2]; // 上一页面实例
								prevPage.$vm.resh(); // 调用上一页 定义的方法
								uni.navigateBack({ delta: 1 });
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
				if (this.navBarTitle == "发文信息") {
					return;
				}
				this.pickerShow = true;
			},
			pickerConfirm(e) {
				console.log(e);
				if (e.value && e.value[0]) {
					console.log(e.value[0]);
					if (e.value[0].id != this.form.sendingType) {
						this.checkboxValue = [];
						this.selectList = [];
					}
					this.cusTypeName = e.value[0].name;
					this.form.sendingType = e.value[0].id;
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
.wrapper{
	position: relative;
}
	.content {
		padding-top: 20rpx;
		font-size: 28rpx;
		background-color: #fff;
	}

	.content-wen {
		display: flex;
		flex-direction: column;
	}

	.content-title {
		display: flex;
		justify-content: space-between;
	}

	.textarea-hui {
		width: 355px;
		height: 229px;
		opacity: 1;
		border-radius: 2px;
		background: rgba(249, 249, 255, 1);

		border: 1px solid rgba(221, 226, 240, 1);

		margin: 15px auto;
		height: auto;
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

	.upload-btn {
		width: 70px;
		height: 24px;
		border-radius: 2px;
		text-align: center;
		padding: 3px 0;
		border: 1px solid rgba(221, 226, 240, 1);

		box-sizing: border-box;
		background: #fff;
	}

	.upload-btn1 {
		width: 100px;
		height: 30px;
		border-radius: 2px;
		text-align: center;
		font-size: 14px;
		padding: 3px 0;
	}

	.title {
		padding-left: 20rpx;
		font-size: 28rpx;
		font-weight: 600;
		margin: 10rpx 0;
	}

	.upload-con {
		width: 355px;
		height: 100px;
		height: auto;
		opacity: 1;
		border-radius: 2px;
		background: rgba(249, 249, 255, 1);
		border: 1px solid rgba(221, 226, 240, 1);
		margin: 15px auto;
	}

	.inputs {
		display: flex;
		align-items: center;
		height: 80rpx;
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
			border: 1px solid #eee;
			line-height: 25px;
		}
	}

	.participant {
		padding: 0 20rpx;
		display: flex;
		flex-wrap: wrap;
		overflow: auto;

		width: 355px;
		height: 0px auto;
		opacity: 1;
		border-radius: 2px;
		background: rgba(249, 249, 255, 1);

		border: 1px solid rgba(221, 226, 240, 1);
		margin: 15px auto;

		.participant-item {
			position: relative;
			background: #f3f3f3;
			margin: 2px;
			// padding: 8px 15px;
			// line-height: 22px;
			// height: 22px;
			display: flex;
			display: inline-block;
			padding-right: 18px;
			width: 100%;
			height: 40px;
			opacity: 1;
			border-radius: 2px;
			background: rgba(249, 249, 255, 1);
			align-items: center;
			line-height: 40px;
			border-bottom: solid 1px #ddd;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			.ico-close {
				position: absolute;
				right: 10px;
				top: 12px;
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
			border-bottom: 1px solid #eee;

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

	.pdb {
		height: 100rpx;
		background-color: #fff;
	}

	.footers {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		display: flex;
		width: 750rpx;
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
			width: 270rpx;
			height: 120rpx;
			opacity: 1;
			background: rgba(67, 207, 124, 1);
			font-size: 16px;
			font-weight: 500;
			letter-spacing: 0px;

			color: rgba(255, 255, 255, 1);
			text-align: center;
		}

		.adds {
			width: 480rpx;
			height: 120rpx;
			opacity: 1;
			background: rgba(21, 118, 230, 1);
			font-size: 16px;
			font-weight: 500;
			letter-spacing: 0px;
			color: rgba(255, 255, 255, 1);
			text-align: center;
		}

		.error {
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

		.popup-content {
			max-height: 70vh;
			overflow: auto;
		}

		.table_detail {
			margin-top: 10px !important;
		}
	}

	.choice {
		width: 80px;
		height: 24px;
		opacity: 1;
		border-radius: 2px;
		background: rgba(255, 255, 255, 1);
		border: 1px solid rgba(221, 226, 240, 1);
		font-size: 12px;
		font-weight: 500;
		color: rgba(43, 143, 237, 1);
		text-align: center;
		line-height: 24px;
		margin-right: 10px;
	}

	.choice-1 {
		width: 70px;
		height: 24px;
		opacity: 1;
		border-radius: 2px;
		background: rgba(255, 255, 255, 1);
		border: 1px solid rgba(221, 226, 240, 1);
		font-size: 12px;
		font-weight: 500;
		color: rgba(43, 143, 237, 1);
		text-align: center;
		line-height: 24px;
		margin-right: 10px;
		margin: 13px 0;
	}

	.form-content {
		height: 100rpx;
	}

	/deep/ ._root {
		padding-left: 12px !important;
		padding-right: 12px !important;
	}

	.pup-title {
		position: absolute;
		top: 50rpx;
		left: 12rpx;
		font-weight: 800;
	}

	.opo {
		z-index: 999999999999;
	}
</style>