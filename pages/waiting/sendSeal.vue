<template>
  <view class="wrapper">
    <u-navbar
        leftText="发起签章"
        bgColor="rgb(0 0 0 / 0%)"
        leftIconColor="#fff"
        :autoBack="true"
      ></u-navbar>
      <view class="sticky">
          <u-cell-group>
			      <u-cell title="本单位持章人" isLink @click="openPicker">
              <text slot="value" :class="{red:!signName}" >{{signName?signName:'未选择'}}</text>
            </u-cell>
			      <u-cell title="盖章位置" isLink @click="signPos">
              <text slot="value" :class="{red:!signList.length}" @click="signPos">{{signList.length?'已确认':'未确认'}}</text>
            </u-cell>
          </u-cell-group>
        </view>
      <view class="pad"></view>
      <view class="content" :change:totalNum="pdf.getData" :totalNum="totalNum" :style="{height:totalNum*505.2+'px'}">
        <view class="head">预览文档</view>
         <view class="pdf-div">
          <view id="pdf" style="width: 357px; height: 505.2px;"></view>
          <signBox
           v-for="(item, index) in signList"
           :key="index"
           :content="item.name"
           :page="totalNum"
           :left='item.x'
           :top='item.y'
           :preview='true'
        ></signBox>
         </view>
      </view>
      <view class="pdb"></view>
      <view class="btn">发起签章</view>
      <u-picker title="请选择审批人" :show="pickerShow" :columns="[signPeoele]" keyName="label" @confirm="pickerConfirm" @cancel="pickerCancel"></u-picker>
  </view>
</template>

<script lang="renderjs" module="pdf">
import Pdfh5 from "pdfh5";
export default {
  mounted(){
    setTimeout(() => {
      this.getDocumentUrl();
    }, 500);
  },
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
    getDocumentUrl() {
      console.log('1231213');
      this.pdfh5 = new Pdfh5("#pdf", {
        pdfurl: 'https://epms-1307524156.cos.ap-guangzhou.myqcloud.com/20221122093632637c27a0848e2ace773373f7.pdf',
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
          ownerVm.callMethod('getTotalNum', this.totalNum)
          this.ownerVm=ownerVm
    },
    emitData(e, ownerVm) {
      ownerVm.callMethod('getTotalNum', this.totalNum)
    }
  },
};
</script>

<script>
import signBox from "../../components/signBox/signBox.vue";
export default {
   component: { signBox },
   data(){
    return{
      totalNum:1,
      signName:'',
      signId:'',
      signList:[],
      signPeoele:[],
      pickerShow:false
    }
   },
   methods:{
    openPicker(){
      this.pickerShow = true;
    },
    pickerConfirm(e) {
      console.log(e);
			if (e.value.length&&e.value[0]) {
				this.signId = e.value[0].value;
				this.signName = e.value[0].label;
			}
			this.pickerCancel();
		},
		pickerCancel() {
			this.pickerShow = false;
		},
    signPos(){
      let that=this
      let data=JSON.stringify(this.signList)
      uni.navigateTo({ 
        url: '/pages/waiting/sealSet?data='+data,
        events: {
          list:function(data) {
            console.log(data);
            if(data.data){
              that.signList=JSON.parse(data.data)
            }else{
              that.signList=[]
            }
          }
        },
        success: (res) => {
					uni.hideLoading();
					res.eventChannel.emit("list", { data: JSON.stringify(that.signList) });
				},
        fail:(err)=>{
          console.log(err);
        }
      })
    }
   }
}
</script>

<style lang="scss" scoped>
.pad{
  height: 90px;
}
.content{
  background-color: #fff;
}
/deep/.pdfViewer {
  background-color: #fff;
}
.head{
  height: 60rpx;
  line-height: 60rpx;
  padding-left: 30rpx;
  background-color: #fff;
  font-size: 28rpx;
}
.pdf-div{
  display: flex;
  justify-content: center;
  position: relative;
}
.pdb{
  width: 750rpx;
  height: 100rpx;
}
.red{
  color: red;
}
.green {
  color: rgba(67, 207, 124, 1);
}
</style>