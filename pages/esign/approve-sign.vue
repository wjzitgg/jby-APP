<template>
  <view class="wrapper">
    <u-navbar
      leftText="电子签名"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="bg"></view>
    <view class="content"
      ><amSignInput
        canvasId="twoDrowCanvas"
        canvasIds="twoRotateCanvas"
        @signToUrl="twoSignToUrl"
        :action="action"
      ></amSignInput
    ></view>
    <u-button type="primary" text="确定" class="btn" @click="btnOk"></u-button>
  </view>
</template>

<script>
import amSignInput from "../../components/am-sign-input/am-sign-input";
export default {
  components: { amSignInput },
  onLoad(options) {
    console.log(options);
    let data = JSON.parse(options.data);
    if (data.appStatus == 2) {
      this.callAuthStatus = 0;
    } else if (data.appStatus == 3) {
      this.callAuthStatus = 1;
    }
    this.getData = data;
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  data() {
    return {
      signUrl: "",
      callAuthStatus: "",
      pkId: "",
      action: "https://erp.jianwangkeji.cn/gateway/eng/file/upload/picture",
      fkNodeId: "",
      getData: {},
    };
  },
  methods: {
    twoSignToUrl(e) {
      console.log("签名", e);
      this.signUrl = e;
    },
    btnOk() {
      if (!this.signUrl) {
        return uni.showToast({
          title: "请先签名",
          icon: "none",
          mask: true,
        });
      }
      let data = {
        unique: this.getData.codeId,
        url: this.signUrl,
      };
	  console.log(data);
      if (this.callAuthStatus === 1) {
        this.$api
          .getFaceAuthStatus({ unique: this.getData.codeId, needSign: 1 })
          .then((res) => {
            console.log('是否需要人脸',res);
            if (res.code == 200) {
              if (res.data.verifyStatus) {
                console.log('参数',{ callbackUrl: "https://erp.jianwangkeji.cn/back.html?contextId=5", ...data });
                this.$api
                  .scanQRCode({
                    callbackUrl:
                      "https://erp.jianwangkeji.cn/back.html?contextId=5",
					  ...data
                  })
                  .then((res) => {
                    if (res.code === 200) {
                      uni.redirectTo({
                        url:
                          "/pages/esign/esign?url=" +
                          encodeURIComponent(
                            JSON.stringify(res.data.faceSwipingUrl)
                          ),
                        success: () => {
                          uni.hideLoading();
                        },
                      });
                    } else {
                      uni.showToast({ icon: "success", title: res.msg });
                    }
                  }).catch(err=>{
                    console.log('是否需要人脸',err);
                  });
              } else {
                this.$api
                  .updateQRCodeData(data)
                  .then((res) => {
                    if (res.code == 200) {
                      uni.showToast({
                        icon: "none",
                        title: "认证成功",
                        mask: true,
                      });
                      setTimeout(() => {
                        uni.redirectTo({
                          url: "/pages/esign/approve-hint?type=3",
                          success: () => {},
                        });
                      }, 1000);
                    } else {
                      uni.showToast({ icon: "none", title: res.msg });
                    }
                  });
              }
            } else {
              uni.showToast({ icon: "success", title: res.msg });
            }
          });
      } else {
        this.$api.updateQRCodeData(data).then((res) => {
			console.log('只签',res);
          if (res.code === 200) {
            uni.redirectTo({ url: "/pages/esign/approve-hint?type=2" });
            // uni.showToast({ icon: 'success', title: '审批完成' });
            // uni.navigateBack({ delta: 1 });
          } else {
            uni.showToast({ icon: "none", title: res.data });
          }
        }).catch(err=>{
			console.log(err);
		});
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-color: #f7f7ff;
}
.content {
  display: flex;
  justify-content: center;
  width: 750rpx;
  height: 500rpx;
}
.btn {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
