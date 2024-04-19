<!-- 工程图纸详情 -->
<template>
  <view class="wrapper">
    <u-navbar
      :leftText="rowData.drawingName"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <u--form
        labelPosition="left"
        :model="rowData"
        class="item-edit-form"
      >
        <u-form-item
          label="页     数:"
          borderBottom
          labelWidth="80"
          ref="item1"
        >
          {{ rowData.drawingPages +"页" }}
        </u-form-item>
        <u-form-item
          label="备     注:"
          prop="userInfo.sex"
          borderBottom
          ref="item1"
          labelWidth="80"
        >
          {{ rowData.remark }}
        </u-form-item>
      </u--form>
        <!-- 表格 -->
        <uni-table border emptyText="暂无更多数据" style="margin-top: 6px;">
          <!-- 表头行 -->
          <uni-tr>
            <uni-th align="center" width="40" class="fw700">编号</uni-th>
            <uni-th align="center" width="80" class="fw700">工程</uni-th>
            <uni-th align="center" width="80" class="fw700">关联页数</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr v-for="(item, index) in details" :key="index">
            <uni-td align="center">{{ index+1 }}</uni-td>
            <uni-td align="center">{{ item.itemName }}</uni-td>
            <uni-td align="center">
              <view style="text-decoration:underline;color:#2a82e4" @click="pageLick(item)" v-if="(item.beginPage !=null && item.endPage!=null)"> 
                  <text>第</text>
                  <text>{{item.beginPage}}</text>
                  <text>-{{item.endPage}}</text>
                  <text>页</text>
              </view>
            </uni-td>
          </uni-tr>
        </uni-table>
        <view style="height:100rpx"></view>
        <view
        class="popup-footer"
        style="justify-content: space-between; width: 100%"
      >
        <view class="btns">
          <u-button
            class="btn-iem"
            text="下载图纸"
            type="success"
            @click="download"
          ></u-button>
        </view>
        <view class="btns">
          <u-button
            class="btn-iem"
            type="primary"
            text="查看PDF"
            @click="examine"
          ></u-button>
        </view>
      </view>
    </view>
    	<!-- 预览 -->
		<u-popup :show="previewShow" mode="center" round="10" closeable @close="closePreview">
			<view class="preview">
				<view class="preview-top">预览</view>
				<pdf :fileUrl="previewUrl" :iframeStyle="{ width: '700rpx', height: '1080rpx' }" :imgs="false" :page="page"></pdf>
			</view>
		</u-popup>
  </view>
</template>

<script>
import pdf from "../../../components/pdf-preview.vue"
export default {
  components: {pdf },
  data() {
    return {
      rowData: {},
      details: [],
      previewShow:false,
      previewUrl:"",
      page:1
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);
    this.init()
  },
  methods: {
    init() {
      this.$api
        .searchItemsByDrawId({ drawId: this.rowData.pkId })
        .then((res) => {
          if (res.code == 200) {
            this.details = res.data;
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
    },
    download(){
      const downLoadTask = uni.downloadFile({
        url: this.rowData.drawingUrl, //仅为示例，并非真实的资源
        success: (res) => {
          if (res.statusCode === 200) {
            console.log("下载成功", res);
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: function (res2) {
                // var savedFilePath = res.savedFilePath;
                console.log(res2);
                uni.showToast({
                  title: "已保存至" + res2.savedFilePath,
                });
                setTimeout(() => {
                  uni.openDocument({
                    filePath: res2.savedFilePath,
                    success: (result) => {},
                  });
                }, 1000);
              },
            });
          }
        },
      });
    },
    examine(){
      this.page=1
      this.previewUrl = this.rowData.drawingUrl
      this.$checkName(this.previewUrl,this.page)
      return
      this.previewShow = true
    },
    closePreview() {
			this.previewShow = false;
			this.previewUrl = "";
		},
    pageLick(item){
      this.page=item.beginPage
      this.previewUrl = this.rowData.drawingUrl
      this.$checkName(this.previewUrl,this.page)
      return
      this.previewShow = true
    },
  },
};
</script>

<style lang="scss" scoped>
.item-edit-form {
  background: #fff;
  padding: 16px;
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
    height: 100rpx;
    /deep/.btn-iem{
    //  width: 95%;;
    height: 100%;
    border-radius: 0;
    }
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
/deep/.u-form-item__body__right__content__slot{
  word-break: break-all
}
</style>
