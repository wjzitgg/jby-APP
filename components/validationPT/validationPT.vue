<template>
	<view :class="[{'frame--dialog':theme}]">
		<view class="frameBg" v-show="showModal" style="z-index:10" @click.stop="showFalse"></view>
		<view class="framework" v-if="isVefCode">
			<view class="boxTopTitle">
				<text>图形验证码</text>
				<text class="cuIcon-close font16 fontB" @click="clkCloseRef"></text>
			</view>
			<view class="boxImg">
				<view class="cutImgSet" :class="isAnimation?'animation':''"
					:style="{top:CutImgY+'px', left: blockLeft + 'px'}">
					<image :src="CutImg" :style="{cursor:'pointer', width:xw,height: xh,zIndex: 10}"></image>
				</view>
				<image :src="BGImg" :style="{borderRadius:'8px', width: dw,height:dh}"></image>
				<view class="err-show" v-show="errShow" :style="{backgroundColor:'rgba(255,55,56,.8)',width:dw ,lineHeight: '22px',position: 'absolute',top:0,left:0,color:'#fff'}">请正确拼合图像</view>
				<view class="reset" @click="clkNext">
					<text class="cuIcon-refresh font16 text-white"></text>
				</view>
			</view>
			<view class="checkBox">
				<view class="checkBar">
					<view class="slide" :class="bgColSet?'active':''">
						<view :class="'moveBac '+(isAnimation?' animation':'')+(bgColSet?' moveBacError':'')"
							:style="'width:'+(isSuccess ? 300 : blockLeft)+'px;'"></view>
						<view :class="(bgColSet?'swiperTipsError':'swiperTips') + (!isSuccess?' paddingL40':'')">
							<text v-if="!isSuccess">请拖动滑块验证</text>
							<text v-if="isSuccess" class="cuIcon-check margin-right-sm fontB"></text>
							<text v-if="isSuccess">验证成功</text>
						</view>
						<view v-if="!isSuccess"
							:class="'swiperBlock '+(bgColSet?' errorBlock':' successBlock')+(isAnimation?' animation':'') "
							:style="'left:'+blockLeft+'px'" ref="sliderBtn" @touchstart="touchstartHandle"
							@mousedown="startMove" @touchmove.stop.prevent="touchmoveHandle"
							@touchend="touchendHandle">
							<!-- #ifndef MP-BAIDU -->
							<image v-if="!bgColSet" :src="ImgUrl + 'Images/doubleArrow.svg'" mode="widthFix"
								style="width: 16px;"></image>
							<text v-else class="cuIcon-close font16 text-white"></text>
							<!-- #endif -->
							<!-- #ifdef MP-BAIDU -->
							<text v-if="bgColSet" class="cuIcon-close font16 text-white"></text>
							<!-- #endif -->
						</view>
					</view>
				</view>
			</view>
 
		</view>
	</view>
</template>
<script>
	export default {
		props: {
			inputPhone: '',
			theme: {
				type: String,
			},
			swiperColor: {
				type: String,
				default: 'rgba(21, 132, 223, 0.08)'
			},
			title: {
				type: String,
				default: '人机校验'
			},
			barWidth: {
				type: Number,
				default: 300
			},
			sendType:""
		},
		data() {
			return {
				ImgUrl: this.hostwapUrl,
				BGImg: '',
				CutImg: '',
				CutImgY: '',
				MarkCode: '', //验证拼图是否成功用,
				bgColSet: false, //拼图是否验证成功
				isSuccess: false, //是否验证成功
				isVefCode: false,
				showModal: false,
				startInfo: {},
				blockLeft: 0,//随机拼图的最终X轴距离
				isAnimation: false,
				msgType: '',
				xw:"",
				xh:"",
				dw:"",
				dh:"",
				uuid:"",
				errShow:false
			}
		},
		computed: {
			trueMoveableW: function() {
				return this.barWidth - 40
			}
		},
		methods: {
			showFalse(){
			   this.isVefCode = false;
			   this.showModal = false;
			   this.$emit("cancel", 0);
			},
			//获取图片接口
			GetSlideBlockApi() {
				let that = this;
			    this.$api.imgCode().then(res => {
			    	this.BGImg = res.img;
                    this.CutImg =res.smallImage;//拼图
                    this.CutImgY =res.yHeight;
					this.xw = res.slidingHeight +"px"
					this.xh = res.slidingWidth +"px"
					this.dw = res.oriImageWidth +"px"
					this.dh = res.oriImageHeight +"px"
			    	this.uuid = res.uuid;
			    });
			},
 
			//手指按下
			touchstartHandle({
				changedTouches
			}) {
				if (this.isSuccess) {
					return
				}
				this.isAnimation = false
				this.startInfo = changedTouches[0]
			},
			// 手指移动
			touchmoveHandle({
				changedTouches
			}) {
				if (this.isSuccess) {
					return
				}
				let blockLeft = changedTouches[0].clientX - this.startInfo.clientX
				let blockLeftRpx = blockLeft;
				if (blockLeftRpx < 0) {
					this.blockLeft = 0
				} else {
					this.blockLeft = blockLeftRpx <= this.trueMoveableW ? blockLeftRpx : this.trueMoveableW
				}
			},
			// 手指离开
			touchendHandle(e) {
				if (this.isSuccess) {
					return
				}
				this.CheckSlideBlockApi();
			},
			//验证图片接口
			CheckSlideBlockApi() {
				let that = this;
				uni.showLoading({
				mask: true
			});
			let params = {
				code: this.blockLeft,
				phoneNumber: this.inputPhone,
				uuid: this.uuid,
				sendType: this.sendType
			};
			this.$api.mobileMsg(params).then(res => {
				uni.hideLoading();
				console.log(res);
				if (res.code === 200) {
					uni.showToast({ title: "发送成功", icon: "success" });
					that.isVefCode = false;
					that.showModal = false;
					this.$emit("ref", res.data);
					// this.$emit("sendCode",data);
				
				} else {
					that.GetSlideBlockApi();
					this.errShow = true
            		 setTimeout(() => {
            		  this.errShow = false
            		}, 3000)
					// uni.showToast({ title: res.msg, icon: "none" });
				}
			});
			},
			/* 鼠标按住滑块后初始化移动监听，记录初始位置 */
			startMove(e) {
				e.preventDefault() //禁止图片img拖动的解决方法
				e = e || window.event;
				this.moveStart = e.pageX || e.targetTouches[0].pageX;
				this.addMouseMoveListener();
			},
			/* 鼠标滑块移动 */
			moving(e) {
				// e.preventDefault() //禁止图片img拖动的解决方法
				let self = this;
				e = e || window.event;
				let moveX = (e.pageX || e.targetTouches[0].pageX);
 
				let d = moveX - self.moveStart;
 
				let w = self.dataWidth;
				let PL_Size = this.puzzleSize;
				let padding = this.padding;
 
				if (self.moveStart === "") {
					return "";
				}
				if (d < 0 || d > w - padding - PL_Size) {
					return "";
				}
				
				if (d <= 260) {
					self.blockLeft = d
				}
			},
			/* 鼠标移动结束，验证并回调 */
			moveEnd(e) {
				let self = this;
 
				e = e || window.event;
				let moveEnd_X = (e.pageX || e.changedTouches[0].pageX) - self.moveStart;
 
				if (moveEnd_X > 0) {
					self.CheckSlideBlockApi(); //验证拼图是否成功
				}
				self.moveStart = "";
 
				document.removeEventListener("mousemove", self.moving);
				document.removeEventListener("mouseup", self.moveEnd);
			},
			/* 鼠标全局绑定滑块移动与滑动结束，移动过程中鼠标可在页面任何位置 */
			addMouseMoveListener() {
				let self = this;
				document.addEventListener("mousemove", self.moving);
				document.addEventListener("mouseup", self.moveEnd);
			},
			//换一张
			clkNext() {
				this.GetSlideBlockApi();
			},
 
			// 重置滑块位置
			initial() {
				this.blockLeft = 0;
				this.bgColSet = false;
				this.isSuccess = false;
			},
			clkCloseRef() {
				this.showModal = false;
				this.isVefCode = false;
			},
			clkOpenRef(msg) {
				this.showModal = true;
				this.isVefCode = true;
			},
		}
	}
</script>
<style lang="scss" type="text/css" rel="stylesheet" scoped="scoped">
	.framework {
		box-sizing: border-box;
		width: 352px;
		height: 270px;
		background: #fff;
		margin: 24px auto;
		z-index: 11;
		position: relative;
		padding: 0 16px;
		user-select: none;
		border-radius: 16px;
	}
 
	.framework .boxTopTitle {
		height: 48px;
		line-height: 48px;
		display: flex;
		justify-content: space-between;
	}
 
	.framework .boxImg {
		width: 300px;
		height: 150px;
		background: #fff;
		margin-bottom: 16px;
		border-radius: 8px;
		position: relative;
	}
 
	.reset {
		position: absolute;
		top: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.24);
		border-radius: 0 8px 0 8px;
		padding: 0 12px;
		line-height: 32px;
	}
 
	.cutImgSet {
		position: absolute;
	}
 
	.frame--dialog {
		.framework {
			// margin: 38vh auto;
			z-index: 88888888;
			position: fixed;
			// top: 25vh;
			transform: translateX(-50%);
			left: 50%;
		}
 
		.frameBg {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.24);
			z-index: 8887 !important;
		}
	}
 
	.checkBox .checkBar {
		width: 100%;
		padding: 0px;
	}
 
	.slide {
		box-sizing: border-box;
		width: 100%;
		height: 40px;
		line-height: 40px;
		border-radius: 8px;
		background-color: #FFFFFF;
		position: relative;
		font-size: 13px;
		overflow: hidden;
		border: 1px solid rgba(65, 157, 231, 0.56);
	}
 
	.slide.active {
		border: 1px solid #FA7F7F;
	}
 
	.moveBac {
		background-color: rgba(21, 132, 223, 0.08);
		width: 100%;
		height: 100%;
	}
 
	.moveBacError {
		background-color: rgba(216, 63, 63, 0.08) !important;
	}
 
	.swiperTips {
		box-sizing: border-box;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		color: rgba(255, 255, 255, 0.24);
		text-align: center;
		background: -webkit-gradient(linear, left top, right top, color-stop(0, #0076D6), color-stop(.4, #0076D6), color-stop(.5, #fff), color-stop(.6, #0076D6), color-stop(1, #0076D6));
		animation: tipsBlinkan 3s infinite;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		line-height: 40px;
	}
 
	.swiperTipsError {
		box-sizing: border-box;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		text-align: center;
		color: rgba(255, 255, 255, 0.24);
		background: -webkit-gradient(linear, left top, right top, color-stop(0, #FA7F7F), color-stop(.4, #FA7F7F), color-stop(.5, #fff), color-stop(.6, #FA7F7F), color-stop(1, #FA7F7F));
		animation: tipsBlinkan 3s infinite;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		line-height: 40px;
	}
 
	.swiperBlock {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		/* #ifdef MP-BAIDU */
		background-repeat: no-repeat;
		background-size: 16px;
		background-position: center;
		/* #endif */
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0px;
		top: -1px;
	}
 
	.successBlock {
		background-color: #0076D6;
		/* #ifdef MP-BAIDU */
		background-image: url('https://m.by56.com/Images/doubleArrow.svg');
		/* #endif */
	}
 
	.errorBlock {
		background-color: #FA7F7F !important;
	}
 
	.paddingL40 {
		padding-left: 40px;
	}
 
	.animation {
		transition: all 0.5s;
	}
 
	@keyframes tipsBlinkan {
		0% {
			background-position: -100px 0;
		}
 
		100% {
			background-position: 100px 0;
		}
	}
// 	.err-show {
//   /* 添加样式来定义显示时的动画效果 */
//   animation-duration: 1s;
//   animation-name: slideIn;
// }

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>