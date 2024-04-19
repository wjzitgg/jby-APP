<template>
  <view class="wrapper">
    <u-navbar
      leftText="合作单位"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="sticky">
      <view class="search">
        <u-input placeholder="请输入合作单位名称" border="none" v-model="name" maxlength="50">
          <template slot="suffix">
            <u-icon name="search" size="28" @click="search"></u-icon>
          </template>
        </u-input>
      </view>
    </view>
    <view class="pad"></view>
    <view class="content">
      <view
        class="item"
        v-for="item in showList"
        :key="item.pkId"
        @click="openPop(item)"
      >
        <u-icon name="photo" class="iconfont" size="20"></u-icon>
        <view class="item-content">
          <view class="name">{{ item.orgName }}</view>
          <view class="types">负责人：{{ item.orgLinkMan }}</view>
        </view>
        <view
          class="tag"
          :class="{
            'tag-link': !!item.linkStatus,
            'tag-nolink': !item.linkStatus,
          }"
          >{{ !!item.linkStatus ? "已关联" : "未关联" }}</view
        >
      </view>
    </view>
    <view class="pdb"></view>
    <!-- <view class="btn" @click="go(1)">新增</view> -->
    <u-popup :show="showPop" :round="20">
      <view class="popup detil-pop">
        <view class="detil-pop-head">
          <view class="name">{{ nowClick.orgName }}</view>
          <u-icon name="close" class="closeBtn close-btn" @click="closePop" ></u-icon>
        </view>
        <view class="detil-pop-content">
          <tableForm :pageHeight="false" :pageMr="false" :list="[
          {name:'联系人',value:nowClick.orgLinkMan,show:true},
          {name:'联系电话',value:nowClick.orgLinkPhone,show:true},
          {name:'关联状态',value:!!nowClick.linkStatus ? '已关联' : '未关联',show:true},
          {name:'备注',value:nowClick.remark,show:true},
          ]">
          </tableForm>
        </view>
      </view>
      <!-- 绑定弹框 -->
      <u-popup :show="showLinkPop">
        <view class="showLinkPop">
          <view class="head">
            <view class="name">绑定关联</view>
            <u-icon
              name="close"
              color="#fff"
              class="closeBtn"
              @click="closeLinkPop"
            ></u-icon>
          </view>
          <view class="content">
            <view class="title">手机号</view>
            <view class="inputs">
              <u--input
                v-model="linkPhone"
                border="none"
                clearable
                maxlength="11"
                type="number"
              ></u--input>
            </view>
            <view class="title">搜索结果</view>
            <view class="searchRes" v-if="!loading">
              <view class="item" v-for="item in linkList" :key="item.pkId">
                <u-icon name="photo" class="iconfont" size="20"></u-icon>
                <view class="item-content">
                  <view class="name">{{ item.orgName }}</view>
                  <view class="types">{{ orgTypeList[item.orgType] }}</view>
                </view>
                <view class="linkBtn tag-link" @click="isLink(item)">绑定</view>
              </view>
            </view>
            <view class="searchRes loading" v-else>
              <u-loading-icon></u-loading-icon>
            </view>
          </view>
          <view class="footer">
            <u-button
              class="btns cancle"
              type="default"
              text="取消"
              @click="closeLinkPop"
            ></u-button>
            <u-button
              class="btns"
              type="primary"
              text="搜索"
              @click="searchLinkList"
            ></u-button>
          </view>
        </view>
      </u-popup>
      <!-- 删除弹框 -->
      <u-modal
        :show="showDelMod"
        title="删除确认"
        content="确定删除该客户信息？"
        showCancelButton
        @confirm="delConfirm"
        @cancel="closeDelMod"
      ></u-modal>
      <!-- 绑定弹框 -->
      <u-modal
        :show="showLinkMod"
        title="解除关联确认"
        content="确定解除该客户信息在系统中关联关系？"
        showCancelButton
        @confirm="linkModConfirm"
        @cancel="closeLinkMod"
      ></u-modal>
    </u-popup>
  </view>
</template>

<script>
import tableForm from '../../components/table-form/table-form.vue';
export default {
  components:{tableForm},
  onShow() {
    this.getSubOrg();
  },
  data() {
    return {
      showPop: false,
      showLinkPop: false,
      showDelMod: false,
      showLinkMod: false,
      remark: "",
      name: "",
      list: [],
      showList: [],
      orgTypeList: [
        "系统运营商",
        "系统代理商",
        "建设单位",
        "监理公司",
        "施工单位",
        "项目部",
        "供应商",
        "分包商",
        "劳务工人",
        "设计院",
      ],
      nowClick: {},
      loading: false,
      linkList: [],
      linkPhone: "",
    };
  },
  methods: {
    getSubOrg() {
      this.$api.getCooperator({linkName:this.name}).then((res) => {
        if (res.code === 200) {
          this.list = res.data;
          this.showList = res.data;
        } else {
         uni.showToast({ title: res.msg,icon:'none' });
        }
      });
    },
    updateRelationById(pkId, orgId) {
      uni.showLoading({ mask: true });
      this.$api
        .updateRelationById({ pkId, orgId })
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            if (orgId) {
              uni.showToast({ title: "绑定成功" });
              this.closeLinkPop();
              this.closePop();
            } else {
              uni.showToast({ title: "解绑成功" });
              this.closeLinkMod();
              this.closePop();
            }
          } else {
           uni.showToast({ title: res.msg,icon:'none' });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    go(type) {
      let url = `/pages/custom/detail?tiltetype=2&type=${type}`;
      if (type === 2) {
        url = url + `&obj=${JSON.stringify(this.nowClick)}`;
      }
      uni.navigateTo({ url });
      this.closePop();
    },
    openPop(item) {
      this.nowClick = item;
      this.showPop = true;
    },
    delCus() {
      this.showDelMod = true;
    },
    delConfirm() {
      this.$api.clearCustomLink({ pkId: this.nowClick.pkId }).then((res) => {
        if (res.code === 200) {
          uni.showToast({ title: "删除成功", icon: "success" });
          this.getSubOrg();
          this.closeDelMod();
          this.closePop();
        } else {
         uni.showToast({ title: res.msg,icon:'none' });
        }
      });
    },
    closeDelMod() {
      this.showDelMod = false;
    },
    relieveLink() {
      this.showLinkMod = true;
    },
    linkModConfirm() {
      this.updateRelationById(this.nowClick.pkId);
    },
    closeLinkMod() {
      this.showLinkMod = false;
    },
    closePop() {
      this.showPop = false;
    },
    openLinkPop() {
      this.showLinkPop = true;
    },
    isLink(row) {
      this.updateRelationById(this.nowClick, row.pkId);
    },
    searchLinkList() {
      let data = {
        linkPhone: this.linkPhone,
        orgType: this.nowClick.orgType,
      };
      this.loading = true;
      this.$api
        .searchOrgLinkPhone(data)
        .then((res) => {
          this.loading = false;
          if (res.code === 200) {
            this.linkList = res.data;
          } else {
           uni.showToast({ title: res.msg,icon:'none' });
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeLinkPop() {
      this.showLinkPop = false;
    },
    search() {
      this.showList = this.list.filter(
        (item) => item.orgName.indexOf(this.name) !== -1
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.sticky {
  display: flex;
  align-items: center;
  height: 80rpx;
  background-color: #fff;
  padding: 0 20rpx;
  .search {
    width: 700rpx;
    padding-left: 20rpx;
    border: 1px solid #2a82e4;
    border-radius: 6rpx;
  }
}
.pad {
  height: 80rpx;
}
.item {
  display: flex;
  align-items: start;
  padding: 30rpx 20rpx;
  background-color: #fff;
  margin-bottom: 10rpx;
  .iconfont {
    width: 60rpx;
  }
  .item-content {
    width: 550rpx;
    .name {
      max-width: 550rpx;
      margin-bottom: 20rpx;
      font-size: 30rpx;
      font-weight: 600;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
    }
    .types {
      font-size: 24rpx;
    }
  }
  .tag {
    width: 100rpx;
    padding: 10rpx;
    font-size: 24rpx;
    text-align: center;
  }
  .tag-link {
    color: #2a82e4;
    background-color: #d9f4ff;
  }
  .tag-nolink {
    color: #aaaaaa;
    background-color: #eeeeee;
  }
  .linkBtn {
    width: 100rpx;
    height: 74rpx;
    line-height: 74rpx;
    text-align: center;
    background-color: #d4e6fa;
    color: #2a82e4;
  }
}
.pdb {
  height: 100rpx;
}
.popup {
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
    height: 620rpx;
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
    justify-content: space-evenly;
    align-items: center;
    height: 100rpx;
    background-color: #fff;
    .btns {
      width: 300rpx;
    }
    .cancle {
      background-color: #eeeeee;
      color: #aaaaaa;
    }
  }
}
</style>
