<!-- 编辑和新增流程 -->
<template>
	<view class="wrapper addPageBg">
		<u-navbar :leftText="title" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<!-- tabs -->
		<view class="sticky">
			<u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="false"
				:activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"></u-tabs>
		</view>
		<view class="content">
			<!-- ======================== -->
			<view v-show="current == 0">
				<!-- <view  class="add-inputs">
            <view class="inputs-label">申请单号</view>
            <view class="inputs-content">
              <u--textarea v-model="rowData.orderCode" placeholder="请输入内容" autoHeight maxlength="50" border="none"></u--textarea>
            </view>
          </view> -->
				<view class="add-inputs">
					<view class="inputs-label">采购计划单号</view>
					<view class="inputs-content select">
						<u--textarea v-model="nodeDetels.orderCode" placeholder="请输入内容" autoHeight maxlength="50" border="none"></u--textarea>
						<!-- <u-icon name="lock-fill" class="icons" color="#eee" size="14"></u-icon> -->
					</view>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">供应商</view>
					<view class="inputs-content select" @click="show = true">
						<view class="name">{{ nodeDetels.approver }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="show" :columns="areaList"  :defaultIndex="areaListIndex" keyName="customName" @cancel="close"
						@confirm="confirm"></u-picker>
				</view>
				<view class="add-inputs">
					<view class="inputs-label">关联物资申请单</view>
					<view class="inputs-fileList">
						<view class="inputs-fileList-item" v-for="(item, index) in checkboxData1" :key="index">
							<u-icon class="icons" name="file-text" size="24"></u-icon>
							<view class="name text-hidden">{{ item.orderCode }}</view>
						</view>
						<view class="fileListBtn">
              			  <view class="addBtn" @click="relevanceNotes">添加</view>
              			</view>
						<!-- <u-button text="添加" class="add-coder" @click="relevanceNotes"></u-button> -->
					</view>
				</view>
				<!-- 负责人 -->
				<!-- <view class="add-inputs">
					<view class="inputs-label">负责人</view>
					<view class="select">
						<u--input placeholder="请输入负责人" border="none" fontSize="14" v-model="nodeDetels.leaderName"
							customStyle="" class="form-content"></u--input>
					</view>
				</view> -->
				<!-- 业务时间 -->
				<view class="add-inputs">
					<view class="inputs-label">业务时间</view>
					<view class="inputs-content select" @click="show3 = true">
						<view class="name">{{ nodeDetels.serviceTime }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-datetime-picker ref="datetimePicker" :show="show3" v-model="valtime" mode="datetime"
						:formatter="formatter" @confirm="selDate" @cancel="show3 = false"></u-datetime-picker>
				</view>
				<view v-if="num != 0" class="add-inputs">
					<view class="inputs-label">直供分包商</view>
					<view class="inputs-content select" @click="show4 = true">
						<view class="name">{{ nodeDetels.fkSupplyCustomerName }}</view>
						<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
					</view>
					<u-picker :show="show4" :columns="customerList"  keyName="customName" @cancel="close2"
						@confirm="confirm2"></u-picker>
				</view>
				<!-- 收料地址 -->
				<view class="add-inputs">
					<view class="inputs-label">收料地址</view>
					<view class="inputs-content">
						<u--textarea v-model="nodeDetels.receiptAddress" placeholder="请输入地址" autoHeight maxlength="100" border="none"></u--textarea>
					</view>
				</view>
				<!-- 负责人 -->
				<view class="add-inputs">
					<view class="inputs-label">备注</view>
					<view class="inputs-content">
						<u--textarea v-model="nodeDetels.remark" placeholder="请输入内容" autoHeight maxlength="100" border="none"></u--textarea>
					</view>
				</view>
			</view>
			<!-- 物料信息 -->
			<view v-show="current == 1">
				<view class="table_detail">
					<table>
						<thead>
							<tr>
								<th style="width: 40px">序号</th>
								<th>物料名称</th>
								<th>物料分类</th>
								<th>单位</th>
								<th>采购数量</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in nodeDetels.orderPurchaseMaterialDetails" :key="index">
								<td>{{ index + 1 }}</td>
								<td>{{ item.materialName }}</td>
								<td>{{ item.materialTypeName }}</td>
								<td>{{ item.unitName }}</td>
								<td><u--input type="number" v-model="item.purchaseNum"></u--input></td>
							</tr>
						</tbody>
					</table>
				</view>

				<view class="bottom-btn" v-if="!checkboxValue1.length"><u-button text="添加物料" class="add-material"
						@click="tableAdd"></u-button></view>
			</view>
		</view>
		<!-- ======================== -->
		<view class="popup-footer" style="justify-content: space-between; width: 100%">
			<!-- <view class="btns" v-if="current == 1"><u-button class="btn-iem" text="上一步" @click="upData"
					size="large"></u-button></view> -->
			<view class="btns" v-if="current == 0"><u-button class="btn-iem" type="primary" text="下一步" @click="examine"
					size="large"></u-button></view>
			<view class="btns" v-if="current == 1"><u-button class="btn-iem" type="primary" text="保存草稿"
					@click="submitMaterial(0)" size="large"></u-button></view>
			<view class="btns" v-if="current == 1"><u-button class="btn-iem" type="success" text="提交单据"
					@click="submitMaterial(1)" size="large"></u-button></view>
		</view>
		<u-popup :show="show2" :round="10" @close="orderClose" @open="orderOpen">
			<view class="pop">
				<view class="pop-top">
					<text @click="orderClose" style="font-size: 32rpx;">关联物资申请单</text>
					<text style="color: #2A82E4;" @click="selectOrder">确定</text>
				</view>
				<view class="pop-list">
					<view class="search-input">
						<u-input placeholder="请输入" border="none" v-model="searchOrdercode" fontSize="14">
							<template slot="suffix">
								<u-icon name="search" size="28" @click="search" color="#2a82e4"></u-icon>
							</template>
						</u-input>
					</view>
					<u-checkbox-group v-model="checkboxValue1" placement="column" @change="checkboxChange">
						<u-checkbox :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in checkboxList1"
							:key="index" :label="item.orderCode" :name="item.pkId"></u-checkbox>
					</u-checkbox-group>
				</view>
			</view>
		</u-popup>
		<!-- 添加物料 -->
		<u-popup :show="showLinkPop">
			<view class="showLinkPop">
				<view class="head">
					<view class="name">{{ showLinkTitle }}</view>
					<u-icon name="close" color="#fff" class="closeBtn" @click="closeLinkPop"></u-icon>
				</view>
				<view class="content2">
					<view>
						<view class="form-title">物料</view>
						<view class="select" @click="materialSearch">
							<view class="name" v-if="materialData.fkTypeName == undefined"></view>
							<view class="name" v-else>{{ materialData.fkTypeName + '/' + materialData.materialName }}</view>
							<u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
						</view>
					</view>
					<view>
						<view class="form-title">当前库存</view>
						<u--input placeholder="" border="none" type="number" v-model="materialData.supplyNum" customStyle=""
							suffixIcon="lock-fill" suffixIconStyle="color: #eee" disabled class="form-content"></u--input>
					</view>
					<view>
						<view class="form-title">采购数量</view>
						<u--input placeholder="请输入内容" border="none" type="number" v-model="materialData.purchaseNum" customStyle=""
							class="form-content" clearable></u--input>
					</view>
				</view>
				<view class="footer" v-if="showLinkTitle == '新增物料'">
					<u-button class="btns cancle" type="default" text="取消" @click="closeLinkPop"></u-button>
					<u-button class="btns" type="primary" text="添加" @click="addition"></u-button>
				</view>
				<view class="footer" v-else>
					<u-button class="btns cancle" type="default" text="取消" @click="closeLinkPop"></u-button>
					<u-button class="btns" type="error" text="删除" @click="searchLinkList"></u-button>
					<u-button class="btns" type="primary" text="保存" @click="searchLinkList"></u-button>
				</view>
			</view>
		</u-popup>
		<materialSelect :treeData="treeData" ref="materialSelect" @checked="checked"></materialSelect>
	</view>
</template>

<script>
import materialSelect from "@/components/material-select/material-select.vue";
export default {
	components: {
		materialSelect
	},
	data() {
		return {
			title: "普通材料采购计划单",
			tabList: [
				{
					name: "基础信息"
				},
				{
					name: "物料信息"
				}
			],
			current: 0,
			listData: [],
			nodeDetels: {
				orderCode: "",
				approver: "", // 供应商
				fkCustomerId: "", // 供应商id，
				leaderName: "", // 负责人
				serviceTime: "",
				receiptAddress: "",
				remark: "",
				orderPurchaseMaterialDetails: [],
				purchaseTypeCode: "purchase_ordinary",
				purchaseCode: 1, //采购状态编码 0:草稿，1：待确认，2：已确认，3：已驳回，4：已完成
				rePurchaseApplies: [],
				fkSupplyCustomerId: "",
				fkSupplyCustomerName: ""
			},
			valtime: Number(new Date()),
			statusCode: "", // 最原本单号没修改过
			areaList: [[]], // 供应商
			show: false,
			show2: false,
			show3: false,
			checkboxValue1: [],
			// 基本案列数据
			checkboxList1: [],
			searchOrdercode: "",
			// 添加物料
			showLinkPop: false,
			showLinkTitle: "",
			materialData: {}, // 物料弹框输入字段
			recordLis: [],
			treeData: [], // 物料选择树形数据
			selectShow: false,
			accessoryList: [],// 申请单关联的物资信息
			show4: false,
			num: 0,
			customerList: [],
			checkboxData1: [],
			type:0,
			pkId:"",
			areaListIndex:[]
		};
	},
	onLoad(option) {
		console.log(option);
		this.num = option.num - 0
		this.type =  option.type - 0
		// type
		if (option.num == 0) {
			if(this.type != 2){
				this.getBusinessCode(3); //获取采购单号3:普通材料采购单,5:混凝土采购计划单,6:钢筋半成品
			}else{
				this.pkId = option.pkId
				this.getData();
			}
		
		}
		if (option.num == 1) {
			this.title = "混凝土采购计划单";
			this.nodeDetels.purchaseTypeCode = "purchase_concrete"; // 混凝土
			if(this.type != 2){
				this.getBusinessCode(5); //获取采购单号3:普通材料采购单,5:混凝土采购计划单,6:钢筋半成品
			}else{
				this.pkId = option.pkId
				this.getData();
			}
		}
		if (option.num == 2) {
			if(this.type != 2){
				this.getBusinessCode(6); //获取采购单号3:普通材料采购单,5:混凝土采购计划单,6:钢筋半成品
			}else{
				this.pkId = option.pkId
				this.getData();
			}
			this.title = "钢筋半成品";
			this.nodeDetels.purchaseTypeCode = "purchase_rebar"; // 钢筋半成品
		
		}
		this.$nextTick(()=>{
			this.sponsorList(); // 获取供应商
		})
	},
	methods: {
		getData() {
			this.$api.queryMaterialOder({ pkId: this.pkId }).then(res => {
				if (res.code === 200) {
					// this.nodeDetels = res.data;
					this.nodeDetels.orderCode = res.data.orderCode
					this.nodeDetels.leaderName = res.data.leaderName
					this.nodeDetels.serviceTime = res.data.serviceTime
					this.valtime = res.data.serviceTime;
					this.nodeDetels.receiptAddress = res.data.receiptAddress
					this.nodeDetels.remark = res.data.remark
					res.data.orderApplyMaterialDetails.forEach(item=>{
						item.pkId = item.fkMaterialId
					})
					this.nodeDetels.orderPurchaseMaterialDetails =res.data.orderApplyMaterialDetails
					this.nodeDetels.approver = res.data.customerName;
					this.nodeDetels.fkCustomerId = res.data.fkCustomerId;
					this.checkboxValue1 = res.data.applyIds==null?[]:res.data.applyIds
					this.nodeDetels.fkSupplyCustomerName = res.data.fkSupplyCustomerName;
            		this.nodeDetels.fkSupplyCustomerId = res.data.fkSupplyCustomerId;

					if(this.checkboxValue1.length != 0){
						this.info();
					}
					// let arr = res.data.rePurchaseApplies.split("、")
					// console.log(arr)
					// this.checkboxValue1.forEach(item=>{

					// })
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			});
		},
		info(code, fkSupplyCustomerId){
			let data = {
				orderCode: code,
				pageNum: 1,
				pageSize: 50,
				customerType: 3,
				fkCustomerId: this.nodeDetels.fkCustomerId,
				fkSupplyCustomerId
			};
			this.checkboxData1 =[]
			this.$api.findOrderApplyByCustomerId(data).then(res => {
				if (res.code === 200) {
					res.data.forEach(item=>{
						this.checkboxValue1.forEach(e=>{
							if(item.pkId == e){
								this.checkboxData1.push(item)
							}
						})
					})
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			});
		},

		// 物料
		materialSearch() {
			this.selectMaterial(); // 获取物料树形选择数据
			this.$refs.materialSelect.selectShow = true;
		},
		// 物资选中回调
		checked(item) {
			console.log(item);
			this.materialData = item;
		},
		formatter(type, value) {
			if (type === "year") {
				return `${value}年`;
			}
			if (type === "month") {
				return `${value}月`;
			}
			if (type === "day") {
				return `${value}日`;
			}
			return value;
		},
		selDate(e) {
			console.log(e);
			const timeFormat = uni.$u.timeFormat;
			let timeValue = timeFormat(e.value, "yyyy-mm-dd hh:MM:ss");
			this.nodeDetels.serviceTime = timeValue;
			console.log(this.nodeDetels.serviceTime);
			this.show3 = false;
		},
		checkboxChange(n) {
			console.log(n);
		},
		// tab切换
		currentChange(e) {
			this.current = e.index;
		},
		// 获取采购单号
		getBusinessCode(num) {
			let data = {
				businessType: num
			};
			this.$api.getBusinessCode(data).then(res => {
				if (res.code === 200) {
					this.nodeDetels.orderCode = res.data.typeCode;
					this.statusCode = res.data.typeCode;
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			});
		},
		// 获取供应商
		sponsorList() {
			let supplierType = this.num + 1
			this.$api.getClient({ customType: 3, supplierType }).then(res => {
				if (res.code === 200) {
					this.$set(this.areaList, 0, res.data);
					if(this.type == 2){
						console.log("Xxxxxxxxxxxxxxxxxxx")
						console.log(this.nodeDetels.fkCustomerId)
						console.log("Xxxxxxxxxxxxxxxxxxx")
						res.data.forEach((item,index)=>{
							if(item.pkId == this.nodeDetels.fkCustomerId){
								this.areaListIndex = [index]
								this.$set(this.customerList, 0, item.supplyCustoms);
							}
						})
					}
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			});
		},
		// 获取直供分包商
		searchOrderPurchaseNoLink(fkSupplyOrgIds) {
			// 
			let data = { customId: this.nodeDetels.fkCustomerId, fkSupplyOrgIds }
			this.$api.searchOrderPurchaseNoLink(data).then(res => {
				if (res.code === 200) {
					console.log("=============1111==============")
					console.log(res)
					console.log("=============111==============")
					this.$set(this.customerList, 0, res.data);				
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			})
		},
		// 申请单
		orderClose() {
			this.show2 = false;
			console.log("关闭show2");
		},
		orderOpen() { },
		// 确定采购申请单
		selectOrder() {
			this.show2 = false;
			this.checkboxData1 = []
			this.checkboxList1.forEach(item => {
				this.checkboxValue1.forEach(e => {
					if (item.pkId == e) {
						this.checkboxData1.push(item)
					}
				})
			})
			const arr = this.checkboxData1;

			const dataArr = [];
			let str = Array.from(new Set(arr.map(item => item.fkOrgId))).join(',')
			this.searchOrderPurchaseNoLink(str)
			// 取出物料保存在dataArr
			for (let i = 0; i < arr.length; i++) {
				for (let j = 0; j < arr[i].materialVos.length; j++) {
					arr[i].materialVos[j].purchaseNum = arr[i].materialVos[j].supplyNum;
					arr[i].materialVos[j].fkMaterialId = arr[i].materialVos[j].pkId;
					arr[i].materialVos[j].unitName = arr[i].materialVos[j].fkUnitName;
					arr[i].materialVos[j].materialTypeName = arr[i].materialVos[j].fkTypeName;
					dataArr.push(arr[i].materialVos[j]);
				}
			}
			// 添加到物料信息 去重合并数量
			const baseArr = [];
			const newArry = [];
			for (const i in dataArr) {
				if (baseArr.includes(dataArr[i].pkId)) {
					newArry[baseArr.indexOf(dataArr[i].pkId)].purchaseNum += dataArr[i].purchaseNum;
				} else {
					baseArr.push(dataArr[i].pkId);
					newArry.push(dataArr[i]);
				}
			}
			this.nodeDetels.orderPurchaseMaterialDetails = newArry.map(item => ({ ...item }));
			console.log(this.nodeDetels.orderPurchaseMaterialDetails);
		},
		// ===========
		close() {
			this.show = false;
		},
		// 选择供应商
		confirm(val) {
			this.checkboxValue1 = [];
			this.checkboxData1 = []
			console.log(val);
			this.nodeDetels.approver = val.value[0].customName;
			this.nodeDetels.fkCustomerId = val.value[0].pkId;
			// console.log("=============2222==============")
			// 		console.log(val.value[0].supplyCustoms)
			// 		console.log("=============2222==============")
			this.$set(this.customerList, 0, val.value[0].supplyCustoms);
			this.show = false;
		},
		close2() {
			this.show4 = false;
		},
		// 选择直供分包商
		confirm2(val) {
			// this.checkboxValue1 = [];
			console.log(val);
			this.nodeDetels.fkSupplyCustomerName = val.value[0].customName;
			this.nodeDetels.fkSupplyCustomerId = val.value[0].pkId;
			this.getOrderList('', this.nodeDetels.fkSupplyCustomerId)
			// if(this.checkboxValue1.length){
			// 	const arr = this.checkboxValue1.filter(item=>item.fkOrgId==this.nodeDetels.fkSupplyCustomerId);
			// 	const dataArr = [];
			// 	// 取出物料保存在dataArr
			// 	for (let i = 0; i < arr.length; i++) {
			// 		for (let j = 0; j < arr[i].materialVos.length; j++) {
			// 			arr[i].materialVos[j].purchaseNum = arr[i].materialVos[j].supplyNum;
			// 			arr[i].materialVos[j].fkMaterialId = arr[i].materialVos[j].pkId;
			// 			arr[i].materialVos[j].unitName = arr[i].materialVos[j].fkUnitName;
			// 			arr[i].materialVos[j].materialTypeName = arr[i].materialVos[j].fkTypeName;
			// 			dataArr.push(arr[i].materialVos[j]);
			// 		}
			// 	}
			// 	// 添加到物料信息 去重合并数量
			// 	const baseArr = [];
			// 	const newArry = [];
			// 	for (const i in dataArr) {
			// 		if (baseArr.includes(dataArr[i].pkId)) {
			// 			newArry[baseArr.indexOf(dataArr[i].pkId)].purchaseNum += dataArr[i].purchaseNum;
			// 		} else {
			// 			baseArr.push(dataArr[i].pkId);
			// 			newArry.push(dataArr[i]);
			// 		}
			// 	}
			// 	console.log(arr,newArry);
			// 	this.nodeDetels.orderPurchaseMaterialDetails = newArry.map(item => ({ ...item }));
			// }
			this.show4 = false;
		},
		cancel() {
			console.log("取消");
		},
		// 下一步
		examine() {
			this.current = 1;
		},
		upData() {
			this.current = 0;
		},
		// 保存新增 num  0:草稿，1：待确认
		submitMaterial(num) {
			let data = { ...this.nodeDetels };
			// if (num) {
			data.purchaseCode = num;
			// }
			data.rePurchaseApplies = this.checkboxValue1
			if (this.nodeDetels.orderCode == this.statusCode) {
				data.isUpdate = 0;
			} else {
				data.isUpdate = 1;
			}
			if(this.type ==2){
				data.pkId = this.pkId
				// data.purchaseTypeCode
				this.$api
				.orderPurchaseUpdate(data)
				.then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: "编辑采购单成功",
							icon: "success",
							mask: true
						});
						setTimeout(() => {
							let pages = getCurrentPages()
							let prevPage = pages[pages.length - 3]; // 上一页面实例
							prevPage.$vm.search()
							uni.navigateBack({ delta: 2 });
						}, 500);
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none"
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: err,
						icon: "none"
					});
				});
			}else{
				// 新增------------------
				this.$api
				.addMaterialOder(data)
				.then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: "新增采购单成功",
							icon: "success",
							mask: true
						});
						setTimeout(() => {
							let pages = getCurrentPages()
							let prevPage = pages[pages.length - 2]; // 上一页面实例
							prevPage.$vm.search()
							uni.navigateBack(1);
						}, 500);
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none"
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: err,
						icon: "none"
					});
				});
				// 新增------------------
			}

		},
		// 搜索申请单
		search() {
			this.getOrderList(this.searchOrdercode);
		},
		relevanceNotes() {
			if (!this.nodeDetels.fkCustomerId) {
				uni.showToast({
					title: "请先选择供应商",
					icon: "none"
				});
			} else {
				this.show2 = true;
				this.getOrderList();
			}
		},
		// 根据供应商获取申请单列表
		getOrderList(code, fkSupplyCustomerId) {
			let data = {
				orderCode: code,
				pageNum: 1,
				pageSize: 50,
				customerType: 3,
				fkCustomerId: this.nodeDetels.fkCustomerId,
				fkSupplyCustomerId
			};
			this.$api.findOrderApplyByCustomerId(data).then(res => {
				if (res.code === 200) {
					this.checkboxList1 = res.data;
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			});
		},
		// 添加物料
		tableAdd() {
			if (!this.nodeDetels.fkCustomerId) {
				uni.showToast({
					title: "请先选择供应商",
					icon: "none"
				});
			} else {
				this.showLinkTitle = "新增物料";
				this.materialData ={
					// fkTypeName:"",
					// // fkTypeName
					// materialName:"",
					// supplyNum:"",
					// purchaseNum:""
				} 
				this.showLinkPop = true;
			}
		},
		itemClick() {
			this.showLinkTitle = "编辑物料";
			this.showLinkPop = true;
		},
		closeLinkPop() {
			this.showLinkPop = false;
		},
		// 查询物料树形选择数据
		selectMaterial() {
			let data = {
				pageNum: 1,
				pageSize: 100,
				type: 1, // 1合同，2仓库  3出入库  4 盘点单
				fkCustomId: this.nodeDetels.fkCustomerId,
				materialTypeCode:this.nodeDetels.orderPurchaseMaterialDetails.length?this.nodeDetels.orderPurchaseMaterialDetails[0].typeCode:""
			};
			this.$api.searchMaterialPage(data).then(res => {
				if (res.code == 200) {
					this.treeData = res.data;
				} else {
					uni.showToast({ icon: "none", title: res.msg });
				}
			});
		},
		pitchOn(item) {
			console.log(item);
			this.selectShow = false;
			item.applyNum = "";
			this.materialData = item;
		},
		// 添加物料
		addition() {
			// this.details.push(this.materialData);
			if (this.materialData.fkTypeName == undefined || this.materialData.fkTypeName.length == 0) {
				return uni.showToast({ icon: "none", title: "请选择物料" });
			}
			if (this.materialData.purchaseNum == undefined || this.materialData.purchaseNum.length == 0) {
				return uni.showToast({ icon: "none", title: "请填写采购数量" });
			}
			if (this.materialData.purchaseNum == 0) {
				return uni.showToast({ icon: "none", title: "采购数量不能为0" });
			}
			let hasId1 = this.nodeDetels.orderPurchaseMaterialDetails.find(item => item.pkId === this.materialData.pkId);
			if (hasId1 == undefined) {
				//  console.log(this.details)
				//  console.log(this.materialData)
				//  return
				// this.nodeDetels.orderPurchaseMaterialDetails.push(this.materialData);
				// this.closeLinkPop();
				// return
			} else {
				return uni.showToast({ icon: "none", title: "列表已存在该物料" });
			}
			let res = {
				fkMaterialId: this.materialData.pkId,
				materialName: this.materialData.materialName,
				materialTypeName: this.materialData.fkTypeName,
				unitName: this.materialData.fkUnitName,
				purchaseNum: this.materialData.purchaseNum,
				pkId: this.materialData.pkId,
			};
			this.nodeDetels.orderPurchaseMaterialDetails.push(res);
			this.closeLinkPop();
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	padding-bottom: 120rpx;
	padding-top: 88rpx;
}

.tab-top {
	background-color: #fff;
}

.form-title {
	padding-left: 24rpx;
	font-size: 28rpx;
	line-height: 50rpx;
	margin-top: 30rpx;
}

.form-content {
	height: 80rpx;
	background: #fff;
	padding-left: 24rpx;
}

.form-content2 {
	background-color: #fff;
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

.multiSelect {
	background-color: #fff;
	padding: 10rpx 0;
	padding-left: 40rpx;

	.item-code {
		display: flex;
		align-items: center;
		line-height: 100rpx;
		border-bottom: 1px solid #eee;

		.fileName {
			width: 600rpx;
			font-size: 28rpx;
		}
	}

	.add-coder {
		width: 160rpx;
		height: 60rpx;
		margin-top: 19rpx;
		background-color: #ebf4ff;
		color: #2b8fed;
		display: inline-grid;
	}
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

// 申请单选择框
.pop {
	width: 100%;
	height: 1000rpx;
	padding: 80rpx 28rpx;

	.pop-top {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		padding: 0 20rpx;
		line-height: 80rpx;
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
	}
}

.search-input {
	height: 64rpx;
	padding-left: 20rpx;
	border: 1px solid #b4d0f0;
	border-radius: 6rpx;
	font-size: 28rpx;
	margin-bottom: 18rpx;
}

.u-checkbox {
	height: 80rpx;
	border-bottom: 1px solid #eee;
	padding-left: 12rpx;
}

.bottom-btn {
	// 添加物料
	background: #fff;
	padding: 24rpx;

	.add-material {
		width: 240rpx;
		height: 48rpx;
		line-height: 48rpx;
		background-color: #ebf4ff;
		color: #2b8fed;
	}
}

.showLinkPop {
	height: 800rpx;
	background-color: #2a82e4;

	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		// line-height: 80rpx;
		padding: 0 20rpx;
		color: #fff;
		font-size: 28rpx;
	}

	.content2 {
		height: 620rpx;
		background-color: #f7f7ff;
		padding-top: 30rpx;
		font-size: 28rpx;
		border-radius: 20rpx 20rpx 0 0;

		.title {
			padding-left: 20rpx;
			font-weight: 600;
			margin-bottom: 10rpx;
		}

		.inputs {
			display: flex;
			align-items: center;
			height: 80rpx;
			padding: 0 20rpx;
			background-color: #fff;
			margin-bottom: 20rpx;
		}

		.searchRes {
			overflow: auto;
			height: 400rpx;
			background-color: #fff;
		}

		.loading {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.footer {
		display: flex;
		bottom: 0;
		justify-content: space-evenly;
		align-items: center;
		height: 100rpx;
		background-color: #fff;

		.btns {
			width: 300rpx;
			margin: 2px;
		}

		.cancle {
			background-color: #eeeeee;
			color: #aaaaaa;
		}
	}
}
</style>
