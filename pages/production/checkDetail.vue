<template>
  <view class="wrapper">
    <u-navbar
      leftText="检测详情"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="sticky" v-if="type === 1&&tabList.length">
      <u-tabs
        :list="tabList"
        :current="current"
        @change="currentChange"
        :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
      >
        <view slot="right" class="hamburg" @tap="hamburg" v-if="tabList.length > 4"
          ><u-icon name="list" size="21" bold></u-icon
        ></view>
      </u-tabs>
      <view class="pull-down" v-show="tabShow">
        <text
          class="item-tab"
          :class="index == current ? 'action' : ''"
          v-for="(item, index) in tabList"
          :key="index"
          @click="listSelet(item, index)"
          >{{ item.name }}</text
        >
        <!-- 箭头 -->
        <u-icon
          name="arrow-up"
          color="#dddddd"
          size="20"
          class="arrow-up"
          @click="shut"
        ></u-icon>
      </view>
    </view>
    <view class="pad" v-if="type === 1&&tabList.length"></view>
    <view class="content">
      <u--form
        labelPosition="left"
        :borderBottom="true"
        labelWidth="80"
        class="form"
      >
        <u-form-item label="检测编号：">
          <view v-if="type === 1">{{ sendObj.orderCode }}</view>
          <u--input
            v-model="sendObj.orderCode"
            :maxlength="maxlength"
            :disabled="allowModify !== 0"
            border="none"
            v-else
          ></u--input>
        </u-form-item>
        <u-form-item label="入库单号：">
          <view>{{ getObj.orderCode }}</view>
        </u-form-item>
        <u-form-item label="龄期：">
          <view>{{ sendObj.ageTerm }}</view>
        </u-form-item>
        <u-form-item label="检测人：">
          <view v-if="type === 1">{{ sendObj.inspectorName }}</view>
          <u--input
            v-model="sendObj.inspectorName"
            border="none"
            v-else
          ></u--input>
        </u-form-item>
        <u-form-item label="检测时间：" @click="openDateSelect">
          <view>{{ sendObj.serviceTime }}</view>
        </u-form-item>
      </u--form>
      <view class="approve-files">
        <view class="approve-files-head">
          <h5>附件：</h5>
          <lsj-upload
            ref="lsjUpload1"
            childId="upload2"
            :width="width"
            :height="height"
            :option="option"
            :size="size"
            :formats="formats"
            :debug="debug"
            :count="10"
            :nowCount="fileList.length"
            :instantly="instantly"
            @change="onChange"
            @progress="onprogress"
            @uploadEnd="onuploadEnd"
            v-if="type === 2"
          >
            <view class="upload-btn" :style="{ width: width, height: height }"
              >上传附件</view
            >
          </lsj-upload>
        </view>
        <view class="fileList" v-if="!!fileList.length">
          <view
            class="fileList-item"
            v-for="(item, index) in fileList"
            :key="index"
          >
            <view class="left" @click="preview(item)">
              <u-icon class="icons" name="../../static/fileImg/file-excel.png" size="25"></u-icon>
              <view class="fileName text-hidden">{{ item.enclosureName }}</view>
            </view>
            <view
              class="file-closeBtn"
              v-if="type === 2"
              @click="delFile(item, index)"
              >X</view
            >
          </view>
        </view>
        <view class="file-empty" v-else>暂无附件</view>
      </view>
    </view>
    <view class="check-report">
      <h5 class="head">检测报告：</h5>
      <u--textarea
        v-model="sendObj.reports"
        placeholder="请输入内容"
        v-if="type === 2"
      ></u--textarea>
      <view class="content" v-else>{{ sendObj.reports }}</view>
    </view>
    <view class="materDetail">
      <h5 class="head">检测物料信息：</h5>
      <view class="table_detail">
        <table>
          <thead>
            <tr>
              <th>物料名称</th>
              <th>物料类型</th>
              <th>检测结果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in materialList" :key="index">
              <td>{{ item.materialName }}</td>
              <td>{{ item.materialTypeName }}</td>
              <td>
                <easy-select
                  ref="easySelect"
                  size="mini"
                  :value="item.detectionCodeName"
                  @selectOne="selectOne($event, item)"
                  :options="options"
                  v-if="type === 2"
                ></easy-select>
                <text v-if="type === 1">{{
                  item.detectionCode === "0"
                    ? "检测中"
                    : item.detectionCode === "1"
                    ? "合格"
                    : item.detectionCode === "2"
                    ? "不合格"
                    : ""
                }}</text>
              </td>
            </tr>
          </tbody>
        </table>
      </view>
    </view>
    <view class="pdb"></view>
    <view
      class="btn"
      v-show="$menuPerm('production:detector:check')" 
      v-if="type === 1 && getObj.detectionCode === '检测中'"
      @click="checkBtn"
      >检测</view
    >
    <view class="footer" v-if="type === 2">
      <view class="footerBtn cancel" @click="cancel" >取消</view>
      <view class="footerBtn add" @click="saveOk">确认</view>
    </view>
    <!-- 预览弹框 -->
    <u-popup
      :show="previewShow"
      mode="center"
      round="10"
      closeable
      @close="closePreview"
    >
      <view class="preview">
        <view class="preview-top">预览</view>
        <pdf
          :fileUrl="previewUrl"
          :iframeStyle="{ width: '700rpx', height: '1080rpx' }"
          :imgs="false"
        ></pdf>
      </view>
    </u-popup>
    <!-- 日期选择器 -->
    <u-datetime-picker
      :show="dateSelectShow"
      v-model="dates"
      mode="datetime"
      @confirm="dateSelect"
      @cancel="closeDateSelect"
    ></u-datetime-picker>
  </view>
</template>

<script>
import request from "@/common/request";
import pdf from "../../components/pdf-preview.vue";
import moment from "moment";
export default {
  components: { pdf },
  onLoad(options) {
    let obj = JSON.parse(options.obj);
    console.log(obj);
    this.getObj = obj;
    if(options.no){
      this.no=true
    }
    //detectionCode 待检测,检测合格,检测不合格,检测中
    if(this.$menuPerm('production:detector:check')){
      this.type = obj.detectionCode === "待检测" ? 2 : 1;
      if (this.type === 1) {
      this.findDetectionByInputId();
      } else {
        this.getBusinessCode();
        this.findInputById();
      }
    }else{
      this.type =1
      this.findDetectionByInputId();
    }
    console.log(this.type);
    
  },
  onBackPress(e) {
    if (this.clickCheck) {
      this.findDetectionByInputId();
      this.clickCheck = false;
      this.type = 1;
      return true;
    }
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  data() {
    return {
      type: 1, //1为查看，2为检测
      dates: Number(new Date()),
      date: "",
      getObj: {},
      sendObj: {
        fkInventoryId: "",
        inspectorName: "",
        orderCode: "",
        reports: "",
        serviceTime: "",
        ageTerm: "",
        enclosures: [],
        detectionDetails: [],
      },
      maxlength: 1000,
      allowModify: 0,
      dateSelectShow: false,
      tabList: [],
      options: [
        { label: "合格", value: 1 },
        { label: "不合格", value: 2 },
      ],
      current: 0,
      tabShow: false,
      materialList: [],
      fileList: [],
      appShow: true,
      selecValue: "",
      clickCheck: false,
      no:false,
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
    };
  },
  methods: {
    getBusinessCode() {
      this.$api.getBusinessCode({ businessType: 10 }).then((res) => {
        if (res.code === 200) {
          this.sendObj.orderCode = res.data.typeCode;
          this.maxlength = res.data.limitNum;
          this.allowModify = res.data.allowModify;
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    findDetectionByInputId() {
      let api =this.no?this.$api.findCheckByInputId:this.$api.findDetectionByInputId
      api({ inputId: this.getObj.pkId })
        .then((res) => {
          if (res.code === 200) {
            this.tabList = res.data.map((item) => ({
              ...item,
              name: item.ageTerm,
            }));
            this.sendObj.orderCode = res.data[0].orderCode;
            this.sendObj.ageTerm = res.data[0].ageTerm;
            this.sendObj.inspectorName = res.data[0].inspectorName;
            this.sendObj.serviceTime = res.data[0].serviceTime;
            this.sendObj.reports = res.data[0].reports;
            this.fileList = res.data[0].enclosures;
            this.materialList = res.data[0].detectionDetails;
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {});
    },
    findInputById() {
      uni.showLoading({ mask: true });
      this.$api
        .findInputById({ pkId: this.getObj.pkId })
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.sendObj.fkInventoryId = this.getObj.pkId;
            this.sendObj.inspectorName = this.user.userName;
            this.sendObj.serviceTime = moment(Date.now()).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            this.sendObj.ageTerm = this.getObj.ageTerm;
            this.fileList =[]
            this.sendObj.reports =''
            this.materialList = res.data.detailsVoList.map((item) => ({
              ...item,
              materialTypeName: item.fkTypeName,
              detectionCode: "",
              detectionCodeName: "",
            }));
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    addDetection() {
      let data = {
        ...this.sendObj,
        detectionDetails: this.materialList.map((item) => ({
          detectionCode: item.detectionCode,
          fkDetailsId: item.pkId,
        })),
        enclosures: this.fileList,
      };
      console.log(data);
      if (!data.inspectorName) {
        return uni.showToast({ title: "请填写检测人名称", icon: "none" });
      }
      if (!data.orderCode) {
        return uni.showToast({ title: "请填写检测单编码", icon: "none" });
      }
      if (!data.serviceTime) {
        return uni.showToast({ title: "请选择检测时间", icon: "none" });
      }
      for (let i = 0; i < data.detectionDetails.length; i++) {
        if (!data.detectionDetails[i].detectionCode) {
          return uni.showToast({ title: "有物料未选择检测结果", icon: "none" });
        }
      }
      uni.showLoading({ mask: true });
      this.$api
        .addDetection(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.showToast({ title: "检测成功", icon: "success" });
            this.clickCheck = false;
            this.cancel();
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    currentChange(e) {
      this.current = e.index;
      this.sendObj.orderCode = e.orderCode;
      this.sendObj.ageTerm = e.ageTerm;
      this.sendObj.inspectorName = e.inspectorName;
      this.sendObj.serviceTime = e.serviceTime;
      this.sendObj.reports = e.reports;
      this.fileList = e.enclosures;
      this.materialList = e.detectionDetails;
    },
    listSelet(item, index) {
      // 展开传值
      this.current = index;
      this.tabShow = false;
      this.sendObj.orderCode = item.orderCode;
      this.sendObj.ageTerm = item.ageTerm;
      this.sendObj.inspectorName = item.inspectorName;
      this.sendObj.serviceTime = item.serviceTime;
      this.sendObj.reports = item.reports;
      this.fileList = item.enclosures;
      this.materialList = item.detectionDetails;
    },
    // 汉堡点击展开tabs
    hamburg() {
      this.tabShow = !this.tabShow;
    },
    shut() {
      this.tabShow = false;
    },
    delFile(row, index) {
      this.fileList.splice(index, 1);
      this.$refs.lsjUpload1.clear(row.enclosureName);
    },
    selectOne(e, item) {
      console.log(e, item);
      this.$set(item, "detectionCode", e.options.value);
      this.$set(item, "detectionCodeName", e.options.label);
    },
    checkBtn() {
      this.findInputById();
      this.getBusinessCode();
      this.type = 2;
      this.clickCheck = true;
    },
    saveOk() {
      this.addDetection();
    },
    cancel() {
      this.type = 1;
      if (this.clickCheck) {
        this.findDetectionByInputId();
        this.clickCheck = false;
      } else {
        uni.navigateBack({ delta: 1 });
      }
    },
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
    preview(item) {
      this.$checkName(item.enclosureUrl)
      return
      this.previewUrl = item.enclosureUrl;
      this.previewShow = true;
    },
    closePreview() {
      this.previewShow = false;
      this.previewUrl = "";
    },
    openDateSelect() {
      this.dates = Date.now() - 0;
      this.dateSelectShow = true;
    },
    dateSelect(e) {
      this.dates = e.value;
      this.sendObj.serviceTime = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
      this.closeDateSelect();
    },
    closeDateSelect() {
      this.dateSelectShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.pad {
  padding-top: 98rpx;
}
.pdb {
  height: 100rpx;
}
.hamburg {
  padding-left: 4rpx;
  border-left: 1px solid #d5d0d0;
}
.pull-down {
  width: 100%;
  color: #d5d9df;
  font-size: 28rpx;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: absolute;
  top: 0;
  z-index: 999;
  background: #fff;
  border-radius: 0 0 20rpx 20rpx;
  .item-tab {
    width: 33.33%;
    padding: 29rpx;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
// 下拉选中颜色
.action {
  color: #203457;
}
.arrow-up {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form {
  padding: 20rpx 20rpx 40rpx;
  margin-bottom: 10rpx;
  background-color: #fff;
}
.u-form-item {
  border-bottom: 1px solid #eee;
}
.approve-files {
  padding: 40rpx 20rpx;
  background-color: #fff;
  margin-bottom: 10rpx;
  .approve-files-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60rpx;
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
.file-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60rpx;
  font-size: 26rpx;
  color: #ccc;
  background-color: #fff;
}
.text-hidden {
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁⽌换⾏*/
  text-overflow: ellipsis; /*省略号*/
}
.check-report {
  padding: 40rpx 20rpx;
  background-color: #fff;
  margin-bottom: 10rpx;
  .head {
    margin-bottom: 10rpx;
  }
  .content {
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // height: 60rpx;
    color: #d2d6dd;
    font-size: 26rpx;
  }
}
.preview {
  width: 700rpx;
  height: 1200rpx;
  overflow: hidden;
  .preview-top {
    height: 100rpx;
    line-height: 100rpx;
    padding-left: 40rpx;
  }
}
.btn {
  z-index: 10;
}
.materDetail {
  padding: 40rpx 20rpx;
  background-color: #fff;
  margin-bottom: 10rpx;
  .head {
    margin-bottom: 10rpx;
  }
  th {
    z-index: 2;
  }
}
.h-400 {
  height: 400rpx;
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  height: 100rpx;
  z-index: 10;
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
.table_detail{
  min-height: 300rpx;
  max-height: 800rpx;
}
</style>
