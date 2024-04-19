<template>
  <view class="wrapper addPageBg">
    <u-navbar
      :leftText="rowData.itemTitle"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <view>
        <view style="padding-bottom: 60px">
          <!-- <view class="add-inputs">
            <view class="inputs-label">申请单号</view>
            <view class="inputs-content">
              <u--textarea v-model="rowData.orderCode" placeholder="请输入内容" autoHeight maxlength="50" border="none"></u--textarea>
            </view>
          </view> -->
          <view class="add-inputs">
            <view class="inputs-label">仓库名称</view>
            <view class="inputs-content">
              <u--textarea v-model="rowData.warehouseName" placeholder="请输入内容" autoHeight maxlength="25" border="none"></u--textarea>
            </view>
          </view>
          <view class="add-inputs">
            <view class="inputs-label" >默认仓库 </view>
            <view class="inputs-content">
              <u-radio-group v-model="value">
              	<u-radio label="是" :name='true'></u-radio>
              	<u-radio label="否" :name='false'></u-radio>
              </u-radio-group>
            </view>
              <!-- <u-switch
                style="position: absolute; top: 6px; left: 83px"
                v-model="value"
              ></u-switch> -->
          </view>
          <view class="add-inputs">
            <view class="inputs-label">负责人</view>
            <view class="inputs-content select" @click="receiveShow = true">
              <view class="name">{{ receiverData.userName }}</view>
              <u-icon
                name="arrow-down-fill"
                class="icons"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
            <u-picker
              :show="receiveShow"
              :columns="receiverList"
              keyName="userName"
              @cancel="receiveClose"
              @confirm="receiveConfirm"
            ></u-picker>
          </view>
          <view class="add-inputs">
            <view class="inputs-label">手机号码</view>
            <view class="inputs-content select">
              <view>{{receiverData.telephone}}</view>
              <u-icon name="lock-fill" class="icons" size="14"></u-icon>
              <!-- <u--input placeholder="请输入内容" border="none" disabled v-model="receiverData.telephone" customStyle="" class="form-content" clearable ></u--input> -->
            </view>
          </view>
          <view v-if="rowData.warehouseType === 1" class="add-inputs">
            <view class="inputs-label">仓库地址</view>
            <!-- <u-input
              placeholder="请输入内容"
              border="none"
              v-model="rowData.address"
              customStyle=""
              class="form-content"
              clearable
            ></u-input> -->
            <view class="inputs-content select" @click="selAdd">
              <view class="name">{{ rowData.detailAddress }}</view>
              <u-icon
                name="arrow-down-fill"
                class="map"
                color="#2a82e4"
                size="12"
              ></u-icon>
            </view>
          </view>
          <view class="add-inputs">
            <view class="inputs-label">备注</view>
            <view class="inputs-content">
              <u--textarea v-model="rowData.remark" placeholder="请输入内容" autoHeight maxlength="100" border="none"></u--textarea>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="box-btn">
      <u-button
        style="background: #eeeeee"
        class="btns cancle"
        type="default"
        text="取消"
        @click="abrogate"
      ></u-button>
      <u-button
        class="btns"
        type="primary"
        text="保存"
        @click="preserve"
      ></u-button>
    </view>
  </view>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      rowData: {},
      value: false,
      receiverList: [], //关联单位
      receiverData: {},
      receiveShow: false, //关联项目弹窗状态
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);
    this.init();
    if (this.rowData.itemTitle == "编辑仓库") {
      this.value=this.rowData.isDefault ==0?false:true;
      this.receiverData.userName =this.rowData.userName
      this.receiverData.pkId =this.rowData.fkUserId
      this.receiverData.telephone =this.rowData.phoneNum
    }else{
      this.rowData.warehouseType=1
    }
  },
  methods: {
    getAddress(e){
      console.log(e,);
      let arr=this.changeAdr(e.address)
      this.$set(this.rowData,'detailAddress',e.address)
      this.$set(this.rowData,'provinceName',e.addressComponents.province)
      this.$set(this.rowData,'cityName',e.addressComponents.city)
      this.$set(this.rowData,'areaName',e.addressComponents.district)
      this.$set(this.rowData,'address',arr[4]?arr[4]:'')
      this.$set(this.rowData,'latitude',e.point.lat)
      this.$set(this.rowData,'longitude',e.point.lng)
      // this.rowData.address=e.address
    },
    changeAdr(value) {
				let reg =
					"(?<province>[^省]+自治区|.*?省|.*?行政区|.*?市)?(?<city>[^市]+自治州|.*?地区|.*?行政单位|.+盟|市辖区|.*?市|.*?县)?(?<county>[^(区|市|县|旗|海域|岛)]+区|.*?市|.*?县|.*?旗|.*?海域|.*?岛)?(?<village>.*)";

				var dt = value.match(reg);
				console.log('dt', dt);
				return dt;
			},
    selAdd(){
      // uni.navigateTo({url:`/pages/map/map?longitude=${''}&latitude=${''}`})
      let that =this
      uni.chooseLocation(
        {
          latitude:that.rowData.latitude,
          longitude:that.rowData.longitude,
          success: function (res) {
	        	console.log('位置名称：' + res.name);
	        	console.log('详细地址：' + res.address);
	        	console.log('纬度：' + res.latitude);
	        	console.log('经度：' + res.longitude);
            let arr=that.changeAdr(res.address)
            that.$set(that.rowData,'detailAddress',res.address)
            that.$set(that.rowData,'provinceName',arr[1])
            that.$set(that.rowData,'cityName',arr[2]?arr[2]:arr[1])
            that.$set(that.rowData,'areaName',arr[3]?arr[3]:'')
            that.$set(that.rowData,'address',arr[4]?arr[4]:'')
            that.$set(that.rowData,'latitude',res.latitude)
            that.$set(that.rowData,'longitude',res.longitude)
	        },
          fail(res){
            console.log(res);
          }
        }
      )
    },
    init() {
      this.$api
        .searchUserListById({ orgId: uni.getStorageSync("user").orgId })
        .then((res) => {
          if (res.code == 200) {
            this.receiverList = [res.data];
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
    },

    // 接收单位
    receiveClose() {
      this.receiveShow = false;
    },
    // 接收单位
    receiveConfirm(e) {
      this.receiverData = e.value[0];
      this.receiveShow = false;
    },

    // 取消新增修改
    abrogate() {
      uni.navigateBack();
    },
    // 保存
    preserve() {
      if(this.rowData.warehouseType === 1&&!this.rowData.detailAddress){
        return uni.showToast({ icon: "none", title: "请选择仓库地址" })
      }
      let data = {
        warehouseName: this.rowData.warehouseName,
        isDefault: this.value == false ? 0 : 1,
        fkUserId: this.receiverData.pkId,
        remark: this.rowData.remark,
        latitude:"",
        longitude:"",
        detailAddress:this.rowData.detailAddress,
        provinceName:this.rowData.provinceName,
        cityName:this.rowData.cityName,
        areaName:this.rowData.areaName,
        address:this.rowData.address
      };
      uni.showLoading({ mask: true })
      if (this.rowData.itemTitle == "新增仓库") {
        this.$api.warehouseAdd(data).then((res) => {
          uni.hideLoading()
          if (res.code == 200) {
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh() // 调用上一页 定义的方法
            uni.navigateBack()
            uni.showToast({ title: "新增成功" });
            // uni.navigateTo({
            //   url: "/pages/material/inventory/info?",
            // });
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
      } else {
        data.pkId = this.rowData.pkId;
        this.$api.warehouseUpdate(data).then((res) => {
          uni.hideLoading()
          if (res.code == 200) {
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh() // 调用上一页 定义的方法
            uni.navigateBack()
            uni.showToast({ title: "编辑成功" });
            // uni.navigateTo({
            //   url: "/pages/material/inventory/info?",
            // });
          
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .uni-input-placeholder{
  padding-left: 10px;
}
.tabs {
  /deep/ .u-tabs__wrapper__nav__item {
    flex: 1;
  }
}
.item-edit-form {
  padding: 8px 16px;
  background: rgb(255, 255, 255);
  margin-top: 2px;
}

.form-title {
  margin-left: 20rpx;
  line-height: 60rpx;
}
.form-content {
  height: 80rpx;
  background: #fff;
}
.select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  background-color: #fff;
}
.name {
  width: 520rpx;
  // margin-bottom: 20rpx;
  font-weight: 600;
  font-size: 30rpx;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁⽌换⾏*/
  text-overflow: ellipsis; /*省略号*/
}
.box-btn {
  display: flex;
  position: fixed;
  width: 100%;
  bottom: 0;
}
.table-btn {
  display: inline-block;
  background: #ebf4ff;
  color: #2b8fed;
  font-size: 10px;
  padding: 6px 23px;
  margin: 6px auto;
  margin-left: 41%;
}

/deep/ .uni-input-input{
  padding-left: 12px;
}
.u-radio{
  margin-right: 20rpx;
}
</style>
