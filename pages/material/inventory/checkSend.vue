<template>
  <view class="wrapper">
    <u-navbar
      leftText="提交审批"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="pad" v-show="step==1"></view>
    <view class="sticky" v-show="step==1">
      <u-tabs
        :list="tabList"
        :current="current"
        @click="listSelet"
        class="tabs"
        :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"
      >
      </u-tabs>
    </view>
    <view v-show="step==1&&idx==0">
        <view class="approve-files">
          <view class="approve-files-head">
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
            <!-- <view class="upload-btn" @click="upLoad"> 上传附件 </view> -->
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
        </view>
    </view>
    <view v-show="step==1&&idx==1">
        <processForm :tableData="workflowTableList" :tableIndex="tableIndex" @sendGzipTableHtml="getGzipTableHtml" ref="formHtml"></processForm>
    </view>
    <view v-show="step==2" style="width:750rpx;background-color:#fff">
      <setApprover v-if="this.nodeArr.length" :arr="nodeArr" type="2" :forbidden="false" @dataReturn="dataReturn" :data="approverList"></setApprover>
    </view>
    <view class="footer">
    <view class="nextBtn green" @click="step++" v-if="step==1">下一步</view>
    <view class="stepBtn green" @click="step--" v-if="step==2">上一步</view>
    <view class="btns blue" @click="btnOk" v-if="step==2&&!stats">发起审批</view>
    <view class="btns blue" @click="btnOk" v-if="step==2&&stats">签名</view>
    </view>
    <prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop>
    <addPopup :app-show="appShow" @close="closeApp" @submit="submit" @signUrlImg="signUrlImg" :app-title="'签名'" @getSign="getSign" ref="addPopup" :tableData="workflowTableList" :roleId="approverList.workflowNodeDTOS[1].fkRoleId"  :sysRoleId="approverList.workflowNodeDTOS[1].sysRoleId"></addPopup>
  </view>
</template>

<script>
import processForm from "../../../components/process-form/process-form.vue";
import request from "../../../common/request";
import prviewPop from '../../../components/prview-pop/prview-pop.vue'
import setApprover from "../../../components/set-approver/set-approver.vue";
import addPopup from '../../../components/approve-popup/add-popup.vue';
export default {
  components:{processForm,prviewPop,setApprover,addPopup},
  data() {
    return {
      idx: 0,
      tableIndex: 0,
      tabList: [
        {
          name: "附件",
          idx: 0,
        },
        // {
        //   name:"设置审批人",
        //   idx:2
        // }
      ],
      current: 0,
      tableHtml: [],
      sendApproverList:[],
      showData:{},
      workflowTableList:[],
      isSet:false,
      fileList:[],
      previewShow:false,
      previewUrl:"",
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
      nodeArr:[],
      stats:false,
      signUrl:"",
      appShow: false,
      step:1
    };
  },
  computed: {
    user() {
      return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    },
  },
  onLoad(options) {
    console.log(options);
    this.getData(options.pkId);
  },
  methods: {
    sendApprove(){
      uni.hideLoading()
      if(this.approverList.launchType==2){
        if(this.stats){
          this.appShow = true
      }else{
        this.$refs.addPopup.submit()
      }
      }else{
        this.saveEnter(this.sendApproverList);
      }
    },
    closeApp(){
      this.appShow = false
    },
    submit(e){
      console.log('sumit方法',e,this.sendApproverList);
      if(e){
        this.saveEnter(this.sendApproverList,e);
      }else{
        this.saveEnter(this.sendApproverList);
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
    dataReturn(arr) {
				console.log(arr);
				this.nodeArr = arr;
			},
    // tab点击
    listSelet(item, index) {
      // 展开传值
      if (index !== undefined) {
        this.current = index;
      } else {
        this.current = item.index;
      }
      this.idx = item.idx;
      if (item.idx === 1) {
        this.tableIndex = item.tableInd;
      }
    },
    getData(id) {
      uni.showLoading({
        mask: true,
      });
      this.$api.getConstruction2({ pkId: id, type: 2 }).then((res) => {
        uni.hideLoading();
        if (res.code === 200) {
          this.showData = res.data;
          this.fileList=[]
          res.data.fileList.forEach(item=>{
            if(item.prodReProcessFileList){
                item.prodReProcessFileList.forEach((item2,index2)=>{
                    this.fileList.push({...item2,id:index2})
                })
            }
          })
          console.log(this.fileList);
          this.isSet = !!res.data.settingApproveFlag;
          this.workflowTableList = JSON.parse(
            JSON.stringify(this.showData.workflowTableList)
          )
            ? this.showData.workflowTableList
            : [];
          if (this.workflowTableList.length) {
            let tableArr = this.workflowTableList.map((item, index) => ({
              name: item.tableName,
              idx: 1,
              tableInd: index,
            }));
            this.tabList.splice(1, 0, ...tableArr);
          }
          this.getOrderInventoryWorkflowDetail();
        }
      });
    },
    btnOk() {
      this.prevDateFun()
        // if(this.workflowTableList.length){
        //     this.$refs.formHtml.gzipTable();
        // }else{
        //     this.getOrderInventoryWorkflowDetail();
        // }
    },
    // 获取表格压缩后的数据
    getGzipTableHtml(tabledata) {
      console.log("触发");
      this.tableHtml = tabledata;
      this.sendApprove()
      // this.getOrderInventoryWorkflowDetail();
    },
    getOrderInventoryWorkflowDetail() {
      let data = {
        warehouseId: this.showData.fkWarehouseId,
        pkId: this.showData.pkId,
      };
      this.$api.getOrderInventoryWorkflowDetail(data).then((res) => {
        if (res.code === 200) {
          if (res.data) {
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
              }
            });
            this.approverList = res.data;
            this.nodeArr = [];
			      this.approverList.workflowNodeDTOS.forEach((item,index) => {
			      	if (item.nodeType == 2) {
			      		console.log(item.prodSysRoleVo);
			      	if(res.data.launchType==2&&index==1){
					    	 let arr = item.prodSysRoleVo.sysUserList.filter(item2=>item2.pkId==this.user.userId)
                  item.prodSysRoleVo.selectedUserId =arr.length? this.user.userId:''
					      }else{
					      	item.prodSysRoleVo.selectedUserId = item.prodSysRoleVo.selectedUserId;
					      }
			      		item.prodSysRoleVo.sysUserList.forEach(item3 => {
			      			item3.value = item3.pkId;
			      			item3.label = item3.userName;
			      			if (item.prodSysRoleVo.selectedUserId == item3.pkId) {
			      				item.prodSysRoleVo.selectedUserName = item3.userName;
			      			}
			      		});
			      		this.nodeArr.push(item);
			      	}
			      });
            console.log('节点',this.nodeArr);
            if(this.approverList.launchType==2){
              this.$refs.addPopup.getApproveStatus()
            }
            // uni.navigateTo({
            //   url:
            //     "/pages/setApprover/setoneApprover?noReturn=1&row=" +
            //     JSON.stringify(this.approverList),
            // });
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
            uni.showToast({ title: "未设置流程模板", icon: "none" });
          }
        }
      });
    },
    prevDateFun() {
      let arr = [];
				let arr2 = this.nodeArr;
				for (let i = 0; i < arr2.length; i++) {
					if (arr2[i].nodeType == 2) {
						arr.push({
							fkRoleId: arr2[i].fkRoleId,
							fkApproverId: arr2[i].prodSysRoleVo.selectedUserId == null ? "" : arr2[i].prodSysRoleVo
								.selectedUserId,
							currentNodeId: arr2[i].pkId,
						});
					}
				}
				if (arr.filter(item => !item.fkApproverId).length == arr.length) {
					return uni.showToast({ icon: "none", title: "请选择至少一位审批人" });
				}
      arr.forEach((item) => (item.bizType = 2));
      this.sendApproverList = arr;
      console.log(arr, "B页面返回过来的");
      this.isSet = true;
      uni.showLoading({mask:true})
      console.log(this.$refs.formHtml);
      this.$refs.formHtml.gzipTable();
    },
    saveEnter(prodWorkflowUserAddList,e) {
      uni.showLoading({ mask: true });
      let data = {
        // ...this.showData,
        orderCode:this.showData.orderCode,
        pkId:this.showData.pkId,
        serviceTime:this.showData.serviceTime,
        fkApproverId:this.showData.fkApproverId,
        fkWorkflowTemplateId:this.showData.fkWorkflowTemplateId,
        isUpdate:this.showData.isUpdate,
        approver:this.showData.approver,
        leaderName:this.showData.leaderName,
        remark:this.showData.remark,
        engMatOrderInventoryDetailsAdds:
          this.showData.engMatOrderInventoryDetailsVos,
        approveStatus: 1,
        prodWorkflowUserAddList,
        fileList:this.fileList,
      };
      data.workflowTableList = this.tableHtml;
      if(e){
        data = {...data,...e}
      }
      delete data.engMatOrderInventoryDetailsVos;
      this.$api
        .updateOrderInventory(data)
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.showToast({ title: "编辑成功" });
            this.getDetail3();
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getDetail3(){
    	//   this.getData(this.showData.pkId,2)
	  let pages = getCurrentPages()
    let prevPage = pages[pages.length - 3]; // 上一页面实例
    prevPage.$vm.resh() // 调用上一页 定义的方法
	  uni.navigateBack({delta:2})
    },
    delFile(row, index) {
      if(row.deleteFlag===0){
          return uni.showToast({title:"该附件不可删除",icon:"none"})
      }
      this.fileList = this.fileList.filter((item) => item.id !== row.id);
      this.$refs.lsjUpload1.clear(row.fileName);
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
    justify-content: flex-end;
    align-items: center;
    height: 60rpx;
    background-color: #fff;
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
.text-hidden {
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁⽌换⾏*/
  text-overflow: ellipsis; /*省略号*/
}
.footer {
  position: fixed;
  bottom: 0;
  display: flex;
  width: 750rpx;
  height: 100rpx;
  z-index: 10;
  .btns {
    
    display: flex;
    justify-content: center;
    align-items: center;
    width: 480rpx;
    color: #fff;
    font-size: 28rpx;
  }
  .nextBtn{
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 28rpx;
  }
  .stepBtn{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 270rpx;
    color: #fff;
  }
  .green {
    background-color: #43cf7c;
  }
  .blue {
    background-color: #1576e6;
  }
  .yellow {
    background-color: #f59a23;
  }
  .red {
    background-color: #fa2020;
  }
}
</style>
