<template>
  <view class="wrapper">
    <u-navbar
      leftText="设计变更"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="sticky">
      <u-tabs
        class="tabList"
        :list="tabList"
        :current="current"
        @change="currentChange"
        :scrollable="true"
        :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
      >
        <view slot="right" class="hamburg" @tap="hamburg"
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
      <view class="search">
        <view class="search-input">
          <u-input
            placeholder="请输入变更项目名称"
            border="none"
            v-model="inpDate.changesName"
            maxlength="50"
          >
            <view slot="suffix">
              <u-icon
                name="search"
                size="28"
                @click="search"
                color="#2a82e4"
              ></u-icon>
            </view>
          </u-input>
        </view>
        <filterBtn :marginLeft="true" @click="openPop" :nums="searchTag.length"></filterBtn>
        <!--  @click="showFilter = !showFilter" -->
        <!-- <view class="more-search" @click="openPop">
          <image
            src="../../static/image/u486.png"
            mode="widthFix"
            class="filterImg"
          />
          <view>筛选</view>
        </view> -->
      </view>
      <searchTag :tagList="searchTag" @closeTag="closeTag"></searchTag>
    </view>
    <view :class="{pad:!searchTag.length,pad2:searchTag.length}"></view>
    <view class="content">
      <u-list @scrolltolower="scrollTolower" class="u-list" :height="'calc(100vh - 268rpx)'">
        <u-list-item v-for="(item, index) in list" :key="index">
          <view class="item" @click="detail(item)">
            <view class="icons">
              <u-icon name="file-text" size="20" color="#2a82e4"></u-icon>
            </view>
            <view class="content">
              <view class="name">{{ item.changesName }}</view>
              <view class="detail mb-20"
                >变更类型：{{ item.fkWorkflowTemplateName }}</view
              >
              <view class="detail mb-20"
                >发起人：{{ item.createUserName }}</view
              >
              <view class="detail">发起日期：{{ item.launchTime }}</view>
            </view>
            <view class="tags">
              <!-- 结算状态，0：草稿   1：审批中  2：已完成 3: 已拒绝,4:待签章，5：签章中，6：签章已完成-->
              <view v-if="item.changesStatus === 0" class="tag default"
                >{{item.changesStatusStr}}</view
              >
              <view v-if="item.changesStatus === 1" class="tag waring"
                >{{item.changesStatusStr}}</view
              >
              <view v-if="item.changesStatus === 2" class="tag primary"
                >{{item.changesStatusStr}}</view
              >
              <view v-if="item.changesStatus === 3" class="tag error"
                >{{item.changesStatusStr}}</view
              >
              <view v-if="item.changesStatus === 4" class="tag primary"
                >{{item.changesStatusStr}}</view
              >
              <view v-if="item.changesStatus === 5" class="tag waring"
                >{{item.changesStatusStr}}</view
              >
              <view v-if="item.changesStatus === 6" class="tag primary"
                >{{item.changesStatusStr}}</view
              >
              <view v-if="item.changesStatus === 7" class="tag default"
                >{{item.changesStatusStr}}</view
              >
              <view v-if="item.changesStatus === 10" class="tag default"
                >{{item.changesStatusStr}}</view
              >
            </view>
          </view>
        </u-list-item>
      </u-list>
    </view>
    <u-popup :show="showPop" @close="closePop" mode="right" class="pop-bgImg" bgColor="rgba(255, 255, 255, 0)" >
      <view class="popup">
        <!-- <view class="popup-pad"></view> -->
        <view class="tip">请选择筛选条件</view>
        <view class="popup-content">
          <view class="filter-title">变更类型</view>
          <view class="filter-content mb-20">
            <view class="select" @click="openPick(1)">
              <view class="name">{{ templateName }}</view>
              <u-icon
                name="arrow-down-fill"
                class="icons"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
          </view>
          <view class="filter-title">发起人</view>
          <view class="filter-content mb-20">
            <view class="select" @click="openPick(2)">
              <view class="name">{{ userName }}</view>
              <u-icon
                name="arrow-down-fill"
                class="icons"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
          </view>
        </view>
        <!-- <view class="footer">
          <view class="footerBtn cancel" @click="closePop">取消</view>
          <view class="footerBtn add" @click="searchOk">确认</view>
        </view> -->
      </view>
      <view class="pop-footer-btn">
        <view class="btns btnReset" @click="closePop">取消</view>
        <view class="btns btnOk" @click="searchOk">确定</view>
      </view>
      <u-picker
        :show="pickShow"
        :columns="[pickList]"
        @confirm="pickConfirm"
        keyName="label"
        class="noBg"
        @cancel="pickCancel"
      ></u-picker>
    </u-popup>
  </view>
</template>

<script>
import filterBtn from '../../components/search-tag/filter-btn.vue';
import searchTag from '../../components/search-tag/search-tag.vue';
export default {
  components:{filterBtn,searchTag},
  data() {
    return {
      //  0：草稿，1：审批中，2：审批完成 ， 3：已拒绝, 4：待签章, 5：签章中，6：签章已完成
      tabList: [
        { name: "全部", value: "" },
        // { name: "草稿", value: 0 },
        // { name: "审批中", value: 1 },
        // { name: "审批完成", value: 2 },
        // { name: "待签章", value: 4 },
        // { name: "签章中", value: 5 },
        // { name: "签章完成", value: 6 },
      ],
      current: 0,
      list: [],
      tabShow: false,
      showPop: false,
      pickShow: false,
      pickType: 1,
      pickList: [],
      pageNum: 1,
      total: 0,
      userName: "全部",
      templateName: "全部",
      inpDate: {
        changesName: "",
        createUser: "",
        fkWorkflowTemplateId: "",
      },
      searchDate: {
        changesName: "",
        createUser: "",
        fkWorkflowTemplateId: "",
      },
      changesStatus: "",
      typeList: [],
      userList: [],
      searchTag:[]
    };
  },
  computed: {
    	user() {
    	  return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    	},
  	},
  onLoad(options) {
    this.changeStatsQuery()
    this.getChangeType();
    this.getCreateUserList();
    this.searchChangesDesigPage();
  },
  methods: {
    closeTag(row){
			console.log(row);
			this.pageNum=1
      this.searchDate[row.key]=""
      this.inpDate[row.key]=""
      if(row.key=='fkWorkflowTemplateId'){
        this.templateName ="全部"
      }else{
        this.userName ="全部"
      }
			this.setTagList()
			this.searchChangesDesigPage();
		},
    setTagList(){
      let arr = []
      if(this.searchDate.fkWorkflowTemplateId){
        let obj = this.typeList.filter(item=>item.value==this.searchDate.fkWorkflowTemplateId)[0]
        arr.push({key:"fkWorkflowTemplateId",value:obj.label})
      }
      if(this.searchDate.createUser){
        let obj = this.userList.filter(item=>item.value==this.searchDate.createUser)[0]
        arr.push({key:"createUser",value:obj.label})
      }
      this.searchTag=arr
    },
    resh(){
      this.searchChangesDesigPage(true);
    },
    changeStatsQuery(){
      this.$api.changeStatsQuery().then(res=>{
        if(res.code===200){
          this.tabList = [
            { name: "全部", value: "" },
            ...res.data.map((item) => ({
              name: item.key,
              value: item.name,
            })),
          ];
        }else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    getChangeType() {
      this.$api.getChangeType({fkOrgId:this.user.orgType !== 5 ? uni.getStorageSync("nowOrgId") : ""}).then((res) => {
        if (res.code === 200) {
          this.typeList = [
            { label: "全部", value: "" },
            ...res.data.map((item) => ({
              ...item,
              label: item.name,
              value: item.key,
            })),
          ];
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    getCreateUserList() {
      this.$api.getCreateUserList().then((res) => {
        if (res.code === 200) {
          this.userList = [
            { label: "全部", value: "" },
            ...res.data.map((item) => ({
              ...item,
              label: item.userName,
              value: item.userId,
            })),
          ];
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    searchChangesDesigPage(resh) {
      if(resh){
        this.pageNum=1
      }
      let data = {
        pageNum: this.pageNum,
        pageSize: 20,
        changesStatus: this.changesStatus,
        fkOrgId:this.user.orgType !== 5 ? uni.getStorageSync("nowOrgId") :"",
        fkBidProjectId:this.user.orgType !== 5 ? uni.getStorageSync("nowProId") : "",
        ...this.searchDate,
      };
      uni.showLoading({ mask: true });
      this.$api
        .searchChangesDesigPage(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            if(this.pageNum==1){
               this.list=res.data.records
            }else{
              this.list = [...this.list,...res.data.records];
            }
            this.total = res.data.total - 0;
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    detail(item) {
      uni.navigateTo({
        url: `/pages/change/changeDesignDetail?pkId=${item.pkId}&type=${item.changesStatus==0 ? 1 : 2}`,
      });
    },
    scrollTolower() {
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
      this.searchChangesDesigPage();
    },
    currentChange(e) {
      this.current = e.index;
      this.changesStatus = e.value;
      this.searchChangesDesigPage();
    },
    // tab点击
    listSelet(item, index) {
      this.current = index;
      this.changesStatus = item.value;
      this.tabShow = false;
      this.searchChangesDesigPage();
    },
    // 汉堡点击展开tabs
    hamburg() {
      this.tabShow = !this.tabShow;
    },
    shut() {
      this.tabShow = false;
    },
    openPop() {
      this.showPop = true;
    },
    searchOk() {
      this.searchDate = { ...this.inpDate };
      this.setTagList()
      this.pageNum=1
      this.searchChangesDesigPage();
      this.closePop();
    },
    search() {
      this.searchDate = { ...this.inpDate };
      this.pageNum=1
      this.searchChangesDesigPage();
    },
    closePop() {
      this.showPop = false;
      this.inpDate = { ...this.searchDate };
    },
    openPick(type) {
      this.pickType = type;
      if (type === 1) {
        this.pickList = this.typeList;
      } else if (type === 2) {
        this.pickList = this.userList;
      }
      console.log(this.pickList);
      this.pickShow = true;
    },
    pickConfirm(e) {
      console.log(e);
      if (e.value[0]) {
        if (this.pickType === 1) {
          this.inpDate.fkWorkflowTemplateId = e.value[0].value;
          this.templateName = e.value[0].label;
        } else if (this.pickType === 2) {
          this.inpDate.createUser = e.value[0].value;
          this.userName = e.value[0].label;
        }
      }
      this.pickCancel();
    },
    pickCancel() {
      this.pickShow = false;
      //   this.inpDate = { ...this.searchDate };
    },
  },
};
</script>

<style lang="scss" scoped>
.pad {
  height: 178rpx;
}
.pad2 {
  height: 240rpx;
}
.mb-20 {
  margin-bottom: 20rpx;
}
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  .search-input {
    width: 540rpx;
    padding-left: 20rpx;
    border: 1px solid #2a82e4;
    border-radius: 6rpx;
  }
  .more-search {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 160rpx;
    height: 60rpx;
    border: 1px solid #2a82e4;
    border-radius: 6rpx;
    font-size: 30rpx;
    color: #2a82e4;
    .filterImg {
      width: 36rpx;
      margin-right: 6rpx;
    }
  }
}
.item {
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 10rpx;
  .icons {
    width: 60rpx;
  }
  .content {
    .name {
      width: 520rpx;
      margin-bottom: 20rpx;
      font-weight: 600;
      font-size: 30rpx;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
    }
  }
  .detail {
    width: 520rpx;
    font-size: 24rpx;
    color: #a6aebc;
    letter-spacing: 1px;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*禁⽌换⾏*/
    text-overflow: ellipsis; /*省略号*/
  }
  .tags {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120rpx;
    height: 74rpx;
    .tag {
      width: 120rpx;
      padding: 10rpx 0;
      text-align: center;
      font-size: 24rpx;
    }
    .default {
      background-color: #eeeeee;
      color: #b8b8b8;
    }
    .waring {
      color: #ff9f3f;
      background-color: #ffe9d1;
    }
    .success {
      background-color: #d1ffe9;
      color: #5fd992;
    }
    .error {
      background-color: #ffd1d1;
      color: #d25a5a;
    }
    .primary {
      background-color: #c7e1ff;
      color: #4995e9;
    }
  }
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
.flow {
  overflow: auto;
  width: 750rpx;
}
// /deep/.opo{
//     background-color: rgba(255, 255, 255, 0);
// }
.popup {
  // position: relative;
  // width: 580rpx;
  // /*#ifdef APP-PLUS*/
  // height: calc(100vh - 156rpx);
  // /*#endif*/
  // /*#ifdef H5*/
  // height: calc(100vh - 88rpx);
  // /*#endif*/
  // padding: 30rpx;
  // /*#ifdef APP-PLUS*/
  // margin-top: 156rpx;
  // /*#endif*/
  // /*#ifdef H5*/
  // margin-top: 88rpx;
  // /*#endif*/
  // background-color: #f2f2f2;
  // .popup-pad {
  //   /*#ifdef APP-PLUS*/
  //   height: 156rpx;
  //   /*#endif*/
  //   /*#ifdef H5*/
  //   height: 88rpx;
  //   /*#endif*/
  // }
  // .popup-content {
  //   height: calc(100% - 100rpx);
  //   overflow: auto;
  // }
  .select {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60rpx;
    padding: 0 20rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
    border: 1px solid #2a82e4;
  }
  // .footer {
  //   position: absolute;
  //   left: 0;
  //   bottom: 0;
  //   display: flex;
  //   width: 580rpx;
  //   height: 100rpx;
  //   .footerBtn {
  //     width: 290rpx;
  //     height: 100rpx;
  //     line-height: 100rpx;
  //     text-align: center;
  //   }
  //   .cancel {
  //     background-color: #eeeeee;
  //     color: #aaaaaa;
  //   }
  //   .add {
  //     background-color: #1576e6;
  //     color: #fff;
  //   }
  // }
}
</style>
