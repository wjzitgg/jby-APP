<template>
  <view class="wrapper">
    <u-navbar leftText="管理成本" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true" ></u-navbar>
    <u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="true" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}" ></u-tabs>
    <view class="heights">
        <subs :fkOrgId="fkOrgId" v-if="current===0"></subs>
        <material :fkOrgId="fkOrgId" v-if="current===1"></material>
        <quipment :fkOrgId="fkOrgId" v-if="current===2"></quipment>
        <manage :fkOrgId="fkOrgId" :endDate="endTime" v-if="current===3"></manage>
    </view>
  </view>
</template>

<script>
import manage from './costDetails/manage'
import material from './costDetails/material'
import quipment from './costDetails/quipment'
import subs from './costDetails/sub'
export default {
components:{manage,material,quipment,subs},
data(){
    return{
        tabList:[{name:"分包成本"},{name:"物资成本"},{name:"设备成本"},{name:"管理成本"}],
        current:0,
        fkOrgId:"",
        endTime:""
    }
},
onLoad(options) {
    let obj =JSON.parse(options.row)
    this.fkOrgId = obj.subOrgId
    this.endTime = options.endTime
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
.heights{
    /*#ifdef APP-PLUS*/
    height: calc(100vh - 290rpx);
    /*#endif*/
    /*#ifdef H5*/
    height: calc(100vh - 190rpx);
    /*#endif*/
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