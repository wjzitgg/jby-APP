<template>
  <view class="wrapper addPageBg">
    <u-navbar
      :leftText="title"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <view class="add-inputs">
        <view class="inputs-label">部门名称</view>
        <view class="inputs-content">
          <u--textarea
            v-model="depData.deptName"
            placeholder="请输入内容"
            autoHeight
            maxlength="25"
            border="none"
          ></u--textarea>
        </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">排序值</view>
        <view class="inputs-content">
          <u--input
            placeholder="请输入排序值"
            border="none"
            v-model.number="depData.sortval"
            type="number"
            maxlength="6"
          ></u--input>
        </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">部门描述</view>
        <view class="inputs-content">
          <u--textarea
            v-model="depData.remark"
            placeholder="请输入内容"
            autoHeight
            maxlength="100"
            border="none"
          ></u--textarea>
        </view>
      </view>
    </view>
    <view class="foot">
      <view @click="close" class="cancel">取消</view>
      <view @click="submit" class="submit">保存</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "新增部门",
      pkId: "",
      depData: {
        remark: "",
      },
    };
  },
  onLoad(option) {
    console.log("55", option);
    this.pkId = option.pkId;
    if (this.pkId != "") {
      this.title = "编辑部门";
      this.getData();
    }
  },
  methods: {
    close() {
      uni.navigateBack({ delta: 1 });
    },
    async submit() {
      const data = {
        deptName: this.depData.deptName,
        remark: this.depData.remark,
        sortval: this.depData.sortval,
      };
      const apiCall = this.pkId
        ? this.$api.newDepartment({ ...data, pkId: this.pkId })
        : this.$api.newDepartmentADD({ ...data, parentId: "" });

      const res = await apiCall;

      if (res.code === 200) {
        uni.showToast({
          icon: "success",
          title: this.pkId ? "编辑成功" : "添加成功",
          duration: 1500,
        });
        setTimeout(() => {
          this.close();
        }, 1000);
      }
    },

    // 根据id 查部门信息
    getData() {
      this.$api.getDepart({ deptId: this.pkId }).then((res) => {
        if (res.code === 200) {
          this.depData = res.data;
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.item {
  margin-top: 30rpx;

  h6 {
    font-size: 28rpx;
    padding-left: 24rpx;
    margin-bottom: 8rpx;
  }

  .feed {
    background-color: #fff;
    height: 100rpx;
    padding-left: 24rpx;
  }

  .describe {
    background-color: #fff;
    padding: 24rpx;
  }
}

.foot {
  width: 100%;
  height: 120rpx;
  line-height: 120rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;

  .submit {
    flex: 1;
    background-color: #1576e6;
    color: #fff;
    text-align: center;
  }

  .cancel {
    flex: 1;
    background-color: #eee;
    color: #aaaaaa;
    text-align: center;
  }
}
</style>
