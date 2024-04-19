<!-- 工程图纸详情 -->
<template>
  <view class="wrapper">
    <u-navbar leftText="日志详情" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="content">
      <u--form labelPosition="left" style="background: #fff; padding: 12px" :model="rowData" ref="form1">
        <u-form-item label="填表人:" labelWidth="100" prop="userInfo.name" borderBottom ref="item1">
          {{ rowData.userName }}
        </u-form-item>
        <u-form-item label="填表日期:" labelWidth="100" prop="userInfo.name" borderBottom ref="item1">
          {{ rowData.time }}
        </u-form-item>
        <u-form-item label="填表时间:" labelWidth="100" prop="userInfo.name" borderBottom ref="item1">
          {{ rowData.data }}
        </u-form-item>
        <u-form-item label="当前温度:" labelWidth="100" prop="userInfo.name" borderBottom ref="item1">
          {{ rowData.temperature + '°C' }}
        </u-form-item>
        <u-form-item label="当前天气:" labelWidth="100" prop="userInfo.name" borderBottom ref="item1">
          {{ rowData.weatherCodeName }}
        </u-form-item>
        <u-form-item label="当前风力:" labelWidth="100" prop="userInfo.name" borderBottom ref="item1">
          {{ rowData.windGradeName }}
        </u-form-item>
      </u--form>
      <u--form labelPosition="left" style="background: #fff; padding: 12px; margin-top: 4px" :model="rowData" ref="form1">
        <u-form-item label="日志内容:" labelWidth="100" prop="userInfo.name" borderBottom ref="item1">
          {{ rowData.content }}
        </u-form-item>
      </u--form>
      <view class="file-set">
        <view>查看文件：</view>
        <view class="file-set-list" v-for="(item, idx) in rowData.enclosures" :key="idx">
          <u-icon class="file-set-lef" name="file-text"></u-icon>
          <text>{{ item.enclosureName }}</text>
          <u-icon @click="itemClick(item)" name="arrow-right" class="file-set-right"></u-icon>
        </view>
      </view>
    </view>
    <view class="footer">
      <view type="primary" class="footerBtn add" @click="edit" v-if="$auth('production:log:update')&&rowData.editStatus">编辑</view>
      <view type="error" class="footerBtn error" @click="expurgate" v-if="$auth('production:log:delete')&&rowData.deleteStatus">删除</view>
    </view>

    <!-- 预览 -->
    <u-popup :show="previewShow" mode="center" round="10" closeable @close="closePreview">
      <view class="preview">
        <view class="preview-top">预览</view>
        <pdf :fileUrl="previewUrl" :iframeStyle="{ width: '700rpx', height: '1080rpx' }" :imgs="false"></pdf>
      </view>
    </u-popup>
  </view>
</template>

<script>
import pdf from "../../components/pdf-preview.vue";
export default {
  components: { pdf },
  data() {
    return {
      rowData: {
        enclosures: [],
      },
      previewShow: false,
      previewUrl: "",
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);
    this.init();
  },
  methods: {
    itemClick(row) {
      // console.log("--------------------")
      // console.log(row);
      // console.log("--------------------")
      // return
      this.$checkName(row.enclosureUrl)
      return
      this.previewUrl = row.enclosureUrl;
      this.previewShow = true;

    },
    expurgate(){
      // prodConstructionJournalDelete
      uni.showModal({
				title: "提示",
				content: "确定删除该日志?",
				showCancel: true,
				cancelText: "取消",
				confirmText: "确定",
				success: res => {
					if (res.confirm) {
						this.$api.prodConstructionJournalDelete({pkId:this.rowData.pkId}).then(res => {
							if (res.code === 200) {
								uni.showToast({
									title: "删除成功",
									icon: "success"
								});
								let pages = getCurrentPages()
								let prevPage = pages[pages.length - 2]; // 上一页面实例
								prevPage.$vm.init()
								uni.navigateBack(1);
							} else {
								uni.showToast({
									title: res.msg,
									icon: "none"
								});
							}
						});
					} else {
						// 否则点击了取消
					}
				}
			});

    },
    closePreview() {
      this.previewShow = false;
      this.previewUrl = "";
    },
    init() {
      this.$api
        .constructionLogSelectById({ pkId: this.rowData.pkId })
        .then((res) => {
          if (res.code == 200) {
            this.rowData = res.data;
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
    },
    edit() {
      let data = { ...this.rowData };
      data.type = 2;
      uni.navigateTo({
        url: "/pages/production/addLog?row=" + JSON.stringify(data),
      });
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
  margin-bottom: 20rpx;
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
  height: 80rpx;

  // background-color: rgb(194, 155, 155);
  .btns {
    //padding: 12rpx;
    flex: 1;
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

.file-set {
  background: #fff;
  padding: 12px;
  margin-top: 4px;

  .file-set-list {
    position: relative;
    line-height: 35px;
    border-bottom: 1px solid #eee;

    .file-set-lef {
      display: inline-block;
    }

    .file-set-right {
      position: absolute;
      right: 0;
      top: 8px;
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
  .error {
    background-color: #f01528;
    color: #fff;
  }
  .add {
    background-color: #1576e6;
    color: #fff;
  }
}
/deep/.u-form-item__body__right__content__slot{
  word-break: break-all
}
</style>
