<template>
	<view>
		<movable-area class="fixed-box">
			<movable-view class="fixed-button" direction="all" :inertia="true" y="100px">
				<view class="menuBox">
					<view :animation="animationData" class="file-list" v-if="off">
						<!-- open-type="contact"  -->
						<button class="btn-box" hover-class="none" @click="btnClick(0)"><text>技术规范</text></button>
						<button class="btn-box" hover-class="none" @click="btnClick(1)"><text>安全规范</text></button>
						<button class="btn-box" hover-class="none" @click="btnClick(3)"><text>流程图</text></button>
						<button class="btn-box" hover-class="none" @click="btnClick(4)"><text>工程图纸</text></button>
						<button class="btn-box" hover-class="none" @click="btnClick(2)"><text>验收标准</text></button>
					</view>
					<view class="mainMenu" :class="off ? 'bgc' : ''" @click="declick" v-if="arrLength > 1">
						<u-icon name="file-text" size="26"></u-icon>
						常用功能
					</view>
					<view class="mainMenu" :class="off ? 'bgc' : ''" @click="btnClick(3)" v-else>
						<u-icon name="file-text" size="26"></u-icon>
						流程图
					</view>
				</view>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				animationData: {},
				off: false
			};
		},
		props: {
			technology: {
				type: Boolean,
				default: false
			}, //技术
			safety: {
				type: Boolean,
				default: false
			}, //安全
			process: {
				type: Boolean,
				default: false
			}, //流程
			project: {
				type: Boolean,
				default: false
			}, //工程图纸
			inspection: {
				type: Boolean,
				default: false
			}, //验收标准
			arrLength: {
				type: Number,
				default: 1
			} // 默认5个 传1只有一个按钮，传几个就几个按钮
		},
		mounted() {
			// this.animation = uni.createAnimation();
			var animation = uni.createAnimation({
				duration: 500,
				trmingFunction: "ease"
			});
			this.animation = animation;
		},
		methods: {
			// 悬浮按钮
			declick() {
				if (this.arrLength !== 1) {
					this.off = !this.off;
				}
				if (this.off) {
					//使用动画
					this.rotateAndScale();
				} else {
					this.norotateAndScale();
				}
			},
			//定义动画内容
			rotateAndScale() {
				// return  console.log(this.animation)167let
				let num = 0;
				// if (this.arrLength == 5) {
				// 	num = -100;
				// } else if (this.arrLength == 4) {
				// 	num = -160;
				// } else if (this.arrLength == 3) {
				// 	num = -140;
				// } else if (this.arrLength == 2) {
				// 	num = -120;
				// } else if (this.arrLength == 1) {
				// 	num = -100;
				// }
				this.animation
					.rotate(0)
					.translateY(num)
					.step();
				//导出动画数据传递给data层
				this.animationData = this.animation.export();
			},
			//当!off的时候动画回到原始位置
			norotateAndScale() {
				// return  console.log(this.animation)
				this.animation
					.rotate(0)
					.translateY(0)
					.step();
				this.animationData = this.animation.export();
			},
			btnClick(idx) {
				this.$emit("tabsExamine", idx);
				this.declick();
			}
		}
	};
</script>

<style lang="scss" scoped>
	button::after {
		border: none;
	}

	.fixed-box {
		pointer-events: none;
		width: 100vw;
		height: 100vh;
		position: fixed !important;
		left: 0;
		bottom: 0;
		z-index: 100000;
	}

	.fixed-button {
		pointer-events: auto;
		width: 180rpx;
		height: 80rpx;
		right: 0;
		left: auto;
		top: 84vh;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 40rpx;
		box-shadow: 0rpx 4rpx 8rpx 0rpx #b3b3b3;
	}

	.mainMenu {
		width: 180rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		border-radius: 40rpx;
		font-size: 24rpx;
	}

	.bgc {
		background-color: #eee !important;
	}

	.file-list {
		width: 180rpx;
		text-align: right;
		height: auto;
		position: absolute;
		bottom: 92rpx;
	}

	.posi {
		width: 96px;
		height: 420rpx !important;
		position: absolute;
		left: -6rpx;
		bottom: -316rpx;
		z-index: -1;
		display: flex;
		align-items: center;
		flex-direction: column;
		background-color: #fff;
		border-radius: 54rpx;
		font-size: 10px;

		.btn-icon {
			display: inline-block;
		}
	}

	.posi>image {
		width: 50rpx;
		height: 50rpx;
		margin-top: 30rpx;
	}

	.btn-box {
		background-color: #fff;
		display: inline-block;
		width: 160rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 40rpx;
		border: 1px solid #eee;
		margin-top: 12rpx;
		// font-size: 24rpx;
		font-size: 20rpx
	}

	.posi .btn-box:first-child {
		background-color: transparent;
		display: inline-block;
		margin-top: 20rpx;
		line-height: 1.7;
	}

	/* 适配iphonex 有底部横条的 */
	@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
		.fixed-box {
			bottom: constant(safe-area-inset-bottom);
			bottom: env(safe-area-inset-bottom);
		}
	}
</style>