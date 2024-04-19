<template>
	<view class="wrapper">
		<u-navbar leftText="质量体系" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<!-- 头部tabs -->
		<view class="sticky">
			<u-tabs :list="tabList" :current="current" @click="listSelet" class="tabs" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}">
				<view slot="right" class="hamburg" @tap="hamburg"><u-icon name="list" size="21" bold></u-icon></view>
			</u-tabs>
		</view>
		<view class="content">
			<view class="pull-down" v-show="show1">
				<text class="item-tab" :class="index == current ? 'action' : ''" v-for="(item, index) in tabList"
					:key="index" @click="listSelet(item, index)">{{ item.name }}</text>
				<!-- 箭头 -->
				<u-icon name="arrow-up" color="#dddddd" size="20" class="arrow-up" @click="shut"></u-icon>
			</view>
			<view class="pri-img" v-if="current === 0">
				<view v-if="fileData1.length" style="position: relative;">
					<image :src="fileData1[0].enclosureUrl" mode="widthFix"></image>
					<!-- <u-icon v-if="$auth('quality:system:delete')" style="position: absolute;top:6px;right:15px" name="close"
						@click="openLinkMod(fileDataId1)" color="red" size="10"></u-icon> -->
						<view  v-if="$auth('quality:system:delete')" style="position: absolute;top:6px;right:15px;color:red" name="close" @click="openLinkMod(fileDataId1)"  size="10">X</view>
				</view>
				<!-- <u-empty icon="/static/image/noData.png" v-else></u-empty> -->
				<view v-else class="pri-img-upload" v-show="$auth('quality:system:add')">
					<u-icon name="photo-fill" color="#ccc" size="150"></u-icon>
					<lsj-upload style="position: fixed;
    bottom: 0px;
    width: 100%;
    height: 47px;" ref="lsjUpload1" childId="upload2" :width="width" :height="height" :option="option" :size="size"
						:formats="formats" :debug="debug" :count="10" :nowCount="fileList.length" :instantly="instantly"
						@change="onChange" @progress="onprogress" @uploadEnd="onuploadEnd">
						<!-- <u-icon name="photo-fill" color="#2979ff" size="60"></u-icon> -->
						<view class="upload-btn btn">上传文件</view>
					</lsj-upload>
				</view>
			</view>
			<view class="pri-img" v-if="current === 1">
				<view v-if="fileData2.length" style="position: relative;">
					<image :src="fileData2[0].enclosureUrl" mode="widthFix"></image>
					<!-- <u-icon v-if="$auth('quality:system:delete')" style="position: absolute;top:6px;right:15px" name="close"
						@click="openLinkMod(fileDataId2)" color="red" size="10"></u-icon> -->
						<view v-if="$auth('quality:system:delete')" style="position: absolute;top:6px;right:15px;color:red" name="close" @click="openLinkMod(fileDataId2)"  size="10">X</view>
				</view>

				<!-- <u-empty icon="/static/image/noData.png" v-else></u-empty> -->
				<view v-else class="pri-img-upload" v-show="$auth('quality:system:add')">
					<u-icon name="photo-fill" color="#ccc" size="150"></u-icon>
					<lsj-upload ref="lsjUpload1" style="position: fixed;bottom: 0px;width: 100%;height: 47px;" childId="upload2" :width="width" :height="height" :option="option"
						:size="size" :formats="formats" :debug="debug" :count="10" :nowCount="fileList.length"
						:instantly="instantly" @change="onChange" @progress="onprogress" @uploadEnd="onuploadEnd">
						<!-- <u-icon name="photo-fill" color="#2979ff" size="60"></u-icon> -->
						<view class="upload-btn btn" >上传文件</view>
					</lsj-upload>
				</view>
			</view>
			
			<view class="" v-if="current === 2">
				<view class="list" v-if="fileData3.length > 0">
					<view class="list-item" v-for="(item, index) in fileData3" :key="index">
						<u-icon name="file-text-fill" color="#d73434" size="28" class="file-icon"
							@click="previewFile(item.enclosureUrl)"></u-icon>
						<text class="filename-upload" @click="previewFile(item.enclosureUrl)">{{ item.enclosureName }}</text>
						<u-icon v-if="$auth('quality:system:delete')"
							style="position: absolute;top:50%;right:20rpx;transform: translateY(-50%);" name="close"
							@click="openLinkMod(item.enclosureUrl)" color="red" size="10"></u-icon>
					</view>
				</view>

				<!-- <u-empty icon="/static/image/noData.png" v-else></u-empty> -->
				<view  class="pri-img-upload" v-show="$auth('quality:system:add')">
					<u-icon v-if="fileData3.length == 0" name="photo-fill" color="#ccc" size="150"></u-icon>
					<lsj-upload ref="lsjUpload1" style="position: fixed;bottom: 0px;width: 100%;height: 47px;" childId="upload2" :width="width" :height="height" :option="option"
						:size="size" :formats="formats" :debug="debug" :count="10" :nowCount="fileList.length"
						:instantly="instantly" @change="onChange" @progress="onprogress" @uploadEnd="onuploadEnd">
						<!-- <u-icon name="photo-fill" color="#2979ff" size="60"></u-icon> -->
						<view class="upload-btn btn" >上传文件</view>
					</lsj-upload>
				</view>
			</view>

			<view class="" v-if="current === 3">
				<view class="list" v-if="fileData4.length">
					<view class="list-item" v-for="(item, index) in fileData4" :key="index">
						<u-icon name="file-text-fill" color="#d73434" size="28" class="file-icon"
							@click="previewFile(item.enclosureUrl)"></u-icon>
						<text class="filename-upload" @click="previewFile(item.enclosureUrl)">{{ item.enclosureName }}</text>
						<u-icon v-if="$auth('quality:system:delete')"
							style="position: absolute;top:50%;right:20rpx;transform: translateY(-50%);" name="close"
							@click="openLinkMod(item.enclosureUrl)" color="red" size="10"></u-icon>
					</view>
				</view>
				<!-- <u-empty icon="/static/image/noData.png" v-else></u-empty> -->
				<view  class="pri-img-upload" v-show="$auth('quality:system:add')">
					<u-icon v-if="fileData4.length == 0" name="photo-fill" color="#ccc" size="150"></u-icon>
					<lsj-upload ref="lsjUpload1" style="position: fixed;bottom: 0px;width: 100%;height: 47px;" childId="upload2" :width="width" :height="height" :option="option"
						:size="size" :formats="formats" :debug="debug" :count="10" :nowCount="fileList.length"
						:instantly="instantly" @change="onChange" @progress="onprogress" @uploadEnd="onuploadEnd">
						<!-- <u-icon name="photo-fill" color="#2979ff" size="60"></u-icon> -->
						<view class="upload-btn btn" >上传文件</view>
					</lsj-upload>
				</view>
			</view>
			<view class="pri-img" v-if="current === 4">
				<view v-if="fileData5.length" style="position: relative;">
					<image :src="fileData5[0].enclosureUrl" mode="widthFix"></image>
					<!-- <u-icon v-if="$auth('quality:system:delete')" style="position: absolute;top:6px;right:15px;"
						name="close" @click="openLinkMod(fileDataId5)" color="red" size="10"></u-icon> -->
						<view v-if="$auth('quality:system:delete')" style="position: absolute;top:6px;right:15px;color:red" name="close" 
						@click="openLinkMod(fileDataId5)"  size="10">X</view>
				</view>
				<!-- <u-empty icon="/static/image/noData.png" v-else></u-empty> -->
				<view v-else class="pri-img-upload" v-show="$auth('quality:system:add')">
					<u-icon name="photo-fill" color="#ccc" size="150"></u-icon>
					<lsj-upload ref="lsjUpload1" style="position: fixed;bottom: 0px;width: 100%;height: 47px;" childId="upload2" :width="width" :height="height" :option="option"
						:size="size" :formats="formats" :debug="debug" :count="10" :nowCount="fileList.length"
						:instantly="instantly" @change="onChange" @progress="onprogress" @uploadEnd="onuploadEnd">
						<!-- <u-icon name="photo-fill" color="#2979ff" size="60"></u-icon> -->
						<view class="upload-btn btn" >上传文件</view>
					</lsj-upload>
				</view>
			</view>
		</view>
		<!-- 预览 -->
		<u-popup :show="previewShow" mode="center" round="10" closeable @close="closePreview">
			<view class="preview">
				<view class="preview-top"></view>
				<pdf :fileUrl="previewUrl" :iframeStyle="{ width: '700rpx', height: '1080rpx' }" :imgs="false"></pdf>
			</view>
		</u-popup>
		<u-modal :show="showLinkMod" title="删除确认" content="确定删除该信息？" showCancelButton @confirm="linkModConfirm"
			@cancel="closeLinkMod"></u-modal>
	</view>
</template>

<script>
import pdf from "../../components/pdf-preview.vue";
import request from "@/common/request";
export default {
	components: { pdf },
	computed: {
		user() {
			return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
		},
	},
	data() {
		return {
			tabList: [
				{
					name: "管理机构",
					idx: 0
				},
				{
					name: "人员配置",
					idx: 1
				},
				{
					name: "管理措施",
					idx: 2
				},
				{
					name: "管理制度",
					idx: 3
				},
				{
					name: "管理体系图",
					idx: 4
				}
			],
			fileData1: [],
			fileData2: [],
			fileData3: [],
			fileData4: [],
			fileData5: [],
			fileDataId1: "",
			fileDataId2: "",
			fileDataId3: "",
			fileDataId4: "",
			fileDataId5: "",
			linkId: '',
			show1: false,
			current: 0,
			previewShow: false,
			previewUrl: "",

			////////////
			fileList: [],
			// 上传接口参数
			option: {
				// 上传服务器地址，此地址需要替换为你的接口地址
				url: request.baseUrl + "/app/file/upload/picture",
				// 上传附件的key
				name: "file",
				
				// 根据你接口需求自定义请求头,默认不要写content-type,让浏览器自适配
				header: {
					// 示例参数可删除
					'Authorization': uni.getStorageSync("token"),
				},
				// 根据你接口需求自定义body参数
				// formData: {
				// 	// 'orderId': 1000
				// }
			},

			// 选择文件后是否立即自动上传，true=选择后立即上传
			instantly: true,
			// 必传宽高且宽高应与slot宽高保持一致
			width: "150rpx",
			height: "40rpx",
			// 限制允许上传的格式，空串=不限制，默认为空
			formats: "",
			// 文件上传大小限制
			size: 30,
			// 是否打印日志
			debug: false,
			showLinkMod: false,
			
		};
	},
	mounted() {
		this.getData();
	},
	methods: {
		onChange(e) {
			console.log|(e,"00000")
			console.log("改变事件", e);
		},
		onprogress(e) {
			console.log("中途事件", e);
		},

		onuploadEnd(e) {
			console.log("结束事件", e);
			if (e.responseText) {
				let res = JSON.parse(e.responseText);
				if (res.code === 200) {
					//   this.fileList.push({
					//     enclosureName: e.name,
					//     enclosureUrl: res.data,
					//   });
					// console.log(res)
					// console.log(e)
					let data = {
						enclosureName: e.name,
						enclosureUrl: res.data,
					}
					this.addAndUpdateApp(data)
				}
			}
			//   console.log(this.fileList);
		},

		// 
		addAndUpdateApp(row, del) {
			let data = {
				basicsType: this.current + 1,
				hierarchyType: 1,
				enclosures: del ? row : [row],
				pkId: this['fileDataId' + (this.current + 1)]
			}
			if (!data.pkId) {
				delete data.pkId
			}
			if(this.current === 2 && !del){
				data.enclosures = [...this.fileData3,...data.enclosures]
			}
			if(this.current === 3 && !del){
				data.enclosures = [...this.fileData4,...data.enclosures]
			}
			uni.showLoading({
				mask: true
			});
			this.$api.addAndUpdateApp(data).then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					this.getData()
					if (del) {
						uni.showToast({ title: "删除成功" });
						this.closeLinkMod()
					}
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			})
		},
		openLinkMod(id) {
			this.linkId = id
			this.showLinkMod = true
		},
		closeLinkMod() {
			this.showLinkMod = false;
		},
		linkModConfirm() {
			this.safetyDailyDeleter();
		},
		// 删除
		safetyDailyDeleter() {
			if ([0, 1, 4].includes(this.current)) {
				this.$api.hierarchyDelete({ pkId: this.linkId }).then(res => {
					if (res.code == 200) {
						this.getData()
						uni.showToast({ title: "删除成功" });
						this.closeLinkMod()
					} else {
						uni.showToast({
							title: res.msg,
							icon: "error"
						});
					}
				})
			} else {
				let list = this.current === 2 ? this.fileData3 : this.fileData4
				let sendList = list.filter(item => item.enclosureUrl !== this.linkId)
				this.addAndUpdateApp(sendList, true)
			}
		},
		// 预览文件
		previewFile(url) {
			this.$checkName(url)
      		return
			this.previewUrl = url;
			this.previewShow = true;
		},
		// 获取文件
		getData() {
			uni.showLoading({
				mask: true
			});
			this.$api.getsafetImg({ hierarchyType: 1, fkOrgId: this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId") }).then(res => {
				if (res.code === 200) {
					console.log(res);
					this.allData = res.data
					if (res.data.managementOrganization !== null) {
						this.fileData1 = res.data.managementOrganization.enclosures
						this.fileDataId1 = res.data.managementOrganization.pkId
					} else {
						this.fileData1 = []
						this.fileDataId1 = ''
					}
					if (res.data.staffing !== null) {
						this.fileData2 = res.data.staffing.enclosures.length ? res.data.staffing.enclosures : [];
						this.fileDataId2 = res.data.staffing.pkId
					} else {
						this.fileData2 = []
						this.fileDataId2 = ''
					}
					if (res.data.managementMeasures !== null) {
						this.fileData3 = res.data.managementMeasures.enclosures.length ? res.data.managementMeasures.enclosures : [];
						this.fileDataId3 = res.data.managementMeasures.pkId
					} else {
						this.fileData3 = []
						this.fileDataId3 = ''
					}
					if (res.data.managementSystem !== null) {
						this.fileData4 = res.data.managementSystem.enclosures.length ? res.data.managementSystem.enclosures : [];
						this.fileDataId4 = res.data.managementSystem.pkId
					} else {
						this.fileData4 = []
						this.fileDataId4 = ''
					}
					if (res.data.managementSystemDiagram !== null) {
						this.fileData5 = res.data.managementSystemDiagram.enclosures.length ? res.data.managementSystemDiagram.enclosures : [];
						this.fileDataId5 = res.data.managementSystemDiagram.pkId
					} else {
						this.fileData5 = []
						this.fileDataId5 = ''
					}
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
				uni.hideLoading();
			});
		},
		// 汉堡点击展开tabs
		hamburg() {
			this.show1 = true;
		},
		shut() {
			this.show1 = false;
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
		},

		closePreview() {
			this.previewShow = false;
			this.previewUrl = "";
		}
	}
};
</script>

<style lang="scss">
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

.filename-upload{
	white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

// 图片 预览
.pri-img {
	padding-top: 10rpx;
	text-align: center;
}

.list {
	background-color: #fff;
	margin-top: 1px;
}

.list-item {
	display: flex;
	align-items: center;
	border-bottom: 1px solid #f5f0f0;
	padding: 20rpx 28rpx;
	position: relative;

	text {
		font-size: 28rpx;
		margin-left: 24rpx;
	}
}

.preview {
	width: 700rpx;
	height: 1200rpx;
	padding-bottom: 40rpx;
	overflow: auto;

	.preview-top {
		height: 80rpx;
		line-height: 80rpx;
		padding-left: 40rpx;
	}
}
/deep/ .lsj-file .hFile{
	width: 100% !important;
	height: 52% !important;
}
.pri-img-upload {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}</style>
