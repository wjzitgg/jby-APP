<template>
  <view class="wrapper">
    <u-navbar
      leftText="分类统计"
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
      <u-tabs
        class="tabList"
        :list="tabList2"
        :current="current2"
        @change="currentChange2"
        :scrollable="false"
        :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
      >
      </u-tabs>
      <view class="search-box">
        <view class="left">
          <view class="search-item">
            <easy-select
              ref="easySelect"
              size="mini"
              class="easySelect"
              :value="nowYear"
              @selectOne="selectOne"
              :options="yearList"
            ></easy-select>
          </view>
        </view>
        <view class="right" v-if="current2===0">
          <view class="search-input"
            ><u-input border="none" v-model="inpMaterName" placeholder='请输入物料名称' maxlength="50">
              <template slot="suffix">
                <u-icon
                name="search"
                size="28"
                @click="search"
                color="#2a82e4"
              ></u-icon>
              </template> </u-input
          ></view>
        </view>
        <view class="right" v-if="current2===1">
                <view class="data-input">
                  <view class="left" @click="openCale(endTime)">{{ endTime }}</view>
                <view class="closeBtn" @click="cleanDate">X</view>
                <view class="placeholder" v-show="!endTime" @click="openCale(endTime)">请选择截止日期</view>
              </view>
        </view>
      </view>
    </view>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" :date="clickDate" />
    <view class="pad"></view>
    <view class="content">
        <view class="table_detail table_height table_empty">
            <!-- v-if="list.length" -->
          <table >
            <thead>
              <tr>
                <th>序号</th>
                <th v-if="current2===0">物料名称</th>
                <th>物料分类</th>
                <th>仓库</th>
                <th  v-if="current2===0">单位</th>
                <th>入库总量</th>
                <th>发货总量</th>
                <th>盘盈总量</th>
                <th>盘亏总量</th>
                <th>剩余库存</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list" :key="index">
                <td>{{ index + 1 }}</td>
                <td  v-if="current2===0">{{ item.materialName }}</td>
                <td>{{ item.materialTypeName }}</td>
                <td>{{ item.warehouseName }}</td>
                <td v-if="current2===0">{{ item.unitName }}</td>
                <td>{{ item.inAmount }}</td>
                <td>{{ item.outAmount }}</td>
                <td class="green">{{ item.profitAmount > 0?item.profitAmount:''  }}</td>
                <td class="red">{{ item.loseAmount > 0?item.loseAmount:''  }}</td>
                <td>{{ item.residueAmount  }}</td>
              </tr>
            </tbody>
          </table>
          <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
        </view>
    </view>
  </view>
</template>

<script>
export default {
    computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  data() {
    return {
      tabList: [],
      current: 0,
      tabList2:[{name:'物料台账'},{name:'物料类型台账'}],
      current2:0,
      tabShow: false,
      showPop: false,
      fkWarehouseId: "",
      nowYear: "全部物料类型",
      typeId: "",
      pageNum: 1,
      total: 0,
      materialName: "",
      inpMaterName:"",
      yearList: [{value:'',label:'全部物料类型'}],
      list:[],
      clickDate:"",
      endTime:""
    };
  },
  onLoad(options) {
    if(this.user.orgType==4){
      this.findWarehouseByProjectId(uni.getStorageSync("nowProId"));
    }else{
      this.findWarehouseByProjectId("0");
    }
    this.searchMaterialType()
    this.materialLedgerSearchPage()
  },
  methods: {
    openCale(date) {
      this.clickDate = date;
      this.$refs.calendar.open();
    },
    caleConfirm(e) {
      console.log(e);
      this.endTime = e.fulldate;
      this.getList()
    },
    cleanDate(e) {
      console.log(e);
      this.endTime = "";
      this.getList()
    },
    findWarehouseByProjectId(bidProjectId) {
      this.$api.findWarehouseByProjectId({ bidProjectId }).then((res) => {
        if (res.code === 200) {
          let arr = res.data.map((item) => ({
            ...item,
            name: item.warehouseName,
          }));
          this.tabList = [{ name: "全部", pkId: "" }, ...arr];
          if (this.tabList.length) {
            this.fkWarehouseId = this.tabList[0].pkId;
          }
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
        // 查物料类型
    searchMaterialType() {
      this.$api.getSelfMaterialTypes().then((res) => {
        if (res.code == 200) {
          res.data.forEach((item) => {
            item.label = item.typeName;
            item.value = item.pkId;
          });
          this.yearList = res.data;
          this.yearList.unshift({ label: "全部物料类型", value: "" });
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    materialLedgerSearchPage(){
        let data={
            pageNum:this.pageNum,
            pageSize:10000,
            fkWarehouseId:this.fkWarehouseId,
            fkMaterialTypeId:this.typeId,
            materialName:this.materialName,
            // projectId:this.user.orgType===5?'':uni.getStorageSync('nowProId')
        }
        this.$api.materialLedgerSearchPage(data).then(res=>{
            if(res.code===200){
                this.list=res.data.records
                this.total=res.data.total
            } else {
              uni.showToast({ title: res.msg, icon: "none" });
            }
        })
    },
    materialTypeLedgerSearchPage(){
        let data={
            pageNum:this.pageNum,
            pageSize:10000,
            fkWarehouseId:this.fkWarehouseId,
            typeId:this.typeId,
            fkBidProjectId:this.user.orgType!==4?'':uni.getStorageSync('nowProId'),
            endTime:this.endTime
        }
        this.$api.materialTypeLedgerSearchPage(data).then(res=>{
            if(res.code===200){
                this.list=res.data.records
                this.total=res.data.total
            } else {
              uni.showToast({ title: res.msg, icon: "none" });
            }
        })
    },
    getList(){
        if(this.current2===0){
            this.materialLedgerSearchPage()
        }else{
            this.materialTypeLedgerSearchPage()
        }
    },
    currentChange(e) {
      this.pageNum = 1;
      this.current = e.index;
      this.materialName=''
      this.inpMaterName=''
      this.current2 =0
      this.fkWarehouseId = e.pkId;
      this.getList()
    },
    // tab点击
    listSelet(item, index) {
      // 展开传值
      this.pageNum = 1;
      this.current = index;
      this.materialName=''
      this.inpMaterName=''
      this.current2 =0
      this.fkWarehouseId = item.pkId;
      this.tabShow = false;
      this.getList()
    },
    // 汉堡点击展开tabs
    hamburg() {
      this.tabShow = !this.tabShow;
    },
    shut() {
      this.tabShow = false;
    },
    currentChange2(e){
        this.pageNum = 1;
        this.materialName=''
        this.inpMaterName=''
        this.current2 = e.index;
        this.getList()
    },
    selectOne(e) {
      this.nowYear = e.options.label;
      this.typeId = e.options.value;
      this.getList()
    },
    search(){
        this.materialName=this.inpMaterName
        this.getList()
    }
  },
};
</script>

<style lang="scss" scoped>
.pad {
  height: 274rpx;
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
.sticky {
  z-index: 99;
}
.search-box {
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
    flex:1;
    height: 60rpx;
    // padding: 0 20rpx;
    font-size: 28rpx;
    // border: 1px solid #dcdfe6;
    // background-color: #fff;
    // border-radius: 6rpx;
    .left{
      display: flex;
      align-items: center;
      width: 300rpx;
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
    .placeholder{
      position: absolute;
      left: 0;
      color: rgb(192, 196, 204);
    }
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
.table_height {
  /*#ifdef APP-PLUS*/
  max-height: calc(100vh - 454rpx);
  /*#endif*/
  /*#ifdef H5*/
  max-height: calc(100vh - 366rpx);
  /*#endif*/
}
.red {
  color: red;
}
.green {
  color: #72b74b;
}
</style>
