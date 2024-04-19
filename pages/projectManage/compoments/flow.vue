<template>
  <view class="flows" @tap="nodeClick(data,1)">
      <view class="flow-chart-box">
        <view class="flow-char-begin">
          <view class="circle">
            <view class="circle-item"></view>
            <view class="circle-icon-bottom">
              <u-icon size="15" name="arrow-down" class="el-icon-arrow-down circle-icon"></u-icon>
            </view>
            <view class="end">发起流程</view>
          </view>
        </view>

        <view class="flow-char-item" v-for="(item, index) in taskFinishVoList" :key="index" >
          <view class="char-item-left" @tap.stop="nodeClick(item,2)">
            <view class="char-item-left-name">
              <image src="../../../static/image/avg.png" mode="widthFix" />
              <view>{{ item.nodeName }}</view>
            </view>
            <view class="down-arrow">
                <u-icon size="15" name="arrow-down" class="el-icon-arrow-down arrow"></u-icon>
            </view>
          </view>
        </view>
        <view class="flow-char-end">
          <view class="circle">
            <view class="circle-item"></view>
            <view class="end">结束</view>
          </view>
          <!-- <view class="begin-details"></view> -->
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
                    <!-- <view class="con2" v-if="type==2">
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
                    </view> -->
                    <view class="con3" v-if="type==2">
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
props:{
    data:{
        type:Object,
        default:()=>{return {}}
    },
    tops:{
        type:Boolean,
        default:false
    }
},
data(){
    return{
        taskFinishVoList:[],
        nowClick:{},
        type:1,
        show:false
    }
},
mounted(){
    console.log(this.data);
    if(this.data.pkId){
        this.taskFinishVoList = this.data.workflowNodeDTOS.filter(item=>item.nodeType==2)
        this.nowClick=this.data
    }
},
watch:{
    data(){
        this.taskFinishVoList = this.data.workflowNodeDTOS.filter(item=>item.nodeType==2)
        this.nowClick=this.data
    }
},
methods:{
    nodeClick(item,type){
        console.log(item,type);
        this.nowClick=item
        this.type=type
    }
}
}
</script>

<style lang="scss" scoped>
.flows{
    text-align: center;
}
.flow-chart-box {
  width: 100%;
  height: 100%;
  overflow: hidden auto;
    image{
        width: 30rpx;
    }
  .flow-char-begin {
    position: relative;
    display: flex;
    justify-content: center;
    padding: 40rpx;
    .end {
      position: absolute;
      top: 0;
      right: -80rpx;
    }
    .circle {
      width: 180rpx;
      line-height: 120rpx;
      text-align: center;
      vertical-align: middle;
      text-align: center;
      position: relative;

      .circle-item {
        width: 60rpx;
        height: 60rpx;
        border-radius: 30rpx;
        border: 2rpx solid;
        vertical-align: middle;
        display: inline-block;
      }

      .circle-icon-bottom {
        width: 2rpx;
        height: 80rpx;
        border-right: 2rpx solid #70b603;
        position: absolute;
        left: 49%;
        bottom: -68rpx;

        .circle-icon {
          color: #70b603;
          position: absolute;
          bottom: -18rpx;
          left: -14rpx;
        }
      }

      .circle-icon-right {
        position: absolute;
        width: 100rpx;
        border-top: 2rpx solid;
        top: 54rpx;
        left: 73%;

        .icon-right-left {
          position: absolute;
          bottom: -14rpx;
          left: -10rpx;
        }
      }
    }

    .begin-details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 240rpx;
      height: 120rpx;
      // text-align: center;
      border: 2rpx dashed;
      font-size: 22rpx;
    }
  }

  .flow-char-item {
    display: flex;
    justify-content: center;
    padding: 40rpx;

    .char-item-left {
      width: 180rpx;
      // line-height: 60px;
      text-align: center;
      border: 2rpx solid;
      vertical-align: middle;
      position: relative;
      border-radius: 10rpx;
      .char-item-left-name {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 120rpx;
      }
      .down-arrow {
        width: 2rpx;
        height: 80rpx;
        border-right: 2rpx dashed;
        position: absolute;
        left: 49%;

        .arrow {
          position: absolute;
          bottom: -12rpx;
          left: -14rpx;
        }
      }
      .circle-icon-right {
        position: absolute;
        width: 50rpx;
        border-top: 2rpx solid;
        top: 54rpx;
        right: -54rpx;

        .icon-right-left {
          position: absolute;
          bottom: -14rpx;
          left: -10rpx;
        }
      }
      .right-arrow {
        position: absolute;
        width: 140rpx;
        border-top: 2rpx solid;
        top: 156rpx;
        left: 50%;
      }

      .upper-right {
        position: absolute;
        height: 104rpx;
        border-right: 2rpx solid;
        left: 228rpx;
        bottom: -38rpx;
      }
      .right-arrow2 {
        position: absolute;
        width: 50rpx;
        border-top: 2rpx solid;
        top: 70rpx;
        left: 178rpx;
      }
      .upper-right2 {
        position: absolute;
        height: 218rpx;
        border-right: 2rpx solid;
        left: 228rpx;
        bottom: 48rpx;
      }
      .turn-down {
        position: absolute;
        background: #ffff;
        left: 220rpx;
        top: -134rpx;
      }
      .turn-down2{
        position: absolute;
        background: #ffff;
        left: 220rpx;
        top: 58%;
        font-size: 28rpx;
      }
    }

    .char-item-pass {
      background: #dafba9;
      border-color: #dafba9;

      .down-arrow {
        border-right: 2rpx solid #70b603;

        .arrow {
          color: #70b603;
        }
      }
    }
    .char-item-nopass {
      background: #f2a6af;
      border-color: #f2a6af;
    }
    .char-item-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 240rpx;
      height: 120rpx;
      // text-align: center;
      border: 2rpx dashed;
      // line-height: 60px;
      font-size: 24rpx;
    }
  }
  .flow-char-end {
    display: flex;
    justify-content: center;
    padding: 40rpx;

    .circle {
      width: 180rpx;
      line-height: 120rpx;
      text-align: center;
      vertical-align: middle;
      text-align: center;
      position: relative;

      .circle-item {
        width: 60rpx;
        height: 60rpx;
        border-radius: 30rpx;
        border: 2rpx solid;
        vertical-align: middle;
        display: inline-block;
        background-color: #000;
      }

      .circle-icon-bottom {
        width: 2rpx;
        height: 80rpx;
        border-right: 2rpx solid #70b603;
        position: absolute;
        left: 49%;
        bottom: -68rpx;

        .circle-icon {
          color: #70b603;
          position: absolute;
          bottom: -18rpx;
          left: -14rpx;
        }
      }

      .circle-icon-right {
        position: absolute;
        width: 100rpx;
        border-top: 2rpx solid;
        top: 54rpx;
        left: 73%;

        .icon-right-left {
          position: absolute;
          bottom: -14rpx;
          left: -10rpx;
        }
      }
    }
    .end {
      position: absolute;
      top: 0;
      right: -30rpx;
    }
    .begin-details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 240rpx;
      height: 120rpx;
      // text-align: center;
      // border: 1px dashed;
      font-size: 22rpx;
    }
  }
}
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
            width: 20px;
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
                text-align: left;
                margin-bottom: 4px;
            }
        }
    }
</style>