<template>
	<view style="background: #fff;overflow: auto;" id="html2canvas" :change:nums="html2canvas.getData" :nums="nums" :change:token="html2canvas.getData2" :token="token">
		<table style="width:476px;height:603.6px;border-collapse: collapse; overflow: auto; margin: 0 auto" :id="'tables'+index1" v-if="tableStatus" v-for="(item1,index1) in tableList" :key="key + index1">
			<tr v-for="(item, idx) in item1.tableHtml" :key="idx" style="" v-show="item.status">
				<td style=" box-sizing: content-box; border: none; margin: 0; padding: 0; " v-for="(i, id) in item.arr" :style="[i.style]" :key="id" :rowspan="i.row" :colspan="i.span" :id="'td' + idx + id" :ref="'td' + idx + id" >
					<!-- <input
						type="text"
						v-model="i.name"
						:disabled="i.disabled == false || (i.id == user.pkId && i.name != '')||disabled"
						v-show="i.attributeTypes == 1 && i.checkout == false"
						@blur="tdBlur(i)"
					/>
					<input
						v-if="i.attributeTypes == 1 && i.checkout == 1"
						:disabled="i.id != '' && i.id == user.pkId && i.name != ''||disabled"
						@input="tdNameChange(item, id, i.name)"
						@blur="tdNameBlur(item, id, i.name)"
						v-model="i.name"
					/> -->
					<span v-if="(i.attributeTypes == 1 && i.checkout == false)||(i.attributeTypes == 1 && i.checkout == 1)">{{i.name}}</span>
					<span v-if="i.attributeTypes == 3">{{ i.signatureDate.content }}:<img width="80px" :src="i.signatureDate.img" alt="" /></span>
					<span v-if="i.attributeTypes == 2">{{i.name}}</span>
		<!-- 			<easy-select
						ref="easySelect"
						size="medium"
						:tableIndex="tableIndex"
						:idx="idx"
						:id="id"
						v-if="i.attributeTypes == 2"
						:options="i.option"
						:value="i.name"
						@selectOne="selectOne"
						:forbidden='true'
					></easy-select> -->
				</td>
			</tr>
		</table>
	</view>
</template>

<script module="html2canvas" lang="renderjs">
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf'
import request from '../../common/request';
import axios from "axios";
export default {
	data(){
		return{
			nums:0,
			returnArr:[],
			action: '/app/file/upload/picture',
			token:null
		}
	},
    methods: {
        async create() {
			if(!this.nums){
				return
			}
            try {
				console.log('123');
			this.$ownerInstance.callMethod('showLoading', true);
			this.htmlToPdf()
			
            }
            catch (error) {
               console.log(error)
            }
        },
		getData(newValue, oldValue, ownerVm, vm){
    	    //   console.log('msg变化了newValue', newValue)
    	    //   console.log('msg变化了oldValue', oldValue)
    	    //   console.log('msg变化了ownerVm', ownerVm)
    	    //   console.log('msg变化了vm', vm)
			if(!newValue)return
    	      this.nums=newValue
			  this.create()
    	},
		getData2(newValue, oldValue, ownerVm, vm){
    	    //   console.log('msg变化了newValue', newValue)
    	    //   console.log('msg变化了oldValue', oldValue)
    	    //   console.log('msg变化了ownerVm', ownerVm)
    	    //   console.log('msg变化了vm', vm)
    	      this.token=newValue
			//   this.create()
    	},
		async htmlToPdf(){

			let arr=[]
			this.returnArr=[]
			for(let i =0; i<this.nums;i++){
				let id ='tables'+i
				const domId = document.getElementById(id);
            	const canvas = await html2canvas(domId, {
            	    width: domId.offsetWidth,
            		//设置canvas尺寸与所截图尺寸相同，防止白边
            		height: domId.offsetHeight,
            		//防止白边
            		logging: true,useCORS: true
				});
				console.log(canvas);
				let contentWidth = canvas.width;
    			let contentHeight = canvas.height;
    			let pageHeight = contentWidth / 592.28 * 841.89;
    			let leftHeight = contentHeight;
    			let position = 0;
    			let imgWidth = 595.28;
    			let imgHeight = 592.28/contentWidth * contentHeight;
            	let pageData  = canvas.toDataURL('image/png', 1.0);
				 let PDF = new JsPDF('', 'pt', 'a4');
				 console.log('pdf实体类',PDF);
				//  if (leftHeight < pageHeight) {
    			    PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth-100, imgHeight -250);
    			// } else {
    			//     while(leftHeight > 0) {
    			//         PDF.addImage(pageData, 'JPEG', 0, position, imgWidth-200, imgHeight-260)
    			//         leftHeight -= pageHeight;
    			//         position -= 841.89;
    			//         if(leftHeight > 0) {
    			//             PDF.addPage();
    			//         }
						
    			//     }
    			// }
				console.log('pdfOk');
				// PDF.save(Date.now()+'.pdf');
				var pdfData = PDF.output('datauristring')
				let file =this.base64ToFile(pdfData,Date.now())
				console.log('pdfToFile');
				arr.push(file)
				let res =await this.uploads(file)
				// console.log(res);
				this.returnArr.push(res)
				if(i==this.nums - 1){
					this.$ownerInstance.callMethod('renderFinish', this.returnArr);
				}
			}
		},
			//base64转flie
			base64ToFile(base64, name) {
				if (typeof base64 != 'string') {
					return;
				}
				var arr = base64.split(',')
				var type = arr[0].match(/:(.*?);/)[1]
				var fileExt = type.split('/')[1]
				var bstr = atob(arr[1])
				var n = bstr.length
				var u8arr = new Uint8Array(n)
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n)
				}
				console.log('转化完成');
				return new File([u8arr], `${name}.` + fileExt, {
					type: type
				})
			},
			async uploads(filePath){
			let path=""
			this.$ownerInstance.callMethod('showLoading', true);
           let res =await this.uploadApi(filePath)
		   path=res.data
		   return path
		},
		uploadApi(filePath){
			console.log(filePath);
			let that =this
			let token =this.token
			console.log(token);
			axios.defaults.headers["Content-Type"] = "multipart/form-data; boundary=----WebKitFormBoundaryBTaT5cRv85y6Dg8M";
			console.log('164',request.baseUrl);
			axios.defaults.baseURL = request.baseUrl;
			axios.defaults.headers.common['Authorization'] = token;
			console.log('166',axios.defaults);
			// axios.interceptors.request.use(
			//   config => {
			// 	console.log(1);
			// 	config.headers.Authorization=''
			//     config.headers.Authorization = token;
			// 	return config
			//   },
			//   error => {
			//     return Promise.error(error);
			//   }
			// );
			return new Promise((resolve, reject) => {
				axios({
					url:that.action,
					method: "post",
					data:{file:filePath}
				}).then(res => {
      			  resolve(res.data);
      			})
      			.catch(err => {
      			  reject(err);
      			});
		// 	uni.uploadFile({
        //       url: that.action, //图片上传post请求的地址
        //       file: filePath,
        //       header: { 'Authorization': this.uni.token, },
        //       name: "file",
        //       success: (uploadFileRes) => {
		// 	  	// path=JSON.parse(uploadFileRes.data).data
		// 		resolve(JSON.parse(uploadFileRes.data))
        //       },
        //       fail: (error) => {
        //         reject(error)
        //       },
        //    });
		})
		},
    }
}
</script>
<script>
export default {
	data() {
		return {
			user: {}, // 获取登录pkid
			key:false,
			nums:0,
			tableList:[],
			token:null,
			tableStatus:true
		};
	},
	props: {
		tableData: { type: Array, default: () => [] }, // 表格内容
		disabled:{type:Boolean,default:false}
	},
	mounted(){
		console.log(this.tableData);
	},
	watch: {
		tableData(val) {
			this.tableList=JSON.parse(JSON.stringify(this.tableData))
			if (Object.keys(this.tableList).length > 0) {
				this.user = uni.getStorageSync("user");
				this.user.pkId = this.user.userId;
				if (this.tableList.length > 0) {
					this.tableList.forEach(item => {
						item.tableHtml = this.utils.unzip(item.tableHtml);
						if (item.tableHtml instanceof Array) {
						} else {
							item.tableHtml = JSON.parse(item.tableHtml);
						}
					});
				}
				this.key=!this.key
			}
		}
	},
	methods: {
		tableToImg(){
			if(this.tableList.length){
				uni.showLoading()
				this.token=uni.getStorageSync("token")
				this.nums=this.tableList.length
			}else{
				this.$emit("sendGzipTableHtml", []);
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
					item.tableHtml = JSON.stringify(item.tableHtml);
					item.tableHtml = this.utils.zip(JSON.stringify(item.tableHtml));
				});
				this.$emit("sendGzipTableHtml", tableData2);
				this.nums=0
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
    	  this.tableList[val.tableIndex].tableHtml[val.idx].arr[val.id].name =
    	    val.options.label;
    	  this.tableList[val.tableIndex].tableHtml[val.idx].arr[val.id].id = this.user.pkId;
    	},
	}
};
</script>

<style></style>
