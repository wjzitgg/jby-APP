<template>
  <view class="wrapper">
    <u-navbar
      :leftText="titles"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>

    <view class="content">
      <u--form
        labelPosition="left"
        :borderBottom="true"
        :labelWidth="'120'"
        labelAlign="right"
      >
        <u-form-item label="班组名称:" borderBottom @click="openPicker(1)">
          <u-input
            v-model="form.teamName"
            :placeholder="priview ? '' : '点击选择'"
            border="bottom"
            disabled
          />
        </u-form-item>
        <u-form-item label="本期结算周期:" borderBottom>
          <view class="search-datas">
            <view
              class="data-input"
              :class="{ disabled: priview }"
              @click="openCal(2)"
            >
              {{ form.beginTime }}
            </view>
            <view class="to">至</view>
            <view
              class="data-input"
              :class="{ disabled: priview }"
              @click="openCal(3)"
            >
              {{ form.endTime }}
            </view>
          </view>
        </u-form-item>
        <u-form-item label="本期结算金额:" borderBottom>
          <u-input
            v-model="form.settlementAmount"
            border="bottom"
            :disabled="priview"
            @input="settingChange"
            type="number"
          >
            <template slot="suffix">元</template>
          </u-input>
        </u-form-item>
        <u-form-item label="上期末结算金额:" borderBottom>
          <u-input
            v-model="form.frontSettlementAmount"
            border="bottom"
            disabled
          >
            <template slot="suffix">元</template>
          </u-input>
        </u-form-item>
        <u-form-item label="本期末结算金额:" borderBottom>
          <u-input
            v-model="form.afterSettlementAmount"
            border="bottom"
            disabled
          >
            <template slot="suffix">元</template>
          </u-input>
        </u-form-item>
        <u-form-item label="结算日期:" borderBottom @click="openCal(1)">
          <u-input
            v-model="form.settlementTime"
            :placeholder="priview ? '' : '点击选择'"
            border="bottom"
            disabled
          />
        </u-form-item>
        <u-form-item label="状态:" borderBottom v-if="priview">
          <u-input :value="stateList[form.state]" border="bottom" disabled> </u-input>
        </u-form-item>
        <u-form-item label="确认时间:" borderBottom v-if="form.state === 1">
          <u-input v-model="form.createTime" border="bottom" disabled> </u-input>
        </u-form-item>
      </u--form>
      <view class="approve-files">
        <view class="approve-files-head">
          <h5>附件</h5>
          <lsj-upload
            ref="lsjUpload1"
            childId="upload2"
            :width="width"
            :height="height"
            :option="option"
            :size="size"
            :formats="formats"
            :accept="'image/png,image/jpg,image/jpeg'"
            :debug="debug"
            :count="10"
            :nowCount="fileList.length"
            :instantly="instantly"
            @change="onChange"
            @progress="onprogress"
            @uploadEnd="onuploadEnd"
            v-if="!priview&&!pickerShow&&!modelShow&&!calenShow"
          >
            <view class="upload-btn" :style="{ width: width, height: height }"
              >上传附件</view
            >
          </lsj-upload>
          <!-- <view class="upload-btn" @click="upLoad"> 上传附件 </view> -->
        </view>
        <view class="fileList" v-if="!!fileList.length">
          <view
            class="fileList-item"
            v-for="(item, index) in fileList"
            :key="item.id"
          >
            <view class="left" @click="preview(item, index)">
              <u-icon class="icons" name="file-text" size="28"></u-icon>
              <view class="fileName text-hidden">{{ item.name }}</view>
            </view>
            <view class="file-closeBtn" @click="delFile(item, index)" v-if="!priview" >X</view>
          </view>
        </view>
        <view class="file-empty" v-else>暂无附件</view>
      </view>

      <view class="details" v-if="form.state===1">
        <h5 class="details-head">班组长结算明细</h5>
        <view class="table_detail table_empty">
          <table>
            <thead>
              <tr>
                <th>状态</th>
                <th class="topfixed">劳务人员</th>
                <th>上期末结算金额</th>
                <th>本期结算金额</th>
                <th>本期末结算金额</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form.settlementMembersListVos" :key="index">
                <td>{{item.confirmStatus===0?'未确认':'已确认'}}</td>
                <td class="fixeds"><text class="clickTd"  @click="goInfo(item)">{{ item.userName }}</text></td>
                <td>{{ item.frontSettlementAmount }}</td>
                <td>{{ item.settlementAmount }}</td>
                <td>{{ item.afterSettlementAmount }}</td>
              </tr>
            </tbody>
          </table>
          <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
        </view>
      </view>
    </view>
    <view class="pdb"></view>
    <view class="footer" v-if="type !== 3">
      <view class="btns edit" v-if="!priview" @click="btnOk(2)">保存草稿</view>
      <view class="btns edit" v-if="!priview" @click="btnOk(0)">结算确认</view>
      <view class="btns edit" v-if="form.state === 2 && priview" @click="edit" >编辑</view >
      <view class="btns del" v-if="form.state === 2 && priview" @click="openModel(1)" >删除</view>
      <view class="btns del wh-600" v-if="form.state===0" @click="openModel(2)" >撤回</view >
    </view>

    <u-picker
      title="选择班组"
      :show="pickerShow"
      :columns="[pickList]"
      keyName="label"
      @confirm="pickerConfirm"
      @cancel="pickerCancel"
    ></u-picker>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" />

    <u-modal
      :show="modelShow"
      :title="modelTitle"
      :content="modelCont"
      showCancelButton
      @confirm="confirmDel"
      @cancel="cancelDel"
    ></u-modal>
  </view>
</template>

<script>
import request from "../../common/request";
export default {
  computed:{
    calenShow(){
      return this.$refs.calendar?this.$refs.calendar.show:false
    }
  },
  data() {
    return {
      titles:"结算详情",
      type: 1, //1为新增，2为编辑，3为查看
      priview: false,
      stateList:['未确认','已确认','草稿'],
      form: {
        beginTime: "",
        confirmStatus: "",
        endTime: "",
        fkTeamId: "",
        remark: "",
        settlementAmount: "",
        settlementTime: "",
        settlementType: "",
        voucherUrl: "",
        frontSettlementAmount: "",
        afterSettlementAmount: "",
      },
      pickList: [],
      fileList: [],
      modelShow: false,
      modelType: 1,
      modelTitle: "删除提示",
      modelCont: "确定删除该结算？",
      pickerShow: false,
      getData: {},
      // 上传接口参数
      option: {
        // 上传服务器地址，此地址需要替换为你的接口地址
        url: request.baseUrl + "/app/file/upload/picture",
        // 上传附件的key
        name: "file",
				// 根据你接口需求自定义请求头,默认不要写content-type,让浏览器自适配
				header: {
					// 示例参数可删除
					'Authorization': uni.getStorageSync("token"),
				},
        // 根据你接口需求自定义body参数
        // formData: {
        // 	// 'orderId': 1000
        // }
      },
      // 选择文件后是否立即自动上传，true=选择后立即上传
      instantly: true,
      // 必传宽高且宽高应与slot宽高保持一致
      width: "150rpx",
      height: "40rpx",
      // 限制允许上传的格式，空串=不限制，默认为空
      formats: "",
      // 文件上传大小限制
      size: 30,
      // 文件回显列表
      files: new Map(),
      // 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
      wxFiles: [],
      // 是否打印日志
      debug: false,
    };
  },
  onLoad(options) {
    this.type = options.type - 0;
    if (options.type == "1") {
      this.labourTeamSearch();
      this.priview = false;
      this.titles = "新增结算"
    } else if (options.type == "2"||options.type == "3") {
      this.priview = true;
      let data = JSON.parse(options.data);
      this.findSettlementById(data.pkId);
    }
  },
  methods: {
    labourTeamSearch() {
      this.$api.teamSearchNoHead({projectOrgId:uni.getStorageSync("nowOrgId")}).then((res) => {
        if (res.code === 200) {
          this.pickList = res.data.map((item) => ({
            ...item,
            label: item.teamName,
            value: item.pkId,
          }));
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    findSettlementById(pkId) {
      uni.showLoading({ mask: true });
      this.$api
        .findSettlementById({ pkId })
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.form = res.data;
            this.fileList=JSON.parse(res.data.voucherUrl)
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
    terminalAmountByTeamId(teamId) {
      this.$api.terminalAmountByTeamId({ teamId, settlementType: 1 }) .then((res) => {
          if (res.code === 200) {
            this.form.frontSettlementAmount = res.data.frontSettlementAmount;
            this.form.afterSettlementAmount = this.form.frontSettlementAmount - 0 + (this.form.settlementAmount - 0);
          }
        });
    },
    reshPage() {
      var pages = getCurrentPages(); //当前页面栈
      if (pages.length > 1) {
        var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
        beforePage.$vm.refreshIfNeeded = true;
      }
    },
    btnOk(confirmStatus) {
      let data = { ...this.form, objectType: 1, confirmStatus,settlementType:1 };
      data.voucherUrl=JSON.stringify(this.fileList)
      if(!data.fkTeamId){
        return uni.showToast({title:'请选择班组',icon:"none"})
      }
      if(!data.settlementAmount){
        return uni.showToast({title:'请填写本期结算金额',icon:"none"})
      }
      if(!data.settlementTime){
        return uni.showToast({title:'请选择本期结算时间',icon:"none"})
      }
      if(!data.beginTime){
        return uni.showToast({title:'请选择本期结算开始时间',icon:"none"})
      }
      if(!data.endTime){
        return uni.showToast({title:'请选择本期结算结束时间',icon:"none"})
      }
      uni.showLoading({mask:true})
      if (this.type === 1) {
        this.$api.addSettlement(data).then((res) => {
          uni.hideLoading()
          if (res.code === 200) {
            // this.findSettlementById(res.data)
            this.reshPage();
            this.type = 2;
            this.priview = true;
            uni.showToast({ title: "新增成功", icon: "success" });
            setTimeout(()=>{
                uni.navigateBack()
              },200)
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        }).catch(err=>{
          uni.hideLoading()
        });
      } else {
        this.$api.updateSettlement(data).then((res) => {
          uni.hideLoading()
          if (res.code === 200) {
            // this.findSettlementById(data.pkId)
            this.reshPage();
            this.priview = true;
            uni.showToast({ title: "编辑成功", icon: "success" });
            setTimeout(()=>{
                uni.navigateBack()
              },200)
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          }
        }).catch(err=>{
          uni.hideLoading()
        });
      }
    },
    edit() {
      this.labourTeamSearch();
      this.priview = false;
    },
    goInfo(item) {
      uni.navigateTo({
        url: "/pages/labour/infoDetail?data=" + JSON.stringify(item),
      });
    },
    settingChange(value) {
      this.form.afterSettlementAmount = this.form.frontSettlementAmount - 0 + (this.form.settlementAmount - 0);
    },
    openModel(type) {
      this.modelType = type;
      if (type === 1) {
        this.modelTitle = "删除提示";
        this.modelCont = "确定删除该结算？";
      } else if (type === 2) {
        this.modelTitle = "撤回提示";
        this.modelCont = "确定撤回该结算？";
      }
      this.modelShow = true;
    },
    confirmDel() {
      uni.showLoading({mask:true})
      if (this.modelType === 1) {
        this.$api.deleteSettlement({pkId:this.form.pkId}).then(res=>{
          uni.hideLoading()
          if(res.code===200){
            this.modelShow = false;
            this.reshPage();
            uni.navigateBack();
            uni.showToast({ title: "删除成功", icon: "success" });
          }else{
            uni.showToast({
            title: res.msg,
            icon: "none",
          });
          }
        }).catch(err=>{
          uni.hideLoading()
        })
      } else if (this.modelType === 2) {
        this.$api.withdrawSettlement({pkId:this.form.pkId}).then(res=>{
          uni.hideLoading()
          if(res.code===200){
            this.modelShow = false;
            this.reshPage();
            uni.navigateBack();
            uni.showToast({ title: "撤回成功", icon: "success" });
          }else{
            uni.showToast({
            title: res.msg,
            icon: "none",
          });
          }
        }).catch(err=>{
          uni.hideLoading()
        })
      }
    },
    cancelDel() {
      this.modelShow = false;
    },
    delFile(row, index) {
      this.fileList.splice(index, 1);
      this.$refs.lsjUpload1.clear(row.name);
    },
    openCal(type) {
      if (this.priview) {
        return;
      }
      this.caleType = type;
      this.$refs.calendar.open();
    },
    caleConfirm(e) {
      console.log(e);
      if (this.caleType === 1) {
        this.form.settlementTime = e.fulldate;
      } else if (this.caleType === 2) {
        if ( this.form.endTime && new Date(this.form.endTime) < new Date(e.fulldate) ) {
          return uni.showToast({
            title: "开始时间必须比结束时间前",
            icon: "none",
          });
        }
        this.form.beginTime = e.fulldate;
      } else if (this.caleType === 3) {
        if ( this.form.beginTime && new Date(e.fulldate) < new Date(this.form.beginTime) ) {
          return uni.showToast({
            title: "结束时间必须比开始时间后",
            icon: "none",
          });
        }
        this.form.endTime = e.fulldate;
      }
    },
    openPicker() {
      if(this.priview){
        return
      }
      this.pickerShow = true;
    },
    pickerConfirm(e) {
      if (e.value.length) {
        this.terminalAmountByTeamId(e.value[0].value);
        this.form.fkTeamId = e.value[0].value;
        this.form.teamName = e.value[0].label;
      }
      this.pickerCancel();
    },
    pickerCancel() {
      this.pickerShow = false;
    },
    onChange(e) {
      console.log("改变事件", e);
      // uni.showLoading({ mask: true });
    },
    onprogress(e) {
      console.log("中途事件", e);
    },
    onuploadEnd(e) {
      console.log("结束事件", e);
      if (e.responseText) {
        let res = JSON.parse(e.responseText);
        if (res.code === 200) {
          this.fileList.push({
            name: e.name,
            path: res.data,
          });
          uni.hideLoading();
        }
      }
    },
    preview(item, index) {
      uni.previewImage({
        current: index,
        urls: this.fileList.map((item) => item.path),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 0 20rpx;
  background-color: #fff;
}
.text-hidden {
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁⽌换⾏*/
  text-overflow: ellipsis; /*省略号*/
}
.search-datas {
  display: flex;
  align-items: center;
  height: 80rpx;
  .to {
    margin: 0 10rpx;
  }
  .data-input {
    display: flex;
    align-items: center;
    position: relative;
    width: 210rpx;
    height: 60rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    border-bottom: 1px solid #dcdfe6;
    background-color: #fff;
    border-radius: 6rpx;
  }
  .disabled {
    background-color: #f5f7fa;
  }
}
.approve-files {
  .approve-files-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60rpx;
  }
  .upload-btn {
    width: 150rpx;
    height: 40rpx;
    text-align: center;
    line-height: 40rpx;
    font-size: 24rpx;
    color: #5084fe;
    background-color: #dfedff;
    border-radius: 6rpx;
  }
}
.fileList-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60rpx;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  .left {
    display: flex;
    align-items: center;
  }
  .fileName {
    width: 500rpx;
    line-height: 60rpx;
  }
  .file-closeBtn {
    width: 60rpx;
    color: red;
  }
}
.details {
  margin-bottom: 20rpx;
  .details-head {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60rpx;
  }
  .table_detail {
    max-height: 300rpx;
    td:first-child,
    th:first-child {
      width: 50px;
    }
    .fixeds {
      width: 100px;
      position: sticky;
      left: 50px;
      z-index: 1;
    }
    .topfixed {
      position: sticky;
      top: 0;
      left: 50px;
      z-index: 2;
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100rpx;
  background-color: #fff;
  z-index: 10;
  .btns {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 320rpx;
    height: 80rpx;
    border-radius: 10rpx;
    color: #fff;
    font-size: 28rpx;
  }
  .edit {
    background-color: #169bd5;
  }
  .del {
    background-color: #da0721;
  }
  .wh-600 {
    width: 600rpx;
  }
}
.pdb{
  height: 100rpx;
}
</style>
