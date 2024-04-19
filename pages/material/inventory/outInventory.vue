<template>
  <view class="wrapper">
    <u-navbar
      leftText="出库管理"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="pad"></view>
    <view class="sticky">
      <u-tabs
        class="tabList"
        :list="tabList"
        :current="current"
        @change="currentChange"
        :scrollable="false"
        :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
      >
        <view slot="right" class="hamburg" @tap="hamburg">
          <u-icon name="list" size="21" bold></u-icon>
        </view>
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
            placeholder="请输入单据编号"
            border="none"
            v-model="inpDate.orderCode"
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
        <view class="more-search" @click="openPop">
          <image
            src="../../../static/image/u486.png"
            mode="widthFix"
            class="filterImg"
          />
          <view>筛选</view>
        </view>
      </view>
    </view>
    <view class="content">
        <u-list @scrolltolower="scrollTolower" class="u-list" :height="user.orgType!=4?'calc(100vh - 368rpx)':''">
        <u-list-item v-for="(item, index) in list" :key="index">
          <view class="item" @click="detail(item)">
            <view class="icons">
              <u-icon name="file-text" size="20" color="#2a82e4"></u-icon>
            </view>
            <view class="content">
              <view class="name">{{item.orderCode}}</view>
              <view class="detail mb-20" >填表人：{{ item.leaderName }}</view >
              <view class="detail mb-20" >出库对象：{{ item.customerName?item.customerName:'无' }}</view >
              <!-- <view class="detail mb-20">单据来源：{{ billCodeList[item.billCode] }}</view> -->
              <view class="detail">出库时间：{{ item.createTime }}</view>
            </view>
            <view class="tags">
                <!-- (草稿:0，运输中:1，被拒收:2，已完成:3 -->
              <view v-if="true" class="tag" :class="{default:item.inventoryCodeName==='草稿',waring:['运输中'].includes(item.inventoryCodeName),success:['已完成'].includes(item.inventoryCodeName),error:['被拒收'].includes(item.inventoryCodeName)}">{{item.inventoryCodeName}}</view >
            </view>
          </view>
        </u-list-item>
      </u-list>
    </view>
    <view class="pdb"  v-if="$auth('material:inventory:edit')"></view>
    <view class="footer-btns" v-if="$auth('material:inventory:edit')">
        <view class="foot-btn addBtn" @click="addBtn">新增出库单</view>
    </view>
    <u-popup
      :show="showPop"
      @close="closePop"
      mode="right"
      class="opo"
      bgColor="rgba(255, 255, 255, 0)"
    >
      <view class="popup">
        <view class="popup-content">
          <!-- <view class="search-item mb-20">
            <h5 class="mb-20">状态</h5>
            <text class="pop-item" :class="inpDate.inventoryCode === '' ? 'active' : ''" @click="selectItem({ keyName: '' })">全部</text>
			<text class="pop-item" :class="{ active: item.keyName === inpDate.inventoryCode }" v-for="(item, index) in typeList" :key="index" @click="selectItem(item, index)">{{ item.keyVal }}</text>
          </view> -->
          <view class="search-item">
            <h5 class="mb-20">单据时间</h5>
            <view class="search-datas">
                <view class="data-input">
                  <view class="left" @click="openCale(1)">{{ inpDate.beginTime }}</view>
              <view class="closeBtn" @click="cleanDate(1)">X</view>
            </view>
            <view class="to">至</view>
            <view class="data-input">
              <view class="left" @click="openCale(2,inpDate.endTime)">{{ inpDate.endTime }}</view>
              <view class="closeBtn" @click="cleanDate(2)">X</view>
            </view>
            </view>
        </view>
        </view>
        <view class="footer">
          <view class="footerBtn cancel" @click="closePop">取消</view>
          <view class="footerBtn add" @click="searchOk">确认</view>
        </view>
      </view>
      <!-- <u-picker
        :show="pickShow"
        :columns="[pickList]"
        @confirm="pickConfirm"
        keyName="label"
        @cancel="pickCancel"
      ></u-picker> -->
      <uni-calendar
      ref="calendar"
      :insert="false" 
      @confirm="caleConfirm"
      :date="clickDate"
    />
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabList: [],
      current: 0,
      tabShow: false,
      showPop:false,
      inpDate:{
        orderCode:'',
        beginTime:'',
        endTime:''
      },
      searchDate:{
        orderCode:'',
        beginTime:'',
        endTime:''
      },
      inventoryCode:'',
      fkWarehouseId:'',
      typeList:[],
      clickDate:'',
      caleType:1,
      list:[],
      pageNum:1,
      total:0,
    };
  },
  computed: {
    	user() {
    	  return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    	},
  	},
  onLoad(options) {
    this.$store.dispatch("getDictionariesData", 19).then(res => {
        let arr= res.map(item=>({...item,name:item.keyVal}))
        this.tabList =[{name:'全部',keyName:''},...arr]
    });
    this.searchOutInventoryPage()
  },
  // onShow(){
  //   this.searchOutInventoryPage()
  // },
  methods: {
    resh(){
      this.pageNum=1
      this.searchOutInventoryPage()
    },
    searchOutInventoryPage(){
        let data={
            pageNum:this.pageNum,
            pageSize:20,
            inventoryCode:this.inventoryCode,
            fkBidProjectId:this.user.orgType !== 4 ? "" : uni.getStorageSync("nowProId"),
            ...this.searchDate
        }
        uni.showLoading({ mask: true })
        this.$api.searchOutInventoryPage(data).then((res) => {
            uni.hideLoading()
            if(res.code===200){
              if(this.pageNum===1){
                this.list=res.data.records
              }else{
                this.list=[...this.list,...res.data.records]
              }
              this.total=res.data.total-0
            }else{
                uni.showToast({ title: res.msg, icon: "none" });
            }
        }).catch((err) => {
            uni.hideLoading()
        });
    },
    currentChange(e) {
    this.pageNum=1
    this.current = e.index;
    this.inventoryCode=e.keyName
    this.searchOutInventoryPage()
    },
    resh(){
      this.searchOutInventoryPage()
    },
    // tab点击
    listSelet(item, index) {
      // 展开传值
      this.current = index;
      this.inventoryCode=item.keyName
      this.searchOutInventoryPage()
      this.tabShow = false;
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
    // 选择发起人
	selectItem(item, index) {
		if (item.keyName == "") {
			this.inpDate.inventoryCode = "";
		} else {
			this.inpDate.inventoryCode = item.keyName;
		}
	},
    searchOk() {
      this.pageNum = 1
      this.searchDate = { ...this.inpDate };
      this.searchOutInventoryPage()
      this.closePop();
    },
    search() {
      this.pageNum = 1
      this.searchDate = { ...this.inpDate };
      this.searchOutInventoryPage()
    },
    closePop() {
      this.showPop = false;
      this.inpDate = { ...this.searchDate };
    },
    cleanDate(e) {
      console.log(e);
      if (e == 1) {
        this.inpDate.beginTime = "";
      } else {
        this.inpDate.endTime = "";
      }
    },
    openCale(type, date) {
      this.clickDate = date;
      this.caleType = type;
      // this.caleShow=true
      this.$refs.calendar.open();
    },
    caleConfirm(e) {
      console.log(e);
      if (this.caleType === 1) {
        this.inpDate.beginTime = e.fulldate;
      } else if (this.caleType === 2) {
        this.inpDate.endTime = e.fulldate;
      }
    },
    detail(item) {
        console.log(item);
        uni.navigateTo({url:'/pages/material/inventory/outInventoryDetail?type=1&obj='+JSON.stringify(item)})
    },
    scrollTolower() {
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
      this.searchOutInventoryPage()
    },
    addBtn(){
        uni.navigateTo({ url: '/pages/material/inventory/addOutInventory?type=1' })
    }
  },
};
</script>
<style lang="scss" scoped>
.pad {
  height: 178rpx;
}
.pdb{
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
.flow {
  overflow: auto;
  width: 750rpx;
}
.mb-20 {
  margin-bottom: 20rpx;
}
.sticky{
    z-index: 99;
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
.popup {
  position: relative;
  width: 600rpx;
  /*#ifdef APP-PLUS*/
  height: calc(100vh - 156rpx);
  /*#endif*/
  /*#ifdef H5*/
  height: calc(100vh - 88rpx);
  /*#endif*/
  padding: 30rpx;
  /*#ifdef APP-PLUS*/
  margin-top: 156rpx;
  /*#endif*/
  /*#ifdef H5*/
  margin-top: 88rpx;
  /*#endif*/
  background-color: #f2f2f2;
  .popup-pad {
    /*#ifdef APP-PLUS*/
    height: 156rpx;
    /*#endif*/
    /*#ifdef H5*/
    height: 88rpx;
    /*#endif*/
  }
  .popup-content {
    height: calc(100% - 100rpx);
    overflow: auto;
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
  .title-item {
    	display: block;
    	font-weight: 600;
    	font-size: 28rpx;
    	margin: 36rpx 0;
    }
    .pop-item {
    	display: inline-block;
    	border: 1px solid #000;
    	width: 170rpx;
    	height: 60rpx;
    	line-height: 60rpx;
    	border-radius: 30rpx;
    	font-size: 28rpx;
    	background-color: #fff;
    	text-align: center;
    	// background-color: #f6f6f6;
    	border: 1px solid #eee;
    	margin-bottom: 24rpx;
    	margin-right: 8rpx;
    	overflow: hidden;
    	text-overflow: ellipsis;
    	white-space: nowrap;
    }
    .active {
	color: #2a82e4 !important;
	background-color: #e6f7ff !important;
	border: 1px solid #2a82e4 !important;
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
}
.search-datas {
  display: flex;
  align-items: center;
  height: 80rpx;
  // background-color: #fff;
  .title {
    width: 180rpx;
  }
  .to {
    margin: 0 10rpx;
  }
  .data-input {
    display: flex;
    align-items: center;
    position: relative;
    width: 520rpx;
    height: 60rpx;
    // padding: 0 20rpx;
    font-size: 28rpx;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    border-radius: 6rpx;
    .left{
      display: flex;
      align-items: center;
      width: 200rpx;
      height: 60rpx;
    }
    .closeBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: 6rpx;
      width: 30rpx;
      height: 30rpx;
      background-color: #eee;
      color: #ccc;
      font-size: 16rpx;
      z-index: 5;
      border-radius: 50%;
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
.footer-btns{
    display: flex;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 750rpx;
    height: 100rpx;
    z-index: 5;
    .addBtn{
        background-color: #1576e6;
    }
    .foot-btn{
        display: flex;
        justify-content: center;
        align-items: center;
        flex:1;
        height: 100rpx;
        font-size: 28rpx;
        color: #fff;
    }
}
</style>