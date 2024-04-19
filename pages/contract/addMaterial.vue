<template>
  <view class="wrapper addPageBg">
    <u-navbar leftText="新增物料" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true" ></u-navbar>
    <view v-if="contractType==3">
    <view class="add-inputs">
        <view class="inputs-label">材料类型</view>
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
        <view class="inputs-label">材料名称</view>
        <view class="inputs-content select" @click="selMaterial">
            <view class="name">{{ form.detailName }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12" ></u-icon>
          </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">供货数量</view>
        <view class="inputs-content">
          <u--textarea v-model="form.contractNum" placeholder="请输入内容" autoHeight  border="none" @input="numInput2($event,1)"></u--textarea>
        </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">单价</view>
        <view class="inputs-content">
          <u--textarea v-model="form.price" placeholder="请输入内容" autoHeight  border="none" @input="numInput2($event,2)"></u--textarea>
        </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">总额</view>
        <view class="inputs-content select">
            <view class="name">{{ amount }}</view>
            <u-icon name="lock-fill" class="icons" size="14"></u-icon>
          </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">备注</view>
        <view class="inputs-content">
          <u--textarea v-model="form.remark" placeholder="请输入内容" autoHeight  border="none" maxlength="100"></u--textarea>
        </view>
      </view>
    </view>
    <view v-if="contractType==4">
        <view class="add-inputs">
        <view class="inputs-label">材料类型</view>
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
        <view class="inputs-label">材料名称</view>
        <view class="inputs-content select" @click="selMaterial">
            <view class="name">{{ form.materialName }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12" ></u-icon>
          </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">材料类别</view>
        <view class="inputs-content select">
            <view class="name">{{ form.fkTypeName }}</view>
            <u-icon name="lock-fill" class="icons" size="14"></u-icon>
          </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">单位</view>
        <view class="inputs-content select">
            <view class="name">{{ form.fkUnitName }}</view>
            <u-icon name="lock-fill" class="icons" size="14"></u-icon>
          </view>
      </view>
      <view class="add-inputs" v-if="inventoryType == 'supply_noDeduction'">
        <view class="inputs-label">超额比例</view>
        <view class="inputs-content">
          <u-input v-model="form.supplyNum" placeholder="请输入内容" autoHeight  border="none" @input="numInput2($event,1)"></u-input>
        </view>
      </view>
      <view class="add-inputs" v-else>
        <view class="inputs-label">供应数量</view>
        <view class="inputs-content">
          <u-input v-model="form.supplyNum" placeholder="请输入内容" autoHeight  border="none" @input="numInput2($event,1)"></u-input>
        </view>
      </view>
      <view class="add-inputs" v-if="inventoryType == 'supply_noDeduction'">
        <view class="inputs-label">超额扣款单价</view>
        <view class="inputs-content">
          <u--textarea v-model="form.excessPrice" placeholder="请输入内容" autoHeight  border="none" @input="numInput2($event,2)"></u--textarea>
        </view>
      </view>
      <view class="add-inputs" v-else>
        <view class="inputs-label">供应单价</view>
        <view class="inputs-content">
          <u--textarea v-model="form.supplyPrice" placeholder="请输入内容" autoHeight  border="none" @input="numInput2($event,2)"></u--textarea>
        </view>
      </view>
      <view class="add-inputs" v-if="inventoryType != 'supply_noDeduction'">
        <view class="inputs-label">供应总额</view>
        <view class="inputs-content select">
            <view class="name">{{ amount }}</view>
            <u-icon name="lock-fill" class="icons" size="14"></u-icon>
          </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">备注</view>
        <view class="inputs-content">
          <u--textarea v-model="form.remark" placeholder="请输入内容" autoHeight  border="none" maxlength="100"></u--textarea>
        </view>
      </view>
    </view>
      <view class="pdb"></view>
      <view class="footer-btns">
        <view class="footer-btns-item cancel" @click="back">取消</view>
        <view class="footer-btns-item comfit" @click="btnOk">确认</view>
      </view>
      <materialSelect  :treeData="treeData" :searchShow="false" ref="materialSelect" @checked="checked"></materialSelect>
  </view>
</template>

<script>
import materialSelect from "@/components/material-select/material-select2.vue";
export default {
    components:{materialSelect},
onLoad(options) {
    this.typeName = options.typeName
    this.contractType = options.contractType
    if(this.contractType==3){
        this.inventoryType = options.inventoryType - 0
        this.form.inventoryType = this.inventoryType
    }else{
        this.inventoryType = options.inventoryType
        this.form.inventoryCode = this.inventoryType
    }
    console.log(this.inventoryType);
    this.customId = options.customId
    this.conId = options.contractId
    this.edit = !!options.edit
    this.searchMaterialTypes()
    if(this.contractType==4){
        this.form = {
            "excessPrice": '',
			"fkMaterialId": '',
			"fkMaterialTypeId": '',
			"inventoryCode": "",
			"remark": "",
			"subitemNum": "",
			"supplyNum": 0,
			"supplyPrice": 0,
            materialName:"",
            fkTypeName:"",
            fkUnitName:""
        }
        this.form.inventoryCode = this.inventoryType
        console.log(this.form.inventoryCode);
    }
    if(this.edit){
        let obj = JSON.parse(options.row)
        this.form = obj
        this.itemCodes = this.form.subitemNum.split('-')
        let changTypeObj = this.changeTypeList.filter(item=>item.value==this.itemCodes.length)[0]
        this.changeType =changTypeObj.label
        this.changeTypeVal =changTypeObj.value
    }
},
computed:{
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
    amount() {
        if(this.contractType==3){
            this.form.amount = (this.form.price * this.form.contractNum).toFixed(2) - 0;
            return this.form.amount;
        }else{
            if(this.form.supplyPrice&&this.form.supplyNum){
                return (this.form.supplyPrice * this.form.supplyNum).toFixed(2)
            }else{
                return ''
            }
        }
    },
},
data(){
    return{
        contractType:3,
        customId:"",
        typeName:"",
        conId:"",
        inventoryType:2,
        itemCodes:[],
        changeType:"一级子目号",
        changeTypeVal:1,
        changeTypeList: [
        { value: 1, label: "一级子目号" },
        { value: 2, label: "二级子目号" },
        { value: 3, label: "三级子目号" },
        { value: 4, label: "四级子目号" },
        { value: 5, label: "五级子目号" }
      ],
      timer:null,
      form:{
        "amount": 0,
		"contractNum": 0,
		"detailName": "",
		"fkMaterialId": '',
		"fkMaterialTypeId": '',
		"inventoryType": 2,
		"price": 0,
		"remark": "",
		"subitemNum": "",
        unitName:""
      },
      edit:false,
      treeData:[]
    }
},
methods:{
    checked(e){
        console.log(e);
         let pages = getCurrentPages();
        let prevPage =null
        if(this.edit){
            prevPage = pages[pages.length - 3]
        }else{
            prevPage = pages[pages.length - 2]
        }
        let disArr = prevPage.$vm.disMaters
        if(disArr.includes(e.pkId)){
            return uni.showToast({title:"该物料已在合同中",icon:"none"})
        }
        if(this.contractType==3){
            this.form.detailName =e.typeName
            this.form.fkMaterialId =e.pkId
            this.form.fkMaterialTypeId =e.parentId
            this.form.unitName =e.unitName
        }else{
             this.form.materialName = e.typeName
             this.form.fkTypeName = e.materialTypeName
             this.form.fkMaterialId = e.pkId
             this.form.fkMaterialTypeId = e.parentId
             this.form.fkUnitName = e.unitName
        }
    },
    searchMaterialTypes(){
        let data ={
            customerId:this.customId,
            contractId:this.conId,
            isOrder:0,
        }
        if(this.contractType==3&&this.inventoryType==3){
            data.isOrder = 1
        }
        if(this.contractType==4&&this.inventoryType=='supply_other'){
             data.isOrder = 1
        }
        this.$api.searchMaterialTypes(data).then(res=>{
            if(res.code==200){
                this.treeData = res.data
            }else{
                uni.showToast({title:res.msg,icon:"none"})
            }
        })
    },
    back(){
        uni.navigateBack({ delta: 1 })
    },
    btnOk(){
        console.log(this.form);
        if (this.changeTypeVal < this.itemCodes.length) {
        this.itemCodes.splice(this.changeTypeVal, 4);
        }
        for (let i = 0; i < this.itemCodes.length; i++) {
          if (!this.itemCodes[i]) {
            return this.$message.warning("请输入正确的子目号");
          }
        }
        this.form.subitemNum =this.itemCodes.join("-")
        if(!this.form.subitemNum){
             return  uni.showToast({title:"请填写子目号",icon:"none"})
        }
        if(!this.form.fkMaterialId){
          return  uni.showToast({title:"请选择物料",icon:"none"})
        }
        if(!this.form.contractNum&&this.contractType==3){
          return  uni.showToast({title:"请输入供货数量",icon:"none"})
        }
        if(!this.form.price&&this.contractType==3){
          return  uni.showToast({title:"请输入单价",icon:"none"})
        }
        if(!this.form.supplyNum&&this.contractType==4){
          return  uni.showToast({title:this.form.inventoryCode == 'supply_noDeduction'?'请输入超额比例':"请输入供货数量",icon:"none"})
        }
        if(!this.form.excessPrice&&this.contractType==4&&this.form.inventoryCode == 'supply_noDeduction'){
          return  uni.showToast({title:"请输入超额扣款单价",icon:"none"})
        }
        if(!this.form.supplyPrice&&this.contractType==4&&this.form.inventoryCode != 'supply_noDeduction'){
          return  uni.showToast({title:"请输入供应单价",icon:"none"})
        }
        let pages = getCurrentPages();
        let prevPage =null
        if(this.edit){
            prevPage = pages[pages.length - 3]
        }else{
            prevPage = pages[pages.length - 2]
        }
        let disArr = prevPage.$vm.disSubNum
        console.log(disArr);
        if(disArr.includes(this.form.subitemNum)){
            return uni.showToast({title:"子目号重复",icon:"none"})
        }
        if(this.edit){
            prevPage.$vm.editMaterial(this.form)
        }else{
            prevPage.$vm.addMater(this.form); // 调用上一页 定义的方法
        }
        uni.navigateBack({delta:this.edit?2: 1})
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
            if(this.contractType==3){
                this.form.contractNum = this.$limitInputNumber(e,99999999.999999,'',6)
            }else{
                if(this.inventoryType == 'supply_noDeduction'){
                this.form.supplyNum = this.$limitInputNumber(e,99.99,'',2)
                }else{
                    this.form.supplyNum = this.$limitInputNumber(e,99999999.999999,'',6)
                }
            }
           },100)
        }else{
           this.timer = setTimeout(()=>{
             if(this.contractType==3){
                 this.form.price = this.$limitInputNumber(e,99999999.99,'',2)
             }else{
                if(this.inventoryType == 'supply_noDeduction'){
                    this.form.excessPrice = this.$limitInputNumber(e,99999999.99,'',2)
                }else{
                    this.form.supplyPrice = this.$limitInputNumber(e,99999999.99,'',2)
                }
             }
           },100)
        }
    },
    selMaterial(){
        this.$refs.materialSelect.selectShow = true;
    }
}
}
</script>

<style lang="scss" scoped>
.pdb {
  height: 100rpx;
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
</style>