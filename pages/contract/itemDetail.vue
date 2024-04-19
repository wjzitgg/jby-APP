<template>
  <view class="wrapper">
    <u-navbar leftText="清单明细" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true" ></u-navbar>
    <view class="sticky" v-if="getData.inventoryCode === 'inventory_build'">
    <u-tabs :list="tabList" :current="current" @change="currentChange" :activeStyle="{ color: 'rgba(32, 52, 87, 1)' }" :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }" > </u-tabs>
    </view>
    <view class="pad" v-if="getData.inventoryCode === 'inventory_build'"></view>
    <view class="" v-if="current==0">
        <view class="contentName">{{getData.subitemNum}}</view>
        <tableForm v-if="getData.inventoryCode != 'inventory_itemize'" :pageHeight="false" :pageMr="false" :emptyShow="false" :list="[
		{name:'清单类型',value:getData.inventoryCodeName,show:true},
		{name:'清单名称',value:getData.detailName,show:true},
		{name:'专业类别',value:getData.fkProfessionalTypeId,show:getData.inventoryCode !== 'inventory_cost'},
		{name:'合同数量',value:getData.contractNum,show:getData.inventoryCode !== 'inventory_cost'},
		{name:'设计数量',value:getData.quantities,show:getData.inventoryCode === 'inventory_build'},
		{name:'单位',value:getData.unitName,show:true},
		{name:'清单价',value:getData.price,show:getData.inventoryCode === 'inventory_build'},
		{name:'清单总额',value:getData.amount,show:getData.inventoryCode === 'inventory_cost'},
		{name:'备注',value:getData.remark,show:true},
		]">
		</tableForm>
        <tableForm v-else :pageHeight="false" :pageMr="false" :emptyShow="false" :list="[
        {name:'清单类型',value:getData.inventoryCodeName,show:true},
        {name:'清单名称',value:getData.detailName,show:true},
		]">
		</tableForm>
    </view>
    <view class="" v-show="current==1">
        <trees ref="weert" class="price-amount" :multiple="false" :associatedNode="false" :selectParent="false" :disabled="false" :wipeStatus="true" :localdata="treeData" valueKey="pkId" textKey="itemName" childrenKey="prodItemLists"></trees>
    </view>
    <view class="pdb" v-if="addCheck"></view>
    <view class="footer-btns" v-if="addCheck">
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
    this.addCheck = !!options.addCheck
    this.contractId=options.contractId
    this.projectId=options.projectId
    this.customId=options.customId
    let obj = JSON.parse(options.row)
    console.log(obj);
    this.getData=obj
    if(this.getData.inventoryCode === 'inventory_build'){
        this.tabList.push({name:"关联分项清单项目"})
        this.searchContractItems()
    }
},
data(){
    return{
        tabList:[{name:"清单明细"}],
        current:0,
        getData:{},
        contractType:0,
        treeData:[],
        addCheck:false
    }
},
methods:{
    del(){
        let pages = getCurrentPages();
        let prevPage =prevPage = pages[pages.length - 2]
		prevPage.$vm.delDetails(); // 调用上一页 定义的方法
        uni.navigateBack({ delta: 1 })
    },
    edit(){
        let url = `/pages/contract/addchartDetail?edit=1&contractType=${this.contractType}&typeId=${this.getData.inventoryCode}&typeName=${this.getData.inventoryCodeName}&customId=${this.customId}`
        if(this.contractId){
          url+=`&conId=${this.contractId}`
        }
        if(this.projectId){
            url+=`&projectId=${projectId}`
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