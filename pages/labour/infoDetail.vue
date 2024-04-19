<template>
  <view class="wrapper">
    <u-navbar
      leftText="劳务信息"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="contnet">
      <!-- <u--form
        labelPosition="left"
        :borderBottom="true"
        :labelWidth="'80'"
        labelAlign="right"
      >
        <u-form-item label="工人姓名" borderBottom>{{form.userName}} </u-form-item>
        <u-form-item label="所属标段" borderBottom v-if="userInfo.orgType!==5">{{projectBidName}} </u-form-item>
        <u-form-item label="所属班组" borderBottom>{{form.teamName}} </u-form-item>
        <u-form-item label="手机号码" borderBottom>{{form.telephone}} </u-form-item>
        <u-form-item label="身份证号" borderBottom>{{form.cardNum}} </u-form-item>
        <u-form-item label="入职日期" borderBottom>{{form.inductionTime}} </u-form-item>
        <u-form-item label="离职日期" borderBottom>{{form.resignationTime}} </u-form-item>
      </u--form> -->

       <view
         class="contnet-box"
         labelPosition="left"
         :borderBottom="true"
         :labelWidth="'80'"
         labelAlign="right">
           <view class="form-name">
             <view class="data-form">工人姓名</view>
             <view class="data-info">{{form.userName}}</view>
           </view>
           <view class="form-name" v-if="userInfo.orgType!==5">
             <view class="data-form">所属标段</view>
             <view class="data-info">{{projectBidName}}</view>
           </view>
           <view class="form-name" >
             <view class="data-form">所属班组</view>
             <view class="data-info">{{form.teamName}} </view>
           </view>

           <view class="form-name" >
             <view class="data-form">手机号码</view>
             <view class="data-info">{{form.telephone}} </view>
           </view>

           <view class="form-name" >
             <view class="data-form">身份证号</view>
             <view class="data-info">{{form.cardNum}}  </view>
           </view>

           <view class="form-name" >
             <view class="data-form">入职日期</view>
             <view class="data-info">{{form.inductionTime}} </view>
           </view>

           <view class="form-name" >
             <view class="data-form">离职日期</view>
             <view class="data-info">{{form.resignationTime}} </view>
           </view>


       </view>



      <view>

        <!-- <u-subsection
          :list="topList"
          mode="subsection"
          :current="current"
          @change="sectionChange"
        ></u-subsection> -->
       <view class="nav-search">
      <u-tabs
       class="search-btn"
       mode="subsection"
       :list="topList"
       :current="current"
       @change="sectionChange"
       :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
        ></u-tabs>

       </view>


  
        <view class="table_detail table_empty">
          <table class="table1" v-show="current === 0">
            <thead>
              <tr>
                <th><uni-icons type="list" size="20"></uni-icons></th>
                <th class="topfixed">状态</th>
                <th>日期</th>
                <th>结算金额</th>
                <th>发放金额</th>
                <th>结余金额</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form.paymentBalanceListVos" :key="index">
                <td>{{ index+1 }}</td>
                <td class="fixeds">已确认</td>
                <td>{{ item.settlementTime }}</td>
                <td>{{ item.settlementAmount ? item.settlementAmount : "/" }}</td>
                <td>{{ item.grantAmount ? item.grantAmount : "/" }}</td>
                <td>{{ item.paymentAmount ? item.paymentAmount : "/" }}</td>
                <td>{{ item.remark }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2">合计</td>
                <td>{{ "￥" + settingTotal.settlementAmount }}</td>
                <td>{{ "￥" + settingTotal.grantAmount }}</td>
                <td>{{ "￥" + settingTotal.paymentAmount }}</td>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          <table class="table2" v-show="current === 1">
            <thead>
              <tr>
                <th><uni-icons type="list" size="20"></uni-icons></th>
                <th>劳务合同</th>
                <th>签订日期</th>
                <th class="w-50">状态</th>
                <th>详情</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form.teamMembersContractListVos" :key="index">
                <td>{{ index+1 }}</td>
                <td>{{ item.contractName }}</td>
                <td>{{ item.signingTime }}</td>
                <!-- 0：已签署, 1：失效，2：待签署, 3: 已作废 -->
                <td class="w-50">{{item.contractStatus===0?'已签署':item.contractStatus===1?'已失效':item.contractStatus===2?'待签署':item.contractStatus===3?'已作废':''}}</td>
                <td class="blue" @click="previewCon(item)">查看</td>
              </tr>
            </tbody>
          </table>
          <table class="table3" v-show="current === 2">
            <thead>
              <tr>
                <th><uni-icons type="list" size="20"></uni-icons></th>
                <th class="w-60">保险类型</th>
                <th>保险有效期</th>
                <th class="w-60">购买人</th>
                <th class="w-80">购买日期</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form.teamMembersInsureListVos" :key="index">
                <!-- 1：社保，2：意外险，3：其他 -->
                <td>{{ index+1 }}</td>
                <td class="blue w-60" @click="previewIns(item)">{{ item.insureType===1?'社保':item.insureType===2?'意外险':'其他' }}</td>
                <td>{{item.beginTime}} ~ {{item.endTime}}</td>
                <td class="w-60">{{ item.userName }}</td>
                <td class="w-80">{{item.purchaseTime}}</td>
              </tr>
            </tbody>
          </table>
          <table class="table4" v-show="current === 3">
            <thead>
              <tr>
                <th>详情</th>
                <th>培训类型</th>
                <th>培训主题</th>
                <th>培训地点</th>
                <th>培训日期</th>
                <th>发起人</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in form.trainListVos" :key="item.pkId"  >
                
                <td @click="previewTrain(item)">
                  <u-icon name="eye" class="icons" size="20"></u-icon>
                </td>
                <td>{{ item.speakerTypeName }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.detailAddress }}</td>
                <td>{{ item.trainingTime }}</td>
                <td>{{ item.speaker }}</td>
              </tr>
            </tbody>
          </table>
          <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
        </view>
      </view>
    </view>

    <u-popup
      :show="previewShow"
      mode="center"
      round="10"
      closeable
      @close="closePreview"
    >
      <view class="preview">
        <view class="preview-top">预览</view>
        <pdf
          :fileUrl="previewUrl"
          :iframeStyle="{ width: '700rpx', height: '1080rpx' }"
          :imgs="false"
        ></pdf>
      </view>
    </u-popup>
  </view>
</template>

<script>
import pdf from "../../components/pdf-preview.vue";
export default {
  components: { pdf },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  data() {
    return {
      topList: [
        {name:'工资发放'}, 
        {name:'劳务合同'},
        {name:'保险'},
        {name:'培训'},
       
      ],
      current: 0,
      form:{},
      previewShow: false,
      previewUrl: "",
      settingTotal:{
        settlementAmount:0,
        grantAmount:0,
        paymentAmount:0
      },
      projectBidName:""
    };
  },
  onLoad(options) {
    let data=JSON.parse(options.data)
    this.projectBidName=uni.getStorageSync("nowProName")
    this.findLabourTeamMembersById(data.pkId)
  },
  methods: {
    findLabourTeamMembersById(pkId){
      uni.showLoading({ mask: true })
      this.$api.findLabourTeamMembersById({pkId}).then((res) => {
        uni.hideLoading();
        if(res.code===200){
          this.form=res.data
          this.form.paymentBalanceListVos.forEach(item=>{
            this.settingTotal.settlementAmount+=item.settlementAmount
            this.settingTotal.grantAmount+=item.grantAmount
            this.settingTotal.paymentAmount+=item.paymentAmount
          })
        }else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
      }).catch((err) => {
          uni.hideLoading();
        });
    },
    // sectionChange(index) {
    //   this.current = index;
    //   // this.showList = [];
    // },
    sectionChange(item) {
        if(this.current===item.index){
           return
        }
        this.current=item.index
    },
    previewCon(item) {
      // this.previewUrl = item.fileUrl;
      this.$checkName(item.contractUrl)
      return
      this.previewUrl = item.contractUrl;
      this.previewShow = true;
    },
    closePreview() {
      this.previewShow = false;
      this.previewUrl = "";
    },
    previewIns(item) {
      uni.navigateTo({ url: "/pages/labour/insuranceDetail?type=3&data="+JSON.stringify(item) });
    },
    previewTrain(item) {
      uni.navigateTo({ url: "/pages/labour/trainDetail?type=3&data="+JSON.stringify(item) });
    },
  },
};
</script>

<style lang="scss" scoped>
.contnet {
  // padding: 0 20rpx;
  // background-color: #fff;
}
.contnet-box{
  background-color: #fff;

}
.table_detail {
  max-height: 50vh;

  .table1 {
    td:first-child,
    th:first-child {
      width: 124rpx;
    }
    .fixeds {
      width: 100rpx;
      left: 120rpx;
    }
    .topfixed {
      left: 120rpx;
    }
  }
  .table2 {
    td:last-child,
    th:last-child {
      width: 100rpx;
    }
    .w-50 {
      width: 100rpx;
    }
  }
  .table3 {
    .w-60 {
      width: 120rpx;
    }
    .w-80 {
      width: 160rpx;
    }
  }
  .table4 {
    td:first-child,
    th:first-child {
      width: 100rpx;
    }
    .fixeds {
      left: 134rpx;
    }
    .topfixed {
      left: 134rpx;
    }
    .icons {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .fixeds {
    width: 200rpx;
    position: sticky;
    left: 120rpx;
    z-index: 1;
  }
  .topfixed {
    position: sticky;
    top: 10px;
    left: 120rpx;
    z-index: 2;
  }
  .blue {
    color: #10a7f0;
  }
  tfoot {
    td {
      background: #fafafa;
    }
  }
}
.text-hidden {
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁⽌换⾏*/
  text-overflow: ellipsis; /*省略号*/
}
.preview {
  width: 700rpx;
  height: 1200rpx;
  overflow: hidden;
  .preview-top {
    height: 100rpx;
    line-height: 100rpx;
    padding-left: 40rpx;
  }
}
.form-name{
    display: flex;
    width: 100%;
    height: 40px;
    border-bottom:solid 1px #ddd;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0px;
    line-height: 40px;
    color: rgba(32, 52, 87, 1);
}
.data-form{
  width: 110px;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  border-right: solid 1px #ddd;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0px;
  line-height: 40px;
  color: rgba(32, 52, 87, 1);
}
.data-info{
    padding-left:20px ;
}
.nav-search{
   margin-top: 10px;
   background-color: #fff; 
}
.table_detail{
    background-color: #fff;
    border-top: none;
}
</style>
