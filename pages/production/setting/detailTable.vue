<template>
  <view class="wrapper">
    <u-navbar
      leftText="清单项目表"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <view class="table_detail table_empty" v-if="list.length">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>项目名称</th>
              <th>隧道延长米</th>
              <th>每延米工程量</th>
              <th>设计工程量</th>
              <th>单位</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in list" :key="item.pkId">
              <td>{{ item.itemCode }}</td>
              <td>{{ item.itemName }}</td>
              <td>{{ item.itemType==2&&item.grade==3?item.number+'m':'' }}</td>
              <td>{{ item.itemType==2&&item.grade==4? item.unitQuantity+item.unitName:'' }}</td>
              <td>{{ item.grade==4?item.designQuantities:'' }}</td>
              <td>{{ item.unitName }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="list.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      </view>
      <u-empty
        v-else
        style="height: 100%"
        mode="data"
        text="暂无数据"
        icon="/static/image/noData.png"
      ></u-empty>
    </view>
  </view>
</template>

<script>
export default {
    onLoad(options) {
        this.searchItemWithDetails()
    },
    computed:{
    user(){
      return uni.getStorageSync('user')?uni.getStorageSync('user'):{}
    }
  },
  data() {
    return {
      list: [],
    };
  },
  methods: {
    searchItemWithDetails() {
    uni.showLoading({ mask: true })
      this.$api.searchItemWithDetails({fkOrgId:this.user.orgType===5?'':uni.getStorageSync('nowOrgId')}).then((res) => {
        uni.hideLoading()
        if (res.code === 200) {
            this.list=res.data
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      }).catch(err=>{
        uni.hideLoading()
      });
    },
    findItemByCustomId(){
        this.$api.findItemByCustomId().then(res=>{

        })
    }
  },
};
</script>

<style lang="scss" scoped></style>
