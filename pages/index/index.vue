<template>
	<view class="wrapper">
		<view class="bottomshadow"></view>
		<view class="bottomcolor"></view>
		<u-navbar title="" class="navBar" titleStyle="color: #fff;" :bgColor="'transparent'">
			<view slot="left" class="navBar-left">
				{{userInfo.orgName}}
				<!-- <span style="color:#fff"></span> -->
				<!-- <view class="navBar-left">
					<u-icon name="map" color="#fff" :size="isPad?48:24"></u-icon>
					<view @click="proListClick" class="proName">{{ proName}}</view>
					<view class="cut" v-if="showPro" @click="proListClick">[切换]</view>
					<view class="projectList" v-if="projectListShow">
						<view v-for="item in proList" :key="item.pkId" class="projectList-item"
							:class="{ selectPro: proId === item.pkId }" @click="selectPro(item)">
							<view class="selproName">{{ item.projectName }}</view>
							<u-icon class="arrow" name="checkbox-mark" size="18" :color="'#5c83ef'"
								v-if="proId === item.pkId"></u-icon>
						</view>
					</view>
				</view> -->
			</view>
			<view slot="right">
				<image src="/static/image/settingRoutes.png" mode="widthFix" class="settingRoutes" @click="routeSetting"/>
			</view>
		</u-navbar>

		<view class="content">
			<view class="swiper"><u-swiper :list="swiperList" circular keyName="rotationUrl" @click="swiperClick" height="160"
					interval="5000" indicator indicatorMode="dot"></u-swiper></view>
			<!-- <view class="occupy"></view> -->
			<u-scroll-list class="scroll-list" :indicator="oftenRoute.length>4" indicatorActiveColor="#ccc">
				<view class="often-routes">
					<!-- gridClick2 -->
					<view class="routes-main-item" :style="{'background-color':item2.backgrounds}" v-for="(item2, index2) in oftenRoute" :key="index2" @click="gridClick2(item2)">
						<image :src="item2.meta.icon ? item2.meta.icon : '../../static/image/u563.png'" mode="widthFix"
							class="images" />
						<view class="routesName">{{ item2.name }}</view>
						<u-badge max="99" :value="matterNum[item2.numName]" class="badge"></u-badge>
					</view>
				</view>
			</u-scroll-list>

			<swiper circular vertical :autoplay="true" :interval="5000" class="informList"
				v-if="[2,3,4,5,6,7,8,9,10,11,12].includes(userInfo.orgType)&&noticeList.length">
				<!-- @click="informClick(item)" -->
				<swiper-item v-for="(item,index) in noticeList" :key="index" @click="noticClick(item)">
					<view class="inform">
						<view class="inform-left">
							<!-- <image src="../../static/image/sound.png" mode="widthFix" class="volume" /> -->
							<view class="tongzhi">公司公告</view>
						</view>
						<view class="inform-right">
							
							<view class="inform-right-head hidden"> {{item.noticeTitle}} </view>
							<view class="inform-right-content">{{item.noticeAbstract}}</view>
						</view>
					</view>
				</swiper-item>
			</swiper>


			<swiper circular :current="0" vertical class="informList"
				v-if="[2,3,4,5,6,7,8,9,10,11,12].includes(userInfo.orgType)&&!noticeList.length">
				<swiper-item>
					<view class="inform">
						<!-- <view class="inform-left">
							<image src="../../static/image/sound.png" mode="widthFix" class="volume" />
							<view class="tongzhi">通知公告</view>
						</view> -->
						<view class="inform-right">
							<view class="inform-right-head hidden"><image src="../../static/image/sound.png" mode="widthFix" class="volume" /> 暂无通知公告 </view>
							<!-- <view class="inform-right-content">{{item.noticeAbstract}}</view> -->
						</view>
					</view>
				</swiper-item>
			</swiper>

			<!-- <view class="routes">
				<view class="routes-header">
					<h3 class="cols">工作台</h3>
					<view class="routes-setting" @click="routeSetting" v-if="![0,1,6,8].includes(userInfo.orgType)">
						<view class="setting">
						<image src="../../static/image/routeSetting.png" mode="widthFix" class="icons">
						</view>	
					</view>
				</view>
				<view>
					<u-tabs :list="routes" @click="routesChange" :current='routerCurrent' :lineWidth="isPad?40:20"
						:lineHeight='isPad?6:3' class="route-tabs" v-if="tabShow" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"></u-tabs>
					<view class="routes-main">
						<view class="routes-main-item" v-for="(item2, index2) in showRoutes" :key="index2"
							@click="gridClick(item2)">
							<view class="imgs">
								<image :src="item2.meta.icon ? item2.meta.icon : '../../static/image/u563.png'" mode="widthFix" />
							</view>
							<text class="routesName">{{ item2.name }}</text>
						</view>
					</view>
				</view>
			</view> -->
		<routesItem :getRoute="item" v-for="item in routes" :key="item.name" @gridClick="gridClick" @selPro="selPro" :proName="proName" :showPro="!!proList.length"></routesItem>
		</view>


		<u-popup :show="setShow" mode="center" @close="setClose" @open="setOpen" round="6"
			customStyle="width: 100% !important;">
			<view>
				<view style="padding: 14px; font-weight: 600">{{ setName }}</view>
				<view class="mycards" v-if="setShow">
					<view class="card_item" v-for="(item, index) in settingData" @click="engineering(item)" :key="index">
						<!-- item.meta.icon -->
						<!-- <u-icon name="photo" size="30"></u-icon> -->
						<view class="card_item_img">
							<image :src="item.meta.icon ? item.meta.icon : '../../static/image/u563.png'" mode="widthFix" />
						</view>
						<view>{{ item.name }}</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup :show="setRouteShow" type="bottom" @close="setRouteClose" round="20">
			<view class="setRoute">
				<view class="setRoute-head">
					<view class="title">请编辑首页功能模块</view>
					<u-icon class="colseBtn" @click="setRouteClose" name="close" color="rgba(221, 221, 221, 1)" size="15"></u-icon>
					<!-- -->
				</view>
				<u-checkbox-group v-model="checkRoutes" placement="column">
					<view class="setRoute-content">
						<view class="routes-item" v-for="(item, index) in selRoutes" :key="index">

							<view v-if="item.isGroup">
								<view class="groud-title">{{item.name}} </view>
								<view v-for="(item2,index2) in item.children" :key="index2">
								<view class="route-title">
								 {{item2.name}}
								</view>
								<view class="routes-chekck">
									<u-checkbox  activeColor="#3993fa" :labelColor="checkRoutes.includes(item3.pkId)?'#4d5d79':'#a6aebc'" :customStyle="{ marginBottom: '16rpx',width:'50%',padding:'30rpx 24rpx',border:'2rpx solid #eeeeee' }" v-for="(item3, index3) in item2.children"
										:key="index3" :label="item3.name" :name="item3.pkId">
									</u-checkbox>
								</view>
								</view>
							</view>


							<view v-else>
							<view class="route-title">
							  {{item.name}}
							</view>
							<view class="routes-chekck">
								<u-checkbox  activeColor="#3993fa" :labelColor="checkRoutes.includes(item2.pkId)?'#4d5d79':'#a6aebc'" :customStyle="{ marginBottom: '16rpx',width:'50%',padding:'30rpx 24rpx',border:'2rpx solid #eeeeee' }" v-for="(item2, index2) in item.children"
									:key="index2" :label="item2.name" :name="item2.pkId">
								</u-checkbox>
							</view>
							</view>
						</view>
					</view>
				</u-checkbox-group>
				<view class="setRoute-footer">
					<view class="btns close" @click="setRouteClose">取消</view> 
					<view class="btns btnOk" @click="setRoute"><image src="../../static/image/saveBtn.png" mode="widthFix" /> 保存</view> 
				</view>
			</view>
		</u-popup>
		<u-popup  :show="popupShow" type="bottom" @close="closePop" round="20">
			<view class="detil-pop">
				<view class="detil-pop-head">
				<view class="name">选择项目</view>
					<u-icon name="close" color="rgba(170, 170, 170, 1)" class="closeBtn" @click="closePop"></u-icon>
				</view>
        		<view class="detil-pop-content" style="height: 75vh">
					<trees ref="weert" class="price-amount" :selectedData="[proId]" :multiple="false" :associatedNode="false" :selectParent="false"
            		:disabled="false" :wipeStatus="true" :localdata="proList" valueKey="pkId" textKey="projectName" @select="treeSel"
            		childrenKey="children"></trees>
        		</view>
			</view>
    	</u-popup>
		<tabbar :tabName="0"></tabbar>
	</view>
</template>

<script>
	import tabbar from '../../components/tabbar/tabbar.vue';
	import permision from "@/common/permission.js";
	import routesItem from '../../components/routes/routes.vue';
	import trees from '../../components/routes/ba-tree-picker.vue';
	// import modal from '../../components/modal';
	export default {
		components: { tabbar,routesItem,trees },
		computed: {
			userInfo() {
				// if (this.$store.state.userInfo.verifyStatus === 1) {
				//   this.show2 = false;
				// }
				return this.$store.state.userInfo;
			},
			routes() {
				let arr = this.$store.state.routes && this.$store.state.routes.length ? this.$store.state.routes : uni
					.getStorageSync("routes") ? JSON.parse(uni.getStorageSync("routes")) : [];
				let arr2 = []
				let arr3 =[]
				arr.forEach(item=>{
					if (item.isGroup == true){
						arr2.push(item)
					}else{
						arr3.push(item)
					}
				})
				if(arr3.length){
					let conditionStatus=arr3[0].conditionStatus
					arr2.push({name:"工作台",children:arr3,conditionStatus})
				}
				return arr2;
			},
			showRoutes() {
				if (this.routes.length) {
					if (!this.routes[0].conditionStatus) {
						this.tabShow = true;
						return this.routes[this.routerCurrent].children;
					} else {
						this.tabShow = false;
						return this.routes;
					}
				} else {
					return [];
				}
				// return this.routes.length? this.routes[this.routerCurrent].children:[]
			},
			oftenRoute() {
				return this.defaultRoute.children.filter(item => item.orgType.includes(this.userInfo.orgType));
			},
			isPad() {
				return this.$isIpad;
			}
		},
		// watch: {
		// 	'userInfo.verifyStatus': {
		// 		immediate: true,
		// 		handler(val) {
		// 			if (val) {
		// 				this.show2 = false;
		// 			}
		// 		}
		// 	}
		// },
		data() {
			return {
				title: "首页",
				swiperList: [],
				defaultRoute: {
					name: "待办事项",
					children: [{
							name: "续费审批",
							component: "waiting/renewayApproval",
							orgType: [0],
							tag: "10,11",
							numName: "renewNum",
							backgrounds:"rgba(255, 237, 237, 1)",
							meta: {
								icon: "../../static/image/xufeishenpi.png"
							}
						},
						{
							name: "短信签名",
							component: "waiting/smsSignApproval",
							orgType: [0],
							numName: "smsSignNum",
							backgrounds:"rgba(237, 246, 255, 1)",
							meta: {
								icon: "../../static/image/duanxinqianming.png"
							},
							tag: "12"
						},
						{
							name: "短信变动",
							component: "waiting/smsChangeApproval",
							orgType: [0],
							numName: "smsChangeNum",
							backgrounds:"rgba(255, 248, 237, 1)",
							meta: {
								icon: "../../static/image/duanxinbiandong.png"
							},
							tag: "13"
						},
						{
							name: "合同签署",
							component: "waiting/contractSign",
							orgType: [7, 8],
							numName: "contractNum",
							backgrounds:"rgba(255, 248, 237, 1)",
							meta: {
								icon: "../../static/image/hetongqianshu.png"
							},
							tag: "14"
						},
						{
							name: "会议签到",
							component: "waiting/meetingSign",
							orgType: [8],
							numName: "signNum",
							backgrounds:"rgba(245, 237, 255, 1)",
							meta: {
								icon: "../../static/image/huiyiqiandao.png"
							},
							tag: "5"
						},
						{
							name: "工资结算",
							component: "waiting/salarySettle",
							orgType: [8],
							numName: "salarySettleNum",
							backgrounds:"rgba(255, 237, 237, 1)",
							meta: {
								icon: "../../static/image/gongzijiesuan.png"
							},
							tag: "15"
						},
						{
							name: "工资发放",
							component: "waiting/salaryGrant",
							orgType: [8],
							numName: "salaryGrantNum",
							backgrounds:"rgba(237, 255, 242, 1)",
							meta: {
								icon: "../../static/image/gongzifafang.png"
							},
							tag: "16"
						},
						{
							name: "施工验收",
							component: "waiting/deliveryReceiving",
							orgType: [5, 2, 3],
							numName: "approveNum",
							tag: "1",
							backgrounds:"rgba(237, 246, 255, 1)",
							meta: {
								title: "施工验收",
								icon: "../../static/image/shigonggongju@2x.png"
							}
						},
						{
							name: "变更设计",
							component: "waiting/changeDesign",
							orgType: [5, 3, 9, 2],
							tag: "4",
							numName: "changeNum",
							backgrounds:"rgba(237, 255, 242, 1)",
							meta: {
								title: "变更设计",
								icon: "../../static/image/biangeng@2x.png"
							}
						},
						{
							name: "计量结算",
							component: "waiting/meterSettle",
							orgType: [7, 5, 3, 2],
							tag: "2,3",
							numName: "settleNum",
							backgrounds:"rgba(255, 243, 237, 1)",
							meta: {
								title: "计量结算",
								icon: "../../static/image/jiliang@2x.png"
							}
						},
						{
							name: "技术交底",
							component: "waiting/technicalDisclosure",
							orgType: [7, 5],
							tag: "6",
							numName: "techNum",
							backgrounds:"rgba(255, 248, 237, 1)",
							meta: {
								title: "技术交底",
								icon: "../../static/image/zhiliangjishu@2x.png"
							}
						},
						{
							name: "库存盘点",
							component: "waiting/checkInventory",
							orgType: [6, 7, 5],
							tag: "7",
							numName: "orderNum",
							backgrounds:"rgba(255, 248, 237, 1)",
							meta: {
								title: "库存盘点",
								icon: "../../static/image/kucunpandian.png"
							}
						},
						{
							name: "用章管理",
							component: "waiting/sealManage",
							orgType: [7, 6, 4, 3, 9, 2, 5],
							tag: "8",
							numName: "sealNum",
							backgrounds:"rgba(255, 237, 237, 1)",
							meta: {
								icon: "../../static/image/yongzhang.png"
							}
						},
						{
							name: "收文待办",
							component: "waiting/otherWaiting",
							orgType: [2, 3, 4, 5, 6, 7, 9,10,11,12],
							numName: "receiveNum",
							backgrounds:"rgba(245, 237, 255, 1)",
							meta: {
								title: "收文待办",
								icon: "../../static/image/shouwendaiban.png"
							},
							tag: "9,17"
						},
						

					]
				},
				baseList: [],
				times: 0,
				cerData: {
					redirectUrl: "https://erp.jianwangkeji.cn/back.html",
					bizType: "authentication",
					name: "",
					certType: "CRED_PSN_CH_IDCARD",
					certNo: "",
					account: ""
				},
				rules: {
					name: {
						required: true,
						message: "名字不能为空",
						trigger: ["blur", "change"]
					},
					certNo: [{
							required: true,
							message: "证件号不能为空",
							trigger: ["blur", "change"]
						},
						{
							validator: (rule, value, callback) => {
								if (this.cerData.certType === this.certTypeList[0].value) {
									return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
								} else if (this.cerData.certType === this.certTypeList[1].value) {
									return /^[Hh]{1}([0-9]{10}|[0-9]{8})$/.test(value);
								} else if (this.cerData.certType === this.certTypeList[2].value) {
									return /^[Mm]{1}([0-9]{10}|[0-9]{8})$/.test(value);
								} else if (this.cerData.certType === this.certTypeList[3].value) {
									return /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/.test(value);
								} else if (this.cerData.certType === this.certTypeList[4].value) {
									return /^([a-zA-z]|[0-9]){5,17}$/.test(value);
								}
							},
							message: "请输入正确的证件号",
							trigger: ["blur", "change"]
						}
					],
					account: [{
							required: true,
							message: "手机号号不能为空",
							trigger: ["blur", "change"]
						},
						{
							pattern: /^1(2|3|4|5|6|7|8|9)\d{9}$/,
							message: "请输入正确的手机号码",
							trigger: ["blur", "change"]
						}
					]
				},
				bizTypeList: {
					authentication: "代表实名认证模式",
					combination: "代表授权认证模式"
				},
				certTypeList: [
					{ text: "中国大陆居民身份证", value: "CRED_PSN_CH_IDCARD" },
					{ text: "香港来往大陆通行证", value: "CRED_PSN_CH_HONGKONG" },
					{ text: "澳门来往大陆通行证", value: "CRED_PSN_CH_MACAO" },
					{ text: "台湾来往大陆通行证", value: "CRED_PSN_CH_TWCARD" },
					{ text: "护照", value: "CRED_PSN_PASSPORT" }
				],
				jurShow: false,
				hasJur: false,
				height: 0,
				show2: false,
				maskHidden: false,
				projectListShow: false,
				proName: "",
				proList: [],
				proId: "",
				setShow: false,
				settingData: [{ name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 },
					{ name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }
				],
				setName: "",
				showPro: false,
				routerCurrent: 0,
				setRouteShow: false,
				selRoutes: [],
				checkRoutes: [],
				noticeList: [],
				tabShow: false,
				matterNum: {
					approveNum: 0,
					changeNum: 0,
					contractNum: 0,
					orderNum: 0,
					receiveNum: 0,
					renewNum: 0,
					salaryGrantNum: 0,
					salarySettleNum: 0,
					sealNum: 0,
					settleNum: 0,
					signNum: 0,
					smsChangeNum: 0,
					smsSignNum: 0,
					techNum: 0
				},
        		popupShow:false
			};
		},
		onLoad() {
			if (!uni.getStorageSync("token")) {
				uni.reLaunch({ url: "/pages/login/login" });
				return;
			}
			this.proId = uni.getStorageSync("nowProId");
			this.proName = uni.getStorageSync("nowProName");
			this.getInfo();
			// 新增
			this.getswiper();
			return;

			if (!this.$store.state.userInfo.phoneNum) {
				this.getInfo();
			}
		},
		onHide() {
			this.projectListShow = false;
		},
		onShow() {
			if (!uni.getStorageSync("token")) {
				uni.reLaunch({ url: "/pages/login/login" });
				return;
			}
			let router = uni.getStorageSync("routes") ? JSON.parse(uni.getStorageSync("routes")) : [];
			this.$store.commit("saveRoutes", router);
			this.getMatterNum();
			if (this.$store.state.getPro) {
				this.routerCurrent = 0;
				if (!!this.userInfo.orgId && ![5, 8].includes(this.userInfo.orgType)) {
					this.showPro = true;
					if([2,3,4,9,10,11,12].includes(this.userInfo.orgType)){
    			    this.getProjectTreeByOrgType()
    				}else if([6,7].includes(this.userInfo.orgType)){
    				this.projectListNoUserId()
    				}
				} else {
					this.showPro = false;
				}
				if (![0, 1].includes(this.userInfo.orgType)) {
					this.getHomeNotice();
				}
				this.$store.commit("saveGetPro", false);
			}
			// if ([5, 8].includes(this.userInfo.orgType)) {
			// 	this.proName = this.userInfo.orgType === 5 ? this.userInfo.orgName : this.userInfo.projectName;
			// }
			return;
			this.getWaitTime();
			// #ifdef APP-PLUS
			if (!!this.userInfo.verifyStatus) {
				this.maskHidden = false;
			} else {
				this.maskHidden = true;
			}
			// #endif
		},
		methods: {
			selPro(){
				this.popupShow=true
				this.$nextTick(()=>{
					this.$refs.weert._initTree()
				})
			},
			closePop(){
    		    this.popupShow=false
    		},
    		getProjectTreeByOrgType(){
    		    this.$api.getProjectTreeByOrgType().then(res=>{
    		        if(res.code==200){
    		            this.proList=res.data
						if(!this.proId){
						if (res.data.length) {
							let obj =this.getNode(res.data)
							this.proName = obj.projectName;
							this.proId = obj.pkId;
							uni.setStorageSync("nowProId", obj.pkId);
							uni.setStorageSync("nowOrgId", obj.fkOrgId);
							uni.setStorageSync("nowProName", obj.projectName);
						} else {
							uni.setStorageSync("nowProId", "");
							uni.setStorageSync("nowOrgId", "");
							uni.setStorageSync("nowProName", "");
							this.proName = "";
							this.proId = "";
						}
						}
    		        }else{
    		            uni.showToast({ title: res.msg });
    		        }
    		    })
    		},
			getNode(list){
				for (let i = 0; i < list.length; i++) {
					const item = list[i];
					console.log(item);
					if(item.children&&!!item.children.length){
						return this.getNode(item.children)
					}else{
						return item
					}
				}
			},
			treeSel(row){
				this.proName = row.projectName;
				this.proId = row.pkId;
				uni.setStorageSync("nowProId", row.pkId);
				uni.setStorageSync("nowOrgId", row.fkOrgId);
				uni.setStorageSync("nowProName", row.projectName);
				this.closePop()
			},
			// 获取轮播图
			getswiper() {
				this.$api.oaNoticeSearch().then(res => {
					if (res.code === 200) {
						console.log(res.data);
						this.swiperList = res.data;
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			// 获取待办数量
			getMatterNum() {
				this.$api.getMatterNum().then(res => {
					if (res.code === 200) {
						this.matterNum = res.data;
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			routesChange(e) {
				console.log(e);
				this.routerCurrent = e.index;
			},
			getHomeNotice() {
				this.$api.getHomeNotice().then(res => {
					if (res.code === 200) {
						this.noticeList = res.data;
					} else {
						uni.showToast({ title: res.msg, icon: "none" });
					}
				});
			},
			//生产设置跳转
			engineering(row) {
				console.log(row);
				let path = row.path.replace(/:/g, "/");
				console.log(path);
				let data = this.userInfo;
				uni.navigateTo({
					url: "/pages/" + path + "?row=" + JSON.stringify(data)
				});
			},
			// 通知点击
			informClick(item) {
				console.log(item);
				uni.showToast({ title: "暂未开放功能", icon: "none" });
			},
			proListClick() {
				if (!this.showPro) {
					return;
				}
				this.projectListShow = !this.projectListShow;
			},
			selectPro(row) {
				this.proName = row.projectName;
				this.proId = row.pkId;
				uni.setStorageSync("nowProId", row.pkId);
				uni.setStorageSync("nowOrgId", row.fkOrgId);
				uni.setStorageSync("nowProName", row.projectName);
				this.projectListShow = false;
			},
			getRoutes() {
				this.$api.getOftenRouter().then(res => {
					if (res.code === 200) {
						let routes = res.data;
						console.log(routes);
						this.$store.commit("saveRoutes", routes);
						uni.setStorageSync("routes", JSON.stringify(routes));
						// this.baseList = routes;
					}
				});
			},
			swiperClick(e) {
				console.log(e);
				this.noticClick(this.swiperList[e])
			},
			noticClick(item){
				uni.navigateTo({url:"/pages/index/priviewArt?pkId="+item.pkId})
			},
			gridClick(item) {
				// return uni.showToast({title:"优化中",icon:"none"}) 
				if (["生产设置", "责任成本", "实际成本", "库存管理", "班组人员管理"].includes(item.name)) {
					this.setName = item.name;
					this.settingData = item.children;
					return (this.setShow = true);
				}
				// return console.log(uni.getStorageSync("user"))
				// debugger
				if (["物资申请单"].includes(item.name) && item.children) {
					this.setName = item.name;
					this.settingData = item.children;
					return (this.setShow = true);
				}
				uni.navigateTo({
					url: "/pages/" + item.component
				});
			},
			gridClick2(item) {
				// return uni.showToast({title:"优化中",icon:"none"})
				uni.navigateTo({
					url: "/pages/waiting/todoList?tags=" + item.tag,
				});
			},
			routeSetting() {
				this.setRouteShow = true;
				this.getAppRouter();

				// return uni.showToast({ title: '未完善的功能', icon: 'none' })
			},
			setClose() {
				this.setShow = false;
			},
			setOpen() {
				this.setShow = true;
			},
			projectListNoUserId() {
				this.$api.projectBidByProjectId().then(res => {
					if (res.code === 200) {
						this.proList = res.data;
						if(!this.proId){
							if (res.data.length) {
							this.proName = res.data[0].projectName;
							uni.setStorageSync("nowProId", res.data[0].pkId);
							uni.setStorageSync("nowOrgId", res.data[0].fkOrgId);
							uni.setStorageSync("nowProName", res.data[0].projectName);
							this.proId = res.data[0].pkId;
						} else {
							uni.setStorageSync("nowProId", "");
							uni.setStorageSync("nowOrgId", "");
							uni.setStorageSync("nowProName", "");
							this.proName = "";
							this.proId = "";
						}
						}
						
						this.$store.commit("saveGetPro", false);
					} else {
						uni.showToast({ title: res.msg });
					}
				});
			},
			// 获取个人信息
			getInfo() {
				// this.$store.commit("saveUserInfo", {});
				// uni.showLoading({
				//   mask: true,
				// });
				this.$api
					.getInfo()
					.then(res => {
						if (res.code === 200) {
							this.$store.commit("saveUserInfo", res.data);
							uni.setStorageSync("user", res.data);
							if (![5, 8].includes(res.data.orgType)) {
								this.showPro = true;
								if([2,3,4,9,10,11,12].includes(this.userInfo.orgType)){
    			    			this.getProjectTreeByOrgType()
    							}else if([6,7].includes(this.userInfo.orgType)){
    							this.projectListNoUserId()
    							}
							} else {
								this.showPro = false;
								if ([5, 8].includes(this.userInfo.orgType)) {
									this.proName = this.userInfo.orgType === 5 ? this.userInfo.orgName : this.userInfo.projectName;
								}
							}
							if (![0, 1].includes(res.data.orgType)) {
								this.getHomeNotice();
							}


							if (res.data.checkStatus == 4) {
								// uni.hideTabBar()
								uni.showModal({
									title: "提示",
									content: "是否进行企业授权认证？",
									showCancel: true,
									cancelText: "返回登录页",
									success: ({ confirm, cancel }) => {
										if (confirm) {
											this.authorization();
										}
										if (cancel) {
											uni.reLaunch({ url: "/pages/login/login" });
										}
									}
								});

							}

							// 判断是否第一次登录
							// if (!!res.data.verifyStatus) {
							//   if (this.hasJur) {
							//     this.faceAuthorize();
							//   } else {
							//     uni.hideLoading();
							//     this.jurShow = true;
							//   }
							// } else {
							//   this.show2 = true;
							//   uni.hideLoading();
							// }
						}
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			authorization() {
				uni.showLoading({ mask: true });
				// {callbackUrl:'https://erp.jianwangkeji.cn/back.html'}
				this.$api.authorization("https://erp.jianwangkeji.cn/back.html").then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						console.log("1111111111111111111111111");
						console.log(res.data);
						this.$store.commit("isEnterAuth", true);
						// uni.showTabBar()
						uni.navigateTo({
							url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl)),
						});
						console.log("1111111111111111111111111");

					} else {
						uni.hideLoading();
					}
				});
			},
			// 获取待办条数
			getWaitTime() {
				this.$api.getWaitTime().then(res => {
					if (res.code === 200) {
						this.times = res.data ? res.data : 0;
					}
				});
			},
			btnOk(data) {
				this.$store.commit("isCert", true);
				console.log(data);
				if (this.hasJur) {
					this.certification(data);
				} else {
					this.jurShow = true;
				}
			},
			popClose() {
				uni.redirectTo({ url: "/pages/login/login" });
			},
			certification(data) {
				this.$api.certification(data).then(res => {
					console.log(res);
					if (res.code === 200) {
						this.maskHidden = false;
						uni.navigateTo({
							url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.data))
						});
					}
				});
			},
			faceAuthorize() {
				let data = {
					callbackUrl: "https://erp.jianwangkeji.cn/back.html?contextId=2",
					faceauthMode: "TENCENT",
					idNo: this.userInfo.certNo,
					name: this.userInfo.realName,
					contextId: 2
				};
				uni.showLoading({
					mask: true
				});
				this.$api
					.faceAuthorize(data)
					.then(res => {
						uni.hideLoading();
						if (res.code === 200) {
							this.$store.commit("isLoginFace", true);
							uni.navigateTo({
								url: "/pages/esign/esign?url=" + encodeURIComponent(JSON.stringify(res.data))
							});
						}
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			confirm() {
				permision.gotoAppPermissionSetting();
			},
			cancel() {
				if (this.show) {
					this.jurShow = false;
				} else {
					uni.redirectTo({
						url: "/pages/login/login",
						success: () => {
							uni.showToast({
								title: "没有相机权限，无法进行人脸识别",
								icon: "none"
							});
							this.jurShow = false;
						}
					});
				}
			},
			async requestAndroidPermission(permisionID) {
				console.log("触发了");
				let result = await permision.requestAndroidPermission(permisionID);
				if (result == 1) {
					this.hasJur = true;
					this.jurShow = false;
					if (!!this.userInfo.verifyStatus) {
						this.faceAuthorize();
					}
				} else {
					this.hasJur = false;
				}
			},
			closeModal() {
				this.show2 = false;
				this.$store.commit("saveUserInfo", {});
				uni.redirectTo({ url: "/pages/login/login" });
			},
			getAppRouter() {
				this.$api.getAppRouter().then(res => {
					if (res.code === 200) {
						this.selRoutes = res.data;
						this.selRoutes.forEach(item => {
							if(item.isGroup){
								item.children.forEach(item2 => {
									item2.children.forEach(item3=>{
										if (item3.defaultSelected) {
											this.checkRoutes.push(item3.pkId);
										}
									})
								});
							}else{
								item.children.forEach(item2 => {
									if (item2.defaultSelected) {
										this.checkRoutes.push(item2.pkId);
									}
								});
							}
						});
						setTimeout(() => {
							uni.hideTabBar();
						}, 200);
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			setRouteClose() {
				this.setRouteShow = false;
				this.checkRoutes = [];
				// setTimeout(() => {
				// 	uni.showTabBar();
				// }, 300);
			},
			setRoute() {
				console.log(this.checkRoutes);
				uni.showLoading({ mask: true });
				this.$api.setOftenRouter({ memuIds: this.checkRoutes.join(",") }).then(res => {
					uni.hideLoading();
					if (res.code === 200) {
						uni.showToast({ title: "修改成功" });
						this.routerCurrent = 0;
						this.getRoutes();
						this.setRouteClose();
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				}).catch(err => {
					uni.hideLoading();
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	.bottomshadow {
		position: fixed;
		left: 0;
		right: 0;
		/*#ifdef APP-PLUS*/
		bottom: -10rpx;
		/*#endif*/
		/*#ifdef H5*/
		bottom: 90rpx;
		/*#endif*/
		z-index: 99;
		// width: 100%;
		box-shadow: 0px -12rpx 20rpx 2rpx #8a9cf7;
	}

	.navBar {
		// height: 88rpx;
		color: #fff;
		/deep/ .u-navbar--fixed {
			background: -webkit-linear-gradient(to right, rgba(17, 100, 217, 1), rgba(0, 212, 148, 1));
			/* Safari 5.1 - 6.0 */
			background: -o-linear-gradient(to right, rgba(17, 100, 217, 1), rgba(0, 212, 148, 1));
			/* Opera 11.1 - 12.0 */
			background: -moz-linear-gradient(to right, rgba(17, 100, 217, 1), rgba(0, 212, 148, 1));
			/* Firefox 3.6 - 15 */
			background: linear-gradient(to right, rgba(17, 100, 217, 1), rgba(0, 212, 148, 1));
			/* 标准的语法（必须放在最后） */
			// background: url('https://img.js.design/assets/img/641ac0835f39ee09e50d2b82.png') repeat-y;
			background-size: 100% 100%;

			.u-navbar__content {
				background-color: transparent;
			}
		}

		.navBar-left {
			width: 600rpx;
			overflow: hidden; /* 控制元素溢出部分不显示 */
        	text-overflow: ellipsis; /* 当文字超出时显示省略号 */
        	display: -webkit-box; /* 将元素作为弹性伸缩盒子模型处理 */
        	-webkit-line-clamp: 2; /* 限制最多显示两行文本 */
        	-webkit-box-orient: vertical; /* 设置垂直布局 */
			color: #fff;
		// 	position: relative;
		// 	display: flex;
		// 	align-items: center;
		// 	height: 88rpx;
		// 	padding-left: 30rpx;

		// 	.cut {
		// 		display: flex;
		// 		align-items: flex-end;
		// 		height: 40rpx;
		// 		font-size: 26rpx;
		// 		margin-left: 14rpx;
		// 		color: #fff;
		// 		opacity: 0.6;
		// 	}

		// 	.proName {
		// 		max-width: 500rpx;
		// 		font-size: 38rpx;
		// 		line-height: 50rpx;
		// 		color: #fff;
		// 		overflow: hidden;
		// 		/*超出部分隐藏*/
		// 		white-space: nowrap;
		// 		/*禁⽌换⾏*/
		// 		text-overflow: ellipsis;
		// 		/*省略号*/

		// 	}
		}
	}
 

	.projectList {
		overflow: auto;
		position: absolute;
		left: 25rpx;
		top: 80rpx;
		width: 360rpx;
		max-height: 400rpx;
		padding: 0 20rpx;
		background-color: #ffffffef;
		z-index: 20;
		list-style: none;
		color: #000;
		border-radius: 20rpx;

		.projectList-item {
			position: relative;
			padding: 20rpx 0;
			// padding-left: 60rpx;
			font-weight: 600;
			color: #808080;
			border-bottom: 1px solid #e7e2e2;

			.arrow {
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
			}

			&:last-child {
				border: none;
			}
		}

		.selectPro {
			// background-color: #2a82e4;
			color: #5c83ef;
		}

		.selproName {
			width: 280rpx;
			font-size: 28rpx;
			// overflow: hidden; /*超出部分隐藏*/
			// white-space: nowrap; /*禁⽌换⾏*/
			// text-overflow: ellipsis; /*省略号*/
		}
	}

	.content {
		// margin-top: 84rpx;
		/*#ifdef APP-PLUS*/
		// margin-top: 156rpx;
		/*#endif*/
		/*#ifdef H5*/
		// margin-top: 88rpx;
		/*#endif*/
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		z-index: 1;
		padding: 0 10rpx;

		&::after {
			content: "";
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			z-index: -2;
			// background-color: #f0f0f0;
		}

		// &::before {
		// 	content: "";
		// 	position: fixed;
		// 	left: 0;
		// 	right: 0;
		// 	bottom: 0;
		// 	height: 500rpx;
		// 	background-color: #fff;
		// 	z-index: -1;

		// 	@media #{$pad} {
		// 		height: 300rpx
		// 	}
		// }
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;

		text {
			font-size: 30rpx;
		}
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
		
	}

	.swiper {
		// position: fixed;
		/*#ifdef APP-PLUS*/
		// top: 166rpx;
		/*#endif*/
		/*#ifdef H5*/
		// top: 98rpx;
		/*#endif*/
		// top: 84rpx;
		// z-index: 5;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 360rpx;
		padding-top: 4rpx;
		border-radius: 0 0 30rpx 30rpx;
		// background-color: #3a81cf;
	}

	.u-swiper {
		width: 100%;

		/deep/ .u-swiper-indicator__wrapper__dot {
			width: 10rpx;
			height: 10rpx;
			margin: 0 8rpx;
		}

		/deep/ .u-swiper-indicator__wrapper__dot--active {
			width: 24rpx;
		}
	}

	.grid-text {
		font-size: 14px;
		color: #909399;
		padding: 10rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}

	.u-grid {
		margin-top: 20px;
		width: 85%;
	}

	.u-grid-item {
		position: relative;
		width: 33.3%;
		margin: 10px 0;

		.badge {
			position: absolute;
			right: 30rpx;
			top: 5rpx;
		}
	}

	.pop-content {
		width: 600rpx;
		padding: 30rpx;

		.pop-title {
			margin-bottom: 10rpx;
			font-size: 40rpx;
			font-weight: 700;
			text-align: center;
		}
	}

	.occupy {
		height: 300rpx;
	}

	.routes {
		width: 100%;
		background-color: #fff;
		border-radius: 20rpx 20rpx 5rpx 5rpx;

		// margin-bottom: 20rpx;
		.route-tabs {
			background-color: #fff;
		}

		.routes-header {
			position: relative;
			display: flex;
			// justify-content: space-between;
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 20rpx;
			font-size: 28rpx;
			font-weight: 700;
			color: #79859a;

			.routes-setting {
				position: absolute;
				right: 40rpx;
				display: flex;
				align-items: center;
				.setting{
					display: flex;
					height: 80rpx;
					align-items: center;
				}
				.icons {
					width: 30rpx;
					height: 30rpx;
					margin-right: 4rpx;
				}
			}
		}

		.routes-main {
			display: flex;
			flex-wrap: wrap;
			min-height: 300rpx;
			padding-bottom: 40rpx;

			.routes-main-item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 23%;
				height: 150rpx;
				// border: 1px solid #000;
				box-sizing: border-box;
				margin-right: 2%;
				margin-bottom: 10rpx;

				.imgs {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 56rpx;
					height: 64rpx;
					margin-bottom: 6rpx;
				}

				image {
					width: 56rpx;
				}

				&:nth-child(4n) {
					margin-right: 0;
				}

				.routesName {
					text-align: center;
					font-size: 24rpx;
				}
			}
		}
	}

	.scroll-list {
		width: 100%;
		background-color: #fff;
		margin-bottom: 20rpx;
		padding-top: 20rpx;
		border-radius: 20rpx;
		/deep/.u-scroll-list__indicator{
			margin-top: 6rpx;
		}
	}

	.often-routes {
		// display: flex;
		// overflow: auto;
		display: flex;
		width: 100%;
		margin-bottom: 20rpx;

		.routes-main-item {
			position: relative;
			display: flex;
			flex-shrink: 0;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;
			width: 156rpx;
			height: 156rpx;
			margin: 0 10rpx;
			// height: 150rpx;
			// border: 1px solid #000;
			background-color: #fff;
			box-sizing: border-box;
			border-radius: 8rpx;

			// margin-right: 2%;
			// margin-bottom: 10rpx;
			.images {
				width: 70rpx;
				margin-bottom: 14rpx;
			}

			// &:nth-child(4n) {
			// 	margin-right: 0;
			// }
			.routesName {
				width: 100%;
				text-align: center;
				font-size: 28rpx;
			}

			/deep/ .badge {
				position: absolute;
				right: 16rpx;
				top: 16rpx;
				padding: 2rpx 6rpx;
			}
		}
	}

	.mycards {
		// 大盒子
		width: 98%;
		display: flex;
		flex-wrap: wrap;
		// justify-content: space-between;
	}

	.card_item {
		// 每个item
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
		width: 25%;
		padding: 12px;
		min-width: 25%;
		/* 加入这两个后每个item的宽度就生效了*/
		max-width: 25%;
		/* 加入这两个后每个item的宽度就生效了*/
		text-align: center;

		/deep/ .u-icon__icon {
			margin: 0 auto;
		}

		.card_item_img {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 70rpx;
			height: 80rpx;
		}

		image {
			width: 70rpx;
		}
	}

	.informList {
		overflow: hidden;
		width: 100%;
		height: 158rpx;
		margin-bottom: 20rpx;
		transition: 0.5s;
		padding: 10rpx 0;
		border-radius: 20rpx;
		// background-color: #fff;
		font-size: 28rpx;
		


	}

	.inform {
		display: flex;
		
		flex-direction: column;
		width: 100%;
		// height: 190rpx;
		height: 90px;
		padding: 0 20rpx;
		background-color: #fff;
		border-radius: 5rpx;
		.volume {
			width: 40rpx;
			height: 40rpx;
			margin-right: 12rpx;
		}
		// .inform-left {
		// 	// display: flex;
		// 	// align-items: center;
		// 	// border-right: 1px solid #f0f0f0;
		// 	padding-right: 6rpx;
		// 	margin-right: 10rpx;

		// 	.volume {
		// 		width: 40rpx;
		// 		height: 40rpx;
		// 		margin-right: 12rpx;
		// 	}

		// 	.tongzhi {
		// 		display: flex;
		// 		align-items: center;
		// 		width: 72rpx;
		// 		height: 92rpx;
		// 		font-size: 32rpx;
		// 		font-weight: 600;
		// 		color: #5678dd;
		// 	}
		// }
		.tongzhi{
			width: 64px;
          height: 22px;
         opacity: 1;
         border-radius: 2px;
         font-size: 11px;
         font-weight: 500;
         letter-spacing: 0px;
         line-height: 16.46px;
          color: rgba(184, 24, 24, 1);
          background: linear-gradient(90deg, rgba(255, 225, 222, 1) 0%, rgba(255, 225, 222, 0) 100%);
		  line-height: 22px;
		  margin : 3px 0;
		  padding: 0 5px;
		}

		.inform-right {
			width: 650rpx;
			
			.inform-right-head {
				display: flex;
				align-items: center;
				width: 650rpx;
				margin-bottom: 10rpx;
				// font-size: 30rpx;
				font-weight: 700;
				
				
			}

			.inform-right-content {
				width: 598rpx;
				
				
				opacity: 0.8;
				// font-size: 26rpx;
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				/* 这里是超出几行省略 */
				overflow: hidden;
				font-size: 12px;
              font-weight: 500;
          letter-spacing: 0px;
            line-height: 14px;
          color: rgba(32, 52, 87, 1);
          text-align: left;

			}
		}

		.hidden {
			overflow: hidden;
			/*超出部分隐藏*/
			white-space: nowrap;
			/*禁⽌换⾏*/
			text-overflow: ellipsis;
			/*省略号*/
		}
	}

	.setRoute {
		position: relative;
		height: 70vh;
		// padding: 10rpx 20rpx 0;

		.setRoute-head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 110rpx;
			margin-left: 14rpx;
			border-bottom: 1px solid #e8e8e8;
			.title{
				font-size: 36rpx;
				font-weight: 700;
				color: #203457;
			}
			.colseBtn{
				width: 50rpx;
				height: 50rpx;
			}
			
		}

		.setRoute-content {
			height: calc(70vh - 200rpx);
			overflow: auto;
			

			.routes-item {
				.groud-title{
					height: 80rpx;
					line-height: 80rpx;
					padding-left: 40rpx;
					font-weight: 700;
					background: linear-gradient(90deg, rgba(42, 130, 228, 0.2) 0%, rgba(42, 130, 228, 0) 100%);
				
				}
				.route-title {
					position: relative;
					display: flex;
					align-items: center;
					height: 80rpx;
					padding-left: 40rpx;
					font-size: 28rpx;
					font-weight: 700;
					 color: #000 ;
					
					// background: linear-gradient(90deg, rgba(42, 130, 228, 1) 0%, rgba(42, 130, 228, 0) 100%);
					color: rgba(32, 52, 87, 1);
					margin: 10px 0;
					// &::after {
					// 	content: '';
					// 	position: absolute;
					// 	left: 0;
					// 	top: 16rpx;
					// 	width: 10rpx;
					// 	height: 40rpx;
					// 	background-color: #81d3f8;
					// }
				
				}

				.routes-chekck {
					display: flex;
					flex-wrap: wrap;

					.u-checkbox {
						transform: scale(0.9)
					}
				}
			}
		}
		.setRoute-footer{
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			height: 100rpx;
			.btns{
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
			}
			.close{
				width: 270rpx;
				background-color: #eeeeee;
				color: rgba(170, 170, 170, 1);
			}
			.btnOk {
				// padding: 10rpx 20rpx;
				width: 480rpx;
				background-color: #1576e6;
				color: #fff;
				// border-radius: 6rpx;
				image {
					width: 30rpx;
					height: 30rpx !important;
					margin-right: 8rpx;
					margin-bottom: 2rpx;
				}
			}
		}
	}
	.cols{
		color: #333333;
	}
	.settingRoutes{
		width: 40rpx;
		height: 40rpx;
		// padding: 12rpx;
	}
</style>