<template>
  <view class="routes-item">
    <view class="routes">
		<view class="routes-header">
			<h3 class="cols">{{getRoute.name}}</h3>
			<!-- <view class="routes-setting" @click="routeSetting" v-if="![0,1,6,8].includes(userInfo.orgType)">
				<view class="setting">
				<image src="../../static/image/routeSetting.png" mode="widthFix" class="icons">
				</view>	
			</view> -->
            <!--  v-if="getRoute.groupType==1" -->
            <view class="routes-setting" @click="selPro" v-if="[1,2].includes(getRoute.groupType)">
                <view>{{proName}}</view>
                <image src="../../static/image/u314.png" mode="widthFix" class="icons">
            </view>
		</view>
		<view v-if="showPro&&[1,2].includes(getRoute.groupType)||![1,2].includes(getRoute.groupType)">
			<u-tabs :list="routes" @click="routesChange" :current='routerCurrent' :lineWidth="isPad?40:20"
				:lineHeight='isPad?6:3' class="route-tabs" v-if="tabShow" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"></u-tabs>
			<view class="routes-main">
				<view class="routes-main-item" v-for="(item2, index2) in showRoutes" :key="index2"
					@click="gridClick(item2)">
					<view class="imgs">
						<image :src="item2.meta.icon ? item2.meta.icon : '../../static/image/u563.png'" mode="widthFix" />
					</view>
					<text class="routesName">{{ item2.name }}</text>
				</view>
			</view>
		</view>
		<view v-if="!showPro&&[1,2].includes(getRoute.groupType)" class="routes-main2">
			<u-empty style="height: 100%" mode="data" text="暂无项目数据" icon="/static/image/noData.png" > </u-empty>
		</view>
	</view>
  </view>
</template>

<script>
export default {
 props:{
    getRoute:{
        type:Object,
        default:()=>{return {}}
    },
    proName:"",
	showPro:{
		type:Boolean,
		default:true
	}
 },
 computed:{
    userInfo() {
		return this.$store.state.userInfo;
	},
    routes(){
        return this.getRoute.children
    },
    showRoutes() {
		if (this.routes.length) {
			if (!this.getRoute.conditionStatus) {
				this.tabShow = true;
				return this.routes[this.routerCurrent].children;
			} else {
				this.tabShow = false;
				return this.routes;
			}
		} else {
			return [];
		}
	},
    isPad() {
		return this.$isIpad;
	}
 },
 data(){
    return {
        routerCurrent:0,
        tabShow:false,
    }
 },
 mounted(){
	console.log(this.showPro,this.getRoute.groupType);
 },
 methods:{
    selPro(){
        // this.popupShow= true
        this.$emit("selPro")
    },
    routesChange(e) {
		console.log(e);
		this.routerCurrent = e.index;
	},
    gridClick(item){
        this.$emit("gridClick",item)
    }
 }
}
</script>

<style lang="scss" scoped>
.routes-item{
    width:100%;
    margin-bottom: 20rpx;
}
.routes {
		width: 100%;
		background-color: #fff;
		border-radius: 20rpx 20rpx 5rpx 5rpx;
        padding-top: 20rpx;
		// margin-bottom: 20rpx;
		.route-tabs {
			background-color: #fff;
		}

		.routes-header {
			position: relative;
			display: flex;
			// justify-content: space-between;
			height: 80rpx;
			// line-height: 60rpx;
			// padding: 0 20rpx;
			font-size: 28rpx;
			font-weight: 700;
			color: #79859a;
            .cols{
                height: 60rpx;
                line-height: 60rpx;
                padding: 0 20rpx;
                background: linear-gradient(90deg, rgba(209, 220, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
            }

			.routes-setting {
				position: absolute;
                top: 10rpx;
				right: 10rpx;
				display: flex;
				align-items: center;
                z-index: 1;
				.setting{
					display: flex;
					height: 80rpx;
					align-items: center;
				}
                .icons{
                    width: 24rpx;
                    height: 24rpx;
                }
			}
		}

		.routes-main {
			display: flex;
			flex-wrap: wrap;
            padding: 0 16rpx;
			// min-height: 300rpx;
			// padding-bottom: 40rpx;

			.routes-main-item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
                width: 160rpx;
                height: 160rpx;
				// width: 23%;
				// height: 150rpx;
				// border: 1px solid #000;
				box-sizing: border-box;
				margin-right: 2%;
				margin-bottom: 10rpx;

				.imgs {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 56rpx;
					height: 64rpx;
					margin-bottom: 6rpx;
				}

				image {
					width: 56rpx;
				}

				&:nth-child(4n) {
					margin-right: 0;
				}

				.routesName {
					text-align: center;
					font-size: 24rpx;
				}
			}
		}
		.routes-main2{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 200rpx;
		}
	}
</style>