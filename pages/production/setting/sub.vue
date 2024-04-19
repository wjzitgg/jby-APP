<template>
  <view class="wrapper">
    <u-navbar
      leftText="分包任务划分"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="sticky">
      <view class="search">
        <u-input placeholder="请输入分包商名称" border="none" v-model="name">
          <template slot="suffix">
            <u-icon name="search" size="28" @click="search"></u-icon>
          </template>
        </u-input>
      </view>
    </view>
    <view class="pad"></view>
    <view class="content">
      <u-list @scrolltolower="scrollTolower" class="u-list">
        <u-list-item
          v-for="item in list"
          :key="item.pkId"
        >
        <view class="item" @click="detail(item)">
        <view class="icons">
            <u-icon name="../../../static/image/sub.png" size='20'></u-icon>
        </view>
        <view class="content">
          <view class="name">{{item.customName}}</view>
          <view class="workArea">{{item.areaName?item.areaName:'暂未分配工区'}}</view>
        </view>
      </view>
        </u-list-item>
      </u-list>
      
    </view>
  </view>
</template>

<script>
export default {
  computed:{
    user(){
      return uni.getStorageSync('user')?uni.getStorageSync('user'):{}
    }
  },
  onLoad() {
    this.findAreaCustom()
  },
  data() {
    return {
      name: "",
      customName:'',
      list:[],
      page:{
        pageSize:20,
        pageNum:1
      },
      total:0
    };
  },
  methods: {
    findAreaCustom(){
      let data={
        ...this.page,
        fkOrgId:this.user.orgType===5?'':uni.getStorageSync('nowOrgId'),
        customName:this.customName,
        linkMan:'',
        linkPhone:''
      }
      this.$api.findAreaCustom(data).then(res=>{
        if(res.code===200){
          this.list=res.data.records
          this.total=res.data.total-0
        }else{
          uni.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    },
    scrollTolower() {
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
      this.findAreaCustom()
    },
    detail(item){
        uni.navigateTo({ url: '/pages/production/setting/subWorkAreaDetail?obj='+JSON.stringify(item) })
    },
    search() {
      this.page.pageNum=1
      this.customName=this.name
      this.findAreaCustom()
    },
    queryList(){
      this.findAreaCustom()
    }
  },
};
</script>

<style lang="scss" scoped>
.sticky {
  display: flex;
  align-items: center;
  height: 80rpx;
  background-color: #fff;
  padding: 0 20rpx;
  .search {
    width: 700rpx;
    padding-left: 20rpx;
    border: 1px solid #2a82e4;
    border-radius: 6rpx;
  }
}
.pad {
  height: 90rpx;
}
.item {
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 10rpx;
  .icons {
    width: 60rpx;
  }
  .content {
    .name {
      width: 620rpx;
      margin-bottom: 20rpx;
      font-weight: 600;
      font-size: 30rpx;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
    }
  }
  .workArea {
    font-size: 24rpx;
    color: #a6aebc;
    letter-spacing:1px
  }
}
.list{
  padding-top: 210rpx;
}
</style>
