<template>
  <view class="wrapper addPageBg">
    <u-navbar
      :leftText="navBarTitle"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="pad"></view>
    <view class="content">
      <view class="add-inputs">
        <view class="inputs-label">客户类型</view>
        <view class="inputs-content select">
          <view class="name">{{ cusTypeName }}</view>
          <!-- <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12" v-if="tiltetype == '1'"></u-icon> -->
          <u-icon name="lock-fill" class="icons" size="16"></u-icon>
        </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">公司名称</view>
        <view class="inputs-content">
          <u--textarea v-model="form.customName" placeholder="请输入内容" autoHeight maxlength="50" border="none"></u--textarea>
        </view>
      </view>
      <view v-if="tiltetype == 3" class="add-inputs">
        <view class="inputs-label">供应商类型</view>
        <view class="inputs-content select" @click="openPicker2">
          <view class="name" :class="{placeholder:!supTypeName}">{{ supTypeName?supTypeName:'请选择' }}</view>
          <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12" ></u-icon>
        </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">联系人</view>
        <view class="inputs-content">
          <u--textarea v-model="form.linkMan" placeholder="请输入内容" autoHeight maxlength="25" border="none"></u--textarea>
        </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">联系电话</view>
        <view class="inputs-content">
          <u--input border="none" v-model="form.linkPhone" placeholder="请输入内容" maxlength="20" @input="phoneInput" ></u--input>
        </view>
      </view>
      <view class="add-inputs">
        <view class="inputs-label">备注</view>
        <view class="inputs-content">
          <u--textarea v-model="form.remark" placeholder="请输入内容" autoHeight maxlength="100" border="none"></u--textarea>
        </view>
      </view>
      <view v-if="subSelShow" class="add-inputs">
        <view class="inputs-label">直供分包商</view>
        <view class="inputs-fileList">
          <view class="inputs-fileList-item" v-for="(item, idx) in subList" :key="idx">
            <u-icon name="/static/image/custom-sub.png" size="20"></u-icon>
            <view class="name">{{ item.customName }}</view>
            <view class="close" @click="delSub(item, idx)"></view>
          </view>
          <view class="fileListBtn">
           <view class="addBtn" @click="addSubBtn"> 添加 </view>

          </view>
        </view>
       
      </view>
    </view>
    <view class="pdb"></view>
    <view class="footer">
      <view class="footerBtn cancel" @click="cancel">取消</view>
      <view class="footerBtn add" @click="addOk">{{type==1?'确定':'保存'}}</view>
    </view>
    <u-picker
      title="请选择客户类型"
      :show="pickerShow"
      :columns="[cusTypeList]"
      keyName="name"
      @confirm="pickerConfirm"
      @cancel="pickerCancel"
    ></u-picker>
    <u-picker
      title="请选择供应商类型"
      :show="pickerShow2"
      :columns="[supTypeList]"
      keyName="keyVal"
      @confirm="pickerConfirm2"
      @cancel="pickerCancel2"
    ></u-picker>
  </view>
</template>

<script>
export default {
    onLoad(options) {
    console.log(options);
    // type :1新增，2编辑
    // tiltetype:1管理单位,2分包商,3供应商
    this.tiltetype = options.tiltetype;
    this.type = options.type;
    if (options.type == 2) {
      console.log(JSON.parse(options.obj));
      let obj = JSON.parse(options.obj);
      this.form = {
        pkId: obj.pkId,
        customName: obj.orgName,
        customType:
          obj.orgType === 2
            ? 0
            : obj.orgType === 3
            ? 1
            : obj.orgType === 6
            ? 3
            : obj.orgType === 7
            ? 4
            : 5,
        linkMan: obj.orgLinkMan,
        linkPhone: obj.orgLinkPhone,
        remark: obj.remark,
      };
      if (obj.orgType == 6) {
        this.form.supplyCode = obj.supplyCode;
        this.subList = obj.supplyCustoms ? obj.supplyCustoms : [];
        this.supTypeName=this.supTypeList.filter(item=>item.keyName===obj.supplyCode)[0].keyVal
        if (obj.supplyCode !== "supply_common") {
          this.subSelShow = true;
        }
      }
      if (options.tiltetype == 1) {
        this.cusTypeName = this.orgTypeList[obj.orgType];
      }
    }
    if (options.tiltetype == 1) {
      if (options.type == 1) {
        this.navBarTitle = "新增管理单位";
        let orgType = options.orgType - 0
        this.form.customType = orgType==2?0:orgType==3?1:5
        this.cusTypeName = this.orgTypeList[orgType];
      } else {
        this.navBarTitle = "编辑管理单位";
      }
    } else if (options.tiltetype == 2) {
      if (options.type == 1) {
        this.navBarTitle = "新增分包商";
        this.form.customType = 4;
      } else {
        this.navBarTitle = "编辑分包商";
      }
      this.cusTypeName = "分包商";
    } else if (options.tiltetype == 3) {
      if (options.type == 1) {
        this.navBarTitle = "新增供应商";
        this.form.customType = 3;
      } else {
        this.navBarTitle = "编辑供应商";
      }
      this.cusTypeName = "供应商";
    }
  },
  data() {
    return {
      navBarTitle: "新增管理单位",
      subList: [],
      tiltetype: "1",
      form: {
        customName: "",
        customType: 0,
        linkMan: "",
        linkPhone: "",
        remark: "",
        supplyCode: "",
        supplyIds: [],
      },
      cusTypeList: [
        { id: 0, name: "建设单位" },
        { id: 1, name: "监理公司" },
        { id: 5, name: "设计院" },
      ],
      orgTypeList: [
        "系统运营商",
        "系统代理商",
        "建设单位",
        "监理公司",
        "施工单位",
        "项目部",
        "供应商",
        "分包商",
        "劳务工人",
        "设计院",
      ],
      pickerShow: false,
      cusTypeName: "",
      pickerShow2: false,
      supTypeList: [
        {
          keyName: "supply_common",
          keyVal: "普通材料供应商",
          dictType: 23,
        },
        {
          keyName: "supply_beton",
          keyVal: "混凝土搅拌站",
          dictType: 23,
        },
        {
          keyName: "supply_rebar",
          keyVal: "钢筋加工厂",
          dictType: 23,
        },
      ],
      supTypeName: "",
      subSelShow: false,
    };
  },
  methods: {
    phoneInput(){
      setTimeout(()=>{
        this.form.linkPhone=this.$limitPhone(this.form.linkPhone)
      },100)
    },
    cancel() {
      uni.navigateBack({ delta: 1 });
    },
    addOk() {
      if (!this.form.customType) {
        uni.showToast({ title: "请选择客户类型", icon: "none" });
      }
      if (!this.form.customName) {
        uni.showToast({ title: "请填写客户名称", icon: "none" });
      }
      if (!this.form.linkMan) {
        uni.showToast({ title: "请填写联系人", icon: "none" });
      }
      if (!this.form.linkPhone) {
        uni.showToast({ title: "请填写联系电话", icon: "none" });
      }
      const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      const value = this.form.linkPhone;
      if (!phoneReg.test(value)) {
        return uni.showToast({ title: "请填写正确的手机号", icon: "none" });
      }

      if (this.tiltetype == "3" && !this.form.supplyCode) {
        uni.showToast({ title: "请选择供应商类型", icon: "none" });
      }
      let data = { ...this.form };
      if (this.tiltetype != "3") {
        delete data.supplyCode;
        delete data.supplyIds;
      } else {
        data.supplyIds = this.subList.map((item) => item.pkId);
      }
      uni.showLoading({ mask: true });
      if (this.type == 1) {
        this.$api
          .addCustom(data)
          .then((res) => {
            uni.hideLoading();
            if (res.code === 200) {
              uni.showToast({ title: "新增成功" });
              uni.navigateBack({ delta: 1 });
            } else {
              uni.showToast({ title: res.msg, icon: "none" });
            }
          })
          .catch((err) => {
            uni.hideLoading();
          });
      } else if (this.type == 2) {
        this.$api
          .updateCustom(data)
          .then((res) => {
            uni.hideLoading();
            if (res.code === 200) {
              uni.showToast({ title: "编辑成功" });
              uni.navigateBack({ delta: 1 });
            } else {
              uni.showToast({ title: res.msg, icon: "none" });
            }
          })
          .catch((err) => {
            uni.hideLoading();
          });
      }
    },
    delSub(row, idx) {
      console.log(row, idx);
      this.subList = this.subList.filter((item) => item.pkId !== row.pkId);
    },
    openPicker() {
      if (this.tiltetype !== "1") {
        return;
      }
      this.pickerShow = true;
    },
    pickerConfirm(e) {
      console.log(e);
      if (e.value && e.value[0]) {
        console.log(e.value[0]);
        this.cusTypeName = e.value[0].name;
        this.form.customType = e.value[0].id;
      }
      this.pickerShow = false;
    },
    pickerCancel() {
      this.pickerShow = false;
    },
    openPicker2() {
      this.pickerShow2 = true;
    },
    pickerConfirm2(e) {
      console.log(e);
      if (e.value && e.value[0]) {
        console.log(e.value[0]);
        this.supTypeName = e.value[0].keyVal;
        this.form.supplyCode = e.value[0].keyName;
        if (e.value[0].keyName !== "supply_common") {
          this.subSelShow = true;
        } else {
          this.subSelShow = false;
        }
      }
      this.pickerShow2 = false;
    },
    pickerCancel2() {
      this.pickerShow2 = false;
    },
    addSubBtn() {
      let that = this;
      uni.navigateTo({
        url: `/pages/custom/supplyCustome?subList=${JSON.stringify(
          that.subList
        )}`,
        events: {
          setList: (data) => {
            console.log(data);
            if (data.data) {
              this.subList = JSON.parse(data.data);
            }
          },
        },
        success: (res) => {
          res.eventChannel.emit("setList", {
            data: JSON.stringify(that.subList),
          });
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.pad{
  height: 10rpx;
}
.content {
  font-size: 28rpx;
}
.title {
  padding-left: 20rpx;
  font-size: 28rpx;
  font-weight: 600;
  margin: 10rpx 0;
}
.inputs {
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}
.select {
  justify-content: space-between;
}
.subList {
  overflow: auto;
  max-height: 350rpx;
  background-color: #fff;
  .subList-item {
    display: flex;
    justify-content: space-around;
    height: 80rpx;
    padding: 0 20rpx;
    border-bottom: 1px solid #eee;
    .name {
      width: 580rpx;
      height: 80rpx;
      line-height: 80rpx;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
    }
  }
}

.addSubBtn {
  display: flex;
  align-items: center;
  padding-left: 40rpx;
  background-color: #fff;
  height: 80rpx;
  .btns {
    width: 100rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    text-align: center;
    color: #2a82e4;
    background-color: #d9f4ff;
  }
}
.pdb {
  height: 100rpx;
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  height: 100rpx;
  .footerBtn {
    width: 375rpx;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
  }
  .cancel {
    background-color: #eeeeee;
    color: #aaaaaa;
  }
  .add {
    background-color: #1576e6;
    color: #fff;
  }
}
.placeholder{
  color: rgb(192, 196, 204);
  font-size: 30rpx;
}
</style>
