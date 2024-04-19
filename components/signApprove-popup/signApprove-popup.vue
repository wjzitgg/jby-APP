<template>
	<view>
		<!-- @close="close" @open="open" -->
		<u-popup :show="appShow" mode="center" round="10">
			<view class="approve">
				<view class="approve-header">
					<view class="approve-title">{{ appTitle }}</view>
					<u-icon @click="close" class="approve-closeBtn" name="close-circle" size="18" color="#ff0000"></u-icon>
				</view>
				<view class="approve-content">
					<view class="approver-select">
						<view class="approver-select-item">
							<view class="label">流程名称</view>
							<view class="content text-hidden">{{ workflowName }}</view>
							<!-- <u-icon class="right-icon" name="arrow-right"></u-icon> -->
						</view>
						<!-- <view class="approver-select-item">
							<view class="label">负责岗位</view>
							<view class="content text-hidden">{{ deptName }}</view>
						</view> -->
						<!-- <view class="approver-select-item">
							<view class="label">下一审批岗位</view>
							<view class="content text-hidden">{{ approverName }}</view>
						</view>
						<view class="approver-select-item" @click="selectApp">
							<view class="label">审批人</view>
							<view class="content text-hidden">{{ appName }}</view>
							<u-icon class="right-icon" name="arrow-right"></u-icon>
						</view> -->
					</view>
					<view class="approve-opinion">
						<h5 class="approve-opinion-head">审批意见</h5>
						<u--textarea v-model="opinion" placeholder="请输入审批意见" count maxlength="200"></u--textarea>
					</view>
					<view class="approve-sign" v-if="signStatus">
						<h5 class="approve-sign-title" style="position: relative;">签名 
							<text style="position:absolute;right:0" v-if="!!signUrl" @click.stop="processFormLick">预览签名</text>
						</h5>
						<view class="signBox"><amSignInput canvasId="twoDrowCanvas" canvasIds="twoRotateCanvas" :action="action" @signToUrl="twoSignToUrl"></amSignInput></view>
					</view>
				</view>
				<view class="approve-footer">
					<view class="footer-btns red" @click="reject">驳回</view>
					<view class="footer-btns blue" @click="submit">提交</view>
				</view>
			</view>
			<!-- <u-picker title="请选择审批人" :show="pickerShow" :columns="[approverList]" keyName="label" @confirm="pickerConfirm" @cancel="pickerCancel"></u-picker> -->
		</u-popup>
		<u-popup :show="processFormShow" mode="center" round="10" closeable @close="closeFormShow">
			<view class="preview2">
				<processForm :tableData="tableHtmlArr" :disabled="true" ref="formHtml"></processForm>
			</view>
		</u-popup>
	</view>
</template>

<script>
import amSignInput from '../am-sign-input/am-sign-input';
import pdf from '../pdf-preview.vue';
import request from '../../common/request';
import permision from '@/common/permission.js';
export default {
	components: { amSignInput, pdf },
	props: {
		// 弹框标题
		appTitle: {
			type: String,
			default: ''
		},
		// 弹框显示
		appShow: {
			type: Boolean,
			default: false
		},
		workflowName: {
			type: String
		},
		// deptName: {
		// 	type: String
		// },
		// // 选择审批人
		// approverShow: {
		// 	type: Boolean,
		// 	default: true
		// },
		// // 下一审批人
		// approverName: {
		// 	type: String,
		// 	default: ''
		// },
		// // 审批列表，需要把列表数据编辑为有value,和label
		// approverList: {
		// 	type: Array,
		// 	default: () => {
		// 		return [];
		// 	}
		// }
		tableData: { type: Array, default: () => [] }, // 表格内容
		sysRoleId: { //系统流程传审批节点ID
			type: String,
			default: ''
		},
		roleId: { //自定义流程传审批节点ID
			type: String,
			default: ''
		},
	},
	computed: {
		userInfo() {
			return this.$store.state.userInfo;
		}
	},
	watch: {
		appShow(val) {
			if (val) {
				this.getApproveStatus();
			}
		},
		approverOk(val) {
			if (val) {
				if (this.btnType === 1) {
					this.$emit('reject', {
						opinion: this.opinion,
						// approverId: this.approverId,
						signUrl: this.signUrl
					});
				} else if (this.btnType === 2) {
					this.$emit('submit', {
						opinion: this.opinion,
						// approverId: this.approverId,
						signUrl: this.signUrl
					});
				}
			}
		}
	},
	data() {
		return {
			approveStatus: 0,
			action: request.baseUrl + '/app/file/upload/picture',
			fileList: [],
			opinion: '',
			rate: '',
			approverId: '',
			appName: '',
			signUrl: '',
			appoverList: [
				[
					{
						value: '123456',
						label: '张三123123123213123sdgdfsgsdfgsdfgsdfgdsfgsdfg321312'
					},
					{ value: '1234564', label: '李四' }
				]
			],
			pickerShow: false,
			previewShow: false,
			previewUrl: '',
			// 上传接口参数
			option: {
				// 上传服务器地址，此地址需要替换为你的接口地址
				url: request.baseUrl + '/app/file/upload/picture',
				// 上传附件的key
				name: 'file',
				// 根据你接口需求自定义请求头,默认不要写content-type,让浏览器自适配
				header: {
					// 示例参数可删除
					'Authorization': uni.getStorageSync("token"),
				},
				// 根据你接口需求自定义body参数
				// formData: {
				// 	// 'orderId': 1000
				// }
			},
			// 选择文件后是否立即自动上传，true=选择后立即上传
			instantly: true,
			// 必传宽高且宽高应与slot宽高保持一致
			width: '150rpx',
			height: '40rpx',
			// 限制允许上传的格式，空串=不限制，默认为空
			formats: '',
			// 文件上传大小限制
			size: 30,
			// 文件回显列表
			files: new Map(),
			// 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
			wxFiles: [],
			// 是否打印日志
			debug: false,
			signStatus:false,
			signerId:"",
			processFormShow:false,
			tableHtmlArr:[],
			unique:"",
			timers:null,
      		time:0
		};
	},
	methods: {
		processFormLick(){
			if (this.tableHtmlArr.length > 0) {
					this.tableHtmlArr.forEach(item => {
						if (item.tableHtml != undefined && item.tableHtml != null && item.tableHtml.length != 0) {
           		 			 item.tableHtml.forEach(e => {
           		 			   e.arr.forEach(i => {
           		 			     if (i.attributeTypes == 3) {
           		 			       if (i.signatureDate.signer == this.sysRoleId ||i.signatureDate.signer == this.roleId) {
           		 			         i.signatureDate.img =this.signUrl;
           		 			       }
           		 			     }
           		 			   });
           		 			 });

           				}

					});
				}
			this.processFormShow = true
		},
		closeFormShow(){
			this.processFormShow = false;
		},
		getApproveStatus() {
			this.$api.getApproveStatus().then(res => {
				if (res.code === 200) {
					this.approveStatus = res.data;
					this.tableHtmlArr=JSON.parse(JSON.stringify(this.tableData))
					if(res.data == 2 || res.data == 3){
						this.tableData.forEach(item => {
                            if (item.tableHtml != undefined && item.tableHtml != null && item.tableHtml.length != 0) {
                                item.tableHtml.forEach(e => {
                                    e.arr.forEach(i => {
                                        if (i.attributeTypes == 3) {
                                              if(this.sysRoleId == i.signatureDate.signer){
                                                this.signStatus = true
												this.signerId = i.signatureDate.signer
                                              }
                                              if(this.roleId == i.signatureDate.signer){
                                                this.signStatus = true
												this.signerId = i.signatureDate.signer
                                              }
                                        }
                                    });
                                });
                            }
                        });
					}
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		// 关闭弹框
		close() {
			this.$emit('close');
			this.pickerShow = false;
			this.fileList = [];
			this.opinion = '';
			this.rate = '';
			this.approverId = '';
			this.appName = '';
		},
		// 驳回按钮
		reject() {
			this.btnType = 1;
			if (this.approveStatus > 1) {
				if (!this.signUrl) {
					return uni.showToast({ icon: 'none', title: '请签名' });
				}
			}
			if (this.approveStatus === 0) {
				this.$emit('reject', {
					fileList: this.fileList,
					opinion: this.opinion,
					rate: this.rate,
					approverId: this.approverId,
					approver: this.appName,
					signUrl: this.signUrl,
					signerId:this.signerId,
					unique:this.unique
				});
			}else{
				this.$api.getFaceAuthStatus({ needSign:this.approveStatus === 1?0: this.signStatus? 1:0}).then((res) => {
          		if (res.code === 200) {
            this.unique = res.data.unique;
            if (this.approveStatus === 1) {
              // this.webViewShow=true
              if (res.data.verifyStatus) {
                this.getPerssiom();
              } else {
				this.$emit('reject', {
					fileList: this.fileList,
					opinion: this.opinion,
					rate: this.rate,
					approverId: this.approverId,
					approver: this.appName,
					signUrl: this.signUrl,
					signerId:this.signerId,
					unique:this.unique
				});
              }
            } else if (this.approveStatus === 2) {
              this.$emit('reject', {
					fileList: this.fileList,
					opinion: this.opinion,
					rate: this.rate,
					approverId: this.approverId,
					approver: this.appName,
					signUrl: this.signUrl,
					signerId:this.signerId,
					unique:this.unique
				});
            } else if (this.approveStatus === 3) {
              // this.webViewShow=true
              if (res.data.verifyStatus) {
                this.getPerssiom();
              } else {
				this.$api.updateQRCodeData({ unique: this.unique, url: this.signUrl}).then((res) => {
        		  if (res.code === 200) {
        		    this.$emit('reject', {
					fileList: this.fileList,
					opinion: this.opinion,
					rate: this.rate,
					approverId: this.approverId,
					approver: this.appName,
					signUrl: this.signUrl,
					signerId:this.signerId,
					unique:this.unique
				});
        		  } else {
        		    uni.showToast({ icon: "none", title: res.data });
        		  }
        		});
              }
            }
          		} else {
          		  uni.showToast({ icon: "none", title: res.msg });
          		}
       			});
			}
			// this.$emit("reject", {
			//   fileList: this.fileList,
			//   opinion: this.opinion,
			//   rate: this.rate,
			//   approverId: this.approverId,
			//   signUrl: this.signUrl,
			// });
		},
		// 提交按钮
		submit() {
			console.log('approveStatus -----> ', this.approveStatus);
			this.btnType = 2;
			if (this.signStatus) {
				if (!this.signUrl) {
					return uni.showToast({ icon: 'none', title: '请签名' });
				}
			}
			if (this.approveStatus === 0) {
				this.$emit('submit', {
					fileList: this.fileList,
					opinion: this.opinion,
					rate: this.rate,
					fkApproverId: this.approverId,
					approver: this.appName,
					signUrl: this.signUrl,
					uniqueIdentification:1,
					unique:this.unique
				});
			}else{
				this.$api.getFaceAuthStatus({ needSign:this.approveStatus === 1?0: this.signStatus? 1:0 }).then((res) => {
          		if (res.code === 200) {
            this.unique = res.data.unique;
            if (this.approveStatus === 1) {
              // this.webViewShow=true
              if (res.data.verifyStatus) {
                this.getPerssiom();
              } else {
				this.$emit('submit', {
					fileList: this.fileList,
					opinion: this.opinion,
					rate: this.rate,
					fkApproverId: this.approverId,
					approver: this.appName,
					signUrl: this.signUrl,
					signerId:this.signerId,
					unique:this.unique
				});
              }
            } else if (this.approveStatus === 2) {
              this.$emit('submit', {
					fileList: this.fileList,
					opinion: this.opinion,
					rate: this.rate,
					fkApproverId: this.approverId,
					approver: this.appName,
					signUrl: this.signUrl,
					signerId:this.signerId,
					unique:this.unique
				});
            } else if (this.approveStatus === 3) {
              // this.webViewShow=true
              if (res.data.verifyStatus) {
                this.getPerssiom();
              } else {
				this.$api.updateQRCodeData({ unique: this.unique, url: this.signUrl}).then((res) => {
        		  if (res.code === 200) {
        		    this.$emit('submit', {
					fileList: this.fileList,
					opinion: this.opinion,
					rate: this.rate,
					fkApproverId: this.approverId,
					approver: this.appName,
					signUrl: this.signUrl,
					signerId:this.signerId,
					unique:this.unique
				});
        		  } else {
        		    uni.showToast({ icon: "none", title: res.data });
        		  }
        		});
              }
            }
          		} else {
          		  uni.showToast({ icon: "none", title: res.msg });
          		}
       			});
			}
		},
		getPerssiom(){
			// #ifdef APP-PLUS
				uni.getSystemInfo({
					success: res => {
						console.log(res);
						if (res.osName === 'ios') {
							this.faceAuthorize();
						} else {
							permision.requestAndroidPermission('android.permission.CAMERA').then(result => {
								if (result == 1) {
									this.faceAuthorize();
								} else {
									// uni.showToast({title:"没有相机权限",icon:"error"})
									// permision.gotoAppPermissionSetting('android.permission.CAMERA')
									uni.showModal({
										title: '提示',
										content: '需要相机权限才能进行下一步操作，是否打开？',
										showCancel: true,
										success: ({ confirm, cancel }) => {
											if (confirm) {
												console.log('用户点击确定');
												permision.gotoAppPermissionSetting('camera');
											} else if (cancel) {
												console.log('用户点击取消');
											}
										}
									});
								}
							});
						}
					}
				});
				// #endif
		},
		faceAuthorize() {
			uni.showLoading({
				mask: true
			});
			this.$api
				.scanQRCode({
        		  unique:this.unique,
        		  callbackUrl: "https://erp.jianwangkeji.cn/back.html?contextId=6",
        		  url: this.signUrl,
        		})
				.then(res => {
					if (res.code === 200) {
						let that = this;
						uni.navigateTo({
							url: '/pages/esign/esign?url=' + encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl)),
							events: {
								// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
								isOk: function(data) {
									console.log(data);
									if (data.data) {
										console.log(that.btnType);
										uni.showLoading({mask:true,title:"人脸认证中"})
										that.judgeScanCompleted()
									}
								}
							},
							success: () => {
								uni.hideLoading();
								res.eventChannel.emit('isOk', { data: false });
							}
						});
					} else {
						uni.showToast({ icon: 'success', title: res.msg });
					}
				});
		},
		judgeScanCompleted(){
      this.time = 0
      uni.showLoading({mask:true,title:"人脸认证中"})
      clearInterval(this.timers)
      this.timers = setInterval(()=>{
		if(this.time == 10){
			clearInterval(this.timers)
			uni.hideLoading()
			uni.showToast({title:"人脸认证失败",icon:"none"})
			return
		}
        this.$api.judgeScanCompleted({ unique: this.unique }).then(res=>{
          if (res.code === 200) {
              if (res.data.status === 2) {
                if (this.btnType === 1) {
					this.$emit('reject', {
					fileList: this.fileList,
					opinion: this.opinion,
					rate: this.rate,
					approverId: this.approverId,
					approver: this.appName,
					signUrl: this.signUrl,
					signerId:this.signerId,
					unique:this.unique
				});
				} else if (this.btnType === 2) {
					this.$emit('submit', {
					fileList: this.fileList,
					opinion: this.opinion,
					rate: this.rate,
					fkApproverId: this.approverId,
					approver: this.appName,
					signUrl: this.signUrl,
					signerId:this.signerId,
					unique:this.unique
				});
				}
                clearInterval(this.timers);
              } else if (res.data.status === 3) {
                uni.hideLoading()
                clearInterval(this.timers);
                uni.showToast({icon:'none',title:"认证失败"})
              }
            } else {
              clearInterval(this.timers);
              uni.hideLoading()
              uni.showToast({icon:'none',title:res.msg})
            }
        }).catch(err => {
            clearInterval(this.timers);
            uni.hideLoading()
          })
		  this.time++
      },3000)
    },
		rateClick(rate) {
			this.rate = rate;
		},
		selectApp() {
			this.pickerShow = true;
		},
		pickerConfirm(e) {
			console.log(e);
			if (e.value.length) {
				this.approverId = e.value[0].value;
				this.appName = e.value[0].label;
				console.log(this.approverId);
			}
			this.pickerCancel();
		},
		pickerCancel() {
			this.pickerShow = false;
		},
		upLoad() {
			uni.uploadFile({
				url: '/app/file/upload/picture'
			});
		},
		delFile(row, index) {
			this.fileList = this.fileList.filter(item => item.id !== row.id);
			this.$refs.lsjUpload1.clear(row.fileName);
		},
		onChange(e) {
			console.log('改变事件', e);
		},
		onprogress(e) {
			console.log('中途事件', e);
		},
		onuploadEnd(e) {
			console.log('结束事件', e);
			if (e.responseText) {
				let res = JSON.parse(e.responseText);
				if (res.code === 200) {
					this.fileList.push({
						id: this.fileList.length ? this.fileList[this.fileList.length - 1].id + 1 : 1,
						fileName: e.name,
						fileUrl: res.data
					});
				}
			}
		},
		preview(item) {
			this.$checkName(item.fileUrl)
            return
			this.previewUrl = item.fileUrl;
			this.previewShow = true;
		},
		closePreview() {
			this.previewShow = false;
			this.previewUrl = '';
		},
		twoSignToUrl(e) {
			this.signUrl = e;
			console.log('签名', e);
		}
	}
};
</script>

<style lang="scss" scoped>
.approve {
	width: 700rpx;
	max-height: 1200rpx;
	overflow: hidden;
	border-radius: 20rpx;
	background-color: #f7f7ff;
	.approve-header {
		position: relative;
		// width: 600rpx;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 20rpx;
		background-color: #fff;
		.approve-title {
			font-size: 28rpx;
		}
		.approve-closeBtn {
			position: absolute;
			right: 20rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}
	.approve-content {
		max-height: 1040rpx;
		padding: 10rpx;
		margin-bottom: 100rpx;
		overflow: auto;
	}
	.approver-select-item {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 60rpx;
		background-color: #fff;
		border-bottom: 1px solid #ccc;
		font-size: 28rpx;
		padding-left: 10rpx;
		padding-right: 50rpx;
		.right-icon {
			position: absolute;
			right: 10rpx;
			top: 50%;
			transform: translateY(-50%);
		}
		.content {
			width: 400rpx;
			text-align: right;
		}
	}
	.approve-opinion {
		.approve-opinion-head {
			height: 60rpx;
			line-height: 60rpx;
		}
	}
	.approve-rate {
		display: flex;
		align-items: center;
		height: 80rpx;
		background-color: #fff;
		font-size: 28rpx;
		.left {
			width: 150rpx;
		}
		.right {
			display: flex;
			justify-content: space-around;
			width: 530rpx;
			.rate-btn {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 120rpx;
				height: 60rpx;
				background-color: #d7d7d7;
				color: #fff;
			}
			.rate-btn-click {
				color: #1ec695;
				border: 1px solid #1ec695;
				background-color: #fff;
			}
		}
	}
	.approve-files {
		.approve-files-head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 60rpx;
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
	.file-empty {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60rpx;
		background-color: #fff;
	}
	.approve-sign {
		.approve-sign-title {
			height: 60rpx;
			line-height: 60rpx;
		}
		.signBox {
			height: 300rpx;
			background-color: #fff;
		}
	}
	.approve-footer {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-evenly;
		height: 120rpx;
		padding: 20rpx;
		z-index: 1;
		background-color: #f7f7ff;
		border-radius: 0 0 20rpx 20rpx;
		.footer-btns {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 310rpx;
			height: 80rpx;
			color: #fff;
			border-radius: 10rpx;
		}
		.red {
			background-color: #f75e5e;
		}
		.blue {
			background-color: #1576e6;
		}
	}
}
.text-hidden {
	overflow: hidden; /*超出部分隐藏*/
	white-space: nowrap; /*禁⽌换⾏*/
	text-overflow: ellipsis; /*省略号*/
}
.preview {
	width: 700rpx;
	height: 1200rpx;
	overflow: hidden;
	.preview-top {
		height: 100rpx;
		line-height: 100rpx;
		padding-left: 40rpx;
	}
}
</style>
