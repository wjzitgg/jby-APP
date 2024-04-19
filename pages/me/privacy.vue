<template>
	<web-view :src="urls" />
</template>

<script>
export default {
	data() {
		return {
			urls: 'https://erp.jianwangkeji.cn/h5/yinsixieyi.html'
		};
	},
	onLoad(option) {
		console.log(option);
		if (option.num == 1) {
			uni.setNavigationBarTitle({
				title: '服务协议'
			});
			// this.urls = 'https://erp.jianwangkeji.cn/h5/fuwuxieyi.html';
		}
	}
};
</script>

<style></style>
