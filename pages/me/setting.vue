<template>
	<!-- wrapeer 公用类 去除顶部padding -->
	<view class="wrapper">
		<!-- 公用导航栏 -->
		<u-navbar leftText="设置" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<u-cell-group class="popup-main">
			<u-cell title="头像" :allow="false">
				<template slot="right-icon">
					<u-avatar class="user-info-header" :src="userInfo.portraitUrl" size="50" @click="openAlbum" bg-color="#fff"></u-avatar>
				</template>
			</u-cell>
			<u-cell title="修改手机号码" isLink url="/pages/me/amend-phone"></u-cell>
			<u-cell title="修改实名信息" isLink url="/pages/me/amend-certification"></u-cell>
			<u-cell title="注销账号" isLink url="/pages/me/cancel"></u-cell>
			<!--隐私政策 https://erp.jianwangkeji.cn/h5/yinsixieyi.html -->
			<u-cell title="隐私政策" isLink url="/pages/me/privacy"></u-cell>
			<!-- <u-cell title="修改登录密码" isLink url="/pages/me/amend-password"></u-cell> -->
		</u-cell-group>
	</view>
</template>

<script>
import request from '../../common/request';
export default {
	data() {
		return {
			bgColor: "rgb(0 0 0 / 0%)"
		};
	},
	methods: {
		openAlbum() {
			let that =this
			uni.chooseImage({
				count: 1,
				sizeType: ["original", "compressed"],
				sourceType: ["album"], //这要注意，camera掉拍照，album是打开手机相册
				success: res => {
					uni.uploadFile({//将本地资源上传到开发者服务器
					url:request.baseUrl + '/app/file/upload/picture', //接口地址
					filePath: res.tempFilePaths[0],//图片地址
					name: 'file',
					formData:{},
					header: {
					// 示例参数可删除
					'Authorization': uni.getStorageSync("token"),
				},
					success: (uploadFileRes) => {
						let data = JSON.parse(uploadFileRes.data)
						console.log(data);
						this.$api.modifyPhoto({url:data.data}).then(res=>{
							if(res.code===200){
								uni.showToast({
									title: '修改成功',
									icon: 'success'
								})
								that.getInfo()
							}else{
								uni.showToast({title:res.msg,icon:"none"})
							}
						})
					}
				});
				}
			});
		},
		// 获取个人信息
		getInfo() {
			this.$api.getInfo().then(res => {
				if (res.code === 200) {
					this.$store.commit("saveUserInfo", res.data);
					uni.setStorageSync('user', res.data);
				}
			});
		},
	},
	computed: {
		userInfo() {
			return this.$store.state.userInfo;
		}
	}
};
</script>

<style lang="scss" scoped>
.popup-main{
	margin-top: 10rpx;
	background-color: #fff;
}
</style>
