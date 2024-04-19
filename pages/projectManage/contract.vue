<!-- 合同公共列表 -->
<template>
	<view class="wrapper">
		<u-navbar leftText="合同信息" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>

		<view class="sticky">
			<u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="true" v-if="user.orgType!=3"
				:activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"> </u-tabs>
			<proSel @change="proChange"></proSel>
			<view class="search">
				<view class="left">
					<view class="search-input"><u--input border="none" placeholder="请输入合同名称" v-model="keyWord" maxlength="50">
						</u--input></view>
					<view class="separator">|</view>
					<view class="searchBtn" @click="search">搜索</view>
				</view>
				<view class="right">
					<filterBtn @click="openPop" :nums="searchTag.length"></filterBtn>
					<!-- <view class="screen" @click="openPop">筛选</view> -->
				</view>
			</view>
			<searchTag :tagList="searchTag" @closeTag="closeTag"></searchTag>
		</view>
		<view :class="{pad:!searchTag.length&&user.orgType!=3,pad2:searchTag.length&&user.orgType!=3,pad3:!searchTag.length&&user.orgType==3,pad4:searchTag.length&&user.orgType==3}"></view>
		<view class="content" v-if="contractList.length">
			<view class="content-list" v-for="(item, idx) in contractList" :key="idx" @click="listLick(item.pkId)">
				<u-icon name="../../static/fileImg/file-text.png" size="20"></u-icon>
				<view>
					<view class="contract-name">{{ item.contractName }}</view>
					<view class="contract-amount" style="color: red">
						￥{{ item.amount }}
					</view>
				</view>
				<view class="contract-status-normal" v-if="item.enableStatus == 0">
					正常
				</view>
				<view class="contract-status-suspend" v-if="item.enableStatus == 1">
					中止
				</view>

			</view>
		</view>
		<view class="noData" v-if="!contractList.length">
			<u-empty style="height: 100%" mode="data" text="暂无合同" icon="/static/image/noData.png"> </u-empty>
		</view>
		<view class="btn" @click="addCon" v-if="$auth('projectManage:contract:add')">新增合同</view>
		<u-popup :show="popShow" mode="right" @close="closePop" @open="openPop" class="pop-bgImg"
			bgColor="rgba(255, 255, 255, 0)">
			<view class="popup">
				<view class="tip">请选择筛选条件</view>
				<view class="popup-content">
					<view class="filter-title">合同状态</view>
					<view class="filter-content">
						<view class="tags" :class="{ 'tags-click': nowTags === index }" v-for="(item, index) in tagList"
							:key="index" @click="tagsClick(item, index)">{{ item }}</view>
					</view>
				</view>
			</view>
			<view class="pop-footer-btn">
				<view class="btns btnReset" @click="closePop">取消</view>
				<view class="btns btnOk" @click="popOk">确定</view>
			</view>
		</u-popup>
		<u-popup :show="itemShow" mode="bottom" :round="20" @close="closePop" @open="openPops">
			<view class="item-edit">
				<view class="tem-edit-title">
					{{ contractDetails.contractName }}
					<u-icon name="close" color="#fff" @click="closePop" class="tem-edit-ico"></u-icon>
				</view>
				<view>
					<u--form labelPosition="left" :model="contractDetails" class="item-edit-form">
						<u-form-item label="标段项目:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80"
							v-if="contractType == 2">
							{{ contractDetails.projectBidName }}
						</u-form-item>
						<u-form-item v-if="contractType == 1 || contractType == 2" label="建设单位:" prop="userInfo.name" borderBottom
							labelWidth="80" ref="item1">
							{{ contractDetails.investorName }}
						</u-form-item>
						<u-form-item v-if="contractType == 4" label="分包单位:" prop="userInfo.name" borderBottom labelWidth="80"
							ref="item1">
							{{ contractDetails.customName }}
						</u-form-item>
						<u-form-item label="监理公司:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80"
							v-if="contractType == 2">
							{{ contractDetails.supervisorName }}
						</u-form-item>
						<u-form-item label="施工单位:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80"
							v-if="contractType == 1 || contractType == 2">
							{{ contractDetails.contractorName }}
						</u-form-item>
						<u-form-item label="项  目  部:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80"
							v-if="user.orgType !== 5">
							{{ contractDetails.orgName }}
						</u-form-item>
						<u-form-item label="供   货   商:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80"
							v-if="contractType == 3">
							{{ contractDetails.customName }}
						</u-form-item>
						<u-form-item label="合同金额:" prop="userInfo.sex" borderBottom ref="item1" labelWidth="80">
							{{contractDetails.amount }}
						</u-form-item>
						<u-form-item label="结算税点:" prop="userInfo.sex" borderBottom ref="item1" v-if="contractType == '1'"
							labelWidth="80">
							{{ contractDetails.taxRate + '%' }}
						</u-form-item>
						<u-form-item label="签订日期:" borderBottom ref="item1" labelWidth="80">
							{{ contractDetails.signDate }}
						</u-form-item>
						<u-form-item label="施工开始日期:" borderBottom ref="item1" labelWidth="100" v-if="contractType!=3">
							{{ contractDetails.beginDate }}
						</u-form-item>
						<u-form-item label="施工结束日期:" borderBottom ref="item1" labelWidth="100" v-if="contractType!=3">
							{{ contractDetails.endDate }}
						</u-form-item>
					</u--form>
				</view>
				<view style="background: #f6f6fc; height: 5px; margin-top: 20px">
				</view>
				<view class="accessory" v-for="(item, idx) in contractDetails.attachments" :key="idx"
					@click="accessoryClick(item)">
					<u-icon name="file-text-fill" size="24" class="accessory-ico"></u-icon>
					<text class="accessory-text">{{ item.attachName }}</text>
					<text class="suffix" v-if="item.attachName.length > 30">{{ item.suffix }}</text>
					<u-icon name="arrow-right" size="24" color="#dddddd" class="accessory-right-ico"></u-icon>
					<view style="font-size: 10px"></view>
				</view>
				<view class="popup-footer" style="justify-content: space-between; width: 100%">
					<view class="btns">
						<u-button class="btn-iem" text="查看清单项目表" type="success" @click="listItem"></u-button>
					</view>
					<view class="btns" v-if="(contractType == 4)">
						<u-button class="btn-iem" type="primary" text="查看供应材料" @click="supplyMaterial"></u-button>
					</view>
				</view>
			</view>
			<u-popup :show="accessoryShow" mode="bottom" @close="closeAccessory" @open="openAccessory" style="">
				<view>
					<view style="text-align: center; padding: 20px" @click="preview(fileData.attachUrl)">查看</view>
					<view style="text-align: center; padding: 20px" @click="downLoad(fileData.attachUrl)">下载当前附件</view>
					<view style="text-align: center; padding: 20px" @click="(accessoryShow = false)">取消</view>
				</view>
			</u-popup>
		</u-popup>
		<prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop>
	</view>
</template>

<script>
	// import prviewPop from '../../components/prview-pop/prview-pop.vue';
	import prviewPop from "../../components/prview-pop/prview-pop.vue";
	import filterBtn from "../../components/search-tag/filter-btn.vue";
	import searchTag from "../../components/search-tag/search-tag.vue";
	import proSel from './compoments/proSel.vue';
	export default {
		components: { prviewPop, filterBtn, searchTag ,proSel},
		computed: {
			user() {
				return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
			},
		},
		data() {
			return {
				tabList: [{ name: "施工合同", contractType: 1 }, { name: "监理合同", contractType: 2 }],
				current: 0,
				keyWord: "", //关键字搜索
				contractType: 1,
				enableStatus: "", //合同状态 （正常：0，终止：1）
				contractList: [], //合同列表
				contractDetails: {
					//合同详情
					amount: "", //合同金额
					attachments: [
						// attachName 附件名
						// attachUrl 附件URL
						// suffix 后缀名
					], //合同附件集
					beginDate: "", //合同开始时间
					contractName: "", //合同名称
					customName: "", //客户名称
					enableStatus: "", //启动状态（正常：0，终止：1）
					endDate: "", //合同结束时间
					orgName: "", //组织名称
					signDate: "", //合同签订时间
				},
				popShow: false,
				nowTags: 0,
				sendTags: 0,
				tagList: ["全部", "正常", "终止"],
				itemShow: false,
				accessoryShow: false,
				fileData: {},
				previewShow: false,
				previewUrl: "",
				searchTag: [],
      			fkProjectId:"",
      			fkBidProjectId:"",
			};
		},
		mounted() {
			if(this.user.orgType==3){
				this.contractType = 2
			}
			this.getMatterInfo();
		},

		methods: {
			resh(){
    		  this.getMatterInfo()
    		},
    		addCon(){
    		  uni.navigateTo({url:`/pages/contract/addCon?contractType=${this.contractType}`})
    		},
			proChange(e){
    		  this.fkProjectId = e.projectId
    		  this.fkBidProjectId = e.projectBidId
    		  this.getMatterInfo()
    		},
			currentChange(item) {
				this.current = item.index;
				this.contractType = item.contractType;
				this.getMatterInfo();
			},
			closeTag() {
				this.sendTags = "";
				this.nowTags = "";
				this.searchTag = [];
				this.getMatterInfo();
			},
			preview(url) {
				this.$checkName(url);
			},
			closePre() {
				this.previewShow = false;
			},
			closeAccessory() {
				this.accessoryShow = false;
			},
			openAccessory() {
				this.accessoryShow = true;
			},
			search() {
				this.getMatterInfo();
			},
			openPop() {
				this.popShow = true;
			},
			openPops() {
				this.itemShow = true;
			},
			closePop() {
				this.popShow = false;
				this.itemShow = false;
				this.nowTags = this.sendTags;
			},
			tagsClick(item, index) {
				this.nowTags = index;
			},
			popOk() {
				if (this.sendTags === this.nowTags) {
					return;
				}
				this.sendTags = this.nowTags;
				if (!!this.sendTags) {
					let obj = this.tagList[this.sendTags];
					this.searchTag = [{ key: "sendTags", value: obj }];
				} else {
					this.searchTag = [];
				}
				// this.keyWord = "";
				// keyWord
				this.getMatterInfo();
				this.closePop();
			},
			getMatterInfo() {
				let data = {
					contractType: this.contractType,
					keyWord: this.keyWord,
        			fkProjectId:this.fkProjectId,
        			fkBidProjectId:this.fkBidProjectId,
					
					// fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId")
				};
				if (this.nowTags == 0) {
					data.enableStatus = "";
				} else if (this.nowTags == 1) {
					data.enableStatus = 0;
				} else if (this.nowTags == 2) {
					data.enableStatus = 1;
				}
				this.$api.searchContract(data).then(res => {
					if (res.code == 200) {
						this.contractList = res.data.length ? res.data : [];
					} else {
						uni.showToast({ icon: "none", title: res.msg });
					}
				});
			},
			listLick(pkId) {
    		  uni.navigateTo({url:`/pages/contract/conDetil?contractType=${this.contractType}&pkId=${pkId}`})
    		},
			// listLick(pkId) {
			// 	this.$api.findContractById2({ pkId: pkId }).then(res => {
			// 		if (res.code == 200) {
			// 			this.contractDetails = res.data;
			// 			this.itemShow = true;
			// 		} else {
			// 			uni.showToast({ icon: "none", title: res.msg });
			// 		}
			// 	});
			// },
			listItem() {
				let item = this.contractDetails;
				uni.navigateTo({
					url: `/pages/projectManage/listItems?type=${this.contractType}&row=` + JSON.stringify(item),
				});
			},
			supplyMaterial() {
				let item = this.contractDetails;
				uni.navigateTo({
					url: "/pages/projectManage/supplyMaterials?row=" + JSON.stringify(item),
				});
			},
			accessoryClick(row) {
				this.fileData = row;
				this.accessoryShow = true;
			},
			// 下载
			downLoad(url) {
				// return console.log(url)
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
		},
	};
</script>

<style lang="scss" scoped>
	.pad {
	  height: 262rpx;
	}
	.pad2 {
	  height: 324rpx;
	}
	.pad3 {
		height: 174rpx;
	}

	.pad4 {
		height: 236rpx;
	}

	.search {

		display: flex;
		align-items: center;
		width: 100%;
		height: 80rpx;
		padding: 0 32rpx;
		background-color: #fff;

		.left {
			display: flex;
			width: 530rpx;
			height: 60rpx;
			border: 1px solid rgba(180, 208, 240, 1);
			border-radius: 10rpx;

			.search-input {
				display: flex;
				align-items: center;
				flex: 1;
				height: 60rpx;
			}

			.searchBtn {
				width: 120rpx;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 26rpx;
				text-align: center;
				color: #2a82e4;
			}

			.separator {
				line-height: 54rpx;
				color: rgba(180, 208, 240, 1);
			}
		}

		.right {
			margin-left: 20rpx;

			.screen {
				width: 140rpx;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 26rpx;
				text-align: center;
				color: #2a82e4;
				border: 1px solid rgba(180, 208, 240, 1);
				border-radius: 10rpx;
			}
		}
	}

	.content {

		.content-list {
			display: flex;
			align-items: start;
			position: relative;
			margin-bottom: 4px;
			padding: 20rpx;
			background: #fff;

			.contract-name {
				// margin-left: 20px;
				margin-top: 10rpx;
				margin-bottom: 6rpx;
				font-weight: 700;
				font-size: 28rpx;
			}

			.contract-amount {
				// margin-left: 36px;
				line-height: 40rpx;
				font-size: 12px;
				color: red;
			}

			.contract-status-normal {
				position: absolute;
				right: 19px;
				top: 20px;
				font-size: 13px;
				padding: 4px 7px;
				background: #d1fff1;
				border-radius: 5px;
				color: #3db994;
			}

			.contract-status-suspend {
				position: absolute;
				right: 19px;
				top: 20px;
				font-size: 13px;
				padding: 4px 7px;
				background: #eeeeee;
				border-radius: 5px;
				color: #b8b8b8;
			}
		}
	}

	.popup-footer2 {
		position: absolute;
		bottom: 0;
		left: 0;
		display: flex;
		width: 660rpx;
		height: 80rpx;

		// background-color: rgb(194, 155, 155);
		.btns {
			//padding: 12rpx;
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100rpx;

			.btn-iem {
				width: 95%;
				;
			}
		}
	}

	.popup-footer {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 660rpx;
		height: 80rpx;

		// background-color: rgb(194, 155, 155);
		.btns {
			//padding: 12rpx;
			flex: 1;

			.btn-iem {
				width: 95%;
				;
			}
		}
	}

	.accessory {
		margin: 8px 31px;
		position: relative;
		border-bottom: 1px solid #eeeeee;
		padding: 2px;

		.accessory-ico {
			position: absolute;
			left: -22px;
		}

		.accessory-text {
			display: inline-block;
			width: 93%;
			overflow: hidden;
			/*超出部分隐藏*/
			white-space: nowrap;
			/*禁⽌换⾏*/
			text-overflow: ellipsis;
			/*省略号*/
		}

		.accessory-right-ico {
			position: absolute;
			top: 2px;
			font-weight: 800;
			right: 0px;
		}
	}

	.item-edit {
		padding-bottom: 160rpx;

		.tem-edit-title {
			line-height: 80rpx;
			background: #2a82e4;
			color: #fff;
			text-indent: 2em;
		}

		.tem-edit-ico {
			position: absolute;
			right: 40rpx;
			top: 24rpx;
		}

		.item-edit-form {
			padding: 0 12rpx;
		}
	}

	/deep/ .preview {
		box-shadow: 0px 8px 2px 2px #d4d4d7;
	}
</style>