<template>
  <web-view :src="urls" />
</template>

<script>
import request from "../../common/request";
export default {
    onLoad(options) {
        let url =request.h5Url+`/h5/#/pages/previewPage/previewPage?page=${options.page?options.page:1}&url=${options.url}`
        if(options.title){
            url+=`&title=${options.title}`
        }
        this.urls=url
    },
    data(){
        return{
            urls:""
        }
    }
}
</script>

<style>

</style>