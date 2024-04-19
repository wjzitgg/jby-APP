<template>
	<view class="wrapper addPageBg">
		<u-navbar :leftText="rowData.itemTitle" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="content">
			<view>
				<view style="padding-bottom: 60px">
					<!-- <view class="add-inputs">
            <view class="inputs-label">申请单号</view>
            <view class="inputs-content">
              <u--textarea v-model="rowData.orderCode" placeholder="请输入内容" autoHeight maxlength="50" border="none"></u--textarea>
            </view>
          </view> -->
					<view class="add-inputs">
						<view class="inputs-label">项目名称</view>
						<view class="inputs-content">
							<u--textarea v-model="rowData.projectName" placeholder="请输入内容" autoHeight maxlength="25"
								border="none"></u--textarea>
						</view>
					</view>
					<!-- <view class="add-inputs">
            <view class="inputs-label" >默认仓库 </view>
            <view class="inputs-content">
              <u-radio-group v-model="value">
              	<u-radio label="是" :name='true'></u-radio>
              	<u-radio label="否" :name='false'></u-radio>
              </u-radio-group>
            </view>
          </view> -->
					<!-- <view class="add-inputs">
            <view class="inputs-label">负责人</view>
            <view class="inputs-content select" @click="receiveShow = true">
              <view class="name">{{ receiverData.userName }}</view>
              <u-icon
                name="arrow-down-fill"
                class="icons"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
            <u-picker
              :show="receiveShow"
              :columns="receiverList"
              keyName="userName"
              @cancel="receiveClose"
              @confirm="receiveConfirm"
            ></u-picker>
          </view> -->
					<!-- <view class="add-inputs">
            <view class="inputs-label">手机号码</view>
            <view class="inputs-content select">
              <view>{{receiverData.telephone}}</view>
              <u-icon name="lock-fill" class="icons" size="14"></u-icon>
              <u--input placeholder="请输入内容" border="none" disabled v-model="receiverData.telephone" customStyle="" class="form-content" clearable ></u--input>
            </view>
          </view> -->
					<view class="add-inputs">
						<view class="inputs-label">项目地址</view>
						<!-- <u-input
              placeholder="请输入内容"
              border="none"
              v-model="rowData.address"
              customStyle=""
              class="form-content"
              clearable
            ></u-input> -->
						<view class="inputs-content select" @click="selAdd">
							<view class="name">{{ rowData.detailAddress }}</view>
							<u-icon name="arrow-down-fill" class="map" color="#2a82e4" size="12"></u-icon>
						</view>
					</view>
					<view class="add-inputs">
						<view class="inputs-label">项目金额</view>
						<view class="inputs-content">
							<u--input v-model="rowData.contractAmount" placeholder="请输入内容" autoHeight maxlength="15"
								border="none"></u--input>
						</view>
					</view>

					<view class="add-inputs">
						<view class="inputs-label">开工日期</view>
						<view class="inputs-content select" @click="dateShow1 = true">
							<view class="name">{{ beginTime }}</view>
							<u-icon name="calendar-fill" class="icons" color="#2a82e4" size="12"></u-icon>
						</view>
						<u-datetime-picker :show="dateShow1" v-model="value1" @cancel="dateShow1 = false" :maxDate="value2"
							@confirm="dateSelect1" mode="date"></u-datetime-picker>
					</view>
					<view class="add-inputs">
						<view class="inputs-label">竣工日期</view>
						<view class="inputs-content select" @click="dateShow2 = true">
							<view class="name">{{ endTime }}</view>
							<u-icon name="calendar-fill" class="icons" color="#2a82e4" size="12"></u-icon>
						</view>
						<u-datetime-picker :show="dateShow2" v-model="value2" @cancel="dateShow2 = false" :minDate="value1"
							@confirm="dateSelect2" mode="date"></u-datetime-picker>
					</view>
					<view class="add-inputs">
						<view class="inputs-label">工期</view>
						<view class="inputs-content">
							<u--input v-model="rowData.duration" placeholder="请输入内容" autoHeight maxlength="25"
								border="none"></u--input>
						</view>
					</view>
					<view class="add-inputs">
						<view class="inputs-label">项目描述</view>
						<view class="inputs-content">
							<u--textarea v-model="rowData.remark" placeholder="请输入内容" autoHeight maxlength="100"
								border="none"></u--textarea>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="box-btn">
			<u-button style="background: #eeeeee" class="btns cancle" type="default" text="取消" @click="abrogate"></u-button>
			<u-button class="btns" type="primary" text="保存" @click="preserve"></u-button>
		</view>
	</view>
</template>

<script>
	import moment from "moment";
	export default {
		data() {
			return {
				rowData: {},
				value: false,
				receiverList: [], //关联单位
				receiverData: {},
				receiveShow: false, //关联项目弹窗状态
				dateShow1: false,
				dateShow2: false,
				value1: Number(new Date()),
				value2: Number(new Date()),
				beginTime: "",
				endTime: ""
			};
		},
		onLoad(item) {
			this.rowData = JSON.parse(item.row);
			this.init();
			if (this.rowData.itemTitle == "编辑项目概况") {
				this.beginTime = this.rowData.beginTime;
				this.value1 = this.rowData.beginTime;
				this.value2 = this.rowData.endTime;
				this.endTime = this.rowData.endTime;
			} else {
				// this.rowData.warehouseType = 1;
				this.rowData={
					itemTitle:this.rowData.itemTitle,
					projectName:"",
					contractAmount:"",
					duration:"",
					beginTime:"",
					endTime:"",
					remark:"",
					latitude:"",
					longitude:"",
					address:"",
					areaName:"",
					cityName:"",
					provinceName:"",
					provinceCode:"",
					cityCode:"",
					areaCode:"",
					detailAddress:"",
				}
			}
		},
		methods: {
			dateSelect1(e) {
				this.beginTime = moment(e.value).format("YYYY-MM-DD");
				this.dateShow1 = false;
			},
			dateSelect2(e) {
				this.endTime = moment(e.value).format("YYYY-MM-DD");
				this.dateShow2 = false;
			},
			getAddress(e) {
				console.log(e);
				let arr = this.changeAdr(e.address);
				this.$set(this.rowData, "detailAddress", e.address);
				this.$set(this.rowData, "provinceName", e.addressComponents.province);
				this.$set(this.rowData, "cityName", e.addressComponents.city);
				this.$set(this.rowData, "areaName", e.addressComponents.district);
				this.$set(this.rowData, "address", arr[4] ? arr[4] : "");
				this.$set(this.rowData, "latitude", e.point.lat);
				this.$set(this.rowData, "longitude", e.point.lng);
				// this.rowData.address=e.address
			},
			changeAdr(value) {
				let reg =
					"(?<province>[^省]+自治区|.*?省|.*?行政区|.*?市)?(?<city>[^市]+自治州|.*?地区|.*?行政单位|.+盟|市辖区|.*?市|.*?县)?(?<county>[^(区|市|县|旗|海域|岛)]+区|.*?市|.*?县|.*?旗|.*?海域|.*?岛)?(?<village>.*)";

				var dt = value.match(reg);
				console.log("dt", dt);
				return dt;
			},
			selAdd() {
				// uni.navigateTo({url:`/pages/map/map?longitude=${''}&latitude=${''}`})
				let that = this;
				uni.chooseLocation({
					latitude: that.rowData.latitude,
					longitude: that.rowData.longitude,
					success: function(res) {
						console.log("位置名称：" + res.name);
						console.log("详细地址：" + res.address);
						console.log("纬度：" + res.latitude);
						console.log("经度：" + res.longitude);
						let arr = that.changeAdr(res.address);
						that.$set(that.rowData, "detailAddress", res.address);
						that.$set(that.rowData, "provinceName", arr[1]);
						that.$set(that.rowData, "cityName", arr[2] ? arr[2] : arr[1]);
						that.$set(that.rowData, "areaName", arr[3] ? arr[3] : "");
						that.$set(that.rowData, "address", arr[4] ? arr[4] : "");
						that.$set(that.rowData, "latitude", res.latitude);
						that.$set(that.rowData, "longitude", res.longitude);
						// areaCode
					},
					fail(res) {
						console.log(res);
					},
				});
			},
			init() {
				// alert(1111)
				this.$api.provinceList({ countryId: 45 }).then(res => {
					if (res.code == 200) {
						this.provinceList = res.data;
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
				// this.$api
				//   .searchUserListById({ orgId: uni.getStorageSync("user").orgId })
				//   .then((res) => {
				//     if (res.code == 200) {
				//       this.receiverList = [res.data];
				//     } else {
				//       uni.showToast({ icon: "none", title: res.msg });
				//     }
				//   });
			},

			// 接收单位
			receiveClose() {
				this.receiveShow = false;
			},
			// 接收单位
			receiveConfirm(e) {
				this.receiverData = e.value[0];
				this.receiveShow = false;
			},

			// 取消新增修改
			abrogate() {
				uni.navigateBack();
			},
			// 保存
			preserve() {

				let that = this;
				this.provinceList.forEach(item => {
					if (item.areaName == this.rowData.provinceName) {
						// data.provinceCode = item.areaCode
						that.$set(that.rowData, "provinceCode", item.areaCode);
						this.$api.cityList({ provinceId: item.pkId }).then(res => {
							if (res.code == 200) {
								res.data.forEach(e => {
									if (e.areaName == this.rowData.cityName) {
										console.log("wodian3333333333333333333333" + e.areaCode);
										// data.cityCode  == e.areaCode;
										that.$set(that.rowData, "cityCode", e.areaCode);
										e.sysAreaList.forEach(s => {
											if (s.areaName == this.rowData.areaName) {
												console.log("4444444444444444444444444444444" + s.areaCode);
												// data.areaCode = s.areaCode
												that.$set(that.rowData, "areaCode", s.areaCode);
												uni.showLoading({ mask: true });
				that.$nextTick(() => {
					let data = {
						projectName: that.rowData.projectName,
						contractAmount: that.rowData.contractAmount,
						duration: that.rowData.duration,
						beginTime: that.beginTime,
						endTime: that.endTime,
						remark: that.rowData.remark,
						latitude: that.rowData.latitude,
						longitude: that.rowData.longitude,
						address: that.rowData.address,
						areaName: that.rowData.areaName,
						cityName: that.rowData.cityName,
						provinceName: that.rowData.provinceName,
						provinceCode: that.rowData.cityCode,
						cityCode: that.rowData.cityCode,
						areaCode: that.rowData.areaCode,
						detailAddress: that.rowData.detailAddress,
					};
					console.log("1111111111");
					console.log(data);
					console.log("1111111111");

					if (that.rowData.itemTitle == "新增项目概况") {
						that.$api.addProject(data).then(res => {
							uni.hideLoading();
							if (res.code == 200) {
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 2]; // 上一页面实例
								prevPage.$vm.resh(); // 调用上一页 定义的方法
								uni.navigateBack();
								uni.showToast({ title: "新增成功" });
								// uni.navigateTo({
								//   url: "/pages/material/inventory/info?",
								// });
							} else {
								uni.showToast({ icon: "none", title: res.msg });
							}
						});
					} else {
						data.pkId = that.rowData.pkId;
						that.$api.updateProject(data).then(res => {
							uni.hideLoading();
							if (res.code == 200) {
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 2]; // 上一页面实例
								prevPage.$vm.resh(); // 调用上一页 定义的方法
								uni.navigateBack();
								uni.showToast({ title: "编辑成功" });
								// uni.navigateTo({
								//   url: "/pages/material/inventory/info?",
								// });
							} else {
								uni.showToast({ icon: "none", title: res.msg });
							}
						});
					}
					// console.log("!111111111111111111111111")
					// console.log(data)
					// console.log("!111111111111111111111111")
				});
											}
										});
									}
								});
							} else {
								uni.showToast({ icon: "none", title: res.msg });
							}
						});
					}
				});
				
				// return


			},
		},
	};
</script>

<style lang="scss" scoped>
	/deep/ .uni-input-placeholder {
		padding-left: 10px;
	}

	.tabs {
		/deep/ .u-tabs__wrapper__nav__item {
			flex: 1;
		}
	}

	.item-edit-form {
		padding: 8px 16px;
		background: rgb(255, 255, 255);
		margin-top: 2px;
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

	.box-btn {
		display: flex;
		position: fixed;
		width: 100%;
		bottom: 0;
	}

	.table-btn {
		display: inline-block;
		background: #ebf4ff;
		color: #2b8fed;
		font-size: 10px;
		padding: 6px 23px;
		margin: 6px auto;
		margin-left: 41%;
	}

	/deep/ .uni-input-input {
		padding-left: 12px;
	}

	.u-radio {
		margin-right: 20rpx;
	}
</style>