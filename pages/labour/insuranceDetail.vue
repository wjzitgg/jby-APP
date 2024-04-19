<template>
  <view class="wrapper">
    <u-navbar
      leftText="保险详情"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <!-- <u--form
        labelPosition="left"
        :borderBottom="true"
        :labelWidth="'80'"
        labelAlign="right"
      >
        <u-form-item  label="工人姓名：" borderBottom  @click="openPop">
          <u-input
            v-model="form.userName"
            :placeholder="priview ? '' : '点击选择'"
            border="bottom"
            disabled
            maxlength="25"
          />
        </u-form-item>
        <u-form-item class="form_name" label="手机号码：" borderBottom>
          <view class="showInfo">{{ form.telephone }}</view>
        </u-form-item>
        <u-form-item class="form_name" label="身份证号：" borderBottom>
          <view class="showInfo">{{ form.cardNum }}</view>
        </u-form-item>
        <u-form-item class="form_name" label="所属标段：" borderBottom>
          <view class="showInfo">{{ form.projectBidName }}</view>
        </u-form-item>
        <u-form-item class="form_name"  label="服务单位：" borderBottom v-if="type==3">
          <view class="showInfo">{{ form.orgName }}</view>
        </u-form-item>

        <u-form-item class="form_name" label="所属班组：" borderBottom>
          <view class="showInfo">{{ form.teamName }}</view>
        </u-form-item>

        <u-form-item  label="保险类型：" borderBottom @click="openPicker">
          <u-input
            :value="
              form.insureType
                ? typeList.filter((item) => item.value === form.insureType)[0]
                    .label
                : ''
            "
            :placeholder="priview ? '' : '点击选择'"
            border="bottom"
            disabled
          />
        </u-form-item>


        <u-form-item  label="购买日期：" borderBottom @click="openCal(1)">
          <u-input
            v-model="form.purchaseTime"
            :placeholder="priview ? '' : '点击选择'"
            border="bottom"
            disabled
          />
        </u-form-item>

        <u-form-item  label="有效期限：" borderBottom>
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

      </u--form> -->

       
       <view>
          <view class="form-name">
             <view class="gr-name" >工人姓名</view>
             <view class="showInfo_1" @click="openPop">
             <input
             type="text"
             class="input-name"
            v-model="form.userName"
            :placeholder="priview ? '' : '点击选择'"
            disabled
            maxlength="25"
          />
        </view>
          </view>

          <view class="form-name">
             <view class="gr-name" >手机号码</view>
             
              <view class="showInfo_1">{{ form.telephone }}</view>
          </view>

          <view class="form-name">
             <view class="gr-name" >身份证号</view>
             <view class="showInfo_1">{{ form.cardNum }}</view>
          </view>

          <view class="form-name" >
             <view class="gr-name-1">所属标段</view>
             <view class="showInfo_1">{{ form.projectBidName }}</view>
          </view>


          <view class="form-name">
             <view class="gr-name" >服务单位</view>
             <view class="showInfo_1">{{ form.orgName }}</view>
          </view>

          <view class="form-name">
             <view class="gr-name" >所属班组</view>
             <view class="showInfo_1">{{ form.teamName }}</view>
          </view>

          <view class="form-name">
             <view class="gr-name" >保险类型</view>
             <view class="showInfo_1" @click="openPicker">
             <input
            :value="
              form.insureType
                ? typeList.filter((item) => item.value === form.insureType)[0]
                    .label
                : ''
            "
            :placeholder="priview ? '' : '点击选择'"
            border="bottom"
            disabled
          />
        </view>
          </view>

          <view class="form-name">
             <view class="gr-name" >购买日期</view>
             <view class="showInfo_1"  @click="openCal(1)">
              <input
            v-model="form.purchaseTime"
            :placeholder="priview ? '' : '点击选择'"
            border="bottom"
            disabled
          />
        </view>
          </view>

          <view class="form-name">
             <view class="gr-name" >有效期限</view>
             <view class="showInfo_1">
               <view class="search-datas">
            <view
              class="data-input"
              :class="{ disabled: priview }"
              @click="openCal(2)"
            >
              {{ form.beginTime }}
            </view>
            <view class="to">-</view>
            <view
              class="data-input"
              :class="{ disabled: priview }"
              @click="openCal(3)"
            >
              {{ form.endTime }}
            </view>
          </view>
        </view>
          </view>

       </view>


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
            v-if="!priview&&!calenShow&&!pickerShow&&!modelShow&&!popShow"
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
            <view
              class="file-closeBtn"
              @click="delFile(item, index)"
              v-if="!priview"
              >X</view
            >
          </view>
        </view>
        <view class="file-empty" v-else>暂无附件</view>
      </view>
    </view>
    <view class="pdb"></view>
    <view class="footer" v-if="priview && type !== 3">
      <view class="btns edit" @click="edit">编辑</view>
      <view class="btns del" @click="modelShow = true">删除</view>
    </view>
    <view class="btn" v-if="!priview && type !== 3" @click="save">保存</view>

    <u-picker
      title="保险类型"
      :show="pickerShow"
      :columns="[typeList]"
      keyName="label"
      @confirm="pickerConfirm"
      @cancel="pickerCancel"
    ></u-picker>
    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" />

    <u-popup :show="popShow" @close="closePop" mode="bottom">
      <view class="popups">
        <view class="pop-head">
          <view class="left">
            <u-input
              placeholder="劳务姓名/手机号码"
              border="none"
              v-model="inpName"
            >
              <template slot="suffix">
                <u-icon
                  name="search"
                  size="28"
                  color="#d7d7d7"
                  @click="searchBtn"
                ></u-icon>
              </template>
            </u-input>
          </view>
        </view>
        <view class="pop-content">
          <view class="table_detail table_empty">
            <table>
              <thead>
                <tr>
                  <th>选择</th>
                  <th>工人姓名</th>
                  <th>所属班组</th>
                  <th>手机号码</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in peoList" :key="index">
                  <td @click="selectOk(item)">
                    <view class="selBtn">选择</view>
                  </td>
                  <td>{{ item.memberName }}</td>
                  <td>{{ item.className }}</td>
                  <td>{{ item.mobilePhone }}</td>
                </tr>
              </tbody>
            </table>
          </view>
          <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
        </view>
      </view>
    </u-popup>

    <u-modal
      :show="modelShow"
      title="删除提示"
      content="确定删除该保险？"
      showCancelButton
      @confirm="confirmDel"
      @cancel="cancelDel"
    ></u-modal>
  </view>
</template>

<script>
import request from "../../common/request";
export default {
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    calenShow(){
      return this.$refs.calendar?this.$refs.calendar.show:false
    }
  },
  data() {
    return {
      type: 1, //1为新增，2为编辑，3为查看
      priview: true,
      previewShow: false,
      form: {
        beginTime: "",
        cardNum: "",
        enclosureUrl: "",
        endTime: "",
        fkMemberId: "",
        insureType: "",
        projectBidName: "",
        purchaseTime: "",
        teamName: "",
        telephone: "",
        userName: "",
        orgName: "",
      },
      caleType: 1,
      fileList: [],
      modelShow: false,
      pickerShow: false,
      typeList: [
        {
          value: 1,
          label: "社保",
        },
        {
          value: 2,
          label: "意外保险",
        },
        {
          value: 3,
          label: "其他保险",
        },
      ],
      popShow: false,
      inpName: "",
      searchName: "",
      peoList: [],
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
      formats: "png,jpg,jpeg",
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
      this.searchLabourTeamMembersByOrgId();
      this.form.orgName = this.userInfo.orgName;
      this.form.projectBidName = uni.getStorageSync("nowProName");
      this.priview = false;
    } else {
      let data = JSON.parse(options.data);
      this.findInsureById(data.pkId);
      this.priview = true;
    }
  },
  methods: {
    findInsureById(pkId) {
      uni.showLoading({ mask: true });
      this.$api
        .findInsureById({ pkId })
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            this.form = res.data;
            this.fileList = JSON.parse(res.data.enclosureUrl);
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    searchLabourTeamMembersByOrgId() {
      let data = {
        projectId: uni.getStorageSync("nowProId"),
        keyWord: this.searchName,
      };
      this.$api.searchLabourTeamMembersByOrgId(data).then((res) => {
        if (res.code == 200) {
          this.peoList = res.data;
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
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
    save() {
      let data = {
        fkMemberId: this.form.fkMemberId,
        beginTime: this.form.beginTime,
        endTime: this.form.endTime,
        enclosureUrl: JSON.stringify(this.fileList),
        purchaseTime: this.form.purchaseTime,
        insureType: this.form.insureType,
      };
      if(!data.fkMemberId){
        return uni.showToast({title:"请选择工人",icon:"none"})
      }
      if(!data.insureType){
        return uni.showToast({title:"请选择保险类型",icon:"none"})
      }
      if(!data.purchaseTime){
        return uni.showToast({title:"请选择购买日期",icon:"none"})
      }
      if(!data.beginTime){
        return uni.showToast({title:"请选择有效期限开始日期",icon:"none"})
      }
      if(!data.beginTime){
        return uni.showToast({title:"请选择有效期限结束日期",icon:"none"})
      }
      if(!this.fileList.length){
        return uni.showToast({title:"请上传附件",icon:"none"})
      }
      uni.showLoading({ mask: true });
      if (this.type === 1) {
        this.$api
          .addInsure(data)
          .then((res) => {
            uni.hideLoading();
            if (res.code == 200) {
              this.findInsureById(res.data);
              this.reshPage();
              uni.navigateBack()
              uni.showToast({ title: "新增成功", icon: "success" });
              // this.type = 2;
              // this.priview = true;
            } else {
              uni.showToast({ title: res.msg, icon: "none" });
            }
          })
          .catch((err) => {
            uni.hideLoading();
          });
      } else {
        data.pkId = this.form.pkId;
        this.$api
          .updateInsure(data)
          .then((res) => {
            uni.hideLoading();
            if (res.code == 200) {
              this.findInsureById(data.pkId);
              this.reshPage();
              uni.navigateBack()
              uni.showToast({ title: "编辑成功", icon: "success" });
              // this.priview = true;
            } else {
              uni.showToast({ title: res.msg, icon: "none" });
            }
          })
          .catch((err) => {
            uni.hideLoading();
          });
      }
    },
    edit() {
      this.searchLabourTeamMembersByOrgId();
      this.priview = false;
    },
    confirmDel() {
      uni.showLoading({ mask: true });
      this.$api
        .deleteInsure({ pkId: this.form.pkId })
        .then((res) => {
          uni.hideLoading();
          if (res.code == 200) {
            this.modelShow = false;
            this.reshPage();
            uni.navigateBack({ delta: 1 });
            uni.showToast({ title: "删除成功", icon: "success" });
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    cancelDel() {
      this.modelShow = false;
    },
    openPicker() {
      if (this.priview) {
        return;
      }
      this.pickerShow = true;
    },
    pickerConfirm(e) {
      if (e.value.length) {
        this.form.insureType = e.value[0].value;
      }
      this.pickerCancel();
    },
    pickerCancel() {
      this.pickerShow = false;
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
        this.form.purchaseTime = e.fulldate;
      } else if (this.caleType === 2) {
        if (
          this.form.endTime &&
          new Date(this.form.endTime) < new Date(e.fulldate)
        ) {
          return uni.showToast({
            title: "开始时间必须比结束时间前",
            icon: "none",
          });
        }
        this.form.beginTime = e.fulldate;
      } else if (this.caleType === 3) {
        if (
          this.form.beginTime &&
          new Date(e.fulldate) < new Date(this.form.beginTime)
        ) {
          return uni.showToast({
            title: "结束时间必须比开始时间后",
            icon: "none",
          });
        }
        this.form.endTime = e.fulldate;
      }
    },
    openPop() {
      if (this.priview) {
        return;
      }
      if(this.type !== 1){
        return
      }
      this.popShow = true;
    },
    searchBtn() {
      this.searchName = this.inpName;
      this.searchLabourTeamMembersByOrgId();
    },
    selectOk(item) {
      console.log("选中了", item);
      this.form.fkMemberId = item.pkId;
      this.form.userName = item.memberName;
      this.form.telephone = item.mobilePhone;
      this.form.cardNum = item.idCard;
      this.form.teamName = item.className;
      this.closePop();
    },
    closePop() {
      this.popShow = false;
      this.searchName = "";
      this.inpName = "";
      this.searchLabourTeamMembersByOrgId();
    },
    delFile(row, index) {
      this.fileList.splice(index, 1);
      this.$refs.lsjUpload1.clear(row.fileName);
    },
    onChange(e) {
      console.log("改变事件", e);
      uni.showLoading({ mask: true });
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

  .showInfo_biao{ 
    width: 290px;
     
      line-height: 20px;
      // background: #d90; 
      white-space: nowrap;
  overflow: hidden;
   padding: 0 0  0 20px;
  text-overflow: ellipsis;
      
  }
  .gr-name-1{
      width: 200rpx;
      height: 100rpx;
      padding: 0 24rpx;
    border-right: solid 1px #ddd ;
    
  }
.pdb {
  height: 100rpx;
}
.content {
  background-color: #fff;
 
  // padding: 0 20rpx;
  
  .showInfo {
  
    align-items: center;
     padding: 0 20px;
    
  }
}
// .showInfo-1{
//   // margin-left:-150px ;
//   white-space: nowrap;
//   overflow: hidden;
//   padding: 0 0 0 10px;
//   line-height: 20px;
//   text-overflow: ellipsis;
  
// }
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
  }
  .file-closeBtn {
    width: 60rpx;
    color: red;
  }
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
    width: 230rpx;
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
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100rpx;
  // background-color: #fff;
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
}
.popups {
  height: 50vh;
  .pop-head {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    height: 90rpx;
    padding: 0 20rpx;
    border-bottom: 1px solid #d7d7d7;
    .left {
      padding-left: 10rpx;
      border: 1px solid #d7d7d7;
    }
  }
  .table_detail {
    max-height: calc(50vh - 90rpx);
    td:first-child,
    th:first-child {
      width: 100rpx;
    }
    .selBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10rpx;
      border-radius: 10rpx;
      color: #fff;
      background-color: #169bd5;
    }
  }
}
 
 .showInfo_1{
  // text-align:  left;
  padding:  0  0 0 40rpx;
  // margin-right:-38px ;
  width: 600rpx;
  word-wrap: break-word;
  line-height: 40rpx;
  white-space: nowrap;
  overflow: hidden;
   padding: 0 0  0 40rpx;
  text-overflow: ellipsis;
  
 }
 
  .input-name{
      border: none;
      background: #fff;
  }
 .form-name{
  display: flex;
   width: 100%;
  height: 100rpx;
  line-height: 100rpx;
   align-items: center;
  border-bottom:1px solid #ddd;
 }
 .input-name-1{
  display: flex;
    background-color: #fff;
    padding: 0 40rpx;
    white-space: nowrap;
  overflow: hidden;
  
  text-overflow: ellipsis;
    
 }
 .gr-name{
    width: 200rpx;
    height: 100rpx;
    padding: 0 24rpx;
    border-right: solid 1px #ddd ;
    text-align: left;
 }
</style>
