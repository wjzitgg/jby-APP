<template>
    <view class="wrapper">
		<u-navbar leftText="流程审核" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="search">
      <u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="true" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}" > </u-tabs>
      <view class="search-item">
        <view class="type">
          <view class="label">状态</view>
          <easy-select ref="easySelect" size="mini" class="easySelect" :value="nowType" @selectOne="selectOne"
            :options="typeList"></easy-select>
        </view>
        <filteInput placeholder="流程名称" v-model="title" maxlength="50" @search="search"></filteInput>
      </view>
      <view class="handle-btns">
        <view class="btns-item" @click="disabledType!==1?'':batch(2)" :class="disabledType!==1?'disabled':''">批量审批</view>
        <view class="btns-item" @click="disabledType!==2?'':batch(3)" :class="disabledType!==2?'disabled':''">批量处理撤回</view>
      </view>
    </view>
    <view class="content">
      <u-checkbox-group v-model="checkList" @change="checkboxChange" >
      <u-list
        @scrolltolower="scrollTolower"
        class="u-list"
        :height="'calc(100vh - 368rpx)'"
      >
      
        <u-list-item v-for="(item, index) in list" :key="index">
          <view class="item" @click="detail(item)">
            <view class="checks">
              <u-checkbox label="" :name="item.pkId" :disabled="chekDisable(item)" v-if="item.changeStatus || item.handleStatus"> </u-checkbox>
            </view>
            <view class="item-content">
              <view class="item-title">
                {{item.workflowName}}
              </view>
              <view class="item-else">
                {{item.fkProjectName}}
              </view>
              <view class="item-else">
                {{item.fkProjectBidName}}
              </view>
              <view class="item-type">
                {{item.enableStatusName}}
              </view>
            </view>
          </view>
        </u-list-item>
      </u-list>
      </u-checkbox-group>
    </view>
    <u-popup :show="show" @close="close" mode="center">
            <view class="pop">
                <view class="pop-title">审批意见</view>
                <view class="pop-content">
                  <u--textarea v-model="remark" placeholder="请输入内容" ></u--textarea>
                </view>
                <view class="pop-footer">
                  <view class="pop-footer-btn col1" @click="approves(1)" v-if="popType==3">同意撤回</view>
                  <view class="pop-footer-btn col1" @click="approves(1)" v-if="popType==2">审批</view>
                  <view class="pop-footer-btn col2" @click="approves(2)">驳回</view>
                </view>
            </view>
		</u-popup>
    </view>
</template>

<script>
import filteInput from '../../components/search-tag/filter-input.vue';
export default {
  components:{filteInput},
data(){
  return{
    tabList:[{name:"生产验收流程",bizType:1},{name:"业主结算流程",bizType:2},{name:"变更设计流程",bizType:4}],
    current:0,
    bizType:1,
    pageNum:1,
    total:0,
    title:"",
    seartitle:"",
    typeList:[{value:"",label:"全部"}],
    nowType:"全部",
    nowTypeId:"",
    list:[],
    checkList:[],
    disabledType:0,
    show:false,
    popTitle:"审批意见",
    remark:"",
    popType:2
  }
},
onLoad(options) {
  this.approveExamineStatsQuery()
  this.getList()
},
methods:{
  close(){
    this.show = false
    this.remark=""
  },
  detail(item){
    console.log(item);
    uni.navigateTo({ url: '/pages/projectManage/workExamineDetail?item='+JSON.stringify(item) })
  },
  approves(enableStatus){
    if(!this.remark){
      return uni.showToast({title:"请填写意见",icon:"none"})
    }
    let arr =this.checkList.map(item=>({enableStatus,remark:this.remark,pkId:item}))
    this.$api.approveExamine(arr).then(res=>{
      if(res.code==200){
        this.close()
        this.resh()
        uni.showToast({title:"操作成功"})
      }else{
        uni.showToast({title:res.msg,icon:"none"})
      }
    })
  },
  scrollTolower(){
    if (this.pageNum * 20 > this.total) {
      return;
    }
    this.pageNum = this.pageNum + 1;
  },
  checkboxChange(e){
    console.log(e);
    if(e.length){
     let obj = this.list.filter(item=>item.pkId==e[0])[0]
     if (obj.changeStatus) {
       this.disabledType = 1;
     }
     if (obj.handleStatus) {
       this.disabledType = 2;
     }
    }else{
      this.disabledType = 0
    }
  },
  chekDisable(row) {
      if (!row.changeStatus && this.disabledType == 1) {
        return true;
      }
      if (!row.handleStatus && this.disabledType == 2) {
        return true;
      }
      if (!row.changeStatus && !row.handleStatus) {
        return true;
      }
      return false;
    },
  approveExamineStatsQuery(){
    this.$api.approveExamineStatsQuery().then(res=>{
      if(res.code==200){
       res.data= res.data.map(item=>({...item,label:item.key,value:item.name}))
      this.typeList=[{value:"",label:"全部"},...res.data]
      console.log(this.typeList);
      }
    })
  },
  batch(type){
    console.log(this.checkList);
    this.popType=type
    if(type==2){
      this.popTitle="审批意见"
    }else{
      this.popTitle="撤回意见"
    }
    this.show=true
  },
  currentChange(item){
    this.current = item.index
    this.bizType=item.bizType
    this.resh()
  },
  resh(){
    this.pageNum = 1
    this.checkList=[]
    this.disabledType=0
    this.getList()
  },
  selectOne(item){
    console.log(item);
    this.pageNum = 1
    this.nowType=item.options.label
    this.nowTypeId=item.options.value
    this.getList()
  },
  search(){
    this.pageNum = 1
    this.seartitle = this.title
    this.getList()
  },
  getList(){
    let data= {
      pageNum:this.pageNum,
      pageSize:20,
      bizType:this.bizType,
      enableStatus:this.nowTypeId,
      workflowName:this.seartitle
    }
    console.log(data);
    this.$api.searchExaminePage(data).then(res=>{
      if(res.code==200){
        this.total = res.data.total
        if(data.pageNum==1){
          this.list = res.data.records
        }else{
          this.list = [...this.list,...res.data.records]
        }
      }else{
        uni.showToast({ title: res.msg, icon: 'none' })
      }
    })
  },
}
}
</script>

<style lang="scss" scoped>
.search{
  background-color: #fff;
  .search-item{
    display: flex;
    .type{
      display: flex;
      align-items: center;
      width: 400rpx;
      margin-right: 8rpx;
      .label{
        width: 80rpx;
      }
      .easySelect{
        width: calc(100% - 80rpx);
      }
    }
  }
  .handle-btns{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 80rpx;
    .btns-item{
      margin-right: 8rpx;
      padding: 10rpx 20rpx;
      font-size: 26rpx;
      background-color: #169bd5;
      border-radius: 8rpx;
      color: #fff;
    }
    .disabled {
       opacity: 0.5;
    }
  }
}
.item{
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  .checks{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80rpx;
  }
  .item-content{
  position: relative;
  width: 670rpx;
  padding: 30rpx;
  background-color: #f2f2f2;
  .item-title{
    font-size: 28rpx;
    margin-bottom: 10rpx;
  }
  .item-else{
    font-size: 24rpx;
    color: #ccc;
    margin-bottom: 10rpx;
  }
  .item-type{
    position: absolute;
    right: 30rpx;
    top: 50rpx;
    font-size: 24rpx;
    color: #ccc;
  }
}
}
.pop{
  width: 600rpx;
  .pop-title{
    display: flex;
    align-items: center;
    height: 80rpx;
    padding: 0 20rpx;
    font-size: 30rpx;
    font-weight: 700;
  }
  .pop-content{
    padding: 0 20rpx;
    margin-bottom: 20rpx;
  }
  .pop-footer{
    display: flex;
    .pop-footer-btn{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50%;
      height: 80rpx;
      color: #fff;
    }
  }
  .col1{
    background-color: #169bd5;
  }
  .col2{
    background-color: #ec808d;
  }
}
</style>