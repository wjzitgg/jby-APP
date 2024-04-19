<template>
  <view class="wrapper">
    <!-- <u-navbar
      leftText="身份验证"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar> -->
    <web-view :src="resUrl" @message="message" v-if="webShow" />
  </view>
</template>

<script>
import request from "../../common/request";
const h5FaceVerifyPlugin = uni.requireNativePlugin("DC-WBH5FaceVerifyService");
export default {
  onLoad(options) {
    console.log("接收的参数", options);
    // if(options.type==1){
    this.datas = options;
    console.log(this.datas);
    if (this.datas.out) {
      this.out = true;
    } else {
      this.out = false;
    }
    this.resUrl = JSON.parse(decodeURIComponent(options.url));
    // #ifdef APP-PLUS
    let that = this;
    uni.getSystemInfo({
      success: (res) => {
        that.osName = res.osName;
        if (res.osName == "android") {
          this.webShow = false;
          this.enterH5FaceVerify(this.resUrl);
        } else {
          this.webShow = true;
        }
      },
    });
    // #endif
    // }else{
    //   this.resUrl = options.url;
    // }
  },
  onShow() {
    if (!!h5FaceVerifyPlugin && !!this.num && !this.webShow && !this.getOk) {
      uni.navigateBack();
    }
    this.num++;
  },
  onBackPress(e) {
    if (this.$store.state.cert) {
      this.$store.commit("saveUserInfo", {});
      this.$store.commit("isCert", false);
      uni.reLaunch({ url: "/pages/login/login" });
      this.tpnsunLogin();
      return true;
    }
    if (this.$store.state.loginFace || this.$store.state.impower) {
      uni.removeStorage({
        key: "token",
      });
      uni.removeStorage({
        key: "routes",
      });
      this.$store.commit("saveUserInfo", {});
      uni.reLaunch({ url: "/pages/login/login" });
      uni.showToast({ icon: "none", title: "人脸验证不通过" });
      this.$store.commit("isLoginFace", false);
      this.$store.commit("saveImpower", false);
      return true;
    }
    if (this.$store.state.enterAuth) {
      this.$store.commit("isEnterAuth", false);
    }
    if (this.$store.state.isSign) {
      this.$store.commit("saveIsSign", false);
    }
    if (this.$store.state.contentSign) {
      this.$store.commit("saveContentSign", false);
    }
    return false;
    // if(this.resUrl.indexOf('https://ida.webank.com/api/web/login')){
    //     uni.switchTab({url:"/pages/index/index"})
    //     return true
    // }
    // uni.switchTab({ url: "/pages/index/index" });
    // return true;
  },
  data() {
    return {
      resUrl: "",
      webView: "",
      show: false,
      datas: {},
      osName: "",
      deviceToken: "",
      out: false,
      webShow: true,
      getOk: false,
      num: 0,
    };
  },
  methods: {
    enterH5FaceVerify(url) {
      if (!h5FaceVerifyPlugin) {
        this.webShow = true;
        return;
      }
      // let thirdurl = "http://192.168.2.16/back.html"; //测试用
      let thirdurl = "https://erp.jianwangkeji.cn/back.html"; //h5刷脸完成后要跳转的接入方的url，这个接入方填写自己的url
      h5FaceVerifyPlugin.startH5FaceVerify(
        {
          h5faceurl: url,
          h5thirdurl: thirdurl,
        },
        (result) => {
          console.log(result, "H5刷脸后跳转到thirdurl所在h5页面的回调");
          //uniapp todo 接入方自己的逻辑
        },
        (result) => {
          //这里是终端接受h5页面的消息回调。uniapp与h5页面两者通信可通过这个回调作为中间桥接实现。
          //注意：约定h5页面和webView通信通过JavaScriptInterface接口和JavaScript进行交互。
          //在H5页面中使用window.tencentApi.postMessage的方式来调用这个方法，参数为String类型。
          //如果是jsonobject需要转String
          let obj = JSON.parse(result);
          this.message({ detail: { data: [obj.data] } });
          //uniapp todo 接入方自己的逻辑
        }
      );
    },
    message(event) {
      // console.log("收到的信息", event);
      // console.log("***********************************");
      console.log("我的web-view", event);
      // 1确认结算，发放人脸  2登录人脸识别 3修改实名信息 4修改手机号码 ,5审批人脸,6手机审批 (合同签署/实名认证 在else里返回)
      let data = event.detail.data[0].action.contextId
        ? JSON.parse(decodeURIComponent(event.detail.data[0].action.contextId))
        : "";
      let data2 = event.detail.data[0].action;
      let isTrue = false;
      this.getOk = true;
      console.log("打印:", data);
      console.log(this.$store.state.cert);
      if (data === 1) {
        if (data2.passed === "false") {
          isTrue = true;
          uni.navigateBack({
            delta: 1,
          });
          uni.showToast({ icon: "none", title: "人脸验证不通过" });
        } else {
          request
            .put(
              "/app/labourSettlement/confirmSettlement?pkId=" +
                this.$store.state.settingPkId
            )
            .then((res) => {
              this.closeanWb();
              if (res.code === 200) {
                uni.showToast({ title: "操作成功" });
                var pages = getCurrentPages(); //当前页面栈
                if (pages.length > 1) {
                  var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
                  beforePage.$vm.queryList();
                }
                uni.navigateBack({
                  delta: 1,
                });
              } else {
                var pages = getCurrentPages(); //当前页面栈
                if (pages.length > 1) {
                  var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
                  beforePage.$vm.queryList();
                }
                uni.navigateBack({
                  delta: 1,
                });
                uni.showToast({ title: res.msg, icon: "none" });
              }
            });
        }
      } else if (data === 2) {
        if (data2.passed === "false") {
          isTrue = true;
          this.$store.commit("isLoginFace", false);
          uni.reLaunch({ url: "/pages/login/login" });
          uni.showToast({ icon: "none", title: "人脸验证不通过" });
        } else {
          // this.getAccountList(this.datas.phone);
          let arr = JSON.parse(uni.getStorageSync("accountList"));
          if (arr.length > 1) {
            isTrue = true;
            uni.navigateTo({
              url: `/pages/login/select-account?mobile=${this.datas.phone}`,
            });
          } else {
            this.accountCut(arr[0].userId, this.datas.phone);
          }
          this.$store.commit("isLoginFace", false);
          // uni.navigateBack({
          //   delta: 1,
          // });
        }
      } else if (data === 3) {
        isTrue = true;
        if (data2.passed === "false") {
          uni.navigateBack({
            delta: 1,
          });
          uni.showToast({ icon: "none", title: "人脸验证不通过" });
        } else {
          this.getInfo();
          uni.navigateBack({
            delta: 2,
          });
        }
      } else if (data && data.businessKey === 4) {
        if (data2.passed === "false") {
          isTrue = true;
          uni.navigateBack({
            delta: 1,
          });
          uni.showToast({ icon: "none", title: "人脸验证不通过" });
        } else {
          this.modifyPhone(data);
        }
      } else if (data === 5) {
        isTrue = true;
        if (data2.passed === "false") {
          uni.navigateBack({
            delta: 1,
          });
          uni.showToast({ icon: "none", title: "人脸验证不通过" });
        } else {
          uni.redirectTo({
            url: "/pages/esign/approve-hint?type=3",
            success: () => {},
          });
        }
        // uni.showToast({ icon: "success", title: "审批完成" });
      } else if (data === 6) {
        const eventChannel = this.getOpenerEventChannel();
        isTrue = true;
        if (data2.passed === "false") {
          eventChannel.emit("isOk", { data: false });
          uni.navigateBack();
          uni.showToast({ icon: "none", title: "人脸验证不通过" });
        } else {
          // this.$store.commit("setApproverOk", true);

          eventChannel.emit("isOk", { data: true });
          uni.navigateBack();
        }
      } else {
        if (this.$store.state.esign) {
          isTrue = true;
          if (this.resUrl.indexOf("https://ida.webank.com/api/web/login")) {
            uni.switchTab({ url: "/pages/index/index" });
          }
          this.$store.commit("isEsign", false);
          uni.showLoading({ mask: true });
          uni.navigateTo({
            url: "/pages/often/info",
            success: () => {
              uni.showToast({
                title: "签署成功",
                icon: "success",
                mask: true,
              });
              setTimeout(() => {
                this.getInfo();
              }, 4000);
            },
          });
          // this.$api.bindRelation(this.$store.state.bindData).then((res) => {
          //   console.log(res);
          //   if (res.code === 200) {
          //     this.getInfo();
          //     this.$store.commit("isEsign", false);
          //     uni.showToast({
          //       title: res.msg,
          //       icon: "success",
          //       mask: true,
          //     });
          //     uni.redirectTo({
          //       url: "/pages/often/info",
          //     });
          //   }
          // });
        } else {
          if (this.$store.state.goSelect) {
            isTrue = true;
            uni.navigateTo({
              url: `/pages/login/select-account?mobile=${this.datas.phone}`,
            });
          } else if (this.$store.state.cert) {
            console.log("进来了");
            let arr = JSON.parse(uni.getStorageSync("accountList"));
            console.log(arr);
            this.$store.commit("isCert", false);
            if (arr.length > 1) {
              isTrue = true;
              console.log(this.datas.phone);
              uni.navigateTo({
                url: `/pages/login/select-account?mobile=${this.datas.phone}`,
              });
            } else {
              this.tpnsLogin(arr[0].userId);
            }
          } else if (this.$store.state.recert) {
            this.$store.commit("isReCert", false);
            this.getInfo();
            uni.reLaunch({ url: "/pages/index/index" });
          } else if (this.$store.state.isSign) {
            isTrue = true;
            uni.redirectTo({ url: "/pages/esign/middlePage" });
            // uni.navigateBack();
            // this.$store.commit("saveIsSign", false);
          } else if (this.$store.state.busCert) {
            isTrue = true;
            // uni.reLaunch({ url: "/pages/index/index", });
            uni.redirectTo({ url: "/pages/esign/middlePage" });
          } else if (this.$store.state.contentSign) {
            isTrue = true;
            uni.redirectTo({ url: "/pages/esign/middlePage" });
            // this.$store.commit("saveContentSign", false);
            // uni.navigateBack({ delta: 2 });
          } else if (this.$store.state.approveSign) {
            isTrue = true;
            uni.redirectTo({ url: "/pages/esign/middlePage" });
            // let pages = getCurrentPages()
            // let prevPage = pages[pages.length - 3]; // 上一页面实例
            // if(this.$store.state.todo){
            //   prevPage.$vm.resh()
            //   this.$store.commit("saveTodo", false);
            // }else{
            //   prevPage.$vm.getDetail() // 调用上一页 定义的方法
            // }
            // this.$store.commit("saveApproveSign", false);
            // uni.navigateBack({ delta: 2 });
          } else if (this.$store.state.impower) {
            if (data2.passed === "false") {
              isTrue = true;
              this.$store.commit("saveImpower", false);
              uni.reLaunch({ url: "/pages/login/login" });
              uni.showToast({ icon: "none", title: "人脸验证不通过" });
            } else {
              // this.getAccountList(this.datas.phone);
              let arr = JSON.parse(uni.getStorageSync("accountList"));
              if (arr.length > 1) {
                isTrue = true;
                uni.navigateTo({
                  url: `/pages/login/select-account?mobile=${this.datas.phone}`,
                });
              } else {
                this.accountCut(arr[0].userId, this.datas.phone);
              }
              this.$store.commit("saveImpower", false);
            }
          } else if (this.$store.state.enterAuth) {
            // uni.reLaunch({ url: "/pages/index/index", });
            isTrue = true;
            uni.redirectTo({ url: "/pages/esign/middlePage" });
          } else if (this.$store.state.cerEsign) {
            isTrue = true;
            uni.redirectTo({ url: "/pages/esign/middlePage" });
          } else {
            if (this.out) {
              this.logOut();
            } else {
              console.log("最后");
              isTrue = true;
              uni.redirectTo({ url: "/pages/index/index" });
            }
          }
          // uni.switchTab({
          //   url: "/pages/index/index",
          //   success: () => {
          //     uni.showLoading({
          //       mask: true,
          //     });
          //     this.$store.commit("isCert", false);
          //     setTimeout(() => {
          //       this.getInfo();
          //     }, 4000);
          //   },
          // });
        }
      }

      if (isTrue) {
        this.closeanWb();
      }
    },
    closeanWb() {
      if (this.osName == "android") {
        h5FaceVerifyPlugin && h5FaceVerifyPlugin.destroyH5Activity(null); //调用关闭插件的webView.
      }
    },
    // 退出登录
    logOut() {
      this.$api.logOut().then((res) => {
        console.log(res);
        if (res.code === 200) {
          uni.removeStorage({
            key: "token",
          });
          uni.removeStorage({
            key: "routes",
          });
          this.tpnsunLogin();
          this.$store.commit("saveUserInfo", {});
          this.closeanWb();
          uni.reLaunch({
            url: "/pages/login/login",
          });
        }
      });
    },
    modifyPhone(data) {
      uni.showLoading({ mask: true });
      this.$api
        .modifyPhone(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.closeanWb();
            uni.showToast({ title: "修改成功" });
            this.getInfo();
            uni.navigateBack({
              delta: 2,
            });
          } else {
            this.closeanWb();
            uni.showToast({ icon: "none", title: res.msg });
            uni.navigateBack({
              delta: 2,
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
          this.closeanWb();
          uni.navigateBack({
            delta: 2,
          });
        });
    },
    // 获取个人信息
    getInfo() {
      this.$api
        .getInfo()
        .then((res) => {
          this.closeanWb();
          if (res.code === 200) {
            this.$store.commit("saveUserInfo", res.data);
            if (!res.data.verifyStatus) {
              setTimeout(() => {
                this.getInfo();
              }, 2000);
            } else {
              uni.hideLoading();
            }
          }
        })
        .catch((err) => {
          this.closeanWb();
          uni.hideLoading();
        });
    },
    getRoutes() {
      this.$api.getOftenRouter().then((res) => {
        this.closeanWb();
        if (res.code === 200) {
          let routes = res.data;
          this.$store.commit("saveRoutes", routes);
          uni.setStorageSync("routes", JSON.stringify(routes));
        }
      });
    },
    tpnsLogin(userId) {
      // #ifdef APP-PLUS
      let that = this;
      const tpns = uni.requireNativePlugin("TX-TPNS");
      console.log(tpns);
      //注册获取token
      if (!!tpns) {
        tpns &&
          tpns.registerPush({}, (res) => {
            console.log("注册", res);
            that.deviceToken = res.token;
          });
      }
      // #endif
      setTimeout(() => {
        this.accountCut(userId, this.datas.phone);
      }, 500);
    },
    tpnsunLogin() {
      // #ifdef APP-PLUS
      const tpns = uni.requireNativePlugin("TX-TPNS");
      //注册获取token
      tpns && tpns.unregisterPush();
      // #endif
    },
    accountCut(pkId, phoneNumber) {
      let deviceType = null;
      if (this.osName === "ios") {
        deviceType = 2;
      } else if (this.osName === "android") {
        deviceType = 1;
      } else if (this.osName === "mac") {
        deviceType = 3;
      }
      let params = {
        phoneNumber,
        pkId,
        sourceType: 2,
        deviceType,
        deviceToken: this.deviceToken,
        tagList: [phoneNumber],
      };
      console.log(params);
      uni.setStorageSync("token", uni.getStorageSync("areaToken"));
      uni.showLoading({
        mask: true,
      });
      this.$api
        .switchLogin(params)
        .then((res) => {
          console.log("270", res);
          this.closeanWb();
          uni.hideLoading();
          if (res.code === 200) {
            uni.setStorageSync("token", res.data.access_token);
            this.getRoutes();
            this.getInfo();
            uni.reLaunch({
              url: "/pages/index/index",
              success: () => {},
            });
          } else {
            uni.redirectTo({
              url: "/pages/login/login",
            });
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
            this.tpnsunLogin();
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getAccountList(phoneNumber) {
      uni.showLoading({
        mask: true,
      });
      console.log("264", phoneNumber);
      this.$api
        .getAccountList({
          phoneNumber,
          sourceType: 2,
        })
        .then((res) => {
          console.log("303", res);
          this.closeanWb();
          uni.hideLoading();
          if (res.code === 200) {
            if (res.data.length > 1) {
              uni.navigateTo({
                url: `/pages/login/select-account?mobile=${this.datas.phone}`,
              });
            } else {
              this.accountCut(res.data[0].userId, phoneNumber);
            }
          } else {
            uni.redirectTo({
              url: "/pages/login/login",
            });
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
