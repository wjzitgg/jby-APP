<template>
  <view class="wrapper">
    <u-navbar leftText="财务成本" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true" ></u-navbar>
    <u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="true" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}" ></u-tabs>
    <view class="heights">
        <subs :bidProjectId="bidProjectId" :endTime="endTime" :beginTime="beginTime" v-if="current===0"></subs>
        <supply :bidProjectId="bidProjectId" :endTime="endTime" :beginTime="beginTime" v-if="current===1"></supply>
    </view>
  </view>
</template>

<script>
import subs from './financeDetails/sub';
import supply from './financeDetails/supply';
export default {
    components:{subs,supply},
data(){
    return{
        tabList:[{name:"分包商支付往来"},{name:"供应商支付往来"}],
        current:0,
        fkOrgId:"",
        endTime:"",
        bidProjectId:""
    }
},
onLoad(options) {
    let obj =JSON.parse(options.row)
    this.fkOrgId = obj.subOrgId
    this.bidProjectId = obj.pkId
    this.endTime = options.endTime
    this.beginTime = options.beginTime
},
methods:{
    currentChange(e){
        this.current=e.index
    }
}
}
</script>

<style lang="scss" scoped>
.tabList{
    background-color: #fff;
}
.table_height {
  /*#ifdef APP-PLUS*/
  max-height: calc(100vh - 290rpx);
  height: calc(100vh - 290rpx);
  /*#endif*/
  /*#ifdef H5*/
  max-height: calc(100vh - 190rpx);
  height: calc(100vh - 190rpx);
  /*#endif*/
}
</style>