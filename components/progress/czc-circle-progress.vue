<template>
	<view class="">
		<view class="box">
			<view class="circle" :style="[circle]">
				<view class="left" :style="[size]">
					<view class="left-circle"
						:style="[size,leftCircle,leftValue]">
					</view>
				</view>
				<view class="right" :style="[size]">
					<view class="right-circle" :style="[size,rightcircle,rightValue]"></view>
				</view>
				<view class="inner" :style="[inner]">
					{{value}}%
				</view>
				<view class="order-inner" :style="[orderInner]"></view>
			</view>
		</view>
	</view>
</template>

<script>
	/*
	 * countDown 圆形进度条，不使用canvas,仅css实现
	 * @property {Number} widths 圆环的总体大小 (单位px)
	 * @property {Number} breadth 圆环中间区域的大小 (单位px)
	 * @property {activeColor} activeColor 圆环中间区域的背景色
	 * @property {String} defaultColor 圆环中间区域默认的背景颜色
	 */
	export default {
		props: {
			value: {
				type: Number,
				default: 10
			},
			widths: {
				type: Number,
				default: 50
			},
			breadth: {
				type: Number,
				default: 6
			},
			activeColor: {
				type: String,
				default: '#10b060'
			},
			defaultColor: {
				type: String,
				default: '#FAFBFF'
			},
		},
		data() {
			return {
			}
		},
		mounted() {
		},
		methods: {
		},
		computed: {
			circle() {
				const {
					widths,
					defaultColor
				} = this
				return {
					width: `${widths}rpx`,
					height: `${widths}rpx`,
					background: defaultColor
				}
			},
			size() {
				const {
					widths
				} = this
				return {
					width: `${(widths) /2 + 10}rpx`,
					height: `${widths + 20}rpx`
				}
			},
			leftCircle() {
				const {
					widths,
					activeColor
				} = this
				return {
					borderTopLeftRadius: `${widths + 10}rpx`,
					borderBottomLeftRadius: `${widths + 20}rpx`,
					background: activeColor
				}
			},
			rightcircle() {
				const {
					widths,
					activeColor
				} = this
				return {
					borderTopRightRadius: `${widths + 10}rpx`,
					borderBottomRightRadius: `${widths + 20}rpx`,
					background: activeColor
				}
			},
			leftValue() {
				const {
					value,
				} = this
				let val = value>100?100:value
				let str = val<=50?'rotate(180deg)':`rotate(${(((val-50)/50)*180)+180}deg)`
				return {
					transform: str
				}
			},
			rightValue() {
				const {
					value
				} = this
				let val = value>100?100:value
				let str = val>=50?'rotate(0deg)':`rotate(${((val/50)*180)-180}deg)`
				return {
					transform: str
				}
			},
			inner() {
				const {
					widths,
					breadth
				} = this
				return {
					width: `${widths - breadth}rpx`,
					height: `${widths - breadth}rpx`,
					
				}
			},
			orderInner() {
				const {
					widths,
					breadth
				} = this
				return {
					width: `${widths - breadth + 20}rpx`,
					height: `${widths - breadth + 20}rpx`,
				}
			}
		},
		watch: {

		}
	}
</script>

<style>
	.circle {
		border-radius: 50%;
		position: relative;
	}

	.left,
	.right {
		position: absolute;
		overflow: hidden;
		top: -10rpx;
		z-index: 2;
	}

	.left-circle {
		transition: all .5s;
		transform-origin: right center;
		transform: rotate(180deg);
	}

	.right-circle {
		transition: all .5s;
		transform-origin: left center;
		transform: rotate(-180deg);
	}
	.left{
		left: -10rpx;
	}
	.right {
		right: -10rpx;
	}

	.inner {
		background: #fff;
		position: absolute;
		z-index: 999;
		border-radius: 100%;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #A8A8A8;
	}
	.order-inner{
		background: #fff;
		position: absolute;
		z-index: 1;
		border-radius: 100%;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #A8A8A8;
	}
</style>
