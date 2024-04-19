<!-- 设置审批负责人 -->
<template>
	<view class="wrapper">
		<u-navbar leftText="流程图" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="box">
			<multiflowChart :data="approverList"></multiflowChart>
		</view>
		<!-- <view class="btn" @click="set">设置</view> -->
	</view>
</template>

<script>
	import multiflowChart from "../../components/multiflow-chart/multiflow-chart.vue";
	export default {
		components: {
			multiflowChart
		},
		data() {
			return {
				approverList: {
					workflowNodeDTOS: [],
				},
			};
		},
		onLoad(option) {
			this.approverList = JSON.parse(option.row);
			console.log("Xxxxxxxxxxxxxxxxxxxxx")
			console.log(this.approverList);
			console.log("Xxxxxxxxxxxxxxxxxxxxx")
			console.log(this.approverList);
			uni.getStorageSync("flow");
			console.log(uni.getStorageSync("flow"));
		},
	};
</script>

<style lang="scss" scoped>
	.box {
		background: #fff;
	}
</style>