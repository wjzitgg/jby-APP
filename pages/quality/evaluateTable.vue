<template>
  <view class="wrapper">
    <u-navbar
      leftText="单位工程质量检测评定表"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
        <processForm ref="processForm" :tableData="details" :disabled="true"></processForm>
    </view>
  </view>
</template>

<script>
import processForm from '../../components/process-form/process-form3.vue';
export default {
    components:{processForm},
    data(){
        return{
            details:[]
        }
    },
    onLoad(item) {
      this.rowData = JSON.parse(item.row);
      this.init();
    },
    methods:{
        init() {
          this.$api
            .selectByThreeId({ fkRecordId: this.rowData.fkRecordId })
            .then((res) => {
              if (res.code == 200) {
                console.log(res.data);
                this.details = res.data;
              } else {
                uni.showToast({ icon: "none", title: res.msg });
              }
            });
        },
    }
}
</script>

<style lang="scss" scoped>
.content{
    overflow: auto;
}
</style>