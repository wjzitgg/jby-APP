<template>
  <view class="wrapper">
    <u-navbar
      leftText="分包商工程任务划分"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <u--form
        labelPosition="left"
        :borderBottom="true"
        labelWidth="80"
        class="form"
      >
        <u-form-item label="分包商">
          <view>{{subDetail.customName}}</view>
        </u-form-item>
        <u-form-item label="联系人">
          <view>{{subDetail.linkMan}}</view>
        </u-form-item>
        <u-form-item label="联系电话">
          <view>{{subDetail.linkPhone}}</view>
        </u-form-item>
        <u-form-item label="管理工区">
          <view >{{subDetail.areaName}}</view >
        </u-form-item>
      </u--form>
      <view class="workArea" v-if="tabList.length">
        <u-tabs
          :list="tabList"
          :current="current"
          @change="currentChange"
          :scrollable="tabList.length > 4"
          :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
        ></u-tabs>
        <view class="list">
          <view class="list-item" v-for="(item,index) in list" :key="index">
            <view class="grade1 overhidden" v-if="item.grade == 1">{{ item.itemName }}</view>
            <view class="grade2 overhidden" v-if="item.grade == 2">{{ item.itemName }}</view>
            <view class="grade3" v-if="item.grade == 3">
                <u-icon name="file-text" size='20' class="icons"></u-icon>
                <view class="name overhidden">{{ item.itemName }}</view>
            </view>
          </view>
        </view>
      </view>
      <u-empty
        style="height: 100%"
        mode="data"
        text="暂无工区"
        icon="/static/image/noData.png"
        v-else
      >
      </u-empty>
    </view>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    console.log(options);
    let obj=JSON.parse(options.obj)
    this.subDetail=obj
    this.searchCustomWorkArea()
  },
  computed:{
    user(){
      return uni.getStorageSync('user')?uni.getStorageSync('user'):{}
    }
  },
  data() {
    return {
      subDetail:{
        areaName:'',
        customName:'',
        pkId:'',
        linkMan:'',
        linkPhone:''
      },
      tabList: [],
      current: 0,
      list: [],
    };
  },
  methods: {
    currentChange(e) {
      console.log(e);
      this.current=e.index
      this.list=e.itemNameList
    },
    searchCustomWorkArea(){
      uni.showLoading({ mask: true });
      this.$api.searchCustomWorkArea({customId:this.subDetail.pkId}).then(res=>{
        uni.hideLoading();
        if(res.code===200){
          if(res.code===200){
          this.tabList=res.data.map(item=>({...item,name:item.areaName}))
          if(res.data&&res.data.length){
            this.list=res.data[0].itemNameList
          }
        }else{
          uni.showToast({ title: res.msg, icon: 'none' })
        }
        }
      }).catch((err) => {
          uni.hideLoading();
        });
    }
  },
};
</script>

<style lang="scss" scoped>
.form {
  padding: 40rpx 20rpx;
  margin-bottom: 10rpx;
  background-color: #fff;
}
.u-form-item {
  border-bottom: 1px solid #eee;
}
.workArea {
  background-color: #fff;
}
.list{
    // height: 53vh;
    // overflow: auto;
}
.list-item {
    .grade1{
        width: 700rpx;
        height: 60rpx;
        line-height: 60rpx;
        padding-left: 20rpx;
        background: linear-gradient(90deg, rgba(221, 221, 221, 1) 0%, rgba(255, 255, 255, 0) 100%);
    }
    .grade2{
        width: 700rpx;
        height: 60rpx;
        line-height: 60rpx;
        padding-left: 20rpx;
        background: linear-gradient(90deg, rgba(238, 238, 238, 1) 0%, rgba(255, 255, 255, 0) 100%);
    }
    .grade3{
        display: flex;
        padding: 20rpx;
        background-color: #fff;
        .icons{
            width: 60rpx;
        }
        .name{
            width: 600rpx;
        }
    }
}
.overhidden{
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*禁⽌换⾏*/
    text-overflow: ellipsis; /*省略号*/
}
</style>
