<template>
  <view class="wrapper">
    <u-navbar leftText="合同信息" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="sticky">
    <u-tabs :list="tabList" :current="current" @change="currentChange" :activeStyle="{ color: 'rgba(32, 52, 87, 1)' }" :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }" > </u-tabs>
    <view class="search">
      <easy-select ref="easySelect" size="mini" class="easySelect" :value="nowSel" @selectOne="selectOne" :options="selList" v-if="([1, 2].includes(contractType)&&current==1)||(contractType == 4&&current==1)"></easy-select>
      <easy-select ref="easySelect" size="mini" class="easySelect" :value="nowSel2" @selectOne="selectOne2" :options="selList2" v-if="(contractType == 4&&current==2)"></easy-select>
    </view>
    </view>
    <view :class="{pad:current==0||contractType == 3,pad2:([1, 2].includes(contractType)&&current==1)||(contractType == 4&&current!=0)}"></view>
    <view v-show="current == 0">
      <view class="contentName"> {{form.contractName}}</view>
    <tableForm :pageHeight="false" :pageMr="false" :emptyShow="false" :list="[
		{name:'合同编号',value:form.contractNumber,show:true},
		{name:'合同金额',value:form.amount,show:true},
		{name:'结算税点',value:form.taxRate + '%',show:true},
		{name:'签署日期',value:form.signDate,show:true},
		]">
		</tableForm>
    <tableForm :pageHeight="false" :pageMr="false" :emptyShow="false" :list="[
		{name:'监理公司',value:form.supervisionName,show:contractType==2},
		{name:'建设单位',value:form.customerOrgName,show:contractType==2},
		{name:'施工单位',value:form.superiorOrgName,show:contractType==2},
		{name:'建设单位',value:form.customerOrgName,show:contractType==1},
		{name:'供应商',value:form.customerOrgName,show:contractType==3},
		{name:'分包单位',value:form.customerOrgName,show:contractType==4},
		{name:'施工开始日期',value:form.beginDate,show:contractType!=3},
		{name:'施工完成日期',value:form.endDate,show:contractType!=3},
		]">
		</tableForm>
    <view class="files">
      <view class="filesTitle">合同附件</view>
      <view class="files-item" v-for="(item,index) in form.attachments" :key="index" @click="filesClick(item)">
        <u-icon class="icons" name="/static/fileImg/file-excel.png" size="20"></u-icon>
        <view class="files-item-contnet">
          <view class="filesName text-hidden">{{item.attachName}}</view>
          <view class="arrow-right">{{'>'}}</view>
        </view>
      </view>
    </view>
    </view>
    <view v-if="[1, 2].includes(contractType)&&current==1">
      <view class="table_detail table_empty">
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
              <td><text class="clickTd" @click="checkDetails(item)">{{ item.subitemNum }}</text></td>
              <td>{{ item.detailName }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ item.contractNum }} </td>
              <td>{{ menuCodeData.states == 1 ? item.price : "***" }} </td>
              <td>{{ menuCodeData.states == 1 ? item.amount : "***" }}</td>
              <td>{{ item.remark }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="showList.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png" ></u-empty>
      </view>
    </view>
    <view v-if="contractType == 3&&current==1">
      <view class="table_detail table_empty">
        <table v-if="materialList.length">
          <thead>
            <tr>
              <th>子目号</th>
              <th>物料名称</th>
              <th>物料分类</th>
              <th>单位</th>
              <th>供货数量</th>
              <th>单价</th>
              <th>总额</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in materialList" :key="index">
              <td><text class="clickTd" @click="checkDetails(item)">{{ item.subitemNum }}</text></td>
              <td>{{ item.detailName }}</td>
              <td>{{ item.fkTypeName }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ item.contractNum }} </td>
              <td>{{ menuCodeData.states == 1 ? item.price : "***" }} </td>
              <td>{{ menuCodeData.states == 1 ? item.amount : "***" }}</td>
              <td>{{ item.remark }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="materialList.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png" ></u-empty>
        <u-empty v-if="!materialList.length" mode="data" text="暂无数据" icon="/static/image/noData.png" ></u-empty>
      </view>
    </view>
    <view v-if="contractType == 3&&current==2">
      <view class="table_detail table_empty">
       <table v-if="materialList.length">
          <thead>
            <tr>
              <th>子目号</th>
              <th>物料名称</th>
              <th>物料分类</th>
              <th>单位</th>
              <th>供货数量</th>
              <th>单价</th>
              <th>总额</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in materialList" :key="index">
              <td><text class="clickTd" @click="checkDetails(item)">{{ item.subitemNum }}</text></td>
              <td>{{ item.detailName }}</td>
              <td>{{ item.fkTypeName }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ item.contractNum }} </td>
              <td>{{ menuCodeData.states == 1 ? item.price : "***" }} </td>
              <td>{{ menuCodeData.states == 1 ? item.amount : "***" }}</td>
              <td>{{ item.remark }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="materialList.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png" ></u-empty>
        <u-empty v-if="!materialList.length" mode="data" text="暂无数据" icon="/static/image/noData.png" ></u-empty>
      </view>
    </view>
    <view v-if="contractType == 4&&current==1">
      <view class="table_detail table_empty">
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
              <td><text class="clickTd" @click="checkDetails(item)">{{ item.subitemNum }}</text></td>
              <td>{{ item.detailName }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ item.contractNum }} </td>
              <td>{{ menuCodeData.states == 1 ? item.price : "***" }} </td>
              <td>{{ menuCodeData.states == 1 ? item.amount : "***" }}</td>
              <td>{{ item.remark }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="showList.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png" ></u-empty>
      </view>
    </view>
    <view v-if="contractType == 4&&current==2">
      <view class="table_detail table_empty">
        <table v-if="materialList2.length">
          <thead>
            <tr>
              <th>子目号</th>
              <th>材料名称</th>
              <th>材料类别</th>
              <th>单位</th>
              <th v-if="nowSel2!='甲供不扣款材料'">供应数量</th>
              <th v-if="nowSel2=='甲供不扣款材料'">超额比例</th>
              <th v-if="nowSel2!='甲供不扣款材料'">供应单价</th>
              <th v-if="nowSel2=='甲供不扣款材料'">超额扣款单价</th>
              <th v-if="nowSel2!='甲供不扣款材料'">供应总额</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in materialList2" :key="index">
              <td>{{ item.subitemNum }}</td>
              <td>{{ item.materialName }}</td>
              <td>{{ item.fkTypeName }}</td>
              <td>{{ item.fkUnitName }}</td>
              <td v-if="nowSel2!='甲供不扣款材料'">{{ item.supplyNum }} </td>
              <td v-if="nowSel2=='甲供不扣款材料'">{{ item.supplyNum }} %</td>
              <td v-if="nowSel2!='甲供不扣款材料'">{{ item.supplyPrice }} </td>
              <td v-if="nowSel2=='甲供不扣款材料'">{{ item.excessPrice }}</td>
              <td v-if="nowSel2!='甲供不扣款材料'">{{ menuCodeData.states == 1 ? ((item.supplyPrice - 0) * (item.supplyNum - 0) ? ((item.supplyPrice - 0) * (item.supplyNum - 0)).toFixed(2) - 0 : "") : "***" }}</td>
              <td>{{ item.remark }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="materialList2.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png" ></u-empty>
        <u-empty v-if="!materialList2.length" mode="data" text="暂无数据" icon="/static/image/noData.png" ></u-empty>
      </view>
    </view>
    <view class="pdb"></view>
    <view class="btn" v-if="actionList.length" @click="handle">操作</view>
    <u-action-sheet :actions="actionList" :show="actionShow" cancelText="取消" :closeOnClickAction="true" @close="actionShow=false" @select="actionSel"></u-action-sheet>
    <u-action-sheet :actions="actionList2" :show="actionShow2" cancelText="取消" :closeOnClickAction="true" @close="actionShow2=false" @select="actionSel2"></u-action-sheet>
    <u-popup :show="popShow" @close="closePop" :round="10" mode="center">
      <view class="pops">
        <view class="pops-head">{{popTitle}}</view>
        <view class="pops-content">《{{form.contractName}}》</view>
        <view class="pops-footer">
          <view class="pops-footer-btns cancel" @click="closePop">取消</view>
          <view class="pops-footer-btns comfit" @click="comfit">{{comitText}}</view>
        </view>
      </view>
		</u-popup>
  </view>
</template>

<script>
import tableForm from '../../components/table-form/table-form';
export default {
  components:{tableForm},
data(){
    return{
        form:{},
        tabList:[{name:"基本信息"}],
        current:0,
        contractType:0,
        selList:[],
        nowSel:"",
        selList2:[],
        nowSel2:"",
        actionList:[],
        actionShow:false,
        actionList2:[{name:"查看"},{name:"下载当前附件"},{name:"下载所有附件"}],
        actionShow2:false,
        nowClickFile:{},
        menuCodeData:{},
        popShow:false,
        popTitle:"确认删除合同",
        comitText:"确认删除"
    }
},
onLoad(options) {
  this.contractType = options.contractType - 0
  if ([1, 2].includes(this.contractType)) {
    this.tabList.push({ name: "清单章节" });
  } else if (this.contractType == 3) {
    this.tabList.push({ name: "工程材料" },{ name: "其他材料" });
  } else if (this.contractType == 4) {
    this.tabList.push(...[{ name: "清单章节" }, { name: "供应材料" }]);
  }
  this.findContractById(options.pkId)
  this.searchMenuDataAuthorize()
  this.$store.dispatch("getDictionariesData", 11).then(res => {
    this.selList2 = res.map(item => ({ ...item, value: item.keyName, label: item.keyVal }));
    this.nowSel2 = this.selList2[0].label
  });
},
methods:{
  // 获取当前登录用户角色关联菜单权限数据集
    searchMenuDataAuthorize() {
      this.$api.searchMenuDataAuthorize().then((res) => {
        if (res.code == 200) {
          res.data.forEach((element) => {
            if (element.menuCode == "contract") {
              this.menuCodeData = element;
            }
          });
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    checkDetails(item){
      console.log(item);
      uni.navigateTo({url:`/pages/contract/itemDetail?contractType=${this.contractType}&contractId=${this.form.pkId}&customId=${this.form.fkCustomerId}&row=`+JSON.stringify(item)})
    },
  selectOne(e) {
    this.nowSel = e.options.label
  },
  selectOne2(e) {
    this.nowSel2 = e.options.label
  },
  currentChange(item){
        this.current = item.index
    },
    findContractById(pkId){
      let api = (this.user.orgType==5||this.user.orgType==7)?this.$api.findContractById:this.$api.findContractById2
        api({ pkId: pkId }).then((res) => {
        if (res.code == 200) {
          res.data.contractChapters = res.data.contractChapters.map(item=>({...item,chapterName:item.fkChapterName,details:item.contractDetailListVos}))
          this.form = res.data;
          this.selList = res.data.contractChapters.map(item=>({label:item.fkChapterName,value:item.fkChapterId}))
          if(res.data.contractChapters.length){
            this.nowSel = res.data.contractChapters[0].fkChapterName
          }
          console.log(res.data);
          this.setAction()
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    filesClick(item){
      this.nowClickFile=item
      this.actionShow2=true
    },
    handle(){
      this.actionShow=true
    },
    setAction(){
      // this.actionList=[{name:"编辑"},{name:"导出"},{name:"终止"},{name:"删除"}]
      if(this.form.editStatus&&this.$auth(this.jurisdiction.edit)){
        this.actionList.push({name:"编辑"})
      }
      if(this.$auth(this.jurisdiction.out)){
        this.actionList.push({name:"导出"})
      }
      if(!this.form.enableStatus&&this.$auth(this.jurisdiction.termination)){
        this.actionList.push({name:"终止"})
      }
      if(this.form.deleteStatus&&this.$auth(this.jurisdiction.delete)){
        this.actionList.push({name:"删除"})
      }
    },
    actionSel(e){
      if(e.name=="编辑"){
        uni.navigateTo({ url: `/pages/contract/addCon?pkId=${this.form.pkId}&contractType=${this.contractType}` })
      }else if(e.name=="导出"){
        this.derive()
      }else if(e.name=="终止"){
        this.popTitle="确认终止合同"
        this.comitText="确认终止"
        this.popShow=true
      }else if(e.name=="删除"){
        this.popTitle="确认删除合同"
        this.comitText="确认删除"
        this.popShow=true
      }
    },
    actionSel2(e){
      console.log(e);
      if(e.name=="查看"){
        this.$checkName(this.nowClickFile.attachUrl)
      }else if(e.name=="下载当前附件"){
        this.downLoad(this.nowClickFile.attachUrl)
      }else if(e.name=="下载所有附件"){
        this.form.attachments.forEach(item=>{
          this.downLoad(item.attachUrl)
        })
      }
    },
    closePop(){
      this.popShow=false
    },
    comfit(){
      if(this.comitText==='确认删除'){
        let api = this.user.orgType==5?this.$api.delCon:this.$api.delCon2
        api({pkId:this.form.pkId}).then(res=>{
          if(res.code==200){
            this.closePop()
            let pages = getCurrentPages();
				    let prevPage = pages[pages.length - 2]; // 上一页面实例
				    prevPage.$vm.resh(); // 调用上一页 定义的方法
				    uni.navigateBack({ delta: 1 });
            uni.showToast({title:"删除成功"})
          }else{
            uni.showToast({icon:'none',title:res.msg})
          }
        })
      }else if(this.comitText==='确认终止'){
        let api = this.user.orgType==5?this.$api.terminationConstant:this.$api.terminationConstant2
        api({pkId:this.form.pkId}).then(res=>{
          if(res.code==200){
            this.closePop()
            let pages = getCurrentPages();
				    let prevPage = pages[pages.length - 2]; // 上一页面实例
				    prevPage.$vm.resh(); // 调用上一页 定义的方法
				    uni.navigateBack({ delta: 1 });
            uni.showToast({title:"终止成功"})
          }else{
            uni.showToast({icon:'none',title:res.msg})
          }
        })
      }
    },
    derive() {
      uni.showLoading({ mask: true });
      let data = { contractId: this.form.pkId };
      let api = this.user.orgType==5||this.user.orgType==7? this.$api.contractDetailExportFile:this.$api.contractDetailExportFile2
      api(data).then((res) => {
        uni.hideLoading();
        if (res.code == 200) {
          this.downLoad(res.data);
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    // 下载
    downLoad(url) {
      const downLoadTask = uni.downloadFile({
        url: url, //仅为示例，并非真实的资源
        success: (res) => {
          if (res.statusCode === 200) {
            console.log("下载成功", res);
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: function (res2) {
                // var savedFilePath = res.savedFilePath;
                console.log(res2);
                uni.showToast({
                  title: "已保存至" + res2.savedFilePath,
                });
                setTimeout(() => {
                  uni.openDocument({
                    filePath: res2.savedFilePath,
                    success: (result) => {},
                  });
                }, 1000);
              },
            });
          }
        },
      });
    },
},
computed:{
  user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  showList(){
    if(!this.nowSel) return []
   return this.form.contractChapters.filter(item=>item.fkChapterName==this.nowSel)[0].contractDetailListVos
  },
  materialList(){
    if(this.current==1){
      return this.form.contractChapters.filter(item=>item.fkChapterName=="工程材料")[0].contractDetailListVos
    }else if(this.current==2){
      return this.form.contractChapters.filter(item=>item.fkChapterName=="其它材料")[0].contractDetailListVos
    }
  },
  materialList2(){
    if(this.nowSel2=="甲供不扣款材料"){
      return this.form.noDeductions
    }else if(this.nowSel2=="甲供扣款材料"){
      return this.form.deductions
    }else if(this.nowSel2=="其它材料"){
      return this.form.orderDeductions
    }
  },
  jurisdiction() {
      if (this.contractType === 1) {
        return {
          query: "contract:construction:query",
          add: "contract:construction:add",
          edit: "contract:construction:edit",
          delete: "contract:construction:delete",
          download: "contract:construction:download",
          termination: "contract:construction:termination",
          out: "contract:construction:out",
          put:"contract:construction:put"
        };
      } else if (this.contractType === 2) {
        return {
          query: "projectManage:contract:query",
          add: "projectManage:contract:add",
          edit: "projectManage:contract:edit",
          delete: "projectManage:contract:delete",
          download: "projectManage:contract:download",
          termination: "projectManage:contract:termination",
          out: "projectManage:contract:out",
          put:"projectManage:contract:put"
        };
      } else if (this.contractType === 3) {
        return {
          query: "contract:supplier:query",
          add: "contract:supplier:add",
          edit: "contract:supplier:edit",
          delete: "contract:supplier:delete",
          download: "contract:supplier:download",
          termination: "contract:supplier:termination",
          out: "contract:supplier:out",
          put:"contract:supplier:put"
        };
      } else if (this.contractType === 4) {
        return {
          query: "contract:subcontractor:query",
          add: "contract:subcontractor:add",
          edit: "contract:subcontractor:edit",
          delete: "contract:subcontractor:delete",
          download: "contract:subcontractor:download",
          termination: "contract:subcontractor:termination",
          out: "contract:subcontractor:out",
          put:"contract:subcontractor:put"
        };
      }
    },
}

}
</script>

<style lang="scss" scoped>
.pad{
    height: 100rpx;
}
.pad2{
  height: 160rpx;
}
.search{
  padding: 0 24rpx;
  background-color: #fff;
}
.contentName{
  padding: 40rpx 0 10rpx 40rpx;
  font-size: 36rpx;
  font-weight: 700;
  background-color: #fff;
  word-break: break-all;
}
.files{
  background-color: #fff;
  margin-top: 10rpx;
  padding: 20rpx 0 20rpx 20rpx;
  .filesTitle{
    height: 80rpx;
    line-height: 80rpx;
    font-weight: 700;
    font-size: 28rpx;
  }
  .files-item{
    display: flex;
    align-items: center;
    height: 100rpx;
    .icons{
      vertical-align:top;
    }
    .files-item-contnet{
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      height: 100%;
      margin-left: 10rpx;
      padding-top: 10rpx;
      padding-right: 24rpx;
      border-bottom: 1px solid rgba(238, 238, 238, 1);
      .filesName{
        width: 600rpx;
        line-height: 1.2;
        font-size: 28rpx;
        color: rgba(32, 52, 87, 0.6);
      }
      .arrow-right{
        position: absolute;
        right: 20rpx;
        font-family: cursive;
        font-weight: 700;
         color: rgba(32, 52, 87, 0.6);
      }
    }
  }
}
.pdb {
  height: 100rpx;
}
.text-hidden {
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁⽌换⾏*/
  text-overflow: ellipsis; /*省略号*/
}
.table_empty{
  /*#ifdef APP-PLUS*/
	height: calc(100vh - 424rpx);
	/*#endif*/
	/*#ifdef H5*/
  height: calc(100vh - 356rpx);
	/*#endif*/
}
.pops{
  width: 670rpx;
  .pops-head{
    margin-top: 60rpx;
    margin-bottom: 40rpx;
    padding-left: 40rpx;
    color: rgba(32, 52, 87, .6);
  }
  .pops-content{
    margin-bottom: 60rpx;
    padding-left: 40rpx;
    line-height: 1.2;
    word-break: break-all;
    color: rgba(32, 52, 87, 1);
  }
  .pops-footer{
    display: flex;
    height: 100rpx;
    .pops-footer-btns{
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28rpx;
    }
    .cancel{
      width: 280rpx;
      background: rgba(238, 238, 238, 1);
      color: rgba(170, 170, 170, 1);
    }
    .comfit{
      width: 390rpx;
      color: #fff;
      background: rgba(230, 67, 67, 1);
    }
  }
}
</style>