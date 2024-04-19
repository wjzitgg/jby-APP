<template>
  <view class="wrapper addPageBg">
    <u-navbar leftText="绑定关联" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
    <searchInput placeholder="请输入手机号" @search="searchLinkList" :focus="searchFocus" v-model="linkPhone" type="number" maxlength="11"></searchInput>
    <view class="search-result" v-if="emptyShow">搜索结果</view>
    <view class="searchList" v-if="linkList.length">
        <view class="searchList-item" v-for="item in linkList" :key="item.pkId">
            <u-icon name="../../static/image/superior.png" class="iconfont" size="20"></u-icon>
            <view class="searchList-item-right">
                <view class="orgName">{{item.orgName}}</view>
                <view class="orgType">{{orgTypeList[item.orgType]}}</view>
                <view class="linkBtn" @click="updateRelationById(item.pkId)">绑定</view>
            </view>
        </view>
    </view>
    <view class="searchList" v-else-if="emptyShow">
        <u-empty mode="data" text="暂无数据" icon="/static/image/noData.png"> </u-empty>
    </view>
  </view>
</template>

<script>
import searchInput from '../../components/search-tag/search-input.vue';
export default {
    components:{searchInput},
    onLoad(options) {
        this.pkId=options.pkId
        this.orgType=options.orgType - 0
        this.searchFocus=true
    },
    data(){
        return{
            pkId:"",
            linkPhone:"",
            orgType:"",
            linkList:[],
            orgTypeList: ["系统运营商", "系统代理商", "建设单位", "监理公司", "施工单位", "项目部", "供应商", "分包商", "劳务工人", "设计院"],
            emptyShow:false,
            searchFocus:false
        }
    },
    methods:{
        resh(){
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]; // 上一页面实例
            prevPage.$vm.resh() // 调用上一页 定义的方法
        },
        searchLinkList() {
			let data = {
				linkPhone: this.linkPhone,
				orgType: this.orgType
			};
			this.loading = true;
			this.$api.searchOrgLinkPhone(data).then(res => {
				this.loading = false;
				if (res.code === 200) {
                    this.emptyShow=true
					this.linkList = res.data;
				} else {
					uni.showToast({ title: res.msg, icon: "none" });
				}
			}).catch(err => {
				this.loading = false;
			});
		},
        updateRelationById(orgId) {
			uni.showLoading({ mask: true });
			this.$api.updateRelationById({ pkId:this.pkId, orgId }).then(res => {
				uni.hideLoading();
				if (res.code === 200) {
                    this.resh()
					uni.navigateBack({ delta: 1 })
                    setTimeout(()=>{
                        uni.showToast({ title: "绑定成功" });
                    })
				} else {
					uni.showToast({ title: res.msg, icon: "none" });
				}
			}).catch(err => {
				uni.hideLoading();
			});
		},
    }
}
</script>

<style lang="scss" scoped>
.search-result{
    height: 120rpx;
    padding-top: 40rpx;
    padding-left: 24rpx;
    font-size: 36rpx;
    font-weight: 700;
}
.searchList{
    /*#ifdef APP-PLUS*/
	height: calc(100vh - 414rpx);
	/*#endif*/
	/*#ifdef H5*/
  	height: calc(100vh - 346rpx);
	/*#endif*/
    overflow: hidden auto;
    .searchList-item{
        position: relative;
        display: flex;
        width: 750rpx;
        height: 140rpx;
        padding: 24rpx;
        padding-bottom: 0;
        padding-right: 0;
        .u-icon{
            align-items: flex-start;
            margin-right: 16rpx;
        }
        .searchList-item-right{
            width: 670rpx;
            border-bottom: 1px solid #eeeeee;;
            .orgName{
                width: 500rpx;
                margin-bottom: 8rpx;
                line-height: 36rpx;
                font-size: 28rpx;
                font-weight: 700;
                overflow: hidden; /*超出部分隐藏*/
    		    white-space: nowrap; /*禁⽌换⾏*/
    		    text-overflow: ellipsis; /*省略号*/
            }
            .orgType{
                line-height: 36rpx;
                font-size: 24rpx;
                opacity: 0.6;
            }
        }
        .linkBtn{
            position: absolute;
            right: 24rpx;
            top: 24rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 120rpx;
            height: 48rpx;
            color: #fff;
            border-radius: 4rpx;
            font-size: 24rpx;
            background: rgba(0, 122, 254, 1);
        }
    }
}
</style>