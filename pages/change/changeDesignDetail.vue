<template>
	<view class="wrapper">
		<u-navbar leftText="设计变更" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="bg"></view>
		<view class="workflow">
			<!-- [5,6].includes(showData.changesStatus) -->
			<view class="workflow-left" v-if="[5,6].includes(showData.changesStatus)">
				<view class="tabs-item" :class="{ currentTab: nowTab === 0 }" @click="nowTab = 0">盖章详情</view>
				<view class="tabs-item" :class="{ currentTab: nowTab === 1 }" @click="nowTab = 1">业务详情</view>
			</view>
			<!-- class="workflow-right" -->
			<view
				:class="{'workflow-right':![5,6].includes(showData.changesStatus),'workflow-right2':[5,6].includes(showData.changesStatus)}">
				<view class="pad"></view>
				<view v-show="nowTab===0" v-if="[5,6].includes(showData.changesStatus)">
					<signDetail :signDetail="showData.sealBusinessVo" :key="nowTab"></signDetail>
				</view>
				<view v-show="nowTab===1">
					<view class="sticky" :class="{'sticky-left':[5,6].includes(showData.changesStatus)}" :key="nowTab">
						<u-tabs :list="tabList" :current="current" @change="currentChange" :scrollable="!!workflowTableList.length"
							:activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}">
							<view slot="right" class="hamburg" @tap="hamburg" v-if="!!workflowTableList.length"><u-icon name="list"
									size="21" bold></u-icon></view>
						</u-tabs>
						<view class="pull-down" v-show="tabShow">
							<text class="item-tab" :class="index == current ? 'action' : ''" v-for="(item, index) in tabList"
								:key="index" @click="listSelet(item, index)">{{ item.name }}</text>
							<!-- 箭头 -->
							<u-icon name="arrow-up" color="#dddddd" size="20" class="arrow-up" @click="shut"></u-icon>
						</view>
					</view>
					<view>
						<view class="detail" v-show="idx === 0"
							:style="{width:[5,6].includes(showData.changesStatus)?'710rpx':'750rpx'}">
							<tableForm v-show="idx == 0" :pageHeight="false" :pageMr="false" :emptyShow="false" :list="[
							{name:'项目名称',value:showData.fkProjectName,show:![4,5].includes(user.orgType)},
							{name:'标段名称',value:showData.fkBidProjectName,show:user.orgType!=5},
							{name:'变更名称',value:showData.changesName,show:true},
							{name:'变更申请日期',value:showData.createTime,show:true},
							{name:'变更申请发起单位',value:showData.fkOrgName,show:true},
							{name:'变更申请发起人',value:showData.createUserName,show:true},
							]">
							</tableForm>
							<!-- <view class="detail-item">
				<view class="card">
                  <view class="list-item" v-if="![4,5].includes(user.orgType)"
                    ><text class="fw-700">项目名称</text
                    ><text class="detail-color item">{{
                      showData.fkProjectName
                    }}</text></view
                  >
                  <view class="list-item" v-if="user.orgType!=5"
                    ><text class="fw-700">标段名称</text
                    ><text class="detail-color item">{{
                      showData.fkBidProjectName
                    }}</text></view
                  >
                  <view class="list-item"
                    ><text class="fw-700">变更名称</text
                    ><text class="detail-color item">{{
                      showData.changesName
                    }}</text></view
                  >
                  <view class="list-item"
                    ><text class="fw-700">变更申请日期</text
                    ><text class="detail-color item">{{
                      showData.createTime
                    }}</text></view
                  >
                  <view class="list-item"
                    ><text class="fw-700">变更申请发起单位</text
                    ><text class="detail-color item">{{
                      showData.fkOrgName
                    }}</text></view
                  >
                  <view class="list-item"
                    ><text class="fw-700">变更申请发起人</text
                    ><text class="detail-color item">{{
                      showData.createUserName
                    }}</text></view
                  >
                </view>
              </view> -->
							<view class="detail-item">
								<view class="left bgc2"></view>
								<view class="right bgc4">
									<view class="mb-20">
										<view class="item-title">·变更类型：</view>
										<view class="hiddenView">{{
                      showData.fkWorkflowTemplateName
                    }}</view>
									</view>
									<view class="mb-20">
										<view class="item-head">
											<view class="item-title">·变更原因：</view>
											<view class="custom-style" @click="checkDetail('变更原因', showData.changesReason)">查看明细</view>
										</view>
										<view class="hiddenView">{{ showData.changesReason }}</view>
									</view>
									<view class="mb-20">
										<view class="item-head">
											<view class="item-title">·变更理由：</view>
											<view class="custom-style" @click="checkDetail('变更理由', showData.changesPlan)">查看明细</view>
										</view>
										<view class="hiddenView">{{ showData.changesPlan }}</view>
									</view>
									<view>
										<view class="item-head">
											<view class="item-title">·预估成本：</view>
											<view class="custom-style" @click="checkDetail('预估成本', showData.changesCost)">查看明细</view>
										</view>
										<view class="hiddenView">{{ showData.changesCost }}</view>
									</view>
								</view>
							</view>
							<view class="detail-item" v-for="(item, index) in taskFinishSignVos" :key="index">
								<view class="left bgc3"></view>
								<view class="right bgc5">
									<view class="mb-20">
										<view class="item-title">·审批意见：</view>
										<view class="item-reason">{{ item.comment }}</view>
										<view class="item-files" v-for="(item2, index) in item.fileList" :key="index">
											<u-icon class="file-icon" name="file-text" size="28"></u-icon>
											<view class="file-name text-hidden">{{
                        item2.fileName
                      }}</view>
											<view class="downLoad" @click="downLoad(item2.fileUrl)">下载</view>
										</view>
										<h4 class="tar lh-36 mr-20">{{ item.orgName }}</h4>
										<view class="tar mr-20">
											<image :src="item.signUrl" mode="widthFix" class="signImg" />
										</view>
										<view class="tar lh-36 mr-20">{{ item.assignee }}</view>
										<view class="tar lh-36 mr-20">审批时间：{{ item.endTime }}</view>
									</view>
								</view>
							</view>
						</view>
						<view v-show="idx === 1" style="width:750rpx;overflow:auto">
							<processForm :tableData="workflowTableList" :tableIndex="tableIndex"
								@sendGzipTableHtml="sendGzipTableHtml" :disabled="!showData.changeStatus&&todo!=1" ref="processForm">
							</processForm>
						</view>
						<!-- <view v-show="idx === 2" v-html="flow" class="flow"></view> -->
						<view v-show="idx === 3">
							<view class="fileList">
								<view class="fileList-item" v-for="(item, index) in accessoryList" :key="index">
									<view class="upload comonView">
										<view>{{ item.userName }}</view>
										<view>{{ item.time }}</view>
									</view>
									<view class="upload-files comonView" v-for="(item2, index2) in item.prodReProcessFileList"
										:key="index2">
										<u-icon class="file-icon" name="file-text" size="28"></u-icon>
										<view class="file-name text-hidden">{{
                      item2.fileName
                    }}</view>
										<view class="downLoad" @click="downLoad(item2.fileUrl)">下载</view>
									</view>
									<!-- <view class="file-downLoad" @click="downLoad">下载</view> -->
								</view>
							</view>
						</view>
						<view v-show="idx === 4">
							<view class="app-record">
								<view class="app-record-item" v-for="(item, index) in approvalRecord" :key="index">
									<view class="item-header">
										<view style="display:flex;align-items:center">
											<u-icon name="account" color="#8f99ab" size="24"></u-icon>
											<view>{{ item.approver }}</view>
										</view>
										<view class="checkBtn" @click="checkNodes(item)" v-if="item.approveStatus !== 2">查看</view>
									</view>
									<view class="item-content">
										<view class="item-content-head">
											<!-- <u-icon class="icons" name="file-text" size="28"></u-icon> -->
											<image class="appimg" src="../../static/image/audit.png" mode="widthFix" />
											<view>发表：</view>
											<view>{{ item.approveTime }}</view>
										</view>
										<view class="contents">{{ item.approveComment }}</view>
									</view>
									<view class="item-files">
										<view class="files-item bdb" v-for="(item2, index2) in item.fileList" :key="index2">
											<u-icon class="file-icon" name="file-text" size="28"></u-icon>
											<view class="file-name text-hidden">{{
                        item2.fileName
                      }}</view>
											<!-- <view class="downLoad" @click="downLoad(item2.fileUrl)"
                        >下载</view
                      > -->
										</view>
									</view>
								</view>
							</view>
						</view>
						<suspensionTabs :arrLength="1" @tabsExamine="tabsExamine" v-show="nowTab==1&&showData.changesStatus!=0"
							:key="nowTab"></suspensionTabs>
					</view>
					<!-- :class="{ content: receiveData.handleStatus === 0 }" -->
					<!--  -->
					<!-- <view class="btn" @click="appBtn" v-if="showData.changeStatus" >处理</view >
          <view class="btn" @click="goSign" v-if="showData.sealStatus">{{showData.sealStatus==1?'发起签章':'重新发起签章'}}</view> -->
				</view>
				<view class="pdb"></view>
				<view class="footer-btn" v-if="!todo"
					:class="{'workflow-right':![5,6].includes(showData.changesStatus),'workflow-right2':[5,6].includes(showData.changesStatus)}">
					<view class="footer-btns primary" @click="appBtn" v-if="showData.changeStatus">处理</view>
					<view class="footer-btns error" v-if="showData.revokeStatus" @click="getApproType(0)">撤回</view>
					<view class="footer-btns error" v-if="showData.sealWithdrawStatus" @click="getApproType(1)">撤回</view>
					<view class="footer-btns primary" v-if="showData.sealApproveStatus" @click="sealApprove">
						{{showData.sealPersonStatus==1?'盖章':'审批'}}
					</view>
					<view class="footer-btns primary" @click="goSign" v-if="showData.sealStatus">
						{{showData.sealStatus==1?'发起签章':'重新发起签章'}}
					</view>
					<view class="footer-btns primary" @click="save" v-if="showData.relaunchStatus">重新发起</view>
					<view class="footer-btns primary" @click="save" v-if="showData.editStatus">编辑</view>
					<view class="footer-btns error" @click="del" v-if="showData.deleteStatus">删除</view>
				</view>
				<view class="btn" v-if="todo==1" @click="appBtn">处理</view>
			</view>
		</view>
		<!-- <processForm2 style="position: relative;z-index:-999" ref="processForm2" :tableData="tableHtml2"
			@sendGzipTableHtml="sendGzipTableHtml2"></processForm2> -->
		<!-- <view class="footer" v-if="receiveData.handleStatus!==1"><u-button type="primary" text="处理" @click="appBtn"></u-button></view> -->
		<!-- 查看明细弹框 -->
		<u-popup :show="reasonShow" mode="center" @close="closeReason" round="10">
			<view class="reasonPop">
				<view class="reasonPop-header">
					{{ popTitle }}
					<u-icon @click="closeReason" class="reasonPop-closeBtn" name="close-circle" size="18"></u-icon>
				</view>
				<view class="reasonPop-content">
					<view class="reasonPop-reason">{{ popReason }}</view>
				</view>
			</view>
		</u-popup>
		<approvePopup :app-show="appShow" :approver-show="bottomShow" :approver-name="nextAppRole"
			:approver-list="approvalOptions" @close="closeApp" @reject="reject" @submit="submit" :app-title="'审批'"
			:tableData="workflowTableList" :sysRoleId="showData.sysRoleId" :roleId="showData.roleId" :oftenSign="true"
			@signUrlImg="signUrlImg" :getFiles="fileList"></approvePopup>

		<u-modal :show="modelShow" :closeOnClickOverlay="true" @close="modelShow=false" showCancelButton title="发起盖章确认"
			confirmText="需要" cancelText="不需要" @confirm="confirmSign" @cancel="cancelSign"
			content='您的审批流程已审批完成,请确认是否需要发起盖章流程?'></u-modal>
		<u-modal :show="delShow" :closeOnClickOverlay="true" @close="delShow=false" showCancelButton title="删除确认"
			confirmText="是" cancelText="否" @confirm="confirmDel" @cancel="delShow=false" content='是否删除该变更?'></u-modal>
		<u-modal :show="modshow" title="提示" :content='modcontent' :showCancelButton="true"
			:showConfirmButton="showConfirmButton" :confirmText="confirmText" @confirm="modconfirm"
			@cancel="modshow=false"></u-modal>
		<addPopup @submit="submit2" :app-title="'签名'" ref="addPopup"></addPopup>
	</view>
</template>

<script>
	import approvePopup from "../../components/approve-popup/approve-popup";
	import processForm from "../../components/process-form/process-form.vue";
	import processForm2 from "../../components/process-form/process-form2.vue";
	import suspensionTabs from "../../components/suspension-tabs/suspension-tabs.vue";
	import signDetail from "../../components/signDetail/signDetail.vue";
	import tableForm from "../../components/table-form/table-form.vue";
	import addPopup from "../../components/approve-popup/add-popup.vue";
	export default {
		components: { approvePopup, processForm, suspensionTabs, signDetail, processForm2, tableForm, addPopup },
		data() {
			return {
				tabList: [
					{ name: "变更详情", idx: 0 },
					// { name: "流程图", idx: 2 },
					{ name: "附件", idx: 3 },
					{ name: "审批记录", idx: 4 },
				],
				current: 0,
				tableIndex: 0,
				idx: 0,
				showData: {},
				approvalRecord: [],
				approveDetailList: [],
				reasonShow: false,
				popTitle: "",
				popContent: "",
				fileList: [],
				appShow: false,
				popReason: "",
				bottomShow: false,
				nextAppRole: "",
				approvalOptions: [],
				accessoryList: [],
				workflowTableList: [],
				receiveData: {},
				tabShow: false,
				flow: "",
				tableHtml: [],
				tableHtml2: [],
				nowTab: 1,
				modelShow: false,
				todo: 0,
				sendData: {},
				modshow: false,
				modcontent: "",
				showConfirmButton: false,
				confirmText: "",
				taskFinishSignVos: [],
				sup: false,
				delShow: false,
				appShow2: false,
				unique: "",
				approType: 0
			};
		},
		onLoad(options) {
			let type = options.type - 0;
			if (options.todo) {
				this.todo = options.todo - 0;
			} else {
				this.todo = 0;
			}
			this.sup = !!options.sup;
			if (this.todo == 2) {
				let data = JSON.parse(options.row);
				this.$api.getDoneTaskDetail(data).then(res => {
					if (res.code === 200) {
						this.showData = res.data.changeDesignDetailVo;
						if ([5, 6].includes(this.showData.changesStatus)) {
							this.nowTab = 0;
						} else {
							this.nowTab = 1;
						}
						this.approvalRecord = this.showData.approveDetailList ?
							this.showData.approveDetailList.map(item => ({ ...item })) : [];
						this.taskFinishSignVos = this.showData.taskFinishSignVos ?
							this.showData.taskFinishSignVos.map(item => ({ ...item })) : [];
						this.accessoryList = this.showData.fileList ?
							this.showData.fileList : [];
						this.workflowTableList = this.showData.workflowTableList ?
							JSON.parse(JSON.stringify(this.showData.workflowTableList)) : [];
						if (this.workflowTableList.length) {
							let tableArr = this.workflowTableList.map((item, index) => ({
								name: item.tableName,
								idx: 1,
								tableInd: index,
							}));
							this.tabList.splice(1, 0, ...tableArr);
						}
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});

			} else {
				this.getDesignDetail(options.pkId, type);
			}
		},
		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
			},
		},
		methods: {
			signUrlImg(e) {
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
						} else {}
					});
				}
				this.tableHtml2 = this.tableHtml;

			},
			getApproType(type) {
				this.approType = type;
				this.$refs.addPopup.noApprove();
			},
			submit2(e) {
				if (e) {
					this.unique = e.unique;
				} else {
					this.unique = "";
				}
				if (this.approType == 0) {
					this.withdraw();
				} else if (this.approType == 1) {
					this.signWithdraw();
				}
			},
			getDetail() {
				this.getDesignDetail(this.showData.pkId, 2);
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 3]; // 上一页面实例
				prevPage.$vm.resh(); // 调用上一页 定义的方法
			},
			getDetail2() {
				// this.getDesignDetail(this.showData.pkId,2)
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; // 上一页面实例
				prevPage.$vm.resh(); // 调用上一页 定义的方法
				uni.navigateBack();
			},
			save() {
				let obj = JSON.parse(JSON.stringify(this.showData));
				delete obj.approveDetailList;
				delete obj.sealBusinessVo;
				delete obj.taskFinishVoList;
				delete obj.workflowTableList;
				let url = "/pages/change/editDesign?row=" + JSON.stringify(obj);
				if (this.sup) {
					url += "&sup=1";
				}
				uni.navigateTo({ url });
			},
			confirmSign() {
				uni.navigateTo({
					url: "/pages/signSend/sendSeal?type=3&bizId=" + this.showData.pkId,
				});
				this.modelShow = false;
			},
			cancelSign() {
				console.log(1);
				this.$api.initiateSealProcess({ bizType: 3, fkBizId: this.showData.pkId, needSealStatus: 0 }).then(res => {
					if (res.code === 200) {
						this.getDetail2();
						this.modelShow = false;
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
						});
					}
				});
			},
			confirmDel() {
				let api = this.sup ? this.$api.delChangesDesign2 : this.$api.delChangesDesign;
				api({ changeId: this.showData.pkId }).then(res => {
					if (res.code === 200) {
						uni.showToast({ title: "操作成功" });
						this.getDetail2();
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
						});
					}
				});
			},
			del() {
				this.delShow = true;
			},
			withdraw() {
				console.log(this.showData.pkId);
				let api = this.sup ? this.$api.withdrawDesignActivity2 : this.$api.withdrawDesignActivity;
				api({ changeId: this.showData.pkId, unique: this.unique }).then(res => {
					if (res.code === 200) {
						uni.showToast({ title: "操作成功" });
						this.getDetail2();
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
						});
					}
				});
			},
			signWithdraw() {
				this.$api.withdrawSeal({ pkId: this.showData.sealPkId, unique: this.unique }).then(res => {
					if (res.code === 200) {
						uni.showToast({ title: "操作成功" });
						this.getDetail2();
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
						});
					}
				});
			},
			modconfirm() {
				if (this.confirmText == "前往实名") {
					this.modshow = false;
					uni.navigateTo({ url: "/pages/certification/business-certification" });
				} else if (this.confirmText == "前往授权") {
					uni.showLoading({ mask: true });
					this.$api.authorization("https://erp.jianwangkeji.cn/back.html").then(res => {
						uni.hideLoading();
						if (res.code == 200) {
							this.$store.commit("isEnterAuth", true);
							this.modshow = false;
							uni.navigateTo({
								url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl)),
							});
						} else {
							uni.hideLoading();
						}
					}).catch(err => {
						uni.hideLoading();
					});
				}
			},
			getOrgSealState() {
				this.$api.getOrgSealState().then(res => {
					if (res.code === 200) {
						if (res.data == 1) {
							uni.navigateTo({ url: "/pages/signSend/sealApporval?pkId=" + this.showData.sealPkId });
						} else {
							if (this.user.isMaster) {
								if (res.data == 0) {
									this.modcontent = "企业未实名";
									this.confirmText = "前往实名";
								} else if (res.data == 2) {
									this.modcontent = "E签宝授权已过期";
									this.confirmText = "前往授权";
								}
								this.showConfirmButton = true;
							} else {
								if (res.data == 0) {
									this.modcontent = "企业未实名，请联系管理员进行实名";
								} else if (res.data == 2) {
									this.modcontent = "企业授权已过期，请联系管理员进行授权";
								}
								this.showConfirmButton = false;
							}
							this.modshow = true;
						}
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			sealApprove() {
				if (this.showData.sealPersonStatus) {
					this.getOrgSealState();
				} else {
					uni.navigateTo({ url: "/pages/signSend/sealApporval?pkId=" + this.showData.sealPkId });
				}
			},
			goSign() {
				this.modelShow = true;
			},
			checkNodes(item) {
				uni.navigateTo({
					url: "/pages/nodeCheck/nodeCheck?type=1&data=" + JSON.stringify(item),
				});
			},
			tabsExamine() {
				console.log("流程图");
				uni.navigateTo({
					url: "/pages/nodeCheck/flow?taskFinishVoList=" + JSON.stringify(this.showData
						.taskFinishVoList)
				});
			},
			getDesignDetail(changeId, type) {
				console.log(type);
				uni.showLoading({
					mask: true,
				});
				// type查看类型：1 查看详情，2 处理查看详情
				let api = this.sup ? this.$api.getDetail : this.$api.getDesignDetail;
				api({ changeId, type })
					.then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							this.showData = res.data;
							if ([5, 6].includes(res.data.changesStatus)) {
								this.nowTab = 0;
							} else {
								this.nowTab = 1;
							}
							this.approvalRecord = this.showData.approveDetailList ?
								this.showData.approveDetailList.map(item => ({ ...item })) : [];
							this.taskFinishSignVos = this.showData.taskFinishSignVos ?
								this.showData.taskFinishSignVos.map(item => ({ ...item })) : [];
							if (type === 2) {
								// this.findNextUser(
								//   this.showData.fkWorkflowTemplateId,
								//   this.showData.fkFlowCaseId,
								//   this.showData.currentNodeId
								// );
								// deleteFlag为判定是否撤回后该审批人的附件
								this.accessoryList = this.showData.fileList ?
									this.showData.fileList : [];
                  this.fileList = []
								   this.showData.fileList.forEach(item=>{
                    item.prodReProcessFileList.forEach(item2=>{
                      if(item2.deleteFlag){
                        this.fileList.push(item2)
                      }
                    })
                   })
							} else {
								this.accessoryList = this.showData.fileList ?
									this.showData.fileList : [];
							}
							this.flow = res.data.hisProcessDiagram;
							// this.approveDetailList = this.showData.approveDetailList ? this.showData.approveDetailList.map(item => ({ ...item })) : [];
							this.workflowTableList = this.showData.workflowTableList ?
								this.showData.workflowTableList : [];
							if (this.workflowTableList.length) {
								let tableArr = this.workflowTableList.map((item, index) => ({
									name: item.tableName,
									idx: 1,
									tableInd: index,
								}));
								this.tabList.splice(1, 0, ...tableArr);
							}
							// this.workflowTableList.forEach((item) => {
							//   item.tableHtml = this.utils.unzip(item.tableHtml);
							//   if (item.tableHtml instanceof Array) {
							//   } else {
							//     item.tableHtml = JSON.parse(item.tableHtml);
							//   }
							// });
						} else {
							uni.showToast({
								title: res.msg,
								icon: "none",
							});
						}
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			findNextUser(workflowTemplateId, flowCaseId, currentNodeId) {
				this.$api
					.findNextUser({ workflowTemplateId, flowCaseId, currentNodeId })
					.then(res => {
						if (res.code === 200) {
							if (!res.data) {
								this.bottomShow = false;
							} else {
								this.approvalOptions = res.data.sysUserList ?
									res.data.sysUserList.map(item => ({
										...item,
										value: item.pkId,
										label: item.userName,
									})) : [];
								this.nextAppRole = res.data.roleName;
								this.bottomShow = true;
							}
						}
					});
			},
			currentChange(item) {
				console.log(item);
				this.current = item.index;
				this.idx = item.idx;
				if (item.idx === 1) {
					this.tableIndex = item.tableInd;
				}
			},
			// tab点击
			listSelet(item, index) {
				// 展开传值
				if (index !== undefined) {
					this.current = index;
				} else {
					this.current = item.index;
				}
				this.tabShow = false;
				this.idx = item.idx;
				if (item.idx === 1) {
					this.tableIndex = item.tableInd;
				}
			},
			// 汉堡点击展开tabs
			hamburg() {
				this.tabShow = !this.tabShow;
			},
			shut() {
				this.tabShow = false;
			},
			checkDetail(name, popReason) {
				this.popTitle = name;
				this.popReason = popReason;
				this.reasonShow = true;
			},
			closeReason() {
				this.reasonShow = false;
			},
			appBtn() {
				this.$refs.processForm.gzipTable();
				this.appShow = true;
			},
			closeApp() {
				this.appShow = false;
			},
			sendGzipTableHtml(e) {
				console.log(e);
				this.tableHtml = e;
				this.tableHtml2 = e.filter(item => item.convertPdfStatus);
				this.sendData.workflowTableList = this.tableHtml;
			},
			sendGzipTableHtml2(e) {
				this.tableHtml2 = e;
				this.tableHtml.forEach(item => {
					this.tableHtml2.forEach(item2 => {
						if (item.fkTableId == item2.fkTableId) {
							item.tablePdfUrl = item2.tablePdfUrl;
						}
					});
				});
				this.sendData.workflowTableList = this.tableHtml;
				console.log(this.sendData);
				this.projectExamine();
			},
			projectExamine() {
        // this.sendData.workflowTableList=this.tableHtml
				let api = this.sup ? this.$api.approvalProcess2 : this.$api.approvalProcess;
				api(this.sendData)
					.then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							uni.showToast({ icon: "success", title: "审批成功" });
							this.closeApp();
							this.getDetail2();
							// uni.navigateBack({
							//   delta: 1,
							// });
						} else {
							uni.showToast({ icon: "none", title: res.msg });
						}
					})
					.catch(err => {
						uni.hideLoading();
						// uni.showToast({icon:'none',title:'审批失败'})
					});
			},
			reject(e) {
				console.log(e);
				// let fileList = [...(this.showData.fileVoList ? this.showData.fileVoList.filter(item => item.deleteFlag) : []), ...e.fileList];
				let data = {
					// fileList,
					pkId: this.showData.pkId,
					approveStatus: 0,
					approveComment: e.opinion,
					signUrl: e.signUrl,
					fileList: [],
					// workflowTableList: this.tableHtml,
					// approveId: e.approverId
				};
				data.approveComment = data.approveComment ?
					data.approveComment :
					"审批不通过";
				if (e.unique) {
					data.unique = e.unique;
				}
				uni.showLoading({
					mask: true,
				});
				this.sendData = data;
				// this.$refs.processForm2.tableToImg()
				this.projectExamine();
				// this.closeApp();
			},
			submit(e) {
				console.log(e);
				if (e.signUrl) {
					this.$refs.processForm.signUrl(e.signUrl, e.signerId);
				}
				let fileList = [
					...(this.showData.fileVoList ?
						this.showData.fileVoList.filter(item => item.deleteFlag) : []),
					...e.fileList,
				];
				let data = {
					fileList,
					pkId: this.showData.pkId,
					approveStatus: 1,
					approveComment: e.opinion,
					approveId: e.approverId,
					signUrl: e.signUrl,
					workflowTableList: this.tableHtml
				};
				// if (!this.bottomShow) {
				//   delete data.approveId;
				// } else {
				//   if (!data.approveId) {
				//     return uni.showToast({ icon: "none", title: "请选择下一审批人" });
				//   }
				// }
				// if (!data.signUrl) {
				//   return uni.showToast({ icon: "none", title: "请签名" });
				// }
				data.approveComment = data.approveComment ?
					data.approveComment :
					"审批通过";
				if (e.unique) {
					data.unique = e.unique;
				}
				// 处理表格数据 压缩
				//   let table = this.workflowTableList;
				//   table.forEach((item) => {
				//     item.tableHtml = this.utils.zip(item.tableHtml);
				//   });
				//   data.workflowTableList = table;
				uni.showLoading({
					mask: true,
				});
				this.sendData = data;
				// this.$refs.processForm2.tableToImg()
				this.projectExamine();
				// this.$api
				//   .approvalProcess(data)
				//   .then((res) => {
				//     uni.hideLoading();
				//     if (res.code === 200) {
				//       uni.showToast({ icon: "success", title: "审批成功" });
				//       this.closeApp();
				//       uni.navigateBack({
				//         delta: 1,
				//       });
				//     } else {
				//       uni.showToast({ icon: "none", title: res.msg });
				//     }
				//   })
				//   .catch((err) => {
				//     uni.hideLoading();
				//     // uni.showToast({icon:'none',title:'审批失败'})
				//   });
			},
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
										title: "已保存至" + res2.savedFilePath,
									});
									setTimeout(() => {
										uni.openDocument({
											filePath: res2.savedFilePath,
											success: result => {},
										});
									}, 1000);
								},
							});
						}
					},
				});
			},
			selectOne(val) {
				this.workflowTableList[val.tableIndex].tableHtml[val.idx].arr[
					val.id
				].name = val.options.label;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.pad {
		padding-top: 98rpx;
	}

	.bg {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
		background-color: #f7f7ff;
	}

	.content {
		padding-bottom: 100rpx;
	}

	.workflow {
		display: flex;

		.workflow-left {
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

		.workflow-right {
			flex: 1;
		}

		.workflow-right2 {
			width: calc(100% - 60rpx);
		}
	}

	.detail {
		font-size: 28rpx;

		.detail-color {
			color: rgba(32, 52, 87, 1);
		}

		.detail-item {
			display: flex;
			background-color: #fff;
			margin-bottom: 10rpx;

			.left {
				width: 8rpx;
			}

			.right {
				// flex:1;
				width: calc(100% - 8rpx);
				padding: 20rpx;

				.item-head {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 60rpx;
				}

				.list-item {
					height: 80rpx;
					line-height: 80rpx;
					font-size: 28rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					border-bottom: 1px solid rgba(238, 238, 238, 1);
				}

				.item-title {
					width: 250rpx;
					font-size: 28rpx;
					font-weight: 700;
				}

				.custom-style {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 150rpx;
					height: 50rpx;
					font-size: 26rpx;
					border: 1px solid #ccc;
					border-radius: 8rpx;
					background-color: #fff;
					color: #1576e6;
				}

				.hiddenView {
					position: relative;
					height: 90rpx;
					line-height: 30rpx;
					margin: 20rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 3;
					word-break: break-all;
					color: rgba(32, 52, 87, 1);

					&::before {
						content: "";
						position: absolute;
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
						background: linear-gradient(180deg,
								rgba(232, 243, 255, 0) 0%,
								rgba(232, 243, 255, 1) 100%);
						z-index: 1;
					}
				}

				.item-reason {
					min-height: 50rpx;
					margin: 20rpx;
					line-height: 30rpx;
					color: rgba(32, 52, 87, 1);
				}

				.item-files {
					display: flex;
					align-items: center;
					background-color: #fff;
					height: 80rpx;

					.file-name {
						width: 550rpx;
						height: 40rpx;
						line-height: 40rpx;
						font-size: 30rpx;
					}
				}
			}

			.card {
				background: #fff;
				width: 750rpx;
				// height: calc( 1306rpx - 242rpx);
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

					&:first-child {
						border-top: 1px solid rgba(238, 238, 238, 1);
					}

					text:first-child {
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
					}
				}
			}
		}
	}

	.reasonPop {
		width: 560rpx;
		height: 600rpx;
		border-radius: 20rpx;
		background-color: #d7d7d7;
		overflow: hidden;

		.reasonPop-header {
			position: relative;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background-color: #fff;

			.reasonPop-closeBtn {
				position: absolute;
				right: 20rpx;
				top: 50%;
				transform: translateY(-50%);
			}
		}

		.reasonPop-content {
			padding: 20rpx;

			.reasonPop-reason {
				overflow: auto;
				height: 480rpx;
				padding: 20rpx;
				border-radius: 20rpx;
				font-size: 28rpx;
				background-color: #fff;
			}
		}
	}

	.fileList {
		.fileList-item {
			margin-bottom: 10rpx;

			.file-icon {
				width: 60rpx;
			}

			.file-name {
				width: 550rpx;
				height: 40rpx;
				line-height: 40rpx;
				font-size: 30rpx;
			}

			.upload {
				display: flex;
				justify-content: space-between;
			}

			.upload-files {
				border-bottom: 1px solid rgba(238, 238, 238, 1);
			}
		}
	}

	.app-record {
		.app-record-item {
			padding: 0 20rpx;
			background-color: #fff;
			margin-bottom: 10rpx;
			font-size: 26rpx;

			.item-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 80rpx;
				color: #bcc2cc;

				.checkBtn {
					color: #1576e6;
				}
			}

			.item-content {
				// display: flex;
				border-bottom: 1px solid rgba(238, 238, 238, 1);

				.item-content-head {
					display: flex;
					align-items: center;
				}

				.contents {
					padding: 20rpx 0 20rpx 60rpx;
				}
			}

			.files-item {
				display: flex;
				align-items: center;
				background-color: #fff;
				height: 80rpx;
			}

			.file-icon {
				width: 60rpx;
			}

			.file-name {
				width: 550rpx;
				height: 40rpx;
				line-height: 40rpx;
				font-size: 30rpx;
			}

			.icons {
				width: 60rpx;
			}
		}
	}

	.comonView {
		display: flex;
		align-items: center;
		background-color: #fff;
		height: 80rpx;
		padding: 0 20rpx;
	}

	.footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		// height: 100rpx;
		background-color: #fff;
	}

	.mb-20 {
		margin-bottom: 20rpx;
	}

	.bgc1 {
		background-color: #dddddd;
	}

	.bgc2 {
		background-color: #8fc3ff;
	}

	.bgc3 {
		background-color: #ffabab;
	}

	.bgc4 {
		background-color: #e8f3ff;
	}

	.bgc5 {
		background-color: #fff7f7;
	}

	.tar {
		text-align: right;
		color: rgba(32, 52, 87, 1);
	}

	.bdb {
		border-bottom: 1px solid rgba(238, 238, 238, 1);
	}

	.mr-20 {
		margin-right: 20rpx;
	}

	.lh-36 {
		line-height: 36rpx;
	}

	.text-hidden {
		overflow: hidden;
		/*超出部分隐藏*/
		white-space: nowrap;
		/*禁⽌换⾏*/
		text-overflow: ellipsis;
		/*省略号*/
	}

	.record-item {
		.record-item-title {
			width: 160rpx;
			height: 40rpx;
			margin: 10rpx 0;
			line-height: 40rpx;
			font-size: 24rpx;
			text-align: center;
			background-color: #eeeeee;
		}

		.record-item-list {
			display: flex;
			align-items: center;
			height: 160rpx;
			padding: 24rpx;
			background-color: #fff;

			.list-content {
				width: 520rpx;
				padding: 0 20rpx;
			}

			.list-type {
				color: #72809a;
				font-size: 24rpx;
			}

			.type {
				width: 100rpx;
				color: #72809a;
				font-size: 26rpx;
				text-align: center;
			}
		}
	}

	.file-icon {
		width: 60rpx;
	}

	.hamburg {
		padding-left: 4rpx;
		border-left: 1px solid #d5d0d0;
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

	.flow {
		overflow: auto;
		width: 750rpx;
	}

	.fw-700 {
		font-weight: 700;
	}

	.downLoad {
		width: 80rpx;
		text-align: center;
		font-size: 28rpx;
	}

	.psr {
		position: relative;
	}

	.pdb {
		padding-bottom: 100rpx;
	}

	.footer-btn {
		display: flex;
		position: fixed;
		width: 100%;
		height: 100rpx;
		bottom: 0;
		z-index: 10;

		.footer-btns {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100rpx;
			color: #fff;
		}

		.default {
			background-color: #b8b8b8;
		}

		.waring {
			background-color: #ff9f3f;
		}

		.success {
			background-color: #5fd992;
		}

		.error {
			background-color: #f24e4e;
		}

		.primary {
			background-color: #4995e9;
		}
	}

	.appimg {
		width: 40rpx;
		margin-right: 8rpx;
	}

	.signImg {
		width: 100rpx;
		height: 60rpx;
	}
</style>