<template>
  <view class="global" :point="point" :change:point="allmap.receiveMsg" :address="address" :change:address="allmap.receiveMsg2">
    <view class="header">
      <view class="btns">
        <view class="btns-item" @click="back">取消</view>
        <view class="btns-item blue" @click="btnOk" :disabled="!list.length">确认</view>
      </view>
      <view id="allmap" class="map">
      </view>
        <u-input
          placeholder="请输入搜索地址"
          border="surround"
          v-model="address"
        ></u-input>
      <view class="lists">
        <view class="lists-item" :class="{sel:selIdx==index}" v-for="(item,index) in list" :key="index" @click="selIdx=index">
          <view>{{item.formattedAddress}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script module="allmap" lang="renderjs">
import AMapLoader from '@amap/amap-jsapi-loader';
export default {
	mounted(){
		// this.init(this.point);
	},
	data(){
		return{
			point: {},
      		map:null,
      		marker:null,
      		timer:null
		}
	},
methods: {
    init(poi){
        let that =this
      let center =[116.397128,39.916527]
          if (poi[0]) {
          center =poi
        }
        console.log(AMapLoader);
    AMapLoader.load({
      key:"82d94d6a59eceae72dce5f3802c4fc0c",             // 申请好的Web端开发者Key，首次调用 load 时必填
      version:"2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins:['AMap.Geocoder'],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then((AMap)=>{
      this.map = new AMap.Map("allmap",{  //设置地图容器id
        viewMode:"2D",    //是否为3D地图模式
        zoom:10,           //初始化地图级别
        center:center, //初始化地图中心点位置
        // resizeEnable:true,
      });
      this.marker = new AMap.Marker({
        position: center,
        map: this.map
    });
    this.map.add(this.marker);
    // that.getLngAndLat('故宫博物院')
    var geocoder = new AMap.Geocoder({ city: '全国'})
    geocoder.getAddress(center,(status, result)=>{
        if (status === 'complete'&&result.regeocode) {
          // let addressComponents=result.regeocode.addressComponent
          that.getLngAndLat(result.regeocode.formattedAddress)
          // that.$ownerInstance.callMethod('getList', {point:{lat:center[0],lng:center[1]},addressComponents:{...addressComponents,city:addressComponents.city?addressComponents.city:addressComponents.province}});
        }
      })
    this.map.on('click', (e)=>{
      console.log(e.lnglat.lat);
      var position = e.lnglat;
      this.map.setCenter(position);
      this.map.remove(this.marker)
      this.marker = new AMap.Marker({
        position: position,
        map: this.map
      });
      this.map.add(this.marker);
      var geocoder = new AMap.Geocoder({ city: '全国'})
        var lat = e.lnglat.lat.toFixed(6);
      var lng = e.lnglat.lng.toFixed(6);
      geocoder.getAddress(position,(status, result)=>{
        console.log('59',status, result);
        if (status === 'complete'&&result.regeocode) {
          let addressComponents=result.regeocode.addressComponent
          console.log('刚进来的地址',result.regeocode);
          that.getLngAndLat(result.regeocode.formattedAddress)
          that.$ownerInstance.callMethod('getList', {point:{lat,lng},addressComponents:{...addressComponents,city:addressComponents.city?addressComponents.city:addressComponents.province}});
          // this.$emit("detailedAddress", {point:{lat,lng},addressComponents:{...addressComponents,city:addressComponents.city?addressComponents.city:addressComponents.province}});
        }
      })

    });
    }).catch(e=>{
      console.log('错误',e);
    })
    },
	// 获取经纬度
    getLngAndLat(address) {
      clearTimeout(this.timer)
      this.timer=setTimeout(()=>{
        let that =this
      console.log('传入的地址',address);
      var geocoder = new AMap.Geocoder({ city: '全国'})
      geocoder.getLocation(address,(status, result)=>{
        console.log(status, result);
        if (status === 'complete'&&result.geocodes) {
          let location=result.geocodes[0].location
          console.log(location.lng,location.lat);
          var position = new AMap.LngLat(location.lng, location.lat);
            this.map.setCenter(position);
            this.map.remove(this.marker)
            this.marker = new AMap.Marker({
              position: position,
              map: this.map
          });
            this.$nextTick(()=>{
              this.map.add(this.marker);
              that.$ownerInstance.callMethod('getPoint',{lng:location.lng,lat:location.lat} );
              that.$ownerInstance.callMethod('getList', result.geocodes);
              // that.$emit("point", {lng:location.lng,lat:location.lat});
            })
        }
      })
      },300)
	}
	  ,
    receiveMsg(newValue, oldValue, ownerVm, vm) {
				console.log("刚进来就执行",newValue);
				this.init(newValue);
    },
    receiveMsg2(newValue, oldValue, ownerVm, vm) {
				this.getLngAndLat(newValue);
    },
}
};
</script>

<script>
export default {
  onLoad(options) {
    setTimeout(()=>{
      if(options.longitude&&options.latitude){
        this.point = [options.longitude, options.latitude];
      }else{
       this.point=[116.397128,39.916527]
      }
    },1000)
  },
  data() {
    return {
      point: [110, 34.276184],
      address:"",
      list:[],
      selIdx:0,
      getPoi:{}
    };
  },
  methods:{
    back(){
      uni.navigateBack({ delta: 1 })
    },
    btnOk(){
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]; // 上一页面实例
      let addressComponents=this.list[this.selIdx].addressComponent
      console.log({point:this.getPoi,address:this.list[this.selIdx].formattedAddress,addressComponents:{...addressComponents,city:addressComponents.city?addressComponents.city:addressComponents.province}});
      prevPage.$vm.getAddress({point:this.getPoi,address:this.list[this.selIdx].formattedAddress,addressComponents:{...addressComponents,city:addressComponents.city?addressComponents.city:addressComponents.province}}) // 调用上一页 定义的方法
      uni.navigateBack()
    },
    getPoint(e){
      console.log('获取的point',e);
      this.getPoi=e
    },
    detailedAddress(e){
      console.log('获取的地址',e);
    },
    getList(e){
      console.log('list',e);
      this.list=e
    },
  }
};
</script>

<style lang="scss" scoped>
#allmap {
  width: 750rpx;
  height: 600rpx;
}
.lists{
  width: 750rpx;
  height: calc(100vh - 680rpx);
  overflow: auto;
  background-color: #fff;
  .lists-item{
    width: 750rpx;
    padding: 30rpx 20rpx;
    margin-bottom: 10rpx;
    border-bottom: 1px solid #ccc;
  }
  .sel{
    color: #fff;
    background-color: #3c9cff;
  }
}
.btns{
  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 750rpx;
  height: 80rpx;
  padding: 0 20rpx;
  z-index: 9999;
  .btns-item{
    display: flex;
    align-items: center;
    height: 60rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    border-radius: 6rpx;
    background-color: #fff;
  }
  .blue{
    color: #fff;
    background-color: #3c9cff;
  }
}
</style>
