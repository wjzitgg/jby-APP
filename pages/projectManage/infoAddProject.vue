<template>
  <view class="wrapper addPageBg">
    <u-navbar
      :leftText="rowData.itemTitle"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <view>
        <view style="padding-bottom: 60px">
          <view class="add-inputs">
            <view class="inputs-label">所属项目</view>
            <view class="inputs-content select" @click="receiveShow = true">
              <view class="name">{{ receiverData.projectName }}</view>
              <u-icon
                name="arrow-down-fill"
                class="icons"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
            <u-picker
              :show="receiveShow"
              :columns="istNoUserId"
              keyName="projectName"
              @cancel="receiveClose"
              @confirm="receiveConfirm"
            ></u-picker>
          </view>
          <view class="add-inputs">
            <view class="inputs-label">项目名称</view>
            <view class="inputs-content">
              <u--textarea
                v-model="rowData.projectName"
                placeholder="请输入内容"
                autoHeight
                maxlength="25"
                border="none"
              ></u--textarea>
            </view>
          </view>
          <view class="add-inputs">
            <view class="inputs-label">工程造价</view>
            <view class="inputs-content">
              <u--input
                v-model="rowData.manufacture"
                placeholder="请输入内容"
                autoHeight
                maxlength="25"
                border="none"
              ></u--input>
            </view>
          </view>
          <view class="add-inputs">
            <view class="inputs-label">工程量</view>
            <view class="inputs-content">
              <u--input
                v-model="rowData.quantities"
                placeholder="请输入内容"
                autoHeight
                maxlength="25"
                border="none"
              ></u--input>
            </view>
          </view>
          <view class="add-inputs">
            <view class="inputs-label">规模</view>
            <view class="inputs-content">
              <u--textarea
                v-model="rowData.largeScale"
                placeholder="请输入内容"
                autoHeight
                maxlength="100"
                border="none"
              ></u--textarea>
            </view>
          </view>
          <view class="add-inputs">
            <view class="inputs-label">结构形式</view>
            <view class="inputs-content">
              <u--textarea
                v-model="rowData.structure"
                placeholder="请输入内容"
                autoHeight
                maxlength="100"
                border="none"
              ></u--textarea>
            </view>
          </view>
          <view class="add-inputs">
            <view class="inputs-label">施工方案</view>
            <view class="inputs-content">
              <u--textarea
                v-model="rowData.projectScheme"
                placeholder="请输入内容"
                autoHeight
                maxlength="100"
                border="none"
              ></u--textarea>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="box-btn">
      <u-button
        style="background: #eeeeee"
        class="btns cancle"
        type="default"
        text="取消"
        @click="abrogate"
      ></u-button>
      <u-button
        class="btns"
        type="primary"
        text="保存"
        @click="preserve"
      ></u-button>
    </view>
  </view>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      rowData: {},
      value: false,
      receiverData: {},
      receiveShow: false, //关联项目弹窗状态
      istNoUserId: [],
    };
  },
  onLoad(item) {
    this.getItemListNoUserId();
    this.rowData = JSON.parse(item.row);
  },
  methods: {
    getItemListNoUserId() {
      this.$api.getItemListNoUserId().then((res) => {
        if (res.code == 200) {
          if (this.rowData.itemTitle == "编辑工程项目") {
            if (this.rowData.proName) {
              // console.log(this.rowData.proName);
              res.data.forEach((item) => {
                if (item.projectName == this.rowData.proName) {
                  this.receiverData = item;
                }
              });
            }

          }
          this.istNoUserId = [res.data];
        }
      });
    },


    // 所属项目
    receiveClose() {
      this.receiveShow = false;
    },
    // 所属项目
    receiveConfirm(e) {
      this.receiverData = e.value[0];
      this.receiveShow = false;
    },

    // 取消新增修改
    abrogate() {
      uni.navigateBack();
    },
    // 保存
    preserve() {
      // if (this.rowData.warehouseType === 1 && !this.rowData.detailAddress) {
      //   return uni.showToast({ icon: "none", title: "请选择仓库地址" });
      // }
      let data = {
        largeScale: this.rowData.largeScale,
        manufacture: this.rowData.manufacture,
        projectName: this.rowData.projectName,
        projectScheme: this.rowData.projectScheme,
        quantities: this.rowData.quantities,
        structure: this.rowData.structure,
        fkProjectId:
          this.receiverData.pkId == undefined ? "" : this.receiverData.pkId,
      };
      uni.showLoading({ mask: true });
      if (this.rowData.itemTitle == "新增工程项目") {
        this.$api.projectAddProjectTable(data).then((res) => {
          uni.hideLoading();
          if (res.code == 200) {
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh(); // 调用上一页 定义的方法
            uni.navigateBack();
            uni.showToast({ title: "新增成功" });
            // uni.navigateTo({
            //   url: "/pages/material/inventory/info?",
            // });
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
      } else {
        data.pkId = this.rowData.pkId;
        this.$api.projectUpdateProjectTable(data).then((res) => {
          uni.hideLoading();
          if (res.code == 200) {
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh(); // 调用上一页 定义的方法
            uni.navigateBack();
            uni.showToast({ title: "编辑成功" });
            // uni.navigateTo({
            //   url: "/pages/material/inventory/info?",
            // });
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .uni-input-placeholder {
  padding-left: 10px;
}
.tabs {
  /deep/ .u-tabs__wrapper__nav__item {
    flex: 1;
  }
}
.item-edit-form {
  padding: 8px 16px;
  background: rgb(255, 255, 255);
  margin-top: 2px;
}

.form-title {
  margin-left: 20rpx;
  line-height: 60rpx;
}
.form-content {
  height: 80rpx;
  background: #fff;
}
.select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  background-color: #fff;
}
.name {
  width: 520rpx;
  // margin-bottom: 20rpx;
  font-weight: 600;
  font-size: 30rpx;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁⽌换⾏*/
  text-overflow: ellipsis; /*省略号*/
}
.box-btn {
  display: flex;
  position: fixed;
  width: 100%;
  bottom: 0;
}
.table-btn {
  display: inline-block;
  background: #ebf4ff;
  color: #2b8fed;
  font-size: 10px;
  padding: 6px 23px;
  margin: 6px auto;
  margin-left: 41%;
}

/deep/ .uni-input-input {
  padding-left: 12px;
}
.u-radio {
  margin-right: 20rpx;
}
</style>
