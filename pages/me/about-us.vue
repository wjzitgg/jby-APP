<template>
	<view class="content wrapper">
		<u-navbar leftText="关于我们" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="service">
			<view class="main-head">
				<view class="rectangle"></view>
				公司信息
			</view>
			<view class="main-content">
				<view class="call">公司地址：{{ formData.address }}</view>
				<view class="call">联 &nbsp;系&nbsp;人：{{ formData.linkMan }}</view>
				<view class="call">联系电话：{{ formData.linkPhone }}</view>
			</view>
		</view>
		<view class="help"><map :latitude="res.longitude" :longitude="res.latitude" :markers="covers" v-if="mapShow" style="width: 750rpx; height: 600rpx;"></map></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			res: {
				latitude: "113.62",
				longitude: "23.15"
			},
			formData: {
				address: "广州市增城区金融大道长风国际7栋106号",
				linkMan: "王先生",
				linkPhone: "13928895210"
			},
			mapShow: false,
			covers: [
				{
					id: 0,
					longitude: 113.62,
					latitude: 23.15,
					iconPath: "/static/image/location.png"
				}
			]
		};
	},
	onLoad(options) {
		// this.getCustomerTelephone();
		let addres = [
			{
				id: 1,
				latitude: 23.15,
				longitude: 113.62,
				iconPath: "/static/image/location.png"
			}
		];
		this.covers = addres;
		this.$nextTick(() => {
			this.mapShow = true;
		});
	},
	methods: {
		getCustomerTelephone() {
			this.$api.getCompanyDate().then(res => {
				if (res.code === 200) {
					this.formData = res.data;
					let addres = [
						{
							id: 1,
							latitude: 23.15,
							longitude: 113.62,
							iconPath: "/static/image/location.png"
						}
					];
					this.covers = addres;
					this.$nextTick(() => {
						console.log(this.covers);
						this.mapShow = true;
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
* {
	box-sizing: border-box;
}
page {
	background-color: #fff;
}
.call {
	font-size: 28rpx;
	margin-bottom: 32rpx;
	line-height: 1.3;
	color: #203457;
}
.service {
	margin-bottom: 20rpx;
	// padding: 2rpx;
	padding-top: 24rpx;
}
.main-head {
	position: relative;
	padding: 0 40rpx;
	color: #4b7909e7;
	height: 46rpx;
	line-height: 46rpx;
	font-size: 30rpx;
	font-weight: 700;
	border-bottom: 1px solid #d6d7d97d;
	.rectangle {
		position: absolute;
		width: 12rpx;
		height: 36rpx;
		left: 24rpx;
		bottom: 6rpx;
		vertical-align: bottom;
		background-color: #f59a23;
		// border: 1px solid #000;
	}
}
.main-content {
	width: 100%;
	// height: 150rpx;
	padding: 30rpx;
	border-bottom: 1px solid #d6d7d97d;
}
.questions {
	width: 100%;
	padding: 30rpx;
	.questions-item {
		font-size: 28rpx;
		margin-bottom: 30rpx;
	}
	.que {
		margin-bottom: 10rpx;
	}
}
</style>
