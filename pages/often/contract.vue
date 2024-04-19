<template>
	<view class="content wrapper">
		<u-navbar leftText="劳务合同" bgColor="rgb(0 0 0 / 0%)"  leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="bg"></view>
		<view class="pad"></view>
		<view class="search">
		
			<u-tabs
  class="search-btn"
  mode="subsection"
  :list="topList"
  :current="current"
  @change="sectionChange"
  :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"

>

</u-tabs>
		
		</view>
			
		<z-paging class="list" ref="paging" v-model="showList" @query="queryList" refresher-only refresher-threshold="120rpx">
			<view :animation="animationData" @touchstart="touchstart" @touchend="touchend" :style="{ height: height + 'px' }">
				<u-cell-group v-if="showList.length">
					<u-cell isLink v-for="(item, index) in showList" :key="index" class="item" @click="go(item)" :rightIconStyle="{ fontSize: '60rpx' }">
						<view slot="title">
							<view class="item-head">{{ item.createTime }}</view>
							<view class="item-type">{{ item.contractName }}</view>
							<view class="item-project">施工项目：{{ item.projectName }}</view>
							<view class="item-unit">服务单位：{{ item.orgName }}</view>
							<view class="item-class">所在班组：{{ item.className }}</view>
							<image src="../../static/image/yizuofei-icon.png" mode="widthFix" class="item-state" v-if="current === 2"></image>
							<image src="../../static/image/yiguoqi-icon.png" mode="widthFix" class="item-state" v-if="current === 3"></image>
						</view>
					</u-cell>
				</u-cell-group>
				<u-empty style="height: 100%" mode="data" icon="/static/image/noData.png" v-if="!showList.length"></u-empty>
			</view>
		</z-paging>
		<!-- <u-toast ref="uToast"></u-toast> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			showList: [
				// {
				//   contractName: "劳务合同",
				//   createTime: "2022-5-10",
				//   orgName: "广东路桥施工承包队",
				//   className: "路基班组",
				//   projectName: "XX标段项目A1",
				//   templateUrl:
				//     "https://epms-1307524156.cos.ap-guangzhou.myqcloud.com/2022062716193262b96814848e09d6bdd6c233.pdf",
				// },
				// {
				//   contractName: "临时工劳务合同",
				//   createTime: "2021-11-10",
				//   orgName: "广东路桥施工承包队",
				//   className: "路基班组",
				//   projectName: "XX标段项目A1",
				//   templateUrl:
				//     "https://epms-1307524156.cos.ap-guangzhou.myqcloud.com/2022062716193262b96814848e09d6bdd6c233.pdf",
				// },
			],
			topList: [   
				    {name:'待签合同'},
					{name:'已签合同'},
					{name:'作废合同'},
					{name:'过期合同'}
			// '待签合同', '已签合同', '作废合同', '过期合同'
		],

			current: 0,
			height: '',
			startX: '',
			show: false,
			animationData: {}
		};
	},
	onLoad(options) {
		this.animation = uni.createAnimation({
			timingFunction: 'ease',
			duration: 120
		});
		let winHeight = uni.getWindowInfo().windowHeight;
		if (process.env.UNI_PLATFORM == 'h5') {
			this.height = winHeight;
		} else {
			this.height = (winHeight / 750) * (winHeight - 60);
		}
		this.getContractList(this.current);
	},
	methods: {
		go(item) {
			if (this.current === 0) {
				this.$store.commit('isEsign', true);
				this.findContractDocumentStatus(item);
			} else {
				uni.navigateTo({
					url: `/pages/waiting/contractDetail?row=${JSON.stringify({fkBusinessId:item.fkContractId})}`
				});
			}
		},
		// sectionChange(index) {
		// 	this.current =index;
		// 	this.showList = [];
		// },
		sectionChange(item){
            if(this.current===item.index){
				 return
			}
		   this.current =item.index;
			this.showList = [];
		},

		touchstart(e) {
			this.startX = e.changedTouches[0].clientX;
		},
		touchend(e) {
			let endX = e.changedTouches[0].clientX;
			if (this.startX > endX && this.startX - endX > 100) {
				if (this.current < 3) {
					this.current += 1;
					// 动画：右出左进
					this.animation
						.translateX('100%')
						.step() //先横向向右移⾄100%，即整块移没
						.opacity(0)
						.step({ duration: 10 }) //再使题⽬部分透明
						.translateX('-100%')
						.step({ duration: 10 }) //然后趁透明横向向左移⾄-100%
						.translateX(0)
						.opacity(1)
						.step(); //接着横向向右移动⾄初始位置并恢复透明度
					this.animationData = this.animation.export(); //动态动画
					// 为避免uniapp动画只有第⼀次⽣效，必须延迟删除动画实例数据
					setTimeout(() => {
						this.animationData = {};
					}, 250);
					this.showList = [];
				}
			} else if (this.startX < endX && endX - this.startX > 100) {
				if (this.current > 0) {
					this.current -= 1;
					// 动画：左出右进
					this.animation
						.translateX('-100%')
						.step()
						.opacity(0)
						.step({ duration: 10 })
						.translateX('100%')
						.step({ duration: 10 })
						.translateX(0)
						.opacity(1)
						.step();
					this.animationData = this.animation.export();
					setTimeout(() => {
						this.animationData = {};
					}, 250);
					this.showList = [];
				}
			}
		},
		getContractList(type) {
			uni.showLoading({ title: '加载中...', mask: true });
			this.$api
				.getContractList({ type })
				.then(res => {
					console.log(res);
					if (res.code === 200) {
						this.showList = res.data ? res.data : [];
					}
					uni.hideLoading();
					this.$refs.paging.endRefresh();
				})
				.catch(err => {
					uni.hideLoading();
					this.$refs.paging.endRefresh();
				});
		},
		findContractDocumentStatus(item) {
			let data = {
				fkTemplateId: item.fkTemplateId,
				redirectUrl: 'https://erp.jianwangkeji.cn/back.html',
				signValidity: item.signValidity,
				templateId: item.templateId
			};
			uni.showLoading({ title: '加载中...', mask: true });
			this.$api.findContractDocumentStatus(data).then(res => {
				uni.hideLoading();
				if (res.code === 200) {
					uni.navigateTo({
						url: `/pages/esign/esign?url=${encodeURIComponent(JSON.stringify(res.data.signUrl))}`
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						mask: true
					});
					uni.hideLoading();
				}
			});
		},
		queryList() {
			this.getContractList(this.current);
		
		}
	},
	watch: {
		current(val) {
			this.getContractList(val);
			this.animation
				.translateX('100%')
				.step() //先横向向右移⾄100%，即整块移没
				.opacity(0)
				.step({ duration: 10 }) //再使题⽬部分透明
				.translateX('-100%')
				.step({ duration: 10 }) //然后趁透明横向向左移⾄-100%
				.translateX(0)
				.opacity(1)
				.step(); //接着横向向右移动⾄初始位置并恢复透明度
			this.animationData = this.animation.export(); //动态动画
			// 为避免uniapp动画只有第⼀次⽣效，必须延迟删除动画实例数据
			setTimeout(() => {
				this.animationData = {};
			}, 250);
		}
	}
};
</script>

<style lang="scss" scoped>
.bg {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: -1;
	background-color: #f2f2f2;
}
* {
	box-sizing: border-box;
}
.content {
	height: 100%;
}
.search {
	background-color: #fff;
	position: fixed;
	width: 100%;
	/*#ifdef APP-PLUS*/
	top: 166rpx;
	/*#endif*/
	/*#ifdef H5*/
	top: 88rpx;
	/*#endif*/
	z-index: 5;
	display: flex;
	justify-content: space-between;
}
.list {
//   padding-top: 60rpx;
   margin-top: 12px;
}
.item {
	position: relative;
	width: 100%;
	// margin-bottom: 20rpx;
	background-color: #fff;
	.item-head {
		margin-bottom: 10rpx;
		font-size: 36rpx;
		font-weight: 700;
	}
	.item-type {
		font-weight: 700;
		margin-bottom: 10rpx;
		font-size: 28rpx;
	}
	.item-unit,
	.item-project {
		margin-bottom: 10rpx;
	}
	.item-unit,
	.item-project,
	.item-class {
		font-size: 28rpx;
		color: #7f7f7f;
	}
	.item-state {
		position: absolute;
		right: 0;
		top: 0;
		z-index: 8;
		width: 90rpx;
	
	}
}
.u-subsection {
	background-color: #fff;
}
.list {
	/*#ifdef APP-PLUS*/
	padding-top: 210rpx;
	/*#endif*/
	/*#ifdef H5*/
	padding-top: 140rpx;
	/*#endif*/
	
}
.search-btn{
	display: flex;
	 width: 100%;
}



</style>
