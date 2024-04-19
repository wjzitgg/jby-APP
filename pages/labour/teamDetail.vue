<template>
  <view class="wrapper">
    <u-navbar
      :leftText="navBarTitle"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="sticky" v-if="priview">
      <u-subsection
        :list="topList"
        mode="subsection"
        :current="current"
        @change="sectionChange"
      ></u-subsection>
    </view>
    <view class="pad" v-if="priview"></view>
    <view class="content">
      <u--form
        labelWidth="100"
        borderBottom
        labelAlign="right"
        v-show="current === 0"
      >
        <u-form-item label="班组名称：" borderBottom>
          <u-input
            v-model="form.teamName"
            border="bottom"
            :disabled="priview"
            maxlength="25"
          />
        </u-form-item>
        <u-form-item label="所属标段：" borderBottom>
          <!-- 首页左上角已选择 -->
          <view class="bid">{{ form.fkProjectName }}</view>
        </u-form-item>
        <u-form-item label="班组类别：" borderBottom @click="selectTeamType">
          <u-input
            v-model="form.fkClassName"
            :placeholder="priview ? '' : '点击选择'"
            border="bottom"
            disabled
          />
          <!-- <view style="height: 74rpx"></view> -->
        </u-form-item>
        <u-form-item label="负责人：" borderBottom>
          <u-input
            v-model="form.leaderName"
            border="bottom"
            :disabled="priview"
            maxlength="25"
          />
        </u-form-item>
        <u-form-item label="负责人手机：" borderBottom>
          <u-input
            v-model="form.leaderPhone"
            border="bottom"
            type="number"
            maxlength="11"
            :disabled="priview"
          />
        </u-form-item>
        <u-form-item label="备注：" borderBottom>
          <u-input
            v-model="form.remark"
            border="bottom"
            :disabled="priview"
            maxlength="100"
          />
        </u-form-item>
      </u--form>
      <view v-show="current === 1">
        <!-- v-if="showList.length" -->
        <view
          class="table_detail table1 table_empty"
          v-if="form.users && form.users.length"
        >
          <table>
            <thead>
              <tr>
                <th>工人姓名</th>
                <th>手机号码</th>
                <th>加入日期</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in form.users"
                :key="item.pkId"
                :class="{ disabled: item.dismissalStatus != 0 }"
              >
                <td>{{ item.userName }}</td>
                <td>{{ item.telephone }}</td>
                <td>{{ item.inductionTime }}</td>
                <!-- 0：正常 1：班主辞退，2：主动申请 -->
                <td>
                  {{
                    item.dismissalStatus == 0
                      ? "正常"
                      : item.dismissalStatus == 1
                      ? "班主辞退"
                      : item.dismissalStatus == 2
                      ? "主动申请"
                      : ""
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </view>
        <u-empty
          v-if="form.users && form.users.length"
          mode="data"
          text="没有更多了"
          icon="/static/image/tableNoMore.png"
        ></u-empty>
        <u-empty
          v-else
          style="height: 100%"
          mode="data"
          text="暂无数据"
          icon="/static/image/noData.png"
        />
      </view>
    </view>
    <view class="pab"></view>
    <view class="footer">
      <view class="btns edit" v-if="$auth('labour:team:edit')" @click="edit"
        >编辑</view
      >
      <view class="btns del" v-if="$auth('labour:team:delete')" @click="del"
        >删除</view
      >
    </view>
    <view class="btn" v-if="!priview" @click="save">保存</view>

    <u-popup
      :show="popShow"
      mode="bottom"
      @close="closePop"
      :closeOnClickOverlay="false"
    >
      <view class="popup">
        <view class="popup-head">
          <u-icon
            name="arrow-left"
            color="#2979ff"
            size="16"
            @click="returns"
          ></u-icon>
          <view class="adminType" @click="adminType" v-if="popType === 1">
            <u-icon name="setting" color="#fff" size="16"></u-icon>
            <view>管理类别</view>
          </view>
          <view class="adminType" @click="addType" v-if="popType === 2">
            <u-icon name="plus" color="#fff" size="16"></u-icon>
            <view>新增类别</view>
          </view>
        </view>
        <view class="popup-content" v-if="popType === 1">
          <view
            class="popup-content-item"
            v-for="(item, index) in teamClassList"
            :key="index"
            @click="selectType(item)"
          >
            {{ item.className }}
          </view>
        </view>
        <view class="popup-content" v-if="popType === 2">
          <uni-table border emptyText="暂无更多数据">
            <!-- 表头行 -->
            <uni-tr>
              <uni-th align="center" width="240rpx">类别名称</uni-th>
              <uni-th align="center" width="40rpx">排序值</uni-th>
              <uni-th align="center" width="80rpx">操作</uni-th>
            </uni-tr>
            <!-- 表格数据行 -->
            <uni-tr v-for="(item, index) in teamClassList" :key="index">
              <uni-td width="240rpx"
                ><view>{{ item.className }}</view
                ><view class="remark">{{ item.remark }}</view></uni-td
              >
              <uni-td align="center" width="40rpx">{{ item.sortval }}</uni-td>
              <uni-td align="center" width="80rpx">
                <view class="operate">
                  <u-icon
                    name="edit-pen"
                    size="20"
                    @click="editType(item)"
                  ></u-icon>
                  <u-icon
                    name="trash"
                    color="#ff0000"
                    size="20"
                    @click="delType(item)"
                  ></u-icon>
                </view>
              </uni-td>
            </uni-tr>
          </uni-table>
        </view>
      </view>
      <u-popup
        :show="popShow2"
        mode="center"
        @close="closePop2"
        :closeOnClickOverlay="false"
        round="5"
      >
        <view class="popup2">
          <u--form labelWidth="80" labelAlign="right">
            <u-form-item label="班组名称：">
              <view class="inp">
                <u-input
                  v-model="typeForm.className"
                  border="none"
                  maxlength="25"
                />
              </view>
            </u-form-item>
            <u-form-item label="排序值：">
              <view class="inp">
                <u-input
                  v-model="typeForm.sortval"
                  type="number"
                  maxlength="6"
                  border="none"
                />
              </view>
            </u-form-item>
            <u-form-item label="备注：">
              <view class="inp">
                <u-input
                  v-model="typeForm.remark"
                  border="none"
                  maxlength="100"
                />
              </view>
            </u-form-item>
          </u--form>
          <view class="popBtns">
            <view class="popBtn save" @click="saveType">保存</view>
            <view class="popBtn cancels" @click="closePop2">取消</view>
          </view>
        </view>
      </u-popup>
      <u-modal
        :show="modelShow2"
        title="删除提示"
        content="确定删除该班组类别？"
        showCancelButton
        @confirm="confirmDel2"
        @cancel="cancelDel2"
      ></u-modal>
    </u-popup>
    <u-modal
      :show="modelShow"
      title="删除提示"
      content="确定删除该班组？"
      showCancelButton
      @confirm="confirmDel"
      @cancel="cancelDel"
    ></u-modal>
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
      navBarTitle: "班组信息",
      type: 1, //1为新增，2为编辑,3为查看
      priview: true,
      topList: ["班组信息", "班组成员"],
      current: 0,
      form: {
        fkClassId: "",
        fkClassName: "",
        fkProjectId: "",
        fkProjectName: "",
        leaderName: "",
        leaderPhone: "",
        relationStatus: "",
        remark: "",
        teamName: "",
        users: [],
      },
      teamTypeName: "",
      teamTypeId: "",
      popShow: false,
      popType: 1,
      popShow2: false,
      modelShow: false,
      modelShow2: false,
      typeForm: {
        className: "",
        remark: "",
        sortval: "",
      },
      teamClassList: [],
      editShow: false,
      typeState: 1,
    };
  },
  onLoad(options) {
    console.log("options.type -----> ", options);
    this.type = options.type - 0;
    if (options.type == "1") {
      this.priview = false;
      this.navBarTitle = "新增班组";
      this.listAllTeamsClass();
      this.form.fkProjectName = uni.getStorageSync("nowProName");
      this.form.fkProjectId = uni.getStorageSync("nowProId");
    } else {
      this.priview = true;
      let data = JSON.parse(options.data);
      this.findTeamById(data.pkId);
      if (this.type === 2) {
        this.editShow = !!data.isUpdateAndDelete;
      } else {
        this.editShow = false;
      }
      this.navBarTitle = "班组信息";
    }
  },
  methods: {
    listAllTeamsClass() {
      this.$api.listAllTeamsClass().then((res) => {
        if (res.code === 200) {
          this.teamClassList = res.data;
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    findTeamById(pkId) {
      this.$api.findTeamById({ pkId }).then((res) => {
        if (res.code === 200) {
          this.form = res.data;
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
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
    sectionChange(index) {
      this.current = index;
    },
    selectTeamType() {
      if (this.priview) {
        return;
      }
      this.popShow = true;
    },
    adminType() {
      this.popType = 2;
    },
    addType() {
      this.typeState = 1;
      this.popShow2 = true;
    },
    returns() {
      if (this.popType === 1) {
        this.closePop();
      } else if (this.popType > 1) {
        this.popType--;
      }
    },
    selectType(item) {
      console.log("选中了", item);
      this.form.fkClassId = item.pkId;
      this.form.fkClassName = item.className;
      this.closePop();
    },
    editType(item) {
      console.log("编辑", item);
      this.typeState = 2;
      this.typeForm = { ...item };
      this.popShow2 = true;
    },
    delType(item) {
      this.typeForm = { ...item };
      this.modelShow2 = true;
    },
    closePop() {
      this.popShow = false;
    },
    saveType() {
      console.log(this.typeForm);
      let data = { ...this.typeForm };
      uni.showLoading({ mask: true });
      if (this.typeState === 1) {
        this.$api
          .addTeamType(data)
          .then((res) => {
            uni.hideLoading();
            if (res.code === 200) {
              this.listAllTeamsClass();
              uni.showToast({ title: "新增成功", icon: "success" });
              this.closePop2();
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
      } else {
        this.$api
          .updateTeamClass(data)
          .then((res) => {
            uni.hideLoading();
            if (res.code === 200) {
              this.listAllTeamsClass();
              uni.showToast({ title: "编辑成功", icon: "success" });
              this.closePop2();
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
      }
    },
    closePop2() {
      this.popShow2 = false;
      this.typeForm = {
        className: "",
        remark: "",
        sortval: "",
      };
    },
    save() {
      let data = { ...this.form };
      if (!data.teamName) {
        return uni.showToast({ title: "请填写班组名称", icon: "none" });
      }
      if (!data.fkClassId) {
        return uni.showToast({ title: "请选择班组类别", icon: "none" });
      }
      if (!data.leaderName) {
        return uni.showToast({ title: "请填写负责人", icon: "none" });
      }
      if (!data.leaderPhone) {
        return uni.showToast({ title: "请填写手机号码", icon: "none" });
      }
      const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!reg.test(data.leaderPhone)) {
        return uni.showToast({ icon: "none", title: "请输入正确的手机号" });
      }
      uni.showLoading({ mask: true });
      if (this.type === 1) {
        this.$api
          .addTeam(data)
          .then((res) => {
            uni.hideLoading();
            if (res.code == 200) {
              this.findTeamById(res.data);
              this.reshPage();
              uni.navigateBack({ delta: 1 });
              uni.showToast({ title: "新增成功", icon: "success" });
              // this.type = 2;
              // this.editShow = true;
              // this.priview = true;
            } else {
              uni.showToast({ title: res.msg, icon: "none" });
            }
          })
          .catch((err) => {
            uni.hideLoading();
          });
      } else if (this.type === 2) {
        this.$api
          .updateTeam(data)
          .then((res) => {
            uni.hideLoading();
            if (res.code == 200) {
              this.findTeamById(data.pkId);
              this.reshPage();
              uni.navigateBack({ delta: 1 });
              uni.showToast({ title: "编辑成功", icon: "success" });
              // this.editShow = true;
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
      this.listAllTeamsClass();
      this.current = 0;
      this.priview = false;
      this.navBarTitle = "编辑班组";
    },
    del() {
      this.modelShow = true;
    },
    confirmDel() {
      uni.showLoading({ mask: true });
      this.$api
        .deleteTeam({ pkId: this.form.pkId })
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
    confirmDel2() {
      uni.showLoading({ mask: true });
      this.$api
        .deleteTeamType({ pkId: this.typeForm.pkId })
        .then((res) => {
          uni.hideLoading();
          if (res.code == 200) {
            this.closePop2();
            this.modelShow2 = false;
            this.listAllTeamsClass();
            uni.showToast({ title: "删除成功", icon: "success" });
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    cancelDel2() {
      this.modelShow2 = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.pad {
  height: 60rpx;
}
.pab {
  height: 100rpx;
}
.content {
  background-color: #fff;
  .u-form-item {
    padding: 0 20rpx;
  }
  .table1 {
    max-height: calc(100vh - 250rpx);
    td:last-child,
    th:last-child {
      width: 70px;
    }
    .disabled {
      td {
        color: #b2aabd;
      }
    }
  }
  .bid {
    display: flex;
    align-items: center;
    height: 74rpx;
  }
}
.footer {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100rpx;
  z-index: 2;
  background-color: #fff;
  .btns {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 320rpx;
    height: 80rpx;
    color: #fff;
    border-radius: 10rpx;
    font-size: 28rpx;
  }
  .edit {
    background-color: #02a7f0;
  }
  .del {
    background-color: #e25667;
  }
}
.popup {
  height: 50vh;
  .popup-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    padding: 0 10rpx;
    border-bottom: 1px solid #d7d7d7;
    .adminType {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60rpx;
      padding: 0 20rpx;
      color: #fff;
      font-size: 28rpx;
      border-radius: 10rpx;
      background-color: #169bd5;
    }
  }
  .popup-content {
    height: calc(50vh - 90rpx);
    overflow: auto;
    .popup-content-item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80rpx;
      border-top: 1px solid #d7d7d7;
      border-bottom: 1px solid #d7d7d7;
    }
    .remark {
      max-width: 240rpx;
      font-size: 28rpx;
      color: #d7d7d7;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
    }
    .operate {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
  }
}
.popup2 {
  width: 600rpx;
  height: 450rpx;
  padding: 20rpx;
  .inp {
    width: 400rpx;
    border-bottom: 1px solid #d7d7d7;
  }
  .popBtns {
    display: flex;
    justify-content: center;
    margin-top: 40rpx;
  }
  .popBtn {
    padding: 20rpx 40rpx;
    color: #fff;
    font-size: 28rpx;
    border-radius: 10rpx;
  }
  .save {
    margin-right: 40rpx;
    background-color: #169bd5;
  }
  .cancels {
    background-color: #d7d7d7;
  }
}
</style>
