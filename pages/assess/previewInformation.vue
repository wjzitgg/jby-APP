<template>
    <view class="wrapper">
        <u-navbar :leftText="navBarTitle" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
        <view class="content">
            <view>
                <view style="text-align: center;">{{ editData.articleTitle }}</view>
                <view style="position: relative;">
                    <view style="position: absolute;right: 12px;">发布人： {{ editData.userName }}</view>
                </view>
                <view style=" margin-top: 20px;" v-if="state">
                    <edit :value="editData.articleContent" :readOnly="true" ref="editRef" @editorChange="editorChange">
                    </edit>
                </view>
                <view>
                    <view class="title" v-if="editData.enclosures != null && editData.enclosures.length != 0" style="line-height: 20px;padding-left: 10px;">附件</view>
                    <u-cell-group style="background: #fff" >
                        <u-cell v-for="(item, idx) in editData.enclosures" :key="idx" @click="fileListPreview(item)" :title="item.enclosureName" arrow-direction="left">
                            <u-icon slot="icon" name="file-text"></u-icon>
                        </u-cell>
                    </u-cell-group>
                </view>

            </view>
        </view>
        <view class="footer">
            <view class="btn" v-if="editData.enableStatus == 4 && $auth('assess:receive:forward')" @click="transmit">转发
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

        this.type = options.type
        if (options.type == 0) {
            //     this.navBarTitle = "新增会议"
        } else if (options.type == 1) {
            this.navBarTitle = "收文信息"
            let obj = JSON.parse(options.obj);
            console.log(obj)
            // this.enableStatus = obj.enableStatus
            this.oaMeetingFindById(obj.pkId)
            this.state = false
        }

    },
    data() {
        return {
            navBarTitle: "",
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
            this.$api.oaArticleFindById({ pkId }).then(res => {
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
</style>
  