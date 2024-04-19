<template>
  <view class="wrapper">
    <u-navbar leftText="试验检测" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="sticky">
      <u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="false" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"></u-tabs>
      <view class="search">
        <view class="search-input">
          <u-input placeholder="请输入入库单号" border="none" v-model="inpDate.orderCode" maxlength="50">
            <template slot="suffix">
              <u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon>
            </template>
          </u-input>
        </view>
        <!--  @click="showFilter = !showFilter" -->
        <!-- <view class="more-search" @click="openPop">
          <image src="../../static/image/u486.png" mode="widthFix" class="filterImg" />
          <view>筛选</view>
        </view> -->
        <filterBtn @click="openPop" :nums="searchTag.length" :marginLeft="true" :height="64"></filterBtn>
      </view>
    </view>
    <view class="pad"></view>
    <view class="content">
      <view class="item" v-for="item in showList" :key="item.pkId" @click="detail(item)">
        <view class="icons">
          <u-icon name="../../static/image/experiment.png" size="20" color="#2a82e4"></u-icon>
        </view>
        <view class="content">
          <view class="name">{{ item.materialName }}</view>
          <view class="detail mb-20">关联入库单：{{ item.orderCode }}</view>
          <view v-if="item.serviceTime" class="detail mb-20">检测时间：{{ item.serviceTime }}</view>
          <view v-if="item.inspectorName" class="detail">检测人：{{ item.inspectorName }}</view>
        </view>
        <view class="tags">
          <!-- 待检测：0,检测合格:1,检测不合格:2,检测中：3 -->
          <view v-if="item.detectionCode === '待检测'" class="tag default">待检测</view>
          <view v-if="item.detectionCode === '检测合格'" class="tag success">合格</view>
          <view v-if="item.detectionCode === '检测不合格'" class="tag error">不合格</view>
          <view v-if="item.detectionCode === '检测中'" class="tag waring">检测中</view>
        </view>
      </view>
    </view>
    <u-popup :show="showPop" @close="closePop" mode="right"  class="pop-bgImg" bgColor="rgba(255, 255, 255, 0)" >
      <view class="popup">
        <!-- <view class="popup-pad"></view> -->
        <view class="tip">请选择筛选条件</view>
        <view class="popup-content">
          <view class="filter-title">检测日期</view>
          <view class="filter-content">
            <view class="dates mb-20">
              <view class="dateInput" @click="openCale(1, inpDate.beginTime)">
                <view >{{inpDate.beginTime}}</view>
              </view>
              <view>至</view>
              <view class="dateInput" @click="openCale(2, inpDate.endTime)">
                <view>{{inpDate.endTime}}</view>
              </view>
            </view>
          </view>
          <view class="filter-title">检测物料筛选</view>
          <view class="filter-content">
             <view class="select" @click="materialTypeSearch">
              <view class="name">{{materialName}}</view>
              <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
            </view>
          </view>
          <view class="reset" @click="reset">重置</view>
        </view>
      </view>
      <view class="pop-footer-btn">
        <view class="btns btnReset" @click="closePop">取消</view>
        <view class="btns btnOk" @click="searchOk">确定</view>
      </view>
      <!-- <u-calendar :show="caleShow" mode="single" @confirm="caleConfirm" @close='closeCale' minDate="2015-01-01" maxDate="2035-12-30" monthNum='200'></u-calendar> -->
      <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate"  class="noBg"/>
      <u-picker :show="pickShow" :columns="[materialList]" keyName="label" @confirm="pickConfirm" @cancel="pickCancel" class="noBg"></u-picker>
      <materialSelect :treeData="materialList" ref="materialSelect" @checked="checked" class="noBg"></materialSelect>
    </u-popup>
  </view>
</template>

<script>
import materialSelect from '../../components/material-select/material-select2.vue';
import filterBtn from '../../components/search-tag/filter-btn.vue';
import searchTag from '../../components/search-tag/search-tag.vue';
export default {
  components:{materialSelect,filterBtn,searchTag},
  onShow() {
    this.searchDetection()
  },
  onLoad(options) {
    this.searchMaterialByInput()
  },
  computed: {
    	user() {
    	  return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    	},
      showList(){
        if (this.current === 0) {
         return  this.list
        } else if (this.current === 1) {
         return  this.list.filter(item => item.detectionCode === '待检测')
        } else if (this.current === 2) {
          return this.list.filter(item => item.detectionCode === '检测中')
        } else if (this.current === 3) {
          return this.list.filter(item => ['检测合格', '检测不合格'].includes(item.detectionCode))
        }
      }
  	},
  data() {
    return {
      name: "",
      tabList: [
        { name: "全部" },
        { name: "待检测" },
        { name: "检测中" },
        { name: "检测结果" },
      ],
      list: [],
      // showList: [],
      current: 0,
      showFilter: false,
      showPop: false,
      inpDate: {
        beginTime: "",
        endTime: "",
        orderCode: "",
        materialIds:""
      },
      searchDate: {
        beginTime: "",
        endTime: "",
        orderCode: "",
        materialIds:''
      },
      caleType: 1,
      clickDate: "",
      pickShow: false,
      materialList: [],
      materialName:"",
      searchTag:[]
    };
  },
  methods: {
    closeTag(row){
			console.log(row);
			this.pageNum=1
      this.searchDate[row.key]=""
      this.inpDate[row.key]=""
      if(row.key=='materialIds'){
        this.materialName =""
      }
			this.setTagList()
			this.searchChangesDesigPage();
		},
    setTagList(){
      let arr = []
      if(this.searchDate.beginTime){
        arr.push({key:'beginTime',value:this.searchDate.beginTime})
      }
      if(this.searchDate.endTime){
        arr.push({key:'endTime',value:this.searchDate.endTime})
      }
      if(this.searchDate.materialIds){
        let obj =this.materialList.filter(item=>item.value==this.searchDate.materialIds)[0]
        arr.push({key:'materialIds',value:obj.label})
      }
      this.searchTag=arr
    },
    materialTypeSearch() {
      this.$refs.materialSelect.selectShow = true;
    },
    // 物资选中回调
    checked(item) {
      console.log(item);
      this.inpDate.materialIds=item.pkId
      this.materialName = item.typeName;
    },
    searchDetection() {
      let data = {...this.searchDate,fkOrgId:this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId") }
      this.$api.searchDetection(data).then(res => {
        if (res.code === 200) {
          this.list = res.data
          // this.showList = res.data
          console.log('this.showList -----> ', this.showList);
        } else {
          uni.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    },
    searchMaterialByInput(){
      this.$api.searchMaterialByInput({projectId:this.user.orgType === 5 ? "" : uni.getStorageSync("nowProId")}).then(res=>{
        if(res.data){
          this.materialList=res.data.map(item=>({...item,label:item.typeName,value:item.pkId}))
        }
      })
    },
    currentChange(e) {
      this.current = e.index;
      console.log(e.index);
    },
    detail(item) {
      if(item.detectionCode === '待检测'&&this.user.orgType==4){
        return uni.showToast({icon:'none',title:"该物料暂未有检测信息"})
      }else{
        uni.navigateTo({
          url:
            "/pages/production/checkDetail?obj=" + JSON.stringify(item),
        });
      }
    },
    openPop() {
      this.showPop = true;
    },
    searchOk() {
      this.searchDate = { ...this.inpDate }
      this.setTagList()
      this.searchDetection()
      this.closePop()
    },
    closePop() {
      this.showPop = false;
      this.inpDate = { ...this.searchDate }
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
    closeCale() {
      this.caleShow = false;
    },
    reset() {
      this.inpDate.beginTime = "";
      this.inpDate.endTime = "";
      this.inpDate.materialIds=""
      this.materialName=""
    },
    search() {
      this.searchDate.orderCode = this.inpDate.orderCode
      this.searchDetection()
    },
    openPick() {
      this.pickShow = true;
    },
    pickConfirm(e) {
      if(e.value.length&&e.value[0]){
        this.materialName=e.value[0].label
        this.inpDate.materialIds=e.value[0].pkId
      }
      this.pickCancel();
    },
    pickCancel() {
      this.pickShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.sticky {
  background-color: #fff;

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
}

.popup {
  // position: relative;
  // width: 580rpx;
  // /*#ifdef APP-PLUS*/
  // height: calc(100vh - 156rpx);
  // /*#endif*/
  // /*#ifdef H5*/
  // height: calc(100vh - 88rpx);
  // /*#endif*/
  // /*#ifdef APP-PLUS*/
  // margin-top: 156rpx;
  // /*#endif*/
  // /*#ifdef H5*/
  // margin-top: 88rpx;
  // /*#endif*/
  // padding: 30rpx;
  // background-color: #f2f2f2;

  // .popup-pad {
  //   /*#ifdef APP-PLUS*/
  //   height: 156rpx;
  //   /*#endif*/
  //   /*#ifdef H5*/
  //   height: 88rpx;
  //   /*#endif*/
  // }

  .dates {
    display: flex;
    align-items: center;

    .dateInput {
      display: flex;
      // justify-content: center;
      align-items: center;
      width: 220rpx;
      height: 60rpx;
      font-size: 28rpx;
      background-color: #fff;
      border: 1px solid #2a82e4;
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

.pad {
  height: 180rpx;
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
      overflow: hidden;
      /*超出部分隐藏*/
      white-space: nowrap;
      /*禁⽌换⾏*/
      text-overflow: ellipsis;
      /*省略号*/
    }
  }

  .detail {
    width: 520rpx;
    font-size: 24rpx;
    color: #a6aebc;
    letter-spacing: 1px;
    overflow: hidden;
    /*超出部分隐藏*/
    white-space: nowrap;
    /*禁⽌换⾏*/
    text-overflow: ellipsis;
    /*省略号*/
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
      font-size: 26rpx;
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
  }
}

.mb-20 {
  margin-bottom: 20rpx;
}
</style>
