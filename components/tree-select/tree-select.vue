<template>
	<view class="">
		<u-popup :show="selectShow">
			<view class="selectShow">
				<view class="tit-top">
					<view class="head">
						<view class="name">选择分项</view>
						<u-icon name="close" class="closeBtn" @click="selectShow = false"></u-icon>
					</view>
					<!-- <view class="search-top">
						<u-input placeholder="请输入内容" border="surround" class="feed">
							<template slot="suffix">
								<u-icon name="search" size="28" color="#2a82e4"></u-icon>
							</template>
						</u-input>
					</view> -->
					<view class="tabs-tit" v-if="checkedList.length">
						<u-icon name="arrow-left" class="left-icon" size="24" @click="checkedList = []"></u-icon>
						<text v-for="(item, index) in checkedList" :key="index">{{ item[showName] }}</text>
					</view>
				</view>
				<scroll-view scroll-y class="tree">
					<view>
						<u-list @scrolltolower="scrolltolower" v-if="checkedList.length == 0">
							<u-list-item v-for="(item, index) in treeData" :key="index">
								<u-cell :title="item[showName]" @click="pitchOn(item)"><u-icon v-if="item.grade!=3" slot="right-icon" name="arrow-right"></u-icon></u-cell>
							</u-list-item>
						</u-list>
						<u-list @scrolltolower="scrolltolower" v-else>
							<u-list-item v-for="(item, index) in treeData2" :key="index">
								<u-cell :title="item[showName]" @click="pitchOn(item)">
									<u-icon v-if="item.grade!=3" slot="right-icon" name="arrow-right"></u-icon>
								</u-cell>
							</u-list-item>
						</u-list>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	// 接收参数
	props: {
		list: {
			type: Array,
			default: function() {
				return [];
			}
		},
		showName:{
			type:String,
			default:'itemName'
		}
	},
	data() {
		return {
			selectShow: false,
			checkedList: [], // 已选中 用来展示选中一二三级
			treeData2: [], // 用来展示选择tree children 的数据
			treeData:[]
		};
	},
	watch:{
		list(){
			this.treeData=this.list.filter(item=>item.grade==1)
		}
	},
	methods: {
		scrolltolower(){},
		pitchOn(item) {
			if (item.grade==3) {
				this.selectShow = false;
				this.$emit("checked", item);
			} else {
				this.checkedList.push(item);
				console.log(item);
				this.treeData2 = this.list.filter(ite=>ite.fkParentId==item.pkId);
			}
			// this.selectShow = false;
			// item.applyNum = "";
			// this.materialData = item;
		}
	}
};
</script>

<style lang="scss" scoped>
// 物料选择
.selectShow {
	height: 1000rpx;
	.tit-top {
		margin-bottom: 18rpx;
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		// line-height: 80rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
	}
	.search-top {
		width: 686rpx;
		height: 64rpx;
		margin: 0 auto;
		.feed {
			width: 100%;
			height: 100%;
		}
	}
	.tabs-tit {
		height: 100rpx;
		padding-left: 100rpx;
		padding-top: 10rpx;
		position: relative;
		.left-icon {
			position: absolute;
			top: 10rpx;
			left: 24rpx;
			width: 60rpx;
			height: 80rpx;
			border-radius: 4rpx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 4rpx 8rpx 0px rgba(0, 0, 0, 0.25);
		}
		text {
			font-size: 28rpx;
			display: inline-block;
			width: 200rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			padding: 0 16rpx;
			opacity: 1;
			border-radius: 4rpx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 4rpx 8rpx 0px rgba(0, 0, 0, 0.25);
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
	.tree {
		padding-left: 30rpx;
		/deep/ .u-cell__body {
			padding-left: 0;
		}
	}
}
/deep/.u-list{
	height: 840rpx !important;
}
</style>
