<template>
  <view class="wrapper">
    <u-navbar
        leftText="发起签章"
        bgColor="rgb(0 0 0 / 0%)"
        leftIconColor="#fff"
        :autoBack="true"
      ></u-navbar>
      <view class="sticky">
          <u-cell-group>
			      <u-cell title="设置审批人" isLink @click="setApprove">
              <text slot="value" :class="{red:!isSet}" >{{isSet?"已设置":'未设置'}}</text>
            </u-cell>
			      <u-cell title="选择盖章文件" isLink @click="selTable" v-if="!noSet">
              <text slot="value" :class="{red:!selTableList.length}">{{selTableList.length?'已选择':'未选择'}}</text>
            </u-cell>
			      <u-cell title="盖章位置" isLink @click="signPos" v-if="!noSet">
              <text slot="value" :class="{red:!isSign}">{{isSign?'已确认':'未确认'}}</text>
            </u-cell>
          </u-cell-group>
        </view>
      <view  :class="{'pad':!noSet,'pad2':noSet}"></view>
      <view class="content" v-if="this.tabList.length">
        <view class="head">预览签章文档</view>
        <u-tabs :list="tabList" :current="current" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"></u-tabs>
        <image :src="selTableList[current].pdfToImge" mode="widthFix" style="width: 750rpx"  @click="previewPdf(selTableList[current].tableUrl)"/>
         <!-- <view class="pdf-div" :change:totalNum="pdf.getData" :totalNum="totalNum" :change:pdfUrl="pdf.getData2" :pdfUrl="pdfUrl" :style="{height:totalNum*505.2+'px'}">
          <view id="pdf" style="width: 357px; height: 505.2px;"></view>
          <signBox
           v-for="(item, index) in signList"
           :key="index"
           :content="item.orgName"
           :page="totalNum"
           :left='item.x'
           :top='item.y'
           :preview='true'
        ></signBox>
         </view> -->
      </view>
      <view class="content" v-else style="padding: 20px;">暂未选择签章文件</view>
      <view class="pdb"></view>
      <view class="btn" @click="goSign">发起签章</view>
      <u-popup :show="popShow" @close="closePop" mode="center">
            <view class="popup">
              <view class="popup-content">
                <u-checkbox-group v-model="checkboxValue" placement="column" >
                  <u-checkbox
                      :customStyle="{marginBottom: '8px'}"
                      v-for="(item, index) in tableList"
                      :key="index"
                      :label="item.tableName"
                      :name="index"
                  >
              </u-checkbox>
        </u-checkbox-group>
              </view>
                <view class="btns">
                  <view class="popBtn grey" @click="popShow=false">取消</view>
                  <view class="popBtn blue" @click="tableSel">确定</view>
                </view>
            </view>
		  </u-popup>
      <processForm2 style="position: fixed;z-index:-999" ref="processForm2" :tableData="tableHtml2" @sendGzipTableHtml="sendGzipTableHtml2"></processForm2>
      <web-view :src="urls" v-if="webShow" @onPostMessage="getWeb" @message="getWeb"/>
      <!-- <u-picker title="请选择审批人" :show="pickerShow" :columns="[signPeoele]" keyName="label" @confirm="pickerConfirm" @cancel="pickerCancel"></u-picker> -->
  </view>
</template>

<script lang="renderjs" module="pdf">
import Pdfh5 from "pdfh5";
export default {
  mounted(){
    // setTimeout(() => {
    //   this.getDocumentUrl();
    // }, 500);
  },
  data() {
    return {
      id: "",
      pdfh5: null,
      urls:'https://epms-1307524156.cos.ap-guangzhou.myqcloud.com/20221122093632637c27a0848e2ace773373f7.pdf',
      totalNum:1,
      ownerVm:null
    };
  },
  methods: {
    getDocumentUrl(url) {
      console.log('1231213');
      this.pdfh5 = new Pdfh5("#pdf", {
        pdfurl: url,
        renderType: "svg",
        maxZoom: 2,
      });
      let that=this
      this.pdfh5.on("complete", function (status, msg, time) {
        that.totalNum=this.totalNum
        console.log(
          "状态：" +
            status +
            "，信息：" +
            msg +
            "，耗时：" +
            time +
            "毫秒，总页数：" +
            this.totalNum,that.totalNum
        );
        that.ownerVm.callMethod('getTotalNum', this.totalNum)
        that.ownerVm.callMethod('hideLoading')
      });
    },
    getData(newValue, oldValue, ownerVm, vm){
          ownerVm.callMethod('getTotalNum', this.totalNum)
          this.ownerVm=ownerVm
    },
    getData2(newValue, oldValue, ownerVm, vm){
        if(newValue){
            console.log('打印了',newValue, oldValue, ownerVm, vm);
              this.ownerVm=ownerVm
              setTimeout(() => {
              this.getDocumentUrl(newValue);
            }, 500);
        }
    },
    emitData(e, ownerVm) {
      ownerVm.callMethod('getTotalNum', this.totalNum)
    }
  },
};
</script>

<script>
import signBox from "../../components/signBox/signBox.vue";
import request from "../../common/request";
import processForm2 from "../../components/process-form/process-form2.vue";
export default {
   components: { signBox ,processForm2},
   data(){
    return{
      totalNum:1,
      signId:'',
      signList:[],
      signPeoele:[],
      pickerShow:false,
      tableList:[{engSealCustomAreas:[],tableName:"签章文件1",tableUrl:"https://epms-1307524156.cos.ap-guangzhou.myqcloud.com/20221122093632637c27a0848e2ace773373f7.pdf"},{engSealCustomAreas:[],tableName:"签章文件2",tableUrl:"https://epms-1307524156.cos.ap-guangzhou.myqcloud.com/2023072711293264c1e49c848e7d62b99a0cdb.pdf"}],
      selTableList:[],
      current:0,
      tabList:[],
      pdfUrl:"",
      isSign:false,
      isSet:false,
      popShow:false,
      checkboxValue:[],
      type:"",//0:生产 1结算 2:盘点,3:设计变更
      bizId:"",
      engSealOrgVoList:[],
      prodWorkflowUserAdds:[],
      workflowTableList:[],
      approverList:{
          workflowNodeDTOS: [],
      },
      noSet:false,
      webShow:false,
      tableHtml2:[]
    }
   },
   onLoad(options) {
    this.type=options.type - 0
    this.bizId=options.bizId
    this.initiateSealProcessBefore(this.bizId,this.type)
    this.getSignWorkflowDetail()
   },
   methods:{
    sendGzipTableHtml2(e) {
			this.tableHtml2 = e;
			this.tableList.forEach(item => {
				this.tableHtml2.forEach(item2 => {
					if (item.tableId == item2.tableId&&item.nodeId==item2.nodeId) {
						item.pdfUrl = item2.tablePdfUrl
						item.tableUrl = item2.tablePdfUrl
					}
				})
			})
      uni.hideLoading()
      this.nextGo()
		},
    previewPdf(url){
      this.$checkName(url)
    },
     getWeb(e){
      console.log('webview的数据',e.detail.data[0].action);
      if(e.detail.data[0].ok){
        let data=e.detail.data[0].action
        let arr=data
        if(arr.length){
          this.pdfUrl=this.selTableList[this.current].tableUrl
          arr.forEach((item,index)=>{
           this.selTableList[index].engSealCustomAreas= item.engSealCustomAreas
          })
          if(arr.filter(item=>item.engSealCustomAreas.length).length==arr.length){
            this.isSign=true
          }else{
            this.isSign=false
          }
          this.signList=this.selTableList[this.current].engSealCustomAreas
        }
      }
      this.webShow=false
    },
    // openPicker(){
    //   this.pickerShow = true;
    // },
    // pickerConfirm(e) {
    //   console.log(e);
		// 	if (e.value.length&&e.value[0]) {
		// 		this.signId = e.value[0].value;
		// 		this.signName = e.value[0].label;
		// 	}
		// 	this.pickerCancel();
		// },
		// pickerCancel() {
		// 	this.pickerShow = false;
		// },
    hideLoading(){
      uni.hideLoading()
    },
    prevDateFun(obj) {
			console.log(obj, 'B页面返回过来的');
      obj.forEach(item=>item.bizType=4)
			this.prodWorkflowUserAdds = obj
      this.isSet=true
		},
    getSignWorkflowDetail(){
      this.$api.getSignWorkflowDetail().then(res=>{
        if(res.code===200){
          if(res.data){
            res.data.workflowNodeDTOS.forEach(item => {
              if (item.nodeType == 2) {
                item.prodSysRoleVo = item.prodSysRoleVo == null ? { selectedUserId: "", sysUserList: [] } : item.prodSysRoleVo;
                item.prodSysRoleVo.selectedUserId = item.prodSysRoleVo.selectedUserId == null ? "" : item.prodSysRoleVo.selectedUserId;
              }
            });
            this.approverList = res.data;
          }else{
            this.approverList= {
              workflowNodeDTOS: [
                {
                  prodSysRoleVo: {
                    sysUserList: []
                  }
                }
              ]
            }
          }
        }
      })
    },
    initiateSealProcessBefore(bizId,bizType){
      uni.showLoading({mask:true})
      this.$api.initiateSealProcessBefore({bizId,bizType}).then((res) => {
        uni.hideLoading()
        if(res.code===200){
          if(res.data.startUserFlag==1){
            this.engSealOrgVoList= res.data.engSealOrgVoList
            this.tableList=res.data.engSealTableVoList.map(item=>({...item,engSealCustomAreas:[]}))
            this.tableHtml2 =this.tableList.filter(item=>item.tableId!="0")
            console.log(this.tableHtml2);
          }else{
            this.noSet=true
            this.selTableList=res.data.engSealTableVoList.map(item=>({...item}))
            this.tabList=this.selTableList.map((item)=>({name:item.tableName}))
            this.pdfUrl=this.selTableList[this.current].tableUrl
            // this.signList=this.selTableList[this.current].engSealCustomAreas
          }
        }else{
          uni.showToast({icon:"none",title:res.msg})
        }
      }).catch((err) => {
        uni.hideLoading()
      });
    },
    setApprove(){
      uni.navigateTo({ url: '/pages/setApprover/setoneApprover?row='+JSON.stringify(this.approverList)  });
    },
    closePop(){
      this.popShow=false
    },
    currentChange(item) {
      uni.showLoading({ mask: true })
      this.current = item.index;
      this.pdfUrl=this.selTableList[this.current].tableUrl
      this.signList=this.selTableList[this.current].engSealCustomAreas
      setTimeout(()=>{
        uni.hideLoading()
      },200)
    },
    selTable(){
      this.popShow=true
    },
    tableSel(){
      uni.showLoading({mask:true})
      if(this.tableHtml2.filter(item=>!item.tablePdfUrl).length){
        this.$refs.processForm2.tableToImg()
      }else{
        this.sendGzipTableHtml2(this.tableHtml2)
      }
    },
    nextGo(){
      let arr=[]
      this.checkboxValue.forEach(item=>{
        arr.push(this.tableList[item])
      })
      this.selTableList=arr
      console.log(this.selTableList);
      if(this.selTableList.length){
        this.pdfUrl=this.selTableList[0].tableUrl
        this.tabList=this.selTableList.map((item)=>({name:item.tableName}))
        this.signList=this.selTableList[0].engSealCustomAreas
        if(this.selTableList.filter(item=>item.engSealCustomAreas.length).length==this.selTableList.length){
          this.isSign=true
        }else{
          this.isSign=false
        }
      }else{
        this.pdfUrl=""
        this.tabList=[]
        this.signList=[]
      }
      this.popShow=false
    },
    signPos(){
      if(!this.selTableList.length){
        return uni.showToast({
          title: '请先选择盖章表格',
          icon: 'none'
        })
      }
      let that=this
      let arrs2 = this.selTableList.map(item=>({...item,tableHtml:""}))
      let data=JSON.stringify(arrs2)
      let arrs = this.engSealOrgVoList.map(item=>({...item,tableHtml:""}))
      let engSealOrgVoList=JSON.stringify(arrs)
      console.log('发送的',data,engSealOrgVoList);
      // #ifdef APP-PLUS
      this.urls=request.h5Url+`/h5/#/pages/signSend/sealSet?engSealOrgVoList=${engSealOrgVoList}&data=${data}&isApp=1`
      console.log(this.urls);
      this.webShow=true
			// #endif
      // #ifdef H5
      uni.navigateTo({ 
        url: `/pages/signSend/sealSet?engSealOrgVoList=${engSealOrgVoList}&data=${data}&isApp=0`,
        events: {
          list:function(data) {
            console.log(data);
            if(data.data){
              let arr=JSON.parse(data.data)
              if(arr.length){
                // that.selTableList=JSON.parse(data.data)
                that.pdfUrl=that.selTableList[that.current].tableUrl
                arr.forEach((item,index)=>{
                  console.log(item);
                 that.selTableList[index].engSealCustomAreas= item.engSealCustomAreas
                })
                if(arr.filter(item=>item.engSealCustomAreas.length).length==arr.length){
                  that.isSign=true
                }else{
                  that.isSign=false
                }
                that.signList=that.selTableList[that.current].engSealCustomAreas
              }
            }else{
              // that.selTableList=[]
            }
          }
        },
        success: (res) => {
					uni.hideLoading();
					res.eventChannel.emit("list", { data: JSON.stringify(that.signList) });
				},
        fail:(err)=>{
          console.log(err);
        }
      })
			// #endif
    },
    goSign(){
      console.log('发起签章',this.selTableList);
      let data={bizType:this.type,needSealStatus:1,fkBizId:this.bizId}
      if(!this.isSet){
        return uni.showToast({icon:'none',title:"请设置审批人"})
      }
      if(!this.noSet){
        if(!this.selTableList.length){
          return uni.showToast({icon:'none',title:"请选择要盖章表格"})
        }
        if(!this.isSign){
          return uni.showToast({icon:'none',title:"请设置盖章位置"})
        }
        uni.showLoading({mask:true})
        let arr=JSON.parse(JSON.stringify(this.selTableList))
        data.engSealTables=arr.map(item=>({
          engSealCustomAreas:item.engSealCustomAreas.map(item2=>({
           orgId:item2.orgId,
           xcoordinate: item2.x / 0.6 + 50,
           ycoordinate: (505.2 - (item2.y-((Math.ceil(item2.y/505.2)-1)*505.2))) / 0.6 - 45,
           page:Math.ceil(item2.y/505.2)})),
           tableId:item.tableId,
           pdfUrl:item.tableUrl,
           nodeId:item.nodeId
           }
         ))
         data.workflowTableList=this.workflowTableList
      }
      data.prodWorkflowUserAdds=this.prodWorkflowUserAdds
     console.log(data);
     this.$api.initiateSealProcess(data).then(res=>{
      uni.hideLoading()
      if(res.code===200){
        uni.showToast({icon:"nosuccesse",title:"操作成功"})
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]; // 上一页面实例
        prevPage.$vm.getDetail() // 调用上一页 定义的方法
        uni.navigateBack({ delta: 2 })
      }else{
        uni.showToast({icon:"none",title:res.msg})
      }
     }).catch(err=>{
      uni.hideLoading()
     })
 
    }
   }
}
</script>

<style lang="scss" scoped>
.pad{
  height: 140px;
}
.pad2{
  height: 50px;
}
.content{
  background-color: #fff;
}
/deep/.pdfViewer {
  background-color: #fff;
}
.head{
  height: 60rpx;
  line-height: 60rpx;
  padding-left: 30rpx;
  background-color: #fff;
  font-size: 28rpx;
}
.pdf-div{
  display: flex;
  justify-content: center;
  position: relative;
}
.pdb{
  width: 750rpx;
  height: 100rpx;
}
.red{
  color: red;
}
.green {
  color: rgba(67, 207, 124, 1);
}
/deep/ .viewerContainer{
  overflow:visible !important
}
.popup{
  width: 500rpx;
  height: 700rpx;
  background-color: #fff;
  .popup-content{
    height: 640rpx;
    padding: 20rpx;
    overflow: auto;
  }
  .btns{
    display: flex;
    width: 100%;
    height: 60rpx;
    .popBtn{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 250rpx;
      height: 60rpx;
    }
    .blue{
      background-color: #169bd5;
      color: #fff;
    }
    .grey{
      background-color: #f2f2f2;
    }
  }
}
</style>