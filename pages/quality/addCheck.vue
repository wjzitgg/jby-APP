<!-- 上级质量检查详情 -->
<template>
  <view class="wrapper addPageBg">
    <u-navbar :leftText="editTitle" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="content">
      <view>
        <!-- <view>
          <view class="form-title">上级单位</view>
          <view class="select" @click="subentryShow = true">
            <view class="name">{{ subentryData.label }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
          </view>
          <u-picker :show="subentryShow" :columns="[subentryList]" keyName="label" @cancel="subentryClose"
            @confirm="subentryconfirm"></u-picker>
        </view> -->
        <view class="add-inputs">
          <view class="inputs-label">检查单位</view>
          <view class="inputs-content">
            <u--textarea v-model="inspectUnitName" placeholder="请输入内容" autoHeight maxlength="250" border="none"></u--textarea>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">参加单位</view>
          <view class="inputs-content">
            <u--textarea v-model="companyName" placeholder="请输入内容" autoHeight maxlength="250" border="none"></u--textarea>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">参加人员</view>
          <view class="inputs-content">
            <u--textarea v-model="participantName" placeholder="请输入内容" autoHeight maxlength="50" border="none"></u--textarea>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">检查主题</view>
          <view class="inputs-content">
            <u--textarea v-model="rowData.inspectName" placeholder="请输入内容" autoHeight maxlength="50" border="none"></u--textarea>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">检查时间</view>
          <view class="inputs-content select" @click="dateShow = true">
            <view class="name">{{ presentationTime }}</view>
            <u-icon name="calendar-fill" class="icons" color="#2a82e4" size="12"></u-icon>
          </view>
          <u-datetime-picker :show="dateShow" v-model="value1" @cancel="dateShow = false" @confirm="dateSelect"
            mode="date"></u-datetime-picker>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">检查内容</view>
          <view class="inputs-content">
            <u--textarea v-model="rowData.content" placeholder="请输入内容" autoHeight  border="none"></u--textarea>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">附件</view>
          <view class="inputs-fileList">
            <view class="inputs-fileList-item" v-for="(item, index) in fileList" :key="index">
              <view class="left">
                <u-icon class="icons" name="file-text" size="28"></u-icon>
                <view class="name text-hidden">{{ item.enclosureName }}</view>
              </view>
              <view class="file-closeBtn close" @click="delFile(item, index)"></view>
            </view>
          <view class="fileListBtn">
            <lsj-upload ref="lsjUpload1" childId="upload2" :option="option" :size="size"
              :formats="formats" :debug="debug" :count="10" :nowCount="fileList.length" :instantly="instantly"
              @change="onChange" @progress="onprogress" @uploadEnd="onuploadEnd">
              <view class="addBtn" >上传附件</view>
            </lsj-upload>
          </view>
          </view>
        </view>
      </view>
      <view style="height:100rpx"></view>
      <view class="popup-footer" style="justify-content: space-between; width: 100%">
        <view class="btns">
          <u-button class="btn-iem" text="取消" @click="download"  style="background-color:#eeeeee"></u-button>
        </view>
        <view class="btns">
          <u-button class="btn-iem" type="primary" text="确认" @click="submit" style="background-color:#1576e6"></u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import moment from "moment";
import request from "@/common/request";
export default {
  data() {
    return {
      show: false,
      // columns: [],
      // receivingType: { weatherCode: "", weatherStats: "" },
      editTitle: "",
      subentryList: [
        { label: "建设单位(业主方)", id: "2" },
        { label: "监理公司", id: "3" },
        { label: "施工单位", id: "4" },
        { label: "其它", id: "5" },
      ],
      subentryShow: false,
      subentryData: {
        label: "",
        pkId: "",
      },
      rowData: {},
     
      fileList: [],
      appShow: true,
      selecValue: "",
      clickCheck: false,
      // 上传接口参数
      option: {
        // 上传服务器地址，此地址需要替换为你的接口地址
        url: request.baseUrl + "/app/file/upload/picture",
        // 上传附件的key
        name: "file",
        // 根据你接口需求自定义请求头,默认不要写content-type,让浏览器自适配
        header: {
          // 示例参数可删除
          'Authorization': uni.getStorageSync("token"),
        },
        // 根据你接口需求自定义body参数
        // formData: {
        // 	// 'orderId': 1000
        // }
      },

      // 选择文件后是否立即自动上传，true=选择后立即上传
      instantly: true,
      // 必传宽高且宽高应与slot宽高保持一致
      width: "150rpx",
      height: "40rpx",
      // 限制允许上传的格式，空串=不限制，默认为空
      formats: "",
      // 文件上传大小限制
      size: 30,
      // 文件回显列表
      files: new Map(),
      // 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
      wxFiles: [],
      // 是否打印日志
      debug: false,
      previewShow: false,
      previewUrl: "",
      presentationTime: "",
      value1: new Date() + '',
      dateShow: false,
      companyName: "",
      participantName:"",
      inspectUnitName:""
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);
    if (this.rowData.type == 1) {
      this.rowData.describeContent = "";
      this.editTitle = "新增上级质量检查";
    } else {
      console.log(this.rowData);
      this.editTitle = "编辑上级质量检查";
      this.subentryData.id = this.rowData.inspectType
      this.subentryList.forEach(item => {
        console.log('this.rowData.inspectType ==Number(item.id) -----> ', this.rowData.inspectType, item.id);
        if (this.rowData.inspectType == item.id) {
          this.subentryData.label = item.label
          console.log('this.subentryData.label -----> ', this.subentryData.label);
        }
      })
      this.companyName = this.rowData.companyName
      this.participantName = this.rowData.participantName
      this.inspectUnitName = this.rowData.inspectUnitName
      this.presentationTime = this.rowData.inspectTime
      this.fileList = this.rowData.enclosures;

      // this.receivingType = {
      //   weatherCode: this.rowData.weatherCode,
      //   weatherStats: this.rowData.weatherCodeName,
      // };
    }
    // this.init()
    // this.weatherStatsAllList();
    // this.searchItemsByOrgId();
  },
  methods: {
    dateSelect(e) {
      this.presentationTime = moment(e.value).format("YYYY-MM-DD");
      this.dateShow = false;
    },
    close() {
      this.show = false;
    },
    // confirm(val) {
    //   this.receivingType = val.value[0];
    //   this.show = false;
    // },
    subentryClose() {
      this.subentryShow = false;
    },
    subentryconfirm(e) {
      this.subentryData = e.value[0];
      this.subentryShow = false;
      let data = {
        type: ""
      }
      if (this.subentryData.label == "建设单位(业主方)") {
        data.type = 0
      } else if (this.subentryData.label == "监理公司") {
        data.type = 1
      } else if (this.subentryData.label == "施工单位") {
        data.type = 3
      } else if (this.subentryData.label == "其它") {
        data.type = 4
      } else if (this.subentryData.label == "设计院") {
        data.type = 2
      }
      this.$api.searchByCompanyType(data).then(res => {
        if (res.code == 200) {
          this.companyName = res.data
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      })
    },
    // weatherStatsAllList() {
    //   this.$api.weatherStatsAllList().then((res) => {
    //     if (res.code == 200) {
    //       // console.log(res);
    //       this.columns = [res.data];
    //     } else {
    //       uni.showToast({ icon: "none", title: res.msg });
    //     }
    //   });
    // },
    // searchItemsByOrgId() {
    //   this.$api.searchItemsByOrgId().then((res) => {
    //     if (res.code == 200) {
    //       this.subentryList = [res.data];
    //     } else {
    //       uni.showToast({ icon: "none", title: res.msg });
    //     }
    //   });
    // },
    onChange(e) {
      console.log("改变事件", e);
    },
    onprogress(e) {
      console.log("中途事件", e);
    },

    onuploadEnd(e) {
      console.log("结束事件", e);
      if (e.responseText) {
        let res = JSON.parse(e.responseText);
        if (res.code === 200) {
          this.fileList.push({
            enclosureName: e.name,
            enclosureUrl: res.data,
          });
        }
      }
      console.log(this.fileList);
    },
    // 取消
    download() {
      // uni.navigateTo({
      //   url: "/pages/quality/manage?",
      // });
      // let pages = getCurrentPages()
      // let prevPage = pages[pages.length - 2]; // 上一页面实例
      // prevPage.$vm.searchPage()
      uni.navigateBack({ delta: 1 });
    },
    // 确定提交
    submit() {
      let data = {
        companyName: this.companyName,
        content: this.rowData.content,
        hierarchyType: 1,
        inspectName: this.rowData.inspectName,
        inspectTime: this.presentationTime,
        inspectType: this.subentryData.id,
        hierarchyType: 1,
        enclosures: this.fileList,
        participantName:this.participantName,
        inspectUnitName:this.inspectUnitName,
      };
      if(this.companyName == undefined || this.companyName == null || this.companyName.length == 0){
        return  uni.showToast({ icon: "none", title:"请输入参加单位名称" });
      }
      if (this.editTitle == "新增上级质量检查") {
        this.$api.firstQualityAdd(data).then((res) => {
          if (res.code == 200) {
            // uni.navigateTo({
            //   url: "/pages/quality/check?",
            // });
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh()
            uni.navigateBack({ delta: 1 });
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
      } else {
        data.pkId = this.rowData.pkId;
        this.$api.firstQualityUpdate(data).then((res) => {
          if (res.code == 200) {
            // uni.navigateTo({
            //   url: "/pages/quality/check?",
            // });
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh()
            uni.navigateBack({ delta: 1 });
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
      }
    },
    delFile(row, index) {
      this.fileList.splice(index, 1);
      this.$refs.lsjUpload1.clear(row.enclosureName);
    },
  },
};
</script>

<style lang="scss" scoped>
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
  //margin-bottom: 20rpx;
  font-weight: 600;
  font-size: 30rpx;
  overflow: hidden;
  /*超出部分隐藏*/
  white-space: nowrap;
  /*禁⽌换⾏*/
  text-overflow: ellipsis;
  /*省略号*/
}

.popup-footer {
  position: fixed;
  bottom: 0;
  display: flex;
  width: 660rpx;
  height: 100rpx;

  // background-color: rgb(194, 155, 155);
  .btns {
    //padding: 12rpx;
    flex: 1;
    .btn-iem{
      height: 100rpx;
    }
  }
}

.upload-btn {
  width: 150rpx;
  height: 40rpx;
  text-align: center;
  line-height: 40rpx;
  font-size: 24rpx;
  color: #5084fe;
  background-color: #dfedff;
  border-radius: 6rpx;
}

.fileList-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60rpx;
  background-color: #fff;
  border-bottom: 1px solid #eee;

  .left {
    display: flex;
    align-items: center;
  }

  .fileName {
    width: 500rpx;
  }

  .file-closeBtn {
    width: 60rpx;
    color: red;
  }
}

.text-hidden {
  overflow: hidden;
  /*超出部分隐藏*/
  white-space: nowrap;
  /*禁⽌换⾏*/
  text-overflow: ellipsis;
  /*省略号*/
}

/deep/ .u-input__content[data-v-fdbb9fe6] {
  padding-left: 10px;
}
</style>
