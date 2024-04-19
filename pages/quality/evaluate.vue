<!-- 质量评定 -->
<template>
  <view class="wrapper">
    <u-navbar
      leftText="质量评定"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <view class="search">
        <view class="left">
          <view class="search-input"
            ><u--input border="none" v-model="inspectName" placeholder="项目名称" maxlength="100"> </u--input
          ></view>
          <view class="separator">|</view>
          <view class="searchBtn" @click="init">搜索</view>
        </view>
        <view class="right">
          <!-- <view class="screen" @click="openPop">筛选</view> -->
          <filterBtn @click="openPop" :nums="searchTag.length"></filterBtn>
        </view>
      </view>
      <searchTag :tagList="searchTag" @closeTag="closeTag"></searchTag>
      <view class="table_detail">
        <table>
          <thead>
            <tr>
              <th style="width: 40px">
                <u-icon name="list" style="display: inline-block"></u-icon>
              </th>
              <th>项目名称</th>
              <th>施工工序流程</th>
              <th>完成状态</th>
              <th>检查结果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in itemNameList" :key="index">
              <td><text :class="{clickTd:item.isQuery}" @click="itemLick(item)">{{ item.itemCode }}</text></td>
              <td>{{ item.itemName }}</td>
              <td>{{ item.workflowName }}</td>
              <td>
                <text v-if="(item.completionStatus==1)">未完成</text>
                <text v-if="(item.completionStatus==2)">已完成</text>
              </td>
              <td>
                <text v-if="(item.checkResult==0)">不合格</text>
                <text v-if="(item.checkResult==1)">合格</text>
                <text v-if="(item.checkResult==2)">良好</text>
              </td>
            </tr>
          </tbody>
        </table>
      </view>
    </view>
    <u-popup :show="showPop" @close="closePop" mode="right" class="pop-bgImg" bgColor="rgba(255, 255, 255, 0)">
      <view class="popup">
        <view class="tip">请选择筛选条件</view>
        <view class="popup-content">
        <view class="filter-title">检查状态</view>
        
        <view class="filter-content">
          <view
            class="tags"
            :class="{ 'tags-click': nowTags === index }"
            v-for="(item, index) in list"
            :key="index"
            @click="tagsClick(item, 1, index)"
            >{{ item.name }}</view
          >
        </view>

        <view class="filter-title">检查结果</view>
        <view class="filter-content">
              <view
            class="tags"
            :class="{ 'tags-click': checkTags === index }"
            v-for="(item, index) in list1"
            :key="index"
            @click="checkTagsClick(item, 1, index)"
            >{{ item.name }}</view
          >
        </view>
        </view>
      </view>
      <view class="pop-footer-btn">
      	<view class="btns btnReset" @click="closePop">取消</view>
      	<view class="btns btnOk" @click="searchOk">确定</view>
      </view>
      <uni-calendar
        ref="calendar"
        :insert="false"
        @confirm="caleConfirm"
        :date="clickDate"
      />
      <u-picker
        :show="pickShow"
        :columns="[materialList]"
        @confirm="pickConfirm"
        @cancel="pickCancel"
      ></u-picker>
    </u-popup>
    <u-popup
      :show="itemShow"
      mode="bottom"
      :round="20"
      @close="closePops"
      @open="openPops"
    >
      <view class="item-edit">
        <view class="tem-edit-title">
          {{ contractDetails.fkBidProjectName }}
          <u-icon
            name="close"
            color="#fff"
            @click="closePop"
            class="tem-edit-ico"
          ></u-icon>
        </view>
        <view>
          <u--form
            labelPosition="left"
            :model="contractDetails"
            class="item-edit-form"
          >
            <u-form-item
              label="上级单位:"
              prop="userInfo.name"
              borderBottom
              labelWidth="80"
              ref="item1"
            >
              {{ contractDetails.companyName }}
            </u-form-item>
            <u-form-item
              label="检查日期:"
              prop="userInfo.sex"
              borderBottom
              ref="item1"
              labelWidth="80"
            >
              {{ contractDetails.inspectTime }}
            </u-form-item>
            <u-form-item
              label="参与单位:"
              prop="userInfo.sex"
              borderBottom
              ref="item1"
              labelWidth="80"
            >
              {{ contractDetails.companyName }}
            </u-form-item>
            <u-form-item
              label="录入人员:"
              prop="userInfo.sex"
              borderBottom
              ref="item1"
              labelWidth="80"
            >
              {{ contractDetails.userName }}
            </u-form-item>
            <u-form-item
              label="录入时间:"
              prop="userInfo.sex"
              borderBottom
              ref="item1"
              labelWidth="80"
            >
              {{ contractDetails.createTime }}
            </u-form-item>
          </u--form>
        </view>
        <view style="background: #f6f6fc; height: 5px; margin-top: 20px"></view>
        <view
          style=" line-height: 30px; border-bottom: 1px solid #eee;"
          >记 录:{{ contractDetails.content }}</view
        >
        <view style="background: #f6f6fc; height: 5px; margin-top: 20px"></view>
        <view style="padding: 8px">
          <view>合同</view>
          <view
            class="file-set-list"
            v-for="(item, idx) in contractDetails.enclosures"
            :key="idx"
          >
            <u-icon class="file-set-lef" name="file-text"></u-icon>
            <text class="text-hidden">{{ item.enclosureName }}</text>
            <u-icon name="arrow-right" class="file-set-right"></u-icon>
          </view>
        </view>
        <view style="background: #f6f6fc; height: 5px; margin-top: 20px"></view>
        <view
          class="accessory"
          v-for="(item, idx) in contractDetails.attachments"
          :key="idx"
          @click="accessoryClick(item)"
        >
          <u-icon
            name="file-text-fill"
            size="24"
            class="accessory-ico"
          ></u-icon>
          <text class="text-hidden" style="width: 90%; display: inline-flex">{{
            item.attachName
          }}</text>
          <u-icon
            name="arrow-right"
            size="24"
            color="#dddddd"
            class="accessory-right-ico"
          ></u-icon>
          <view style="font-size: 10px">{{ item.suffix }}</view>
        </view>
        <view
          class="popup-footer"
          style="justify-content: space-between; width: 100%"
        >
          <view class="btns">
            <u-button
              class="btn-iem"
              text="删除"
              @click="deleteItem"
            ></u-button>
          </view>
          <view class="btns">
            <u-button
              class="btn-iem"
              type="primary"
              text="编辑"
              @click="compile"
            ></u-button>
          </view>
        </view>
      </view>
    </u-popup>
    <!-- <view type="primary" class="btn" @click="add">新增日志</view> -->
  </view>
</template>

<script>
// import solarClender from "./solarClender.vue";
import filterBtn from '../../components/search-tag/filter-btn.vue';
import searchTag from '../../components/search-tag/search-tag.vue';
export default {
  computed: {
    	user() {
    	  return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    	},
  	},
  components: { filterBtn,searchTag },
  data() {
    return {
      inspectName: "",
      itemNameList: [],
      // markDays: [],
      showPop: false,
      pickShow: false,
      materialList: [],
      inpDate: {
        beginTime: "",
        endTime: "",
        orderCode: "",
      },
      caleType: 1,
      clickDate: "",
      list: [
        { name: "全部", id: "" },
        { name: "未完成", id: "1" },
        { name: "已完成", id: "2" },
      ],
      nowTags: 0,
      itemShow: false,
      contractDetails: {},
      completionStatus:"",
      list1: [
        { name: "全部", id: "" },
        { name: "不合格", id: "0" },
        { name: "合格", id: "1" },
        { name: "优良", id: "2" },
      ],
      checkResult:"",
      checkTags:0,
      searchTag:[]
    };
  },
  onLoad() {
    this.init();
  },
  methods: {
    closeTag(row){
			console.log(row);
			this[row.key] = ""
      if(row.key=='checkResult'){
        this.nowTags = 0
      }else{
        this.checkTags = 0
      }
			this.setTagList()
			this.init();
		},
    setTagList(){
      let arr=[]
      if(this.nowTags){
        arr.push({key:"checkResult",value:this.list[this.nowTags].name})
      }
      if(this.checkTags){
        arr.push({key:"completionStatus",value:this.list1[this.checkTags].name})
      }
      this.searchTag = arr
    },
    deleteItem() {
      this.api
        .firstQualityDelete({ pkId: this.contractDetails.pkId })
        .then((res) => {
          if (res.code == 200) {
            this.init();
            this.itemShow = false;
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
    },
    listClick(row) {
      this.contractDetails = row;
      this.itemShow = true;
      console.log(row);
    },
    openPops() {
      this.itemShow = true;
    },
    closePops() {
      this.itemShow = false;
    },
    searchOk() {
      // this.pageNum = 1;
      this.setTagList()
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
      this.completionStatus = item.id;
    },
    checkTagsClick(item, index, idx) {
        this.checkTags = idx;
        this.checkResult = item.id;
    },
    // scrollTolower() {
    //   // if (this.pageNum * 20 > this.total) {
    //   //   return;
    //   // }
    //   // this.pageNum = this.pageNum + 1;
    //   this.init();
    // },

    // ====================
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
    // reset() {
    //   this.inpDate.beginTime = "";
    //   this.inpDate.endTime = "";
    // },
    caleConfirm(e) {
      console.log(e);
      if (this.caleType === 1) {
        this.inpDate.beginTime = e.fulldate;
      } else if (this.caleType === 2) {
        this.inpDate.endTime = e.fulldate;
      }
    },
    // openCale(type, date) {
    //   this.clickDate = date;
    //   this.caleType = type;
    //   // this.caleShow=true
    //   this.$refs.calendar.open();
    // },
    pickConfirm(e) {
      console.log(e);
      this.pickCancel();
    },
    pickCancel() {
      this.pickShow = false;
    },
    init() {
      let data = {
        // pageNum: 1,
        // pageSize: 2,
        // hierarchyType: 1,
        // inspectType: this.list[this.nowTags].id,
        // beginTime: this.inpDate.beginTime,
        // endTime: this.inpDate.endTime,
        // inspectName: this.inspectName,
        checkResult:this.checkResult,
        completionStatus:this.completionStatus,
        itemName:this.inspectName,
        fkOrgId:this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId")
      };
      this.$api.qualityEvaluation(data).then((res) => {
        if (res.code == 200) {
          this.itemNameList = res.data;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    itemLick(row) {
      console.log(row)
      if(!row.isQuery){
        return
      }
      let data = row
      if(row.grade==3){
        uni.navigateTo({
          url: "/pages/quality/evaluateTable?row=" + JSON.stringify(data),
        });
      }else{
        uni.navigateTo({
          url: "/pages/quality/evaluateEdit?row=" + JSON.stringify(data),
        });
      }
    },
    compile() {
      let data = this.contractDetails
      data.type = 2
      uni.navigateTo({
        url: "/pages/quality/evaluateEdit?row=" + JSON.stringify(data),
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

// .popup {
//   position: relative;
//   width: 580rpx;
//   height: 100%;
//   padding: 30rpx;
//   background-color: #f2f2f2;
//   .popup-pad {
//     /*#ifdef APP-PLUS*/
//     height: 156rpx;
//     /*#endif*/
//     /*#ifdef H5*/
//     height: 88rpx;
//     /*#endif*/
//   }
//   .dates {
//     display: flex;
//     align-items: center;
//     .dateInput {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       width: 220rpx;
//       height: 60rpx;
//       font-size: 28rpx;
//       background-color: #fff;
//       border: 1px solid #000;
//     }
//   }
//   .reset {
//     margin-top: 12px;
//     width: 120rpx;
//     height: 40rpx;
//     line-height: 40rpx;
//     background-color: #1576e6;
//     color: #fff;
//     font-size: 26rpx;
//     text-align: center;
//     border-radius: 20rpx;
//   }
//   .select {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     height: 60rpx;
//     padding: 0 20rpx;
//     background-color: #fff;
//     margin-bottom: 20rpx;
//   }
//   .footer {
//     position: absolute;
//     left: 0;
//     bottom: 0;
//     display: flex;
//     width: 580rpx;
//     height: 100rpx;
//     .footerBtn {
//       width: 290rpx;
//       height: 100rpx;
//       line-height: 100rpx;
//       text-align: center;
//     }
//     .cancel {
//       background-color: #eeeeee;
//       color: #aaaaaa;
//     }
//     .add {
//       background-color: #1576e6;
//       color: #fff;
//     }
//   }
//   .popup-content {
//     display: flex;
//     flex-wrap: wrap;
//     padding-left: 20rpx;
//     .tags {
//       width: 200rpx;
//       height: 72rpx;
//       margin-right: 8rpx;
//       margin-bottom: 12rpx;
//       line-height: 72rpx;
//       text-align: center;
//       font-size: 26rpx;
//       color: #a0a8b6;
//       // border: 1px solid rgba(180, 208, 240, 1);
//       background-color: #f6f6f6;
//       border-radius: 72rpx;
//     }
//     .tags-click {
//       color: #2a82e4;
//       border: 1px solid #2a82e4;
//       background-color: #e6f7ff;
//     }
//   }
// }
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
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁⽌换⾏*/
  text-overflow: ellipsis; /*省略号*/
}
// /deep/ .u-slide-right-enter-to,
// /deep/ .u-transition{
//   // margin-top: 80px !important;
  
//   /*#ifdef APP-PLUS*/
//   margin-top: 80px !important;
//   /*#endif*/
//   /*#ifdef H5*/
//   margin-top: 40px !important;
//   /*#endif*/
// }
</style>
