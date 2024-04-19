<template>
  <view class="wrapper addPageBg">
    <u-navbar leftText="清单明细" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true" ></u-navbar>
    <view class="sticky" v-if="form.inventoryCode === 'inventory_build'">
    <u-tabs :list="tabList" :current="current" @change="currentChange" :activeStyle="{ color: 'rgba(32, 52, 87, 1)' }" :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }" > </u-tabs>
    <view class="searchs"  v-if="current!=0">
        <searchInput @search="searchItem" v-model="itemName"></searchInput>
    </view>
    </view>
    <view class="pad"  v-if="form.inventoryCode === 'inventory_build'"></view>
    <view class="pad2" v-if="current!=0"></view>
    <view class="content" v-if="current==0">
        <view class="add-inputs">
        <view class="inputs-label">清单类型</view>
        <view class="inputs-content select">
            <view class="name">{{ typeName }}</view>
            <u-icon name="lock-fill" class="icons" size="14"></u-icon>
          </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">子目号</view>
        <view class="sumbNum">
            <view class="sumbNum-sels">
                <easy-select ref="easySelect" size="mini" class="easySelect" :value="changeType" @selectOne="selectOne" :options="changeTypeList"></easy-select>
            </view>
            <view class="num-input">
                <u-input border="none" type="number" maxlength="4" v-model.trim="itemCodes[0]" @input="numInputs($event,0)"></u-input>
            </view>
            <view class="num-input" v-if="changeTypeVal>1">
                <u-input border="none" type="number" maxlength="4" v-model.trim="itemCodes[1]" @input="numInputs($event,1)"></u-input>
            </view>
            <view class="num-input" v-if="changeTypeVal>2">
                <u-input border="none" type="number" maxlength="4" v-model.trim="itemCodes[2]" @input="numInputs($event,2)"></u-input>
            </view>
            <view class="num-input" v-if="changeTypeVal>3">
                <u-input border="none" type="number" maxlength="4" v-model.trim="itemCodes[3]" @input="numInputs($event,3)"></u-input>
            </view>
            <view class="num-input" v-if="changeTypeVal==5">
                <u-input border="none" type="number" maxlength="4" v-model.trim="itemCodes[4]" @input="numInputs($event,4)"></u-input>
            </view>
        </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">清单名称</view>
        <view class="inputs-content">
          <u--textarea v-model="form.detailName" placeholder="请输入内容" autoHeight maxlength="50" border="none" ></u--textarea>
        </view>
      </view>
      <view class="add-inputs" v-if="form.inventoryCode === 'inventory_build'">
        <view class="inputs-label">专业类别</view>
        <view class="inputs-content select" @click="pickShow=true">
            <view class="name">{{ majorName }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12" ></u-icon>
          </view>
      </view>
      <u-picker :show="pickShow" :columns="[majorList]" keyName="label" @confirm="pickConfirm" @cancel="pickShow=false"></u-picker>

      <view class="add-inputs" v-if="form.inventoryCode === 'inventory_build'">
        <view class="inputs-label">合同数量</view>
        <view class="inputs-content">
          <u--textarea v-model="form.contractNum" placeholder="请输入内容" autoHeight  border="none" @input="numInput2($event,1)"></u--textarea>
        </view>
      </view>
     <view class="add-inputs" v-if="form.inventoryCode === 'inventory_build'">
        <view class="inputs-label">设计数量</view>
        <view class="inputs-content select">
            <view class="name">{{ form.quantities }}</view>
            <u-icon name="lock-fill" class="icons" size="14"></u-icon>
          </view>
      </view>
     <view class="add-inputs" v-if="['inventory_build','inventory_cost'].includes(form.inventoryCode)">
        <view class="inputs-label">单位</view>
        <view class="inputs-content select" @click="pickShow2=true">
            <view class="name">{{ form.unitName }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12" ></u-icon>
          </view>
          <u-picker :show="pickShow2" :columns="[unitList]" keyName="label" @confirm="pickConfirm2" @cancel="pickShow2=false"></u-picker>
      </view>
      <view class="add-inputs" v-if="form.inventoryCode === 'inventory_build'">
        <view class="inputs-label">清单价</view>
        <view class="inputs-content">
          <u--textarea v-model="form.price" placeholder="请输入内容" autoHeight  border="none" @input="numInput2($event,2)"></u--textarea>
        </view>
      </view>
      <view class="add-inputs" v-if="['inventory_build','inventory_cost'].includes(form.inventoryCode)">
        <view class="inputs-label">清单总额</view>
        <view class="inputs-content select" v-if="form.inventoryCode !== 'inventory_cost'">
            <view class="name">{{ amount }}</view>
            <u-icon name="lock-fill" class="icons" size="14"></u-icon>
          </view>
          <view class="inputs-content" v-else>
          <u--textarea v-model="form.amount" placeholder="请输入内容" autoHeight  border="none" @input="numInput2($event,2)"></u--textarea>
        </view>
      </view>
      <view class="add-inputs" v-if="['inventory_build','inventory_cost'].includes(form.inventoryCode)">
        <view class="inputs-label">备注</view>
        <view class="inputs-content">
          <u--textarea v-model="form.remark" placeholder="请输入内容" autoHeight  border="none" maxlength="100"></u--textarea>
        </view>
      </view>
    </view>
    <view class="checkBoxs" v-if="current==1">
        <u-checkbox-group v-model="checkedItem" iconPlacement="right" placement="column" v-if="showItemList.length">
        	<u-checkbox v-for="item in showItemList" :key="item.pkId" :label="item.itemName" :name="item.pkId"></u-checkbox>
        </u-checkbox-group>
        <view class="emputy" v-else>
        <u-empty mode="data" text="暂无清单数据" icon="/static/image/noData.png" ></u-empty>
      </view>
    </view>
    <view class="" v-if="current==2">
        <trees ref="weert" class="price-amount" :selectedData="selItem" :multiple="true" :associatedNode="false" :selectParent="false"
            		:disabled="false" :wipeStatus="true" :localdata="treeData" valueKey="pkId" textKey="itemName" @select="treeSel"
            		childrenKey="prodItemLists" :disabledList="treeDisabled"></trees>
    </view>
      <view class="pdb"></view>
      <view class="footer-btns">
        <view class="footer-btns-item cancel" @click="back" v-if="current==0">取消</view>
        <view class="footer-btns-item cancel" @click="backStep" v-if="form.inventoryCode === 'inventory_build'&&current!=0">上一步</view>
        <view class="footer-btns-item comfit" @click="nextStrp" v-if="form.inventoryCode === 'inventory_build'&&current<2" :class="{disabled:current==1&&!checkedItem.length}">下一步</view>
        <view class="footer-btns-item comfit" @click="btnOk" v-if="form.inventoryCode === 'inventory_build'&&current==2||form.inventoryCode !== 'inventory_build'&&current==0">确认</view>
      </view>
  </view>
</template>

<script>
import searchInput from '../../components/search-tag/search-input';
import trees from './ba-tree-picker2';
export default {
components:{searchInput,trees},
onLoad(options) {
    this.form.inventoryCode = options.typeId
    this.form.inventoryCodeName = options.typeName
    this.edit = !!options.edit
    this.projectId = options.projectId?options.projectId:""
    this.typeName = options.typeName
    this.contractType = options.contractType
    this.customId = options.customId
    this.conId = options.contractId
    if(this.form.inventoryCode === 'inventory_build'){
        this.searchMajorTypeList()
        this.unitSearch(0)
    }
    if(this.form.inventoryCode === 'inventory_cost'){
        this.unitSearch(2)
    }
    if(this.edit){
        let obj = JSON.parse(options.row)
        this.form = obj
        this.itemCodes = this.form.subitemNum.split('-')
        let changTypeObj = this.changeTypeList.filter(item=>item.value==this.itemCodes.length)[0]
        this.changeType =changTypeObj.label
        this.changeTypeVal =changTypeObj.value
        this.searchItemDetailByOrgId()
    }else{
        this.form.isAppearUpdate = 1
        this.form.isDelete = 1
    }
     let pages = getCurrentPages();
        let prevPage =null
        if(this.edit){
            prevPage = pages[pages.length - 3]
        }else{
            prevPage = pages[pages.length - 2]
        }
        this.treeDisabled = prevPage.$vm.treeDisabled
    
},
data(){
    return{
        tabList: [{ name: "填写清单信息" },{ name: "选择清单细目" },{ name: "关联分项工程" ,disabled:true}],
        current:0,
        form:{
            inventoryCode:"",
            detailName: null, // 工程名称
            quantities: "", // 合同数量
            contractNum: "",
            fkUnitId: null, // 单位
            fkMaterialId: "",
            price: null, // 清单价
            amount: null, // 清单总额
            remark: null, // 备注
            itemIds: [] // 分项工程
        },
        typeName:"",
        changeType:"一级子目号",
        changeTypeVal:1,
        changeTypeList: [
        { value: 1, label: "一级子目号" },
        { value: 2, label: "二级子目号" },
        { value: 3, label: "三级子目号" },
        { value: 4, label: "四级子目号" },
        { value: 5, label: "五级子目号" }
      ],
      itemCodes:[],
      majorList:[],
      majorName:"",
      customId:"",
      conId:"",
      contractType:"",
      pickShow:false,
      pickShow2:false,
      unitList:[],
      itemList:[],
      checkedItem:[],
      itemName:"",
      seaitemName:"",
      treeData:[],
      selItem:[],
      timer:null,
      edit:false,
      projectId:"",
      treeDisabled:[]
    }
},
watch:{
    checkedItem(val){
        if(val.length){
            this.tabList[2].disabled = false
        }else{
            this.tabList[2].disabled = true
        }
    }
},
computed:{
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
    amount() {
      if (this.form.inventoryCode !== "inventory_cost") {
        this.form.amount = (this.form.price * this.form.contractNum).toFixed(2) - 0;
        return this.form.amount;
      } else {
        return this.form.amount;
      }
    },
    showItemList(){
        return this.itemList.filter(item=>item.itemName.indexOf(this.seaitemName)!==-1 )
    }
},
methods:{
    treeSel(e){
        console.log(e);
        let sum =0
        e.forEach(item=>{
            sum+=item.designQuantities
        })
        this.form.quantities = sum
    },
    back(){
        uni.navigateBack({ delta: 1 })
    },
    backStep(){
        this.current--
    },
    nextStrp(){
        if(this.current==1&&!this.checkedItem.length){
            return
        }
        if(this.current==1&&this.checkedItem.length){
            this.searchContractItems2()
        }
        this.current++
    },
    searchItem(){
        this.seaitemName = this.itemName
    },
    unitSearch(unitType){
        this.$api.unitSearch({unitType}).then(res=>{
            if(res.code===200){
                this.unitList = res.data.map(item=>({...item,label:item.unitName,value:item.pkId}))
            }else{
                uni.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            }
        })
    },
    searchItemDetailByOrgId(){
        let data ={
            customId:this.customId,
            fkProfessionalTypeId:this.form.fkProfessionalTypeId,
            contractId:this.conId,
            projectId:this.projectId
        }
        let api = this.user.orgType==5?this.$api.searchItemDetailByOrgId:this.$api.searchItemDetailByOrgId2
        api(data).then(res=>{
            if(res.code==200){
                this.itemList =res.data
            }else{
                uni.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            }
        })
    },
    searchContractItems2(){
        let data ={
            contractType:this.contractType,
            customId:this.customId,
            detailId:"",
            fkProfessionalTypeId:this.form.fkProfessionalTypeId,
            contractId:this.conId,
            projectId:this.projectId
        }
        let api = this.user.orgType==5?this.$api.searchContractItems2:this.$api.searchContractItems3
        api(data).then(res=>{
            if(res.code==200){
                this.treeData =res.data
                this.$nextTick(()=>{
					this.$refs.weert._initTree()
				})
            }else{
                uni.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            }
        })
    },
    currentChange(item){
        this.current = item.index
    },
    selectOne(e) {
      this.changeType = e.options.label
      this.changeTypeVal = e.options.value
    },
    numInputs(e,ind){
        console.log(e);
        clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        this.itemCodes[ind] = this.$limitInputNumber(e,9999,'',0)
       },100)
    },
    numInput2(e,type){
        clearTimeout(this.timer)
        if(type==1){
           this.timer = setTimeout(()=>{
            this.form.contractNum = this.$limitInputNumber(e,99999999.999999,0,6)
           },100)
        }else{
           this.timer = setTimeout(()=>{
            this.form.price = this.$limitInputNumber(e,99999999.999999,0,6)
           },100)
        }
    },
    pickConfirm(e){
      if(e.value&&e.value.length){
        this.majorName = e.value[0].label
        this.form.fkProfessionalTypeId = e.value[0].value
        this.searchItemDetailByOrgId()
      }
      this.pickShow=false
    },
    pickConfirm2(e){
      if(e.value&&e.value.length){
        this.$set(this.form,'unitName',e.value[0].label)
        this.form.fkUnitId = e.value[0].value
      }
      this.pickShow2=false
    },
    searchMajorTypeList(isTrue){
        let data ={
            customId:this.customId,
            typeId:this.user.fkEnginerringTypeId,
            contractId:this.conId,
            projectBidId:this.projectId
        }
        console.log(this.projectId);
        this.$api.searchMajorTypeList(data).then(res=>{
            if(res.code===200){
                this.majorList=res.data.map(item=>({...item,label:item.engTypeName,value:item.pkId}))
                if(isTrue){
                    this.majorName = this.majorList.filter(item=>item.value==this.form.fkProfessionalTypeId)[0].label
                }
            }else{
                uni.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            }
        })
    },
    btnOk(){
        if (this.changeTypeVal < this.itemCodes.length) {
        this.itemCodes.splice(this.changeTypeVal, 4);
        }
        for (let i = 0; i < this.itemCodes.length; i++) {
          if (!this.itemCodes[i]) {
            return this.$message.warning("请输入正确的子目号");
          }
        }
        this.form.subitemNum =this.itemCodes.join("-")
        if(!this.form.detailName){
          return  uni.showToast({title:"请输入清单名称",icon:"none"})
        }
        if(!this.form.contractNum&&this.form.inventoryCode === 'inventory_build'){
          return  uni.showToast({title:"请输入合同数量",icon:"none"})
        }
        if(!this.form.fkUnitId&&this.form.inventoryCode !== "inventory_itemize"){
          return  uni.showToast({title:"请选择单位",icon:"none"})
        }
        if(!this.form.price&&this.form.inventoryCode === 'inventory_build'){
          return  uni.showToast({title:"请输入清单价",icon:"none"})
        }
        if(!this.form.amount&&this.form.inventoryCode === 'inventory_cost'){
           return uni.showToast({title:"请输入清单总额",icon:"none"})
        }
        if (this.form.inventoryCode == "inventory_cost") {
          this.form.price = this.form.amount;
          this.form.contractNum = 1;
        }
        let selTree=[]
        if(this.form.inventoryCode === 'inventory_build'){
           selTree = this.$refs.weert._confirm()
        }
        this.form.itemIds = selTree
        let pages = getCurrentPages();
        let prevPage =null
        if(this.edit){
            prevPage = pages[pages.length - 3]
        }else{
            prevPage = pages[pages.length - 2]
        }
        let disArr = prevPage.$vm.disSubNum
        if(disArr.includes(this.form.subitemNum)){
            return uni.showToast({title:"子目号重复",icon:"none"})
        }
        if(this.edit){
           prevPage.$vm.editDetail(this.form); 
        }else{
            prevPage.$vm.addDetails(this.form); // 调用上一页 定义的方法
        }
		uni.navigateBack({ delta:this.edit?2: 1 });
    }
}
}
</script>

<style lang="scss" scoped>
.pad{
    height: 90rpx;
}
.pad2{
  height: 110rpx;
}
.pdb {
  height: 100rpx;
}
.footer-btns{
    position: fixed;
    bottom: 0;
    display: flex;
    width: 750rpx;
    height: 100rpx;
    background-color: #fff;
    .footer-btns-item{
        position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28rpx;
    }
    .cancel{
      width: 270rpx;
      background: rgba(238, 238, 238, 1);
      color: rgba(170, 170, 170, 1);
    }
    .comfit{
      width: 480rpx;
      color: #fff;
      background: #1576e6;
    }
    .disabled {
       opacity: 0.5;
    }
}
.sumbNum{
    display: flex;
  	align-items: center;
  	min-height: 100rpx;
	margin:0 20rpx;
	// padding: 29rpx 24rpx;
	// background-color: #f9f9ff;
	// border: 2rpx solid #dde2f0;
	// border-radius: 8rpx;
    .sumbNum-sels{
        flex: 1;
        margin-right: 8rpx;
        background-color: #f9f9ff;
        /deep/.easySelect{
            height: 94rpx;
        }
    }
    .num-input{
        display: flex;
        align-items: center;
        width: 80rpx;
        height: 100rpx;
        background-color: #f9f9ff;
        border: 2rpx solid #dde2f0;
        border-radius: 8rpx;
        margin-right: 8rpx;
        &:nth-last-child(){
            margin-right: 0;
        }
    }
	.input-placeholder,.placeholder{
		color: #20345733;
	}
}
.emputy{
    display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 200rpx;
}
.checkBoxs{
    /deep/.u-checkbox{
        height: 100rpx;
        padding: 0 40rpx;
        border-bottom: 1px solid rgba(238, 238, 238, 1);;
    }
}
</style>