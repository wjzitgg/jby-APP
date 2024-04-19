<template> 

   
  <view class="content wrapper">
    
         <u-navbar
      leftText="个人信息"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
      
    <!-- <view class="bg"> </view> -->
     <!-- <view> 黄小星 </view> -->
    <view class="info" v-if="userInfo.className">
      <view class="info-item">
        <view class="info-item-title">施工项目</view>
        <view class="info-item-value">{{ userInfo.projectName }}</view>
      </view>
      <view class="info-item">
        <view class="info-item-title">所属分包商</view>
        <view class="info-item-value">{{ userInfo.orgName }}</view>
      </view>
      <view class="info-item">
        <view class="info-item-title">所属班组</view>
        <view class="info-item-value">{{ userInfo.className }}</view>
      </view>
      <view class="info-item">
        <view class="info-item-title">加入时间</view>
        <view class="info-item-value">{{ userInfo.joinDate }}</view>
      </view>
      <view class="info-item">
        <view class="info-item-title">离职时间</view>
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
        <view class="info-item-title">劳务合同</view>
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
        <view class="info-item-title">保险</view>
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
    </view>

    
    <view class="dimission" v-if="userInfo.retireBtnStatus && $auth('often:info:depart')">
      <u-button type="primary" text="离职申请" @click="dimission"> </u-button>
    </view>
    <u-empty
      style="height: 100%"
      mode="data"
      text="暂未加入任何班组"
      icon="/static/image/noData.png"
      v-if="!userInfo.className"
    ></u-empty>
  </view>
</template>

<script>
export default {
  onShow(){
    this.labourInfo();
  },
  onBackPress(e) {
    uni.switchTab({ url: "/pages/index/index" });
    return true;
  },
  // computed: {
  //   userInfo() {
  //     return this.$store.state.userInfo;
  //   },
  // },
  data() {
    return {
      insureType: ["社保", "意外保险", "其他保险"],
      userInfo:{}
    };
  },
  methods: {
    go(url) {
      uni.navigateTo({ url });
    },
    // 获取个人信息
    labourInfo() {
      this.$api.labourInfo().then((res) => {
        if (res.code === 200) {
          this.userInfo=res.data
          // this.$store.commit("saveUserInfo", res.data);
					// uni.setStorageSync('user', res.data);
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
    dimission() {
      if(!this.userInfo.isSettled){
        uni.showModal({
        title: '提示',
        content: "有未结算完成的工资，是否继续申请辞职？",
        showCancel: true,
        success: ({ confirm, cancel }) => {
          if(confirm){
             uni.navigateTo({ url: "/pages/often/dimission?type=1" });
          }
        }
      })
      }else{
        uni.navigateTo({ url: "/pages/often/dimission?type=1" });
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
  padding: 0 10px;
  border-bottom: 0.5px solid #d6d7d97d;
  background-color: #fff;
  
  .info-item-title {
    width: 170rpx;
    margin-right: 20rpx;
    height:42px;
    border-right: solid 1px #ddd;
    line-height: 42px;

  }
  .info-item-value {
    width: 480rpx;
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
.dimission {
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 2;
}

</style>

