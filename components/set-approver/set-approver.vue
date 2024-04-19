<!-- 设置审批负责人 -->
<template>
	<view class="wrapper">
		<!-- 多流程 -->
		<view v-if="type == 1" class="multi-flow-map">
			<view class="box" v-if="status">
				<view class="box-title">{{ approverList.workflowName }}</view>
				<view class="item-begin" :style="{ 'min-width': bothEndsWidth + 'px' }">
					<view class="round">
						<view class="round-text">开始</view>
						<u-icon name="arrow-downward" class="arrow-downward" color="#666" size="28"></u-icon>
					</view>
				</view>
				<view v-for="(item, index) in approverList.workflowNodeDTOS" :key="index">
					<view class="item-box" ref="itemBox" v-if="item.nodeType == 3"
						:class="{'justify-content':item.baseSubWorkflow.workflowNodeDTOS.length < 7 }"
						:style="{ 'min-width': bothEndsWidth + 'px' }">
						<view class="item-box-title">{{ item.baseSubWorkflow.workflowName }}</view>
						<view v-for="(items, idx) in item.baseSubWorkflow.workflowNodeDTOS" :key="idx">
							<view class="child-node" v-if="items.nodeType == 2">
								<view class="child-node-text">
									{{ items.nodeName }}
								</view>
								<u-icon name="arrow-rightward" v-if="idx + 2 != item.baseSubWorkflow.workflowNodeDTOS.length"
									class="arrow-rightward" color="#666" size="28"></u-icon>
								<view class="search-item" v-if="selectedUserType">
									<easy-select
										v-if="items.prodSysRoleVo.sysUserList != undefined && items.prodSysRoleVo.sysUserList != null && items.prodSysRoleVo.sysUserList.length != 0 "
										:ref="index + 'easySelect' + idx" :forbidden="forbidden||approverList.launchType==2&&index==1&&idx==1" size="mini" class="easySelect"
										:value="items.prodSysRoleVo.selectedUserName" @selectOne="selectOne($event, index, idx)"
										:emptyStatus="true" @empty="empty($event, index, idx)"
										:options="items.prodSysRoleVo.sysUserList"></easy-select>
									<!-- view class="search-item" > -->
									<easy-select v-else class="not-found" :ref="index + 'easySelect' + idx" :forbidden="true" size="mini"
										:value="items.prodSysRoleVo.selectedUserName" :placeholder="'未找到匹配人员'"
										:options="items.prodSysRoleVo.sysUserList"></easy-select>
								</view>
							</view>
						</view>
						<u-icon name="arrow-downward" class="item-arrow-downward" color="#666" size="28"></u-icon>
					</view>
				</view>
				<view class="item-finish" :style="{ 'min-width': bothEndsWidth + 'px' }">
					<view class="round">
						<view class="round-text">结束</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 单流程 -->
		<view v-if="type == 2" class="easy-lister">
			<!-- 开始 -->
			<view class="box">
				<view class="left">
					<view class="item-begin">
						<view class="round">
							<view class="round-text">发起</view>
							<u-icon name="arrow-downward" class="arrow-downward" color="#666" size="28"></u-icon>
						</view>
					</view>
				</view>
				<view class="right">
					<view class="item-begin">
						<view class="right-title">审批人员</view>
					</view>
				</view>
			</view>
			<!-- 节点 -->
			<view class="box" style="margin-bottom: 20px;" v-for="(item, index) in dataList" :key="index">
				<view class="left">
					<view class="item">
						<u-icon class="ico-user" name="account-fill" color="#fff" size="18"></u-icon>
						<view class="item-name">{{ item.nodeName }}</view>
						<u-icon name="arrow-downward" class="item-downward" color="#666" size="28"></u-icon>
					</view>
				</view>
				<view class="right">
					<view class="select-item">
						<easy-select
							v-if="item.prodSysRoleVo.sysUserList != undefined && item.prodSysRoleVo.sysUserList != null && item.prodSysRoleVo.sysUserList.length != 0"
							:forbidden="forbidden||(data.launchType==2&&index==0)" size="mini" class="easySelect" :value="item.prodSysRoleVo.selectedUserName"
							@selectOne="selectTo($event, index)" :options="item.prodSysRoleVo.sysUserList"></easy-select>
						<easy-select v-else class="not-found" :ref="index + 'easySelect'" :forbidden="true" size="mini"
							:value="item.prodSysRoleVo.selectedUserName" :placeholder="'未找到匹配人员'"
							:options="item.prodSysRoleVo.sysUserList"></easy-select>
					</view>
				</view>
			</view>
			<!-- 结束 -->
			<view class="box">
				<view class="left">
					<view class="item-finish">
						<view class="round" style="background-color: #ccc;">
							<view class="round-text">结束</view>
						</view>
					</view>
				</view>
				<view class="right">
					<view class="item-begin">
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		computed: {
  		  user() {
    		  return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    		},
  		},
		props: {
			data: {
				workflowNodeDTOS: [] //多流程
			},
			type: {
				type: String,
				default: "1" //1多流程 2单流程
			},
			forbidden: {
				type: Boolean, //禁用 需要禁用时传true 默认不禁用
				default: false
			},
			arr: {
				type: Array,
				default: () => [{
					nodeName: "aasa",
					prodSysRoleVo: {
						selectedUserName: "AAAA",
						selectedUserId: "",
						sysUserList: [
							{ value: "1", label: "AAAA" },
							{ value: "2", label: "BBB" },
							{ value: "3", label: "EEEE" },
							{ value: "4", label: "CCCCC" },
							{ value: "5", label: "DDDDD" },
						]
					}
				}]
			} //单流程
		},
		data() {
			return {
				// type: "1", //1多流程 2单流程
				yearList: [],
				status: true,
				approverList: {
					workflowNodeDTOS: [

					],
				},
				bothEndsWidth: "",
				dataList: [{
					nodeName: "aasa",
					prodSysRoleVo: {
						selectedUserName: "AAAA",
						selectedUserId: "",
						sysUserList: [
							{ value: "1", label: "AAAA" },
							{ value: "2", label: "BBB" },
							{ value: "3", label: "EEEE" },
							{ value: "4", label: "CCCCC" },
							{ value: "5", label: "DDDDD" },
						]
					}
				}],
				selectedUserType: true

			};
		},
		onReady(option) {
			//   this.$nextTick(()=>{
			//     this.dataList = this.arr
			//     this.approverList = this.data
			//   })
			// this.approverList = JSON.parse(option.row);
		},
		mounted() {
			if (this.type == 1) {
				let arr = JSON.stringify(this.data);
				this.approverList = JSON.parse(arr);
				// this.approverList.workflowNodeDTOS.forEch(item => {
				//     item.baseSubWorkflow.workflowNodeDTOS.forEch(e => {
				//         if (e.nodeType == 2 && e.prodSysRoleVo == null) {
				//             e.prodSysRoleVo = {
				//                 currentNodeId: "1678321544560742401",
				//                 currentPrecessId:"1675390372226531329",
				//                 fkOrgId :"1628236153397022721",
				//                 pkId :"1628236156135903233",
				//                 roleCode:"5-1",
				//                 roleFlag: 0,
				//                 roleName:"总工程师",
				//                 roleType:5,
				//                 selectedUserId:"",
				//                 sysUserList:[],
				//             }
				//         }
				//     })

				// })
				// if (res.data.workflowNodeDTOS.length) {
				this.approverList.workflowNodeDTOS.forEach((item,index) => {
					if (item.nodeType == 3) {
						item.baseSubWorkflow.workflowNodeDTOS.forEach((itemArray,index2) => {
							if (itemArray.nodeType == 2 && itemArray.prodSysRoleVo == null) {
								itemArray.prodSysRoleVo = {
									currentNodeId: "",
									currentPrecessId: "",
									fkOrgId: "",
									pkId: "",
									roleCode: "",
									roleFlag: 0,
									roleName: "",
									roleType: 5,
									selectedUserId: "",
									sysUserList: [],
									selectedUserName: ""
								};
							} else if (itemArray.nodeType == 2) {
								// itemArray.prodSysRoleVo.selectedUserId = itemArray.prodSysRoleVo.selectedUserId ==unll?"":itemArray.prodSysRoleVo.selectedUserId;
								// itemArray.prodSysRoleVo.selectedUserId = ""
								if(this.approverList.launchType==2&&index==1&&index2==1){
									console.log('进来了',itemArray.prodSysRoleVo.sysUserList,this.user.userId);
									 let arr = itemArray.prodSysRoleVo.sysUserList.filter(item2=>item2.pkId==this.user.userId)
                    				itemArray.prodSysRoleVo.selectedUserId =arr.length? this.user.userId:''
									// itemArray.prodSysRoleVo.selectedUserName = itemArray.prodSysRoleVo.selectedUserId;
								}else{
									itemArray.prodSysRoleVo.selectedUserId =itemArray.prodSysRoleVo.selectedUserId
									// itemArray.prodSysRoleVo.selectedUserName = itemArray.prodSysRoleVo.selectedUserId;
								}
								if (itemArray.prodSysRoleVo.sysUserList.length) {
									itemArray.prodSysRoleVo.sysUserList.forEach(e => {
										e.label = e.userName;
										e.value = e.pkId;
										if (itemArray.prodSysRoleVo.selectedUserId == e.pkId) {
											itemArray.prodSysRoleVo.selectedUserName = e.userName;
										}
									});
								}
							}
						});
					}
				});
				// }
			} else {
				let arr1 = JSON.stringify(this.arr);
				this.dataList = JSON.parse(arr1);
			}


			this.$nextTick(() => {
				if (this.type == 1) {
					uni.createSelectorQuery().in(this).select(".item-box").fields({
						size: true
					}, res => {
						this.bothEndsWidth = res.width;
						console.log("this.bothEndsWidth ======================================");
						console.log(this.bothEndsWidth);
						console.log("this.bothEndsWidth ======================================");
					}).exec();
				}
			});
		},
		methods: {
			// dataReturn 为数据返回方法
			// 多流程数据返回
			getBackMore() {
				this.$emit("dataReturn", this.approverList);
			},
			// 流程数据返回
			getBackFew() {
				this.$emit("dataReturn", this.dataList);
			},

			selectOne(e, idx, id) {
				// debugger
				this.selectedUserType = false;
				this.approverList.workflowNodeDTOS[idx].baseSubWorkflow.workflowNodeDTOS[id].prodSysRoleVo.selectedUserId = e
					.options.pkId;
				this.approverList.workflowNodeDTOS[idx].baseSubWorkflow.workflowNodeDTOS[id].prodSysRoleVo.selectedUserName = e
					.options.userName;
				this.selectedUserType = true;
				// this.$emit("dataReturn", this.approverList);
				console.log("xxxxxxxxxxxxxdsdfsdfs");
			},
			empty(e, idx, id) {
				this.selectedUserType = false;
				this.approverList.workflowNodeDTOS[idx].baseSubWorkflow.workflowNodeDTOS[id].prodSysRoleVo.selectedUserId = "";
				this.approverList.workflowNodeDTOS[idx].baseSubWorkflow.workflowNodeDTOS[id].prodSysRoleVo.selectedUserName = "";
				this.selectedUserType = true;
			},
			selectTo(e, idx) {
				console.log(e.options.userName);
				console.log(e.options.pkId);
				this.$set(this.dataList[idx].prodSysRoleVo,'selectedUserId',e.options.pkId)
				this.$set(this.dataList[idx].prodSysRoleVo,'selectedUserName',e.options.userName)
				// this.dataList[idx].prodSysRoleVo.selectedUserId = e.options.pkId;
				// this.dataList[idx].prodSysRoleVo.selectedUserName = e.options.userName;
				console.log("==================");
				console.log(this.dataList[idx].prodSysRoleVo.selectedUserName);
				console.log(this.dataList[idx].prodSysRoleVo.selectedUserId);
				this.$emit("dataReturn", this.dataList);
			},
		}
	};
</script>

<style lang="scss" scoped>
	.multi-flow-map {
		.interpose {
			width: 25px;
			height: 25px;
			background: red;
			position: fixed;
			z-index: 9999999999999;
			right: 5px;
			top: 8px;
		}

		.box {
			background: #fff;
			text-align: center;
			overflow: auto;
			position: relative;
			padding-bottom: 100px;
			padding-top: 60px;
			display: flex;
			flex-wrap: wrap;
		}

		.box-title {
			width: 100%;
			text-align: left;
			padding-left: 8px;
		}

		.item-box {
			flex: 1;
			width: 100vh;
			padding-top: 20px;
			margin-top: 20px;
			// height: 120px;
			border: 1px dashed #666;
			border-radius: 5px;
			display: flex;
			position: relative;
			// justify-content: center;
			// overflow-x: auto;
			// overflow-y: hidden;

			.item-box-title {
				position: absolute;
				left: 8px;
				top: 6px;
			}

			.child-node {
				width: 120px;
				line-height: 40px;
				margin: 5px;
				margin-top: 10px;
				margin-right: 40px;
				text-align: center;
				position: relative;

				// overflow: hidden;
				.child-node-text {
					border: 1px solid #666;
					border-radius: 4px;
				}

				.arrow-rightward {
					position: absolute;
					right: -32px;
					top: 25%;
				}

				.search-item {
					margin-top: 5px;
				}
			}
		}

		.justify-content {
			justify-content: center;
		}

		.down-arrow {
			margin-left: 60%;
		}

		.round {
			position: relative;
			left: 45%;
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
			border: 1px solid #666;

			.round-text {
				position: absolute;
				top: 16%;
				right: -40px;
			}
		}

		.item-begin {
			margin-bottom: 50px;
			width: 100%;

			.arrow-downward {
				position: absolute;
				bottom: -40px !important;
			}
		}

		.item-finish {
			width: 100%;
			margin-top: 25px;

			.round {
				background: #666;
			}
		}

		.easySelect {
			/deep/.uni-input-wrapper {
				.uni-input-input {
					font-size: 28rpx;
				}
			}
		}

		.item-arrow-downward {
			position: absolute;
			left: 45%;
			bottom: -25px;
		}
	}

	.easy-lister {
		.box {
			display: flex;
			background: #fff;

			.left {
				width: 45%;

				.item {
					width: 150px;
					height: 60px;
					border: 1px solid #ccc;
					border-radius: 5px;
					margin: 0 auto;
					position: relative;

					.ico-user {
						margin: 4px;
						display: inline-block;
						border-radius: 50%;
						background: #000;
						color: #fff;
					}

					.item-name {
						text-align: center;
					}

					.item-downward {
						position: absolute;
						left: 43%;
						bottom: -25px;
					}
				}

				.item-finish {
					margin-top: 25px;
				}
			}

			.right {
				width: 55%;

				.right-title {
					line-height: 1;
					font-size: 16px;
					font-weight: 700;
					font-weight: 800;
					margin-top: 4px;
					text-align: center;
				}

				.select-item {
					height: 60px;
					padding: 2px;
					padding-top: 13px;
				}
			}
		}

		.item-begin {
			margin-bottom: 50px;
			width: 100%;

			.arrow-downward {
				position: absolute;
				bottom: -40px !important;
			}
		}

		.round {
			position: relative;
			left: 45%;
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
			border: 1px solid #666;

			.round-text {
				position: absolute;
				top: 16%;
				right: -40px;
			}
		}
	}

	.not-found {
		background-color: red;

		.uni-input-placeholder {
			color: #000;
			font-size: 12px;
		}
	}
</style>