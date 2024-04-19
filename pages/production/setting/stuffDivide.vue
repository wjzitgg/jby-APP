<!-- 员工工区划分 -->
<template>
  <view class="wrapper">
    <u-navbar
      leftText="员工工区划分"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <!-- 头部tabs -->
    <view style="background: #fff">
      <u-tabs
        :list="tabList"
        :current="current"
        @click="listSelet"
        class="tabs"
        :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
      >
        <view slot="right" class="hamburg" @tap="hamburg"
          ><u-icon name="list" size="21" bold></u-icon
        ></view>
      </u-tabs>
    </view>
    <view class="content">
      <view class="pull-down" v-show="show1">
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
      <view class="search">
        <view class="left">
          <view class="search-input"
            ><u-input border="none" v-model="userName" placeholder="请输入员工名字" maxlength="25"> </u-input
          ></view>
          <view class="separator">|</view>
          <view class="searchBtn" @click="search">搜索</view>
        </view>
        <view class="right">
          <filterBtn @click="openPop" :nums="searchTag.length"></filterBtn>
        </view>
      </view>
      <searchTag :tagList="searchTag" @closeTag="closeTag"></searchTag>
      <!-- <view
        class="sheet-list-table"
        v-for="(item, index) in details"
        :key="index"
        @click="tableList(item)"
      >
        <u-icon name="account-fill" class="list-table-ico" size="20"></u-icon>
        <view class="list-table-text">{{ item.userName }}</view>
        <view class="list-table-page">{{ item.areaName }}</view> padding-bottom: 25px;
      </view> -->
      <u-list @scrolltolower="scrollTolower" class="u-list">
        <u-list-item
          v-for="(item, index) in details"
          :key="index"
          class="sheet-list-table"
        >
          <u-cell
            :title="item.userName"
            class="item-table"
            @click="tableList(item)"
          >
            <u-avatar
              slot="icon"
              shape="square"
              size="35"
              customStyle="margin: -3px 5px -3px 0"
            >
              <u-icon name="account-fill" size="20"></u-icon>
            </u-avatar>
            <view slot="label" class="work-area">{{ item.areaName }}</view>
          </u-cell>
        </u-list-item>
      </u-list>
    </view>
    <u-popup :show="popShow" mode="right" @close="closePop" @open="openPop"  class="pop-bgImg" bgColor="rgba(255, 255, 255, 0)">
      <view class="popup">
        <view class="tip">请选择筛选条件</view>
        <view class="popup-content">
          <view class="filter-title">角色筛选</view>
          <view class="filter-content">
            <view
            class="tags"
            :class="{ 'tags-click': nowTags === index }"
            v-for="(item, index) in roleList"
            :key="index"
            @click="tagsClick(item, 1, index)"
            >{{ item.roleName }}</view
          >
          </view>
          <view class="filter-title">所属工区</view>
          <view class="filter-content">
            <view
              class="tags"
              :class="{ 'tags-click': sendTags === index }"
              v-for="(item, index) in areaIdList"
              :key="index"
              @click="tagsClick(item, 2, index)"
              >{{ item.areaName }}</view
            >
          </view>
        </view>
        <!-- <view class="popup-footer">
          <view class="btns">
            <u-button text="取消" @click="closePop"></u-button>
          </view>
          <view class="btns">
            <u-button type="primary" text="确定" @click="popOk"></u-button>
          </view>
        </view> -->
      </view>
      <view class="pop-footer-btn">
        <view class="btns btnReset" @click="closePop">取消</view>
        <view class="btns btnOk" @click="popOk">确定</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import filterBtn from '../../../components/search-tag/filter-btn.vue';
import searchTag from '../../../components/search-tag/search-tag.vue';
export default {
  components:{filterBtn,searchTag},
  data() {
    return {
      tabList: [],
      userName: "",
      rowData: {},
      details: [],
      current: 0,
      tableIndex: 0,
      show1: false,
      pageNum: 1,
      total: 0,
      popShow: false,

      roleList: [], //角色列表
      areaIdList: [], //工区列表
      roleId: "-1", //所属角色ID
      areaId: "", //所属工区主键ID
      nowTags: 0,
      sendTags: 0,
      searchTag:[]
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);
    this.searchDeptList();
    this.searchRoleList();
    this.searchWorkArea();
  },
  methods: {
    closeTag(row){
      this[row.key]=row.noValue?row.noValue:""
      if(row.key=='roleId'){
        this.nowTags = 0
      }else{
        this.sendTags = 0
      }
      this.searchTag=this.searchTag.filter(item=>item.key!=row.key)
      this.init();
    },
    openPop() {
      this.popShow = true;
    },
    popOk() {
      this.details = []
      this.pageNum = 1;
      let arr =[]
      if(this.nowTags){
        let obj = this.roleList.filter(item=>item.pkId==this.roleId)[0]
        arr.push({key:"roleId",value:obj.roleName,noValue:"-1"})
      }
      if(this.sendTags){
        let obj = this.areaIdList.filter(item=>item.areaId==this.areaId)[0]
        arr.push({key:"areaId",value:obj.areaName})
      }
      this.searchTag = arr
      this.init();
      this.closePop();
    },
    closePop() {
      this.popShow = false;
      this.itemShow = false;
    },
    tagsClick(item, index, idx) {
      if (index == 1) {
        this.roleId = item.pkId;
        this.nowTags = idx;
      } else if (index == 2) {
        this.areaId = item.areaId;
        this.sendTags = idx;
      }
    },
    scrollTolower() {
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
      this.init();
    },
    search() {
      this.details = []
      this.pageNum=1
      this.init();
    },
    // tab点击
    listSelet(item, index) {
      // 展开传值
      console.log();
      if (index !== undefined) {
        this.current = index;
      } else {
        this.current = item.index;
      }
      this.details = []
      // this.tabShow = false;
      // this.idx = item.idx;
      // if (item.idx === 1) {
      //   this.tableIndex = item.tableInd;
      // }
      this.details = [];
      this.pageNum=1
      this.roleId='-1'
      this.searchRoleList(this.tabList[this.current].pkId=='-1'?'':this.tabList[this.current].pkId);
      this.init();
    },

    hamburg() {
      this.show1 = true;
    },
    shut() {
      this.show1 = false;
    },
    tableList(row) {
      console.log("11111111")
      uni.navigateTo({
        url:
          "/pages/production/setting/divisionDetails?row=" +
          JSON.stringify(row),
      });
    },
    init() {
      let data = {
        pageNum: this.pageNum,
        pageSize: 20,
        deptId: this.tabList[this.current].pkId,
        roleId: this.roleId,
        areaId: this.areaId,
        userName:this.userName,
        // this.roleId
      };
      if (this.rowData.orgType != 5) {
        data.fkOrgId = uni.getStorageSync("nowOrgId");
      }
      this.$api.searchUserPageForOrgId(data).then((res) => {
        if (res.code == 200) {
          this.total = res.data.total - 0;
          if(this.pageNum==1){
            this.details = res.data.records
          }else{
            this.details = this.details.concat(res.data.records);
          }
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    searchDeptList() {
      this.$api.searchDeptListByOrgId2({ fkOrgId:uni.getStorageSync('nowOrgId')}).then((res) => {
        if (res.code == 200) {
          console.log(res);
          res.data.forEach((item) => {
            item.name = item.deptName;
          });
          this.tabList = res.data;
          this.tabList.unshift({ name: "全部", pkId: -1 });
          this.pageNum=1
          this.init();
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    // 查询角色
    searchRoleList(deptId) {
      this.$api.searchRolesByProcess({fkOrgId:uni.getStorageSync('nowOrgId'),deptId}).then((res) => {
    
        if (res.code == 200) {
          this.roleList = res.data;
          this.roleList.unshift({ roleName: "全部", pkId: "-1" });
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    // 查询工区
    searchWorkArea() {
      console.log('uni.getStorage -----> ', );
      let data={
        fkOrgId: uni.getStorageSync('nowOrgId')
      }
      this.$api.searchAllUserWorkArea(data).then((res) => {
        if (res.code == 200) {
          this.areaIdList = res.data;
          this.areaIdList.unshift({ areaName: "全部", areaId: "-1" });
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  // margin-top: 4px;
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
  .arrow-up {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
  .item-tab {
    width: 33.33%;
    padding: 29rpx;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.sheet-list-table {
  margin-top: 4px;
  background: #fff;
  /deep/ .u-cell__body__content {
    padding-bottom: 16px;
  }
  .item-table {
    position: relative;
  }
  .work-area {
    position: absolute;
    bottom: 14px;
    font-size: 10px;
    color: #bbb;
  }
}
.action {
  color: #203457;
}
.u-list {
  max-height: calc(100vh - 140px) !important;
}

.search {
  //   position: fixed;
  //   /* #ifdef H5 */
  //   top: 176rpx;
  //   /* #endif */
  //   /* #ifdef APP-PLUS */
  //   top: 240rpx;
  //   /* #endif */
  //   //   top: 176rpx;
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
      padding-left: 10rpx;
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
//   // position: relative;
//   width: 660rpx;
//   /*#ifdef APP-PLUS*/
//   height: calc(100vh - 156rpx);
//   /*#endif*/
//   /*#ifdef H5*/
//   height: calc(100vh - 88rpx);
//   /*#endif*/
//   /*#ifdef APP-PLUS*/
//   margin-top: 156rpx;
//   /*#endif*/
//   /*#ifdef H5*/
//   margin-top: 88rpx;
//   /*#endif*/
//   background-color: #fff;
//   overflow: auto;
//   .popup-title {
//     height: 80rpx;
//     line-height: 80rpx;
//     margin-bottom: 20rpx;
//     padding-left: 20rpx;
//   }
//   .popup-content {
//     display: flex;
//     flex-wrap: wrap;
//     padding-left: 20rpx;
//     .tags {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       width: 200rpx;
//       height: 72rpx;
//       margin-right: 8rpx;
//       margin-bottom: 12rpx;
//       // line-height: 72rpx;
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
//   .popup-footer {
//     position: fixed;
//     bottom: 0;
//     display: flex;
//     width: 660rpx;
//     height: 80rpx;
//     // background-color: rgb(194, 155, 155);
//     .btns {
//       //padding: 12rpx;
//       flex: 1;
//       .btn-iem {
//         width: 95%;
//       }
//     }
//   }
// }
</style>
