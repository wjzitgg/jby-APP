<!-- 工程图纸详情 -->
<template>
  <view class="wrapper">
    <u-navbar
      leftText="员工工区划分详情"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <u--form labelPosition="left" :model="rowData" class="item-edit-form">
        <u-form-item
          label="员工姓名:"
          prop="userInfo.name"
          borderBottom
          labelWidth="80"
          ref="item1"
        >
          {{ rowData.userName }}
        </u-form-item>
        <u-form-item
          label="所属部门:"
          prop="userInfo.sex"
          borderBottom
          ref="item1"
          labelWidth="80"
        >
          {{ rowData.deptName }}
        </u-form-item>
        <u-form-item
          label="所属角色:"
          prop="userInfo.sex"
          borderBottom
          ref="item1"
          labelWidth="80"
        >
          {{ rowData.roleName }}
        </u-form-item>
        <u-form-item
          label="管理工区:"
          prop="userInfo.sex"
          borderBottom
          ref="item1"
          labelWidth="80"
        >
          {{ rowData.areaName }}
        </u-form-item>
      </u--form>
      <view class="tabs-list">
        <u-tabs :list="details" :current="current" @click="listSelet" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"></u-tabs>
      </view>
      <template v-if="details[current] && details[current].itemNameList.length > 0">
  <view class="box" v-for="(item,idx) in details[current].itemNameList" :key="idx">
        <view class="box-stair overhidden" v-if="(item.grade ==1)">
          {{item.itemName}}
          <view class="order-shadow"></view>
        </view>
        <view class="second-level overhidden" v-if="(item.grade ==2)"> {{item.itemName}} </view>
        <view class="three-level overhidden" v-if="(item.grade ==3)"><u-icon name="file-text" style="display: inline-block"></u-icon
          > {{item.itemName}}</view
        >
      </view>
 </template>
    </view>
  </view>
</template>
<!-- this.current -->
<script>
export default {
  data() {
    return {
      rowData: {},
      details: [
        {
          itemNameList:[]
        }
      ],
      current: 0,
      contractDetails: {},
      tableIndex: 0,
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);
    // return console.log(this.rowData)
    this.init();
  },
  methods: {
    init() {
      this.$api
        .findReUserAreaItemByUserId({ userId: this.rowData.pkId })
        .then((res) => {
          if (res.code == 200) {
            res.data.forEach((item, idx) => {
              item.name = item.areaName;
              item.idx = idx;
            });
            this.details = res.data;
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
    },
    download() {
      console.log("下载");
    },
    examine() {
      console.log("查看");
    },
    pageLick() {
      console.log("页数");
    },
    // tab点击
    listSelet(item, index) {
      // 展开传值
      if (index !== undefined) {
        this.current = index;
      } else {
        this.current = item.index;
      }
      this.tabShow = false;
      this.idx = item.idx;
      if (item.idx === 1) {
        this.tableIndex = item.tableInd;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.item-edit-form {
  background: #fff;
  padding: 16px;
}
.tabs-list {
  margin-top: 4px;
  padding-bottom: 12px;
  background: #fff;
}
.box {
  margin-left: 6px;
  background: linear-gradient(to right, #efefef, #ffffff);
  // .box-stair,.second-level,.three-level{
  //   display: flex;
  //   align-items: center;
  //   word-break: break-all
  // }
  .box-stair {
    line-height: 30px;
    position: relative;
    background: linear-gradient(to right, #dedede, #fff);
    .order-shadow {
      position: absolute;
      left: -6px;
      top: 0;
      width: 6px;
      height: 100%;
      background: #bbb;
    }
  }
  .second-level {
    line-height: 30px;
    background: linear-gradient(to right, #efefef, #ffffff);
  }
  .three-level {
    line-height: 50px;
    padding-left: 13px;
    margin-bottom: 4px;
    background: #fff;
  }
}
.overhidden{
  width: 700rpx;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*禁⽌换⾏*/
    text-overflow: ellipsis; /*省略号*/
}
</style>
