<template>
  <view class="wrapper">
    <u-navbar
      leftText="定向邀签"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <u--form
        labelPosition="left"
        :borderBottom="true"
        :labelWidth="'110'"
        labelAlign="right"
      >
        <u-form-item label="合同名称：" borderBottom>
          <view>合同名称</view>
        </u-form-item>
        <u-form-item label="甲方签署人：" borderBottom @click="openPicker">
          <view>{{ ownerName }}</view>
        </u-form-item>
        <u-form-item label="签署截止日期：" borderBottom @click="openDateSelect">
          <view>{{ form.deadline }}</view>
        </u-form-item>
        <u-form-item label="邀签对象：" borderBottom @click="openPop">
          <view>{{workNames}}</view>
        </u-form-item>
      </u--form>
    </view>
    <u-picker
      title="甲方签署人"
      :show="pickerShow"
      :columns="[ownerList]"
      keyName="label"
      @confirm="pickerConfirm"
      @cancel="pickerCancel"
    ></u-picker>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" />
    <u-popup :show="popShow" @close="closePop" mode="bottom">
      <view class="popups">
        <view class="pop-head">
          <view class="left">
            <u-input
              placeholder="工人姓名/手机号码"
              border="none"
              v-model="inpName"
            >
              <template slot="suffix">
                <u-icon
                  name="search"
                  size="28"
                  color="#d7d7d7"
                  @click="searchBtn"
                ></u-icon>
              </template>
            </u-input>
          </view>
          <view class="right" @click="selectOk">确定</view>
        </view>
        <view class="pop-content">
          <u-checkbox-group
            v-model="checkboxValue"
            placement="column"
          >
            <view class="table_detail table_empty">
              <table>
                <thead>
                  <tr>
                    <th class="wh-50">选择</th>
                    <th>工人姓名</th>
                    <th>所属班组</th>
                    <th>手机号码</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in workerList" :key="index">
                    <td class="wh-50">
                      <u-checkbox :label="''" :name="item.pkId"></u-checkbox>
                    </td>
                    <td>{{ item.memberName }}</td>
                    <td>{{ item.className }}</td>
                    <td>{{ item.mobilePhone }}</td>
                  </tr>
                </tbody>
              </table>
              <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
            </view>
          </u-checkbox-group>
        </view>
      </view>
    </u-popup>
    <u-datetime-picker :show="dateSelectShow" v-model="dates" mode="datetime" @confirm="dateSelect" @cancel="closeDateSelect" :minDate="minDate" :key="minDate"></u-datetime-picker>
    <web-view :src="urls" v-if="webShow" @onPostMessage="getWeb" @message="getWeb"/>
    <view class="btn" @click="next" v-if="!webShow">下一步</view>
  </view>
</template>

<script>
import moment from 'moment';
import request from "../../common/request";
export default {
  data() {
    return {
      form: {
        deadline: "",
        fkTemplateId:"",
        redirectUrl:"https://erp.jianwangkeji.cn/back.html",
        templateUrl:""
      },
      ownerName: "",
      ownerId: "",
      ownerList: [],
      workerList:[],
      pickerShow: false,
      popShow: false,
      inpName:"",
      searchName: "",
      checkboxValue: [],
      selectList: [],
      sendList:[],
      urls:"",
      workNames:"",
      dates:"",
      minDate:"",
      dateSelectShow:false,
      webShow:false
    };
  },
  onLoad(options) {
   this.form.templateUrl= options.url
   this.form.fkTemplateId= options.fkTemplateId
   this.minDate=Date.now()+(30*60*1000)
   this.nailUsersByOrgId()
   this.searchLabourTeamMembersByOrgId()
  },
  methods: {
    getWeb(e){
      if(e.detail.data[0].ok){
        console.log('webview的数据',e.detail.data[0].action);
        let data=e.detail.data[0].action
        uni.showLoading({ mask: true })
        this.$api.addLabourContract(data).then((res) => {
          if(res.code===200){
            // uni.navigateBack({ delta: 2 });
            uni.redirectTo({url:"/pages/esign/middlePage?type=1"})
          }else{
            uni.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        }).catch((err) => {
          uni.hideLoading()
        });
      }else{
        this.webShow=false
      }
      // uni.navigateBack({ delta: 1 })
    },
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
    nailUsersByOrgId(){
      this.$api.nailUsersByOrgId({enableStatus:0}).then(res=>{
        if(res.code===200){
          this.ownerList=res.data.map(item=>({label:item.realName + (!item.empowerTime?'':'【授权过期】'),value:item.pkId}))
        }else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      })
    },
    searchLabourTeamMembersByOrgId(){
      let data={
        keyWord:this.searchName,
        projectId:uni.getStorageSync("nowProId")
      }
      this.$api.searchLabourTeamMembersByOrgId(data).then((res) => {
        if(res.code===200){
          this.workerList=res.data
        }else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      })
    },
    openCal() {
      this.$refs.calendar.open();
    },
    caleConfirm(e) {
      console.log(e);
      this.form.deadline = e.fulldate;
    },
    openPicker() {
      this.pickerShow = true;
    },
    pickerConfirm(e) {
      if (e.value[0]) {
        if(!e.value[0].empowerTime){
          this.ownerId = e.value[0].value;
          this.ownerName = e.value[0].label;
          this.pickerCancel();
        }else{
          uni.showToast({title:"该人员授权已过期，无法选择",icon:"none"})
        }
      }
    },
    pickerCancel() {
      this.pickerShow = false;
    },
    openPop() {
      this.checkboxValue = [...this.selectList];
      this.popShow = true;
    },
    searchBtn() {
      this.searchName=this.inpName
      this.searchLabourTeamMembersByOrgId()
    },
    selectOk() {
      console.log(this.checkboxValue);
      this.selectList = [...this.checkboxValue];
      this.sendList=this.workerList.filter(item=>this.selectList.includes(item.pkId))
      this.workNames=this.sendList.map(item=>item.memberName).join(',')
      this.closePop();
    },
    closePop() {
      this.popShow = false;
      this.inpName=''
      this.searchName=''
      this.searchLabourTeamMembersByOrgId()
    },
    next() {
      if(!this.selectList.length){
        return uni.showToast({title:'请选择邀签人员',icon:"none"})
      }
      if(!this.ownerId){
        return uni.showToast({title:'请选择甲方签署人',icon:"none"})
      }
      if(!this.form.deadline){
        return uni.showToast({title:'请选择签署截止日期',icon:"none"})
      }
      let workList=this.sendList.map(item=>({userName:item.memberName,fkUserId:item.fkUserId,isNail:0,memberIds:item.pkId}))
      // 'http://192.168.1.9:8081/#'+
      // #ifdef APP-PLUS
      this.urls=request.h5Url+`/h5/#/pages/labour/contractSet?data=${JSON.stringify(this.form)}&ownerId=${this.ownerId}&workList=${JSON.stringify(workList)}&isApp=1`
      console.log(this.urls);
      this.webShow=true
			// #endif
      // #ifdef H5
      uni.navigateTo({ url: `/pages/labour/contractSet?data=${JSON.stringify(this.form)}&ownerId=${this.ownerId}&workList=${JSON.stringify(workList)}&isApp=0` })
			// #endif
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  background-color: #fff;
  padding: 0 20rpx;
  margin-top: 14rpx;
}
.popups {
  height: 50vh;
  .pop-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    padding: 0 20rpx;
    border-bottom: 1px solid #d7d7d7;
    .left {
      padding-left: 10rpx;
      border: 1px solid #d7d7d7;
    }
    .right {
      padding: 16rpx 30rpx;
      background-color: #169bd5;
      color: #fff;
      font-size: 28rpx;
      border-radius: 10rpx;
    }
  }
}
.table_detail {
  max-height: calc(50vh - 90rpx);
  td:first-child,
  th:first-child {
    width: 50px;
  }
}
.u-checkbox {
  justify-content: center;
}
</style>
