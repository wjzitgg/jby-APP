<template>
	<view class="wrapper">
		<u-navbar leftText="项目概况" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="pdt-ios"></view>
		<!-- <definitionTable :formData="form"></definitionTable> -->
		<tableForm :pageHeight="false" :pageMr="false" :list="[
        { name: '项目名称', value: form.projectName, show: true },
        { name: '所属项目', value: form.itemName, show: true },
        {
          name: '项目地点',
          value: form.provinceName+'' + form.cityName + form.areaName,
          show: true,
        },
        { name: '建设单位', value: form.investorName, show: true },
        { name: '监理单位', value: form.supervisorName, show: true },
        { name: '设计院', value: form.designName, show: true },
        { name: '施工单位', value: form.contractorName, show: true },
        { name: '项目部', value: form.orgName, show: true },
        { name: '合同金额', value: form.contractAmount, show: true },
        { name: '工期', value: form.duration, show: true },
        { name: '开工日期', value: form.beginTime, show: true },
        { name: '竣工日期', value: form.endTime, show: true },
        { name: '标段描述', value: form.remark, show: true },
        { name: '具体地址', value: form.detailAddress, show: true },
      ]">
		</tableForm>
		<!-- <view class="card">
	  <view class="list-item">
			<text>标段名称</text>
			<text class="item">{{ form.projectName }}</text>
	  </view>
	  <view class="list-item">
			<text>标段区域</text>
			<text class="item">{{ form.provinceName +form.cityName+form.areaName }}</text>
	  </view>
	  <view class="list-item">
			<text>建设单位</text>
			<text class="item">{{ form.investorName }}</text>
	  </view>
	    <view class="list-item">
			<text>监理单位</text>
			<text class="item">{{ form.supervisorName }}</text>
	    </view>
	    <view class="list-item">
			<text>设计院</text>
			<text class="item">{{ form.designName }}</text>
	    </view>
	    <view class="list-item">
			<text>施工单位</text>
			<text class="item">{{ form.contractorName }}</text>
	    </view>
		<view class="list-item">
			<text>项目部</text>
			<text class="item">{{ form.orgName }}</text>
		</view>
		<view class="list-item">
			<text>合同金额</text>
			<text class="item">{{ form.contractAmount }}</text>
		</view>
		<view class="list-item">
			<text>工期</text>
			<text class="item">{{ form.duration }}</text>
		</view>
		<view class="list-item">
			<text>开工日期</text>
			<text class="item">{{ form.beginTime }}</text>
		</view>
		<view class="list-item">
			<text>竣工日期</text>
			<text class="item">{{ form.endTime }}</text>
		</view>
		<view class="list-item">
			<text>标段描述</text>
			<text class="item">{{ form.remark }}</text>
		</view>
		<view class="list-item">
			<text>具体地址</text>
			<text class="item">{{ form.detailAddress }}</text>
		</view>
	</view> -->
		<!-- <u-cell-group class="cell">
      <u-cell title="标段名称：" :value="form.projectName"></u-cell>
    </u-cell-group> -->
		<map :latitude="form.longitude" :longitude="form.latitude" :markers="covers" v-if="mapShow" style="
        width: 750rpx;
        height: 600rpx;
        padding: 20rpx;
        background-color: #fff;
      "></map>
	  <view class="pdb" v-if="$auth('project:situation:edit')"></view>
		<view type="primary" class="btn" @click="compile" v-if="$auth('project:situation:edit')">编辑</view>
	</view>
</template>

<script>
	// import maps from "../../components/map/map.vue";
	// import definitionTable from "../../components/definition-table.vue";
	import tableForm from "../../components/table-form/table-form.vue";
	export default {
		components: { tableForm },
		onLoad(options) {
			this.findProjectByProOrgId();
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo;
			},
		},
		data() {
			return {
				form: {
					address: "",
					areaName: "",
					beginTime: "",
					cityName: "",
					contractAmount: "",
					contractorName: "",
					designName: "",
					detailAddress: "",
					duration: "",
					endTime: "",
					fkOrgId: 0,
					investorName: "",
					latitude: "",
					longitude: "",
					orgName: "",
					pkId: 0,
					projectName: "",
					provinceName: "",
					remark: "",
					supervisorName: "",
				},
				mapShow: false,
				covers: [{
					id: 0,
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: "/static/image/location.png",
				}, ],
			};
		},
		methods: {
			resh() {
				this.findProjectByProOrgId();
			},
			compile() {
				let item = {
					itemTitle: "编辑项目概况",
					...this.form
				};
				uni.navigateTo({
					url: "/pages/project/infoAdd?row=" + JSON.stringify(item),
				});
			},
			findProjectByProOrgId() {
				let proOrgId =
					this.userInfo.orgType === 5 ?
					this.userInfo.orgId :
					uni.getStorageSync("nowOrgId");
				this.$api.findProjectByProOrgId({ proOrgId }).then(res => {
					if (res.code === 200) {
						this.form = res.data;
						let addres = [{
							id: 1,
							latitude: res.data.longitude - 0,
							longitude: res.data.latitude - 0,
							iconPath: "/static/image/location.png",
						}, ];
						this.covers = addres;
						this.$nextTick(() => {
							console.log(this.covers);
							this.mapShow = true;
						});
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
						});
					}
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
.pdb{
	height: 100rpx;
}
	.wrapper {
		padding-bottom: 102rpx;
	}

	.cell {
		background-color: #fff;
	}

	.card {
		background: #fff;
		width: 750rpx;
		// height: calc( 1306rpx - 242rpx);
		// border-left: 8rpx solid #dddddd;
		// padding: 24rpx 40rpx;
		margin-top: 2rpx;

		.list-item {
			height: 80rpx;
			line-height: 80rpx;
			font-size: 28rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			border-bottom: 1px solid rgba(238, 238, 238, 1);

			&:first-child {
				border-top: 1px solid rgba(238, 238, 238, 1);
			}

			text:first-child {
				display: inline-block;
				min-width: 196rpx;
				height: 80rpx;
				line-height: 80rpx;
				padding: 0 40rpx;
				border-right: 1px solid rgba(238, 238, 238, 1);
				text-align: justify;
				text-justify: distribute-all-lines;
				text-align-last: justify;
			}

			.item {
				display: inline-block;
				// width: 414rpx;
				padding-left: 10rpx;
				color: #79859a;
			}
		}
	}

	.btn {
		z-index: 99;
	}
</style>