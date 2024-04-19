<template>
   <view class="wrapper">
		<u-navbar leftText="流程信息审核" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
        <tableForm :pageHeight="false" :pageMr="false" :list="[
	    {name:'流程名称',value:form.workflowTemplateVo.workflowName,show:true},
	    {name:'单位工程',value:form.oneParentName,show:true},
	    {name:'分部工程',value:form.secondParentName,show:true},
	    {name:'分项工程',value:form.fkItemName,show:true},
	    {name:'申请人',value:form.createUserName,show:true},
	    {name:'申请时间',value:form.createTime,show:true},
	    {name:'审批状态',value:form.enableStatus,show:true},
	    ]">
	</tableForm>
    <view class="bpmn">
        <h3>流程图</h3>
        <view class="bpmn-content" :class="(getData.changeStatus||getData.handleStatus)?'hs2':''">
            <chart :data="form.workflowTemplateVo" :tops="!!(getData.changeStatus||getData.handleStatus)"  v-if="form.bizType=='生产验收流程'"></chart>
            <flows :data="form.workflowTemplateVo" :tops="!!(getData.changeStatus||getData.handleStatus)" v-else></flows>
        </view>
    </view>
    <view class="pdb"></view>
    <view class="footer-btns" v-if="getData.changeStatus||getData.handleStatus">
        <view class="footer-btns-item col1" @click="approves(1)" v-if="getData.changeStatus">审批</view>
        <view class="footer-btns-item col1" @click="approves(1)" v-if="getData.handleStatus">同意撤回</view>
        <view class="footer-btns-item col2" @click="approves(2)">驳回</view>
    </view>
        <u-popup :show="show" @close="close" mode="center">
            <view class="pop">
                <view class="pop-title">审批意见</view>
                <view class="pop-content">
                  <u--textarea v-model="remark" placeholder="请输入内容" ></u--textarea>
                </view>
                <view class="pop-footer">
                  <view class="pop-footer-btn col1" @click="btnOk">确定</view>
                </view>
            </view>
		</u-popup>
   </view>
</template>

<script>
import tableForm from '../../components/table-form/table-form.vue';
import chart from './compoments/multiflow-chart';
import flows from './compoments/flow';
export default {
components:{tableForm,chart,flows},
data(){
    return{
        show:false,
        popTitle:"审批意见",
        remark:"",
        form:{
            workflowTemplateVo:{}
        },
        getData:{},
        enableStatus:""
    }
},
onLoad(options) {
    let obj =JSON.parse(options.item)
    this.getData=obj
    this.findExamineById(obj.pkId)
},
methods:{
    findExamineById(pkId){
        this.$api.findExamineById({pkId}).then(res=>{
            if(res.code==200){
                this.form = res.data
            }else{
                uni.showToast({ title: res.msg, icon: 'icon' })
            }
        })
    },
    close(){
      this.show = false
      this.remark=""
    },
    approves(enableStatus){
      this.show=true
      this.enableStatus=enableStatus
    },
    btnOk(){
        if(!this.remark){
      return uni.showToast({title:"请填写意见",icon:"none"})
    }
    let arr =[{enableStatus:this.enableStatus,remark:this.remark,pkId:this.getData.pkId}]
    this.$api.approveExamine(arr).then(res=>{
      if(res.code==200){
        let pages = getCurrentPages()
         let prevPage = pages[pages.length - 2]; // 上一页面实例
         prevPage.$vm.resh() // 调用上一页 定义的方法
        uni.navigateBack({ delta: 1 })
        uni.showToast({title:"操作成功"})
      }else{
        uni.showToast({title:res.msg,icon:"none"})
      }
    })
    }
}
}
</script>

<style lang="scss" scoped>
.pop{
  width: 600rpx;
  .pop-title{
    display: flex;
    align-items: center;
    height: 80rpx;
    padding: 0 20rpx;
    font-size: 30rpx;
    font-weight: 700;
  }
  .pop-content{
    padding: 0 20rpx;
    margin-bottom: 20rpx;
  }
  .pop-footer{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
    .pop-footer-btn{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 200rpx;
      height: 60rpx;
      color: #fff;
       background-color: #169bd5;
    }
  }
}
.bpmn{
    background-color: #fff;
    .bpmn-content{
        width: 750rpx;
        height: calc(100vh - 730rpx);
        overflow: scroll;
    }
    .hs2{
        height: calc(100vh - 830rpx);
    }
}
.pdb{
    height: 100rpx;
}
.footer-btns{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    height: 100rpx;
    .footer-btns-item{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        height: 100%;
        color: #fff;
    }
    .col1{
    background-color: #169bd5;
  }
  .col2{
    background-color: #ec808d;
  }
}
</style>