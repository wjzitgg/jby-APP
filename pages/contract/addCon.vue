<template>
  <view class="wrapper addPageBg">
    <u-navbar :leftText="contractTitle" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true" ></u-navbar>
    <view class="sticky">
    <u-tabs :list="tabList" :current="current" @change="currentChange" :activeStyle="{ color: 'rgba(32, 52, 87, 1)' }" :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }" > </u-tabs>
    <view class="searchs" v-if="current!=0&&contractType!=3&&!(contractType == 4&&current==2)">
      <view class="sel">
        <easy-select ref="easySelect" size="mini" class="easySelect" :value="nowSel" @selectOne="selectOne" :options="selList"></easy-select>
        </view>
        <view class="edits" @click="editChartName"> 操作 </view>
    </view>
    <view class="searchs" v-if="current!=0&&contractType==3">
      <view class="sel2">
        <easy-select ref="easySelect2" size="mini" class="easySelect" :value="nowSel2" @selectOne="selectOne2" :options="selList2"></easy-select>
        </view>
        <view class="addMaters" @click="addMaters"> 添加材料 </view>
    </view>
    <view class="searchs" v-if="contractType == 4&&current==2">
      <view class="sel2">
        <easy-select ref="easySelect3" size="mini" class="easySelect" :value="nowSel3" @selectOne="selectOne3" :options="selList3"></easy-select>
        </view>
        <view class="addMaters" @click="addMaters2"> 添加材料 </view>
    </view>
    </view>
    <view class="pad"></view>
    <view class="pad2" v-if="current!=0"></view>
    <view class="content" v-if="current==0">
      <view class="add-inputs">
        <view class="inputs-label">合同名称</view>
        <view class="inputs-content">
          <u--textarea v-model="form.contractName" placeholder="请输入内容" autoHeight maxlength="50" border="none" ></u--textarea>
        </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">合同编号</view>
        <view class="inputs-content">
          <u--textarea v-model="form.contractNumber" placeholder="请输入内容" autoHeight maxlength="50" border="none" ></u--textarea>
        </view>
      </view>
      <view class="add-inputs" v-if="contractType===1">
        <view class="inputs-label">建设单位</view>
        <view class="inputs-content select">
          <view class="name">{{ form.customerOrgName }}</view>
          <u-icon name="lock-fill" class="icons" size="14"></u-icon>
        </view>
      </view>
      <view class="add-inputs" v-if="contractType===2">
        <view class="inputs-label">合同项目</view>
        <view class="inputs-content select" @click="pickShow3 = true">
          <view class="name">{{ form.projectName }}</view>
          <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12" ></u-icon>
        </view>
      </view>
      <view class="add-inputs" v-if="contractType===3">
        <view class="inputs-label">供应商</view>
        <view class="inputs-content select" @click="pickShow = true">
          <view class="name">{{ form.customerOrgName }}</view>
          <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12" ></u-icon>
        </view>
      </view>
      <view class="add-inputs" v-if="contractType===4">
        <view class="inputs-label">分包商</view>
        <view class="inputs-content select"  @click="pickShow = true">
          <view class="name">{{ form.customerOrgName }}</view>
          <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12" ></u-icon>
        </view>
      </view>
      <view class="add-inputs" v-if="contractType===2">
        <view class="inputs-label">建设单位</view>
        <view class="inputs-content select">
          <view class="name">{{ form.customerOrgName }}</view>
          <u-icon name="lock-fill" class="icons" size="14"></u-icon>
        </view>
        <!-- <view class="inputs-content">
          <u--textarea v-model="form.customerOrgName" placeholder="请输入内容" autoHeight maxlength="50" border="none" ></u--textarea>
        </view> -->
      </view>
      <view class="add-inputs" v-if="contractType===2">
        <view class="inputs-label">施工单位</view>
        <view class="inputs-content select">
          <view class="name">{{ form.superiorOrgName }}</view>
          <u-icon name="lock-fill" class="icons" size="14"></u-icon>
        </view>
        <!-- <view class="inputs-content">
          <u--textarea v-model="form.superiorOrgName" placeholder="请输入内容" autoHeight maxlength="50" border="none" ></u--textarea>
        </view> -->
      </view>
      <view class="add-inputs">
        <view class="inputs-label">合同金额</view>
        <view class="inputs-content select">
            <view class="name">{{ contentAmount }}</view>
            <u-icon name="lock-fill" class="icons" size="14"></u-icon>
          </view>
      </view>
       <view class="add-inputs">
          <view class="inputs-label">施工签订日期</view>
          <view class="inputs-content select" @click="openCale(3,form.signDate)">
            <view>{{ form.signDate }}</view>
            <u-icon name="calendar-fill" class="icons" color="#2a82e4" size="16" ></u-icon>
          </view>
        </view>
        <view class="add-inputs" v-if="contractType!==3">
          <view class="inputs-label">施工开始日期</view>
          <view class="inputs-content select" @click="openCale(1,form.beginDate)">
            <view>{{ form.beginDate }}</view>
            <u-icon name="calendar-fill" class="icons" color="#2a82e4" size="16" ></u-icon>
          </view>
        </view>
        <view class="add-inputs" v-if="contractType!==3">
          <view class="inputs-label">施工完成日期</view>
          <view class="inputs-content select" @click="openCale(2,form.endDate)">
            <view class="name">{{ form.endDate }}</view>
            <u-icon name="calendar-fill" class="icons" color="#2a82e4" size="16" ></u-icon>
          </view>
        </view>
        <view class="add-inputs">
        <view class="inputs-label">结算税点</view>
        <view class="inputs-content">
          <u--textarea v-model="form.taxRate" placeholder="请输入内容" autoHeight  border="none" @input="taxRateInput"></u--textarea>
        </view>
      </view>
    </view>
    <view v-if="[1, 2].includes(contractType)&&current==1">
      <view class="emputy" v-if="!form.contractChapters.length">
        <u-empty mode="data" text="暂无数据" icon="/static/image/noData.png" ></u-empty>
        <view class="emputy-btn" @click="popShow=true">新增章节</view>
      </view>
      <view class="emputy" v-if="form.contractChapters.length&&!showList.length">
        <u-empty mode="data" text="暂无清单数据" icon="/static/image/noData.png" ></u-empty>
        <view class="emputy-btn" @click="popShow2 = true">新增清单</view>
      </view>
      <view class="table_detail table_empty" v-if="showList.length">
        <table>
          <thead>
            <tr>
              <th>子目号</th>
              <th>清单名称</th>
              <th>单位</th>
              <th>合同数量</th>
              <th>单价</th>
              <th>合价</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in showList" :key="index">
              <td><text class="clickTd" @click="checkDetails(item,index)">{{ item.subitemNum }}</text></td>
              <td>{{ item.detailName }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ item.contractNum }} </td>
              <td>{{ item.price }} </td>
              <td>{{ item.amount }}</td>
              <td>{{ item.remark }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="showList.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png" ></u-empty>
        <u-empty v-if="!showList.length" mode="data" text="暂无数据" icon="/static/image/noData.png" ></u-empty>
      </view>
    </view>
    <view v-if="contractType == 3&&current==1">
      <view class="emputy" v-if="!materialList.length">
        <u-empty mode="data" text="暂无数据" icon="/static/image/noData.png" ></u-empty>
        <view class="emputy-btn" @click="addMaters">添加材料</view>
      </view>
      <view class="table_detail table_empty" v-if="materialList.length">
        <table>
          <thead>
            <tr>
              <th>子目号</th>
              <th>物料名称</th>
              <th>单位</th>
              <th>供货数量</th>
              <th>单价</th>
              <th>总额</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in materialList" :key="index">
              <td><text class="clickTd" @click="checkMater(item,index)">{{ item.subitemNum }}</text></td>
              <td>{{ item.detailName }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ item.contractNum }} </td>
              <td>{{ item.price }} </td>
              <td>{{ item.amount }}</td>
              <td>{{ item.remark }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="materialList.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png" ></u-empty>
        <u-empty v-if="!materialList.length" mode="data" text="暂无数据" icon="/static/image/noData.png" ></u-empty>
      </view>
    </view>
    <view v-if="contractType == 4&&current==1">
      <view class="emputy" v-if="!form.contractChapters.length">
        <u-empty mode="data" text="暂无数据" icon="/static/image/noData.png" ></u-empty>
        <view class="emputy-btn" @click="popShow=true">新增章节</view>
      </view>
      <view class="emputy" v-if="form.contractChapters.length&&!showList.length">
        <u-empty mode="data" text="暂无清单数据" icon="/static/image/noData.png" ></u-empty>
        <view class="emputy-btn" @click="popShow2 = true">新增清单</view>
      </view>
      <view class="table_detail table_empty" v-if="showList.length">
        <table>
          <thead>
            <tr>
              <th>子目号</th>
              <th>清单名称</th>
              <th>单位</th>
              <th>合同数量</th>
              <th>单价</th>
              <th>合价</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in showList" :key="index">
              <td><text class="clickTd" @click="checkDetails(item,index)">{{ item.subitemNum }}</text></td>
              <td>{{ item.detailName }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ item.contractNum }} </td>
              <td>{{ item.price }} </td>
              <td>{{ item.amount }}</td>
              <td>{{ item.remark }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="showList.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png" ></u-empty>
        <u-empty v-if="!showList.length" mode="data" text="暂无数据" icon="/static/image/noData.png" ></u-empty>
      </view>
    </view>
    <view v-if="contractType == 4&&current==2">
      <view class="emputy" v-if="!subMaterList.length">
        <u-empty mode="data" text="暂无数据" icon="/static/image/noData.png" ></u-empty>
        <view class="emputy-btn" @click="addMaters2">添加材料</view>
      </view>
      <view class="table_detail table_empty" v-if="subMaterList.length">
        <table>
          <thead>
            <tr>
              <th>子目号</th>
              <th>材料名称</th>
              <th>材料类别</th>
              <th>单位</th>
              <th v-if="['supply_deduction', 'supply_other'].includes(nowSelId3)">供应数量</th>
              <th v-if="!['supply_deduction', 'supply_other'].includes(nowSelId3)">超额比例</th>
              <th v-if="nowSelId3 == 'supply_noDeduction'">超额扣款单价</th>
              <th v-if="['supply_deduction', 'supply_other'].includes(nowSelId3)">供应单价</th>
              <th v-if="['supply_deduction', 'supply_other'].includes(nowSelId3)">供应总额</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in subMaterList" :key="index">
              <td><text class="clickTd" @click="checkMater2(item,index)">{{ item.subitemNum }}</text></td>
              <td>{{ item.materialName }}</td>
              <td>{{ item.fkTypeName }}</td>
              <td>{{ item.fkUnitName }}</td>
              <td v-if="['supply_deduction', 'supply_other'].includes(nowSelId3)">{{ item.supplyNum }} </td>
              <td v-if="!['supply_deduction', 'supply_other'].includes(nowSelId3)">{{ item.supplyNum }} </td>
              <td v-if="nowSelId3 == 'supply_noDeduction'">{{ item.excessPrice }} </td>
              <td v-if="['supply_deduction', 'supply_other'].includes(nowSelId3)">{{ item.supplyPrice }} </td>
              <td v-if="['supply_deduction', 'supply_other'].includes(nowSelId3)">{{ (item.supplyPrice - 0) * (item.supplyNum - 0) ? ((item.supplyPrice - 0) * (item.supplyNum - 0)).toFixed(2) - 0 : "" }}</td>
              <td>{{ item.remark }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="subMaterList.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png" ></u-empty>
        <u-empty v-if="!subMaterList.length" mode="data" text="暂无数据" icon="/static/image/noData.png" ></u-empty>
      </view>
    </view>
    <view class="pdb"></view>
    <view class="footer-btns">
        <view class="cancel" v-if="current!=(tabList.length-1)" @click="cancel">取消</view>
        <view class="primary" v-if="current!=(tabList.length-1)" @click="current++">下一步</view>
        <view class="cancel" v-if="current==(tabList.length-1)" @click="current--">上一步</view>
        <view class="primary" v-if="current==(tabList.length-1)" @click="save">完成</view>
    </view>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate"/>
    <u-picker :show="pickShow" :columns="[cusList]" keyName="label" @confirm="pickConfirm" @cancel="pickShow=false"></u-picker>
    <u-picker :show="pickShow3" :columns="[cusList2]" keyName="label" @confirm="pickConfirm2" @cancel="pickShow3=false"></u-picker>
    <u-action-sheet :actions="actionList" :show="actionShow" cancelText="取消" :closeOnClickAction="true" @close="actionShow=false" @select="actionSel"></u-action-sheet>
    <u-popup :show="popShow" @close="popShow = false;chartName='';" :round="16"  mode="bottom">
      <view class="addChartPop">
          <view class="addChartPop-title">{{popType==1?'添加章节':'编辑章节'}}</view>
          <view class="addChartPop-content">
            <u--textarea v-model="chartName" placeholder="请输入内容" border="none" height="150" maxlength="20"></u--textarea>
          </view>
          <view class="addChartPop-footer">
            <view class="addChartPop-footer-btns cancel" @click="popShow = false;chartName='';">取消</view>
            <view class="addChartPop-footer-btns comfit" @click="addChart">确定</view>
          </view>
      </view>
		</u-popup>
    <u-popup :show="popShow2" @close="popShow2 = false" :round="16"  mode="bottom">
        <view class="addChartPop">
            <view class="addChartPop-title">请选择清单类型</view>
            <view class="addChartPop-content">
              <view class="add-inputs">
                <view class="inputs-content select" @click="pickShow2 = true">
                  <view>{{ addType }}</view>
                  <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12" ></u-icon>
                </view>
              </view>
            </view>
            <view class="addChartPop-footer">
              <view class="addChartPop-footer-btns cancel" @click="popShow2 = false">取消</view>
              <view class="addChartPop-footer-btns comfit" @click="goAdd">确定</view>
            </view>
        </view>
        <u-picker :show="pickShow2" :columns="[typeList]" keyName="label" @confirm="pickConfir2" @cancel="pickShow2=false"></u-picker>
	   </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabList: [{ name: "基本信息" }],
      current:0,
      contractType: 1,
      form: {
        attachments: [],
        beginDate: "",
        contractChapters: [],
        contractName: "",
        contractNumber: "",
        contractType: 0,
        details: [],
        endDate: "",
        fkCustomerId: '',
        fkProjectId: '',
        materials: [],
        signDate: "",
        taxRate: '',
        customerOrgName:"",
        projectName:"",
        superiorOrgName:"",
      },
        clickDate:"",
        cusList:[],
        cusList2:[],
        pickShow:false,
        popShow:false,
        popType:1,
        chartName:"",
        options1: [{ text: "", disabled: false }],
        nowSel:"",
        popShow2:false,
        addType:"",
        typeId:"",
        typeList:[],
        actionList:[{name:"编辑该章节名称"},{name:"删除该章节"},{name:"新增章节"},{name:"该章节下新增清单"}],
        actionShow:false,
        pickShow2:false,
      nowClickIdx:-1,
      selList2:[{label:"工程材料",value:2},{label:"其他材料",value:3}],
      nowSelId2:2,
      nowSel2:"工程材料",
      selList3:[],
      nowSelId3:'',
      nowSel3:"",
      materialTable:[],
      materialTable2:[],
      materialTable3:[],
      pickShow3:false
    };
  },
  computed:{
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
    contracter() {
      if (this.contractType === 2 && this.user.orgType === 3) return "标段项目";
      if (this.contractType === 3 && this.user.orgType === 6) return "甲方单位";
      if (this.contractType === 4 && this.user.orgType === 7) return "项 目 部";
      if (this.contractType === 1) return "建设单位";
      if (this.contractType === 2) return "监理公司";
      if (this.contractType === 3) return "供应商";
      if (this.contractType === 4) return "分包单位";
    },
    cusType() {
      if (this.contractType === 2 && this.user.orgType === 3) return 0;
      if (this.contractType === 1) return 0;
      if (this.contractType === 2) return 1;
      if (this.contractType === 3) return 3;
      if (this.contractType === 4) return 4;
    },
    contentAmount() {
      let count = 0;
      if ([1, 2, 4].includes(this.contractType)) {
        // this.tableData.forEach(item => {
        //   if (item.amount != undefined && item.amount != null && item.amount != "") {
        //     count += item.amount - 0;
        //   }
        // });
        if (this.form.contractChapters != null && this.form.contractChapters.length) {
          this.form.contractChapters.forEach(item => {
            item.details.forEach(item2 => {
              if (item2.amount != undefined && item2.amount != null && item2.amount != "") {
                count += item2.amount - 0;
              }
            });
          });
        }
      }
      if (this.contractType === 3) {
        this.form.details.forEach(item => {
          if (item.fkMaterialId) {
            if (item.amount != undefined && item.amount != null && item.amount != "") {
              count += item.amount - 0;
            }
          }
        });
      }
      count = count.toFixed(2) - 0;
      this.form.amount = count;
      return count;
    },
    showList(){
      if(!this.nowSel){
        return []
      }else{
        return this.form.contractChapters.length?this.form.contractChapters.filter(item=>item.chapterName==this.nowSel)[0].details:[]
      }
    },
    selList(){
     return this.form.contractChapters.map(item=>({label:item.chapterName}))
    },
    popIndex(){
      if(!this.nowSel){
        return -1
      }else{
        return this.form.contractChapters.findIndex(item=>item.chapterName==this.nowSel)
      }
    },
    treeDisabled(){
      let arr =[]
      this.form.contractChapters.forEach((item,idx1)=>{
        item.details.forEach((item2,idx2)=>{
          if(this.popIndex==idx1&&this.nowClickIdx==idx2){
          }else{
            arr.push(...item2.itemIds)
          }
        })
      })
      return arr
    },
    disSubNum(){
      let arr =[]
      if([1,2,4].includes(this.contractType)){
        this.form.contractChapters.forEach((item,idx1)=>{
          item.details.forEach((item2,idx2)=>{
            if(this.popIndex==idx1&&this.nowClickIdx==idx2){

            }else{
              arr.push(item2.subitemNum)
            }
          })
        })
        if(this.contractType==4){
          let arr2 =[...this.materialTable, ...this.materialTable2, ...this.materialTable3]
          arr2.forEach((item,idx)=>{
            if(item.inventoryCode == this.nowSelId3&&this.nowClickIdx == idx){

            }else{
              arr.push(item.subitemNum)
            }
          })
        }
      }else{
        this.form.details.forEach((item,idx1)=>{
          if(this.nowClickIdx==idx1){
            }else{  
              arr.push(item.subitemNum)
            }
        })
      }
      console.log('计算',arr);
      return arr
    },
    disMaters(){
      let arr =[]
      if(this.contractType==3){
        this.form.details.forEach((item,idx1)=>{
          if(this.nowClickIdx==idx1){
            }else{  
              arr.push(item.fkMaterialId)
            }
        })
      }else{
        if (this.nowSelId3 == "supply_noDeduction") {
         this.materialTable.forEach((item,idx1)=>{
          if(this.nowClickIdx==idx1){

          }else{
            arr.push(item.fkMaterialId)
          }
         })
         this.materialTable2.forEach(item=>{
            arr.push(item.fkMaterialId)
         })
         this.materialTable3.forEach(item=>{
            arr.push(item.fkMaterialId)
         })
        } else if (this.nowSelId3 == "supply_deduction") {
          this.materialTable2.forEach((item,idx1)=>{
          if(this.nowClickIdx==idx1){

          }else{
            arr.push(item.fkMaterialId)
          }
         })
         this.materialTable.forEach(item=>{
            arr.push(item.fkMaterialId)
         })
         this.materialTable3.forEach(item=>{
            arr.push(item.fkMaterialId)
         })
        } else if (this.nowSelId3 == "supply_other") {
          this.materialTable3.forEach((item,idx1)=>{
          if(this.nowClickIdx==idx1){

          }else{
            arr.push(item.fkMaterialId)
          }
         })
         this.materialTable.forEach(item=>{
            arr.push(item.fkMaterialId)
         })
         this.materialTable2.forEach(item=>{
            arr.push(item.fkMaterialId)
         })
        }
      }
      return arr
    },
    materialList(){
      console.log(this.form.details,this.nowSelId2);
      return this.form.details.filter(item=>item.inventoryType==this.nowSelId2)
    },
    subMaterList(){
      if (this.nowSelId3 == "supply_noDeduction") {
        return this.materialTable;
      } else if (this.nowSelId3 == "supply_deduction") {
        return this.materialTable2;
      } else if (this.nowSelId3 == "supply_other") {
        return this.materialTable3;
      }
    }
  },
  onLoad(options) {
    this.contractType = options.contractType - 0;
    this.form.contractType = this.contractType
    if ([1, 2].includes(this.contractType)) {
      this.tabList.push({ name: "清单章节" });
    } else if (this.contractType == 3) {
      this.tabList.push({ name: "添加材料" });
    } else if (this.contractType == 4) {
      this.tabList.push(...[{ name: "清单章节" }, { name: "供应材料" }]);
    }
    if (options.pkId) {
      this.contractTitle = "编辑合同";
      this.findContractById(options.pkId)
    } else {
      this.contractTitle = "新增合同";
      this.setAction()
    }
    if(this.user.orgType==5){
      this.getClient()
    }else{
      this.searchBuildByOrgId()
    }
    this.$store.dispatch("getDictionariesData", 10).then(res => {
      this.typeList = res.map(item => ({ ...item, value: item.keyName, label: item.keyVal }));
    });
    this.$store.dispatch("getDictionariesData", 11).then(res => {
    this.selList3 = res.map(item => ({ ...item, value: item.keyName, label: item.keyVal }));
    this.nowSel3 = this.selList3[0].label
    this.nowSelId3 = this.selList3[0].value
  });
  },
  methods:{
    addMaters(){
      if(!this.form.fkCustomerId){
        return uni.showToast({title:"请选择供应商",icon:"none"})
      }
      uni.navigateTo({url:`/pages/contract/addMaterial?contractType=${this.contractType}&customId=${this.form.fkCustomerId}&contractId=${this.form.pkId?this.form.pkId:''}&typeName=${this.nowSel2}&&inventoryType=${this.nowSelId2}`})
    },
    addMaters2(){
      if(!this.form.fkCustomerId){
        return uni.showToast({title:"请选择分包商",icon:"none"})
      }
      uni.navigateTo({url:`/pages/contract/addMaterial?contractType=${this.contractType}&customId=${this.form.fkCustomerId}&contractId=${this.form.pkId?this.form.pkId:''}&typeName=${this.nowSel3}&&inventoryType=${this.nowSelId3}`})
    },
    delMaterial(){
      this.form.details.splice(this.nowClickIdx, 1)
    },
    editDetail(e){
      let obj =this.form.contractChapters[this.popIndex].details[this.nowClickIdx]
      let arr =Object.keys(e)
      if(obj.pkId){
        let id =obj.pkId
        arr.forEach(items=>{
           this.$set(this.form.contractChapters[this.popIndex].details[this.nowClickIdx],items,e[items])
        })
        this.form.contractChapters[this.popIndex].details[this.nowClickIdx].pkId = id
      }else{
        arr.forEach(items=>{
           this.$set(this.form.contractChapters[this.popIndex].details[this.nowClickIdx],items,e[items])
        })
      }
    },
    editMaterial(e){
      let arr =Object.keys(e)
      console.log(e,arr);
      if(this.contractType==3){
        let list = []
         if (this.nowSelId2 == 2) {
          list = list.filter(item=>item.inventoryCode==2)
        } else if (this.nowSelId2 == 3) {
          list = this.materialTable2.filter(item=>item.inventoryCode==3)
        }
        let obj =list[this.nowClickIdx]
        if(obj.pkId){
          let id =obj.pkId
          arr.forEach(items=>{
             this.$set(list[this.nowClickIdx],items,e[items])
          })
          // list[this.nowClickIdx] = e
          list[this.nowClickIdx].pkId = id
        }else{
          arr.forEach(items=>{
             this.$set(list[this.nowClickIdx],items,e[items])
          })
          // list[this.nowClickIdx] =e
        }
      }else{
        let list = []
        if (this.nowSelId3 == "supply_noDeduction") {
          list = this.materialTable;
        } else if (this.nowSelId3 == "supply_deduction") {
          list = this.materialTable2;
        } else if (this.nowSelId3 == "supply_other") {
          list = this.materialTable3;
        }
        let obj =list[this.nowClickIdx]
        if(obj.pkId){
          let id =obj.pkId
          arr.forEach(items=>{
             this.$set(list[this.nowClickIdx],items,e[items])
          })
          list[this.nowClickIdx].pkId = id
        }else{
          arr.forEach(items=>{
             this.$set(list[this.nowClickIdx],items,e[items])
          })
        }
      }
    },
    addMater(e){
      if(this.contractType==3){
        console.log(e);
        this.form.details.push(e)
        let arr =this.form.details.sort((a, b) => {
            const aParts = a.subitemNum.split("-");
            const bParts = b.subitemNum.split("-");
            const maxLength = Math.max(aParts.length, bParts.length);
  
            for (let i = 0; i < maxLength; i++) {
              const aNum = parseInt(aParts[i]) || 0;
              const bNum = parseInt(bParts[i]) || 0;
              if (aNum !== bNum) {
                return aNum - bNum;
              }
            }
            return a.subitemNum.localeCompare(b.subitemNum);
          });
        this.form.details = arr
      }else{
        let list = []
        if (this.nowSelId3 == "supply_noDeduction") {
          list = this.materialTable;
        } else if (this.nowSelId3 == "supply_deduction") {
          list = this.materialTable2;
        } else if (this.nowSelId3 == "supply_other") {
          list = this.materialTable3;
        }
        list.push(e)
        list = list.sort((a, b) => {
            const aParts = a.subitemNum.split("-");
            const bParts = b.subitemNum.split("-");
            const maxLength = Math.max(aParts.length, bParts.length);
  
            for (let i = 0; i < maxLength; i++) {
              const aNum = parseInt(aParts[i]) || 0;
              const bNum = parseInt(bParts[i]) || 0;
              if (aNum !== bNum) {
                return aNum - bNum;
              }
            }
            console.log(a);
            return a.subitemNum.localeCompare(b.subitemNum);
          });
      }
    },
    checkDetails(item,idx){
      this.nowClickIdx =idx
      uni.navigateTo({url:`/pages/contract/itemDetail?addCheck==1&contractType=${this.contractType}&contractId=${this.form.pkId?this.form.pkId:''}&customId=${this.form.fkCustomerId}&row=`+JSON.stringify(item)})
    },
    checkMater(item,idx){
      this.nowClickIdx =idx
      uni.navigateTo({url:`/pages/contract/materialDetail?typeName=${this.nowSel2}&contractType=${this.contractType}&contractId=${this.form.pkId?this.form.pkId:''}&customId=${this.form.fkCustomerId}&row=`+JSON.stringify(item)})
    },
    checkMater2(item,idx){
      this.nowClickIdx =idx
      uni.navigateTo({url:`/pages/contract/materialDetail?typeName=${this.nowSel3}&inventoryType=${this.nowSelId3}&contractType=${this.contractType}&contractId=${this.form.pkId?this.form.pkId:''}&customId=${this.form.fkCustomerId}&row=`+JSON.stringify(item)})
    },
    goAdd(){
      let url = `/pages/contract/addchartDetail?contractType=${this.contractType}&typeId=${this.typeId}&typeName=${this.addType}&customId=${this.form.fkCustomerId}`
      if(this.form.pkId){
        url+=`&conId=${this.form.pkId}`
      }
      if(this.form.fkProjectId){
            url+=`&projectId=${this.form.fkProjectId}`
        }
      // url+=`&disSubNum=${JSON.stringify(this.disSubNum)}&treeDisabled=${this.treeDisabled}`
      uni.navigateTo({url})
      this.popShow2 =false
      this.addType = ""
      this.typeId = ""
    },
    actionSel(e){
      if(e.name=="编辑该章节名称"){
        this.popType = 2
        this.chartName = this.form.contractChapters[this.popIndex].chapterName
        this.popShow=true
      }else if(e.name=="删除该章节"){
        let arr =this.form.contractChapters.filter(item=>item.chapterName!=this.nowSel)
        if(arr.length){
          this.nowSel = arr[0].chartName
        }else{
          this.nowSel = ""
        }
        this.form.contractChapters = arr
      }else if(e.name=="新增章节"){
        this.popShow=true
      }else if(e.name=="该章节下新增清单"){
        this.popShow2 = true
      }
    },
    editChartName(){
      this.actionShow=true
    },
    setAction(){
      if(this.form.contractChapters.length){
        this.actionList=[{name:"编辑该章节名称"},{name:"删除该章节"},{name:"新增章节"},{name:"该章节下新增清单"}]
      }else{
        this.actionList=[{name:"新增章节"}]
      }
    },
    getClient(){
      let data ={
        customType:this.cusType
      }
      this.$api.getClient(data).then(res=>{
        if(res.code==200){
          this.cusList=res.data.map(item=>({...item,value:item.pkId,label:item.customName}))
          if(this.contractTitle == "新增合同"&&this.contractType==1&&res.data.length){
            this.form.customerOrgName = res.data[0].customName
            this.form.fkCustomerId = res.data[0].pkId
          }
        }
      })
    },
    searchBuildByOrgId(){
      this.$api.searchBuildByOrgId().then(res=>{
         if(res.code==200){
          this.cusList2=res.data.map(item=>({...item,value:item.pkId,label:item.projectName}))
        }
      })
    },
    findContractById(pkId){
      let api = this.user.orgType==5?this.$api.findContractById:this.$api.findContractById2
        api({ pkId: pkId }).then((res) => {
        if (res.code == 200) {
          res.data.contractChapters = res.data.contractChapters.map(item=>({...item,chapterName:item.fkChapterName,details:item.contractDetailListVos}))
          this.form = res.data;
          if([1,2,4].includes(this.contractType)&&this.form.contractChapters.length){
            // this.selList=this.form.contractChapters.map(item=>({label:item.chapterName}))
            this.nowSel = this.selList[0].label
          }
          if(this.contractType==3){
            let arr =[]
            this.form.contractChapters.forEach(item=>{
              item.contractDetailListVos.forEach(item2=>{
                arr.push({...item2})
              })
            })
            this.form.details = arr
          }
          if(this.contractType==4){
            this.materialTable = res.data.noDeductions;
            this.materialTable2 = res.data.deductions;
            this.materialTable3 = res.data.orderDeductions;
          }
          this.setAction()
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    selectOne(e) {
    this.nowSel = e.options.label
  },
    selectOne2(e) {
    this.nowSel2 = e.options.label
    this.nowSelId2 = e.options.value
  },
    selectOne3(e) {
    this.nowSel3 = e.options.label
    this.nowSelId3 = e.options.value
  },
    unfriends(row, idx) {
				this.form.contractChapters = this.form.contractChapters.filter(item=>item.chapterName!=row.chapterName)
			},
      chartDetail(row,idx){
        console.log(row);
        uni.navigateTo({ url: `/pages/contract/chartDetail?nowSel=${row.chapterName}&row=`+JSON.stringify(this.form) })
      },
    addChart(){
      if(!this.chartName){
        return uni.showToast({title:"请输入章节名",icon:"none"})
      }
      if(this.popType==1){
        let arr =this.form.contractChapters.filter(item=>item.chapterName==this.chartName)
        if(arr.length){
          uni.showToast({title:"章节名称重复",icon:"none"})
          return
        }
        this.form.contractChapters.push({
          chapterName:this.chartName,
          details:[]
        })
        if(this.form.contractChapters.length==1){
          this.nowSel=this.chartName
        }
      }else{
        let show =false
        this.form.contractChapters.forEach((item,idnex)=>{
          if(idnex!=this.popIndex&&item.chapterName==this.chartName){
            show= true
          }
        })
        if(show){
          uni.showToast({title:"章节名称重复",icon:"none"})
          return
        }
        this.form.contractChapters[this.popIndex].chapterName = this.chartName
        this.nowSel=this.chartName
      }
      this.setAction()
      this.popShow = false
      this.chartName=""
    },
    pickConfirm(e){
      console.log(e);
      if(e.value&&e.value.length){
        this.form.customerOrgName = e.value[0].label
        this.form.fkCustomerId = e.value[0].value
      }
      this.pickShow=false
    },
    pickConfirm2(e){
      console.log(e);
      if(e.value&&e.value.length){
        this.form.projectName = e.value[0].label
        this.form.fkProjectId = e.value[0].value
        this.form.fkCustomerId = e.value[0].fkCustomId;
        this.form.superiorOrgName = e.value[0].contractorName;
        this.form.customerOrgName = e.value[0].investorName;
      }
      this.pickShow3=false
    },
    pickConfir2(e){
      if(e.value&&e.value.length){
        this.addType = e.value[0].label
        this.typeId = e.value[0].value
      }
      this.pickShow2=false
    },
    currentChange(item){
        this.current = item.index
    },
    openCale(type, date) {
        this.clickDate = date
        this.caleType = type;
        this.$refs.calendar.open();
    },
    taxRateInput(){
       setTimeout(()=>{
        this.form.taxRate =this.$limitInputNumber(this.form.taxRate,100,'',2)
       },200)
    },
    caleConfirm(e) {
      console.log(e);
      if (this.caleType === 1) {
        this.form.beginDate = e.fulldate;
      } else if (this.caleType === 2) {
        this.form.endDate = e.fulldate;
      }else if(this.caleType === 3){
        this.form.signDate = e.fulldate;
      }
    },
    delDetails(e){
      this.form.contractChapters[this.popIndex].details.splice(this.nowClickIdx, 1)
    },
    addDetails(e){
      console.log(e);
      this.form.contractChapters[this.popIndex].details.push(e)
      console.log(this.form.contractChapters);
       this.form.contractChapters[this.popIndex].details=this.form.contractChapters[this.popIndex].details.sort((a, b) => {
          const aParts = a.subitemNum.split("-");
          const bParts = b.subitemNum.split("-");
          const maxLength = Math.max(aParts.length, bParts.length);

          for (let i = 0; i < maxLength; i++) {
            const aNum = parseInt(aParts[i]) || 0;
            const bNum = parseInt(bParts[i]) || 0;
            if (aNum !== bNum) {
              return aNum - bNum;
            }
          }
          console.log(a);
          return a.localeCompare(b);
        });
      },
    cancel(){
        uni.navigateBack({ delta: 1 })
    },
    save(){
      let details =[]
      if(this.contractType==3){
        details = this.form.details
      }
      let materials =[]
      if(this.contractType==4){
       materials = [...this.materialTable,...this.materialTable2,...this.materialTable3] 
      }
      let data ={
        amount: this.form.amount,
        beginDate: this.form.beginDate,
        contractName: this.form.contractName,
        contractType: this.contractType,
        endDate: this.form.endDate,
        signDate: this.form.signDate,
        fkOrgId: this.user.fkOrgId,
        fkCustomerId: this.form.fkCustomerId,
        details,
        materials,
        taxRate: this.form.taxRate,
        attachments: [],
        contractChapters: this.form.contractChapters,
        contractNumber: this.form.contractNumber,
      }
        if(this.form.taxRate != null && this.form.taxRate.length!= 0 && (this.form.taxRate -0 >100)){
          uni.showToast({
              title: "结算税点不能大于100%",
              icon: 'none'
          })
        return 
      }
      if (this.user.orgType === 3) {
        data = { ...data, fkProjectId: this.form.fkProjectId };
      }
      if (!this.form.contractName) {
        uni.showToast({
              title: "请输入合同名称",
              icon: 'none'
          })
        return 
      }
      if (this.form.contractName.length < 2) {
        uni.showToast({
              title: "合同名称长度最少为2",
              icon: 'none'
          })
        return
      }
      if (this.form.amount < 0) {
        uni.showToast({
              title: "合同金额不能小于0",
              icon: 'none'
          })
        return;
      }
      if (!this.form.fkCustomerId) {
        uni.showToast({
              title: `请选择${this.contracter}`,
              icon: 'none'
          })
        return
      }
      if (!this.form.signDate) {
        uni.showToast({
              title: `请输入合同签订时间`,
              icon: 'none'
          })
        return 
      }
      if (!this.form.beginDate && this.contractType != 3) {
        uni.showToast({
              title: `请输入施工开始日期`,
              icon: 'none'
          })
        return
      }
      if (!this.form.endDate && this.contractType != 3) {
        uni.showToast({
              title: `请输入施工完成日期`,
              icon: 'none'
          })
        return
      }
      if (this.form.beginDate > this.form.endDate && this.id != 3) {
        uni.showToast({
              title: `施工开始日期不能大于施工结束日期`,
              icon: 'none'
          })
        return
      }
      if (data.details.filter(item => !item.subitemNum).length) {
        uni.showToast({
              title: `有合同清单未填写子目号`,
              icon: 'none'
          })
        return
      }
      if (this.contractType != 3) {
        for (let i = 0; i < data.contractChapters.length; i++) {
          const arr = data.contractChapters[i];
          if (!arr.details.length) {
            uni.showToast({
              title: arr.chapterName + "的清单列表不能为空",
              icon: 'none'
          })
            return
          }
        }
      }
      if (data.materials.filter(item => !item.subitemNum).length) {
        uni.showToast({
              title: "有物料未填写子目号",
              icon: 'none'
          })
        return 
      }
      if(this.form.pkId){
        data.pkId =this.form.pkId
        let api = this.user.orgType==5?this.$api.editCon:this.$api.editCon2
        api(data).then(res=>{
          if(res.code==200){
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh(); // 调用上一页 定义的方法
            uni.navigateBack({ delta: 1 });
            uni.showToast({title:"编辑成功"})
          }else{
            uni.showToast({title:res.msg,icon:"none"})
          }
        })
      }else{
        let api = this.user.orgType==5? this.$api.addCon: this.$api.addCon2
       api(data).then(res=>{
          if(res.code==200){
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh(); // 调用上一页 定义的方法
            uni.navigateBack({ delta: 1 });
            uni.showToast({title:"新增成功"})
          }else{
            uni.showToast({title:res.msg,icon:"none"})
          }
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.pad{
    height: 90rpx;
}
.pad2{
  height: 72rpx;
}
.pdb {
  height: 100rpx;
}
.searchs{
  display: flex;
  align-items: center;
  padding: 0 12rpx;
  .sel{
      width: 560rpx;
  }
  .sel2{
      width: 500rpx;
  }
  .addMaters{
    display: flex;
      justify-content: center;
      align-items: center;
      width: 220rpx;
      height: 64rpx;
      margin-left: 28rpx;
      color: rgba(21, 118, 230, 1);
      border: 1px solid rgba(180, 208, 240, 1);
      border-radius: 8rpx;
      font-size: 28rpx;
      .imgg{
          width: 32rpx;
      }
  }
  .edits{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 140rpx;
      height: 64rpx;
      margin-left: 28rpx;
      color: rgba(21, 118, 230, 1);
      border: 1px solid rgba(180, 208, 240, 1);
      border-radius: 8rpx;
      font-size: 28rpx;
      .imgg{
          width: 32rpx;
      }
  }
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
        color: #aaaaaa;
        background-color: #eeeeee;
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
.chart-item{
  display: flex;
  align-items: center;
  width: 750rpx;
  padding-left: 40rpx;
  height: 160rpx;
  font-size: 28rpx;
  // border-bottom: 8rpx solid #f7f7ff;
  word-break: break-all;
}
.add-item{
  color: rgba(21, 118, 230, 1);
}
.bds{
  border-top: 8rpx solid #f7f7ff;
}
.addChartPop{
  .addChartPop-title{
    padding-left: 40rpx;
    margin-top: 40rpx;
    margin-bottom: 22rpx;
  }
  .addChartPop-content{
    padding-left: 20rpx;
  }
  .addChartPop-footer{
    display: flex;
    height: 100rpx;
    .addChartPop-footer-btns{
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
  }
}
  /deep/ .u-swipe-action-item__right__button{
    background: #f7f7ff;
  }
	/deep/ .u-swipe-action-item__right__button__wrapper {
		background-image: url("/static/image/delBtn.png") !important;
		/* 根据自己项目结构调整路径 */
		width: 120rpx !important;
		height: 120rpx !important;
		background-size: cover !important;
		/* 控制背景图大小适配 */
		border-radius: 50% !important;
		margin-top: 20rpx;
		// margin-left: 20rpx;
	}

	/deep/ .u-swipe-action-item__right__button__wrapper__text {
		color: #79859a !important;
		font-size: 11px !important;
		display: inline-block !important;
	}
  .table_empty{
    /*#ifdef APP-PLUS*/
	height: calc(100vh - 426rpx);
	/*#endif*/
	/*#ifdef H5*/
  height: calc(100vh - 358rpx);
	/*#endif*/
}
.emputy{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 200rpx;
  .emputy-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 530rpx;
    height: 100rpx;
    margin-top: 50rpx;
    color: rgba(42, 130, 228, 1);
    border: 1px solid rgba(42, 130, 228, 1);
    border-radius: 8rpx;
  }
}
</style>
