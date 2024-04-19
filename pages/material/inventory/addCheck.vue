<template>
  <view class="wrapper addPageBg">
    <u-navbar
      :leftText="form.pkId?'编辑盘点单':'新增盘点单'"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="sticky">
      <u-tabs
        class="tabList"
        :list="tabList"
        :current="current"
        @change="currentChange"
        :scrollable="false"
        :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
      >
      </u-tabs>
    </view>
    <view class="pad"></view>
    <view class="content">
      <view v-if="current === 0">
        <view class="add-inputs">
          <view class="inputs-label">盘点单号</view>
          <view class="inputs-content">
            <u--textarea v-model="form.orderCode" placeholder="请输入内容" autoHeight maxlength="50" border="none" :disabled="allowModify !== 0" @input="isUpdate=1"></u--textarea>
          </view>
        </view>
        <!-- <view v-if="user.orgType === 7">
          <view class="inputs-label">标段项目</view>
          <view class="inputs select" @click="openPicker(1)">
            <view class="name">{{form.projectName}}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view> -->
        <view class="add-inputs">
          <view class="inputs-label">盘点仓库</view>
          <view class="inputs-content select" @click="openPicker(2)">
            <view class="name">{{form.warehouseName}}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <!-- <view class="add-inputs">
          <view class="inputs-label">填表人</view>
          <view class="inputs">
            <u--input
              v-model="form.leaderName"
              border="none"
              clearable
            ></u--input>
          </view>
        </view> -->
        <view class="add-inputs">
          <view class="inputs-label">业务时间</view>
          <view class="inputs-content select" @click="openDateSelect(1,form.serviceTime)">
            <view class="name">{{form.serviceTime}}</view>
            <u-icon
              name="calendar"
              class="icons"
              color="#2a82e4"
              size="16"
            ></u-icon>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">备注</view>
          <view class="inputs-content">
            <u--textarea v-model="form.remark" placeholder="请输入内容" autoHeight maxlength="100" border="none"></u--textarea>
          </view>
        </view>
      </view>
      <view v-if="current === 1">
        <view class="table_detail table_height">
          <table v-if="list.length">
            <thead>
              <tr>
                <th>序号</th>
                <th>物料名称</th>
                <th>物料分类</th>
                <th>单位</th>
                <th>库存数量</th>
                <th>盘点数量</th>
                <th>盘盈量/盘亏量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list" :key="index">
                <td ><text class="clickTd" @click="openPop2(2,item,index)">{{ index + 1 }}</text></td>
                <td>{{ item.materialName }}</td>
                <td>{{ item.materialTypeName }}</td>
                <td>{{ item.unitName }}</td>
                <td>{{ item.beforeNum }}</td>
                <td>{{ item.inventoryNum }}</td>
                <td :class="{ green: item.inventoryNum - item.beforeNum > 0, red: item.inventoryNum - item.beforeNum < 0 }">{{ (item.inventoryNum - item.beforeNum).toFixed(6) - 0 }}</td>
              </tr>
            </tbody>
          </table>
        </view>
        <view class="addMatBtn">
          <view class="btns" @click="addMatBtn"> 添加物料 </view>
        </view>
      </view>
    </view>
    <view class="pdb"></view>
    <view class="footer">
      <view class="btns default" v-if="current === 0" @click="back">取消</view>
      <view class="btns submitBtn" v-if="current === 1" @click="last">上一步</view>
      <view class="btns submitBtn" v-if="current === 0" @click="next">下一步</view>
        <view class="btns saveBtn" v-if="current === 1" @click="btnOk">保存草稿</view>
        <!-- <view class="btns submitBtn" @click="btnOk(1)">直接提交</view> -->
    </view>
    <u-datetime-picker
      :show="dateSelectShow"
      v-model="dates"
      mode="datetime"
      @confirm="dateSelect"
      @cancel="closeDateSelect"
    ></u-datetime-picker>
    <u-picker title="请选择" :show="pickerShow" :columns="[pickerList]" keyName="label" @confirm="pickerConfirm" @cancel="pickerCancel"></u-picker>
    <u-popup :show="popShow2" :round="20">
        <view class="popup2">
        <view class="popup2-head">
          <view class="name">{{popTitle2}}</view>
          <u-icon
            name="close"
            color="#fff"
            class="closeBtn"
            @click="closePop2"
          ></u-icon>
          <!-- <view ></view> -->
        </view>
        <view class="popup2-content">
           <view>
                <view class="title">物料</view>
                <view class="inputs select" @click="materialSearch">
                  <view class="name">{{nowMaterial.materialName}}</view>
                  <u-icon
                    name="arrow-down-fill"
                    class="icons"
                    color="#2a82e4"
                    size="12"
                  ></u-icon>
                </view>
            </view>
            <!-- <view>
                <view class="title">供应商</view>
                <view class="inputs select">
                  <view class="name">{{nowMaterial.fkCustomerId === "0" ? "无" : nowMaterial.customerName}}</view>
                  <u-icon
                    name="lock"
                    class="icons"
                    color="#2a82e4"
                    size="16"
                  ></u-icon>
                </view>
            </view> -->
            <view>
                <view class="title">单位</view>
                <view class="inputs select">
                  <view class="name">{{nowMaterial.unitName}}</view>
                  <u-icon
                    name="lock"
                    class="icons"
                    color="#2a82e4"
                    size="16"
                  ></u-icon>
                </view>
            </view>
            <view>
                <view class="title">库存量</view>
                <view class="inputs select">
                  <view class="name">{{nowMaterial.beforeNum}}</view>
                  <u-icon
                    name="lock"
                    class="icons"
                    color="#2a82e4"
                    size="16"
                  ></u-icon>
                </view>
            </view>
            <view>
              <view class="title">盘点数量</view>
              <view class="inputs">
                <u--input
                type='number'
                  v-model="nowMaterial.inventoryNum"
                  border="none"
                  clearable
                ></u--input>
              </view>
            </view>
            <view>
              <view class="title">盘盈量/盘亏量</view>
              <view class="inputs select">
                  <view class="name" :class="{ green: nowMaterial.inventoryNum - nowMaterial.beforeNum > 0, red: nowMaterial.inventoryNum - nowMaterial.beforeNum < 0 }">{{nowMaterial.inventoryNum - nowMaterial.beforeNum?(nowMaterial.inventoryNum - nowMaterial.beforeNum).toFixed(6) - 0:0}}</view>
                  <u-icon
                    name="lock"
                    class="icons"
                    color="#2a82e4"
                    size="16"
                  ></u-icon>
                </view>
            </view>
        </view>
        <view class="pop-pdb"></view>
        <view class="footer">
            <view class="foot-btn cancle" :class="{btns2:popType2===1,btns1:popType2===2}" @click="closePop2">取消</view>
            <view class="foot-btn btns1 del" v-if="popType2===2" @click="delMaterial">删除</view>
            <view class="foot-btn save" :class="{btns2:popType2===1,btns1:popType2===2}" @click="saveMaterial">保存</view>
        </view>
      </view>
      <materialSelect :treeData="treeData" ref="materialSelect" @checked="checked" @search="materSearch"></materialSelect>
    </u-popup>
  </view>
</template>

<script>
import moment from "moment";
import materialSelect from "@/components/material-select/material-select.vue";
export default {
  components:{materialSelect},
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  data() {
    return {
      tabList: [{ name: "盘点信息" }, { name: "物料信息" }],
      current: 0,
      type:'',
      form: {
        orderCode: "",
        approveStatus: "",
        fkWarehouseId: "",
        leaderName: "",
        serviceTime: "",
        fkBidProjectId: null
      },
      list: [],
      orderList: [],
      fkOrdinaryId:[{value:'',label:'无'}],
      fkPurchaseId:[],
      fkApplyIdList:[],
      fkInputIdList:[],
      dates: 0,
      dateSelectShow: false,
      maxlength: 1000,
      allowModify: 0,
      isUpdate:0,
      subSelShow: false,
      timeShow:true,
      pickerList:[],
      pickerType:1,
      pickerShow: false,
      warehouserList:[],
      proOptions:[],
      itemList:[],
      rangeKey:'itemName',
      supplyCustomer:'',
      popShow:false,
      searchOrder:'',
      checkList:[],
      linkSendList:[],
      ordersList:[],
      applyList:[],
      planBuyList:[],
      popShow2:false,
      popTitle2:'新增物料',
      popType2:1,
      nowMaterial:{},
      addType:1,
      treeData: [], // 物料选择树形数据
      nowIndex:0,
    };
  },
  onLoad(options) {
    console.log(options);
    this.type=options.type
    if(options.type==1){
        this.getBusinessCode()
        let now=new Date()
        this.form.serviceTime = moment(now).format("YYYY-MM-DD HH:mm:ss");
        this.form.leaderName=this.user.userName
    }else if(options.type==2){
        let obj=JSON.parse(options.obj)
        this.form=obj
        this.list=obj.engMatOrderInventoryDetailsVos
    }
    this.dates = Number(new Date());
    if (this.user.orgType === 7) {
      this.findWarehouseByProjectId(uni.getStorageSync("nowProId"));
    }else{
      this.findWarehouseByProjectId("");
    }
  },
  methods: {
    back(){
      uni.navigateBack()
    },
    getBusinessCode() {
      this.$api.getBusinessCode({ businessType: 9 }).then((res) => {
        if (res.code === 200) {
          this.form.orderCode = res.data.typeCode;
          this.maxlength = res.data.limitNum;
          this.allowModify = res.data.allowModify;
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    findWarehouseByProjectId(bidProjectId){
        this.$api.findWarehouseByProjectId({bidProjectId}).then(res=>{
            if(res.code===200){
                let arr = res.data.map(item => ({ ...item, value: item.pkId, label: item.warehouseName }));
                this.warehouserList=arr
            }else{
                uni.showToast({ title: res.msg, icon: "none" });
            }
        })
    },
    materialSearch() {
			this.selectMaterial(); // 获取物料树形选择数据
			this.$refs.materialSelect.selectShow = true;
		},
    materSearch(e){
      this.selectMaterial(e)
    },
    selectMaterial(materialName) {
			let data = {
				pageNum: 1,
				pageSize: 100,
				type: 4, // 1合同，2仓库  3出入库  4 盘点单
        fkWarehouseId:this.form.fkWarehouseId,
        materialTypeCode:this.list.length?this.list[0].typeCode:""
			};
      if(materialName){
        data.materialName=materialName
      }
			this.$api.searchMaterialPage(data).then(res => {
				if (res.code == 200) {
					this.treeData = res.data;
				} else {
					uni.showToast({ icon: "none", title: res.msg });
				}
			});
		},
    // 物资选中回调
		checked(item) {
      if (this.list.filter(material => material.fkMaterialId === item.pkId && material.fkCustomerId === item.fkCustomerId).length) {
        return uni.showToast({title:"该物料已经存在盘点物料表中",icon:'none'});
      }
      if(this.list.length&&this.list[0].typeCode!=item.typeCode){
        return uni.showToast({title:"该物料类型与已添加物料类型不一致",icon:"none"})
      }
			console.log(item);
			// this.nowMaterial = item;
      this.$set(this.nowMaterial, "fkMaterialId", item.pkId);
      this.$set(this.nowMaterial, "materialName", item.materialName);
      this.$set(this.nowMaterial, "typeCode", item.typeCode);
      this.$set(this.nowMaterial, "materialTypeName", item.fkTypeName);
      this.$set(this.nowMaterial, "unitName", item.fkUnitName);
      this.$set(this.nowMaterial, "beforeNum", item.supplyNum);
      this.$set(this.nowMaterial, "fkCustomerId", item.fkCustomerId);
      this.$set(this.nowMaterial, "inventoryNum", '');
		},
    checkboxChange(e){
        console.log(e);
    },
    currentChange(e) {
      this.current = e.index;
    },
    next() {
      this.current = 1;
    },
    last() {
      this.current = 0;
    },
    btnOk(){
      let engMatOrderInventoryDetailsAdds = this.list;
      let data = { ...this.form, engMatOrderInventoryDetailsAdds,approveStatus:0 };
      if (!data.orderCode) {
        return uni.showToast({title:"请填写订单编号",icon:'none'});
      }
      if (!data.fkWarehouseId) {
        return uni.showToast({title:"请选择仓库",icon:'none'});
      }
      // if (!data.leaderName) {
      //   return uni.showToast({title:"请填写负责人名称",icon:'none'});
      // }
      if (!data.serviceTime) {
        return uni.showToast({title:"请选择业务时间",icon:'none'});
      }
      if (!engMatOrderInventoryDetailsAdds.length) {
        return uni.showToast({title:"请添加盘点物料信息",icon:'none'});
      }
      if (data.orderCode == this.typeCode) {
        data.isUpdate = 0;
      } else {
        data.isUpdate = 1;
      }
      uni.showLoading({ mask: true })
      if(this.type==='1'){
          this.$api
            .addOrderInventory(data)
            .then(res => {
              uni.hideLoading()
              if (res.code === 200) {
                uni.showToast({title:"新增成功"});
                let pages = getCurrentPages()
      	        let prevPage = pages[pages.length - 2]; // 上一页面实例
      	        prevPage.$vm.resh() // 调用上一页 定义的方法
                uni.navigateBack({ delta: 1 })
              } else {
                 uni.showToast({title:res.msg,icon:'none'});
              }
            })
            .catch(err => {
              uni.hideLoading()
            });
      }else if(this.type==='2'){
        this.$api
          .updateOrderInventory(data)
          .then(res => {
            uni.hideLoading()
            if (res.code === 200) {
              uni.showToast({title:"编辑成功"});
              uni.navigateBack({ delta: 2 })
            } else {
              uni.showToast({title:res.msg,icon:'none'});
            }
          })
          .catch(err => {
            uni.hideLoading()
          });
      }
    },
    openDateSelect(type,time) {
      this.datesType=type
      this.dates = Number(new Date(time));
      this.dateSelectShow = true;
    },
    dateSelect(e) {
      //   this.dates = e.value;
      console.log(e.value);
      if(this.datesType===1){
        this.form.serviceTime = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
      }else if(this.datesType===2){
        this.form.receiverTime=moment(e.value).format("YYYY-MM-DD HH:mm:ss");
      }
      this.closeDateSelect();
    },
    closeDateSelect() {
      this.dateSelectShow = false;
    },
    addMatBtn() {
      if (!this.form.fkWarehouseId) {
        return uni.showToast({title:"请选择仓库",icon:'none'});
      }
        this.openPop2(1)
    },
    openPicker(type){
        this.pickerType=type
        this.pickerList=[]
        if(type===1){
            this.pickerList =this.proOptions
        }else if(type===2){
            this.pickerList=this.warehouserList
        } 
        this.pickerShow = true;
    },
    pickerConfirm(e) {
		console.log(e);
		if (e.value.length) {
            if(this.pickerType===1){
                this.form.projectName =e.value[0].label
                this.form.fkBidProjectId=e.value[0].value
            }else if(this.pickerType===2){
                this.form.fkWarehouseId = e.value[0].value;
                this.form.warehouseName=e.value[0].label
            }
		}
		this.pickerCancel();
	},
	pickerCancel() {
		this.pickerShow = false;
	},
    openPop1(){
        this.popShow=true
        // this.checkList=this.form
    },
    openPop2(type,item,index){
        this.popType2=type
        if(type===1){
            this.popTitle2='新增物料'
        }else if(type===2){
            this.popTitle2='编辑物料'
            this.nowIndex=index
            this.nowMaterial={...item}
        }
        this.popShow2=true
    },
    delMaterial(){
      this.list.splice(this.nowIndex,1)
      this.closePop2()
    },
    saveMaterial(){
      if(!this.nowMaterial.fkMaterialId){
        return uni.showToast({title:'请选择物料',icon:'none'})
      }
      // if(!this.nowMaterial.materialPrice){
      //   return this.showToast({title:'请填写单价',icon:'none'})
      // }
      if(this.nowMaterial.stockNum>this.nowMaterial.supplyNum){
        return uni.showToast({title:'出库数量超出库存数量',icon:'none'})
      }
      if(this.popType2===1){
        this.list.push({...this.nowMaterial})
      }else if(this.popType2===2){
       this.list[this.nowIndex]={...this.nowMaterial}
      //  console.log(this.list[this.list.findIndex(item=>item.fkMaterialId=this.nowMaterial.pkId)],this.nowMaterial);
      }
      this.closePop2()
    },
    closePop2(){
        this.popShow2=false
        this.nowMaterial={}
    },
    openTree(){
        this.$refs.tkitree._show();
    },
    // 分项树形选择
	treeConfirm(data) {
		console.log(data);
		// this.itemType = data[0].itemType; // 0 通用类型  1 路基土  2隧道
		// this.subentryId = data[0].pkId; //分项id
	},
  },
};
</script>

<style lang="scss" scoped>
.pad {
  height: 98rpx;
}
.pdb {
  height: 100rpx;
}
.content {
  font-size: 28rpx;
}
.title {
  padding-left: 20rpx;
  font-size: 28rpx;
  font-weight: 600;
  margin: 10rpx 0;
}
.inputs {
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}
.select {
  justify-content: space-between;
}
.addSubBtn {
  display: flex;
  align-items: center;
  padding-left: 40rpx;
  background-color: #fff;
  height: 80rpx;
  .btns {
    width: 100rpx;
    padding: 10rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    text-align: center;
    color: #2a82e4;
    background-color: #d9f4ff;
  }
}
.addMatBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 40rpx;
  background-color: #fff;
  height: 80rpx;
  .btns {
    width: 150rpx;
    padding: 10rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    text-align: center;
    color: #2a82e4;
    background-color: #d9f4ff;
  }
}
.orderList {
  overflow: auto;
  max-height: 350rpx;
  background-color: #fff;
  .orderList-item {
    display: flex;
    justify-content: space-around;
    height: 80rpx;
    padding: 0 20rpx;
    border-bottom: 1px solid #eee;
    .name {
      width: 580rpx;
      height: 80rpx;
      line-height: 80rpx;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
    }
  }
}
.formBtns {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100rpx;
  .next,
  .last {
    padding: 20rpx 40rpx;
    background-color: #1576e6;
    color: #fff;
  }
}
.table_height {
  /*#ifdef APP-PLUS*/
  max-height: calc(100vh - 554rpx);
  /*#endif*/
  /*#ifdef H5*/
  max-height: calc(100vh - 466rpx);
  /*#endif*/
}
.footer{
    display: flex;
    position: fixed;
    bottom: 0;
    width: 750rpx;
    height: 100rpx;
    z-index: 10;
    .btns{
        display: flex;
        justify-content: center;
        align-items: center;
        // width: 375rpx;
        flex: 1;
        color: #fff;
    }
    .saveBtn{
        background-color: #43cf7c;
    }
    .submitBtn{
        background-color: #1576e6;
    }
    .default{
      background-color: #eeeeee;
      color: rgba(170, 170, 170, 1);
    }
}
.popup1{
    height: 900rpx;
    .popup-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 80rpx;
        // line-height: 80rpx;
        padding: 0 20rpx;
        // color: #fff;
        font-size: 28rpx;
        .submitPop1{
            color: #2a82e4;
        }
    }
    .popup-content{
        padding: 0 20rpx;
        .search-input{
            width: 700rpx;
            padding-left: 20rpx;
            border: 1px solid #2a82e4;
            border-radius: 6rpx;
        }
    }
}
.checkBoxGroup{
    overflow: auto;
    height: 740rpx;
    margin-top: 10rpx;
}
.checkBox{
    height: 60rpx;
    line-height: 60rpx;
    border-bottom: 1px solid #f5f5f5;
}
.popup2 {
  position: relative;
  width: 750rpx;
  height: 1200rpx;
  background-color: #2a82e4;
  border-radius: 20rpx 20rpx 0 0;
  .popup2-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    // line-height: 80rpx;
    padding: 0 20rpx;
    color: #fff;
    font-size: 28rpx;
  }
  .popup2-content {
    height:1020rpx;
    padding-top: 40rpx;
    overflow: auto;
    background-color: #f7f7ff;
    // padding: 0 20rpx;
    border-radius: 20rpx 20rpx 0 0;
    .popup2-content-head{
      height: 60rpx;
      line-height: 60rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      background: linear-gradient(90deg, rgba(230, 235, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)
    }
    .info-item{
      padding-bottom: 20rpx;
      .imgList{
        display: flex;
        flex-wrap: wrap;
        padding: 10rpx 20rpx;
        image{
          width: 350rpx;
          margin-bottom: 10rpx;
        }
        :nth-child(2n){
          margin-left: 10rpx;
        }
      }
    }
    .remark{
        max-height: 400rpx;
        overflow: auto;
    }
    .u-form-item{
      padding: 0 20rpx;
      border-bottom: 1px solid #eee;
    }
  }
  .pop-pdb{
    height: 100rpx;
    // background-color: #f7f7ff;
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 100rpx;
    background-color: #f7f7ff;
    .foot-btn{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80rpx;
        font-size: 28rpx;
    }
    .btns1 {
      width: 210rpx;
    }
    .btns2{
        width: 300rpx;
    }
    .cancle {
      background-color: #eeeeee;
      color: #aaaaaa;
    }
    .del{
        color: #fff;
        background-color: red;
    }
    .save{
        color: #fff;
        background-color: #2a82e4;
    }
  }
}
  .red {
  color: red;
}
.green {
  color: #72b74b;
}
</style>
