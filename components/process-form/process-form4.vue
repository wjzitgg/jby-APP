<template>
	<view style="background: #fff;overflow: auto;" id="html2canvas">
		<table style="width:794px;height:1123px;border-collapse: collapse; overflow: auto; margin: 0 auto" :id="'tables'+index1" v-for="(item1,index1) in tableList" :key="key + index1">
			<tr v-for="(item, idx) in item1.tableHtml" :key="idx" style="" v-show="item.status">
				<td style=" box-sizing: content-box; border: none; margin: 0; padding: 0; " v-for="(i, id) in item.arr" :style="[i.style]" :key="id" :rowspan="i.row" :colspan="i.span" :id="'td' + idx + id" :ref="'td' + idx + id" >
					<span v-if="(i.attributeTypes == 1 && i.checkout == false)||(i.attributeTypes == 1 && i.checkout == 1)">{{i.name}}</span>
					<span v-if="i.attributeTypes == 3">{{ i.signatureDate.content }}:<img width="80px" :src="i.signatureDate.img" alt="" /></span>
					<easy-select ref="easySelect" size="medium" :tableIndex="tableIndex" :idx="idx" :id="id" v-if="i.attributeTypes == 2" :options="i.option" :value="i.name" @selectOne="selectOne" :forbidden='true' ></easy-select>
				</td>
			</tr>
		</table>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: {}, // 获取登录pkid
			key:false,
			nums:0,
			tableList:[],
			token:null
		};
	},
	props: {
		tableData: { type: Array, default: () => [] }, // 表格内容
		disabled:{type:Boolean,default:false}
	},
	mounted(){
		console.log(this.tableData);
		if(this.tableData.length){
			this.unzipTable()
		}
	},
	// watch: {
	// 	tableData(val) {
	// 		this.unzipTable()
	// 	}
	// },
	methods: {
		unzipTable(){
			this.tableList=JSON.parse(JSON.stringify(this.tableData))
			console.log(this.tableList);
			if (Object.keys(this.tableList).length > 0) {
				this.user = uni.getStorageSync("user");
				this.user.pkId = this.user.userId;
				if (this.tableData.length > 0) {
					this.tableData.forEach(item => {
						if (item.tableHtml instanceof Array) {
						} else {
							item.tableHtml = this.utils.unzip(item.tableHtml);
							item.tableHtml = JSON.parse(item.tableHtml);
						}
					});
				}
				this.key=!this.key
			}
		},
		tableToImg(){
			if(this.tableList.length){
				uni.showLoading()
				this.token=uni.getStorageSync("token")
				this.nums=this.tableList.length
			}else{
				this.$emit("sendGzipevaluateUrl", []);
			}
		},
		showLoading(){
			uni.showLoading()
		},
		renderFinish(e){
			console.log(e);
			this.gzipTable(e)
		},
		
		// 保存表格压缩
		gzipTable(tables) {
			// 获取里面html的值，赋值给tableDTOS 深拷贝
			const tableData2 = JSON.parse(JSON.stringify(this.tableList));
			if (tableData2.length > 0) {
				tableData2.forEach((item,idx) => {
					item.tablePdfUrl=tables[idx]
					item.evaluateUrl = JSON.stringify(item.evaluateUrl);
					item.evaluateUrl = this.utils.zip(JSON.stringify(item.evaluateUrl));
				});
				this.$emit("sendGzipevaluateUrl", tableData2);
			}
		},
		//========================一下都是固定表格处理数据方法=======================================
		tdBlur(i) {
			i.id = this.user.pkId;
		},
		// 表格校验
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
						uni.showToast({ icon: "none", title: "请输入正确的手机号" });
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
		// 表格校验
		tdNameBlur(item, id, val) {
			// 手机号
			if (item.arr[id].checkType == 5) {
				const mobile = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (val.length != 0) {
					if (!mobile.test(val)) {
						uni.showToast({ icon: "none", title: "请输入正确的手机号" });
						item.arr[id].name = "";
					}
				}
			}

			// 日期
			if (item.arr[id].checkType == 4) {
				const data = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
				if (val.length != 0) {
					if (data.test(val)) {
					} else {
						item.arr[id].name = "";
						return uni.showToast({
							icon: "none",
							title: "请输入正确的时间格式xxxx-xx-xx"
						});
					}
				}
			}
			// 身份证
			if (item.arr[id].checkType == 6) {
				const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
				// 15位身份证号码校验正则
				const regs = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/;
				if (val.length != 0) {
					if (reg.test(val) || regs.test(val)) {
					} else {
						item.arr[id].name = "";
						return uni.showToast({
							icon: "none",
							title: "请输入正确的身份证号码"
						});
					}
				}
			}
			item.arr[id].id = this.user.pkId;
		},
		selectOne(val) {
    	  this.tableList[val.tableIndex].evaluateUrl[val.idx].arr[val.id].name =
    	    val.options.label;
    	  this.tableList[val.tableIndex].evaluateUrl[val.idx].arr[val.id].id = this.user.pkId;
    	},
	}
};
</script>

<style></style>
