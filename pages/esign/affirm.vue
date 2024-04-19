<template>
	<view>
		<u-modal :show="show" :title="orgName" confirmText="同意" cancelText="不同意" showCancelButton buttonReverse
			@confirm="confirm" @cancel="cancel">
			<view class="slot-content">
				<view class="group">{{ teamName }}</view>
				<view>邀请您加入其团队</view>
			</view>
		</u-modal>
		<u-modal :show="show2" title="" :showConfirmButton="false">
			<view class="slot-content2">
				<view class="head fw-700">{{ orgName }}</view>
				<view class="middle fw-700">需要您签署一份合同</view>
				<text class="check" v-if="check" @click="go">查看合同</text>
				<view class="check" v-else>
					正在生成合同
					<u-loading-icon></u-loading-icon>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import request from "../../common/request";
	export default {
		onLoad(options) {
			console.log("参数", options);
			let urls = JSON.parse(decodeURIComponent(options.url));
			let a = urls.split("?");
			let b = a[a.length - 1].split("&");
			let obj = {};
			b.forEach(item => {
				let str = item.split("=");
				obj[str[0]] = str[1];
			});
			this.addObj = obj;
			this.selectById(obj.fkTeamId);
			this.fkTemplateId = obj.fkTemplateId;
			// +'&fkTemplateId='+options.fkTemplateId+'&signValidity='+options.signValidity
		},
		data() {
			return {
				show: true,
				show2: false,
				hasContract: true,
				orgName: "",
				teamName: "",
				resUrl: "",
				signUrl: "",
				check: false,
				fkTemplateId: "",
				bindData: {
					templateId: "",
					teamId: "",
					fileId: "",
				},
				addObj: {},
				times: 0,
				handleTimes: [1000, 2000, 3000],
				templateId: "",
				teamMembersId: ""
			};
		},
		methods: {
			confirm() {
				// if (this.hasContract) {
				//   this.show2 = true;
				//   this.show = false;
				//   // this.createContractDocument();
				//   // setTimeout(() => {
				//   //   this.check = true;
				//   // }, 5000);
				// }
				console.log(this.addObj);
				this.getEsignLink();
			},
			cancel() {
				uni.switchTab({ url: "/pages/index/index" });
			},
			go() {
				uni.redirectTo({
					url: "/pages/esign/esign?url=" +
						encodeURIComponent(JSON.stringify(this.signUrl)),
				});
			},
			selectById(pkId) {
				uni.showLoading({ mask: true });
				this.$api
					.selectById({ pkId })
					.then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							this.orgName = res.data.orgName;
							this.teamName = res.data.teamName;
						}
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			resh() {
				this.createContractDocument(this.teamMembersId);
			},
			// 获取签署链接
			getEsignLink() {
				// uni.showLoading({ mask: true });
				this.$api.addTeamMembers({ ...this.addObj, redirectUrl: "https://erp.jianwangkeji.cn/back.html" }).then(res => {
					if (res.code === 200) {
						console.log(res.data);
						if (!!res.data.stats) {
							this.show2 = true;
							this.show = false;
							this.teamMembersId = res.data.teamMembersId;
							if (res.data.type == 0) {
								this.$store.commit("isCerEsign", true);
								uni.navigateTo({
									url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.data
										.faceSwipingUrl))
								});
							} else {
								this.createContractDocument(res.data.teamMembersId);
							}
							console.log("过了");
						} else {
							uni.redirectTo({ url: "/pages/esign/congratulation" });
						}
					}
				});
				// uni
				//   .request({
				//     url: this.resUrl,
				//     method: "post",
				//     header: {
				//       "Content-Type": "application/json;charset=utf-8",
				//       Authorization: uni.getStorageSync("token"),
				//     },
				//   })
				//   .then((data) => {
				//     // uni.hideLoading();
				//     let [err, res] = data;
				//     console.log("合同", data, this.times, this.handleTimes[this.times]);
				//     if (res) {
				//       if (res.statusCode === 500) {
				//         uni.showToast({
				//           icon: "error",
				//           title: "系统内部错误",
				//           duration: 2000,
				//         });
				//       }
				//       if (res.data.code !== 200) {
				//         uni.switchTab({ url: "/pages/index/index" });
				//         uni.showToast({
				//           icon: "none",
				//           title: res.data.msg ? res.data.msg : "系统内部错误",
				//           duration: 2000,
				//         });
				//       } else {
				//         if (!!res.data.data.stats) {
				//           this.createContractDocument(res.data.data.teamMembersId)
				//           this.show2 = true;
				//           this.show = false;
				//         } else {
				//           uni.redirectTo({ url: "/pages/esign/congratulation" });
				//         }
				//       }
				//     }
				//     if (err) {
				//       uni.showToast({
				//         icon: "error",
				//         title: "网络错误",
				//         duration: 2000,
				//       });
				//       reject(err);
				//     }
				//   })
				//   .catch((error) => {
				//     uni.hideLoading();
				//     reject(error);
				//   });
			},
			// 生成合同文件
			createContractDocument(teamMembersId) {
				let data = {
					fkTemplateId: this.fkTemplateId,
					signValidity: this.addObj.signValidity,
					teamMembersId: teamMembersId,
				};
				this.$api.createContractDocument(data).then(res => {
					console.log(res);
					if (res.code === 200) {
						this.templateId = res.data;
						this.findContractDocumentStatus();
					} else {
						uni.switchTab({ url: "/pages/index/index" });
					}
				});
				// request
				//   .post(
				//     `/app/labourTeamMembers/createContractDocument?fkTemplateId=${this.fkTemplateId}&signValidity=${this.obj.signValidity}&teamMembersId=${teamMembersId}`
				//   )
				//   .then((res) => {
				//     console.log(res);
				//     if (res.code === 200) {
				//       this.templateId=res.data
				//       this.findContractDocumentStatus()
				//       // this.resUrl =
				//       //   this.resUrl +
				//       //   `&fileName=${res.data.fileName}&templateId=${res.data.templateId}`;
				//       // this.bindData = {
				//       //   ...this.bindData,
				//       //   templateId: this.templateId,
				//       //   fileId: res.data.templateId,
				//       // };
				//       // this.$store.commit("saveBindData", this.bindData);
				//       // console.log("url", this.resUrl);
				//       // // this.getEsignLink();
				//     }
				//   });
			},
			findContractDocumentStatus() {
				this.$api
					.findContractDocumentStatus({
						fkTemplateId: this.fkTemplateId,
						redirectUrl: "https://erp.jianwangkeji.cn/back.html",
						signValidity: this.addObj.signValidity,
						templateId: this.templateId,
					})
					.then(res => {
						console.log(res);
						if (res.code === 200) {
							if (!!res.data.updateStats) {
								this.check = true;
								this.signUrl = res.data.signUrl;
								this.$store.commit("isEsign", true);
							} else {
								if (this.times > 3) {
									uni.navigateBack({
										delta: 1,
									});
								} else {
									setTimeout(() => {
										this.findContractDocumentStatus();
									}, this.handleTimes[this.times]);
								}
								this.times++;
							}
						} else {
							uni.showToast({
								title: res.msg,
								icon: "none",
								mask: true,
							});
							setTimeout(() => {
								uni.navigateBack({
									delta: 1,
								}, 2000);
							});

						}
					});
			},
		},
	};
	// if (!res.data.data.updateStats) {
	//                   if (this.times > 3) {
	//                     uni.navigateBack({
	//                       delta: 1,
	//                     });
	//                   } else {
	//                     setTimeout(() => {
	//                       this.getEsignLink();
	//                     }, this.handleTimes[this.times]);
	//                   }
	//                 } else {
	//                   this.check = true;
	//                   let result = res.data.data;
	//                   this.signUrl = result.signUrl;
	//                   this.$store.commit("isEsign", true);
	//                   this.$store.commit("saveBindData", this.bindData);
	//                 }
	//                 this.times++;
</script>

<style lang="scss" scoped>
	.slot-content {
		text-align: center;
		font-size: 30rpx;

		.group {
			margin-bottom: 10rpx;
			color: #606266;
			font-weight: 700;
		}
	}

	.fw-700 {
		font-weight: 700;
		margin-bottom: 30rpx;
	}

	.slot-content2 {
		text-align: center;

		.head {
			font-size: 36rpx;
		}

		.check {
			display: flex;
			justify-content: center;
			align-items: center;
			color: #02a7f0;
			font-size: 28rpx;
		}
	}
</style>