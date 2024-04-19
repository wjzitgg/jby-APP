<template>
  <view class="search-list" v-if="tagList.length">
    <view class="search-tag" v-for="(item,idx) in tagList" :key="item.key + idx">
        {{item.value}}
        <view class="close-tag" @click="closeTag(item)">X</view>
    </view>
  </view>
</template>

<script>
export default {
    computed:{
        showTagList(){
            let arr =[]
            tagList.forEach(item=>{
                // 多选情况
                if(item.mode=='multiple'){
                   arr=[...arr,...item.value.map(item2=>({...item,value:item2}))] 
                }else{
                   arr.push(item)
                }
            })
            return arr
        }
    },
    props:{
        // 传入格式：[{key:"",value:""}],key:为页面筛选条件参数，value为对应的文字
        tagList:{
            type:Array,
            default:()=>{return []}
        }
    },
    methods:{
        closeTag(item){
            this.$emit("closeTag",item)
        }
    }
}
</script>

<style lang="scss" scoped>
.search-list{
    display: flex;
    width: 750rpx;
    height: 62rpx;
    background-color: #fff;
    overflow: auto;
    padding: 0 40rpx;
    .search-tag{
        display: flex;
        align-items: center;
        height: 48rpx;
        margin-top: 14rpx;
        margin-right: 8rpx;
        padding: 6rpx 52rpx 6rpx 32rpx;
        background-color: #eeeeee;
        position: relative;
        font-size: 24rpx;
        border-radius: 40rpx;
        color: #999999;
        *{
            color: inherit;
        }
        .close-tag{
            position: absolute;
            right: 20rpx;
            z-index: 1;
        }
    }
}
</style>