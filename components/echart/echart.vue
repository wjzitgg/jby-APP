<template>
  <view>
    <view
      class="echarts"
      id="echarts"
      style="background-color: #fff"
	  :style="{width: width + 'rpx', height: height + 'rpx'}"
      :prop='option'
      :change:prop="echarts.updateEcharts"
    ></view>
  </view>
</template>

<script module="echarts" lang="renderjs">
import * as echarts from "echarts";
	let myChart
	export default {
		mounted() {
			// if (typeof window.echarts === 'function') {
			// 	this.initEcharts()
			// } else {
			// 	// 动态引入较大类库避免影响页面展示
			// 	const script = document.createElement('script')
			// 	// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算
			// 	script.src = 'static/echarts.js'
			// 	// script.onload = this.initEcharts.bind(this)
			// 	document.head.appendChild(script)
			// }
            this.initEcharts(this.option)
		},
		methods: {
			initEcharts(option) {
				myChart = echarts.init(document.getElementById('echarts'))
				// 观测更新的数据在 view 层可以直接访问到
				myChart&&myChart.setOption(option)
			},
			updateEcharts(newValue, oldValue, ownerInstance, instance) {
				// 监听 service 层数据变更
				myChart&&myChart.setOption(newValue)
			},
			onClick(event, ownerInstance) {
				// 调用 service 层的方法
				ownerInstance.callMethod('onViewClick', {
					test: 'test'
				})
			}
		}
	}
</script>

<script>
export default {
    props:{
        option:{
            type:Object,
        },
		width:{
			type:Number,
			default:750
		},
		height:{
			type:Number,
			default:600
		}
    }

};
</script>

<style lang="scss" scoped></style>
