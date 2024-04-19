<!-- 多流程图 -->
<template>
    <view class="wrapper">
        <view class="multi-flow-map">
            <view class="box">
                <view class="box-title">{{ approverList.workflowName }}</view>
                <view class="item-begin" :style="{ 'min-width': bothEndsWidth + 'px' }">
                    <view class="round">
                        <view class="round-text">
                            <view class="begin-text">
                                <view class="lh-40">{{ approverList[0].assignee==undefined?"": approverList[0].assignee}}</view>
                                <view class="lh-40">{{ approverList[0].endTime ==undefined?"": approverList[0].endTime}}</view>
                                <view class="lh-40">{{ approverList[0].comment ==undefined?"": approverList[0].comment}}</view>
                            </view>
                        </view>
                        <u-icon name="arrow-downward" class="arrow-downward el-icon-right-discolor" size="28"></u-icon>
                    </view>
                </view>
                <view v-for="(item, index) in approverList" :key="index" style="margin: 0 auto;">
                    <view class="item-box" ref="itemBox" v-if="item.currentNodeId != 0"
                        :style="{ 'min-width': bothEndsWidth + 'px' }">
                        <view class="item-box-title">{{ item.processName }}</view>
                        <view v-for="(items, idx) in item.childList" :key="idx">
                            <view class="child-node">
                                <view v-if="show&&index==idx1&&idx3>idx&&idx2<idx||items.approveStatus == '1'" class="left-line"></view>
                                <view v-if="show&&index==idx1&&idx2<=idx&&idx3>idx" class="right-line"></view>
                                <view v-if="show&&index==idx1&&items.approveStatus === 1||show&&index==idx1&&idx2==idx" class="top-line"></view>
                                <u-icon name="arrow-down" class="jiantou"  v-if="show&&index==idx1&&idx2==idx"></u-icon>
                                <view class="child-node-text" :class="{ 'accomplish': items.approveStatus == 2 ,'accomplish-red': items.approveStatus == 1 }"  accomplish-red>
                                    <u-icon class="ico-user" style="display: inline-block;" name="account-fill"
                                        size="18"></u-icon>
                                    {{ items.activityName }}
                                </view>
                                <u-icon name="arrow-rightward" v-if="idx + 1 != item.childList.length"
                                    class="arrow-rightward" :class="{ 'el-icon-right-discolor': items.approveStatus == 2 }"
                                    size="28"></u-icon>
                                <view class="search-item" :class="{'skip': items.assignee  ==null || items.assignee.length == 0}">
                                    <!-- <view class="item">{{ items.assignee!=null?'跳过':items.assignee}}11</view> -->
                                    <view class="item" v-if="items.assignee  == null || items.assignee.length == 0">跳过</view>
                                    <view class="item"  v-else>{{ items.assignee }}</view>
                                    <view class="item">{{ items.endTime }}</view>
                                    <view class="item">{{ items.processName }}</view>
                                </view>
                            </view>
                        </view>
                        <u-icon name="arrow-downward" :class="{ 'el-icon-right-discolor': item.approveStatus == 2 }"
                            class="item-arrow-downward"  size="28"></u-icon>
                    </view>
                </view>
                <view class="item-finish" :style="{ 'min-width': bothEndsWidth + 'px' }">
                    <view class="round">
                        <view class="round-text">结束</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    components: {},
    props: {
        data: {
            type: Array,
            default: () => [
                {
                    activityName: "开始节点",
                    approveStatus: 2,
                    assignee: "黄家兴",
                    comment: "发起流程",
                    currentNodeId: "0",
                    endTime: "2023-07-25 19:38:36",
                    flowCaseId: null,
                    processName: "",
                    userId: "1628236153791287297",
                },
                {
                    activityName: "",
                    approveStatus: "",
                    assignee: "",
                    processName: "11111",
                    childList: [
                        {
                            activityName: "12",
                            approveStatus: 2,
                            assignee: "黄家兴",
                            childList: null,
                            comment: "非常满意",
                            currentNodeId: "1683749115737767938",
                            endTime: "2023-08-02 16:09:17",
                            flowCaseId: null,
                            processName: "0909",
                            userId: "1628570438742069250",
                        },
                        {
                            activityName: "12",
                            approveStatus: 2,
                            assignee: "黄家兴",
                            childList: null,
                            comment: "非常满意",
                            currentNodeId: "1683749115737767938",
                            endTime: "2023-08-02 16:09:17",
                            flowCaseId: null,
                            processName: "0909",
                            userId: "1628570438742069250",
                        }
                    ]
                },
                {
                    activityName: "",
                    approveStatus: "",
                    assignee: "",
                    processName: "22222",
                    childList: [
                        {
                            activityName: "12",
                            approveStatus: 2,
                            assignee: "黄家兴222",
                            childList: null,
                            comment: "非常满意",
                            currentNodeId: "1683749115737767938",
                            endTime: "2023-08-02 16:09:17",
                            flowCaseId: null,
                            processName: "0909",
                            userId: "1628570438742069250",
                        },
                        {
                            activityName: "12",
                            approveStatus: 2,
                            assignee: "黄家兴333",
                            childList: null,
                            comment: "非常满意",
                            currentNodeId: "1683749115737767938",
                            endTime: "2023-08-02 16:09:17",
                            flowCaseId: null,
                            processName: "0909",
                            userId: "1628570438742069250",
                        }
                    ]
                }
            ]

        },

    },
    data() {
        return {
            approverList: [
                {
                    activityName: "开始节点",
                    approveStatus: 2,
                    assignee: "黄家兴",
                    comment: "发起流程",
                    currentNodeId: "0",
                    endTime: "2023-07-25 19:38:36",
                    flowCaseId: null,
                    processName: "",
                    userId: "1628236153791287297",
                },
                {
                    activityName: "",
                    approveStatus: "",
                    assignee: "",
                    processName: "111111",
                    childList: [
                        {
                            activityName: "12",
                            approveStatus: 2,
                            assignee: "黄家兴",
                            childList: null,
                            comment: "非常满意",
                            currentNodeId: "1683749115737767938",
                            endTime: "2023-08-02 16:09:17",
                            flowCaseId: null,
                            processName: "0909",
                            userId: "1628570438742069250",
                        },
                        {
                            activityName: "12",
                            approveStatus: 2,
                            assignee: "黄家兴",
                            childList: null,
                            comment: "非常满意",
                            currentNodeId: "1683749115737767938",
                            endTime: "2023-08-02 16:09:17",
                            flowCaseId: null,
                            processName: "0909",
                            userId: "1628570438742069250",
                        }
                    ]
                },
                {
                    activityName: "",
                    approveStatus: "",
                    assignee: "",
                    processName: "22222",
                    childList: [
                        {
                            activityName: "12",
                            approveStatus: 2,
                            assignee: "黄家兴222",
                            childList: null,
                            comment: "非常满意",
                            currentNodeId: "1683749115737767938",
                            endTime: "2023-08-02 16:09:17",
                            flowCaseId: null,
                            processName: "0909",
                            userId: "1628570438742069250",
                        },
                        {
                            activityName: "12",
                            approveStatus: 2,
                            assignee: "黄家兴333",
                            childList: null,
                            comment: "非常满意",
                            currentNodeId: "1683749115737767938",
                            endTime: "2023-08-02 16:09:17",
                            flowCaseId: null,
                            processName: "0909",
                            userId: "1628570438742069250",
                        }
                    ]
                }
            ],
            bothEndsWidth: "",
            idx1:0,
            idx2:0,
            idx3:0,
            show:false
        };
    },
    onReady(option) {

    },
    mounted() {
        let arr = JSON.stringify(this.data)
        this.approverList = JSON.parse(arr)
        this.approverList.forEach((item,index) => {
            item.assignee = item.assignee == undefined ? "" : item.assignee;
            item.endTime = item.endTime == undefined ? "" : item.endTime;
            item.endTime = item.comment == undefined ? "" : item.comment;
            item.childList = item.childList == undefined ? [] : item.childList;
            item.childList = item.childList == null ? [] : item.childList;
            item.processName = item.processName == undefined ?"": item.processName;
            if (item.childList.length > 0) {
                item.childList.forEach((e,index2) => {
                    e.assignee = e.assignee == undefined ? "" : e.assignee;
                    e.endTime = e.endTime == undefined ? "" : e.endTime;
                    e.processName = e.processName == undefined ? "" : e.processName;
                    e.endTime = e.comment == undefined ? "" : e.comment;
                    if(e.approveStatus == 1){
                        this.show=true
                        this.idx1 = index
                        this.idx3 = index2
                        this.idx2 = item.childList.findIndex(value=>{return value.assignee})
                    }
                })
            }


        })
        // this.$nextTick(() => {
        //     uni.createSelectorQuery().in(this).select('.item-box').fields({
        //         size: true
        //     }, res => {
        //         this.bothEndsWidth = res.width
        //     }).exec()

        // })
        this.$nextTick(() => {
            // if (this.type == 1) {
                uni.createSelectorQuery().in(this).select('.item-box').fields({
                    size: true
                }, res => {
                    this.bothEndsWidth = res.width
                }).exec()
            // }
        })
    },
    methods: {
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
        // width: 100vh;
        width: 100%;
        padding-top: 20px;
        margin-top: 20px;
        // height: 120px;
        border: 1px dashed #666;
        border-radius: 5px;
        display: flex;
        position: relative;
        justify-content: center;
        width: 100vh;

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
            .left-line{
                position: absolute;
                width: 50%;
                height: 1px;
                top: -20px;
                left: 0;
                background-color: #000;
            }
            .right-line{
                position: absolute;
                top: -20px;
                right: -45px;
                width: calc(50% + 45px);
                height: 1px;
                background-color: #000;
            }
            .jiantou{
                position: absolute;
                top: -10px;
                left: 50%;
                font-weight: 700;
                transform: translateX(-50%);
            }
            .top-line{
                position: absolute;
                width: 1px;
                height: 20px;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #000;
            }
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
                border: 1px dashed #d7d7d7;

                margin-top: 5px;

                .item {
                    font-size: 12px;
                    line-height: 40rpx;
                }
            }
            .skip{
                border:none;
                color:red;
            }
        }
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


.not-found {
    background-color: red;

    .uni-input-placeholder {
        color: #000;
        font-size: 12px;
    }
}

.begin-text {
    position: absolute;
    width: 120px;
    border: 1px dashed;
    left: -20px;
    font-size: 13px;
    padding: 5px;
}

.el-icon-right-discolor {
    /deep/ .u-icon__icon {
        color: #dafba9 !important;
    }
}
.accomplish {
    background-color: #dafba9;
}

.el-icon-right-discolor-red {
    /deep/ .u-icon__icon {
        color: red !important;
    }
}
.accomplish-red {
    background-color: red;
}
.lh-40{
    line-height: 40rpx;
}
</style>
