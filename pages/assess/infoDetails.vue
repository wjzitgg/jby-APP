<template>
	<view class="wrapper">
		<u-navbar :leftText="navBarTitle" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="content">
			<view class="content-index">
				<view class="content-index-tu">
					<view class="title">文章首图 </view>
					<view class="textarea" style="position: relative;background: #fff;padding:10px 10px;">

						<u-checkbox-group v-model="checkboxValue1" :disabled="navBarTitle == '文章信息'" @change="checkboxChange">
							<!-- <u-checkbox :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in checkboxList1"
                            :key="index" :label="item.name" :name="item.name">
                        </u-checkbox> -->
							<u-checkbox label="首页轮播" :name='1'></u-checkbox>

						</u-checkbox-group>


					</view>

				</view>
				<view class="textarea-s">

					<view class="textarea-w" style="position: relative;">
						<view v-if="form.rotationUrl !== ''">
							<image :src="form.rotationUrl" mode="scaleToFill"></image>
							<u-icon name="trash-fill" class="icons delete-icon" v-if="navBarTitle != '文章信息'" @click="deleteImg"
								color="#cccccc" size="26"></u-icon>
						</view>
						<view v-else class="plus">
							<!-- <u-icon name="plus" color="#ccc" style="margin-left: 50px" size="20px"></u-icon> -->
							<!-- :width="width" :height="height"  -->
							<lsj-upload ref="lsjUpload1" childId="upload2" :option="option" :size="size" :formats="formats"
								:debug="debug" :count="10" :nowCount="fileList.length" :instantly="instantly" @change="onChange"
								@progress="onprogress" accept="image/jpg,image/jpeg,image/png" style="margin-top: 10px; padding:6px"
								@uploadEnd="onuploadEnd">
								<!-- <u-icon name="photo-fill" color="#2979ff" size="60"></u-icon> -->
								<u-icon name="plus" color="#2979ff" size="26" class="plus"></u-icon>
								<!-- <view class="upload-btn" :style="{ width: width, height: height }">APP首页轮播图</view> -->
							</lsj-upload>
						</view>
					</view>
				</view>



			</view>

			<view class="textarea-title top-60">
				<view class="title">文章标题</view>
				<view class="inputs">
					<u-input placeholder="请输入" v-model="form.noticeTitle" :disabled="navBarTitle == '文章信息'" border="none"
						clearable maxlength="100"></u-input>
				</view>
			</view>

			<view>
				<view class="title">文章类型</view>
				<view class="inputs select" @click="openPicker">


					<view class="name"> {{ cusTypeName }}</view>
					<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
				</view>
			</view>

			<!-- <view>
                <view class="title">APP轮播</view>
              
            </view> -->

			<view>
				<view class="title">文章摘要</view>
				<view>
					<u-textarea class="textarea-wen" v-model="form.noticeAbstract" :disabled="navBarTitle == '文章信息'"
						maxlength="800" placeholder="请输入" border="none"></u-textarea>
				</view>
			</view>
			<view v-if="navBarTitle == '文章信息'">
				<view class="title">文章状态：</view>
				<view class="inputs">
					<view v-if="enableStatus == 0">草稿</view>
					<view v-if="enableStatus == 1">已发布</view>
				</view>
			</view>
			<view>
				<view class="title">文章内容</view>
				<view class="textarea-1" style="position: relative;">
					<u-parse style="padding: 20px 5px;" v-if="navBarTitle == '文章信息'" :content="form.noticeContent"></u-parse>
					<!-- <edit v-if="editStatus && navBarTitle != '文章信息'" :value="form.noticeContent" ref="editRef"
						@editorChange="editorChange"></edit> -->
					<editors v-if="editStatus && navBarTitle != '文章信息'" :content="form.noticeContent" ref="editRef"></editors>
					<!-- <view v-if="navBarTitle == '文章信息'"
                        style="position: absolute;top:0;width:100%;height:100%;background: #f3f3f3;background: rgba(0,0,0,.1);">
                    </view> -->
				</view>
			</view>
		</view>
		<view class="pdb"></view>
		<view class="footer">
			<view v-if="type == 0 || navBarTitle == '编辑文章'" class="footerBtn add" style="margin-right: 0px;"
				@click="addOk(0)">保存草稿</view>
			<view v-if="type == 0 || navBarTitle == '编辑文章'" class="footerBtn adds" style="margin-left: 0px;"
				@click="addOk(1)">发布</view>
			<view v-if="$auth('assess:info:update')&&type == 1 && enableStatus == 0 && navBarTitle != '编辑文章'"
				class="footerBtn add" style="margin-right: 1px;" @click="redact">编辑 </view>
			<view v-if="$auth('assess:info:delete')&&type == 1 && enableStatus == 0 && navBarTitle != '编辑文章'"
				class="footerBtn error" style="margin-left: 1px;" @click="expurgate(1)">删除</view>
			<view v-if="$auth('assess:info:withdraw')&&type == 1 && enableStatus == 1" class="footerBtnOne error"
				style="margin-left: 1px;" @click="expurgate(2)">撤回</view>
		</view>
		<u-picker title="请选择文章类型" :show="pickerShow" :columns="[cusTypeList]" keyName="name" @confirm="pickerConfirm"
			@cancel="pickerCancel"></u-picker>
		<u-modal :show="show2" title="提示" :content="promptContent" showCancelButton @cancel="show2 = false"
			@confirm="confirm"></u-modal>
	</view>
</template>

<script>
	import request from "@/common/request";
	import edit from "@/components/xia-editor/xia-editor/xia-editor";
	import editors from "@/components/editors/editors";
	export default {
		components: { edit, editors },
		onLoad(options) {
			console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
			console.log(options);
			console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
			this.type = options.type;
			if (options.type == 0) {
				this.navBarTitle = "新增文章";
			} else if (options.type == 1) {

				this.navBarTitle = "文章信息";
				let obj = JSON.parse(options.obj);
				// console.log(obj)
				this.enableStatus = obj.enableStatus;

				this.oaNoticeFindNoticeById(obj.pkId);
			}
		},
		data() {
			return {
				type: "",
				form: {
					noticeTitle: "",
					noticeAbstract: "",
					noticeContent: "",
					rotationUrl: "",
					noticeType: "",
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
				width: "250rpx",
				height: "40rpx",
				// 限制允许上传的格式，空串=不限制，默认为空
				formats: "png,jpg,jpeg",
				// 文件上传大小限制
				size: 30,
				// 是否打印日志
				debug: false,
				// ================ 


				navBarTitle: "编辑文章",
				subList: [],
				tiltetype: "1",

				cusTypeList: [
					{ id: 0, name: "公司新闻" },
					{ id: 1, name: "公司公告" },
				],

				pickerShow: false,
				cusTypeName: "",

				subSelShow: false,
				editStatus: true
			};
		},
		methods: {
			deleteImg() {
				this.form.rotationUrl = "";
			},
			redact() {

				this.navBarTitle = "编辑文章";
			},
			// 删除确认
			confirm() {
				this.show2 = false;
				if (this.promptContent == "确定删除此文章信息？") {
					this.deleteDep();
				} else {
					this.revocation(this.form.pkId);
				}

			},
			expurgate(val) {
				if (val == 1) {
					this.promptContent = "确定删除此文章信息？";
				} else {
					this.promptContent = "确定撤回该文章的发布？";
				}
				this.show2 = true;
			},
			// 删除
			deleteDep() {
				uni.showLoading({ mask: true });
				this.$api.oaNoticeDelete({ pkId: this.form.pkId }).then(res => {
					if (res.code == 200) {
						uni.showToast({ title: "删除成功" });
						setTimeout(() => {
							uni.hideLoading();
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 2]; // 上一页面实例
							prevPage.$vm.resh(); // 调用上一页 定义的方法
							uni.navigateBack({ delta: 1 });
						}, 500);
					} else {
						uni.hideLoading();
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			// 撤回
			revocation(pkId) {
				uni.showLoading({ mask: true });
				this.$api.oaNoticeWithdrawOaNotice({ pkId }).then(res => {
					if (res.code == 200) {
						uni.showToast({ title: "撤回成功" });
						setTimeout(() => {
							uni.hideLoading();
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 2]; // 上一页面实例
							prevPage.$vm.resh(); // 调用上一页 定义的方法
							uni.navigateBack({ delta: 1 });

						}, 500);
					} else {
						uni.hideLoading();
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			// 详情
			oaNoticeFindNoticeById(pkId) {
				this.editStatus = false;
				this.$api.oaNoticeFindNoticeById({ pkId }).then(res => {
					if (res.code == 200) {
						console.log(res);
						this.form = res.data;
						if (res.data.publishing == 0) {
							this.checkboxValue1 = [1];
						} else {
							this.checkboxValue1 = [];
						}
						if (res.data.noticeType == 0) {
							this.cusTypeName = "公司新闻";
						}
						if (res.data.noticeType == 1) {


							this.cusTypeName = "公司公告";
						}
						this.editStatus = true;

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
				this.form.noticeContent = val;
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
				this.form.noticeContent = this.$refs.editRef.getText();
				if (!this.form.noticeTitle) {
					uni.showToast({ title: "请填写文章标题", icon: "none" });
				}
				// console.log(this.form.noticeType)
				if (!this.form.noticeType) {
					uni.showToast({ title: "请选择通知类型", icon: "none" });
				}
				// console.log(this.checkboxValue1)
				// if (this.checkboxValue1.length == 0) {
				//     uni.showToast({ title: "请选择发布平台", icon: "none" });
				// }
				if (!this.form.noticeAbstract) {
					uni.showToast({ title: "请填写文章摘要", icon: "none" });
				}
				// if (this.tiltetype == "3" && !this.form.supplyCode) {
				//     uni.showToast({ title: "请选择供应商类型", icon: "none" });
				// }
				if (!this.form.rotationUrl) {
					uni.showToast({ title: "请上传缩略图", icon: "none" });
				}
				let data = { ...this.form, enableStatus: type };
				// if(this.checkboxValue)
				data.publishing = this.checkboxValue1.length ? 0 : 1;
				// console.log(this.checkboxValue1.length)
				// return console.log(this.checkboxValue1)
				// if(data.publishing =='APP端'){
				//     data.publishing = 1
				// }else if(data.publishing =='PC端'){
				//     data.publishing = 0
				// }

				uni.showLoading({ mask: true });
				if (this.navBarTitle != "编辑文章") {
					this.$api
						.oaNoticeAdd(data)
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
					this.$api
						.oaNoticeUpdate(data)
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
				if (this.navBarTitle == "文章信息") {
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
		background: #fff;
	}


	.title {
		padding-left: 20rpx;
		font-size: 28rpx;
		font-weight: 600;
		margin: 10rpx 0;
	}

	.content-index {
		width: 100%;
		height: 160px;
		opacity: 1;
		border-radius: 2px;
		display: flex;
		flex-direction: column;
		//  background-color: #f90;
	}

	.content-index-tu {
		display: flex;
		width: 100%;
		height: 50px;
		justify-content: space-between;
		align-items: center;

	}

	.textarea-s {
		width: 355px;
		height: 180px;
		opacity: 1;
		border-radius: 2px;
		background: rgba(249, 249, 255, 1);
		border: 1px solid rgba(221, 226, 240, 1);
		margin: 15px auto;
		margin-top: 4px;
	}

	.textarea-w {
		padding: 10rpx;
		background: rgba(249, 249, 255, 1);
		width: 100%;
		height: 300rpx;

		image {
			width: 100%;
			height: 280rpx;
		}
	}

	.textarea-1 {
		background: rgba(249, 249, 255, 1);
		width: 355px;
		height: 240px;
		opacity: 1;
		border-radius: 2px;
		border: 1px solid rgba(221, 226, 240, 1);
		margin: 15px auto;

		/deep/ table {
			border: -1px solid #ccc;
			border-collapse: collapse;

			th,
			td {
				border: 1px solid #ccc;
			}
		}

		table td {
			padding: 0px 5px;
		}
	}

	// .textarea{
	//     background: rgba(249, 249, 255, 1);
	// }

	.textarea-wen {
		width: 355px;
		height: 50px;
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
		// background-color: #fff;
		margin-bottom: 20rpx;

		width: 355px;
		height: 50px;
		opacity: 1;
		border-radius: 2px;
		background: rgba(249, 249, 255, 1);
		border: 1px solid rgba(221, 226, 240, 1);
		margin: 15px auto;
	}

	.select {
		justify-content: space-between;
	}

	.textarea-title {
		margin-top: 20px;
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

			background-color: red;
			color: #fff;
		}
	}

	.delete-icon {
		position: absolute;
		top: 44%;
		left: 45%;
	}

	/deep/ ._root {
		padding-left: 12px !important;
		padding-right: 12px !important;
	}

	.plus {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -60%);
	}

	.top-60 {
		margin-top: 120rpx !important;
	}
</style>