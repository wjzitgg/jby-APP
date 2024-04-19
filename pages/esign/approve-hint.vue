<template>
  <view class="wrapper">
    <u-navbar :leftText="title" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <div class="contents">
        <view class="images">
        <image
        class="image"
            :src="type==1?imgList[1]:imgList[0]"
            mode="widthFix"
        />
    </view>
    <view class="status">{{type==1?'账号不一致':type==2?'签名成功':'核验身份成功'}}</view>
    <u-button class="btns" type="primary" text="返回首页" @click="goHome"></u-button>
    </div>
  </view>
</template>

<script>
export default {
    onLoad(options) {
        console.log(options);
        this.type=options.type
        if(options.type==1){
            this.title='核验身份'
        }else if(options.type==2){
            this.title='签名完成'
        }else if(options.type==3){
            this.title='核验身份'
        }
    },
    data(){
        return{
            title:"",
            type:"",
            imgList:[
                '../../static/image/success.png',
                '../../static/image/u12552.png'
            ]
        }
    },
    methods:{
        goHome(){
           uni.switchTab({ url: "/pages/index/index", });
        }
    }
}
</script>

<style lang="scss" scoped>
.image{
    width: 200rpx;
}
.contents{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 60rpx;
}
.status{
    margin-top: 20rpx;
    margin-bottom: 40rpx;
}
.btns{
    width: 164rpx;
}

</style>