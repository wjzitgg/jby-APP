<!-- 上级质量检查 -->
<template>
  <view class="wrapper">
    <u-navbar leftText="分包成本" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="pdt-ios"></view>
    <view class="content">
      <!-- <solarClender :markDays="markDays"></solarClender> -->
      <view class="search">
        <view class="left">
          <view class="search-input"><u-input border="none" placeholder="请输入合同名称或项目名称" v-model="contractName" maxlength="50">
            </u-input></view>
          <view class="separator">|</view>
          <view class="searchBtn" @click="init">搜索</view>
        </view>
        <view class="right">
          <view class="screen" @click="openPop">筛选</view>
        </view>
      </view>
      <!-- <u-list @scrolltolower="scrollTolower" class="u-list">
        <view
          class="itemList"
          v-for="(item, index) in itemNameList"
          :key="index"
          @click="listClick(item)"
        >
          <view>
            <u-icon
              name="file-text"
              size="20"
              style="display: inline-block"
            ></u-icon>
            <text class="text-hidden">{{ item.fkBidProjectName }}</text>
          </view>
          <view class="item-bottom-text">上级单位:{{ item.companyName }}</view>
          <view class="item-bottom-text">录入时间:{{ item.inspectTime }}</view>
        </view>
      </u-list> -->
      <view class="table_detail table_empty" style="margin-top: 2px">
        <table>
          <thead>
            <tr>
              <th style="width: 40px">
                <u-icon name="list" style="display: inline-block"></u-icon>
              </th>
              <th>合同名称</th>
              <th>项目名称</th>
              <th>项目部</th>
              <th>分包商</th>

              <th>合同签订日期</th>
              <th>施工开始日期</th>
              <th>施工完成日期</th>
              <th>合同金额</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in itemNameList" :key="index">
              <td><text class="clickTd" @click="itemLick(item)">{{ index + 1 }}</text></td>
              <td>{{ item.contractName }}</td>
              <td>{{ item.projectName }}</td>
              <td>{{ item.projectName }}</td>
              <td>{{ item.customerOrgName }}</td>
              <td>{{ item.signDate }}</td>
              <td>{{ item.beginDate }}</td>
              <td>{{ item.endDate }}</td>
              <td>{{ item.amount }}</td>
              <td>
                <text v-if="item.enableStatus == 0">正常</text>
                <text v-if="item.enableStatus == 1">终止</text>
              </td>
            </tr>
          </tbody>
        </table>
        <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      </view>
    </view>
    <u-popup :show="showPop" @close="closePop" mode="right">
      <view class="popup">
        <view class="popup-content">
          <view class="tags" :class="{ 'tags-click': nowTags === index }" v-for="(item, index) in list" :key="index"
            @click="tagsClick(item, 1, index)">{{ item.name }}</view>
        </view>
        <view class="popup-content">
          <view class="search-item mb-20">
            <h5 class="mb-20" style="line-height: 20px">日期范围选择</h5>
            <view class="dates">
              <view class="dateInput" @click="openCale(1, inpDate.beginTime)">
                <!-- <u--input v-model="inpDate.beginTime" border="none" clearable></u--input> -->
                <view>{{ inpDate.beginTime }}</view>
              </view>
              <view>至</view>
              <view class="dateInput" @click="openCale(2, inpDate.endTime)">
                <view>{{ inpDate.endTime }}</view>
                <!-- <u--input v-model="inpDate.endTime" border="none" clearable></u--input> -->
              </view>
            </view>
          </view>
          <view class="reset" @click="reset">重置</view>
        </view>
        <view class="footer">
          <view class="footerBtn cancel" @click="closePop">取消</view>
          <view class="footerBtn add" @click="searchOk">确认</view>
        </view>
      </view>
      <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" />
      <u-picker :show="pickShow" :columns="[materialList]" @confirm="pickConfirm" @cancel="pickCancel"></u-picker>
    </u-popup>
    <u-popup :show="itemShow" mode="bottom" :round="20" @close="closePops" @open="openPops">
      <view class="item-edit">
        <view class="tem-edit-title">
          {{ contractDetails.contractName }}
          <u-icon name="close" color="#fff" @click="closePops" class="tem-edit-ico"></u-icon>
        </view>
        <view>
          <u--form labelPosition="left" :model="contractDetails" class="item-edit-form">
            <u-form-item label="建设单位:" v-if="user.orgType != 10" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
              {{ contractDetails.contractDetails }}
            </u-form-item>
            <u-form-item label="施工单位:"  v-if="user.orgType != 10"  prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
              {{ contractDetails.contractorName }}
            </u-form-item>
            <u-form-item label="项目部:"  v-if="user.orgType != 10"  prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
              {{ contractDetails.orgName }}
            </u-form-item>
            <u-form-item v-if="user.orgType == 10" label="分包单位:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
              {{ contractDetails.customerOrgName }}
            </u-form-item>
            <u-form-item label="合同金额:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
              {{ contractDetails.amount }}
            </u-form-item>
            <u-form-item label="签订日期:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
              {{ contractDetails.signDate }}
            </u-form-item>
            <u-form-item label="施工开始日期:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="100">
              {{ contractDetails.beginDate }}
            </u-form-item>
            <u-form-item label="施工结束日期:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="100">
              {{ contractDetails.endDate }}
            </u-form-item>
            <u-form-item label="结算税点:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
              {{ contractDetails.taxRate }}
            </u-form-item>
          </u--form>
        </view>
        <view style="background: #f6f6fc; height: 5px; margin-top: 20px"></view>
        <view style="padding: 8px">
          <view>合同附件</view>
          <view class="file-set-list" v-for="(item, idx) in contractDetails.attachments" @click="fileListPreview(item)"
            :key="idx">
            <u-icon class="file-set-lef" style="    display: inline-block;" name="file-text"></u-icon>
            <view class="text-hidden">{{ item.attachName }} </view>
            <text class="suffix" v-if="item.attachName.length > 30">{{ item.suffix }}</text>
            <u-icon name="arrow-right" class="file-set-right"></u-icon>
          </view>
        </view>
        <view style="background: #f6f6fc; height: 5px; margin-top: 20px"></view>
        <view class="popup-footer" style="justify-content: space-between; width: 100%">
          <view class="btns">
            <u-button class="btn-iem" type="success" text="查看单项目表" @click="compile"></u-button>
          </view>
          <view class="btns">
            <u-button class="btn-iem" type="primary" text="查看供应材料" @click="supplyMaterial"></u-button>
          </view>
        </view>
      </view>
    </u-popup>
    <prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop>
  </view>
</template>

<script>
// import solarClender from "./solarClender.vue";
import prviewPop from '../../../components/prview-pop/prview-pop.vue';
export default {
  components: { prviewPop },
  data() {
    return {
      contractName: "",
      list: [
        { name: "全部", id: "" },
        { name: "正常", id: "0" },
        { name: "终止", id: "1" },
      ],
      inpDate: {
        beginTime: "",
        endTime: "",
        orderCode: "",
      },
      itemNameList: [],

      // markDays: [],
      showPop: false,
      pickShow: false,
      materialList: [],

      caleType: 1,
      clickDate: "",

      nowTags: 0,
      itemShow: false,
      contractDetails: {},
      previewShow: false,
      previewUrl: "",
      menuCodeData: {
        menuCode: "",
        states: ""
      },
    };
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  onLoad() {
    this.init();
    this.searchMenuDataAuthorize();
  },
  methods: {
    supplyMaterial() {
      let item = this.contractDetails;
      item = { ...item, 'menuCodeData': this.menuCodeData }
      uni.navigateTo({
        url: "/pages/contract/supplyMaterials?row=" + JSON.stringify(item),
      });
    },
    fileListPreview(row) {
      // return console.log(row)
      this.$checkName(row.attachUrl)
      return
      this.previewUrl = row.attachUrl
      this.previewShow = true
    },
    closePre() {
      this.previewShow = false;
    },
    itemLick(row) {
      this.$api.findContractById({ pkId: row.pkId }).then(res => {
        if (res.code == 200) {
          this.contractDetails = res.data
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      })
      this.itemShow = true;
    },
    openPops() {
      this.itemShow = true;
    },
    closePops() {
      this.itemShow = false;
    },
    searchOk() {
      // this.pageNum = 1;
      this.init();
      this.closePop();
    },
    tagsClick(item, index, idx) {
      console.log(item);
      if (index == 1) {
        this.roleId = item.pkId;
        this.nowTags = idx;
      } else if (index == 2) {
        this.areaId = item.areaId;
        this.sendTags = idx;
      }
      this.receivingType = item.id;
    },

    openPop() {
      this.showPop = true;
    },
    closePop() {
      this.showPop = false;
      // this.inpDate={...this.searchDate}
    },
    // openPick() {
    //   this.pickShow = true;
    // },
    reset() {
      this.inpDate.beginTime = "";
      this.inpDate.endTime = "";
    },
    caleConfirm(e) {
      console.log(e);
      if (this.caleType === 1) {
        this.inpDate.beginTime = e.fulldate;
      } else if (this.caleType === 2) {
        console.log(e)
        this.inpDate.endTime = e.fulldate;
      }
    },
    openCale(type, date) {
      this.clickDate = date;
      this.caleType = type;
      // this.caleShow=true
      this.$refs.calendar.open();
    },
    pickConfirm(e) {
      console.log(e);
      this.pickCancel();
    },
    pickCancel() {
      this.pickShow = false;
    },
    init() {
      let data = {
        enableStatus: this.list[this.nowTags].id,
        signDate: this.inpDate.beginTime,
        endDate: this.inpDate.endTime,
        contractName: this.contractName,
        fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId")
      };
      this.$api.costSubcontractSearch(data).then((res) => {
        if (res.code == 200) {
          this.itemNameList = res.data;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    add() {
      let data = {
        type: 1,
      };
      uni.navigateTo({
        url: "/pages/quality/addCheck?row=" + JSON.stringify(data),
      });
    },
    compile() {
      let item = this.contractDetails;
      uni.navigateTo({
        url: `/pages/contract/listItems?type=4&row=` + JSON.stringify(item),
      });
    },
    // 获取当前登录用户角色关联菜单权限数据集
    searchMenuDataAuthorize() {
      this.$api.searchMenuDataAuthorize().then(res => {
        if (res.code == 200) {
          res.data.forEach(element => {
            if (element.menuCode == 'contract') {
              this.menuCodeData = element
            }
          });
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      })
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

  .left {
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

  .right {
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

.popup {
  position: relative;
  width: 580rpx;
  height: 100%;
  padding: 30rpx;
  background-color: #f2f2f2;

  .popup-pad {
    /*#ifdef APP-PLUS*/
    height: 156rpx;
    /*#endif*/
    /*#ifdef H5*/
    height: 88rpx;
    /*#endif*/
  }

  .dates {
    display: flex;
    align-items: center;

    .dateInput {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 220rpx;
      height: 60rpx;
      font-size: 28rpx;
      background-color: #fff;
      border: 1px solid #000;
    }
  }

  .reset {
    margin-top: 12px;
    width: 120rpx;
    height: 40rpx;
    line-height: 40rpx;
    background-color: #1576e6;
    color: #fff;
    font-size: 26rpx;
    text-align: center;
    border-radius: 20rpx;
  }

  .select {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60rpx;
    padding: 0 20rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
  }

  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    width: 580rpx;
    height: 100rpx;

    .footerBtn {
      width: 290rpx;
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

  .popup-content {
    display: flex;
    flex-wrap: wrap;
    padding-left: 20rpx;

    .tags {
      width: 200rpx;
      height: 72rpx;
      margin-right: 8rpx;
      margin-bottom: 12rpx;
      line-height: 72rpx;
      text-align: center;
      font-size: 26rpx;
      color: #a0a8b6;
      // border: 1px solid rgba(180, 208, 240, 1);
      background-color: #f6f6f6;
      border-radius: 72rpx;
    }

    .tags-click {
      color: #2a82e4;
      border: 1px solid #2a82e4;
      background-color: #e6f7ff;
    }
  }
}

.reset {
  width: 120rpx;
  height: 40rpx;
  line-height: 40rpx;
  background-color: #1576e6;
  color: #fff;
  font-size: 26rpx;
  text-align: center;
  border-radius: 20rpx;
}

.u-list {
  max-height: calc(100vh - 240px) !important;
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
    overflow: hidden;
    /*超出部分隐藏*/
    white-space: nowrap;
    /*禁⽌换⾏*/
    text-overflow: ellipsis;
    /*省略号*/
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

.text-hidden {
  overflow: hidden;
  /*超出部分隐藏*/
  white-space: nowrap;
  /*禁⽌换⾏*/
  text-overflow: ellipsis;
  /*省略号*/
  position: absolute;
  top: 0;
  left: 20px;
  width: 80%;
}

.suffix {
  position: absolute;
  top: 0;
  right: 30px;
  // width: 80%;
}

/deep/ .u-slide-right-enter-to {
  // margin-top: 80px !important;
  /*#ifdef APP-PLUS*/
  margin-top: 80px !important;
  /*#endif*/
  /*#ifdef H5*/
  margin-top: 40px !important;
  /*#endif*/
}
</style>
