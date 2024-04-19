<!-- 多流程图 -->
<template>
    <view class="multi-flow-map" @tap.stop="itemClick(data,1)">
            <view class="box">
                <view class="box-title">{{ data.workflowName }}</view>
                <view class="item-begin" :style="{ 'min-width': bothEndsWidth + 'px' }">
                     <view class="round">
                        <view class="round-text">
                            开始
                        </view>
                        <u-icon name="arrow-downward" class="arrow-downward el-icon-right-discolor" size="28"></u-icon>
                    </view>
                </view>
                <view v-for="(item, index) in approverList" :key="index" style="margin: 0 auto;"  @tap.stop="itemClick(item,2)">
                    <view class="item-box" ref="itemBox" v-if="item.currentNodeId != 0"
                        :style="{ 'min-width': bothEndsWidth + 'px' }">
                        <view class="item-box-title">{{ item.processName }}</view>
                        <view v-for="(items, idx) in item.workflowNodes" :key="idx" >
                            <view class="child-node">
                                <view class="child-node-text" @tap.stop="itemClick(items,3)">
                                    <u-icon class="ico-user" style="display: inline-block;" name="account-fill"
                                        size="18"></u-icon>
                                    {{ items.nodeName }}
                                </view>
                                <u-icon name="arrow-rightward" v-if="idx + 1 != item.workflowNodes.length" class="arrow-rightward" size="28"></u-icon>
                            </view>
                        </view>
                        <u-icon name="arrow-downward" class="item-arrow-downward"  size="28"></u-icon>
                    </view>
                </view>
                <view class="item-finish" :style="{ 'min-width': bothEndsWidth + 'px' }">
                    <view class="round">
                        <view class="round-text">结束</view>
                    </view>
                </view>
            </view>
            <view class="bpmn-details" :style="{bottom:tops?'100rpx':''}" @tap.stop>
                <view class="showClick" @tap.stop="show=!show">{{show?'》':"《"}}</view>
                <view class="bpmn-details-content" :class="show?'wh-200':''" v-if="show">
                    <view class="con1" v-if="type==1">
                        <view class="con-title">流程信息</view>
                        <view class="con-item">
                            <view class="con-item-title">发起人设置</view>
                            <view class="con-item-content">
                                <u-input  border="surround" v-model="['不限','指定岗位','首个流程节点岗位'][nowClick.launchType]" disabled></u-input>
                                <u-input  border="surround" v-model="nowClick.fkRoleIdName" disabled></u-input>
                            </view>
                        </view>
                        <view class="con-item">
                            <view class="con-item-title">发起人填写表格</view>
                            <view class="tableList">
                                <view v-for="(item,index) in nowClick.workflowTableList" :key="index">{{item.tableName}}</view>
                            </view>
                        </view>
                    </view>
                    <view class="con2" v-if="type==2">
                        <view class="con-title">工序信息</view>
                        <view class="con-item">
                            <view class="con-item-title">工序名称</view>
                            <u-input  border="surround" v-model="nowClick.nodeName" disabled></u-input>
                        </view>
                        <view class="con-item">
                            <view class="con-item-title">关联资料</view>
                            <view class="pdfList">
                            <view v-for="(item,index) in nowClick.bookPdfDTOS" :key="index" class="pdfList-item"> {{['技术规范','安全规范','验收标准'][item.bookType]}}:{{item.bookName}}{{item.beginPage+'~'+item.endPage+'页'}}</view>
                            </view>
                        </view>
                        <view class="con-item">
                            <view class="con-item-title">关联表格</view>
                            <view class="pdfList">
                            <view v-for="(item,index) in nowClick.tableDTOS" :key="index" class="pdfList-item">{{item.tableName}}</view>
                            </view>
                        </view>
                    </view>
                    <view class="con3" v-if="type==3">
                        <view class="con-title">节点信息</view>
                        <view class="con-item">
                            <view class="con-item-title">节点名称</view>
                            <u-input  border="surround" v-model="nowClick.nodeName" disabled></u-input>
                        </view>
                        <view class="con-item">
                            <view class="con-item-title">审批岗位</view>
                            <view class="con-item-content">
                                <u-input border="surround" v-model="nowClick.roleTypeName" disabled></u-input>
                                <u-input border="surround" v-model="nowClick.roleName" disabled></u-input>
                            </view>
                        </view>
                        <view class="con-item">
                            <view class="con-item-title">可编辑内容</view>
                            <view class="con-item-content">
                                <checkbox-group>
				                	<label>
				                		<checkbox :checked="!!nowClick.quantitiesTable" disabled/>工程量
				                	</label>
				                	<label>
				                		<checkbox :checked="!!nowClick.materialUsedTable" disabled/>材料用量
				                	</label>
				                	<label>
				                		<checkbox :checked="!!nowClick.scoreFlag" disabled/>工程评分
				                	</label>
				                </checkbox-group>
                            </view>
                        </view>
                        <view class="con-item">
                            <view class="con-item-title">可填写表格</view>
                            <view class="pdfList">
                            <view v-for="(item,index) in nowClick.tableDTOS" :key="index" class="pdfList-item">{{item.tableName}}</view>
                            </view>
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
            type: Object,
            default: () => {}
        },
        tops:{
        type:Boolean,
        default:false
    }
    },
    data() {
        return {
            approverList: [],
            bothEndsWidth: "",
            show:false,
            type:1,
            nowClick:{}
        };
    },
    onReady(option) {

    },
    mounted() {
        let arr = []
        this.data.workflowNodeDTOS.forEach(item=>{
            if(item.nodeType==3){
                arr.push(item)
            }
        })
        arr.forEach(item => {
            console.log(item);
          item.workflowNodes = item.baseSubWorkflow.workflowNodeDTOS.filter(item=>item.nodeType==2);
        });
        this.approverList = arr
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
        itemClick(item,type){
            this.type=type
            this.nowClick=item
        }
    }
};
</script>

<style lang="scss" scoped>
.multi-flow-map {
    position: relative;
    height: 100%;
    // overflow: auto;
    .bpmn-details{
        display: flex;
        position: fixed;
        bottom: 0;
        right: 0;
        height: 300px;
        background-color: #fff;
        .showClick{
            display: flex;
            align-items: center;
            width: 15px;
            height: 300px;
            font-size: 12px;
            background-color: #81d3f8;
        }
        .bpmn-details-content{
            width: 0;
            height: 100%;
        }
        .wh-200{
            width: 250px;
        }
        .con-title{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;
            background-color: #80ffff;
        }
        .con-item-title{
            padding-left: 10px;
            background-color: #f2f2f2;
        }
        .con-item-content{
            display: flex;
        }
        .tableList{
            height: 200px;
            overflow: auto;
        }
        .pdfList{
            height: 100px;
            overflow: auto;
            .pdfList-item{
                margin-bottom: 4px;
            }
        }
    }
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
            // width: 120px;
            line-height: 40px;
            padding: 10px;
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
