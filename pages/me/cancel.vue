<template>
  <view class="wrapper">
    <u-navbar
      leftText="注销账号"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
        <view class="header">
            <image src="/static/image/u8.png" mode="widthFix" class="u8"/>
            <view>申请注销系统账号</view>
        </view>
        <view class="matters">
            <view class="mb-30">你提交的注销申请生效前，建必优团队将进行以下验证，以保证你的账号、财产安全: </view>
            <view class="matters-item mb-30">
                <view class="left">1、</view>
                <view class="right">
                    <view>账号处于安全状态</view>
                    <view class="grey">账号没有被盗，被禁用等风险。</view>
                </view>
            </view>
            <view class="matters-item mb-30">
                <view class="left">2、</view>
                <view class="right">
                    <view>账号财产结清</view>
                    <view class="grey">个人账号没有资金问题待结算。</view>
                </view>
            </view>
            <view class="matters-item mb-30">
                <view class="left">3、</view>
                <view class="right">
                    <view>个人待办处理完</view>
                    <view class="grey">个人待办事项全部处理完成，待办列表中无待办事项。</view>
                </view>
            </view>
            <view class="matters-item">
                <view class="left">4、</view>
                <view class="right">
                    <view>与第三方业务处理完成</view>
                    <view class="grey">个人与第三方的业务全部处理完成，不存在未完成的业务。</view>
                </view>
            </view>
        </view>
        <view class="selAcc">
            <h4 class="mb-30">申请注销以下账号：</h4>
            <view class="chebox">
            <u-checkbox-group v-model="checked" placement="column" @change="change">
        	    <u-checkbox :label="item.loginName + (item.isMaster == 1?'(管理员)':'')" :name="item.userId" v-for="item in accountList" :key="item.userId"></u-checkbox>
            </u-checkbox-group>
            </view>
        </view>
        <view class="import-hint" @click="go">
            <view>轻按下方的“申请注销”按钮，即表示你已阅读并同意</view>
            <view class="hint">《重要提醒》</view>
        </view>
        <view class="tac">
        <view class="btns" @click="btnOk"> 申请注销 </view>
        </view>
    </view>
  </view>
</template>

<script>
import permision from '@/common/permission.js';
export default {
    computed: {
		userInfo() {
			return this.$store.state.userInfo;
		}
	},
    data(){
        return{
            checked:[],
            accountList:[],
            userFaceDistinguishId:"",
            timer:null
        }
    },
    onLoad(options) {
        this.findUnsubscribeUserByTelephone()
    },
    methods:{
        change(e){
            console.log(e);
        },
        go(){
            uni.navigateTo({ url: '/pages/me/import-hint' })
        },
        btnOk(){
            if(!this.checked.length){
                return uni.showToast({title:"未选择账号",icon:"none"})
            }
            let arr=this.accountList.filter(item=>this.checked.includes(item.userId)&&item.isMaster == 1)
            if(arr.length){
                uni.showModal({
						title: '提示',
						content: '注销管理员账号会连同企业账号禁用，是否确认继续注销？',
						showCancel: true,
						success: ({ confirm, cancel }) => {
							if (confirm) {
								this.unsubscribe()
							}
						}
					});
            }else{
                this.unsubscribe()
            }
        },
        unsubscribe(){
            let data={
                userIds:this.checked,
                callbackUrl:'https://erp.jianwangkeji.cn/back.html?contextId=6'
            }
            console.log(data);
            uni.showLoading({ mask: true });
            this.$api.unsubscribe(data).then(res=>{
                console.log('注销接口',res);
                uni.hideLoading()
                if(res.code===200){
                    let that = this;
                    this.userFaceDistinguishId=res.data.userFaceDistinguishId
						uni.navigateTo({
							url: '/pages/esign/esign?url=' + encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl)),
							events: {
								// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
								isOk: function(res) {
									console.log(res,uni.showLoading);
                                    if(res.data){
                                        that.$nextTick(()=>{
                                            uni.showLoading({ mask: true });
                                            that.timer=setInterval(()=>{
                                                that.judgeBusinessSuccess()
                                            },3000)
                                        })
                                    }
								}
							},
							success: (res) => {
								// uni.hideLoading();
								res.eventChannel.emit('isOk', { data: false });
							}
						});
                    
                }else{
                    uni.showToast({title:res.msg,icon:"none"})
                }
            }).catch(err=>{
                console.log(err);
                uni.hideLoading()
            })
        },
        judgeBusinessSuccess(){
            uni.showLoading({ mask: true });
            this.$api.judgeBusinessSuccess({pkId:this.userFaceDistinguishId,distinguishType:0}).then(res=>{
                if(res.code===200){
                    console.log(res.data);
                    // 认证状态 1：认证中，2：认证成功，3：认证失败
                    if(res.data.status==2){
                        uni.hideLoading();
                        clearInterval(this.timer)
                        uni.showToast({title:"注销成功"})
                        if(this.checked.includes(this.userInfo.userId)){
                            uni.reLaunch({ url: "/pages/login/login" });
                        }else{
                            this.findUnsubscribeUserByTelephone()
                        }
                        this.checked=[]
                    }else if(res.data.status==3){
                        uni.hideLoading();
                        clearInterval(this.timer)
                        uni.showToast({title:res.data.errorInfo,icon:"none"})
                    }
                }else{
                    uni.showToast({title:res.msg,icon:"none"})
                    clearInterval(this.timer)
                }
            }).catch(err=>{
                clearInterval(this.timer)
            })
        },
        findUnsubscribeUserByTelephone() {
			uni.showLoading({
				mask: true
			});
			this.$api
				.findUnsubscribeUserByTelephone({
					telephone: this.userInfo.phoneNum
				})
				.then(res => {
					uni.hideLoading();
					if (res.code === 200) {
                        console.log(res.data);
						this.accountList = res.data;
					}
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
        faceAuthorize() {
            let scanCode=()=>{
                this.$api
				.faceAuthorize({
					authType: 1,
					callbackUrl: 'https://erp.jianwangkeji.cn/back.html?contextId=6',
					mobile: this.userInfo.phoneNum
				})
				.then(res => {
					if (res.code === 200) {
                        this.userFaceDistinguishId=res.data.userFaceDistinguishId
						let that = this;
						uni.navigateTo({
							url: '/pages/esign/esign?url=' + encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl)),
							events: {
								// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
								isOk: function(data) {
									console.log(data);
									if (data.data) {
										// 调用接口 that
                                            that.unsubscribe()
									}
								}
							},
							success: (res) => {
								uni.hideLoading();
								res.eventChannel.emit('isOk', { data: false });
							}
						});
					} else {
                        // uni.hideLoading();
						uni.showToast({ icon: 'none', title: res.msg });
					}
				});
            }
            // #ifdef APP-PLUS
			uni.getSystemInfo({
			success: res => {
				console.log(res);
				if (res.osName === 'ios') {
                    uni.showLoading({ mask: true });
					scanCode()
				} else {
					permision.requestAndroidPermission('android.permission.CAMERA').then(result=>{
            		if(result==1){
                        uni.showLoading({ mask: true });
						scanCode()
					}else{
						// uni.showToast({title:"没有相机权限",icon:"error"})
						// permision.gotoAppPermissionSetting('android.permission.CAMERA')
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
}
</script>

<style lang="scss" scoped>
.header{
    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    height: 220rpx;
    .u8{
        width: 140rpx;
        margin-bottom: 10rpx;
    }
}
.matters{
    padding: 20rpx;
    background-color: #fff;
    .matters-item{
        display: flex;
        .right{
            .grey{
                margin-top: 8rpx;
                color: #8c8c8c;
                font-size: 28rpx;
            }
        }
    }
}
.mb-30{
    margin-bottom: 30rpx;
}
.selAcc{
    padding: 20rpx;
    border: 1px dashed #000;
    background-color: #fff;
    .chebox{
        overflow: auto;
        height: 180rpx;
        .u-checkbox{
            margin-bottom: 8rpx;
        }
    }
}
.import-hint{
    margin-top: 20rpx;
    margin-bottom: 20rpx;
    font-size: 26rpx;
    text-align: center;
    .hint{
        margin-top: 10rpx;
        color: #02a7f0;
    }
}
.tac{
    display: flex;
    justify-content: center;
}
.btns{
    width: 200rpx;
    margin-bottom: 40rpx;
    padding: 20rpx 10rpx;
    text-align: center;
    background-color: #70b603;
    color: #fff;
}
.violet {
	font-size: 24rpx;
	color: rgb(90, 11, 163);
}
</style>