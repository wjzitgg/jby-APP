<template>
	<view class="wrapper">
		<u-navbar leftText="库存盘点" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<!-- 头部tabs -->
		<view class="workflow">
      <!-- ['5','6'].includes(showData.inventoryCode) -->
      <view class="workflow-left" v-if="['5','6'].includes(showData.inventoryCode)">
        <view class="tabs-item" :class="{ currentTab: nowTab === 0 }" @click="nowTab = 0">盖章详情</view>
        <view class="tabs-item" :class="{ currentTab: nowTab === 1 }" @click="nowTab = 1">业务详情</view>
      </view>
      <!-- class="workflow-right" -->
      <view  :class="{'workflow-right':!['5','6'].includes(showData.inventoryCode),'workflow-right2':['5','6'].includes(showData.inventoryCode)}">
        <view class="pad"></view>
        <view v-show="nowTab===0" v-if="['5','6'].includes(showData.inventoryCode)">
          <signDetail :signDetail="showData.sealBusinessVo" :key="nowTab"></signDetail>
        </view>
		<view v-show="nowTab===1">
			<view class="sticky" :class="{'sticky-left':['5','6'].includes(showData.inventoryCode)}">
			<u-tabs :list="tabList" :current="current" @click="listSelet" class="tabs" :key="nowTab" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}">
				<view slot="right" class="hamburg" @tap="hamburg"><u-icon name="list" size="21" bold></u-icon></view>
			</u-tabs>
			<view class="pull-down" v-show="show1">
				<text class="item-tab" :class="index == current ? 'action' : ''" v-for="(item, index) in tabList" :key="index" @click="listSelet(item, index)">{{ item.name }}</text>
				<!-- 箭头 -->
				<u-icon name="arrow-up" color="#dddddd" size="20" class="arrow-up" @click="shut"></u-icon>
			</view>
			</view>
			<view class="content">
			<!-- tab对应面 -->
			<view class="" v-show="idx == 0" style="width:750rpx">
				<tableForm :list="[
				{name:'盘点单号',value:showData.orderCode,show:true},
				{name:'盘点仓库',value:showData.warehouseName,show:true},
				{name:'填表人',value:showData.createUserName,show:true},
				{name:'业务时间',value:showData.createTime,show:true},
				{name:'制单人',value:showData.createUserName,show:true},
				{name:'录入时间',value:showData.createTime,show:true},
				{name:'单据状态',value:showData.inventoryCodeName,show:true},
				{name:'备注',value:showData.remark,show:true},
				]">
				</tableForm>
				<!-- <view class="card">
					<view class="list-item">
						<text>盘点单号</text>
						<text class="item">{{ showData.orderCode }}</text>
					</view>
					<view class="list-item">
						<text>盘点仓库</text>
						<text class="item">{{ showData.warehouseName }}</text>
					</view>
					<view class="list-item">
						<text>填表人</text>
						<text class="item">{{ showData.leaderName }}</text>
					</view>
					<view class="list-item">
						<text>业务时间</text>
						<text class="item">{{ showData.createTime }}</text>
					</view>
                    <view class="list-item">
						<text>制单人</text>
						<text class="item">{{showData.createUserName }}</text>
					</view>
					<view class="list-item">
						<text>录入时间</text>
						<text class="item">{{showData.createTime }}</text>
					</view>
					<view class="list-item">
						<text>单据状态</text>
						<text class="item">{{showData.inventoryCodeName }}</text>
					</view>
					<view class="list-item">
						<text>备注</text>
						<text class="item">{{showData.remark }}</text>
					</view>
				</view> -->
			</view>
			<view v-show="idx == 1" style="width:750rpx;overflow:auto"><processForm :tableData="workflowTableList" :tableIndex="tableIndex" @sendGzipTableHtml="getGzipTableHtml" :disabled="!showData.changeStatus&&todo!=1" ref="formHtml"></processForm></view>
			<!-- 工程量 -->
			<view class="" v-show="idx == 2" style="width:750rpx;overflow:auto">
				<!-- 表格 -->
				<uni-table border emptyText="暂无更多数据">
					<!-- 表头行 -->
					<uni-tr>
						<uni-th align="center" width="100">物料名称</uni-th>
						<uni-th align="center" width="100">供应商</uni-th>
						<uni-th align="center" width="100">物料类型</uni-th>
						<uni-th align="center" width="100">单位</uni-th>
						<uni-th align="center" width="100">库存数量</uni-th>
						<uni-th align="center" width="100">盘点数量</uni-th>
						<uni-th align="center" width="100">盘盈数</uni-th>
						<uni-th align="center" width="100">盘亏数</uni-th>
					</uni-tr>
					<!-- 表格数据行 -->
					<uni-tr v-for="(item, index) in showData.engMatOrderInventoryDetailsVos" :key="index">
						<uni-td align="center">{{ item.materialName }}</uni-td>
						<uni-td align="center">{{ item.customerName }}</uni-td>
						<uni-td align="center">{{ item.materialTypeName }}</uni-td>
						<uni-td align="center">{{ item.unitName }}</uni-td>
						<uni-td align="center">{{ item.beforeNum }}</uni-td>
						<uni-td align="center">{{ item.inventoryNum }}</uni-td>
						<uni-td align="center">
							<text v-if="item.inventoryNum - item.beforeNum > 0">{{ item.inventoryNum - item.beforeNum }}</text>
						</uni-td>
						<uni-td align="center">
							<text v-if="item.inventoryNum - item.beforeNum < 0">{{ 0 - item.inventoryNum - item.beforeNum }}</text>
						</uni-td>
					</uni-tr>
				</uni-table>
			</view>
			<!-- 附件 -->
			<view class="" v-show="idx == 3">
				<view class="accessory" v-for="(item, index) in showData.fileList" :key="index">
					<view class="acce-item">
						<u-icon name="account" color="#8f99ab" size="24"></u-icon>
						<text>{{ item.userName }}</text>
						<view class="ctime">{{ item.time }}</view>
					</view>
					<view class="acce-list" v-for="(file, ind) in item.prodReProcessFileList" :key="ind">
						<u-icon name="file-text" color="#3896ee" size="24" class="file-icon"></u-icon>
						<view class="fileName" @click="previewLook(file)">{{ file.fileName }}</view>
						<u-icon name="download" class="downLoad" size="24" @click="downLoad(file.fileUrl)"></u-icon>
					</view>
				</view>
			</view>
			<!-- 审批记录 -->
			<view class="" v-show="idx == 4">
				<view class="accessory" v-for="(item, index) in showData.approveDetailList" :key="index">
					<view class="acce-item">
						<u-icon name="account" color="#8f99ab" size="24"></u-icon>
						<text>{{ item.approver }}</text>
						<view class="checkBtn" @click="checkNodes(item)" v-if="item.approveStatus !== 2">查看</view>
						
					</view>
					<view class="record">
						<!-- <u-icon name="file-text-fill" color="#d73434" size="24" class="file-icon"></u-icon> -->
						<image class="appimg" src="../../../static/image/audit.png" mode="widthFix" />
						<text>
							发表：<text class="ctime">{{ item.approveTime }}</text>
							<br />
							{{ item.approveComment }}
						</text>
					</view>
					<view class="record" v-for="(file, ind) in item.fileList" :key="ind">
						<u-icon name="file-text" color="#3896ee" size="24" class="file-icon"></u-icon>
						<text @click="previewLook(file)">{{ file.fileName }}</text>
						<!-- <u-icon name="download" class="downLoad" size="24" @click="downLoad(file.fileUrl)"></u-icon> -->
					</view>
				</view>
			</view>
		</view>
		</view>
		<!-- 底部固定处理按钮 -->
        <view class="footer" v-if="!todo" :class="{'workflow-right':!['5','6'].includes(showData.inventoryCode),'workflow-right2':['5','6'].includes(showData.inventoryCode)}">
			<view
          class="btns red"
          v-if="showData.deleteStatus"
          @click="delBtn"
          >删除</view
        >
            <view
          class="btns green"
          v-if="showData.editStatus"
          @click="edit"
          >编辑</view
        >
        <view
          class="btns blue"
          v-if="showData.editStatus&&showData.inventoryCode!='7'"
          @click="submitBtn"
          >发起审批</view
        >
        <view
          class="btns blue"
          v-if="showData.relaunchStatus"
          @click="submitBtn"
          >重新发起</view
        >
        
        <view
          class="btns red"
          v-if="showData.revokeStatus"
          @click="recall"
          >撤回</view
        >
        <view
          class="btns red"
          v-if="showData.sealWithdrawStatus"
          @click="getApproType(1)"
          >撤回</view
        >
        <view
          class="btns blue"
          v-if="showData.changeStatus"
          @click="appBtn"
          >处理</view
        >
        <view
          class="btns blue"
          v-if="showData.sealApproveStatus"
          @click="signappBtn"
          >{{showData.sealPersonStatus==1?'盖章':'审批'}}</view
        >
		<view class="btns blue" v-if="showData.sealStatus" @click="goSign">{{showData.sealStatus==1?'发起用章':'重新发起用章'}}</view>
        </view>
	  </view>
		</view>
		
		<view class="btn" v-if="todo==1" @click="appBtn">处理</view>
		<approvePopup
			:app-show="appShow"
			:approver-show="bottomShow"
			:approverName="staffList.roleName"
			:approverList="staffList.sysUserList"
			:approver-name="nextAppRole"
			:approver-list="approvalOptions"
			@close="closeApp"
			@reject="reject"
			@submit="submit"
			:app-title="'审批'"
			ref="approve"
			:tableData="workflowTableList"
			:sysRoleId="showData.sysRoleId"
			:roleId="showData.roleId"
			@signUrlImg="signUrlImg"
			:getFiles="fileList"
		></approvePopup>
        <u-popup :show="popShow2" :round="20"  mode="center">
      <view class="popup2">
        <view class="popup2-head">
          <view class="name">录入签收信息</view>
          <u-icon
            name="close"
            color="#fff"
            class="closeBtn"
            @click="closePop2"
          ></u-icon>
          <!-- <view ></view> -->
        </view>
        <view class="popup2-content">
          <view>
            <view class="title">下一审批岗位</view>
              <view class="inputs">
                <u--input
                  v-model="staffList.roleName"
                  border="none"
                  clearable
                ></u--input>
              </view>
          </view>
          <view>
            <view class="title">审批人</view>
            <view class="inputs select" @click="openSelect">
              <view class="name">{{approvePopple}}</view>
              <u-icon
                    name="arrow-down-fill"
                    class="icons"
                    color="#2a82e4"
                    size="12"
                ></u-icon>
            </view>
          </view>
        </view>
        <view class="pop-pdb"></view>
        <view class="footer">
          <view class="foot-btn cancle btns2" @click="closePop2">取消</view>
          <view class="foot-btn save btns2" @click="saveEnter">保存</view>
        </view>
      </view>
      <u-picker
          title="请选择"
          :show="pickerShow"
          :columns="[staffList.sysUserList]"
          keyName="label"
          @confirm="pickerConfirm"
          @cancel="pickerCancel"
        ></u-picker>
    </u-popup>
	<u-modal :show="modelShow" showCancelButton :closeOnClickOverlay="true" @close="modelShow=false" title="发起盖章确认" confirmText="需要" cancelText="不需要" @confirm="confirmSign" @cancel="cancelSign" content='您的审批流程已审批完成,请确认是否需要发起盖章流程?'></u-modal>
	<suspensionTabs :arrLength="1" @tabsExamine="tabsExamine" v-show="showData.taskFinishVoList&&showData.taskFinishVoList.length" :key="nowTab"></suspensionTabs>
	<!-- <processForm2 style="position: fixed;z-index:-999" ref="processForm2" :tableData="tableHtml2" @sendGzipTableHtml="sendGzipTableHtml2" v-if="todo!=2"></processForm2> -->
	<u-modal :show="modshow" title="提示" :content='modcontent' :showCancelButton="true" :showConfirmButton="showConfirmButton" :confirmText="confirmText" @confirm="modconfirm" @cancel="modshow=false"></u-modal>
	<addPopup @submit="submit2" :app-title="'签名'" ref="addPopup"></addPopup>
	</view>
</template>

<script>
import approvePopup from "../../../components/approve-popup/approve-popup";
import processForm from "../../../components/process-form/process-form.vue";
import processForm2 from "../../../components/process-form/process-form2.vue";
import signDetail from "../../../components/signDetail/signDetail.vue";
import suspensionTabs from "../../../components/suspension-tabs/suspension-tabs.vue";
import tableForm from '../../../components/table-form/table-form.vue';
import addPopup from "../../../components/approve-popup/add-popup.vue";
export default {
	components: { approvePopup, processForm ,signDetail,suspensionTabs,processForm2,tableForm,addPopup},
	data() {
		return {
			rowData: {}, // pkId流程
			appShow: false, // 控制处理弹框
			bottomShow: true,
			nextAppRole: "",
			approvalOptions: [],
			staffList: {}, // 员工列表数据
			idx: 0,
			tableIndex: 0,
			tabList: [
				{
					name: "基础信息",
					idx: 0
				},
				{
					name: "盘点物料",
					idx: 2
				},
				{
					name: "附件",
					idx: 3
				},
				{
					name: "审批记录",
					idx: 4
				}
			],
			current: 0,
			show1: false, // 控制tabs下拉
			showData: {}, // 总体数据
			workflowTableList: [],
			tableHtml: [],
			tableHtml2: [],
			user: {},
			show: true ,// 控制表格可不可以编辑
            inventoryCodeList: [ "草稿", "审批中", "已完成", "已拒绝", "待签章", "签章中", "签章已完成", ],
            approvePopple:'',
            approvePoppleId:'',
             pickerShow: false,
             popShow2:false,
			 type:1,
			 approverList:[],
      		sendApproverList:[],
			isSet:false,
			nowTab:1,
			modelShow:false,
			todo:0,
			sendData:{},
			modshow:false,
      		modcontent:'',
      		showConfirmButton:false,
      		confirmText:"",
			appShow2:false,
			unique:"",
			approType:0,
			fileList:[]
		};
	},
	onLoad(option) {
		// 处理表格编辑问题
		this.type=option.type-0
		if(option.todo){
			this.todo=option.todo - 0
		}else{
			this.todo=0
		}
		if(this.todo==2){
			let data=JSON.parse(option.row)
			this.$api.getDoneTaskDetail(data).then(res=>{
      		  if(res.code===200){
      		    this.showData=res.data.engMatOrderInventoryVo
				if(['5','6'].includes(this.showData.inventoryCode)){
            	  this.nowTab=0
            	}else{
            	  this.nowTab=1
            	}
				this.workflowTableList = this.showData.workflowTableList ? JSON.parse(JSON.stringify(this.showData.workflowTableList)) : [];
				console.log(this.workflowTableList);
				if (this.workflowTableList.length) {
					let tableArr = this.workflowTableList.map((item, index) => ({ name: item.tableName, idx: 1, tableInd: index }));
					this.tabList.splice(1, 0, ...tableArr);
				}
      		  }else{
      		    uni.showToast({title:res.msg,icon:"none"})
      		  }
      		})
		}else{
			this.getData(option.pkId);
			this.user = uni.getStorageSync("user");
			this.user.pkId = this.user.userId;
		}
	},
	methods: {
		signUrlImg(e) {
				console.log("22222222222222")
				console.log(e)
				console.log(this.tableHtml2)
				console.log("22222222222222")
				// this.$refs.processForm2.signUrlImg(e,this.showData.sysRoleId,this.showData.roleId)



				this.tableHtml.forEach(item => {
					item.tableHtml = this.utils.unzip(item.tableHtml);
					if (item.tableHtml instanceof Array) {} else {
						item.tableHtml = JSON.parse(item.tableHtml);
					}
				});
				if (this.tableHtml.length > 0) {
					this.tableHtml.forEach(item => {
						if (item.tableHtml != undefined && item.tableHtml != null && item.tableHtml.length != 0) {
							item.tableHtml.forEach(items => {
								items.arr.forEach(i => {
									if (i.attributeTypes == 3) {
										if (i.signatureDate.signer == this.showData.sysRoleId || i.signatureDate.signer == this
											.showData.roleId) {
											i.signatureDate.img = e;
										}
									}
								});
							});

						}

					});
					this.tableHtml.forEach(item => {
            		if (item.tableHtml instanceof Array) {
            		  	item.tableHtml = JSON.stringify(item.tableHtml);
						item.tableHtml = this.utils.zip(JSON.stringify(item.tableHtml));
            		} else {
					  }
					});
				}
				this.tableHtml2 = this.tableHtml

			},
		getApproType(type){
				this.approType = type
				this.$refs.addPopup.noApprove()
			},
			submit2(e){
				if(e){
					this.unique = e.unique
				}else{
					this.unique = ""
				}
				if(this.approType==0){
					this.$api.recallOrderInventory({pkId:this.showData.pkId,unique:this.unique}).then(res => {
							if (res.code === 200) {
								uni.showToast({
									title: "撤回成功",
									icon: "success"
								});
								this.getDetail2()
							} else {
								uni.showToast({
									title: res.msg,
									icon: "none"
								});
							}
						});
				}else if(this.approType==1){
					this.signRecall()
				}
			},
		delBtn(){
			uni.showModal({
      		  title: '提示',
      		  content: '确定删除？',
      		  showCancel: true,
      		  success: ({ confirm, cancel }) => {
      		    if(confirm){
      		      uni.showLoading({mask:true})
      		      this.$api.delOrderInventory({pkId:this.showData.pkId}).then(res=>{
      		        uni.hideLoading()
      		        if(res.code===200){
      		            uni.showToast({ title: "删除成功", icon: "success" });
      		            this.getDetail2()
      		          }else{
      		            uni.showToast({ title: res.msg, icon: "none" });
      		          }
      		        })
      		    }
      		  }
      		})
		},
		getDetail(){
    	  this.getData(this.showData.pkId,2)
		  let pages = getCurrentPages()
      	let prevPage = pages[pages.length - 3]; // 上一页面实例
      	prevPage.$vm.resh() // 调用上一页 定义的方法
    	},
		getDetail2(){
    	//   this.getData(this.showData.pkId,2)
		  let pages = getCurrentPages()
      	let prevPage = pages[pages.length - 2]; // 上一页面实例
		console.log(prevPage);
      	prevPage.$vm.resh() // 调用上一页 定义的方法
		uni.navigateBack()
    	},
		getDetail3(){
    	//   this.getData(this.showData.pkId,2)
		  let pages = getCurrentPages()
      	let prevPage = pages[pages.length - 3]; // 上一页面实例
      	prevPage.$vm.resh() // 调用上一页 定义的方法
		uni.navigateBack({delta:2})
    	},
		signRecall(){
			this.$api.withdrawSeal({pkId:this.showData.sealPkId,unique:this.unique}).then(res=>{
        if(res.code===200){
          uni.showToast({title:"操作成功"})
          this.getDetail2()
        }else{
          uni.showToast({
              title: res.msg,
              icon: "none",
            });
        }
      })
		},
	goSign(){
      this.modelShow=true
    },
	tabsExamine() {
      console.log("流程图");
      uni.navigateTo({ url: "/pages/nodeCheck/flow?taskFinishVoList="+JSON.stringify(this.showData.taskFinishVoList) });
    },
	confirmSign(){
      uni.navigateTo({
          url: "/pages/signSend/sendSeal?type=2&bizId=" + this.showData.pkId,
        });
        this.modelShow=false
    },
    cancelSign(){
      console.log(1);
      this.$api.initiateSealProcess({bizType:2,fkBizId:this.showData.pkId,needSealStatus:0}).then(res=>{
        if(res.code===200){
          this.getDetail2()
          this.modelShow=false
        }else{
          uni.showToast({
              title: res.msg,
              icon: "none",
            });
        }
      })
    },
	modconfirm(){
      if(this.confirmText=='前往实名'){
        this.modshow=false
        uni.navigateTo({url:'/pages/certification/business-certification'})
      }else if(this.confirmText=='前往授权'){
        uni.showLoading({mask:true})
        this.$api.authorization("https://erp.jianwangkeji.cn/back.html").then(res => {
			uni.hideLoading();
			if (res.code == 200) {
				this.$store.commit("isEnterAuth", true);
            	this.modshow=false
				uni.navigateTo({
					url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl)),
				});
			} else {
				uni.hideLoading();
			}
		}).catch(err=>{
          uni.hideLoading();
        });
      }
    },
	getOrgSealState(){
		this.$api.getOrgSealState().then(res=>{
        if(res.code===200){
          if(res.data==1){
            uni.navigateTo({url:'/pages/signSend/sealApporval?pkId='+this.showData.sealPkId})
          }else{
            if(this.user.isMaster){
              if(res.data==0){
                this.modcontent='企业未实名'
                this.confirmText="前往实名"
              }else if(res.data==2){
                this.modcontent='E签宝授权已过期'
                this.confirmText="前往授权"
              }
              this.showConfirmButton=true
            }else{
              if(res.data==0){
                this.modcontent='企业未实名，请联系管理员进行实名'
              }else if(res.data==2){
                this.modcontent='企业授权已过期，请联系管理员进行授权'
              }
              this.showConfirmButton=false
            }
            this.modshow=true
          }
        }else{
          uni.showToast({title:res.msg,icon:"none"})
        }
      })
	},
		signappBtn(){
			if(this.showData.sealPersonStatus){
				this.getOrgSealState()
			}else{
			  uni.navigateTo({url:'/pages/signSend/sealApporval?pkId='+this.showData.sealPkId})
			}
		},
		checkNodes(item) {
    	  uni.navigateTo({
    	    url: "/pages/nodeCheck/nodeCheck?type=2&data=" + JSON.stringify(item),
    	  });
    	},
		previewLook(item) {
			console.log(this.$refs.approve);
			this.$refs.approve.previewUrl = item.fileUrl;
			this.$refs.approve.previewShow = true;
		},
		// 获取表格压缩后的数据
		getGzipTableHtml(tabledata) {
			this.tableHtml = tabledata;
			this.tableHtml2 = tabledata.filter(item=>item.convertPdfStatus);
			console.log("压缩后的表", this.tableHtml);
			this.sendData.workflowTableList=this.tableHtml
		},
		sendGzipTableHtml2(e) {
    	  this.tableHtml2 = e;
    	  this.tableHtml.forEach(item=>{
    	    this.tableHtml2.forEach(item2=>{
    	      if(item.fkTableId==item2.fkTableId){
    	        item.tablePdfUrl=item2.tablePdfUrl
    	      }
    	    })
    	  })
    	  this.sendData.workflowTableList=this.tableHtml
    	  console.log(this.sendData);
    	  this.projectExamine()
    	},
		// tab点击
		listSelet(item, index) {
			// 展开传值
			if (index !== undefined) {
				this.current = index;
			} else {
				this.current = item.index;
			}
			this.show1 = false;
			this.idx = item.idx;
			if (item.idx === 1) {
				this.tableIndex = item.tableInd;
			}
		},
		// 获取数据
		getData(id) {
			uni.showLoading({
				mask: true
			});
			this.$api.getConstruction2({ pkId: id, type: this.type }).then(res => {
				uni.hideLoading();
				if (res.code === 200) {
					this.showData = res.data;
					this.isSet=!!res.data.settingApproveFlag
					if(['5','6'].includes(res.data.inventoryCode)){
            		  this.nowTab=0
            		}else{
            		  this.nowTab=1
            		}
					this.fileList = []
					this.showData.fileList.forEach(item=>{
                    item.prodReProcessFileList.forEach(item2=>{
                      if(item2.deleteFlag){
                        this.fileList.push(item2)
                      }
                    })
                   })
					this.workflowTableList = JSON.parse(JSON.stringify(this.showData.workflowTableList)) ? this.showData.workflowTableList : [];
					if (this.workflowTableList.length) {
						let tableArr = this.workflowTableList.map((item, index) => ({ name: item.tableName, idx: 1, tableInd: index }));
						this.tabList.splice(1, 0, ...tableArr);
					}
				}
			});
		},
		// 汉堡点击展开tabs
		hamburg() {
			this.show1 = true;
		},
		shut() {
			this.show1 = false;
		},
		getOrderInventoryWorkflowDetail(){
			let data={warehouseId:this.showData.fkWarehouseId,pkId:this.showData.pkId}
			this.$api.getOrderInventoryWorkflowDetail(data).then(res=>{
				if(res.code===200){
          if(res.data){
            res.data.workflowNodeDTOS.forEach(item => {
              if (item.nodeType == 2) {
                item.prodSysRoleVo = item.prodSysRoleVo == null ? { selectedUserId: "", sysUserList: [] } : item.prodSysRoleVo;
                item.prodSysRoleVo.selectedUserId = item.prodSysRoleVo.selectedUserId == null ? "" : item.prodSysRoleVo.selectedUserId;
              }
            });
            this.approverList = res.data;
			uni.navigateTo({ url: '/pages/setApprover/setoneApprover?noReturn=1&row='+JSON.stringify(this.approverList)  });
          }else{
            this.approverList= {
              workflowNodeDTOS: [
                {
                  prodSysRoleVo: {
                    sysUserList: []
                  }
                }
              ]
            }
			uni.showToast({title:"未设置流程模板",icon:"none"})
          }
        }
			})
		},
		// 获取下一审批岗位和审批人列表
		getStaff() {
			uni.showLoading({
				mask: true
			});
			this.$api.getStaff2().then(res => {
				uni.hideLoading();
				if (res.code === 200) {
					if(res.data){
						this.bottomShow=true
						this.staffList = res.data;
						this.staffList.sysUserList.forEach(item => {
							item.value = item.pkId;
							item.label = item.userName;
						});
					}else{
						this.bottomShow=false
						this.staffList={}
					}
				} else {
					uni.showToast({ icon: "none", title: res.msg });
				}
			});
		},
		// 处理按钮
		appBtn() {
			this.$refs.formHtml.gzipTable();
			// this.getStaff();
			this.appShow = true;
		},
		closeApp() {
			this.appShow = false;
		},
		projectExamine(){
			// this.sendData.workflowTableList=this.tableHtml
			this.$api.processFlow2(this.sendData) .then(res => {
					uni.hideLoading();
					if (res.code === 200) {
						uni.showToast({ icon: "success", title: this.sendData.approveStatus==0?"驳回成功":'审批成功', });
						this.getDetail2()
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		reject(e) {
			console.log(e);
			let data = {
				approveStatus: 0,
				pkId: this.showData.pkId,
				approveComment: e.opinion ,// 审批意见
				signUrl:e.signUrl,
        		fileList:e.fileList,
        		// workflowTableList:this.tableHtml,
			};
			data.approveComment = data.approveComment ? data.approveComment : "审批不通过";
			if(e.unique){
					data.unique = e.unique
				}
			uni.showLoading({ mask: true });
			this.sendData=data
			this.projectExamine()
			// this.$refs.processForm2.tableToImg()
		},
		submit(e) {
			console.log(e);
			if(e.signUrl){
				this.$refs.formHtml.signUrl(e.signUrl,e.signerId)
			}
			let data = {
				approveStatus: 1,
				pkId: this.showData.pkId,
				approveComment: e.opinion, // 审批意见
				approveId: e.fkApproverId,
				fileList: e.fileList,
				signUrl: e.signUrl,
				workflowTableList: this.tableHtml // workflowTableList
			};
			data.approveComment = data.approveComment ? data.approveComment : "审批通过";
			if(e.unique){
					data.unique = e.unique
				}
			console.log(data.approveComment);
			uni.showLoading({ mask: true });
			this.sendData=data
			this.projectExamine()
			// this.$refs.processForm2.tableToImg()
			// this.$api
			// 	.processFlow2(data)
			// 	.then(res => {
			// 		uni.hideLoading();
			// 		if (res.code === 200) {
			// 			uni.showToast({
			// 				icon: "success",
			// 				title: "审批成功",
			// 				mask: true,
			// 				success: () => {
			// 					this.closeApp();
			// 					setTimeout(() => {
			// 						uni.navigateBack();
			// 					}, 2000);
			// 				}
			// 			});
			// 		} else {
			// 			uni.showToast({ icon: "none", title: res.msg });
			// 		}
			// 	})
			// 	.catch(err => {
			// 		uni.hideLoading();
			// 	});
		},
		// 下载
		downLoad(url) {
			const downLoadTask = uni.downloadFile({
				url: url, //仅为示例，并非真实的资源
				success: res => {
					if (res.statusCode === 200) {
						console.log("下载成功", res);
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: function(res2) {
								// var savedFilePath = res.savedFilePath;
								console.log(res2);
								uni.showToast({
									title: "已保存至" + res2.savedFilePath
								});
								setTimeout(() => {
									uni.openDocument({
										filePath: res2.savedFilePath,
										success: result => {}
									});
								}, 1000);
							}
						});
					}
				}
			});
		},
        edit(){
            uni.navigateTo({ url: '/pages/material/inventory/addCheck?type=2&obj='+JSON.stringify(this.showData) })
        },
        submitBtn(){
			uni.navigateTo({url:'/pages/material/inventory/checkSend?pkId='+this.showData.pkId})
			// this.$refs.formHtml.gzipTable();
			// this.getOrderInventoryWorkflowDetail()
            // this.getStaff();
            // this.openPop2()
        },
		prevDateFun(obj) {
         obj.forEach(item=>item.bizType=2)
		 this.sendApproverList =obj
		console.log(obj, 'B页面返回过来的');
		// this.approverList.workflowNodeDTOS.forEach(item => {
        // obj.forEach(item2=>{
        //     if (item.pkId===item2.currentNodeId) {
        //         item.prodSysRoleVo.selectedUserId=item2.fkApproverId
        //     }
        // })
        // })
        this.isSet=true
		this.saveEnter(this.sendApproverList)
	},
        recall(){
            uni.showModal({
				title: "提示",
				content: "是否撤回该盘点单？",
				showCancel: true,
				cancelText: "取消",
				confirmText: "撤回",
				success: res => {
					if (res.confirm) {
						this.getApproType(0)
					} else {
						// 否则点击了取消
					}
				}
			});
        },
        openPop2() {
          this.popShow2 = true;
        },
        closePop2() {
          this.popShow2 = false;
        },
        openSelect(){
             this.pickerShow = true;
        },
        pickerConfirm(e) {
          if (e.value.length && e.value[0]) {
            this.approvePopple = e.value[0].label;
            this.approvePoppleId = e.value[0].value;
          }else{
            this.approvePopple =''
            this.approvePoppleId =''
          }
          this.pickerCancel()
        },
        pickerCancel() {
          this.pickerShow = false;
        },
        saveEnter(prodWorkflowUserAddList){
            // if(!this.approvePoppleId){
            //     return uni.showToast({title:'请选择审批人',icon:'none'})
            // }
			uni.showLoading({mask:true})
          let data={...this.showData,engMatOrderInventoryDetailsAdds:this.showData.engMatOrderInventoryDetailsVos,approveStatus:1,prodWorkflowUserAddList}
		  data.workflowTableList=this.tableHtml
          delete data.engMatOrderInventoryDetailsVos
          this.$api
          .updateOrderInventory(data)
          .then(res => {
            uni.hideLoading()
            if (res.code === 200) {
			  uni.showToast({title:'编辑成功'});
              this.getDetail3()
            } else {
              uni.showToast({title:res.msg,icon:'none'});
            }
          })
          .catch(err => {
            uni.hideLoading()
          });
        }
	}
};
</script>

<style lang="scss">
.workflow {
  display: flex;
  .workflow-left{
    width: 60rpx;
    .tabs-item {
      display: flex;
      align-items: center;
      width: 60rpx;
      padding: 30rpx 0;
      border: 2rpx solid #d7d7d7;
      // border-top: 0;
      // border-right: 0;
      writing-mode: vertical-lr;
      cursor: pointer;
    }
    .currentTab {
      background-color: #81d3f8;
      color: #fff;
    }
  }
  .workflow-right{
    flex: 1;
  }
  .workflow-right2{
    width: calc(100% - 60rpx);
  }
}
.content {
	position: relative;
	padding-top: 90rpx;
}
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
// 详情
.card {
  background: #fff;
  width: 750rpx;
  height: calc( 1306rpx - 242rpx);
  // border-left: 8rpx solid #dddddd;
  // padding: 24rpx 40rpx;
  margin-top: 2rpx;

  .list-item {
    height: 80rpx;
    line-height: 80rpx;
    font-size: 28rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
	&:first-child{
		border-top: 1px solid rgba(238, 238, 238, 1);
	}
	text:first-child{
		display: inline-block;
		min-width: 196rpx;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 40rpx;
		border-right: 1px solid rgba(238, 238, 238, 1);
		text-align: justify;
		text-justify: distribute-all-lines;
		text-align-last: justify;
	}
    .item {
	  display: inline-block;
	  // width: 414rpx;
      padding-left: 10rpx;
      color: #79859a;
    }
  }
}
// 工程材料表
.uni-table-th,
.uni-table-td {
	font-size: 24rpx !important;
}
// 附件
.accessory {
	background-color: #fff;
	padding: 0 30rpx 44rpx;
	margin-bottom: 8rpx;
	font-size: 28rpx;
	.acce-item {
		position: relative;
		height: 90rpx;
		line-height: 90rpx;
		padding: 0 30rpx;
		display: flex;
		color: #8f99ab;
		> text {
			padding-left: 12rpx;
		}
		.ctime {
			font-size: 24rpx;
			flex: 1;
			text-align: right;
		}
		.checkBtn {
			position: absolute;
			right: 20rpx;
		  	color: #1576e6;
		}
	}
	// 列表文件
	.acce-list {
		height: 100rpx;
		line-height: 100rpx;
		padding-left: 30rpx;
		display: flex;
		flex-wrap: wrap;
		position: relative;
		.file-icon {
			margin-right: 20rpx;
		}
		> text {
			flex: 1;
			border-bottom: 1px solid #eeeeee;
		}
		.fileName {
  		  width: 500rpx;
		  overflow: hidden; /*超出部分隐藏*/
  		white-space: nowrap; /*禁⽌换⾏*/
  		text-overflow: ellipsis; /*省略号*/
  		}
		.downLoad {
			position: absolute;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
		}
	}
	// 审批记录留言
	.record {
		padding: 0 0 32rpx 30rpx;
		display: flex;
		align-items: flex-start;
		position: relative;
		.file-icon {
			margin-right: 20rpx;
		}
		> text {
			flex: 1;
			line-height: 1.4;
			border-bottom: 1px solid #eeeeee;
			padding-bottom: 34rpx;
		}
		.downLoad {
			position: absolute;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
		}
	}
}
.footer {
  position: fixed;
  bottom: 0;
  display: flex;
  width: 750rpx;
  height: 100rpx;
  z-index: 10;
  .btns {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 28rpx;
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
.popup2 {
  position: relative;
  width: 750rpx;
  max-height: 1200rpx;
  background-color: #2a82e4;
  border-radius: 20rpx;
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
  .popup2-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    // line-height: 80rpx;
    padding: 0 20rpx;
    color: #fff;
    font-size: 28rpx;
  }
  .popup2-content {
    max-height: 1020rpx;
    padding-top: 40rpx;
    overflow: auto;
    background-color: #f7f7ff;
    // padding: 0 20rpx;
    border-radius: 20rpx 20rpx 0 0;
    .popup2-content-head {
      height: 60rpx;
      line-height: 60rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      background: linear-gradient(
        90deg,
        rgba(230, 235, 255, 1) 0%,
        rgba(255, 255, 255, 1) 100%
      );
    }
    .info-item {
      padding-bottom: 20rpx;
      .imgList {
        display: flex;
        flex-wrap: wrap;
        padding: 10rpx 20rpx;
        image {
          width: 350rpx;
          margin-bottom: 10rpx;
        }
        :nth-child(2n) {
          margin-left: 10rpx;
        }
      }
    }
    .remark {
      max-height: 400rpx;
      overflow: auto;
    }
    .u-form-item {
      padding: 0 20rpx;
      border-bottom: 1px solid #eee;
    }
  }
  .pop-pdb {
    height: 100rpx;
    // background-color: #f7f7ff;
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 100rpx;
    background-color: #f7f7ff;
    border-radius: 0 0 20rpx 20rpx;
    .foot-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80rpx;
      font-size: 28rpx;
    }
    .btns1 {
      width: 210rpx;
    }
    .btns2 {
      width: 300rpx;
    }
    .cancle {
      background-color: #eeeeee;
      color: #aaaaaa;
    }
    .del {
      color: #fff;
      background-color: red;
    }
    .save {
      color: #fff;
      background-color: #2a82e4;
    }
  }
}
.appimg{
     width: 40rpx;
     margin-right: 8rpx;
}
</style>
