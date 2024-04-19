<template>
  <view class="content wrapper">
    <u-navbar :leftText="title" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <view class="condition">
      <u--form labelWidth="90">
        <u-form-item label="标段项目">
          <picker
            class="select"
            :class="{ disables: type!=1 }"
            mode="selector"
            @change="proChange"
            :value="proIndex"
            :range="projectList"
            range-key="projectName"
            :disabled="type!=1"
          >
            <view class="uni-input">
              {{
                type!=1
                  ? settingData.projectName
                  : projectList[proIndex]
                  ? projectList[proIndex].projectName
                  : ""
              }}
              <u-icon name="arrow-down" class="arrows"></u-icon>
            </view>
          </picker>
        </u-form-item>
        <u-form-item label="服务单位">
          <picker
            class="select"
            :class="{ disables: type!=1 }"
            mode="selector"
            @change="unitChange"
            :value="unitIndex"
            :range="unitList"
            range-key="orgName"
            :disabled="type!=1"
          >
            <view class="uni-input">
              {{
                type!=1
                  ? settingData.orgName
                  : unitList[unitIndex]
                  ? unitList[unitIndex].orgName
                  : ""
              }}
              <u-icon name="arrow-down" class="arrows"></u-icon>
            </view>
          </picker>
        </u-form-item>
        <u-form-item label="所在班组">
          <picker
            class="select"
            :class="{ disables: type!=1 }"
            mode="selector"
            @change="classChange"
            v-model="classIndex"
            :range="classList"
            range-key="teamName"
            :disabled="type!=1"
          >
            <view class="uni-input">
              {{
                type!=1
                  ? settingData.teamName
                  : classList[classIndex]
                  ? classList[classIndex].teamName
                  : ""
              }}
              <u-icon name="arrow-down" class="arrows"></u-icon>
            </view>
          </picker>
        </u-form-item>
        <u-form-item label="结算周期" v-if="current === 1">
          <u-calendar :show="show" mode="range"></u-calendar>
          <view class="period">
            <picker
              class="select"
              :class="{ disables: type==2 || !!settingData.beginTime }"
              mode="date"
              fields="day"
              :value="settingData.beginTime"
              @change="beginDateChange"
              :disabled="type==2 || !!settingData.beginTime"
            >
              <view class="uni-input">{{ settingData.beginTime }}</view>
            </picker>
            <view class="with">至</view>
            <picker
              class="select"
              :class="{ disables: type==2 }"
              mode="date"
              fields="day"
              :start="settingData.beginTime"
              :value="settingData.endTime"
              @change="endDateChange"
              :disabled="type==2"
            >
              <view class="uni-input">{{ settingData.endTime }}</view>
            </picker>
          </view>
        </u-form-item>
        <u-form-item :label="current === 1 ? '结算日期' : '发放日期'">
          <picker
            class="select"
            :class="{ disables: type==2 }"
            mode="date"
            fields="day"
            :value="settingData.settlementTime"
            @change="settingDateChange"
            :disabled="type==2"
          >
            <view class="uni-input">{{ settingData.settlementTime }}</view>
          </picker>
        </u-form-item>
      </u--form>
    </view>
    <!-- 表格 -->
    <view class="detail">
      <view class="total">合计：{{ total }}元</view>
      <view class="table">
        <table
          border="1"
          style="margin: 0 auto; border-collapse: collapse; border-spacing: 0"
        >
          <thead>
            <tr>
              <th style="width: 80rpx">序号</th>
              <th style="width: 100rpx">姓名</th>
              <th>进场日期</th>
              <th v-if="current === 1 && type === 1">上期结算日期</th>
              <th v-if="current !== 1">上期结余金额</th>
              <th>本期结算金额（元）</th>
            </tr>
          </thead>
          <tbody v-if="peopleList.length">
            <tr v-for="(item, index) in peopleList" :key="item.fkUserId">
              <td>{{ index + 1 }}</td>
              <td>{{ item.userName }}</td>
              <td>{{ item.inductionTime }}</td>
              <td v-if="current === 1 && type === 1">
                {{ item.preSettlementTime ? item.preSettlementTime : "/" }}
              </td>
              <td v-if="current !== 1">{{ item.preSurplusAmount }}</td>
              <td>
                <input
                  type="number"
                  border="surround"
                  v-model="item.settlementAmount"
                  v-if="type !=2"
                  maxlength="12"
                  @input="limitTwo($event, item)"
                />
                <text v-else>{{ item.settlementAmount }}</text>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <td :colspan="current === 1 && type==2 ? 4 : 5">
              <u-empty
                style="height: 100%"
                mode="list"
                text="人员列表为空，请先选择班组"
                icon="http://cdn.uviewui.com/uview/empty/list.png"
              >
              </u-empty>
            </td>
          </tbody>
        </table>
      </view>
    </view>
    <view class="footer">
      <!-- 底部按钮 -->
      <u-button
      class="btnOk"
      type="primary"
      text="保存草稿"
      @click="btnOk(2)"
      v-if="this.type === 1||type==3"
      :disabled="btnDisabled"
    ></u-button>
    <u-button
      class="btnOk"
      type="primary"
      :text="current === 1 ? '确定结算' : '确定发放'"
      @click="btnOk(0)"
      v-if="this.type === 1 ||type==3"
      :disabled="btnDisabled"
    ></u-button>
    
    <u-button
      class="btnOk"
      type="primary"
      text="编辑"
      @click="edit"
      v-if="this.type === 2&&settingData.isUpdate"
      :disabled="btnDisabled"
    ></u-button>
    <u-button
      class="btnOk"
      type="error"
      text="删除"
      @click="delBtn"
      v-if="this.type === 2&&settingData.isDelete"
    ></u-button>
    <u-button
      class="btnOk withdraw"
      type="error"
      text="撤回"
      @click="withdraw"
      v-if="this.type === 2&&settingData.isWithdraw"
    ></u-button>

    </view>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    this.obj = JSON.parse(options.obj);
    this.settingData.settlementType = options.current - 0;
    this.type = options.type - 0;
    this.current = options.current - 0;
    if (options.current == 1) {
      if (options.type == 1) {
        this.title = "新增结算";
      } else {
        this.title = "结算详情";
      }
    } else {
      if (options.type == 1) {
        this.title = "新增发放";
      } else {
        this.title = "发放详情";
      }
    }
    if (this.type !== 1) {
      this.getSettlementDetail(this.obj.pkId);
    } else {
      this.getProjects();
    }
  },
  computed: {
    total() {
      let total = 0;
      this.peopleList.forEach((item) => {
        total += item.settlementAmount - 0;
      });
      this.settingData.settlementAmount = total;
      return total.toFixed(2);
    },
  },
  data() {
    return {
      title:'',
      projectList: [],
      proIndex: "",
      unitList: [],
      unitIndex: "",
      classList: [],
      classIndex: "",
      show: false,
      beginDate: "",
      endDate: "",
      settingDate: "",
      type: "",
      current: "",
      maxLength: 12,
      peopleList: [ ],
      // 接收到的参数
      obj: {},
      // 结算参数
      settingData: {
        settlementType: "",
        beginTime: "",
        endTime: "",
        settlementTime: "",
        settlementAmount: 0,
        fkOrgId: "",
        fkTeamId: "",
      },
      btnDisabled: false,
    };
  },
  methods: {
    delBtn(){
      uni.showModal({
        title: '提示',
        content: '确定删除？',
        showCancel: true,
        success: ({ confirm, cancel }) => {
          if(confirm){
            uni.showLoading({mask:true})
            this.$api.deleteSettlement({pkId:this.settingData.pkId}).then(res=>{
              uni.hideLoading()
              if(res.code===200){
                  uni.navigateBack({ delta: 1 });
                  uni.showToast({ title: "删除成功", icon: "success" });
                }else{
                  uni.showToast({ title: res.msg, icon: "none" });
                }
              })
          }
        }
      })
    },
    withdraw(){
      uni.showModal({
        title: '提示',
        content: '确定撤回？',
        showCancel: true,
        success: ({ confirm, cancel }) => {
          if(confirm){
            uni.showLoading({mask:true})
            this.$api.withdrawSettlement({pkId:this.settingData.pkId}).then(res=>{
              uni.hideLoading()
              if(res.code===200){
                  uni.navigateBack({ delta: 1 });
                  uni.showToast({ title: "撤回成功", icon: "success" });
                }else{
                  uni.showToast({ title: res.msg, icon: "none" });
                }
              })
          }
        }
      })
    },
    edit(){
      this.type=3
      if (this.current == 1) {
        if (this.type == 3) {
          this.title = "编辑结算";
        } else {
          this.title = "结算详情";
        }
      } else {
        if (this.type == 3) {
          this.title = "编辑发放";
        } else {
          this.title = "发放详情";
        }
      }
    },
    proChange(e) {
      if (!this.projectList.length) return;
      this.proIndex = e.detail.value;
      this.selectOrgByProjectId(this.projectList[e.detail.value].projectId);
      this.unitIndex = "";
      this.classIndex = "";
      this.settingData.fkOrgId = "";
      this.settingData.fkTeamId = "";
    },
    unitChange(e) {
      if (!this.unitList.length) return;
      this.unitIndex = e.detail.value;
      this.settingData.fkOrgId = this.unitList[this.unitIndex].pkId;
      this.selectByOrgId();
      this.classIndex = "";
      this.settingData.fkTeamId = "";
    },
    classChange(e) {
      if (!this.classList.length) return;
      this.classIndex = e.detail.value;
      this.settingData.fkTeamId = this.classList[this.classIndex].pkId;
      if (this.current === 1) {
        this.getSettlementBeginTime();
      }
      this.getSettlementMembers();
    },
    beginDateChange(e) {
      this.settingData.beginTime = e.target.value;
      this.settingData.endTime = "";
    },
    endDateChange(e) {
      if (new Date(e.target.value) < new Date(this.settingData.beginTime)) {
        this.settingData.endTime = "";
        return uni.showToast({
          title: "结束时间不能比开始时间早",
          icon: "none",
        });
      }
      this.settingData.endTime = e.target.value;
    },
    settingDateChange(e) {
      this.settingData.settlementTime = e.target.value;
    },
    // 限制小数后2位
    limitTwo(e, value) {
      let val = e.target.value;
      val = val.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      this.$nextTick(() => {
        if (this.current === 1) {
          value.settlementAmount = val;
          return;
        }
        if ((value.preSurplusAmount ?? "") !== "") {
          // value.settlementAmount = e.target.value;
          if (value.settlementAmount > value.preSurplusAmount) {
            value.settlementAmount = value.preSurplusAmount;
          }
        } else {
          value.settlementAmount = 0;
        }
      });
    },
    // 获所有任职过的项目
    getProjects() {
      // uni.showLoading({ title: "加载中...",mask: true });
      this.$api.getProjects().then((res) => {
        if (res.code === 200) {
          this.projectList = res.data ? res.data : [];
        } else {
          uni.showToast({
            icon: "none",
            title: res.msg,
            duration: 2000,
          });
        }
        // uni.hideLoading();
      });
    },
    // 根据项目id查询分包商
    selectOrgByProjectId(projectId) {
      uni.showLoading({ title: "加载中...", mask: true });
      this.$api
        .selectOrgByProjectId({ projectId })
        .then((res) => {
          if (res.code === 200) {
            this.unitList = res.data?res.data:[];
          } else {
            uni.showToast({
              icon: "none",
              title: res.msg,
              duration: 2000,
            });
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    // 根据项目id和分包商查询班组
    selectByOrgId() {
      console.log('进来了');
      uni.showLoading({ title: "加载中...", mask: true });
      console.log(this.projectList[this.proIndex].projectId,this.unitIndex);
      console.log(this.unitList[this.unitIndex].pkId);
      let data={
          orgId: this.unitList[this.unitIndex].pkId,
          projectId: this.projectList[this.proIndex].projectId,
        }
      this.$api
        .selectByOrgId(data)
        .then((res) => {
          if (res.code === 200) {
            this.classList = res.data;
          } else {
            uni.showToast({
              icon: "none",
              title: res.msg,
              duration: 2000,
            });
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title: err.msg ? err.msg : "系统内部错误",
            duration: 2000,
          });
        });
    },
    // 根据id查询详情
    getSettlementDetail(pkId) {
      uni.showLoading({ title: "加载中...", mask: true });
      this.$api
        .getSettlementDetailtwo({ pkId })
        .then((res) => {
          if (res.code === 200) {
            // labourSettlementMembersVo2s
            this.settingData = res.data;
            console.log(this.settingData);
            this.peopleList =
              res.data.labourSettlementMembersVo2s &&
              res.data.labourSettlementMembersVo2s.length
                ? res.data.labourSettlementMembersVo2s
                : [];
              this.getProjects(true);
          } else {
            uni.showToast({
              icon: "none",
              title: res.msg,
              duration: 2000,
            });
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title: err.msg ? err.msg : "系统内部错误",
            duration: 2000,
          });
        });
    },
    // 根据班组id查询人员
    getSettlementMembers() {
      uni.showLoading({ title: "加载中...", mask: true });
      this.$api
        .getSettlementMembers({
          teamId: this.classList[this.classIndex].pkId,
          settlementType: this.current,
        })
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.peopleList = res.data
              ? res.data.map((item) => ({ ...item, settlementAmount: 0 }))
              : [];
          } else {
            uni.showToast({
              icon: "none",
              title: res.msg,
              duration: 2000,
            });
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title: err.msg ? err.msg : "系统内部错误",
            duration: 2000,
          });
        });
    },
    // 获取上次结算日期
    getSettlementBeginTime() {
      uni.showLoading({ title: "加载中...", mask: true });
      this.$api
        .getSettlementBeginTime({ teamId: this.settingData.fkTeamId })
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.settingData.beginTime = res.data;
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    // 确定按钮
    btnOk(confirmStatus) {
      if (this.type==1&&(this.proIndex ?? "") === "") {
        return uni.showToast({
          icon: "none",
          title: "请选择标段项目",
          duration: 2000,
        });
      }
      if (this.type==1&&(this.unitIndex ?? "") === "") {
        return uni.showToast({
          icon: "none",
          title: "请选择服务单位",
          duration: 2000,
        });
      }
      if (this.type==1&&(this.classIndex ?? "") === "") {
        return uni.showToast({
          icon: "none",
          title: "请选择所在班组",
          duration: 2000,
        });
      }
      if ((this.settingData.endTime ?? "") === "" && this.current === 1) {
        return uni.showToast({
          icon: "none",
          title: "请选择结束时间",
          duration: 2000,
        });
      }
      if ((this.settingData.settlementTime ?? "") === "") {
        return uni.showToast({
          icon: "none",
          title: `请选择${this.current === 1 ? "结算" : "发放"}时间`,
          duration: 2000,
        });
      }
      if (!this.peopleList.length) {
        return uni.showToast({
          icon: "none",
          title: `没有可${
            this.current === 1 ? "结算" : "发放"
          }的人员，无法新增${this.current === 1 ? "结算" : "发放"}`,
          duration: 2000,
        });
      }
      let data = {
        ...this.settingData,
        confirmStatus,
        settlementMembersAddList: this.peopleList,
      };
      uni.showLoading({ title: "加载中...", mask: true });
      this.btnDisabled = true;
      if(this.type==1){
        this.$api
          .addTeamSettlement(data)
          .then((res) => {
            if (res.code === 200) {
              uni.showToast({
                icon: "success",
                title: res.msg,
                duration: 2000,
              });
              uni.navigateBack({
                delta: 1,
              });
            } else {
              uni.showToast({
                icon: "none",
                title: res.msg,
                duration: 2000,
              });
              this.btnDisabled = false;
            }
            uni.hideLoading();
          })
          .catch((err) => {
            this.btnDisabled = false;
            uni.hideLoading();
          });
      }else if(this.type==3){
        data={
          beginTime:data.beginTime,
          confirmStatus:data.confirmStatus,
          endTime:data.endTime,
          pkId:data.pkId,
          settlementAmount:data.settlementAmount,
          settlementTime:data.settlementTime,
          remark:data.remark,
          settlementMembers:data.settlementMembersAddList.map(item=>({pkId:item.pkId,settlementAmount:item.settlementAmount})),
        }
        this.$api
          .updateTeamSettlement(data)
          .then((res) => {
            if (res.code === 200) {
              uni.showToast({
                icon: "success",
                title: res.msg,
                duration: 2000,
              });
              uni.navigateBack({
                delta: 1,
              });
            } else {
              uni.showToast({
                icon: "none",
                title: res.msg,
                duration: 2000,
              });
              this.btnDisabled = false;
            }
            uni.hideLoading();
          })
          .catch((err) => {
            this.btnDisabled = false;
            uni.hideLoading();
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background-color: #f2f2f2;
}
.condition {
  padding: 20rpx 50rpx;
  border-bottom: 1px solid #000;
}
.uni-input {
  position: relative;
}
.select {
  width: 100%;
  height: 60rpx;
  padding: 10rpx;
  background-color: #fff;
  border: 1px solid #f2f2f2;
  .arrows {
    position: absolute;
    right: 20rpx;
    top: 0;
  }
}
.disables {
  background-color: #ccc;
}
.period {
  display: flex;
  align-items: center;
  width: 100%;
  .begin {
    margin-right: 10rpx;
  }
  .wh-200 {
    width: 180rpx;
  }
}
.detail {
  padding: 0 16rpx;
}
.total {
  line-height: 50rpx;
  text-align: right;
}
.table {
  overflow: auto;
  padding-bottom: 76rpx;
  max-height: 600rpx;
  thead {
    position: sticky;
    z-index: 2;
    top: -1rpx;
  }
  th,
  td {
    max-width: 200rpx;
    text-align: center;
    font-size: 26rpx;
    padding: 4rpx;
  }
  th {
    background-color: #d7d7d7;
  }
  td {
    background-color: #fff;
    input {
      border: 1px solid #000;
      font-size: 26rpx;
    }
  }
}

.footer{
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  width: 100%;
  .btnOk {
  width: 45%;
}
.withdraw{
  width: 70%;
}
}
</style>
