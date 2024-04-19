<template>
  <view class="wrapper">
    <u-navbar
      leftText="合同模板"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="pad"></view>
    <view class="pad2"></view>
    <view class="content">
      <u--form labelPosition="left" :borderBottom="true" :labelWidth="'80'">
        <u-form-item label="模板名称：" borderBottom>
          <u--input
            v-model="form.templateName"
            border="none"
            :disabled="preview"
            maxlength="25"
          ></u--input>
        </u-form-item>
        <u-form-item label="合同类型：" borderBottom>
          <u-radio-group
            v-model="form.contractType"
            @change="typeChange"
            v-if="!preview"
          >
            <u-radio label="入职合同" :name="1" class="mr-20">入职合同</u-radio>
            <u-radio label="定向邀签" :name="2">定向邀签</u-radio>
          </u-radio-group>
          <view v-else>{{
            form.contractType === 1 ? "入职合同" : form.contractType === 2 ? "定向邀签" : ""
          }}</view>
        </u-form-item>
        <u-form-item label="模板编号：" borderBottom>
          <u--input
            v-model="form.templateCode"
            border="none"
            :disabled="preview"
            maxlength="25"
          ></u--input>
        </u-form-item>
        <u-form-item label="关键字：" borderBottom>
          <u--input
            v-model="form.keyword"
            border="none"
            :disabled="preview"
            maxlength="100"
          ></u--input>
        </u-form-item>
        <u-form-item
          label="甲方签署人："
          borderBottom
          :labelWidth="'100'"
          v-if="form.contractType === 1"
          @click="selectPeo"
        >
          <view class="signName">{{ signName }}</view>
        </u-form-item>
        <u-form-item
          label="签名区设置"
          borderBottom
          :labelWidth="'100'"
          v-if="form.contractType === 1 && pdfUrl"
          @click="setSign"
        >
          <view class="setSign">
            <view class="left">{{signBoxList.length?'已设置':'未设置'}}</view>
            <view class="right" v-if="!preview">去设置</view>
          </view>
        </u-form-item>
      </u--form>
      <view class="delBtn"
        ><u-icon
          name="close"
          color="#2979ff"
          size="20"
          v-show="pdfUrl && !preview"
          @click="delFile"
        ></u-icon
      ></view>
      <view class="uploads" v-show="!pdfUrl &&!preview">
        <lsj-upload
          ref="lsjUpload1"
          childId="upload2"
          :width="width"
          :height="height"
          :option="option"
          :size="size"
          :formats="formats"
          :debug="debug"
          :count="1"
          :nowCount="form.pdfUrl ? 1 : 0"
          :instantly="instantly"
          @change="onChange"
          @progress="onprogress"
          @uploadEnd="onuploadEnd"
          v-show="!pdfUrl && !preview"
        >
          <view class="upload-btn" :style="{ width: width, height: height }">
            <u-icon
              name="plus"
              color="#5084fe"
              size="28"
              class="mb-20"
            ></u-icon>
            <view>上传附件</view>
          </view>
        </lsj-upload>
        <!-- <view
          class="pdf-div"
          id="pdf-div"
          :change:totalNum="pdf.getData"
          :totalNum="totalNum"
          :change:pdfUrl="pdf.getData2"
          :pdfUrl="pdfUrl"
          v-show="pdfUrl"
        >
          <view id="pdf" style="width: 357px; height: 505.2px"></view>
          <signBox
            v-for="(item, index) in signBoxList"
            :key="index"
            :content="item.userName"
            :page="totalNum"
            :left="item.x"
            :top="item.y"
            :preview="true"
            :index="index"
          ></signBox>
        </view> -->
      </view>
      <image :src="form.pdfToImge" mode="widthFix" style="width:750rpx" v-if="pdfUrl" @click="previewPdf"/>
    </view>
    <view class="pdb"></view>
    <view class="btn" @click="save" v-if="!preview">保存</view>
    <view class="footer" v-else>
      <view
        class="btns edit"
        :class="{
          'wh-20': getDatas.contractType === 2,
          'wh-30': getDatas.contractType !== 2,
        }"
        @click="getOrgSealState(1)"
        >编辑</view
      >
      <view
        class="btns sign wh-20"
        v-if="getDatas.contractType === 2&&getDatas.enableStatus === 2"
        v-show="$menuPerm('labour:contract:directional')" 
        @click="getOrgSealState(2)"
        >定向邀签</view
      >
      <view
        class="btns off"
        v-if="getDatas.enableStatus === 2"
        :class="{
          'wh-20': getDatas.contractType === 2,
          'wh-30': getDatas.contractType !== 2,
        }"
        @click="openModel(2)"
        >禁用</view
      >
      <view
        class="btns on"
        v-if="getDatas.enableStatus === 1"
        :class="{
          'wh-20': getDatas.contractType === 2,
          'wh-30': getDatas.contractType !== 2,
        }"
        @click="openModel(3)"
        >启用</view
      >
      <view
        class="btns del"
        :class="{
          'wh-20': getDatas.contractType === 2,
          'wh-30': getDatas.contractType !== 2,
        }"
        @click="openModel(1)"
        >删除</view
      >
    </view>

    <u-picker
      title="请选择甲方签署人"
      :show="pickerShow"
      :columns="[signPeoList]"
      keyName="label"
      @confirm="pickerConfirm"
      @cancel="pickerCancel"
    ></u-picker>
    <u-modal
      :show="modelShow"
      :title="modelTitle"
      :content="modelCont"
      showCancelButton
      @confirm="confirmDel"
      @cancel="cancelDel"
    ></u-modal>
    <u-modal :show="modshow" title="提示" :content='modcontent' :showCancelButton="true" :showConfirmButton="showConfirmButton" :confirmText="confirmText" @confirm="modconfirm" @cancel="modshow=false"></u-modal>
    <web-view :src="urls" v-if="webShow" @onPostMessage="getWeb" @message="getWeb"/>
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
      ownerVm:null,
      ownerVm2:null,
    };
  },
  methods: {
    getDocumentUrl(url) {
    //   console.log('1231213');
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
      });
    },
    getData(newValue, oldValue, ownerVm, vm){
          // console.log('msg变化了newValue', newValue)
          // console.log('msg变化了oldValue', oldValue)
          // console.log('msg变化了ownerVm', ownerVm)
          // console.log('msg变化了vm', vm)
          ownerVm.callMethod('getTotalNum', this.totalNum)
          this.ownerVm=ownerVm
          console.log(ownerVm,this.ownerVm);
    },
    getData2(newValue, oldValue, ownerVm, vm){
          // console.log('msg变化了newValue', newValue)
          // console.log('msg变化了oldValue', oldValue)
          // console.log('msg变化了ownerVm', ownerVm)
          // console.log('msg变化了vm', vm)
        //   ownerVm.callMethod('getTotalNum', this.totalNum)
        if(newValue){
            console.log('打印了',newValue, oldValue, ownerVm, vm);
              this.ownerVm=ownerVm
              setTimeout(() => {
              this.getDocumentUrl(newValue);
            }, 500);
            //   this.getDocumentUrl(newValue)
        }
        //   console.log(ownerVm,this.ownerVm);
    },
    emitData(e, ownerVm) {
      ownerVm.callMethod('getTotalNum', this.totalNum)
    }
  },
};
</script>

<script>
import request from "../../common/request";
import signBox from "../../components/signBox/signBox.vue";
export default {
  components: { signBox },
  data() {
    return {
      type: 1,
      form: {
        contractType: 1,
        fileUrl: "",
        keyword: "",
        remark: "",
        templateCode: "",
        templateName: "",
        templateUrl: "",
      },
      getDatas: {},
      pdfUrl: "",
      fileName: "",
      pickerShow: false,
      signPeoList: [],
      signName: "",
      signId: "",
      totalNum: 0,
      signBoxList: [
        // {x:15,y:702,name:'甲方'}
      ],
      preview: false,
      modelShow: false,
      modelType: 1,
      modelTitle: "删除提示",
      modelCont: "确定要删除该合同?",
      modshow:false,
      modcontent:'',
      showConfirmButton:false,
      confirmText:"",
      // 上传接口参数
      option: {
        // 上传服务器地址，此地址需要替换为你的接口地址
        url: request.baseUrl + "/app/file/upload/picture",
        // 上传附件的key
        name: "file",
        header: {
					// 示例参数可删除
					'Authorization': uni.getStorageSync("token"),
				},
        // 根据你接口需求自定义请求头,默认不要写content-type,让浏览器自适配
        // header: {
        // 	// 示例参数可删除
        // 	'Authorization': 'bearer eyJhbGciOiJSUzI1NiIsI',
        // 	'uid': '27682',
        // 	'client': 'app',
        // 	'accountid': 'DP',
        // },
        // 根据你接口需求自定义body参数
        // formData: {
        // 	// 'orderId': 1000
        // }
      },
      // 选择文件后是否立即自动上传，true=选择后立即上传
      instantly: true,
      // 必传宽高且宽高应与slot宽高保持一致
      width: "300rpx",
      height: "300rpx",
      // 限制允许上传的格式，空串=不限制，默认为空
      formats: "pdf",
      // 文件上传大小限制
      size: 100,
      // 文件回显列表
      files: new Map(),
      // 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
      wxFiles: [],
      // 是否打印日志
      debug: false,
      webShow:false
    };
  },
  computed: {
    	user() {
    	  return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    	},
  	},
  onLoad(options) {
    console.log(options.type);
    this.type = options.type - 0;
    if (options.type == "1") {
      this.nailUsersByOrgId()
      this.preview = false;
    } else {
      let data = JSON.parse(options.data);
      this.getDatas = data;
      this.findContractTemplateById(data.pkId);
      this.preview = true;
    }
  },
  methods: {
    getOrgSealState(type){
      this.$api.getOrgSealState().then(res=>{
        if(res.code===200){
          if(res.data==1){
            if(type==1){
              this.edit()
            }else if(type==2){
              this.signBtn()
            }
          }else{
            if(this.user.isMaster){
              if(res.data==0){
                this.modcontent='企业未实名'
                this.confirmText="前往实名"
              }else if(res.data==2){
                this.modcontent='E签宝授权已过期'
                this.confirmText="前往授权"
              }
              this.showConfirmButton=true
            }else{
              if(res.data==0){
                this.modcontent='企业未实名，请联系管理员进行实名'
              }else if(res.data==2){
                this.modcontent='企业授权已过期，请联系管理员进行授权'
              }
              this.showConfirmButton=false
            }
            this.modshow=true
          }
        }else{
          uni.showToast({title:res.msg,icon:"none"})
        }
      })
    },
    modconfirm(){
      if(this.confirmText=='前往实名'){
        this.modshow=false
        uni.navigateTo({url:'/pages/certification/business-certification'})
      }else if(this.confirmText=='前往授权'){
        uni.showLoading({mask:true})
        this.$api.authorization("https://erp.jianwangkeji.cn/back.html").then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						this.$store.commit("isEnterAuth", true);
            this.modshow=false
						uni.navigateTo({
							url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl)),
						});
					} else {
						uni.hideLoading();
					}
				}).catch(err=>{
          uni.hideLoading();
        });
      }
    },
    previewPdf(){
      this.$checkName(this.form.templateUrl)
    },
    getWeb(e){
       if(e.detail.data[0].ok){
         console.log('webview的数据',e.detail.data[0].action);
         let data=e.detail.data[0].action
         this.signBoxList=data
       }
        this.webShow=false
      // uni.navigateBack({ delta: 1 })
    },
    findContractTemplateById(pkId) {
      this.$api.findContractTemplateById({ pkId }).then((res) => {
        if (res.code === 200) {
          this.form = res.data;
          this.pdfUrl = res.data.templateUrl;
          if(res.data.contractType===1){
            let arr=res.data.contractTemplateCustoms.filter(item=>item.fkUserId!='0')
            this.signBoxList=res.data.contractTemplateCustoms.map(item=>({...item,isNail:item.fkUserId=='0'?0:1,userName:item.fkUserId=='0'?'乙方':'甲方',x:(item.xcoordinate-50)*0.6,y:((item.page-1)*505.2)+(505.2-(item.ycoordinate + 45)*0.6)}))
            this.signId=arr[0].fkUserId
            this.signName=arr[0].userName
          }
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    nailUsersByOrgId(){
      this.$api.nailUsersByOrgId({enableStatus:0}).then(res=>{
        if(res.code===200){
          this.signPeoList=res.data.map(item=>({label:item.realName+(!item.empowerTime?'':'【授权过期】'),value:item.pkId}))
        }else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      })
    },
    reshPage() {
      var pages = getCurrentPages(); //当前页面栈
      if (pages.length > 1) {
        var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
        beforePage.$vm.refreshIfNeeded = true;
      }
    },
    edit() {
      this.nailUsersByOrgId()
      this.preview = false;
    },
    typeChange(e) {
      console.log(e);
      this.signName = "";
      this.signId = "";
    },
    setSign() {
      if (this.preview) {
        return;
      }
      if(!this.signId){
        return uni.showToast({title:"请选择甲方签署人",icon:"none"})
      }
      // #ifdef APP-PLUS
      this.urls=request.h5Url+`/h5/#/pages/labour/sealSet?data=${JSON.stringify( this.signBoxList )}&pdfUrl=${this.pdfUrl}&nailId=${this.signId}&isApp=1`
      console.log(this.urls);
      this.webShow=true
			// #endif
      // #ifdef H5
      let that = this;
      uni.navigateTo({
        url: `/pages/labour/sealSet?data=${JSON.stringify(
          this.signBoxList
        )}&pdfUrl=${this.pdfUrl}&nailId=${this.signId}&isApp=0`,
        events: {
          list: function (data) {
            console.log(data);
            if (data.data) {
              that.signBoxList = JSON.parse(data.data);
            } else {
              that.signBoxList = [];
            }
          },
        },
        success: (res) => {
          uni.hideLoading();
          res.eventChannel.emit("list", {
            data: JSON.stringify(that.signBoxList),
          });
        },
        fail: (err) => {
          console.log(err);
        },
      });
			// #endif
      
    },
    save() {
      // 给额签宝x需要加50，y需要减45
      let data = {...this.form}
      console.log(data);
      if(!data.templateName){
        return uni.showToast({title:"请填写模板名称"})
      }
      if(!data.keyword){
        return uni.showToast({title:"请输入关键词"})
      }
      if(!data.templateCode){
        return uni.showToast({title:"请输入模板编号"})
      }
      if(!data.templateUrl){
        return uni.showToast({title:"请上传合同"})
      }
      if(data.contractType===1){
        data.contractTemplateCustoms=this.signBoxList.map((item) => ({
        ...item,
        xcoordinate: item.x / 0.6 + 50,
        ycoordinate: (505.2 - (item.y-((Math.ceil(item.y/505.2)-1)*505.2))) / 0.6 - 45,
        page:Math.ceil(item.y/505.2)
      }));
        if(!data.contractTemplateCustoms.length){
          return uni.showToast({title:'请设置签署区'})
        }
      }
      uni.showLoading({ mask: true })
      if(this.type===1){
        this.$api.addLabourContractTemplate(data).then(res=>{
          uni.hideLoading()
          if(res.code===200){
            this.findContractTemplateById(res.data);
              this.reshPage();
              setTimeout(()=>{
                uni.navigateBack()
                uni.showToast({ title: "新增成功", icon: "success" });
              },200)
              // this.type = 2;
              // this.preview = true;
          }else{
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        }).catch(err=>{
          uni.hideLoading()
        })
      }else{
        this.$api.updateTemplate(data).then(res=>{
          uni.hideLoading()
          if(res.code===200){
            this.findContractTemplateById(this.form.pkId);
            this.reshPage();
            // this.preview = true;
            setTimeout(()=>{
              uni.navigateBack()
              uni.showToast({ title: "编辑成功", icon: "success" });
            },200)
          }else{
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        }).catch(err=>{
          uni.hideLoading()
        })
      }
      // this.reshPage()
    },
    signBtn() {
      uni.navigateTo({
        url: "/pages/labour/directedInvitation?url=" + this.form.templateUrl+'&fkTemplateId='+this.form.pkId,
      });
    },
    selectPeo() {
      if (this.preview) {
        return;
      }
      this.pickerShow = true;
    },
    pickerConfirm(e) {
      console.log(e);
      if (e.value[0]) {
        if(!e.value[0].empowerTime){
          this.signId = e.value[0].value;
          this.signName = e.value[0].label;
          this.pickerCancel();
        }else{
          uni.showToast({title:"该人员授权已过期，无法选择",icon:"none"})
        }
      }
    },
    pickerCancel() {
      this.pickerShow = false;
    },
    openModel(type) {
      this.modelType = type;
      if (type === 1) {
        this.modelTitle = "删除提示";
        this.modelCont = "确定要删除该合同?";
      } else if (type === 2) {
        this.modelTitle = "禁用提示";
        this.modelCont = "确定要禁用该合同?";
      } else if (type === 3) {
        this.modelTitle = "启用提示";
        this.modelCont = "确定要启用该合同?";
      }
      this.modelShow = true;
    },
    confirmDel() {
      if (this.modelType === 1) {
        this.$api.deleteTemplate({pkId:this.form.pkId}).then(res=>{
           if (res.code === 200) {
            this.modelShow = false;
            this.reshPage();
            uni.showToast({ title: "删除成功", icon: "success" });
            uni.navigateBack();
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        })
        
      } else if (this.modelType === 2) {
        this.updateTemplateStatusById()
      } else if (this.modelType === 3) {
        this.updateTemplateStatusById()
      }
    },
    cancelDel() {
      this.modelShow = false;
    },
    updateTemplateStatusById(){
      let data={
        id:this.form.pkId,
        status:this.modelType === 2?1:2
      }
      this.$api.updateTemplateStatusById(data).then((res) => {
          if (res.code === 200) {
            this.modelShow = false;
            this.reshPage();
            uni.showToast({ title:this.modelType === 2? "禁用成功":"启用成功", icon: "success" });
            this.getDatas.enableStatus =this.modelType === 2? 1:this.modelType === 3?2:'';
            this.preview = true;
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        });
    },
    delFile(row, index) {
      //   this.fileList = this.fileList.filter((item) => item.id !== row.id);
      this.pdfUrl = "";
      this.form.templateUrl = "";
      this.form.pdfToImge = "";
      this.signBoxList=[]
      this.$refs.lsjUpload1.clear(this.form.fileUrl);
    },
    onChange(e) {
      console.log("改变事件", e);
    },
    onprogress(e) {
      console.log("中途事件", e);
    },
    onuploadEnd(e) {
      console.log("结束事件", e);
      if (e.responseText) {
        let res = JSON.parse(e.responseText);
        if (res.code === 200) {
          this.form.templateUrl = res.data;
          this.form.fileUrl = e.name;
          this.pdfUrl = res.data;
          uni.showLoading({mask:true})
          this.$api.pdfToImage({url:res.data}).then(res2=>{
            uni.hideLoading()
            if(res2.code==200){
              // this.pdfUrl=res2.data
              this.$set(this.form,'pdfToImge',res2.data)
              // this.form.pdfToImge=res2.data
            }
          }).catch(()=>{
            uni.hideLoading()
          })
        }
      }
    },
    getTotalNum(e) {
      this.totalNum = e;
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  background-color: #fff;
}
.u-form-item {
  padding: 0 10rpx;
}
.pad {
  position: absolute;
  height: 440rpx;
}
.pad2 {
  height: 18rpx;
}
.pdb {
  height: 100rpx;
}
.mr-20 {
  margin-right: 20rpx;
}
.mb-20 {
  margin-bottom: 20rpx;
}
.signName {
  height: 48rpx;
  line-height: 48rpx;
}
.delBtn {
  display: flex;
  justify-content: flex-end;
}
.uploads {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(52vh - 100rpx);
}
.upload-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300rpx;
  height: 300rpx;
  //   text-align: center;
  //   line-height: 40rpx;
  font-size: 32rpx;
  color: #000;
  background-color: #f2f2f2;
  border-radius: 6rpx;
  overflow: auto;
}
.pdf-div {
  position: relative;
  overflow: auto;
  height: calc(52vh - 100rpx);
}
#pdf {
  position: relative;
}
/deep/.pdfViewer {
  background-color: #fff;
}
/deep/ .viewerContainer{
  overflow:visible !important
}
.setSign {
  display: flex;
  justify-content: space-between;
  width: 500rpx;
  .left{
    max-width: 450rpx;
  }
  .right {
    color: #02a7f0;
  }
  .text-hidden {
	overflow: hidden; /*超出部分隐藏*/
	white-space: nowrap; /*禁⽌换⾏*/
	text-overflow: ellipsis; /*省略号*/
}
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100rpx;
  background-color: #fff;
  .wh-20 {
    width: 20%;
  }
  .wh-30 {
    width: 30%;
  }
  .btns {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
    border-radius: 10rpx;
    color: #fff;
    font-size: 28rpx;
  }
  .edit {
    background-color: #169bd5;
  }
  .sign {
    background-color: #c280ff;
  }
  .off {
    background-color: #ec8995;
  }
  .on {
    background-color: #7abb16;
  }
  .del {
    background-color: #da0721;
  }
}
</style>
