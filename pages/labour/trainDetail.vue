<template>
  <view class="wrapper">
    <u-navbar
      leftText="培训详情"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>

    <view class="sticky">
      <!-- <u-subsection
        :list="topList"
        mode="subsection"
        :current="current"
        @change="sectionChange"
        v-if="priview"
      ></u-subsection> -->

      <u-tabs
        mode="subsection"
        :list="topList"
        :current="current"
        @change="sectionChange"
        :activeStyle="{ color: 'rgba(32, 52, 87, 1)' }"
        :inactiveStyle="{ color: 'rgba(32, 52, 87, 0.6)' }"
      >
      </u-tabs>
    </view>
    <view class="pad" ></view>

    <view class="content" v-if="current === 0">
      <!-- <u--form
        labelPosition="left"
        :borderBottom="true"
        :labelWidth="'100'"
        labelAlign="left"
      >
        <u-form-item label="培训主题：" borderBottom>
          <u-input v-model="form.title" border="bottom" :disabled="priview" maxlength="50"/>
        </u-form-item>
        <u-form-item label="培训类型：" borderBottom @click="openPicker(1)">
          <u-input
            v-model="form.speakerTypeName"
            :placeholder="priview ? '' : '点击选择'"
            border="bottom"
            disabled
          />

        </u-form-item>
        <u-form-item label="班组选择：" borderBottom @click="openPop">
          <u-input
            v-model="form.teamName"
            :placeholder="priview ? '' : '点击选择'"
            border="bottom"
            disabled
          />
        </u-form-item>


        <u-form-item label="开始日期：" borderBottom @click="openDateSelect">
          <u-input
            :value="form.trainingTime +' ' +form.trainingStartTime"
            :placeholder="priview ? '' : '点击选择'"
            border="bottom"
            disabled
          />
        </u-form-item>


        <u-form-item label="培训时长：" borderBottom @click="openPicker2">
            <u-input
            :value="durTime"
            :placeholder="priview ? '' : '点击选择'"
            border="bottom"
            disabled
          />
        </u-form-item>

        <u-picker title="时长" :show="pickerShow2" :columns="[pickList2]" keyName="label" @confirm="pickerConfirm2" @cancel="pickerCancel2" ></u-picker>


        <u-form-item
          label="发起单位："
          borderBottom
          v-if="userInfo.orgType === 5"
          @click="openPicker(2)"
        >
          <u-input
            v-model="form.speakerCompany"
            :placeholder="priview ? '' : '点击选择'"
            border="bottom"
            disabled
          />

        </u-form-item>
        <u-form-item label="培训地点：" borderBottom>
          <u-input
            v-model="form.address"
            border="bottom"
            :disabled="priview"
            maxlength="100"
          />
        </u-form-item>
        <u-form-item label="主讲人：" borderBottom>
          <u-input v-model="form.speaker" border="bottom" :disabled="priview" maxlength="20"/>
        </u-form-item>

        <u-form-item label="是否需要签到" borderBottom >
          <u-radio-group
            v-model="form.signStatus"
            placement="row"
            :disabled="priview"
          >
            <u-radio label="是" :name="0" > </u-radio>
            <u-radio label="否" :name="1" > </u-radio>
          </u-radio-group>
        </u-form-item>
      </u--form> -->

      <view
        class="content-box"
        labelPosition="left"
        :borderBottom="true"
        :labelWidth="'100'"
        labelAlign="left"
      >
        <!-- <view class="ThemeTranslation">
          <view class="ThemeTranslation-1"
            ><input v-model="form.title" :disabled="priview" maxlength="50"
          /></view>
        </view> -->

        <view class="form-item">
          <view class="data-item">培训主题</view>
          <view class="data-item-input" >
           <input v-model="form.title" :disabled="priview" maxlength="50" />
          </view>
        </view>
        <view class="form-item">
          <view class="data-item">培训类型</view>
          <view class="data-item-input" :class="{placeholder:!form.speakerTypeName}" @click="openPicker(1)">
            {{priview ? form.speakerTypeName :!!form.speakerTypeName?form.speakerTypeName: '点击选择'}}
            <!-- <input
              v-model="form.speakerTypeName"
              :placeholder="priview ? '' : '点击选择'"
              disabled
          /> -->
          </view>
        </view>

        <view class="form-item">
          <view class="data-item" >班组选择</view>
          <view class="data-item-input" :class="{placeholder:!form.teamName}" @click="openPop">
            {{priview ? form.teamName : !!form.teamName?form.teamName: '点击选择'}}
            <!-- <input
              v-model="form.teamName"
              :placeholder="priview ? '' : '点击选择'"
              disabled
          /> -->
          </view>
        </view>

        <view class="form-item">
          <view class="data-item" >开始日期</view>
          <view class="data-item-input" :class="{placeholder:!form.trainingTime}" @click="openDateSelect">
            {{priview?(form.trainingTime + ' ' + form.trainingStartTime):!!form.trainingTime?(form.trainingTime + ' ' + form.trainingStartTime): '点击选择'}}
            <!-- <input
              :value="form.trainingTime + ' ' + form.trainingStartTime"
              :placeholder="priview ? '' : '点击选择'"
              disabled
            /> -->
          </view>
        </view>

        <view class="form-item">
          <view class="data-item" >培训时长</view>
          <view class="data-item-input" :class="{placeholder:!durTime}" @click="openPicker2">
            {{priview ? durTime : !!durTime?durTime: '点击选择'}}
            <!-- <input
              :value="durTime"
              :placeholder="priview ? '' : '点击选择'"
              disabled
            /> -->
          </view>
        </view>
        <u-picker
          title="时长"
          :show="pickerShow2"
          :columns="[pickList2]"
          keyName="label"
          @confirm="pickerConfirm2"
          @cancel="pickerCancel2"
        ></u-picker>

        <view
          class="form-item"
          v-if="userInfo.orgType === 5"
        >
          <view class="data-item">发起单位</view>
          <view class="data-item-input" :class="{placeholder:!form.speakerCompany}" @click="openPicker(2)">
            {{priview ? form.speakerCompany : !!form.speakerCompany?form.speakerCompany: '点击选择'}}
            <!-- <input
              v-model="form.speakerCompany"
              :placeholder="priview ? '' : '点击选择'"
              disabled
            /> -->
          </view>
        </view>

        <view class="form-item">
          <view class="data-item">培训地点</view>
          <view class="data-item-input">
            <input
              v-model="form.address"
              border="bottom"
              :disabled="priview"
              maxlength="100"
            />
          </view>
        </view>

        <view class="form-item">
          <view class="data-item">主&nbsp;&nbsp;讲&nbsp;&nbsp;人</view>
          <view class="data-item-input">
            <input
              v-model="form.speaker"
              border="bottom"
              :disabled="priview"
              maxlength="20"
            />
          </view>
        </view>

        <view class="form-item">
          <view class="data-item"
            >签&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;到</view
          >
          <view class="data-item-input">
            <u-radio-group
              v-model="form.signStatus"
              placement="row"
              :disabled="priview"
            >
              <u-radio label="是" :name="0"> </u-radio>
              <u-radio label="否" :name="1"> </u-radio>
            </u-radio-group>
          </view>
        </view>
      </view>

      <!-- 附件 -->
      <view class="approve-files">
        <view class="attachment">附&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;件</view>

        <view class="attachment-f">
          <view class="approve-files-head">
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
              v-if="
                !priview &&
                !pickerShow &&
                !popShow &&
                !dateSelectShow &&
                !modelShow &&
                !calenShow
              "
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
              :key="index"
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

      <view class="intro">
        <view class="intro-head"> 会议简介 </view>
        <view class="intro-Content">
          <!-- <edit
            v-if="!priview && type !== 3"
            :value="form.trainingContent"
            ref="editRef"
            @editorChange="editorChange"
          ></edit> -->
          <editors
            v-if="!priview && type !== 3"
            :content="form.trainingContent"
            ref="editRef"
          ></editors>
          <u-parse
            :content="form.trainingContent"
            class="parse"
            v-else
          ></u-parse>
        </view>
      </view>
    </view>

    <view class="content" v-if="current === 1">
      <view class="sign-in-head">
        <view class="Signin">
          <view class="Signin-1">已签到人数</view>
          <view>
            <span class="Signin-2">{{ signNum }}</span> 人</view
          >
        </view>

        <view class="sign-in-btns">
          <view
            class="sign-in-btn mr-20"
            @click="showCode"
            v-if="form.initiativeCode"
            >签到二维码</view
          >
          <view class="sign-in-btn" @click="scanCode" v-if="form.sweptCode"
            >识别二维码</view
          >
        </view>
      </view>
      <view class="sign-in-list">
        <view
          class="table_detail table_empty"
          v-if="signList && signList.length"
        >
          <table>
            <thead>
              <tr>
                <th><uni-icons type="list" size="20"></uni-icons></th>
                <th>劳务工人</th>
                <th>所在班组</th>
                <th>签到时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in signList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.userName }}</td>
                <td>{{ item.teamName }}</td>
                <td>{{ item.createTime }}</td>
              </tr>
            </tbody>
          </table>
        </view>
        <u-empty
          v-if="signList && signList.length"
          mode="data"
          text="没有更多了"
          icon="/static/image/tableNoMore.png"
        ></u-empty>
        <u-empty
          v-else
          style="height: 100%"
          mode="data"
          text="暂无签到人员"
          icon="/static/image/noData.png"
        >
        </u-empty>
      </view>
    </view>

    <view class="pdb"></view>
    <view class="footer" v-if="priview && type !== 3">
      <view class="btns edit" @click="edit" v-if="$auth('labour:train:edit')"
        >编辑</view
      >
      <view
        class="btns del"
        @click="modelShow = true"
        v-if="$auth('labour:train:delete')"
        >删除</view
      >
    </view>
    <view class="btn" v-if="!priview && type !== 3" @click="save">保 存</view>

    <u-picker
      :title="pickType === 1 ? '培训类型' : '发起单位'"
      :show="pickerShow"
      :columns="[pickList]"
      keyName="label"
      @confirm="pickerConfirm"
      @cancel="pickerCancel"
    ></u-picker>

    <u-popup :show="popShow" @close="closePop" mode="bottom">
      <view class="popups">
        <view class="pop-head">
          <view class="left">
            <u-input
              placeholder="班组名称/班组长名称/手机号码"
              border="none"
              v-model="inpKey"
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
          <view class="right" @click="selectOk">确定</view>
        </view>
        <view class="pop-content">
          <u-checkbox-group
            v-model="checkboxValue"
            placement="column"
            v-if="teamList.length"
          >
            <view class="table_detail">
              <table>
                <thead>
                  <tr>
                    <th class="wh-50">选择</th>
                    <th>班组名称</th>
                    <th>班组长</th>
                    <th>手机号码</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in teamList" :key="index">
                    <td class="wh-50">
                      <u-checkbox :label="''" :name="item.pkId"></u-checkbox>
                    </td>
                    <td>{{ item.teamName }}</td>
                    <td>{{ item.leaderName }}</td>
                    <td>{{ item.leaderPhone }}</td>
                  </tr>
                </tbody>
              </table>
            </view>
          </u-checkbox-group>
          <u-empty
            v-else
            style="height: 100%"
            mode="data"
            text="暂无数据"
            icon="/static/image/noData.png"
          >
          </u-empty>
        </view>
      </view>
    </u-popup>

    <u-popup :show="codeShow" mode="center" @close="closeCode">
      <w-qrcode :options="options"></w-qrcode>
      <view style="text-align: center">签到二维码</view>
    </u-popup>

    <uni-calendar ref="calendar" :insert="false" @confirm="caleConfirm" />
    <!-- <u-datetime-picker
      :show="dateSelectShow"
      v-model="dates"
      mode="time"
      @confirm="dateSelect"
      @cancel="closeDateSelect"
    ></u-datetime-picker> -->
    <u-datetime-picker
      :show="dateSelectShow"
      v-model="dates"
      mode="datetime"
      @confirm="dateSelect"
      @cancel="closeDateSelect"
    ></u-datetime-picker>
    <u-modal
      :show="modelShow"
      title="删除提示"
      content="确定删除该培训？"
      showCancelButton
      @confirm="confirmDel"
      @cancel="cancelDel"
    ></u-modal>
  </view>
</template>

<script>
import request from "../../common/request";
import permision from "@/common/permission.js";
import edit from "@/components/xia-editor/xia-editor/xia-editor";
import editors from "@/components/editors/editors";
import moment from "moment";
export default {
  components: { edit,editors },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    calenShow() {
      return this.$refs.calendar ? this.$refs.calendar.show : false;
    },
  },
  data() {
    return {
      type: 1, //1为新增，2为编辑，3为查看
      priview: false,
      topList: [{ name: "培训信息" }, { name: "签到情况" }],
      current: 0,
      form: {
        address: "",
        enclosureUrl: "",
        fkCompanyId: 0,
        initiativeCode: 0,
        speaker: "",
        speakerCompany: "",
        speakerType: 0,
        speakerTypeName: "",
        sweptCode: 0,
        teamIds: [],
        teamName: "",
        title: "",
        trainingTime: "",
        trainingStartTime: "",
        trainingEndTime: "",
        trainingContent: "",
        signStatus: 0,
      },
      signList: [],
      signNum: 0,
      fileList: [],
      modelShow: false,
      popShow: false,
      inpKey: "",
      searchKey: "",
      dates: Date.now(),
      dateSelType: 1,
      dateSelectShow: false,
      checkboxValue: [],
      selectList: [],
      pickerShow: false,
      pickType: 1,
      pickList: [],
      pickerShow2: false,
      pickList2: [
        { value: 15 * 60 * 1000, label: "15分钟" },
        { value: 30 * 60 * 1000, label: "30分钟" },
        { value: 45 * 60 * 1000, label: "45分钟" },
        { value: 60 * 60 * 1000, label: "1小时" },
        { value: 2 * 60 * 60 * 1000, label: "2小时" },
        { value: 3 * 60 * 60 * 1000, label: "3小时" },
      ],
      typeList: [],
      unitList: [],
      teamList: [],
      typeId: "",
      typeName: "",
      codeShow: false,
      options: {
        code: "https://www.baidu.com",
        size: 460,
      },
      // 上传接口参数
      option: {
        // 上传服务器地址，此地址需要替换为你的接口地址
        url: request.baseUrl + "/app/file/upload/picture",
        // 上传附件的key
        name: "file",
        // 根据你接口需求自定义请求头,默认不要写content-type,让浏览器自适配
        header: {
          // 示例参数可删除
          Authorization: uni.getStorageSync("token"),
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
      durTime: "",
    };
  },
  onLoad(options) {
    console.log(options);
    this.type = options.type - 0;
    if (options.type == "1") {
      this.priview = false;
      if (this.userInfo.orgType === 5) {
        this.searchByCompany();
      }
      this.speakerTypeAllList();
      this.labourTeamSearch();
    } else {
      let data = JSON.parse(options.data);
      this.searchTrainById(data.pkId);
      this.priview = true;
    }
  },
  methods: {
    reshPage() {
      var pages = getCurrentPages(); //当前页面栈
      console.log(getCurrentPages, pages);
      if (pages.length > 1) {
        var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
        beforePage.$vm.refreshIfNeeded = true;
      }
    },
    // 富文本内容
    editorChange(val) {
      // console.log(val)
      this.form.trainingContent = val;
    },
    searchTrainById(pkId) {
      this.$api
        .searchTrainById({ pkId, pageNum: 1, pageSize: 1000 })
        .then((res) => {
          if (res.code === 200) {
            this.form = res.data;
            this.form.address = res.data.detailAddress;
            let beginTime = Date.parse(
              new Date(
                this.form.trainingTime + " " + this.form.trainingStartTime
              )
            );
            let endTime = Date.parse(
              new Date(this.form.trainingTime + " " + this.form.trainingEndTime)
            );
            let time = endTime - beginTime;
            if (time < 15 * 60 * 1000) {
              this.durTime = "15分钟";
            } else if (time > 3 * 60 * 60 * 1000) {
              this.durTime = "3小时";
            } else {
              this.pickList2.forEach((item, index) => {
                if (
                  item.value == time ||
                  (time > item.value && time < this.pickList2[index + 1])
                ) {
                  this.durTime = item.label;
                }
              });
            }
            this.fileList = JSON.parse(res.data.enclosureUrl);
            this.signList = res.data.userSignPageVo.records;
            this.signNum = res.data.userSignPageVo.total - 0;
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
    },
    searchByCompany() {
      this.$api.searchByCompany().then((res) => {
        if (res.code === 200) {
          this.unitList = [
            { label: "本项目部", value: this.userInfo.orgId },
            ...res.data.map((item) => ({
              ...item,
              label:
                item.customName +
                "(" +
                (item.customType === 0
                  ? "建设单位"
                  : item.customType === 1
                  ? "监理公司"
                  : item.customType === 2
                  ? "项目部"
                  : item.customType === 3
                  ? "供应商"
                  : "分包单位") +
                ")",
              value: item.fkLinkOrgId,
            })),
          ];
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    speakerTypeAllList() {
      this.$api.speakerTypeAllList().then((res) => {
        if (res.code === 200) {
          this.typeList = res.data.map((item) => ({
            ...item,
            value: item.pkId,
            label: item.speakerTypeName,
          }));
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    labourTeamSearch() {
      let projectOrgId =
        uni.getStorageSync("user").orgType === 7
          ? uni.getStorageSync("nowOrgId")
          : "";
      this.$api
        .labourTeamSearch({ projectOrgId, keyWord: this.searchKey })
        .then((res) => {
          if (res.code === 200) {
            this.teamList = res.data;
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        });
    },
    save() {
      let data = {
        ...this.form,
        detailAddress: this.form.address,
        trainingType: this.userInfo.orgType === 7 ? 1 : 2,
      };
      data.trainingContent = this.$refs.editRef.getText()
      data.enclosureUrl = JSON.stringify(this.fileList);
      if (!data.title) {
        return uni.showToast({ title: "请输入主题", icon: "none" });
      }
      if (!data.trainingType) {
        return uni.showToast({ title: "请选择培训类型", icon: "none" });
      }
      if (!data.teamIds) {
        return uni.showToast({ title: "请选择班组", icon: "none" });
      }
      if (!data.trainingTime) {
        return uni.showToast({ title: "请选择培训日期", icon: "none" });
      }
      if (!data.speaker) {
        return uni.showToast({ title: "请输入主讲人", icon: "none" });
      }
      if (!data.address) {
        return uni.showToast({ title: "请输入培训地址", icon: "none" });
      }
      let times = this.pickList2.filter((item) => item.label == this.durTime)[0]
        .value;
      let dat = Date.parse(
        new Date(this.form.trainingTime + " " + this.form.trainingStartTime)
      );
      data.trainingEndTime = moment(dat + times).format("HH:mm:ss");
      console.log(data);
      // uni.navigateBack({ delta: 1 });
      uni.showLoading({ mask: true });
      if (this.type === 1) {
        this.$api
          .addTrain(data)
          .then((res) => {
            uni.hideLoading();
            if (res.code === 200) {
              uni.showToast({ title: "新增成功" });
              this.type = 2;
              this.searchTrainById(res.data);
              this.reshPage();
              uni.navigateBack();
              // this.priview=true
            } else {
              uni.showToast({ title: res.msg, icon: "none" });
            }
          })
          .catch((err) => {
            uni.hideLoading();
          });
      } else {
        this.$api
          .updateTrain(data)
          .then((res) => {
            uni.hideLoading();
            if (res.code === 200) {
              uni.showToast({ title: "编辑成功" });
              this.searchTrainById(data.pkId);
              this.reshPage();
              uni.navigateBack();
              // this.priview=true
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
      if (this.userInfo.orgType === 5) {
        this.searchByCompany();
      }
      this.speakerTypeAllList();
      this.labourTeamSearch();
      this.priview = false;
      this.current = 0;
    },
    // sectionChange(index) {
    //   this.current = index;
    //   // this.showList = [];
    // },
    sectionChange(item) {
      this.current = item.index;
    },
    confirmDel() {
      uni.showLoading({ mask: true });
      this.$api
        .deleteTrain({ pkId: this.form.pkId })
        .then((res) => {
          if (res.code === 200) {
            this.modelShow = false;
            this.reshPage();
            uni.navigateBack();
            uni.showToast({ title: "删除成功", icon: "success" });
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    cancelDel() {
      this.modelShow = false;
    },
    delFile(row, index) {
      this.fileList.splice(index, 1);
      this.$refs.lsjUpload1.clear(row.name);
    },
    openDateSelect(type) {
      if (this.priview) {
        return;
      }
      // if(!this.form.trainingTime){
      //   return uni.showToast({title:"请先选择日期",icon:"none"})
      // }
      this.dateSelType = type;
      // this.dates = Number();
      this.dateSelectShow = true;
    },
    dateSelect(e) {
      //   this.dates = e.value;
      this.form.trainingTime = moment(e.value).format("YYYY-MM-DD");
      this.form.trainingStartTime = moment(e.value).format("HH:mm:ss");
      this.closeDateSelect();
      return;
      let dat = this.form.trainingTime + " ";
      let val = this.form.trainingTime + " " + e.value + ":00";
      if (this.dateSelType === 1) {
        if (
          this.form.trainingEndTime &&
          Date.parse(new Date(val)) + 60 * 30 * 1000 >
            Date.parse(new Date(dat + this.form.trainingEndTime))
        ) {
          return uni.showToast({
            title: "开始时间必须比结束时间早30分钟",
            icon: "none",
          });
        }
        this.form.trainingStartTime = e.value + ":00";
      } else if (this.dateSelType === 2) {
        if (
          this.form.trainingStartTime &&
          Date.parse(new Date(val)) <
            Date.parse(new Date(dat + this.form.trainingStartTime)) +
              60 * 30 * 1000
        ) {
          return uni.showToast({
            title: "结束时间必须比开始时间后30分钟",
            icon: "none",
          });
        }
        this.form.trainingEndTime = e.value + ":00";
      }
    },
    closeDateSelect() {
      this.dateSelectShow = false;
    },
    // openCal(type) {
    //   this.$refs.calendar.open();
    // },
    caleConfirm(e) {
      console.log(e);
      this.form.trainingTime = e.fulldate;
    },
    openPicker(type) {
      console.log(1, type);
      console.log(this.priview);
      if (this.priview) {
        return;
      }
      this.pickType = type;
      if (type === 1) {
        this.pickList = this.typeList;
      } else {
        this.pickList = this.unitList;
      }
      this.pickerShow = true;
    },
    pickerConfirm(e) {
      if (e.value.length) {
        if (this.pickType === 1) {
          this.form.speakerType = e.value[0].value;
          this.form.speakerTypeName = e.value[0].label;
        } else {
          this.form.fkCompanyId = e.value[0].value;
          this.form.speakerCompany = e.value[0].label;
        }
      }
      // this.ownerId = e.value[0].value;
      //   this.ownerName = e.value[0].label;
      this.pickerCancel();
    },
    pickerCancel() {
      this.pickerShow = false;
    },
    openPicker2() {
      if (this.priview) {
        return;
      }
      if (!this.form.trainingTime) {
        return uni.showToast({ title: "请先选择开始日期", icon: "none" });
      }
      this.pickerShow2 = true;
    },
    pickerConfirm2(e) {
      console.log(e);
      if (e.value.length && e.value[0]) {
        this.durTime = e.value[0].label;
        //  console.log(dat,this.form.trainingEndTime);
      }
      // this.ownerId = e.value[0].value;
      //   this.ownerName = e.value[0].label;
      this.pickerCancel2();
    },
    pickerCancel2() {
      this.pickerShow2 = false;
    },
    openPop() {
      if (this.priview) {
        return;
      }
      this.checkboxValue = [...this.form.teamIds];
      this.popShow = true;
    },
    searchBtn() {
      this.searchKey = this.inpKey;
      this.labourTeamSearch();
    },
    selectOk() {
      this.form.teamIds = [...this.checkboxValue];
      this.form.teamName = this.teamList.length
        ? this.teamList
            .filter((item) => this.checkboxValue.includes(item.pkId))
            .map((item) => item.teamName)
            .join(",")
        : "";
      console.log(this.checkboxValue);
      this.closePop();
    },
    closePop() {
      this.inpKey = "";
      this.searchKey = "";
      this.labourTeamSearch();
      this.popShow = false;
    },
    scanCode() {
      let that = this;
      let scanCodes = () => {
        uni.scanCode({
          scanType: ["qrCode"],
          success: (res) => {
            console.log(res.result);
            if (
              res.result.indexOf("/app/labourTrain/addTrainUserSign") !== -1
            ) {
              uni.showLoading({ mask: "" });
              // 签到
              uni
                .request({
                  url: res.result,
                  method: "post",
                  header: {
                    "Content-Type": "application/json;charset=utf-8",
                    Authorization: uni.getStorageSync("token"),
                  },
                })
                .then((data) => {
                  let [err, res] = data;
                  if (res) {
                    console.log(res);
                    if (res.statusCode === 500) {
                      uni.hideLoading();
                      uni.showToast({
                        icon: "error",
                        title: "系统内部错误",
                        duration: 2000,
                      });
                    }
                    if (res.data.code !== 200) {
                      uni.hideLoading();
                      uni.showToast({
                        title: res.data.msg ? res.data.msg : "系统内部错误",
                        icon: "none",
                        duration: 2000,
                      });
                      // uni.switchTab({ url: "/pages/index/index" });
                    } else {
                      uni.hideLoading();
                      uni.showToast({ title: "签到成功", icon: "success" });
                      that.searchTrainById(that.form.pkId);
                    }
                  }
                  if (err) {
                    uni.hideLoading();
                    uni.showToast({
                      icon: "error",
                      title: "网络错误",
                      duration: 2000,
                    });
                    reject(err);
                  }
                })
                .catch((error) => {
                  uni.hideLoading();
                  reject(error);
                });
            } else {
              uni.showToast({ icon: "error", title: "错误的二维码" });
            }
          },
          fail: (err) => {
            uni.showToast({
              icon: "error",
              title: "扫码失败",
              duration: 2000,
            });
          },
        });
      };
      // #ifdef APP-PLUS
      uni.getSystemInfo({
        success: (res) => {
          if (res.osName === "ios") {
            scanCodes();
            // let result = permision.judgeIosPermission('camera');
            // if(result){
            // 	scanCodes()
            // }else{
            //   uni.showModal({
            // 		title: '提示',
            // 		content: '需要相机权限才能进行下一步操作，是否打开？',
            // 		showCancel: true,
            // 		success: ({ confirm, cancel }) => {
            // 			if (confirm) {
            // 			console.log('用户点击确定');
            // 			permision.gotoAppPermissionSetting('camera')
            // 			} else if (cancel) {
            // 				console.log('用户点击取消');
            // 			}
            // 		}
            // 	})
            // }
          } else {
            permision
              .requestAndroidPermission("android.permission.CAMERA")
              .then((result) => {
                if (result === 1) {
                  scanCodes();
                } else {
                  uni.showModal({
                    title: "提示",
                    content: "需要相机权限才能进行下一步操作，是否打开？",
                    showCancel: true,
                    success: ({ confirm, cancel }) => {
                      if (confirm) {
                        console.log("用户点击确定");
                        permision.gotoAppPermissionSetting("camera");
                      } else if (cancel) {
                        console.log("用户点击取消");
                      }
                    },
                  });
                }
              });
          }
        },
      });
      // #endif
    },
    showCode() {
      this.options.url =
        request.baseUrl +
        "/app/labourTrain/addTrainUserSign?fkTrainId=" +
        this.form.pkId;
      this.codeShow = true;
    },
    closeCode() {
      this.codeShow = false;
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
.pad {
  height: 60rpx;
}
.pdb {
  height: 110rpx;
}
.content {
  // background-color: #fff;
  // padding: 0 20rpx;
  margin-top: 20px;
  .sign-in-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26rpx;
    background-color: #fff;
  }
  .sign-in-btns {
    display: flex;
    .sign-in-btn {
      padding: 10rpx 20rpx;
      background-color: #169bd5;
      color: #fff;
      font-size: 26rpx;
      border-radius: 10rpx;
    }
    .mr-20 {
      margin-right: 20rpx;
    }
  }
  .sign-in-list {
    .table_detail {
      max-height: calc(88vh - 180rpx);
    }
  }
}

.content-box {
  background-color: #fff;
}
.approve-files {
  display: flex;
  width: 100%;
  height: 80px;
  border-bottom: solid #ddd 1px;
  align-items: center;
  background-color: #fff;
  .approve-files-head {
    // display: flex;
    // justify-content: space-between;
    align-items: center;
    // height: 60rpx;
    display: flex;
    justify-content: space-between;
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
.intro {
  width: 100%;
  margin-top: 20rpx;
  background-color: #fff;
  height: 300px;
  overflow: auto;
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
    width: 250rpx;
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
  background-color: #fff;
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
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    padding: 0 20rpx;
    border-bottom: 1px solid #d7d7d7;
    .left {
      width: 460rpx;
      padding-left: 10rpx;
      border: 1px solid #d7d7d7;
    }
    .right {
      padding: 16rpx 30rpx;
      background-color: #169bd5;
      color: #fff;
      font-size: 28rpx;
      border-radius: 10rpx;
    }
  }
  .table_detail {
    max-height: calc(50vh - 90rpx);
    td:first-child,
    th:first-child {
      width: 50px;
    }
  }
  .u-checkbox {
    justify-content: center;
  }
}
.file-empty {
  font-size: 28rpx;
  color: #a1a0a0;
}
.parse {
  margin-left: 15px;
  font-size: 14px;
  font-weight: 500;

  color: rgba(32, 52, 87, 1);
}

.form-item {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: solid 1px #ddd;
}
.data-item {
  width: 96px;
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
  border-right: solid 1px #ddd;
  font-size: 14px;
  font-weight: 500;

  color: rgba(32, 52, 87, 1);
}
.ThemeTranslation {
  font-size: 20px;
  font-weight: 700;
  color: rgba(32, 52, 87, 1);
  border-bottom: solid 1px #ddd;
}
.ThemeTranslation-1 {
  display: flex;
  height: 50px;
  line-height: 50px;
  align-items: center;
  padding: 0 15px;
}
.data-item-input {
  flex: 1;
  display: flex;
  align-items: center;
  height: 80rpx;
  font-size: 28rpx;
  padding-left: 20px;
}
.placeholder{
  color: #ccc;
}
.data-item-input input {
  font-size: 14px;
  font-weight: 500;
  color: rgba(32, 52, 87, 1);
}

.attachment {
  width: 96px;
  border-right: solid 1px #ddd;
  height: 80px;
  line-height: 80px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(32, 52, 87, 1);
  text-align: left;
  padding: 0 15px;
}

.attachment-f {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
}
.intro-head {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0px;
  line-height: 40px;
  margin-left: 15px;
  color: rgba(32, 52, 87, 1);
}
.intro-Content {
  margin-left: 3px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(32, 52, 87, 1);
}
.Signin {
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  // background-color: #f90;
}
.Signin-1 {
  line-height: 20px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0px;
  line-height: 19.21px;
  color: rgba(32, 52, 87, 1);
  margin: 15px 0 5px 0;
}
.Signin-2 {
  font-size: 40px;
  font-weight: 700;
  letter-spacing: 0px;
  line-height: 40px;
  color: rgba(53, 106, 196, 1);
}
</style>
