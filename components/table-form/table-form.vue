<template>
  <view class="table-form" :class="{'table_empty':emptyShow,'heights':pageHeight,'mt-8':pageMr}">
    <table >
         <tbody>
              <tr v-for="(item, index) in showList" :key="index">
                <td class="name" :style="{'width':item.name.length>4?'auto':'200rpx','text-align-last': item.name.length<4?'justify':''}">
					<view v-if="item.name.length<=4" style="width:106rpx;text-align-last:justify">{{ item.name }}</view>
					<view v-else>{{ item.name }}</view>
				</td>
                <td class="value"><text :class="{clickTd:item.click}" @click="tdclick(item)">{{ item.value }}</text></td>
              </tr>
        </tbody>
    </table>
    <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png" v-if="emptyShow"></u-empty>
  </view>
</template>

<script>
export default {
    props:{
        list:{
            type:Array,
            default:()=>{return []}
        },
        // 是否显示为空图标
        emptyShow:{
            type:Boolean,
            default:false
        },
		pageHeight:{
			type:Boolean,
			default:true
		},
		pageMr:{
			type:Boolean,
			default:true
		}
    },
	computed:{
		showList(){
			return this.list.filter(item=>item.show)
		}
	},
	methods:{
		tdclick(item){
			this.$emit("click",item)
		}
	}
}
</script>

<style lang="scss" scoped>
.mt-8{
	margin-top: 8rpx;
}
.table-form {
	position: relative;
	overflow: auto;
	width: 100%;
	height: 100%;
	background-color: #fff;
	// margin-top: 8rpx;
	border-right: 0;
	&::before{
		content: "";
		position: sticky;
		top: 0;
		left: 0;
		right: 0;
		display: block;
		height: 20rpx;
		background-color: #fff;
		z-index: 10;
	}
	&::after{
		content: "";
		position: sticky;
		bottom: 0;
		left: 0;
		right: 0;
		display: block;
		height: 20rpx;
		background-color: #fff;
		z-index: 10;
	}
	table {
		border-collapse: collapse;
		table-layout: fixed;
		width: auto;
		min-width: 100%;
	}
	td {
		border-right: 1px solid #ebebeb;
		border-bottom: 1px solid #ebebeb;
		// min-width: 200rpx;
		width: auto;
		height:80rpx;
		max-height: 80rpx;
		color: #79859a;
		box-sizing: border-box;
		background-color: #ffffff;
		font-size: 26rpx;
		text-align: center;
		padding: 10rpx 40rpx;
		word-break: break-all;
		word-wrap: break-word;
		white-space: nowrap;
	}
    tr:first-child{
        td{
            border-top: 1px solid #ebebeb;
        }
    }
	// 固定首列
	td:first-child,
	th:first-child {
		width: auto;
		position: sticky;
		left: 0;
		z-index: 1;
		&::after{
			position: absolute;
			content: "";
			left: -2rpx;
			right: -2rpx;
			bottom: -2rpx;
			top: -2rpx;
			border: 1px solid #ebebeb;
			border-bottom: none;
		}
	}
	th:first-child {
		&::after{
			border-top: none;
			border-bottom: none;
		}
	}
    .name{
        // width: auto;
		text-align: left;
        min-width: 200rpx;
		font-weight: 700;
		color: #203457;
    }
	.value{
		text-align: left;
		border-right: none;
	}
	.clickTd{
	text-decoration: underline;
	color: blue;
}
}
.table_empty{
	.u-empty{
		position: sticky;
		width: 100%;
		height: 400rpx;
		left: 0;
		right: 0;
	}
}
.heights{
	/*#ifdef APP-PLUS*/
	height: calc(100vh - 284rpx);
	/*#endif*/
	/*#ifdef H5*/
  	height: calc(100vh - 196rpx);
	/*#endif*/
}
</style>