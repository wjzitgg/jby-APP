<template>
	<view class="wrapper">
		<u-navbar :leftText="nodeData.materialName" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
		<view class="pad"></view>

		<view class="content">
			<view class="table_detail table_empty">
				<table>
					<thead>
						<tr>
							<th style="width: 40px"><u-icon name="list" style="display: inline-block"></u-icon></th>
							<th>变动类型</th>
							<th>关联单据</th>
							<th>单据负责人</th>
							<th>单位</th>
							<th>变动前数量</th>
							<th>变动数量</th>
							<th>变动后数量</th>
							<th>变动时间</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in tablelist" :key="index">
							<td>{{ index + 1 }}</td>
							<td>{{ item.changeCode }}</td>
							<td>{{ item.orderCode }}</td>
							<td>{{ item.userName }}</td>
							<td>{{ item.unitName }}</td>
							<td>{{ item.stockNum }}</td>
							<td>{{ item.num }}</td>
							<td>{{ item.stockAfterNum }}</td>
							<td>{{ item.changeTime }}</td>
						</tr>
					</tbody>
				</table>
				<u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			nodeData: {},
			tablelist: []
		};
	},
	computed: {
    	user() {
    	  return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    	},
  	},
	onLoad(options) {
		this.nodeData = JSON.parse(options.obj);
		console.log(this.nodeData);
		this.getData();
	},
	methods: {
		getData() {
			let data = {
				pageNum: 1,
				pageSize: 100,
				fkWarehouseId: this.nodeData.fkWarehouseId,
				fkMaterialId: this.nodeData.fkMaterialId,
				fkOrgId:this.user.orgType === 5 ? "" : uni.getStorageSync("nowOrgId")
			};
			this.$api.changeRecord(data).then(res => {
				if (res.code === 200) {
					this.tablelist = res.data.records;
				} else {
					uni.showToast({
						title: res.msg,
						icon: "error"
					});
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.pad{
	height: 20rpx;
}
.pdb {
	height: 100rpx;
}
</style>
