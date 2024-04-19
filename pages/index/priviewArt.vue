<template>
    <view class="wrapper">
        <u-navbar leftText="文章信息" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
        <view class="content">
            <view>
                <h1 style="text-align: center;">{{ editData.noticeTitle }}</h1>
                <view class="details">
                    <view style="margin-right:6rpx">发布人： {{ editData.userName }}</view>
                    <view>发布时间： {{ editData.sendingTime }}</view>
                </view>
                <view style=" margin-top: 20px;" v-if="state">
                    <u-parse :content="editData.noticeContent"></u-parse>
                </view>
            </view>
        </view>
        <prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop>
    </view>
</template>
  
<script>
import request from "@/common/request";
import prviewPop from '../../components/prview-pop/prview-pop.vue';
import edit from "@/components/xia-editor/xia-editor/xia-editor"
import moment from "moment";
export default {
    components: { edit ,prviewPop},
    onLoad(options) {
        this.pkId = options.pkId
        this.oaMeetingFindById(this.pkId)
    },
    data() {
        return {
            pkId:"",
            editData: {

            },
            state: false,
            previewShow: false,
            previewUrl: ""
        };
    },
    methods: {
        fileListPreview(row) {
            this.$checkName(row.enclosureUrl)
            return
            this.previewUrl = row.enclosureUrl
            this.previewShow = true
        },
        closePre() {
            this.previewShow = false;
        },
        // 详情
        oaMeetingFindById(pkId) {
            this.$api.oaNoticeFindById({ pkId }).then(res => {
                if (res.code == 200) {
                    this.editData = res.data
                    this.state = true
                } else {
                    uni.showToast({ title: res.msg, icon: "none" });
                }
            })
        },

        // 富文本内容
        editorChange(val) {
            // console.log(val)
            this.editData.meetingContent = val
        },
        transmit() {
            uni.navigateTo({ url: '/pages/assess/forwardTheArticle?type=1&obj=' + JSON.stringify(this.editData) })
        }
        // forwardTheArticle


    },
};
</script>
  
<style lang="scss" scoped>
.content {
    padding-top: 20rpx;
    font-size: 28rpx;
}

/deep/ .toolbar {

    display: none;
}
.details{
    display: flex;
    justify-content: end;
    font-size: 24rpx;
    color: #ccc
}
</style>
  