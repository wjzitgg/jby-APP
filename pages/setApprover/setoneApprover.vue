<!-- 设置审批负责人 -->
<template>
	<view class="wrapper">
		<u-navbar leftText="设置审批人" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="box" v-if="status">
			<setApprover :arr="nodeArr" type="2" :forbidden="false" @dataReturn="dataReturn" :data="approverList"></setApprover>
		</view>
		<view class="btn" @click="set">设置</view>
	</view>
</template>

<script>
	import setApprover from "../../components/set-approver/set-approver.vue";
	export default {
		components: {
			setApprover
		},
		computed: {
  		  user() {
  		    return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
  		  },
  		},
		data() {
			return {
				yearList: [],
				status: true,
				approverList: {
					workflowNodeDTOS: [],
				},
				bothEndsWidth: "",
				nodeArr: [],
				noReturn:""
			};
		},
		onLoad(option) {
			// this.searchItemsIgnore();
			console.log(option);
			this.noReturn=option.noReturn?option.noReturn-0:''
			this.nodeArr = [];
			this.approverList = JSON.parse(option.row);
			this.approverList.workflowNodeDTOS.forEach((item,index) => {
				if (item.nodeType == 2) {
					if(this.approverList.launchType==2&&index==1){
						 let arr = item.prodSysRoleVo.sysUserList.filter(item2=>item2.pkId==this.user.userId)
                    	item.prodSysRoleVo.selectedUserId =arr.length? this.user.userId:''
					}else{
						item.prodSysRoleVo.selectedUserId = item.prodSysRoleVo.selectedUserId;
					}
					// item.prodSysRoleVo.selectedUserName = item.prodSysRoleVo.selectedUserId;
					item.prodSysRoleVo.sysUserList.forEach(item3 => {
						item3.value = item3.pkId;
						item3.label = item3.userName;
						if (item.prodSysRoleVo.selectedUserId == item3.pkId) {
							item.prodSysRoleVo.selectedUserName = item3.userName;
						}
					});
					this.nodeArr.push(item);
				}
			});
		},
		// mounted() {
		//     this.$nextTick(() => {
		//         uni.createSelectorQuery().in(this).select('.item-box').fields({
		//             size: true
		//         }, res => {
		//             this.bothEndsWidth = res.width
		//         }).exec()
		//     })
		// },
		methods: {
			set() {
				let arr = [];
				let arr2 = this.nodeArr;
				for (let i = 0; i < arr2.length; i++) {
					if (arr2[i].nodeType == 2) {
						arr.push({
							fkRoleId: arr2[i].fkRoleId,
							fkApproverId: arr2[i].prodSysRoleVo.selectedUserId == null ? "" : arr2[i].prodSysRoleVo
								.selectedUserId,
							currentNodeId: arr2[i].pkId,
						});
					}
				}
				if (arr.filter(item => !item.fkApproverId).length == arr.length) {
					return uni.showToast({ icon: "none", title: "请选择至少一位审批人" });
				}
				// this.approverList.workflowNodeDTOS.forEach(element => {
				//     if (element.nodeType == 3) {
				//         element.baseSubWorkflow.workflowNodeDTOS.forEach(item => {
				//             if (item.nodeType == 2) {
				//                 arr.push({
				//                     bizType: 0,
				//                     fkRoleId: item.fkRoleId,
				//                     currentNodeId: item.pkId,
				//                     currentPrecessId: element.pkId,
				//                     fkApproverId: item.prodSysRoleVo.selectedUserId == null ? "" : item.prodSysRoleVo.selectedUserId
				//                 })
				//                 if (item.prodSysRoleVo.selectedUserId != null && item.prodSysRoleVo.selectedUserId != '') {
				//                     status = false
				//                 }
				//             }
				//         })
				//     }
				// });
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; // 上一页面实例
				prevPage.$vm.prevDateFun(arr); // 调用上一页 定义的方法
				if(this.noReturn){
				}else{
					uni.navigateBack();
				}
			},
			dataReturn(arr) {
				console.log(arr);
				this.nodeArr = arr;
			},
		}
	};
</script>

<style lang="scss" scoped>
	.box {
		background: #fff;
	}
</style>