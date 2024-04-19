<template>
  <view class="wrapper">
    <u-navbar
      leftText="库存预警"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="pdb"></view>
    <view class="content" style="position: relative">
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
        <view class="right">
          <view class="search-input"
            ><u-input border="none" v-model="warehouseName">
              <template slot="suffix">
                <u-icon name="search" @click="warehouseSearch"></u-icon>
              </template> </u-input
          ></view>
        </view>
      </view>
      <view class="table_detail table_empty" style="margin-top: 2px">
        <table>
          <thead>
            <tr>
              <th style="width: 40px">
                <u-icon name="list" style="display: inline-block"></u-icon>
              </th>
              <th>物料名称</th>
              <th>物料类型</th>
              <th>单位</th>
              <th>预警上限</th>
              <th>预警下限</th>
              <th>当前库存量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td><text :class="{clickTd:user.orgType!=4}" @click="detail(item)">{{ index + 1 }}</text></td>
              <td>{{ item.materialName }}</td>
              <td>{{ item.materialTypeName }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ item.alertUpperNum }}</td>
              <td>{{ item.alertDownNum }}</td>
              <td>{{ item.stockNum }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      </view>
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
      <view type="primary" class="btn" @click="add" v-if="$auth('material:inventory:edit')">新增物料预警</view>
    </view>
    <u-popup :show="showLinkPop" :round="10" mode="bottom">
      <view class="showLinkPop">
        <view class="head">
          <view class="name">{{ rowData.title }}</view>
          <u-icon
            name="close"
            color="#fff"
            class="closeBtn"
            @click="closeLinkPop"
          ></u-icon>
        </view>
        <view class="content">
          <view>
            <view class="form-title">预警仓库</view>
            <view class="select" @click="warehouseShow = true">
              <view class="name">{{ warehouseData.name }}</view>
              <u-icon
                name="arrow-down-fill"
                class="icons"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
            <u-picker
              :show="warehouseShow"
              :columns="warehouseList"
              keyName="name"
              @cancel="warehouseClose"
              @confirm="warehouseConfirm"
            ></u-picker>
          </view>
          <view>
            <view class="form-title">限额物料</view>
            <view class="select" @click="selectMaterials">
              <view class="name">{{ materialData.fkTypeName }}</view>
              <u-icon
                name="arrow-down-fill"
                class="icons"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
          </view>

          <view>
            <view class="form-title">预警上限</view>
            <u--input
              placeholder="请输入内容"
              border="none"
              v-model="rowData.alertUpperNum"
              customStyle=""
              class="form-content"
              type="number"
              clearable
            ></u--input>
          </view>
          <view>
            <view class="form-title">预警下限</view>
            <u--input
              placeholder="请输入内容"
              border="none"
              v-model="rowData.alertDownNum"
              customStyle=""
              type="number"
              class="form-content"
              clearable
            ></u--input>
          </view>
          <view>
            <view class="form-title">现有库存量</view>
            <u--input
              border="none"
              v-model="storeNum"
              customStyle=""
              class="form-content"
              clearable
              disabled
            ></u--input>
          </view>
          <view class="footer" style="margin-top: 50px" v-if="$auth('material:inventory:edit')">
            <u-button
              class="btns cancle"
              type="default"
              text="取消"
              @click="closeLinkPop"
            ></u-button>
            <u-button
              v-if="rowData.title == '编辑库存预警'"
              class="btns"
              type="error"
              text="删除"
              @click="expurgate"
            ></u-button>
            <u-button
              class="btns"
              type="primary"
              @click="preserve"
              text="保存"
            ></u-button>
          </view>
        </view>
      </view>
    </u-popup>
    <materialSelect
      :treeData="treeData"
      ref="materialSelect"
      @checked="checked"
    ></materialSelect>
  </view>
</template>

<script>
import materialSelect from "@/components/warning-selects/warning-selects.vue";
export default {
  components: {
    materialSelect,
  },
  computed: {
    	user() {
    	  return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    	},
  	},
  data() {
    return {
      nowYear: "全部物料类型",
      typeId: "",
      pageNum: 1,
      total: 0,
      warehouseName: "",
      yearList: [],
      list: [],
      showLinkPop: false,
      show1: false,
      current: 0,
      tabList: [{name:'全部',pkId:""}],
      rowData: {},
      materialData: {},

      warehouseShow: false,
      warehouseList: [],
      warehouseData: {},
      storeNum:0,
      treeData: [],
    };
  },
  onLoad() {
    this.findSelfWarehouse();
    this.searchMaterialType();
  },
  methods: {
    warehouseClose() {
      this.warehouseShow = false;
    },
    warehouseConfirm(e) {
      this.warehouseData = e.value[0];
      this.warehouseShow = false;
      if(this.materialData.pkId){
        this.getMaterialsInventory()
      }
    },
    // 查物料类型
    searchMaterialType() {
      this.$api.searchMaterialType().then((res) => {
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
    getMaterialsInventory(){
      let data={materialId:this.materialData.pkId,warehouseId:this.warehouseData.pkId}
      this.$api.getMaterialsInventory(data).then(res=>{
        if(res.code===200){
          this.storeNum=res.data.inventoryNum
        }else{
          uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    // 物资选中回调
    checked(item) {
      console.log(item);
      this.materialData = item;
      if(this.warehouseData.pkId){
        this.getMaterialsInventory()
      }
    },
    findSelfWarehouse() {
      this.$api.findWarehouseByProjectId({bidProjectId: [5,6].includes(this.user.orgType)? "0" : uni.getStorageSync("nowProId")}).then((res) => {
        if (res.code == 200) {
          res.data.forEach((item) => {
            item.name = item.warehouseName;
          });
          this.tabList = [{name:'全部',pkId:""},...res.data];
          this.warehouseList = [res.data];
          this.warehouseSearch();
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    shut() {
      this.show1 = false;
    },
    listSelet(item, index) {
      // 展开传值
      console.log();
      if (index !== undefined) {
        this.current = index;
      } else {
        this.current = item.index;
      }

      this.warehouseSearch();
    },
    hamburg() {
      this.show1 = true;
    },
    selectOne(e) {
      this.nowYear = e.options.label;
      this.typeId = e.options.value;
      this.warehouseSearch()
    },
    warehouseSearch() {
      let data = {
        pageNum: this.pageNum,
        pageSize: 20,
        fkWarehouseId:this.tabList.length? this.tabList[this.current].pkId:'',
        fkBidProjectId:this.user.orgType !==4  ? "" : uni.getStorageSync("nowProId"),
        materialName:this.warehouseName,
        materialTypeId:this.typeId
      };
      this.$api.materialInventoryAlertPage(data).then((res) => {
        if (res.code == 200) {
          if(this.pageNum===1){
            this.list = res.data.records;
          }else{
            this.list=[...this.list,...res.data.records]
          }
          this.total = res.data.total - 0;
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },

    closeLinkPop() {
      this.showLinkPop = false;
    },
    selectMaterials() {
      this.getMaterials(this.user.orgType==7?uni.getStorageSync("nowProId"):'');
      this.$refs.materialSelect.selectShow = true;
    },
    // 查物料
    getMaterials(projectId) {
      this.$api.getMaterials({projectId}).then((res) => {
        if (res.code == 200) {
          this.treeData = res.data;
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },

    // 编辑
    detail(row) {
      if(this.user.orgType==4) return
      let rows = JSON.stringify(row)
      this.rowData = JSON.parse(rows);
      console.log(row);
      this.rowData.title = "编辑库存预警";
      this.showLinkPop = true;
      this.warehouseData = {
        pkId: row.fkWarehouseId,
        name: row.warehouseName,
      };
      this.materialData ={
        fkTypeName:row.materialTypeName,
        pkId:row.fkMaterialId
      }
      this.getMaterialsInventory()
    },
    add() {
      this.showLinkPop = true;
      this.storeNum =""
      this.rowData = {};
      this.warehouseData = {};
      this.materialData ={}
      this.rowData.title = "新增库存预警";
    },
    // 删除
    expurgate() {
      this.$api
        .materialInventoryAlertDelete({ pkId: this.rowData.pkId })
        .then((res) => {
          if (res.code == 200) {
            this.closeLinkPop();
            this.warehouseSearch();
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        });
    },
    // 保存
    preserve() {
      // 1527133753570459650
      let data = {
        alertDownNum: this.rowData.alertDownNum, //下限
        alertUpperNum: this.rowData.alertUpperNum, //上限
        fkMaterialId: this.materialData.pkId, //物料id
        fkWarehouseId: this.warehouseData.pkId, //仓库id
      };
      uni.showLoading({ mask: true });
      if (this.rowData.title == "新增库存预警") {
        this.$api.materialInventoryAlertAdd(data).then((res) => {
          if (res.code == 200) {
            this.closeLinkPop();
            uni.showToast({ title: "新增成功", icon: "none" });
            this.warehouseSearch();
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
          uni.hideLoading()
        });
      } else {
        // 修改
        data.pkId = this.rowData.pkId;
        this.$api.materialInventoryAlertUpdate(data).then((res) => {
          if (res.code == 200) {
            this.closeLinkPop();
            this.warehouseSearch();
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
          uni.hideLoading()
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
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
.showLinkPop {
  height: 1000rpx;
  background-color: #2a82e4;
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    // line-height: 80rpx;
    padding: 0 20rpx;
    color: #fff;
    font-size: 28rpx;
  }
  .content {
    height: 100%;
    background-color: #f7f7ff;
    padding-top: 30rpx;
    font-size: 28rpx;
    border-radius: 20rpx 20rpx 0 0;
    .title {
      padding-left: 20rpx;
      font-weight: 600;
      margin-bottom: 10rpx;
    }
    .inputs {
      display: flex;
      align-items: center;
      height: 80rpx;
      padding: 0 20rpx;
      background-color: #fff;
      margin-bottom: 20rpx;
    }
    .searchRes {
      overflow: auto;
      height: 400rpx;
      background-color: #fff;
    }
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .footer {
    display: flex;
    //position: fixed;
    bottom: 0;
    justify-content: space-evenly;
    align-items: center;
    height: 100rpx;
    background-color: #fff;
    .btns {
      //width: 243rpx;
      flex: 1;
      margin: 2px;
    }
    .cancle {
      background-color: #eeeeee;
      color: #aaaaaa;
    }
  }
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
  .arrow-up {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
}

.action {
  color: #203457;
}
.form-title {
  margin-left: 20rpx;
  line-height: 60rpx;
}
.form-content {
  height: 80rpx;
  padding-left: 20rpx !important;
  background: #fff;
}
.select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  background-color: #fff;
}
.name {
  width: 520rpx;
  // margin-bottom: 20rpx;
  font-weight: 600;
  font-size: 30rpx;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁⽌换⾏*/
  text-overflow: ellipsis; /*省略号*/
}
.pdb{
  height: 14rpx;
}
</style>
