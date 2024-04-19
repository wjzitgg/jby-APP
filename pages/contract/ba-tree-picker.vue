<!-- 树形层级选择器-->
<!-- 1、支持单选、多选 -->
<template>
	<view>
		<view class="tree-dialog">
			<view class="tree-view">
			
				<scroll-view class="tree-list" :scroll-y="true">
					
					<block v-for="(item, index) in treeList" :key="index">
						
						<view class="tree-item" :class="{ itemBorder: border === true, show: item.isShow,bgColor:item.showColor }">
							
							<view class="item-label">
								<!-- 左边小箭头展开 -->
								<view class="item-icon uni-inline-item" @tap.stop="_onItemSwitch(item, index)">
									<view v-if="!item.isLastLevel && item.isShowChild" class="switch-on"
										:style="{ 'border-left-color': switchColor }"></view>

									<view v-else-if="!item.isLastLevel && !item.isShowChild" class="switch-off"
										:style="{ 'border-top-color': switchColor }"></view>
									<!-- <view v-else class="item-last-dot" :style="{ 'border-top-color': switchColor }"></view> -->
								</view>
								<view class="tree-flex " @tap.stop="_onItemSelect(item, index)">
									<view class="item-name">{{ item.name }}</view>
								</view>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	emits: ["select-change"],
	name: "ba-tree-picker",
	props: {
		valueKey: {
			type: String,
			default: "id"
		},
		textKey: {
			type: String,
			default: "name"
		},
		childrenKey: {
			type: String,
			default: "children"
		},
		localdata: {
			type: Array,
			default: function () {
				return [];
			}
		},
		localTreeList: {
			//在已经格式化好的数据
			type: Array,
			default: function () {
				return [];
			}
		},
		selectedData: {
			type: Array,
			default: function () {
				return [];
			}
		},
		title: {
			type: String,
			default: ""
		},
		multiple: {
			// 是否可以多选
			type: Boolean,
			default: true
		},
		selectParent: {
			//是否可以选父级
			type: Boolean,
			default: true
		},
		confirmColor: {
			// 确定按钮颜色
			type: String,
			default: "" // #2a82e4
		},
		cancelColor: {
			// 取消按钮颜色
			type: String,
			default: "" // #757575
		},
		titleColor: {
			// 标题颜色
			type: String,
			default: "" //
		},
		switchColor: {
			// 节点切换图标颜色
			type: String,
			default: "" // #666
		},
		border: {
			// 是否有分割线
			type: Boolean,
			default: false
		},
		associatedNode: {
			// 父子节点是否关联 默认关联
			type: Boolean,
			default: true
		},
		disabled: {
			// 是否禁用 默认不禁用
			type: Boolean,
			default: false
		},
		wipeStatus: {
			// 是否去除子节点选中的和父节点选中的并禁用子节点 默认false
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			showDialog: false,
			treeList: [] // 看到的权限列表  有bug
		};
	},
	computed: {},
	methods: {
		// 确认获取所有选中id
		_confirm() {
			let selectedList = [];
			let selectedNames;
			// console.log(this.treeList);
			this.treeList.forEach((item, index) => {
				if (item.checkStatus === 2) {
					selectedList.push(item.id);
				}
			});
			return selectedList;
			// this.$emit("select-change", selectedList);
		},
		//格式化原数据（原数据为tree结构） 进来就会执行
		_formatTreeData(list = [], level = 0, parentItem, isShowChild = true) {
			// console.log("处理数据");
			let nextIndex = 0;
			let parentId = -1;
			let initCheckStatus = 0;

			if (parentItem) {
				nextIndex = this.treeList.findIndex(item => item.id === parentItem.id) + 1;
				parentId = parentItem.id;
				if (!this.multiple) {
					//单选
					initCheckStatus = 0;
				} else {
					// initCheckStatus = parentItem.checkStatus == 2 ? 2 : 0; // 控制父子关联选中问题
				}
			}
			list.forEach(item => {
				let isLastLevel = true; // 是不是最后节点
				if (item && item[this.childrenKey]) {
					let children = item[this.childrenKey];
					if (Array.isArray(children) && children.length > 0) {
						isLastLevel = false;
					}
				}

				let itemT = {
					id: item[this.valueKey],
					name: item[this.textKey],
					level,
					isLastLevel,
					isShow: isShowChild,
					isShowChild: false,
					checkStatus: initCheckStatus,
					orCheckStatus: 0,
					parentId,
					children: item[this.childrenKey],
					childCount: item[this.childrenKey] ? item[this.childrenKey].length : 0,
					childCheckCount: 0,
					childCheckPCount: 0,
					showColor:item.grade==1
				};

				// 初始化根据默认返回的改变选中状态
				if (this.selectedData.indexOf(itemT.id) >= 0) {
					itemT.checkStatus = 2;
					item.checkStatus = 2; // 新增加
					itemT.orCheckStatus = 2;
					itemT.childCheckCount = itemT.children ? itemT.children.length : 0;
					if (this.associatedNode) {
						this._onItemParentSelect(itemT, nextIndex);
					}
				}

				this.treeList.splice(nextIndex, 0, itemT);
				nextIndex++;
			});
			// console.log(this.treeList);
		},
		// 节点展开、收起
		_onItemSwitch(item, index) {
			// console.log(item);
			//console.log('_itemSwitch')
			if (item.isLastLevel === true) {
				return;
			}
			item.isShowChild = !item.isShowChild;
			if (item.children) {
				this._formatTreeData(item.children, item.level + 1, item);
				item.children = undefined;
			} else {
				this._onItemChildSwitch(item, index);
			}
		},
		_onItemChildSwitch(item, index) {
			//console.log('_onItemChildSwitch')
			const firstChildIndex = index + 1;
			if (firstChildIndex > 0)
				for (var i = firstChildIndex; i < this.treeList.length; i++) {
					let itemChild = this.treeList[i];
					if (itemChild.level > item.level) {
						if (item.isShowChild) {
							if (itemChild.parentId === item.id) {
								itemChild.isShow = item.isShowChild;
								if (!itemChild.isShow) {
									itemChild.isShowChild = false;
								}
							}
						} else {
							itemChild.isShow = item.isShowChild;
							itemChild.isShowChild = false;
						}
					} else {
						return;
					}
				}
		},
		getNode(list,row){
			for (let i = 0; i < list.length; i++) {
				const item = list[i];
				if(item.children&&!!item.children.length){
					let obj = this.getNode(item.children,row)
					if(obj){
						return obj
					}
				}else{
					if(item[this.valueKey]==row.id){
						return item
					}
				}
			}
		},
		// 点击勾选、取消勾选
		_onItemSelect(item, index) {
			if (this.disabled) {
				return
			}
			this.treeList.forEach(s=>{
				if(s.id == item.id){
					item.checkStatus = 2;
				}else{
					s.checkStatus = 0;
				}
			})
			let obj =this.getNode(this.localdata,item)
			console.log(obj);
			this.$emit("select",obj)
			return
			// 修改对应状态
			let oldCheckStatus = item.checkStatus;
			switch (oldCheckStatus) {
				case 0:
					item.checkStatus = 2;
					item.childCheckCount = item.childCount;
					item.childCheckPCount = 0;
					break;
				case 1:
				case 2:
					item.checkStatus = 0;
					item.childCheckCount = 0;
					item.childCheckPCount = 0;
					break;
				default:
					break;
			}
			if (this.associatedNode) {
				//父节点勾选关联子节点
				this._onItemChildSelect(item, index);
				//子节点勾选关联父节点
				this._onItemParentSelect(item, index, oldCheckStatus);
			}
			if (this.wipeStatus) {
				//父节点勾选关联子节点
				this._wipeItemChildSelect(item, index);
				//取消子节点所有父节点的选中
				this._wipeItemParentSelect(item, index, oldCheckStatus);
			}
		},
		_wipeItemChildSelect(item, index) {
			//console.log('_onItemChildSelect')
			let allChildCount = 0;
			if (item.childCount && item.childCount > 0) {
				index++;
				while (index < this.treeList.length && this.treeList[index].level > item.level) {
					let itemChild = this.treeList[index];
					itemChild.checkStatus = 0;
					if (itemChild.checkStatus == 2) {
						itemChild.childCheckCount = 0;
						itemChild.checkStatus = 0;
						itemChild.childCheckPCount = 0;
					} else if (itemChild.checkStatus == 0) {
						itemChild.childCheckCount = 0;
						itemChild.childCheckPCount = 0;
						itemChild.checkStatus = 0;
					}
					// console.log('>>>>index：', index, 'item：', itemChild.name, '  status：', itemChild
					// 	.checkStatus)
					index++;
				}
			}
		},
		_wipeItemParentSelect(item, index, oldCheckStatus) {
			// console.log("_onItemParentSelect");
			console.log(index)
			//console.log(item)
			const parentIndex = this.treeList.findIndex(itemP => itemP.id == item.parentId);
			console.log(parentIndex)
			console.log('parentIndex：' + parentIndex)
			if (parentIndex >= 0) {
				let itemParent = this.treeList[parentIndex];
				let count = itemParent.childCheckCount;
				let oldCheckStatusParent = itemParent.checkStatus;
				itemParent.checkStatus = 0;
				if (oldCheckStatus == 1) {
					itemParent.childCheckPCount -= 1;
					itemParent.checkStatus = 0;
				} else if (oldCheckStatus == 2) {
					itemParent.childCheckCount -= 1;
					itemParent.checkStatus = 0;

				}
				if (item.checkStatus == 1) {
					itemParent.childCheckPCount += 1;
					itemParent.checkStatus = 0;
				} else if (item.checkStatus == 2) {
					itemParent.childCheckCount += 1;
					itemParent.checkStatus = 0;
				}
				//
				if (itemParent.childCheckCount <= 0 && itemParent.childCheckPCount <= 0) {
					itemParent.childCheckCount = 0;
					itemParent.childCheckPCount = 0;
					itemParent.checkStatus = 0;
				} else {
					itemParent.childCheckCount = itemParent.childCount;
					itemParent.childCheckPCount = 0;
					itemParent.checkStatus = 0;
				}
				console.log('itemParent：', itemParent)
				this._onItemParentSelect(itemParent, parentIndex, oldCheckStatusParent);
			}
		},
		_onItemChildSelect(item, index) {
			//console.log('_onItemChildSelect')
			let allChildCount = 0;
			if (item.childCount && item.childCount > 0) {
				index++;
				while (index < this.treeList.length && this.treeList[index].level > item.level) {
					let itemChild = this.treeList[index];
					itemChild.checkStatus = item.checkStatus;
					if (itemChild.checkStatus == 2) {
						itemChild.childCheckCount = itemChild.childCount;
						itemChild.childCheckPCount = 0;
					} else if (itemChild.checkStatus == 0) {
						itemChild.childCheckCount = 0;
						itemChild.childCheckPCount = 0;
					}
					// console.log('>>>>index：', index, 'item：', itemChild.name, '  status：', itemChild
					// 	.checkStatus)
					index++;
				}
			}
		},
		_onItemParentSelect(item, index, oldCheckStatus) {
			// console.log("_onItemParentSelect");
			//console.log(item)
			const parentIndex = this.treeList.findIndex(itemP => itemP.id == item.parentId);
			//console.log('parentIndex：' + parentIndex)
			if (parentIndex >= 0) {
				let itemParent = this.treeList[parentIndex];
			// 	console.log("xxxxxxxxxxxxxxxxxx")
			// console.log(itemParent)
			// console.log("xxxxxxxxxxxxxxxxxx")
				
				let count = itemParent.childCheckCount;
				let oldCheckStatusParent = itemParent.checkStatus;

				if (oldCheckStatus == 1) {
					itemParent.childCheckPCount -= 1;
				} else if (oldCheckStatus == 2) {
					itemParent.childCheckCount -= 1;
				}
				if (item.checkStatus == 1) {
					itemParent.childCheckPCount += 1;
				} else if (item.checkStatus == 2) {
					itemParent.childCheckCount += 1;
				}
				//
				if (itemParent.childCheckCount <= 0 && itemParent.childCheckPCount <= 0) {
					itemParent.childCheckCount = 0;
					itemParent.childCheckPCount = 0;
					itemParent.checkStatus = 0;
				} else {
					itemParent.childCheckCount = itemParent.childCount;
					itemParent.childCheckPCount = 0;
					itemParent.checkStatus = 2;
				}
				//console.log('itemParent：', itemParent)
				this._onItemParentSelect(itemParent, parentIndex, oldCheckStatusParent);
			}

		},
		// 重置数据
		_reTreeList() {
			this.treeList.forEach((v, i) => {
				this.treeList[i].checkStatus = v.orCheckStatus;
			});
		},
		_initTree2() {
			this.treeList = [];
			this._formatTreeData(this.localdata);
		},
		// 初始化数据加默认展开所有 数据扁平化  不然数据选择有问题
		async _initTree() {
			this.treeList = [];
			await this._formatTreeData(this.localdata);
			console.log(this.treeList);
			let flagIndex = 0;
			while (this.treeList.length > flagIndex) {
				this._onItemSwitch(this.treeList[flagIndex], flagIndex);
				flagIndex++;
			}
		}
	},
	watch: {
		localdata() {
			console.log("初始化");
			this._initTree();
		},
		localTreeList() {
			this.treeList = this.localTreeList;
		},
		selectedData(val) {
			// console.log(val);
			this._initTree();
		}
	},
	created() { }
};
</script>

<style scoped>
.tree-cover {
	position: fixed;
	top: 0rpx;
	right: 0rpx;
	bottom: 0rpx;
	left: 0rpx;
	z-index: 100;
	background-color: rgba(0, 0, 0, 0.4);
	opacity: 0;
	transition: all 0.3s ease;
	visibility: hidden;
}

.tree-cover.show {
	visibility: visible;
	opacity: 1;
}

.tree-dialog {
	background-color: #fff;
}

.tree-dialog.show {
	transform: translateY(0);
}

.tree-view {
	flex: 1;
	padding: 20rpx 0;
	
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	overflow: hidden;
	height: 100%;
}

.tree-list {
	flex: 1;
	height: 100%;
	overflow: hidden;

}

.tree-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	line-height: 1;
	height: 0;
	opacity: 0;
	transition: 0.2s;
	overflow: hidden;
}

.tree-item.show {
	height: 100rpx;
	opacity: 1;
}

.tree-item.showchild:before {
	transform: rotate(90deg);
}

.tree-item.last:before {
	opacity: 0;
}

.switch-on {
	width: 0;
	height: 0;
	border-left: 10rpx solid transparent;
	border-right: 10rpx solid transparent;
	border-top: 15rpx solid #cccccc;
}

.switch-off {
	width: 0;
	height: 0;
	border-bottom: 10rpx solid transparent;
	border-top: 10rpx solid transparent;
	border-left: 15rpx solid #cccccc;
}

.item-last-dot {
	position: absolute;
	width: 10rpx;
	height: 10rpx;
	border-radius: 100%;
	background: #666;
}

.item-icon {
	width: 26rpx;
	height: 8rpx;
	margin-right: 36rpx;
	padding-right: 20rpx;
	padding-left: 20rpx;

	
}

.item-label {
	flex: 1;
	display: flex;
	align-items: center;
	height: 100%;
	line-height: 1.2;
	/* background: linear-gradient(90deg, rgba(42, 130, 228, 0.2) 0%, rgba(42, 130, 228, 0) 100%); */
}

.item-name {
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	width: 450rpx;
}

.item-check {
	width: 40px;
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	
}

.item-check-yes,
.item-check-no {
	width: 20px;
	height: 20px;
	border-top-left-radius: 20%;
	border-top-right-radius: 20%;
	border-bottom-right-radius: 20%;
	border-bottom-left-radius: 20%;
	border-top-width: 1rpx;
	border-left-width: 1rpx;
	border-bottom-width: 1rpx;
	border-right-width: 1rpx;
	border-style: solid;
	border-color: #dddddd;
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
}
.item-check-yes{
	background-color: #2a82e4;

}
.item-check-yes-part {
	width: 12px;
	height: 12px;
	border-top-left-radius: 20%;
	border-top-right-radius: 20%;
	border-bottom-right-radius: 20%;
	border-bottom-left-radius: 20%;
	background-color: #2a82e4;
}

.item-check-yes-all {
	margin-bottom: 6rpx;
	border: 2px solid #fff;
	border-left: 0;
	border-top: 0;
	height: 11px;
	width: 6px;
	transform-origin: center;
	/* #ifndef APP-NVUE */
	transition: all 0.3s;
	/* #endif */
	transform: rotate(45deg);
}

.item-check .radio {
	border-top-left-radius: 50%;
	border-top-right-radius: 50%;
	border-bottom-right-radius: 50%;
	border-bottom-left-radius: 50%;
}

.item-check .radio .item-check-yes-b {
	border-top-left-radius: 50%;
	border-top-right-radius: 50%;
	border-bottom-right-radius: 50%;
	border-bottom-left-radius: 50%;
}

.hover-c {
	opacity: 0.6;
}

.itemBorder {
	border-bottom: 1px solid #e5e5e5;
}

/* 新增修改样式 */
.tree-flex {
	display: flex;
	align-items: center;
	flex: 1;
	height: 100%;
	border-bottom: 1px solid #eee;
	/* background: linear-gradient(90deg, rgba(42, 130, 228, 0.2) 0%, rgba(42, 130, 228, 0) 100%); */



}
.bgColor{
	font-weight: 700;
	background: linear-gradient(90deg, rgba(227, 235, 255, 1) 0%, rgba(227, 235, 255, 0) 100%);
}
.disabled {
	background-color: #ccc;
}</style>
