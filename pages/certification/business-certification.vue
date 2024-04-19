<template>
	<view class="content wrapper">
		<u-navbar leftText="企业实名" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		
		<view class="bg"></view>
		<view style="position: relative;" v-if="type===0">
			<view class="goAuth">
				<h3>企业暂未实名认证</h3>
				<view class="clickbtn" @click="type=2">开始认证</view>
			</view>
		</view>
		<view v-if="type===1">
			<u--form labelPosition="left" ref="form1" labelWidth="auto">
			<u-form-item leftIcon="组织机构名称" borderBottom ref="item1" class="item">
				<u--input disabled v-model="cerData.name" border="none"></u--input>
			</u-form-item>
			<u-form-item leftIcon="证件类型" borderBottom ref="item1" class="item">
				<u--input disabled :value="certTypeList[certTypeIndex] ? certTypeList[certTypeIndex].label : ''" border="none"></u--input>
			</u-form-item>
			<u-form-item leftIcon="证件号码" borderBottom ref="item1" class="item">
				<u--input disabled v-model="cerData.certNo" border="none"></u--input>
			</u-form-item>
			<u-form-item leftIcon="组织机构类型" borderBottom class="item">
				<u--input disabled :value="orgTypeList[orgTypeIndex] ? orgTypeList[orgTypeIndex].label : ''" border="none"></u--input>
			</u-form-item>
			</u--form>

			<view class="titles">{{cerData.legalRepType===0?'法定代表人实名':cerData.legalRepType===1?'经办人实名':''}}</view>

			<u--form labelPosition="left" ref="form2" labelWidth="auto" v-if="cerData.legalRepType===0">
			<u-form-item label="法人姓名" borderBottom ref="item1" class="item">
				<u--input disabled v-model="cerData.legalRepName" border="none" ></u--input>
			</u-form-item>
			<u-form-item label="证件类型" borderBottom ref="item1" class="item">
				<u--input disabled :value="certTypeList2[certTypeIndex2] ? certTypeList2[certTypeIndex2].label : ''" border="none"></u--input>
			</u-form-item>
			<u-form-item label="证件号码" borderBottom ref="item1" class="item">
				<u--input disabled v-model="cerData.legalRepCertNo" border="none"></u--input>
			</u-form-item>
			<u-form-item label="电话号码" borderBottom ref="item1" class="item">
				<u--input disabled v-model="cerData.legalRepacCount" type="number" border="none"></u--input>
			</u-form-item>
		</u--form>
		<u--form labelPosition="left" ref="form2" labelWidth="auto" v-if="cerData.legalRepType===1">
			<u-form-item label="经办人姓名" borderBottom ref="item1" class="item">
				<u--input disabled v-model="cerData.operatorName" border="none"></u--input>
			</u-form-item>
			<u-form-item label="证件类型" borderBottom ref="item1" class="item">
				<u--input disabled :value="certTypeList2[certTypeIndex3] ? certTypeList2[certTypeIndex3].label : ''" border="none"></u--input>
			</u-form-item>
			<u-form-item label="证件号码" borderBottom ref="item1" class="item">
				<u--input v-model="cerData.operatorCertNo" border="none" disabled></u--input>
			</u-form-item>
			<u-form-item label="电话号码" borderBottom ref="item1" class="item">
				<u--input v-model="cerData.operatorMobile" disabled type="number" border="none"></u--input>
			</u-form-item>
		</u--form>
			<u-button class="btnOk" type="primary" text="重新实名" @click="type=2"></u-button>
		</view>
		<view v-if="type===2">
		<u--form labelPosition="left" ref="form1" labelWidth="auto">
			<u-form-item leftIcon="组织机构名称" borderBottom ref="item1" class="item">
				<u--input :disabled="realNameVerify == 1" v-model="cerData.name" border="none"></u--input>
			</u-form-item>
			<u-form-item leftIcon="证件类型" borderBottom ref="item1" class="item">
				<picker @change="certTypeChange" v-model="certTypeIndex" :range="certTypeList" :disabled="certNodisabled" range-key="label" mode="selector" class="select">
					<view class="uni-input">{{ certTypeList[certTypeIndex] ? certTypeList[certTypeIndex].label : '' }}</view>
				</picker>
			</u-form-item>
			<u-form-item leftIcon="证件号码" borderBottom ref="item1" class="item">
				<u--input :disabled="certNodisabled" v-model="cerData.certNo" border="none"></u--input>
			</u-form-item>
			<u-form-item leftIcon="组织机构类型" borderBottom class="item">
				<picker @change="orgTypeChange" v-model="orgTypeIndex" :range="orgTypeList" range-key="label" mode="selector" class="select" :disabled="certNodisabled">
					<view class="uni-input">{{ orgTypeList[orgTypeIndex] ? orgTypeList[orgTypeIndex].label : '' }}</view>
				</picker>
			</u-form-item>
		</u--form>
		<u-subsection :list="list" :current="current" mode="subsection" @change="sectionChange" class="subsection"></u-subsection>
		<u--form labelPosition="left" ref="form2" labelWidth="auto" v-if="current===0">
			<u-form-item :label="current === 0 ? '法人姓名' : '经办人姓名'" borderBottom ref="item1" class="item">
				<u--input :disabled="realNameVerify == 1" v-model="cerData.legalRepName" border="none"></u--input>
			</u-form-item>
			<u-form-item label="证件类型" borderBottom ref="item1" class="item">
				<picker @change="certTypeChange2" v-model="certTypeIndex2" :range="certTypeList2" :disabled="realNameVerify == 1" range-key="label" mode="selector" class="select">
					<view class="uni-input">{{ certTypeList2[certTypeIndex2] ? certTypeList2[certTypeIndex2].label : '' }}</view>
				</picker>
			</u-form-item>
			<u-form-item label="证件号码" borderBottom ref="item1" class="item">
				<u--input :disabled="realNameVerify == 1" v-model="cerData.legalRepCertNo" border="none"></u--input>
			</u-form-item>
			<u-form-item label="电话号码" borderBottom ref="item1" class="item">
				<u--input :disabled="realNameVerify == 1" v-model="cerData.legalRepacCount" type="number" border="none"></u--input>
			</u-form-item>
		</u--form>
		<u--form labelPosition="left" ref="form2" labelWidth="auto" v-if="current===1">
			<u-form-item :label="current === 0 ? '法人姓名' : '经办人姓名'" borderBottom ref="item1" class="item">
				<u--input v-model="cerData.operatorName" border="none"></u--input>
			</u-form-item>
			<u-form-item label="证件类型" borderBottom ref="item1" class="item">
				<picker @change="certTypeChange2" v-model="certTypeIndex3" :range="certTypeList2" range-key="label" mode="selector" class="select">
					<view class="uni-input">{{ certTypeList2[certTypeIndex3] ? certTypeList2[certTypeIndex3].label : '' }}</view>
				</picker>
			</u-form-item>
			<u-form-item label="证件号码" borderBottom ref="item1" class="item">
				<u--input v-model="cerData.operatorCertNo" border="none"></u--input>
			</u-form-item>
			<u-form-item label="电话号码" borderBottom ref="item1" class="item">
				<u--input v-model="cerData.operatorMobile" type="number" border="none"></u--input>
			</u-form-item>
		</u--form>
		<u-button v-if="realNameVerify === 0" class="btnOk" type="primary" text="开始实名" @click="btnOk"></u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type:'',//0为未实名，1为查看，2为企业实名
			cerData: {
				redirectUrl: 'https://erp.jianwangkeji.cn/back.html',
				authType: 'business',
				account: '',
				certNo: '',
				certType: '',
				name: '',
				legalRepCertNo: '',
				legalRepCertType: '',
				legalRepName: '',
				organizationType: '',
				legalRepType: '',
				operatorName:"",
				operatorCertNo:"",
				operatorMobile:"",
				operatorCertType:""
			},
			show1: false,
			certTypeList: [{ label: '统一社会信用代码', value: 'CRED_ORG_USCC' }, { label: '工商注册号', value: 'CRED_ORG_REGCODE' }],
			certTypeIndex: '',
			orgTypeList: [{ label: '企业类', value: '1' }, { label: '个体工商户', value: '2' }, { label: '其他组织', value: '99' }],
			orgTypeIndex: '',
			list: ['法定代表人实名', '经办人实名'],
			current: 0,
			certTypeList2: [
				{ label: '中国大陆居民身份证', value: 'CRED_PSN_CH_IDCARD' },
				{ label: '香港来往大陆通行证', value: 'CRED_PSN_CH_HONGKONG' },
				{ label: '澳门来往大陆通行证', value: 'CRED_PSN_CH_MACAO' },
				{ label: '台湾来往大陆通行证', value: 'CRED_PSN_CH_TWCARD' },
				{ label: '护照', value: 'CRED_PSN_PASSPORT' }
			],
			certTypeIndex2: '',
			certTypeIndex3: '',
			// certTypeIndex3: "",
			realNameVerify: '',
			certNodisabled:false
		};
	},
	onLoad(options) {
		this.getAuthInfo();
	},
	methods: {
		certTypeChange(e) {
			this.certTypeIndex = e.target.value;
			this.cerData.certType = this.certTypeList[this.certTypeIndex].value;
		},
		certTypeChange2(e) {
			if(this.current===0){
				this.certTypeIndex2 = e.target.value;
				this.cerData.legalRepCertType = this.certTypeList2[this.certTypeIndex2].value;
			}else if(this.current===1){
				this.certTypeIndex3 = e.target.value;
				this.cerData.operatorCertType = this.certTypeList2[this.certTypeIndex3].value;
			}
		},
		// certTypeChange3(e) {
		//   this.certTypeIndex3 = e.target.value;
		//   this.cerData.legalRepCertType =
		//     this.certTypeList2[this.certTypeIndex3].value;
		// },
		orgTypeChange(e) {
			this.orgTypeIndex = e.target.value;
			this.cerData.organizationType = this.orgTypeList[this.orgTypeIndex].value;
		},
		sectionChange(index) {
			this.current = index;
			// this.cerData.legalRepName = "";
			// this.cerData.legalRepCertNo = "";
			// this.cerData.account = "";
			// this.cerData.legalRepCertType = "";
			// this.certTypeIndex2 = "";
		},
		btnOk() {
			this.certification();
		},
		getAuthInfo() {
			uni.showLoading({mask:true})
			this.$api.getAuthInfo({ type: 1 }).then(res => {
				uni.hideLoading()
				if (res.code == 200) {
					if (res.data.account == null || res.data.account == '') {
						this.realNameVerify = 0;
					} else {
						this.realNameVerify = 1;
					}
					if(!res.data.certNo){
						this.type=0
					}else{
						this.type=1
						this.certNodisabled=true
					}
					this.cerData = {
						redirectUrl: 'https://erp.jianwangkeji.cn/back.html',
						authType: 'business',
						account: res.data.account ? res.data.account : '',
						certNo: res.data.certNo ? res.data.certNo : '',
						certType: res.data.certType ? res.data.certType : '',
						name: res.data.orgName ? res.data.orgName : '',
						legalRepCertNo: res.data.legalRepCertNo ? res.data.legalRepCertNo : '',
						legalRepCertType: res.data.legalRepCertType ? res.data.legalRepCertType : '',
						legalRepName: res.data.legalRepName ? res.data.legalRepName : '',
						organizationType: res.data.organizationType + '',
						legalRepType: res.data.legalRepType||res.data.legalRepType===0 ? res.data.legalRepType : '',
						operatorCertNo: res.data.operatorCertNo ? res.data.operatorCertNo : '',
						operatorCertType: res.data.operatorCertType ? res.data.operatorCertType : '',
						operatorMobile: res.data.operatorMobile ? res.data.operatorMobile : '',
						operatorName: res.data.operatorName ? res.data.operatorName : '',
						legalRepacCount:res.data.legalRepacCount?res.data.legalRepacCount:""
					};
					this.certTypeIndex = this.certTypeList.findIndex(item => item.value == res.data.certType);
					this.orgTypeIndex = this.orgTypeList.findIndex(item => item.value == res.data.organizationType);
					this.certTypeIndex2 = this.certTypeList2.findIndex(item => item.value == res.data.legalRepCertType);
					this.certTypeIndex3 = this.certTypeList2.findIndex(item => item.value == res.data.operatorCertType);
				} else {
					uni.showToast({ title: res.msg, icon: 'none' });
				}
			}).catch(err=>{
				uni.hideLoading()
			});
		},
		certification() {
			let data = { ...this.cerData };
			if (!data.name) {
				return uni.showToast({ title: '组织机构名称不能为空', icon: 'none' });
			}
			if(data.name.length<2||data.name.length>50){
				return uni.showToast({ title: '企业名称只能在2-50个字符之间', icon: 'none' });
			}
			if (!data.certType) {
				return uni.showToast({ title: '组织机构证件类型不能为空', icon: 'none' });
			}
			if (!data.certNo) {
				return uni.showToast({ title: '组织机构证件号不能为空', icon: 'none' });
			}
			if (!data.organizationType) {
				return uni.showToast({ title: '组织机构类型不能为空', icon: 'none' });
			}
			if(this.current==0){
				if (!data.legalRepName) {
						return uni.showToast({ title: '法定代表人姓名不能为空', icon: 'none' });
				}
				if (!data.legalRepCertType) {
						return uni.showToast({ title: '法定代表人证件类型不能为空', icon: 'none' });
				}
				if (!data.legalRepCertNo) {
						return uni.showToast({ title: '法定代表人证件号不能为空', icon: 'none' });
				} else {
					if (data.legalRepCertType == 'CRED_PSN_CH_IDCARD') {
						const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
						// 15位身份证号码校验正则
						const regs = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/;
						if (reg.test(data.legalRepCertNo) || regs.test(data.legalRepCertNo)) {
						} else {
							return uni.showToast({ title: '请输入正确的身份证号码', icon: 'none' });
						}
					}
				}
				if (!data.legalRepacCount) {
					return uni.showToast({ title: '法人手机号码不能为空', icon: 'none' });
				}
				const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!reg.test(data.legalRepacCount)) {
					uni.showToast({ icon: "none", title: "请输入正确的手机号" });
				}
			}else{
				if (!data.operatorName) {
						return uni.showToast({ title: '经办人姓名不能为空', icon: 'none' });
				}
				if (!data.operatorCertType) {
						return uni.showToast({ title: '经办人证件类型不能为空', icon: 'none' });
				}
				if (!data.operatorCertNo) {
						return uni.showToast({ title: '经办人证件号不能为空', icon: 'none' });
				} else {
					if (data.operatorCertType == 'CRED_PSN_CH_IDCARD') {
						const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
						// 15位身份证号码校验正则
						const regs = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/;
						if (reg.test(data.operatorCertNo) || regs.test(data.operatorCertNo)) {
						} else {
							return uni.showToast({ title: '请输入正确的身份证号码', icon: 'none' });
						}
					}
				}
				if (!data.operatorMobile) {
					return uni.showToast({ title: '经办人手机号码不能为空', icon: 'none' });
				}
				const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!reg.test(data.operatorMobile)) {
					uni.showToast({ icon: "none", title: "请输入正确的手机号" });
				}
			}
			if (this.current === 0) {
				data.legalRepType = 0;
				data.account=data.legalRepacCount
			} else {
				data.legalRepType = 1;
				data.account=data.operatorMobile
			}
			this.$api.certification(data).then(res => {
				if (res.code === 200) {
					this.$store.commit('saveBusCert', true);
					uni.navigateTo({
						url: '/pages/esign/esign?url=' + encodeURIComponent(JSON.stringify(res.data.faceSwipingUrl))
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.bg {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: -1;
	background-color: #f2f2f2;
}
.item {
	padding: 0 20rpx;
	margin-top: 20rpx;
	background-color: #fff;
}
.select {
	width: 100%;
	height: 48rpx;
	.uni-input {
		display: flex;
		align-items: center;
		width: 100%;
		height: 48rpx;
	}
}
.subsection {
	margin-top: 30rpx;
	background-color: #fff;
}
.btnOk {
	position: fixed;
	bottom: 0;
	width: 100%;
}
.goAuth{
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	display: flex;
	justify-content: center;
	align-items: center;
	width: 600rpx;
	height: 300rpx;
	background-color: #fff;
	border-radius: 20rpx;
	.clickbtn{
		position: absolute;
		bottom: 60rpx;
		font-size: 26rpx;
		font-weight: 700;
		text-decoration:underline;
		color: #51a7f0;
	}
}
.titles{
	display: flex;
	align-items: center;
	height: 80rpx;
	padding-left: 20rpx;
	margin-top: 40rpx;
	color: #fff;
	font-size: 28rpx;
	background-color: #02a7f0;
}
</style>
