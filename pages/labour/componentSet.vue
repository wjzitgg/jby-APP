<template>
  <view class="wrapper">
    <u-navbar
      leftText="设置组件"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <view class="head">
        <view class="addBtn" @click="addBtn">新增</view>
      </view>
      <view class="comList">
        <view
          class="comList-item"
          v-for="(item, index) in comList"
          :key="index"
        >
          <view class="itemName">{{ item.label }}</view>
          <view class="delBtn" @click="delBtn(item, index)">X</view>
        </view>
      </view>
    </view>
    <view class="btn" @click="isOk">确定</view>
    <u-popup :show="show" @close="close" closeable>
      <view class="popup" >
        <u--form labelWidth="60" >
          <u-form-item label="组件名" borderBottom>
            <u-input v-model="form.label" border="bottom"></u-input>
          </u-form-item>
          <u-form-item label="组件值" borderBottom>
            <u-input v-model="form.value" border="bottom"></u-input>
          </u-form-item>
        </u--form>
        <view class="btns" >
          <view class="addCom" @click="addCom">新 增</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      comList: [],
      show: false,
      form: {
        label: "",
        value: "",
      },
    };
  },
  onLoad(options) {
    console.log(options);
    if (options.data) {
      this.comList = JSON.parse(options.data);
    }
  },
  methods: {
    isOk() {
      console.log("确认");
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit("list", { data: JSON.stringify(this.comList) });
      uni.navigateBack({ delta: 1 });
    },
    delBtn(item, index) {
      this.comList.splice(index, 1);
    },
    addBtn() {
      this.show = true;
    },
    addCom(){
      if(!this.form.label){
        return uni.showToast({
          title: '请输入组件名',
          icon: 'none'
        })
      }
      if(!this.form.value){
        return uni.showToast({
          title: '请输入组件值',
          icon: 'none'
        })
      }
      this.comList.push({...this.form,id:this.comList.length?this.comList[this.comList.length-1].id -0 +1:1})
      this.close()
    },
    close() {
      this.show = false;
      this.form = {
        label: "",
        value: "",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 0 20rpx;
  font-size: 28rpx;
  background-color: #fff;
}
.head {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 60rpx;
  border-bottom: 1px solid #f3f3f3;
  .addBtn {
    padding: 10rpx 20rpx;
    border-radius: 6rpx;
    background-color: #169bd5;
    color: #fff;
  }
}
.comList {
  display: flex;
  // justify-content: space-between;
  flex-wrap: wrap;
  padding-top: 80rpx;
  border-bottom: 1px solid #f3f3f3;
  .comList-item {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 200rpx;
    height: 60rpx;
    margin-right: 32rpx;
    margin-bottom: 20rpx;
    padding-right: 24rpx;
    font-size: 26rpx;
    border: 1px solid #d7d7d7;
    .itemName {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 160rpx;
      height: 40rpx;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
    }
    .delBtn {
      position: absolute;
      right: 6rpx;
      top: 50%;
      transform: translateY(-45%);
      color: red;
      z-index: 5;
    }
  }
}
.popup {
  height: 36vh;
  padding: 90rpx 20rpx 0 20rpx;
  background-color: #fff;
  .btns{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40rpx;
  }
  .addCom{
    padding: 20rpx 30rpx;
    background-color: #169bd5;
    color: #fff;
    font-size: 28rpx;
    border-radius: 10rpx;
  }
}
</style>
