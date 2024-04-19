<!-- 质量日常管理 -->
<template>
  <view class="wrapper">
    <u-navbar leftText="安全日常管理" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="content">
      <solarClender @change="change" :markDays="markDays" ref="solarClender" @onDayClick="clickInit"></solarClender>
      <view class="search">
        <view class="left">

          <!-- <view class="separator">|</view>  -->
          <!-- <view class="searchBtn" @click="init">搜索</view> -->
          <view class="search-item" @click="receiverClick">
            <!-- <easy-select ref="easySelect" size="mini" class="easySelect" :value="userName" @selectOne="selectOne"
              :options="yearList"></easy-select> -->
            <!-- <view></view> -->
            {{ receiverDataList.itemName }}

            <u-icon v-if="receiverDataList.itemName.length != 0" @click.native.stop="empty" name="trash-fill"
              class="icons icon" color="#2a82e4" size="16"></u-icon>
            <u-icon v-else name="arrow-down-fill" class="icons " color="#2a82e4" size="12"></u-icon>
          </view>
        </view>
        <view class="right">
          <!-- <view class="screen" @click="openPop">筛选</view> -->
          <view class="search-input"><u-input border="none" v-model="describeContent" placeholder="输入记录内容" maxlength="100">
              <template slot="suffix">
                <u-icon name="search" @click="init" color="#2a82e4"></u-icon>
              </template>
            </u-input></view>
        </view>
      </view>
      <u-list class="box" @scrolltolower="scrolltolower">
        <view v-for="(item, idx) in itemNameList" :key="idx">
          <view class="second-level text-hidden">
            {{ item.itemCode + ' ' + item.itemName }}
          </view>
          <view class="three-level text-hidden" v-for="(e, idx) in item.safetyDailyVos" :key="idx"
            @click="itemExamine(e)">
            <u-icon name="file-text" size="20" color="#2a82e4"></u-icon>
            <view class="desContent">
              <view class="describeContent text-hidden">{{ e.describeContent }}</view>
              <view class="userName">by:{{ e.userName }}</view>
            </view>
          </view>
        </view>
      </u-list>
    </view>
    <u-popup :show="itemShow" mode="bottom" :round="20" @close="closePop" @open="openPops">
      <view class="item-edit">
        <view class="tem-edit-title">
          {{ contractDetails.itemName }}
          <u-icon name="close" color="#fff" @click="closePop" class="tem-edit-ico"></u-icon>
        </view>
        <view>
          <u--form labelPosition="left" :model="contractDetails" class="item-edit-form">
            <u-form-item label="填表人:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
              {{ contractDetails.userName }}
            </u-form-item>
            <u-form-item label="填表日期:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
              {{ contractDetails.createTime }}
            </u-form-item>
            <u-form-item label="记录类型:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
              {{ contractDetails.inspectTypeName }}
            </u-form-item>
            <u-form-item label="分项工程:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
              {{ contractDetails.itemName }}
            </u-form-item>
            <u-form-item label="记录:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
              {{ contractDetails.describeContent }}
            </u-form-item>
          </u--form>
        </view>
        <view style="background: #f6f6fc; height: 5px; margin-top: 20px">
        </view>
        <view style="padding: 8px">
          <view>附件</view>
          <view class="file-set-list" v-for="(item, idx) in contractDetails.enclosures" :key="idx" @click="preview(item)">
            <u-icon class="file-set-lef" name="file-text"></u-icon>
            <text>{{ item.enclosureName }}</text>
            <u-icon name="arrow-right" class="file-set-right"></u-icon>
          </view>
        </view>
        <view style="background: #f6f6fc; height: 5px; margin-top: 20px"></view>
        <view class="accessory" v-for="(item, idx) in contractDetails.attachments" :key="idx"
          @click="accessoryClick(item)">
          <u-icon name="file-text-fill" size="24" class="accessory-ico"></u-icon>
          <text class="text-hidden">{{ item.attachName }}</text>
          <u-icon name="arrow-right" size="24" color="#dddddd" class="accessory-right-ico"></u-icon>
          <view style="font-size: 10px">{{ item.suffix }}</view>
        </view>
        <view class="popup-footer" style="justify-content: space-between; width: 100%">
          <view class="btns">
            <u-button class="btn-iem" type="error" text="删除" @click="deleteItem"
              v-if="contractDetails.deleteStatus"></u-button>
          </view>
          <view class="btns">
            <u-button class="btn-iem" type="primary" text="编辑" @click="compile"
              v-if="contractDetails.editStatus"></u-button>
          </view>
        </view>
      </view>
      <prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop>
    </u-popup>
    <view class="pdb"></view>
    <view type="primary" class="btn" @click="add" v-if="user.orgType == 5">新增日常管理</view>
    <u-popup :show="receiveShow" @close="receiveShow = false">
      <view class="selectShow">
        <view class="head">
          <view class="name">分项工程</view>
          <view class="closeBtn" @click="requestConfirmation" style="color: #3c9cff">确认</view>
        </view>
        <view class="content">
          <tree ref="weert" class="price-amount" :selectedData="viewAuthorize" :multiple="false" :associatedNode="false"
            :disabled="false" :wipeStatus="true" :localdata="yearList" valueKey="pkId" textKey="itemName"
            childrenKey="children"></tree>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import solarClender from "./solarClender.vue";
import moment from "moment";
import prviewPop from '../../components/prview-pop/prview-pop.vue';
import tree from "../../components/ba-tree-picker-radio/ba-tree-picker.vue"
export default {
  components: { solarClender, prviewPop, tree },
  data() {
    return {
      describeContent: "",
      itemNameList: [],
      markDays: [],
      showPop: false,
      materialList: [],
      inpDate: {
        beginTime: "",
        endTime: "",
        orderCode: "",
      },
      identifying: false,
      itemShow: false,
      contractDetails: {},
      yearList: [],
      nowYear: "",
      total: "",
      pageNum: 1,
      userName: "",
      userId: "",
      time: "",
      previewShow: false,
      previewUrl: "",
      receiveShow: false,
      viewAuthorize: [],
      receiverDataList: {
        itemName: ""
      },
      dateTime: ""
    };
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  onLoad() {
    // this.time = moment(Date.now()).format("YYYY-MM-DD")
    this.time = ""
    this.dateTime = ""
    this.identifying = true
    this.yearMonth = moment(Date.now()).format("YYYY-MM")
    this.searchOther();
    this.getSearchItemsByProjectId();
  },
  mounted() {
    this.searchPage();
  },
  methods: {
    empty() {
      this.receiverDataList = {
        itemName: "",
        pkId: ""
      }
      this.viewAuthorize = []
      this.searchPage();
    },
    // 接收单位
    requestConfirmation() {

      this.viewAuthorize = this.$refs.weert._confirm()
      if (this.viewAuthorize.length == 0) {
        return this.receiveShow = false;
      }
      this.receiverDataList = {}
      let arr = this.flatTreeData(this.yearList)
      arr.forEach(item => {
        this.viewAuthorize.forEach(e => {
          if (item.pkId == e) {
            this.receiverDataList = item
          }
        })
      })
      console.log("=======================================")
      console.log(this.receiverDataList)
      console.log("=======================================")
      this.receiveShow = false;
      this.searchPage();
    },
    receiverClick() {
      this.receiveShow = true
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
    resh() {
      // this.time = moment(Date.now()).format("YYYY-MM-DD")
      this.searchOther();
      this.getSearchItemsByProjectId();
      this.searchPage();
    },
    clickInit(item) {
      this.identifying = false
      if (this.$refs.solarClender.choose != '') {
        this.yearMonth = ""
      }else{
        // console.log(item)
        this.yearMonth = moment(item.date).format("YYYY-MM")
      }

      this.searchPage()
    },
    change(y, m) {
      this.dateTime = `${y + '-' + m}`
      this.dateTime = ""
      this.identifying = true
      this.yearMonth = `${y + '-' + m}`
      this.searchPage()
      this.searchOther()
    },
    preview(item) {
      this.$checkName(item.enclosureUrl)
      return
      this.previewUrl = item.enclosureUrl;
      this.previewShow = true;
    },
    closePre() {
      this.previewShow = false;
    },
    scrolltolower() {
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
      this.searchPage();
    },
    getSearchItemsByProjectId() {
      let data = {
        fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
      }
      this.$api.getSearchItemsByProjectId(data).then(res => {
        if (res.code == 200) {
          this.yearList = res.data
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      })
    },
    selectOne(e) {
      console.log(e);
      this.userName = e.options.label;
      this.userId = e.options.value;
      // this.searchPlanAndDetail(0);
      // this.searchPlanAndDetail(1);
      this.searchPage()
    },
    onDayClick(e) {
      this.time = e.date
      this.searchPage()
    },
    openPops() {
      this.itemShow = true;
    },
    closePop() {
      this.itemShow = false;
    },
    init() {
      this.pageNum = 1
      this.itemNameList = []
      this.searchPage();
    },
    searchPage() {
      let data = {
        hierarchyType: 2,
        time: this.identifying ? this.dateTime : this.$refs.solarClender.choose,
        userId: this.userId,
        describeContent: this.describeContent,
        fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId"),
        fkItemId: this.receiverDataList.pkId != undefined ? this.receiverDataList.pkId : "",
        yearMonth: this.yearMonth
      };
      this.$api.searchSafetyDaily(data).then((res) => {
        if (res.code == 200) {
          this.itemNameList = res.data
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    searchOther() {
      this.$api.searchOther({ hierarchyType: 2, fkOrgId: uni.getStorageSync("nowOrgId"), yearMonth: this.yearMonth }).then(res => {
        if (res.code == 200) {
          // this.yearList = []
          this.markDays = res.data.allDate ? res.data.allDate : []
          // this.markDays.push(new Date().toISOString().split('T')[0])
          res.data.allUser && res.data.allUser.forEach(element => {
            console.log('element -----> ', element);
            // this.yearList.push({ label: element.userName, value: element.pkId })
          });
          console.log('this.markDays -----> ', this.markDays);
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      })
    },
    add() {
      let data = {
        type: 1,
      };
      uni.navigateTo({
        url: "/pages/safety/addManage?row=" + JSON.stringify(data),
      });
    },
    itemExamine(row) {
      this.$api.safetyDailySelectById({ pkId: row.pkId }).then((res) => {
        if (res.code == 200) {
          this.contractDetails = res.data;
          this.contractDetails.userName = row.userName;
          this.contractDetails.createTime = row.createTime;
          this.itemShow = true;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    deleteItem() {
      this.$api
        .safetyDailyDeleter({ pkId: this.contractDetails.pkId })
        .then((res) => {
          if (res.code == 200) {
            this.itemShow = false;
            this.init();
            this.searchOther();
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
    },
    compile() {
      let data = this.contractDetails;
      data.type = 2;
      this.itemShow = false;
      uni.navigateTo({
        url: "/pages/safety/addManage?row=" + JSON.stringify(data),
      });
    },

  },
};
</script>

<style lang="scss" scoped>
.search {
  //   position: fixed;
  //   /* #ifdef H5 */
  //   top: 176rpx;
  //   /* #endif */
  //   /* #ifdef APP-PLUS */
  //   top: 240rpx;
  //   /* #endif */
  //   //   top: 176rpx;
  margin-top: 4px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 80rpx;
  padding: 0 32rpx;
  background-color: #fff;

  .right {
    display: flex;
    width: 530rpx;
    height: 60rpx;
    border: 1px solid rgba(180, 208, 240, 1);
    border-radius: 10rpx;

    .search-input {
      display: flex;
      align-items: center;
      flex: 1;
      height: 60rpx;
      padding-left: 8rpx;
    }

    .searchBtn {
      width: 120rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 26rpx;
      text-align: center;
      color: #2a82e4;
    }

    .separator {
      line-height: 54rpx;
      color: rgba(180, 208, 240, 1);
    }
  }

  .left {
    margin-left: 20rpx;

    .screen {
      width: 140rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 26rpx;
      text-align: center;
      color: #2a82e4;
      border: 1px solid rgba(180, 208, 240, 1);
      border-radius: 10rpx;
    }
  }
}

.box {
  padding-left: 6px;
  max-height: 500px;
  overflow: auto;

  //background: linear-gradient(to right, #efefef, #ffffff);
  .box-stair {
    line-height: 30px;
    position: relative;
    margin-top: 1px;
    background: linear-gradient(to right, #dedede, #fff);

    .order-shadow {
      position: absolute;
      left: -6px;
      top: 0;
      width: 6px;
      height: 30px;
      background: #bbb;
    }
  }

  .second-level {
    margin-bottom: 4px;
    line-height: 30px;
    background: linear-gradient(to right, #efefef, #ffffff);
  }

  .three-level {
    display: flex;
    align-items: center;
    // line-height: 40px;
    height: 40px;
    padding-left: 13px;
    // margin-bottom: 4px;
    margin: 4px 0px;
    font-size: 28rpx;
    background: #fff;
  }
}



.item-edit {
  padding-bottom: 90rpx;

  .tem-edit-title {
    line-height: 80rpx;
    background: #2a82e4;
    color: #fff;
    text-indent: 2em;
  }

  .tem-edit-ico {
    position: absolute;
    right: 40rpx;
    top: 24rpx;
  }

  .item-edit-form {
    padding: 0 12rpx;
  }
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

    .btn-iem {
      width: 95%;
    }
  }
}

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

.search {
  display: flex;
  align-items: center;
  height: 80rpx;

  .search-item {
    flex: 1;
    padding: 0 10rpx;
    width: 150px;
    height: 60rpx;
    line-height: 60rpx;
    border: 1px solid #b4d0f0;
    overflow: hidden;
    /*超出部分隐藏*/
    white-space: nowrap;
    /*禁⽌换⾏*/
    text-overflow: ellipsis;
    text-align: center;
    position: relative;
    border-radius: 5px;

    .icons {
      position: absolute;
      right: 4px;
      top: 9px;
    }

    .icon {
      right: 0;
      top: 7px;
    }
  }

  .easySelect {
    /deep/.uni-input-wrapper {
      .uni-input-input {
        font-size: 28rpx;
      }
    }
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

.desContent {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .describeContent {
    width: 500rpx;
  }

  .userName {
    color: #a6aebc;
  }
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
.pdb{
  height: 100rpx;
}
</style>
