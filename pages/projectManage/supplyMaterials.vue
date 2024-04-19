<template>
  <view class="wrapper">
    <u-navbar
      leftText="供应材料"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <view style="background: #fff">
        <u-tabs class="tabs" :list="list1"  @change="currentChange" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}"> </u-tabs>
      </view>
      <view class="search-input">
        <u-input
          placeholder="请输入清单名称"
          v-model="materialName"
          suffixIconStyle="color: #909399"
          maxlength="25"
        >
        <template slot="suffix">
          <u-icon name="search" @click="init"></u-icon>
				</template>
      </u-input>
      </view>
      <view class="table_detail table_empty" v-show="(current==0)">
        <table>
          <thead>
            <tr>
              <th>子目号</th>
              <th>清单名称</th>
              <th>清单类别</th>
              <th>单位</th>
              <th>供应数量</th>
              <th>供应单价</th>
              <th>供应总额</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in details.deductions" :key="index">
              <td>{{ item.subitemNum }}</td>
              <td>{{ item.materialName }}</td>
              <td>{{ item.fkTypeName }}</td>
              <td>{{ item.fkUnitName }}</td>
              <td>{{ item.supplyNum }}</td>
              <td>{{item.supplyPrice}}</td>
              <td>{{( item.supplyNum * item.supplyPrice)}}</td>
              <td>{{ item.remark }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      </view>
      <view class="table_detail table_empty"  v-show="(current==1)">
        <table>
          <thead>
            <tr>
              <th>子目号</th>
              <th>清单名称</th>
              <th>材料分类</th>
              <th>单位</th>
              <th>超额比例</th>
              <th>超额扣款单价</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in details.noDeductions" :key="index">
              <td>{{ item.subitemNum }}</td>
              <td>{{item.materialName}}</td>
              <td>{{ item.fkTypeName }}</td>
              <td>{{ item.fkUnitName }}</td>
              <td>{{ item.supplyNum + '%'}}</td>
              <td>{{ item.excessPrice }}</td>
              <td>{{ item.remark }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      </view>
      <view class="table_detail"  v-show="(current==2)">
        <table>
          <thead>
            <tr>
              <th>子目号</th>
              <th>清单名称</th>
              <th>清单类别</th>
              <th>单位</th>
              <th>供应数量</th>
              <th>供应单价</th>
              <th>供应总额</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in details.orderDeductions" :key="index">
              <td>{{ item.subitemNum }}</td>
              <td>{{ item.materialName }}</td>
              <td>{{ item.fkTypeName }}</td>
              <td>{{ item.fkUnitName }}</td>
              <td>{{ item.supplyNum }}</td>
              <td>{{item.supplyPrice}}</td>
              <td>{{item.supplyNum * item.supplyPrice}}</td>
              <td>{{ item.remark }}</td>
            </tr>
          </tbody>
        </table>
      </view>
    </view>
    <view type="primary" class="btn" @click="derive">导出</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list1: [{ name: "甲供扣款" }, { name: "甲供不扣款" },{name:"其他材料"}],
      materialName: "",
      rowData:{},
      details:{
        deductions:[],
        noDeductions:[],
        orderDeductions:[]
      },
      current:0
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);
    this.init()
  },
  methods:{
    currentChange(item) {
      this.current = item.index;
      console.log(this.current);
    },
    init(){
      this.$api.contractSupplyMaterialSearch2({contractId:this.rowData.pkId,materialName:this.materialName}).then(res=>{
        if(res.code == 200){
          this.details = res.data
        }else{
          uni.showToast({ icon: "none", title: res.msg });
        }
      })
    },
    derive(){
      let data= {
        contractId:this.rowData.pkId,
        type:2
      }
      
      this.$api.contractDetailExportFile2(data).then(res=>{
        if(res.code == 200){
          this.downLoad(res.data)
        }else{
          uni.showToast({ icon: "none", title: res.msg });
        }
      })
    },
     // 下载
     downLoad(url) {
      const downLoadTask = uni.downloadFile({
        url: url, //仅为示例，并非真实的资源
        success: (res) => {
          if (res.statusCode === 200) {
            console.log("下载成功", res);
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: function (res2) {
                // var savedFilePath = res.savedFilePath;
                console.log(res2);
                uni.showToast({
                  title: "已保存至" + res2.savedFilePath,
                });
                setTimeout(() => {
                  uni.openDocument({
                    filePath: res2.savedFilePath,
                    success: (result) => {},
                  });
                }, 1000);
              },
            });
          }
        },
      });
    },
  }
};

</script>

<style lang="scss" scoped>
.tabs {
  /deep/ .u-tabs__wrapper__nav__item {
    flex: 1;
  }
}
.search-input {
  margin: 10px;
  background: #fff;
}
</style>
