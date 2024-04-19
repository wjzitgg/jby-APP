<!-- 设置审批负责人 -->
<template>
    <view class="wrapper">
        <u-navbar leftText="设置审批人" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
        <!-- <view class="interpose" @click="interpose"></view> -->
        <view class="box" v-if="status">
            <!-- <view class="box-title">{{ approverList.workflowName }}</view>
            <view class="item-begin" :style="{ 'width': bothEndsWidth + 'px' }">
                <view class="round">
                    <view class="round-text">开始</view>
                    <u-icon name="arrow-downward" class="arrow-downward" color="#666" size="28"></u-icon>
                </view>
            </view>
            <view v-for="(item, index) in approverList.workflowNodeDTOS" :key="index">
                <view class="item-box" ref="itemBox" v-if="item.nodeType == 3">
                    <view class="item-box-title">{{ item.baseSubWorkflow.workflowName }}</view>
                    <view v-for="(items, idx) in item.baseSubWorkflow.workflowNodeDTOS" :key="idx">
                        <view class="child-node" v-if="items.nodeType == 2">
                            <view class="child-node-text">
                                {{ items.nodeName }}
                            </view>
                            <u-icon name="arrow-rightward" v-if="idx + 2 != item.baseSubWorkflow.workflowNodeDTOS.length"
                                class="arrow-rightward" color="#666" size="28"></u-icon>
                            <view class="search-item">
                                <easy-select :ref="index + 'easySelect' + idx" size="mini" class="easySelect"
                                    :value="items.prodSysRoleVo.selectedUserName" @selectOne="selectOne($event, index, idx)"
                                    :options="items.prodSysRoleVo.sysUserList"></easy-select>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <u-icon name="arrow-downward" class="down-arrow" color="#666" size="28"></u-icon>
            <view class="item-finish">
                <view class="round">
                    <view class="round-text">结束</view>
                </view>
            </view> -->
            <setApprover :data="approverList" type="1" :forbidden="false" @dataReturn="dataReturn"></setApprover>
        </view>
        <view class="btn" @click="set">设置</view>
    </view>
</template>

<script>
import setApprover from '../../../components/set-approver/set-approver.vue';
export default {
    components: {
        setApprover
    },
    // props: {
    //     approverList: {
    //         type: Object,
    //         default: () => {
    //             return {
    //                 workflowNodeDTOS: [],
    //                 nowYear: ""
    //             };
    //         }
    //     },
    // },
    data() {
        return {
            yearList: [],
            status: true,
            approverList: {
                workflowNodeDTOS: [],
            },
            bothEndsWidth: ""
        };
    },
    onLoad(option) {
        // this.searchItemsIgnore();
        console.log(option)
        this.approverList = JSON.parse(option.row);
        // this.init()
        //     console.log("=============")
        //    console.log( this.$refs.itemBox)
        //    console.log("=============")

    },
    mounted() {
        this.$nextTick(() => {
                        console.log("=============")
            console.log( this.$refs.itemBox)
            console.log("=============")
            uni.createSelectorQuery().in(this).select('.item-box').fields({
                size: true
            }, res => {
                // console.log(res.width)
                this.bothEndsWidth = res.width
            }).exec()
        })
    },
    methods: {
        interpose() {
            uni.pageScrollTo({
                scrollTo: 0,
                duration: 0,
            })
        },
        dataReturn(arr){
            this.approverList = arr
        },
        selectOne(e, idx, id) {
            console.log(e);
            console.log(idx)
            console.log(id)
            console.log(this.approverList.workflowNodeDTOS[idx].baseSubWorkflow.workflowNodeDTOS[id].prodSysRoleVo.sysUserList)
            console.log("xxxx")
            // this.status = false
            this.approverList.workflowNodeDTOS[idx].baseSubWorkflow.workflowNodeDTOS[id].prodSysRoleVo.selectedUserId = e.options.pkId
            this.approverList.workflowNodeDTOS[idx].baseSubWorkflow.workflowNodeDTOS[id].prodSysRoleVo.selectedUserName = e.options.userName
            // this.status = true
        },
        set() {
            let arr = []
            let status = true
            this.approverList.workflowNodeDTOS.forEach(element => {
                if (element.nodeType == 3) {
                    element.baseSubWorkflow.workflowNodeDTOS.forEach(item => {
                        if (item.nodeType == 2) {
                            arr.push({
                                bizType: 0,
                                fkRoleId: item.fkRoleId,
                                currentNodeId: item.pkId,
                                currentPrecessId: element.pkId,
                                fkApproverId: item.prodSysRoleVo.selectedUserId == null ? "" : item.prodSysRoleVo.selectedUserId
                            })
                            if (item.prodSysRoleVo.selectedUserId != null && item.prodSysRoleVo.selectedUserId != '') {
                                status = false
                            }
                        }
                    })
                }
            });
            if (status) {
                return uni.showToast({ icon: "none", title: "请选择至少一位审批人" });
            }
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.prevDateFun(arr) // 调用上一页 定义的方法
            uni.navigateBack()

        },
    }
};
</script>

<style lang="scss" scoped>
.box{
    background: #fff;
}
// .interpose {
//     width: 25px;
//     height: 25px;
//     background: red;
//     position: fixed;
//     z-index: 9999999999999;
//     right: 5px;
//     top: 8px;
// }

// .box {
//     background: #fff;
//     text-align: center;
//     overflow: auto;
//     position: relative;
//     padding-bottom: 100px;
//     padding-top: 60px;
//     display: flex;
//     flex-wrap: wrap;

// }

// .box-title {
//     width: 100%;
//     text-align: left;
//     padding-left: 8px;
// }

// .item-box {
//     // width: 500px;
//     flex: 1;
//     width: 100%;
//     padding-top: 20px;
//     height: 120px;
//     border: 1px dashed #666;
//     border-radius: 5px;
//     // overflow: auto;
//     // display: -webkit-inline-box;
//     // overflow-x: auto;
//     display: flex;
//     position: relative;

//     // margin-bottom: 50px;
//     // display: flex;
//     .item-box-title {
//         position: absolute;
//         left: 8px;
//         top: 6px;
//     }

//     .child-node {
//         // display: inline-block;
//         // width: 104px;
//         // height: 40px;
//         width: 120px;
//         line-height: 40px;
//         margin: 5px;

//         margin-top: 10px;
//         margin-right: 40px;
//         text-align: center;
//         position: relative;

//         .child-node-text {
//             border: 1px solid #666;
//             border-radius: 4px;
//         }

//         .arrow-rightward {
//             position: absolute;
//             right: -32px;
//             top: 25%;
//         }

//         .search-item {
//             margin-top: 5px;
//             // position: absolute;
//         }

//         // .arrow-downward{
//         //     position: absolute;
//         //     bottom: -20px;
//         // }
//     }
// }

// .down-arrow {
//     margin-left: 60%;
// }

// .round {
//     // margin: 0 auto;
//     position: relative;
//     left: 60%;
//     width: 50rpx;
//     height: 50rpx;
//     border-radius: 50%;
//     border: 1px solid #666;

//     .round-text {
//         position: absolute;
//         top: 16%;
//         right: -40px;
//     }
// }

// .item-begin {
//     // display: -webkit-inline-box;
//     margin-bottom: 50px;
//     // flex: 1;
//     width: 100%;

//     .arrow-downward {
//         position: absolute;
//         // left: 20%;
//         bottom: -40px !important;
//     }
// }

// .item-finish {
//     // flex: 1;
//     width: 100%;

//     .round {
//         background: #666;
//     }

//     // margin-top: 50px;
// }

// .easySelect {
//     /deep/.uni-input-wrapper {
//         .uni-input-input {
//             font-size: 28rpx;
//         }
//     }
// }

// }
</style>
