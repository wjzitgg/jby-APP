<template>
  <view class="wrapper">
    <u-navbar
      leftText="文件盖章"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="bg"></view>
    <view class="sticky">
      <!-- <u-tabs :list="tabList" :current="current" @change="currentChange" :scrollable="false" :activeStyle="{ color: 'rgba(32, 52, 87, 1)' }" :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }" ></u-tabs> -->
      <view class="search">
          <filteInput placeholder="请输入流程名称" v-model="title" maxlength="50" @search="search" ></filteInput>
      </view>
    </view>
    <view class="pad"></view>
    <scroll-view @scrolltolower="scrolltolower" :scroll-y="true" v-if="showList.length" class="listH">
      <view @click="itemClick(item)" v-for="item in showList" :key="item.businessId">
        <view class="item">
          <view class="title mb-20">
            <view>{{ item.businessName }}</view>
            <view class="red rate">{{item.statusStr}}</view>
          </view>
          <view class="date">发起时间：{{ item.startTime }}</view>
        </view>
      </view>
    </scroll-view>
    <view class="noData" v-if="!showList.length">
      <u-empty style="height: 100%" mode="data" text="暂无待办事项" icon="/static/image/noData.png" > </u-empty>
    </view>
  </view>
</template>

<script>
import filteInput from '../../components/search-tag/filter-input.vue';
export default {
    components:{filteInput},
    data(){
        return{
            pageNum:1,
            total:0,
            title:"",
            tabList:[{name:"全部"},{name:"未处理"},{name:"已处理"}],
            current:0,
            showList:[]
        }
    },
    onLoad(options) {
        this.searchSignPage()
    },
    methods:{
        resh(){
            this.pageNum = 1
            this.searchSignPage()
        },
        search(){
            this.resh()
        },
        searchSignPage(){
            let data ={
                pageNum:this.pageNum,
                pageSize:20,
                businessName:this.title
            }
            this.$api.searchSignPage(data).then(res=>{
                if(res.code===200){
                    if(this.pageNum==1){
                        this.showList = res.data.records
                    }else{
                        this.showList = [...this.showList,res.data.records]
                    }
                    this.total = res.data.total - 0;
                }
            })
        },
        currentChange(item){
            this.current = item.index
        },
        scrolltolower(){
            if (this.pageNum * 20 > this.total) {
              return;
            }
            this.pageNum++
            this.searchSignPage()
        },
        itemClick(item){
            // 业务类型 0:施工验收 1:结算 2:盘点 3:设计变更
            uni.navigateTo({ url: '/pages/signSend/sealApporval?pkId=' + item.sealPkId })
        //     if(item.businessType==0){
        //     let data={...item,fkBusinessId:item.businessId,approveStatus:5}
        //     uni.navigateTo({ url: "/pages/waiting/deliveryReceivingDetail?row=" + JSON.stringify(data), });
        //   }else if(item.businessType==1){
        //     uni.navigateTo({
        //       url: `/pages/measure/settingDetail?type=1&sendType=2&pkId=` + item.businessId,
        //     });
        //     }else if(item.businessType==3){
        //       uni.navigateTo({
        //       url: `/pages/measure/settingDetail?type=2&sendType=2&pkId=` + item.businessId,
        //     });
        //   }else if(item.businessType==3){
        //     uni.navigateTo({
        //       url: `/pages/change/changeDesignDetail?type=2&pkId=` + item.businessId,
        //     });
        //   }else if(item.businessType==2){
        //     uni.navigateTo({
        //       url: `/pages/material/inventory/checkDetail?type=2&pkId=` + item.businessId,
        //     });
        //   }
        }
    }
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
.search {
  display: flex;
  align-items: center;
  width: 100%;
  height: 80rpx;
  padding: 0 32rpx;
  background-color: #fff;
  .left {
    display: flex;
    width: 530rpx;
    height: 60rpx;
    border: 1px solid rgba(180, 208, 240, 1);
    border-radius: 10rpx;
    .search-input {
      display: flex;
      align-items: center;
      flex: 1;
      height: 60rpx;
      padding-left: 6rpx;
    }
    .searchBtn {
      width: 120rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 26rpx;
      text-align: center;
      color: #2a82e4;
    }
    .cleans{
      color: #aaaaaa;
    }
    .separator {
      line-height: 54rpx;
      color: rgba(180, 208, 240, 1);
    }
  }
  .right {
    
    margin-left: 20rpx;
    .screen {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 140rpx;
      height: 60rpx;
      font-size: 26rpx;
      color: #2a82e4;
      border: 1px solid rgba(180, 208, 240, 1);
      border-radius: 10rpx;
    }
  }
}
.pad {
//   height: 166rpx;
  height: 88rpx;
}
.pad2{
  height: 228rpx;
}
.listH{
    /*#ifdef APP-PLUS*/
	height: calc(100vh - 344rpx);
	/*#endif*/
	/*#ifdef H5*/
  	height: calc(100vh - 256rpx);
	/*#endif*/
}
.item {
  // width: 100%;
  padding: 30rpx;
  //   margin-bottom: 10rpx;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  .title {
    // width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .date {
    font-size: 24rpx;
    color: #a6aebc;
  }
  .opinion {
    font-size: 24rpx;
    color: #a6aebc;
  }
  .content {
    height: 50rpx;
    line-height: 50rpx;
    font-size: 24rpx;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*禁⽌换⾏*/
    text-overflow: ellipsis; /*省略号*/
  }
  .bg1 {
    background-color: #fff6eb;
  }
  .bg2 {
    background-color: #ffebeb;
  }
  .mb-20 {
    margin-bottom: 20rpx;
  }
}
.rate {
  font-size: 28rpx;
}
.red {
  color: red;
}
.green {
  color: rgba(67, 207, 124, 1);
}
.grey {
  color: rgba(170, 170, 170, 1);
}
</style>
