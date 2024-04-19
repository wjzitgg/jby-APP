<template>
  <view class="wrapper setSignTop">
    <u-navbar
      leftText="盖章"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
      class="navBar"
    ></u-navbar>
    <view class="pad"></view>
    <view class="content" :style="{height:(totalNum*505.2)+'px'}">
      <view class="sticky">
        <!-- <view class="left-btn" @click="leftBtn" v-if="btnShow">
        <u-icon name="arrow-left" size="16"></u-icon>
        </view>
        <view class="right-btn" @click="rightBtn" v-if="btnShow">
           <u-icon name="arrow-right" size="16"></u-icon>
        </view> -->
        <view class="sticky-header" :style="{padding:`0 ${padWid/2}px`}">
          <div class="left">请把以下签章拖动至文档区域</div>
          <div class="right" @click="reset">重置</div>
        </view>
          <view class="signs" >
          <signBoxs
            class="signs-item"
            v-for="(item, index) in showSigns"
            :key="index"
            :content="item.userName"
            :page="totalNum"
            :left='item.x'
            :top='item.y'
            @getPosition="getPosition($event,item,1,index)"
            @close="closeSignBox(item,index,1)"
            :index="index"
            :type='2'
            :padWid='padWid'
          >
          </signBoxs>
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
        <view id="pdf" style="width: 357px; height: 505.2px;"></view>
        <signBoxs
          v-for="(item, index) in signBoxList"
          :key="index"
          :content="item.userName"
          :page="totalNum"
          :left='item.x'
          :top='item.y'
          @getPosition="getPosition($event,item,2,index)"
          @close="closeSignBox(item,index,2)"
          :index="index"
        ></signBoxs>
      </view>
    </view>
    <view class="pab"></view>
    <view class="footer">
      <view class="cancel" @click="cancel">取消</view>
      <view class="isOk" @click="isOk">确认</view>
    </view>
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
        that.ownerVm.callMethod('hideLoading')
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
import signBoxs from "../../components/signBox/signBoxtwo.vue";
import uniWeb from '../../static/uni-webview';
export default {
  components: { signBoxs },
  data() {
    return {
      signList: [{ userName: "甲方",isNail:1,fkUserId:"" }, { userName: "乙方",isNail:0,fkUserId:0 }],
      signBoxList: [],
      totalNum: 1,
      scrollLeft:0,
      scrollTop:0,
      timer:null,
      screenWidth:0,
      padWid:0,
      maxPage:1,
      page:1,
      btnShow:false,
      sendList:[],
      pdfUrl:"",
      isAPP:0
    };
  },
  computed:{
    showSigns(){
      let arr=this.signList.slice(5*(this.page-1),5*this.page).map((item,index)=>({...item,x:index*60+index*150+this.padWid/2+40,y:20}))
      return arr
    }
  },
  onLoad(options) {
    console.log(options.data);
    this.signBoxList=JSON.parse(options.data)
    this.pdfUrl=options.pdfUrl
    this.signList[0].fkUserId=options.nailId
   this.maxPage=this.signList.length%5==0?this.signList.length/5:Math.ceil(this.signList.length/5)
   if(this.signList.length<=5){
    this.btnShow=false
   }else{
    this.btnShow=true
   }
   uni.getSystemInfo({ //获取系统参数
			success: (res) => {
				this.screenWidth = res.windowWidth;
        this.padWid=res.windowWidth-357
			}
		});
    this.isAPP=options.isApp - 0
    uni.showLoading({ mask: true })
  },
  onBackPress() {
    if(this.isAPP){
        this.cancel()
        return true
      }
    return false
  },
  onPageScroll(data){
    clearTimeout(this.timer)
    this.timer=setTimeout(()=>{
      console.log(data);
      this.scrollTop=data.scrollTop
    },200)
  },
  methods: {
    hideLoading(){
      uni.hideLoading()
    },
    cancel(){
      console.log('取消');
      if(this.isAPP){
        uniWeb.webView.postMessage({
            data: {
              ok:false
            },
          });
      }else{
        uni.navigateBack({delta: 1})
      }
    },
    isOk(){
      console.log('确认');
      if(this.isAPP){
        uniWeb.webView.postMessage({
            data: {
              action: this.signBoxList,
              ok:true
            },
          });
      }else{
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit('list', {data: JSON.stringify(this.signBoxList)});
        uni.navigateBack({delta: 1})
      }
    },
    getPosition(e,row,type,index) {
      row.x=e.x
      row.y=e.y
      if(type===1){
        if(row.y>80){
          if(this.scrollTop+row.y-80>this.totalNum*505.2 -60){
          row.y=20
          row.x=index*60+index*150+this.padWid/2+40
          return
          }
          console.log(row.x);
          this.signBoxList.push({...row,y:this.scrollTop+row.y-80,x:row.x-this.padWid/2})
          row.y=20
          row.x=index*60+index*150+this.padWid/2+40
          console.log(row.x);
        }
      }
    },
    closeSignBox(row,idx,type) {
      if(type===1){
        this.$set(this.signList[idx],{x:idx*60+idx*150+this.padWid/2+40,y:20})
      }else if(type===2){
        this.signBoxList.splice(idx, 1)
      }
    },
    getTotalNum(e) {
      this.totalNum = e;
    },
    leftBtn(){
      if(this.page===1){
        return
      }
      this.page--
    },
    rightBtn(){
      if(this.page===this.maxPage){
        return
      }
      this.page++
    },
    reset(){
      this.signBoxList=[]
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  display: flex;
  justify-content: center;
}
.sticky{
  top: 156rpx;
  .sticky-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 750rpx;
    height: 20px;
    .left{
      font-size: 24rpx;
      color: rgba(32, 52, 87, 1);
    }
    .right{
      font-size: 28rpx;
      color: rgba(32, 52, 87, 1);
    }
  }
    .left-btn,.right-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 30rpx;
    height: 60px;
    top: 20px;
    background-color: #fff;
    border: 1px solid rgb(209, 206, 206);
    z-index: 3;
  }
  .left-btn{
    left: 20rpx;
  }
  .right-btn{
    right: 20rpx;
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
    .content {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      text-align: center;
      width: 100%;
    }
  }
}
.pad{
  width: 750rpx;
  height: 80px;
}
.pab{
  width: 750rpx;
  height: 60px;
}
.footer{
  display: flex;
  position: fixed;
  bottom: 0;
  width: 750rpx;
  height: 60px;
  z-index: 50;
  .cancel,.isOk{
    width: 375rpx;
    height: 60px;
    text-align: center;
    line-height: 60px;
  }
  .cancel{
    background-color: rgb(238, 238, 238);
    color: rgb(170, 170, 170);
  }
  .isOk{
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
