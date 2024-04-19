<!-- 工程图纸详情 -->
<template>
  <view class="wrapper">
    <u-navbar
      leftText="施工日志"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <!-- ======================== -->
      <!-- <template>
        <tmt-calendar :bckground="'#fff'" defaultDate="2021-11-03"  :point-list="['2022-03-20','2022-04-01','2022-04-02','2022-04-05']" :show="true" @changeDate="changeDate"></tmt-calendar>
    </template> -->
      <solarClender :markDays="markDays" @onDayClick="onDayClick" @monthChange="monthChange"></solarClender>
      <!-- ======================== -->
      <view class="search">
        <view class="left">
          <view class="search-input"
            ><u--input border="none" v-model="userName" placeholder="请输入填表人姓名或者分项名称" maxlength="100"> </u--input
          ></view>
          <view class="separator">|</view>
          <view class="searchBtn" @click="init">搜索</view>
        </view>
        <view class="right">
          <view class="screen" @click="openPop">筛选</view>
        </view>
      </view>
      <view class="box" v-for="(item, idx) in showList" :key="idx">
        <view class="box-stair" v-if="item.grade == 1" @click="showChange(item)">
          <text class="text-left itemCode">{{ item.itemCode}}</text><text class="text-left">{{ item.itemName }}</text>
          <!-- <view class="order-shadow"></view> -->
          <u-icon class="arrow" name="arrow-down" v-if="!item.show" color="#bbb" size="16" ></u-icon>
          <u-icon class="arrow" name="arrow-up" v-if="item.show" color="#bbb" size="16"></u-icon>
        </view>
        <view class="second-level" v-if="item.grade == 2" @click="showChange(item)">
          <text class="text-left itemCode">{{ item.itemCode}}</text><text class="text-left">{{ item.itemName }}</text>
          <u-icon class="arrow" name="arrow-down" v-if="!item.show" color="#bbb" size="16" ></u-icon>
          <u-icon class="arrow" name="arrow-up" v-if="item.show" color="#bbb" size="16"></u-icon>
        </view>
        <view v-if="item.grade == 3" @click="showChange(item)">
          <view class="second-level">
            <!-- {{ item.itemCode }}{{ item.itemName }} -->
            <text class="text-left itemCode">{{ item.itemCode}}</text><text class="text-left">{{ item.itemName }}</text>
            <u-icon class="arrow" name="arrow-down" v-if="!item.show" color="#bbb" size="16" ></u-icon>
            <u-icon class="arrow" name="arrow-up" v-if="item.show" color="#bbb" size="16"></u-icon>
          </view>
          <view
            v-show="item.show"
            class="three-level"
            v-for="(e, idx) in item.reConstructionJournalVos"
            :key="idx"
            @click="itemExamine(e)"
          >
            <view style="display:flex">
              <u-icon name="/static/image/rizhi.png" class="rizhi" style="display: inline-block" size="18"></u-icon>
            <view>{{ getTime(e.time) + '施工日志'}}</view>
            </view>
            <view class="userName">by:{{ e.userName }}</view>
          </view>
        </view>
      </view>
    </view>
    <u-popup :show="showPop" @close="closePop" mode="right"  bgColor="rgba(255, 255, 255, 0)">
      <view class="popup">
        <!-- <view class="popup-pad"></view> -->
        <view class="popup-content">
          <view class="search-item mb-20">
            <h5 class="mb-20">记录日期</h5>
            <view class="dates">
              <view class="dateInput" @click="openCale(1, inpDate.beginTime)">
                <!-- <u--input
                  v-model="inpDate.beginTime"
                  border="none"
                  clearable
                ></u--input> -->
                {{inpDate.beginTime}}
              </view>
              <view>至</view>
              <view class="dateInput" @click="openCale(2, inpDate.endTime)">
                {{inpDate.endTime}}
                <!-- <u--input
                  v-model="inpDate.endTime"
                  border="none"
                  clearable
                ></u--input> -->
              </view>
            </view>
          </view>
          <!-- <view class="search-item">
            <h5 class="mb-20">检测物料筛选</h5>
            <view class="select" @click="openPick">
              <view class="name"></view>
              <u-icon
                name="arrow-down-fill"
                class="icons"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
          </view> -->
          <view class="reset" @click="reset">重置</view>
        </view>
        <view class="footer">
          <view class="footerBtn cancel" @click="closePop">取消</view>
          <view class="footerBtn add" @click="searchOk">确认</view>
        </view>
      </view>
      <!-- <u-calendar :show="caleShow" mode="single" @confirm="caleConfirm" @close='closeCale' minDate="2015-01-01" maxDate="2035-12-30" monthNum='200'></u-calendar> -->
      <uni-calendar
        ref="calendar"
        :insert="false"
        @confirm="caleConfirm"
        :date="clickDate"
        :start-date="this.caleType==2?this.inpDate.beginTime:''"
	      :end-date="this.caleType==1?this.inpDate.endTime:''"
      />
      <u-picker
        :show="pickShow"
        :columns="[materialList]"
        @confirm="pickConfirm"
        @cancel="pickCancel"
      ></u-picker>
    </u-popup>
    <view class="pdp" v-if="$auth('production:log:add')"></view>
    <view type="primary" class="btn" @click="add" v-if="$auth('production:log:add')">新增日志</view>
  </view>
</template>

<script>
import solarClender from "./solarClender.vue";
import moment from "moment";
export default {
  components: { solarClender },
  computed:{
    showList(){
      let arr = this.itemNameList.filter(item=>item.show).map(item=>item.pkId)
      let arr2 = this.itemNameList.filter(item=>item.grade==1||arr.includes(item.fkParentId))
      return arr2
    }
  },
  data() {
    return {
      userName: "",
      itemNameList: [],
      markDays: [],
      showPop:false,
      pickShow:false,
      materialList: [],
      inpDate: {
        beginTime: "",
        endTime: "",
        orderCode:""
      },
      caleType: 1,
      clickDate: "",
      yearMonth:""
    };
  },
  onLoad() {
    this.yearMonth=moment(Date.now()).format("YYYY-MM");
    this.init();
  },
  methods: {
    showChange(items){
      if(items.grade==1){
        if(items.show){
          items.show = false
          let ids=[]
          this.itemNameList.forEach(item=>{
            if(item.fkParentId==items.pkId){
              item.show=false
              ids.push(item.pkId)
            }
          })
          this.itemNameList.forEach(item=>{
            if(ids.includes(item.fkParentId)){
              item.show=false
            }
          })
        }else{
          items.show=true
        }
      }else if(items.grade==2){
        if(items.show){
          items.show = false
          this.itemNameList.forEach(item=>{
            if(item.fkParentId==items.pkId){
              item.show=false
            }
          })
        }else{
          items.show=true
        }
      }else{
        items.show=!items.show
      }
    },
    getTime(time){
      return moment(time).format("YYYY/MM/DD")
    },
    onDayClick(e){

      this.reset()
      this.inpDate.beginTime=e.date
      this.yearMonth = ""
      // console.log("xxxxx xxxxxxx111111xxxxxxxxxxxxx")
      // console.log( this.yearMonth);
      // console.log("xxxxxxxxxxxx111111xxxxxxxxxxxxx")
      this.init()
    },
    monthChange(y,m){
      this.reset()
      this.inpDate.beginTime = ""
      console.log("xxxxxxxxxxxx222222xxxxxxxxxxxxx")
      console.log( this.inpDate.beginTime);
      console.log("xxxxxxxxxxxx222222xxxxxxxxxxxxx")
      this.yearMonth =  `${y + '-' + m}`
      // this.yearMonth =  moment(e.date).format("YYYY-MM");
      this.init()
    },
    openPop() {
      // this.reset()
      this.showPop = true;
    },
    closePop() {
      this.showPop = false;
      // this.inpDate={...this.searchDate}
    },
    // openPick() {
    //   this.pickShow = true;
    // },
    searchOk(){
      // let data = {
      //   userName: this.userName,
      //   time:this.inpDate.beginTime,
      //   endTime:this.inpDate.endTime
      // };
      this.init();
      // this.reset()
      // this.inpDate.beginTime=""
      this.closePop()
      // this.$api.prodConstructionJournal(data).then((res) => {
      //   if (res.code == 200) {
      //     this.markDays = res.data.data;
      //     this.itemNameList = res.data.reConstructionJournalVos;
      //   } else {
      //     uni.showToast({ icon: "none", title: res.msg });
      //   }
      // });
    },
    reset() {
      this.inpDate.beginTime = "";
      this.inpDate.endTime = "";
    },
    caleConfirm(e) {
      console.log(e);
      if (this.caleType === 1) {
        this.inpDate.beginTime = e.fulldate;
      } else if (this.caleType === 2) {
        this.inpDate.endTime = e.fulldate;
      }
    },
    openCale(type, date) {
      if(!date){
        if(type==1){
          this.clickDate =this.inpDate.endTime
        }else{
           this.clickDate =this.inpDate.beginTime
        }
      }else{
        this.clickDate = date;
      }
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
    resh(){
      this.init()
    },
    init() {
      let data = {
        userName: this.userName,
        time:this.inpDate.beginTime,
        endTime:this.inpDate.endTime,
        yearMonth:this.yearMonth
      };
      let user = uni.getStorageSync("user");
			if (user.orgType != 5) {
				data.fkOrgId = uni.getStorageSync("nowOrgId");
			}
      this.$api.prodConstructionJournal(data).then((res) => {
        if (res.code == 200) {
          this.markDays = res.data.data;
          this.itemNameList = res.data.reConstructionJournalVos.map(item=>({...item,show:false}));
          console.log(this.itemNameList);
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
        url: "/pages/production/addLog?row=" + JSON.stringify(data),
      });
    },
    itemExamine(row) {
      uni.navigateTo({
        url: "/pages/production/logEdit?row=" + JSON.stringify(row),
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
.box {
  // margin-left: 6px;
  background: #ffffff;
  .box-stair {
    // line-height: 30px;
    display: flex;
    align-items: center;
    position: relative;
    height: 100rpx;
    margin-top: 1px;
    // background: linear-gradient(to right, #dedede, #fff);
    background: linear-gradient(90deg, rgba(227, 235, 255, 1) 0%, rgba(227, 235, 255, 0) 100%);
  }
  .second-level {
    display: flex;
    align-items: center;
    position: relative;
    height: 100rpx;
    background: #ffffff
  }
  .three-level {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    margin: 8rpx 24rpx;
    // margin-bottom: 4px;
    // background: #fff;
    background: linear-gradient(90deg, rgba(255, 249, 242, 1) 0%, rgba(255, 255, 255, 0) 100%);
    border: 1px solid rgba(255, 231, 207, 1);
    .userName{
      max-width: 160rpx;
      margin-right: 40rpx;
      font-size: 24rpx;
      color: rgba(32, 52, 87, .4);
    }
  }
  .itemCode{
    width: 112rpx;
  }
  .arrow{
    position: absolute;
    right: 40rpx;
  }
}
.popup {
  position: relative;
  width: 580rpx;
  /*#ifdef APP-PLUS*/
  height: calc(100vh - 156rpx);
  /*#endif*/
  /*#ifdef H5*/
  height: calc(100vh - 88rpx);
  /*#endif*/
  /*#ifdef APP-PLUS*/
  margin-top: 156rpx;
  /*#endif*/
  /*#ifdef H5*/
  margin-top: 88rpx;
  /*#endif*/
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
    margin: 10rpx 0;
    .dateInput {
      display: flex;
      // justify-content: center;
      align-items: center;
      width: 220rpx;
      height: 60rpx;
      font-size: 28rpx;
      background-color: #fff;
      border: 1px solid #000;
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
.text-left{
  margin-left: 10px;
}
.pdp{
  height: 100rpx;
}
/deep/.input-placeholder{
  font-size: 24rpx;
}
.rizhi{
  margin-left: 24rpx;
  margin-right: 8rpx;
}
</style>
