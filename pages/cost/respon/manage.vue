
<template>
  <view class="wrapper">
    <u-navbar
      leftText="管理成本"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="pdt-ios"></view>
    <view class="content">
      <view class="table_detail table_empty" style="margin-top: 2px">
        <table>
          <thead>
            <tr>
              <th >费用类别</th>
              <th>预算费用</th>
    
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in itemNameList" :key="index">
              <td>{{ item.className }}</td>
              <td>{{ item.costAmount }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty  mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      itemNameList: [],
    };
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  onLoad() {
    this.init();
  },
  methods: {
  
    init() {
      let data = {
        sourceType: 0,
        fkOrgId:this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId")
      };
      this.$api.searchCostManage(data).then((res) => {
        if (res.code == 200) {
          this.itemNameList = res.data.appCostManageVoList;
          this.itemNameList.push({className:"合计",costAmount:res.data.amount})
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
   
  },
};
</script>

<style lang="scss" scoped>
</style>
