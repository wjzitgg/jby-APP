<template>
	<view class="wrapper">
		<u-navbar leftText="关联标段项目" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="content">
			<u-checkbox-group v-model="checkboxValue" placement="column">
				<u-checkbox v-for="(item, index) in checkboxList" :key="index" :label="item.projectName" :name="item.pkId"
					:disabled="item.disabled">
				</u-checkbox>
			</u-checkbox-group>
		</view>
		<view class="pdb"></view>
		<view class="btn" @click="btnOk">确定</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checkboxValue: [],
				checkboxList: [],
				projectId: "",
			};
		},
		onLoad(option) {
			this.projectId = option.pkId;
			this.getData(this.projectId);

		},
		methods: {
			btnOk() {
				uni.showLoading();
				console.log(this.checkboxValue);
				// let arr = [];
				// this.checkboxValue.forEach(item => {
				// 	if (item.isChecked == 1) {
				// 		arr.push(item.pkId);
				// 	}
				// });
				this.$api.addProjectBid({ projectBidIds: this.checkboxValue, projectId: this.projectId }).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						const eventChannel = this.getOpenerEventChannel();
						eventChannel.emit("someEvent", { data: this.checkboxValue });
						// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
						// eventChannel.on("acceptDataFromOpenerPage", function(data) {
						// 	console.log("嘎嘎嘎");
						// });
						uni.navigateBack();
						return;
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			// 获取关联分项工程
			getData(id) {
				uni.showLoading();
				this.$api.allListBidByOrgId({ projectId: id }).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						this.checkboxList = res.data;
						this.checkboxList.forEach(item => {
							if (item.isChecked == 2) {
								item.disabled = true;
							}
							if (item.isChecked == 1) {
								this.checkboxValue.push(item.pkId);
							}
						});
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		background-color: #fff;
	}

	/deep/ .u-checkbox {
		height: 100rpx;
		border-bottom: 1px solid #ccc;
		padding: 0 20rpx;
	}

	.pdb {
		height: 100rpx;
	}
</style>