<template>
  <view class="wrapper">
    <u-navbar
      leftText="客户信息"
      bgColor="rgb(0 0 0 / 0%)"
      leftIconColor="#fff"
      :autoBack="true"
    ></u-navbar>
    <view class="sticky">
        <u-tabs class="tabList" :list="tabList" :current="current" @change="currentChange" :scrollable="true" :activeStyle="{color: 'rgba(32, 52, 87, 1)'}" :inactiveStyle="{color: 'rgba(32, 52, 87, 0.6)'}" > </u-tabs>
      <view class="search">
            <view class="left">
                <easy-select ref="easySelect2" size="mini" class="easySelect" :value="proName" @selectOne="selectOne" :options="proList"></easy-select>
            </view>
            <view class="right">
                <searchInput placeholder="请输入关键字" v-model="name" maxlength="25" @search="search"></searchInput>
            </view>
        </view>
    </view>
    <view class="pad"></view>
    <view class="content">
      <view class="item" v-for="item in showList" :key="item.pkId" @click="openPop(item)" >
        <u-icon name="/static/image/superior.png" class="iconfont" size="20"></u-icon>
        <view class="item-content">
          <view class="nameAndLink">
            <view class="name">{{ item.customName }}</view>
            <view class="tag" :class="{ 'tag-link': !!item.relationStatus, 'tag-nolink': !item.relationStatus, }" >{{ !!item.relationStatus ? "已关联" : "未关联" }}</view >
          </view>
          <view class="types">负责人：{{ item.linkMan }}</view>
        </view>
      </view>
    </view>
    <u-popup :show="showPop" :round="10">
      <view class="popup detil-pop">
        <view class="detil-pop-head">
          <view class="name">{{ nowClick.customName }}</view>
          <u-icon name="close" color="rgba(170, 170, 170, 1)" class="closeBtn" @click="closePop" ></u-icon>
        </view>
        <view class="detil-pop-content">
          <tableForm :pageHeight="false" :pageMr="false" :list="[
          {name:'项目名称',value:nowClick.fkProjectName,show:true},
          {name:'标段项目',value:nowClick.fkProjectBidName,show:true},
          {name:'联系人',value:nowClick.linkMan,show:true},
          {name:'联系电话',value:nowClick.linkPhone,show:true},
          {name:'关联状态',value:nowClick.relationStatusStr,show:true},
          {name:'备注',value:nowClick.remark,show:true},
          ]">
          </tableForm>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import tableForm from '../../components/table-form/table-form.vue';
import searchInput from '../../components/search-tag/search-input.vue';
export default {
  components:{tableForm,searchInput},
  onShow() {
    
  },
  computed: {
    	user() {
    	  return uni.getStorageSync("user") ? uni.getStorageSync("user") : {};
    	},
  	},
  onLoad(options) {
    if(this.user.orgType == 9 || this.user.orgType == 3){
      this.tabList=[{name:"项目部",customType:2},{name:"建设单位子公司",customType:0}]
      this.customType=2
    }else{
      this.tabList=[{name:"设计院",customType:5},{name:"监理单位",customType:1},{name:"项目部",customType:2}]
      this.customType=5
    }
    this.searchCustom();
    this.searchProject()
  },
  data() {
    return {
      tabList:[{name:"设计院",customType:5},{name:"监理单位",customType:1},{name:"项目部",customType:2}],
      current:0,
      customType:5,
      showPop: false,
      remark: "",
      name: "",
      searchName:"",
      list: [],
      showList: [],
      customTypeList:['建设单位' , '监理公司' , '项目部' ,'供应商' ,'分包商' ,'设计院'],
      orgTypeList: [ "系统运营商", "系统代理商", "建设单位", "监理公司", "施工单位", "项目部", "供应商", "分包商", "劳务工人", "设计院" ],
      nowClick: {},
      loading: false,
      linkList: [],
      linkPhone: "",
      showLinkMod2:false,
      proId:"",
      proName:"全部项目",
      proList:[{label:"全部项目",value:""}]
    };
  },
  methods: {
    searchProject(){
      this.$api.searchProject().then(res=>{
        if(res.code===200){
          this.proList=[{label:"全部项目",value:""},...res.data.map(item=>({...item,value:item.pkId,label:item.projectName}))]
        }else{
          uni.showToast({ title: res.msg, icon:'none' })
        }
      })
    },
    selectOne(e) {
      this.proName = e.options.label;
      this.proId = e.options.value;
      this.searchCustom()
    },
    search(){
        this.searchName = this.name
        this.searchCustom()
    },
    currentChange(item){
        this.current=item.index
        this.customType = item.customType
        this.searchCustom()
    },
    resh(){
		this.closePop();
		this.searchCustom()
	},
    searchCustom() {
      let data ={
        customType:this.customType,
        customName:this.searchName,
        projectId:this.proId
      }
      this.$api.searchCustom(data).then((res) => {
        if (res.code === 200) {
          this.list = res.data;
          this.showList = res.data;
        } else {
         uni.showToast({ title: res.msg,icon:'none' });
        }
      });
    },
    updateRelationById(pkId, orgId) {
      uni.showLoading({ mask: true });
      this.$api
        .updateRelationById({ pkId, orgId })
        .then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            if (orgId) {
              uni.showToast({ title: "绑定成功" });
              this.searchCustom()
              this.closeLinkMod2();
              this.closePop();
            } else {
              uni.showToast({ title: "解绑成功" });
              this.searchCustom()
              this.closeLinkMod();
              this.closePop();
            }
          } else {
           uni.showToast({ title: res.msg,icon:'none' });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    go(type) {
      let url = `/pages/custom/detail?tiltetype=2&type=${type}`;
      if (type === 2) {
        url = url + `&obj=${JSON.stringify(this.nowClick)}`;
      }
      uni.navigateTo({ url });
      this.closePop();
    },
    openPop(item) {
      this.$api.findCustomById({pkId:item.pkId}).then(res=>{
        if(res.code==200){
          this.nowClick = res.data;
          this.showPop = true;
        }else{
           uni.showToast({ title: res.msg, icon:'none' })
        }
      })
    },
    closePop() {
      this.showPop = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.sticky {
  background-color: #fff;
  padding: 0 20rpx;
  .search {
    display: flex;
    align-items: center;
    .left{
        width: 280rpx;
        // margin-right: 8rpx;
    }
    .right{
        flex: 1;
    }
  }
}
/deep/ .easy-select {
  height: 72rpx;
}
.pad {
  height: 208rpx;
}
.item {
  display: flex;
  align-items: start;
  padding: 30rpx 20rpx;
  background-color: #fff;
  margin-bottom: 10rpx;
  .iconfont {
    width: 60rpx;
  }
  .item-content {
    width: 550rpx;
    .nameAndLink{
      display: flex;
      align-items: center;
      height: 50rpx;
    }
    .name {
      max-width: 550rpx;
      // margin-bottom: 20rpx;
      font-size: 30rpx;
      font-weight: 600;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*禁⽌换⾏*/
      text-overflow: ellipsis; /*省略号*/
    }
    .types {
      font-size: 24rpx;
      color: #a6aebc;
    }
  }
  .tag {
    width: 100rpx;
    padding: 10rpx;
    margin-left: 6rpx;
    font-size: 24rpx;
    text-align: center;
  }
  .tag-link {
    color: #2a82e4;
    background-color: #d9f4ff;
  }
  .tag-nolink {
    color: #aaaaaa;
    background-color: #eeeeee;
  }
  .linkBtn {
    width: 100rpx;
    height: 74rpx;
    line-height: 74rpx;
    text-align: center;
    background-color: #d4e6fa;
    color: #2a82e4;
  }
}
.pdb {
  height: 100rpx;
}
.popup {
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 110rpx;
    background-color: #fff;
    .btns {
      width: 220rpx;
      margin: 0;
    }
    .cancle {
      background-color: #eeeeee;
      color: #aaaaaa;
    }
  }
}
.showLinkPop {
  height: 800rpx;
  background-color: #2a82e4;
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    // line-height: 80rpx;
    padding: 0 20rpx;
    color: #fff;
    font-size: 28rpx;
  }
  .content {
    height: 620rpx;
    background-color: #f7f7ff;
    padding-top: 30rpx;
    font-size: 28rpx;
    border-radius: 20rpx 20rpx 0 0;
    .title {
      padding-left: 20rpx;
      font-weight: 600;
      margin-bottom: 10rpx;
    }
    .inputs {
      display: flex;
      align-items: center;
      height: 80rpx;
      padding: 0 20rpx;
      background-color: #fff;
      margin-bottom: 20rpx;
    }
    .searchRes {
      overflow: auto;
      height: 400rpx;
      background-color: #fff;
    }
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .footer {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 100rpx;
    background-color: #fff;
    .btns {
      width: 300rpx;
    }
    .cancle {
      background-color: #eeeeee;
      color: #aaaaaa;
    }
  }
}
</style>
