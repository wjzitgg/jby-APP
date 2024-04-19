<template>
  <view class="wrapper addPageBg">
    <u-navbar
      leftText="编辑设计变更"
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
      </u-tabs>
    </view>
    <view class="pad"></view>
    <view class="content">
      <view v-show="idx === 0">
        <view class="add-inputs">
          <view class="inputs-label">变更编号</view>
          <view class="inputs-content">
            <u--textarea v-model="form.changesCode" placeholder="请输入内容" autoHeight maxlength="50" border="none" :disabled="allowModify !== 0" @input="isUpdate = 1"></u--textarea>
            <!-- <u-input
              v-model="form.changesCode"
              :maxlength="maxlength"
              :disabled="allowModify !== 0"
              @input="isUpdate = 1"
              border="none"
            ></u-input> -->
          </view>
        </view>
        <view v-if="user.orgType != 5" class="add-inputs">
          <view class="inputs-label">项目</view>
          <view class="inputs-content select" @click="openPicker(1)">
            <view class="name">{{ form.fkProjectName }}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view v-if="user.orgType != 5" class="add-inputs">
          <view class="inputs-label">标段项目</view>
          <view class="inputs-content select" @click="openPicker(2)">
            <view class="name">{{ form.fkBidProjectName }}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">变更名称</view>
          <view class="inputs-content">
            <u--textarea v-model="form.changesName" placeholder="请输入内容" autoHeight maxlength="50" border="none"></u--textarea>
          </view>
        </view>
        <view  class="add-inputs">
          <view class="inputs-label">变更类型</view>
          <view class="inputs-content select" @click="openPicker(3)">
            <view class="name">{{ form.fkWorkflowTemplateName }}</view>
            <u-icon
              name="arrow-down-fill"
              class="icons"
              color="#2a82e4"
              size="12"
            ></u-icon>
          </view>
        </view>
        <view  class="add-inputs">
          <view class="inputs-label">审批人设置</view>
          <view class="inputs-content">
          <view class="setBtn">
            <view class="custom-style">
              <u-button
                type="primary"
                class="custom-style"
                text="设置"
                @click="setApprover"
              ></u-button>
            </view>
          </view>
          </view>
        </view>
        <view  class="add-inputs">
          <view class="inputs-label">变更设计原因</view>
          <view class="inputs-content">
            <u--textarea v-model="form.changesReason" placeholder="请输入内容" autoHeight maxlength="1500" border="none"></u--textarea>
          </view>
        </view>
        <view  class="add-inputs">
          <view class="inputs-label">变更设计方案</view>
          <view class="inputs-content">
            <u--textarea v-model="form.changesPlan" placeholder="请输入内容" autoHeight maxlength="2000" border="none"></u--textarea>
          </view>
        </view>
        <view  class="add-inputs">
          <view class="inputs-label">变更预估成本</view>
          <view class="inputs-content">
            <u--textarea v-model="form.changesCost" placeholder="请输入内容" autoHeight maxlength="2000" border="none"></u--textarea>
          </view>
        </view>
        <view class="add-inputs">
          <view class="inputs-label">附件</view>
          <view class="inputs-fileList">
            <view v-if="!!fileList.length">
            <view class="inputs-fileList-item" v-for="(item, index) in fileList" :key="item.id">
							<view class="left" @click="preview(item.fileUrl)">
								<u-icon class="icons" name="file-text" size="20"></u-icon>
								<view class="name text-hidden">{{ item.fileName }}</view>
							</view>
							<view class="file-closeBtn close" @click="delFile(item, index)"></view>
						</view>
            </view>
            <view class="fileListBtn">
            <lsj-upload v-if="this.fileList.length<6" ref="lsjUpload1" childId="upload2" :option="option" :size="size" :formats="formats" :debug="debug" :count="count" :nowCount="fileList.length" :instantly="instantly" @change="onChange" @progress="onprogress" @uploadEnd="onuploadEnd" >
              <view class="addBtn">上传附件</view>
            </lsj-upload>
            </view>
          </view>
        </view>
        <!-- <view class="approve-files">
          <view class="approve-files-head">
            <h5>附件</h5>
            <lsj-upload
              v-if="this.fileList.length<6"
              ref="lsjUpload1"
              childId="upload2"
              :width="width"
              :height="height"
              :option="option"
              :size="size"
              :formats="formats"
              :debug="debug"
              :count="count"
              :nowCount="fileList.length"
              :instantly="instantly"
              @change="onChange"
              @progress="onprogress"
              @uploadEnd="onuploadEnd"
            >
              <view class="upload-btn" :style="{ width: width, height: height }"
                >上传附件</view
              >
            </lsj-upload>
          </view>
          <view class="fileList" v-if="!!fileList.length">
            <view
              class="fileList-item"
              v-for="(item, index) in fileList"
              :key="item.id"
            >
              <view class="left" @click="preview(item.fileUrl)">
                <u-icon class="icons" name="file-text" size="28"></u-icon>
                <view class="fileName text-hidden">{{ item.fileName }}</view>
              </view>
              <view class="file-closeBtn" @click="delFile(item, index)">X</view>
            </view>
          </view>
          <view class="file-empty" v-else>暂无附件</view>
        </view> -->
      </view>
      <view v-show="idx === 1">
        <processForm
          :tableData="workflowTableList"
          :tableIndex="tableIndex"
          @sendGzipTableHtml="sendGzipTableHtml"
          ref="processForm"
        ></processForm>
      </view>
    </view>
    <view class="pdb"></view>
    <view class="footer">
      <view class="btns saveBtn" @click="btnOk(0)">保存草稿</view>
      <view class="btns submitBtn" @click="sendApprove" v-if="!stats">直接提交</view>
      <view class="btns submitBtn" @click="appShow = true" v-if="stats">签名</view>
    </view>
    <u-picker
      title="请选择"
      :show="pickerShow"
      :columns="[pickerList]"
      keyName="label"
      @confirm="pickerConfirm"
      @cancel="pickerCancel"
    ></u-picker>
    <prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop>
    <addPopup :app-show="appShow" @close="closeApp" @submit="submit" @signUrlImg="signUrlImg" :app-title="'签名'" @getSign="getSign" ref="addPopup" :tableData="workflowTableList" :roleId="approverList.workflowNodeDTOS[1].fkRoleId"  :sysRoleId="approverList.workflowNodeDTOS[1].sysRoleId"></addPopup>
  </view>
</template>

<script>
import processForm from "../../components/process-form/process-form.vue";
import request from "../../common/request";
import prviewPop from '../../components/prview-pop/prview-pop.vue'
import addPopup from '../../components/approve-popup/add-popup.vue';
export default {
  components: { processForm,prviewPop ,addPopup},
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  data() {
    return {
      tabList: [{ name: "变更信息", idx: 0 }],
      current: 0,
      tableIndex: 0,
      idx: 0,
      pickerList: [],
      pickerType: 1,
      pickerShow: false,
      workflowTableList: [],
      tableHtml: [],
      proList: [],
      bidList: [],
      typeList: [],
      maxlength: 1000,
      allowModify: 0,
      isUpdate: 0,
      form: {},
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
      count: 5,
      fileList: [],
      approverList: [],
      sendApproverList: [],
      isSet: false,
      previewShow:false,
      previewUrl:"",
      sup:false,
      stats:false,
      signUrl:"",
      appShow: false
    };
  },
  onLoad(options) {
    let obj = JSON.parse(options.row);
    this.sup=!!options.sup
    console.log(obj);
    this.form = obj;
    if(obj.fileList){
      this.fileList=[]
      obj.fileList.forEach(item=>{
        if(item.prodReProcessFileList){
          this.fileList=[...this.fileList,...item.prodReProcessFileList]
        }
      })
    }
    this.getChangeType();
    this.getChangeWorkflowDetail();
  },
  methods: {
    sendApprove(){
      if(this.approverList.launchType==2){
        this.$refs.addPopup.submit()
      }else{
        this.btnOk(1)
      }
    },
    closeApp(){
      this.appShow = false
    },
    submit(e){
      console.log('sumit方法',e);
      if(e){
        this.btnOk(1,e)
      }else{
        this.btnOk(1)
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
            console.log(item.tableHtml);
						if (item.tableHtml != undefined && item.tableHtml != null && item.tableHtml.length != 0) {
							item.tableHtml.forEach(items => {
								items.arr.forEach(i => {
									if (i.attributeTypes == 3) {
                    if ([this.approverList.workflowNodeDTOS[1].fkRoleId,this.approverList.workflowNodeDTOS[1].sysRoleId].includes(i.signatureDate.signer)) {
											i.signatureDate.img = e;
										}
									}
								});
							});
						}
					});
					this.tableHtml.forEach(item => {
						item.tableHtml = JSON.stringify(item.tableHtml);
						item.tableHtml = this.utils.zip(JSON.stringify(item.tableHtml));
					});
				}
			},
    getSign(e){
      console.log('获取的',e);
      this.stats = e
    },
    preview(url) {
      this.$checkName(url)
      return
			this.previewUrl = url;
			this.previewShow = true;
		},
    closePre(){
      this.previewShow = false;
    },
    currentChange(item) {
      this.current = item.index;
      this.idx = item.idx;
      if (item.idx === 1) {
        this.tableIndex = item.tableInd;
      }
    },
    getChangeType() {
      this.$api.getChangeType().then((res) => {
        if (res.code === 200) {
          this.typeList = [
            ...res.data.map((item) => ({
              ...item,
              label: item.name,
              value: item.key,
            })),
          ];
          console.log(this.typeList);
        } else {
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
    },
    getChangeWorkflowTable() {
      let data = {
        workflowId: this.form.fkWorkflowTemplateId,
        changeId: this.form.pkId,
      };
      let api =this.sup?this.$api.getChangeWorkflowTable2: this.$api.getChangeWorkflowTable
      api(data).then((res) => {
        if (res.code === 200) {
          this.workflowTableList = res.data;
          if (this.workflowTableList.length) {
            let tableArr = this.workflowTableList.map((item, index) => ({
              name: item.tableName,
              idx: 1,
              tableInd: index,
            }));
            this.tabList.splice(1, 0, ...tableArr);
          }
          if(this.approverList.launchType==2){
            this.$refs.addPopup.getApproveStatus()
          }else{
            this.stats = false
          }
        } else {
        }
      });
    },
    sendGzipTableHtml(e) {
      console.log(e);
      this.tableHtml = e;
    },
    btnOk(changesStatus,getDatas) {
      this.$refs.processForm.gzipTable();
      uni.showLoading({ mask: true });
      let data = {
        changesCode: this.form.changesCode,
        changesCost: this.form.changesCost,
        changesName: this.form.changesName,
        changesPlan: this.form.changesPlan,
        changesReason: this.form.changesReason,
        fkBidProjectId: this.form.fkBidProjectId,
        fkWorkflowTemplateId: this.form.fkWorkflowTemplateId,
        fkProjectId: this.form.fkProjectId,
        pkId:this.form.pkId,
        workflowTableList: this.tableHtml,
        isUpdate: this.isUpdate,
        changesStatus,
        fileList: this.fileList,
        prodWorkflowUserAdds: this.sendApproverList,
      };
      if(getDatas){
        data = {...data,...getDatas}
      }
      if(this.signUrl){
        data.signUrl = this.signUrl
      }
      let api =this.sup?this.$api.updateDesign: this.$api.updateChange
      api(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.showToast({ title: "操作成功" });
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.getDetail()
            uni.navigateBack({ delta: 2 });
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    setApprover() {
      uni.navigateTo({
        url:
          "/pages/setApprover/setoneApprover?row=" +
          JSON.stringify(this.approverList),
      });
    },
    getChangeWorkflowDetail() {
      let data = {
        workflowId: this.form.fkWorkflowTemplateId,
        pkId: this.form.pkId,
        projectId: this.form.fkBidProjectId,
      };
      let api =this.sup?this.$api.getChangeWorkflowDetail2: this.$api.getChangeWorkflowDetail
      api(data).then((res) => {
        if (res.code === 200) {
          if (res.data) {
            let nodeArr = [];
            let arr2 = []
            res.data.workflowNodeDTOS.forEach((item) => {
              if (item.nodeType == 2) {
                item.prodSysRoleVo =
                  item.prodSysRoleVo == null
                    ? { selectedUserId: "", sysUserList: [] }
                    : item.prodSysRoleVo;
                item.prodSysRoleVo.selectedUserId =
                  item.prodSysRoleVo.selectedUserId == null
                    ? ""
                    : item.prodSysRoleVo.selectedUserId;
                    nodeArr.push(item)
                    if(!this.form.settingApproveFlag){
                     arr2.push({
                       bizType: 3,
                        fkRoleId: item.fkRoleId,
                        currentNodeId: item.pkId,
                        fkApproverId: item.prodSysRoleVo.selectedUserId
                     })
                    }
              }
            });
            this.sendApproverList = arr2
            this.approverList = res.data;
            if(!this.form.settingApproveFlag){
              let arr=[]
              for (let i = 0; i < nodeArr.length; i++) {
				        	if (nodeArr[i].nodeType == 2) {
				        		arr.push({
				        			fkRoleId: nodeArr[i].fkRoleId,
				        			fkApproverId: nodeArr[i].prodSysRoleVo.selectedUserId == null ? "" : nodeArr[i].prodSysRoleVo
				        				.selectedUserId,
				        			currentNodeId: nodeArr[i].pkId,
                      bizType:3
				        		});
				        	}
				        }
                console.log(arr);
                this.sendApproverList =arr
                this.isSet = true;
            }
          this.getChangeWorkflowTable();
          } else {
            this.approverList = {
              workflowNodeDTOS: [
                {
                  prodSysRoleVo: {
                    sysUserList: [],
                  },
                },
              ],
            };
          }
        }
      });
    },
    prevDateFun(obj) {
      obj.forEach((item) => (item.bizType = 3));
      this.sendApproverList =obj
      this.approverList.workflowNodeDTOS.forEach(item => {
        obj.forEach(item2=>{
            if (item.pkId===item2.currentNodeId) {
                item.prodSysRoleVo.selectedUserId=item2.fkApproverId
            }
        })
        })
      console.log(obj, "B页面返回过来的");
      this.isSet = true;
    },
    openPicker(type) {
      this.pickerType = type;
      this.pickerList = [];
      if (type === 1) {
        this.pickerList = this.proList;
      } else if (type === 2) {
        this.pickerList = this.bidList;
      } else if (type === 3) {
        this.pickerList = this.typeList;
      }
      this.pickerShow = true;
    },
    pickerConfirm(e) {
      console.log(e);
      if (e.value.length) {
        if (this.pickerType === 1) {
          this.form.fkProjectId = e.value[0].value;
          this.form.fkProjectName = e.value[0].label;
          this.form.fkBidProjectId = "";
          this.form.fkBidProjectName = "";
        } else if (this.pickerType === 2) {
          this.form.fkBidProjectId = e.value[0].value;
          this.form.fkBidProjectName = e.value[0].label;
        } else if (this.pickerType === 3) {
          this.form.fkWorkflowTemplateId = e.value[0].value;
          this.form.fkWorkflowTemplateName = e.value[0].label;
          // this.getChangeWorkflowTable();
          this.getChangeWorkflowDetail();
        }
      }
      this.pickerCancel();
    },
    pickerCancel() {
      this.pickerShow = false;
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
  },
};
</script>

<style lang="scss" scoped>
.pad {
  height: 98rpx;
}
.pdb {
  height: 100rpx;
}
.content {
  font-size: 28rpx;
}
.title {
  padding-left: 20rpx;
  font-size: 28rpx;
  font-weight: 600;
  margin: 10rpx 0;
}
.inputs {
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}
.select {
  justify-content: space-between;
}
.addSubBtn {
  display: flex;
  align-items: center;
  padding-left: 40rpx;
  background-color: #fff;
  height: 80rpx;
  .btns {
    width: 100rpx;
    padding: 10rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    text-align: center;
    color: #2a82e4;
    background-color: #d9f4ff;
  }
}
.addMatBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 40rpx;
  background-color: #fff;
  height: 80rpx;
  .btns {
    width: 150rpx;
    padding: 10rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    text-align: center;
    color: #2a82e4;
    background-color: #d9f4ff;
  }
}
.orderList {
  overflow: auto;
  max-height: 350rpx;
  background-color: #fff;
  .orderList-item {
    display: flex;
    justify-content: space-around;
    height: 80rpx;
    padding: 0 20rpx;
    border-bottom: 1px solid #eee;
    .name {
      width: 580rpx;
      height: 80rpx;
      line-height: 80rpx;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
    }
  }
}
.formBtns {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100rpx;
  .next,
  .last {
    padding: 20rpx 40rpx;
    background-color: #1576e6;
    color: #fff;
  }
}
.table_height {
  /*#ifdef APP-PLUS*/
  max-height: calc(100vh - 554rpx);
  /*#endif*/
  /*#ifdef H5*/
  max-height: calc(100vh - 466rpx);
  /*#endif*/
}
.footer {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 750rpx;
  height: 100rpx;
  z-index: 10;
  .btns {
    display: flex;
    justify-content: center;
    align-items: center;
    // width: 375rpx;
    flex: 1;
    color: #fff;
  }
  .saveBtn {
    background-color: #43cf7c;
  }
  .submitBtn {
    background-color: #1576e6;
  }
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
.file-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60rpx;
  background-color: #fff;
}
.setBtn {
  display: flex;
  justify-content: start;
  padding-left: 20rpx;
  .custom-style {
    width: 100rpx;
    height: 60rpx;
  }
}
</style>
