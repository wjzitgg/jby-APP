<template>
  <!-- 预览 -->
	<u-popup :show="previewShow" mode="center" round="10" closeable @close="closePreview">
		<view class="preview">
			<view class="preview-top">预览</view>
			<pdf :fileUrl="previewUrl" :iframeStyle="{ width: '700rpx', height: '1080rpx' }" :imgs="false" :page="page"></pdf>
		</view>
	</u-popup>
</template>

<script>
import pdf from '../pdf-preview.vue';
export default {
    components:{pdf},
    props:{
        previewShow: {type:Boolean,default:false},
		previewUrl: '',
		page:{
			type:Number,
			default:1
		}
    },
    methods:{
        closePreview(){
            this.$emit('close')
        },
    }
}
</script>

<style lang="scss" scoped>
.preview {
	width: 700rpx;
	height: 1200rpx;
	overflow: hidden;
	.preview-top {
		height: 100rpx;
		line-height: 100rpx;
		padding-left: 40rpx;
	}
}
</style>