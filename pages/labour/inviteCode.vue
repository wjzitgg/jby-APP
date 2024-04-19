<template>
  <view class="wrapper">
    <u-navbar
      leftText="邀请码"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <u--form labelWidth="110" borderBottom labelAlign="right" >
        <u-form-item label="加入班组：" borderBottom @click="openPicker(1)">
          <u-input v-model="form.teamName" placeholder="点击选择" border="bottom" disabled />
        </u-form-item>
        <u-form-item label="合同模板：" borderBottom @click="openPicker(2)">
          <u-input v-model="form.templateName" placeholder="点击选择" border="bottom" disabled />
        </u-form-item>
        <u-form-item label="签署截止时间：" borderBottom @click="openDateSelect">
          <u-input v-model="form.deadline" placeholder="点击选择" border="bottom" disabled />
        </u-form-item>
      </u--form>
    </view>
    <view class="btn" @click="showCode">显示邀请码</view>
    <u-popup :show="popShow" mode="center" @close="closePop">
      <view class="codePop">
        <w-qrcode :options="options"></w-qrcode>
      </view>
    </u-popup>

    <u-picker :title="pickerTitle" :show="pickerShow" :columns="[pickerList]" keyName="label" @confirm="pickerConfirm" @cancel="pickerCancel" ></u-picker>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" />
    <u-datetime-picker :show="dateSelectShow" v-model="dates" mode="datetime" @confirm="dateSelect" @cancel="closeDateSelect" :minDate="minDate" :maxDate="maxDate" :key="minDate"></u-datetime-picker>
  </view>
</template>

<script>
import request from "../../common/request";
import moment from 'moment';
export default {
  data() {
    return {
      options: {
        code: "",
        size: 500,
      },
      popShow: false,
      form: {
        fkTeamId: "",
        teamName:"",
        fkTemplateId:"",
        templateName:"",
        deadline:""
      },
      pickerShow: false,
      teamClassList:[],
      templateList:[{ label: "无合同", value: "0" }],
      pickerList: [],
      pickerType: 1,
      pickerTitle: "选择",
      dates:"",
      minDate:"",
      maxDate:undefined,
      dateSelectShow:false
    };
  },
  onLoad(options) {
    this.minDate=Date.now()+(30*60*1000)
    this.listAllTeamsClass()
    this.searchTemplateByContractType()
  },
  methods: {
    openDateSelect() {
      this.dates = Number(new Date());
      this.minDate=Date.now()+(30*60*1000)
      this.dateSelectShow = true;
    },
    dateSelect(e) {
      //   this.dates = e.value;
      console.log(e.value);
      this.form.deadline = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
      this.closeDateSelect();
    },
    closeDateSelect() {
      this.dateSelectShow = false;
    },
    listAllTeamsClass() {
      this.$api.labourTeamSearch({projectOrgId:uni.getStorageSync("nowOrgId")}).then((res) => {
        if (res.code === 200) {
          this.teamClassList = res.data.map(item=>({...item,value:item.pkId,label:item.teamName}));
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    searchTemplateByContractType(){
      this.$api.searchTemplateByContractType().then(res=>{
        if (res.code === 200) {
          this.templateList =[{ label: "无合同", value: "0" },...res.data.map(item=>({...item,value:item.pkId,label:item.templateName}))];
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      })
    },
    showCode() {
      if(!this.form.fkTeamId){
        return uni.showToast({icon:"none",title:"请选择班组"})
      }
      if(!this.form.fkTemplateId){
        return uni.showToast({icon:"none",title:"请选择合同模板"})
      }
      if(!this.form.deadline){
        return uni.showToast({icon:"none",title:"请选择截止时间"})
      }
      let data=request.baseUrl + "/app/labourTeamMembers/addTeamMembers?fkTeamId=" + this.form.fkTeamId + "&fkTemplateId=" + this.form.fkTemplateId + "&signValidity=" + this.form.deadline
      this.options.code= `${request.baseUrl}/h5/#/pages/h5/scanCodeTran?type=4&isApp=1&data=${JSON.stringify(encodeURIComponent(data))}`
      this.popShow = true;
    },
    closePop() {
      this.popShow = false;
    },
    openPicker(type) {
      this.pickerType = type;
      this.pickerTitle = type === 1 ? "选择班组" : type == 2 ? "选择模板" : "";
      if(type===1){
        this.pickerList=this.teamClassList
      }else if(type===2){
        this.pickerList=this.templateList
      }
      this.pickerShow = true;
    },
    pickerConfirm(e) {
      if (e.value[0]) {
        if (this.pickerType === 1) {
          this.form.fkTeamId=e.value[0].value
          this.form.teamName=e.value[0].label
        } else if (this.pickerType === 2) {
          this.form.fkTemplateId=e.value[0].value
          this.form.templateName=e.value[0].label
          if(this.form.fkTemplateId=='0'){
            this.maxDate=undefined
          }else{
            let time=e.value[0].holdSealTime
            this.maxDate=new Date(time).getTime()
          }
        }
      }
      this.pickerCancel();
    },
    pickerCancel() {
      this.pickerShow = false;
    },
    openCal() {
      this.$refs.calendar.open();
    },
    caleConfirm(e) {
      console.log(e);
      this.form.deadline = e.fulldate;
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 0 20rpx;
  background-color: #fff;
}
// .codePop{
//   padding: 20rpx;
// }
</style>
