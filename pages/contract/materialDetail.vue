<template>
  <view class="wrapper">
    <u-navbar leftText="物料详情" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true" ></u-navbar>
    <view class="" v-if="contractType==3">
        <view class="contentName">{{getData.subitemNum}}</view>
        <tableForm :pageHeight="false" :pageMr="false" :emptyShow="false" :list="[
		{name:'材料类型',value:getData.inventoryCodeName,show:true},
		{name:'材料名称',value:getData.detailName,show:true},
		{name:'合同数量',value:getData.contractNum,show:true},
		{name:'单位',value:getData.unitName,show:true},
		{name:'单价',value:getData.price,show:true},
		{name:'总额',value:getData.amount,show:true},
		{name:'备注',value:getData.remark,show:true},
		]">
		</tableForm>
    </view>
    <view class="" v-if="contractType==4">
        <view class="contentName">{{getData.subitemNum}}</view>
        <tableForm :pageHeight="false" :pageMr="false" :emptyShow="false" :list="[
		{name:'材料类型',value:getData.fkTypeName,show:true},
		{name:'材料名称',value:getData.materialName,show:true},
		{name:'供货数量',value:getData.supplyNum,show:['supply_deduction', 'supply_other'].includes(inventoryType)},
		{name:'超额比例',value:getData.supplyNum,show:['supply_noDeduction'].includes(inventoryType)},
		{name:'单位',value:getData.fkUnitName,show:true},
		{name:'超额扣款单价',value:getData.excessPrice,show:['supply_noDeduction'].includes(inventoryType)},
		{name:'供应单价',value:getData.supplyPrice,show:['supply_deduction', 'supply_other'].includes(inventoryType)},
		{name:'总额',value:(getData.supplyPrice - 0) * (getData.supplyNum - 0) ? ((getData.supplyPrice - 0) * (getData.supplyNum - 0)).toFixed(2) - 0 : '',show:['supply_deduction', 'supply_other'].includes(inventoryType)},
		{name:'备注',value:getData.remark,show:true},
		]">
		</tableForm>
    </view>
    <view class="pdb"></view>
    <view class="footer-btns">
        <view class="cancel" @click="del">删除</view>
        <view class="primary" @click="edit">编辑</view>
    </view>
  </view>
</template>

<script>
import tableForm from '../../components/table-form/table-form';
import trees from './ba-tree-picker';
export default {
    components:{tableForm,trees},
onLoad(options) {
    this.contractType=options.contractType - 0
    this.contractId=options.contractId - 0
    this.customId=options.customId
    this.typeName = options.typeName
    if(this.contractType==4){
        this.inventoryType = options.inventoryType
    }
    let obj = JSON.parse(options.row)
    console.log(obj);
    this.getData=obj
},
data(){
    return{
        tabList:[{name:"清单明细"}],
        current:0,
        getData:{},
        contractType:0,
        treeData:[],
        typeName:"",
        inventoryType:""
    }
},
methods:{
    del(){
        let pages = getCurrentPages();
        let prevPage =prevPage = pages[pages.length - 2]
		prevPage.$vm.delMaterial(); // 调用上一页 定义的方法
        uni.navigateBack({ delta: 1 })
    },
    edit(){
        let url = `/pages/contract/addMaterial?edit=1&contractType=${this.contractType}&typeName=${this.typeName}&customId=${this.customId + ''}&conId=${this.contractId}`
        if(this.contractId){
          url+=`&conId=${this.contractId}`
        }
        if(this.contractType==4){
           url+=`&inventoryType=${this.inventoryType}`
        }
        url+=`&row=${JSON.stringify(this.getData)}`
        uni.navigateTo({url})
    },
    currentChange(item){
        this.current = item.index
    },
    searchContractItems(){
        let data ={
            contractType:this.contractType,
            contractId:this.contractId,
            customId:this.customId,
            fkProfessionalTypeId:this.getData.fkProfessionalTypeId,
            detailId:this.getData.pkId
        }
        this.$api.searchContractItems(data).then((res) => {
            if(res.code===200){
                this.treeData=res.data
                this.$nextTick(()=>{
					this.$refs.weert._initTree()
				})
            }else{
                uni.showToast({
                    title: res.msg,
                    icon:"none"
                })
            }
        })
    },
}
}
</script>

<style lang="scss" scoped>
.pad{
    height: 100rpx;
}
.contentName{
  padding: 40rpx 0 10rpx 40rpx;
  font-size: 36rpx;
  font-weight: 700;
  background-color: #fff;
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
    .cancel{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 270rpx;
        color: #fff;
        background-color: #e64343;
    }
    .primary{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 480rpx;
        color: #fff;
        background-color: #1576e6;
    }
}
</style>