<!-- 质量日常管理详情 -->
<template>
  <view class="wrapper addPageBg">
    <u-navbar :leftText="editTitle" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="content">
      <view>
        <view class="add-inputs">
          <view class="inputs-label">分项选择</view>
          <view class="inputs-content select" @click="subentryShowClick">
            <view class="name">{{ subentryData.itemName }}</view>
            <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
          </view>
          <!-- <u-picker :show="subentryShow" :columns="subentryList" keyName="itemName" @cancel="subentryClose"
            @confirm="subentryconfirm"></u-picker> -->
          <u-popup :show="subentryShow" @close="subentryShow = false">
            <view class="selectShow">
              <view class="head">
                <view class="name">分项工程</view>
                <view class="closeBtn" @click="requestConfirmation" style="color: #3c9cff">确认</view>
              </view>
              <view class="content">
                <tree ref="weert" class="price-amount" :selectedData="viewAuthorize" :multiple="false" :selectParent="false"
                  :associatedNode="false" :disabled="false" :wipeStatus="true" :localdata="subentryList" valueKey="pkId"
                  textKey="itemName" childrenKey="children"></tree>
              </view>
            </view>
          </u-popup>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">描述</view>
          <view class="inputs-content">
            <u--textarea v-model="rowData.describeContent" placeholder="请输入内容" autoHeight maxlength="3000" border="none"></u--textarea>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">附件</view>
          <!-- <view
            v-for="(item, idx) in fileList"
            :key="idx"
            style="padding-left: 6px;background: #fff"
          >
            <u-icon name="account" style="display: inline-block"></u-icon>
            <text style="width: 70%;overflow: hidden;">{{ item.enclosureName }}</text>
          </view> -->
          <view class="inputs-fileList">
            <view class="inputs-fileList-item" v-for="(item, index) in fileList" :key="index">
              <view class="left">
                <u-icon class="icons" name="file-text" size="20"></u-icon>
                <view class="name text-hidden">{{ item.enclosureName }}</view>
              </view>
              <view class="close" @click="delFile(item, index)"></view>
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
      <view class="popup-footer" style="justify-content: space-between; width: 100%">
        <view class="btns">
          <u-button class="btn-iem" text="取消" @click="download" style="background-color:#eeeeee"></u-button>
        </view>
        <view class="btns">
          <u-button class="btn-iem" type="primary" text="确认" @click="submit" style="background-color:#1576e6"></u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import request from "@/common/request";
import tree from "../../components/ba-tree-picker-radio/ba-tree-picker.vue"
export default {
  components: { tree },
  data() {
    return {
      show: false,
      columns: [],
      receivingType: { weatherCode: "", weatherStats: "" },
      editTitle: "",
      subentryList: [],
      subentryShow: false,
      subentryData: {
        itemName: "",
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
      viewAuthorize: [],
      // receiverDataList: {
      //   itemName:""
      // }
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);
    if (this.rowData.type == 1) {
      this.rowData.describeContent = "";
      this.editTitle = "新增记录";
    } else {
      console.log(this.rowData);
      this.editTitle = "编辑日志";
      this.subentryData = {
        pkId: this.rowData.fkItemId,
        itemName: this.rowData.itemName,
      };
      if(this.rowData.fkItemId !=undefined &&this.rowData.fkItemId !=null && this.rowData.fkItemId.length != 0){
        this.viewAuthorize = [this.rowData.fkItemId]
      }else{
        this.viewAuthorize = []
      }
     
      this.fileList = this.rowData.enclosures

      this.receivingType = {
        weatherCode: this.rowData.weatherCode,
        weatherStats: this.rowData.weatherCodeName,
      };
    }
    // this.init()
    this.weatherStatsAllList();
    // this.searchItemsByOrgId();
    this.getSearchItemsByProjectId()
  },
  methods: {
    empty(){
      this. subentryData = {
        itemName:"",
        pkId:""
      }
      this.viewAuthorize = []
    },
    // 接收单位
    requestConfirmation() {
      this.subentryData = {}
      this.viewAuthorize = this.$refs.weert._confirm()
      let arr = this.flatTreeData(this.subentryList)
      arr.forEach(item => {
        this.viewAuthorize.forEach(e => {
          if (item.pkId == e) {
            this.subentryData = item
          }
        })
      })
      this.subentryShow = false;
    },
    subentryShowClick(){
      this.subentryShow = true
      this.$nextTick(() => {
        this.$refs.weert._initTree();
      })
    },
    flatTreeData(list) {
      const res = []
      function getData(list) {
        list.forEach(item => {
          res.push(item);
          if (item.children) {
            getData(item.children)
          }
        })
      }
      getData(list)
      return res
    },
    getSearchItemsByProjectId() {
      let data = {
        fkOrgId: uni.getStorageSync("user").orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
      }
      this.$api.getSearchItemsByProjectId(data).then(res => {
        if (res.code == 200) {
          this.subentryList = res.data
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      })
    },
    close() {
      this.show = false;
    },
    confirm(val) {
      this.receivingType = val.value[0];
      this.show = false;
    },
    subentryClose() {
      this.subentryShow = false;
    },
    subentryconfirm(e) {
      this.subentryData = e.value[0];
      this.subentryShow = false;
    },
    weatherStatsAllList() {
      this.$api.weatherStatsAllList().then((res) => {
        if (res.code == 200) {
          // console.log(res);
          this.columns = [res.data];
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    // searchItemsByOrgId() {
    //   this.$api.searchItemsByOrgId().then((res) => {
    //     if (res.code == 200) {
    //       let arr = res.data.filter(item => item.grade == 3)
    //       this.subentryList = [arr]
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
      // let pages = getCurrentPages()
      // let prevPage = pages[pages.length - 2]; // 上一页面实例
      // prevPage.$vm.resh()
      uni.navigateBack({ delta: 1 });
    },
    // 确定提交
    submit() {
      let data = {
        describeContent: this.rowData.describeContent,
        fkItemId: this.subentryData.pkId,

        hierarchyType: 1,
        // weatherCode: this.receivingType.weatherCode,
        enclosures: this.fileList,
      };
      if (this.editTitle == "新增记录") {
        this.$api
          .safetyDailyAdd(data)
          .then((res) => {
            if (res.code == 200) {
              // uni.navigateTo({
              //   url: "/pages/quality/manage?",
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
        this.$api.safetyDailyUpdate(data).then((res) => {
          if (res.code == 200) {
            // uni.navigateTo({
            //   url: "/pages/quality/manage?",
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
.selectShow {
  height: 800rpx;

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    // line-height: 80rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
  }

  .content {
    border-top: 1px solid;
    height: 720rpx;
    overflow: auto;
  }
}
</style>
