<template>
  <view class="content wrapper">
    <u-navbar
      leftText="个人信息"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <!-- <view class="bg"></view> -->
    <view class="info">
      <view class="info-item">
        <view class="info-item-title">施工项目：</view>
        <view class="info-item-value">{{ userInfo.projectName }}</view>
      </view>
      <view class="info-item">
        <view class="info-item-title">所属分包商:</view>
        <view class="info-item-value">{{ userInfo.orgName }}</view>
      </view>
      <view class="info-item">
        <view class="info-item-title">所属班组:</view>
        <view class="info-item-value">{{ userInfo.className }}</view>
      </view>
      <view class="info-item">
        <view class="info-item-title">加入时间：</view>
        <view class="info-item-value">{{ userInfo.joinDate }}</view>
      </view>
      <view class="info-item">
        <view class="info-item-title">离职时间：</view>
        <view class="info-item-value">{{ userInfo.resignationTime }}</view>
      </view>
      <!-- 合同 -->
      <view
        class="info-item"
        @click="
          userInfo.contractVoList && userInfo.contractVoList.length
            ? contanctClick(userInfo.contractVoList[0])
            : ''
        "
      >
        <view class="info-item-title">劳务合同：</view>
        <view class="info-item-value">
          <view>
            {{
              userInfo.contractVoList && userInfo.contractVoList.length
                ? userInfo.contractVoList[0].contractName +
                  `${!userInfo.contractVoList[0].confirmStatus ? "(未签)" : ""}`
                : "无"
            }}
          </view>
          <view
            class="uClass"
            v-if="userInfo.contractVoList && userInfo.contractVoList.length"
            >{{ userInfo.contractVoList[0].className }}</view
          >
        </view>

        <view
          class="info-item-icon"
          v-if="userInfo.contractVoList && userInfo.contractVoList.length"
          ><u-icon name="arrow-right" color="#868686ba" size="26"></u-icon
        ></view>
      </view>
      <!-- 其他合同 -->
      <view
        v-if="userInfo.contractVoList && userInfo.contractVoList.length > 1"
      >
        <view
          class="info-item"
          @click="contanctClick(item)"
          v-for="item in userInfo.contractVoList.slice(
            1,
            userInfo.contractVoList.length
          )"
          :key="item.fkContractId"
        >
          <view class="info-item-title"></view>
          <view class="info-item-value">
            <view>{{
              item.contractName + `${!item.confirmStatus ? "(未签)" : ""}`
            }}</view>
            <view class="uClass">{{ item.className }}</view>
          </view>
          <view class="info-item-icon"
            ><u-icon name="arrow-right" color="#868686ba" size="26"></u-icon
          ></view>
        </view>
      </view>
      <!-- 保险 -->
      <view
        class="info-item insurance"
        @click="
          userInfo.insureVoList && userInfo.insureVoList.length
            ? go(
                '/pages/often/insuranceDetail?url=' +
                  userInfo.insureVoList[0].enclosureUrl
              )
            : ''
        "
      >
        <view class="info-item-title">保险:</view>
        <view class="info-item-value">
          <view>{{
            userInfo.insureVoList && userInfo.insureVoList.length
              ? insureType[userInfo.insureVoList[0].insureType - 1]
              : "暂无保险"
          }}</view>
          <view
            class="uClass"
            v-if="userInfo.insureVoList && userInfo.insureVoList.length"
            >{{ userInfo.insureVoList[0].className }}</view
          >
        </view>
        <view
          class="info-item-icon"
          v-if="userInfo.insureVoList && userInfo.insureVoList.length"
          ><u-icon name="arrow-right" color="#868686ba" size="26"></u-icon
        ></view>
        <br />
      </view>
      <!-- 其他保险 -->
      <view v-if="userInfo.insureVoList && userInfo.insureVoList.length > 1">
        <view
          class="info-item insurance"
          @click="go('/pages/often/insuranceDetail?url=' + item.enclosureUrl)"
          v-for="(item, index) in userInfo.insureVoList.slice(
            1,
            userInfo.insureVoList.length
          )"
          :key="index"
        >
          <view class="info-item-title"></view>
          <view class="info-item-value">
            <view>{{ insureType[item.insureType - 1] }}</view>
            <view class="uClass">{{ item.className }}</view>
          </view>
          <view class="info-item-icon"
            ><u-icon name="arrow-right" color="#868686ba" size="26"></u-icon
          ></view>
          <br />
        </view>
      </view>
      <view class="info-item">
        <view class="info-item-title">申请离职日期：</view>
        <view class="info-item-value">{{ userInfo.applyTime }}</view>
      </view>
    </view>
    <view class="footer-btns">
      <!--  2:班组长辞退 3:班组长同意离职  -->
      <view class="btns blue" v-if="getData.dismissalStatus==0" @click="openModal(2)">辞退员工</view>
      <view class="btns blue" v-if="getData.dismissalStatus==2 && getData.consentStatus == 0" @click="openModal(3)">同意离职</view>
      <view class="btns red" v-if="getData.dismissalStatus==2 && getData.consentStatus == 0" @click="openModal(4)">驳回申请</view>
    </view>
    <u-modal :show="show" title="提示" :content='content' showCancelButton @confirm="dimission" @cancel="show=false"></u-modal>
  </view>
</template>

<script>
import moment from "moment";
export default {
  onLoad(options) {
    let getData=JSON.parse(options.row)
    this.getData = getData
    this.getlabourInfo(getData.pkId)
  },
  data() {
    return {
      insureType: ["社保", "意外保险", "其他保险"],
      userInfo:{},
      getData:{},
      type:0,
      content:"",
      show:false
    };
  },
  methods: {
    go(url) {
      uni.navigateTo({ url });
    },
    openModal(type){
      this.type=type
      if(type==2){
        this.content ="确定辞退该员工？"
      }else if(type==3){
        if(this.getData.surplusAmount){
          this.content = "有未结算完成的工资，是否继续同意辞职？"
        }else{
          this.content = "确定同意该员工的离职申请？"
        }
      }else if(type==4){
        this.content = "确定驳回该员工的离职申请？"
      }
      this.show=true
    },
    // 离职/辞退
    dimission() {
      console.log("请求接口");
      let date =moment(Date.now()).format("YYYY-MM-DD")
      let data = {
        memberId: this.userInfo.memberId,
        resignationTime: date,
        type: this.type,
      };
      uni.showLoading({mask:true})
      this.$api.dismissMember(data).then((res) => {
        uni.hideLoading()
        if (res.code === 200) {
          uni.showToast({
            title: "操作成功",
            icon: "success",
            mask: true,
          });
          this.show=false
          this.getlabourInfo(this.getData.pkId)
          if(this.type==2){
            this.getData.dismissalStatus = 1
          }else if(this.type==3){
            this.getData.consentStatus = 1
          }else if(this.type==4){
            this.getData.dismissalStatus = 0
          }
        }
      });
    },
    // 获取个人信息
    getlabourInfo(fkMemberId) {
      this.$api.getlabourInfo({fkMemberId}).then((res) => {
        if (res.code === 200) {
          this.userInfo=res.data
        }
      });
    },
    contanctClick(item) {
      console.log(item);
      if (!item.confirmStatus) {
        this.$store.commit("isEsign", true);
        this.go(
          "/pages/esign/esign?url=" +
            encodeURIComponent(JSON.stringify(item.templateUrl))
        );
      } else {
        this.go("/pages/often/contractDetail?url=" + item.templateUrl);
      }
    },
    findContractDocumentStatus(item) {
      let data = {
        fkTemplateId: item.fkTemplateId,
        redirectUrl: "https://erp.jianwangkeji.cn/back.html",
        signValidity: item.signValidity,
        templateId: item.templateId,
      };
      uni.showLoading({ title: "加载中...", mask: true });
      this.$api.findContractDocumentStatus(data).then((res) => {
        uni.hideLoading();
        if (res.code === 200) {
          uni.navigateTo({
            url: `/pages/esign/esign?url=${encodeURIComponent(
              JSON.stringify(res.data.signUrl)
            )}`,
          });
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
            mask: true,
          });
          uni.hideLoading();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.content {
  height: 100%;
}
.bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-color: #f2f2f2;
}
.info {
  /*#ifdef APP-PLUS*/
	padding-top: 10rpx;
	/*#endif*/
  padding-bottom: 84rpx;
}
.info-item {
  display: flex;
  align-items: center;
  width: 100%;
  line-height: 22px;
  font-size: 15px;
  padding: 10px 15px;
  border-bottom: 0.5px solid #d6d7d97d;
  background-color: #fff;
  .info-item-title {
    width: 210rpx;
    margin-right: 20rpx;
  }
  .info-item-value {
    width: 460rpx;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
  }
  //   .info-item-icon {
  //     // width: 50rpx;
  //   }
}
// .insurance {
//   border: 0;
// }
.uClass {
  color: #7f7f7f;
  font-size: 26rpx;
}
.footer-btns{
  position: fixed;
  display: flex;
  width: 100%;
  height: 100rpx;
  bottom: 0;
  z-index: 2;
  .btns{
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100rpx;
    color: #fff;
  }
  .blue{
    background-color: #169bd5;
  }
  .red{
    background-color: #ec808d;
  }
}
</style>
