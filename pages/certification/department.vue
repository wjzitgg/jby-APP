<template>
	<view class="wrapper">
		<u-navbar leftText="部门管理" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="search">
			<u-input placeholder="请输入部门名称" v-model="searchData.deptName" class="search-input" maxlength="25">
				<view slot="suffix"><u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon></view>
			</u-input>
		</view>
		<view class="content">
			<scroll-view scroll-y="true">
				<view class="item" v-for="(item, index) in dataList" :key="index" @click="operate(item.pkId)">
					<image src="../../static/image/icon_home_u257_mouseOver.png" mode="aspectFit"></image>
					<view class="item-name">
						<view class="dep-name">{{ item.deptName }}</view>
						<view class="remark">{{ item.remark ? item.remark : '暂无描述' }}</view>
					</view>
					<view class="number">{{ item.deptNum }}人</view>
				</view>
			</scroll-view>
		</view>
		<view class="btn" v-if="$auth('org:dept:add')" @click="addDep('')">新增部门</view>
		<!-- 操作栏 -->
		<u-action-sheet :actions="list" cancelText="取消" title="操作" :show="show" round="10" @select="selectClick"
			@close="close"></u-action-sheet>
		<u-modal :show="show2" title="提示" content="确定删除此部门吗？" showCancelButton @cancel="show2 = false"
			@confirm="confirm"></u-modal>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchData: {
				deptName: "", // 部门名称
				pageNum: 1,
				pageSize: 20
			},
			dataList: [],
			pkId: "",
			show: false,
			list: [
				// {
				// 	name: "编辑",
				// 	val: "0"
				// },
				// {
				// 	name: "删除",
				// 	val: "1",
				// 	color: "#FF2626"
				// }
			],
			show2: false
		};
	},
	onShow() {
		this.getData();
	},
	mounted() {
		if (this.$auth('org:dept:edit')) {
			this.list.push(
				{
					name: "编辑",
					val: "0"
				}
			)
		}
		if (this.$auth('org:dept:delete')) {
			this.list.push(
				{
					name: "删除",
					val: "1",
					color: "#FF2626"
				}
			)
		}
	},
	methods: {
		getData() {
			this.$api.getdepList(this.searchData).then(res => {
				if (res.code === 200) {
					this.dataList = res.data.records;
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			});
		},
		operate(id) {
			if(!this.list.length) return
			this.pkId = id;
			this.show = true;
		},
		// 操作
		selectClick(index) {
			console.log(index);
			if (index.val == 1) {
				this.show2 = true;
			} else {
				this.addDep(this.pkId);
			}
		},
		close() {
			this.show = false;
		},
		// 新增部分
		addDep(id) {
			let ID = id ? id : "";
			uni.navigateTo({
				url: "/pages/certification/addDep?pkId=" + ID
			});
		},
		confirm() {
			this.show2 = false;
			this.deleteDep();
		},
		deleteDep() {
			uni.showLoading({
				mask: true
			});
			this.$api.deleteDep({ deptId: this.pkId }).then(res => {
				uni.hideLoading();
				if (res.code === 200) {
					uni.showToast({
						title: "删除部门成功",
						icon: "success",
						mask: true
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: "none",
						mask: true
					});
				}
				this.getData()
			});
		},
		search() {
			this.getData();
		}
	}
};
</script>

<style lang="scss">
.search {
	position: fixed;
	/*#ifdef APP-PLUS*/
	top: 80px;
	z-index: 888888;
	/*#endif*/
	/*#ifdef H5*/
	// top: 88rpx;
	/*#endif*/
	width: 100%;
	background: #fff;
	height: 100rpx;
	display: flex;
	align-items: center;
	padding: 18rpx 32rpx;
	z-index: 999999999999999;
	.search-input {
		padding: 0 18rpx !important;
	}
}

.content {
	padding-top: 108rpx;
	
	.item {
		background-color: #fff;
		display: flex;
		padding: 28rpx 40rpx 28rpx 28rpx;
		margin-bottom: 8rpx;

		image {
			width: 32rpx;
			height: 32rpx;
			margin-right: 21rpx;
		}

		.item-name {
			flex: 1;

			.dep-name {
				font-size: 28rpx;
				padding-bottom: 10rpx;
			}

			.remark {
				font-size: 24rpx;
				color: #a6aebc;
			}
		}

		.number {
			padding: 0 20rpx;
			height: 40rpx;
			line-height: 40rpx;
			text-align: center;
			border-radius: 8rpx;
			font-size: 24rpx;
			background: #cfe0ff;
			margin: auto;
			color: #4d7ed1;
		}
	}
}
/deep/ .uni-scroll-view-content{
	padding-bottom: 58px;
}
</style>
