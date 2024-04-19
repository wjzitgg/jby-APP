<template>
    <view class="wrapper">
        <u-navbar leftText="转发文章" bgColor="rgb(0 0 0 / 0%)" leftIconColor="#fff" :autoBack="true"></u-navbar>
        <view class="content">
            <view>
                <view class="title">文章标题</view>
                <view class="inputs">
                    <u-input v-model="form.articleTitle" border="none" clearable maxlength="100"></u-input>

                </view>
            </view>
            <view>
                <view class="title">转发类型</view>
                <view class="inputs select" @click="openPicker">
                    <view class="name">{{ cusTypeName }}</view>
                    <u-icon name="arrow-down-fill" class="icons" color="#2a82e4" size="12"></u-icon>
                </view>
            </view>
            <view v-if="form.noticeType == 0 || form.noticeType == 4">
                <view class="title">{{ form.noticeType == 4 ? '转发单位' : '转发人员' }} <view class="choice" @click="choice">选择
                    </view>
                </view>
                <view class="participant">
                    <view class="participant-item" v-for="(item, idx) in selectList" :key="idx">{{
                        form.noticeType == 4 ? item.customName : item.userName }}
                        <u-icon name="close" class="ico-close" style="" color="red" @click="remove(idx)"></u-icon>
                    </view>
                </view>
            </view>

            <view v-if="form.noticeType == 1 || form.noticeType == 2">
                <view class="title">文章摘要</view>
                <view class="textarea">
                    <u-textarea style="background: #fff;" v-model="form.noticeAbstract" placeholder="请输入内容" maxlength="800"
                        border="none"></u-textarea>
                </view>
            </view>
            <view v-if="form.noticeType == 1 || form.noticeType == 2">
                <view class="title">APP轮播</view>
                <view class="textarea" style="position: relative;background: #fff;padding:26px 13px;">
                    <u-checkbox-group v-model="checkboxValue1" @change="checkboxChange">
                        <u-checkbox label="启用" :name='1'></u-checkbox>
                    </u-checkbox-group>
                </view>
            </view>
            <view v-if="form.noticeType == 1 || form.noticeType == 2">
                <view class="title">缩略图</view>
                <view class="textarea" style="position: relative;background: #fff;padding:26px 13px;">
                    <view v-if="form.rotationUrl !== ''">
                        <u--image :src="form.rotationUrl" mode="widthFix" width="160rpx" height="160rpx"></u--image>
                    </view>
                    <view v-else style="background: #f2f2f2;width: 250rpx;">
                        <!-- <u-icon name="plus" color="#ccc" style="margin-left: 50px;padding-top: 10px;" size="20px"></u-icon> -->
                        <lsj-upload ref="lsjUpload1" childId="upload2" :option="option" :size="size" :formats="formats"
                            :debug="debug" :count="10" :nowCount="fileList.length" :instantly="instantly" @change="onChange"
                            @progress="onprogress" style="margin-top: 10px; padding:6px" @uploadEnd="onuploadEnd">
                            <u-icon name="plus" color="#2979ff" size="26" style="margin-left: 45px;"></u-icon>
                            <!-- <view class="upload-btn" :style="{ width: width, height: height ,textAlign:'center',paddingLeft:'8px'}">上传缩略图</view> -->
                        </lsj-upload>
                    </view>
                </view>
            </view>
            <view v-if="form.noticeType == 3">
                <view class="title">会议场所</view>
                <view class="inputs">
                    <u-input v-model="form.meetingPlace" border="none" clearable maxlength="100"></u-input>
                </view>
            </view>
            <view v-if="form.noticeType == 3">
                <view class="title">会议主讲人</view>
                <view class="inputs">
                    <u-input v-model="form.speaker" border="none" clearable maxlength="50"></u-input>
                </view>
            </view>
            <view v-if="form.noticeType == 3">
                <view class="title">会议时间</view>
                <view class="inputs" style="display: flex;">
                    <view class="inputs-item" @click="dateShow = true">
                        <u-icon name="calendar" style="display: inline-block;"></u-icon>
                        {{ meetingStartTime }}
                    </view>
                    至
                    <view class="inputs-item" @click="endTimeShow = true">
                        <u-icon name="calendar" style="display: inline-block;"></u-icon>
                        {{ endTime }}
                    </view>
                </view>
            </view>

            <view v-if="form.noticeType == 3">
                <view class="title">参加人员 <view class="choice" @click="choice">选择</view>
                </view>
                <view class="participant">
                    <view class="participant-item" v-for="(item, idx) in selectList" :key="idx">{{
                        form.noticeType == 4 ? item.customName : item.userName }}
                        <u-icon name="close" class="ico-close" style="" color="red" @click="remove(idx)"></u-icon>
                    </view>
                </view>
            </view>
            <view>
                <view class="title" v-if="objData.enclosures != null && objData.enclosures.length != 0"
                    style="line-height: 20px;padding-left: 10px;">附件</view>
                <u-cell-group style="background: #fff">
                    <u-cell v-for="(item, idx) in objData.enclosures" :key="idx" @click="fileListPreview(item)"
                        :title="item.enclosureName" arrow-direction="left">
                        <u-icon slot="icon" name="file-text"></u-icon>
                    </u-cell>
                </u-cell-group>
            </view>
            <view>
                <view class="title">文章内容</view>
                <view class="textarea" style="position: relative;">
                    <!-- <edit :value="form.articleContent" ref="editRef" @editorChange="editorChange"></edit> -->
                    <editors style="" :content="form.articleContent" ref="editRef"></editors>
                </view>
            </view>

        </view>
        <view class="pdb"></view>
        <view class="footer">
            <view class="footerBtn add" style="margin-right: 1px;" @click="addOk(0)">保存草稿</view>
            <view class="footerBtn add" style="margin-left: 1px;" @click="addOk(1)">发布文章</view>
        </view>
        <u-picker title="请选择转发类型" :show="pickerShow" :columns="[cusTypeList]" keyName="name" @confirm="pickerConfirm"
            @cancel="pickerCancel"></u-picker>

        <!-- 2222222222 -->
        <u-modal :show="show2" title="提示" :content="promptContent" showCancelButton @cancel="show2 = false"
            @confirm="confirm"></u-modal>

        <u-popup :show="showPop" @close="closePop" mode="bottom" class="opo">
            <view class="popup">
                <view class="popup-search">
                    <view class="search-item">
                    </view>
                    <view class="search-item">
                    </view>
                    <view class="search-item">
                        <view class="footerBtnOne" @click="selectOk">确定</view>
                    </view>
                </view>
                <u-checkbox-group v-model="checkboxValue" placement="column">
                    <view class="table_detail" style="margin-top: 2px;">
                        <table>
                            <thead>
                                <tr>
                                    <th style="width:40px">选择</th>
                                    <th>{{ form.noticeType == 4 ? '单位名称' : '员工姓名' }}</th>
                                    <th>{{ form.noticeType == 4 ? '联系人' : '所属部分' }} </th>
                                    <th>{{ form.noticeType == 4 ? '联系电话' : '手机号码' }}</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in itemNameList" :key="index">
                                    <td><u-checkbox style="margin-left: 10px;" :label="''" :name="index"></u-checkbox></td>
                                    <td>{{ form.noticeType == 4 ? item.customName : item.userName }}</td>
                                    <td>{{ form.noticeType == 4 ? item.linkMan : item.deptName }}</td>
                                    <td>{{ form.noticeType == 4 ? item.linkPhone : item.telephone }}</td>
                                </tr>
                                <view v-if="itemNameList.length == 0" style="height: 60px;"></view>
                            </tbody>
                        </table>
                    </view>
                </u-checkbox-group>
            </view>
        </u-popup>
        <u-datetime-picker :show="dateShow" v-model="value1" mode="datetime" @cancel="dateCancel"
            @confirm="dateConfirm"></u-datetime-picker>
        <u-datetime-picker :show="endTimeShow" v-model="value3" mode="datetime" @cancel="endTimeCancel"
            @confirm="endTimeConfirm"></u-datetime-picker>


            <prviewPop :previewShow="previewShow" :previewUrl="previewUrl" @close="closePre"></prviewPop>
    </view>
</template>
  
<script>
import request from "@/common/request";
import edit from "@/components/xia-editor/xia-editor/xia-editor"
import editors from "@/components/editors/editors";
import prviewPop from '../../components/prview-pop/prview-pop.vue';
import moment from "moment";
export default {
    components: { edit,prviewPop,editors },
    onLoad(options) {
        this.objData = JSON.parse(options.obj);
        this.enableStatus = this.objData.enableStatus
        this.form.articleTitle = this.objData.articleTitle
        this.form.articleContent = this.objData.articleContent
    },
    data() {
        return {
            form: {
                articleTitle: "",
                articleContent: "",
                rotationUrl: ""
            },
            citeTypeList: [
                { label: "公司新闻", value: "0" },
                { label: "公司公告", value: "1" },
                { label: "公司会议", value: "2" },
            ],
            citeDataList: [],


            showPop: false,
            typeList: [],
            types: "",
            itemNameList: [],
            checkboxValue: [],
            selectList: [],
            dateShow: false,
            value1: "",
            meetingStartTime: "",
            value2: "",
            beginTime: "",
            endTimeShow: false,
            value3: "",
            endTime: "",
            type: "",

            optionForm: {
                deptId: "",
                keyWord: ""
            },



            enableStatus: "",
            show2: false,
            promptContent: "",

            checkboxValue1: [],
            // 基本案列数据
            checkboxList1: [{
                name: 'PC端',
                disabled: false,
                id: 0,
            },
            {
                name: 'APP端',
                disabled: false,
                id: 1,
            },
            ],
            //==============


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
            width: "190rpx",
            height: "40rpx",
            // 限制允许上传的格式，空串=不限制，默认为空
            formats: "",
            // 文件上传大小限制
            size: 30,
            // 是否打印日志
            debug: false,
            // ================ 


            // navBarTitle: "编辑会议",
            subList: [],
            tiltetype: "2",

            cusTypeList: [
                { id: 0, name: "指定人员" },
                { id: 4, name: "指定单位" },
                { id: 1, name: "公司新闻" },
                { id: 2, name: "公司公告" },
                { id: 3, name: "会议通知" },
            ],

            pickerShow: false,
            cusTypeName: "",

            subSelShow: false,
            objData: {},
            previewShow: false,
            previewUrl: ""
        };
    },
    methods: {
        fileListPreview(row) {
            this.previewUrl = row.enclosureUrl
            this.previewShow = true
        },
        closePre() {
            this.previewShow = false;
        },
        pickerConfirm(e) {
            console.log(e);
            if (e.value && e.value[0]) {
                console.log(e.value[0]);
                this.cusTypeName = e.value[0].name;
                this.form.noticeType = e.value[0].id;
            }
            this.selectList = []
            this.checkboxValue = []
            this.pickerShow = false;
        },
        pickerCancel() {
            this.pickerShow = false;
        },
        dateCancel() {
            this.dateShow = false
        },
        dateConfirm(e) {
            this.meetingStartTime = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
            this.dateShow = false;
        },
        remove(idx) {
            this.selectList.splice(idx, 1);
        },

        endTimeCancel() {
            this.endTimeShow = false
        },
        endTimeConfirm(e) {
            console.log(e)
            this.endTime = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
            // moment(e.value).format();
            this.endTimeShow = false
        },
        selectOk() {
            this.checkboxValue.forEach(item => {
                this.selectList.push(this.itemNameList[item])
            })
            console.log(this.selectList)
            this.selectList = this.unique(this.selectList)
            this.closePop();
        },
        unique(arr) {
            const res = new Map();
            return arr.filter(arr => !res.has(arr.pkId) && res.set(arr.pkId, 1));
        },
        choice() {
            this.showPop = true

            if (this.form.noticeType == 0 || this.form.noticeType == 3) {
                this.userSearch()
            } else {
                this.cooperationCompany()

            }

        },
        cooperationCompany() {
            this.$api.cooperationCompany({ pageNum: 1, pageSize: 100000 }).then(res => {
                if (res.code == 200) {
                    this.itemNameList = res.data.records
                } else {
                    uni.showToast({ title: res.msg, icon: "none" });
                }
            })
        },
        userSearch() {
            this.$api.userSearch({}).then(res => {
                if (res.code == 200) {
                    this.itemNameList = res.data
                } else {
                    uni.showToast({ title: res.msg, icon: "none" });
                }
            })
        },

        selectOne2(e) {
            console.log(e);
            this.types = e.options.label;
            this.optionForm.deptId = e.options.value;
            // this.userSearch()
            this.oaArticleQuoteArticle();
        },



        closePop() {
            this.showPop = false
        },

        checkboxChange(n) {
            console.log('change', n);
            this.checkboxValue1 = n
        },
        // 富文本内容
        editorChange(val) {
            // console.log(val)
            this.form.articleContent = val
        },

        onChange(e) {
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
                    let data = {
                        enclosureName: e.name,
                        enclosureUrl: res.data,
                    }
                    this.form.rotationUrl = res.data
                }
            }
        },

        cancel() {
            uni.navigateBack();
        },
        addOk(type) {
            this.form.articleContent = this.$refs.editRef.getText()
            if (!this.form.articleTitle) {
                uni.showToast({ title: "请填写文章主题", icon: "none" });
            }
            if (!this.form.articleContent) {
                uni.showToast({ title: "请填写文章内容", icon: "none" });
            }
            let data = {}
            data.articleContent = this.form.articleContent
            data.articleTitle = this.form.articleTitle
            data.enableStatus = type
            data.pkId = this.objData.pkId
            data.type = this.form.noticeType
            data.enclosures = this.objData.enclosures
            if (data.type == 0 || data.type == 3) {
                data.userIds = []
                if (this.selectList.length == 0) {
                    return uni.showToast({ title: "请选择人员", icon: "none" });
                } else {
                    this.selectList.forEach(item => {
                        data.userIds.push(item.pkId)
                    })
                }
            }
            if (data.type == 3) {
                data.meetingPlace = this.form.meetingPlace
                data.meetingStartTime = this.meetingStartTime
                data.meetingEndTime = this.endTime;
                data.speaker = this.form.speaker
            }
            if (data.type == 4) {
                data.articleReceives = []
                if (this.selectList.length == 0) {
                    console.log(data)
                    return uni.showToast({ title: "请选择接收单位", icon: "none" });
                } else {
                    this.selectList.forEach(item => {
                        data.articleReceives.push({ fkOrgId: item.pkId, customerName: item.customName })
                    })
                }



            }
            if (data.type == 1 || data.type == 2) {
                data.noticeAbstract = this.form.noticeAbstract
                data.publishing = this.checkboxValue1.length ? 0 : 1;
                if (this.form.rotationUrl.length != 0) {
                    data.rotationUrl = this.form.rotationUrl
                }
            }
            uni.showLoading({
                mask: true
            });
            this.$api
                .oaArticleForward(data)
                .then((res) => {
                    uni.hideLoading();
                    if (res.code === 200) {
                        // uni.showToast({ title: "转发成功" });
                        uni.showToast({ title: "操作成功" });
                        setTimeout(() => {
                            let pages = getCurrentPages()
                            let prevPage = pages[pages.length - 3]; // 上一页面实例
                            prevPage.$vm.resh() // 调用上一页 定义的方法
                            uni.navigateBack({ delta: 2 });
                        }, 500)

                    } else {
                        uni.showToast({ title: res.msg, icon: "none" });
                    }
                })
                .catch((err) => {
                    uni.hideLoading();
                });

        },
        delSub(row, idx) {
            console.log(row, idx);
            this.subList = this.subList.filter((item) => item.pkId !== row.pkId);
        },
        openPicker() {
            this.pickerShow = true;
        },



    },
};
</script>
  
<style lang="scss" scoped>
.content {
    font-size: 28rpx;
}

.title {
    padding-left: 20rpx;
    font-size: 28rpx;
    font-weight: 600;
    margin: 10rpx 0;
}

.inputs {
    display: flex;
    align-items: center;
    height: 80rpx;
    padding: 0 20rpx;
    background-color: #fff;
    margin-bottom: 20rpx;

    .inputs-item {
        flex: 1;
        height: 25px;
        border: 1px solid #eee;
        line-height: 25px;
    }
}

.participant {
    height: 110px;
    padding: 0 20rpx;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    background-color: #fff;

    .participant-item {
        position: relative;
        background: #f3f3f3;
        margin: 2px;
        // padding: 8px 15px;
        line-height: 22px;
        height: 22px;
        display: inline-block;
        padding-right: 18px;

        .ico-close {
            position: absolute;
            right: 0;
            top: 0;
        }
    }
}

.select {
    justify-content: space-between;
}

.subList {
    overflow: auto;
    max-height: 350rpx;
    background-color: #fff;

    .subList-item {
        display: flex;
        justify-content: space-around;
        height: 80rpx;
        padding: 0 20rpx;
        border-bottom: 1px solid #eee;

        .name {
            width: 580rpx;
            height: 80rpx;
            line-height: 80rpx;
            overflow: hidden;
            /*超出部分隐藏*/
            white-space: nowrap;
            /*禁⽌换⾏*/
            text-overflow: ellipsis;
            /*省略号*/
        }
    }
}



.pdb {
    height: 100rpx;
}

.footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    height: 100rpx;

    .footerBtn {
        width: 375rpx;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
    }

    .footerBtnOne {
        width: 100%;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
    }

    .cancel {
        background-color: #eeeeee;
        color: #aaaaaa;
    }

    .add {
        background-color: #1576e6;
        color: #fff;
    }

    .error {
        background-color: red;
        color: #fff;
    }


}

.popup {
    background: #fff;
    padding-top: 6px;

    .popup-search {
        display: flex;
        // display: flex;
        align-items: center;
        height: 80rpx;
        padding-top: 20px;
        // background: #fff !important;
        // padding-top: 20px !important;

        .search-item {
            flex: 1;
            padding: 0 10rpx;

            // background-color: #fff;
            /deep/ .u-input--square {
                padding: 3px 8px !important;
            }

            .footerBtnOne {
                width: 100rpx;
                height: 55rpx;
                line-height: 55rpx;
                text-align: center;
                background-color: #1576e6;
                color: #fff;
                border-radius: 5px;
            }
        }

        .easySelect {
            /deep/.uni-input-wrapper {
                .uni-input-input {
                    font-size: 28rpx;
                }
            }
        }
    }

    .table_detail {
        margin-top: 10px !important;
    }
}

.choice {
    // width: 55rpx;
    // height: 35rpx;
    // line-height: 35rpx;
    padding: 6px;
    margin-left: 6px;
    display: inline-block;
    text-align: center;
    background-color: #1576e6;
    color: #fff;
    border-radius: 5px;

}
</style>
  