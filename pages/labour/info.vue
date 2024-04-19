<template>
  <view class="wrapper">
    <u-navbar
      leftText="劳务信息"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="sticky search">
      <view class="search-left">
        <u-input placeholder="姓名/电话/班组名称" border="none" v-model="input" maxlength="25">
          <template slot="suffix">
            <!-- <u-icon
              name="search"
              size="26"
              color="#2a82e4"
             
              maxlength="25"
            ></u-icon> -->
           <span  class="sou"  name="search" @click="searchBtn"  >搜索</span>  
          </template>
        </u-input>
      </view>
    </view>
    <view class="pad"></view>

    <view class="content">
      <u-list height="87vh" @scrolltolower="scrolltolower" >
        <u-list-item v-for="(item, index) in showList" :key="index" >
          <u-cell isLink class="cell" @click="cellClick(item)" >
            <view slot="title">
              <view class="cell-item mb-30">
                <uni-icons class="icon-person" type="person" size="20"></uni-icons>
                <h3 class="cell-item-title"> {{item.userName}}</h3>
                <view class="state" v-if="item.dismissalStatus!==0">(已离职)</view>
              </view>
              <view class="cell-item cell-item2">
                <view class="telephone">{{item.telephone}}</view>
              </view>
                <view class="cell-item  personne"> {{item.teamName}}</view>

            </view>
            
          </u-cell>
        </u-list-item>
      </u-list>
    </view>


  </view>
</template>

<script>
export default {
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  data() {
    return {
      input: "",
      searchName: "",
      pageNum: 1,
      total: 0,
      showList: [],
    };
  },
  onLoad(options) {
    this.searchLabourTeamMembersPage()
  },
  methods: {
    searchLabourTeamMembersPage() {
      let data = {
        pageNum: this.pageNum,
        pageSize: 20,
        fkProjectBidId: [5,7].includes(this.userInfo.orgType) ? "" : uni.getStorageSync("nowProId"),
        keyWord: this.searchName,
      };
      uni.showLoading({ mask: true });
      this.$api
        .searchLabourTeamMembersPage(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            if (this.pageNum === 1) {
              this.showList = res.data.records;
            } else {
              this.showList = [...this.showList, ...res.data.records];
            }
            this.total = res.data.total-0;
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    searchBtn() {
      this.searchName = this.input;
      this.pageNum=1
      this.searchLabourTeamMembersPage();
    },
    cellClick(item) {
      uni.navigateTo({
        url: "/pages/labour/infoDetail?data=" + JSON.stringify(item),
      });
    },
    scrolltolower() {
      if (this.pageNum * 20 > this.total) {
        return;
      }
      this.pageNum = this.pageNum + 1;
      this.searchLabourTeamMembersPage();
    },
  },
};
</script>

<style lang="scss" scoped>
.pad {
  height: 80rpx;
}
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100rpx;
  padding: 20rpx;
  
  .search-left {
    // width: 70%;
    display: flex;
    align-items: center;
    padding-left: 10px;
    width: 265px;
    height: 36px;
    border-radius: 4px;
    background: rgba(249, 249, 255, 1);
    border: 1px solid rgba(221, 226, 240, 1);

  }
  .search-right {
    position: relative;
    image {
      width: 40rpx;
      // margin-top: 10rpx;
    }
  }
}
.cell {
   width: 100%;
   height: 90px;
    background: rgba(255, 255, 255, 1);
    margin-top: 15px;
  .cell-item {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    font-size: 26rpx;
    .cell-item-title {
      //   width: 450rpx;
      overflow: hidden;
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0px;
      color: rgba(32, 52, 87, 1);
      text-align: left;
      vertical-align: top;

    }
    .wh-600 {
      width: 600rpx;
    }
    .blue {
      color: #8b87ff;
    }
    .green {
      color: #7cbc18;
    }
    .money {
      color: #f59e33;
    }
  }
  .cell-item2 {
    justify-content: space-between;
    padding: 0 25px;
    margin-top: -10px;
    line-height: 20px;
  }
  .grey {
    font-size: 26rpx;
    color: #7f7f7f;
  }
}
.mb-20 {
  margin-bottom: 20rpx;
}
.mb-30 {
  margin-bottom: 30rpx;
}
.mr-20 {
  margin-right: 20rpx;
}
.sou{
font-size: 14px;
font-weight: 500;
letter-spacing: 0px;
line-height: 20.27px;
color: rgba(0, 122, 254, 1);
text-align: right;
vertical-align: top;
padding: 0 10px;

}

.name-1{
display: flex;
width: 14.69px;
height: 15.55px;
opacity: 1;
background: rgba(32, 52, 87, 1);

}
.icon-person{
    margin: 0px 8px 0  0;
}
.personne{
  opacity:0.4;
margin-left:26px ;
font-size: 14px;
font-weight: 500;
letter-spacing: 0px;
line-height: 20.27px;
color: rgba(32, 52, 87, 1);
text-align: left;
vertical-align: top;
margin-top: 5px;

}
.telephone{
opacity: 0.4;
font-size: 14px;
font-weight: 500;
letter-spacing: 0px;
line-height: 20.27px;
color: rgba(32, 52, 87, 1);
text-align: left;
vertical-align: top;

}
.content-showList{
   background-color: #f90;
}
</style>
