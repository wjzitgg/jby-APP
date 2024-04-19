<template>
  <view style="height:100%">
    <view class="head">
      <!-- <u-tabs
          class="tabList"
          :list="tabList"
          :current="current"
          @change="currentChange"
          :scrollable="false"
          :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
        ></u-tabs> -->
        <u-radio-group v-model="current" @change="currentChange">
        	<u-radio shape="circle" :label="item.name" :name="index" v-for="(item,index) in tabList" :key="index"></u-radio>
        </u-radio-group>
    </view>
    <view class="conntent">
      <view class="table_detail table_height1 table_empty">
        <!--  -->
      <table v-if="list.length">
        <thead>
          <tr>
            <th>序号</th>
            <th>设备名称</th>
            <th>期名</th>
            <th>设备类型</th>
            <th>型号</th>
            <th>{{current===0?'租赁单价':'购买单价'}}</th>
            <th>{{current===0?'租赁数量':'购买数量'}}</th>
            <th>{{current===0?'月租金':'月折旧价'}}</th>
            <th>{{current===0?'租赁期限':'折旧期限'}}</th>
            <th>{{this.current===0?'月租金合计':'月折旧价合计'}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list" :key="index">
            <td><text class="clickTd" @click="openPop2(item,item.deviceName)">{{ index + 1 }}</text></td>
            <td>{{ item.deviceName }}</td>
            <td>{{ item.issueName }}</td>
            <td>{{ item.className }}</td>
            <td>{{ item.deviceCode}} </td>
            <td>{{ item.price }}</td>
            <td>{{ item.buyNum}} </td>
            <td>{{ item.depreciationPrice}} </td>
            <td>{{ item.liveTime}} </td>
            <td>{{ item.priceTotal}} </td>
          </tr>
        </tbody>
      </table>
      <u-empty v-if="list.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png" :style="{top: list.length>6?'':'calc(100% - 400rpx)'}"></u-empty>
      <u-empty
        v-else
        style="height: 100%"
        mode="data"
        text="暂无数据"
        icon="/static/image/noData.png"
      ></u-empty>
    </view>
    </view>
    <uni-calendar
      ref="calendar"
      :insert="false" 
      @confirm="caleConfirm"
      :date="clickDate"
    />
    <u-popup :show="showPop2" :round="20" :zIndex='998'>
      <view class="popup2">
        <view class="popup2-head">
          <view class="name">{{popName2}}</view>
          <u-icon
            name="close"
            color="#fff"
            class="closeBtn"
            @click="closePop2"
          ></u-icon>
          <!-- <view ></view> -->
        </view>
        <view class="popup2-content">
          <view class="info-item mb-20">
            <view class="popup2-content-head">基本信息</view>
            <u--form labelPosition="left" :borderBottom='true'>
            <!-- <u-form-item label="期数" labelWidth='80'>
              <view>{{nowClick.orderCode}}</view>
            </u-form-item> -->
            <u-form-item label="设备名称" labelWidth='80'>
              <view>{{nowClick.deviceName}}</view>
            </u-form-item>
            <u-form-item label="设备类型" labelWidth='80'>
              <view>{{nowClick.className}}</view>
            </u-form-item>
            <u-form-item label="设备型号" labelWidth='80'>
                <view>{{nowClick.deviceCode}}</view>
            </u-form-item>
            <u-form-item label="设备品牌" labelWidth='80'>
                <view class="remark">{{nowClick.brandName}}</view>
            </u-form-item>
            <u-form-item label="设备厂商" labelWidth='80'>
                <view>{{nowClick.manufacturer}}</view>
            </u-form-item>
            <u-form-item label="设备出厂日期" labelWidth='120'>
                <view>{{nowClick.factoryTime}}</view>
            </u-form-item>
            </u--form>
          </view>
          <view class="info-item mb-20" v-if="nowClick.deviceAttributes&&nowClick.deviceAttributes.length">
            <view class="popup2-content-head">其他信息</view>
            <u--form labelPosition="left" :borderBottom='true'>
              <u-form-item :label="item.attributeName" labelWidth='80' v-for="(item,index) in nowClick.deviceAttributes" :key="index">
                <view>{{item.attributeVal}}</view>
              </u-form-item>
            </u--form>
          </view>
          <view class="info-item mb-20">
            <view class="popup2-content-head">{{nowClick.consumeType===1?'购买信息':'租凭信息'}}</view>
            <u--form labelPosition="left" :borderBottom='true'>
              <u-form-item label="总计" labelWidth='80'>
                <view>{{nowClick.price && nowClick.buyNum ? nowClick.price * nowClick.buyNum : 0}}</view>
              </u-form-item>
              <u-form-item :label="nowClick.consumeType===1?'购买单价':'租凭单价'" labelWidth='80'>
                <view>{{nowClick.price}}</view>
              </u-form-item>
              <u-form-item :label="nowClick.consumeType===1?'购买设备数':'租凭设备数'" labelWidth='80'>
                <view>{{nowClick.buyNum}}</view>
              </u-form-item>
              <u-form-item :label="nowClick.consumeType===1?'月折旧价':'月租金'" labelWidth='80'>
                <view>{{nowClick.depreciationPrice}}</view>
              </u-form-item>
              <u-form-item :label="nowClick.consumeType===1?'购买日期':'使用期限'" labelWidth='80'>
                <view>{{nowClick.liveTime}}</view>
              </u-form-item>
            </u--form>
          </view>
          <view class="info-item mb-20">
            <view class="popup2-content-head">使用信息</view>
            <u--form labelPosition="left" :borderBottom='true'>
              <u-form-item label="使用部门" labelWidth='80'>
                <view>{{nowClick.deptName}}</view>
              </u-form-item>
              <u-form-item label="使用部位" labelWidth='80'>
                <view>{{nowClick.itemName}}</view>
              </u-form-item>
            </u--form>
          </view>
          <view class="info-item">
            <view class="popup2-content-head">设备照片</view>
            <view class="imgList">
              <image
                v-for="(item,index) in imgList"
                :key="index"
                :src="item"
                @click="imgClick(index)"
                mode="widthFix"
              />
            </view>
          </view>
        </view>
        <view class="pdb"></view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data(){
    return{
       tabList: [{ name: "设备租凭" }, { name: "设备购买" }],
      current: 0,
      list:[],
      clickDate:'',
      endDate:'',
      name:'',
      deviceName:'',
      popName2:"",
      nowClick:{},
      showPop2:false,
      imgList:[]
    }
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  props:{
    fkOrgId:"",
    endTime:"",
  },
  mounted(options) {
    this.actualCostDeviceSearch()
  },
  methods:{
    actualCostDeviceSearch(){
      let data={
         consumeType:this.current,
         endDate:this.endTime,
         deviceName:this.deviceName,
         fkOrgId:this.fkOrgId
      }
      uni.showLoading({ mask: true })
      this.$api.actualCostDeviceSearch(data).then((res) => {
        uni.hideLoading()
        if(res.code===200){
          this.list=res.data
        }else{
          uni.showToast({ title: res.msg, icon: 'none' })
        }
      }).catch((err) => {
        uni.hideLoading()
      });
    },
    findDeviceById(pkId){
      uni.showLoading({ mask: true })
      console.log(1);
      this.$api.findDeviceById({pkId}).then(res=>{
        uni.hideLoading()
        if(res.code===200){
          this.nowClick=res.data
          this.imgList=res.data.deviceUrl.split(',')
          this.showPop2=true
        }else{
           uni.showToast({ title: res.msg, icon: 'none' })
        }
      }).catch((err) => {
        uni.hideLoading()
      });
    },
     currentChange(e){
      // this.current=e.index
      this.actualCostDeviceSearch()
    },
    search() {
      this.deviceName=this.name
      this.actualCostDeviceSearch()
    },
     cleanDate(e) {
      console.log(e);
      if (e == 1) {
        this.inpDate.beginTime = "";
      } else {
        this.endDate = "";
      }
       this.actualCostDeviceSearch()
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
        this.endDate = e.fulldate;
      }
       this.actualCostDeviceSearch()
    },
    openPop2(item,name) {
      // this.nowClick=item
      this.popName2=name
      this.findDeviceById(item.fkDeviceId)
    },
    closePop2(){
      this.showPop2=false
    },
    imgClick(index){
      uni.previewImage({
        current:index,
        urls:this.imgList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.head{
  display: flex;
  align-items: center;
  height: 88rpx;
  margin-bottom: 10rpx;
  padding-left: 20rpx;
  background-color: #fff;
}
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  .search-input {
    // width: 540rpx;
    padding-left: 20rpx;
    border: 1px solid #2a82e4;
    border-radius: 6rpx;
  }
  .w-540{
    width: 540rpx;
  }
  .w-700{
    width: 700rpx;
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
.pad-20{
  padding: 0 20rpx;
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
    padding: 0 20rpx;
    font-size: 28rpx;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    border-radius: 6rpx;
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
.table_height1 {
  /*#ifdef APP-PLUS*/
  // max-height: calc(100vh - 354rpx);
  height: calc(100vh - 354rpx);
  /*#endif*/
  /*#ifdef H5*/
  // max-height: calc(100vh - 266rpx);
  height: calc(100vh - 266rpx);
  /*#endif*/
}
.table_height2 {
   /*#ifdef APP-PLUS*/
  height: calc(100vh - 434rpx);
  /*#endif*/
  /*#ifdef H5*/
  height: calc(100vh - 346rpx);
  /*#endif*/
}
.popup2 {
  position: relative;
  width: 750rpx;
  height: 1200rpx;
  background-color: #2a82e4;
  border-radius: 20rpx 20rpx 0 0;
  .popup2-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    // line-height: 80rpx;
    padding: 0 20rpx;
    color: #fff;
    font-size: 28rpx;
  }
  .popup2-content {
    height:1120rpx;
    padding-top: 40rpx;
    overflow: auto;
    background-color: #fff;
    // padding: 0 20rpx;
    border-radius: 20rpx 20rpx 0 0;
    .popup2-content-head{
      height: 60rpx;
      line-height: 60rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      background: linear-gradient(90deg, rgba(230, 235, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)
    }
    .info-item{
      padding-bottom: 20rpx;
      .imgList{
        display: flex;
        flex-wrap: wrap;
        padding: 10rpx 20rpx;
        image{
          width: 350rpx;
          margin-bottom: 10rpx;
        }
        :nth-child(2n){
          margin-left: 10rpx;
        }
      }
    }
    .remark{
        max-height: 400rpx;
        overflow: auto;
    }
    .u-form-item{
      padding: 0 20rpx;
      border-bottom: 1px solid #eee;
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 100rpx;
    background-color: #fff;
    .btns {
      width: 210rpx;
    }
    .cancle {
      background-color: #eeeeee;
      color: #aaaaaa;
    }
  }
}
/deep/ .u-transition{
  z-index: 997 !important; 
}
</style>