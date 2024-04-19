<!-- 编辑和新增流程 -->
<template>
	<view class="wrapper">
		<u-navbar leftText="采购计划单详情" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<!-- tabs -->
		<view class="sticky">
			<u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="false" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"></u-tabs>
		</view>
		<view class="content">
			<!-- ======================== -->
			<view v-show="current == 0" style="width:750rpx">
				<tableForm :list="[
        		{name:'采购计划单号',value:nodeDetels.orderCode,show:true},
        		{name:'负责人',value:nodeDetels.leaderName,show:true},
        		{name:'业务时间',value:nodeDetels.serviceTime,show:true},
        		{name:'制单人',value:nodeDetels.createUserName,show:true},
        		{name:'单据时间',value:nodeDetels.createTime,show:true},
        		{name:'收料地址',value:nodeDetels.receiptAddress,show:true},
        		{name:'备注',value:nodeDetels.remark,show:true},
        		{name:'单据状态',value:nodeDetels.purchaseCode,show:true},
        		]"
        		></tableForm>
			</view>
			<!-- <view class="list" v-show="current == 0">
				<view class="list-item">
					采购计划单号：
					<text>{{ nodeDetels.orderCode }}</text>
				</view>
				<view class="list-item">
					负 责 人：
					<text>{{ nodeDetels.leaderName }}</text>
				</view>
				<view class="list-item">
					业务时间：
					<text>{{ nodeDetels.serviceTime }}</text>
				</view>
				<view class="list-item">
					制 单 人：
					<text>{{ nodeDetels.createUserName }}</text>
				</view>
				<view class="list-item">
					单据时间：
					<text>{{ nodeDetels.createTime }}</text>
				</view>
				<view class="list-item">
					收料地址：
					<text>{{ nodeDetels.receiptAddress }}</text>
				</view>
				<view class="list-item">
					备 注：
					<text>{{ nodeDetels.remark }}</text>
				</view>
				<view class="list-item">
					单据状态：
					<text>{{ nodeDetels.purchaseCode }}</text>
				</view>
			</view> -->
			<!-- 物料信息 -->
			<view v-show="current == 1">
				<view class="table_detail table_empty">
					<table>
						<thead>
							<tr>
								<th style="width: 40px">序号</th>
								<th>物料名称</th>
								<th>物料分类</th>
								<th>单位</th>
								<th>需求数量</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in nodeDetels.orderApplyMaterialDetails" :key="index">
								<td>{{ index + 1 }}</td>
								<td>{{ item.materialName }}</td>
								<td>{{ item.materialTypeName }}</td>
								<td>{{ item.unitName }}</td>
								<td>{{ item.purchaseNum }}</td>
							</tr>
						</tbody>
					</table>
					<u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
				</view>

				<!-- <view class="bottom-btn" v-if="!checkboxValue1.length"><u-button text="添加物料" class="add-material" @click="tableAdd"></u-button></view> -->
			</view>
		</view>
		<!-- ======================== -->
		<view class="popup-footer" style="justify-content: space-between; width: 100%" v-if="nodeDetels.purchaseCode==='待确认'">
			 <!-- v-show="$menuPerm('often:purchase:reject')" -->
			<view class="btns"><u-button class="btn-iem2" type="primary" text="驳回" @click="rejcect" size="large"></u-button></view>
			<!-- v-show="$menuPerm('often:purchase:confirm')" -->
			<view class="btns" ><u-button class="btn-iem" type="primary" text="确认" @click="btnOk(2)" size="large"></u-button></view>
		</view>
		<u-popup :show="appShow" mode="bottom" round="10">
        <view class="pop">
			<view class="pop-head">
			<u-icon @click="closePop" class="approve-closeBtn" name="close" size="18" ></u-icon>
          </view>
          <view class="mb-20">
            <view class="form-title">驳回原因</view>
            <u--input
              placeholder="请输入内容"
              border="none"
              v-model="opinion"
              customStyle=""
              class="form-content"
              clearable
            ></u--input>
          </view>
          <view class="pop-btns">
            <view class="btns grey" @click="closePop">取消</view>
            <view class="btns red " @click="btnOk(3)">驳回</view>
          </view>
        </view>
      </u-popup>
	</view>
</template>

<script>
import tableForm from '../../components/table-form/table-form.vue';
export default {
	components:{tableForm},
	data() {
		return {
			pkId: "", // 订单id
			title: "采购计划单详情",
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
				purchaseCode: 1, //采购状态编码 0:草稿，1：待确认，2：已确认，3：已驳回，4：已完成
				rePurchaseApplies: []
			},
			valtime: Number(new Date()),
			statusCode: "", // 最原本单号没修改过
			areaList: [[]], // 供应商
			checkboxValue1: [],
			// 基本案列数据
			checkboxList1: [],
			searchOrdercode: "",
			appShow:false,
			opinion:""
		};
	},
	onLoad(option) {
		console.log(option);
		this.pkId = option.pkId;
		this.getData();
	},
	methods: {
		// 获取数据
		getData() {
			this.$api.queryMaterialOder({ pkId: this.pkId }).then(res => {
				if (res.code === 200) {
					this.nodeDetels = res.data;
				} else {
					uni.showToast({
						title: res.msg,
						icon: "none"
					});
				}
			});
		},
		// tab切换
		currentChange(e) {
			this.current = e.index;
		},
		rejcect(){
			this.appShow=true
		},
		closePop(){
      	  this.opinion=''
      	  this.appShow=false
      	},
		btnOk(businessType){
			let data={
				businessType,
				pkId:this.pkId
			}
			if(businessType===3){
				data.reason=this.opinion
				if(!data.reason){
					return uni.showToast({title:"请输入驳回原因",icon:"none"})
				}
			}
			// 2：确认，3：驳回
			this.$api.modifyStatus(data).then(res => {
				if (res.code === 200) {
					uni.showToast({
						title: businessType===2?'确认成功':"驳回成功",
						icon: "success"
					});
					this.closePop()
					setTimeout(() => {
						uni.$emit("refreshData");
						uni.navigateBack(1);
					}, 1000);
				} else {
					uni.showToast({
						title: res.msg,
						icon: "none"
					});
				}
			});
		},
		// 保存新增 num  0:草稿，1：待确认
		submitMaterial(num) {
			let data = { ...this.nodeDetels };
			if (num) {
				data.purchaseCode = num;
			}
			if (this.nodeDetels.orderCode == this.statusCode) {
				data.isUpdate = 0;
			} else {
				data.isUpdate = 1;
			}
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
							uni.redirectTo({
								url: "/pages/material/generalPurchase"
							});
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
						icon: "error"
					});
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	padding-bottom: 120rpx;
	padding-top: 88rpx;
}
// 详情
.list {
	padding: 20rpx 40rpx 40rpx;
	margin-top: 8rpx;
	background-color: #fff;
	font-size: 28rpx;
	.list-item {
		height: 80rpx;
		line-height: 80rpx;
		border-bottom: 1px solid #eee;
		text {
			color: #79859a;
		}
	}
}

.name {
	width: 520rpx;
	// margin-bottom: 20rpx;
	overflow: hidden; /*超出部分隐藏*/
	white-space: nowrap; /*禁⽌换⾏*/
	text-overflow: ellipsis; /*省略号*/
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
		color: #fff;
		.btn-iem {
			background: #1576e6;
			border: none;
			border-radius: 0;
		}
		.btn-iem2 {
			background: #fa2020;
			border: none;
			border-radius: 0;
		}
	}
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
.pop{
//   width: 600rpx;
  padding: 0 20rpx 20rpx;
  border-radius: 20rpx;
  background-color: #f7f7ff;
  .form-title {
  margin-left: 20rpx;
  line-height: 60rpx;
}
.form-content {
  padding-left: 6px;
  height: 80rpx;
  background: #fff;
}
  .pop-head{
    position: relative;
	height: 50rpx;
	line-height: 50rpx;
	padding: 0 20rpx;
    .approve-title {
      text-align: center;
			// font-size: 28rpx;
		}
		.approve-closeBtn {
			position: absolute;
			right: 20rpx;
			top: 50%;
			transform: translateY(-50%);
		}
  }
  .pop-btns{
    display: flex;
    justify-content: space-evenly;
    .btns{
	display: flex;
	justify-content: center;
	align-items: center;
      width: 250rpx;
	  height: 80rpx;
      border-radius: 10rpx;
      color: #fff;
      font-size: 26rpx;
    }
    .blue{
      background-color: #169bd5;
    }
    .red{
      background-color: #e34155;
    }
	.grey{
		color: #aaaaaa;
		background-color: #eeeeee;
	}
  }
}
.mb-20{
  margin-bottom: 20rpx;
}
</style>
