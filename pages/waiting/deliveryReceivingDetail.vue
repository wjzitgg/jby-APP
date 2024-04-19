<template>
	<view class="wrapper">
		<u-navbar leftText="施工验收" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<!-- 头部tabs -->
		<view class="workflow">
			<view class="workflow-left" v-if="['5', '6', 5, 6].includes(rowData.approveStatus)">
				<view class="tabs-item" :class="{ currentTab: nowTab === 0 }" @click="nowTab = 0">盖章详情</view>
				<view class="tabs-item" :class="{ currentTab: nowTab === 1 }" @click="nowTab = 1">业务详情</view>
			</view>
			<view
				:class="{ 'workflow-right': !['5', '6', 5, 6].includes(rowData.approveStatus), 'workflow-right2': ['5', '6', 5, 6].includes(rowData.approveStatus) }">
				<view class="pad"></view>
				<view v-show="nowTab === 0" v-if="['5', '6', 5, 6].includes(rowData.approveStatus)">
					<signDetail :signDetail="showData.sealBusinessVo" :key="nowTab"></signDetail>
				</view>
				<view v-show="nowTab === 1">
					<view class="sticky" :class="{ 'sticky-left': ['5', '6', 5, 6].includes(rowData.approveStatus) }">
						<u-tabs :list="tabList" :current="current" @click="listSelet" class="tabs"
							:activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}">
							<view slot="right" class="hamburg" @tap="hamburg"><u-icon name="list" size="21" bold></u-icon>
							</view>
						</u-tabs>
					</view>
					<view class="content">
						<view class="pull-down" v-show="show1">
							<text class="item-tab" :class="index == current ? 'action' : ''" v-for="(item, index) in tabList"
								:key="index" @click="listSelet(item, index)">{{ item.name
								}}</text>
							<!-- 箭头 -->
							<u-icon name="arrow-up" color="#dddddd" size="20" class="arrow-up" @click="shut"></u-icon>
						</view>
						<!-- tab对应面 -->
						<view class="" style="width:750rpx;overflow:auto;">
							<tableForm v-show="idx == 0" :emptyShow="false" :list="[
							{name:'流程名称',value:showData.processName,show:true},
							{name:'单位工程',value:showData.reItemApproveDtoList?showData.reItemApproveDtoList[0].unitItemName:'',show:true},
							{name:'分部工程',value:showData.reItemApproveDtoList?showData.reItemApproveDtoList[0].partItemName:'',show:true},
							{name:'分项工程',value:showData.originItemNames,show:true},
							{name:'本次完成分项工程',value:finishItemName,show:showData.itemType ==1 || showData.itemType ==2},
							{name:'审批完成状态',value:showData.approveStatusStr,show:true},
							{name:'分项完成状态',value:showData.itemApproveStatus == 1 ? '完成' : '未完成',show:true},
							{name:'本次填高',value:showData.currentFillHeight,show:showData.currentFillHeight != null},
							]">
							</tableForm>
							<!-- <view class="card">
								<view class="list-item">
									<text>流程名称</text>
									<text class="item"> {{ showData.processName }}</text>
								</view>
								<view class="list-item">
									<text>单位工程</text>
									<text class="item" v-if="showData.reItemApproveDtoList">{{
										showData.reItemApproveDtoList[0].unitItemName }}</text>
								</view>
								<view class="list-item">
									<text>分部工程</text>
									<text class="item" v-if="showData.reItemApproveDtoList">{{
										showData.reItemApproveDtoList[0].partItemName }}</text>
								</view>
								<view class="list-item">
									<text>分项工程</text>
									<text class="item">{{ showData.originItemNames }}</text>
								</view>
								<view class="list-item" v-if="showData.itemType ==1 || showData.itemType ==2">
									<text>本次完成分项工程</text>
									<text class="item">{{ showData.itemNames }}</text>
								</view>
								<view class="list-item">
									<text>审批完成状态</text>
									<text class="item">{{ showData.approveStatusStr
									}}</text>
								</view>
								<view class="list-item">
									<text>分项完成状态</text>
									<text class="item">{{ showData.itemApproveStatus == 1 ? "完成" : "未完成" }}</text>
								</view>
								<view class="list-item" v-if="['1', '3', '7'].includes(showData.approveStatus)">
									<text>当前节点</text>
									<text class="item">{{ showData.nodeName }}</text>
								</view>
								<view class="list-item">
									<text>审批完成时间</text>
									<text class="item">{{ showData.approveFinishTime ? showData.approveFinishTime : '' }}</text>
								</view>
								<view class="list-item" v-if="showData.currentFillHeight != null">
									<text>本次填高</text>
									<text class="item">{{ showData.currentFillHeight }}</text>
								</view>
							</view> -->
						</view>
						<scroll-view scroll-x="true" v-show="idx == 1" style="overflow: auto;width:750rpx">
							<!-- <view> -->
							<processForm :tableData="workflowTableList" :currentNodeId="showData.currentNodeId"
								:tableIndex="tableIndex" :disabled="showData.handleStatus != '1' || todo == 2"
								@sendGzipTableHtml="getGzipTableHtml" ref="formHtml">
							</processForm>
							<!-- </view> -->

						</scroll-view>
						<!-- 工程量 -->
						<view class="" v-show="idx == 2" style="width:750rpx;overflow:auto;padding-bottom: 50px;">
							<!-- 表格 -->
							<uni-table border emptyText="暂无更多数据">
								<!-- 表头行 -->
								<uni-tr>
									<uni-th align="center" width="100">项目编号</uni-th>
									<uni-th align="center">项目名称</uni-th>
									<uni-th align="center" width="100">设计工程量</uni-th>
									<uni-th align="center">单位</uni-th>
									<uni-th align="center" width="100">每延米工程量</uni-th>
									<uni-th align="center" width="100">完成工程量</uni-th>
									<uni-th align="center">备注</uni-th>
								</uni-tr>
								<!-- 表格数据行 -->
								<uni-tr v-for="(item, index) in showData.prodItemList" :key="index">
									<uni-td align="center">{{ item.itemCode }}</uni-td>
									<uni-td align="center">{{ item.itemName }}</uni-td>
									<uni-td align="center">{{ item.designQuantities }}</uni-td>
									<uni-td align="center">{{ item.unitName }}</uni-td>
									<uni-td align="center">{{ item.grade==4&&item.itemType==2?item.unitQuantity:'' }}</uni-td>
									<uni-td align="center">
										<u--input type="number" border="surround" v-model="item.completeQuantities"
											:disabled="showData.handleStatus != 1 || showData.itemType == 0"
											v-if="item.grade == 4&&(showData.handleStatus == 1 || showData.itemType != 0)&&showData.quantitiesTable==2"></u--input>
										<span
											v-if="item.grade == 4&&(showData.handleStatus != 1 || showData.itemType == 0)&&showData.quantitiesTable==1">{{item.completeQuantities}}</span>
									</uni-td>
									<uni-td align="center">
										<u--input border="surround" v-model="item.remark"
											:disabled="showData.handleStatus == 1 ? false : true"
											v-if="item.grade == 4&&showData.handleStatus == 1&&showData.quantitiesTable==2"></u--input>
										<span
											v-if="item.grade == 4&&showData.handleStatus != 1&&showData.quantitiesTable==1">{{item.remark}}</span>
									</uni-td>
								</uni-tr>
							</uni-table>
						</view>
						<!-- 材料用量 -->
						<view class="" v-show="idx == 3" style="width:750rpx;overflow:auto;padding-bottom: 50px;">
							<!-- 表格 -->
							<uni-table border emptyText="暂无更多数据">
								<!-- 表头行 -->
								<uni-tr>
									<uni-th align="center" width="70">物资名称</uni-th>
									<uni-th align="center" width="70">物资类别</uni-th>
									<uni-th align="center" width="80">扣款方式</uni-th>
									<uni-th align="center" width="50">单位</uni-th>
									<uni-th align="center" width="100">设计使用量</uni-th>
									<uni-th align="center" width="100">实际使用量</uni-th>
									<uni-th align="center" width="80">备注</uni-th>
								</uni-tr>
								<!-- 表格数据行 -->
								<uni-tr v-for="(item, index) in showData.materialItemList" :key="index">
									<uni-td align="center">{{ item.materialName }}</uni-td>
									<uni-td align="center">{{ item.typeName }}</uni-td>
									<uni-td align="center">{{ item.deductionWay }}</uni-td>
									<uni-td align="center">{{ item.materialUnitName }}</uni-td>
									<uni-td align="center">{{ item.materiaDesignQuantities }}</uni-td>
									<uni-td align="center">
										<u--input type="number" border="surround" v-model="item.actualUsage"
											:disabled="showData.handleStatus == 1 ? false : true"
											v-if="showData.handleStatus == 1&&showData.materialUsedTable==2"
											@blur="setVal($event,item,'actualUsage')" @input="numInp($event,item,'actualUsage')">
										</u--input>
										<span v-if="showData.materialUsedTable==1">{{item.actualUsage}}</span>
									</uni-td>
									<uni-td align="center">
										<u-input border="surround" v-model="item.materialRemark"
											:disabled="showData.handleStatus == 1 ? false : true"
											v-if="item.grade == 4 && showData.handleStatus == 1&&showData.materialUsedTable==2"> </u-input>
										<span v-if="showData.materialUsedTable==1">{{item.materialRemark}}</span>
									</uni-td>
								</uni-tr>
							</uni-table>
						</view>
						<!-- 附件 -->
						<view class="" v-show="idx == 4">
							<view class="accessory" v-for="(item, index) in showData.fileList" :key="index">
								<view class="acce-item">
									<u-icon name="account" color="#8f99ab" size="24"></u-icon>
									<text>{{ item.userName }}</text>
									<view class="ctime">{{ item.time }}</view>
								</view>
								<view class="acce-list" v-for="(file, ind) in item.prodReProcessFileList" :key="ind">
									<u-icon name="file-text" color="#3896ee" size="24" class="file-icon"></u-icon>
									<text @click="previewLook(file)">{{ file.fileName }}</text>
									<u-icon name="download" class="downLoad" size="24" @click="downLoad(file.fileUrl)"></u-icon>
								</view>
							</view>
						</view>
						<!-- 审批记录 -->
						<view class="" v-show="idx == 5">
							<view class="accessory" v-for="(item, index) in showData.approveDetailList" :key="index">
								<view class="acce-item">
									<u-icon name="account" color="#8f99ab" size="24"></u-icon>
									<text>{{ item.approver }}</text>
									<view class="checkBtn" @click="checkNodes(item)" v-if="item.approveStatus !== 2">查看</view>

								</view>
								<view class="record">
									<u-icon name="file-text-fill" color="#d73434" size="24" class="file-icon"></u-icon>
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

			</view>

			<!-- <view class="pab"></view> -->
			<!-- 底部固定处理按钮 -->
			<!-- handleStatus 正常审批       sealApproveStatus签章审批 -->
			<!-- <view class="btn" v-if="rowData.handleStatus !== 1 && todo != 2" @click="appBtn">处理</view>
			<view class="btn" v-if="showData.sealApproveStatus == 1" @click="sealApprove">审批</view>
			<view  class="btn" v-if="rowData.sealStatus && !todo" @click="goSign">{{ rowData.sealStatus == 1 ? '发起签章' :
				'重新发起签章' }}
			</view>

			<view class="btn" v-if="rowData.clearBtnStatus === 1&& !todo" @click="clearAcceptanceRecords">清除验收记录</view>
			<view class="btn" v-if="rowData.sealWithdrawStatus == 1 && !todo" @click="appBtn3">撤回</view>
			<view class="btn" v-if="showData.cancelStatus == 1 && !todo" @click="appBtn4">撤回</view>
			 v-if="showData.editStatus == 1 && showData.approveStatus == 0 || showData.approveStatus == 3 || showData.approveStatus == 7" -->
			<!-- <view class="btn" v-if="showData.editStatus == 1 && !todo" @click="appBtn5">
				{{ showData.approveStatus == 0 ? '编辑' : '重新发起' }}
			</view>  -->
			<view class="btn">
				<view v-if="showData.handleStatus == '1' && todo != 2" @click="appBtn">处理</view>
				<view v-if="showData.sealApproveStatus == 1" @click="sealApprove">{{showData.sealPersonStatus==1?'盖章':'审批'}}
				</view>
				<view v-if="showData.sealStatus && !todo" @click="goSign">{{ showData.sealStatus == 1 ? '发起签章' :
					'重新发起签章' }}
				</view>

				<view class="bg-red" v-if="showData.clearBtnStatus === 1 && !todo" @click="getApproType(0)">清除验收记录
				</view>
				<view v-if="showData.sealWithdrawStatus == 1 && !todo" @click="getApproType(1)">撤回</view>
				<view v-if="showData.cancelStatus == 1 && !todo" @click="getApproType(2)">撤回</view>
				<!-- v-if="showData.editStatus == 1 && showData.approveStatus == 0 || showData.approveStatus == 3 || showData.approveStatus == 7" -->
				<view v-if="showData.editStatus == 1 && !todo" @click="appBtn5">
					{{ showData.approveStatus == 0 ? '编辑' : '重新发起' }}
				</view>
				<view class="bg-red" v-if="showData.deleteStatus === 1" @click="getApproType(3)">删除</view>
			</view>

		</view>
		<!-- 审批弹框 -->
		<approvePopup :app-show="appShow" :approver-show="bottomShow" :approverName="staffList.roleName"
			:approverList="staffList.sysUserList" :approver-name="nextAppRole" :approver-list="approvalOptions"
			:rateShow="scoreFlag" :rates="showData.checkResult" :rejectShow="!!showData.refuseBtnStatus" @close="closeApp"
			@reject="reject" @submit="submit" @signUrlImg="signUrlImg" :app-title="'审批'" ref="approve"
			:tableData="workflowTableList" :sysRoleId="showData.sysRoleId" :roleId="showData.roleId" :getFiles="fileList">
		</approvePopup>
		<!-- 底部多功能查看按钮 -->
		<suspensionTabs :arrLength="5" @tabsExamine="tabsExamine"></suspensionTabs>
		<u-modal :show="modelShow" showCancelButton :closeOnClickOverlay="true" @close="modelShow = false" title="发起盖章确认"
			confirmText="需要" cancelText="不需要" @confirm="confirmSign" @cancel="cancelSign"
			content='您的审批流程已审批完成,请确认是否需要发起盖章流程?'></u-modal>
		<prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop>
		<!-- <processForm2 style="position: fixed;z-index:-999" ref="processForm2" v-if="tableStatus" :tableData="tableHtml2"
			@sendGzipTableHtml="sendGzipTableHtml2"></processForm2> -->
		<u-modal :show="modshow" title="提示" :content='modcontent' :showCancelButton="true"
			:showConfirmButton="showConfirmButton" :confirmText="confirmText" @confirm="modconfirm"
			@cancel="modshow=false"></u-modal>
		<addPopup @submit="submit2" :app-title="'签名'" ref="addPopup"></addPopup>
	</view>
</template>

<script>
	import prviewPop from "../../components/prview-pop/prview-pop.vue";
	import approvePopup from "../../components/approve-popup/approve-popup"; //审批弹框
	import addPopup from "../../components/approve-popup/add-popup.vue"; //审批弹框
	import processForm from "../../components/process-form/process-form.vue"; // 表格展示组件
	import suspensionTabs from "../../components/suspension-tabs/suspension-tabs.vue"; //悬浮按钮
	import signDetail from "../../components/signDetail/signDetail.vue";
	import processForm2 from "../../components/process-form/process-form2.vue";
	import tableForm from "../../components/table-form/table-form.vue";
	export default {
		components: { approvePopup, processForm, suspensionTabs, signDetail, prviewPop, processForm2, tableForm, addPopup },
		data() {
			return {
				bookPdfDTOS: [],
				previewShow: false,
				previewUrl: "",
				rowData: {}, // pkId流程
				appShow: false, // 控制处理弹框
				scoreFlag: 0, // 控制评分
				bottomShow: true,
				nextAppRole: "",
				approvalOptions: [],
				staffList: {}, // 员工列表数据
				idx: 0,
				tableIndex: 0,
				tabList: [{
						name: "基础信息",
						idx: 0
					},
					// {
					// 	name: "工程量",
					// 	idx: 2
					// },
					// {
					// 	name: "材料用量",
					// 	idx: 3
					// },
					{
						name: "附件",
						idx: 4
					},
					{
						name: "审批记录",
						idx: 5
					}
				],
				current: 0,
				show1: false, // 控制tabs下拉
				showData: {}, // 总体数据
				workflowTableList: [],
				tableHtml: [],
				tableHtml2: [],
				user: {},
				show: true, // 控制表格可不可以编辑
				modelShow: false,
				nowTab: 1,
				sendData: {},
				modshow: false,
				modcontent: "",
				showConfirmButton: false,
				confirmText: "",
				tableStatus: true,
				sup: false,
				appShow2: false,
				unique: "",
				approType: 0,
				fileList: []
			};
		},
		computed: {
			finishItemName() {
				let arr = this.showData.reItemApproveDtoList ? this.showData.reItemApproveDtoList.map(item => item.itemName) :
			[];
				return arr.join(",");
			}
		},
		onLoad(option) {
			if (option.todo) {
				this.todo = option.todo - 0;
			} else {
				this.todo = 0;
			}
			this.sup = !!option.sup;
			console.log("xxxxxxx========xxxxxxxxxxxxxx");
			console.log(this.todo);
			console.log("xxxxxxx========xxxxxxxxxxxxxx");
			if (this.todo == 2) {
				let data = JSON.parse(option.row);
				uni.showLoading({ mask: true });
				this.$api.getDoneTaskDetail(data).then(res => {
					if (res.code === 200) {
						this.showData = res.data.prodProcessApproveVo;
						this.rowData = this.showData;
						this.setTabs();
						this.scoreFlag = this.showData.scoreFlag;
						this.workflowTableList = this.showData.workflowTableList ? this.showData.workflowTableList : [];
						if (this.workflowTableList.length) {
							let tableArr = this.workflowTableList.map((item, index) => ({
								name: item.tableName,
								idx: 1,
								tableInd: index
							}));
							this.tabList.splice(1, 0, ...tableArr);
						}
						this.$nextTick(() => {
							uni.hideLoading();
						});
					} else {
						uni.hideLoading();
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			} else if (this.todo == 3) {
				this.rowData = JSON.parse(option.row);
				this.getOneQualityAndSecurityByItemId(this.rowData.fkBusinessId);
			} else {
				this.rowData = JSON.parse(option.row);
				console.log("分页过来参数", this.rowData);
				// 处理表格编辑问题
				this.getData(this.rowData.fkBusinessId);
				this.user = uni.getStorageSync("user");
				this.user.pkId = this.user.userId;
			}
		},
		methods: {
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
					this.clearAcceptanceRecords();
				} else if (this.approType == 1) {
					this.appBtn3();
				} else if (this.approType == 2) {
					this.appBtn4();
				} else if (this.approType == 3) {
					this.isDelete();
				}
			},
			setTabs() {
				if (this.showData.quantitiesTable && this.showData.quantitiesTable != 0) {
					this.tabList.splice(1, 0, { name: "工程量", idx: 2 });
				}
				if (this.showData.materialUsedTable && this.showData.materialUsedTable != 0) {
					let idx = this.showData.materialUsedTable != 0 ? 2 : 1;
					this.tabList.splice(idx, 0, { name: "材料用量", idx: 3 });
				}
			},
			numInp(e, item, key) {
				setTimeout(() => {
					item[key] = this.$limitInputNumber(e, 99999999.999999, "", 6);
				}, 0);
			},
			setVal(e, item, key) {
				if (e == "") {
					item[key] = 0;
				}
			},
			isDelete() {
				uni.showModal({
					title: "提示",
					content: "确定删除该流程, 是否继续?",
					showCancel: true,
					success: ({ confirm, cancel }) => {
						if (confirm) {
							this.$api.prodProcessApproveDelete({ pkId: this.showData.pkId, unique: this.unique }).then(res => {
								if (res.code == 200) {
									let pages = getCurrentPages();
									let prevPage = pages[pages.length - 2]; // 上一页面实例
									prevPage.$vm.resh(); // 调用上一页 定义的方法
									uni.navigateBack();
								}
							});
						} else if (cancel) {
							console.log("用户点击取消");
						}
					}
				});

			},
			closePre() {
				this.previewShow = false;
			},
			clearAcceptanceRecords() {
				uni.showModal({
					title: "提示",
					content: "确定清除该施工验收审批信息?",
					showCancel: true,
					success: ({ confirm, cancel }) => {
						if (confirm) {
							this.$api.clearAcceptanceRecords({ pkId: this.showData.pkId, unique: this.unique }).then(res => {
								if (res.code == 200) {
									let pages = getCurrentPages();
									let prevPage = pages[pages.length - 2]; // 上一页面实例
									prevPage.$vm.resh(); // 调用上一页 定义的方法
									uni.navigateBack();
								}
							}).catch(err => {
								console.log(err);
							});
						} else if (cancel) {
							console.log("用户点击取消");
						}
					}
				});

			},
			// 获取生产跟踪
			getOneQualityAndSecurityByItemId(itemId) {
				uni.showLoading({ mask: true });
				this.$api.getOneQualityAndSecurityByItemId({ itemId }).then(res => {
					if (res.code === 200) {
						this.bookPdfDTOS = res.data.bookPdfDTOS;
						this.showData = res.data;
						this.rowData = this.showData;
						this.setTabs();
						this.scoreFlag = this.showData.scoreFlag;
						this.workflowTableList = this.showData.workflowTableList ? this.showData.workflowTableList : [];
						if (this.workflowTableList.length) {
							let tableArr = this.workflowTableList.map((item, index) => ({
								name: item.tableName,
								idx: 1,
								tableInd: index
							}));
							this.tabList.splice(1, 0, ...tableArr);
						}
						this.$nextTick(() => {
							uni.hideLoading();
						});
					} else {
						uni.hideLoading();
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			getDetail() {
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 3]; // 上一页面实例
				prevPage.$vm.resh(); // 调用上一页 定义的方法
			},
			goSign() {
				this.modelShow = true;
			},
			confirmSign() {
				uni.navigateTo({
					url: "/pages/signSend/sendSeal?type=0&bizId=" + this.showData.pkId,
				});
				this.modelShow = false;
			},
			cancelSign() {
				this.$api.initiateSealProcess({ bizType: 0, fkBizId: this.showData.pkId, needSealStatus: 0 }).then(res => {
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
			getDetail2() {
				this.getData(this.showData.pkId);
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; // 上一页面实例
				prevPage.$vm.resh(); // 调用上一页 定义的方法
				uni.navigateBack();
			},
			// 预览文件规范  技术规范1  安全规范2  流程图3  工程图纸4   验收标准5
			tabsExamine(idx) {
				//  return	console.log(idx)
				if (idx == 1 || idx == 2 || idx == 0 || idx == 4) {
					if (idx == 0) {
						console.log("1 -----> ", 1);
						// return console.log(this.bookPdfDTOS)
						if (this.bookPdfDTOS.length == 0) {
							return uni.showToast({
								title: "暂无技术规范",
								icon: "none",
							});
						}
						this.previewUrl = this.bookPdfDTOS[0].bookUrl;
					} else if (idx == 1) {
						console.log("2 -----> ", 2);
						if (this.bookPdfDTOS.length < 2) {
							return uni.showToast({
								title: "暂无安全规范",
								icon: "none",
							});
						}
						console.log(this.bookPdfDTOS);
						this.previewUrl = this.bookPdfDTOS[1].bookUrl;
					} else if (idx == 2) {
						console.log("3 -----> ", 3);
						if (this.bookPdfDTOS.length < 3) {
							return uni.showToast({
								title: "暂无验收标准",
								icon: "none",
							});
						}
						this.previewUrl = this.bookPdfDTOS[2].bookUrl;
						console.log("xxxxxxxxxxxxxxxxx1xxxxxxxxxxxxxxxx");
						console.log(this.bookPdfDTOS[2].bookUrl);
						console.log("xxxxxxxxxxxxxxxxx1xxxxxxxxxxxxxxxx");
					} else if (idx == 4) {
						// console.log('3 -----> ', 3);
						if (this.showData.drawingItemList.length == 0) {
							return uni.showToast({
								title: "暂无工程图纸",
								icon: "none",
							});
						}
						// console.log(this.showData)
						this.previewUrl = this.showData.drawingItemList[0].drawingUrl;
						// console.log("xxxxxxxxxxxxxxxxx2222xxxxxxxxxxxxxxx")
						// console.log(this.bookPdfDTOS[0].drawingUrl)
						// console.log("xxxxxxxxxxxxxxxx2222xxxxxxxxxxxxxxx")
					}
					this.$checkName(this.previewUrl);
					return;
					this.previewShow = true;
				} else {
					uni.navigateTo({
						url: "/pages/production/preview?row=" + JSON.stringify(this.showData
							.taskFinishVoList)
					});
				}


				// this.previewLook(idx);
				// uni.setStorageSync("flow", this.showData.taskFinishVoList);

				// uni.navigateTo({ url: "/pages/nodeCheck/flow?taskFinishVoList=" + JSON.stringify(this.showData
				// 		.taskFinishVoList) });
			},
			// 预览文件
			previewLook(idx) {
				console.log(idx);
				if (idx == 3) {
					console.log(this.showData.taskFinishVoList);
				} else {

				}
				// this.$refs.approve.previewUrl = item.fileUrl;
				// this.$refs.approve.previewShow = true;
			},
			// 获取表格压缩后的数据
			getGzipTableHtml(tabledata) {
				this.tableHtml = tabledata;
				this.tableHtml2 = tabledata.filter(item => item.convertPdfStatus);
				console.log("压缩后的表", this.tableHtml);
				this.sendData.workflowTableList = this.tableHtml;
			},
			sendGzipTableHtml2(e) {
				// debugger
				// console.log(e)
				// return
				this.tableHtml2 = e;
				this.tableHtml.forEach(item => {
					this.tableHtml2.forEach(item2 => {
						if (item.fkTableId == item2.fkTableId) {
							console.log(item, item2);
							item.tablePdfUrl = item2.tablePdfUrl;
						}
					});
				});
				this.sendData.workflowTableList = this.tableHtml;
				this.projectExamine();
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
				uni.showLoading({ mask: true });
				let api = this.sup ? this.$api.findProcessApproveById : this.$api.getConstruction;
				api({ approveId: id, type: this.rowData.approveStatus == 0 ? 1 : 2 }).then(res => {
					this.bookPdfDTOS = res.data.bookPdfDTOS;

					if (res.code === 200) {
						this.showData = res.data;
						this.setTabs();
						console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
						console.log(res.data.sysRoleId);
						console.log(res.data.roleId);
						console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
						this.scoreFlag = this.showData.scoreFlag;
						this.workflowTableList = this.showData.workflowTableList ? this.showData.workflowTableList : [];
						if (this.workflowTableList.length) {
							let tableArr = this.workflowTableList.map((item, index) => ({
								name: item.tableName,
								idx: 1,
								tableInd: index
							}));
							this.tabList.splice(1, 0, ...tableArr);
							console.log("2222222222222");
						}
						this.fileList = [];
						this.showData.fileList.forEach(item => {
							item.prodReProcessFileList.forEach(item2 => {
								if (item2.deleteFlag) {
									this.fileList.push(item2);
								}
							});
						});
						this.$nextTick(() => {
							uni.hideLoading();
						});
					} else {

						uni.hideLoading();
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
			// 获取下一审批岗位和审批人列表
			getStaff() {
				// uni.showLoading({
				// 	mask: true
				// });
				// let params = {
				// 	itemId: this.showData.reItemApproveDtoList[0].fkItemId,
				// 	workflowId: this.showData.prodWorkflowTemplate.pkId,
				// 	orgId: this.user.orgId,
				// 	processId: this.showData.pkId
				// };
				// this.$api.getStaff(params).then(res => {
				// 	uni.hideLoading();
				// 	if (res.code === 200) {
				// 		if (res.data) {
				this.bottomShow = true;
				// 			this.staffList = res.data;
				// 			this.staffList.sysUserList.forEach(item => {
				// 				item.value = item.pkId;
				// 				item.label = item.userName;
				// 			});
				// 		} else {
				// 			this.bottomShow = false;
				// 			this.staffList = {};
				// 		}
				// 		console.log(this.staffList.sysUserList);
				// 	} else {
				// 		uni.showToast({ icon: "none", title: res.msg });
				// 	}
				// });
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
			// 处理按钮
			appBtn() {
				this.$refs.formHtml.gzipTable();
				this.getStaff();
				this.appShow = true;
			},
			appBtn1() {
				uni.navigateTo({
					url: "/pages/signSend/sendSeal?type=0&bizId=" + this.showData.pkId,
				});
			},
			appBtn3() {
				uni.showLoading({
					mask: true
				});
				this.$api.withdrawSeal({ pkId: this.showData.sealPkId, unique: this.unique }).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						uni.showToast({
							icon: "success",
							title: "撤回成功",
							mask: true,
							// success: () => {
							// 	this.closeApp();
							// 	setTimeout(() => {
							// 		prevPage.$vm.resh() // 调用上一页 定义的方法
							// 		uni.navigateBack();
							// 	}, 2000);
							// }
						});
						let pages = getCurrentPages();
						let prevPage = pages[pages.length - 2]; // 上一页面实例
						prevPage.$vm.resh(); // 调用上一页 定义的方法
						uni.navigateBack();
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			appBtn4() {
				uni.showLoading({
					mask: true
				});
				let api = this.sup ? this.$api.withdrawalProcessingNode2 : this.$api.withdrawalProcessingNodeGit;
				api({ approveId: this.showData.pkId, unique: this.unique }).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						uni.showToast({
							icon: "success",
							title: "撤回成功",
							mask: true,
							success: () => {
								this.closeApp();
								setTimeout(() => {
									let pages = getCurrentPages();
									let prevPage = pages[pages.length - 2]; // 上一页面实例
									prevPage.$vm.resh(); // 调用上一页 定义的方法
									uni.navigateBack();
								}, 2000);
							}
						});
						// let pages = getCurrentPages();
						// let prevPage = pages[pages.length - 2]; // 上一页面实例
						// prevPage.$vm.resh() // 调用上一页 定义的方法
						// uni.navigateBack();
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			appBtn5() {
				// return console.log(this.showData)
				uni.navigateTo({
					url: `/pages/production/newProcess?uniqueIdentification=0&id=${this.showData.pkId}`
					// url: "/pages/production/newProcess?id =" + this.showData.pkId,
				});
			},
			closeApp() {
				this.appShow = false;
			},
			reject(e) {
				console.log(e);
				let data = {
					auditStatus: 2,
					pkId: this.showData.pkId,
					approveComment: e.opinion // 审批意见
				};
				data.approveComment = data.approveComment ? data.approveComment : "审批不通过";
				uni.showLoading({
					mask: true
				});
				if (e.unique) {
					data.unique = e.unique;
				}
				this.sendData = data;
				this.projectExamine();
				// this.$refs.processForm2.tableToImg()
			},
			signUrlImg(e) {
				console.log("22222222222222");
				console.log(e);
				console.log(this.tableHtml2);
				console.log("22222222222222");
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
					console.log("xxxxxxxxxxxxxxxxxxxxx111xxxxxxxxxx");
					console.log(this.tableHtml);
					console.log("xxxxxxxxxxxxxxxxxxxx111xxxxxxxxxxx");
					this.tableHtml.forEach(item => {
						if (item.tableHtml instanceof Array) {
							item.tableHtml = JSON.stringify(item.tableHtml);
							item.tableHtml = this.utils.zip(JSON.stringify(item.tableHtml));
						} else {}
					});
				}
				this.tableHtml2 = this.tableHtml;

			},
			submit(e) {
				if (e.signUrl) {
					this.$refs.formHtml.signUrl(e.signUrl, e.signerId);
				}
				let data = {
					auditStatus: 1,
					pkId: this.showData.pkId,
					approveComment: e.opinion, // 审批意见
					approver: e.approver,
					checkResult: e.rate, // 检查评分 0：不合格 1：合格 2：良好
					currentNodeId: this.showData.currentNodeId,
					fkApproverId: e.approverId,
					materialItemList: this.showData.materialUsedTable ? this.showData.materialItemList : [], // 材料用量集
					prodItemDtoList: this.showData.quantitiesTable ? this.showData.prodItemList : [], // 工程用量集
					prodReProcessFileList: e.fileList,
					signUrl: e.signUrl,
					workflowTableList: this.tableHtml // workflowTableList
				};
				data.approveComment = data.approveComment ? data.approveComment : "审批通过";
				console.log(data.approveComment);
				if (e.unique) {
					data.unique = e.unique;
				}
				uni.showLoading({
					mask: true
				});
				this.sendData = data;
				console.log(data);
				this.projectExamine();
				// this.$nextTick(()=>{
				// 	this.$refs.processForm2.tableToImg()
				// })
				// this.$api
				// 	.processFlow(data)
				// 	.then(res => {
				// 		uni.hideLoading();
				// 		if (res.code === 200) {
				// 			uni.showToast({
				// 				icon: "success",
				// 				title: "审批成功",
				// 				mask: true,
				// 				// success: () => {
				// 				// 	this.closeApp();
				// 				// 	setTimeout(() => {
				// 				// 		prevPage.$vm.resh() // 调用上一页 定义的方法
				// 				// 		uni.navigateBack();

				// 				// 	}, 2000);
				// 				// }
				// 			});
				// 			let pages = getCurrentPages();
				// 			let prevPage = pages[pages.length - 2]; // 上一页面实例
				// 			prevPage.$vm.resh() // 调用上一页 定义的方法
				// 			uni.navigateBack();
				// 		} else {
				// 			uni.showToast({ icon: "none", title: res.msg });
				// 		}
				// 	})
				// 	.catch(err => {
				// 		uni.hideLoading();
				// 	});
			},
			projectExamine() {
				// this.sendData.workflowTableList=this.tableHtml
				let api = this.sup ? this.$api.processingNodeApproval : this.$api.processFlow;
				api(this.sendData)
					.then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							setTimeout(() => {
								uni.showToast({ icon: "success", title: "处理成功", mask: true, });
								setTimeout(() => {
									let pages = getCurrentPages();
									let prevPage = pages[pages.length - 2]; // 上一页面实例
									prevPage.$vm.resh(); // 调用上一页 定义的方法
									uni.navigateBack();
								}, 1000);
							}, 200);

						} else {
							uni.showToast({ icon: "none", title: res.msg });
						}
					})
					.catch(err => {
						console.log(err);
						uni.hideLoading();
					});
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
			// 表格
			tdBlur(item, id, ref, i, e) {
				console.log(this.$refs[ref][0].innerText);
				// console.log(uni.createSelectorQuery().in(this));
				if (item.arr[id].checkout == true) {
					return;
				}
				item.arr[id].name = this.$refs[ref][0].innerText;
				this.$refs[ref][0].innerText = item.arr[id].name;
				if (i.disabled) {
					i.id = this.user.pkId;
				}
			},
			tdNameChange(item, id, val) {
				//  纯数字
				if (item.arr[id].checkType == 1) {
					val = val.replace(/[^0-9]/g, "");
					item.arr[id].name = val;
				}
				// 小数
				if (item.arr[id].checkType == 2) {
					val = val.replace(/[^\d.]/g, "");
					item.arr[id].name = val;
				}
				// 金额
				if (item.arr[id].checkType == 3) {
					val = val.replace(/[^\d.]/g, ""); // 清除“数字”和“.”以外的字符
					val = val.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
					val = val.replace(".", "$#$");
					val = val.replace(/\./g, "");
					val = val.replace("$#$", ".");
					val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
					item.arr[id].name = val;
				}
				// // 日期
				if (item.checkType == 4) {
					val = val.replace(/[^0-9-]/g, "");
					item.arr[id].name = val;
				}
				// 电话号码
				if (item.arr[id].checkType == 5) {
					val = val.replace(/[^0-9]/g, "");
					val = val.slice(0, 11);
					if (val.length >= 11) {
						const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
						if (!reg.test(val)) {
							this.$message.warning("请输入正确的手机号");
							item.arr[id].name = "";
						} else {
							item.arr[id].name = val;
						}
					}
				}
				// 身份证
				if (item.checkType == 6) {
					val = val.replace(/[\u4e00-\u9fa5/\s+/]|[^a-zA-Z0-9\u4E00-\u9FA5]/g, "");
					item.arr[id].name = val;
				}
			},
			tdNameBlur(item, id, val) {
				// 手机号
				if (item.arr[id].checkType == 5) {
					const mobile = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
					if (val.length != 0) {
						if (!mobile.test(val)) {
							this.$message.warning("请输入正确的手机号");
							item.arr[id].name = "";
						}
					}
				}

				// 日期
				if (item.arr[id].checkType == 4) {
					const data =
						/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
					if (val.length != 0) {
						if (data.test(val)) {} else {
							item.arr[id].name = "";
							return this.$message.warning("请输入正确的时间格式xxxx-xx-xx");
						}
					}
				}
				// 身份证
				if (item.arr[id].checkType == 6) {
					const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
					// 15位身份证号码校验正则
					const regs = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/;
					if (val.length != 0) {
						if (reg.test(val) || regs.test(val)) {} else {
							item.arr[id].name = "";
							return this.$message.warning("请输入正确的身份证号码");
						}
					}
				}
			},
			checkNodes(item) {
				console.log(item);
				uni.navigateTo({
					url: "/pages/nodeCheck/nodeRecord?data=" + JSON.stringify(item),
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
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

	// page {
	// 	height: 100%;
	// }
	// .wrapper {
	// 	height: 100%;
	// }
	.content {
		height: 100%;
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
			height: 90rpx;
			line-height: 90rpx;
			padding: 0 30rpx;
			display: flex;
			color: #8f99ab;
			position: relative;

			>text {
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

			>text {
				flex: 1;
				border-bottom: 1px solid #eeeeee;
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

			>text {
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

	.pab {
		padding-bottom: 100rpx;
	}

	.btnBox {
		display: flex;

		view {}
	}

	.btn {
		background-image: none;
		display: flex;

		view {
			flex: 1;
			background-image: url(../../static//img//botton.png);
			background-size: 100% 100%;

		}

		.bg-red {
			background-color: red;
			color: #fff;
			background-image: none;
		}
	}
</style>