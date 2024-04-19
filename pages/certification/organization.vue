<template>
    <view  class="wrapper">
    <u-navbar
      leftText="组织架构"
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
      <view class="search">
        <view class="search-input">
          <u-input
            placeholder="请输入角色名称或者手机号码"
            border="none"
            v-model="name"
            maxlength="25"
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
      </view>
    </view>
    <view class="pad"></view>
    <view class="content">
        <view
        class="item"
        v-for="item in list"
        :key="item.pkId"
        @click="listClick(item)"
      >
        <u-icon name="photo" class="iconfont" size="20"></u-icon>
        <view class="item-content">
          <view class="name">{{ item.userName }}</view>
          <view class="types">{{item.telephone}}</view>
        </view>
        <view
          class="tag"
          :class="{
            'tag-link': !!item.enableStatus,
            'tag-nolink': !item.enableStatus,
          }"
          >{{ !!item.enableStatus ? "启用" : "停用" }}</view
        >
      </view>
    </view>
    <u-popup :show="showEdit" :round="20">
      <view class="bottom-popup" @touchmove.stop.prevent="moveHandle">
        <view class="head">
          <view class="name">{{ rowData.userName }}</view>
          <u-icon name="close" color="#fff" class="closeBtn" @click="showEdit = false"></u-icon>
        </view>
        <u--form class="content" labelPosition="left" :borderBottom="true">
          <u-form-item label="性别:" labelWidth="80">
            <view>{{ rowData.sex == 1 ? "男" : "女" }}</view>
          </u-form-item>
          <u-form-item label="手机号:" labelWidth="80">
            <view>{{ rowData.telephone }}</view>
          </u-form-item>
          <u-form-item label="所属部门:" labelWidth="80">
            <view>{{ rowData.deptName }}</view>
          </u-form-item>
          <u-form-item label="所属角色:" labelWidth="80">
            <view>{{ rowData.roleName }}</view>
          </u-form-item>
          <u-form-item label="所属工区:" labelWidth="80">
            <view>{{ rowData.areaName }}</view>
          </u-form-item>
          <u-form-item label="状态:" labelWidth="80">
            <view>{{ rowData.enableStatus === 0 ? "禁用" : "正常" }}</view>
          </u-form-item>
        </u--form>
      </view>
    </u-popup>
    </view>
</template>

<script>
export default {
    data(){
        return{
            orgId:"",
            name:"",
            searchName:"",
            tabList:[{name:'全部',pkId:''}],
            current: 0,
            tabShow: false,
            depId:"",
            list:[],
            rowData:{},
            showEdit: false,
        }
    },
    onLoad(options) {
        this.orgId=options.orgId
        this.searchDeptListByOrgId()
    },
    methods:{
        moveHandle() {
          return false
        },
        listClick(row) {
          this.$api.appSysUser({ userId: row.pkId }).then((res) => {
            if (res.code == 200) {
              this.showEdit = true;
              this.rowData = res.data;
            } else {
              uni.showToast({ title: res.msg, icon: "none" });
            }
          });
        },
        searchDeptListByOrgId(){
            this.$api.searchDeptListByOrgId({orgId:this.orgId}).then((res) => {
                if(res.code===200){
                    this.tabList=[{name:'全部',pkId:''},...res.data.map(item=>({...item,name:item.deptName}))]
                    this.searchUserByOrg()
                }else{
                    uni.showToast({ title: res.msg, icon: 'none' })
                }
            })
        },
        searchUserByOrg(){
            this.$api.searchUserByOrg({fkOrgId:this.orgId,keyWord:this.searchName,fkDeptId:this.depId}).then(res=>{
                if(res.code===200){
                    this.list=res.data
                }else{
                    uni.showToast({ title: res.msg, icon: 'none' })
                }
            })
        },
        search(){
            this.searchName=this.name
            this.searchUserByOrg()
        },
        currentChange(e) {
            this.current = e.index;
            this.depId=e.pkId
            this.searchUserByOrg()
        },
        // tab点击
        listSelet(item, index) {
          // 展开传值
          this.current = index;
          this.depId=item.pkId
          this.tabShow = false;
          this.searchUserByOrg()
        },
        // 汉堡点击展开tabs
        hamburg() {
          this.tabShow = !this.tabShow;
        },
        shut() {
          this.tabShow = false;
        },
    }
}
</script>

<style lang="scss" scoped>
.pad {
  height: 178rpx;
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
    width: 700rpx;
    padding-left: 20rpx;
    border: 1px solid #2a82e4;
    border-radius: 6rpx;
  }
//   .more-search {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 160rpx;
//     height: 60rpx;
//     border: 1px solid #2a82e4;
//     border-radius: 6rpx;
//     font-size: 30rpx;
//     color: #2a82e4;
//     .filterImg {
//       width: 36rpx;
//       margin-right: 6rpx;
//     }
//   }
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
      height: 40rpx;
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
    color: #18a87d;
    background-color: #d1fff1;
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
.bottom-popup {
  position: relative;
  width: 750rpx;
  height: 920rpx;
  background-color: #2a82e4;
  border-radius: 20rpx 20rpx 0 0;

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
    height: 920rpx;
    background-color: #fff;
    padding: 0 20rpx;
    border-radius: 20rpx 20rpx 0 0;

    .remark {
      max-height: 400rpx;
      overflow: auto;
    }
  }

}
</style>