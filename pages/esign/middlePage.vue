<template>
	<!-- 中间页，解决e签宝不跳转或导致app页面失效问题 -->
	<view>

	</view>
</template>

<script>
	export default {
		onLoad(options) {
			console.log(options);
			if (this.$store.state.isSign) {
				uni.navigateBack();
				this.$store.commit("saveIsSign", false);
			} else if (this.$store.state.contentSign) {
				this.$store.commit("saveContentSign", false);
				uni.navigateBack({ delta: 2 });
			} else if (this.$store.state.approveSign) {
				console.log("进入");
				let pages = getCurrentPages();
				console.log(pages);
				// if(this.$store.state.todo){
				//   let prevPage = pages[pages.length - 3]; // 上一页面实例
				//   prevPage.$vm.resh()
				//   this.$store.commit("saveTodo", false);
				//   uni.navigateBack({ delta: 2 });
				// }else{
				let prevPage = pages[pages.length - 4]; // 上一页面实例
				prevPage.$vm.resh(); // 调用上一页 定义的方法
				uni.navigateBack({ delta: 3 });
				// }
				this.$store.commit("saveTodo", false);
				this.$store.commit("saveApproveSign", false);

			} else if (this.$store.state.busCert) {
				uni.navigateBack({ delta: 2 });
				this.$store.commit("saveBusCert", false);
			} else if (this.$store.state.enterAuth) {
				uni.navigateBack();
				this.$store.commit("isEnterAuth", false);
			} else if (this.$store.state.cerEsign) {
				let pages = getCurrentPages();
				console.log("222222");
				let prevPage = pages[pages.length - 2]; // 上一页面实例
				prevPage.$vm.resh(); // 调用上一页 定义的方法
				uni.navigateBack();
				this.$store.commit("isCerEsign", false);
			} else if (options.type == 1) {
				uni.navigateBack({ delta: 2 });
				uni.showToast({ title: "邀签成功" });
			} else if (options.type == 2) {
				uni.navigateBack({ delta: 3 });
				uni.showToast({ title: "邀签成功" });
			}
		}
	};
</script>

<style>

</style>