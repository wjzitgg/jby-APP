<template>
<view class="wrapper">
  <u-navbar leftText="培训详情" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
  <view class="content">
  <view class="bg"></view>
    <view class="signType"  v-if="form.signStatus===0" :class="{sign:obj.status===2,noSign:obj.status===1}">{{obj.status===1?'未签到':obj.status===2?'未参会':''}}</view>
    <view>会议主题：{{form.title}}</view>
    <view>施工项目：{{form.projectBidName}}</view>
    <view>培训单位：{{form.speakerCompany}}</view>
    <view>主讲人：{{form.speaker}}</view>
    <view>培训时间：{{form.trainingTime +'  '+ form.trainingStartTime + '~'+form.trainingEndTime}}</view>
    <view>培训对象：{{form.teamName}}</view>
    <view>是否需要签到：{{form.signStatus===0?'是':'否'}}</view>
    <view class="files">
      <view class="label">附件：</view>
      <view class="fileList">
        <view class="file-item" v-for="(item,index) in fileList" :key="index" @click="preview(item.path)">{{item.name}}</view>
      </view>
    </view>
    <view>会议简介：</view>
    <u-parse :content="form.trainingContent"></u-parse>
  </view>
    <view class="pdb" v-if="form.signBtnStatus"></view>
    <view class="btn" :class="{btngrey:form.signBtnStatus==2}" @click="signIn" v-if="form.signBtnStatus">签到</view>
    <u-popup :show="popShow" mode="center" @close="closePop">
      <view class="codePop">
        <w-qrcode :options="options"></w-qrcode>
      </view>
    </u-popup>
    <u-action-sheet :actions="actionList" cancelText="取消" title="操作" :show="actionShow" round="10" @select="selectClick" @close="close"></u-action-sheet>
    <prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop>
</view>
</template>

<script>
import request from "../../common/request";
import permision from '@/common/permission.js';
import prviewPop from '../../components/prview-pop/prview-pop.vue';
export default {
  components:{prviewPop},
  computed:{
    userInfo() {
			return this.$store.state.userInfo;
		},
  },
  onLoad(options) {
    if(options.todo){
      this.obj = JSON.parse(options.obj);
      this.obj.status = options.todo - 0
      this.searchTrainById(this.obj.fkBusinessId)
    }else{
      this.obj = JSON.parse(options.obj);
      this.searchTrainById(this.obj.pkId)
    }
  },
  data() {
    return {
      obj: {},
      form:{},
      options: {
        code: "",
        size: 460,
      },
      popShow: false,
      actionList: [
				{
					name: "显示二维码",
					val: "0"
				},
				{
					name: "识别二维码",
					val: "1",
				}
			],
      actionShow:false,
      fileList:[],
      previewShow:false,
      previewUrl:""
    };
  },
  methods:{
    preview(url) {
      this.$checkName(url)
      return
			this.previewUrl = url;
			this.previewShow = true;
		},
    closePre(){
      this.previewShow = false;
    },
    searchTrainById(pkId){
      this.$api.searchTrainById({pkId,pageNum:1,pageSize:10000}).then((res) => {
        if(res.code===200){
          this.form = res.data
          this.fileList=res.data.enclosureUrl?JSON.parse(res.data.enclosureUrl):[]
        }
      })
    },
    signIn(){
      if(this.form.signBtnStatus==2){
        return
      }
      this.actionShow=true
    },
    closePop() {
      this.popShow = false;
    },
    // 操作
		selectClick(index) {
			console.log(index);
			if (index.val == 0) {
        this.options.code=request.baseUrl + `/app/labourTrain/addTrainUserSign?fkTrainId=${this.form.pkId}&fkUserId=${this.userInfo.userId}`
				this.popShow=true
			} else {
				this.scanCode()
			}
      this.close()
		},
		close() {
			this.actionShow = false;
		},
    scanCode() {
      let that = this;
     let scanCodes= ()=>{
      uni.scanCode({
        scanType: ["qrCode"],
        success: (res) => {
          console.log(res.result);
          if (res.result.indexOf("/app/labourTrain/addTrainUserSign") !== -1) {
            uni.showLoading({ mask: "" });
            // 签到
            uni
              .request({
                url: res.result,
                method: "post",
                header: {
                  "Content-Type": "application/json;charset=utf-8",
                  Authorization: uni.getStorageSync("token"),
                },
              })
              .then((data) => {
                let [err, res] = data;
                if (res) {
                  console.log(res);
                  if (res.statusCode === 500) {
                    uni.hideLoading();
                    uni.showToast({
                      icon: "error",
                      title: "系统内部错误",
                      duration: 2000,
                    });
                  }
                  if (res.data.code !== 200) {
                    uni.hideLoading();
                    uni.showToast({
                      title: res.data.msg ? res.data.msg : "系统内部错误",
                      icon: "none",
                      duration: 2000,
                    });
                    // uni.switchTab({ url: "/pages/index/index" });
                  } else {
                    uni.hideLoading();
                    uni.showToast({ title: "签到成功", icon: "success" });
                    uni.navigateBack({ delta: 1 })
                  }
                }
                if (err) {
                  uni.hideLoading();
                  uni.showToast({
                    icon: "error",
                    title: "网络错误",
                    duration: 2000,
                  });
                  reject(err);
                }
              })
              .catch((error) => {
                uni.hideLoading();
                reject(error);
              });
          } else {
            uni.showToast({ icon: "error", title: "错误的二维码" });
          }
        },
        fail: (err) => {
          uni.showToast({
            icon: "error",
            title: "扫码失败",
            duration: 2000,
          });
        },
      });
     }
      // #ifdef APP-PLUS
			uni.getSystemInfo({
			success: res => {
				if (res.osName === 'ios') {
          scanCodes()
					// let result = permision.judgeIosPermission('camera');
					// if(result){
					// 	scanCodes()
					// }else{
          //   uni.showModal({
					// 		title: '提示',
					// 		content: '需要相机权限才能进行下一步操作，是否打开？',
					// 		showCancel: true,
					// 		success: ({ confirm, cancel }) => {
					// 			if (confirm) {
					// 			console.log('用户点击确定');
					// 			permision.gotoAppPermissionSetting('camera')
					// 			} else if (cancel) {
					// 				console.log('用户点击取消');
					// 			}
					// 		}
					// 	})
					// }
				} else {
					permision.requestAndroidPermission('android.permission.CAMERA').then(result=>{
            if(result===1){
						scanCodes()
					}else{
						uni.showModal({
							title: '提示',
							content: '需要相机权限才能进行下一步操作，是否打开？',
							showCancel: true,
							success: ({ confirm, cancel }) => {
								if (confirm) {
								console.log('用户点击确定');
								permision.gotoAppPermissionSetting('camera')
								} else if (cancel) {
									console.log('用户点击取消');
								}
							}
						})
					}
          });
				}
			}
		});
			// #endif
    },
  }
};
</script>

<style lang="scss" scoped>
.content{
  position: relative;
  z-index: 1;
  padding: 20rpx;
  .bg{
  position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: -1;
	background-color: #fff;
}
}

.signType{
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  padding: 10rpx 20rpx;
  color: #fff;
  font-size: 28rpx;
  z-index: 5;
}
.sign{
  background-color: #ea707f;
}
.noSign{
  background-color: #aaaaaa;
}
view {
  margin-bottom: 20rpx;
}
.pdb{
  height: 110rpx;
}
.codePop{
  padding: 20rpx;
  margin-bottom:0
}
.files{
  display: flex;
  .label{
    width: 100rpx;
  }
  .fileList{
    width: 600rpx;
    .file-item{
      width: 600rpx;
      color: #1576e6;
      // overflow: hidden; /*超出部分隐藏*/
      // white-space: nowrap; /*禁⽌换⾏*/
      // text-overflow: ellipsis; /*省略号*/
    }
  }
}
.btngrey{
  filter:grayscale(100%)
}
</style>
