<template>
  <view class="wrapper">
    <u-navbar
      leftText="单位工程质量检测评定表"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <view style="background: #fff">
        <u-tabs class="tabs" :list="list1" @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"> </u-tabs>
      </view>

      <view v-show="current == 0">
        <u--form
          labelPosition="left"
          style="background: #fff; padding: 12px; margin-top: 4px"
          :model="details"
          ref="form1"
        >
          <u-form-item
            label="单位工程名称:"
            labelWidth="100"
            prop="details.itemName"
            borderBottom
            ref="item1"
          >
            {{ rowData.itemName }}
          </u-form-item>
          <u-form-item
            label="单位工程编号:"
            labelWidth="100"
            prop="userInfo.itemCode"
            borderBottom
            ref="item1"
          >
            {{ details.itemCode }}
          </u-form-item>
          <u-form-item
            label="工程地点及桩号:"
            labelWidth="120"
            prop="userInfo.name"
            borderBottom
            ref="item1"
          >
            {{ details.itemParentName }}
          </u-form-item>
          <u-form-item
            label="所属建设项目(含标段):"
            labelWidth="160"
            prop="userInfo.name"
            borderBottom
            ref="item1"
          >
            {{ details.fkProjectName }}
          </u-form-item>
          <u-form-item
            label="施工单位:"
            labelWidth="100"
            prop="userInfo.name"
            borderBottom
            ref="item1"
          >
            {{ details.contractorName }}
          </u-form-item>
        </u--form>
        <u--form
          labelPosition="left"
          style="background: #fff; padding: 12px; margin-top: 4px"
          :model="details"
          ref="form1"
        >
          <u-form-item
            label="外观质量:"
            labelWidth="100"
            prop="userInfo.name"
            borderBottom
            ref="item1"
          >
            {{ details.quality }}
          </u-form-item>
          <u-form-item
            label="评定资料:"
            labelWidth="100"
            prop="userInfo.name"
            borderBottom
            ref="item1"
          >
            {{ details.evaluateContent }}
          </u-form-item>
          <u-form-item
            label="质量等级:"
            labelWidth="100"
            prop="userInfo.name"
            borderBottom
            ref="item1"
          >
            {{ details.qualityGrade }}
          </u-form-item>
          <u-form-item
            label="评出意见:"
            labelWidth="100"
            prop="userInfo.name"
            borderBottom
            ref="item1"
          >
            {{ details.opinion }}
          </u-form-item>
          <u-form-item
            label="检验负责人:"
            labelWidth="100"
            prop="userInfo.name"
            borderBottom
            ref="item1"
          >
            {{ details.person }}
          </u-form-item>
          <u-form-item
            label="记录:"
            labelWidth="100"
            prop="userInfo.name"
            borderBottom
            ref="item1"
          >
            {{ details.record }}
          </u-form-item>
          <u-form-item
            label="复核:"
            labelWidth="100"
            prop="userInfo.name"
            borderBottom
            ref="item1"
          >
            {{ details.review }}
          </u-form-item>
          <u-form-item
            label="日期:"
            labelWidth="100"
            prop="userInfo.name"
            borderBottom
            ref="item1"
          >
            {{ details.weatherCodeName }}
          </u-form-item>
        </u--form>
      </view>
      <view v-show="current == 1">
        <view
          class="itemList"
          v-for="(item, index) in details.childVos"
          :key="index"
        >
          <view style="" class="box">
            <u-icon name="file-text" size="20" class="left-ico"></u-icon>
            <text class="text-hidden">{{ item.itemName }}</text>
            <view class="right-ico" style="">A</view>
          </view>
          <view class="item-bottom-text">分部工程编号:{{ item.itemCode }}</view>
          <view class="item-bottom-text">质量等级:{{ item.qualityGrade }}</view>
          <view class="item-bottom-text">备注:{{ item.remarks }}</view>
        </view>
      </view>
    </view>
    <!-- <view type="primary" class="btn" @click="derive">导出</view> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      list1: [{ name: "基础信息" }, { name: "分部工程" }],
      materialName: "",
      rowData: {},
      details: {
        childVos: [],
      },
      current: 0,
      itemNameList: [
        {
          fkBidProjectName: "dfsasfasdfas",
          companyName: "sdfgfsdgsdgsd",
          inspectTime: "asdfadsfsa",
        },
        {
          fkBidProjectName: "dfsasfasdfas",
          companyName: "sdfgfsdgsdgsd",
          inspectTime: "asdfadsfsa",
        },
        {
          fkBidProjectName: "dfsasfasdfas",
          companyName: "sdfgfsdgsdgsd",
          inspectTime: "asdfadsfsa",
        },
        {
          fkBidProjectName: "dfsasfasdfas",
          companyName: "sdfgfsdgsdgsd",
          inspectTime: "asdfadsfsa",
        },
        {
          fkBidProjectName: "dfsasfasdfas",
          companyName: "sdfgfsdgsdgsd",
          inspectTime: "asdfadsfsa",
        },
        {
          fkBidProjectName: "dfsasfasdfas",
          companyName: "sdfgfsdgsdgsd",
          inspectTime: "asdfadsfsa",
        },
      ],
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);
    // console.log(this.rowData);
    this.init();
  },
  methods: {
    currentChange(item) {
      this.current = item.index;
      console.log(this.current);
    },
    init() {
      this.$api
        .qualityEvaluationById({ itemId: this.rowData.pkId })
        .then((res) => {
          if (res.code == 200) {
            this.details = res.data;
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
    },
    derive() {
      let data = {
        contractId: this.rowData.pkId,
        materialType: this.list1[this.current].name == "甲供扣款" ? 1 : 0,
      };

      this.$api.contractDetailExportFile(data).then((res) => {
        if (res.code == 200) {
          this.downLoad(res.data);
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    // 下载
    downLoad(url) {
      const downLoadTask = uni.downloadFile({
        url: url, //仅为示例，并非真实的资源
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
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  /deep/ .u-tabs__wrapper__nav__item {
    flex: 1;
  }
}
.search-input {
  margin: 10px;
  background: #fff;
}
.itemList {
  background: #fff;
  margin-top: 4px;
  padding: 6px;
  .item-bottom-text {
    padding: 2px 26px;
    font-size: 10px;
    color: #bbb;
  }
  .text-hidden {
    margin-left: 5px;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*禁⽌换⾏*/
    text-overflow: ellipsis; /*省略号*/
  }
  .box {
    position: relative;
    .left-ico {
      display: inline-block;
    }
    .right-ico {
      background: #43cf7c;
      color: #fff;
      display: inline-block;
      width: 18px;
      text-align: center;
      padding: 0px;
      position: absolute;
      top: 2px;
      right: 12px;
      border-radius: 50%;
    }
  }
}
</style>
