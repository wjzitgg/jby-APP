<template>
  <view class="wrapper">
    <u-navbar leftText="库存信息" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="content">
      <view class="search-box">
        <view class="left">
          <view class="search-item">
            <easy-select ref="easySelect" size="mini" class="easySelect" :value="nowYear" @selectOne="selectOne"
              :options="yearList"></easy-select>
          </view>
        </view>
        <view class="right">
          <view class="search-input"><u-input border="none" v-model="warehouseName" maxlength="25">
              <template slot="suffix">
                <u-icon name="search" @click="search"></u-icon>
              </template> </u-input></view>
        </view>
      </view>
      <u-list @scrolltolower="scrollTolower" class="u-list" style="margin-top: 4px" :height="'calc(100vh - 268rpx)'">
        <u-list-item v-for="(item, index) in list" :key="index">
          <view class="item" @click="detail(item)">
            <view class="icons">
              <u-icon name="home" size="20" color="#2a82e4"></u-icon>
            </view>
            <view class="content">
              <view class="name">{{ item.warehouseName
              }}<text v-if="item.isDefault == 1">(默认)</text></view>
              <view class="detail mb-20">仓库类型：{{
                item.warehouseType === 1 ? "实体仓" : "虚拟仓"
              }}</view>
              <view class="detail mb-20">负责人：{{ item.userName }}</view>
              <!-- <view class="detail">单据时间：{{ item.serviceTime }}</view> -->
            </view>
            <view class="tags">
              <!-- 结算状态，0：草稿   1：审批中  2：已完成 3: 已拒绝,4:待签章，5：签章中，6：签章已完成-->
              <view v-if="item.enableStatus === 1" class="tag success">正常</view>
              <view v-if="item.enableStatus === 0" class="tag default">禁用</view>
            </view>
          </view>
        </u-list-item>
      </u-list>
      <view type="primary" class="btn" @click="add" v-if="$auth('material:inventory:edit')">新增仓库</view>
    </view>
    <u-popup :show="showLinkPop" round="10" mode="bottom">
      <view class="showLinkPop">
        <view class="head">
          <view class="name">{{ itemData.warehouseName }}</view>
          <u-icon name="close" color="#fff" class="closeBtn" @click="closeLinkPop"></u-icon>
        </view>
        <view class="content">
          <u--form style="padding: 12px" labelPosition="left" :model="itemData" ref="form1">
            <u-form-item label="仓库类型:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
              {{ itemData.warehouseType === 1 ? "实体仓" : "虚拟仓" }}
            </u-form-item>
            <u-form-item label="仓库状态:" prop="userInfo.name" borderBottom ref="item1" labelWidth="80">
              {{ itemData.enableStatus === 1 ? "正常" : "禁用" }}
            </u-form-item>

            <u-form-item label="仓库地址:" labelWidth="80" prop="userInfo.name" borderBottom ref="item1" v-if="itemData.warehouseType === 1">
              {{ itemData.detailAddress }}
            </u-form-item>
          </u--form>
          <view style="width: 100%; height: 6px; background-color: #f6f6fc"></view>
          <u--form style="padding: 12px" labelPosition="left" :model="itemData" ref="form1">
            <u-form-item label="负责人:" prop="userInfo.name" borderBottom labelWidth="80" ref="item1">
              {{ itemData.userName }}
            </u-form-item>
            <u-form-item label="手机号码:" prop="userInfo.name" borderBottom ref="item1" labelWidth="80">
              {{ itemData.phoneNum }}
            </u-form-item>

            <u-form-item label="备注:" labelWidth="80" prop="userInfo.name" borderBottom ref="item1">
              {{ itemData.remark }}
            </u-form-item>
          </u--form>
          <view class="footer">
            <!-- <u-button
              class="btns cancle"
              type="default"
              text="取消"
              @click="closeLinkPop"
            ></u-button> -->

            <u-button class="btns" type="warning" text="停用" @click="changeStatus(1)"
              v-if="itemData.enableStatus == 1&&itemData.warehouseType === 1 && $auth('material:inventory:edit')"></u-button>
            <u-button v-else-if="itemData.enableStatus == 0&&itemData.warehouseType === 1 && $auth('material:inventory:edit')" class="btns" @click="changeStatus(2)" type="success"
              text="启用"></u-button>
            <u-button class="btns" type="primary" v-if="$auth('material:inventory:edit')" :class="{onlyBtn:itemData.warehouseType !== 1}" @click="redact" text="编辑"></u-button>
            <u-button class="btns" type="error" v-if="itemData.warehouseType === 1 && $auth('material:inventory:edit')" text="删除" @click="deleteItem(1)"></u-button>
          </view>
        </view>
      </view>
    </u-popup>
    <u-modal class="delete-item" :show="show2" title="提示" :content="promptContent" showCancelButton @cancel="show2 = false"
      @confirm="confirm"></u-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      nowYear: "",
      typeId: "",
      pageNum: 1,
      total: 0,
      warehouseName: "",
      yearList: [
        { label: "全部", value: "" },
        { label: "正常", value: "1" },
        { label: "停用", value: "0" },
      ],
      list: [{}, {}, {}, {}, {}],
      showLinkPop: false,
      itemData: {},
      show2: false,
      promptContent: ""
    };
  },
  computed: {
    	user() {
    	  return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    	},
  	},
  onLoad() {
    this.warehouseSearch();
  },
  methods: {
    deleteItem(val) {
      this.promptContent = "确定删除该仓库?"
      this.show2 = true;
    },
    // 删除确认
    confirm() {

      this.show2 = false;
      this.warehouseDelete();

    },
    warehouseDelete(){
      uni.showLoading({ mask: true })
      let data ={pkId:this.itemData.pkId}
      this.$api.warehouseDelete(data).then(res=>{
        uni.hideLoading()
        if(res.code == 200){
          this.warehouseSearch()
          this.closeLinkPop()
          uni.showToast({ title: "删除成功", icon: "none" });
        }else{
          uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    selectOne(e) {
      this.nowYear = e.options.label;
      this.typeId = e.options.value;
      this.search()
    },
    scrollTolower() {
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
      this.warehouseSearch();
    },
    search() {
      this.pageNum = 1
      this.warehouseSearch();
    },
    resh(){
      this.pageNum = 1
      this.warehouseSearch();
    },
    warehouseSearch() {
      let data = {
        pageNum: this.pageNum,
        pageSize: 20,
        enableStatus: this.typeId,
        warehouseName: this.warehouseName,
        fkBidProjectId:this.user.orgType !== 4 ? "" : uni.getStorageSync("nowProId")
      };
      uni.showLoading({ mask: true })
      this.$api.warehouseSearchPage(data).then((res) => {
        uni.hideLoading()
        if (res.code == 200) {
          if (this.pageNum == 1) {
            this.list = res.data.records;
          } else {
            this.list = [...this.list, ...res.data.records]
          }
          this.total = res.data.total - 0;
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    detail(row) {
      this.itemData = row;
      this.showLinkPop = true;
    },
    closeLinkPop() {
      this.showLinkPop = false;
    },
    // 修改仓库状态
    changeStatus() {
      uni.showLoading({ mask: true })
      this.$api.toggleRepository({ pkId: this.itemData.pkId }).then(res => {
        uni.hideLoading()
        if (res.code == 200) {
          this.warehouseSearch()
          this.closeLinkPop()
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      })
    },
    add() {
      let item = {
        itemTitle: "新增仓库"
      }
      uni.navigateTo({
        url: "/pages/material/inventory/infoAdd?row=" + JSON.stringify(item),
      });
    },
    // 编辑
    redact() {
      let item = {
        itemTitle: "编辑仓库",
        ...this.itemData
      }
      this.closeLinkPop()
      uni.navigateTo({
        url: "/pages/material/inventory/infoAdd?row=" + JSON.stringify(item),
      });
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
  height: 800rpx;
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
    background-color: #fff;
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
    position: fixed;
    bottom: 0;
    justify-content: space-evenly;
    align-items: center;
    width: 750rpx;
    height: 100rpx;
    background-color: #fff;

    .btns {
      width: 243rpx;
      margin: 2px;
    }
    .onlyBtn{
      width: 680rpx;
    }
    .cancle {
      background-color: #eeeeee;
      color: #aaaaaa;
    }
  }
}
.delete-item{
  /deep/ .u-popup__content{
  box-shadow: 1px 1px 2px 2px #cccc;
}
}

</style>
