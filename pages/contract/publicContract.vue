<!-- 合同公共列表 -->
<template>
  <view class="wrapper">
    <u-navbar :leftText="contractTitle" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>

    <view class="sticky">
      <searchInput @search="search" v-model="keyWord"  placeholder="请输入合同名称" maxlength="50"></searchInput>
    </view>
     <view class="pad"></view>
    <view class="content" v-if="contractList.length">
      <view class="content-list" v-for="(item, idx) in contractList" :key="idx" @click="listLick(item.pkId)">
        <u-icon name="../../static/fileImg/file-text.png" size="20"></u-icon>
        <view>
          <view class="contract-name">{{ item.contractName }}</view>
          <view class="contract-amount" style="color: red">
          ￥{{ menuCodeData.states == 1 ? item.amount : '***' }}
        </view>
        </view>
          <view class="contract-status-normal" v-if="item.enableStatus == 0">
          正常
          </view>
          <view class="contract-status-suspend" v-if="item.enableStatus == 1">
            中止
          </view>
        
      </view>
    </view>
    <view class="noData" v-if="!contractList.length">
      <u-empty style="height: 100%" mode="data" text="暂无可验收工程" icon="/static/image/noData.png"  > </u-empty>
    </view>
    <view class="btn" @click="addCon" v-if="$auth(jurisdiction.add)">新增合同</view>
    <!-- <u-popup :show="popShow" mode="right" @close="closePop" @open="openPop" class="pop-bgImg" bgColor="rgba(255, 255, 255, 0)">
      <view class="popup">
        <view class="tip">请选择筛选条件</view>
        <view class="popup-content">
        <view class="filter-title">合同状态</view>
          <view class="filter-content">
            <view class="tags" :class="{ 'tags-click': nowTags === index }" v-for="(item, index) in tagList" :key="index"
              @click="tagsClick(item, index)">{{ item }}</view>
          </view>
        </view>
      </view>
      <view class="pop-footer-btn">
        <view class="btns btnReset" @click="closePop">取消</view>
        <view class="btns btnOk" @click="popOk">确定</view>
      </view>
    </u-popup>
    <u-popup :show="itemShow" mode="bottom" :round="20" @close="closePop" @open="openPops">
      <view class="item-edit">
        <view class="tem-edit-title">
          {{ contractDetails.contractName }}
          <u-icon name="close" color="#fff" @click="closePop" class="tem-edit-ico"></u-icon>
        </view>
        <view>
          <u--form labelPosition="left" :model="contractDetails" class="item-edit-form">
            <u-form-item label="标段项目:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80"
              v-if="contractType == 2">
              {{ contractDetails.projectBidName }}
            </u-form-item>
            <u-form-item v-if="contractType == 1 || contractType == 2" label="建设单位:" prop="userInfo.name" borderBottom
              labelWidth="80" ref="item1">
              {{ contractDetails.investorName }}
            </u-form-item>
            <u-form-item v-if="contractType == 4" label="分包单位:" prop="userInfo.name" borderBottom labelWidth="80"
              ref="item1">
              {{ contractDetails.customName }}
            </u-form-item>
            <u-form-item label="监理公司:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80"
              v-if="contractType == 2">
              {{ contractDetails.supervisorName }}
            </u-form-item>
            <u-form-item label="施工单位:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80"
              v-if="contractType == 1 || contractType == 2">
              {{ contractDetails.contractorName }}
            </u-form-item>
            <u-form-item label="项  目  部:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80"
              v-if="user.orgType !== 5">
              {{ contractDetails.orgName }}
            </u-form-item>
            <u-form-item label="供   货   商:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80"
              v-if="contractType == 3">
              {{ contractDetails.customName }}
            </u-form-item>
            <u-form-item label="合同金额:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
              {{ menuCodeData.states == 1 ? contractDetails.amount : '***' }}
            </u-form-item>
            <u-form-item label="结算税点:" prop="userInfo.sex" borderBottom ref="item1" v-if="contractType == '1'"
              labelWidth="80">
              {{ contractDetails.taxRate + '%' }}
            </u-form-item>
            <u-form-item label="签订日期:" borderBottom ref="item1" labelWidth="80">
              {{ contractDetails.signDate }}
            </u-form-item>
            <u-form-item label="施工开始日期:" borderBottom ref="item1" labelWidth="100" v-if="contractType!=3">
              {{ contractDetails.beginDate }}
            </u-form-item>
            <u-form-item label="施工结束日期:" borderBottom ref="item1" labelWidth="100" v-if="contractType!=3">
              {{ contractDetails.endDate }}
            </u-form-item>
          </u--form>
        </view>
        <view style="background: #f6f6fc; height: 5px; margin-top: 20px">
        </view>
        <view class="accessory" v-for="(item, idx) in contractDetails.attachments" :key="idx"
          @click="accessoryClick(item)">
          <u-icon name="file-text-fill" size="24" class="accessory-ico"></u-icon>
          <text class="accessory-text">{{ item.attachName }}</text>
          <text class="suffix" v-if="item.attachName.length > 30">{{ item.suffix }}</text>
          <u-icon name="arrow-right" size="24" color="#dddddd" class="accessory-right-ico"></u-icon>
          <view style="font-size: 10px"></view>
        </view>
        <view class="popup-footer" style="justify-content: space-between; width: 100%">
          <view class="btns">
            <u-button class="btn-iem" text="查看清单项目表" type="success" @click="listItem"></u-button>
          </view>
          <view class="btns" v-if="(contractType == 4)">
            <u-button class="btn-iem" type="primary" text="查看供应材料" @click="supplyMaterial"></u-button>
          </view>
        </view>
      </view>
      <u-popup :show="accessoryShow" mode="bottom" @close="closeAccessory" @open="openAccessory" style="">
        <view>
          <view style="text-align: center; padding: 20px" @click="preview(fileData.attachUrl)">查看</view>
          <view style="text-align: center; padding: 20px" @click="downLoad(fileData.attachUrl)">下载当前附件</view>
          <view style="text-align: center; padding: 20px" @click="(accessoryShow = false)">取消</view>
        </view>
      </u-popup>
    </u-popup>
    <prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop> -->
  </view>
</template>

<script>
// import prviewPop from '../../components/prview-pop/prview-pop.vue';
import prviewPop from '../../components/prview-pop/prview-pop.vue'
import searchInput from '../../components/search-tag/search-input.vue';
export default {
  components: { prviewPop,searchInput },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
    jurisdiction() {
      console.log(this.contractType);
      if (this.contractType == 1) {
        return {
          query: "contract:construction:query",
          add: "contract:construction:add",
          edit: "contract:construction:edit",
          delete: "contract:construction:delete",
          download: "contract:construction:download",
          termination: "contract:construction:termination",
          out: "contract:construction:out",
          put:"contract:construction:put"
        };
      } else if (this.contractType == 2) {
        return {
          query: "projectManage:contract:query",
          add: "projectManage:contract:add",
          edit: "projectManage:contract:edit",
          delete: "projectManage:contract:delete",
          download: "projectManage:contract:download",
          termination: "projectManage:contract:termination",
          out: "projectManage:contract:out",
          put:"projectManage:contract:put"
        };
      } else if (this.contractType == 3) {
        return {
          query: "contract:supply:query",
          add: "contract:supply:add",
          edit: "contract:supply:edit",
          delete: "contract:supply:delete",
          download: "contract:supply:download",
          termination: "contract:supply:termination",
          out: "contract:supply:out",
          put:"contract:supply:put"
        };
      } else if (this.contractType == 4) {
        return {
          query: "contract:sub:query",
          add: "contract:sub:add",
          edit: "contract:sub:edit",
          delete: "contract:sub:delete",
          download: "contract:sub:download",
          termination: "contract:sub:termination",
          out: "contract:sub:out",
          put:"contract:sub:put"
        };
      }
    },
  },
  data() {
    return {
      keyWord: "", //关键字搜索
      enableStatus: "", //合同状态 （正常：0，终止：1）
      contractList: [], //合同列表
      contractDetails: {
        //合同详情
        amount: "", //合同金额
        attachments: [
          // attachName 附件名
          // attachUrl 附件URL
          // suffix 后缀名
        ], //合同附件集
        beginDate: "", //合同开始时间
        contractName: "", //合同名称
        customName: "", //客户名称
        enableStatus: "", //启动状态（正常：0，终止：1）
        endDate: "", //合同结束时间
        orgName: "", //组织名称
        signDate: "", //合同签订时间
      },
      popShow: false,
      nowTags: 0,
      sendTags: 0,
      tagList: ["全部", "正常", "终止"],

      itemShow: false,
      accessoryShow: false,
      fileData: {},
      menuCodeData: {
        menuCode: "",
        states: ""
      },
      previewShow: false,
      previewUrl: "",
      searchTag:[]
    };
  },
  props: {
    contractTitle: {
      type: String,
      default: "",
    },
    contractType: {
      type: String,
      default: "",
    },
  },
  mounted() {
    this.getMatterInfo();
    this.searchMenuDataAuthorize()
  },

  methods: {
    resh(){
      this.getMatterInfo()
    },
    addCon(){
      uni.navigateTo({url:`/pages/contract/addCon?contractType=${this.contractType}`})
    },
    closeTag(){
      this.sendTags = ''
      this.nowTags = ''
      this.searchTag=[]
      this.getMatterInfo()
    },
    preview(url) {
      this.$checkName(url)
      return
      this.previewUrl = url;
      this.previewShow = true;
    },
    closePre() {
      this.previewShow = false;
    },
    closeAccessory() {
      this.accessoryShow = false;
    },
    openAccessory() {
      this.accessoryShow = true;
    },
    search() {
      this.getMatterInfo();
    },
    openPop() {
      this.popShow = true;
    },
    openPops() {
      this.itemShow = true;
    },
    closePop() {
      this.popShow = false;
      this.itemShow = false;
      this.nowTags = this.sendTags;
    },
    tagsClick(item, index) {
      this.nowTags = index;
    },
    popOk() {
      if (this.sendTags === this.nowTags) {
        return;
      }
      this.sendTags = this.nowTags;
      if(!!this.sendTags){
        let obj = this.tagList[this.sendTags]
        this.searchTag=[{key:"sendTags",value:obj}]
      }else{
        this.searchTag = []
      }
      // this.keyWord = "";
      // keyWord
      this.getMatterInfo();
      this.closePop();
    },
    getMatterInfo() {
      let data = {
        contractType: this.contractType,
        keyWord: this.keyWord,
        fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId")
      };
      if (this.nowTags == 0) {
        data.enableStatus = "";
      } else if (this.nowTags == 1) {
        data.enableStatus = 0;
      } else if (this.nowTags == 2) {
        data.enableStatus = 1;
      }
      this.$api.contractSearch(data).then((res) => {
        if (res.code == 200) {
          this.contractList = res.data.length?res.data:[];
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    listLick(pkId) {
      uni.navigateTo({url:`/pages/contract/conDetil?contractType=${this.contractType}&pkId=${pkId}`})
    },
    listItem() {
      let item = this.contractDetails;
      // contractType
      item = { ...item, 'menuCodeData': this.menuCodeData }
      uni.navigateTo({
        url: `/pages/contract/listItems?type=${this.contractType}&row=` + JSON.stringify(item),
      });
    },
    supplyMaterial() {
      let item = this.contractDetails;
      item = { ...item, 'menuCodeData': this.menuCodeData }
      uni.navigateTo({
        url: "/pages/contract/supplyMaterials?row=" + JSON.stringify(item),
      });
    },
    accessoryClick(row) {
      this.fileData = row;
      this.accessoryShow = true
    },
    // 下载
    downLoad(url) {
      // return console.log(url)
      const downLoadTask = uni.downloadFile({
        url: url, //仅为示例，并非真实的资源
        success: (res) => {
          if (res.statusCode === 200) {
            console.log("下载成功", res);
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: function (res2) {
                // var savedFilePath = res.savedFilePath;
                console.log(res2);
                uni.showToast({
                  title: "已保存至" + res2.savedFilePath,
                });
                setTimeout(() => {
                  uni.openDocument({
                    filePath: res2.savedFilePath,
                    success: (result) => { },
                  });
                }, 1000);
              },
            });
          }
        },
      });
    },
    // 获取当前登录用户角色关联菜单权限数据集
    searchMenuDataAuthorize() {
      this.$api.searchMenuDataAuthorize().then(res => {
        if (res.code == 200) {
          res.data.forEach(element => {
            if (element.menuCode == 'contract') {
              this.menuCodeData = element
            }
          });
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.pad{
   height: 112rpx;
}
.pad2{
   height: 152rpx;
}
.search {

  display: flex;
  align-items: center;
  width: 100%;
  height: 80rpx;
  // padding: 0 32rpx;
  background-color: #fff;

  .left {
    display: flex;
    flex: 1;
  }

  .right {
     flex: 1;
    // margin-left: 20rpx;

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

.content {

  .content-list {
    display: flex;
    align-items: start;
    position: relative;
    margin-bottom: 4px;
    padding: 20rpx;
    background: #fff;

    .contract-name {
      // margin-left: 20px;
      margin-top: 10rpx;
      margin-bottom: 6rpx;
      font-weight: 700;
      font-size: 28rpx;
    }

    .contract-amount {
      // margin-left: 36px;
      line-height: 40rpx;
      font-size: 12px;
      color: red;
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

// .popup {
//   // position: relative;
//   width: 560rpx;
//   position: relative;
//   width: 660rpx;
//   padding: 30rpx 10rpx 30rpx 30rpx;
//   background-color: #fff;
//   /*#ifdef APP-PLUS*/
//   height: calc(100vh - 156rpx);
//   /*#endif*/
//   /*#ifdef H5*/
//   height: calc(100vh - 88rpx);

//   /*#endif*/
//   /*#ifdef APP-PLUS*/
//   // margin-top: 156rpx;
//   /*#endif*/
//   /*#ifdef H5*/
//   // margin-top: 88rpx;
//   /*#endif*/
//   .popup-title {
//     height: 80rpx;
//     line-height: 80rpx;
//     margin-bottom: 20rpx;
//     padding-left: 20rpx;
//   }

//   .popup-content {
//     display: flex;
//     flex-wrap: wrap;
//     padding-left: 20rpx;

//     .tags {
//       width: 200rpx;
//       height: 72rpx;
//       margin-right: 8rpx;
//       margin-bottom: 12rpx;
//       line-height: 72rpx;
//       text-align: center;
//       font-size: 26rpx;
//       color: #203457;
//       border: 1px solid #eeeeee;
//       background-color: #f9f9f9;
//       border-radius: 8rpx;
//     }
//     .tags-click {
//       // color: #2a82e4;
//       border: 1px solid #2a82e4;
//       background-color: #e0efff;
//     }
//   }
// }
.popup-footer2{
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  width: 660rpx;
  height: 80rpx;

  // background-color: rgb(194, 155, 155);
  .btns {
    //padding: 12rpx;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100rpx;

    .btn-iem{
      width: 95%;
      ;
    }
  }
}
.popup-footer {
  position: fixed;
  bottom: 0;
  display: flex;
  width: 660rpx;
  height: 80rpx;

  // background-color: rgb(194, 155, 155);
  .btns {
    //padding: 12rpx;
    flex: 1;

    .btn-iem {
      width: 95%;
      ;
    }
  }
}

.accessory {
  margin: 8px 31px;
  position: relative;
  border-bottom: 1px solid #eeeeee;
  padding: 2px;

  .accessory-ico {
    position: absolute;
    left: -22px;
  }

  .accessory-text {
    display: inline-block;
    width: 93%;
    overflow: hidden;
    /*超出部分隐藏*/
    white-space: nowrap;
    /*禁⽌换⾏*/
    text-overflow: ellipsis;
    /*省略号*/
  }

  .accessory-right-ico {
    position: absolute;
    top: 2px;
    font-weight: 800;
    right: 0px;
  }
}

.item-edit {
  padding-bottom: 160rpx;

  .tem-edit-title {
    line-height: 80rpx;
    background: #2a82e4;
    color: #fff;
    text-indent: 2em;
  }

  .tem-edit-ico {
    position: absolute;
    right: 40rpx;
    top: 24rpx;
  }

  .item-edit-form {
    padding: 0 12rpx;
  }
}

/deep/ .preview {
  box-shadow: 0px 8px 2px 2px #d4d4d7;
}

// /deep/ .u-slide-right-enter-to,
// /deep/ .u-transition {
//   // margin-top: 80px !important;
//   /*#ifdef APP-PLUS*/
//   margin-top: 80px !important;
//   /*#endif*/
//   /*#ifdef H5*/
//   margin-top: 40px !important;
//   /*#endif*/
// }
</style>
