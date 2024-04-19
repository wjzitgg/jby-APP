<template>
  <view class="wrapper">
    <u-navbar
      leftText="所辖单位"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="list-content">
      <view class="swipe-action u-border-top u-border-bottom">
        <view class="item">
          <view class="line bg1"></view>
          <view class="orgContent">
            <view class="orgType">
              <view class="orgTypeName">集团总公司</view>
            </view>
            <view class="orgName">{{ objData.orgName }}</view>
            <view class="linkUser">{{ objData.linkMan }}</view>
            <view class="linkPhone">{{ objData.linkPhone }}</view>
            <image
              class="logo"
              mode="widthFix"
              :src="
                objData.orgLogo
                  ? objData.orgLogo
                  : '/static/image/superiors1.png'
              "
            ></image>
          </view>
        </view>
      </view>
      <view class="content" v-if="objData.childList.length">
      <view class="content-title">单位子公司</view>
      <view class="content-list" v-for="(item, idx) in objData.childList" :key="idx" @click="listLick(item)">
        <u-icon name="../../static/image/subsidiary.png" size="36" style="border-radius:50%"></u-icon>
        <view>
          <view class="contract-name">{{ item.orgName }}</view>
          <view class="contract-amount">
           {{item.linkMan}}
        </view>
        </view>
      </view>
    </view>
    </view>
  </view>
</template>

<script>
import tableForm from "../../components/table-form/table-form.vue";
export default {
  components: { tableForm },
  data() {
    return {

      loading: false,
      objData: {
        childList:[]
      },

    };
  },
  onLoad(options) {
    // this.getList();
    this.getChildOrg();
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },

  },
  methods: {
    getChildOrg() {
      this.loading = true;
      this.$api.getChildOrg().then((res) => {
        if (res.code == 200) {
          this.objData = res.data;
          this.loading = false;
        } else {
          this.loading = false;
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    listLick(item){
      console.log("Xxxxxxxxxx")
      console.log(item)
      console.log("Xxxxxxxxxx")
      // return
      // let pkId = item.pkId
      // let name = item.orgName
      // uni.navigateTo({
      //     url: `/pages/certification/affiliatedUnitsEdit?pkId=${item.pkId}&title=${item.orgName}`,
      //   });
      uni.navigateTo({
				url: "/pages/certification/affiliatedUnitsEdit?item=" + JSON.stringify(item)
			});
    }
  },
};
</script>

<style lang="scss" scoped>
.list-content {
  padding: 0 24rpx;
}
.item {
  position: relative;
  display: flex;
  width: 100%;
  height: 360rpx;
  margin-top: 20rpx;
  border-radius: 8rpx;
  overflow: hidden;
  background-color: #fff;
  z-index: 1;
  .logo {
    position: absolute;
    bottom: 0;
    right: 22rpx;
    width: 230rpx;
    height: 230rpx;
    z-index: -1;
  }
  .line {
    width: 12rpx;
    height: 100%;
  }
  .orgContent {
    flex: 1;
    padding: 46rpx 28rpx;
    .orgType {
      display: flex;
      font-size: 24rpx;
      margin-bottom: 18rpx;
      .orgTypeName {
        color: #095cab;
      }
      .linkType {
        margin-left: 20rpx;
        opacity: 0.2;
      }
    }
    .orgName {
      font-weight: 700;
      font-size: 32rpx;
      line-height: 44rpx;
      margin-bottom: 56rpx;
    }
    .linkUser {
      margin-bottom: 8rpx;
    }
    .linkUser,
    .linkPhone {
      line-height: 36rpx;
      font-size: 24rpx;
    }
  }

}

.content {
 margin-top: 20rpx;
 .content-title{
  background: #fff;
  padding: 20rpx;
  font-weight: 800;
 }
.content-list {
  display: flex;
  align-items: start;
  position: relative;
  margin-bottom: 4px;
  padding: 20rpx;
  background: #fff;

  .contract-name {
    margin-left: 20rpx;
    margin-top: 10rpx;
    margin-bottom: 6rpx;
    font-weight: 700;
    font-size: 28rpx;
  }

  .contract-amount {
    margin-left: 20rpx;
    line-height: 40rpx;
    font-size: 12px;
    color: #a6aebc;
  }

  .contract-status-normal {
    position: absolute;
    right: 19px;
    top: 20px;
    font-size: 13px;
    padding: 4px 7px;
    background: #d1fff1;
    border-radius: 5px;
    color: #3db994;
  }

  .contract-status-suspend {
    position: absolute;
    right: 19px;
    top: 20px;
    font-size: 13px;
    padding: 4px 7px;
    background: #eeeeee;
    border-radius: 5px;
    color: #b8b8b8;
  }
}
}





</style>