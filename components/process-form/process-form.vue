<template>
	<view style="background: #fff;overflow: auto;">
		<table style="width:794px;height:1123px;border-collapse: collapse;  margin: 0 auto" ref="printPage"
			:key="tableIndex" v-if="tableData.length">
			<tr v-for="(item, idx) in tableData[tableIndex].tableHtml" :key="idx" style="" v-show="item.status">
				<td style="
		        box-sizing: content-box;
		        border: none;
		        margin: 0;
		        padding: 0;
		      " v-for="(i, id) in item.arr" :style="[i.style]" :key="id" :rowspan="i.row" :colspan="i.span" @click="tdClick(i,id,item)"
					:id="'td' + idx + id" :ref="'td' + idx + id">
					<!-- checkout是否校验 默认false不校验 i.disabled=true默认可编辑-->
					<input type="text" v-model="i.name" :style="{'fontSize':i.style.fontSize }"
						:disabled="i.disabled == false || tableData[tableIndex].editFlag != 1  || (i.id!='' && i.id !== currentNodeId && i.name != '')"
						v-if="
						i.attributeTypes == 1 &&
						i.checkout == false &&
						(i.disabled != false || (i.id =='' && i.id == currentNodeId && i.name == ''))&&tableData[tableIndex].editFlag == 1&&!disabled" @blur="tdBlur(i)" />
					<span v-if="
						i.attributeTypes == 1 &&
						i.checkout == false &&
						i.disabled == false &&
						(( i.id != currentNodeId && i.name != ''))||(i.attributeTypes == 1 && i.checkout == false&&(disabled||tableData[tableIndex].editFlag != 1))">
						{{i.name}}
					</span>
					<!-- 校验行框 以下都是特殊有校验   -->
					<input
						v-if="i.attributeTypes == 1 && i.checkout == 1&&!(i.id != '' && i.id !== currentNodeId && i.name != '')&&!disabled&&tableData[tableIndex].editFlag == 1"
						:disabled="i.id != '' && i.id !== currentNodeId && i.name != ''||disabled"
						@input="tdNameChange(item, id, i.name)" @blur="tdNameBlur(item, id, i.name)" v-model="i.name" />
					<!-- checkout == 1有校验 -->
					<span
						v-if="i.attributeTypes == 1 && i.checkout == 1 && (i.disabled == false || (i.id !== currentNodeId && i.name != ''))||(i.attributeTypes == 1 && i.checkout == 1&&(disabled||tableData[tableIndex].editFlag != 1))">{{i.name}}</span>
					<!-- <span v-if="i.attributeTypes == 1">{{i.name}}</span> -->
					<!-- 签名 -->
					<span v-if="i.attributeTypes == 3">{{ i.signatureDate.content }}:
						<image style="width: 40px;" :src="i.signatureDate.img" mode="widthFix" />
					</span>
					<!-- 下拉框 attributeTypes == 2下拉框  1文本（默认） 3签名区 -->
					<span v-if="disabled&&i.attributeTypes == 2&&tableData[tableIndex].editFlag != 1">{{i.name}}</span>
					<easy-select ref="easySelect" size="medium" :tableIndex="tableIndex" :idx="idx" :id="id"
						v-if="!disabled&&i.attributeTypes == 2&&tableData[tableIndex].editFlag == 1" :options="i.option" :value="i.name" @selectOne="selectOne"
						:forbidden='disabled||tableData[tableIndex].editFlag != 1'></easy-select>
				</td>
			</tr>
		</table>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {} // 获取登录pkid
			};
		},
		props: {
			tableData: { type: Array, default: () => [] }, // 表格内容
			tableIndex: { type: Number, default: 0 }, // 表格点击的索引
			disabled: { type: Boolean, default: false },
			currentNodeId: ""
		},
		watch: {
			tableData(val) {
				console.log("获取到的", val);
				if (Object.keys(this.tableData).length > 0) {
					this.user = uni.getStorageSync("user");
					this.user.pkId = this.user.userId;
					if (this.tableData.length > 0) {
						this.tableData.forEach((item,index) => {
							console.log(item.tableHtml);
							item.tableHtml = this.utils.unzip(item.tableHtml);
							console.log(item.tableHtml);
							if (item.tableHtml instanceof Array) {} else {
								if(!!this.isJSON(item.tableHtml)){
									item.tableHtml = JSON.parse(item.tableHtml);
								}
							}
							console.log(item.tableHtml);
							this.$nextTick(()=>{
								console.log(item.tableHtml);
								if (item.tableHtml instanceof Array) {} else {
									if(!!this.isJSON(item.tableHtml)){
										item.tableHtml = JSON.parse(item.tableHtml);
									}else{
										item.tableHtml = this.utils.unzip(item.tableHtml);
									}
							}
							})
						});
					}
				}
			}
		},
		methods: {
			isJSON(con){
				try{
					JSON.parse(con)
					return true
				}catch{
					return false
				}
			},
			tdClick(i,id,item){
				console.log('点击',i,id,item);
			},
			signUrl(url, roleId) {

				// ======================================================================
				this.tableData.forEach(item => {
					if (item.tableHtml != undefined && item.tableHtml != null && item.tableHtml.length != 0) {
						item.tableHtml.forEach(e => {
							e.arr.forEach(i => {
								if (i.attributeTypes == 3 && i.signatureDate.signer == roleId) {
									i.signatureDate.img = url;
									console.log();
								}
							});
						});
					}
				});

				this.gzipTable();
				// ======================================================================

			},
			// 保存表格压缩
			gzipTable() {
				// 获取里面html的值，赋值给tableDTOS 深拷贝
				const tableData2 = JSON.parse(JSON.stringify(this.tableData));
				if (tableData2.length > 0) {
					tableData2.forEach(item => {
						if (item.tableHtml instanceof Array) {
							item.tableHtml = JSON.stringify(item.tableHtml);
							item.tableHtml = this.utils.zip(JSON.stringify(item.tableHtml));
						}
					});
					this.$emit("sendGzipTableHtml", tableData2);
				}else{
					this.$emit("sendGzipTableHtml", [])
				}
			},
			//========================一下都是固定表格处理数据方法=======================================
			tdBlur(i) {
				// i.id = this.user.pkId;
				if (i.disabled) {
					i.id = this.currentNodeId;
				}
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
					const data =
						/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
					if (val.length != 0) {
						if (data.test(val)) {} else {
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
						if (reg.test(val) || regs.test(val)) {} else {
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
				this.tableData[val.tableIndex].tableHtml[val.idx].arr[val.id].name =
					val.options.label;
				this.tableData[val.tableIndex].tableHtml[val.idx].arr[val.id].id = this.user.pkId;
			},
		}
	};
</script>

<style></style>