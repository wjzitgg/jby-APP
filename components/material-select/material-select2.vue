<template>
	<view class="">
		<u-popup :show="selectShow">
			<view class="selectShow">
				<view class="tit-top">
					<view class="head">
						<view class="name">选择物料</view>
						<u-icon name="close" class="closeBtn" @click="selectShow = false"></u-icon>
					</view>
					<view class="search-top" v-if="searchShow">
						<u-input placeholder="请输入内容" border="surround" class="feed" v-model="keyName">
							<template slot="suffix">
								<u-icon name="search" size="28" color="#2a82e4" @click="search"></u-icon>
							</template>
						</u-input>
					</view>
					<view class="tabs-tit" v-if="checkedList.length">
						<u-icon name="arrow-left" class="left-icon" size="24" @click="checkedList = []"></u-icon>
						<text v-for="(item, index) in checkedList" :key="index">{{ item.typeName }}</text>
					</view>
				</view>
				<scroll-view scroll-y class="tree">
					<view>
						<u-list @scrolltolower="scrolltolower" v-if="checkedList.length == 0">
							<u-list-item v-for="(item, index) in showTree" :key="index">
								<u-cell :title="item.typeName" @click="pitchOn(item)"><u-icon v-if="item[childList]" slot="right-icon" name="arrow-right"></u-icon></u-cell>
							</u-list-item>
						</u-list>
						<u-list @scrolltolower="scrolltolower" v-else>
							<u-list-item v-for="(item, index) in treeData2" :key="index">
								<u-cell :title="item.typeName" @click="pitchOn(item)">
									<u-icon v-if="item[childList]" slot="right-icon" name="arrow-right"></u-icon>
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
		treeData: {
			type: Array,
			default: function() {
				return [];
			}
		},
		childList:{
			type:String,
			default:'childList'
		},
		searchShow:{
			type:Boolean,
			default:true
		},
		shabigongneng:{
			type:Boolean,
			type:false
		}
	},
	data() {
		return {
			selectShow: false,
			checkedList: [], // 已选中 用来展示选中一二三级
			treeData2: [], // 用来展示选择tree childList 的数据
			keyName:"",
			searchName:""
		};
	},
	watch:{
		selectShow(val){
			if(!val){
				this.keyName=""
				this.searchName=""
			}
		}
	},
	computed:{
		showTree(){
			if(this.searchName){
				return	this.filterTree(this.searchName,this.treeData)
			}else{
				return this.treeData
			}
		}
	},
	methods: {
		search(){
			console.log('搜索',this.keyName);
			if(this.shabigongneng){
				this.searchName=this.keyName
			}else{
				this.$emit("search",this.keyName)
			}
		},
		
 		// 递归搜索方法
		filterTree(val, tree, newArr = []) {
    	  if (!(tree.length && val)) {  // 如果搜索关键字为空直接返回源数据
    	    return tree
    	  }
    	  for (let item of tree) {
    	    if (item.typeName.indexOf(val) > -1) { // 匹配到关键字的逻辑
    	      newArr.push(item)  // 如果匹配到就在数值中添加记录
    	      continue  // 匹配到了就退出循环了此时如果有子集也会一并带着
    	    }
    	    if (item[this.childList] && item[this.childList].length) { // 如果父级节点没有匹配到就看看是否有子集，然后做递归
    	      let subArr = this.filterTree(val, item[this.childList]) // 缓存递归后的子集数组
    	      if (subArr && subArr.length) {  // 如果子集数据有匹配到的节点
    	        let node = { ...item, [this.childList]: subArr }  // 关键逻辑，缓存父节点同时将递归后的子节点作为新值
    	        newArr.push(node)  // 添加进数组
    	      }
    	    }
    	  }
    	  return newArr
    	},

		scrolltolower(){},
		pitchOn(item) {
			if (!item[this.childList]) {
				this.selectShow = false;
				this.$emit("checked", item);
			} else {
				this.checkedList.push(item);
				this.treeData2 = item[this.childList];
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
