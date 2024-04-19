<template>
  <view class="content wrapper">
    <u-navbar
      leftText="待办事项"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="bg"></view>
    <!-- <u-sticky bgColor="#fff">
      <u-tabs
        :list="tabList"
        :current="current"
        @change="currentChange"
        :scrollable="false"
      ></u-tabs>
    </u-sticky> -->
    <view class="sticky">

      <u-tabs
        :list="tabList"
        :current="current"
        @change="currentChange"
        :scrollable="false"
        :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
      ></u-tabs>


      <view class="search">
        <view style="width: 530rpx;">
          <filteInput placeholder="请输入待办事情名称" @blur="cleans = false" @focus="cleans = true" v-model="title" maxlength="50" @search="search"></filteInput>
        </view>
        <!-- <view class="left">
          <view class="search-input"
            ><u-input border="none" placeholder="请输入待办事情名称" @blur="cleans = false" @focus="cleans = true" v-model="title" maxlength="50"> </u-input
          ></view>
          <view class="searchBtn" @click="search" v-if="!cleans">搜索</view>
          <view class="searchBtn cleans" @click="clean" v-if="cleans">清空</view>
        </view> -->
        <view class="right">
          <filterBtn @click="openPop" :nums="searchTag.length"></filterBtn>
          <!-- <view class="screen" @click="openPop"><image src="/static/image/searchImg.png" mode="widthFix" style="width:28rpx;margin-right:12rpx"/>筛选</view> -->
        </view>
      </view>
      <searchTag :tagList="searchTag" @closeTag="closeTag"></searchTag>
    </view>
    <view :class="{pad:!searchTag.length,pad2:searchTag.length}"></view>

    <view v-if="showList.length">
      
    <view @click="itemClick(item)" v-for="item in showList" :key="item.pkId">
      <view v-if="item.processingResult === 0" class="item">
        <view class="title mb-20">
          <view>{{ item.title }}</view>
          <view class="red rate">待处理</view>
        </view>
        <view class="date">待办时间：{{ item.createTime }}</view>
      </view>
      <view v-if="item.processingResult === 2" class="item">
        <view class="title mb-20">
          <view>{{ item.title }}</view>
          <view class="green rate">已通过</view>
        </view>
        <view class="date mb-20">待办时间：{{ item.createTime }}</view>
        <view class="date mb-20">处理时间：{{ item.processingTime }}</view>
        <!-- <view class="opinion mb-20">处理意见：</view>
        <view class="content bg1">{{ item.processingOpinion }}</view> -->
      </view>
      <view v-if="item.processingResult === 1" class="item">
        <view class="title mb-20">
          <view>{{ item.title }}</view>
          <view class="grey rate">未通过</view>
        </view>
        <view class="date mb-20">待办时间：{{ item.createTime }}</view>
        <view class="date mb-20">处理时间：{{ item.processingTime }}</view>
        <!-- <view class="opinion mb-20">处理意见：</view>
        <view class="content bg2">{{ item.processingOpinion }}</view> -->
      </view>
    </view>


    </view>
    <view class="noData" v-if="!showList.length">
      <u-empty style="height: 100%" mode="data" text="暂无待办事项" icon="/static/image/noData.png"  > </u-empty>
    </view>
    <u-popup :show="popShow" mode="right" @close="closePop" @open="openPop" safeAreaInsetTop class="pop-bgImg" bgColor="rgba(255, 255, 255, 0)">
      <view class="popup">
        <view class="tip">请选择筛选条件</view>
        <view class="popup-content">
          <view class="filter-title">待办事项</view>
          <view class="filter-content">
            <view
                class="tags"
                :class="{ 'tags-click': nowTags === item.tag }"
                v-for="(item, index) in showTagList"
                :key="index"
                @click="tagsClick(item, index)"
                >{{ item.name }}</view
              >
            </view>
          </view>
        <!-- <view class="popup-footer">
          <view class="btns">
            <u-button text="取消" @click="closePop"></u-button>
          </view>
          <view class="btns">
            <u-button type="primary" text="确定" @click="popOk"></u-button>
          </view>
        </view> -->
      </view>
      <view class="pop-footer-btn">
        <view class="btns btnReset" @click="closePop">取消</view>
        <view class="btns btnOk" @click="popOk">确定</view>
      </view>
    </u-popup>
    <!-- 技术交底弹框 -->
    <u-modal
      :show="technicalDisclosureModel"
      title="技术交底确认"
      :content="technicalDisclosureContent"
      @confirm="confirm"
      @cancel="cancel"
      showCancelButton
    ></u-modal>
  </view>
</template>

<script>
import searchTag from '../../components/search-tag/search-tag.vue';
import filterBtn from '../../components/search-tag/filter-btn.vue';
import filteInput from '../../components/search-tag/filter-input.vue';
export default {
  components:{searchTag,filterBtn,filteInput},
  computed: {
    userInfo() {
			return this.$store.state.userInfo;
		},
    showTagList(){
      return this.tagList2.filter(item=>item.orgType.includes(this.userInfo.orgType))
    }
  },
  onLoad(options) {
    console.log(options);
    this.sendTags = options.tags
    this.nowTags = options.tags
    this.resetTag = options.tags
    let obj = this.tagList2.filter(item=>item.tag == this.sendTags)[0]
    this.searchTag=[{key:"sendTags",value:obj.name}]
  },
  onShow() {
    this.getMatterInfo();
  },
  data() {
    return {
      tabList: [
        { name: "全部" },
        { name: "未处理" },
        { name: "已处理" },
        // { name: "未通过" },
      ],
      current: 1,
      showList: [],
      popShow: false,
      tagList: [
        "全部",
        "设计变更",
        "技术交底",
        "用章管理",
        "计量结算",
        "施工验收",
        "库存盘点",
      ],
      // 1：施工验收流程待办，2：业主计量流程待办，3：分包计价流程待办，4：变更设计流程待办 5:会议签到 6：技术交底 7:盘点流程待办 8:申请用章流程待办,9:收发文待办,10:商务用户续费,11:付费用户续费,12:短信签名申请,13:短信赠送及充值申请,14:合同签署，15：工资结算：16：工资发放 
      tagList2:[
          { name: "全部" ,orgType:[0,1,2,3,4,5,6,7,8,9],tag:''},
					{
						name: '续费审批',
						orgType: [0],
            tag:'10,11'
					},
					{
						name: '短信签名',
						orgType: [0],
            tag:'12'
					},
					{
						name: '短信变动',
						orgType: [0],
            tag:"13"
					},
					{
						name: '合同签署',
						orgType: [8],
            tag:"14"
					},
					{
						name: '会议签到',
						orgType: [8],
            tag:'5'
					},
					{
						name: '工资结算',
						orgType: [8],
            tag:"15"
					},
					{
						name: '工资发放',
						orgType: [8],
            tag:"16"
					},
					{
						name: '施工验收',
						orgType: [ 5, 2,3],
						tag:'1',
					},
					{
						name: '变更设计',
						orgType: [5, 3, 9, 2],
						tag:'4',
					},
					{
						name: '计量结算',
						orgType: [7, 5, 3, 2],
						tag:'2,3',
					},
					{
						name: '合同待办',
						orgType: [7],
					},
					{
						name: '技术交底',
						orgType: [7, 5 ],
						tag:'6',
					},
					{
						name: '库存盘点',
						orgType: [6, 7, 5],
						tag:'7',
					},
					{
						name: '用章管理',
						orgType: [7,6, 4, 3, 9, 2,5],
						tag:'8',
					},
					{
						name: '收文待办',
						orgType: [2,3,4,5,6,7,9],
            tag:'9,17'
					}
				],
      nowTags: '',
      sendTags: '',
      technicalDisclosureContent:
        "xxx单位发送过来的xxx技术交底文件，您是否接收并查看",
      technicalDisclosureModel: false,
      title: "",
      nowClickRow: {},
      searchTag:[],
      resetTag:"",
      cleans:false
    };
  },
  methods: {
    closeTag(item){
      this.sendTags = ''
      this.nowTags = ''
      this.searchTag=[]
      this.getMatterInfo()
    },
    resh(){
      this.getMatterInfo()
    },
    getMatterInfo() {
      let data = {
        matterTypes: this.sendTags,
        title: this.title,
        handleStatus: this.current===0?'':this.current-1,
      };
      this.$api.getMatterInfo(data).then((res) => {
        if (res.code === 200) {
          this.showList = res.data;
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    currentChange(item) {
      if (this.current === item.index) {
        return;
      }
      this.current = item.index;
      this.getMatterInfo();
    },
    openPop() {
      this.popShow = true;
    },
    tagsClick(item, index) {
      console.log(this.nowTags,item.tag,this.nowTags===item.tag);
      this.nowTags = item.tag;
    },
    popOk() {
      if (this.sendTags === this.nowTags) {
        return;
      }
      this.sendTags = this.nowTags;
      if(!!this.sendTags){
        let obj = this.tagList2.filter(item=>item.tag == this.sendTags)[0]
        this.searchTag=[{key:"sendTags",value:obj.name}]
      }else{
        this.searchTag = []
      }
      this.title = "";
      this.getMatterInfo();
      this.closePop();
    },
    closePop() {
      this.popShow = false;
      this.nowTags = this.sendTags;
    },
    itemClick(item) {
      console.log(item);
      this.nowClickRow = item;
      // （1：施工验收流程待办，2：业主计量流程待办，3：分包计价流程待办，4：变更设计流程待办 5:会议签到 6：技术交底 7:盘点流程待办 8:申请用章流程待办,9:收发文待办,10:商务用户续费,11:付费用户续费,12:短信签名申请,13:短信赠送及充值申请,14:合同签署，15：工资结算：16：工资发放
      if (item.matterType === 1) {
        if(item.processingResult===0){
          uni.navigateTo({
          url:
            "/pages/waiting/deliveryReceivingDetail?todo=1&row=" +
            JSON.stringify(item),
        });
        }else{
          this.getDoneTaskDetail(item,item.matterType)
        }
      } else if (item.matterType === 2) {
        if(item.processingResult===0){
          uni.navigateTo({
          url: `/pages/measure/settingDetail?todo=${item.processingResult==0?1:2}&type=1&sendType=2&pkId=` + item.fkBusinessId,
        });
        }else{
          this.getDoneTaskDetail(item,item.matterType)
        }
      } else if (item.matterType === 3) {
        if(item.processingResult===0){
          uni.navigateTo({
          url: `/pages/measure/settingDetail?todo=${item.processingResult==0?1:2}&type=2&sendType=2&pkId=` + item.fkBusinessId,
        });
        }else{
          this.getDoneTaskDetail(item,item.matterType)
        }
      } else if (item.matterType === 4) {
        if(item.processingResult===0){
          uni.navigateTo({
          url: `/pages/change/changeDesignDetail?todo=${item.processingResult==0?1:2}&type=2&pkId=` + item.fkBusinessId,
        });
        }else{
          this.getDoneTaskDetail(item,item.matterType)
        }
      } else if (item.matterType === 5) {
        let todo=item.processingResult===0?1:item.processingResult===1?2:0
        uni.navigateTo({url: `/pages/often/trainDetail?todo=${todo}&obj=` + JSON.stringify(item)})
      } else if (item.matterType === 6) {
        if (this.nowClickRow.handleStatus == 1) {
          let obj=JSON.parse(JSON.stringify(this.nowClickRow))
          obj.pkId=obj.fkBusinessId
          uni.navigateTo({
            url:
              "/pages/waiting/technicalDisclosureDetail?row=" +
              JSON.stringify(obj),
          });
          this.cancel();
        } else {
          this.technicalDisclosureContent=`${row.fkOrgName}单位发送过来的${disclosureName}技术交底文件，您是否接收并查看`
          this.technicalDisclosureModel = true;
        }
      } else if (item.matterType === 7) {
        if(item.processingResult===0){
          uni.navigateTo({
          url: `/pages/material/inventory/checkDetail?todo=${item.processingResult==0?1:2}&type=2&pkId=` + item.fkBusinessId,
        });
        }else{
          this.getDoneTaskDetail(item,item.matterType)
        }
      } else if (item.matterType === 8) {
        if(item.processingResult===0){
          // uni.navigateTo({
          //   url: "/pages/signSend/sealApporval?todo=1&pkId=" + item.fkBusinessId,
          // });
          if(item.businessType==1){
            let data={...item,fkBusinessId:item.belongSealBusinessId,approveStatus:5}
            uni.navigateTo({ url: "/pages/waiting/deliveryReceivingDetail?row=" + JSON.stringify(data), });
          }else if(item.businessType==2){
            uni.navigateTo({
              url: `/pages/measure/settingDetail?type=1&sendType=2&pkId=` + item.belongSealBusinessId,
            });
            }else if(item.businessType==3){
              uni.navigateTo({
              url: `/pages/measure/settingDetail?type=2&sendType=2&pkId=` + item.belongSealBusinessId,
            });
          }else if(item.businessType==4){
            uni.navigateTo({
              url: `/pages/change/changeDesignDetail?type=2&pkId=` + item.belongSealBusinessId,
            });
          }else if(item.businessType==7){
            uni.navigateTo({
              url: `/pages/material/inventory/checkDetail?type=2&pkId=` + item.belongSealBusinessId,
            });
          }
        }else{
          this.getDoneTaskDetail(item,item.businessType)
        }
      }else if (item.matterType === 9) {
        this.$api.oaArticleFindById({pkId:item.fkBusinessId}).then((res) => {
        if(res.code===200){
          if(item.processingResult===0){
            let rowData = res.data
            uni.showModal({
                title: '收文确认',
                content: `${res.data.orgName}发送过来的${item.title}，请确认是否接收并查看？`,
                showCancel: true,
                cancelText:"不接收",
                confirmText:"接收",
                success: ({ confirm, cancel }) => {
                  if (confirm) {
                    this.$api.acceptArticle({pkId:item.pkId}).then(res=>{
                      if(res.code===200){
                        uni.showToast({title:"接收成功"})
                        // uni.navigateTo({ url: "/pages/waiting/otherWaiting?type=1&row=" + JSON.stringify(rowData)});
                        uni.navigateTo({ url: "/pages/assess/previewInformation?type=1&obj=" + JSON.stringify(rowData)});
                      }else{
                        uni.showToast({title:res.msg,icon:"none"})
                      }
                    })
                  } else if (cancel) {
                    console.log('用户点击取消');
                  }
                }
              })
          
        }else{
          //  uni.navigateTo({ url: "/pages/waiting/otherWaiting?type=1&row=" + JSON.stringify(res.data)});
          uni.navigateTo({ url: "/pages/assess/previewInformation?type=1&obj=" + JSON.stringify(res.data)});
        }
        }else{
          uni.showToast({ title: res.msg, icon: 'none' })
        }
      })
        
      }else if (item.matterType === 10) {
        uni.navigateTo({url: "/pages/waiting/renewayApproval?type=0&row=" + JSON.stringify(item)})
      }else if (item.matterType === 11) {
        uni.navigateTo({url: "/pages/waiting/renewayApproval?type=1&row=" + JSON.stringify(item)})
      }else if (item.matterType === 12) {
        uni.navigateTo({url: "/pages/waiting/smsSignApproval?row=" + JSON.stringify(item)})
      }else if (item.matterType === 13) {
        uni.navigateTo({url: "/pages/waiting/smsChangeApproval?row=" + JSON.stringify(item)})
      }else if (item.matterType === 14) {
         uni.navigateTo({url: "/pages/waiting/contractDetail?row=" + JSON.stringify(item)})
      }else if (item.matterType === 15) {
        uni.navigateTo({url: "/pages/waiting/salarySettle?row=" + JSON.stringify(item)})
      }else if (item.matterType === 16) {
        uni.navigateTo({url: "/pages/waiting/salaryGrant?row=" + JSON.stringify(item)})
      }else if (item.matterType === 17) {
        this.$api.findArticleAppointById({pkId:item.fkBusinessId}).then((res) => {
        if(res.code===200){
           if(item.processingResult===0){
             uni.showModal({
                 title: '收文确认',
                 content: `${res.data.orgName}发送过来的${item.title}，请确认是否接收并查看？`,
                 showCancel: true,
                 cancelText:"不接收",
                 confirmText:"接收",
                 success: ({ confirm, cancel }) => {
                   if (confirm) {
                     this.$api.acceptArticleAppoint({pkId:item.pkId}).then(res2=>{
                       if(res2.code===200){
                         uni.showToast({title:"接收成功"})
                        //  uni.navigateTo({ url: "/pages/waiting/otherWaiting?type=2&row=" + JSON.stringify(res.data)});
                        uni.navigateTo({ url: "/pages/assess/previewInformation?type=1&obj=" + JSON.stringify(rowData)});
                       }else{
                         uni.showToast({title:res2.msg,icon:"none"})
                       }
                     })
                   } else if (cancel) {
                     console.log('用户点击取消');
                   }
                 }
               })
           
           }else{
            // uni.navigateTo({ url: "/pages/waiting/otherWaiting?type=2&row=" + JSON.stringify(res.data)});
            uni.navigateTo({ url: "/pages/assess/previewInformation?type=1&obj=" + JSON.stringify(res.data)});
           }
        }else{
          uni.showToast({ title: res.msg, icon: 'none' })
        }
      })
        
      }
    },
    // 获取已办信息
    getDoneTaskDetail(item,type){
      let data ={flowCaseId:item.fkFlowCaseId,fkNodeId:item.fkNodeId,fkFlowTaskId:item.fkFlowTaskId}
      if(type==1){
            uni.navigateTo({ url: "/pages/waiting/deliveryReceivingDetail?todo=2&row=" + JSON.stringify(data), });
          }else if(type==2){
            uni.navigateTo({
          url: `/pages/measure/settingDetail?todo=2&type=1&row=${JSON.stringify(data)}`,
        });
          }else if(type==3){
            uni.navigateTo({
            url: `/pages/measure/settingDetail?todo=2&type=2&row=${JSON.stringify(data)}`,
          });
        }else if(type==4){
          uni.navigateTo({
            url: `/pages/change/changeDesignDetail?todo=2&type=2&row=${JSON.stringify(data)}`,
          });
        }else if(type==7){
          uni.navigateTo({
          url: `/pages/material/inventory/checkDetail?todo=2&row=${JSON.stringify(data)}`,
        });
        }
      // this.$api.getDoneTaskDetail(data).then(res=>{
      //   if(res.code===200){
          
      //   }else{
      //     uni.showToast({title:res.msg,icon:"none"})
      //   }
      // })
    },
    confirm() {
      // console.log(this.nowClickRow)
      let data = {
        pkId: this.nowClickRow.pkId,
      };
      // return console.log(this.nowClickRow.handleStatus)

      this.$api.updateEnableStatusAndMatter(data).then((res) => {
        if (res.code == 200) {
          let obj=JSON.parse(JSON.stringify(this.nowClickRow))
          obj.pkId=obj.fkBusinessId
          uni.navigateTo({
            url:
              "/pages/waiting/technicalDisclosureDetail?row=" +
              JSON.stringify(obj),
          });
          this.cancel();
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },
    cancel() {
      this.technicalDisclosureModel = false;
    },
    search() {
      this.getMatterInfo();
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-color: #f7f7ff;
}
.search {
  //   position: fixed;
  //   /* #ifdef H5 */
  //   top: 176rpx;
  //   /* #endif */
  //   /* #ifdef APP-PLUS */
  //   top: 240rpx;
  //   /* #endif */
  //   //   top: 176rpx;
  display: flex;
  align-items: center;
  width: 100%;
  height: 80rpx;
  padding: 0 32rpx;
  background-color: #fff;
  .left {
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
      padding-left: 6rpx;
    }
    .searchBtn {
      width: 120rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 26rpx;
      text-align: center;
      color: #2a82e4;
    }
    .cleans{
      color: #aaaaaa;
    }
    .separator {
      line-height: 54rpx;
      color: rgba(180, 208, 240, 1);
    }
  }
  .right {
    
    margin-left: 20rpx;
    .screen {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 140rpx;
      height: 60rpx;
      font-size: 26rpx;
      color: #2a82e4;
      border: 1px solid rgba(180, 208, 240, 1);
      border-radius: 10rpx;
    }
  }
}
.pad {
  height: 166rpx;
}
.pad2{
  height: 228rpx;
}
// .popup {
//   // position: relative;
//   width: 560rpx;
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
//   .popup-footer {
//     position: fixed;
//     bottom: 0;
//     display: flex;
//     width: 560rpx;
//     height: 80rpx;
//     // background-color: rgb(194, 155, 155);
//     .btns {
//       flex: 1;
//     }
//   }
// }
.item {
  // width: 100%;
  padding: 30rpx;
  //   margin-bottom: 10rpx;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  .title {
    // width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .date {
    font-size: 24rpx;
    color: #a6aebc;
  }
  .opinion {
    font-size: 24rpx;
    color: #a6aebc;
  }
  .content {
    height: 50rpx;
    line-height: 50rpx;
    font-size: 24rpx;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*禁⽌换⾏*/
    text-overflow: ellipsis; /*省略号*/
  }
  .bg1 {
    background-color: #fff6eb;
  }
  .bg2 {
    background-color: #ffebeb;
  }
  .mb-20 {
    margin-bottom: 20rpx;
  }
}
.rate {
  font-size: 28rpx;
}
.red {
  color: red;
}
.green {
  color: rgba(67, 207, 124, 1);
}
.grey {
  color: rgba(170, 170, 170, 1);
}
</style>
