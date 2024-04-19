<template>
  <view class="wrapper setSignTop">
    <u-navbar
      leftText="设置合同"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      class="navBar"
      :autoBack="true"
    ></u-navbar>
    <view class="pad"></view>
    <view class="content" :style="{ height: totalNum * 505.2 + 'px' }">
      <view class="sticky">
        <view class="setComponent" :style="{ padding: `0 ${padWid / 2}px` }">
          <view>自定义组件：</view>
          <view class="setComponentBtn" @click="setComponentBtn">设置组件</view>
        </view>
        <view class="components">
          <view class="left-btn2" @click="leftBtn2" v-if="btnShow2">
            <u-icon name="arrow-left" size="16"></u-icon>
          </view>
          <view class="right-btn2" @click="rightBtn2" v-if="btnShow2">
            <u-icon name="arrow-right" size="16"></u-icon>
          </view>
          <cusComBox
            class="components-item"
            v-for="(item, index) in showComs"
            :key="index"
            :content="item.label"
            :page="totalNum"
            :left="item.x"
            :top="item.y"
            @getPosition="getPosition2($event, item, 1, index)"
            @close="closeSignBox2(item, index, 1)"
            :index="index"
            :type="2"
            :padWid="padWid"
            :pstop="30"
          ></cusComBox>
        </view>
        <view class="ownerSign" :style="{ padding: `0 ${padWid / 2}px` }">
          <view class="ownerSign-head">甲方签名组件</view>
          <view class="signs">
            <signBox
              class="signs-item"
              v-for="(item, index) in ownerList"
              :key="index"
              :content="item.userName"
              :page="totalNum"
              :left="item.x"
              :top="item.y"
              @getPosition="getPosition($event, item, 1, index)"
              @close="closeSignBox(item, index, 1)"
              :index="index"
              :type="2"
              :padWid="padWid"
              :pstop="90"
            >
            </signBox>
          </view>
        </view>
        <view class="party" :style="{ padding: `0 ${padWid / 2}px` }">
          <view class="left-btn" @click="leftBtn" v-if="btnShow">
            <u-icon name="arrow-left" size="16"></u-icon>
          </view>
          <view class="right-btn" @click="rightBtn" v-if="btnShow">
            <u-icon name="arrow-right" size="16"></u-icon>
          </view>
          <view class="party-head">乙方签名组件</view>
          <view class="signs">
            <signBox
              class="signs-item"
              v-for="(item, index) in showSigns"
              :key="index"
              :content="item.userName"
              :page="totalNum"
              :left="item.x"
              :top="item.y"
              @getPosition="getPosition($event, item, 2, index)"
              @close="closeSignBox(item, index, 2)"
              :index="index"
              :type="2"
              :padWid="padWid"
              :pstop="180"
            >
            </signBox>
          </view>
        </view>
      </view>
      <view
        class="pdf-div"
        id="pdf-div"
        :change:totalNum="pdf.getData"
        :totalNum="totalNum"
        :change:pdfUrl="pdf.getData2"
        :pdfUrl="pdfUrl"
      >
        <view id="pdf" style="width: 357px; height: 505.2px"></view>
        <signBox
          v-for="(item, index) in signBoxList"
          :key="'s' + index"
          :content="item.userName"
          :page="totalNum"
          :left="item.x"
          :top="item.y"
          @getPosition="getPosition($event, item, 3, index)"
          @close="closeSignBox(item, index, 3)"
          :index="index"
        ></signBox>
        <cusComBox
          class="components-item"
          v-for="(item, index) in comBoxList"
          :key="'c' + index"
          :content="item.label"
          :page="totalNum"
          :left="item.x"
          :top="item.y"
          @getPosition="getPosition2($event, item, 2, index)"
          @close="closeSignBox2(item, index, 2)"
          :index="index"
        ></cusComBox>
      </view>
    </view>
    <view class="pab"></view>
    <view class="btn" @click="isOk">确认邀签</view>
  </view>
</template>

<script lang="renderjs" module="pdf">
import Pdfh5 from "pdfh5";
export default {
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
import signBox from "../../components/signBox/signBoxthree.vue";
import cusComBox from "../../components/cusComBox/cusComBox.vue";
import uniWeb from '../../static/uni-webview';
export default {
  components: { signBox, cusComBox },
  data() {
    return {
      ownerList: [],
      pdfUrl: "",
      partyList: [],
      signBoxList: [],
      componentList: [],
      comBoxList: [],
      totalNum: 1,
      scrollLeft: 0,
      scrollTop: 0,
      timer: null,
      screenWidth: 0,
      padWid: 0,
      maxPage: 1,
      page: 1,
      maxPage2: 1,
      page2: 1,
      btnShow: false,
      btnShow2: false,
      sendList: [],
      ownerId:"",
      form:{},
      isApp:0
    };
  },
  computed: {
    showSigns() {
      let arr = this.partyList
        .slice(5 * (this.page - 1), 5 * this.page)
        .map((item, index) => ({
          ...item,
          x: index * 60 + index * 7 + this.padWid / 2 + 15,
          y: 180,
        }));
      return arr;
    },
    showComs() {
      let arr = this.componentList
        .slice(5 * (this.page2 - 1), 5 * this.page2)
        .map((item, index) => ({
          ...item,
          x: index * 60 + index * 7 + this.padWid / 2 + 15,
          y: 30,
        }));
      return arr;
    },
  },
  onLoad(options) {
    this.partyList=JSON.parse(options.workList)
    this.form=JSON.parse(options.data)
    this.maxPage =
      this.partyList.length % 5 == 0
        ? this.partyList.length / 5
        : Math.ceil(this.partyList.length / 5);
    if (this.partyList.length <= 5) {
      this.btnShow = false;
    } else {
      this.btnShow = true;
    }
    console.log(this.btnShow);
    uni.getSystemInfo({
      //获取系统参数
      success: (res) => {
        this.screenWidth = res.windowWidth;
        this.padWid = res.windowWidth - 357;
      },
    });
    this.ownerList = [{ userName: "甲方", x: this.padWid / 2 + 15, y: 90,isNail:1,fkUserId:options.ownerId }];
    this.pdfUrl=this.form.templateUrl
    this.isAPP=options.isApp - 0
  },
  onBackPress() {
    if(this.isAPP){
        uniWeb.webView.postMessage({
            data: {
              ok:false
            },
          });
      return true
      }
    return false
  },
  onPageScroll(data) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      console.log(data);
      this.scrollTop = data.scrollTop;
    }, 200);
  },
  methods: {
    isOk() {
      let data = {
        ...this.form,
        componentAdds: this.comBoxList.map((item) => ({ ...item,
         xcoordinate: item.x / 0.6 + 50,
        ycoordinate: (505.2 - (item.y-((Math.ceil(item.y/505.2)-1)*505.2))) / 0.6 - 45,
        page:Math.ceil(item.y/505.2)
         })),
        contractTemplateCustoms: this.signBoxList.map((item) => ({
         ...item,
        xcoordinate: item.x / 0.6 + 50,
        ycoordinate: (505.2 - (item.y-((Math.ceil(item.y/505.2)-1)*505.2))) / 0.6 - 45,
        page:Math.ceil(item.y/505.2) })),
        labourNotSignedContractAdds:[]
      };
      this.partyList.forEach(item => {
        data.labourNotSignedContractAdds.push({ memberIds: item.memberIds });
      });
      if(this.isAPP){
        uniWeb.webView.postMessage({
            data: {
              action: data,
              ok:true
            },
          });
      }else{
        uni.showLoading({ mask: true })
        this.$api.addLabourContract(data).then((res) => {
          if(res.code===200){
            uni.redirectTo({url:"/pages/esign/middlePage?type=2"})
          }else{
            uni.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        }).catch((err) => {
          uni.hideLoading()
        });
      }
      
    },
    getPosition(e, row, type, index) {
      row.x = e.x;
      row.y = e.y;
      if (type === 1) {
        if (row.y > 240) {
          if (this.scrollTop + row.y - 240 > this.totalNum * 505.2 - 60) {
            row.y = 60;
            row.x = this.padWid / 2 + 15;
            return;
          }
          this.signBoxList.push({
            ...row,
            y: this.scrollTop + row.y - 240,
            x: row.x - this.padWid / 2,
          });
          row.y = 90;
          row.x = index * 60 + index * 7 + this.padWid / 2 + 15;
        }
      } else if (type === 2) {
        if (row.y > 240) {
          if (this.scrollTop + row.y - 240 > this.totalNum * 505.2 - 60) {
            row.y = 90;
            row.x = this.padWid / 2 + 15;
            return;
          }
          this.signBoxList.push({
            ...row,
            y: this.scrollTop + row.y - 240,
            x: row.x - this.padWid / 2,
          });
          row.y = 180;
          row.x = index * 60 + index * 7 + this.padWid / 2 + 15;
        }
      }
    },
    closeSignBox(row, idx, type) {
      if (type === 1) {
        this.$set(this.ownerList[idx], {
          x: idx * 60 + idx * 7 + this.padWid / 2 + 15,
          y: 90,
        });
      } else if (type === 2) {
        this.$set(this.partyList[idx], {
          x: idx * 60 + idx * 7 + this.padWid / 2 + 15,
          y: 180,
        });
      } else if (type === 3) {
        this.signBoxList.splice(idx, 1);
      }
    },
    getPosition2(e, row, type, index) {
      row.x = e.x;
      row.y = e.y;
      if (type === 1) {
        if (row.y > 240) {
          if (this.scrollTop + row.y - 240 > this.totalNum * 505.2 - 60) {
            row.y = 30;
            row.x = this.padWid / 2 + 15;
            return;
          }
          this.comBoxList.push({
            ...row,
            y: this.scrollTop + row.y - 240,
            x: row.x - this.padWid / 2,
          });
          row.y = 30;
          row.x = index * 60 + index * 7 + this.padWid / 2 + 15;
        }
      }
      console.log(row, e);
    },
    closeSignBox2(row, idx, type) {
      if (type === 1) {
        this.$set(this.componentList[idx], {
          x: idx * 60 + idx * 7 + this.padWid / 2 + 15,
          y: 30,
        });
      } else if (type === 2) {
        this.comBoxList.splice(idx, 1);
      }
    },
    getTotalNum(e) {
      this.totalNum = e;
    },
    leftBtn() {
      if (this.page === 1) {
        return;
      }
      this.page--;
    },
    rightBtn() {
      if (this.page === this.maxPage) {
        return;
      }
      this.page++;
    },
    leftBtn2() {
      if (this.page2 === 1) {
        return;
      }
      this.page2--;
    },
    rightBtn2() {
      if (this.page2 === this.maxPage2) {
        return;
      }
      this.page2++;
    },
    setComponentBtn() {
      let that = this;
      uni.navigateTo({
        url:
          "/pages/labour/componentSet?data=" +
          JSON.stringify(that.componentList),
        events: {
          list: function (data) {
            console.log(data);
            if (data.data) {
              that.componentList = JSON.parse(data.data);
              that.maxPage2 =
                that.componentList.length % 5 == 0
                  ? that.componentList.length / 5
                  : Math.ceil(that.componentList.length / 5);
              if (that.componentList.length <= 5) {
                that.btnShow2 = false;
              } else {
                that.btnShow2 = true;
              }
            } else {
              that.componentList = [];
            }
          },
        },
        success: (res) => {
          uni.hideLoading();
          res.eventChannel.emit("list", {
            data: JSON.stringify(that.componentList),
          });
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  display: flex;
  justify-content: center;
}
.sticky {
  top: 156rpx;
  border-bottom: 1px solid #f7f7f7;
  .setComponent {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    font-size: 28rpx;
    .setComponentBtn {
      padding: 10rpx 20rpx;
      border-radius: 6rpx;
      color: #fff;
      background-color: #169bd5;
    }
  }
  .components {
    height: 30px;
    .components-item {
      display: inline-block;
      position: relative;
      text-align: center;
      background: rgba(194, 194, 194, 0.568);
      width: 60px;
      height: 30px;
      margin-right: 7px;
      .content {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
        width: 100%;
      }
    }
    .left-btn2,
    .right-btn2 {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      width: 30rpx;
      height: 30px;
      top: 30px;
      background-color: #fff;
      border: 1px solid rgb(209, 206, 206);
      z-index: 3;
    }
    .left-btn2 {
      left: 20rpx;
    }
    .right-btn2 {
      right: 20rpx;
    }
  }
  .ownerSign {
    .ownerSign-head {
      height: 30px;
      line-height: 30px;
      font-size: 28rpx;
    }
  }
  .party {
    .party-head {
      height: 30px;
      line-height: 30px;
      font-size: 28rpx;
    }
    .left-btn,
    .right-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      width: 30rpx;
      height: 60px;
      top: 180px;
      background-color: #fff;
      border: 1px solid rgb(209, 206, 206);
      z-index: 3;
    }
    .left-btn {
      left: 20rpx;
    }
    .right-btn {
      right: 20rpx;
    }
  }
}
.pdf-div {
  position: relative;
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
.signs {
  // position: relative;
  // overflow-x: auto;
  width: 327px;
  // padding: 0 30rpx;
  height: 60px;
  // white-space: nowrap;
  .signs-item {
    display: inline-block;
    position: relative;
    text-align: center;
    background: rgba(194, 194, 194, 0.568);
    width: 60px;
    height: 60px;
    margin-right: 7px;
    // .content {
    //   position: absolute;
    //   top: 50%;
    //   transform: translateY(-50%);
    //   text-align: center;
    //   width: 100%;
    // }
  }
}
.pad {
  width: 750rpx;
  height: 240px;
}
.pab {
  width: 750rpx;
  height: 60px;
}
.footer {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 750rpx;
  height: 60px;
  z-index: 50;
  .cancel,
  .isOk {
    width: 375rpx;
    height: 60px;
    text-align: center;
    line-height: 60px;
  }
  .cancel {
    background-color: rgb(238, 238, 238);
    color: rgb(170, 170, 170);
  }
  .isOk {
    background-color: rgb(21, 118, 230);
    color: #fff;
  }
}
.navBar{
 /deep/ .u-navbar__content{
  height: 156rpx !important;
    padding-top: 88rpx;
    .u-navbar__content__left{
      padding-top: 88rpx;
    }
  }
}
</style>
