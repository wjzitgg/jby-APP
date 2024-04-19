<!-- 编辑和新增流程 -->
<template>
  <view class="wrapper">
    <u-navbar
      :leftText="checkAccePTtype == 1 ? '新增施工验收' : '编辑施工验收'"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <!-- 第一步 -->
      <view v-show="step == 1">
        <view class="sticky">
          <view class="form-title">分项工程</view>
          <view
            class="select"
            :class="{ BGC: uniqueIdentification == '0' }"
            @click="showPicker"
          >
            <view class="name" v-if="nodeDetels.itemName">{{
              nodeDetels.itemName
            }}</view>
            <view class="name col" v-else>请选择分项工程</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
          <!-- 头部tabs -->
          <u-tabs
            :list="tabList"
            :current="current"
            @click="listSelet"
            class="bor-top"
            :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
          >
          </u-tabs>
        </view>
        <!-- 审批人 -->
        <view class="tab-item" v-show="current == 0">
          <setApprover
            :data="approvalData"
            type="1"
            :forbidden="false"
            @dataReturn="dataReturn"
            ref="rover"
            v-if="approvalData.workflowNodeDTOS.length > 0"
          >
          </setApprover>
          <!-- <setApprover :data="approvalData" type="1" :forbidden="false" @dataReturn="dataReturn" ref="rover"
						>
					</setApprover> -->
        </view>
        <!-- 关联资料 -->
        <view class="tab-item" v-if="current == 1">
          <!-- 表格 -->
          <uni-table border emptyText="暂无更多数据">
            <!-- 表头行 -->
            <uni-tr>
              <uni-th align="center" width="60">详情</uni-th>
              <uni-th align="center" width="80">流程节点</uni-th>
              <uni-th align="center" width="80">资料类型</uni-th>
              <uni-th align="center" width="80">资料名称</uni-th>
              <uni-th align="center" width="80">资料内容</uni-th>
            </uni-tr>
            <!-- 表格数据行 -->
            <uni-tr
              v-for="(item, index) in nodeDetels.engWorkflowNodePdfVos"
              :key="index"
            >
              <uni-td align="center" style="color: #02a7f0">
                <text @click="preview(item)">查看</text>
              </uni-td>
              <uni-td align="center">{{ item.nodeName }}</uni-td>
              <uni-td align="center">
                <view style="text-align: center" v-if="item.bookType == 0"
                  >技术规范</view
                >
                <view style="text-align: center" v-if="item.bookType == 1"
                  >安全规范</view
                >
                <view style="text-align: center" v-if="item.bookType == 2"
                  >验收标准</view
                >
              </uni-td>
              <uni-td align="center">{{ item.bookName }}</uni-td>
              <uni-td align="center">
                <span v-if="item.beginPage == item.endPage"
                  >资料第{{ item.beginPage }}页</span
                >
                <span v-else
                  >资料第{{ item.beginPage }}~{{ item.endPage }}页</span
                >
              </uni-td>
            </uni-tr>
          </uni-table>
        </view>
        <!-- 	<view>
					<view class="form-title">所属单位工程</view>
					<view class="select">
						<view class="name">{{ nodeDetels.oneParentName }}</view>
						<u-icon name="lock-fill" class="icons" color="#eee" size="14"></u-icon>
					</view>
				</view>
				<view>
					<view class="form-title">所属分部工程</view>
					<view class="select">
						<view class="name">{{ nodeDetels.secondParentName }}</view>
						<u-icon name="lock-fill" class="icons" color="#eee" size="14"></u-icon>
					</view>
					<u-datetime-picker :show="dateShow" v-model="value1" @cancel="dateShow = false" @confirm="dateSelect"
						mode="date"></u-datetime-picker>
				</view> -->
      </view>
      <!-- 下一步才展示 -->
      <view style="padding-top: 90rpx; position: relative" v-show="step == 2">
        <view class="sticky">
          <u-tabs
            :list="tabList2"
            :current="current2"
            @click="listSelet2"
            class="tabs"
            :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
          >
            <view slot="right" class="hamburg" @tap="hamburg"
              ><u-icon name="list" size="21" bold></u-icon>
            </view>
          </u-tabs>
        </view>
        <!-- tabs汉堡展开下拉 -->
        <view class="pull-down" v-show="show1">
          <text
            class="item-tab"
            :class="index == current ? 'action' : ''"
            v-for="(item, index) in tabList2"
            :key="index"
            @click="listSelet2(item, index)"
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
        <!-- 基础信息 -->
        <view class="" v-show="idx == 0">
          <view>
            <view class="form-title">流程名称</view>
            <view class="select">
              <u-input
                placeholder="请输入流程名称"
                disabled
                disabledColor="#e1e1e1"
                border="none"
                fontSize="14"
                v-model="nodeDetels.workflowName"
                customStyle=""
                class="form-content"
                clearable
              ></u-input>
              <u-icon
                name="lock-fill"
                class="icons"
                color="#eee"
                size="14"
              ></u-icon>
            </view>
          </view>
          <view>
            <view class="form-title">单位工程</view>
            <view class="select">
              <view class="name">{{ nodeDetels.oneParentName }}</view>
              <u-icon
                name="lock-fill"
                class="icons"
                color="#eee"
                size="14"
              ></u-icon>
            </view>
          </view>
          <view>
            <view class="form-title">分部工程</view>
            <view class="select">
              <view class="name">{{ nodeDetels.secondParentName }}</view>
              <u-icon
                name="lock-fill"
                class="icons"
                color="#eee"
                size="14"
              ></u-icon>
            </view>
            <u-datetime-picker
              :show="dateShow"
              v-model="value1"
              @cancel="dateShow = false"
              @confirm="dateSelect"
              mode="date"
            ></u-datetime-picker>
          </view>
          <view>
            <view class="form-title">分项工程</view>
            <view class="select">
              <view class="name">{{ nodeDetels.itemName }}</view>
            </view>
          </view>
          <!-- <view>
						<view class="form-title">下一节点</view>
						<view class="select">
							<view class="name">{{ nodeDetels.roleName }}</view>
							<u-icon name="lock-fill" class="icons" color="#eee" size="14"></u-icon>
						</view>
					</view> -->
          <!-- getWorkflowDetail -->
          <!-- <view>
					<view>
						<view class="form-title">负责人</view>
						<view class="select" @click="show = true">
							<view class="name">{{ nodeDetels.approver }}</view>
							<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
						</view>
						<u-picker :show="show" :columns="principal" keyName="userName" @cancel="close" @confirm="confirm"></u-picker>
					</view> -->
          <!-- 类型做出对应的判断 -->
          <view v-if="itemType > 0">
            <view>
              <view class="form-title" v-if="itemType == 2">剩余进尺</view>
              <view class="form-title" v-else>剩余最大填高</view>
              <view class="select">
                <u-input
                  placeholder="请输入"
                  type="digit"
                  border="none"
                  disabledColor="#fff"
                  :disabled="itemType == 2 || surplusType"
                  @input="surplusMaxInput"
                  fontSize="14"
                  v-model="nodeDetels.surplusMax"
                  class="form-content"
                >
                  <template slot="suffix">
                    <text>米</text>
                  </template>
                </u-input>
                <u-icon
                  name="lock-fill"
                  class="icons"
                  color="#eee"
                  size="14"
                  v-if="itemType == 2"
                ></u-icon>
              </view>
            </view>
            <view v-if="itemType === 1">
              <view class="form-title">{{
                itemType > 0 ? "本次填高" : "完成量"
              }}</view>
              <view class="select">
                <u-input
                  placeholder="请输入"
                  type="digit"
                  border="none"
                  fontSize="14"
                  v-model="nodeDetels.programOutput"
                  class="form-content"
                  @input="programOutputInput"
                >
                  <template slot="suffix">
                    <text>米</text>
                  </template>
                </u-input>
              </view>
            </view>
            <view>
              <view class="form-title" v-if="itemType == 2">施工进尺</view>
              <view class="form-title" v-else>施工后剩余填高</view>
              <view class="select">
                <u-input
                  placeholder="请输入"
                  type="digit"
                  border="none"
                  fontSize="14"
                  disabledColor="#fff"
                  :disabled="itemType == 1"
                  v-model="nodeDetels.footage2"
                  class="form-content"
                  @input="input2"
                >
                  <template slot="suffix">
                    <text>米</text>
                  </template>
                </u-input>
                <u-icon
                  name="lock-fill"
                  class="icons"
                  color="#eee"
                  size="14"
                  v-if="itemType == 1"
                ></u-icon>
              </view>
            </view>
            <view v-if="itemType == 2">
              <view class="form-title">施工后剩余进尺</view>
              <view class="select">
                {{ nodeDetels.surplusMax - nodeDetels.footage2 }}
              </view>
            </view>
            <view :key="keys">
              <view class="form-title">完成分项工程</view>
              <view class="select">
                {{ nodeDetels.completeItemName }}
              </view>
            </view>
          </view>

          <view>
            <view class="form-title">附件</view>
            <view class="form-content2">
              <view class="fileList" v-if="!!fileList.length">
                <view
                  class="fileList-item"
                  v-for="(item, index) in fileList"
                  :key="item.id"
                >
                  <view class="left" @click="preview(item)">
                    <u-icon class="icons" name="file-text" size="24"></u-icon>
                    <view class="fileName text-hidden">{{
                      item.fileName
                    }}</view>
                  </view>
                  <view class="file-closeBtn" @click="delFile(item, index)"
                    >X</view
                  >
                </view>
              </view>
              <!-- 	<lsj-upload v-show="!showPickerShow" class="lsj-upload1" ref="lsjUpload1" childId="upload2"
								:option="option" :size="size" :formats="formats" :debug="debug" :count="10" :nowCount="fileList.length"
								:instantly="instantly" style="margin-top: 10px; padding-left: 15px" @change.stop="onChange"
								@progress.stop="onprogress" @uploadEnd.stop="onuploadEnd">
								<view class="upload-btn">上传附件</view>
							</lsj-upload> -->
              <!-- form-content -->
              <!-- <view class="form-content"> -->
              <lsj-upload
                ref="lsjUpload1"
                childId="lsj-upload1"
                :option="option"
                :size="size"
                :formats="formats"
                :debug="debug"
                :count="10"
                :nowCount="fileList.length"
                :instantly="instantly"
                @change="onChange"
                @progress="onprogress"
                @uploadEnd="onuploadEnd"
              >
                <view class="upload-btn">上传附件</view>
              </lsj-upload>
              <!-- </view> -->
            </view>
          </view>
        </view>
        <view v-show="idx == 1">
          <processForm
            :tableData="workflowTableList"
            :tableIndex="tableIndex"
            :disabled="true"
            @sendGzipTableHtml="getGzipTableHtml"
            ref="formHtml"
          ></processForm>
        </view>
      </view>
      <!-- ======================== -->
      <view
        class="popup-footer"
        style="justify-content: space-between; width: 100%"
        v-if="step == 1"
      >
        <view class="btns"
          ><u-button
            class="btn-iem"
            type="primary"
            text="下一步"
            @click="nextStep"
            size="large"
          ></u-button>
        </view>
      </view>
      <view
        class="popup-footer"
        style="justify-content: space-between; width: 100%"
        v-if="step == 2"
      >
        <view class="btns">
          <u-button
            class="btn-iem"
            type="warning"
            text="上一步"
            @click="lastStep"
            size="large"
          ></u-button>
        </view>
        <view class="btns"
          ><u-button
            iconColor="#333333"
            :plain="true"
            text="保存草稿"
            size="large"
            @click="examine(0)"
          ></u-button
        ></view>
        <view class="btns" v-show="!stats"
          ><u-button
            class="btn-iem"
            type="primary"
            text="发起流程"
            @click="sendApprove"
            size="large"
          ></u-button>
        </view>
        <view class="btns" v-show="stats"
          ><u-button
            class="btn-iem"
            type="primary"
            text="签名"
            @click="appShow = true"
            size="large"
          ></u-button>
        </view>
      </view>
    </view>
    <tki-tree
      ref="tkitree"
      class="tki-tree"
      :range="listData"
      :rangeKey="rangeKey"
      @click.stop="clickMsg"
      confirmColor="#4e8af7"
      @cancel="sPickerShow"
      @confirm="treeConfirm"
    />
    <!-- 预览 -->
    <u-popup
      :show="previewShow"
      mode="center"
      round="10"
      closeable
      @close="closePreview"
    >
      <view class="preview">
        <view class="preview-top"></view>
        <pdf
          :fileUrl="previewUrl"
          :iframeStyle="{ width: '700rpx', height: '1080rpx' }"
          :imgs="false"
        ></pdf>
      </view>
    </u-popup>
    <addPopup :app-show="appShow" @close="closeApp" @submit="submit" @signUrlImg="signUrlImg" :app-title="'签名'" @getSign="getSign" ref="addPopup" :tableData="workflowTableList" :roleId="approvalData.workflowNodeDTOS.length?approvalData.workflowNodeDTOS[1].baseSubWorkflow.workflowNodeDTOS[1].fkRoleId:''"  :sysRoleId="approvalData.workflowNodeDTOS.length?approvalData.workflowNodeDTOS[1].baseSubWorkflow.workflowNodeDTOS[1].sysRoleId:''"></addPopup>
  </view>
</template>

<script>
import moment from "moment";
import request from "@/common/request";
import tkiTree from "@/components/tki-tree/tki-tree.vue";
import { data } from "uview-ui/libs/mixin/mixin";
import pdf from "@/components/pdf-preview.vue";
import setApprover from "@/components/set-approver/set-approver.vue";
import { number } from "echarts/lib/export";
import processForm from "../../components/process-form/process-form.vue"; // 表格展示组件
import addPopup from '../../components/approve-popup/add-popup.vue';
export default {
  components: { tkiTree, pdf, setApprover, processForm,addPopup },
  data() {
    return {
      itemId: "",
      step: 1,
      tabList: [
        {
          name: "审批人",
          idx: 0,
        },
        {
          name: "关联资料",
          idx: 1,
        },
      ],
      tabList2: [
        {
          name: "基础信息",
          idx: 0,
        },
      ],
      show1: false,
      current: 0,
      current2: 0,
      rangeKey: "itemName",
      listData: [],
      nodeDetels: {
        workflowName: "",
        itemName: "", // 分项工程
        oneParentName: "", // 所属单位工程
        secondParentName: "", // 分部
        roleName: "", // 下一节点
        approver: "", // 负责人
        fkApproverId: "", // 审批人id，
        surplusMax: "", //剩余进尺
        footage2: "", //施工进尺 施工设计面最大填高
        programOutput: "", // 完成量
      },
      itemType: 0,
      principal: [], // 负责人
      radiolist: [
        {
          name: "允许",
          disabled: false,
          id: "1",
        },
        {
          name: "不允许",
          disabled: false,
          id: "2",
        },
      ],
      show: false,
      receivingType: {},
      dateShow: false,
      value1: Number(new Date()),
      presentationTime: "",
      // ===============附件=================
      fileList: [],
      appShow: false,
      selecValue: "",
      clickCheck: false,
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
      previewShow: false,
      previewUrl: "",
      subentryId: "", // 分项id
      nodeData: {}, // 用来确定后把数据带回上个界面变量
      timeout: null,
      showPickerShow: false,
      idx: 0,
      tableIndex: 0,
      itemArray: [],
      uniqueIdentification: 0,
      approverList: [],
      approvalData: {
        workflowNodeDTOS: [],
      }, //审批人
      workflowTableList: [],
      tableHtml: [],
      editNum: "", // 用来判断新增还是保存
      currentPrecessId: "", //工序ID
      checkAccePTtype: "1",
      detailsData: {},
      surplusType: false,
      keys:false,
      stats:false,
      signUrl:"",
      appShow: false,
      // ===============附件=================
    };
  },
  computed: {
		user() {
			return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
		},
	},
  onLoad(option) {
    this.uniqueIdentification = option.uniqueIdentification;
    this.itemId = option.id;
    if (option.id != undefined) {
      this.checkAccePTtype = "2";
      this.getData(option.id);
    } else {
      this.checkAccePTtype = "1";
    }
    this.searchItemsIgnore();
    // this.nodeDetels = JSON.parse(item.row);
    // this.init()
  },
  methods: {
    sendApprove(){
      if(this.approverList.launchType==2){
        this.$refs.addPopup.submit()
      }else{
        this.examine(1)
      }
    },
    closeApp(){
      this.appShow = false
    },
    submit(e){
      console.log('sumit方法',e);
      if(e){
        this.examine(1,e)
      }else{
        this.examine(1)
        // this.stats = false
      }
    },
    signUrlImg(e) {
        this.signUrl= e
				this.workflowTableList.forEach(item => {
          if (item.tableHtml instanceof Array) {} else {
            item.tableHtml = this.utils.unzip(item.tableHtml);
            if (item.tableHtml instanceof Array) {} else {
              item.tableHtml = JSON.parse(item.tableHtml);
            }
					}
				});
				if (this.workflowTableList.length > 0) {
					this.workflowTableList.forEach(item => {
						if (item.tableHtml != undefined && item.tableHtml != null && item.tableHtml.length != 0) {
							item.tableHtml.forEach(items => {
								items.arr.forEach(i => {
									if (i.attributeTypes == 3) {
										if ([this.approvalData.workflowNodeDTOS[1].baseSubWorkflow.workflowNodeDTOS[1].fkRoleId,this.approvalData.workflowNodeDTOS[1].baseSubWorkflow.workflowNodeDTOS[1].sysRoleId].includes(i.signatureDate.signer)) {
											i.signatureDate.img = e;
										}
									}
								});
							});
						}
					});
					console.log("xxxxxxxxxxxxxxxxxxxxx111xxxxxxxxxx")
					console.log(this.tableHtml)
					console.log("xxxxxxxxxxxxxxxxxxxx111xxxxxxxxxxx")
					this.tableHtml.forEach(item => {
            if (item.tableHtml instanceof Array) {
              item.tableHtml = JSON.stringify(item.tableHtml);
						  item.tableHtml = this.utils.zip(JSON.stringify(item.tableHtml));
            } else {
					  }
					});
				}
			},
    getSign(e){
      console.log('获取的',e);
      this.stats = e
    },
    // 获取数据
    getData(id) {
      uni.showLoading({
        mask: true,
      });
      this.$api.getConstruction({ approveId: id, type: 1 }).then((res) => {
        console.log("res.data.threeItemId -----> ", res.data.threeItemId);
        this.getProcessData(res.data.threeItemId);
        uni.hideLoading();
        this.detailsData = res.data;

        if (res.code == 200) {
          // this.getProcessData(res.data.prodItemList[0].pkId);
          this.nodeDetels.itemName = res.data.itemNames;
          this.subentryId = res.data.threeItemId; //分项id
          this.pkIdItem = res.data.pkId;
          this.itemType = res.data.itemType;
          this.nodeDetels.footage2 = res.data.distanceSurface;
          this.nodeDetels.programOutput = res.data.currentFillHeight;
          // debugger
          this.nodeDetels.surplusMax = res.data.fillHeight;
          console.log("Xxxxxxxxxx");
          console.log(this.nodeDetels.surplusMax);
          console.log(res.data);
          console.log("Xxxxxxxxxx");
          if (
            res.data.fileList == undefined ||
            res.data.fileList == null ||
            res.data.fileList.length == 0
          ) {
            this.fileList = [];
          } else {
            this.fileList = res.data.fileList[0].prodReProcessFileList;
          }

          this.detailsData = res.data;
          this.getProcessData(res.data.threeItemId);

          //
          // this.approverSetting()
          // this.nodeDetels.workflowName = res.data.processName
          // this.nodeDetels.itemName = res.data.reItemApproveDtoList[0].itemName
          // this.nodeDetels.itemName = res.data.itemNames
          // this.approvalData =

          // 		this.approvalData.workflowNodeDTOS.forEach(item => {
          // 	if (item.nodeType == 3) {
          // 		item.baseSubWorkflow.workflowNodeDTOS.forEach(element => {
          // 			if (element.nodeType == 2 && element.prodSysRoleVo.selectedUserId != "" && element
          // 				.quantitiesTable == 1) {
          // 				return quantitiesTable = true;
          // 			}
          // 		});
          // 	}
          // });
          // res.data.prodItemList[0]
          // console.log(res.data)
          // this.showData = res.data;
          // this.scoreFlag = !!res.data.scoreFlag;
          // this.workflowTableList = this.showData.workflowTableList ? this.showData.workflowTableList : [];
          // if (this.workflowTableList.length) {
          // 	let tableArr = this.workflowTableList.map((item, index) => ({
          // 		name: item.tableName,
          // 		idx: 1,
          // 		tableInd: index
          // 	}));
          // 	this.tabList.splice(1, 0, ...tableArr);
          // }
        }
      });
    },
    // tab点击
    listSelet2(item, index) {
      console.log(item);
      // 展开传值
      if (index !== undefined) {
        this.current2 = index;
      } else {
        this.current2 = item.index;
      }
      this.show1 = false;
      this.idx = item.idx;
      if (item.idx === 1) {
        this.tableIndex = item.tableInd;
      }
    },
    // 汉堡点击展开tabs
    hamburg() {
      this.show1 = true;
    },
    shut() {
      this.show1 = false;
    },
    // 获取表格压缩后的数据
    getGzipTableHtml(tabledata) {
      this.tableHtml = tabledata;
      console.log("压缩后的表", this.tableHtml);
    },
    // dataReturn(arr) {}
    // 新增编辑下一步
    nextStep() {
      // console.log('this.$refs.rover.approverList -----> ', this.$refs.rover.approverList);
      if (this.subentryId == "") {
        return uni.showToast({
          title: "请先选择分项工程",
          icon: "none",
        });
      }
      // 获取审批人改动的数据
      this.approvalData = this.$refs.rover.approverList;
      console.log(this.approvalData);
      let materialUsedTable = false; // 判断节点是否有材料用量
      let quantitiesTable = false; // 判断节点是否有工程量
      this.approvalData.workflowNodeDTOS.forEach((item) => {
        if (item.nodeType == 3) {
          item.baseSubWorkflow.workflowNodeDTOS.forEach((element) => {
            console.log(element);
            if (
              element.nodeType == 2 &&
              element.prodSysRoleVo.selectedUserId != "" &&
              element.materialUsedTable == 1
            ) {
              console.log("有一个选了节点材料用量", element);
              return (materialUsedTable = true);
            }
          });
        }
      });
      // 获取工序ID
      this.currentPrecessId = "";
      const arr = this.approvalData.workflowNodeDTOS; // 这是审批人
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].nodeType == 3) {
          for (
            let j = 0;
            j < arr[i].baseSubWorkflow.workflowNodeDTOS.length;
            j++
          ) {
            // 判断是否选了人
            if (
              arr[i].baseSubWorkflow.workflowNodeDTOS[j].nodeType == 2 &&
              arr[i].baseSubWorkflow.workflowNodeDTOS[j].prodSysRoleVo
                .selectedUserId != ""
            ) {
              this.currentPrecessId =
                arr[i].baseSubWorkflow.workflowNodeDTOS[
                  j
                ].prodSysRoleVo.currentPrecessId;
              break;
            } else {
              this.currentPrecessId = "";
            }
          }
          if (this.currentPrecessId != "") {
            break;
          }
        }
      }
      // 根据获取到工序ID判断是否设置了审批人
      if (this.currentPrecessId == "") {
        return uni.showToast({
          title: "请选择节点审批人员",
          icon: "none",
        });
      }
      if (!materialUsedTable) {
        console.log("materialUsedTable:", materialUsedTable);
        return uni.showToast({
          title: "请先设置节点材料用量",
          icon: "none",
        });
      }
      this.approvalData.workflowNodeDTOS.forEach((item) => {
        if (item.nodeType == 3) {
          item.baseSubWorkflow.workflowNodeDTOS.forEach((element) => {
            if (
              element.nodeType == 2 &&
              element.prodSysRoleVo.selectedUserId != "" &&
              element.quantitiesTable == 1
            ) {
              return (quantitiesTable = true);
            }
          });
        }
      });
      if (!quantitiesTable) {
        console.log("quantitiesTable:", quantitiesTable);
        return uni.showToast({
          title: "请先设置节点工程量",
          icon: "none",
        });
      }

      // 编辑的时候控制不去调接口污染表格原始数据
      // if (this.editNum == 1 && this.currentPrecessId == this.currentPrecessId2) {
      // 	this.step = 2;
      // 	return;
      // }
      // this.titles = "第二步：填写信息";
      // 第二步获取表格
      this.getWorkflowTables();
    },
    // 根据工程id和工序id获取表格
    getWorkflowTables() {
      this.loading = true;
      this.$api
        .getWorkflowTables({ itemIdList: this.subentryId })
        .then((res) => {
          if (res.code === 200) {
            this.workflowTableList = res.data;
            if (this.workflowTableList.length) {
              let tableArr = this.workflowTableList.map((item, index) => ({
                name: item.tableName,
                idx: 1,
                tableInd: index,
              }));
              this.tabList2.splice(1, 0, ...tableArr);
            }
            console.log(this.workflowTableList);
            if(this.approvalData.launchType==2){
              this.$refs.addPopup.getApproveStatus()
            }
            this.step = 2;
          } else {
            uni.showToast({
              title: res.msg,
              icon: "error",
            });
          }
          this.loading = false;
        });
    },
    // 审批人
    dataReturn(arr) {
      console.log(arr);
      this.approvalData.workflowNodeDTOS = arr;
    },
    // tab点击
    listSelet(e) {
      this.current = e.idx;
    },
    prevDateFun(obj) {
      console.log(obj, "B页面返回过来的");
      this.approverList = obj;
    },
    setApprover() {
      if (
        this.nodeDetels.itemName == undefined ||
        this.nodeDetels.itemName == ""
      ) {
        return console.log("1111111");
      }
      // getWorkflowDetail
      console.log(this.nodeDetels);
      // return console.log(this.nodeDetels)
      let data = {
        // itemIdStrList:	this.itemArray.join(","),
        itemIdStrList: this.subentryId,
        // pkId:this.nodeDetels.pkId
      };
      this.$api.getWorkflowDetail(data).then((res) => {
        if (res.code == 200) {
          if (res.data.workflowNodeDTOS.length) {
            res.data.workflowNodeDTOS.forEach((item) => {
              if (item.nodeType == 3) {
                item.baseSubWorkflow.workflowNodeDTOS.forEach((itemArray) => {
                  if (itemArray.nodeType == 2) {
                    // itemArray.prodSysRoleVo.selectedUserId = itemArray.prodSysRoleVo.selectedUserId ==unll?"":itemArray.prodSysRoleVo.selectedUserId;
                    // itemArray.prodSysRoleVo.selectedUserId = ""
                    itemArray.prodSysRoleVo.selectedUserName =
                      itemArray.prodSysRoleVo.selectedUserId;
                    if (itemArray.prodSysRoleVo.sysUserList.length) {
                      itemArray.prodSysRoleVo.sysUserList.forEach((e) => {
                        e.label = e.userName;
                        e.value = e.pkId;
                        if (
                          itemArray.prodSysRoleVo.selectedUserName == e.pkId
                        ) {
                          itemArray.prodSysRoleVo.selectedUserName = e.userName;
                        }
                      });
                    }
                  }
                });
              }
            });
          }
          // pages/production/components/set-approver
          // this.approverList = res.data
          uni.navigateTo({
            url:
              "/pages/production/components/set-approver?row=" +
              JSON.stringify(res.data),
          });
        } else {
          uni.showToast({
            title: res.msg,
            icon: "error",
          });
        }
      });
      console.log("xxxxxxxxxxx");
    },
    clickMsg() {},
    clickMsg() {},
    // 预览
    preview(item) {
      console.log(66, item);
      this.$checkName(item.fileUrl);
      return;
      this.previewUrl = item.fileUrl;
      this.previewShow = true;
    },
    closePreview() {
      this.previewShow = false;
      this.previewUrl = "";
    },
    delFile(row, index) {
      this.fileList = this.fileList.filter((item) => item.id !== row.id);
      this.$refs.lsjUpload1.clear(row.fileName);
    },
    delFile(row, index) {
      this.fileList = this.fileList.filter((item) => item.id !== row.id);
      this.$refs.lsjUpload1.clear(row.fileName);
    },
    onChange(e) {
      console.log("改变事件", e);
    },
    onprogress(e) {
      console.log("中途事件", e);
    },
    onuploadEnd(e) {
      console.log("结束事件", e);
      console.log(this.$refs.lsjUpload1.files);
      if (e.responseText) {
        let res = JSON.parse(e.responseText);
        if (res.code === 200) {
          this.fileList.push({
            id: this.fileList.length
              ? this.fileList[this.fileList.length - 1].id + 1
              : 1,
            fileName: e.name,
            fileUrl: res.data,
          });
        }
      }
    },
    // 隧道输入
    input2(val) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        let res = Number(val);
        let res2 = Number(this.nodeDetels.surplusMax);
        if (this.itemType == 2 && res > res2) {
          this.nodeDetels.footage2 = "";
        }
        let data = {
               itemName:this.nodeDetels.itemName,
               distanceSurface:!!this.nodeDetels.footage2?this.nodeDetels.footage2:0,
            }
            this.$api.searchCompleteItemName(data).then(res=>{
              if(res.code==200){
                this.nodeDetels.completeItemName = res.data
                this.keys = !this.keys
              }
            })
      }, 500);
    },
    // 路基输入
    programOutputInput(val) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        let val1 = Number(val);
        let val2 = Number(this.nodeDetels.surplusMax);
        console.log(val1);
        if (val1 > val2) {
          this.nodeDetels.programOutput = "";
          this.nodeDetels.footage2 = this.nodeDetels.surplusMax.toFixed(3);
          return;
        }
        this.nodeDetels.footage2 = (this.nodeDetels.surplusMax - val1).toFixed(
          3
        );
      }, 500);
    },
    surplusMaxInput() {
      // console.log(this.itemType)
      if (this.surplusType) {
        return;
      }
      this.nodeDetels.footage2 =
        this.nodeDetels.surplusMax - this.nodeDetels.programOutput;
      // nodeDetels.programOutput
    },
    // 分项树形选择
    treeConfirm(data) {
      console.log(data);
      this.itemType = data[0].itemType; // 0 通用类型  1 路基土  2隧道
      this.subentryId = data[0].pkId; //分项id
      // 获取流程数据
      this.getProcessData(this.subentryId);
      this.sPickerShow();
    },
    // 获取分项工程树形
    searchItemsIgnore() {
      let data = {
        ids: [],
      };
      this.$api.searchItemsIgnore(data).then((res) => {
        if (res.code === 200) {
          this.listData = res.data;
        } else {
          uni.showToast({
            title: res.msg,
            icon: "error",
          });
        }
      });
    },
    // 根据分项id获取流程数据
    getProcessData(id) {
      // return console.log(id)
      uni.showLoading({
        title: "加载中",
      });

      this.$api.getProcessData({ itemStrIds: id }).then((res) => {
        if (res.code === 200) {
          // 获取审批人
          this.approverSetting();
          this.nodeDetels.pkId = res.data.pkId; // 节点返回的信息
          this.nodeDetels.workflowName = res.data.workflowName;
          this.nodeDetels.itemName = res.data.itemName;
          this.nodeDetels.oneParentName = res.data.oneParentName;
          this.nodeDetels.secondParentName = res.data.secondParentName;
          if (
            this.nodeDetels.surplusMax == undefined ||
            this.nodeDetels.surplusMax == null ||
            this.nodeDetels.surplusMax.length == 0
          ) {
            this.nodeDetels.surplusMax = res.data.surplusMax;
          }

          if (
            res.data.surplusMax == undefined ||
            res.data.surplusMax == null ||
            res.data.surplusMax.length
          ) {
            this.surplusType = false;
          } else {
            this.surplusType = true;
          }
          this.nodeDetels.engWorkflowNodePdfVos =
            res.data.engWorkflowNodePdfVos;
          this.nodeDetels.engWorkflowNodePdfVos.forEach((item) => {
            item.fileUrl = item.bookUrl;
          });
          // completeItemName
          // this.nodeDetels.roleName = res.data.baseSysRole.roleName; // 下一节点workflowName
          this.nodeDetels.completeItemName = res.data.completeItemName;
          let arr =
            res.data.baseSysRole && res.data.baseSysRole.sysUserList.length
              ? res.data.baseSysRole.sysUserList
              : []; // 负责人
          //  = res.data
          this.itemArray = [];
          if (
            res.data.items != undefined &&
            res.data.items != null &&
            res.data.items.length != 0
          ) {
            res.data.items.forEach((item) => {
              this.itemArray.push(item.pkId);
            });
          }
          this.$set(this.principal, 0, arr);
          if(this.itemType==2){
            this.input2(this.nodeDetels.footage2)
          }
          console.log(this.principal);
          uni.hideLoading();
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    // 获取审批人
    approverSetting() {
      const data = {
        itemIdStrList: this.subentryId,
      };
      // 编辑的时候
      if (this.checkAccePTtype == 2) {
        data.pkId = this.pkIdItem;
      }
      this.$api.getWorkflowDetail(data).then((res) => {
        if (res.code == 200) {
          res.data.workflowNodeDTOS.forEach((item) => {
            if (item.nodeType == 3) {
              item.baseSubWorkflow.workflowNodeDTOS.forEach((items) => {
                if (items.nodeType == 2) {
                  items.prodSysRoleVo.selectedUserId =
                    items.prodSysRoleVo.selectedUserId == null
                      ? ""
                      : items.prodSysRoleVo.selectedUserId;
                }
              });
            }
          });
          this.approvalData = res.data; // 获取审批人
          console.log(" res.data -----> ", res.data);
          console.log(this.approvalData.workflowNodeDTOS);
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    // 显示选择器
    showPicker() {
      console.log(
        "this.uniqueIdentification -----> ",
        this.uniqueIdentification
      );
      if (this.uniqueIdentification !== "0") {
        this.showPickerShow = true;
        this.$refs.tkitree._show();
      }
    },
    cancel() {
      this.sPickerShow();
    },
    sPickerShow() {
      this.showPickerShow = false;
    },
    //监听选择（ids为数组）
    selectChange(ids, names) {
      console.log(ids, names);
    },
    // ===========
    close() {
      this.show = false;
    },
    dateSelect(e) {
      this.presentationTime = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
      this.dateShow = false;
    },
    // 选择负责人
    confirm(val) {
      console.log(val);
      this.nodeDetels.approver = val.value[0].userName;
      this.nodeDetels.fkApproverId = val.value[0].pkId;
      this.show = false;
    },
    lastStep() {
      this.step = 1;
      // 临时方案
      this.workflowTableList = [];
      this.tableHtml = [];
    },
    examine(num,getDatas) {
      console.log("确认",getDatas);
      // 路基
      if (this.itemType == 1) {
        if (
          this.nodeDetels.surplusMax == "" ||
          this.nodeDetels.surplusMax == null
        ) {
          return uni.showToast({
            title: "剩余最大填高不能小于0米",
            icon: "none",
            duration: 1500,
          });
        }
        if (
          this.nodeDetels.programOutput == "" ||
          this.nodeDetels.programOutput == null
        ) {
          return uni.showToast({ title: "完成量不能小于0米", icon: "none" });
        }
        if (this.nodeDetels.programOutput == 0) {
          return uni.showToast({ title: "本次填高不能小于0米", icon: "none" });
        }
      }
      // 隧道
      if (this.itemType == 2) {
        if (
          this.nodeDetels.surplusMax == "" ||
          this.nodeDetels.surplusMax == null
        ) {
          return uni.showToast({ title: "剩余进尺不能小于0米", icon: "none" });
        }
        if (
          this.nodeDetels.footage2 == "" ||
          this.nodeDetels.footage2 == null
        ) {
          return uni.showToast({ title: "施工进尺不能小于0米", icon: "none" });
        }
      }
      this.nodeDetels.fileList = this.fileList;
      this.nodeDetels.itemType = this.itemType;
      this.nodeDetels.subentryId = this.subentryId;
      this.accraditation(num,getDatas);
    },
    // 审批
    accraditation(num,getDatas) {
      // getDatas为获取的唯一id
      uni.showLoading({
        mask: true,
      });
      let nodeArr = [
        {
          fkItemId: this.subentryId,
          itemName: this.itemType==2?this.nodeDetels.completeItemName:this.nodeDetels.itemName,
        },
      ];
      const prodWorkflowUserAdds = [];
      this.approvalData.workflowNodeDTOS.forEach((item) => {
        if (item.nodeType == 3) {
          item.baseSubWorkflow.workflowNodeDTOS.forEach((e) => {
            if (e.nodeType == 2) {
              prodWorkflowUserAdds.push({
                bizType: 0,
                fkRoleId: e.fkRoleId,
                currentNodeId: e.pkId,
                currentPrecessId: item.pkId,
                fkApproverId: e.prodSysRoleVo.selectedUserId,
                // sortval:
              });
            }
          });
        }
      });
      prodWorkflowUserAdds.forEach((item, index) => {
        item.sortval = index + 1;
      });
      // params.prodWorkflowUserAdds = prodWorkflowUserAdds;
      // this.getGzipTableHtml();
      this.$refs.formHtml.gzipTable(); // 获取压缩后的表格
      // return;
      let params = {
        approveStatus: num, // 审核状态：0：草稿，1：发起审批
        itemType: this.nodeDetels.itemType, // 分项类型，0：通用类型 1：路基土
        reItemApproveDTOS: nodeArr,
        prodReProcessFileList: this.fileList.filter((item) => item.fileUrl), // 附件列表
        prodWorkflowUserAdds: prodWorkflowUserAdds,
        workflowTableList: this.tableHtml,
      };
      params.signUrl = this.signUrl
      if (params.itemType == 1 || params.itemType == 2) {
        params.fillHeight = this.nodeDetels.surplusMax;
        params.distanceSurface = this.nodeDetels.footage2; // 施工面距设计面距离/施工进尺
        // data. = this.nodeData.completeItemName;
        // data.reItemApproveDTOS.foreach(item=>{
        // 	item.itemName= this.nodeData.completeItemName;
        // })
        // for (let e = 0; e < data.reItemApproveDTOS.length; e++) {
        // 	data.reItemApproveDTOS[e].itemName = this.nodeData.completeItemName;
        // }
      }
      if(getDatas){
        params.unique=getDatas.unique
      }
      console.log(params);
      // return console.log(params);
      if (this.checkAccePTtype == 1) {
        this.$api
          .addprocess(params)
          .then((res) => {
            uni.hideLoading();
            if (res.code === 200) {
              if (num == 0) {
                uni.showToast({
                  title: "保存草稿成功",
                  icon: "success",
                  mask: true,
                });
              } else {
                uni.showToast({
                  title: "发起审批成功",
                  icon: "success",
                  mask: true,
                });
              }

              setTimeout(() => {
                // uni.reLaunch({
                // 	url: "/pages/production/deliveryReceiving"
                // });
                let pages = getCurrentPages();
                let prevPage = pages[pages.length - 2]; // 上一页面实例
                prevPage.$vm.resh(); // 调用上一页 定义的方法
                uni.navigateBack({ delta: 1 });
              }, 1000);
            } else {
              uni.showToast({
                title: res.msg,
                icon: "none",
                mask: true,
                duration: 3000,
              });
            }
          })
          .catch((err) => {
            uni.showToast({
              title: err,
              icon: "error",
            });
            uni.hideLoading();
          });
      } else {
        console.log("this.detailsData.pkId -----> ", this.detailsData.pkId);
        params.pkId = this.detailsData.pkId;
        this.$api
          .updateProcess(params)
          .then((res) => {
            uni.hideLoading();
            if (res.code === 200) {
              if (num == 0) {
                uni.showToast({
                  title: "保存草稿成功",
                  icon: "success",
                  mask: true,
                });
              } else {
                uni.showToast({
                  title: "发起审批成功",
                  icon: "success",
                  mask: true,
                });
              }

              setTimeout(() => {
                // uni.reLaunch({
                // 	url: "/pages/production/deliveryReceiving"
                // });
                let pages = getCurrentPages();
                let prevPage = pages[pages.length - 3]; // 上一页面实例
                prevPage.$vm.resh(); // 调用上一页 定义的方法
                uni.navigateBack({ delta: 2 });
              }, 1000);
            } else {
              uni.showToast({
                title: res.msg,
                icon: "none",
                mask: true,
                duration: 3000,
              });
            }
          })
          .catch((err) => {
            uni.showToast({
              title: err,
              icon: "error",
            });
            uni.hideLoading();
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding-bottom: 120rpx;
}

.form-title {
  margin-left: 24rpx;
  font-size: 28rpx;
  line-height: 50rpx;
  margin-top: 30rpx;
}

.form-content {
  height: 80rpx;
  background: #fff;
}

.form-content2 {
  background-color: #fff;
  // padding: 16rpx 0;
  padding-top: 10rpx;
}

.select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 24rpx;
  background-color: #fff;
  font-size: 24rpx;
}

.name {
  width: 520rpx;
  // margin-bottom: 20rpx;
  overflow: hidden;
  /*超出部分隐藏*/
  white-space: nowrap;
  /*禁⽌换⾏*/
  text-overflow: ellipsis;
  /*省略号*/
}

.popup-footer {
  position: fixed;
  bottom: 0;
  display: flex;
  width: 660rpx;
  height: 100rpx;

  // background-color: rgb(194, 155, 155);
  .btns {
    height: 100%;
    flex: 1;
  }
}

.groupChange {
  background: #fff;
  height: 40px;
  padding-left: 12px;
  padding-top: 8px;
}

.form-content {
  height: 80rpx;
  background: #fff;
  font-size: 28rpx;
}

.upload-btn {
  margin: 12rpx;
  width: 180rpx;
  height: 48rpx;
  line-height: 48rpx;
  font-size: 24rpx;
  text-align: center;
  background-color: #ebf4ff;
  color: #2b8fed;
}

.fileList-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60rpx;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  padding-left: 20rpx;

  .left {
    z-index: 99999;
    display: flex;
    align-items: center;
  }

  .fileName {
    width: 500rpx;
    font-size: 24rpx;
  }

  .file-closeBtn {
    width: 60rpx;
    color: red;
    font-size: 24rpx;
  }
}

.preview {
  width: 700rpx;
  height: 1200rpx;
  padding-bottom: 40rpx;
  overflow: auto;

  .preview-top {
    height: 80rpx;
    line-height: 80rpx;
    padding-left: 40rpx;
  }
}

.tki-tree {
  z-index: 99999999999999 !important;
  height: 100%;
}

.w-e-text-container {
  z-index: 1 !important;
}

.bor-top {
  border-top: 1px solid #eee;

  /deep/ .u-tabs__wrapper__nav__item {
    flex: 1;
  }
}

.tab-item {
  padding-top: 250rpx;
}

// 下一步tabs展示问题
.tabs {
  padding: 0 12rpx;
  font-size: 20rpx;
  margin-bottom: 1px;

  .hamburg {
    padding-left: 4rpx;
    border-left: 1px solid #d5d0d0;
  }
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

.BGC {
  background-color: #a8a8a8;
}
</style>
