<template>
  <view class="wrapper">
    <u-navbar
      leftText="单位分部分项表"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="content">
      <view class="table_detail table_empty">
        <table>
          <thead>
            <tr>
              <th style="width: 80px">
                <u-icon name="list" style="display: inline-block"></u-icon>
              </th>
              <th>项目名称</th>
              <th>隧道延长米</th>
              <!-- <th>设计产值</th> -->
              <th>工序控制流程</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in details" :key="index">
              <td >
                <text :class="item.grade==3?'clickTd':''" @click="item.grade==3?itemClick(item):''">{{ item.itemCode }}</text>
              </td>
              <td>{{ item.itemName }}</td>
              <td>{{ item.number }}</td>
              <!-- <td>{{ item.designAmount }}</td> -->
              <td>{{ item.workflowName }}</td>
            </tr>
          </tbody>
        </table>
        <u-empty v-if="details.length" mode="data" text="没有更多了" icon="/static/image/tableNoMore.png"></u-empty>
      </view>
    </view>
    <u-popup
      :show="editShow"
      mode="bottom"
      @close="closeEdit"
      @open="openEdit"
      style=""
    >
      <view class="edit-box">
        <view class="box-head">
          <text class="head-text">{{ contractDetails.itemCode }}</text>
          <u-icon name="close" color="#fff" @click="closeEdit" class="head-ico"></u-icon>
        </view>
        <view>
          <u-form
            labelPosition="left"
            :model="contractDetails"
            class="item-edit-form"
          >
            <u-form-item
              label="项目编号:"
              prop="userInfo.name"
              borderBottom
              labelWidth="80"
              ref="item1"
            >
              {{ contractDetails.itemCode }}
            </u-form-item>
            <u-form-item
              label="项目名称:"
              prop="userInfo.sex"
              borderBottom
              ref="item1"
              labelWidth="80"
            >
              {{ contractDetails.itemName }}
            </u-form-item>
            <u-form-item
              label="隧道延长米:"
              prop="userInfo.sex"
              borderBottom
              ref="item1"
              labelWidth="100"
              v-if="contractDetails.itemType==2"
            >
              {{ contractDetails.number }}
            </u-form-item>
            <!-- <u-form-item
              label="设计产值:"
              prop="userInfo.sex"
              borderBottom
              ref="item1"
              labelWidth="80"
            >
              {{ contractDetails.designAmount }}
            </u-form-item> -->
            <u-form-item
              label="工序控制流程:"
              prop="userInfo.sex"
              borderBottom
              ref="item1"
              labelWidth="100"
            >
              <text @click="flowChart" v-if="!contractDetails.handelType" style="text-decoration: underline; color: #2a82e4" >{{ contractDetails.workflowName }}</text >
              <text v-else>处理中</text>
            </u-form-item>
          </u-form>
        </view>
        <view style="height: 6px; background: #eee"></view>
        <view
          v-if="
            contractDetails.reItemDrawings != null &&
            contractDetails.reItemDrawings.length != 0
          "
        >
          <view style="margin-left: 12px; margin-top: 12px">关联图纸：</view>
          <view
            class="sheet-list-table"
            v-for="(item, index) in contractDetails.reItemDrawings"
            :key="index"
            @click="preview(item)"
          >
            <u-icon name="photo" class="list-table-ico" size="26"></u-icon>
            <view class="list-table-text">{{ item.drawingName }}</view>
            <u-icon
              name="arrow-right"
              color="#dddddd"
              class="table-ico-right"
            ></u-icon>
            <view class="list-table-page">{{ item.drawingPages + "页" }}</view>
          </view>
        </view>
      </view>
      <u-popup
        :show="flowShow"
        mode="bottom"
        @close="closeFlow"
        @open="openFlow"
        style=""
      >
        <div class="shut" style=""> <u-icon name="close" @click="closeFlow" style="margin-left: 95%;" color="#fff" class="head-ico"></u-icon></div>
        <!-- <view v-html="flowData" class="flow">

        </view> -->
        <view class="flows">
        <setApprover :arr="flowData.workflowNodeDTOS" ref="setApprover" :data="flowData" type="1" :forbidden="true"></setApprover>
        </view>
      </u-popup>
       <prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop>
    </u-popup>
  </view>
</template>

<script>
import prviewPop from '../../../components/prview-pop/prview-pop.vue'
import setApprover from "@/components/set-approver/set-approver.vue";
export default {
  components:{prviewPop,setApprover},
  data() {
    return {
      rowData: {},
      details: [],
      current: 0,
      editShow: false,
      contractDetails: {
        reItemDrawings: [],
      },
      flowShow: false,
      flowData:"",
      previewShow:false,
      previewUrl:""
    };
  },
  onLoad(item) {
    this.rowData = JSON.parse(item.row);
    this.init();
  },
  methods: {
    preview(item) {
      if(!item.drawingUrl){
        return uni.showToast({title:"该文件无法预览",icon:"none"})
      }
      this.page=item.beginPage?item.beginPage:1
      this.$checkName(item.drawingUrl,this.page)
      return
      
			this.previewUrl = item.drawingUrl;
			this.previewShow = true;
		},
    closePre(){
      this.previewShow = false;
    },
    closeFlow() {
      this.flowShow = false;
    },
    openFlow() {
      this.flowShow = true;
    },
    tableList(row) {
      uni.navigateTo({
        url: "/pages/productionSetting/drawingEdit?row=" + JSON.stringify(row),
      });
    },
    init() {
      let data = {}
      if(this.rowData.orgType != 5){
        data.fkOrgId = uni.getStorageSync('nowOrgId')
      }
      this.$api.searchItemWithDrawing(data).then((res) => {
        if (res.code == 200) {
        
          this.details = res.data;
          
        } else {
          uni.showToast({ icon: "none", title: res.msg });
        }
      });
    },

    itemClick(row) {
      this.contractDetails = row;
      this.editShow = true;
    },
    closeEdit() {
      this.editShow = false;
    },
    openEdit() {
      this.editShow = true;
    },
    flowChart() {
      uni.showLoading({ mask: true })
      this.$api
        .getFlowDiagramByItemId({ itemId: this.contractDetails.pkId })
        .then((res) => {
          uni.hideLoading()
          if (res.code == 200) {
            this.flowData = res.data
            this.flowShow = true
            // 
            this.$nextTick(()=>{
              this.$refs.setApprover.selectedUserType = false
            })
          } else {
            uni.showToast({ icon: "none", title: res.msg });
          }
        }).catch(err=>{
          uni.hideLoading()
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-box {
  .box-head {
    background: #175bcf;
    padding: 0px 10px;
    color: #fff;
    display: flex;
    line-height: 42px;
    .head-text {
      flex: 1;
    }
    .head-ico {
      flex: 1;
      text-align: right;
      display: contents;
    }
  }
  .item-edit-form {
    padding: 10px 16px;
  }
  .sheet-list-table {
    margin-top: 6px;
    padding: 8px 0px;
    background: #fff;
    margin: 6px 12px;
    position: relative;
    border-bottom: 1px solid #eee;
    .list-table-ico {
      display: inline-block;
      margin-left: 4px;
    }
    .list-table-text {
      display: inline-block;
    }
    .list-table-page {
      padding: 5px 40px;
      font-size: 10px;
      color: #a6aebc;
    }
    .table-ico-right {
      position: absolute;
      right: 12px;
      top: 18px;
    }
  }
}
.flow {
  max-height: 800rpx;
  overflow: auto;
  width: 750rpx;
}
.shut{
  background: #ccc;
    color: #fff;
    padding: 5px;
    text-align: right;
}
.flows{
  max-height: 60vh;
  overflow: auto;
}
</style>
