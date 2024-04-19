<template>
	<view class="global" :point="point" :change:point="allmap.receiveMsg">
		<view class="header"><view id="allmap" class="map"></view></view>
	</view>
</template>

<script module="allmap" lang="renderjs">
import { mymap } from "@/common/myMap.js";
var bmap = null;
export default {
	mounted(){
		// this.init(this.point);
	},
methods: {
    init(poi){
        mymap().then(mymap => {
        // 创建百度地图实例
	    bmap = new BMapGL.Map("allmap");
	    let point = new BMapGL.Point(poi[0], poi[1]);
	    // let point = new BMapGL.Point(113.820953,23.283712);
	    bmap.centerAndZoom(point, 16); //设置缩放级别
	    console.log(bmap, "this.map ",point);
        var marker = new BMapGL.Marker(point); // 创建标注
        bmap.addOverlay(marker); // 将标注添加到地图中
	    bmap.enableScrollWheelZoom();
        });
    },
    receiveMsg(newValue, oldValue, ownerVm, vm) {

			if(newValue[0] !== 110){
				console.log("刚进来就执行",newValue);
				this.init(newValue);
			}

    },
}
};
</script>

<script>
export default {
	props: {
		latitude: '',
		longitude: '',
		mapStyle: {
			type: Object,
			default: () => {
				return {
					width: '750rpx',
					height: '600rpx'
				};
			}
		}
	},
	mounted() {
		this.point = [this.longitude, this.latitude];
	},
	data() {
		return {
			point: [110, 34.276184]
		};
	}
};
</script>

<style lang="scss" scoped>
#allmap {
	width: 750rpx;
	height: 600rpx;
}
</style>
