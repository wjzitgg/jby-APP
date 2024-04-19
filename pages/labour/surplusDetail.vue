<template>
  <view class="wrapper">
    <u-navbar
        leftText="结余详情"
        bgColor="rgb(0 0 0 / 0%)"
        leftIconColor="#fff"
        :autoBack="true"
      ></u-navbar>
      <view class="pdt-ios"></view>
      <view class="table_detail table_empty" v-if="showList.length">
        <table>
          <thead>
            <tr>
              <th>详情</th>
              <th class="topfixed">日期</th>
              <th>类别</th>
              <th>结算金额</th>
              <th>发放金额</th>
              <th>支付结余</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in showList" :key="item.pkId">
              <td @click="openDetail(item)"><u-icon name="eye" class="icons" size="20"></u-icon></td>
              <td class="fixeds">{{item.settlementTime}}</td>
              <td>{{item.settlementType===1?'结算':'发放'}}</td>
              <td>{{item.settlementAmount?item.settlementAmount:'/'}}</td>
              <td>{{item.grantAmount?item.grantAmount:'/'}}</td>
              <td>{{item.paymentAmount}}</td>
            </tr>
          </tbody>
        </table>
      </view>
      <u-empty  v-if="showList.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      <u-empty
      v-else
      style="height: 100%"
      mode="data"
      text="暂无数据"
      icon="/static/image/noData.png"
    >
    </u-empty>
  </view>
</template>

<script>
export default {
  data(){
    return{
      showList:[],
      teamId:""
    }
  },
  onLoad(options) {
    let data=JSON.parse(options.data)
    this.teamId=data.fkTeamId
    this.paymentBalanceByTeamId()
  },
  methods:{
    paymentBalanceByTeamId(){
      let data={
        teamId:this.teamId,
        pageNum:1,
        pageSize:10000
      }
      this.$api.paymentBalanceByTeamId(data).then((res) => {
        if(res.code===200){
          this.showList=res.data.paymentBalancePageVo.records
        }else {
            uni.showToast({ title: res.msg, icon: "none", });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    openDetail(item){
      console.log(item);
      if(item.settlementType===1){
        uni.navigateTo({ url: `/pages/labour/settingDetail?type=3&data=${JSON.stringify(item)}` });
        }else if(item.settlementType===2){
        uni.navigateTo({ url: `/pages/labour/grantDetail?type=3&data=${JSON.stringify(item)}` });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table_detail{
  td:first-child,
	th:first-child{
    width: 50px;
  }
  .fixeds{
      width:100px;
	  position:sticky;
	  left:50px;
	  z-index:1;
  }
  .topfixed{
    position:sticky;
	  top:0;
    left: 50px;
    z-index: 2;
  }
}
.icons{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>